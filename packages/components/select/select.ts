/**
 * @module select
 * デジタル庁デザインシステム Selectコンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { selectTokens } from './select-tokens.js';
import { selectStyles } from './select-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import {
  setDefaultAttributes,
  setupFormValidation,
  updateLabelFallback,
  updateSupportFallback,
  updateErrorFallback,
  updateRequirement,
  updateValidationUI,
  showValidationError,
  clearValidationError,
  updateAriaDescribedBy,
  setupSlotChangeListeners,
  type FormValidationSetup,
} from '../../utils/form-component-helpers.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

/**
 * Selectコンポーネント
 *
 * @customElement dads-select
 * @tagname dads-select
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot - option / optgroup（Light DOMに配置、内部selectへ複製）
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキストラッパー
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart select-wrapper - selectを囲むコンテナ
 * @csspart select - ネイティブselect要素
 * @csspart select-chevron - セレクトの矢印アイコン
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {boolean} required - 必須項目
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態（ネイティブdisabled）
 * @attr {string} aria-disabled - 無効相当（Tab移動は許容、操作は抑止）
 * @attr {string} name - フォーム名
 * @attr {string} size - サイズ（sm | md | lg）+ 幅指定（例: "md 256", "sm 20ch", "lg full", "md fit-content"）
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 * @attr {string} value - 初期値
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 */
export class DadsSelect extends TypographyFormComponent {
  static readonly formAssociated = true;

  // Private fields
  #select: HTMLSelectElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;

  // UI要素参照
  #labelFallback: HTMLElement | null = null;
  #supportText: HTMLElement | null = null;
  #supportFallback: HTMLElement | null = null;
  #errorText: HTMLElement | null = null;
  #errorFallback: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;

  // バリデーション状態
  #validationErrorType: 'required' | null = null;

  // フォームバリデーションセットアップ
  #formValidation: FormValidationSetup | null = null;

  // フォーム由来のdisabled状態（fieldset disabled等）
  #formDisabled = false;

  // Light DOM option監視
  #optionsObserver: MutationObserver | null = null;

