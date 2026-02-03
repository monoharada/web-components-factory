import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

type IconOption = Readonly<{
  label: string;
  value: string;
}>;

function sanitizeFileSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

test.describe('dads-heading icon alignment', () => {
  test('captures each icon and checks vertical alignment against text', async ({ page }, testInfo) => {
    await page.goto('/?nosw=1&component=heading');

    const panel = page.locator('.wc-api-panel');
    await expect(panel).toBeVisible();

    // Ensure icon preset so the demo inserts a slotted icon.
    const preset = panel.locator('select[data-api-attr="data-demo-variant"]');
    await expect(preset).toBeVisible();
    await preset.selectOption('icon');

    const host = panel.locator('dads-heading[data-api-target]');
    await expect(host).toBeVisible();

    // Icon selector controls the path[d] and its option labels are the icon names.
    const iconSelect = panel.locator('select[data-api-attr="d"][data-api-target-selector*="icon"]');
    await expect(iconSelect).toBeVisible();

    const options: IconOption[] = await iconSelect.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.options).map((o) => ({
        label: (o.textContent ?? '').trim(),
        value: o.value,
      }));
    });

    const results: Array<
      Readonly<{
        label: string;
        centerDiffPx: number;
        iconHeightPx: number;
        fontSizePx: number;
        iconToFontRatio: number;
      }>
    > = [];

    // Keep the screenshot consistent: capture the preview wrapper of the heading.
    const previewBox = host.locator('..');
    await expect(previewBox).toBeVisible();

    for (const opt of options) {
      // Some selects include "(unset)" options; skip if it doesn't represent an icon.
      if (!opt.label || opt.label === '(unset)') continue;

      await iconSelect.selectOption(opt.value);

      // Wait until the slotted SVG/path is present and applied.
      await expect(host.locator('svg[slot="icon"] path')).toHaveAttribute('d', opt.value);

      const metrics = await host.evaluate((el) => {
        const hostEl = el as HTMLElement;
        const svg = hostEl.querySelector('svg[slot="icon"]');
        if (!svg) {
          return {
            centerDiffPx: NaN,
            iconHeightPx: NaN,
            fontSizePx: NaN,
            iconToFontRatio: NaN,
          };
        }

        // The demo keeps heading text as a direct Text node child of the host.
        // Measure its visual rect via Range to exclude the icon box.
        const textNode = Array.from(hostEl.childNodes).find((n) => {
          if (n.nodeType !== Node.TEXT_NODE) return false;
          const t = n.textContent ?? '';
          return t.trim().length > 0;
        });

        const textRect = (() => {
          if (!textNode) return null;
          const range = document.createRange();
          range.selectNodeContents(textNode);
          const rect = range.getBoundingClientRect();
          range.detach?.();
          return rect;
        })();

        const svgRect = svg.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(hostEl).fontSize) || NaN;

        const iconCenterY = svgRect.top + svgRect.height / 2;
        const textCenterY = textRect ? textRect.top + textRect.height / 2 : NaN;
        const centerDiff = iconCenterY - textCenterY;

        return {
          centerDiffPx: centerDiff,
          iconHeightPx: svgRect.height,
          fontSizePx: fontSize,
          iconToFontRatio: svgRect.height / fontSize,
        };
      });

      results.push({ label: opt.label, ...metrics });

      const fileName = `${sanitizeFileSegment(opt.label)}.png`;
      const outPath = testInfo.outputPath('heading-icons', fileName);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      await previewBox.screenshot({ path: outPath });
      await testInfo.attach(`heading-icon:${opt.label}`, { path: outPath, contentType: 'image/png' });
    }

    const summaryPath = testInfo.outputPath('heading-icons', 'metrics.json');
    fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');
    await testInfo.attach('heading-icon-metrics', { path: summaryPath, contentType: 'application/json' });

    // Heuristic threshold: we expect the icon center to be close to the text center.
    // (Visual baseline alignment differs per glyph, so allow a small tolerance.)
    const MISALIGN_THRESHOLD_PX = 2.5;
    const misaligned = results.filter((r) => Number.isFinite(r.centerDiffPx) && Math.abs(r.centerDiffPx) > MISALIGN_THRESHOLD_PX);

    expect(
      misaligned,
      `Misaligned icons (|centerDiffPx| > ${MISALIGN_THRESHOLD_PX}): ${misaligned
        .map((m) => `${m.label}(${m.centerDiffPx.toFixed(2)}px)`)
        .join(', ')}`
    ).toEqual([]);
  });
});

