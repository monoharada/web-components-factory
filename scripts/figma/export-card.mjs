#!/usr/bin/env node

/**
 * Playwright script: dads-card 作例3 を
 * Shadow DOM → Light DOM に変換してインラインスタイル付き HTML として出力する。
 *
 * Usage: node scripts/figma/export-card.mjs
 * Output: tmp/figma/dads-card.export.html
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildOutputHtml,
  closeResources,
  findChromiumExecutable,
  launchChromium,
  startServer,
  waitForServer,
} from './export-shared.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'tmp', 'figma');
const OUTPUT_FILE = join(OUTPUT_DIR, 'dads-card.export.html');
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const FIXTURE_URL = `${BASE_URL}/figma-export/card.html`;

/**
 * ページを開いてカスタム要素の定義を待つ。
 */
async function openAndWait(page) {
  await page.goto(FIXTURE_URL, { waitUntil: 'networkidle' });

  await page.waitForFunction(
    () => customElements.get('dads-card') !== undefined && customElements.get('dads-button') !== undefined,
    { timeout: 15000 },
  );

  await page.waitForFunction(
    () => {
      const imgs = document.querySelectorAll('#target img');
      for (const img of imgs) {
        if (!img.complete || img.naturalWidth === 0) {
          return false;
        }
      }
      return imgs.length > 0;
    },
    { timeout: 15000 },
  );

  await page.waitForTimeout(500);
}

/**
 * export 関数を呼んでフラット化 HTML を取得する。
 */
async function exportState(page, stateLabel) {
  return page.evaluate((label) => {
    return window.__WCF_EXPORT_CARD__(label);
  }, stateLabel);
}

/**
 * カード作例3をキャプチャする。
 */
async function captureStates(browser) {
  const states = [];

  console.log('Capturing: default');
  const page = await browser.newPage();
  await openAndWait(page);
  const html = await exportState(page, 'default');
  states.push({ label: 'default', html });
  await page.close();

  return states;
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
    const html = buildOutputHtml(states, 'dads-card (作例3)');
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
