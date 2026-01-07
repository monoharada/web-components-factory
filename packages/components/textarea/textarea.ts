/**
 * @module textarea
 * デジタル庁デザインシステム Textareaコンポーネント
 * @version 1.0.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { textareaTokens } from './textarea-tokens.js';
import { textareaStyles } from './textarea-styles.js';
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
 * Textareaコンポーネント
 *
 * @customElement dads-textarea
 * @tagname dads-textarea
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot overflow-error - 文字数超過バリデーションのカスタムエラーメッセージ
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart requirement - 要否ラベル（必須/読み取り専用）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart textarea-wrapper - テキストエリアを囲むコンテナ
 * @csspart textarea - ネイティブtextarea要素
 * @csspart counter - 文字数カウンター（show-counter未設定時は:emptyで自動非表示）
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {boolean} required - 必須項目
 * @attr {number} maxlength - 最大文字数
 * @attr {boolean} show-counter - 文字数カウンター表示
 * @attr {number} counter-max - カウンター用最大値（maxlength未設定時）
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} readonly - 読み取り専用
 * @attr {string} name - フォーム名
 * @attr {number} rows - 行数（デフォルト: 3）
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 *
 * @example
 * ```html
 * <dads-textarea label="お問い合わせ内容" required show-counter maxlength="500">
 *   <span slot="support-text">500文字以内で入力してください</span>
 * </dads-textarea>
 * ```
 */
export class DadsTextarea extends TypographyFormComponent {
  static readonly formAssociated = true;

  // Private fields
  #textarea: HTMLTextAreaElement | null = null;
  #counter: HTMLElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;

  // バリデーション用スロット
  #requiredErrorSlot: HTMLSlotElement | null = null;
  #overflowErrorSlot: HTMLSlotElement | null = null;

  // バリデーション状態
  #validationErrorType: 'required' | 'overflow' | null = null;

  // フォームリスナー用（クリーンアップのため参照を保持）
  #boundForm: HTMLFormElement | null = null;

