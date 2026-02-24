#!/usr/bin/env node

/**
 * Playwright script: dads-button の各状態（default / hover / focus-visible / active）を
 * Shadow DOM → Light DOM に変換してインラインスタイル付き HTML として出力する。
 *
 * Usage: node scripts/figma/export-button.mjs
 * Output: tmp/figma/dads-button.export.html
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  closeResources,
  findChromiumExecutable,
  launchChromium,
  startServer,
  waitForServer,
} from './export-shared.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'tmp', 'figma');
const OUTPUT_FILE = join(OUTPUT_DIR, 'dads-button.export.html');
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const FIXTURE_URL = `${BASE_URL}/figma-export/button.html`;

/**
 * ページを開いてカスタム要素の定義を待つ。
 */
async function openAndWait(page) {
  await page.goto(FIXTURE_URL, { waitUntil: 'networkidle' });

  await page.waitForFunction(
    () => customElements.get('dads-button') !== undefined,
    { timeout: 10000 },
  );

  await page.waitForFunction(
    () => {
      const el = document.querySelector('#target');
      return el?.shadowRoot?.querySelector('[part="base"]') !== null;
    },
    { timeout: 10000 },
  );

  await page.waitForTimeout(300);
}

/**
 * export 関数を呼んでフラット化 HTML を取得する。
 */
async function exportState(page, stateLabel) {
  return page.evaluate((label) => {
    return window.__WCF_EXPORT_BUTTON__(label);
  }, stateLabel);
}

/**
 * 各状態を作ってスナップショットを取る。
 */
async function captureStates(browser) {
  const states = [];

  {
    console.log('Capturing: default');
    const page = await browser.newPage();
    await openAndWait(page);
    const html = await exportState(page, 'default');
    states.push({ label: 'default', html });
    await page.close();
  }

  {
    console.log('Capturing: hover');
    const page = await browser.newPage();
    await openAndWait(page);

    const base = page.locator('#target').locator('button[part="base"]');
    await base.hover();
    await page.waitForTimeout(200);

    const html = await exportState(page, 'hover');
    states.push({ label: 'hover', html });
    await page.close();
  }

  {
    console.log('Capturing: focus-visible');
    const page = await browser.newPage();
    await openAndWait(page);

    let focusVisible = false;
    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      focusVisible = await page.evaluate(() => {
        const target = document.querySelector('#target');
        const base = target?.shadowRoot?.querySelector('[part="base"]');
        return base?.matches(':focus-visible') ?? false;
      });

      if (focusVisible) {
        break;
      }
    }

    if (!focusVisible) {
      console.warn('Warning: Could not achieve :focus-visible state, capturing anyway');
    }

    const html = await exportState(page, 'focus-visible');
    states.push({ label: 'focus-visible', html });
    await page.close();
  }

  {
    console.log('Capturing: active');
    const page = await browser.newPage();
    await openAndWait(page);

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
 * 4 状態の HTML を 1 つのドキュメントにまとめる。
 */
function buildOutputHtml(states) {
  const sections = states
    .map(
      ({ label, html }) =>
        `    <section data-state="${label}">\n      <h2>${label}</h2>\n      ${html}\n    </section>`,
    )
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
 * メイン処理。
 */
async function main() {
  let server;
  let browser;

  try {
    console.log('Starting server...');
    server = startServer({ projectRoot: PROJECT_ROOT, port: PORT });
    await waitForServer({ baseUrl: BASE_URL });
    console.log(`Server ready on port ${PORT}`);

    console.log('Launching browser...');
    const chromiumPath = findChromiumExecutable();
    console.log(`Using chromium: ${chromiumPath}`);
    browser = await launchChromium(chromiumPath, true);

    const states = await captureStates(browser);

    await mkdir(OUTPUT_DIR, { recursive: true });
    const html = buildOutputHtml(states);
    await writeFile(OUTPUT_FILE, html, 'utf-8');

    console.log(`\nExported: ${OUTPUT_FILE}`);
    console.log(`States: ${states.map((state) => state.label).join(', ')}`);
  } catch (err) {
    console.error('Export failed:', err);
    process.exitCode = 1;
  } finally {
    await closeResources({ browser, server });
  }
}

main();
