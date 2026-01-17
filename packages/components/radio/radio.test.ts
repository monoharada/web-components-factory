/**
 * DadsRadioコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsRadio - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('input[type=radio] が含まれる', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input).toBeInTheDocument();
    expect(input?.type).toBe('radio');
  });
});

describe('DadsRadio - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('label属性がラベルに反映される', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    element.setAttribute('label', 'テストラベル');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]');
    expect(label?.textContent).toBe('テストラベル');
  });

  it('size属性はホストで管理され、baseにdata-sizeをコピーしない', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    element.setAttribute('size', 'lg');
    await waitForCustomElement(element);

    const base = getShadowContent(element, '[part="base"]');
    expect(element.getAttribute('size')).toBe('lg');
    expect(base?.hasAttribute('data-size')).toBe(false);
  });

  it('checked属性でチェック状態になる', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = createTestElement('dads-radio');
    element.setAttribute('checked', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input?.checked).toBe(true);
  });
});

describe('DadsRadio - グループ（name）', () => {
  let wrapper: HTMLElement | null = null;
  let element1: HTMLElement;
  let element2: HTMLElement;

  afterEach(() => {
    if (element1) cleanupTestElement(element1);
    if (element2) cleanupTestElement(element2);
    if (wrapper) wrapper.remove();
    wrapper = null;
  });

  it('同一nameグループで排他制御される', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    element1 = document.createElement('dads-radio');
    element1.setAttribute('name', 'group');
    element1.setAttribute('label', 'A');
    wrapper.appendChild(element1);

    element2 = document.createElement('dads-radio');
    element2.setAttribute('name', 'group');
    element2.setAttribute('label', 'B');
    wrapper.appendChild(element2);

    await waitForCustomElement(element1);
    await waitForCustomElement(element2);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const input1 = getShadowContent(element1, '[part="input"]') as HTMLInputElement | null;
    const input2 = getShadowContent(element2, '[part="input"]') as HTMLInputElement | null;
    if (!input1 || !input2) throw new Error('input not found');

    // 初期状態: 未選択なら先頭がタブストップ
    expect(input1.tabIndex).toBe(0);
    expect(input2.tabIndex).toBe(-1);

    input1.checked = true;
    input1.dispatchEvent(new Event('change', { bubbles: true }));

    expect(input1.checked).toBe(true);
    expect(input2.checked).toBe(false);
    expect(input1.tabIndex).toBe(0);
    expect(input2.tabIndex).toBe(-1);

    input2.checked = true;
    input2.dispatchEvent(new Event('change', { bubbles: true }));

    expect(input1.checked).toBe(false);
    expect(input2.checked).toBe(true);
    expect(input1.tabIndex).toBe(-1);
    expect(input2.tabIndex).toBe(0);
  });
});

describe('DadsRadio - バリデーション', () => {
  let form: HTMLFormElement | null = null;
  let element1: HTMLElement;
  let element2: HTMLElement;

  afterEach(() => {
    if (element1) cleanupTestElement(element1);
    if (element2) cleanupTestElement(element2);
    if (form) form.remove();
    form = null;
  });

  it('required + auto-validate で未選択submit時にエラーになる（グループ）', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    form = document.createElement('form');
    document.body.appendChild(form);

    element1 = document.createElement('dads-radio');
    element1.setAttribute('name', 'required-group');
    element1.setAttribute('label', 'A');
    element1.setAttribute('required', '');
    element1.setAttribute('auto-validate', '');
    form.appendChild(element1);

    element2 = document.createElement('dads-radio');
    element2.setAttribute('name', 'required-group');
    element2.setAttribute('label', 'B');
    element2.setAttribute('required', '');
    form.appendChild(element2);

    await waitForCustomElement(element1);
    await waitForCustomElement(element2);

    // setupFormValidationはqueueMicrotaskでフォームを束縛する
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);

    // 末尾にメッセージ、全体はエラー表示
    expect(element1.hasAttribute('error')).toBe(true);
    expect(element2.hasAttribute('error')).toBe(true);
    expect(element1.getAttribute('error-text')).toBeNull();
    expect(element2.getAttribute('error-text')?.length).toBeGreaterThan(0);

    const input1 = getShadowContent(element1, '[part="input"]') as HTMLInputElement | null;
    const input2 = getShadowContent(element2, '[part="input"]') as HTMLInputElement | null;
    expect(input1?.getAttribute('aria-invalid')).toBe('true');
    expect(input2?.getAttribute('aria-invalid')).toBe('true');

    // validity / message（anchor）
    const radio = element2 as unknown as {
      validity: ValidityState;
      validationMessage: string;
    };
    expect(radio.validity.valid).toBe(false);
    expect(radio.validationMessage.length).toBeGreaterThan(0);
  });

  it('未選択エラー後に選択するとエラーがクリアされる（グループ）', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    form = document.createElement('form');
    document.body.appendChild(form);

    element1 = document.createElement('dads-radio');
    element1.setAttribute('name', 'required-group');
    element1.setAttribute('label', 'A');
    element1.setAttribute('required', '');
    element1.setAttribute('auto-validate', '');
    form.appendChild(element1);

    element2 = document.createElement('dads-radio');
    element2.setAttribute('name', 'required-group');
    element2.setAttribute('label', 'B');
    element2.setAttribute('required', '');
    form.appendChild(element2);

    await waitForCustomElement(element1);
    await waitForCustomElement(element2);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(element1.hasAttribute('error')).toBe(true);
    expect(element2.hasAttribute('error')).toBe(true);

    const input2 = getShadowContent(element2, '[part="input"]') as HTMLInputElement | null;
    if (!input2) throw new Error('input not found');

    input2.checked = true;
    input2.dispatchEvent(new Event('change', { bubbles: true }));

    expect(element1.hasAttribute('error')).toBe(false);
    expect(element2.hasAttribute('error')).toBe(false);

    const input1 = getShadowContent(element1, '[part="input"]') as HTMLInputElement | null;
    expect(input1?.getAttribute('aria-invalid')).toBe('false');
    expect(input2.getAttribute('aria-invalid')).toBe('false');

    const radio = element2 as unknown as {
      validity: ValidityState;
    };
    expect(radio.validity.valid).toBe(true);
  });
});

describe('DadsRadio - Fieldset内での※必須表示', () => {
  let fieldset: HTMLElement;
  let element: HTMLElement;

  afterEach(() => {
    if (fieldset) fieldset.remove();
    if (element) element.remove();
  });

  it('単体でrequired時は※必須が表示される', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    defineDefaultRadio();

    element = document.createElement('dads-radio');
    element.setAttribute('required', '');
    element.setAttribute('label', 'テスト');
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('fieldset(required)内のradio(required)は※必須を表示しない', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    const { defineDefaultFieldset } = await import('../fieldset/fieldset-define');
    defineDefaultRadio();
    defineDefaultFieldset();

    fieldset = document.createElement('dads-fieldset');
    fieldset.setAttribute('required', '');
    fieldset.setAttribute('legend', '東京23区');
    document.body.appendChild(fieldset);

    element = document.createElement('dads-radio');
    element.setAttribute('required', '');
    element.setAttribute('label', '東京23区');
    element.setAttribute('name', 'tokyo-23');
    fieldset.appendChild(element);

    await waitForCustomElement(fieldset);
    await waitForCustomElement(element);
    // slotchange発火を待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    // fieldsetのlegendには※必須が表示される
    const fieldsetRequirement = fieldset.shadowRoot?.querySelector('[part="requirement"]');
    expect(fieldsetRequirement?.textContent).toBe('※必須');

    // radioには※必須が表示されない
    const radioRequirement = getShadowContent(element, '[part="requirement"]');
    expect(radioRequirement?.textContent).toBe('');
  });

  it('fieldset(required無し)内のradio(required)は※必須を表示する', async () => {
    const { defineDefaultRadio } = await import('./radio-define');
    const { defineDefaultFieldset } = await import('../fieldset/fieldset-define');
    defineDefaultRadio();
    defineDefaultFieldset();

    fieldset = document.createElement('dads-fieldset');
    fieldset.setAttribute('legend', '任意グループ');
    document.body.appendChild(fieldset);

    element = document.createElement('dads-radio');
    element.setAttribute('required', '');
    element.setAttribute('label', '必須項目');
    element.setAttribute('name', 'any');
    fieldset.appendChild(element);

    await waitForCustomElement(fieldset);
    await waitForCustomElement(element);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // fieldsetのlegendには※必須が表示されない
    const fieldsetRequirement = fieldset.shadowRoot?.querySelector('[part="requirement"]');
    expect(fieldsetRequirement?.textContent).toBe('');

    // radioには※必須が表示される
    const radioRequirement = getShadowContent(element, '[part="requirement"]');
    expect(radioRequirement?.textContent).toBe('※必須');
  });
});
