import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type FontDiagnostics = {
  body: {
    classes: string[];
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    fontsStatus: string | null;
    notoSansJpLoaded: boolean | null;
  };
  opener: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    minHeight: string;
  };
  menuItemBase: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    minHeight: string;
  } | null;
};

type Rect = { left: number; right: number; top: number; bottom: number; width: number; height: number };

function repoRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function safeFigmaId(id: string): string {
  return String(id).replace(/:/g, '-');
}

async function waitForComponentReady(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/?component=menuListBoxFidelity');
  await page.locator('#demo-menu-list-box-basic').waitFor();

  await page.waitForFunction(() => customElements.get('dads-menu-list-box') !== undefined);

  // Fonts load async (google fonts). We accept flakiness, but capture state.
  await page
    .waitForFunction(() => {
      const cls = document.body.classList;
      return cls.contains('fonts-loaded') || cls.contains('fonts-error');
    })
    .catch(() => {});
}

async function ensureMenuListBoxOpen(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<void> {
  await page.waitForFunction((sel) => document.querySelector(sel) !== null, selector);
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!(el instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
    el.setAttribute('open', '');
  }, selector);

  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const popup = (el as HTMLElement).shadowRoot?.querySelector('[part="popup"]') as HTMLElement | null;
    return popup !== null && !popup.hasAttribute('hidden');
  }, selector);

  // Allow post-open microtask measurements to settle (e.g., scrollbar state).
  await page.waitForTimeout(0);
}

async function getMenuListBoxRects(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<{ opener: Rect; popup: Rect | null; union: Rect }> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  return await page.evaluate((sel) => {
    const host = document.querySelector(sel);
    if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
    const root = host.shadowRoot;
    if (!root) throw new Error(`Missing shadowRoot: ${sel}`);

    const openerEl = root.querySelector('[part="opener"]');
    if (!(openerEl instanceof HTMLElement)) throw new Error(`Missing [part="opener"]: ${sel}`);
    const popupEl = root.querySelector('[part="popup"]');
    const opener = openerEl.getBoundingClientRect();
    const popup =
      popupEl instanceof HTMLElement && !popupEl.hasAttribute('hidden') ? popupEl.getBoundingClientRect() : null;

    const left = Math.min(opener.left, popup?.left ?? opener.left);
    const top = Math.min(opener.top, popup?.top ?? opener.top);
    const right = Math.max(opener.right, popup?.right ?? opener.right);
    const bottom = Math.max(opener.bottom, popup?.bottom ?? opener.bottom);

    const toRect = (r: DOMRect): Rect => ({
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    });

    return {
      opener: toRect(opener),
      popup: popup ? toRect(popup) : null,
      union: { left, right, top, bottom, width: right - left, height: bottom - top },
    };
  }, selector);
}

