/**
 * @module search-box
 * デジタル庁デザインシステム SearchBoxコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { searchBoxTokens } from './search-box-tokens.js';
import { searchBoxStyles } from './search-box-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import type { A11yAnnotations, A11yElementRef } from '../../utils/a11y-annotations.js';
import { getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { defineButton } from '../button/button-define.js';

type SearchDetail = { query: string; scope: string };

const shadowTarget = (selector: string): A11yElementRef => ({ scope: 'shadow', selector });

/**
 * SearchBoxコンポーネント
 *
 * @customElement
 * @tagname dads-search-box
 *
 * @csspart base - ルート（横並びコンテナ）
 * @csspart fields - フィールド群（scope + query）
 * @csspart scope - 検索対象セレクトのラベルコンテナ
 * @csspart scope-label - 検索対象ラベルテキスト
 * @csspart scope-select - 検索対象セレクト
 * @csspart scope-icon - 検索対象セレクトの矢印アイコン
 * @csspart query - 検索語入力のラベルコンテナ
 * @csspart search-icon - 虫眼鏡アイコン
 * @csspart visually-hidden - スクリーンリーダー向けラベル
 * @csspart input - 検索語 input[type="search"]
 * @csspart button - 送信ボタン（<dads-button>）
 *
 * @attr {string} name - 検索語のフォーム名（デフォルト: q）
 * @attr {string} value - 検索語
 * @attr {string} label - 検索語の視覚的に非表示ラベル（デフォルト: 検索）
 *
 * @attr {string} aria-label - 検索語inputへ転写（labelの代替）
 * @attr {string} aria-labelledby - 検索語inputへ転写（外部ラベル参照）
 * @attr {string} aria-describedby - 検索語inputへ転写（外部説明参照）
 *
 * @attr {string} scope-name - 検索対象のフォーム名（デフォルト: scope）
 * @attr {string} scope-value - 検索対象の選択値
 * @attr {string} scope-label - 検索対象の可視ラベル（デフォルト: 検索対象）
 *
 * @attr {string} button-label - 送信ボタンのラベル（デフォルト: 検索）
 *
 * @cssprop --dads-search-box-gap - fields と button の間隔
 * @cssprop --dads-search-box-color - 全体の文字色
 * @cssprop --dads-search-box-font-size - ベース文字サイズ
 * @cssprop --dads-search-box-letter-spacing - 文字詰め
 * @cssprop --dads-search-box-border-color - 枠線色
 * @cssprop --dads-search-box-border-color-hover - hover時の枠線色
 * @cssprop --dads-search-box-border-radius - 角丸（8px）
 * @cssprop --dads-search-box-border-width - 枠線幅（デフォルト: 1px）
 * @cssprop --dads-search-box-control-min-height - input/select の最小高さ（44px相当）
 * @cssprop --dads-search-box-scope-width - scope select 幅
 * @cssprop --dads-search-box-scope-bg - scope select 背景
 * @cssprop --dads-search-box-scope-label-color - scopeラベル色
 * @cssprop --dads-search-box-scope-icon-color - scopeアイコン色
 * @cssprop --dads-search-box-scope-icon-size - scopeアイコンサイズ（デフォルト: 16px）
 * @cssprop --dads-search-box-scope-padding - scope select のパディング
 * @cssprop --dads-search-box-input-bg - input 背景
 * @cssprop --dads-search-box-input-min-width - input 最小幅（デフォルト: 8rem）
 * @cssprop --dads-search-box-input-padding - input padding
 * @cssprop --dads-search-box-placeholder-color - プレースホルダー色
 * @cssprop --dads-search-box-search-icon-color - 虫眼鏡色
 * @cssprop --dads-search-box-search-icon-size - 虫眼鏡アイコンサイズ（デフォルト: 24px）
 * @cssprop --dads-search-box-button-bg - ボタン背景色
 * @cssprop --dads-search-box-button-color - ボタン文字色
 * @cssprop --dads-search-box-button-bg-hover - ボタンホバー時背景色
 * @cssprop --dads-search-box-button-border-color - ボタン枠線色
 *
 * @fires dads-input - 入力時に発火（detail: { query: string, scope: string }）
 * @fires dads-change - 値変更確定時に発火（detail: { query: string, scope: string }）
 * @fires dads-search - 検索実行時に発火（detail: { query: string, scope: string }、cancelable）
 *
 * @example
 * ```html
 * <form>
 *   <h1 id="site-search-heading">サイト内検索</h1>
 *   <dads-search-box aria-labelledby="site-search-heading">
 *     <option value="">すべて</option>
 *     <option value="images">画像</option>
 *   </dads-search-box>
 * </form>
 * ```
 */
