import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 } });

type StorybookEntryWithFiles = {
  id?: string;
  name?: string;
  type?: string;
  files?: {
    canvasHtml?: string;
  };
};

type DescriptionListManifest = {
  storybook?: {
    entries?: StorybookEntryWithFiles[];
    files?: {
      entries?: string;
    };
  };
};

function repoRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function resolveStorybookArtifacts(): {
  storyHtml: string;
  scopedCss: string;
} {
  const root = repoRoot();
  const componentRoot = path.join(root, 'resources/dads/components/description-list');
  const manifestPath = path.join(componentRoot, 'manifest.json');
  const cssPath = path.join(
    componentRoot,
    'upstream/design-system-example-components-html/src/components/description-list/description-list.css',
  );

  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Missing ${manifestPath}. Run: npm run dads:sync -- --component description-list --force`,
    );
  }
  if (!fs.existsSync(cssPath)) {
    throw new Error(`Missing ${cssPath}. Run dads sync again.`);
  }

  const manifest = readJson<DescriptionListManifest>(manifestPath);
  const entriesRel = manifest.storybook?.files?.entries ?? 'storybook/entries.json';
  const entriesPath = path.join(componentRoot, entriesRel);
  if (!fs.existsSync(entriesPath)) {
    throw new Error(`Missing ${entriesPath}. Run dads sync again.`);
  }

  const storybookEntry = manifest.storybook?.entries?.find(
    (entry) =>
      entry.id === 'components-説明リスト--playground' ||
      (entry.type === 'story' && entry.name === 'Playground'),
  );
  const storyHtmlRel = storybookEntry?.files?.canvasHtml;
  if (!storyHtmlRel) {
    throw new Error(
      `Could not resolve canvasHtml for Storybook Playground from ${manifestPath}.`,
    );
  }

  const storyHtmlPath = path.join(componentRoot, storyHtmlRel);
  if (!fs.existsSync(storyHtmlPath)) {
    throw new Error(`Missing ${storyHtmlPath}. Run dads sync again.`);
  }

  const storyHtml = fs.readFileSync(storyHtmlPath, 'utf8');
  const rawCss = fs.readFileSync(cssPath, 'utf8');
  const scopedCss = rawCss.replaceAll(
    '.dads-description-list',
    '#demo-description-list-storybook .dads-description-list',
  );

  return { storyHtml, scopedCss };
}

async function gotoDescriptionListFidelity(page: Page): Promise<void> {
  await page.goto('/?nosw=1&a11y=0&component=descriptionListFidelity');
  await expect(page.locator('#demo-description-list-playground')).toBeVisible({ timeout: 15_000 });
  await page.waitForFunction(() => customElements.get('dads-description-list') !== undefined, null, {
    timeout: 15_000,
  });
  await page.evaluate(async () => {
    const fonts = (document as unknown as { fonts?: { ready?: Promise<void> } }).fonts;
    if (!fonts?.ready) return;
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  });
  // viewer.html の :defined フェードイン完了待ち（半透明キャプチャによる擬似差分を防止）
  await page.waitForFunction(() => {
    const target = document.querySelector('#demo-description-list-playground');
    if (!(target instanceof HTMLElement)) return false;
    return Number.parseFloat(getComputedStyle(target).opacity) >= 0.999;
  }, null, {
    timeout: 15_000,
  });
}

async function mountStorybookReference(
  page: Page,
  source: { storyHtml: string; scopedCss: string },
): Promise<void> {
  await page.evaluate(({ storyHtml, scopedCss }) => {
    const styleId = 'description-list-storybook-reference-style';
    const hostId = 'description-list-storybook-reference-host';

    let style = document.getElementById(styleId);
    if (!(style instanceof HTMLStyleElement)) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.append(style);
    }
    style.textContent = scopedCss;

    let host = document.getElementById(hostId);
    if (!(host instanceof HTMLDivElement)) {
      host = document.createElement('div');
      host.id = hostId;
      host.style.marginTop = '24px';
      const container = document.getElementById('component-container') ?? document.body;
      container.append(host);
    }

    host.innerHTML = `
      <div id="demo-description-list-storybook" style="inline-size: 760px; max-inline-size: 100%;">
        ${storyHtml}
      </div>
    `;
  }, source);
}

async function buildOverlayAndDiffRatio(
  page: Page,
  baselinePng: Buffer,
  renderedPng: Buffer,
): Promise<{ alpha: Buffer; diff: Buffer; diffRatio: number; sizeMismatch: boolean }> {
  const baselineB64 = baselinePng.toString('base64');
  const renderedB64 = renderedPng.toString('base64');

  const result = await page.evaluate(async ({ baselineB64: a, renderedB64: b }) => {
    const load = (b64: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image decode failed'));
        img.src = `data:image/png;base64,${b64}`;
      });

    const [baselineImg, renderedImg] = await Promise.all([load(a), load(b)]);
    const sizeMismatch =
      baselineImg.width !== renderedImg.width || baselineImg.height !== renderedImg.height;

    const width = Math.max(baselineImg.width, renderedImg.width);
    const height = Math.max(baselineImg.height, renderedImg.height);

    const create = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Missing canvas context');
      return { canvas, ctx };
    };

    const baselineCanvas = create();
    baselineCanvas.ctx.fillStyle = '#fff';
    baselineCanvas.ctx.fillRect(0, 0, width, height);
    baselineCanvas.ctx.drawImage(baselineImg, 0, 0);

    const renderedCanvas = create();
    renderedCanvas.ctx.fillStyle = '#fff';
    renderedCanvas.ctx.fillRect(0, 0, width, height);
    renderedCanvas.ctx.drawImage(renderedImg, 0, 0);

    const aData = baselineCanvas.ctx.getImageData(0, 0, width, height).data;
    const bData = renderedCanvas.ctx.getImageData(0, 0, width, height).data;
    let diffCount = 0;

    for (let i = 0; i < aData.length; i += 4) {
      if (
        aData[i] !== bData[i] ||
        aData[i + 1] !== bData[i + 1] ||
        aData[i + 2] !== bData[i + 2] ||
        aData[i + 3] !== bData[i + 3]
      ) {
        diffCount += 1;
      }
    }

    const totalPixels = width * height;
    const diffRatio = totalPixels > 0 ? diffCount / totalPixels : 1;

    const alphaCanvas = create();
    alphaCanvas.ctx.fillStyle = '#fff';
    alphaCanvas.ctx.fillRect(0, 0, width, height);
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(baselineImg, 0, 0);
    alphaCanvas.ctx.globalAlpha = 0.55;
    alphaCanvas.ctx.drawImage(renderedImg, 0, 0);
    alphaCanvas.ctx.globalAlpha = 1;

    const diffCanvas = create();
    diffCanvas.ctx.fillStyle = '#fff';
    diffCanvas.ctx.fillRect(0, 0, width, height);
    diffCanvas.ctx.drawImage(baselineImg, 0, 0);
    diffCanvas.ctx.globalCompositeOperation = 'difference';
    diffCanvas.ctx.drawImage(renderedImg, 0, 0);
    diffCanvas.ctx.globalCompositeOperation = 'source-over';

    return {
      sizeMismatch,
      diffRatio,
      alpha: alphaCanvas.canvas.toDataURL('image/png'),
      diff: diffCanvas.canvas.toDataURL('image/png'),
    };
  }, {
    baselineB64,
    renderedB64,
  });

  const toBuffer = (dataUrl: string): Buffer => Buffer.from(dataUrl.split(',')[1] ?? '', 'base64');
  return {
    sizeMismatch: result.sizeMismatch,
    diffRatio: result.diffRatio,
    alpha: toBuffer(result.alpha),
    diff: toBuffer(result.diff),
  };
}

test('description-list fidelity: storybook playground and component are pixel-perfect', async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);

  const storybook = resolveStorybookArtifacts();
  await gotoDescriptionListFidelity(page);
  await mountStorybookReference(page, storybook);

  const storybookLocator = page.locator('#demo-description-list-storybook .dads-description-list').first();
  const componentLocator = page.locator('#demo-description-list-playground').first();

  await expect(storybookLocator).toBeVisible({ timeout: 15_000 });
  await expect(componentLocator).toBeVisible({ timeout: 15_000 });

  const storybookPng = await storybookLocator.screenshot();
  const componentPng = await componentLocator.screenshot();

  const overlays = await buildOverlayAndDiffRatio(page, storybookPng, componentPng);

  await testInfo.attach('storybook-reference', { body: storybookPng, contentType: 'image/png' });
  await testInfo.attach('component-rendered', { body: componentPng, contentType: 'image/png' });
  await testInfo.attach('overlay-alpha', { body: overlays.alpha, contentType: 'image/png' });
  await testInfo.attach('overlay-diff', { body: overlays.diff, contentType: 'image/png' });

  expect(overlays.sizeMismatch, 'Rendered size differs between Storybook and component').toBe(false);
  expect(overlays.diffRatio, 'Pixel diff must be exactly zero').toBe(0);

  await expect(componentLocator).toHaveScreenshot('description-list-playground-component.png', {
    maxDiffPixels: 0,
  });
});
