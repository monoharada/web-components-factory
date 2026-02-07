/**
 * @module breadcrumb
 * デジタル庁デザインシステム 現在位置ナビゲーション（パンくず）コンポーネント
 * @version 0.1.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
  TransferringPropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { breadcrumbTokens, breadcrumbSemanticTokens } from './breadcrumb-tokens.js';
import { breadcrumbStyles, breadcrumbItemStyles } from './breadcrumb-styles.js';

type StructuredDataMode = 'off' | 'microdata';
type BreadcrumbSeparator = 'chevron' | 'slash' | 'pipe';
type RefsHost = { refs?: Record<string, unknown> };

let labelIdSeed = 0;

function getRef<T extends Element>(host: RefsHost, id: string): T | null {
  const el = host.refs?.[id];
  return el instanceof Element ? (el as T) : null;
}

function normalizeStructuredDataMode(value: string | null): StructuredDataMode {
  return value === 'microdata' ? 'microdata' : 'off';
}

function normalizeSeparator(value: string | null): BreadcrumbSeparator {
  if (value === 'slash' || value === 'pipe') return value;
  return 'chevron';
}

function normalizeText(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').trim();
}

function isExplicitCurrent(item: Element): boolean {
  return item.hasAttribute('current') || item.getAttribute('aria-current') === 'page';
}

function setOrRemoveAttribute(el: Element, name: string, value: string | null): void {
  if (value) {
    el.setAttribute(name, value);
    return;
  }
  el.removeAttribute(name);
}

interface BreadcrumbItemLike extends HTMLElement {
  getStructuredDataName?: () => string | null;
}

const BREADCRUMB_OBSERVER_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['current', 'aria-current', 'href', 'home'],
};

/**
 * 現在位置ナビゲーション（パンくず）コンテナ
 *
 * @customElement dads-breadcrumb
 * @tagname dads-breadcrumb
 *
 * @slot default - dads-breadcrumb-item 群
 * @slot label - ナビゲーションラベル（デフォルト: 現在位置）
 *
 * @csspart nav - ナビゲーションルート（nav要素）
 * @csspart label - ナビゲーションラベル
 * @csspart list - パンくず一覧（p要素）
 *
 * @attr {boolean} show-label - ラベルを視覚表示する
 * @attr {'chevron' | 'slash' | 'pipe'} separator - 区切り表示種別
 * @attr {'off' | 'microdata'} structured-data - 構造化データ出力モード
 * @attr {string} base-url - 構造化データURL解決用ベースURL
 * @attr {string} aria-label - ナビゲーションのラベル
 * @attr {string} aria-labelledby - ナビゲーションラベルの参照先ID
 */
