/**
 * @module combobox
 * デジタル庁デザインシステム Comboboxコンポーネント
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { comboboxTokens } from './combobox-tokens.js';
import { comboboxStyles } from './combobox-styles.js';
import {
  setDefaultAttributes,
  updateLabelFallback,
  updateSupportFallback,
  updateErrorFallback,
  updateRequirement,
  updateAriaDescribedBy,
  setupSlotChangeListeners,
} from '../../utils/form-component-helpers.js';

type ComboboxMode = 'single' | 'multiple';

type ComboboxOption = {
  value: string;
  label: string;
  meta: string;
  disabled: boolean;
  selected: boolean;
  searchIndex: string;
};

type ComboboxValue = string | string[];

let comboboxIdSequence = 0;

/**
 * Comboboxコンポーネント
 *
 * @customElement
 * @tagname dads-combobox
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト
 * @slot error-text - エラーテキスト
 * @slot required-error - 必須バリデーション用のカスタムメッセージ
 * @slot - option 要素（optionの `data-search` にJSON配列文字列を指定すると検索別名を追加可能）
 *
 * @csspart wrapper - 全体ラッパー
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキスト
 * @csspart requirement - 必須表示
 * @csspart support-text - サポートテキスト
 * @csspart control - 入力コントロール
 * @csspart input - 入力欄
 * @csspart chip-list - 複数選択チップ群
 * @csspart chip - 複数選択チップ
 * @csspart indicator - ドロップダウンインジケータ
 * @csspart panel - フローティングパネル
 * @csspart listbox - 候補リスト
 * @csspart search-box - パネル内検索ラッパー
 * @csspart search-icon - パネル内検索アイコン
 * @csspart search-input - パネル内検索入力
 * @csspart option - 候補行
 * @csspart option-check - 候補行チェック領域（multiple）
 * @csspart option-label - 候補ラベル
 * @csspart option-match - 候補ラベル内のquery一致強調
 * @csspart option-meta - 候補補助テキスト
 * @csspart error-text - エラーテキスト
 *
 * @attr {'single' | 'multiple'} mode - 選択モード
 * @attr {boolean} filterable - 入力絞り込みの有効化
 * @attr {boolean} clear-on-close - close時にqueryをクリア（常に実行）
 * @attr {boolean} restore-on-cancel - singleで未確定離脱時の復帰
 * @attr {boolean} open - 開閉状態
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須状態
 * @attr {string} name - フォーム名
 * @attr {string} value - 選択値（mode=multiple時はカンマ区切り）
 * @attr {string} placeholder - プレースホルダー
 * @attr {'s' | 'm' | 'l' | 'sm' | 'md' | 'lg'} size - サイズ
 * @attr {string} label - ラベル属性フォールバック
 * @attr {string} support-text - サポート属性フォールバック
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラー属性フォールバック
 *
 * @fires dads-input - query入力変化時
 * @fires dads-change - 明示確定時のみ
 * @fires dads-open - ポップアップ開時
 * @fires dads-close - ポップアップ閉時
 */
export class DadsCombobox extends TypographyFormComponent {
  static readonly formAssociated = true;

  #input: HTMLInputElement | null = null;
  #searchInput: HTMLInputElement | null = null;
  #control: HTMLElement | null = null;
  #indicator: HTMLButtonElement | null = null;
  #panel: HTMLElement | null = null;
  #searchBox: HTMLElement | null = null;
  #listbox: HTMLElement | null = null;
  #chipList: HTMLElement | null = null;

  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;

  #labelFallback: HTMLElement | null = null;
  #supportText: HTMLElement | null = null;
  #supportFallback: HTMLElement | null = null;
  #errorText: HTMLElement | null = null;
  #errorFallback: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;

  #listboxId = `combobox-listbox-${comboboxIdSequence++}`;
  #isOpen = false;
  #query = '';
  #activeIndex = -1;
  #isSearchInputComposing = false;
  #options: ComboboxOption[] = [];
  #selectedSingle = '';
  #selectedMultiple = new Set<string>();
  #formDisabled = false;

  #optionsObserver: MutationObserver | null = null;
  #documentAbort: AbortController | null = null;

  static definition = {
    name: 'dads-combobox',
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

        <div part="control" id="control">
          <input
            part="input"
            id="input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="false"
            autocomplete="off"
          />
          <ul part="chip-list" id="chip-list"></ul>
          <button part="indicator" id="indicator" type="button" aria-label="候補を開閉" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"></path>
            </svg>
          </button>
        </div>

        <div part="panel" id="panel" hidden>
          <div part="search-box" id="search-box" hidden>
            <span part="search-icon" id="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"></path>
              </svg>
            </span>
            <input part="search-input" id="search-input" type="text" aria-label="候補を検索" autocomplete="off" />
          </div>
          <div part="listbox" id="listbox" role="listbox" hidden></div>
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <slot name="required-error" id="required-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), comboboxTokens, comboboxStyles, applyDADSFocusStyles()],
      'minimal',
    ),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('support-text'),
      BooleanAttr('required'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      BooleanAttr('disabled'),
      PropertyAttr('name'),
      PropertyAttr('mode'),
      BooleanAttr('filterable'),
      BooleanAttr('clear-on-close'),
      BooleanAttr('restore-on-cancel'),
      BooleanAttr('open'),
      PropertyAttr('placeholder'),
      PropertyAttr('size'),
      { attribute: 'value' },
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, { mode: 'single', size: 'md' });
    this.#ensureDefaultBooleans();
    this.#upgradePreDefinedValueProperty();

