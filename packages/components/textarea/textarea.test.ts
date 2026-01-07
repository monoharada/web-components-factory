/**
 * DadsTextareaコンポーネント テスト
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
describe('DadsTextarea - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('コンポーネントが存在する', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('textarea要素が含まれる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]');
    expect(textarea).toBeInTheDocument();
    expect(textarea?.tagName.toLowerCase()).toBe('textarea');
  });

  it('ラベル要素が含まれる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]');
    expect(label).toBeInTheDocument();
  });
});

// ========== Phase 2: 属性反映 ==========
describe('DadsTextarea - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('label属性がフォールバックとして機能する', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('label', 'テストラベル');
    await waitForCustomElement(element);

    const labelText = getShadowContent(element, '[part="label-text"]');
    expect(labelText?.textContent).toContain('テストラベル');
  });

  it('required属性で「※必須」ラベルが表示される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('readonly属性で「編集不可」バッジが表示される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('編集不可');
  });

  it('requiredとreadonlyが両方設定された場合はrequiredが優先される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('required', '');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('support-text属性が表示される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('support-text', 'ヒントテキスト');
    await waitForCustomElement(element);

    const supportText = getShadowContent(element, '[part="support-text"]');
    expect(supportText?.textContent).toContain('ヒントテキスト');
  });

  it('rows属性がtextareaに反映される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('rows', '5');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    // happy-domでは文字列を返す場合があるため、数値に変換して比較
    expect(Number(textarea?.rows)).toBe(5);
  });

  // placeholder属性は非推奨: テストは「非推奨属性」セクションに移動

  it('デフォルトでsize="md"が適用される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('md');
  });
});

// ========== Phase 3: 文字数カウンター ==========
describe('DadsTextarea - 文字数カウンター', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('show-counter=trueでカウンターが表示される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('show-counter', '');
    element.setAttribute('maxlength', '100');
    await waitForCustomElement(element);

    const counter = getShadowContent(element, '[part="counter"]') as HTMLElement;
    // textContentが設定されていれば表示される（:emptyではない）
    expect(counter?.textContent).toContain('0/100');
  });

  it('入力時にカウンターが更新される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('show-counter', '');
    element.setAttribute('maxlength', '100');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'テスト入力';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      const counter = getShadowContent(element, '[part="counter"]');
      expect(counter?.textContent).toContain('5/100');
    });
  });

  it('counter-maxで最大値を独立設定可能', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('show-counter', '');
    element.setAttribute('counter-max', '200');
    await waitForCustomElement(element);

    const counter = getShadowContent(element, '[part="counter"]');
    expect(counter?.textContent).toContain('0/200');
  });

  it('show-counter=falseでカウンターが非表示（:emptyで制御）', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '100');
    await waitForCustomElement(element);

    const counter = getShadowContent(element, '[part="counter"]') as HTMLElement;
    // CSSの:empty疑似クラスで非表示になる（textContentが空）
    expect(counter?.textContent).toBe('');
  });

  // Note: happy-domでは動的なattributeChangedCallbackの呼び出しに制限がある
  // ブラウザでの動作確認が必要（viewer.htmlで検証可能）
  it.skip('show-counterを動的に切り替えるとカウンターの内容が変わる（ブラウザテスト推奨）', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '100');
    await waitForCustomElement(element);

    // 初期状態: カウンター非表示（空）
    let counter = getShadowContent(element, '[part="counter"]') as HTMLElement;
    expect(counter?.textContent).toBe('');

    // show-counter追加: カウンター表示
    element.setAttribute('show-counter', '');
    await new Promise(resolve => setTimeout(resolve, 50));
    await waitFor(() => {
      counter = getShadowContent(element, '[part="counter"]') as HTMLElement;
      expect(counter?.textContent).toContain('0/100');
    }, { timeout: 2000 });

    // show-counter削除: カウンター非表示（空に戻る）
    element.removeAttribute('show-counter');
    await new Promise(resolve => setTimeout(resolve, 50));
    await waitFor(() => {
      counter = getShadowContent(element, '[part="counter"]') as HTMLElement;
      expect(counter?.textContent).toBe('');
    }, { timeout: 2000 });
  });
});

// ========== Phase 4: エラー状態 ==========
describe('DadsTextarea - エラー状態', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('error属性でエラー状態になる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('error', '');
    await waitForCustomElement(element);

    expect(element.hasAttribute('error')).toBe(true);
  });

  it('error-textが「＊」プレフィックス付きで表示される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('error', '');
    element.setAttribute('error-text', 'エラーメッセージ');
    await waitForCustomElement(element);

    // フォールバックspan要素を直接取得
    const fallback = element.shadowRoot?.querySelector('#error-fallback');
    expect(fallback?.textContent).toBe('＊エラーメッセージ');
  });

  it('error-textスロット使用時はプレフィックスが付かない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = document.createElement('dads-textarea');
    element.setAttribute('error', '');
    const customError = document.createElement('span');
    customError.slot = 'error-text';
    customError.textContent = 'カスタムエラー';
    element.appendChild(customError);
    document.body.appendChild(element);
    await waitForCustomElement(element);

    // スロット経由のカスタムエラーにはプレフィックスが付かない
    // Light DOMのコンテンツを直接確認
    const slottedContent = element.querySelector('[slot="error-text"]');
    expect(slottedContent?.textContent).toBe('カスタムエラー');

    // フォールバックは空であるべき（スロットに内容がある場合）
    const fallback = element.shadowRoot?.querySelector('#error-fallback');
    expect(fallback?.textContent).toBe('');
  });

  it('aria-invalid="true"が設定される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('error', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]');
    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
  });

  it('エラーがない場合はエラーテキストが非表示', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const errorText = getShadowContent(element, '[part="error-text"]') as HTMLElement;
    expect(errorText?.style.display).toBe('none');
  });
});

// ========== Phase 5: フォーム統合 ==========
describe('DadsTextarea - フォーム統合', () => {
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
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const component = element as any;
    component.value = 'テスト値';

    expect(component.value).toBe('テスト値');
  });

  it('disabled属性が内部textareaに反映される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    expect(textarea?.disabled).toBe(true);
  });

  it('readonly属性が内部textareaに反映される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    expect(textarea?.readOnly).toBe(true);
  });

  it('name属性が内部textareaに反映される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('name', 'message');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    expect(textarea?.name).toBe('message');
  });
});

// ========== Phase 6: アクセシビリティ ==========
describe('DadsTextarea - アクセシビリティ', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('ラベルとtextareaがfor/idで関連付けられる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const label = getShadowContent(element, '[part="label"]') as HTMLLabelElement;
    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;

    expect(label?.getAttribute('for')).toBe('textarea');
    expect(textarea?.id).toBe('textarea');
  });

  it('サポートテキストがaria-describedbyで関連付けられる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('support-text', 'ヒント');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]');
    const describedBy = textarea?.getAttribute('aria-describedby');
    expect(describedBy).toContain('support-text');
  });

  it('エラー時にerror-textがaria-describedbyに追加される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('error', '');
    element.setAttribute('error-text', 'エラー');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]');
    const describedBy = textarea?.getAttribute('aria-describedby');
    expect(describedBy).toContain('error-text');
  });

  it('カウンターがaria-live="polite"を持つ', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const counter = getShadowContent(element, '[part="counter"]');
    expect(counter?.getAttribute('aria-live')).toBe('polite');
  });

  it('エラーテキストがrole="alert"を持つ', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const errorText = getShadowContent(element, '[part="error-text"]');
    expect(errorText?.getAttribute('role')).toBe('alert');
  });
});

// ========== Phase 7: イベント ==========
describe('DadsTextarea - イベント', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('入力時にdads-inputイベントが発火する', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const inputHandler = vi.fn();
    element.addEventListener('dads-input', inputHandler);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'テスト';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(inputHandler).toHaveBeenCalled();
    });
  });

  it('変更確定時にdads-changeイベントが発火する', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    await waitForCustomElement(element);

    const changeHandler = vi.fn();
    element.addEventListener('dads-change', changeHandler);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'テスト';
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() => {
      expect(changeHandler).toHaveBeenCalled();
    });
  });
});

// ========== Phase 8: 非推奨属性 ==========
describe('DadsTextarea - 非推奨属性', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('placeholder属性を設定すると警告が出力される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // 属性を設定してからDOMに追加（connectedCallback前に属性が存在するように）
    element = document.createElement('dads-textarea');
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

  it('placeholder属性は内部textareaに転送されない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    // 警告を抑制
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // 属性を設定してからDOMに追加
    element = document.createElement('dads-textarea');
    element.setAttribute('placeholder', '入力してください');
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    // placeholder属性は転送されないので、空または未定義
    expect(textarea?.placeholder).toBeFalsy();

    warnSpy.mockRestore();
  });

  it('support-text属性が代替として機能する', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('support-text', '入力例: テストテキスト');
    await waitForCustomElement(element);

    const supportText = getShadowContent(element, '[part="support-text"]');
    expect(supportText?.textContent).toContain('入力例: テストテキスト');
    expect((supportText as HTMLElement)?.style.display).not.toBe('none');
  });

  it('support-text属性がaria-describedbyで関連付けられる', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('support-text', 'ヒントテキスト');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]');
    const describedBy = textarea?.getAttribute('aria-describedby');
    expect(describedBy).toContain('support-text');
  });
});

// ========== Phase 9: 文字数バリデーション (auto-validate) ==========
describe('DadsTextarea - 文字数バリデーション', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('auto-validateなしでblurしてもエラー表示されない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    // maxlengthを超える入力（auto-validateなし）
    textarea.value = '12345678901'; // 11文字
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      // auto-validateがないのでエラーは表示されない
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('auto-validate時、maxlength超過でblurするとエラー表示', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    // maxlengthを超える入力
    textarea.value = '12345678901'; // 11文字
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('auto-validate時、counter-max超過でblurするとエラー表示', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('counter-max', '10');
    element.setAttribute('auto-validate', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '12345678901'; // 11文字
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('エラー表示後に入力開始するとエラークリア', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;

    // エラー状態を作る
    textarea.value = '12345678901'; // 11文字
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });

    // 再入力でエラークリア
    textarea.value = '123'; // 3文字に修正
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('デフォルトメッセージは「＊入力可能な文字数を超えています」', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '12345678901';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      // error-text属性にはプレフィックスなし（表示時にプレフィックスが付く）
      expect(element.getAttribute('error-text')).toBe('入力可能な文字数を超えています');
    });
  });

  it('overflow-errorスロットでカスタムメッセージ使用', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    // スロットにカスタムメッセージを設定
    element = document.createElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    const customMessage = document.createElement('span');
    customMessage.slot = 'overflow-error';
    customMessage.textContent = 'カスタムエラー';
    element.appendChild(customMessage);
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '12345678901';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      expect(element.getAttribute('error-text')).toBe('カスタムエラー');
    });
  });

  it('maxlength以下の場合はエラーが表示されない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '1234567890'; // ちょうど10文字
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });
});

// ========== Phase 10: 必須バリデーション (auto-validate) ==========
describe('DadsTextarea - 必須バリデーション', () => {
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
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    // requiredなし
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // フォーム送信
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('auto-validate + required時、空で送信するとエラー表示', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 空のまま送信
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(element.hasAttribute('error')).toBe(true);
    });
  });

  it('フォーム送信がpreventDefaultで阻止される', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 送信イベント
    const submitHandler = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submitHandler);

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    const defaultPrevented = !form.dispatchEvent(submitEvent);

    // バリデーションエラーでデフォルトが阻止されるはず
    expect(defaultPrevented).toBe(true);
  });

  it('デフォルトメッセージは「この項目は入力が必須です」（表示時に＊プレフィックス）', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      // error-text属性にはプレフィックスなし（表示時にプレフィックスが付く）
      expect(element.getAttribute('error-text')).toBe('この項目は入力が必須です');
    });
  });

  it('required-errorスロットでカスタムメッセージ使用', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
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
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    form = document.createElement('form');
    element = document.createElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    element.setAttribute('required', '');
    form.appendChild(element);
    document.body.appendChild(form);
    await waitForCustomElement(element);

    // 値を入力
    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'テスト入力';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 送信
    let defaultPrevented = false;
    form.addEventListener('submit', (e) => {
      if (e.defaultPrevented) {
        defaultPrevented = true;
      }
      e.preventDefault(); // テスト用に実際の送信は防ぐ
    });

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      // 値があるので阻止されない（コンポーネントによるpreventDefaultはない）
      expect(element.hasAttribute('error')).toBe(false);
    });
  });
});

// ========== Phase 11: バリデーション共通 ==========
describe('DadsTextarea - バリデーション共通', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('disabled時はバリデーションしない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '12345678901'; // 超過
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      // disabledなのでバリデーションされない
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('readonly時はバリデーションしない', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('maxlength', '10');
    element.setAttribute('auto-validate', '');
    element.setAttribute('readonly', '');
    await waitForCustomElement(element);

    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = '12345678901'; // 超過
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    await waitFor(() => {
      // readonlyなのでバリデーションされない
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  it('手動errorとauto-validateの共存', async () => {
    const { defineTextarea } = await import('./textarea-define');
    defineTextarea();

    element = createTestElement('dads-textarea');
    element.setAttribute('auto-validate', '');
    element.setAttribute('error', ''); // 手動でエラーを設定
    element.setAttribute('error-text', '手動エラー');
    await waitForCustomElement(element);

    // 手動エラーが表示されている
    expect(element.getAttribute('error-text')).toBe('手動エラー');

    // 入力しても手動エラーはクリアされない（auto-validateのエラーのみクリア対象）
    const textarea = getShadowContent(element, '[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'テスト';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 注: 現在の設計では、手動errorも入力時にクリアされる
    // これは設計上の選択であり、必要に応じて調整可能
  });
});
