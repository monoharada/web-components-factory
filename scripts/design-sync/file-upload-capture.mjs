#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import {
  CRITICAL_PARTS,
  DEFAULT_CAPTURE_JSON_PATH,
  DEFAULT_CAPTURE_STATES_DIR,
  EXIT_CODES,
  REQUIRED_STATES,
  ensureDir,
  parseArgValue,
  parseCsvList,
  relPathFromCwd,
  sanitizeStateName,
  stableJson,
  toRelativeRect,
  validateCaptureJson,
} from './file-upload-shared.mjs';

const DEFAULT_URL = 'http://localhost:3000/?nosw=1&component=fileUpload';
const CAPTURE_STYLE_PROPS = Object.freeze([
  'display',
  'position',
  'boxSizing',
  'width',
  'height',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRadius',
  'backgroundColor',
  'color',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'gap',
  'rowGap',
  'columnGap',
  'alignItems',
  'justifyContent',
  'opacity',
]);

const STATE_FIXTURES = Object.freeze({
  default: {
    attrs: {
      label: 'ファイルアップロード',
      'support-text': 'PDF / JPEG / PNG をアップロードできます。',
      accept: '.pdf,image/jpeg,image/png',
      multiple: true,
      'max-files': '3',
      'max-file-size': '10mb',
    },
    notes: [],
  },
  'error-required': {
    attrs: {
      label: 'ファイルアップロード',
      'support-text': 'PDF / JPEG / PNG をアップロードできます。',
      required: true,
      accept: '.pdf,image/jpeg,image/png',
      multiple: true,
      'max-files': '3',
      'max-file-size': '10mb',
    },
    afterSetup: 'trigger-required-error',
    notes: ['requestUpload() を呼び出して required エラー状態を作成'],
  },
  disabled: {
    attrs: {
      label: 'ファイルアップロード',
      'support-text': 'PDF / JPEG / PNG をアップロードできます。',
      disabled: true,
      accept: '.pdf,image/jpeg,image/png',
      multiple: true,
      'max-files': '3',
      'max-file-size': '10mb',
    },
    notes: ['disabled 属性あり'],
  },
  'button-only': {
    attrs: {
      label: 'ファイルアップロード',
      'support-text': 'PDF / JPEG / PNG をアップロードできます。',
      mode: 'button-only',
      required: true,
      accept: '.pdf,image/jpeg,image/png',
      multiple: true,
      'max-files': '3',
      'max-file-size': '10mb',
    },
    notes: ['mode=button-only'],
  },
  'fullscreen-dragover': {
    attrs: {
      label: 'ファイルアップロード',
      'support-text': 'PDF / JPEG / PNG をアップロードできます。',
      accept: '.pdf,image/jpeg,image/png',
      multiple: true,
      'max-files': '3',
      'max-file-size': '10mb',
      'expand-label': 'ドラッグ＆ドロップ範囲をウィンドウ全体に広げる',
      'overlay-text': 'このエリア内にファイルをドラッグ＆ドロップ',
    },
    afterSetup: 'fullscreen-dragover',
    notes: ['expand-checkbox を ON にして dragenter/dragover を発火'],
  },
});

function parseCli(argv) {
  const url = parseArgValue(argv, 'url', DEFAULT_URL);
  const captureJsonPath = parseArgValue(argv, 'capture-json', DEFAULT_CAPTURE_JSON_PATH);
  const statesDir = parseArgValue(argv, 'states-dir', DEFAULT_CAPTURE_STATES_DIR);
  const statesRaw = parseArgValue(argv, 'states', REQUIRED_STATES.join(','));
  const states = parseCsvList(statesRaw, REQUIRED_STATES);

  for (const state of states) {
    if (!Object.prototype.hasOwnProperty.call(STATE_FIXTURES, state)) {
      throw new Error(`Unknown state: "${state}"`);
    }
  }

  return {
    url,
    captureJsonPath,
    statesDir,
    states,
  };
}

async function waitForStableRendering(page) {
  await page.waitForFunction(() => customElements.get('dads-file-upload') !== undefined, null, { timeout: 30_000 });
  await page.evaluate(async () => {
    const fonts = document.fonts;
    if (!fonts?.ready) return;
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  });
}

