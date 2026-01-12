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
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

/**
 * Checkboxコンポーネント
 *
 * DADS HTML版の構造・見た目に準拠しつつ、Form-Associated Custom Elementとしてフォームに参加します。
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

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'コンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部にネイティブの <input type="checkbox"> を持ち、チェックボックスのセマンティクスをブラウザ標準で提供します。',
        'チェックボックスは <label> 内に配置されるため、ラベルテキストと操作対象が確実に関連付けられます。',
        'Form-Associated Custom Elementとしてフォームに参加し、checked時のみ値を送信します（ネイティブcheckboxの挙動に準拠）。',
      ],
      keyboard: [
        'Tabでフォーカス可能です。',
        'Spaceでチェック状態を切り替えできます（ネイティブ挙動）。',
      ],
      zoom: [
        'サイズ（sm/md/lg）に応じて操作面の大きさを調整し、拡大時も視認性・操作性を確保します。',
      ],
      states: [
        'checked / indeterminate / disabled をサポートします。',
        'error属性で aria-invalid="true" を付与し、エラー状態（赤系）を表示します（DADS HTML版に準拠）。',
      ],
      labels: [
        'label属性は視覚ラベルとして表示され、同時にネイティブlabel関連付けによりアクセシブルネームに寄与します。',
        'ラベルを表示しない場合は aria-label または aria-labelledby の指定を推奨します。',
        '補足説明は aria-describedby（外部要素ID）で関連付けできます。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'base',
        title: 'ラベルラッパー',
        label: '<label>',
        description: 'クリック領域を含め、チェックボックスとラベルを一体として提供します。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="base"]' },
      },
      {
        id: 'native-input',
        title: 'ネイティブチェックボックス',
        label: 'input[type="checkbox"]',
        description:
          'キーボード操作（Space）や状態（checked/indeterminate/disabled）の基本挙動はブラウザ標準に委譲します。',
        category: 'keyboard',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="input"]' },
      },
      {
        id: 'label-text',
        title: 'ラベルテキスト',
        label: 'label',
        description: 'label属性（または将来的な拡張）で表示されるテキスト。空の場合はaria-label等で補完します。',
        category: 'labels',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="label"]' },
      },
      {
        id: 'requirement',
        title: '要否ラベル',
        label: '※必須',
        description: 'required属性が設定されている場合に「※必須」と表示されます。必須入力であることを視覚的に伝えます。',
        category: 'labels',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="requirement"]' },
      },
    ],
  };

  #base: HTMLLabelElement | null = null;
  #input: HTMLInputElement | null = null;
  #labelEl: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;

  #formDisabled = false;
  #validationError = false;
  #formValidation: FormValidationSetup | null = null;

  static definition = {
    name: 'dads-checkbox',
    template: html`
      <label part="base" id="base" class="dads-checkbox" data-size="sm">
        <span part="checkbox" id="checkbox" class="dads-checkbox__checkbox">
          <input part="input" id="input" class="dads-checkbox__input" type="checkbox" />
        </span>
        <span part="label" id="label" class="dads-checkbox__label"></span>
        <span part="requirement" id="requirement"></span>
      </label>

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
    this.#syncSize();
    this.#syncLabel();
    this.#syncRequirement();
    this.#syncInputFromAttributes();
    this.#syncAria();
    this.#syncAriaInvalid();
    this.#syncFormValue();
  }

  #syncSize(): void {
    if (!this.#base) return;
    const sizeAttr = this.getAttribute('size');
    const size = sizeAttr === 'sm' || sizeAttr === 'md' || sizeAttr === 'lg' ? sizeAttr : 'sm';
    this.#base.setAttribute('data-size', size);
  }

  #syncLabel(): void {
    if (!this.#labelEl) return;
    this.#labelEl.textContent = this.getAttribute('label') ?? '';
  }

  #syncRequirement(): void {
    // checkboxはreadonlyがないのでfalse固定
    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
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
    this.#input.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
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
        this.#syncSize();
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
        this.#syncAriaInvalid();
        if (this.hasAttribute('error')) {
          // required由来のエラーは valueMissing を維持（#showValidationError が setValidity 済み）
          if (!this.#validationError) {
            const message = this.getAttribute('error-text') ?? '';
            if (message) {
              this._internals.setValidity({ customError: true }, message, this.#input ?? undefined);
            }
          }
        } else if (!this.#validationError) {
          this._internals.setValidity({});
        }
        break;
      case 'error-text':
        // 外部から error-text が変わった場合でも、anchorにバブルを寄せるため validity message を更新
        if (this.hasAttribute('error')) {
          const message = this.getAttribute('error-text') ?? '';
          if (this.#validationError) {
            this._internals.setValidity({ valueMissing: true }, message, this.#input ?? undefined);
          } else {
            this._internals.setValidity({ customError: true }, message, this.#input ?? undefined);
          }
        }
        break;
      case 'value':
        // checked時のみ送信値に影響
        this.#syncFormValue();
        break;
      case 'aria-label':
      case 'aria-labelledby':
      case 'aria-describedby':
        this.#syncAria();
        break;
    }
  }

  #isDisabled(): boolean {
    return this.hasAttribute('disabled') || this.#formDisabled;
  }
}
