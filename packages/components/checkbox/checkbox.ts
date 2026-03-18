/**
 * @module checkbox
 * デジタル庁デザインシステム Checkboxコンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import {
  setDefaultAttributes,
  setupFormValidation,
  updateRequirement,
  type FormValidationSetup,
} from '../../utils/form-component-helpers.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { checkboxStyles } from './checkbox-styles.js';

/**
 * Checkboxコンポーネント
 *
 * DADS HTML版の構造・見た目に準拠しつつ、Form-Associated Custom Elementとしてフォームに参加します。
 * label 属性と name 属性を指定して利用してください。子テキストはラベル契約として扱いません。
 *
 * @customElement dads-checkbox
 * @tagname dads-checkbox
 *
 * @csspart base - label相当のラッパー
 * @csspart checkbox - チェックボックス枠（背景ホバー含む）
 * @csspart input - ネイティブinput[type=checkbox]
 * @csspart label - ラベルテキスト
 * @csspart requirement - 要否ラベル（※必須）
 *
 * @attr {string} label - ラベルテキスト
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {boolean} checked - 初期チェック状態（属性はデフォルト値として扱う）
 * @attr {boolean} indeterminate - 不確定状態
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須（未チェックでsubmit時にinvalid）
 * @attr {boolean} auto-validate - submit時の自動バリデーション
 * @attr {boolean} error - エラー状態（aria-invalid="true"）
 * @attr {string} error-text - エラーメッセージ（バリデーション時に設定）
 * @attr {string} name - フォーム名
 * @attr {string} value - 送信値（未指定時は "on"）
 * @attr {string} aria-label - アクセシビリティラベル（ラベルなし時に推奨）
 * @attr {string} aria-labelledby - 外部ラベル参照
 * @attr {string} aria-describedby - 補足/エラー参照
 *
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ（非表示）
 */
export class DadsCheckbox extends TypographyFormComponent {
  static override readonly formAssociated = true;

  static readonly version = '1.0.0';


  #base: HTMLLabelElement | null = null;
  #input: HTMLInputElement | null = null;
  #labelEl: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;
  #errorText: HTMLElement | null = null;

  #formDisabled = false;
  #validationError = false;
  #formValidation: FormValidationSetup | null = null;

  static definition = {
    name: 'dads-checkbox',
    template: html`
      <label part="base" id="base" class="dads-checkbox">
        <span part="checkbox" id="checkbox" class="dads-checkbox__checkbox">
          <input part="input" id="input" class="dads-checkbox__input" type="checkbox" />
        </span>
        <span part="label" id="label" class="dads-checkbox__label"></span>
        <span part="requirement" id="requirement"></span>
      </label>

      <!-- エラーメッセージ表示 -->
      <span part="error-text" id="error-text"></span>

      <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
      <slot name="required-error" id="required-error-slot" hidden></slot>
    `,
    styles: withReset([applyDADSTokens(), checkboxStyles], 'minimal'),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
      BooleanAttr('required'),
      BooleanAttr('auto-validate'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      PropertyAttr('name'),
      // checked/indeterminate/value はカスタムgetter/setterを持つため PropertyAttr/BooleanAttr を使わない
      { attribute: 'checked' },
      { attribute: 'indeterminate' },
      { attribute: 'value' },
      { attribute: 'aria-label' },
      { attribute: 'aria-labelledby' },
      { attribute: 'aria-describedby' },
    ],
  };

  // ベースクラスではobservedAttributesが自動で解決されないため明示（happy-dom含む互換性担保）
  static get observedAttributes(): string[] {
    return [
      'label',
      'size',
      'checked',
      'indeterminate',
      'disabled',
      'required',
      'auto-validate',
      'error',
      'error-text',
      'name',
      'value',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, { size: 'sm' });

    this.#base = this.shadowRoot?.querySelector('#base') as HTMLLabelElement | null;
    this.#input = this.shadowRoot?.querySelector('#input') as HTMLInputElement | null;
    this.#labelEl = this.shadowRoot?.querySelector('#label') as HTMLElement | null;
    this.#requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement | null;
    this.#errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement | null;

    this.#syncAll();

    this.#input?.addEventListener('change', this.#handleChange);

    this.#setupFormValidation();
  }

  disconnectedCallback(): void {
    this.#input?.removeEventListener('change', this.#handleChange);
    this.#formValidation?.cleanup();
    this.#formValidation = null;
  }

