import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 1200 } });

async function gotoResourceListFidelity(page: Page) {
  await page.goto('/?nosw=1&a11y=0&component=resourceListFidelity');

  await expect(page.locator('#demo-resource-list-whole-action-default')).toBeVisible({ timeout: 15_000 });
  await page.waitForFunction(() => customElements.get('dads-resource-list') !== undefined, null, { timeout: 15_000 });

  await page.evaluate(async () => {
    const fonts = (document as unknown as { fonts?: { ready?: Promise<void> } }).fonts;
    if (!fonts?.ready) return;
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  });
}

async function getPartSnapshot(
  page: Page,
  hostId: string,
): Promise<{ bodyBackground: string; actionBackground: string; bodyHeight: number }> {
  return page.evaluate((id) => {
    const host = document.getElementById(id);
    if (!(host instanceof HTMLElement)) throw new Error(`Host not found: ${id}`);
    const root = host.shadowRoot;
    if (!root) throw new Error(`Shadow root missing: ${id}`);

    const body = root.querySelector<HTMLElement>("[part='body']");
    const action = root.querySelector<HTMLElement>("[part='action']");
    if (!body || !action) throw new Error(`Body/Action part missing: ${id}`);

    return {
      bodyBackground: getComputedStyle(body).backgroundColor,
      actionBackground: getComputedStyle(action).backgroundColor,
      bodyHeight: body.getBoundingClientRect().height,
    };
  }, hostId);
}

async function hoverPart(page: Page, hostId: string, part: 'body' | 'action') {
  const point = await page.evaluate((payload) => {
    const host = document.getElementById(payload.id);
    if (!(host instanceof HTMLElement)) throw new Error(`Host not found: ${payload.id}`);

    const target = host.shadowRoot?.querySelector<HTMLElement>(`[part='${payload.part}']`);
    if (!target) throw new Error(`Part not found: ${payload.part}`);

    const rect = target.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, { id: hostId, part });

  await page.mouse.move(point.x, point.y);
}

test('resource-list fidelity: default / checked / inline baseline', async ({ page }) => {
  await gotoResourceListFidelity(page);

  await expect(page.locator('#demo-resource-list-whole-action-default')).toHaveScreenshot('resource-list-whole-action-default.png');
  await expect(page.locator('#demo-resource-list-whole-action-checked')).toHaveScreenshot('resource-list-whole-action-checked.png');
  await expect(page.locator('#demo-resource-list-inline-user-2')).toHaveScreenshot('resource-list-inline-selected.png');
});

test('resource-list fidelity: body hover does not tint action and keeps height stable', async ({ page }) => {
  await gotoResourceListFidelity(page);

  const before = await getPartSnapshot(page, 'demo-resource-list-whole-action-default');
  await hoverPart(page, 'demo-resource-list-whole-action-default', 'body');
  const after = await getPartSnapshot(page, 'demo-resource-list-whole-action-default');

  expect(after.actionBackground).toBe(before.actionBackground);
  expect(after.bodyBackground).not.toBe(before.bodyBackground);
  expect(after.bodyHeight).toBeCloseTo(before.bodyHeight, 2);

  await expect(page.locator('#demo-resource-list-whole-action-default')).toHaveScreenshot('resource-list-whole-action-body-hover.png');
});

test('resource-list fidelity: checked row keeps action background while body hover overrides selected', async ({ page }) => {
  await gotoResourceListFidelity(page);

  const before = await getPartSnapshot(page, 'demo-resource-list-whole-action-checked');
  await hoverPart(page, 'demo-resource-list-whole-action-checked', 'body');
  const after = await getPartSnapshot(page, 'demo-resource-list-whole-action-checked');

  expect(after.actionBackground).toBe(before.actionBackground);
  expect(after.bodyBackground).not.toBe(before.bodyBackground);
  expect(after.bodyHeight).toBeCloseTo(before.bodyHeight, 2);
});

test('resource-list fidelity: whole-link focus ring is scoped to body', async ({ page }) => {
  await gotoResourceListFidelity(page);

  await page.focus('#demo-resource-list-whole-link-title');
  await page.waitForTimeout(32);

  await expect(page.locator('#demo-resource-list-whole-link-action')).toHaveScreenshot('resource-list-whole-link-focus.png');
});

test('resource-list fidelity: inline-link focus uses title-row highlight', async ({ page }) => {
  await gotoResourceListFidelity(page);

  await page.focus('#demo-resource-list-inline-link-title');
  await page.waitForTimeout(32);

  await expect(page.locator('#demo-resource-list-inline-link-focus')).toHaveScreenshot('resource-list-inline-link-focus.png');
});

test('resource-list fidelity: action summary focus keeps frame end-radius', async ({ page }) => {
  await gotoResourceListFidelity(page);

  await page.focus('#demo-resource-list-whole-action-default .resource-list-fidelity-menu > summary');
  await page.waitForTimeout(32);

  await expect(page.locator('#demo-resource-list-whole-action-default')).toHaveScreenshot(
    'resource-list-whole-action-summary-focus.png'
  );
});

test('resource-list fidelity: action hover and right-side menu placement', async ({ page }) => {
  await gotoResourceListFidelity(page);

  await hoverPart(page, 'demo-resource-list-whole-action-default', 'action');
  await expect(page.locator('#demo-resource-list-whole-action-default')).toHaveScreenshot('resource-list-whole-action-action-hover.png');

  async function openMenuAndReadGeometry(hostId: string) {
    await page.click(`#${hostId} .resource-list-fidelity-menu > summary`);
    return page.evaluate((id) => {
      const host = document.getElementById(id);
      const details = document.querySelector<HTMLDetailsElement>(`#${id} .resource-list-fidelity-menu`);
      const menu = details?.querySelector<HTMLElement>("[role='menu']");
      if (!(host instanceof HTMLElement) || !menu) throw new Error(`Missing host/menu: ${id}`);

      const hostRect = host.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      return {
        menuLeft: menuRect.left,
        menuRight: menuRect.right,
        hostRight: hostRect.right,
        viewportRight: window.innerWidth,
      };
    }, hostId);
  }

  const roomGeometry = await openMenuAndReadGeometry('demo-resource-list-whole-action-default');
  expect(roomGeometry.menuLeft).toBeGreaterThanOrEqual(roomGeometry.hostRight - 1);
  expect(roomGeometry.menuRight).toBeLessThanOrEqual(roomGeometry.viewportRight);

  const accountGeometry = await openMenuAndReadGeometry('demo-resource-list-account-action-default');
  expect(accountGeometry.menuLeft).toBeGreaterThanOrEqual(accountGeometry.hostRight - 1);
  expect(accountGeometry.menuRight).toBeLessThanOrEqual(accountGeometry.viewportRight);

  await expect(page.locator('#demo-resource-list-whole-action-default')).toHaveScreenshot('resource-list-whole-action-menu-open.png');
});