async function injectNoMotionStyle(page) {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  });
}

async function createStateFixture(page, stateName, fixture) {
  const hostId = `design-sync-file-upload-${sanitizeStateName(stateName)}`;

  await page.evaluate(
    ({ id, attrs }) => {
      const rootId = 'design-sync-file-upload-capture-root';
      let root = document.getElementById(rootId);
      if (!(root instanceof HTMLElement)) {
        root = document.createElement('div');
        root.id = rootId;
        root.style.position = 'fixed';
        root.style.left = '24px';
        root.style.top = '24px';
        root.style.width = '860px';
        root.style.padding = '24px';
        root.style.background = '#ffffff';
        root.style.border = '1px solid #e5e7eb';
        root.style.borderRadius = '12px';
        root.style.zIndex = '2147483000';
        document.body.append(root);
      }

      root.textContent = '';

      const stage = document.createElement('div');
      stage.style.width = '768px';
      stage.style.margin = '0 auto';
      stage.style.background = '#ffffff';

      const host = document.createElement('dads-file-upload');
      host.id = id;
      host.setAttribute('data-design-sync-state', id);

      for (const [key, value] of Object.entries(attrs)) {
        if (typeof value === 'boolean') {
          host.toggleAttribute(key, value);
          continue;
        }
        host.setAttribute(key, String(value));
      }

      stage.append(host);
      root.append(stage);
    },
    { id: hostId, attrs: fixture.attrs },
  );

  await page.waitForSelector(`#${hostId}`, { state: 'visible', timeout: 10_000 });
  await page.waitForTimeout(60);
  return hostId;
}