  // ============================================================
  // Public API
  // ============================================================

  get checked(): boolean {
    return this.#input?.checked ?? this.hasAttribute('checked');
  }

  set checked(v: boolean) {
    if (!this.#input) {
      // 初期化前は属性に退避（初期値として扱う）
      this.toggleAttribute('checked', v);
      return;
    }

    this.#input.checked = v;
    // checked を変更した場合は、視覚的な不確定状態を解除（一般的な挙動）
    if (!v && this.#input.indeterminate) {
      this.#input.indeterminate = false;
    }

    this.#syncFormValue();
    this.#syncValidationOnUserFix();
  }

  get indeterminate(): boolean {
    return this.#input?.indeterminate ?? this.hasAttribute('indeterminate');
  }

  set indeterminate(v: boolean) {
    if (!this.#input) {
      this.toggleAttribute('indeterminate', v);
      return;
    }

    this.#input.indeterminate = v;
  }

  get value(): string {
    return this.getAttribute('value') ?? 'on';
  }

  set value(v: string) {
    this.setAttribute('value', v);
  }

  // Focus delegation
  focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  blur(): void {
    this.#input?.blur();
  }

  /**
   * ※必須表示の再同期
   * fieldsetから呼び出される（スロット変更時やrequired属性変更時）
   */
  syncRequirement(): void {
    this.#syncRequirement();
  }

  // ============================================================
  // Form callbacks
  // ============================================================

  formResetCallback(): void {
    // checked属性をデフォルト値として扱い、リセット時に復元
    this.checked = this.hasAttribute('checked');
    this.indeterminate = this.hasAttribute('indeterminate');
    this.#clearValidationError();
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (state === null) {
      this.checked = false;
      return;
    }
    if (typeof state === 'string') {
      // setFormValue(value) が復元される前提（値の内容には依存しない）
      this.checked = true;
    }
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this.#formDisabled = disabled;
    if (this.#input) {
      this.#input.disabled = this.#isDisabled();
    }
    this.#syncFormValue();
  }

  // ============================================================
  // Internal sync
  // ============================================================

