import { expect, test } from '@playwright/test';

test('dads-card horizontal layout keeps a usable main width', async ({ page }) => {
  await page.goto('/?nosw=1&component=card');

  const host = page.locator('dads-card[data-api-target]');
  await expect(host).toBeVisible();

  const panel = page.locator('.wc-api-panel').filter({ has: host }).first();
  const layoutControl = panel.locator('select[data-api-attr="layout"]');
  await expect(layoutControl).toBeVisible();

  // Switch via API controls so we know the binder is active.
  await layoutControl.selectOption('horizontal');
  await expect(host).toHaveAttribute('layout', 'horizontal');

  const media = host.locator('[part="media"]');
  const main = host.locator('[part="main"]');

  await expect(media).toBeVisible();
  await expect(main).toBeVisible();

  const [hostBox, mediaBox, mainBox] = await Promise.all([
    host.boundingBox(),
    media.boundingBox(),
    main.boundingBox(),
  ]);

  const hostWidth = hostBox?.width ?? 0;
  const mediaWidth = mediaBox?.width ?? 0;
  const mainWidth = mainBox?.width ?? 0;

  expect(hostWidth).toBeGreaterThan(0);
  expect(mediaWidth).toBeGreaterThan(0);
  expect(mainWidth).toBeGreaterThan(0);

  // DADS: horizontal layout should cap the media column by percentage so main doesn't collapse.
  expect(mediaWidth).toBeLessThanOrEqual(hostWidth * 0.55);
  expect(mainWidth).toBeGreaterThanOrEqual(hostWidth * 0.45);

  // Content controls: update slotted title text via textContent.
  const titleControl = panel.locator('dads-input-text[label="title text"]');
  await expect(titleControl).toBeVisible();

  await titleControl.locator('[part="input"]').fill('変更後タイトル');
  await expect(host.locator('a[slot="title"]')).toHaveText('変更後タイトル');
});
