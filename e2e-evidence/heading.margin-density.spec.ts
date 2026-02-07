import { expect, test } from '@playwright/test';

test.describe('dads-heading margin density', () => {
  test('margin=top は 1lh -> 1em で実寸が縮小する', async ({ page }) => {
    await page.goto('/?nosw=1&component=heading');

    const panel = page.locator('.wc-api-panel');
    await expect(panel).toBeVisible();

    const host = panel.locator('dads-heading[data-api-target]');
    await expect(host).toBeVisible();

    await page.evaluate(() => {
      const target = document.querySelector('.wc-api-panel dads-heading[data-api-target]');
      if (!(target instanceof HTMLElement)) return;
      target.setAttribute('margin', 'top');
      target.style.setProperty('--dads-heading-margin-block-start', '1lh');
    });

    const group = host.locator('[part="group"]');
    await expect(group).toBeVisible();
    const normalPx = await group.evaluate((el) => parseFloat(getComputedStyle(el).marginTop));

    await page.evaluate(() => {
      const target = document.querySelector('.wc-api-panel dads-heading[data-api-target]');
      if (!(target instanceof HTMLElement)) return;
      target.style.setProperty('--dads-heading-margin-block-start', '1em');
    });

    const compactPx = await group.evaluate((el) => parseFloat(getComputedStyle(el).marginTop));
    expect(normalPx).toBeGreaterThan(0);
    expect(compactPx).toBeGreaterThan(0);
    expect(compactPx).toBeLessThan(normalPx);
  });
});