  static definition = {
    name: 'dads-textarea',
    template: html`
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="textarea">
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

        <div part="textarea-wrapper" id="textarea-wrapper">
          <textarea
            part="textarea"
            id="textarea"
            rows="3"
          ></textarea>
        </div>

        <span part="counter" id="counter"></span>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
        <slot name="overflow-error" id="overflow-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      textareaTokens,
      textareaStyles,
      applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('support-text'),
      BooleanAttr('required'),
      PropertyAttr('maxlength'),
      BooleanAttr('show-counter'),
      PropertyAttr('counter-max'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      BooleanAttr('disabled'),
      BooleanAttr('readonly'),
      // placeholder は非推奨: support-text を使用してください
      PropertyAttr('name'),
      PropertyAttr('rows'),
      PropertyAttr('size'),
      // value は observedAttributes に含めるが、PropertyAttr は使わない
      // カスタム getter/setter が定義されているため (property フィールドなし)
      { attribute: 'value' },
      BooleanAttr('auto-validate'),
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

    // 内部要素の参照を取得
    this.#textarea = this.shadowRoot?.querySelector('[part="textarea"]') as HTMLTextAreaElement;
    this.#counter = this.shadowRoot?.querySelector('[part="counter"]') as HTMLElement;
    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement;

    // バリデーション用スロット参照取得
    this.#requiredErrorSlot = this.shadowRoot?.querySelector('#required-error-slot') as HTMLSlotElement;
    this.#overflowErrorSlot = this.shadowRoot?.querySelector('#overflow-error-slot') as HTMLSlotElement;

    // 初期化
    this.#initTextarea();
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
    this.#syncTextareaAttributes();
    this.#updateLabelFallback();
    this.#updateSupportFallback();
    this.#updateErrorFallback();
    this.#updateRequirement();
    this.#updateCounter();
    this.#updateAriaDescribedBy();
  }

  #initTextarea() {
    if (!this.#textarea) return;

    // 属性の転送
    this.#syncTextareaAttributes();

    // イベントリスナー
    this.#textarea.addEventListener('input', this.#handleInput);
    this.#textarea.addEventListener('change', this.#handleChange);
    this.#textarea.addEventListener('blur', this.#handleBlur);
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

  #syncTextareaAttributes() {
    if (!this.#textarea) return;

    // 転送する属性（文字列）
    // placeholder は非推奨: 内部textareaには転送しない
    // auto-validate時はmaxlengthを転送しない（ブラウザの制限を無効化してバリデーションで制御）
    const hasAutoValidate = this.hasAttribute('auto-validate');
    const transferAttrs = hasAutoValidate ? ['name'] : ['maxlength', 'name'];
    for (const attr of transferAttrs) {
      const value = this.getAttribute(attr);
      if (value !== null) {
        this.#textarea.setAttribute(attr, value);
      }
    }

    // auto-validate時はmaxlengthを削除（属性変更で追加された場合に備えて）
    if (hasAutoValidate) {
      this.#textarea.removeAttribute('maxlength');
    }

    // rows属性は数値プロパティとして設定
    const rowsAttr = this.getAttribute('rows');
    if (rowsAttr !== null) {
      this.#textarea.rows = parseInt(rowsAttr, 10);
    }

    // Boolean属性
    this.#textarea.disabled = this.hasAttribute('disabled');
    this.#textarea.readOnly = this.hasAttribute('readonly');
    this.#textarea.required = this.hasAttribute('required');

    // 初期値の設定（value属性から）
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
      this.#textarea.value = valueAttr;
      this._internals.setFormValue(valueAttr);
    }

    // エラー状態
    const hasError = this.hasAttribute('error');
    this.#textarea.setAttribute('aria-invalid', hasError ? 'true' : 'false');
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
    // 全角アスタリスクをプレフィックスとして追加（スロット経由には付けない）
    fallback.textContent = hasContent ? '' : (errorAttr ? `＊${errorAttr}` : '');
    errorText.style.display = this.hasAttribute('error') ? '' : 'none';
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

  #updateCounter() {
    if (!this.#counter) return;

    const showCounter = this.hasAttribute('show-counter');
    if (!showCounter) {
      // :empty疑似クラスで非表示にするため、textContentを空にする
      this.#counter.textContent = '';
      this.#counter.removeAttribute('data-exceeded');
      return;
    }

    const currentLength = this.#textarea?.value.length ?? 0;
    const maxLength = this.getAttribute('maxlength') ?? this.getAttribute('counter-max');

    if (maxLength) {
      this.#counter.textContent = `${currentLength}/${maxLength}`;

      // 超過時のエラー状態
      const max = parseInt(maxLength, 10);
      if (currentLength > max) {
        this.#counter.setAttribute('data-exceeded', '');
      } else {
        this.#counter.removeAttribute('data-exceeded');
      }
    } else {
      this.#counter.textContent = `${currentLength}`;
    }
  }

  #updateAriaDescribedBy() {
    if (!this.#textarea) return;

    const ids: string[] = [];

    // サポートテキストがある場合
    const supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement;
    if (supportText && supportText.style.display !== 'none') {
      ids.push('support-text');
    }

    // カウンターがある場合
    if (this.hasAttribute('show-counter')) {
      ids.push('counter');
    }

    // エラーがある場合
    if (this.hasAttribute('error')) {
      ids.push('error-text');
    }

    if (ids.length > 0) {
      this.#textarea.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.#textarea.removeAttribute('aria-describedby');
    }
  }

  #handleInput = () => {
    this.#updateCounter();

    // フォーム値を更新
    if (this.#textarea) {
      this._internals.setFormValue(this.#textarea.value);
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

  #handleBlur = () => {
    // auto-validateが有効で、disabled/readonlyでない場合のみバリデーション
    if (!this.hasAttribute('auto-validate')) return;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;

    this.#validateOverflow();
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

    const isRequiredValid = this.#validateRequired();
    const isOverflowValid = this.#validateOverflow();

    if (!isRequiredValid || !isOverflowValid) {
      e.preventDefault();
    }
  };

  #validateOverflow(): boolean {
    const maxLength = this.getAttribute('maxlength') ?? this.getAttribute('counter-max');
    if (!maxLength) return true;

    const max = parseInt(maxLength, 10);
    // 無効な数値の場合は検証スキップ
    if (Number.isNaN(max)) return true;

    const isValid = this.value.length <= max;
    if (!isValid) {
      this.#showValidationError('overflow');
    } else if (this.#validationErrorType === 'overflow') {
      this.#clearValidationError();
    }
    return isValid;
  }

  #validateRequired(): boolean {
    if (!this.hasAttribute('required')) return true;

    const isValid = this.value.trim().length > 0;
    if (!isValid) {
      this.#showValidationError('required');
    }
    return isValid;
  }

  #showValidationError(type: 'required' | 'overflow'): void {
    this.#validationErrorType = type;
    const message = this.#getErrorMessage(type);
    this.setAttribute('error', '');
    this.setAttribute('error-text', message);
    this.#updateValidationUI(true);
    this._internals.setValidity(
      { customError: true },
      message,
      this.#textarea ?? undefined
    );
  }

  #clearValidationError(): void {
    if (this.#validationErrorType === null) return;
    this.#validationErrorType = null;
    this.removeAttribute('error');
    this.removeAttribute('error-text');
    this.#updateValidationUI(false);
    this._internals.setValidity({});
  }

  #updateValidationUI(hasError: boolean): void {
    this.#updateErrorFallback();
    this.#updateAriaDescribedBy();
    if (this.#textarea) {
      this.#textarea.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    }
  }

  #getErrorMessage(type: 'required' | 'overflow'): string {
    return getValidationMessage(this, VALIDATION_RULES[type]);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // 初期化前は無視
    if (!this.#textarea) return;

    switch (name) {
      case 'label':
        this.#updateLabelFallback();
        break;
      case 'support-text':
        this.#updateSupportFallback();
        this.#updateAriaDescribedBy();
        break;
      case 'required':
        this.#updateRequirement();
        if (this.#textarea) {
          this.#textarea.required = this.hasAttribute('required');
        }
        break;
      case 'maxlength':
      case 'counter-max':
      case 'show-counter':
        this.#updateCounter();
        this.#updateAriaDescribedBy();
        break;
      case 'error':
      case 'error-text':
        this.#updateErrorFallback();
        this.#updateAriaDescribedBy();
        if (this.#textarea) {
          this.#textarea.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
        }
        break;
      case 'disabled':
        if (this.#textarea) {
          this.#textarea.disabled = this.hasAttribute('disabled');
        }
        break;
      case 'readonly':
        this.#updateRequirement();
        if (this.#textarea) {
          this.#textarea.readOnly = this.hasAttribute('readonly');
        }
        break;
      case 'name':
        if (this.#textarea && newValue !== null) {
          this.#textarea.setAttribute(name, newValue);
        } else if (this.#textarea) {
          this.#textarea.removeAttribute(name);
        }
        break;
      // placeholder は非推奨: attributeChangedCallback では処理しない
      case 'rows':
        if (this.#textarea && newValue !== null) {
          this.#textarea.rows = parseInt(newValue, 10);
        }
        break;
      case 'value':
        if (this.#textarea && newValue !== null) {
          this.#textarea.value = newValue;
          this.#updateCounter();
        }
        break;
    }
  }

  // Public API
  get value(): string {
    return this.#textarea?.value ?? '';
  }

  set value(v: string) {
    if (this.#textarea) {
      this.#textarea.value = v;
      this._internals.setFormValue(v);
      this.#updateCounter();
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
    if (this.#textarea) {
      this.#textarea.disabled = disabled;
    }
  }

  // Focus delegation
  focus(options?: FocusOptions) {
    this.#textarea?.focus(options);
  }

  blur() {
    this.#textarea?.blur();
  }

  select() {
    this.#textarea?.select();
  }

  setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none') {
    this.#textarea?.setSelectionRange(start, end, direction);
  }
}

// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsTextarea, 'value', 'value');
