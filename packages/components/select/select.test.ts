/**
 * DadsSelectコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

const basicOptions = `
  <option value="">選択してください</option>
  <option value="1">選択肢1</option>
  <option value="2">選択肢2</option>
`;

async function defineSelectForTest(): Promise<void> {
  const { defineSelect } = await import('./select-define');
  defineSelect();
}

// ========== Phase 1: 基本レンダリング ==========
describe('DadsSelect - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('select要素が含まれる', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="select"]');
    expect(select).toBeInTheDocument();
    expect(select?.tagName.toLowerCase()).toBe('select');
  });
});

// ========== Phase 2: option同期 ==========
describe('DadsSelect - option同期', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('Light DOMのoptionが内部selectに複製される', async () => {
    await defineSelectForTest();

    element = renderWebComponent(`
      <dads-select>
        ${basicOptions}
      </dads-select>
    `);
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    expect(select.options.length).toBe(3);
    expect(select.options[1].textContent).toBe('選択肢1');
    expect(select.options[2].value).toBe('2');
  });

  it('value属性で初期選択が反映される', async () => {
    await defineSelectForTest();

    element = renderWebComponent(`
      <dads-select value="2">
        ${basicOptions}
      </dads-select>
    `);
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('selected属性が初期選択として機能する（value属性未指定）', async () => {
    await defineSelectForTest();

    element = renderWebComponent(`
      <dads-select>
        <option value="1">選択肢1</option>
        <option value="2" selected>選択肢2</option>
        <option value="3">選択肢3</option>
      </dads-select>
    `);
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });
});

// ========== Phase 3: 属性反映 ==========
describe('DadsSelect - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('label属性がフォールバックとして機能する', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    element.setAttribute('label', 'テストラベル');
    await waitForCustomElement(element);

    const labelText = getShadowContent(element, '[part="label-text"]');
    expect(labelText?.textContent).toContain('テストラベル');
  });

  it('required属性で「※必須」ラベルが表示される', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('デフォルトでsize="md"が適用される', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('md');
  });

  it('size属性で幅トークンを指定できる（例: size="sm 256"）', async () => {
    await defineSelectForTest();

    element = renderWebComponent(`
      <dads-select size="sm 256">
        <option value="">選択してください</option>
        <option value="1">選択肢1</option>
      </dads-select>
    `);
    await waitForCustomElement(element);

    expect(element.style.getPropertyValue('--dads-select-width')).toBe('256px');

    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    expect(select.getAttribute('data-size')).toBe('sm');
  });

  it('aria-disabled属性で内部selectにaria-disabled="true"が反映される', async () => {
    await defineSelectForTest();

    element = createTestElement('dads-select');
    element.setAttribute('aria-disabled', '');
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    expect(select.getAttribute('aria-disabled')).toBe('true');
  });
});

// ========== Phase 4: 必須バリデーション ==========
describe('DadsSelect - 必須バリデーション', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    if (form) form.remove();
  });

  it('auto-validate + requiredなしで送信時にエラー表示されない', async () => {
    await defineSelectForTest();

    form = document.createElement('form');
    element = document.createElement('dads-select');
    element.setAttribute('auto-validate', '');
    element.innerHTML = `
      <option value="">選択してください</option>
      <option value="1">選択肢1</option>
    `;
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('auto-validate + required時、未選択で送信するとエラー表示', async () => {
    await defineSelectForTest();

    form = document.createElement('form');
    element = document.createElement('dads-select');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    element.innerHTML = `
      <option value="">選択してください</option>
      <option value="1">選択肢1</option>
    `;
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('required-errorスロットでカスタムメッセージ使用', async () => {
    await defineSelectForTest();

    form = document.createElement('form');
    element = document.createElement('dads-select');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    element.innerHTML = `
      <option value="">選択してください</option>
      <option value="1">選択肢1</option>
    `;
    const customMessage = document.createElement('span');
    customMessage.slot = 'required-error';
    customMessage.textContent = '選択してください（カスタム）';
    element.appendChild(customMessage);
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('選択してください（カスタム）');
    });
  });

  it('選択後はエラーがクリアされる（auto-validate）', async () => {
    await defineSelectForTest();

    form = document.createElement('form');
    element = document.createElement('dads-select');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    element.innerHTML = `
      <option value="">選択してください</option>
      <option value="1">選択肢1</option>
    `;
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 1) submitでエラー
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });

    // 2) 選択してinputイベントでクリア
    const select = getShadowContent(element, '[part="select"]') as HTMLSelectElement;
    select.value = '1';
    select.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });
});