export class DadsSearchBox extends TypographyFormComponent {
  static override readonly formAssociated = true;

  static readonly version = '1.0.0';

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: '検索ボックスコンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部に検索語入力（<input type="search">）と（任意の）検索対象（<select>）を持つ複合コンポーネントです。',
        'Form-Associated Custom Elementとしてネイティブフォームに参加し、FormData（query + scope）を送信します。',
        'searchランドマークが必要な場合は、ホストに role="search" を付与するか、利用側の <form> に role="search" を付与してください。同一ページに複数ある場合は aria-label / aria-labelledby で命名してください。',
        'forced-colors: active ではアイコン色を CanvasText にフォールバックします。',
      ],
      labels: [
        '検索語inputは label（視覚的に非表示）でラベル付けします。',
        '画面上にラベルがある場合は aria-labelledby を指定して外部ラベルを参照できます。',
        'aria-label / aria-describedby は検索語inputへ転写されます。',
      ],
      keyboard: [
        'Tabで scope（存在する場合）→ query → button の順にフォーカス移動します。',
        'Enter またはボタン操作で dads-search が発火し、フォーム内では requestSubmit() で送信します。',
      ],
      zoom: [
        'デフォルトで最小44x44px相当のタップターゲット（高さ）を確保します（--dads-search-box-control-min-height で上書き可能）。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'scope',
        title: '検索対象（任意）',
        label: '<select>',
        description: 'Light DOMの option/optgroup を複製して内部selectに表示します。',
        category: 'semantics',
        placement: 'top-left',
        target: shadowTarget('[part="scope-select"]'),
      },
      {
        id: 'query',
        title: '検索語',
        label: '<input type="search">',
        description: '検索語を入力します。label/aria-* によりアクセシブルネームが提供されます。',
        category: 'labels',
        placement: 'top-left',
        target: shadowTarget('[part="input"]'),
      },
      {
        id: 'button',
        title: '検索ボタン',
        label: '<dads-button>',
        description: 'クリックまたはEnterで検索実行（dads-search）を行います。',
        category: 'keyboard',
        placement: 'top-right',
        target: shadowTarget('[part="button"]'),
      },
    ],
  };

  // DOM refs
  #scopeLabel: HTMLElement | null = null;
  #scopeSelect: HTMLSelectElement | null = null;
  #labelText: HTMLElement | null = null;
  #input: HTMLInputElement | null = null;
  #submitButton: HTMLElement | null = null;

  // Light DOM option監視
  #optionsObserver: MutationObserver | null = null;

  // イベントリスナー管理
  #abortController: AbortController | null = null;

  static definition = {
    name: 'dads-search-box',
    template: html`
      <div part="base" id="base">
        <div part="fields" id="fields">
          <label part="scope" id="scope">
            <span part="scope-label" id="scope-label">検索対象</span>
            <select part="scope-select" id="scope-select"></select>
            <svg part="scope-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" fill="currentcolor" />
            </svg>
          </label>

          <label part="query" id="query">
            <svg part="search-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 20.5-6-6a7.4 7.4 0 0 0 1.9-5A7.4 7.4 0 0 0 9.5 2 7.5 7.5 0 1 0 14 15.5l6 6 1-1ZM3.5 9.5a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6Z" fill="currentcolor" />
            </svg>
            <span part="visually-hidden" id="label-text">検索</span>
            <input part="input" id="input" type="search" />
          </label>
        </div>

        <dads-button part="button" id="submit-button" type="submit" variant="solid" size="large">検索</dads-button>
      </div>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), searchBoxTokens, searchBoxStyles, applyDADSFocusStyles()],
      'minimal'
    ),
    attributes: [
      PropertyAttr('name'),
      PropertyAttr('label'),
      { attribute: 'value' },
      { attribute: 'aria-label' },
      { attribute: 'aria-labelledby' },
      { attribute: 'aria-describedby' },
      { attribute: 'scope-name' },
      { attribute: 'scope-value' },
      { attribute: 'scope-label' },
      { attribute: 'button-label' },
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();

    // 依存コンポーネントを先に登録（内部でdads-buttonを利用）
    const prefix = getPrefixFromLocalName(this.localName, '-search-box');
    defineButton(prefix);

    setDefaultAttributes(this, {
      name: 'q',
      label: '検索',
      'scope-name': 'scope',
      'scope-label': '検索対象',
      'button-label': '検索',
    });

    this.#scopeLabel = this.shadowRoot?.querySelector('#scope-label') as HTMLElement | null;
    this.#scopeSelect = this.shadowRoot?.querySelector('#scope-select') as HTMLSelectElement | null;
    this.#labelText = this.shadowRoot?.querySelector('#label-text') as HTMLElement | null;
    this.#input = this.shadowRoot?.querySelector('#input') as HTMLInputElement | null;
    this.#submitButton = this.#ensureButtonElement('submit-button', prefix);

    this.#setupEventListeners();
    this.#setupOptionsObserver();
    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#abortController?.abort();
    this.#abortController = null;

    this.#optionsObserver?.disconnect();
    this.#optionsObserver = null;

    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this.#input) return;

    switch (name) {
      case 'label':
        this.#syncLabel();
        break;
      case 'aria-label':
      case 'aria-labelledby':
      case 'aria-describedby':
        this.#syncInputAttributes();
        break;
      case 'button-label':
        this.#syncButtonLabel();
        break;
      case 'scope-label':
        this.#syncScopeLabel();
        break;
      case 'scope-name':
        this.#syncFormValue();
        break;
      case 'scope-value':
        if (newValue !== null) this.scopeValue = newValue;
        break;
      case 'name':
        this.#syncFormValue();
        break;
      case 'value':
        if (newValue !== null) this.value = newValue;
        break;
    }
  }

  // Public API
  get value(): string {
    return this.#input?.value ?? '';
  }

  set value(v: string) {
    if (!this.#input) return;
    this.#input.value = v;
    this.#syncFormValue();
  }

  get scopeValue(): string {
    return this.#scopeSelect?.value ?? '';
  }

  set scopeValue(v: string) {
    if (!this.#scopeSelect) return;
    this.#scopeSelect.value = v;
    this.#syncFormValue();
  }

  // Form callbacks
  formResetCallback(): void {
    const defaultQuery = this.getAttribute('value') ?? '';
    const defaultScope = this.getAttribute('scope-value') ?? '';
    this.value = defaultQuery;
    this.scopeValue = defaultScope;
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (state instanceof FormData) {
      const queryName = this.getAttribute('name') ?? 'q';
      const scopeName = this.getAttribute('scope-name') ?? 'scope';
      const q = state.get(queryName);
      const s = state.get(scopeName);
      if (typeof q === 'string') this.value = q;
      if (typeof s === 'string') this.scopeValue = s;
    }
  }

  focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  blur(): void {
    this.#input?.blur();
  }

  // ========== Private ==========

  #setupEventListeners(): void {
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    this.#input?.addEventListener('input', () => {
      this.#syncFormValue();
      this.emitEvent<SearchDetail>('dads-input', this.#detail());
    }, { signal });

    this.#input?.addEventListener('change', () => {
      this.emitEvent<SearchDetail>('dads-change', this.#detail());
    }, { signal });

    this.#input?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.isComposing) this.#triggerSearch();
    }, { signal });

    this.#scopeSelect?.addEventListener('input', () => {
      this.#syncFormValue();
      this.emitEvent<SearchDetail>('dads-input', this.#detail());
    }, { signal });

    this.#scopeSelect?.addEventListener('change', () => {
      this.#syncFormValue();
      this.emitEvent<SearchDetail>('dads-change', this.#detail());
    }, { signal });

    this.#submitButton?.addEventListener('click', () => this.#triggerSearch(), { signal });
  }

  #triggerSearch(): void {
    const ok = this.emitEvent<SearchDetail>('dads-search', this.#detail());
    if (!ok) return;

    const form = this._internals.form;
    form?.requestSubmit();
  }

  #syncAll(): void {
    this.#syncLabel();
    this.#syncInputAttributes();
    this.#syncValueFromAttr();
    this.#syncScopeLabel();
    this.#syncButtonLabel();
    this.#syncOptions();
    this.#syncFormValue();
  }

  #syncLabel(): void {
    if (!this.#labelText) return;
    this.#labelText.textContent = this.getAttribute('label') ?? '検索';
  }

  #detail(): SearchDetail {
    return { query: this.value, scope: this.scopeValue };
  }

  #syncInputAttributes(): void {
    const input = this.#input;
    if (!input) return;

    for (const attr of ['aria-label', 'aria-labelledby', 'aria-describedby']) {
      const value = this.getAttribute(attr);
      value !== null ? input.setAttribute(attr, value) : input.removeAttribute(attr);
    }
  }

  #syncValueFromAttr(): void {
    const attrValue = this.getAttribute('value');
    if (attrValue === null) return;
    this.value = attrValue;
  }

  #syncScopeLabel(): void {
    if (!this.#scopeLabel) return;
    this.#scopeLabel.textContent = this.getAttribute('scope-label') ?? '検索対象';
  }

  #syncButtonLabel(): void {
    if (!this.#submitButton) return;
    this.#submitButton.textContent = this.getAttribute('button-label') ?? '検索';
  }

  #getLightDomOptionElements(): Array<HTMLOptionElement | HTMLOptGroupElement> {
    return Array.from(this.children).filter(
      (el): el is HTMLOptionElement | HTMLOptGroupElement =>
        el instanceof HTMLOptionElement || el instanceof HTMLOptGroupElement
    );
  }

  #syncOptions(): void {
    const select = this.#scopeSelect;
    if (!select) return;

    const preserveValue = this.getAttribute('scope-value') ?? (select.options.length > 0 ? select.value : null);
    select.replaceChildren(...this.#getLightDomOptionElements().map((el) => el.cloneNode(true)));
    if (preserveValue !== null) select.value = preserveValue;

    this.toggleAttribute('data-has-scope', select.options.length > 0);
  }

  #setupOptionsObserver(): void {
    this.#optionsObserver?.disconnect();
    this.#optionsObserver = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => this.#shouldSyncOptionsFromMutation(mutation))) return;
      this.#syncOptions();
      this.#syncFormValue();
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
    const el = mutation.type === 'attributes'
      ? mutation.target
      : (mutation.target as CharacterData).parentElement;
    return el instanceof Element && (el.tagName === 'OPTION' || el.tagName === 'OPTGROUP');
  }

  #syncFormValue(): void {
    const queryName = this.getAttribute('name');
    const queryValue = this.value;
    const scopeName = this.getAttribute('scope-name');
    const scopeValue = this.scopeValue;

    const formData = new FormData();
    let appended = false;

    if (queryName) {
      formData.append(queryName, queryValue);
      appended = true;
    }

    const hasScope = this.hasAttribute('data-has-scope');
    if (hasScope && scopeName) {
      formData.append(scopeName, scopeValue);
      appended = true;
    }

    this._internals.setFormValue(appended ? formData : null);
  }

  #ensureButtonElement(id: string, prefix: string): HTMLElement | null {
    const root = this.shadowRoot;
    if (!root) return null;

    const current = root.querySelector(`#${id}`) as HTMLElement | null;
    if (!current) return null;

    const expectedName = `${prefix}-button`;
    if (current.localName === expectedName) return current;

    const replacement = document.createElement(expectedName) as HTMLElement;

    for (const attrName of current.getAttributeNames()) {
      const val = current.getAttribute(attrName);
      if (val === null) replacement.setAttribute(attrName, '');
      else replacement.setAttribute(attrName, val);
    }

    while (current.firstChild) replacement.appendChild(current.firstChild);

    current.parentNode?.replaceChild(replacement, current);

    return replacement;
  }
}
