/**
 * @module radio
 * デジタル庁デザインシステム Radioコンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import {
  setDefaultAttributes,
  setupFormValidation,
  updateRequirement,
  type FormValidationSetup,
} from '../../utils/form-component-helpers.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { radioStyles } from './radio-styles.js';
import { radioTokens } from './radio-tokens.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

/**
 * Radioコンポーネント
 *
 * DADS HTML版の構造・見た目に準拠しつつ、Form-Associated Custom Elementとしてフォームに参加します。
 *
 * ⚠️ 注意: Shadow DOM内のネイティブinput[type="radio"]は、他のShadowRoot内inputとグルーピングされません。
 * そのため、本コンポーネントは `name` 属性をキーに同一スコープ内の `*-radio` 同士を排他制御します。
 *
 * @customElement dads-radio
 * @tagname dads-radio
 *
 * @csspart base - label相当のラッパー
 * @csspart radio - ラジオ枠（背景ホバー含む）
 * @csspart input - ネイティブinput[type=radio]
 * @csspart label - ラベルテキスト
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart error-text - エラーメッセージ
 *
 * @attr {string} label - ラベルテキスト
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {boolean} checked - 初期チェック状態（属性はデフォルト値として扱う）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須（グループ内で未選択のままsubmit時にinvalid）
 * @attr {boolean} auto-validate - submit時の自動バリデーション
 * @attr {boolean} error - エラー状態（aria-invalid="true"）
 * @attr {string} error-text - エラーメッセージ（バリデーション時に設定）
 * @attr {string} name - フォーム名（グループ判定に使用）
 * @attr {string} value - 送信値（未指定時は "on"）
 * @attr {string} aria-label - アクセシビリティラベル（ラベルなし時に推奨）
 * @attr {string} aria-labelledby - 外部ラベル参照
 * @attr {string} aria-describedby - 補足/エラー参照
 *
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ（非表示）
 */
export class DadsRadio extends TypographyFormComponent {
  static override readonly formAssociated = true;

