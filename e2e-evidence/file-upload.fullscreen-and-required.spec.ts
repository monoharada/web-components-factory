import { expect, test } from '@playwright/test';

async function gotoFileUpload(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/?nosw=1&component=fileUpload');
  await page.waitForFunction(() => customElements.get('dads-file-upload') !== undefined);
  await expect(page.locator('dads-file-upload')).toHaveCount(6);
}

async function toggleFullscreenByEvent(
  page: import('@playwright/test').Page,
  hostId: string,
  checked: boolean,
): Promise<void> {
  await page.evaluate(
    ({ id, next }) => {
      const host = document.getElementById(id);
      if (!(host instanceof HTMLElement)) throw new Error(`missing host: ${id}`);
      const checkbox = host.shadowRoot?.querySelector('#expand-checkbox');
      if (!(checkbox instanceof HTMLElement)) throw new Error(`missing checkbox: ${id}`);
      checkbox.dispatchEvent(
        new CustomEvent('dads-change', {
          bubbles: true,
          composed: true,
          detail: { checked: next },
        }),
      );
    },
    { id: hostId, next: checked },
  );
}

test.describe('dads-file-upload e2e', () => {
  test('ALT生成作例: 未選択で実行すると required エラーが表示される', async ({ page }) => {
    await gotoFileUpload(page);

    const host = page.locator('#alt-default-file-upload');
    const runButton = page.locator('#alt-default-run-button');

    await expect(host).toBeVisible();
    await expect(runButton).toBeVisible();

    await runButton.click();

    await expect(host).toHaveAttribute('error', '');
    const errorText = await host.evaluate((el) => {
      const node = el.shadowRoot?.querySelector<HTMLElement>('#dropzone > #error-text');
      return node?.textContent ?? '';
    });
    expect(errorText).toContain('ファイルを選択してください');
  });

  test('全画面drop有効要素が切断されても、次の要素がdropを受け取れる', async ({ page }) => {
    await gotoFileUpload(page);

    await toggleFullscreenByEvent(page, 'api-file-upload', true);

    await page.evaluate(() => {
      const host = document.getElementById('api-file-upload');
      if (!(host instanceof HTMLElement)) throw new Error('missing host: api-file-upload');
      host.remove();
    });

    await toggleFullscreenByEvent(page, 'alt-default-file-upload', true);

    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.items.add(new File(['dummy'], 'e2e-drop.pdf', { type: 'application/pdf' }));

      window.dispatchEvent(
        new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );

      window.dispatchEvent(
        new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
    });

    const fileNames = await page.evaluate(() => {
      const host = document.getElementById('alt-default-file-upload') as
        | (HTMLElement & { items?: Array<{ file?: File }> })
        | null;
      const items = Array.isArray(host?.items) ? host.items : [];
      return items.map((item) => item.file?.name ?? '');
    });

    expect(fileNames).toEqual(['e2e-drop.pdf']);
  });
});