  #syncAll(): void {
    this.#syncLabel();
    this.#syncRequirement();
    this.#syncErrorText();
    this.#syncInputFromAttributes();
    this.#syncAria();
    this.#syncAriaInvalid();
    this.#syncFormValue();
  }

  #syncLabel(): void {
    if (!this.#labelEl) return;
    this.#labelEl.textContent = this.getAttribute('label') ?? '';
  }

  #syncRequirement(): void {
    // connectedCallback前は何もしない
    if (!this.#requirement) return;

    // fieldset内にいる場合は、fieldsetのlegendに※必須が表示されるため非表示
    const parentFieldset = this.closest('dads-fieldset');
    const insideRequiredFieldset = parentFieldset?.hasAttribute('required') ?? false;

    // fieldset内で親がrequired → checkbox自身は※必須を表示しない
    // checkboxはreadonlyがないのでfalse固定
    const showRequirement = this.hasAttribute('required') && !insideRequiredFieldset;
    updateRequirement(this.#requirement, showRequirement, false);
  }

  #syncErrorText(): void {
    if (!this.#errorText) return;
    const hasError = this.hasAttribute('error');
    const errorMessage = this.getAttribute('error-text') ?? '';
    // エラーがある場合のみメッセージを表示
    this.#errorText.textContent = hasError && errorMessage ? `＊${errorMessage}` : '';
  }

  #syncInputFromAttributes(): void {
    if (!this.#input) return;

    // 初期値は属性から読み取る（checked/indeterminate は属性をデフォルト値として扱う）
    this.#input.checked = this.hasAttribute('checked');
    this.#input.indeterminate = this.hasAttribute('indeterminate');

    // disabled は属性・フォームからの無効化を合成
    this.#input.disabled = this.#isDisabled();
  }

  #syncAria(): void {
    if (!this.#input) return;

    // required はネイティブrequiredに転送しない（Form-Associated側で制御）
    if (this.hasAttribute('required')) {
      this.#input.setAttribute('aria-required', 'true');
    } else {
      this.#input.removeAttribute('aria-required');
    }

    const ariaAttrs = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    for (const attr of ariaAttrs) {
      const v = this.getAttribute(attr);
      if (v === null) this.#input.removeAttribute(attr);
      else this.#input.setAttribute(attr, v);
    }
  }

  #syncAriaInvalid(): void {
    if (!this.#input) return;
    const hasError = this.hasAttribute('error');
    this.#input.setAttribute('aria-invalid', String(hasError));
  }

  #syncFormValue(): void {
    // disabled/unchecked は送信しない（ネイティブcheckbox準拠）
    if (this.#isDisabled() || !this.checked) {
      this._internals.setFormValue(null);
      return;
    }
    this._internals.setFormValue(this.value);
  }

  // ============================================================
  // Validation
  // ============================================================

  #setupFormValidation(): void {
    // 付け替えを許容（auto-validate属性の動的変更に追従）
    this.#formValidation?.cleanup();
    this.#formValidation = setupFormValidation(
      this,
      this._internals,
      'auto-validate',
      this.#handleFormSubmit
    );
  }

  #handleFormSubmit = (e: Event): void => {
    // disabled時はバリデーションしない
    if (this.#isDisabled()) return;
    if (!this.hasAttribute('required')) return;

    const isValid = this.checked;
    if (isValid) {
      this.#clearValidationError();
      return;
    }

    e.preventDefault();
    this.#showValidationError();
  };

  #showValidationError(): void {
    this.#validationError = true;
    const message = this.#getRequiredErrorMessage();

    this.setAttribute('error', '');
    this.setAttribute('error-text', message);
    this.#syncAriaInvalid();

    this._internals.setValidity({ valueMissing: true }, message, this.#input ?? undefined);
  }

  #clearValidationError(): void {
    if (!this.#validationError) return;
    this.#validationError = false;

    this.removeAttribute('error');
    this.removeAttribute('error-text');
    this.#syncAriaInvalid();
    this._internals.setValidity({});
  }

  #syncValidationOnUserFix(): void {
    if (!this.hasAttribute('auto-validate')) return;
    if (!this.#validationError) return;
    if (!this.hasAttribute('required')) return;
    if (!this.checked) return;

    this.#clearValidationError();
  }

  #getRequiredErrorMessage(): string {
    return getValidationMessage(this, VALIDATION_RULES.required);
  }

  // ============================================================
  // Events
  // ============================================================

  #handleChange = (): void => {
    if (!this.#input) return;

    // ネイティブ同様、ユーザー操作で不確定状態は解除される
    if (this.#input.indeterminate) {
      this.#input.indeterminate = false;
    }

    this.#syncFormValue();
    this.#syncValidationOnUserFix();

    this.emitEvent('dads-change', {
      checked: this.checked,
      indeterminate: this.indeterminate,
      value: this.value,
    });
  };

  // ============================================================
  // Attribute changes
  // ============================================================

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this.#input) return;

    switch (name) {
      case 'label':
        this.#syncLabel();
        break;
      case 'size':
        break;
      case 'checked':
        this.#input.checked = newValue !== null;
        this.#syncFormValue();
        break;
      case 'indeterminate':
        this.#input.indeterminate = newValue !== null;
        break;
      case 'disabled':
        this.#input.disabled = this.#isDisabled();
        this.#syncFormValue();
        break;
      case 'required':
        this.#syncRequirement();
        this.#syncAria();
        break;
      case 'auto-validate':
        this.#setupFormValidation();
        break;
      case 'error':
        this.#handleErrorAttributeChange();
        break;
      case 'error-text':
        this.#handleErrorTextAttributeChange();
        break;
      case 'value':
        this.#syncFormValue();
        break;
      case 'aria-label':
      case 'aria-labelledby':
      case 'aria-describedby':
        this.#syncAria();
        break;
    }
  }

  #handleErrorAttributeChange(): void {
    this.#syncAriaInvalid();
    this.#syncErrorText();

    if (!this.hasAttribute('error')) {
      if (!this.#validationError) {
        this._internals.setValidity({});
      }
      return;
    }

    if (!this.#validationError) {
      const message = this.getAttribute('error-text') ?? '';
      if (message) {
        this._internals.setValidity({ customError: true }, message, this.#input ?? undefined);
      }
    }
  }

  #handleErrorTextAttributeChange(): void {
    this.#syncErrorText();

    if (!this.hasAttribute('error')) return;

    const message = this.getAttribute('error-text') ?? '';
    const validityFlag = this.#validationError ? { valueMissing: true } : { customError: true };
    this._internals.setValidity(validityFlag, message, this.#input ?? undefined);
  }

  #isDisabled(): boolean {
    return this.hasAttribute('disabled') || this.#formDisabled;
  }
}
