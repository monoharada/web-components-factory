import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

function createFile(name: string, type: string, size = 128): File {
  return new File([new Uint8Array(size)], name, { type });
}

function createDragLikeEvent(type: string, files: File[] = []): DragEvent {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', {
    configurable: true,
    value: {
      files,
      types: files.length > 0 ? ['Files'] : [],
      dropEffect: 'copy',
    },
  });
  return event;
}

describe('DadsFileUpload - 基本', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在し、初期文言を表示する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const browseButton = getShadowContent(element, '#browse-button');
    const emptyText = getShadowContent(element, '#empty-text');
    const selectionSummary = getShadowContent(element, '#selection-summary');

    expect(browseButton).toBeInTheDocument();
    expect(emptyText?.textContent).toContain('ファイルが選択されていません');
    expect(selectionSummary?.hasAttribute('hidden')).toBe(true);
  });

  it('addFiles でファイルが追加される', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const file = createFile('sample.pdf', 'application/pdf');
    const api = element as unknown as { addFiles: (files: File[]) => unknown[]; items: unknown[] };

    const added = api.addFiles([file]);
    expect(added).toHaveLength(1);
    expect(api.items).toHaveLength(1);

    const list = getShadowContent(element, '#file-list');
    const summary = getShadowContent(element, '#selection-summary');
    expect(list?.textContent).toContain('sample.pdf');
    expect(list?.textContent).toContain('128B (128バイト)');
    expect(summary?.textContent).toContain('選択中：1個');
    expect(summary?.textContent).toContain('128B（128バイト）');
  });
});

describe('DadsFileUpload - 入力経路', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('input[type=file] の change で追加できる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const handler = vi.fn();
    element.addEventListener('dads-file-upload-change', handler);

    const file = createFile('from-input.pdf', 'application/pdf');
    const input = getShadowContent(element, '#file-input') as HTMLInputElement | null;

    expect(input).toBeInTheDocument();
    Object.defineProperty(input as HTMLInputElement, 'files', {
      configurable: true,
      value: [file],
    });

    input?.dispatchEvent(new Event('change', { bubbles: true }));

    const api = element as unknown as { items: Array<{ file: File }> };
    expect(api.items).toHaveLength(1);
    expect(api.items[0]?.file.name).toBe('from-input.pdf');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.detail?.source).toBe('input');
  });

  it('drop で追加できる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const handler = vi.fn();
    element.addEventListener('dads-file-upload-change', handler);

    const file = createFile('from-drop.pdf', 'application/pdf');
    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;

    dropzone?.dispatchEvent(createDragLikeEvent('dragenter', [file]));
    dropzone?.dispatchEvent(createDragLikeEvent('drop', [file]));

    const api = element as unknown as { items: Array<{ file: File }> };
    expect(api.items).toHaveLength(1);
    expect(api.items[0]?.file.name).toBe('from-drop.pdf');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.detail?.source).toBe('drop');
  });

  it('dragenter / dragleave で data-dragover 属性が切り替わる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const file = createFile('drag-state.pdf', 'application/pdf');
    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;
    expect(dropzone).toBeInTheDocument();

    dropzone?.dispatchEvent(createDragLikeEvent('dragenter', [file]));
    expect(element.hasAttribute('data-dragover')).toBe(true);

    dropzone?.dispatchEvent(createDragLikeEvent('dragleave', [file]));
    expect(element.hasAttribute('data-dragover')).toBe(false);
  });
});

