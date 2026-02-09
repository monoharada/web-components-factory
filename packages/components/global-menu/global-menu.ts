/**
 * @module global-menu
 * デジタル庁デザインシステム グローバルメニュー
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
  TransferringPropertyAttr,
  ElementSelection,
  Keys,
  Orientation,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { globalMenuTokens } from './global-menu-tokens.js';
import { globalMenuStyles, globalMenuItemStyles } from './global-menu-styles.js';

type MenuListBoxLike = HTMLElement & {
  closeMenu?: () => void;
  focusFirstMenuItem?: () => void;
  focusLastMenuItem?: () => void;
  openMenu?: () => void;
  setFocusReturnTarget?: (target: HTMLElement | null) => void;
};

type GlobalMenuItemLike = HTMLElement & {
  closeSubmenu?: () => void;
  getFocusTarget?: () => HTMLElement | null;
};

type ItemEntry = {
  item: GlobalMenuItemLike;
  target: HTMLElement;
};

function subscribe<T extends EventTarget>(
  el: T,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean,
): () => void {
  el.addEventListener(type, listener, options);
  return () => el.removeEventListener(type, listener, options);
}

function unsubscribeAll(subscriptions: Array<() => void>): void {
  for (const unsubscribe of subscriptions) unsubscribe();
  subscriptions.length = 0;
}

function isMeaningfulNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) return true;
  if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return true;
  return false;
}

function isSafeHref(href: string): boolean {
  return (
    href === '#' ||
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('./') ||
    href.startsWith('../') ||
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href)
  );
}

/**
 * グローバルメニュー（コンテナ）
 *
 * @customElement dads-global-menu
 * @tagname dads-global-menu
 *
 * @slot default - dads-global-menu-item 群
 *
 * @csspart nav - ナビゲーションルート
 * @csspart list - メニュー一覧
 *
 * @attr {string} aria-label - ナビゲーションラベル
 * @attr {string} aria-labelledby - ナビゲーションラベル参照先
 */
export class DadsGlobalMenu extends TypographyWebComponent {
  #subscriptions: Array<() => void> = [];
  #itemObserver: MutationObserver | null = null;

