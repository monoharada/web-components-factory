import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 } });

test('card example 5 toggles vertical and horizontal layout', async ({ page }) => {
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

  const section = page.locator('section.card-demo-subsection', {
    hasText: 'カード作例5',
  });
  await expect(section).toBeVisible();
  await section.scrollIntoViewIfNeeded();

  const list = section.locator('.card-example-5-list');
  await expect(list).toBeVisible();

  const toggle = section.locator('[data-card-example-5-toggle]');
  await expect(toggle).toBeVisible();

  const cards = list.locator('dads-card[data-card-example-5]');
  const firstCard = cards.first();
  await expect(cards).toHaveCount(3);

  await expect
    .poll(async () =>
      cards.evaluateAll((els) => els.every((el) => !el.hasAttribute('layout'))),
    )
    .toBe(true);

  await expect(list).toHaveScreenshot('card-example-5-vertical.png', {
    maxDiffPixelRatio: 0.01,
  });

  await toggle.click();

  await expect
    .poll(async () =>
      cards.evaluateAll((els) => els.every((el) => el.getAttribute('layout') === 'horizontal')),
    )
    .toBe(true);

  await expect
    .poll(async () => list.evaluate((el) => el.hasAttribute('data-layout-horizontal')))
    .toBe(true);

  const listMetrics = await list.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const computed = getComputedStyle(el);
    return {
      width: rect.width,
      marginLeft: parseFloat(computed.marginLeft) || 0,
      marginRight: parseFloat(computed.marginRight) || 0,
    };
  });

  expect(listMetrics.width).toBeLessThanOrEqual(941);
  expect(listMetrics.marginLeft).toBeGreaterThan(0);
  expect(listMetrics.marginRight).toBeGreaterThan(0);

  const buttonTokens = await firstCard.evaluate((card) => {
    const buttons = card.querySelectorAll('dads-button');
    const outlined = buttons[0] as HTMLElement | undefined;
    const solid = buttons[1] as HTMLElement | undefined;
    if (!outlined || !solid) return null;

    const read = (style: CSSStyleDeclaration, name: string) =>
      style.getPropertyValue(name).trim();
    const outlinedStyle = getComputedStyle(outlined);
    const solidStyle = getComputedStyle(solid);
    return {
      outlined: {
        background: read(outlinedStyle, '--dads-button-background'),
        backgroundHover: read(outlinedStyle, '--dads-button-background-hover'),
        backgroundActive: read(outlinedStyle, '--dads-button-background-active'),
        color: read(outlinedStyle, '--dads-button-color'),
        colorHover: read(outlinedStyle, '--dads-button-color-hover'),
        colorActive: read(outlinedStyle, '--dads-button-color-active'),
        border: read(outlinedStyle, '--dads-button-border-color'),
        borderHover: read(outlinedStyle, '--dads-button-border-color-hover'),
        borderActive: read(outlinedStyle, '--dads-button-border-color-active'),
      },
      solid: {
        background: read(solidStyle, '--dads-button-background'),
        backgroundHover: read(solidStyle, '--dads-button-background-hover'),
        backgroundActive: read(solidStyle, '--dads-button-background-active'),
        color: read(solidStyle, '--dads-button-color'),
        border: read(solidStyle, '--dads-button-border-color'),
      },
    };
  });

  expect(buttonTokens).not.toBeNull();
  const tokens = buttonTokens as NonNullable<typeof buttonTokens>;
  const expectedOutlined = {
    background: '#ffffff',
    backgroundHover: '#e9f7f9',
    backgroundActive: '#c8f8ff',
    color: '#006f83',
    colorHover: '#006173',
    colorActive: '#004c59',
    border: '#006f83',
    borderHover: '#006173',
    borderActive: '#004c59',
  };
  const expectedSolid = {
    background: '#006f83',
    backgroundHover: '#006173',
    backgroundActive: '#003741',
    color: '#ffffff',
    border: '#006f83',
  };
  for (const [key, value] of Object.entries(expectedOutlined)) {
    expect(tokens.outlined[key as keyof typeof expectedOutlined]).toBe(value);
  }
  for (const [key, value] of Object.entries(expectedSolid)) {
    expect(tokens.solid[key as keyof typeof expectedSolid]).toBe(value);
  }

  const layoutMetrics = await firstCard.evaluate((card) => {
    const title = card.querySelector<HTMLElement>('.card-example-5__title');
    const link = title?.querySelector<HTMLElement>('a');
    const titleRect = title?.getBoundingClientRect();
    const linkRect = link?.getBoundingClientRect();
    const sub = card.shadowRoot?.querySelector<HTMLElement>('[part="sub"]');
    const subStyle = sub ? getComputedStyle(sub) : null;
    return {
      linkDisplay: link ? getComputedStyle(link).display : null,
      linkWidth: linkRect?.width ?? null,
      titleWidth: titleRect?.width ?? null,
      subBackground: subStyle?.backgroundColor ?? null,
    };
  });

  expect(layoutMetrics).not.toBeNull();
  expect(layoutMetrics?.linkDisplay).toBe('block');
  expect(layoutMetrics?.linkWidth).toBeGreaterThanOrEqual(
    (layoutMetrics?.titleWidth ?? 0) - 1,
  );
  expect(layoutMetrics?.subBackground).toBe('rgba(0, 0, 0, 0)');

  const horizontalMetrics = await firstCard.evaluate((card) => {
    const actions = card.querySelector<HTMLElement>('.card-example-5__actions');
    const description = card.querySelector<HTMLElement>('.card-example-5__description');
    if (!actions || !description) return null;

    const actionsRect = actions.getBoundingClientRect();
    const descriptionRect = description.getBoundingClientRect();
    return {
      actionsLeft: actionsRect.left,
      descriptionRight: descriptionRect.right,
    };
  });

  expect(horizontalMetrics).not.toBeNull();
  expect(horizontalMetrics?.actionsLeft).toBeGreaterThan(
    (horizontalMetrics?.descriptionRight ?? 0) + 8,
  );

  await expect(list).toHaveScreenshot('card-example-5-horizontal.png', {
    maxDiffPixelRatio: 0.01,
  });
});
