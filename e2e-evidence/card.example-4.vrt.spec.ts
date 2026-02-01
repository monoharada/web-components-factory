import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 } });

test('card example 4 renders dashboard data from JSON', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/?nosw=1&component=card');

  await page.selectOption('#component', 'card');
  await expect(page.locator('body')).toHaveAttribute('data-component', 'card');

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

  const section = page.locator('section.card-demo-subsection', {
    hasText: 'カード作例4',
  });
  await expect(section).toBeVisible();
  await section.scrollIntoViewIfNeeded();

  const getStyleValue = async (selector: string, property: string) => {
    return section.evaluate(
      (root, args) => {
        const el = root.querySelector<HTMLElement>(args.selector);
        if (!el) return null;
        const style = window.getComputedStyle(el) as CSSStyleDeclaration & Record<string, string>;
        const kebab = args.property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
        return (
          style[args.property] ||
          style.getPropertyValue(args.property) ||
          style.getPropertyValue(kebab)
        );
      },
      { selector, property },
    );
  };

  const getRect = async (selector: string) => {
    return section.evaluate((root, sel) => {
      const el = root.querySelector<HTMLElement>(sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    }, selector);
  };

  await expect(section.locator('[data-card-example-4-title]')).toHaveText('導入企業の割合');
  await expect(section.locator('[data-card-example-4-value]')).toHaveText('68.5');
  await expect(section.locator('[data-card-example-4-unit]')).toHaveText('%');
  await expect(section.locator('[data-card-example-4-delta]')).toHaveText('12%');
  await expect(section.locator('[data-card-example-4-delta-label]')).toHaveText('先月比');
  await expect(section.locator('[data-card-example-4-count]')).toHaveText('886/1294件');
  await expect(section.locator('[data-card-example-4-description]')).toHaveText(
    '導入企業の割合を業種・地域ごとにグラフで確認いただけます',
  );
  await expect(section.locator('[data-card-example-4-updated]')).toHaveText('17日前');
  await expect(section.locator('.card-example-4__title-link')).toHaveAttribute('href', '#');
  await expect(section.locator('.card-example-4__metrics')).toBeVisible();
  await expect(section.locator('.card-example-4__progress-label')).toHaveText('進捗');

  const titleLink = section.locator('.card-example-4__title-link');
  await titleLink.hover();
  const hoverUnderlineThickness = await getStyleValue(
    '.card-example-4__title-link',
    'textDecorationThickness',
  );
  expect(hoverUnderlineThickness).toBe('2px');

  const titleRect = await getRect('.card-example-4__title');
  const linkRect = await getRect('.card-example-4__title-link');
  const linkDisplay = await getStyleValue('.card-example-4__title-link', 'display');

  expect(titleRect).not.toBeNull();
  expect(linkRect).not.toBeNull();
  expect(linkDisplay).toBe('block');
  expect(Math.abs((titleRect?.width ?? 0) - (linkRect?.width ?? 0))).toBeLessThanOrEqual(1);

  const layoutRowGap = await getStyleValue('.card-example-4__layout', 'rowGap');

  expect(layoutRowGap).toBe('16px');

  const valueRect = await getRect('.card-example-4__value');
  const deltaRect = await getRect('.card-example-4__delta');
  const progressRect = await getRect('.card-example-4__progress-row');

  expect(valueRect).not.toBeNull();
  expect(deltaRect).not.toBeNull();
  expect(progressRect).not.toBeNull();

  expect((deltaRect?.top ?? 0) - (valueRect?.bottom ?? 0)).toBeLessThanOrEqual(6);
  expect((progressRect?.top ?? 0) - (deltaRect?.bottom ?? 0)).toBeGreaterThan(8);

  const cardRect = await getRect('dads-card.card-example-4');

  expect(cardRect).not.toBeNull();
  expect(cardRect?.width ?? 0).toBeGreaterThan(350);
  expect(cardRect?.width ?? 0).toBeLessThan(370);

  const deltaIconRect = await getRect('.card-example-4__delta svg');

  expect(deltaIconRect).not.toBeNull();
  expect(deltaIconRect?.width ?? 0).toBeGreaterThan(0);
  expect(deltaIconRect?.width ?? 0).toBeLessThan(40);
  expect(deltaIconRect?.height ?? 0).toBeLessThan(40);

  const chips = section.locator('dads-chip-label');
  await expect(chips).toHaveCount(2);
  await expect(chips.nth(0)).toHaveText('Android');
  await expect(chips.nth(1)).toHaveText('iOS');

  const trackRect = await getRect('[data-card-example-4-progress]');
  const fillRect = await getRect('[data-card-example-4-progress-fill]');
  const progressRatio =
    trackRect && fillRect && trackRect.width
      ? fillRect.width / trackRect.width
      : null;

  expect(progressRatio).not.toBeNull();
  expect(progressRatio ?? 0).toBeGreaterThan(0.66);
  expect(progressRatio ?? 0).toBeLessThan(0.70);

  const card = section.locator('dads-card.card-example-4');
  await expect(card).toHaveScreenshot('card-example-4.png', {
    maxDiffPixelRatio: 0.01,
  });
});
