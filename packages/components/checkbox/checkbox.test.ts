/**
 * DadsCheckboxコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsCheckbox - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('input[type=checkbox] が含まれる', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input).toBeInTheDocument();
    expect(input?.type).toBe('checkbox');
  });
});

describe('DadsCheckbox - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('label属性がラベルに反映される', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    element.setAttribute('label', 'テストラベル');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]');
    expect(label?.textContent).toBe('テストラベル');
  });

  it('size属性がdata-sizeに反映される', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    element.setAttribute('size', 'lg');
    await waitForCustomElement(element);

    const base = getShadowContent(element, '[part="base"]');
    expect(base?.getAttribute('data-size')).toBe('lg');
  });

  it('checked属性でチェック状態になる', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    element.setAttribute('checked', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input?.checked).toBe(true);
  });

  it('indeterminate属性で不確定状態になる', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    element.setAttribute('indeterminate', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input?.indeterminate).toBe(true);
  });
});

describe('DadsCheckbox - イベント', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('changeでdads-changeが発火する', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    element = createTestElement('dads-checkbox');
    await waitForCustomElement(element);

    const handler = vi.fn();
    element.addEventListener('dads-change', handler);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    if (!input) throw new Error('input not found');

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('DadsCheckbox - バリデーション', () => {
  let form: HTMLFormElement | null = null;
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    if (form) form.remove();
    form = null;
  });

  it('required + auto-validate で未チェックsubmit時にエラーになる', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    form = document.createElement('form');
    document.body.appendChild(form);

    element = document.createElement('dads-checkbox');
    element.setAttribute('required', '');
    element.setAttribute('auto-validate', '');
    element.setAttribute('label', '必須');
    form.appendChild(element);
    await waitForCustomElement(element);

    // setupFormValidationはqueueMicrotaskでフォームを束縛する
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(element.hasAttribute('error')).toBe(true);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input?.getAttribute('aria-invalid')).toBe('true');

    // validity / message
    const checkbox = element as unknown as {
      validity: ValidityState;
      validationMessage: string;
    };
    expect(checkbox.validity.valid).toBe(false);
    expect(checkbox.validationMessage.length).toBeGreaterThan(0);
  });

  it('未チェックエラー後にチェックするとエラーがクリアされる', async () => {
    const { defineDefaultCheckbox } = await import('./checkbox-define');
    defineDefaultCheckbox();

    form = document.createElement('form');
    document.body.appendChild(form);

    element = document.createElement('dads-checkbox');
    element.setAttribute('required', '');
    element.setAttribute('auto-validate', '');
    element.setAttribute('label', '必須');
    form.appendChild(element);
    await waitForCustomElement(element);

    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(element.hasAttribute('error')).toBe(true);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    if (!input) throw new Error('input not found');

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(element.hasAttribute('error')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });
});

