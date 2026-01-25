import { expect, test } from '@playwright/test';

test('dads-search-box controls are at least 44px tall', async ({ page }) => {
  await page.goto('/?nosw=1&component=searchBox');

  const host = page.locator('dads-search-box[data-api-target]');
  await expect(host).toBeVisible();

  const scopeSelect = host.locator('[part="scope-select"]');
  const queryInput = host.locator('[part="input"]');
  const submitButton = host.locator('[part="button"]');

  await expect(scopeSelect).toBeVisible();
  await expect(queryInput).toBeVisible();
  await expect(submitButton).toBeVisible();

  const minHeightPx = 44;

  const [scopeBox, inputBox, buttonBox] = await Promise.all([
    scopeSelect.boundingBox(),
    queryInput.boundingBox(),
    submitButton.boundingBox(),
  ]);

  expect(scopeBox?.height ?? 0).toBeGreaterThanOrEqual(minHeightPx);
  expect(inputBox?.height ?? 0).toBeGreaterThanOrEqual(minHeightPx);
  expect(buttonBox?.height ?? 0).toBeGreaterThanOrEqual(minHeightPx);
});