describe('DadsFileUpload - イベント契約', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('before-add を preventDefault すると追加されない', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    element.addEventListener('dads-file-upload-before-add', (event) => {
      event.preventDefault();
    });

    const file = createFile('blocked.pdf', 'application/pdf');
    const api = element as unknown as { addFiles: (files: File[]) => unknown[]; items: unknown[] };

    const added = api.addFiles([file]);
    expect(added).toHaveLength(0);
    expect(api.items).toHaveLength(0);
  });

  it('requestUpload で request イベントが発火する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const requestHandler = vi.fn();
    element.addEventListener('dads-file-upload-request', requestHandler);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      requestUpload: () => boolean;
    };

    api.addFiles([createFile('request.pdf', 'application/pdf')]);
    const requested = api.requestUpload();

    expect(requested).toBe(true);
    expect(requestHandler).toHaveBeenCalledTimes(1);
    expect(requestHandler.mock.calls[0]?.[0]?.detail?.items).toHaveLength(1);
  });

  it('required かつファイル無しで requestUpload すると validation-error が発火する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const validationHandler = vi.fn();
    element.addEventListener('dads-file-upload-validation-error', validationHandler);

    const api = element as unknown as { requestUpload: () => boolean };
    const requested = api.requestUpload();

    expect(requested).toBe(false);
    expect(validationHandler).toHaveBeenCalledTimes(1);
    expect(validationHandler.mock.calls[0]?.[0]?.detail?.code).toBe('required');
    expect(element.hasAttribute('error')).toBe(true);
  });
});

describe('DadsFileUpload - required validity', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('required かつ有効ファイル未選択では checkValidity/reportValidity が false になる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const api = element as unknown as {
      checkValidity: () => boolean;
      reportValidity: () => boolean;
      validationMessage: string;
    };
    expect(api.checkValidity()).toBe(false);
    expect(api.reportValidity()).toBe(false);
    expect(api.validationMessage).toContain('ファイルを選択してください');
  });

  it('required が満たされると checkValidity が true に戻る', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      checkValidity: () => boolean;
      validationMessage: string;
    };

    expect(api.checkValidity()).toBe(false);
    api.addFiles([createFile('valid.pdf', 'application/pdf')]);
    expect(api.checkValidity()).toBe(true);
    expect(api.validationMessage).toBe('');
  });
});

describe('DadsFileUpload - 検証', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('accept に一致しないファイルは invalid になる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('accept', '.pdf');
    await waitForCustomElement(element);

    const validationHandler = vi.fn();
    element.addEventListener('dads-file-upload-validation-error', validationHandler);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: Array<{ valid: boolean; status: string; message?: string }>;
    };

    api.addFiles([createFile('image.png', 'image/png')]);

    expect(api.items).toHaveLength(1);
    expect(api.items[0]?.valid).toBe(false);
    expect(api.items[0]?.status).toBe('error');
    expect(api.items[0]?.message).toContain('許可されていない形式');
    expect(validationHandler).toHaveBeenCalledTimes(1);
    expect(validationHandler.mock.calls[0]?.[0]?.detail?.code).toBe('accept');

    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;
    const summary = getShadowContent(element, '#selection-summary') as HTMLElement | null;
    const errorText = getShadowContent(element, '#error-text') as HTMLElement | null;
    expect(dropzone).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(errorText).toBeInTheDocument();
    expect(dropzone?.contains(summary as Node)).toBe(true);
    expect(dropzone?.contains(errorText as Node)).toBe(true);
    expect(
      (summary?.compareDocumentPosition(errorText as Node) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    const list = getShadowContent(element, '#file-list');
    expect(list?.textContent).not.toContain('エラー');
  });

  it('max-file-size を超過したファイルは invalid になる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('max-file-size', '1kb');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: Array<{ valid: boolean; message?: string }>;
    };

    api.addFiles([createFile('large.pdf', 'application/pdf', 4096)]);

    expect(api.items[0]?.valid).toBe(false);
    expect(api.items[0]?.message).toContain('ファイルサイズ');
  });

  it('multiple + max-files 超過分は invalid になる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('multiple', '');
    element.setAttribute('max-files', '1');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: Array<{ valid: boolean }>;
    };

    api.addFiles([
      createFile('a.pdf', 'application/pdf'),
      createFile('b.pdf', 'application/pdf'),
    ]);

    expect(api.items).toHaveLength(2);
    expect(api.items[0]?.valid).toBe(true);
    expect(api.items[1]?.valid).toBe(false);
  });

  it('multiple 未指定では最後の1件で置換される', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: Array<{ file: File }>;
    };

    api.addFiles([
      createFile('first.pdf', 'application/pdf'),
      createFile('last.pdf', 'application/pdf'),
    ]);

    expect(api.items).toHaveLength(1);
    expect(api.items[0]?.file.name).toBe('last.pdf');
  });
});

