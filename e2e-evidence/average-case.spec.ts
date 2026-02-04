import { expect, test } from '@playwright/test';

test('averageCase.html loads required components (lazy heavy parts)', async ({ page }) => {
  const response = await page.goto('/averageCase.html?nosw=1');
  expect(response?.ok()).toBeTruthy();

  const eagerSelectors = [
    'dads-button',
    'dads-input-text',
    'dads-select',
    'dads-textarea',
    'dads-checkbox',
    'dads-radio',
    'dads-fieldset',
    'dads-card',
  ];

  for (const selector of eagerSelectors) {
    const locator = page.locator(selector).first();
    await expect(locator).toBeVisible();
    const isDefined = await locator.evaluate((node) => node.matches(':defined'));
    expect(isDefined).toBe(true);
  }

  const lazySelectors = [
    'dads-date-picker',
    'dads-table',
    'dads-page-navigation',
  ];

  for (const selector of lazySelectors) {
    const locator = page.locator(selector).first();
    await expect(locator).toBeAttached();
    const isDefined = await locator.evaluate((node) => node.matches(':defined'));
    expect(isDefined).toBe(false);
  }

  await page.locator('dads-date-picker').click({ force: true });
  await page.locator('dads-page-navigation').scrollIntoViewIfNeeded();

  for (const selector of lazySelectors) {
    await page.waitForFunction((tagName) => {
      const el = document.querySelector(tagName);
      return Boolean(el && el.matches(':defined'));
    }, selector);
  }
});
