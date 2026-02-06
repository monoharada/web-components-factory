import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 } });

async function gotoListFidelity(page: Page) {
  await page.goto('/?nosw=1&a11y=0&component=listFidelity');

  // Fail fast if the wrong server/page is running on localhost:3000.
  await expect(page.locator('#demo-list-unordered-spacing-lg')).toBeVisible({ timeout: 15_000 });

  await page.waitForFunction(() => customElements.get('dads-list') !== undefined, null, { timeout: 15_000 });
  await page.waitForFunction(() => customElements.get('dads-list-item') !== undefined, null, { timeout: 15_000 });

  // Stabilize text rendering before screenshots.
  await page.evaluate(async () => {
    const fonts = (document as unknown as { fonts?: { ready?: Promise<void> } }).fonts;
    if (!fonts?.ready) return;
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  });
}

function repoRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function safeFigmaId(id: string): string {
  return String(id).replace(/:/g, '-');
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

async function buildOverlayAndDiffRatio(
  page: Page,
  figmaPng: Buffer,
  renderedPng: Buffer,
): Promise<{ alpha: Buffer; diff: Buffer; diffRatio: number }> {
  const figmaB64 = figmaPng.toString('base64');
  const renderedB64 = renderedPng.toString('base64');

  const result = await page.evaluate(async ({ figmaB64: a, renderedB64: b }) => {
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

    const figmaCanvas = create();
    figmaCanvas.ctx.fillStyle = '#fff';
    figmaCanvas.ctx.fillRect(0, 0, width, height);
    figmaCanvas.ctx.drawImage(figmaImg, 0, 0, width, height);

    const renderedCanvas = create();
    renderedCanvas.ctx.fillStyle = '#fff';
    renderedCanvas.ctx.fillRect(0, 0, width, height);
    renderedCanvas.ctx.drawImage(renderedImg, 0, 0);

    const aData = figmaCanvas.ctx.getImageData(0, 0, width, height).data;
    const bData = renderedCanvas.ctx.getImageData(0, 0, width, height).data;
    const threshold = 16;
    let diffCount = 0;

    for (let i = 0; i < aData.length; i += 4) {
      const dr = Math.abs(aData[i] - bData[i]);
      const dg = Math.abs(aData[i + 1] - bData[i + 1]);
      const db = Math.abs(aData[i + 2] - bData[i + 2]);
      const da = Math.abs(aData[i + 3] - bData[i + 3]);
      if (dr > threshold || dg > threshold || db > threshold || da > threshold) diffCount += 1;
    }

    const totalPixels = width * height;
    const diffRatio = totalPixels > 0 ? diffCount / totalPixels : 1;

    const alphaCanvas = create();
    alphaCanvas.ctx.fillStyle = '#fff';
    alphaCanvas.ctx.fillRect(0, 0, width, height);
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(figmaImg, 0, 0, width, height);
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(renderedImg, 0, 0, width, height);
    alphaCanvas.ctx.globalAlpha = 1;

    const diffCanvas = create();
    diffCanvas.ctx.fillStyle = '#fff';
    diffCanvas.ctx.fillRect(0, 0, width, height);
    diffCanvas.ctx.drawImage(figmaImg, 0, 0, width, height);
    diffCanvas.ctx.globalCompositeOperation = 'difference';
    diffCanvas.ctx.drawImage(renderedImg, 0, 0, width, height);
    diffCanvas.ctx.globalCompositeOperation = 'source-over';

    return {
      diffRatio,
      alpha: alphaCanvas.canvas.toDataURL('image/png'),
      diff: diffCanvas.canvas.toDataURL('image/png'),
    };
  }, {
    figmaB64,
    renderedB64,
  });

  const toBuffer = (dataUrl: string): Buffer => Buffer.from(dataUrl.split(',')[1] ?? '', 'base64');
  return { diffRatio: result.diffRatio, alpha: toBuffer(result.alpha), diff: toBuffer(result.diff) };
}

test('list fidelity: unordered (marker) spacing variants', async ({ page }) => {
  test.setTimeout(60_000);

  await gotoListFidelity(page);

  const unorderedLg = page.locator('#demo-list-unordered-spacing-lg').first();
  await expect(unorderedLg).toBeVisible({ timeout: 15_000 });
  await expect(unorderedLg).toHaveScreenshot('unordered-spacing-lg-8263-22351.png', { maxDiffPixelRatio: 0.01 });

  const unorderedMd = page.locator('#demo-list-unordered-spacing-md').first();
  await expect(unorderedMd).toBeVisible({ timeout: 15_000 });
  await expect(unorderedMd).toHaveScreenshot('unordered-spacing-md-8263-22341.png', { maxDiffPixelRatio: 0.01 });

  const unorderedSm = page.locator('#demo-list-unordered-spacing-sm').first();
  await expect(unorderedSm).toBeVisible({ timeout: 15_000 });
  await expect(unorderedSm).toHaveScreenshot('unordered-spacing-sm-8263-22430.png', { maxDiffPixelRatio: 0.01 });
});

test('list fidelity: ordered (number) spacing variants', async ({ page }) => {
  test.setTimeout(60_000);

  await gotoListFidelity(page);

  const orderedLg = page.locator('#demo-list-ordered-spacing-lg').first();
  await expect(orderedLg).toBeVisible({ timeout: 15_000 });
  await expect(orderedLg).toHaveScreenshot('ordered-spacing-lg-8263-22408.png', { maxDiffPixelRatio: 0.01 });

  const orderedMd = page.locator('#demo-list-ordered-spacing-md').first();
  await expect(orderedMd).toBeVisible({ timeout: 15_000 });
  await expect(orderedMd).toHaveScreenshot('ordered-spacing-md-8263-22397.png', { maxDiffPixelRatio: 0.01 });

  const orderedSm = page.locator('#demo-list-ordered-spacing-sm').first();
  await expect(orderedSm).toBeVisible({ timeout: 15_000 });
  await expect(orderedSm).toHaveScreenshot('ordered-spacing-sm-8263-22419.png', { maxDiffPixelRatio: 0.01 });
});

test('list fidelity: compare rendered vs Figma images', async ({ page }, testInfo) => {
  test.setTimeout(90_000);

  const root = repoRoot();
  const figmaRoot = path.join(root, 'resources/dads/components/list/figma');
  const cfgPath = path.join(figmaRoot, 'config.json');
  const imagesDir = path.join(figmaRoot, 'images');

  test.skip(!fs.existsSync(cfgPath), `Figma config not found: ${cfgPath}`);

  const cfg = readJson<{ export?: { scale?: number; format?: string } }>(cfgPath);
  const scale = Number(cfg.export?.scale ?? 2);
  const format = String(cfg.export?.format ?? 'png');

  const cases: { nodeId: string; selector: string }[] = [
    { nodeId: '8263:22351', selector: '#demo-list-unordered-spacing-lg' },
    { nodeId: '8263:22341', selector: '#demo-list-unordered-spacing-md' },
    { nodeId: '8263:22430', selector: '#demo-list-unordered-spacing-sm' },
    { nodeId: '8263:22408', selector: '#demo-list-ordered-spacing-lg' },
    { nodeId: '8263:22397', selector: '#demo-list-ordered-spacing-md' },
    { nodeId: '8263:22419', selector: '#demo-list-ordered-spacing-sm' },
  ];

  const missing = cases.filter((c) => {
    const file = `${safeFigmaId(c.nodeId)}@${scale}x.${format}`;
    return !fs.existsSync(path.join(imagesDir, file));
  });
  test.skip(missing.length > 0, `Missing Figma image(s): ${missing.map((m) => m.nodeId).join(', ')}`);

  await gotoListFidelity(page);

  const summary: { nodeId: string; selector: string; diffRatio: number }[] = [];
  for (const c of cases) {
    const figmaFile = `${safeFigmaId(c.nodeId)}@${scale}x.${format}`;
    const figmaPng = fs.readFileSync(path.join(imagesDir, figmaFile));

    const target = page.locator(c.selector).first();
    await expect(target).toBeVisible({ timeout: 15_000 });
    const renderedPng = await target.screenshot();

    const overlays = await buildOverlayAndDiffRatio(page, figmaPng, renderedPng);
    summary.push({ nodeId: c.nodeId, selector: c.selector, diffRatio: overlays.diffRatio });

    await testInfo.attach(`figma-${safeFigmaId(c.nodeId)}`, { body: figmaPng, contentType: 'image/png' });
    await testInfo.attach(`rendered-${safeFigmaId(c.nodeId)}`, { body: renderedPng, contentType: 'image/png' });
    await testInfo.attach(`overlay-alpha-${safeFigmaId(c.nodeId)}`, { body: overlays.alpha, contentType: 'image/png' });
    await testInfo.attach(`overlay-diff-${safeFigmaId(c.nodeId)}`, { body: overlays.diff, contentType: 'image/png' });

    // A practical guardrail: fail only when visual drift is clearly large.
    expect(overlays.diffRatio, `Large drift on ${c.nodeId}`).toBeLessThan(0.3);
  }

  await testInfo.attach('figma-diff-summary', {
    body: JSON.stringify(summary, null, 2),
    contentType: 'application/json',
  });
});
