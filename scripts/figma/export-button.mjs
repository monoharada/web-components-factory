#!/usr/bin/env node

/**
 * Playwright script: dads-button の各状態（default / hover / focus-visible / active）を
 * Shadow DOM → Light DOM に変換してインラインスタイル付き HTML として出力する。
 *
 * Usage: node scripts/figma/export-button.mjs
 * Output: tmp/figma/dads-button.export.html
 */

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'tmp', 'figma');
const OUTPUT_FILE = join(OUTPUT_DIR, 'dads-button.export.html');
const PORT = 3456; // テスト用にデフォルトポートと異なるポートを使用
const BASE_URL = `http://localhost:${PORT}`;
const FIXTURE_URL = `${BASE_URL}/figma-export/button.html`;

/**
 * bun server.ts を子プロセスで起動し、ready になるまで待つ
 */
function startServer() {
  const server = spawn('bun', ['server.ts'], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // サーバのログを表示
  server.stdout.on('data', (data) => {
    const msg = data.toString();
    if (process.env.DEBUG) console.log(`[server] ${msg.trim()}`);
  });
  server.stderr.on('data', (data) => {
    const msg = data.toString();
    if (process.env.DEBUG) console.error(`[server:err] ${msg.trim()}`);
  });

  return server;
}

/**
 * サーバが起動するまでリトライで待つ
 */
async function waitForServer(maxRetries = 30, intervalMs = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/viewer.html`);
      if (res.ok) {
        console.log(`Server ready on port ${PORT}`);
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Server did not start within ${maxRetries * intervalMs}ms`);
}

/**
 * ページを開いてカスタム要素の定義を待つ
 */
async function openAndWait(page) {
  await page.goto(FIXTURE_URL, { waitUntil: 'networkidle' });

  // カスタム要素が定義されるまで待つ
  await page.waitForFunction(() => {
    return customElements.get('dads-button') !== undefined;
  }, { timeout: 10000 });

  // Shadow DOM 内の base 要素が存在するまで待つ
  await page.waitForFunction(() => {
    const el = document.querySelector('#target');
    return el?.shadowRoot?.querySelector('[part="base"]') !== null;
  }, { timeout: 10000 });

  // レンダリング安定化のために少し待つ
  await page.waitForTimeout(300);
}

/**
 * export 関数を呼んでフラット化 HTML を取得
 */
async function exportState(page, stateLabel) {
  return page.evaluate((label) => {
    return window.__WCF_EXPORT_BUTTON__(label);
  }, stateLabel);
}

/**
 * 各状態を作ってスナップショットを取る
 */
async function captureStates(browser) {
  const states = [];

  // --- default ---
  {
    console.log('Capturing: default');
    const page = await browser.newPage();
    await openAndWait(page);
    const html = await exportState(page, 'default');
    states.push({ label: 'default', html });
    await page.close();
  }

  // --- hover ---
  {
    console.log('Capturing: hover');
    const page = await browser.newPage();
    await openAndWait(page);

    // Shadow DOM 内の base 要素にホバー
    const base = page.locator('#target').locator('button[part="base"]');
    await base.hover();
    // ホバー状態の安定化を待つ
    await page.waitForTimeout(200);

    const html = await exportState(page, 'hover');
    states.push({ label: 'hover', html });
    await page.close();
  }

  // --- focus-visible ---
  {
    console.log('Capturing: focus-visible');
    const page = await browser.newPage();
    await openAndWait(page);

    // Tab キーで focus-visible を発生させる
    // body から Tab を押して base にフォーカスが当たるまで繰り返す
    let focusVisible = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      focusVisible = await page.evaluate(() => {
        const target = document.querySelector('#target');
        const base = target?.shadowRoot?.querySelector('[part="base"]');
        return base?.matches(':focus-visible') ?? false;
      });

      if (focusVisible) break;
    }

    if (!focusVisible) {
      console.warn('Warning: Could not achieve :focus-visible state, capturing anyway');
    }

    const html = await exportState(page, 'focus-visible');
    states.push({ label: 'focus-visible', html });
    await page.close();
  }

  // --- active ---
  {
    console.log('Capturing: active');
    const page = await browser.newPage();
    await openAndWait(page);

    // base 要素の位置を取得してマウスダウン状態を作る
    const box = await page.evaluate(() => {
      const target = document.querySelector('#target');
      const base = target?.shadowRoot?.querySelector('[part="base"]');
      if (!base) return null;
      const rect = base.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });

    if (box) {
      await page.mouse.move(box.x, box.y);
      await page.mouse.down();
      await page.waitForTimeout(100);

      const html = await exportState(page, 'active');
      states.push({ label: 'active', html });

      await page.mouse.up();
    } else {
      console.warn('Warning: Could not find base element for active state');
      const html = await exportState(page, 'active');
      states.push({ label: 'active', html });
    }

    await page.close();
  }

  return states;
}