  static readonly version = '1.0.0';

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'ラジオボタン（単一選択）',
    categories: {
      semantics: [
        '内部にネイティブの <input type="radio"> を持ち、ラジオボタンのセマンティクスをブラウザ標準で提供します。',
        'Shadow DOMの制約により、同一nameのグルーピングはコンポーネント側で補完します（選択時に他の同一nameのradioを解除）。',
        'Form-Associated Custom Elementとしてフォームに参加し、checked時のみ値を送信します（ネイティブradioの挙動に準拠）。',
      ],
      keyboard: [
        'Tabでフォーカス可能です（グループ内のタブストップはcheckedを優先し、未選択時は先頭を採用します）。',
        'Spaceで選択できます（ネイティブ挙動）。',
        'Arrowキー（↑↓←→）で同一nameグループ内を移動して選択できます（Shadow DOMで失われる挙動を補完）。',
        'Home / End でグループの先頭 / 末尾へ移動して選択できます。',
      ],
      zoom: [
        'サイズ（sm/md/lg）に応じて操作面の大きさを調整し、拡大時も視認性・操作性を確保します。',
      ],
      states: [
        'checked / disabled をサポートします。',
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
        description: 'クリック領域を含め、ラジオボタンとラベルを一体として提供します。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="base"]' },
      },
      {
        id: 'native-input',
        title: 'ネイティブラジオ',
        label: 'input[type="radio"]',
        description:
          'キーボード操作（Space）や状態（checked/disabled）の基本挙動はブラウザ標準に委譲します。',
        category: 'keyboard',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="input"]' },
      },
      {
        id: 'label-text',
        title: 'ラベルテキスト',
        label: 'label',
        description: 'label属性で表示されるテキスト。空の場合はaria-label等で補完します。',
        category: 'labels',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="label"]' },
      },
      {
        id: 'requirement',
        title: '要否ラベル',
        label: '要否ラベル',
        description: 'required属性が設定されている場合に「※必須」と表示されます。必須入力であることを視覚的に伝えます。',
        category: 'labels',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="requirement"]' },
      },
      {
        id: 'error-text',
        title: 'エラーメッセージ',
        label: 'error-text',
        description:
          'バリデーションエラー時に表示されるメッセージです。aria-describedbyで入力要素と関連付けられ、スクリーンリーダーがエラー内容を読み上げます。',
        category: 'states',
        placement: 'bottom-left',
        target: { scope: 'shadow', selector: '[part="error-text"]' },
      },
    ],
  };

  #base: HTMLLabelElement | null = null;
  #input: HTMLInputElement | null = null;
  #labelEl: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;
  #errorText: HTMLElement | null = null;

  #formDisabled = false;
  #validationError = false;
  #formValidation: FormValidationSetup | null = null;

  static definition = {
    name: 'dads-radio',
    template: html`
      <label part="base" id="base">
        <span part="radio" id="radio">
          <input part="input" id="input" type="radio" />
        </span>
        <span part="label" id="label"></span>
        <span part="requirement" id="requirement"></span>
      </label>

      <!-- エラーメッセージ表示 -->
      <span part="error-text" id="error-text"></span>

      <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
      <slot name="required-error" id="required-error-slot" hidden></slot>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), radioTokens, radioStyles], 'minimal'),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
      BooleanAttr('required'),
      BooleanAttr('auto-validate'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      PropertyAttr('name'),
      // checked/value はカスタムgetter/setterを持つため PropertyAttr/BooleanAttr を使わない
      { attribute: 'checked' },
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
    this.#input?.addEventListener('keydown', this.#handleKeyDown);

    this.#setupFormValidation();

    // 他のradioの初期化も完了したタイミングで、グループの状態を整える
    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#enforceSingleSelection();
      this.#syncGroupTabStop();
    });
  }

  disconnectedCallback(): void {
    this.#input?.removeEventListener('change', this.#handleChange);
    this.#input?.removeEventListener('keydown', this.#handleKeyDown);
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

    if (v) {
      this.#enforceSingleSelection();
    }

    this.#syncFormValue();
    this.#syncGroupTabStop();
    if (v) {
      this.#clearGroupValidationErrorIfNeeded();
    }
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
    // 同一nameで複数のchecked属性が存在する場合でも、復元結果が一意になるようにグループで調整する
    const group = this.#getGroupRadios();
    const defaultChecked = this.#getGroupDefaultCheckedRadio(group);

    for (const radio of group) {
      radio.#setCheckedFromGroup(defaultChecked !== null && radio === defaultChecked);
    }

    this.#syncGroupTabStop();
    this.#clearValidationError();
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (state === null) {
      this.checked = false;
      return;
    }
    if (typeof state === 'string') {
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
    this.#syncGroupTabStop();
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
    this.#syncGroupTabStop();
  }

  #syncLabel(): void {
    if (!this.#labelEl) return;
    this.#labelEl.textContent = this.getAttribute('label') ?? '';
  }

  #syncRequirement(): void {
    if (!this.#requirement) return;

    // fieldset内にいる場合は、fieldsetのlegendに※必須が表示されるため非表示
    const parentFieldset = this.closest('dads-fieldset');
    const insideRequiredFieldset = parentFieldset?.hasAttribute('required') ?? false;

    const showRequirement = this.hasAttribute('required') && !insideRequiredFieldset;
    updateRequirement(this.#requirement, showRequirement, false);
  }

  #syncErrorText(): void {
    if (!this.#errorText) return;
    const hasError = this.hasAttribute('error');
    const errorMessage = this.getAttribute('error-text') ?? '';
    this.#errorText.textContent = hasError && errorMessage ? `＊${errorMessage}` : '';
  }

  #syncInputFromAttributes(): void {
    if (!this.#input) return;

    this.#input.checked = this.hasAttribute('checked');
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
    // disabled/unchecked は送信しない（ネイティブラジオ準拠）
    if (this.#isDisabled() || !this.checked) {
      this._internals.setFormValue(null);
      return;
    }
    this._internals.setFormValue(this.value);
  }

  // ============================================================
  // Group behavior
  // ============================================================

  #getGroupName(): string | null {
    const name = this.getAttribute('name') ?? '';
    const trimmed = name.trim();
    return trimmed ? trimmed : null;
  }

  #getRadioQueryRoot(): ParentNode & { querySelectorAll(selectors: string): NodeListOf<Element> } {
    const form = this._internals.form;
    if (form) return form;
    const root = this.getRootNode();
    if (root instanceof ShadowRoot) return root;
    return document;
  }

  #getGroupRadiosForName(name: string): DadsRadio[] {
    const root = this.#getRadioQueryRoot();
    const selector = this.localName;
    const matched: DadsRadio[] = [];

    const nodes = root.querySelectorAll(selector);
    for (const el of nodes) {
      if (!(el instanceof DadsRadio)) continue;
      if (el.hasAttribute('hidden')) continue;
      if ((el.getAttribute('name') ?? '').trim() !== name) continue;
      matched.push(el);
    }

    return matched.length > 0 ? matched : [this];
  }

  #getGroupRadios(): DadsRadio[] {
    const name = this.#getGroupName();
    if (!name) return [this];
    return this.#getGroupRadiosForName(name);
  }

  #getGroupErrorAnchor(group: DadsRadio[]): DadsRadio {
    // エラーメッセージはグループの末尾に表示したい（選択肢の途中に挟まない）
    // ただし disabled 要素をアンカーにすると、実装/UAによってはバリデーション対象外になる可能性があるため、
    // 末尾から探索して「有効な要素」を優先する。
    for (let i = group.length - 1; i >= 0; i -= 1) {
      const radio = group[i];
      if (radio.#isDisabled()) continue;
      return radio;
    }
    return group[group.length - 1];
  }

  #getGroupDefaultCheckedRadio(group: DadsRadio[]): DadsRadio | null {
    // checked属性は「デフォルト値」。グループ内で複数指定されている場合は末尾を優先する。
    // ただし disabled を優先してしまうと選択肢として扱いづらいため、末尾から探索して「有効な要素」を優先する。
    let fallback: DadsRadio | null = null;

    for (let i = group.length - 1; i >= 0; i -= 1) {
      const radio = group[i];
      if (!radio.hasAttribute('checked')) continue;
      if (fallback === null) fallback = radio;
      if (radio.#isDisabled()) continue;
      return radio;
    }

    return fallback;
  }

  #setCheckedFromGroup(v: boolean): void {
    if (!this.#input) {
      this.toggleAttribute('checked', v);
      return;
    }
    this.#input.checked = v;
    this.#syncFormValue();
  }

  #enforceSingleSelection(): void {
    if (!this.checked) return;
    const name = this.#getGroupName();
    if (!name) return;

    const group = this.#getGroupRadiosForName(name);
    for (const radio of group) {
      if (radio === this) continue;
      radio.#setCheckedFromGroup(false);
    }
  }

  #syncGroupTabStop(): void {
    if (!this.#input) return;
    const name = this.#getGroupName();
    if (!name) {
      this.#input.tabIndex = 0;
      return;
    }

    const group = this.#getGroupRadiosForName(name);

    let selected: DadsRadio | null = null;
    for (const radio of group) {
      if (radio.#isDisabled()) continue;
      if (!radio.checked) continue;
      selected = radio;
      break;
    }

    let firstEnabled: DadsRadio | null = null;
    if (!selected) {
      for (const radio of group) {
        if (radio.#isDisabled()) continue;
        firstEnabled = radio;
        break;
      }
    }

    for (const radio of group) {
      if (!radio.#input) continue;
      if (radio.#isDisabled()) {
        radio.#input.tabIndex = -1;
        continue;
      }
      const isTabStop = selected ? radio === selected : radio === firstEnabled;
      radio.#input.tabIndex = isTabStop ? 0 : -1;
    }
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
    if (this.#isDisabled()) return;

    const group = this.#getGroupRadios();

    // グループ内の有効なrequiredが1つでもあれば、グループ必須として扱う
    let groupRequired = false;
    for (const radio of group) {
      if (radio.#isDisabled()) continue;
      if (!radio.hasAttribute('required')) continue;
      groupRequired = true;
      break;
    }
    if (!groupRequired) return;

    let isValid = false;
    for (const radio of group) {
      if (radio.#isDisabled()) continue;
      if (!radio.checked) continue;
      isValid = true;
      break;
    }

    const anchor = this.#getGroupErrorAnchor(group);

    if (isValid) {
      anchor.#clearGroupValidationError(group);
      return;
    }

    e.preventDefault();
    anchor.#showGroupValidationError(group);
  };

  #showGroupValidationError(group: DadsRadio[]): void {
    const message = this.#getRequiredErrorMessage();

    for (const radio of group) {
      // 既に手動エラーが入っている場合は上書きしない
      const hasManualError = radio.hasAttribute('error') && !radio.#validationError;
      if (hasManualError) continue;

      radio.#validationError = true;
      radio.setAttribute('error', '');
      if (radio === this) {
        radio.setAttribute('error-text', message);
      } else {
        radio.removeAttribute('error-text');
      }
    }

    this._internals.setValidity({ valueMissing: true }, message, this.#input ?? undefined);
  }

  #clearGroupValidationError(group: DadsRadio[]): void {
    for (const radio of group) {
      radio.#clearValidationError();
    }
  }

  #clearValidationError(): void {
    if (!this.#validationError) return;
    this.#validationError = false;

    this.removeAttribute('error');
    this.removeAttribute('error-text');
    this.#syncAriaInvalid();
    this.#syncErrorText();
    this._internals.setValidity({});
  }

  #clearGroupValidationErrorIfNeeded(): void {
    const group = this.#getGroupRadios();

    let hasAnyValidationError = false;
    for (const radio of group) {
      if (!radio.#validationError) continue;
      hasAnyValidationError = true;
      break;
    }
    if (!hasAnyValidationError) return;

    const anchor = this.#getGroupErrorAnchor(group);
    anchor.#clearGroupValidationError(group);
  }

  #getRequiredErrorMessage(): string {
    return getValidationMessage(this, VALIDATION_RULES.required);
  }

  // ============================================================
  // Events
  // ============================================================

  #handleChange = (): void => {
    if (!this.#input) return;

    if (this.#input.checked) {
      this.#enforceSingleSelection();
      this.#clearGroupValidationErrorIfNeeded();
    }

    this.#syncFormValue();
    this.#syncGroupTabStop();

    this.emitEvent('dads-change', {
      checked: this.checked,
      value: this.value,
    });
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (this.#isDisabled()) return;

    const name = this.#getGroupName();
    if (!name) return;

    const group = this.#getGroupRadiosForName(name);
    if (group.length <= 1) return;

    const enabled: DadsRadio[] = [];
    for (const radio of group) {
      if (radio.#isDisabled()) continue;
      enabled.push(radio);
    }
    if (enabled.length <= 1) return;

    const currentIndex = enabled.indexOf(this);
    if (currentIndex < 0) return;

    const dir = getComputedStyle(this).direction;
    const isRtl = dir === 'rtl';

    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';

    let target: DadsRadio | null = null;

    switch (e.key) {
      case 'ArrowUp':
      case prevKey: {
        e.preventDefault();
        const idx = (currentIndex - 1 + enabled.length) % enabled.length;
        target = enabled[idx];
        break;
      }
      case 'ArrowDown':
      case nextKey: {
        e.preventDefault();
        const idx = (currentIndex + 1) % enabled.length;
        target = enabled[idx];
        break;
      }
      case 'Home':
        e.preventDefault();
        target = enabled[0];
        break;
      case 'End':
        e.preventDefault();
        target = enabled[enabled.length - 1];
        break;
      default:
        break;
    }

    if (!target || target === this) return;
    if (!target.#input) return;

    // Shadow DOMで失われるネイティブ挙動を補完: 矢印操作で選択＋フォーカス
    target.#input.click();
    target.focus();
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
        if (this.#input.checked) {
          this.#enforceSingleSelection();
          this.#clearGroupValidationErrorIfNeeded();
        }
        this.#syncFormValue();
        this.#syncGroupTabStop();
        break;
      case 'disabled':
        this.#input.disabled = this.#isDisabled();
        this.#syncFormValue();
        this.#syncGroupTabStop();
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
      case 'name': {
        // name変更時は旧グループと新グループ両方のタブストップを再計算
        const oldName = (oldValue ?? '').trim();
        const newNameTrimmed = (newValue ?? '').trim();

        if (oldName && oldName !== newNameTrimmed) {
          const oldGroup = this.#getGroupRadiosForName(oldName);
          if (oldGroup.length > 0) {
            oldGroup[0].#syncGroupTabStop();
          }
        }

        if (this.checked) {
          this.#enforceSingleSelection();
        }
        this.#syncFormValue();
        this.#syncGroupTabStop();
        break;
      }
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
