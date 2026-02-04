import { serve } from "bun";
import { join } from "path";
import { transformSync } from "esbuild";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";
import { CORE_DEPENDENCIES, generateLinkHeader } from "./packages/core/preloader";
import { rewriteModuleSpecifiers } from "./server-utils";

// ===== パフォーマンス最適化: キャッシュ設定 =====

// グローバルTranspilerインスタンス（再利用してオーバーヘッド削減）
type TranspilerLike = { transformSync: (content: string) => string };

const globalTranspiler: TranspilerLike = new Bun.Transpiler({
  loader: "ts",
  target: "browser"
});

const minifyTsTranspiler: TranspilerLike = {
  transformSync: (content: string) =>
    transformSync(content, {
      loader: "ts",
      minify: true,
      format: "esm",
      target: "es2020"
    }).code,
};

const minifyJsTranspiler: TranspilerLike = {
  transformSync: (content: string) =>
    transformSync(content, {
      loader: "js",
      minify: true,
      format: "esm",
      target: "es2020"
    }).code,
};

// トランスパイルキャッシュ（ファイルパス → { content, mtime }）
const transpileCache = new Map<string, { content: string; mtime: number }>();
const minifyTranspileCache = new Map<string, { content: string; mtime: number }>();

// ファイル解決キャッシュ（タイムスタンプ付き）
const fileResolutionCache = new Map<string, { value: string; timestamp: number }>();
const RESOLUTION_CACHE_TTL = 30000; // 30秒
const CACHE_CLEANUP_INTERVAL = 10000; // 10秒ごとにクリーンアップ

// 定期的なキャッシュクリーンアップ（高負荷時のsetTimeout乱立を防止）
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of fileResolutionCache) {
    if (now - entry.timestamp > RESOLUTION_CACHE_TTL) {
      fileResolutionCache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

// ===== ユーティリティ関数 =====

// パスに拡張子がないかチェック
function hasNoExtension(path: string): boolean {
  const basename = path.split('/').pop() || '';
  if (!basename.includes('.')) return true;
  const ext = basename.split('.').pop();
  return !ext;
}

function hasRefererQuery(req: Request, key: string, value = '1'): boolean {
  const referer = req.headers.get('referer');
  if (!referer) return false;
  try {
    const refUrl = new URL(referer);
    return refUrl.searchParams.get(key) === value;
  } catch {
    return false;
  }
}

function getCookieValue(req: Request, name: string): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const parts = cookie.split(';');
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) continue;
    if (rawKey === name) return rest.join('=');
  }
  return null;
}

function isCompressibleContentType(contentType: string): boolean {
  return (
    contentType.startsWith('text/') ||
    contentType === 'application/javascript' ||
    contentType === 'application/json'
  );
}

function chooseCompression(req: Request): 'br' | 'gzip' | null {
  const accept = req.headers.get('accept-encoding') ?? '';
  if (accept.includes('br')) return 'br';
  if (accept.includes('gzip')) return 'gzip';
  return null;
}

function compressBody(body: string | Uint8Array, encoding: 'br' | 'gzip'): Uint8Array {
  const buffer = typeof body === 'string' ? Buffer.from(body) : Buffer.from(body);
  if (encoding === 'br') {
    return brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    });
  }
  return gzipSync(buffer);
}

function respondWithOptionalCompression(
  body: string | Uint8Array,
  headers: Record<string, string>,
  req: Request,
  shouldCompress: boolean
): Response {
  if (shouldCompress) {
    const encoding = chooseCompression(req);
    if (encoding) {
      const compressed = compressBody(body, encoding);
      headers["Content-Encoding"] = encoding;
      headers["Vary"] = "Accept-Encoding";
      return new Response(compressed, { headers });
    }
  }
  return new Response(body, { headers });
}