  static definition = {
    name: 'dads-select',
    template: html`
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="select">
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

        <div part="select-wrapper" id="select-wrapper">
          <select part="select" id="select"></select>
          <svg part="select-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" fill="currentcolor" />
          </svg>
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), selectTokens, selectStyles, applyDADSFocusStyles()],
      'minimal'
    ),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('support-text'),
      BooleanAttr('required'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      BooleanAttr('disabled'),
      // aria-disabled は文字列属性（"true"/"false" だけでなく空文字も許容）
      { attribute: 'aria-disabled' },
      PropertyAttr('name'),
      PropertyAttr('size'),
      BooleanAttr('auto-validate'),
      // value は observedAttributes に含めるが、PropertyAttr は使わない（カスタム getter/setter）
      { attribute: 'value' },
    ],
  };

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'セレクトボックスコンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'ネイティブの <select> 要素を使用し、単一選択のセマンティクスを提供します。',
        '<label> 要素でラベルとselectを関連付けます。',
        'Form-Associated Custom Elementとしてネイティブフォームに参加します。',
      ],
      keyboard: [
        'Tabでフォーカス可能です。',
        '標準のセレクトボックスのキーボード操作が利用できます（aria-disabled時はTab以外抑止）。',
      ],
      zoom: [
        'サイズバリエーション: sm / md / lg。',
        'size属性の追加トークンで幅指定が可能（例: size="md 256", size="md full", size="md fit-content"）。',
        'テキストは相対単位で定義され、拡大時も操作可能です。',
      ],
      states: [
        'required属性で「※必須」ラベル表示、aria-required="true"設定。',
        'disabled属性で無効状態（ネイティブdisabled）。',
        'aria-disabled属性で無効相当状態（Tab移動は許容、操作は抑止）。',
        'error属性でエラー状態（aria-invalid="true"、赤枠表示）。',
      ],
      labels: [
        'label属性またはスロットでラベルを提供します。',
        'support-text属性またはスロットで補足説明を提供、aria-describedbyで関連付け。',
        'error-text属性またはスロットでエラーメッセージを提供、aria-describedbyで関連付け。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'label',
        title: 'ラベル要素',
        label: '<label>',
        description: 'ネイティブのlabel要素でselectと関連付けます。クリックでフォーカス移動。',
        category: 'semantics',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="label"]' },
      },
      {
        id: 'requirement',
        title: '要否ラベル',
        label: '※必須',
        description: 'required属性に応じて表示されるラベルです。',
        category: 'labels',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="requirement"]' },
      },
      {
        id: 'support-text',
        title: 'サポートテキスト',
        label: 'support-text',
        description: '入力のヒントや補足説明を提供します。aria-describedbyで関連付け。',
        category: 'labels',
        placement: 'bottom-left',
        target: { scope: 'shadow', selector: '[part="support-text"]' },
      },
      {
        id: 'select',
        title: 'ネイティブ選択要素',
        label: '<select>',
        description: '選択肢（option/optgroup）はLight DOMから複製して内部selectに設定します。',
        category: 'keyboard',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="select"]' },
      },
      {
        id: 'chevron',
        title: 'シェブロンアイコン',
        label: 'chevron',
        description: '選択肢であることを示す装飾アイコンです（aria-hidden）。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="select-chevron"]' },
      },
      {
        id: 'error-text',
        title: 'エラーメッセージ',
        label: 'error-text',
        description: 'バリデーションエラー時に表示。aria-describedbyで関連付け（DADSガイドライン準拠）。',
        category: 'states',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="error-text"]' },
      },
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();

    // デフォルト属性の設定
    setDefaultAttributes(this, { size: 'md' });

    // 内部要素の参照を取得
    this.#select = this.shadowRoot?.querySelector('[part="select"]') as HTMLSelectElement;
    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement;

    // UI要素参照取得
    this.#labelFallback = this.shadowRoot?.querySelector('#label-fallback') as HTMLElement;
    this.#supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement;
    this.#supportFallback = this.shadowRoot?.querySelector('#support-fallback') as HTMLElement;
    this.#errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement;
    this.#errorFallback = this.shadowRoot?.querySelector('#error-fallback') as HTMLElement;
    this.#requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement;

    // 初期化
    this.#initSelect();
    this.#initSlots();
    this.#setupFormValidation();
    this.#setupOptionsObserver();

    // 属性が接続後に設定された場合のために再同期
    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#syncAllState();
    });
  }

  disconnectedCallback(): void {
    this.#select?.removeEventListener('input', this.#handleInput);
    this.#select?.removeEventListener('change', this.#handleChange);
    this.#select?.removeEventListener('keydown', this.#handleAriaDisabledKeydown);
    this.#select?.removeEventListener('mousedown', this.#handleAriaDisabledMouseDown);

    this.#formValidation?.cleanup();
    this.#formValidation = null;

    this.#optionsObserver?.disconnect();
    this.#optionsObserver = null;

    super.disconnectedCallback();
  }

  #syncAllState(): void {
    this.#syncOptions();
    this.#syncSelectAttributes();
    updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label'));
    updateSupportFallback(
      this.#supportSlot,
      this.#supportText,
      this.#supportFallback,
      this.getAttribute('support-text')
    );
    updateErrorFallback(
      this.#errorSlot,
      this.#errorText,
      this.#errorFallback,
      this.getAttribute('error-text'),
      this.hasAttribute('error')
    );
    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
    this.#updateAriaDescribedBy();

    if (this.#select) {
      this._internals.setFormValue(this.#select.value);
    }
  }

  #initSelect(): void {
    if (!this.#select) return;

    // 属性の転送
    this.#syncSelectAttributes();

    // option/optgroup の複製
    this.#syncOptions();

    // イベントリスナー
    this.#select.addEventListener('input', this.#handleInput);
    this.#select.addEventListener('change', this.#handleChange);
    this.#select.addEventListener('keydown', this.#handleAriaDisabledKeydown);
    this.#select.addEventListener('mousedown', this.#handleAriaDisabledMouseDown);
  }

  #initSlots(): void {
    setupSlotChangeListeners(
      {
        label: this.#labelSlot,
        support: this.#supportSlot,
        error: this.#errorSlot,
      },
      {
        onLabelChange: () =>
          updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label')),
        onSupportChange: () => {
          updateSupportFallback(
            this.#supportSlot,
            this.#supportText,
            this.#supportFallback,
            this.getAttribute('support-text')
          );
          this.#updateAriaDescribedBy();
        },
        onErrorChange: () => {
          updateErrorFallback(
            this.#errorSlot,
            this.#errorText,
            this.#errorFallback,
            this.getAttribute('error-text'),
            this.hasAttribute('error')
          );
          this.#updateAriaDescribedBy();
        },
      }
    );
    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
  }

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

  #setupOptionsObserver(): void {
    this.#optionsObserver?.disconnect();
    this.#optionsObserver = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => this.#shouldSyncOptionsFromMutation(mutation))) return;
      this.#syncOptions();
    });

    this.#optionsObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  #shouldSyncOptionsFromMutation(mutation: MutationRecord): boolean {
    switch (mutation.type) {
      case 'childList':
        return true;
      case 'attributes': {
        const el = mutation.target;
        if (!(el instanceof Element)) return false;
        return el.tagName === 'OPTION' || el.tagName === 'OPTGROUP';
      }
      case 'characterData': {
        const parent = (mutation.target as CharacterData).parentElement;
        if (!parent) return false;
        return parent.tagName === 'OPTION' || parent.tagName === 'OPTGROUP';
      }
      default:
        return false;
    }
  }

  #parseSizeAttr(): { variant: 'sm' | 'md' | 'lg'; width: string | null } {
    const raw = this.getAttribute('size');
    const tokens = raw ? raw.trim().split(/\s+/).filter(Boolean) : [];

    let variant: 'sm' | 'md' | 'lg' | null = null;
    let width: string | null = null;
    const isVariantToken = (token: string): token is 'sm' | 'md' | 'lg' =>
      token === 'sm' || token === 'md' || token === 'lg';
    for (const token of tokens) {
      if (isVariantToken(token)) {
        if (variant === null) {
          variant = token;
          if (width !== null) break;
        }
        continue;
      }
      if (width !== null) continue;

      if (token === 'full') {
        width = '100%';
        if (variant !== null) break;
        continue;
      }
      if (token === 'fit' || token === 'fit-content') {
        width = 'fit-content';
        if (variant !== null) break;
        continue;
      }
      if (token === 'auto' || token === 'min-content' || token === 'max-content') {
        width = token;
        if (variant !== null) break;
        continue;
      }

      // 数値のみは px として扱う（例: "256" → "256px"）
      if (/^\d+(\.\d+)?$/.test(token)) {
        width = `${token}px`;
        if (variant !== null) break;
        continue;
      }

      // カスタム値 (200px, 20ch, 50% など)
      if (/^\d+(\.\d+)?(px|ch|em|rem|vw|%)$/.test(token)) {
        width = token;
        if (variant !== null) break;
        continue;
      }
    }

    return { variant: variant ?? 'md', width };
  }

  #syncSelectAttributes(): void {
    if (!this.#select) return;

    // name属性の転送
    const name = this.getAttribute('name');
    if (name !== null) {
      this.#select.setAttribute('name', name);
    } else {
      this.#select.removeAttribute('name');
    }

    // disabled属性（ネイティブ）
    this.#select.disabled = this.#formDisabled || this.hasAttribute('disabled');

    // aria-disabled（無効相当: Tab移動は許容、操作は抑止）
    if (this.#isAriaDisabled()) {
      this.#select.setAttribute('aria-disabled', 'true');
    } else {
      this.#select.removeAttribute('aria-disabled');
    }

    // required は内部selectに転送しない（ネイティブバリデーションを使わず、カスタムバリデーションで制御）
    // 代わりに aria-required を設定してアクセシビリティを維持
    if (this.hasAttribute('required')) {
      this.#select.setAttribute('aria-required', 'true');
    } else {
      this.#select.removeAttribute('aria-required');
    }

    // error状態
    this.#select.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');

    // size（サイズバリアント + 幅指定）
    const { variant, width } = this.#parseSizeAttr();
    this.#select.setAttribute('data-size', variant);
    if (width) {
      this.style.setProperty('--dads-select-width', width);
    } else {
      this.style.removeProperty('--dads-select-width');
    }
  }

  #getLightDomOptionElements(): Array<HTMLOptionElement | HTMLOptGroupElement> {
    const out: Array<HTMLOptionElement | HTMLOptGroupElement> = [];

    for (const el of Array.from(this.children)) {
      if (el instanceof HTMLOptionElement || el instanceof HTMLOptGroupElement) {
        out.push(el);
      }
    }

    return out;
  }

  #syncOptions(): void {
    if (!this.#select) return;

    const desiredValueAttr = this.getAttribute('value');
    const preserveValue = desiredValueAttr ?? (this.#select.options.length > 0 ? this.#select.value : null);

    const clones = this.#getLightDomOptionElements().map((el) => el.cloneNode(true));
    this.#select.replaceChildren(...clones);

    // 値の復元（存在しない場合はselect側のデフォルトにフォールバック）
    if (preserveValue !== null) this.#select.value = preserveValue;

    this._internals.setFormValue(this.#select.value);
  }

  #updateAriaDescribedBy(): void {
    const supportVisible = this.#supportText?.style.display !== 'none';
    updateAriaDescribedBy(this.#select, supportVisible, this.hasAttribute('error'));
  }

  #handleInput = (): void => {
    if (this.#select) {
      this._internals.setFormValue(this.#select.value);
    }

    if (this.hasAttribute('auto-validate') && this.#validationErrorType) {
      this.#clearValidationError();
    }

    this.emitEvent('dads-input', { value: this.value });
  };

  #handleChange = (): void => {
    this.emitEvent('dads-change', { value: this.value });
  };

  #handleAriaDisabledKeydown = (e: KeyboardEvent): void => {
    if (!this.#isAriaDisabled()) return;
    if (e.code === 'Tab') return;
    e.preventDefault();
  };

  #handleAriaDisabledMouseDown = (e: MouseEvent): void => {
    if (!this.#isAriaDisabled()) return;
    e.preventDefault();
  };

  #handleFormSubmit = (e: Event): void => {
    // disabled/aria-disabledの場合はバリデーションしない（ユーザーが修正できないため）
    if (this.hasAttribute('disabled') || this.#isAriaDisabled()) return;

    const isValid = this.#validateRequired();
    if (!isValid) {
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

  #showValidationError(type: 'required'): void {
    this.#validationErrorType = type;
    const message = this.#getErrorMessage(type);
    showValidationError({
      element: this,
      control: this.#select,
      internals: this._internals,
      message,
      updateUI: (hasError) => this.#updateValidationUI(hasError),
    });
  }

  #clearValidationError(): void {
    if (this.#validationErrorType === null) return;
    this.#validationErrorType = null;
    clearValidationError(this, this._internals, (hasError) => this.#updateValidationUI(hasError));
  }

  #updateValidationUI(hasError: boolean): void {
    updateValidationUI(
      this.#select,
      hasError,
      () =>
        updateErrorFallback(
          this.#errorSlot,
          this.#errorText,
          this.#errorFallback,
          this.getAttribute('error-text'),
          this.hasAttribute('error')
        ),
      () => this.#updateAriaDescribedBy()
    );
  }

  #getErrorMessage(type: 'required'): string {
    return getValidationMessage(this, VALIDATION_RULES[type]);
  }

  #isAriaDisabled(): boolean {
    const v = this.getAttribute('aria-disabled');
    if (v === null) return false;
    if (v.trim().toLowerCase() === 'false') return false;
    return true;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (!this.#select) return;

    switch (name) {
      case 'label':
        updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label'));
        break;
      case 'support-text':
        updateSupportFallback(
          this.#supportSlot,
          this.#supportText,
          this.#supportFallback,
          this.getAttribute('support-text')
        );
        this.#updateAriaDescribedBy();
        break;
      case 'required':
        updateRequirement(this.#requirement, this.hasAttribute('required'), false);
        if (this.hasAttribute('required')) {
          this.#select.setAttribute('aria-required', 'true');
        } else {
          this.#select.removeAttribute('aria-required');
        }
        break;
      case 'error':
      case 'error-text':
        updateErrorFallback(
          this.#errorSlot,
          this.#errorText,
          this.#errorFallback,
          this.getAttribute('error-text'),
          this.hasAttribute('error')
        );
        this.#updateAriaDescribedBy();
        this.#select.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
        break;
      case 'disabled':
      case 'name':
      case 'size':
      case 'aria-disabled':
        this.#syncSelectAttributes();
        break;
      case 'auto-validate':
        this.#setupFormValidation();
        break;
      case 'value':
        if (newValue !== null) {
          this.value = newValue;
        }
        break;
    }
  }

  // Public API
  get value(): string {
    return this.#select?.value ?? '';
  }

  set value(v: string) {
    if (!this.#select) return;
    this.#select.value = v;
    this._internals.setFormValue(this.#select.value);
  }

  // Form callbacks
  formResetCallback(): void {
    const defaultValue = this.getAttribute('value') ?? '';
    this.value = defaultValue;
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (state !== null && typeof state === 'string') {
      this.value = state;
    }
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this.#formDisabled = disabled;
    this.#syncSelectAttributes();
  }

  // Focus delegation
  focus(options?: FocusOptions): void {
    this.#select?.focus(options);
  }

  blur(): void {
    this.#select?.blur();
  }
}

// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsSelect, 'value', 'value');