async function applyAfterSetup(page, hostId, stateName, afterSetup) {
  if (!afterSetup) return;

  if (afterSetup === 'trigger-required-error') {
    await page.evaluate((id) => {
      const host = document.getElementById(id);
      if (!(host instanceof HTMLElement)) throw new Error(`missing host: ${id}`);
      if (typeof host.requestUpload === 'function') {
        host.requestUpload();
      }
    }, hostId);
    await page.waitForTimeout(80);
    return;
  }

  if (afterSetup === 'fullscreen-dragover') {
    await page.evaluate((id) => {
      const host = document.getElementById(id);
      if (!(host instanceof HTMLElement)) throw new Error(`missing host: ${id}`);
      const checkbox = host.shadowRoot?.querySelector('#expand-checkbox');
      if (!(checkbox instanceof HTMLElement)) throw new Error(`missing #expand-checkbox: ${id}`);

      checkbox.dispatchEvent(
        new CustomEvent('dads-change', {
          bubbles: true,
          composed: true,
          detail: { checked: true },
        }),
      );

      const dt = new DataTransfer();
      dt.items.add(new File(['dummy'], 'dragover.pdf', { type: 'application/pdf' }));

      window.dispatchEvent(
        new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
      window.dispatchEvent(
        new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
    }, hostId);

    await page.waitForTimeout(120);
    return;
  }

  throw new Error(`Unknown afterSetup handler: ${afterSetup} (${stateName})`);
}

async function collectStateSnapshot(page, hostId) {
  return page.evaluate(
    ({ id, styleProps, parts }) => {
      const host = document.getElementById(id);
      if (!(host instanceof HTMLElement)) throw new Error(`missing host: ${id}`);
      const root = host.shadowRoot;
      if (!root) throw new Error(`missing shadowRoot: ${id}`);

      const normalizeText = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();
      const getRect = (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
        };
      };
      const getStyles = (el) => {
        const style = getComputedStyle(el);
        const out = {};
        for (const key of styleProps) {
          out[key] = style.getPropertyValue(key);
        }
        return out;
      };
      const getAttrs = (el) => {
        const attrs = {};
        for (const attr of Array.from(el.attributes)) {
          attrs[attr.name] = attr.value;
        }
        return attrs;
      };
      const findPart = (partName) => {
        for (const node of Array.from(root.querySelectorAll('[part]'))) {
          const partAttr = node.getAttribute('part') ?? '';
          const tokens = partAttr.split(/\s+/).filter(Boolean);
          if (tokens.includes(partName)) return node;
        }
        return null;
      };

      const hostRect = getRect(host);
      const outParts = {};
      for (const partName of parts) {
        const partEl = findPart(partName);
        if (!partEl) {
          outParts[partName] = {
            exists: false,
            bbox: null,
            text: '',
            computedStyle: {},
            attributes: {},
          };
          continue;
        }
        outParts[partName] = {
          exists: true,
          bbox: getRect(partEl),
          text: normalizeText(partEl.textContent),
          computedStyle: getStyles(partEl),
          attributes: getAttrs(partEl),
        };
      }

      return {
        host: {
          bbox: hostRect,
          text: normalizeText(host.textContent),
          computedStyle: getStyles(host),
          attributes: getAttrs(host),
        },
        parts: outParts,
      };
    },
    {
      id: hostId,
      styleProps: CAPTURE_STYLE_PROPS,
      parts: CRITICAL_PARTS,
    },
  );
}

function toClipRect(rawRect) {
  const x = Math.max(0, Math.floor(rawRect.x));
  const y = Math.max(0, Math.floor(rawRect.y));
  const width = Math.max(1, Math.ceil(rawRect.width));
  const height = Math.max(1, Math.ceil(rawRect.height));
  return { x, y, width, height };
}

async function captureStateScreenshot(page, rect) {
  return page.screenshot({
    clip: toClipRect(rect),
    type: 'png',
  });
}

async function clearFullscreenOverlay(page) {
  await page.evaluate(() => {
    const dt = new DataTransfer();
    window.dispatchEvent(
      new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      }),
    );
  });
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  const captureAbsDir = await ensureDir(path.dirname(cli.captureJsonPath));
  const statesAbsDir = await ensureDir(cli.statesDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    await page.goto(cli.url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForStableRendering(page);
    await injectNoMotionStyle(page);

    const states = {};
    for (const stateName of cli.states) {
      const fixture = STATE_FIXTURES[stateName];
      const hostId = await createStateFixture(page, stateName, fixture);
      await applyAfterSetup(page, hostId, stateName, fixture.afterSetup);

      const snapshot = await collectStateSnapshot(page, hostId);
      const stateSafe = sanitizeStateName(stateName);
      const statePngAbs = path.join(statesAbsDir, `${stateSafe}.png`);
      const screenshot = await captureStateScreenshot(page, snapshot.host.bbox);
      await fs.writeFile(statePngAbs, screenshot);

      const parts = {};
      for (const [partName, partData] of Object.entries(snapshot.parts)) {
        parts[partName] = {
          ...partData,
          relativeBBox: partData.bbox ? toRelativeRect(partData.bbox, snapshot.host.bbox) : null,
        };
      }

      states[stateName] = {
        name: stateName,
        screenshotPath: relPathFromCwd(statePngAbs),
        host: snapshot.host,
        parts,
        notes: [...(fixture.notes ?? [])],
      };

      if (stateName === 'fullscreen-dragover') {
        await clearFullscreenOverlay(page);
      }
    }

    const capture = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      component: 'dads-file-upload',
      sourceUrl: cli.url,
      requiredStates: REQUIRED_STATES,
      criticalParts: CRITICAL_PARTS,
      viewport: {
        width: 1280,
        height: 960,
      },
      states,
    };

    const shape = validateCaptureJson(capture);
    if (!shape.valid) {
      throw new Error(`capture schema validation failed: ${JSON.stringify(shape.errors)}`);
    }

    const captureAbsPath = path.resolve(process.cwd(), cli.captureJsonPath);
    await fs.mkdir(path.dirname(captureAbsPath), { recursive: true });
    await fs.writeFile(captureAbsPath, stableJson(capture), 'utf8');

    console.log(`[design-sync:file-upload:capture] wrote ${relPathFromCwd(captureAbsPath)}`);
    console.log(`[design-sync:file-upload:capture] states: ${Object.keys(states).join(', ')}`);
    console.log(`[design-sync:file-upload:capture] output dir: ${relPathFromCwd(captureAbsDir)}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`[design-sync:file-upload:capture] ${message}`);
  process.exit(EXIT_CODES.captureFailure);
});

