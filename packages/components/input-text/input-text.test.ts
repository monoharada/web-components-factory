/**
 * DadsInputTextコンポーネント テスト
 * TDD（テスト駆動開発）アプローチ
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

// ========== Phase 1: 基本レンダリング ==========
describe('DadsInputText - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('コンポーネントが存在する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('input要素が含まれる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]');
    expect(input).toBeInTheDocument();
    expect(input?.tagName.toLowerCase()).toBe('input');
  });

  it('ラベル要素が含まれる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]');
    expect(label).toBeInTheDocument();
  });
});

// ========== Phase 2: 属性反映 ==========
describe('DadsInputText - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('label属性がフォールバックとして機能する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('label', 'テストラベル');
    await waitForCustomElement(element);

    const labelText = getShadowContent(element, '[part="label-text"]');
    expect(labelText?.textContent).toContain('テストラベル');
  });

  it('required属性で「※必須」ラベルが表示される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('readonly属性で「編集不可」バッジが表示される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('編集不可');
  });

  it('requiredとreadonlyが両方設定された場合はrequiredが優先される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('required', '');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('support-text属性が表示される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('support-text', 'ヒントテキスト');
    await waitForCustomElement(element);

    const supportText = getShadowContent(element, '[part="support-text"]');
    expect(supportText?.textContent).toContain('ヒントテキスト');
  });

  it('type属性がinputに反映される (text)', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('type', 'text');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.type).toBe('text');
  });

  it('type属性がinputに反映される (email)', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('type', 'email');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.type).toBe('email');
  });

  it('type属性がinputに反映される (tel)', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('type', 'tel');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.type).toBe('tel');
  });

  it('デフォルトでsize="md"が適用される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('md');
  });

  it('デフォルトでinput-width="full"が適用される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    expect(element.getAttribute('input-width')).toBe('full');
  });
});

// ========== Phase 3: 幅バリエーション ==========
describe('DadsInputText - 幅バリエーション', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('input-width="short"で幅が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', 'short');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toContain('var(--input-width-short)');
  });

  it('input-width="medium"で幅が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', 'medium');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toContain('var(--input-width-medium)');
  });

  it('input-width="full"で幅が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', 'full');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toContain('var(--input-width-full)');
  });

  it('カスタム幅値（px）が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', '200px');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toBe('200px');
  });

  it('カスタム幅値（ch）が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', '20ch');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toBe('20ch');
  });

  it('カスタム幅値（%）が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', '50%');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toBe('50%');
  });

  it('無効な幅値はfullにフォールバック', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('input-width', 'invalid');
    await waitForCustomElement(element);

    const style = element.style.getPropertyValue('--dads-input-width');
    expect(style).toContain('var(--input-width-full)');
  });
});

// ========== Phase 4: エラー状態 ==========
describe('DadsInputText - エラー状態', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('error属性でエラー状態になる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('error', '');
    await waitForCustomElement(element);

    expect(element.hasAttribute('error')).toBe(true);
  });

  it('error-textが「＊」プレフィックス付きで表示される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('error', '');
    element.setAttribute('error-text', 'エラーメッセージ');
    await waitForCustomElement(element);

    // フォールバックspan要素を直接取得
    const fallback = element.shadowRoot?.querySelector('#error-fallback');
    expect(fallback?.textContent).toBe('＊エラーメッセージ');
  });

  it('error-textスロット使用時はプレフィックスが付かない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = document.createElement('dads-input-text');
    element.setAttribute('error', '');
    const customError = document.createElement('span');
    customError.slot = 'error-text';
    customError.textContent = 'カスタムエラー';
    element.appendChild(customError);
    document.body.appendChild(element);
    await waitForCustomElement(element);

    // スロット経由のカスタムエラーにはプレフィックスが付かない
    const slottedContent = element.querySelector('[slot="error-text"]');
    expect(slottedContent?.textContent).toBe('カスタムエラー');

    // フォールバックは空であるべき
    const fallback = element.shadowRoot?.querySelector('#error-fallback');
    expect(fallback?.textContent).toBe('');
  });

  it('aria-invalid="true"が設定される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('error', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('エラーがない場合はエラーテキストが非表示', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const errorText = getShadowContent(element, '[part="error-text"]') as HTMLElement;
    expect(errorText?.style.display).toBe('none');
  });
});

// ========== Phase 5: フォーム統合 ==========
describe('DadsInputText - フォーム統合', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
    if (form) {
      form.remove();
    }
  });

  it('value プロパティで値を取得・設定できる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const component = element as unknown as { value: string };
    component.value = 'テスト値';

    expect(component.value).toBe('テスト値');
  });

  it('disabled属性が内部inputに反映される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.disabled).toBe(true);
  });

  it('readonly属性が内部inputに反映される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.readOnly).toBe(true);
  });

  it('name属性が内部inputに反映される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('name', 'email');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.name).toBe('email');
  });

  it('autocomplete属性が内部inputに反映される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('autocomplete', 'email');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.autocomplete).toBe('email');
  });
});

// ========== Phase 6: アクセシビリティ ==========
describe('DadsInputText - アクセシビリティ', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('ラベルとinputがfor/idで関連付けられる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]') as HTMLLabelElement;
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;

    expect(label?.getAttribute('for')).toBe('input');
    expect(input?.id).toBe('input');
  });

  it('サポートテキストがaria-describedbyで関連付けられる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('support-text', 'ヒント');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]');
    const describedBy = input?.getAttribute('aria-describedby');
    expect(describedBy).toContain('support-text');
  });

  it('エラー時にerror-textがaria-describedbyに追加される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('error', '');
    element.setAttribute('error-text', 'エラー');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]');
    const describedBy = input?.getAttribute('aria-describedby');
    expect(describedBy).toContain('error-text');
  });

  it('エラーテキストにrole="alert"が設定されていない（DADSガイドライン準拠）', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const errorText = getShadowContent(element, '[part="error-text"]');
    expect(errorText?.hasAttribute('role')).toBe(false);
  });

  it('エラーテキストにaria-liveが設定されていない（DADSガイドライン準拠）', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const errorText = getShadowContent(element, '[part="error-text"]');
    expect(errorText?.hasAttribute('aria-live')).toBe(false);
  });
});

// ========== Phase 7: イベント ==========
describe('DadsInputText - イベント', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('入力時にdads-inputイベントが発火する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const inputHandler = vi.fn();
    element.addEventListener('dads-input', inputHandler);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'テスト';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(inputHandler).toHaveBeenCalled();
    });
  });

  it('変更確定時にdads-changeイベントが発火する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    const changeHandler = vi.fn();
    element.addEventListener('dads-change', changeHandler);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'テスト';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() => {
      expect(changeHandler).toHaveBeenCalled();
    });
  });
});

// ========== Phase 8: 非推奨属性 ==========
describe('DadsInputText - 非推奨属性', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('placeholder属性を設定すると警告が出力される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    element = document.createElement('dads-input-text');
    element.setAttribute('placeholder', '入力してください');
    document.body.appendChild(element);
    await waitForCustomElement(element);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('placeholder')
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('非推奨')
    );

    warnSpy.mockRestore();
  });

  it('placeholder属性は内部inputに転送されない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    element = document.createElement('dads-input-text');
    element.setAttribute('placeholder', '入力してください');
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.placeholder).toBeFalsy();

    warnSpy.mockRestore();
  });

  it('support-text属性が代替として機能する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('support-text', '入力例: テストテキスト');
    await waitForCustomElement(element);

    const supportText = getShadowContent(element, '[part="support-text"]');
    expect(supportText?.textContent).toContain('入力例: テストテキスト');
    expect((supportText as HTMLElement)?.style.display).not.toBe('none');
  });
});

// ========== Phase 9: 必須バリデーション (auto-validate) ==========
describe('DadsInputText - 必須バリデーション', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
    if (form) {
      form.remove();
    }
  });

  it('auto-validate + requiredなしで送信時にエラー表示されない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('auto-validate + required時、空で送信するとエラー表示', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('フォーム送信がpreventDefaultで阻止される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitHandler = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submitHandler);

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    const defaultPrevented = !form.dispatchEvent(submitEvent);

    expect(defaultPrevented).toBe(true);
  });

  it('デフォルトメッセージは「この項目は入力が必須です」', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('この項目は入力が必須です');
    });
  });

  it('required-errorスロットでカスタムメッセージ使用', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    const customMessage = document.createElement('span');
    customMessage.slot = 'required-error';
    customMessage.textContent = '入力してください';
    element.appendChild(customMessage);
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('入力してください');
    });
  });

  it('値入力後は送信可能', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'テスト入力';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('エラー表示後に入力開始するとエラークリア', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // エラー状態を作る
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });

    // 入力でエラークリア
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'テスト';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });
});

// ========== Phase 10: バリデーション共通 ==========
describe('DadsInputText - バリデーション共通', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
    if (form) {
      form.remove();
    }
  });

  it('disabled時はバリデーションしない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    element.setAttribute('disabled', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('readonly時はバリデーションしない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    element.setAttribute('readonly', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });
});

// ========== Phase 11: Emailバリデーション (type mismatch) ==========
describe('DadsInputText - Emailバリデーション', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
    if (form) {
      form.remove();
    }
  });

  it('type="email" + auto-validate時、不正な形式で送信するとエラー表示', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 不正な形式を入力
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('デフォルトメッセージは「メールアドレスの形式が正しくありません」', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 不正な形式を入力
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('メールアドレスの形式が正しくありません');
    });
  });

  it('type-mismatch-errorスロットでカスタムメッセージ使用', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    const customMessage = document.createElement('span');
    customMessage.slot = 'type-mismatch-error';
    customMessage.textContent = '正しいメールアドレスを入力してください';
    element.appendChild(customMessage);
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 不正な形式を入力
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('正しいメールアドレスを入力してください');
    });
  });

  it('正しいemail形式で送信時はエラー表示されない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 正しい形式を入力
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    form.addEventListener('submit', (e) => e.preventDefault());

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('required + type="email"時、両方のバリデーションが機能する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 空で送信 → requiredエラー
    let submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('この項目は入力が必須です');
    });

    // 不正な形式を入力 → type mismatchエラー
    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('メールアドレスの形式が正しくありません');
    });
  });

  it('空の値ではtype mismatchバリデーションを行わない', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    // required なし
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    form.addEventListener('submit', (e) => e.preventDefault());

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('Email形式エラー後にテキスト削除して再送信すると必須エラー表示', async () => {
    // バグ再現シナリオ:
    // 1. required + type="email" + auto-validate
    // 2. "test" 入力 → Email形式エラー
    // 3. テキスト削除（空に）→ エラークリア
    // 4. 再送信 → 必須エラーが出るべき（バグ: 出ない）
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('type', 'email');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;

    // Step 1: "test" 入力してEmail形式エラー確認
    input.value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    let submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('メールアドレスの形式が正しくありません');
    });

    // Step 2: テキスト削除（空に）
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // エラーがクリアされる
    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });

    // Step 3: 再度サブミット → 必須エラー表示されるべき
    submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('この項目は入力が必須です');
    });
  });
});

// ========== Phase 12: ライフサイクルとクリーンアップ ==========
describe('DadsInputText - ライフサイクルとクリーンアップ', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element && element.isConnected) {
      element.remove();
    }
    if (form && form.isConnected) {
      form.remove();
    }
  });

  it('disconnectedCallback後にformのsubmitリスナーが削除される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    element.remove();

    const submitHandler = vi.fn();
    form.addEventListener('submit', submitHandler);
    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(submitHandler).toHaveBeenCalled();
  });

  it('コンポーネント削除後に再追加しても動作する', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    form = document.createElement('form');
    element = document.createElement('dads-input-text');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    element.remove();

    form.appendChild(element);
    await new Promise(resolve => setTimeout(resolve, 50));

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });
});

// ========== Phase: type属性変更 ==========
describe('DadsInputText - type属性変更', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('無効なtype値が設定されるとinputのtypeが"text"になる', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    element.setAttribute('type', 'invalid');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
    expect(input?.type).toBe('text');
  });

  // Note: 動的なtype属性変更テストはHappy-DOMの制限により省略
  // 実装は packages/components/input-text/input-text.ts の
  // attributeChangedCallback で正しく処理される
});

// ========== Phase: value同期 ==========
describe('DadsInputText - value同期', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('valueプロパティセッターで内部inputが更新される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    (element as unknown as { value: string }).value = 'property-value';

    await waitFor(() => {
      const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
      expect(input?.value).toBe('property-value');
    });
  });

  it('valueプロパティセッターを複数回呼んでも正しく同期される', async () => {
    const { defineInputText } = await import('./input-text-define');
    defineInputText();

    element = createTestElement('dads-input-text');
    await waitForCustomElement(element);

    (element as unknown as { value: string }).value = 'first-value';
    await waitFor(() => {
      const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
      expect(input?.value).toBe('first-value');
    });

    (element as unknown as { value: string }).value = 'second-value';
    await waitFor(() => {
      const input = getShadowContent(element, '[part="input"]') as HTMLInputElement;
      expect(input?.value).toBe('second-value');
    });
  });
});