describe('DadsFileUpload - 公開メソッド', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('removeFile / clearFiles が動作する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('multiple', '');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      removeFile: (id: string) => void;
      clearFiles: () => void;
      items: Array<{ id: string }>;
    };

    api.addFiles([
      createFile('a.pdf', 'application/pdf'),
      createFile('b.pdf', 'application/pdf'),
    ]);
    expect(api.items).toHaveLength(2);

    api.removeFile(api.items[0].id);
    expect(api.items).toHaveLength(1);

    api.clearFiles();
    expect(api.items).toHaveLength(0);
  });

  it('削除操作ラベルは「解除」で表示される', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
    };
    api.addFiles([createFile('remove-target.pdf', 'application/pdf')]);

    const removeButton = getShadowContent(element, '[part="remove-button"]') as HTMLButtonElement | null;
    expect(removeButton).toBeInTheDocument();
    expect(removeButton?.textContent).toBe('解除');
    expect(removeButton?.getAttribute('aria-label')).toContain('を解除');
  });

  it('setFileState で状態を更新できる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      setFileState: (id: string, patch: { status: 'success'; message: string }) => void;
      items: Array<{ id: string }>;
    };

    api.addFiles([createFile('ok.pdf', 'application/pdf')]);
    const id = api.items[0]?.id;
    api.setFileState(id, { status: 'success', message: '完了' });

    const list = getShadowContent(element, '#file-list');
    expect(list?.textContent).toContain('完了');
  });

  it('disabled のとき addFiles は無視される', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: unknown[];
    };

    const added = api.addFiles([createFile('disabled.pdf', 'application/pdf')]);
    expect(added).toHaveLength(0);
    expect(api.items).toHaveLength(0);
  });

  it('disabled 時は解除ボタンが disabled になる', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const api = element as unknown as {
      addFiles: (files: File[]) => unknown[];
      items: Array<{ id: string }>;
    };

    api.addFiles([createFile('disable-remove.pdf', 'application/pdf')]);
    const before = getShadowContent(element, '[part="remove-button"]') as HTMLButtonElement | null;
    expect(before?.disabled).toBe(false);

    element.setAttribute('disabled', '');

    const after = getShadowContent(element, '[part="remove-button"]') as HTMLButtonElement | null;
    expect(after?.disabled).toBe(true);
    expect(api.items).toHaveLength(1);
  });
});