/**
 * 4 状態の HTML を 1 つのドキュメントにまとめる
 */
function buildOutputHtml(states) {
  const sections = states
    .map(({ label, html }) => `    <section data-state="${label}">\n      <h2>${label}</h2>\n      ${html}\n    </section>`)
    .join('\n\n');

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>dads-button export</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f5f5f5; }
    h1 { margin-bottom: 1.5rem; }
    section { margin-bottom: 2rem; padding: 1.5rem; background: #fff; border-radius: 8px; }
    h2 { margin-top: 0; color: #666; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <h1>dads-button</h1>

${sections}
</body>
</html>
`;
}

/**
 * Playwright がインストールした chromium 実行ファイルを探す
 */
function findChromiumExecutable() {
  // PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH 環境変数があればそれを使う
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  // ~/.cache/ms-playwright/ から chromium-* ディレクトリを探す
  const homeDir = process.env.HOME || '/root';
  const pwCacheDir = join(homeDir, '.cache', 'ms-playwright');

  const candidates = [];

  // pwCacheDir 内の chromium-* を動的に走査
  try {
    const entries = readdirSync(pwCacheDir).filter(
      (e) => e.startsWith('chromium-') && !e.includes('headless')
    );
    // 降順ソートして最新を優先
    for (const entry of entries.sort().reverse()) {
      candidates.push(join(pwCacheDir, entry, 'chrome-linux', 'chrome'));
    }
  } catch {
    // ディレクトリが存在しない場合は無視
  }

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  throw new Error(
    `Chromium executable not found. Checked: ${candidates.join(', ')}. ` +
    `Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH env or run: npx playwright install chromium`
  );
}

/**
 * メイン処理
 */
async function main() {
  let server;
  let browser;

  try {
    // サーバ起動
    console.log('Starting server...');
    server = startServer();
    await waitForServer();

    // ブラウザ起動（playwright-core の chromium を利用）
    console.log('Launching browser...');
    const { chromium } = await import('playwright-core');

    // chromium 実行ファイルを探す
    const chromiumPath = findChromiumExecutable();
    console.log(`Using chromium: ${chromiumPath}`);
    browser = await chromium.launch({ headless: true, executablePath: chromiumPath });

    // 各状態をキャプチャ
    const states = await captureStates(browser);

    // 出力ファイルを生成
    await mkdir(OUTPUT_DIR, { recursive: true });
    const html = buildOutputHtml(states);
    await writeFile(OUTPUT_FILE, html, 'utf-8');

    console.log(`\nExported: ${OUTPUT_FILE}`);
    console.log(`States: ${states.map((s) => s.label).join(', ')}`);
  } catch (err) {
    console.error('Export failed:', err);
    process.exitCode = 1;
  } finally {
    // ブラウザとサーバを確実に終了
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (server) {
      server.kill('SIGTERM');
      // 確実に終了させる
      setTimeout(() => {
        try {
          server.kill('SIGKILL');
        } catch {
          // already dead
        }
      }, 2000);
    }
  }
}

main();