export class DadsBreadcrumb extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-breadcrumb',
    template: html`
      <nav part="nav" id="nav">
        <span part="label" id="label">
          <slot name="label" id="label-slot">現在位置</slot>
        </span>
        <p part="list" id="list" role="list">
          <slot id="items-slot"></slot>
        </p>
      </nav>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      breadcrumbTokens,
      breadcrumbStyles,
    ], 'minimal'),
    attributes: [
      BooleanAttr('showLabel', 'show-label'),
      PropertyAttr('separator'),
      PropertyAttr('structuredData', 'structured-data'),
      PropertyAttr('baseUrl', 'base-url'),
      TransferringPropertyAttr('nav', 'ariaLabel', 'aria-label'),
      TransferringPropertyAttr('nav', 'ariaLabelledby', 'aria-labelledby'),
    ],
  };

  #itemsSlot: HTMLSlotElement | null = null;
  #label: HTMLElement | null = null;
  #observer: MutationObserver | null = null;
  #isSyncing = false;
  #labelId = '';

  connectedCallback() {
    super.connectedCallback();

    this.#itemsSlot = getRef<HTMLSlotElement>(this, 'items-slot');
    this.#label = getRef<HTMLElement>(this, 'label');

    this.#itemsSlot?.addEventListener('slotchange', this.#handleSlotChange);

    this.#observer = new MutationObserver(this.#handleMutations);
    this.#startObservingMutations();

    this.#syncAll();
  }

  disconnectedCallback() {
    this.#itemsSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#itemsSlot = null;

    this.#observer?.disconnect();
    this.#observer = null;

    this.#label = null;
    super.disconnectedCallback();
  }

  structuredDataChanged(): void {
    this.#syncAll();
  }

  separatorChanged(): void {
    this.#syncAll();
  }

  baseUrlChanged(): void {
    this.#syncAll();
  }

  ariaLabelChanged(): void {
    this.#syncAll();
  }

  ariaLabelledbyChanged(): void {
    this.#syncAll();
  }

  #handleSlotChange = (): void => {
    this.#syncAll();
  };

  #handleMutations = (): void => {
    if (this.#isSyncing) return;
    this.#syncAll();
  };

  #startObservingMutations(): void {
    if (!this.#observer || !this.isConnected) return;
    this.#observer.observe(this, BREADCRUMB_OBSERVER_OPTIONS);
  }

  #getItemTagName(): string {
    const tag = this.localName;
    return tag.endsWith('-breadcrumb') ? `${tag}-item` : 'dads-breadcrumb-item';
  }

  #getItems(): BreadcrumbItemLike[] {
    const itemTag = this.#getItemTagName();
    const items: BreadcrumbItemLike[] = [];

    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.tagName.toLowerCase() !== itemTag) continue;
      items.push(child as BreadcrumbItemLike);
    }

    return items;
  }

  #syncAll(): void {
    this.#observer?.disconnect();
    this.#isSyncing = true;
    try {
      this.#syncNavLabel();
      this.#syncItems();
      this.#syncStructuredData();
    } finally {
      this.#isSyncing = false;
      this.#startObservingMutations();
    }
  }

  #syncNavLabel(): void {
    const nav = getRef<HTMLElement>(this, 'nav');
    const label = this.#label ?? getRef<HTMLElement>(this, 'label');
    if (!nav || !label) return;

    if (!this.#labelId) {
      labelIdSeed += 1;
      this.#labelId = `${this.localName}-label-${labelIdSeed}`;
    }
    label.id = this.#labelId;

    const hasHostLabel =
      this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby');

    if (hasHostLabel) {
      if (nav.getAttribute('aria-labelledby') === this.#labelId) {
        nav.removeAttribute('aria-labelledby');
      }
      return;
    }

    nav.setAttribute('aria-labelledby', this.#labelId);
  }

  #syncItems(): void {
    const items = this.#getItems();
    const total = items.length;
    const separator = normalizeSeparator(this.getAttribute('separator'));

    if (total === 0) return;
    const explicitCurrentIndex = items.findIndex(item => isExplicitCurrent(item));
    const currentIndex = explicitCurrentIndex >= 0 ? explicitCurrentIndex : total - 1;

    for (let i = 0; i < total; i++) {
      const item = items[i];
      const isCurrent = i === currentIndex;

      item.toggleAttribute('current', isCurrent);
      if (isCurrent) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');

      if (!item.hasAttribute('role')) item.setAttribute('role', 'listitem');
      item.setAttribute('aria-posinset', String(i + 1));
      item.setAttribute('aria-setsize', String(total));
      if (item.getAttribute('data-separator-style') !== separator) {
        item.setAttribute('data-separator-style', separator);
      }
    }
  }

  #syncStructuredData(): void {
    const mode = normalizeStructuredDataMode(this.getAttribute('structured-data'));

    if (mode === 'off') {
      this.#removeStructuredDataMirror();
      return;
    }

    const items = this.#getItems();
    if (items.length === 0) {
      this.#removeStructuredDataMirror();
      return;
    }

    const mirror = this.#ensureStructuredDataMirror();
    if (!mirror) return;

    mirror.replaceChildren();

    const root = document.createElement('div');
    root.setAttribute('itemscope', '');
    root.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const name = this.#readStructuredDataName(item);
      if (!name) continue;

      const listItemEl = document.createElement('span');
      listItemEl.setAttribute('itemprop', 'itemListElement');
      listItemEl.setAttribute('itemscope', '');
      listItemEl.setAttribute('itemtype', 'https://schema.org/ListItem');

      const resolvedUrl = this.#resolveStructuredDataUrl(item.getAttribute('href'));
      if (resolvedUrl) {
        const link = document.createElement('a');
        link.setAttribute('itemprop', 'item');
        link.href = resolvedUrl;

        const nameEl = document.createElement('span');
        nameEl.setAttribute('itemprop', 'name');
        nameEl.textContent = name;
        link.appendChild(nameEl);
        listItemEl.appendChild(link);
      } else {
        const nameEl = document.createElement('span');
        nameEl.setAttribute('itemprop', 'name');
        nameEl.textContent = name;
        listItemEl.appendChild(nameEl);
      }

      const position = document.createElement('meta');
      position.setAttribute('itemprop', 'position');
      position.content = String(i + 1);
      listItemEl.appendChild(position);

      root.appendChild(listItemEl);
    }

    mirror.appendChild(root);
  }

  #ensureStructuredDataMirror(): HTMLElement | null {
    const selector = ':scope > [data-breadcrumb-structured-data]';
    const existing = this.querySelector(selector);
    if (existing instanceof HTMLElement) return existing;

    const mirror = document.createElement('div');
    mirror.setAttribute('data-breadcrumb-structured-data', '');
    mirror.setAttribute('slot', 'structured-data');
    mirror.setAttribute('hidden', '');
    mirror.setAttribute('aria-hidden', 'true');
    this.appendChild(mirror);
    return mirror;
  }

  #removeStructuredDataMirror(): void {
    const mirror = this.querySelector(':scope > [data-breadcrumb-structured-data]');
    if (mirror instanceof HTMLElement) mirror.remove();
  }

  #readStructuredDataName(item: BreadcrumbItemLike): string {
    const fromMethod = item.getStructuredDataName?.();
    if (fromMethod) return normalizeText(fromMethod);
    return normalizeText(item.textContent);
  }

  #resolveStructuredDataUrl(href: string | null): string | null {
    if (!href) return null;

    const absolute = href.trim();
    if (absolute.length === 0) return null;

    try {
      return new URL(absolute).href;
    } catch {
      // continue
    }

    const base = this.getAttribute('base-url')?.trim() || document.baseURI;
    try {
      return new URL(absolute, base).href;
    } catch {
      return null;
    }
  }
}

/**
 * 現在位置ナビゲーション（パンくず）項目
 *
 * @customElement dads-breadcrumb-item
 * @tagname dads-breadcrumb-item
 *
 * @slot default - 項目テキスト
 *
 * @csspart item - アイテムルート（p要素）
 * @csspart home-icon - ホームアイコン
 * @csspart link - 非現在項目リンク
 * @csspart current - 現在項目テキスト
 * @csspart separator - 区切り
 * @csspart separator-icon - 区切りアイコン
 * @csspart separator-text - 区切りテキスト（slash / pipe）
 *
 * @attr {string} href - リンク先URL
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {boolean} current - 現在ページ
 * @attr {boolean} home - ホームアイコン表示
 * @attr {string} aria-current - 現在位置（page）
 */
export class DadsBreadcrumbItem extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-breadcrumb-item',
    template: html`
      <p part="item" id="item">
        <span part="home-icon" id="home-icon" aria-hidden="true" hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 13.666V6.166L7.99998 2.4032L12.99997 6.166V13.666H9.26922V9.20443H6.73075V13.666H3Z" fill="currentColor"></path>
          </svg>
        </span>

        <a part="link" id="link">
          <slot id="content-slot"></slot>
        </a>

        <span part="current" id="current" hidden></span>

        <span part="separator" id="separator" aria-hidden="true">
          <svg part="separator-icon" id="separator-icon" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M4.5 10.5L4 10L8 6L4 2L4.5 1.5L9.05 6L4.5 10.5Z" fill="currentColor"></path>
          </svg>
          <span part="separator-text" id="separator-text" hidden></span>
        </span>
      </p>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      breadcrumbSemanticTokens,
      breadcrumbItemStyles,
      applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('current'),
      BooleanAttr('home'),
      PropertyAttr('separatorStyle', 'data-separator-style'),
      PropertyAttr('ariaCurrent', 'aria-current'),
    ],
  };

  #link: HTMLAnchorElement | null = null;
  #current: HTMLElement | null = null;
  #separator: HTMLElement | null = null;
  #separatorIcon: SVGElement | null = null;
  #separatorText: HTMLElement | null = null;
  #homeIcon: HTMLElement | null = null;
  #contentSlot: HTMLSlotElement | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.#link = getRef<HTMLAnchorElement>(this, 'link');
    this.#current = getRef<HTMLElement>(this, 'current');
    this.#separator = getRef<HTMLElement>(this, 'separator');
    this.#separatorIcon = getRef<SVGElement>(this, 'separator-icon');
    this.#separatorText = getRef<HTMLElement>(this, 'separator-text');
    this.#homeIcon = getRef<HTMLElement>(this, 'home-icon');
    this.#contentSlot = getRef<HTMLSlotElement>(this, 'content-slot');

    this.#contentSlot?.addEventListener('slotchange', this.#handleSlotChange);

    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
    this.#sync();
  }

  disconnectedCallback() {
    this.#contentSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#contentSlot = null;
    this.#link = null;
    this.#current = null;
    this.#separator = null;
    this.#separatorIcon = null;
    this.#separatorText = null;
    this.#homeIcon = null;
    super.disconnectedCallback();
  }

  hrefChanged(): void {
    this.#sync();
  }

  targetChanged(): void {
    this.#sync();
  }

  relChanged(): void {
    this.#sync();
  }

  currentChanged(): void {
    this.#sync();
  }

  homeChanged(): void {
    this.#sync();
  }

  separatorStyleChanged(): void {
    this.#sync();
  }

  ariaCurrentChanged(): void {
    this.#sync();
  }

  getStructuredDataName(): string | null {
    const text = this.#readAssignedText();
    return text.length > 0 ? text : null;
  }

  #handleSlotChange = (): void => {
    this.#sync();
  };

  #isCurrent(): boolean {
    return isExplicitCurrent(this);
  }

  #sync(): void {
    const link = this.#link ?? getRef<HTMLAnchorElement>(this, 'link');
    const current = this.#current ?? getRef<HTMLElement>(this, 'current');
    const separator = this.#separator ?? getRef<HTMLElement>(this, 'separator');
    const separatorIcon = this.#separatorIcon ?? getRef<SVGElement>(this, 'separator-icon');
    const separatorText = this.#separatorText ?? getRef<HTMLElement>(this, 'separator-text');
    const homeIcon = this.#homeIcon ?? getRef<HTMLElement>(this, 'home-icon');
    if (!link || !current || !separator || !separatorIcon || !separatorText || !homeIcon) return;

    const href = this.getAttribute('href');
    const isCurrent = this.#isCurrent();
    const separatorStyle = normalizeSeparator(this.getAttribute('data-separator-style'));

    homeIcon.toggleAttribute('hidden', !this.hasAttribute('home'));

    const showChevron = separatorStyle === 'chevron';
    separatorIcon.toggleAttribute('hidden', !showChevron);
    separatorText.toggleAttribute('hidden', showChevron);
    separatorText.textContent = showChevron ? '' : (separatorStyle === 'pipe' ? '|' : '/');

    if (!isCurrent && href) {
      link.hidden = false;
      link.setAttribute('href', href);
      setOrRemoveAttribute(link, 'target', this.getAttribute('target'));
      setOrRemoveAttribute(link, 'rel', this.getAttribute('rel'));

      current.hidden = true;
      current.textContent = '';
    } else {
      link.hidden = true;
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');

      current.hidden = false;
      current.textContent = this.#readAssignedText();
    }

    separator.hidden = isCurrent;
  }

  #readAssignedText(): string {
    const slot = this.#contentSlot ?? getRef<HTMLSlotElement>(this, 'content-slot');
    if (!slot) return normalizeText(this.textContent);
    const text = slot
      .assignedNodes({ flatten: true })
      .map(node => node.textContent ?? '')
      .join('');
    return normalizeText(text);
  }
}