function getRequestFlags(
  url: URL,
  req: Request
): { shouldMinify: boolean; shouldCompress: boolean; compressParam: string | null } {
  const compressParam = url.searchParams.get('compress');
  const shouldMinify = url.searchParams.get('min') === '1';
  const shouldCompress = compressParam === '1';
  return { shouldMinify, shouldCompress, compressParam };
}

// fetch ハンドラー
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let path = url.pathname;
  const { shouldMinify, shouldCompress, compressParam } = getRequestFlags(url, req);

  // favicon.ico は 204 No Content を返す
  if (path === "/favicon.ico") {
    return new Response(null, { status: 204 });
  }

  // ルートの場合は viewer.html を返す
  if (path === "/") {
    path = "/viewer.html";
  }

  // ESモジュール同一性のため、拡張子なしの.js/.tsインポートは.jsにリダイレクト
  // これにより /core/web-components と /core/web-components.js が同じモジュールになる
  if (hasNoExtension(path) && !path.endsWith('.html')) {
    const redirectPath = path + '.js';
    console.log(`Redirecting: ${path} -> ${redirectPath}`);
    return Response.redirect(new URL(redirectPath, url.origin).href, 302);
  }

  // ファイルパスを構築
  const filePath = await resolveFilePath(path);

  console.log(`Request: ${path} -> ${filePath}`);

  try {
    // ファイルの拡張子からMIMEタイプを決定
    const ext = filePath.split('.').pop();
    let contentType = "text/plain";

    switch (ext) {
      case "html":
        contentType = "text/html";
        break;
      case "js":
      case "mjs":
        contentType = "application/javascript";
        if (shouldMinify) {
          if (!(await fileExists(filePath))) {
            console.error(`File not found: ${path} -> ${filePath}`);
            return new Response(`File not found: ${path}`, {
              status: 404,
              headers: { "Content-Type": "text/plain" }
            });
          }
          try {
            const { content, mtime } = await transpileWithCache(
              filePath,
              minifyJsTranspiler,
              minifyTranspileCache
            );
            const rewritten = rewriteModuleSpecifiers(content);
            const cacheControl = path.startsWith('/@components/') || path.startsWith('/components/') || path.startsWith('/src/')
              ? "no-cache, must-revalidate"
              : "public, max-age=31536000, immutable";

            const headers: Record<string, string> = {
              "Content-Type": "application/javascript",
              "Cache-Control": cacheControl,
              "ETag": mtime.toString(16)
            };
            return respondWithOptionalCompression(rewritten, headers, req, shouldCompress);
          } catch (error) {
            const err = error as Error;
            console.error(`Transpilation error for ${filePath}:`, error);
            return new Response(`// Transpilation error: ${err.message}`, {
              status: 500,
              headers: { "Content-Type": "application/javascript" }
            });
          }
        }
        break;
      case "ts":
        // TypeScriptファイルは存在チェック後にキャッシュ付きトランスパイル
        if (!(await fileExists(filePath))) {
          console.error(`File not found: ${path} -> ${filePath}`);
          return new Response(`File not found: ${path}`, {
            status: 404,
            headers: { "Content-Type": "text/plain" }
          });
        }
        try {
          const { content, mtime } = await transpileWithCache(
            filePath,
            shouldMinify ? minifyTsTranspiler : globalTranspiler,
            shouldMinify ? minifyTranspileCache : transpileCache
          );
          const rewritten = shouldMinify ? rewriteModuleSpecifiers(content) : content;
          const shouldNoCache =
            path.startsWith('/@components/') || path.startsWith('/components/') || path.startsWith('/src/');
          const cacheControl = shouldNoCache
            ? "no-cache, must-revalidate"
            : "public, max-age=31536000, immutable";

          const headers: Record<string, string> = {
            "Content-Type": "application/javascript",
            "Cache-Control": cacheControl,
            "ETag": mtime.toString(16)
          };
          return respondWithOptionalCompression(rewritten, headers, req, shouldCompress);
        } catch (error) {
          const err = error as Error;
          console.error(`Transpilation error for ${filePath}:`, error);
          return new Response(`// Transpilation error: ${err.message}`, {
            status: 500,
            headers: { "Content-Type": "application/javascript" }
          });
        }
      case "css":
        contentType = "text/css";
        break;
      case "json":
        contentType = "application/json";
        break;
    }

    // ファイルを読み込んで返す
    const file = Bun.file(filePath);

    // ファイルが存在するかチェック（Bun.file は遅延評価のため明示的にチェック）
    if (!(await fileExists(filePath))) {
      console.error(`File not found: ${path} -> ${filePath}`);
      return new Response(`File not found: ${path}`, {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      });
    }

    // キャッシュヘッダーを設定（JS/CSS は長期キャッシュ、HTML は短期）
    const cacheControl = path === '/sw.js' || ext === 'html'
      ? "no-cache, must-revalidate"
      : "public, max-age=31536000, immutable";

    // HTMLの場合はHTTP/2 Server Push用のLinkヘッダーを追加
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": cacheControl
    };

    if (ext === 'html') {
      headers["Link"] = generateLinkHeader();
      console.log('[HTTP/2] Adding Link header for preload');
    }

    if (ext === 'html') {
      headers["Cache-Control"] = "no-cache, must-revalidate";
    }

    if (shouldCompress && isCompressibleContentType(contentType)) {
      const encoding = chooseCompression(req);
      if (encoding) {
        const body = new Uint8Array(await file.arrayBuffer());
        const compressed = compressBody(body, encoding);
        headers["Content-Encoding"] = encoding;
        headers["Vary"] = "Accept-Encoding";
        return new Response(compressed, { headers });
      }
    }
    return new Response(file, { headers });

  } catch (error) {
    // エラーの場合は詳細なエラーメッセージを返す
    const err = error as { code?: string };
    console.error(`GET - ${path} failed:`, err.code || error);

    // ENOENT（ファイルが存在しない）は404
    if (err.code === 'ENOENT') {
      return new Response(`File not found: ${path}`, {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      });
    }

    // その他のエラーは500
    return new Response(`Internal server error: ${path}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

// ファイルが存在するかチェック（空ファイルもtrue）
async function fileExists(path: string): Promise<boolean> {
  try {
    const file = Bun.file(path);
    await file.stat();
    return true;
  } catch {
    return false;
  }
}

// トランスパイル結果をキャッシュして返す（mtime変更時のみ再トランスパイル）
async function transpileWithCache(
  filePath: string,
  transpiler: TranspilerLike,
  cache: Map<string, { content: string; mtime: number }>
): Promise<{ content: string; mtime: number }> {
  const file = Bun.file(filePath);
  const stat = await file.stat();
  const cached = cache.get(filePath);

  // mtimeが同じならキャッシュを返す
  if (cached && cached.mtime === stat.mtimeMs) {
    console.log(`[Cache HIT] ${filePath}`);
    return cached;
  }

  // トランスパイル実行
  console.log(`[Cache MISS] Transpiling: ${filePath}`);
  const content = await file.text();
  const transpiled = transpiler.transformSync(content);

  // キャッシュに保存
  const result = { content: transpiled, mtime: stat.mtimeMs };
  cache.set(filePath, result);

  return result;
}

// 拡張子を解決（.js -> .ts、拡張子なし -> .ts/.js）+ キャッシュ + 並列化
async function resolveExtension(filePath: string): Promise<string> {
  // キャッシュチェック（TTL検証）
  const cached = fileResolutionCache.get(filePath);
  if (cached && Date.now() - cached.timestamp <= RESOLUTION_CACHE_TTL) {
    return cached.value;
  }

  // .js -> .ts 変換の場合
  if (filePath.endsWith('.js')) {
    const tsPath = filePath.replace(/\.js$/, '.ts');
    const jsPath = filePath;

    // 並列でチェック
    const [tsExists, jsExists] = await Promise.all([
      fileExists(tsPath),
      fileExists(jsPath)
    ]);

    const result = tsExists ? tsPath : (jsExists ? jsPath : filePath);

    // キャッシュに保存（タイムスタンプ付き）
    fileResolutionCache.set(filePath, { value: result, timestamp: Date.now() });

    return result;
  }

  // 拡張子がない場合
  const ext = filePath.split('.').pop();
  const hasExtension = ext && ['js', 'ts', 'html', 'css', 'json', 'mjs'].includes(ext);

  if (!hasExtension) {
    const tsPath = filePath + '.ts';
    const jsPath = filePath + '.js';

    // 並列でチェック
    const [tsExists, jsExists] = await Promise.all([
      fileExists(tsPath),
      fileExists(jsPath)
    ]);

    const result = tsExists ? tsPath : (jsExists ? jsPath : filePath);

    // キャッシュに保存（タイムスタンプ付き）
    fileResolutionCache.set(filePath, { value: result, timestamp: Date.now() });

    return result;
  }

  return filePath;
}

// ファイルパス解決（.js -> .ts の変換、拡張子なし対応、@components対応）
async function resolveFilePath(path: string): Promise<string> {
  // @components/ パスを packages/autoload/ に解決（Import Maps対応）
  if (path.startsWith('/@components/')) {
    const componentPath = path.replace('/@components/', 'packages/autoload/');
    const filePath = join(process.cwd(), componentPath);
    return resolveExtension(filePath);
  }

  // /components/ パスを packages/components/ に解決（相対インポート対応）
  if (path.startsWith('/components/')) {
    const componentPath = path.replace('/components/', 'packages/components/');
    const filePath = join(process.cwd(), componentPath);
    return resolveExtension(filePath);
  }

  // /core/ パスを packages/core/ に解決
  if (path.startsWith('/core/')) {
    const corePath = path.replace('/core/', 'packages/core/');
    const filePath = join(process.cwd(), corePath);
    return resolveExtension(filePath);
  }

  // /styles/ パスを packages/styles/ に解決
  if (path.startsWith('/styles/')) {
    const stylesPath = path.replace('/styles/', 'packages/styles/');
    const filePath = join(process.cwd(), stylesPath);
    return resolveExtension(filePath);
  }

  // /config.js または /config を packages/config.ts に解決
  if (path === '/config.js' || path === '/config') {
    const configPath = join(process.cwd(), 'packages/config.ts');
    if (await fileExists(configPath)) {
      return configPath;
    }
  }

  // /utils/ パスを packages/utils/ に解決
  if (path.startsWith('/utils/')) {
    const utilsPath = path.replace('/utils/', 'packages/utils/');
    const filePath = join(process.cwd(), utilsPath);
    return resolveExtension(filePath);
  }

  const filePath = join(process.cwd(), path === "/" ? "viewer.html" : path.slice(1));
  return resolveExtension(filePath);
}

// サーバー起動（ポート自動選択対応）
function startServer(preferredPort: number = 3000, opts: { strictPort?: boolean } = {}): void {
  try {
    const server = serve({
      port: preferredPort,
      fetch: handleRequest
    });
    console.log(`🚀 Server running at http://localhost:${server.port}`);
    console.log(`📋 View components at http://localhost:${server.port}`);
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'EADDRINUSE') {
      if (opts.strictPort) throw error;
      console.log(`⚠️ Port ${preferredPort} is in use, trying alternative...`);
      const server = serve({
        port: 0, // OSが空きポートを割り当て
        fetch: handleRequest
      });
      console.log(`🚀 Server running at http://localhost:${server.port}`);
      console.log(`📋 View components at http://localhost:${server.port}`);
    } else {
      throw error;
    }
  }
}

const envPortRaw = process.env.PORT;
const envPort = envPortRaw ? Number(envPortRaw) : Number.NaN;
const preferredPort = Number.isInteger(envPort) && envPort > 0 ? envPort : 3000;
startServer(preferredPort, { strictPort: Boolean(envPortRaw) });
