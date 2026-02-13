import { expect, test } from '@playwright/test';

test('carousel: 画像ロード保留時でも初期1tickで next preview img が存在する', async ({ page }) => {
  const baseUrl = process.env.WCF_E2E_BASE_URL?.replace(/\/$/, '') ?? '';
  const targetUrl = baseUrl
    ? `${baseUrl}/?nosw=1&component=carousel`
    : '/?nosw=1&component=carousel';

  await page.route('**/resources/dads/components/carousel/**', async (route) => {
    // Simulate slow/blocked image loading so readiness does not resolve immediately.
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await route.abort('timedout');
  });

  const response = await page.goto(targetUrl, {
    waitUntil: 'domcontentloaded',
  });
  expect(response?.ok()).toBeTruthy();

  await page.waitForFunction(() => customElements.get('dads-carousel') !== undefined);

  await page.waitForFunction(() => {
    const host = document.querySelector('dads-carousel[data-carousel-items]') as
      | (HTMLElement & { items?: unknown[] })
      | null;
    return Boolean(host && Array.isArray(host.items) && host.items.length >= 3);
  }, null, { timeout: 15_000 });

  const hasNextPreviewImageOnInitialTick = await page.evaluate(async () => {
    const host = document.querySelector('dads-carousel[data-carousel-items]') as HTMLElement | null;
    if (!host?.shadowRoot) return false;
    await Promise.resolve();
    const image = host.shadowRoot.querySelector('#next-image-container img');
    return image instanceof HTMLImageElement;
  });

  expect(hasNextPreviewImageOnInitialTick).toBe(true);
});