  static definition = {
    name: 'dads-global-menu',
    template: html`
      <nav part="nav" id="nav">
        <ul part="list" id="list" role="list">
          <slot id="items-slot"></slot>
        </ul>
      </nav>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), globalMenuTokens, globalMenuStyles], 'minimal'),
    attributes: [
      TransferringPropertyAttr('nav', 'ariaLabel', 'aria-label'),
      TransferringPropertyAttr('nav', 'ariaLabelledby', 'aria-labelledby'),
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();

    unsubscribeAll(this.#subscriptions);
    this.#subscriptions.push(
      subscribe(this, 'keydown', (e) => this.#handleKeydown(e as KeyboardEvent)),
    );

    const itemsSlot = this.shadowRoot?.querySelector('#items-slot') as HTMLSlotElement | null;
    if (itemsSlot) {
      this.#subscriptions.push(
        subscribe(itemsSlot, 'slotchange', () => this.#syncItems()),
      );
    }

    this.#itemObserver = new MutationObserver((mutations) => this.#handleItemMutations(mutations));
    this.#itemObserver.observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ['expanded'],
    });

    this.#syncItems();
  }

  disconnectedCallback(): void {
    this.#itemObserver?.disconnect();
    this.#itemObserver = null;
    unsubscribeAll(this.#subscriptions);
    super.disconnectedCallback();
  }

  /**
   * すべてのサブメニューを閉じる
   */
  closeAllSubmenus(): void {
    for (const item of this.#getItems()) {
      this.#closeItemSubmenu(item);
    }
  }

  #handleItemMutations(mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes') continue;
      if (mutation.attributeName !== 'expanded') continue;
      if (!(mutation.target instanceof HTMLElement)) continue;
      if (!mutation.target.localName.endsWith('-global-menu-item')) continue;

      const targetItem = mutation.target as GlobalMenuItemLike;
      if (targetItem.hasAttribute('expanded')) {
        this.#enforceSingleExpanded(targetItem);
      }
    }
  }

  #handleKeydown(event: KeyboardEvent): void {
    // サブメニュー側（menu-list-box）がすでに処理したキー操作は再処理しない。
    if (event.defaultPrevented) return;
    if (this.#isEventFromSubmenu(event)) return;

    if (
      event.key !== Keys.arrowLeft &&
      event.key !== Keys.arrowRight &&
      event.key !== Keys.home &&
      event.key !== Keys.end
    ) {
      return;
    }

    const entries = this.#getItemEntries();
    if (entries.length === 0) return;

    const currentTarget = this.#resolveCurrentTarget(entries, event);
    if (!currentTarget) return;

    const selection = new ElementSelection(
      entries.map((entry) => entry.target),
      currentTarget,
    );

    selection.processKey(
      event,
      (target) => {
        this.closeAllSubmenus();
        target.focus();
      },
      {
        orientation: Orientation.horizontal,
        wrap: true,
        preventDefaultHomeEnd: true,
      },
    );
  }

  #isEventFromSubmenu(event: KeyboardEvent): boolean {
    const path = event.composedPath();
    for (const node of path) {
      if (node === this) break;
      if (!(node instanceof HTMLElement)) continue;
      if (node.localName.endsWith('-menu-list-box')) return true;
    }
    return false;
  }

  #resolveCurrentTarget(entries: ItemEntry[], event: KeyboardEvent): HTMLElement | null {
    const path = event.composedPath();
    for (const entry of entries) {
      if (path.includes(entry.target) || path.includes(entry.item)) return entry.target;
    }

    const active = document.activeElement;
    if (!active) return null;

    for (const entry of entries) {
      if (active === entry.target || active === entry.item) return entry.target;
    }

    return null;
  }

  #syncItems(): void {
    const items = this.#getItems();
    for (const item of items) {
      item.setAttribute('role', 'listitem');
    }

    this.#enforceSingleExpanded();
  }

  #getItems(): GlobalMenuItemLike[] {
    const items: GlobalMenuItemLike[] = [];
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.getAttribute('slot')) continue;
      if (!child.localName.endsWith('-global-menu-item')) continue;
      items.push(child as GlobalMenuItemLike);
    }
    return items;
  }

  #getItemEntries(): ItemEntry[] {
    const entries: ItemEntry[] = [];
    for (const item of this.#getItems()) {
      const target = this.#getItemFocusTarget(item);
      if (!target) continue;
      entries.push({ item, target });
    }
    return entries;
  }

  #getItemFocusTarget(item: GlobalMenuItemLike): HTMLElement | null {
    if (typeof item.getFocusTarget === 'function') {
      const target = item.getFocusTarget();
      if (target) return target;
    }
    return item;
  }

  #closeItemSubmenu(item: GlobalMenuItemLike): void {
    if (typeof item.closeSubmenu === 'function') {
      item.closeSubmenu();
      return;
    }
    item.removeAttribute('expanded');
  }

  #enforceSingleExpanded(preferredItem?: GlobalMenuItemLike): void {
    const items = this.#getItems();
    const expandedItems = items.filter((item) => item.hasAttribute('expanded'));
    if (expandedItems.length <= 1) return;

    const keep =
      preferredItem && preferredItem.hasAttribute('expanded')
        ? preferredItem
        : expandedItems[0];

    for (const item of expandedItems) {
      if (item === keep) continue;
      this.#closeItemSubmenu(item);
    }
  }
}

const itemInnerHtml = `
  <span part="start-icon" id="start-icon">
    <slot name="start-icon" id="start-icon-slot"></slot>
  </span>
  <span part="label" id="label">
    <slot></slot>
  </span>
  <svg part="chevron" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"/>
  </svg>
`;

/**
 * グローバルメニュー項目
 *
 * @customElement dads-global-menu-item
 * @tagname dads-global-menu-item
 *
 * @slot default - ラベル
 * @slot start-icon - 先頭アイコン
 * @slot submenu - サブメニュー（dads-menu-list-box）
 *
 * @csspart trigger - 項目本体（ボタン/リンク）
 * @csspart start-icon - 先頭アイコン領域
 * @csspart label - ラベル領域
 * @csspart chevron - サブメニュー用矢印
 *
 * @attr {boolean} current - 現在地
 * @attr {boolean} expanded - サブメニュー展開状態
 * @attr {string} href - リンクURL（submenu未指定時のみ）
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {boolean} download - download属性
 */
export class DadsGlobalMenuItem extends TypographyWebComponent {
  #trigger: HTMLElement | null = null;
  #startIconSlot: HTMLSlotElement | null = null;
  #subscriptions: Array<() => void> = [];
  #submenuSubscriptions: Array<() => void> = [];
  #childObserver: MutationObserver | null = null;
  #submenuOpenObserver: MutationObserver | null = null;
  #isRenderedAsLink = false;
  #isSyncingExpanded = false;
  #isSyncingSubmenuOpen = false;

  static definition = {
    name: 'dads-global-menu-item',
    template: html`
      <button part="trigger" id="trigger" type="button">
        ${itemInnerHtml}
      </button>
      <slot name="submenu" id="submenu-slot"></slot>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), globalMenuTokens, globalMenuItemStyles],
      'minimal',
    ),
    attributes: [
      BooleanAttr('current'),
      BooleanAttr('expanded'),
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('download'),
    ],
  };

  declare current: boolean;
  declare expanded: boolean;
  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;
  declare download: boolean;

  connectedCallback(): void {
    super.connectedCallback();

    this.#syncSubmenuSlotting();
    this.#renderTemplate(this.#shouldRenderAsLink(this.#hasSubmenu()));

    if (!this.#childObserver) {
      this.#childObserver = new MutationObserver(() => {
        this.#syncStructure();
      });
      this.#childObserver.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['slot'],
      });
    }

    this.#syncStructure();
  }

  disconnectedCallback(): void {
    this.#childObserver?.disconnect();
    this.#childObserver = null;
    this.#submenuOpenObserver?.disconnect();
    this.#submenuOpenObserver = null;
    unsubscribeAll(this.#subscriptions);
    unsubscribeAll(this.#submenuSubscriptions);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'href') {
      const shouldRenderAsLink = this.#shouldRenderAsLink(this.#hasSubmenu());
      if (shouldRenderAsLink !== this.#isRenderedAsLink) {
        this.#renderTemplate(shouldRenderAsLink);
      }
      this.#syncLinkAttributes();
      return;
    }

    if (name === 'target' || name === 'rel' || name === 'download') {
      this.#syncLinkAttributes();
      return;
    }

    if (name === 'current') {
      this.#syncCurrentState();
      return;
    }

    if (name === 'expanded') {
      this.#syncExpandedState();
    }
  }

  /**
   * 親コンポーネントがフォーカス対象を参照するためのAPI
   */
  getFocusTarget(): HTMLElement | null {
    return this.#trigger;
  }

  focus(options?: FocusOptions): void {
    this.#trigger?.focus(options);
  }

  openSubmenu(): void {
    if (!this.#hasSubmenu()) return;
    this.setAttribute('expanded', '');
  }

  closeSubmenu(): void {
    this.removeAttribute('expanded');
  }

  toggleSubmenu(): void {
    if (!this.#hasSubmenu()) return;
    if (this.hasAttribute('expanded')) this.closeSubmenu();
    else this.openSubmenu();
  }

  #syncStructure(): void {
    const hasSubmenu = this.#syncSubmenuSlotting();
    const shouldRenderAsLink = this.#shouldRenderAsLink(hasSubmenu);
    if (shouldRenderAsLink !== this.#isRenderedAsLink) {
      this.#renderTemplate(shouldRenderAsLink);
    }

    this.#syncStartIconVisibility();
    this.#syncCurrentState();
    this.#syncExpandedState();
    this.#syncLinkAttributes();
    this.#syncSubmenuBridge();
  }

  #syncSubmenuSlotting(): boolean {
    let hasSubmenu = false;
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (!child.localName.endsWith('-menu-list-box')) continue;

      hasSubmenu = true;
      if (!child.getAttribute('slot')) {
        child.setAttribute('slot', 'submenu');
      }
    }
    return hasSubmenu;
  }

  #hasSubmenu(): boolean {
    return this.#getSubmenu() !== null;
  }

  #shouldRenderAsLink(hasSubmenu: boolean): boolean {
    return !hasSubmenu && this.hasAttribute('href');
  }

  #renderTemplate(isLink: boolean): void {
    if (!this.shadowRoot) return;

    const template = this.#createTemplate(isLink);
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#trigger = this.shadowRoot.querySelector('#trigger') as HTMLElement | null;
    this.#startIconSlot = this.shadowRoot.querySelector('#start-icon-slot') as HTMLSlotElement | null;

    this.#isRenderedAsLink = isLink;

    unsubscribeAll(this.#subscriptions);
    if (this.#trigger) {
      this.#subscriptions.push(
        subscribe(this.#trigger, 'click', (e) => this.#handleTriggerClick(e)),
        subscribe(this.#trigger, 'keydown', (e) => this.#handleTriggerKeydown(e as KeyboardEvent)),
      );
    }

    if (this.#startIconSlot) {
      this.#subscriptions.push(
        subscribe(this.#startIconSlot, 'slotchange', () => this.#syncStartIconVisibility()),
      );
    }

    const submenuSlot = this.shadowRoot.querySelector('#submenu-slot') as HTMLSlotElement | null;
    if (submenuSlot) {
      this.#subscriptions.push(
        subscribe(submenuSlot, 'slotchange', () => this.#syncStructure()),
      );
    }
  }

  #createTemplate(isLink: boolean): HTMLTemplateElement {
    const template = document.createElement('template');

    if (isLink) {
      const anchor = document.createElement('a');
      anchor.setAttribute('part', 'trigger');
      anchor.setAttribute('id', 'trigger');

      const href = this.getAttribute('href') ?? '#';
      anchor.setAttribute('href', isSafeHref(href) ? href : '#');
      anchor.innerHTML = itemInnerHtml;

      const submenuSlot = document.createElement('slot');
      submenuSlot.setAttribute('name', 'submenu');
      submenuSlot.setAttribute('id', 'submenu-slot');
      template.content.append(anchor, submenuSlot);
      return template;
    }

    template.innerHTML = `
      <button part="trigger" id="trigger" type="button">
        ${itemInnerHtml}
      </button>
      <slot name="submenu" id="submenu-slot"></slot>
    `;
    return template;
  }

  #handleTriggerClick(event: Event): void {
    if (!this.#hasSubmenu()) return;
    event.preventDefault();
    this.toggleSubmenu();
  }

  #handleTriggerKeydown(event: KeyboardEvent): void {
    if (!this.#hasSubmenu()) return;

    const submenu = this.#getSubmenu();

    switch (event.key) {
      case Keys.enter:
      case Keys.space:
        event.preventDefault();
        this.toggleSubmenu();
        break;
      case Keys.arrowDown:
        event.preventDefault();
        this.openSubmenu();
        submenu?.focusFirstMenuItem?.();
        break;
      case Keys.arrowUp:
        event.preventDefault();
        this.openSubmenu();
        submenu?.focusLastMenuItem?.();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeSubmenu();
        this.#trigger?.focus();
        break;
    }
  }

  #syncCurrentState(): void {
    const trigger = this.#trigger;
    if (!trigger) return;

    if (this.hasAttribute('current')) {
      trigger.setAttribute('aria-current', 'page');
      return;
    }

    trigger.removeAttribute('aria-current');
  }

  #syncExpandedState(): void {
    const submenu = this.#getSubmenu();
    const hasSubmenu = submenu !== null;

    if (!hasSubmenu && this.hasAttribute('expanded') && !this.#isSyncingExpanded) {
      this.#isSyncingExpanded = true;
      this.removeAttribute('expanded');
      this.#isSyncingExpanded = false;
    }

    const isExpanded = hasSubmenu && this.hasAttribute('expanded');
    const trigger = this.#trigger;

    if (trigger) {
      if (hasSubmenu) {
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      } else {
        trigger.removeAttribute('aria-haspopup');
        trigger.removeAttribute('aria-expanded');
      }
    }

    if (!submenu) return;
    this.#setSubmenuOpen(submenu, isExpanded);
  }

  #syncLinkAttributes(): void {
    const trigger = this.#trigger;
    if (!(trigger instanceof HTMLAnchorElement)) return;

    const href = this.getAttribute('href');
    trigger.setAttribute('href', href && isSafeHref(href) ? href : '#');

    const target = this.getAttribute('target');
    const rel = this.getAttribute('rel');
    const download = this.hasAttribute('download');

    if (target) trigger.setAttribute('target', target);
    else trigger.removeAttribute('target');

    if (rel) trigger.setAttribute('rel', rel);
    else trigger.removeAttribute('rel');

    if (download) trigger.setAttribute('download', '');
    else trigger.removeAttribute('download');
  }

  #syncStartIconVisibility(): void {
    const slot = this.#startIconSlot;
    if (!slot) return;

    let hasStartIcon = false;
    const nodes = slot.assignedNodes({ flatten: true });
    for (const node of nodes) {
      if (!isMeaningfulNode(node)) continue;
      hasStartIcon = true;
      break;
    }

    this.toggleAttribute('data-has-start-icon', hasStartIcon);
  }

  #syncSubmenuBridge(): void {
    unsubscribeAll(this.#submenuSubscriptions);
    this.#submenuOpenObserver?.disconnect();
    this.#submenuOpenObserver = null;

    const submenu = this.#getSubmenu();
    this.toggleAttribute('data-has-submenu', submenu !== null);

    if (!submenu) {
      return;
    }

    submenu.setAttribute('opener-hidden', '');
    submenu.setFocusReturnTarget?.(this.#trigger);
    this.#setSubmenuOpen(submenu, this.hasAttribute('expanded'));

    this.#submenuSubscriptions.push(
      subscribe(submenu, 'menuitemselect', () => {
        this.closeSubmenu();
        this.#trigger?.focus();
      }),
    );

    this.#submenuOpenObserver = new MutationObserver(() => {
      if (this.#isSyncingSubmenuOpen) return;

      const isOpen = submenu.hasAttribute('open');
      if (isOpen === this.hasAttribute('expanded')) return;

      this.#isSyncingExpanded = true;
      if (isOpen) this.setAttribute('expanded', '');
      else this.removeAttribute('expanded');
      this.#isSyncingExpanded = false;
    });

    this.#submenuOpenObserver.observe(submenu, {
      attributes: true,
      attributeFilter: ['open'],
    });
  }

  #setSubmenuOpen(submenu: MenuListBoxLike, isOpen: boolean): void {
    this.#isSyncingSubmenuOpen = true;
    if (isOpen) submenu.setAttribute('open', '');
    else submenu.removeAttribute('open');
    this.#isSyncingSubmenuOpen = false;
  }

  #getSubmenu(): MenuListBoxLike | null {
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.getAttribute('slot') !== 'submenu') continue;
      if (!child.localName.endsWith('-menu-list-box')) continue;
      return child as MenuListBoxLike;
    }
    return null;
  }
}