describe('DadsFileUpload - 全画面ドロップ拡大', () => {
  let element: HTMLElement;
  let secondaryElement: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    if (secondaryElement) cleanupTestElement(secondaryElement);
    secondaryElement = null;
  });

  it('チェックON時に全画面ドラッグでオーバーレイ表示し、fullscreen-change を発火する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const fullScreenHandler = vi.fn();
    element.addEventListener('dads-file-upload-fullscreen-change', fullScreenHandler);

    const checkbox = getShadowContent(element, '#expand-checkbox') as HTMLElement | null;
    checkbox?.dispatchEvent(
      new CustomEvent('dads-change', {
        bubbles: true,
        composed: true,
        detail: { checked: true },
      })
    );

    expect(fullScreenHandler).toHaveBeenCalledTimes(1);
    expect(fullScreenHandler.mock.calls[0]?.[0]?.detail?.enabled).toBe(true);

    const file = createFile('global-drop.pdf', 'application/pdf');
    window.dispatchEvent(createDragLikeEvent('dragenter', [file]));

    const overlay = getShadowContent(element, '#overlay') as HTMLElement | null;
    expect(overlay?.hasAttribute('hidden')).toBe(false);

    window.dispatchEvent(createDragLikeEvent('drop', [file]));
    expect(overlay?.hasAttribute('hidden')).toBe(true);

    const api = element as unknown as { items: Array<{ file: File }> };
    expect(api.items).toHaveLength(1);
    expect(api.items[0]?.file.name).toBe('global-drop.pdf');
  });

  it('複数インスタンス有効時は最新ONの1インスタンスのみが window drop を取り込む', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    secondaryElement = createTestElement('dads-file-upload');
    await waitForCustomElement(element);
    await waitForCustomElement(secondaryElement);

    const firstHandler = vi.fn();
    const secondHandler = vi.fn();
    element.addEventListener('dads-file-upload-fullscreen-change', firstHandler);
    secondaryElement.addEventListener('dads-file-upload-fullscreen-change', secondHandler);

    const firstCheckbox = getShadowContent(element, '#expand-checkbox') as HTMLElement | null;
    firstCheckbox?.dispatchEvent(
      new CustomEvent('dads-change', {
        bubbles: true,
        composed: true,
        detail: { checked: true },
      })
    );
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(firstHandler.mock.calls[0]?.[0]?.detail?.enabled).toBe(true);

    const secondCheckbox = getShadowContent(secondaryElement, '#expand-checkbox') as HTMLElement | null;
    secondCheckbox?.dispatchEvent(
      new CustomEvent('dads-change', {
        bubbles: true,
        composed: true,
        detail: { checked: true },
      })
    );

    expect(firstHandler).toHaveBeenCalledTimes(2);
    expect(firstHandler.mock.calls[1]?.[0]?.detail?.enabled).toBe(false);
    expect(secondHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler.mock.calls[0]?.[0]?.detail?.enabled).toBe(true);

    const file = createFile('owner-only.pdf', 'application/pdf');
    window.dispatchEvent(createDragLikeEvent('dragenter', [file]));
    window.dispatchEvent(createDragLikeEvent('drop', [file]));

    const firstApi = element as unknown as { items: Array<{ file: File }> };
    const secondApi = secondaryElement as unknown as { items: Array<{ file: File }> };
    expect(firstApi.items).toHaveLength(0);
    expect(secondApi.items).toHaveLength(1);
    expect(secondApi.items[0]?.file.name).toBe('owner-only.pdf');
  });
});

describe('DadsFileUpload - mode', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('mode未指定は drop-area として扱う', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;
    const file = createFile('default-mode.pdf', 'application/pdf');
    dropzone?.dispatchEvent(createDragLikeEvent('dragenter', [file]));

    expect(element.getAttribute('data-mode')).toBe('drop-area');
    expect(element.hasAttribute('data-dragover')).toBe(true);
  });

  it('modeが不正値でも drop-area にフォールバックする', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('mode', 'invalid-value');
    await waitForCustomElement(element);

    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;
    const file = createFile('invalid-mode.pdf', 'application/pdf');
    dropzone?.dispatchEvent(createDragLikeEvent('dragenter', [file]));

    expect(element.getAttribute('data-mode')).toBe('drop-area');
    expect(element.hasAttribute('data-dragover')).toBe(true);
  });

  it('mode=button-only では drop関連を無効化する', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    element.setAttribute('mode', 'button-only');
    await waitForCustomElement(element);

    const fullScreenHandler = vi.fn();
    element.addEventListener('dads-file-upload-fullscreen-change', fullScreenHandler);

    const checkbox = getShadowContent(element, '#expand-checkbox') as HTMLElement | null;
    checkbox?.dispatchEvent(
      new CustomEvent('dads-change', {
        bubbles: true,
        composed: true,
        detail: { checked: true },
      })
    );

    const dropzone = getShadowContent(element, '#dropzone') as HTMLElement | null;
    const file = createFile('button-only.pdf', 'application/pdf');
    dropzone?.dispatchEvent(createDragLikeEvent('dragenter', [file]));

    expect(element.getAttribute('data-mode')).toBe('button-only');
    expect(element.hasAttribute('data-dragover')).toBe(false);
    expect(fullScreenHandler).toHaveBeenCalledTimes(0);

    const overlay = getShadowContent(element, '#overlay') as HTMLElement | null;
    expect(overlay?.hasAttribute('hidden')).toBe(true);
  });

  it('expand-checkbox の既定文言が維持される', async () => {
    const { defineFileUpload } = await import('./file-upload-define.js');
    defineFileUpload();

    element = createTestElement('dads-file-upload');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '#expand-checkbox') as HTMLElement | null;
    expect(checkbox?.getAttribute('label')).toBe('ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる');
  });
});
