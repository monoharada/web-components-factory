import { serve } from "bun";
import { join } from "path";

// ===== パフォーマンス最適化: キャッシュ設定 =====

// グローバルTranspilerインスタンス（再利用してオーバーヘッド削減）
const globalTranspiler = new Bun.Transpiler({
  loader: "ts",
  target: "browser"
});

// トランスパイルキャッシュ（ファイルパス → { content, mtime }）
const transpileCache = new Map<string, { content: string; mtime: number }>();

// ファイル解決キャッシュ
const fileResolutionCache = new Map<string, string>();
const RESOLUTION_CACHE_TTL = 30000; // 30秒

// HTTP/2 Server Push用のコア依存
const CORE_DEPENDENCIES = [
  '/core/web-components.js',
  '/config.js',
  '/utils/aria.js',
  '/utils/behaviors.js',
  '/utils/dom.js',
  '/styles/tokens.js'
];

// Link ヘッダー生成（HTTP/2 Server Push / Preload）
function generateLinkHeader(): string {
  return CORE_DEPENDENCIES
    .map(dep => `<${dep}>; rel=preload; as=script; crossorigin`)
    .join(', ');
}

// ===== ユーティリティ関数 =====

// パスに拡張子がないかチェック
function hasNoExtension(path: string): boolean {
  const basename = path.split('/').pop() || '';
  if (!basename.includes('.')) return true;
  const ext = basename.split('.').pop();
  return !ext || !['js', 'ts', 'html', 'css', 'json', 'mjs'].includes(ext);
}

// fetch ハンドラー
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let path = url.pathname;

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
        break;
      case "ts":
        // TypeScriptファイルはキャッシュ付きトランスパイル
        try {
          const { content, mtime } = await transpileWithCache(filePath);
          return new Response(content, {
            headers: {
              "Content-Type": "application/javascript",
              "Cache-Control": "public, max-age=31536000, immutable",
              "ETag": mtime.toString(16)
            }
          });
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

    // キャッシュヘッダーを設定（JS/CSS は長期キャッシュ、HTML は短期）
    const cacheControl = ext === 'html'
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

    return new Response(file, { headers });

  } catch (error) {
    // エラーの場合は詳細なエラーメッセージを返す
    console.error(`GET - ${path} failed`);
    console.error(error);

    return new Response(`File not found: ${path}`, {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

// ファイルが存在するかチェック
async function fileExists(path: string): Promise<boolean> {
  try {
    const file = Bun.file(path);
    return file.size > 0;
  } catch {
    return false;
  }
}

// トランスパイル結果をキャッシュして返す（mtime変更時のみ再トランスパイル）
async function transpileWithCache(filePath: string): Promise<{ content: string; mtime: number }> {
  const file = Bun.file(filePath);
  const stat = await file.stat();
  const cached = transpileCache.get(filePath);

  // mtimeが同じならキャッシュを返す
  if (cached && cached.mtime === stat.mtimeMs) {
    console.log(`[Cache HIT] ${filePath}`);
    return cached;
  }

  // トランスパイル実行
  console.log(`[Cache MISS] Transpiling: ${filePath}`);
  const content = await file.text();
  const transpiled = globalTranspiler.transformSync(content);

  // キャッシュに保存
  const result = { content: transpiled, mtime: stat.mtimeMs };
  transpileCache.set(filePath, result);

  return result;
}

// 拡張子を解決（.js -> .ts、拡張子なし -> .ts/.js）+ キャッシュ + 並列化
async function resolveExtension(filePath: string): Promise<string> {
  // キャッシュチェック
  const cached = fileResolutionCache.get(filePath);
  if (cached) return cached;

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

    // キャッシュに保存（TTL付き）
    fileResolutionCache.set(filePath, result);
    setTimeout(() => fileResolutionCache.delete(filePath), RESOLUTION_CACHE_TTL);

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

    // キャッシュに保存（TTL付き）
    fileResolutionCache.set(filePath, result);
    setTimeout(() => fileResolutionCache.delete(filePath), RESOLUTION_CACHE_TTL);

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
function startServer(preferredPort: number = 3000): void {
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

startServer();
