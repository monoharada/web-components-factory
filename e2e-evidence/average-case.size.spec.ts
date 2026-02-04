import { expect, test } from '@playwright/test';
import { brotliCompressSync, constants } from 'node:zlib';

test('averageCase.html brotli JS total <= 60KB (min=1, eager only)', async ({ page }) => {
  const scriptBodies: Buffer[] = [];

  page.on('response', async (response) => {
    try {
      if (!response.url().startsWith('http://localhost:3000/')) return;
      if (response.request().resourceType() !== 'script') return;
      const body = await response.body();
      scriptBodies.push(body);
    } catch {
      // ignore
    }
  });

  const response = await page.goto('/averageCase.html?nosw=1&min=1&lazy=0');
  expect(response?.ok()).toBeTruthy();

  const brotliTotal = scriptBodies.reduce((sum, body) => {
    const compressed = brotliCompressSync(body, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    });
    return sum + compressed.length;
  }, 0);

  expect(brotliTotal).toBeLessThanOrEqual(60 * 1024);
});
