#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const ts = require('typescript');
const { staticPageAssets } = require('./build-pages-assets.cjs');

const projectRoot = process.cwd();
const outDir = path.join(projectRoot, 'dist-pages');

const compilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ES2020,
  strict: true,
  sourceMap: false,
  inlineSources: false,
};

function shouldTranspileTsFile(filePath) {
  if (!filePath.endsWith('.ts')) return false;
  if (filePath.endsWith('.d.ts')) return false;
  if (filePath.endsWith('.test.ts')) return false;
  return true;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function collectFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function transpileTsToJs(content, fileName) {
  const result = ts.transpileModule(content, {
    compilerOptions,
    fileName,
    reportDiagnostics: true,
  });

  if (result.diagnostics?.length) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(result.diagnostics, {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: () => projectRoot,
      getNewLine: () => '\n',
    });
    throw new Error(`TypeScript transpile error in ${fileName}\n${formatted}`);
  }

  return result.outputText;
}

/**
 * dist-pages用にインポートパスを書き換える
 * packages/ は dist-pages では直下に展開されるため、パスを修正
 */
function rewriteImportsForDistPages(js) {
  // ../packages/xxx/ → ../xxx/
  // ../../packages/xxx/ → ../../xxx/
  // etc.
  return js.replace(
    /(from\s+['"])((?:\.\.\/)+)packages\/(core|utils|styles|components)\//g,
    (_match, prefix, dots, moduleType) => `${prefix}${dots}${moduleType}/`
  );
}

async function transpileFile(srcPath, destPath) {
  const content = await fs.readFile(srcPath, 'utf8');
  let js = transpileTsToJs(content, srcPath);
  // dist-pages用にインポートパスを書き換え
  js = rewriteImportsForDistPages(js);
  await ensureDir(path.dirname(destPath));
  await fs.writeFile(destPath, js, 'utf8');
}

async function copyFile(srcPath, destPath) {
  await ensureDir(path.dirname(destPath));
  await fs.copyFile(srcPath, destPath);
}

async function transpileTree(srcRoot, destRoot) {
  const allFiles = await collectFiles(srcRoot);
  const tsFiles = allFiles.filter((p) => shouldTranspileTsFile(p));

  for (const srcPath of tsFiles) {
    const relPath = path.relative(srcRoot, srcPath);
    const destPath = path.join(destRoot, relPath).replace(/\.ts$/, '.js');
    await transpileFile(srcPath, destPath);
  }
}

function rewriteImportMapToRelative(html) {
  const re = /<script\s+type="importmap">\s*([\s\S]*?)\s*<\/script>/;
  const match = html.match(re);
  if (!match) {
    throw new Error('Import map not found in viewer.html');
  }

  const importMapJson = match[1];
  const parsed = JSON.parse(importMapJson);
  const imports = parsed.imports ?? {};

  for (const [key, value] of Object.entries(imports)) {
    if (typeof value !== 'string') continue;
    if (value.startsWith('/')) {
      imports[key] = `.${value}`; // "/x" -> "./x"
    }
  }

  const rewritten = JSON.stringify({ ...parsed, imports }, null, 2);
  return html.replace(re, `<script type="importmap">\n${rewritten}\n</script>`);
}

function removeServiceWorkerRegistration(html) {
  const byComment =
    /<!--\s*Service Worker登録（キャッシュ戦略）\s*-->\s*<script>[\s\S]*?<\/script>\s*/;
  if (byComment.test(html)) {
    return html.replace(byComment, '');
  }

  const byRegister = /<script>[\s\S]*?serviceWorker\.register\([\s\S]*?<\/script>\s*/;
  if (byRegister.test(html)) {
    return html.replace(byRegister, '');
  }

  return html;
}

function rewriteAbsoluteAssetPathsToRelative(html) {
  // modulepreload, etc.
  let out = html.replace(/href="\/([^"]+)"/g, 'href="./$1"');

  // Dynamic import / preload arrays with leading "/@components/..."
  out = out.replace(/(['"])\/@components\//g, '$1./@components/');

  return out;
}

function rewriteDistPagesPrefixToRelative(html) {
  return html.replace(/\.\/dist-pages\//g, './');
}

async function buildIndexHtml() {
  const srcHtmlPath = path.join(projectRoot, 'averageCase.prebuilt.html');
  const srcHtml = await fs.readFile(srcHtmlPath, 'utf8');

  const html = rewriteDistPagesPrefixToRelative(srcHtml);
  const destHtmlPath = path.join(outDir, 'index.html');
  await ensureDir(outDir);
  await fs.writeFile(destHtmlPath, html, 'utf8');
}

async function cleanOutDir() {
  await fs.rm(outDir, { recursive: true, force: true });
  await ensureDir(outDir);
}

async function main() {
  console.log('[pages] Building GitHub Pages output...');

  await cleanOutDir();
  await buildIndexHtml();
  for (const asset of staticPageAssets) {
    await copyFile(path.join(projectRoot, asset), path.join(outDir, asset));
  }

  await transpileFile(path.join(projectRoot, 'packages/config.ts'), path.join(outDir, 'config.js'));

  await transpileTree(path.join(projectRoot, 'packages/core'), path.join(outDir, 'core'));
  await transpileTree(path.join(projectRoot, 'packages/utils'), path.join(outDir, 'utils'));
  await transpileTree(path.join(projectRoot, 'packages/styles'), path.join(outDir, 'styles'));
  await transpileTree(path.join(projectRoot, 'packages/components'), path.join(outDir, 'components'));

  await transpileTree(
    path.join(projectRoot, 'packages/autoload/dads'),
    path.join(outDir, '@components/dads')
  );
  await transpileTree(
    path.join(projectRoot, 'packages/autoload/meta'),
    path.join(outDir, '@components/meta')
  );

  await transpileFile(path.join(projectRoot, 'src/demos.ts'), path.join(outDir, 'src/demos.js'));
  await transpileTree(path.join(projectRoot, 'src/demos'), path.join(outDir, 'src/demos'));
  await transpileFile(
    path.join(projectRoot, 'src/viewer-api-controls.ts'),
    path.join(outDir, 'src/viewer-api-controls.js')
  );

  console.log('[pages] Done: dist-pages/');
}

main().catch((error) => {
  console.error('[pages] Build failed:', error);
  process.exitCode = 1;
});