    this.#input = this.shadowRoot?.querySelector('#input') as HTMLInputElement | null;
    this.#control = this.shadowRoot?.querySelector('#control') as HTMLElement | null;
    this.#indicator = this.shadowRoot?.querySelector('#indicator') as HTMLButtonElement | null;
    this.#panel = this.shadowRoot?.querySelector('#panel') as HTMLElement | null;
    this.#searchBox = this.shadowRoot?.querySelector('#search-box') as HTMLElement | null;
    this.#searchInput = this.shadowRoot?.querySelector('#search-input') as HTMLInputElement | null;
    this.#listbox = this.shadowRoot?.querySelector('#listbox') as HTMLElement | null;
    this.#chipList = this.shadowRoot?.querySelector('#chip-list') as HTMLElement | null;

    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement | null;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement | null;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement | null;

    this.#labelFallback = this.shadowRoot?.querySelector('#label-fallback') as HTMLElement | null;
    this.#supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement | null;
    this.#supportFallback = this.shadowRoot?.querySelector('#support-fallback') as HTMLElement | null;
    this.#errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement | null;
    this.#errorFallback = this.shadowRoot?.querySelector('#error-fallback') as HTMLElement | null;
    this.#requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement | null;

    this.#setupSlots();
    this.#setupControlListeners();
    this.#setupOptionsObserver();
    this.addEventListener('keydown', this.#handleHostKeydown, true);
    this.#syncFromLightDomOptions();
    this.#syncAllState();

    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#syncAllState();
    });
  }

  disconnectedCallback(): void {
    this.#input?.removeEventListener('keydown', this.#handleInputKeydown);
    this.#input?.removeEventListener('input', this.#handleInput);
    this.#control?.removeEventListener('click', this.#handleControlClick);
    this.#chipList?.removeEventListener('dads-chip-tag-remove', this.#handleChipRemove as EventListener);
    this.#searchInput?.removeEventListener('keydown', this.#handleInputKeydown);
    this.#searchInput?.removeEventListener('input', this.#handleSearchInput);
    this.#searchInput?.removeEventListener('compositionstart', this.#handleSearchCompositionStart);
    this.#searchInput?.removeEventListener('compositionend', this.#handleSearchCompositionEnd);
    this.removeEventListener('keydown', this.#handleHostKeydown, true);

    this.#optionsObserver?.disconnect();
    this.#optionsObserver = null;

    this.#syncDocumentListeners(false);

    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (!this.#input) return;

    switch (name) {
      case 'label':
        updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label'));
        break;
      case 'support-text':
        updateSupportFallback(
          this.#supportSlot,
          this.#supportText,
          this.#supportFallback,
          this.getAttribute('support-text'),
        );
        this.#updateAriaDescribedBy();
        break;
      case 'error':
      case 'error-text':
        updateErrorFallback(
          this.#errorSlot,
          this.#errorText,
          this.#errorFallback,
          this.getAttribute('error-text'),
          this.hasAttribute('error'),
        );
        this.#syncInputAria();
        this.#updateAriaDescribedBy();
        break;
      case 'required':
        updateRequirement(this.#requirement, this.hasAttribute('required'), false);
        this.#syncInputAria();
        break;
      case 'mode':
        this.#sanitizeModeAttribute();
        this.#syncSelectionForModeChange();
        this.#syncSelectionView();
        this.#syncFormValue();
        break;
      case 'filterable':
      case 'disabled':
      case 'placeholder':
      case 'name':
        this.#syncInputAttributes();
        break;
      case 'open':
        this.#syncOpenState(this.hasAttribute('open'));
        break;
      case 'value':
        if (newValue !== oldValue) {
          this.#applyValueAttribute(newValue);
          this.#syncValueAndSelectionView();
        }
        break;
      case 'restore-on-cancel':
      case 'clear-on-close':
      case 'size':
        this.#syncInputDisplay();
        break;
    }
  }

  get value(): ComboboxValue {
    if (this.#mode === 'multiple') return Array.from(this.#selectedMultiple);
    return this.#selectedSingle;
  }

  set value(v: ComboboxValue) {
    if (this.#mode === 'multiple') {
      const next = new Set<string>();
      if (Array.isArray(v)) {
        for (const value of v) {
          if (typeof value === 'string' && value.length > 0) next.add(value);
        }
      } else if (typeof v === 'string' && v.length > 0) {
        for (const token of this.#parseCommaSeparatedValues(v)) next.add(token);
      }
      this.#selectedMultiple = this.#filterKnownValues(next);
      this.setAttribute('value', Array.from(this.#selectedMultiple).join(','));
    } else {
      const next = typeof v === 'string' ? v : String(v?.[0] ?? '');
      this.#selectedSingle = this.#isKnownOptionValue(next) ? next : '';
      if (this.#selectedSingle.length > 0) this.setAttribute('value', this.#selectedSingle);
      else this.removeAttribute('value');
    }

    this.#syncValueAndSelectionView();
  }

  formResetCallback(): void {
    this.#applyValueAttribute(this.getAttribute('value'));
    this.#syncValueAndSelectionView();
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (typeof state !== 'string') return;
    if (this.#mode === 'multiple') this.value = this.#parseCommaSeparatedValues(state);
    else this.value = state;
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this.#formDisabled = disabled;
    this.#syncInputAttributes();
  }

  focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  blur(): void {
    this.#input?.blur();
  }

  #ensureDefaultBooleans(): void {
    if (!this.hasAttribute('filterable')) this.setAttribute('filterable', '');
    if (!this.hasAttribute('clear-on-close')) this.setAttribute('clear-on-close', '');
    if (!this.hasAttribute('restore-on-cancel')) this.setAttribute('restore-on-cancel', '');
  }

  #upgradePreDefinedValueProperty(): void {
    const hasOwnValue = Object.prototype.hasOwnProperty.call(this, 'value');
    const ownValue = hasOwnValue ? (this as unknown as { value?: unknown }).value : undefined;
    if (hasOwnValue) {
      delete (this as unknown as Record<string, unknown>).value;
      if (ownValue !== undefined) this.value = ownValue as ComboboxValue;
    }
  }

  get #mode(): ComboboxMode {
    return this.getAttribute('mode') === 'multiple' ? 'multiple' : 'single';
  }

  #sanitizeModeAttribute(): void {
    const rawMode = this.getAttribute('mode');
    if (rawMode === 'single' || rawMode === 'multiple') return;
    this.setAttribute('mode', 'single');
  }

  #setupSlots(): void {
    setupSlotChangeListeners(
      {
        label: this.#labelSlot,
        support: this.#supportSlot,
        error: this.#errorSlot,
      },
      {
        onLabelChange: () => updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label')),
        onSupportChange: () => {
          updateSupportFallback(
            this.#supportSlot,
            this.#supportText,
            this.#supportFallback,
            this.getAttribute('support-text'),
          );
          this.#updateAriaDescribedBy();
        },
        onErrorChange: () => {
          updateErrorFallback(
            this.#errorSlot,
            this.#errorText,
            this.#errorFallback,
            this.getAttribute('error-text'),
            this.hasAttribute('error'),
          );
          this.#updateAriaDescribedBy();
        },
      },
    );

    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
  }

  #setupControlListeners(): void {
    this.#input?.addEventListener('keydown', this.#handleInputKeydown);
    this.#input?.addEventListener('input', this.#handleInput);
    this.#control?.addEventListener('click', this.#handleControlClick);
    this.#chipList?.addEventListener('dads-chip-tag-remove', this.#handleChipRemove as EventListener);
    this.#searchInput?.addEventListener('keydown', this.#handleInputKeydown);
    this.#searchInput?.addEventListener('input', this.#handleSearchInput);
    this.#searchInput?.addEventListener('compositionstart', this.#handleSearchCompositionStart);
    this.#searchInput?.addEventListener('compositionend', this.#handleSearchCompositionEnd);
  }

  #hasVisibleSearchInput(): boolean {
    return Boolean(
      this.hasAttribute('filterable') &&
        this.#searchBox &&
        !this.#searchBox.hidden &&
        this.#searchInput &&
        !this.#searchInput.hidden &&
        !this.#searchInput.disabled,
    );
  }

  #setupOptionsObserver(): void {
    this.#optionsObserver?.disconnect();
    this.#optionsObserver = new MutationObserver((mutations) => {
      if (!mutations.some((m) => this.#shouldSyncOptionsFromMutation(m))) return;
      this.#syncFromLightDomOptions();
      this.#syncValueAndSelectionView();
    });
    this.#optionsObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  #shouldSyncOptionsFromMutation(mutation: MutationRecord): boolean {
    if (mutation.type === 'childList') return true;
    if (mutation.type === 'attributes') {
      const target = mutation.target;
      return target instanceof HTMLOptionElement;
    }
    if (mutation.type === 'characterData') {
      return mutation.target.parentElement instanceof HTMLOptionElement;
    }
    return false;
  }

  #syncAllState(): void {
    this.#syncFromLightDomOptions();
    this.#syncInputAttributes();
    this.#syncInputAria();
    this.#updateAriaDescribedBy();
    this.#syncSelectionView();
    this.#syncOpenState(this.hasAttribute('open'));
    this.#syncFormValue();
  }

  #syncFromLightDomOptions(): void {
    const optionElements = Array.from(this.children).filter((node) => node instanceof HTMLOptionElement) as HTMLOptionElement[];

    this.#options = optionElements.map((option) => {
      const value = option.value;
      const label = option.label || option.textContent || option.value;
      const meta = option.getAttribute('data-meta') ?? '';
      const searchAliases = this.#parseSearchAliases(option.getAttribute('data-search'));
      return {
        value,
        label,
        meta,
        disabled: option.disabled,
        selected: option.selected,
        searchIndex: this.#buildSearchIndex(label, value, meta, ...searchAliases),
      };
    });

    this.#applyValueAttribute(this.getAttribute('value'));
    this.#syncSelectionForModeChange();
  }

  #parseSearchAliases(rawValue: string | null): string[] {
    if (!rawValue) return [];
    try {
      const parsed = JSON.parse(rawValue);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    } catch {
      return [];
    }
  }

  #buildSearchIndex(...tokens: string[]): string {
    return tokens.map((token) => this.#normalizeSearchText(token)).filter(Boolean).join(' ');
  }

  #normalizeSearchText(value: string): string {
    return value.trim().normalize('NFKC').toLocaleLowerCase('ja-JP');
  }

  #parseCommaSeparatedValues(rawValue: string): string[] {
    return rawValue
      .split(',')
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }

  #applyValueAttribute(attrValue: string | null): void {
    if (this.#mode === 'multiple') {
      if (attrValue !== null) {
        this.#selectedMultiple = this.#filterKnownValues(new Set(this.#parseCommaSeparatedValues(attrValue)));
      } else {
        const selected = new Set<string>();
        for (const option of this.#options) {
          if (option.selected) selected.add(option.value);
        }
        this.#selectedMultiple = this.#filterKnownValues(selected);
      }
      return;
    }

    if (attrValue !== null) {
      this.#selectedSingle = this.#isKnownOptionValue(attrValue) ? attrValue : '';
      return;
    }

    const selectedOption = this.#options.find((option) => option.selected);
    if (selectedOption) {
      this.#selectedSingle = selectedOption.value;
      return;
    }

    if (!this.#isKnownOptionValue(this.#selectedSingle)) {
      this.#selectedSingle = '';
    }
  }

  #syncSelectionForModeChange(): void {
    if (this.#mode === 'single') {
      if (!this.#isKnownOptionValue(this.#selectedSingle)) {
        const firstMultiple = Array.from(this.#selectedMultiple)[0];
        this.#selectedSingle = this.#isKnownOptionValue(firstMultiple) ? firstMultiple : '';
      }
      this.#selectedMultiple.clear();
      return;
    }

    if (this.#selectedMultiple.size === 0 && this.#isKnownOptionValue(this.#selectedSingle)) {
      this.#selectedMultiple.add(this.#selectedSingle);
    }
  }

  #isKnownOptionValue(value: string): boolean {
    if (!value) return false;
    return this.#options.some((option) => option.value === value);
  }

  #filterKnownValues(values: Set<string>): Set<string> {
    const filtered = new Set<string>();
    for (const value of values) {
      if (this.#isKnownOptionValue(value)) filtered.add(value);
    }
    return filtered;
  }

  #syncInputAttributes(): void {
    if (!this.#input || !this.#listbox) return;

    this.#input.setAttribute('aria-controls', this.#listboxId);
    this.#listbox.id = this.#listboxId;
    this.#listbox.setAttribute('aria-multiselectable', this.#mode === 'multiple' ? 'true' : 'false');

    const disabled = this.#isDisabled();
    this.#input.disabled = disabled;
    this.#input.readOnly = true;
    if (this.#searchInput) this.#searchInput.disabled = disabled;
    this.#indicator?.toggleAttribute('disabled', disabled);

    const placeholder = this.getAttribute('placeholder');
    this.#input.placeholder = this.#resolveControlPlaceholder(placeholder);
  }

  #resolveControlPlaceholder(placeholderAttr: string | null): string {
    if (this.#mode === 'multiple' && this.#selectedMultiple.size > 0) return '';
    if (placeholderAttr !== null) return placeholderAttr;
    return '選択してください';
  }

  #syncInputAria(): void {
    if (!this.#input) return;

    this.#input.setAttribute('aria-expanded', this.#isOpen ? 'true' : 'false');
    this.#input.setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');

    if (this.hasAttribute('required')) this.#input.setAttribute('aria-required', 'true');
    else this.#input.removeAttribute('aria-required');
  }

  #syncFormValue(): void {
    if (this.#mode === 'multiple') {
      this._internals.setFormValue(Array.from(this.#selectedMultiple).join(','));
      return;
    }

    this._internals.setFormValue(this.#selectedSingle);
  }

  #isDisabled(): boolean {
    return this.#formDisabled || this.hasAttribute('disabled');
  }

  #updateAriaDescribedBy(): void {
    const supportVisible = this.#supportText?.style.display !== 'none';
    updateAriaDescribedBy(this.#input, supportVisible, this.hasAttribute('error'));
  }

  #toggleOpenFromControl(): void {
    if (this.#isOpen) this.removeAttribute('open');
    else this.setAttribute('open', '');
    this.#focusControl();
  }

  #handleControlClick = (event: MouseEvent): void => {
    if (this.#isDisabled()) return;

    const path = event.composedPath();
    const clickedIndicator = this.#indicator ? path.includes(this.#indicator) : false;
    if (clickedIndicator) event.preventDefault();
    this.#toggleOpenFromControl();
  };

  #handleChipRemove = (event: CustomEvent<{ value?: string | null }>): void => {
    const target = event.target;
    const optionValue =
      target instanceof HTMLElement ? target.getAttribute('data-option-value') ?? '' : '';
    const detailValue = event.detail?.value;
    const value =
      optionValue.length > 0
        ? optionValue
        : typeof detailValue === 'string' && detailValue.length > 0
          ? detailValue
          : '';
    if (!value) return;
    if (this.#mode === 'multiple') {
      if (!this.#selectedMultiple.has(value)) return;
      event.preventDefault();
      this.#selectedMultiple.delete(value);
      this.setAttribute('value', Array.from(this.#selectedMultiple).join(','));
      this.#syncValueAndSelectionView();
      if (this.#selectedMultiple.size === 0) this.#focusControl();
      this.emitEvent('dads-change', { value: Array.from(this.#selectedMultiple) });
      return;
    }

    if (this.#selectedSingle !== value) return;
    event.preventDefault();
    this.#selectedSingle = '';
    this.removeAttribute('value');
    this.#syncValueAndSelectionView();
    this.#focusControl();
    this.emitEvent('dads-change', { value: '' });
  };

  #handleInput = (): void => {
    if (this.#isDisabled()) return;
    if (!this.hasAttribute('filterable')) return;
    if (!this.#input) return;
    if (this.#mode === 'multiple') return;

    this.#query = this.#resolveQueryFromRawInput(this.#input.value);
    if (!this.#isOpen) this.setAttribute('open', '');

    this.#activeIndex = this.#findFirstFilteredEnabledIndex();
    this.#renderOptions();
    this.emitEvent('dads-input', { query: this.#query });
  };

  #handleSearchInput = (): void => {
    if (this.#isDisabled()) return;
    if (!this.hasAttribute('filterable')) return;
    if (!this.#searchInput) return;
    this.#query = this.#searchInput.value;
    if (!this.#isOpen) this.setAttribute('open', '');

    this.#activeIndex = this.#findFirstFilteredEnabledIndex();
    if (this.#isSearchInputComposing) {
      this.#renderOptionRowsIntoListbox();
      this.emitEvent('dads-input', { query: this.#query });
      return;
    }

    const selectionStart = this.#searchInput.selectionStart ?? this.#searchInput.value.length;
    this.#renderOptions();
    if (this.#searchInput) {
      this.#searchInput.focus();
      const nextCursor = Math.min(selectionStart, this.#searchInput.value.length);
      this.#searchInput.setSelectionRange(nextCursor, nextCursor);
    }
    this.emitEvent('dads-input', { query: this.#query });
  };

  #handleSearchCompositionStart = (): void => {
    this.#isSearchInputComposing = true;
  };

  #handleSearchCompositionEnd = (): void => {
    this.#isSearchInputComposing = false;
    this.#handleSearchInput();
  };

  #resolveQueryFromRawInput(rawInput: string): string {
    if (this.#isOpen || this.#mode !== 'single') return rawInput;
    const selectedLabel = this.#labelFromValue(this.#selectedSingle);
    if (selectedLabel.length === 0) return rawInput;
    return rawInput.startsWith(selectedLabel) ? rawInput.slice(selectedLabel.length) : rawInput;
  }

  #handleInputKeydown = (event: KeyboardEvent): void => {
    if (this.#isDisabled()) return;
    if (this.#isImeComposing(event)) return;
    const isControlInput = event.target === this.#input;
    const isSearchInput = event.target === this.#searchInput;
    const searchCursor = isSearchInput
      ? (this.#searchInput?.selectionStart ?? this.#searchInput?.value.length ?? 0)
      : 0;

    if (this.#isEscapeKey(event)) {
      if (!this.#isOpen) return;
      event.preventDefault();
      this.removeAttribute('open');
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.#isOpen) {
          this.setAttribute('open', '');
          this.#setActiveIndex(this.#findFirstFilteredEnabledIndex());
          break;
        }
        this.#moveActive(1, true);
        if (isSearchInput) this.#restoreSearchInputFocus(searchCursor);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.#isOpen) {
          this.setAttribute('open', '');
          this.#setActiveIndex(this.#findLastFilteredEnabledIndex());
          break;
        }
        this.#moveActive(-1, true);
        if (isSearchInput) this.#restoreSearchInputFocus(searchCursor);
        break;
      case 'Home':
        if (!this.#isOpen) return;
        event.preventDefault();
        this.#setActiveIndex(this.#findFirstFilteredEnabledIndex());
        break;
      case 'End':
        if (!this.#isOpen) return;
        event.preventDefault();
        this.#setActiveIndex(this.#findLastFilteredEnabledIndex());
        break;
      case 'Enter':
        if (isControlInput && !this.#isOpen) {
          event.preventDefault();
          this.#toggleOpenFromControl();
          return;
        }
        if (!this.#isOpen) return;
        event.preventDefault();
        if (this.#activeIndex < 0) {
          if (isControlInput) this.#toggleOpenFromControl();
          return;
        }
        this.#commitIndex(this.#activeIndex);
        break;
      case ' ':
      case 'Spacebar':
        if (!isControlInput) return;
        event.preventDefault();
        this.#toggleOpenFromControl();
        break;
      case 'Tab':
        if (!this.#isOpen) return;
        if (event.shiftKey) return;
        if (isControlInput) {
          if (this.#hasVisibleSearchInput()) {
            event.preventDefault();
            this.#searchInput?.focus();
            return;
          }
          if (this.#focusTabTargetOption()) {
            event.preventDefault();
            return;
          }
          this.removeAttribute('open');
          return;
        }
        if (isSearchInput) {
          if (this.#focusTabTargetOption()) {
            event.preventDefault();
            return;
          }
          const chipActions = this.#getChipActionButtons();
          if (chipActions.length > 0) {
            event.preventDefault();
            chipActions[0].focus();
            return;
          }
          this.removeAttribute('open');
          return;
        }
        break;
    }
  };

  #commitIndex(index: number): void {
    const option = this.#options[index];
    if (!option || option.disabled) return;

    if (this.#mode === 'multiple') {
      if (this.#selectedMultiple.has(option.value)) this.#selectedMultiple.delete(option.value);
      else this.#selectedMultiple.add(option.value);

      this.setAttribute('value', Array.from(this.#selectedMultiple).join(','));
      this.#syncFormValue();
      this.#renderChipList();
      this.#renderOptions();
      this.emitEvent('dads-change', { value: Array.from(this.#selectedMultiple) });
      return;
    }

    this.#selectedSingle = option.value;
    this.setAttribute('value', this.#selectedSingle);
    this.#syncFormValue();
    this.emitEvent('dads-change', { value: this.#selectedSingle });
    this.removeAttribute('open');
  }

  #syncOpenState(nextOpen: boolean): void {
    if (nextOpen === this.#isOpen) return;
    this.#isOpen = nextOpen;

    if (nextOpen) {
      this.#activeIndex = this.#preferredActiveIndex();
      this.#syncDocumentListeners(true);
      this.#syncInputAria();
      this.#syncInputDisplay();
      this.#renderOptions();
      if (this.hasAttribute('filterable')) {
        this.#searchInput?.focus();
      }
      this.emitEvent('dads-open');
      return;
    }

    // 拘束条件: close時は常にqueryをクリアする
    this.#query = '';
    this.#activeIndex = -1;
    this.#syncDocumentListeners(false);
    this.#syncInputAria();
    this.#syncInputDisplay();
    this.#renderOptions();
    this.emitEvent('dads-close');
  }

  #syncDocumentListeners(enable: boolean): void {
    this.#documentAbort?.abort();
    this.#documentAbort = null;
    if (!enable) return;

    const controller = new AbortController();
    this.#documentAbort = controller;

    document.addEventListener('click', this.#handleDocumentClick, { signal: controller.signal });
    document.addEventListener('keydown', this.#handleDocumentKeydown, { signal: controller.signal });
  }

  #handleDocumentClick = (event: Event): void => {
    if (!this.#isOpen) return;
    if (event.composedPath().includes(this)) return;
    this.removeAttribute('open');
  };

  #handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.#isOpen) return;
    if (!this.#isEscapeKey(event)) return;
    event.preventDefault();
    this.removeAttribute('open');
    this.#focusControl();
  };

  #renderChipList(): void {
    const chipList = this.#chipList;
    if (!chipList) return;

    chipList.replaceChildren();

    if (this.#mode === 'single') {
      const option = this.#options.find((item) => item.value === this.#selectedSingle);
      if (!option) {
        chipList.hidden = true;
        this.#control?.removeAttribute('data-has-chip');
        return;
      }

      const chip = document.createElement('dads-chip-tag');
      chip.setAttribute('part', 'chip');
      chip.setAttribute('action', 'remove');
      chip.setAttribute('remove-label', `${option.label}を削除`);
      chip.setAttribute('value', option.label);
      chip.setAttribute('data-option-value', option.value);
      chip.textContent = option.label;
      const item = document.createElement('li');
      item.setAttribute('part', 'chip-item');
      item.appendChild(chip);
      chipList.appendChild(item);
      chipList.hidden = false;
      this.#control?.setAttribute('data-has-chip', '');
      return;
    }

    const values = Array.from(this.#selectedMultiple);
    if (values.length === 0) {
      chipList.hidden = true;
      this.#control?.removeAttribute('data-has-chip');
      return;
    }

    for (const value of values) {
      const option = this.#options.find((item) => item.value === value);
      if (!option) continue;

      const chip = document.createElement('dads-chip-tag');
      chip.setAttribute('part', 'chip');
      chip.setAttribute('action', 'remove');
      chip.setAttribute('remove-label', `${option.label}を削除`);
      chip.setAttribute('value', option.label);
      chip.setAttribute('data-option-value', option.value);
      chip.textContent = option.label;
      const item = document.createElement('li');
      item.setAttribute('part', 'chip-item');
      item.appendChild(chip);
      chipList.appendChild(item);
    }

    chipList.hidden = false;
    this.#control?.setAttribute('data-has-chip', '');
  }

  #renderOptions(): void {
    if (!this.#listbox || !this.#input) return;

    this.#listbox.replaceChildren();
    this.#syncListboxFloatingPosition();
    this.#syncPanelVisibility();

    if (!this.#isOpen) {
      this.#isSearchInputComposing = false;
      this.#input.removeAttribute('aria-activedescendant');
      return;
    }

    if (this.#searchInput) {
      this.#searchInput.value = this.#query;
      this.#searchInput.placeholder = '';
    }

    this.#renderOptionRowsIntoListbox();
  }

  #syncPanelVisibility(): void {
    if (!this.#panel || !this.#listbox) return;
    this.#panel.hidden = !this.#isOpen;
    this.#listbox.hidden = !this.#isOpen;

    if (!this.#searchBox) return;
    const showSearchBox = this.#isOpen && this.hasAttribute('filterable');
    this.#searchBox.hidden = !showSearchBox;
  }

  #renderOptionRowsIntoListbox(): void {
    if (!this.#listbox || !this.#input) return;

    this.#clearRenderedOptionRows();
    const filteredIndexes = this.#getFilteredIndexes();
    if (filteredIndexes.length === 0) {
      const empty = document.createElement('div');
      empty.setAttribute('part', 'empty');
      empty.textContent = '候補がありません';
      this.#listbox.appendChild(empty);
      this.#input.removeAttribute('aria-activedescendant');
      return;
    }

    for (const index of filteredIndexes) {
      this.#listbox.appendChild(this.#createOptionElement(index));
    }

    if (this.#activeIndex >= 0) {
      this.#input.setAttribute('aria-activedescendant', `${this.#listboxId}-option-${this.#activeIndex}`);
    } else {
      this.#input.removeAttribute('aria-activedescendant');
    }
  }

  #clearRenderedOptionRows(): void {
    if (!this.#listbox) return;
    const renderedRows = this.#listbox.querySelectorAll('[part="option"], [part="empty"]');
    for (const row of renderedRows) {
      row.remove();
    }
  }

  #createOptionElement(index: number): HTMLButtonElement {
    const option = this.#options[index];
    const optionId = `${this.#listboxId}-option-${index}`;

    const optionElement = document.createElement('button');
    optionElement.type = 'button';
    optionElement.id = optionId;
    optionElement.setAttribute('part', 'option');
    optionElement.setAttribute('role', 'option');
    optionElement.setAttribute('aria-selected', this.#isOptionSelected(option) ? 'true' : 'false');
    optionElement.setAttribute('data-option-index', String(index));
    if (index === this.#activeIndex) optionElement.setAttribute('data-active', 'true');
    optionElement.tabIndex = option.disabled ? -1 : 0;
    if (option.disabled) optionElement.setAttribute('aria-disabled', 'true');

    if (this.#mode === 'multiple') {
      const check = document.createElement('span');
      check.setAttribute('part', 'option-check');
      check.setAttribute('aria-hidden', 'true');
      optionElement.appendChild(check);
    }

    const label = document.createElement('span');
    label.setAttribute('part', 'option-label');
    this.#renderOptionLabel(label, option.label);
    optionElement.appendChild(label);

    if (option.meta.length > 0) {
      const meta = document.createElement('span');
      meta.setAttribute('part', 'option-meta');
      meta.textContent = option.meta;
      optionElement.appendChild(meta);
    }

    optionElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.#commitIndex(index);
    });
    optionElement.addEventListener('keydown', this.#handleOptionKeydown);

    return optionElement;
  }

  #syncListboxFloatingPosition(): void {
    if (!this.#listbox || !this.#control) return;
    const controlBottom = this.#control.offsetTop + this.#control.offsetHeight;
    this.#listbox.style.setProperty('--dads-combobox-control-bottom', `${controlBottom}px`);
  }

  #isOptionSelected(option: ComboboxOption): boolean {
    if (this.#mode === 'multiple') return this.#selectedMultiple.has(option.value);
    return this.#selectedSingle.length > 0 && this.#selectedSingle === option.value;
  }

  #getFilteredIndexes(): number[] {
    if (!this.hasAttribute('filterable')) return this.#allOptionIndexes();

    const query = this.#normalizeSearchText(this.#query);
    if (query.length === 0) return this.#allOptionIndexes();

    return this.#options.reduce<number[]>((indexes, option, index) => {
      if (option.searchIndex.includes(query)) indexes.push(index);
      return indexes;
    }, []);
  }

  #allOptionIndexes(): number[] {
    return this.#options.map((_option, index) => index);
  }

  #findFirstFilteredEnabledIndex(): number {
    const filtered = this.#getFilteredIndexes();
    for (const index of filtered) {
      if (!this.#options[index].disabled) return index;
    }
    return -1;
  }

  #findLastFilteredEnabledIndex(): number {
    const filtered = this.#getFilteredIndexes();
    for (let i = filtered.length - 1; i >= 0; i -= 1) {
      const index = filtered[i];
      if (!this.#options[index].disabled) return index;
    }
    return -1;
  }

  #preferredActiveIndex(): number {
    if (this.#mode === 'multiple') return -1;

    if (this.#mode === 'single' && this.#selectedSingle) {
      const selectedIndex = this.#options.findIndex((option) => option.value === this.#selectedSingle);
      if (selectedIndex >= 0 && this.#getFilteredIndexes().includes(selectedIndex)) return selectedIndex;
    }
    return this.#findFirstFilteredEnabledIndex();
  }

  #moveActive(step: 1 | -1, allowInitialize: boolean): void {
    const filtered = this.#getFilteredIndexes().filter((index) => !this.#options[index].disabled);
    if (filtered.length === 0) {
      this.#setActiveIndex(-1);
      return;
    }

    if (this.#activeIndex < 0 || !filtered.includes(this.#activeIndex)) {
      if (!allowInitialize) return;
      this.#setActiveIndex(step === 1 ? filtered[0] : filtered[filtered.length - 1]);
      return;
    }

    const current = filtered.indexOf(this.#activeIndex);
    const next = (current + step + filtered.length) % filtered.length;
    this.#setActiveIndex(filtered[next]);
  }

  #setActiveIndex(index: number): void {
    this.#activeIndex = index;
    this.#renderOptions();
  }

  #focusTabTargetOption(): boolean {
    const options = this.#getTabNavigableOptions();
    if (options.length === 0) return false;
    const activeOption = options.find((option) => option.getAttribute('data-option-index') === String(this.#activeIndex));
    (activeOption ?? options[0]).focus();
    return true;
  }

  #getTabNavigableOptions(): HTMLButtonElement[] {
    if (!this.#listbox) return [];
    return Array.from(this.#listbox.querySelectorAll('[part="option"]')).filter(
      (node): node is HTMLButtonElement =>
        node instanceof HTMLButtonElement && node.getAttribute('aria-disabled') !== 'true',
    );
  }

  #getChipActionButtons(): HTMLButtonElement[] {
    const chips = Array.from(this.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []) as HTMLElement[];
    return chips
      .map((chip) => chip.shadowRoot?.querySelector('[part="action"]') as HTMLButtonElement | null)
      .filter((button): button is HTMLButtonElement => button instanceof HTMLButtonElement);
  }

  #restoreSearchInputFocus(cursor: number): void {
    if (!this.#searchInput) return;
    this.#searchInput.focus();
    const nextCursor = Math.min(cursor, this.#searchInput.value.length);
    this.#searchInput.setSelectionRange(nextCursor, nextCursor);
  }

  #handleOptionKeydown = (event: KeyboardEvent): void => {
    if (!this.#isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.#moveActive(1, true);
        this.#focusTabTargetOption();
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.#moveActive(-1, true);
        this.#focusTabTargetOption();
        return;
      case 'Tab':
        if (event.shiftKey) return;
        this.#handleOptionTab(event);
        return;
    }

    if (!this.#isEscapeKey(event)) return;
    event.preventDefault();
    this.removeAttribute('open');
    this.#focusControl();
  };

  #handleOptionTab(event: KeyboardEvent): void {
    const currentOption = event.currentTarget;
    if (!(currentOption instanceof HTMLButtonElement)) return;

    const options = this.#getTabNavigableOptions();
    if (options.length === 0) {
      this.removeAttribute('open');
      return;
    }

    const lastOption = options[options.length - 1];
    if (currentOption !== lastOption) return;

    const chipActions = this.#getChipActionButtons();
    if (chipActions.length > 0) {
      event.preventDefault();
      chipActions[0].focus();
      return;
    }

    this.removeAttribute('open');
  }

  #handleHostKeydown = (event: KeyboardEvent): void => {
    if (!this.#isOpen) return;
    if (this.#isEscapeKey(event)) {
      event.preventDefault();
      this.removeAttribute('open');
      this.#focusControl();
      return;
    }

    if (this.#isImeComposing(event)) return;
    const key = event.key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

    const target = event.target;
    if (target === this.#input || target === this.#searchInput) return;
    if (target instanceof HTMLElement && target.getAttribute('part') === 'option') return;

    event.preventDefault();
    this.#moveActive(key === 'ArrowDown' ? 1 : -1, true);
    this.#focusTabTargetOption();
  };

  #isEscapeKey(eventOrKey: KeyboardEvent | string): boolean {
    const key = typeof eventOrKey === 'string' ? eventOrKey : eventOrKey.key;
    if (key === 'Escape' || key === 'Esc') return true;
    if (typeof eventOrKey === 'string') return false;

    if (eventOrKey.code === 'Escape') return true;
    return eventOrKey.keyCode === 27 || eventOrKey.which === 27;
  }

  #isImeComposing(event: KeyboardEvent): boolean {
    if (event.isComposing) return true;
    if (event.key === 'Process') return true;
    return event.keyCode === 229 || event.which === 229;
  }

  #syncSelectionView(): void {
    this.#renderChipList();
    this.#renderOptions();
    this.#syncInputDisplay();
  }

  #syncValueAndSelectionView(): void {
    this.#syncFormValue();
    this.#syncSelectionView();
  }

  #syncInputDisplay(): void {
    if (!this.#input) return;

    this.#input.placeholder = this.#resolveControlPlaceholder(this.getAttribute('placeholder'));

    if (this.#isOpen && this.hasAttribute('filterable')) {
      if (this.#mode === 'multiple') {
        this.#input.value = '';
        return;
      }
      this.#input.value = this.#labelFromValue(this.#selectedSingle);
      return;
    }

    if (this.#mode === 'single') {
      this.#input.value = this.#labelFromValue(this.#selectedSingle);
      return;
    }

    this.#input.value = '';
  }

  #labelFromValue(value: string): string {
    if (!value) return '';
    const found = this.#options.find((option) => option.value === value);
    return found?.label ?? '';
  }

  #focusControl(): void {
    if (this.#isDisabled()) return;
    this.#input?.focus();
  }

  #renderOptionLabel(labelElement: HTMLElement, labelText: string): void {
    const query = this.#query.trim();
    if (query.length === 0) {
      labelElement.textContent = labelText;
      return;
    }

    const lowerLabel = labelText.toLocaleLowerCase('ja-JP');
    const lowerQuery = query.toLocaleLowerCase('ja-JP');
    const matchStart = lowerLabel.indexOf(lowerQuery);
    if (matchStart < 0) {
      labelElement.textContent = labelText;
      return;
    }

    const matchEnd = matchStart + query.length;
    const before = labelText.slice(0, matchStart);
    const matched = labelText.slice(matchStart, matchEnd);
    const after = labelText.slice(matchEnd);

    if (before.length > 0) labelElement.append(before);

    const match = document.createElement('strong');
    match.setAttribute('part', 'option-match');
    match.textContent = matched;
    labelElement.append(match);

    if (after.length > 0) labelElement.append(after);
  }
}
