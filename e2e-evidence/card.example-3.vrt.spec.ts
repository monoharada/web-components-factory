import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 } });

test('card example 3 matches DADS Storybook layout', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/?nosw=1&component=card');

  await page.waitForFunction(() => customElements.get('dads-card') !== undefined);
  await page
    .waitForFunction(
      () => {
        const cls = document.body.classList;
        return cls.contains('fonts-loaded') || cls.contains('fonts-error');
      },
      undefined,
      { timeout: 5000 },
    )
    .catch(() => {});

  const list = page.locator('.card-example-3-list');
  await expect(list).toBeVisible({ timeout: 15000 });
  await list.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const apiPanel = page.locator('section.card-demo-section', {
    hasText: 'API / Controls',
  });
  await expect(apiPanel).toBeVisible();

  const previewHeading = apiPanel.locator('h4', { hasText: 'Preview' });
  await expect(previewHeading).toBeVisible();
  const previewInAccordion = await previewHeading.evaluate((el) =>
    Boolean(el.closest('dads-accordion-item-details')),
  );
  expect(previewInAccordion).toBe(false);

  const usageHeading = apiPanel.locator('h4', { hasText: 'Usage (HTML)' });
  await expect(usageHeading).toHaveCount(0);

  const apiCard = apiPanel.locator('dads-card[data-api-target]').first();
  const apiCardTitle = apiCard.locator('h2 a');
  const apiCardMedia = apiCard.locator('[slot=\"media\"]');

  const readTitleThickness = async (): Promise<number> => {
    const thickness = await apiCardTitle.evaluate((el) => {
      const value = getComputedStyle(el).textDecorationThickness;
      return parseFloat(value);
    });
    return thickness;
  };

  await page.mouse.move(0, 0);
  const baseThickness = await readTitleThickness();

  await apiCardTitle.evaluate((el) => el.removeAttribute('data-dads-card-delegate'));
  await expect
    .poll(async () => apiCard.evaluate((el) => el.hasAttribute('data-dads-card-delegate')))
    .toBe(false);
  await apiCardMedia.hover();
  const noDelegateCardHover = await readTitleThickness();
  expect(noDelegateCardHover).toBe(baseThickness);

  await apiCardTitle.hover();
  const noDelegateLinkHover = await readTitleThickness();
  expect(noDelegateLinkHover).toBeGreaterThan(baseThickness);

  await apiCardTitle.evaluate((el) => el.setAttribute('data-dads-card-delegate', ''));
  await expect
    .poll(async () => apiCard.evaluate((el) => el.hasAttribute('data-dads-card-delegate')))
    .toBe(true);
  const apiCardSubButton = apiCard.locator('[data-demo-card-sub-button-1]');
  await apiCardSubButton.hover();
  const delegateButtonHover = await readTitleThickness();
  expect(delegateButtonHover).toBe(baseThickness);
  await apiCardMedia.hover();
  const delegateCardHover = await readTitleThickness();
  expect(delegateCardHover).toBeGreaterThan(baseThickness);

  const a11y = page.locator('a11y-annotate').first();
  await expect(a11y).toBeVisible();
  const a11yInAccordion = await a11y.evaluate((el) => !!el.closest('dads-accordion-item-details'));
  expect(a11yInAccordion).toBe(false);

  const accordion = page.locator('dads-accordion-details').first();
  await expect(accordion).toBeVisible();
  await expect(accordion).toHaveAttribute('allow-multiple', '');

  const accordionItems = accordion.locator('dads-accordion-item-details');
  await expect(accordionItems).toHaveCount(4);

  const expectedHeaders = ['Usage (HTML)', 'Content (Demo)', 'Props / Attrs', 'CSS vars'];
  for (let i = 0; i < expectedHeaders.length; i += 1) {
    const item = accordionItems.nth(i);
    const header = item.locator('[slot="header"]');
    await expect(header).toHaveText(expectedHeaders[i]);
    const expanded = await item.evaluate((el) => el.hasAttribute('expanded'));
    expect(expanded).toBe(false);
  }

  const usageItem = accordionItems.first();
  await expect(usageItem.locator('dads-code-block')).toBeHidden();
  await expect(usageItem.locator('dads-disclosure')).toHaveCount(0);

  const contentDemoItem = accordionItems.nth(1);
  await expect(contentDemoItem.locator('table.wc-api-table')).toBeHidden();

  const hasSubgridRule = await page.evaluate(() => {
    const regex = /dads-card\\.card-example-3\\s*\\{[^}]*\\}/g;
    return Array.from(document.querySelectorAll('style')).some((style) => {
      const text = style.textContent ?? '';
      const blocks = text.match(regex) ?? [];
      return blocks.some((block) => block.includes('grid-template-rows: subgrid'));
    });
  });
  expect(hasSubgridRule).toBe(false);

  await expect(list).toHaveScreenshot('card-example-3-list.png', {
    maxDiffPixelRatio: 0.01,
  });
});
