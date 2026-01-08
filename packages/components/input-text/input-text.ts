/**
 * @module input-text
 * デジタル庁デザインシステム InputTextコンポーネント
 * @version 1.0.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { inputTextTokens } from './input-text-tokens.js';
import { inputTextStyles } from './input-text-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import {
  checkDeprecatedAttrs,
  DEPRECATED_FORM_ATTRS,
} from '../../utils/deprecated-attrs.js';
import { hasSlotContent } from '../../utils/dom.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';

/**
 * InputTextコンポーネント
 *
 * @customElement dads-input-text
 * @tagname dads-input-text
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot type-mismatch-error - タイプ不一致（email形式）バリデーションのカスタムエラーメッセージ
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキストラッパー
 * @csspart requirement - 要否ラベル（必須/読み取り専用）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart input-wrapper - インプットを囲むコンテナ
 * @csspart input - ネイティブinput要素
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {string} type - 入力タイプ (text | email | tel)
 * @attr {boolean} required - 必須項目
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} readonly - 読み取り専用
 * @attr {string} name - フォーム名
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {string} input-width - 幅バリアント (short | medium | full | カスタム値)
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 * @attr {string} autocomplete - オートコンプリートヒント
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 *
 * @example
 * ```html
 * <dads-input-text label="メールアドレス" type="email" required>
 *   <span slot="support-text">例: example@example.com</span>
 * </dads-input-text>
 * ```
 */
export class DadsInputText extends TypographyFormComponent {
  static readonly formAssociated = true;

  // Private fields
  #input: HTMLInputElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;

  // バリデーション用スロット
  #requiredErrorSlot: HTMLSlotElement | null = null;
  #typeMismatchErrorSlot: HTMLSlotElement | null = null;

  // バリデーション状態
  #validationErrorType: 'required' | 'typeMismatch' | null = null;

  // フォームリスナー用（クリーンアップのため参照を保持）
  #boundForm: HTMLFormElement | null = null;

