import { expect, test } from '@playwright/test';

test.describe('dads-heading demo controls', () => {
  test('shoulderText control updates the shoulder slot in Preview', async ({ page }) => {
    await page.goto('/?nosw=1&component=heading');

    const panel = page.locator('.wc-api-panel');
    await expect(panel).toBeVisible();

    // Ensure the demo is in shoulder preset so the slot exists and Usage is minimal.
    const preset = panel.locator('select[data-api-attr="data-demo-variant"]');
    await expect(preset).toBeVisible();
    await preset.selectOption('shoulder');

    const host = panel.locator('dads-heading[data-api-target]');
    await expect(host).toBeVisible();

    const shoulderControlInput = panel.locator(
      'dads-input-text[label="shoulderText"] [part="input"]'
    );
    await expect(shoulderControlInput).toBeVisible();

    const next = 'ショルダー-aaaa';
    await shoulderControlInput.fill(next);

    // Preview should update the actual slot node.
    await expect(host.locator('[slot="shoulder"]')).toHaveText(next);

    // Usage snippet should also reflect the latest shoulder text.
    const code = panel.locator('dads-code-block');
    await expect(code).toContainText(next);
  });

  test('margin=top adds top spacing in Preview', async ({ page }) => {
    await page.goto('/?nosw=1&component=heading');

    const panel = page.locator('.wc-api-panel');
    await expect(panel).toBeVisible();

    const host = panel.locator('dads-heading[data-api-target]');
    await expect(host).toBeVisible();

    const marginSelect = panel.locator('select[data-api-attr="margin"]');
    await expect(marginSelect).toBeVisible();

    const group = host.locator('[part="group"]');
    await expect(group).toBeVisible();

    // Default is none => no margin.
    await marginSelect.selectOption('none');
    const noneMargin = await group.evaluate((el) => getComputedStyle(el).marginTop);
    expect(parseFloat(noneMargin)).toBe(0);

    // top => >0 (visual space before heading).
    await marginSelect.selectOption('top');
    const topMargin = await group.evaluate((el) => getComputedStyle(el).marginTop);
    expect(parseFloat(topMargin)).toBeGreaterThan(0);
  });
});