async function attachScreenshot(
  page: import('@playwright/test').Page,
  name: string,
  clip: Rect,
  testInfo: import('@playwright/test').TestInfo,
): Promise<void> {
  const padding = 8;
  const safeClip = {
    x: Math.max(0, Math.floor(clip.left - padding)),
    y: Math.max(0, Math.floor(clip.top - padding)),
    width: Math.ceil(clip.width + padding * 2),
    height: Math.ceil(clip.height + padding * 2),
  };

  try {
    const png = await page.screenshot({ clip: safeClip });
    await testInfo.attach(name, { body: png, contentType: 'image/png' });
  } catch {
    // Fallback: if the target is outside viewport, attach a fullPage screenshot for debugging.
    const png = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${name}-fullpage`, { body: png, contentType: 'image/png' });
  }
}

async function getFontDiagnostics(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<FontDiagnostics> {
  return await page.evaluate((sel) => {
    const host = document.querySelector(sel);
    if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
    const root = host.shadowRoot;
    if (!root) throw new Error(`Missing shadowRoot: ${sel}`);

    const opener = root.querySelector('[part="opener"]');
    if (!(opener instanceof HTMLElement)) throw new Error(`Missing [part="opener"]: ${sel}`);
    const openerStyle = getComputedStyle(opener);

    const bodyStyle = getComputedStyle(document.body);

    const menuItemHost = host.querySelector('dads-menu-list-item') as HTMLElement | null;
    const menuItemBase = menuItemHost?.shadowRoot?.querySelector('[part="base"]') as HTMLElement | null;
    const menuItemStyle = menuItemBase ? getComputedStyle(menuItemBase) : null;

    const fontsStatus =
      'fonts' in document && document.fonts && typeof document.fonts.status === 'string' ? document.fonts.status : null;

    const notoSansJpLoaded =
      'fonts' in document && document.fonts && typeof document.fonts.check === 'function'
        ? document.fonts.check('16px "Noto Sans JP"')
        : null;

    return {
      body: {
        classes: Array.from(document.body.classList),
        fontFamily: bodyStyle.fontFamily,
        fontSize: bodyStyle.fontSize,
        lineHeight: bodyStyle.lineHeight,
        letterSpacing: bodyStyle.letterSpacing,
        fontsStatus,
        notoSansJpLoaded,
      },
      opener: {
        fontFamily: openerStyle.fontFamily,
        fontSize: openerStyle.fontSize,
        lineHeight: openerStyle.lineHeight,
        letterSpacing: openerStyle.letterSpacing,
        minHeight: openerStyle.minHeight,
      },
      menuItemBase: menuItemStyle
        ? {
            fontFamily: menuItemStyle.fontFamily,
            fontSize: menuItemStyle.fontSize,
            lineHeight: menuItemStyle.lineHeight,
            letterSpacing: menuItemStyle.letterSpacing,
            minHeight: menuItemStyle.minHeight,
          }
        : null,
    };
  }, selector);
}

function px(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseRgb(color: string): { r: number; g: number; b: number; a: number } | null {
  const raw = String(color || '').trim();
  if (!raw) return null;
  const m = /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/.exec(raw);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  const a = m[4] !== undefined ? Number(m[4]) : 1;
  if (![r, g, b, a].every(Number.isFinite)) return null;
  return { r, g, b, a };
}

async function captureMenuListBoxUnionPng(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<{ clip: Rect; png: Buffer }> {
  const rects = await getMenuListBoxRects(page, selector);

  const viewport = page.viewportSize();
  if (viewport) {
    await page.evaluate(
      ({ clip, viewportHeight, viewportWidth }) => {
        const padding = 8;
        let nextX = window.scrollX;
        let nextY = window.scrollY;

        if (clip.bottom + padding > viewportHeight) nextY += clip.bottom + padding - viewportHeight;
        if (clip.top - padding < 0) nextY += clip.top - padding;
        if (clip.right + padding > viewportWidth) nextX += clip.right + padding - viewportWidth;
        if (clip.left - padding < 0) nextX += clip.left - padding;

        window.scrollTo(nextX, nextY);
      },
      {
        clip: rects.union,
        viewportHeight: viewport.height,
        viewportWidth: viewport.width,
      },
    );
  }

  // Re-compute after scroll adjustments.
  const adjusted = await getMenuListBoxRects(page, selector);
  const padding = 8;
  const safeClip = {
    x: Math.max(0, Math.floor(adjusted.union.left - padding)),
    y: Math.max(0, Math.floor(adjusted.union.top - padding)),
    width: Math.ceil(adjusted.union.width + padding * 2),
    height: Math.ceil(adjusted.union.height + padding * 2),
  };

  const png = await page.screenshot({ clip: safeClip });
  return { clip: adjusted.union, png };
}

async function buildOverlayPngs(
  page: import('@playwright/test').Page,
  figmaPng: Buffer,
  renderedPng: Buffer,
): Promise<{ alpha: Buffer; diff: Buffer }> {
  const figmaB64 = figmaPng.toString('base64');
  const renderedB64 = renderedPng.toString('base64');

  const { alpha, diff } = await page.evaluate(async ({ figmaB64: a, renderedB64: b }) => {
    const load = (b64: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image decode failed'));
        img.src = `data:image/png;base64,${b64}`;
      });

    const [figmaImg, renderedImg] = await Promise.all([load(a), load(b)]);

    const width = renderedImg.width;
    const height = renderedImg.height;

    const create = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Missing canvas context');
      return { canvas, ctx };
    };

    // Alpha overlay: figma + rendered (scaled to same output size)
    const alphaCanvas = create();
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(figmaImg, 0, 0, width, height);
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(renderedImg, 0, 0);
    alphaCanvas.ctx.globalAlpha = 1;

    // Difference image (highlights drift): |figma - rendered|
    const diffCanvas = create();
    diffCanvas.ctx.drawImage(figmaImg, 0, 0, width, height);
    diffCanvas.ctx.globalCompositeOperation = 'difference';
    diffCanvas.ctx.drawImage(renderedImg, 0, 0);
    diffCanvas.ctx.globalCompositeOperation = 'source-over';

    return {
      alpha: alphaCanvas.canvas.toDataURL('image/png'),
      diff: diffCanvas.canvas.toDataURL('image/png'),
    };
  }, {
    figmaB64,
    renderedB64,
  });

  const toBuffer = (dataUrl: string): Buffer => Buffer.from(dataUrl.split(',')[1] ?? '', 'base64');
  return { alpha: toBuffer(alpha), diff: toBuffer(diff) };
}

test.describe('Menu List Box — fidelity (geometry + diagnostics)', () => {
  test('Opener gaps: icon↔label=4px, label↔arrow=4px (size=sm)', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-basic';

    const metrics = await page.evaluate((sel) => {
      const host = document.querySelector(sel);
      if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
      const root = host.shadowRoot;
      if (!root) throw new Error(`Missing shadowRoot: ${sel}`);

      const icon = root.querySelector('[part="opener-icon"]');
      const label = root.querySelector('[part="opener-label"]');
      const arrow = root.querySelector('[part="opener-arrow"]');
      if (!(icon instanceof HTMLElement)) throw new Error(`Missing opener-icon: ${sel}`);
      if (!(label instanceof HTMLElement)) throw new Error(`Missing opener-label: ${sel}`);
      if (!(arrow instanceof SVGElement)) throw new Error(`Missing opener-arrow: ${sel}`);

      const iconRect = icon.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();

      return {
        iconToLabel: labelRect.left - iconRect.right,
        labelToArrow: arrowRect.left - labelRect.right,
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'opener', rects.union, testInfo);

    expect(metrics.iconToLabel, `icon↔label gap mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(
      3.5,
    );
    expect(metrics.iconToLabel, `icon↔label gap mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(
      4.5,
    );
    expect(metrics.labelToArrow, `label↔arrow gap mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(
      3.5,
    );
    expect(metrics.labelToArrow, `label↔arrow gap mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(
      4.5,
    );
  });

  test('Popup styles: top=0 gap, padding=16px 0, radius=8/0, border=gray-420, overflow-y=auto', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-basic';
    await ensureMenuListBoxOpen(page, selector);

    const metrics = await page.evaluate((sel) => {
      const host = document.querySelector(sel);
      if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
      const root = host.shadowRoot;
      if (!root) throw new Error(`Missing shadowRoot: ${sel}`);

      const opener = root.querySelector('[part="opener"]');
      const popup = root.querySelector('[part="popup"]');
      if (!(opener instanceof HTMLElement)) throw new Error(`Missing opener: ${sel}`);
      if (!(popup instanceof HTMLElement)) throw new Error(`Missing popup: ${sel}`);

      const openerRect = opener.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      const style = getComputedStyle(popup);

      return {
        topGap: popupRect.top - openerRect.bottom,
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        borderTopWidth: style.borderTopWidth,
        borderTopColor: style.borderTopColor,
        borderTopLeftRadius: style.borderTopLeftRadius,
        borderTopRightRadius: style.borderTopRightRadius,
        borderBottomLeftRadius: style.borderBottomLeftRadius,
        borderBottomRightRadius: style.borderBottomRightRadius,
        overflowY: style.overflowY,
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'popup', rects.union, testInfo);

    expect(metrics.topGap, 'Expected popup to touch opener (top=100%)').toBeGreaterThanOrEqual(-0.5);
    expect(metrics.topGap, 'Expected popup to touch opener (top=100%)').toBeLessThanOrEqual(0.5);

    const paddingTop = px(metrics.paddingTop);
    const paddingRight = px(metrics.paddingRight);
    const paddingBottom = px(metrics.paddingBottom);
    const paddingLeft = px(metrics.paddingLeft);

    expect(paddingTop, 'popup padding-top mismatch').toBeGreaterThanOrEqual(15);
    expect(paddingTop, 'popup padding-top mismatch').toBeLessThanOrEqual(17);
    expect(paddingBottom, 'popup padding-bottom mismatch').toBeGreaterThanOrEqual(15);
    expect(paddingBottom, 'popup padding-bottom mismatch').toBeLessThanOrEqual(17);
    expect(paddingLeft, 'popup padding-left should be 0').toBeLessThanOrEqual(0.5);
    expect(paddingRight, 'popup padding-right should be 0').toBeLessThanOrEqual(0.5);

    const radiusTL = px(metrics.borderTopLeftRadius);
    const radiusTR = px(metrics.borderTopRightRadius);
    const radiusBL = px(metrics.borderBottomLeftRadius);
    const radiusBR = px(metrics.borderBottomRightRadius);
    expect(radiusTL, 'popup border-top-left-radius should be 8px').toBeGreaterThanOrEqual(7.5);
    expect(radiusTL, 'popup border-top-left-radius should be 8px').toBeLessThanOrEqual(8.5);
    expect(radiusBL, 'popup border-bottom-left-radius should be 8px').toBeGreaterThanOrEqual(7.5);
    expect(radiusBL, 'popup border-bottom-left-radius should be 8px').toBeLessThanOrEqual(8.5);
    expect(radiusTR, 'popup border-top-right-radius should be 0').toBeLessThanOrEqual(0.5);
    expect(radiusBR, 'popup border-bottom-right-radius should be 0').toBeLessThanOrEqual(0.5);

    const borderTopWidth = px(metrics.borderTopWidth);
    expect(borderTopWidth, 'popup border width should be 1px').toBeGreaterThanOrEqual(0.5);
    expect(borderTopWidth, 'popup border width should be 1px').toBeLessThanOrEqual(1.5);

    const borderRgb = parseRgb(metrics.borderTopColor);
    expect(borderRgb, `Unexpected borderTopColor: ${metrics.borderTopColor}`).not.toBeNull();
    if (borderRgb) {
      expect(borderRgb.r).toBeGreaterThanOrEqual(145);
      expect(borderRgb.r).toBeLessThanOrEqual(151);
      expect(borderRgb.g).toBeGreaterThanOrEqual(145);
      expect(borderRgb.g).toBeLessThanOrEqual(151);
      expect(borderRgb.b).toBeGreaterThanOrEqual(145);
      expect(borderRgb.b).toBeLessThanOrEqual(151);
    }

    expect(metrics.overflowY, 'popup overflow-y should be auto').toBe('auto');
  });

  test('Divider: margin-block=16px, inset=16px, reset-safe inline margin', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-category';
    await ensureMenuListBoxOpen(page, selector);

    const metrics = await page.evaluate((sel) => {
      const host = document.querySelector(sel);
      if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);
      const root = host.shadowRoot;
      if (!root) throw new Error(`Missing shadowRoot: ${sel}`);

      const popup = root.querySelector('[part="popup"]');
      if (!(popup instanceof HTMLElement)) throw new Error(`Missing popup: ${sel}`);

      const divider = host.querySelector('hr');
      if (!(divider instanceof HTMLElement)) throw new Error(`Missing <hr>: ${sel}`);

      const popupRect = popup.getBoundingClientRect();
      const hrRect = divider.getBoundingClientRect();
      const style = getComputedStyle(divider);

      return {
        leftInset: hrRect.left - popupRect.left,
        rightInset: popupRect.right - hrRect.right,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        borderTopWidth: style.borderTopWidth,
        inlineMarginBlock: divider.style.getPropertyValue('margin-block') || null,
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'category-divider', rects.union, testInfo);

    const marginTop = px(metrics.marginTop);
    const marginBottom = px(metrics.marginBottom);
    const borderTopWidth = px(metrics.borderTopWidth);

    expect(metrics.inlineMarginBlock, 'Expected divider to have inline margin-block for reset resilience').toContain(
      '--dads-menu-list-box-divider-margin-block',
    );

    expect(marginTop, `divider margin-top mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(15);
    expect(marginTop, `divider margin-top mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(17);
    expect(marginBottom, `divider margin-bottom mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(15);
    expect(marginBottom, `divider margin-bottom mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(17);
    expect(borderTopWidth, 'divider border-top-width should be 1px').toBeGreaterThanOrEqual(0.5);
    expect(borderTopWidth, 'divider border-top-width should be 1px').toBeLessThanOrEqual(1.5);

    expect(metrics.leftInset, `divider left inset mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(
      15,
    );
    expect(metrics.leftInset, `divider left inset mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(
      17,
    );
    expect(metrics.rightInset, `divider right inset mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeGreaterThanOrEqual(
      15,
    );
    expect(metrics.rightInset, `divider right inset mismatch. diagnostics=${JSON.stringify(diag.body)}`).toBeLessThanOrEqual(
      17,
    );
  });

  test('Menu items: reserve start-icon space when mixed icons exist', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-category';
    await ensureMenuListBoxOpen(page, selector);

    const metrics = await page.evaluate((sel) => {
      const host = document.querySelector(sel);
      if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);

      const hasReserve = host.hasAttribute('data-reserve-item-start-icon-space');

      const itemWithoutIcon = host.querySelector('dads-menu-list-item[data-value="item-1"]');
      if (!(itemWithoutIcon instanceof HTMLElement)) throw new Error(`Missing item-1: ${sel}`);
      const startIcon = itemWithoutIcon.shadowRoot?.querySelector('[part="start-icon"]');
      if (!(startIcon instanceof HTMLElement)) throw new Error(`Missing start-icon part: ${sel}`);

      const startIconStyle = getComputedStyle(startIcon);
      return {
        hasReserve,
        startIconDisplay: startIconStyle.display,
        startIconVisibility: startIconStyle.visibility,
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'category-reserve-start-icon', rects.union, testInfo);

    expect(metrics.hasReserve).toBe(true);
    expect(metrics.startIconDisplay).not.toBe('none');
    expect(metrics.startIconVisibility).toBe('hidden');
  });

  test('Current styles + vertical padding (bg/text/weight + padding-y)', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-category';
    await ensureMenuListBoxOpen(page, selector);

    const metrics = await page.evaluate((sel) => {
      const host = document.querySelector(sel);
      if (!(host instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);

      const currentItem = host.querySelector('dads-menu-list-item[current]');
      if (!(currentItem instanceof HTMLElement)) throw new Error(`Missing current item: ${sel}`);
      const currentBase = currentItem.shadowRoot?.querySelector('[part="base"]');
      if (!(currentBase instanceof HTMLElement)) throw new Error(`Missing current [part="base"]: ${sel}`);
      const currentStyle = getComputedStyle(currentBase);

      const normalItem = host.querySelector('dads-menu-list-item[data-value="item-3"]');
      if (!(normalItem instanceof HTMLElement)) throw new Error(`Missing normal item (item-3): ${sel}`);
      const normalBase = normalItem.shadowRoot?.querySelector('[part="base"]');
      if (!(normalBase instanceof HTMLElement)) throw new Error(`Missing normal [part="base"]: ${sel}`);
      const normalStyle = getComputedStyle(normalBase);

      return {
        current: {
          backgroundColor: currentStyle.backgroundColor,
          color: currentStyle.color,
          fontWeight: currentStyle.fontWeight,
          paddingTop: currentStyle.paddingTop,
          paddingBottom: currentStyle.paddingBottom,
          minHeight: currentStyle.minHeight,
        },
        normal: {
          backgroundColor: normalStyle.backgroundColor,
          color: normalStyle.color,
          fontWeight: normalStyle.fontWeight,
          paddingTop: normalStyle.paddingTop,
          paddingBottom: normalStyle.paddingBottom,
          minHeight: normalStyle.minHeight,
        },
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'current-styles', rects.union, testInfo);

    // DADS defaults (fallback values in menu-list-tokens.ts)
    const expectedBg = { r: 217, g: 230, b: 255, a: 1 }; // #d9e6ff
    const expectedText = { r: 0, g: 17, b: 143, a: 1 }; // #00118f

    const bg = parseRgb(metrics.current.backgroundColor);
    const text = parseRgb(metrics.current.color);
    expect(bg, `Unexpected current backgroundColor: ${metrics.current.backgroundColor}`).not.toBeNull();
    expect(text, `Unexpected current color: ${metrics.current.color}`).not.toBeNull();
    expect(bg?.r).toBe(expectedBg.r);
    expect(bg?.g).toBe(expectedBg.g);
    expect(bg?.b).toBe(expectedBg.b);
    expect(bg?.a).toBeGreaterThanOrEqual(0.99);

    expect(text?.r).toBe(expectedText.r);
    expect(text?.g).toBe(expectedText.g);
    expect(text?.b).toBe(expectedText.b);
    expect(text?.a).toBeGreaterThanOrEqual(0.99);

    expect(
      Number(metrics.current.fontWeight),
      `Unexpected current font-weight: ${metrics.current.fontWeight} diagnostics=${JSON.stringify(diag.body)}`,
    ).toBeGreaterThanOrEqual(700);

    const currentPaddingTop = px(metrics.current.paddingTop);
    const currentPaddingBottom = px(metrics.current.paddingBottom);
    const currentMinHeight = px(metrics.current.minHeight);
    expect(currentPaddingTop).toBeGreaterThanOrEqual(9);
    expect(currentPaddingTop).toBeLessThanOrEqual(11);
    expect(currentPaddingBottom).toBeGreaterThanOrEqual(9);
    expect(currentPaddingBottom).toBeLessThanOrEqual(11);
    expect(currentMinHeight).toBeGreaterThanOrEqual(43);
    expect(currentMinHeight).toBeLessThanOrEqual(45);

    // Non-current item should keep the same vertical padding (layout consistency).
    const normalPaddingTop = px(metrics.normal.paddingTop);
    const normalPaddingBottom = px(metrics.normal.paddingBottom);
    const normalMinHeight = px(metrics.normal.minHeight);
    expect(normalPaddingTop).toBeGreaterThanOrEqual(9);
    expect(normalPaddingTop).toBeLessThanOrEqual(11);
    expect(normalPaddingBottom).toBeGreaterThanOrEqual(9);
    expect(normalPaddingBottom).toBeLessThanOrEqual(11);
    expect(normalMinHeight).toBeGreaterThanOrEqual(43);
    expect(normalMinHeight).toBeLessThanOrEqual(45);
  });

  test('Description current label font-weight (label line)', async ({ page }, testInfo) => {
    await waitForComponentReady(page);

    const selector = '#demo-menu-list-box-description';
    await ensureMenuListBoxOpen(page, selector);

    const metrics = await page.evaluate((sel) => {
      const box = document.querySelector(sel);
      if (!(box instanceof HTMLElement)) throw new Error(`Missing element: ${sel}`);

      const currentItem = box.querySelector('dads-menu-list-item[current]');
      if (!(currentItem instanceof HTMLElement)) throw new Error(`Missing current item: ${sel}`);

      const normalItem = box.querySelector('dads-menu-list-item[data-value="2"]');
      if (!(normalItem instanceof HTMLElement)) throw new Error(`Missing item-2: ${sel}`);

      const findLabelLine = (item: HTMLElement): HTMLElement => {
        const column = item.querySelector('span[style*="flex-direction: column"]');
        if (!(column instanceof HTMLElement)) throw new Error('Missing column container');
        const labelLine = column.querySelector(':scope > span');
        if (!(labelLine instanceof HTMLElement)) throw new Error('Missing label line');
        return labelLine;
      };

      const currentLabel = findLabelLine(currentItem);
      const normalLabel = findLabelLine(normalItem);

      const currentStyle = getComputedStyle(currentLabel);
      const normalStyle = getComputedStyle(normalLabel);

      return {
        current: {
          text: (currentLabel.textContent ?? '').trim(),
          fontWeight: currentStyle.fontWeight,
          color: currentStyle.color,
        },
        normal: {
          text: (normalLabel.textContent ?? '').trim(),
          fontWeight: normalStyle.fontWeight,
          color: normalStyle.color,
        },
      };
    }, selector);

    const diag = await getFontDiagnostics(page, selector);
    await testInfo.attach('font-diagnostics', {
      body: JSON.stringify(diag, null, 2),
      contentType: 'application/json',
    });
    await testInfo.attach('label-line-metrics', {
      body: JSON.stringify(metrics, null, 2),
      contentType: 'application/json',
    });

    const rects = await getMenuListBoxRects(page, selector);
    await attachScreenshot(page, 'description-current-label', rects.union, testInfo);

    const currentWeight = Number(metrics.current.fontWeight);
    expect(
      currentWeight,
      `Unexpected current label font-weight: ${metrics.current.fontWeight} diagnostics=${JSON.stringify(diag.body)}`,
    ).toBeGreaterThanOrEqual(700);
  });

  test('Figma overlay evidence (7 nodes; requires `FIGMA_ACCESS_TOKEN` sync)', async ({ page }, testInfo) => {
    const root = repoRoot();
    const cfgPath = path.join(root, 'resources/dads/components/menu-list-box/figma/config.json');
    const imagesDir = path.join(root, 'resources/dads/components/menu-list-box/figma/images');

    // Skip if Figma resources directory doesn't exist (resources/dads removed from PR)
    test.skip(
      !fs.existsSync(cfgPath),
      `Figma config not found at ${cfgPath}; resources/dads may have been removed or sync not run`,
    );

    const cfg = readJson<{ export?: { scale?: number; format?: string } }>(cfgPath);
    const exportScale = Number(cfg.export?.scale ?? 2);
    const exportFormat = String(cfg.export?.format ?? 'png');

    // 7-node complete coverage
    const cases: { nodeId: string; selector: string; open: boolean; hover?: boolean }[] = [
      { nodeId: '8263:19766', selector: '#demo-menu-list-box-figma-19766', open: true },
      { nodeId: '8263:19774', selector: '#demo-menu-list-box-item-icons', open: true },
      { nodeId: '8263:19781', selector: '#demo-menu-list-box-figma-19781', open: true },
      { nodeId: '8263:19788', selector: '#demo-menu-list-box-figma-19788', open: true, hover: true },
      { nodeId: '8263:19800', selector: '#demo-menu-list-box-figma-19800', open: true },
      { nodeId: '8263:19815', selector: '#demo-menu-list-box-category', open: true },
      { nodeId: '8263:19832', selector: '#demo-menu-list-box-figma-19832', open: true },
    ];

    const existing = cases.filter(({ nodeId }) => {
      const baseName = `${safeFigmaId(nodeId)}@${exportScale}x.${exportFormat}`;
      return fs.existsSync(path.join(imagesDir, baseName));
    });

    // Skip if no images exist (FIGMA_ACCESS_TOKEN not set / sync not run)
    test.skip(
      existing.length === 0,
      `Figma images not found under resources; set FIGMA_ACCESS_TOKEN and run: npm run dads:sync -- --component menu-list-box --force`,
    );

    // Fail if some images are missing (partial sync state is an error)
    const missingNodes = cases.filter(({ nodeId }) => {
      const baseName = `${safeFigmaId(nodeId)}@${exportScale}x.${exportFormat}`;
      return !fs.existsSync(path.join(imagesDir, baseName));
    });

    if (missingNodes.length > 0) {
      const missingList = missingNodes.map((c) => c.nodeId).join(', ');
      throw new Error(
        `Figma images missing for nodes: ${missingList}. Run: npm run dads:sync -- --component menu-list-box --force`,
      );
    }

    await waitForComponentReady(page);

    for (const c of cases) {
      const baseName = `${safeFigmaId(c.nodeId)}@${exportScale}x.${exportFormat}`;
      const figmaPath = path.join(imagesDir, baseName);

      if (c.open) await ensureMenuListBoxOpen(page, c.selector);

      // Optional hover for scrollbar demo (Figma shows hover underline)
      if (c.hover) {
        const firstItem = page.locator(c.selector).locator('dads-menu-list-item').first();
        await firstItem.hover();
        await page.waitForTimeout(100); // Allow hover state to render
      }

      const figmaPng = fs.readFileSync(figmaPath);
      const { png: renderedPng } = await captureMenuListBoxUnionPng(page, c.selector);

      const overlays = await buildOverlayPngs(page, figmaPng, renderedPng);

      await testInfo.attach(`figma-${safeFigmaId(c.nodeId)}`, { body: figmaPng, contentType: 'image/png' });
      await testInfo.attach(`rendered-${safeFigmaId(c.nodeId)}`, { body: renderedPng, contentType: 'image/png' });
      await testInfo.attach(`overlay-alpha-${safeFigmaId(c.nodeId)}`, { body: overlays.alpha, contentType: 'image/png' });
      await testInfo.attach(`overlay-diff-${safeFigmaId(c.nodeId)}`, { body: overlays.diff, contentType: 'image/png' });
    }
  });
});