  static definition = {
    name: 'dads-input-text',
    template: html`
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="input">
          <span part="label-text" id="label-text">
            <slot name="label" id="label-slot"></slot>
            <span id="label-fallback"></span>
          </span>
          <span part="requirement" id="requirement"></span>
        </label>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span id="support-fallback"></span>
        </div>

        <div part="input-wrapper" id="input-wrapper">
          <input
            part="input"
            id="input"
            type="text"
          />
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
        <slot name="type-mismatch-error" id="type-mismatch-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      inputTextTokens,
      inputTextStyles,
      applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('support-text'),
      PropertyAttr('type'),
      BooleanAttr('required'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      BooleanAttr('disabled'),
      BooleanAttr('readonly'),
      PropertyAttr('name'),
      PropertyAttr('size'),
      PropertyAttr('input-width'),
      BooleanAttr('auto-validate'),
      PropertyAttr('autocomplete'),
      // value は observedAttributes に含めるが、PropertyAttr は使わない
      { attribute: 'value' },
    ],
  };

  connectedCallback() {
    super.connectedCallback();

    // 非推奨属性のチェック（警告を出力）
    checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);

    // デフォルト属性の設定
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'md');
    }
    if (!this.hasAttribute('input-width')) {
      this.setAttribute('input-width', 'full');
    }

    // 内部要素の参照を取得
    this.#input = this.shadowRoot?.querySelector('[part="input"]') as HTMLInputElement;
    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement;

    // バリデーション用スロット参照取得
    this.#requiredErrorSlot = this.shadowRoot?.querySelector('#required-error-slot') as HTMLSlotElement;
    this.#typeMismatchErrorSlot = this.shadowRoot?.querySelector('#type-mismatch-error-slot') as HTMLSlotElement;

    // 初期化
    this.#initInput();
    this.#initSlots();
    this.#setupFormValidation();

    // 属性が接続後に設定された場合のために再同期
    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#syncAllState();
    });
  }

  disconnectedCallback() {
    // Form submit リスナーのクリーンアップ（メモリリーク防止）
    if (this.#boundForm) {
      this.#boundForm.removeEventListener('submit', this.#handleFormSubmit);
      this.#boundForm = null;
    }
  }

  #syncAllState(): void {
    this.#syncInputAttributes();
    this.#updateLabelFallback();
    this.#updateSupportFallback();
    this.#updateErrorFallback();
    this.#updateRequirement();
    this.#updateInputWidth();
    this.#updateAriaDescribedBy();
  }

  #initInput() {
    if (!this.#input) return;

    // 属性の転送
    this.#syncInputAttributes();

    // イベントリスナー
    this.#input.addEventListener('input', this.#handleInput);
    this.#input.addEventListener('change', this.#handleChange);
  }

  #initSlots() {
    // スロットの変更を監視してフォールバック表示を制御
    this.#labelSlot?.addEventListener('slotchange', () => this.#updateLabelFallback());
    this.#supportSlot?.addEventListener('slotchange', () => this.#updateSupportFallback());
    this.#errorSlot?.addEventListener('slotchange', () => this.#updateErrorFallback());

    // 初回チェック
    this.#updateLabelFallback();
    this.#updateSupportFallback();
    this.#updateErrorFallback();
    this.#updateRequirement();
  }

  #syncInputAttributes() {
    if (!this.#input) return;

    // type属性の転送
    const typeAttr = this.getAttribute('type');
    if (typeAttr !== null && ['text', 'email', 'tel'].includes(typeAttr)) {
      this.#input.type = typeAttr;
    }

    // 転送する属性（文字列）
    const transferAttrs = ['name', 'autocomplete'];
    for (const attr of transferAttrs) {
      const value = this.getAttribute(attr);
      if (value !== null) {
        this.#input.setAttribute(attr, value);
      }
    }

    // Boolean属性
    this.#input.disabled = this.hasAttribute('disabled');
    this.#input.readOnly = this.hasAttribute('readonly');
    // required は内部inputに転送しない（ネイティブバリデーションを使わず、カスタムバリデーションで制御）
    // 代わりに aria-required を設定してアクセシビリティを維持
    if (this.hasAttribute('required')) {
      this.#input.setAttribute('aria-required', 'true');
    } else {
      this.#input.removeAttribute('aria-required');
    }

    // 初期値の設定（value属性から）
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
      this.#input.value = valueAttr;
      this._internals.setFormValue(valueAttr);
    }

    // エラー状態
    const hasError = this.hasAttribute('error');
    this.#input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  #updateLabelFallback() {
    const fallback = this.shadowRoot?.querySelector('#label-fallback') as HTMLElement;
    if (!fallback) return;
    fallback.textContent = hasSlotContent(this.#labelSlot)
      ? ''
      : this.getAttribute('label') ?? '';
  }

  #updateSupportFallback() {
    const supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement;
    const fallback = this.shadowRoot?.querySelector('#support-fallback') as HTMLElement;
    if (!supportText || !fallback) return;

    const hasContent = hasSlotContent(this.#supportSlot);
    fallback.textContent = hasContent ? '' : this.getAttribute('support-text') ?? '';
    supportText.style.display = (hasContent || this.getAttribute('support-text')) ? '' : 'none';
  }

  #updateErrorFallback() {
    const errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement;
    const fallback = this.shadowRoot?.querySelector('#error-fallback') as HTMLElement;
    if (!errorText || !fallback) return;

    const hasContent = hasSlotContent(this.#errorSlot);
    const errorAttr = this.getAttribute('error-text');
    const hasError = this.hasAttribute('error');
    // 全角アスタリスクをプレフィックスとして追加（スロット経由には付けない）
    fallback.textContent = hasContent ? '' : (errorAttr ? `＊${errorAttr}` : '');
    errorText.style.display = hasError ? '' : 'none';
  }

  #updateRequirement() {
    const requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement;
    if (!requirement) return;

    // required と readonly は排他的（required優先）
    if (this.hasAttribute('required')) {
      requirement.textContent = '※必須';
      requirement.style.display = '';
    } else if (this.hasAttribute('readonly')) {
      requirement.textContent = '編集不可';
      requirement.style.display = '';
    } else {
      requirement.textContent = '';
      requirement.style.display = 'none';
    }
  }

  #updateInputWidth(): void {
    const width = this.getAttribute('input-width') || 'full';

    switch (width) {
      case 'short':
        this.style.setProperty('--dads-input-width', 'var(--input-width-short)');
        break;
      case 'medium':
        this.style.setProperty('--dads-input-width', 'var(--input-width-medium)');
        break;
      case 'full':
        this.style.setProperty('--dads-input-width', 'var(--input-width-full)');
        break;
      default:
        // カスタム値 (200px, 20ch, 50% など)
        if (/^\d+(\.\d+)?(px|ch|em|rem|vw|%)$/.test(width)) {
          this.style.setProperty('--dads-input-width', width);
        } else {
          // 無効な値はfullにフォールバック
          this.style.setProperty('--dads-input-width', 'var(--input-width-full)');
        }
    }
  }

  #updateAriaDescribedBy() {
    if (!this.#input) return;

    const ids: string[] = [];

    // サポートテキストがある場合
    const supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement;
    if (supportText && supportText.style.display !== 'none') {
      ids.push('support-text');
    }

    // エラーがある場合
    if (this.hasAttribute('error')) {
      ids.push('error-text');
    }

    if (ids.length > 0) {
      this.#input.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.#input.removeAttribute('aria-describedby');
    }
  }

  #handleInput = () => {
    // フォーム値を更新
    if (this.#input) {
      this._internals.setFormValue(this.#input.value);
    }

    // auto-validate時、入力開始でバリデーションエラーをクリア
    if (this.hasAttribute('auto-validate') && this.#validationErrorType) {
      this.#clearValidationError();
    }

    // カスタムイベント発火
    this.emitEvent('dads-input', { value: this.value });
  };

  #handleChange = () => {
    this.emitEvent('dads-change', { value: this.value });
  };

  #setupFormValidation(): void {
    if (!this.hasAttribute('auto-validate')) return;

    // フォームに接続されたらsubmitイベントをリッスン
    // queueMicrotaskで遅延させてDOMの構築完了を待つ
    queueMicrotask(() => {
      if (!this.isConnected) return;

      // _internals.formを優先、フォールバックとしてDOM探索
      let form: HTMLFormElement | null = this._internals.form;

      if (!form) {
        // フォールバック: 親要素を辿ってformを探す
        let current: HTMLElement | null = this.parentElement;
        while (current) {
          if (current instanceof HTMLFormElement) {
            form = current;
            break;
          }
          current = current.parentElement;
        }
      }

      if (form) {
        this.#boundForm = form;
        form.addEventListener('submit', this.#handleFormSubmit);
      }
    });
  }

  #handleFormSubmit = (e: Event): void => {
    // disabled/readonlyの場合はバリデーションしない
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;

    // 順序: required → typeMismatch
    const isRequiredValid = this.#validateRequired();
    if (!isRequiredValid) {
      e.preventDefault();
      return;
    }

    const isTypeMismatchValid = this.#validateTypeMismatch();
    if (!isTypeMismatchValid) {
      e.preventDefault();
    }
  };

  #validateRequired(): boolean {
    if (!this.hasAttribute('required')) return true;

    const isValid = this.value.trim().length > 0;
    if (!isValid) {
      this.#showValidationError('required');
    }
    return isValid;
  }

  #validateTypeMismatch(): boolean {
    // type="email" の場合のみバリデーション
    if (this.getAttribute('type') !== 'email') return true;

    // 空の値はバリデーションしない（requiredで別途チェック）
    if (this.value.trim().length === 0) return true;

    const isValid = VALIDATION_RULES.typeMismatch.validate(this.value, this);
    if (!isValid) {
      this.#showValidationError('typeMismatch');
    }
    return isValid;
  }

  #showValidationError(type: 'required' | 'typeMismatch'): void {
    this.#validationErrorType = type;
    const message = this.#getErrorMessage(type);
    this.setAttribute('error', '');
    this.setAttribute('error-text', message);
    this.#updateValidationUI(true);
    this._internals.setValidity(
      { customError: true },
      message,
      this.#input ?? undefined
    );
  }

  #clearValidationError(): void {
    if (this.#validationErrorType === null) return;
    this.#validationErrorType = null;
    this.removeAttribute('error');
    this.removeAttribute('error-text');
    this.#updateValidationUI(false);
    // バリデーション状態をクリアして、次回submitイベントが発火するようにする
    // 注意: サブミット時に #handleFormSubmit で改めてバリデーションが実行される
    this._internals.setValidity({});
  }

  #updateValidationUI(hasError: boolean): void {
    this.#updateErrorFallback();
    this.#updateAriaDescribedBy();
    if (this.#input) {
      this.#input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    }
  }

  #getErrorMessage(type: 'required' | 'typeMismatch'): string {
    return getValidationMessage(this, VALIDATION_RULES[type]);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // 初期化前は無視
    if (!this.#input) return;

    switch (name) {
      case 'label':
        this.#updateLabelFallback();
        break;
      case 'support-text':
        this.#updateSupportFallback();
        this.#updateAriaDescribedBy();
        break;
      case 'type':
        if (newValue !== null && ['text', 'email', 'tel'].includes(newValue)) {
          this.#input.type = newValue;
        }
        break;
      case 'required':
        this.#updateRequirement();
        if (this.#input) {
          // required は内部inputに転送しない（カスタムバリデーションで制御）
          // aria-required でアクセシビリティを維持
          if (this.hasAttribute('required')) {
            this.#input.setAttribute('aria-required', 'true');
          } else {
            this.#input.removeAttribute('aria-required');
          }
        }
        break;
      case 'error':
      case 'error-text':
        this.#updateErrorFallback();
        this.#updateAriaDescribedBy();
        if (this.#input) {
          this.#input.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
        }
        break;
      case 'disabled':
        if (this.#input) {
          this.#input.disabled = this.hasAttribute('disabled');
        }
        break;
      case 'readonly':
        this.#updateRequirement();
        if (this.#input) {
          this.#input.readOnly = this.hasAttribute('readonly');
        }
        break;
      case 'name':
        if (this.#input && newValue !== null) {
          this.#input.setAttribute(name, newValue);
        } else if (this.#input) {
          this.#input.removeAttribute(name);
        }
        break;
      case 'input-width':
        this.#updateInputWidth();
        break;
      case 'autocomplete':
        if (this.#input && newValue !== null) {
          this.#input.setAttribute('autocomplete', newValue);
        } else if (this.#input) {
          this.#input.removeAttribute('autocomplete');
        }
        break;
      case 'value':
        if (this.#input && newValue !== null) {
          this.#input.value = newValue;
        }
        break;
    }
  }

  // Public API
  get value(): string {
    return this.#input?.value ?? '';
  }

  set value(v: string) {
    if (this.#input) {
      this.#input.value = v;
      this._internals.setFormValue(v);
    }
  }

  // Form callbacks
  formResetCallback() {
    const defaultValue = this.getAttribute('value') ?? '';
    this.value = defaultValue;
  }

  formStateRestoreCallback(state: unknown, _mode: unknown) {
    if (state !== null && typeof state === 'string') {
      this.value = state;
    }
  }

  formDisabledCallback(disabled: boolean) {
    super.formDisabledCallback(disabled);
    if (this.#input) {
      this.#input.disabled = disabled;
    }
  }

  // Focus delegation
  focus(options?: FocusOptions) {
    this.#input?.focus(options);
  }

  blur() {
    this.#input?.blur();
  }

  select() {
    this.#input?.select();
  }

  setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none') {
    this.#input?.setSelectionRange(start, end, direction);
  }
}

// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsInputText, 'value', 'value');
