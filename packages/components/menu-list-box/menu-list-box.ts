/**
 * @module menu-list-box
 * デジタル庁デザインシステム Menu List Box
 */

import { html, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { menuListBoxTokens } from './menu-list-box-tokens.js';
import { menuListBoxStyles } from './menu-list-box-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

type MenuListBoxSize = 'sm' | 'md';
type MenuListBoxVariant = 'text' | 'outlined' | 'filled';

type MenuItemSelectDetail = {
  selectedItem: HTMLElement;
  selectedValue: string;
  selectedIndex: number;
};

type MenuItemEntry = {
  host: HTMLElement;
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

/**
 * メニューリストボックスコンポーネント
 *
 * @customElement dads-menu-list-box
 * @tagname dads-menu-list-box
 *
 * @slot icon - opener 先頭アイコン
 * @slot label - opener ラベル
 * @slot default - メニュー項目（例: dads-menu-list-item）
 *
 * @csspart opener - opener ボタン
 * @csspart opener-icon - 先頭アイコン領域
 * @csspart opener-label - ラベル領域
 * @csspart opener-arrow - 末尾矢印アイコン
 * @csspart popup - ポップアップ領域
 * @csspart menu - role="menu" のメニュー領域
 *
 * @attr {string} size - サイズ（sm | md）
 * @attr {string} variant - バリアント（text | outlined | filled）
 * @attr {boolean} bold - 太字表示
 * @attr {string} label - ラベル（slot未使用時のフォールバック）
 * @attr {boolean} open - 開閉状態
 *
 * @fires menuitemselect - 項目選択時に発火（detail: { selectedItem, selectedValue, selectedIndex }）
 */
export class DadsMenuListBox extends TypographyWebComponent {
  #opener: HTMLButtonElement | null = null;
  #popup: HTMLElement | null = null;
  #menu: HTMLElement | null = null;
  #iconSlot: HTMLSlotElement | null = null;
  #itemsSlot: HTMLSlotElement | null = null;
  #labelFallback: HTMLElement | null = null;
  #subscriptions: Array<() => void> = [];
  #documentSubscriptions: Array<() => void> = [];
  #menuItemSubscriptions: Array<() => void> = [];

  static definition = {
    name: 'dads-menu-list-box',
    template: html`
      <button
        part="opener"
        id="opener"
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="menu"
      >
        <span part="opener-icon" id="opener-icon">
          <slot name="icon" id="icon-slot"></slot>
        </span>
        <span part="opener-label" id="opener-label">
          <slot name="label" id="label-slot"></slot>
          <span id="label-fallback"></span>
        </span>
        <svg part="opener-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
          <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"/>
        </svg>
      </button>
      <div part="popup" id="popup" hidden>
        <div part="menu" id="menu" role="menu" aria-labelledby="opener">
          <slot id="items-slot"></slot>
        </div>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), menuListBoxTokens, menuListBoxStyles], 'minimal'),
    attributes: [
      PropertyAttr('size'),
      PropertyAttr('variant'),
      BooleanAttr('bold'),
      PropertyAttr('label'),
      BooleanAttr('open'),
    ],
  };

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'メニューリストボックス仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'opener は aria-haspopup="menu" を持ち、開閉状態は aria-expanded で表します。',
        'menu は role="menu"、各項目は role="menuitem" を付与してキーボード操作を提供します。',
      ],
      keyboard: [
        'opener: ArrowDown/ArrowUp で開いて先頭/末尾へフォーカス移動。',
        'menu: ArrowUp/ArrowDown/Home/End で roving tabindex により移動。',
        'Escape で閉じて opener にフォーカス復帰。',
      ],
      zoom: [
        'サイズ: sm / md。',
        'ポップアップは max-height と overflow-y でスクロール可能です。',
      ],
      states: [
        'open 属性 / opener の aria-expanded で開閉状態を表します。',
      ],
      labels: [
        'label 属性、または slot="label" で opener のラベルを提供します。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'opener',
        title: 'opener',
        description:
          'aria-haspopup="menu" と aria-expanded を持つトリガーボタン。開閉状態をスクリーンリーダーに伝えます。',
        target: { scope: 'shadow', selector: '[part="opener"]' },
        placement: 'top-left' as const,
      },
      {
        id: 'popup',
        title: 'popup',
        description:
          'role="menu" を持つポップアップ。項目はキーボードナビゲーション（矢印キー / Home / End）で移動できます。',
        target: { scope: 'shadow', selector: '[part="popup"]' },
        placement: 'bottom-right' as const,
      },
    ],
  };

  declare size: MenuListBoxSize;
  declare variant: MenuListBoxVariant;
  declare bold: boolean;
  declare label: string | null;
  declare open: boolean;

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, {
      size: 'sm',
      variant: 'text',
    });

    this.#opener = this.shadowRoot?.querySelector('#opener') as HTMLButtonElement | null;
    this.#popup = this.shadowRoot?.querySelector('#popup') as HTMLElement | null;
    this.#menu = this.shadowRoot?.querySelector('#menu') as HTMLElement | null;
    this.#iconSlot = this.shadowRoot?.querySelector('#icon-slot') as HTMLSlotElement | null;
    this.#itemsSlot = this.shadowRoot?.querySelector('#items-slot') as HTMLSlotElement | null;
    this.#labelFallback = this.shadowRoot?.querySelector('#label-fallback') as HTMLElement | null;

    this.#syncLabel();
    this.#syncOpenerIconVisibility();
    this.#syncOpenState(this.hasAttribute('open'));
    this.#syncMenuItems();
    this.#setupEventListeners();
    this.#syncPopupScrollState();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    unsubscribeAll(this.#subscriptions);
    unsubscribeAll(this.#documentSubscriptions);
    unsubscribeAll(this.#menuItemSubscriptions);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'label') {
      this.#syncLabel();
      return;
    }

    if (name === 'open') {
      this.#syncOpenState(newValue !== null);
      return;
    }
  }

  toggleMenu(): void {
    if (this.#isOpen()) this.closeMenu();
    else this.openMenu();
  }

  openMenu(): void {
    this.setAttribute('open', '');
  }

  closeMenu(): void {
    this.removeAttribute('open');
  }

  focusFirstMenuItem(): void {
    this.#focusItem(0);
  }

  focusLastMenuItem(): void {
    const entries = this.#getMenuItemEntries();
    if (entries.length === 0) return;
    this.#focusItem(entries.length - 1);
  }

  focusNextMenuItem(): void {
    const entries = this.#getMenuItemEntries();
    if (entries.length === 0) return;

    const current = this.#currentIndex(entries);
    if (current >= entries.length - 1) this.#focusItem(0);
    else this.#focusItem(current + 1);
  }

  focusPreviousMenuItem(): void {
    const entries = this.#getMenuItemEntries();
    if (entries.length === 0) return;

    const current = this.#currentIndex(entries);
    if (current <= 0) this.#focusItem(entries.length - 1);
    else this.#focusItem(current - 1);
  }

  #setupEventListeners(): void {
    const opener = this.#opener;
    const menu = this.#menu;
    const iconSlot = this.#iconSlot;
    const itemsSlot = this.#itemsSlot;

    unsubscribeAll(this.#subscriptions);
    if (!opener || !menu) return;

    this.#subscriptions.push(
      subscribe(opener, 'click', (e) => this.#handleOpenerClick(e)),
      subscribe(opener, 'keydown', (e) => this.#handleOpenerKeydown(e as KeyboardEvent)),
      subscribe(menu, 'keydown', (e) => this.#handleMenuKeydown(e as KeyboardEvent)),
    );

    if (iconSlot) {
      this.#subscriptions.push(subscribe(iconSlot, 'slotchange', () => this.#syncOpenerIconVisibility()));
    }

    if (itemsSlot) {
      this.#subscriptions.push(subscribe(itemsSlot, 'slotchange', () => this.#syncMenuItems()));
    }

    this.#syncDocumentListeners(this.#isOpen());
  }

  #syncDocumentListeners(isOpen: boolean): void {
    unsubscribeAll(this.#documentSubscriptions);
    if (!isOpen) return;

    this.#documentSubscriptions.push(
      subscribe(document, 'click', (e) => this.#handleClickOutside(e as MouseEvent)),
      subscribe(document, 'keydown', (e) => this.#handleEscape(e as KeyboardEvent)),
      subscribe(document, 'focusin', (e) => this.#handleFocusIn(e as FocusEvent), true),
    );
  }

  #isEventInside(event: Event): boolean {
    const path = event.composedPath();
    return path.includes(this);
  }

  #handleOpenerClick(event: Event): void {
    event.preventDefault();
    this.toggleMenu();
    if (this.#isOpen()) this.focusFirstMenuItem();
  }

  #handleOpenerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openMenu();
        this.focusFirstMenuItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openMenu();
        this.focusLastMenuItem();
        break;
    }
  }

  #handleMenuKeydown(event: KeyboardEvent): void {
    if (!this.#isOpen()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextMenuItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousMenuItem();
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstMenuItem();
        break;
      case 'End':
        event.preventDefault();
        this.focusLastMenuItem();
        break;
    }
  }

  #handleClickOutside(event: MouseEvent): void {
    if (!this.#isOpen()) return;
    if (this.#isEventInside(event)) return;
    this.closeMenu();
  }

  #handleFocusIn(event: FocusEvent): void {
    if (!this.#isOpen()) return;
    if (this.#isEventInside(event)) return;
    this.closeMenu();
  }

  #handleEscape(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (!this.#isOpen()) return;

    event.preventDefault();
    this.closeMenu();
    this.#opener?.focus();
  }

  #syncLabel(): void {
    if (!this.#labelFallback) return;
    this.#labelFallback.textContent = this.getAttribute('label') ?? '';
  }

  #syncOpenerIconVisibility(): void {
    const slot = this.#iconSlot;
    if (!slot) return;

    let hasIcon = false;
    const nodes = slot.assignedNodes({ flatten: true });
    for (const node of nodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        hasIcon = true;
        break;
      }
      if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') {
        hasIcon = true;
        break;
      }
    }
    this.toggleAttribute('data-has-opener-icon', hasIcon);
  }

  #syncOpenState(isOpen: boolean): void {
    const opener = this.#opener;
    const popup = this.#popup;
    if (!opener || !popup) return;

    popup.hidden = !isOpen;
    opener.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    this.#syncDocumentListeners(isOpen);
    if (!isOpen) {
      this.removeAttribute('data-has-popup-scrollbar');
      return;
    }

    // Wait for layout to settle before measuring.
    queueMicrotask(() => this.#syncPopupScrollState());
  }

  #syncMenuItems(): void {
    this.#syncDividers();

    const entries = this.#getMenuItemEntries();
    unsubscribeAll(this.#menuItemSubscriptions);

    let hasAnyStartIcon = false;
    for (const { host } of entries) {
      if (!host.localName.endsWith('-menu-list-item')) continue;
      if (host.querySelector('[slot="start-icon"]') !== null) {
        hasAnyStartIcon = true;
        break;
      }
    }
    this.toggleAttribute('data-reserve-item-start-icon-space', hasAnyStartIcon);

    for (const [index, entry] of entries.entries()) {
      const { host, target } = entry;

      target.setAttribute('role', 'menuitem');

      this.#menuItemSubscriptions.push(
        subscribe(target, 'click', () => this.#selectMenuItem(host, target, index)),
      );
    }

    this.#syncPopupScrollState();
  }

  #syncDividers(): void {
    const children = Array.from(this.children).filter((el) => el instanceof HTMLElement) as HTMLElement[];

    for (const el of children) {
      if (el.getAttribute('slot')) continue;
      if (!el.matches('[data-menu-list-box-divider], hr, [role="separator"]')) continue;

      // Prefer native <hr> for dividers (DADS).
      if (el.tagName !== 'HR' && !el.hasAttribute('role')) {
        el.setAttribute('role', 'separator');
      }

      // External CSS resets (e.g., `* { margin: 0 }`) may override our CSS variables.
      // Setting inline styles ensures correct spacing even in reset-heavy environments.
      // The CSS already defines these margins (menu-list-box-styles.ts:157-158), but
      // inline styles take precedence and guarantee the divider spacing is preserved.
      const marginValue = 'var(--dads-menu-list-box-divider-margin-block, var(--spacing-4, 1rem))';
      if (!el.style.getPropertyValue('margin-block')) {
        el.style.setProperty('margin-block', marginValue);
      }
      if (!el.style.getPropertyValue('margin-top')) {
        el.style.setProperty('margin-top', marginValue);
      }
      if (!el.style.getPropertyValue('margin-bottom')) {
        el.style.setProperty('margin-bottom', marginValue);
      }
    }
  }

  #syncPopupScrollState(): void {
    if (!this.#isOpen()) return;
    const popup = this.#popup;
    if (!popup) return;

    // In non-layout test environments, clientHeight/scrollHeight may be 0.
    if (popup.clientHeight === 0) {
      this.removeAttribute('data-has-popup-scrollbar');
      return;
    }

    const hasScrollbar = popup.scrollHeight > popup.clientHeight + 1;
    this.toggleAttribute('data-has-popup-scrollbar', hasScrollbar);
  }

  #getMenuItemEntries(): MenuItemEntry[] {
    // Note: rely on light DOM children instead of slot assignment to support test environments
    // where slot distribution/slotchange are not fully implemented (e.g. happy-dom).
    const children = Array.from(this.children).filter((el) => el instanceof HTMLElement) as HTMLElement[];

    const entries: MenuItemEntry[] = [];
    for (const host of children) {
      if (host.getAttribute('slot')) continue;
      // Allow non-interactive content (e.g. dividers) inside the menu slot.
      if (host.matches('[data-menu-list-box-divider], hr, [role="separator"]')) continue;
      const target = this.#getMenuItemTarget(host);
      if (!target) continue;
      entries.push({ host, target });
    }

    return entries;
  }

  #getMenuItemTarget(host: HTMLElement): HTMLElement | null {
    const maybe = host as unknown as { getFocusTarget?: () => HTMLElement | null };
    if (typeof maybe.getFocusTarget === 'function') {
      const target = maybe.getFocusTarget();
      if (target) return target;
    }
    return host;
  }

  #currentIndex(entries: MenuItemEntry[]): number {
    const active = document.activeElement;
    return entries.findIndex(({ host, target }) => active === target || active === host);
  }

  #focusItem(index: number): void {
    const entries = this.#getMenuItemEntries();
    if (index < 0 || index >= entries.length) return;

    for (const { target } of entries) {
      target.setAttribute('tabindex', '-1');
    }

    const entry = entries[index];
    entry.target.setAttribute('tabindex', '0');
    entry.target.focus();
  }

  #selectMenuItem(host: HTMLElement, target: HTMLElement, index: number): void {
    const targetText = (target.textContent ?? '').trim();
    const hostText = (host.textContent ?? '').trim();
    const value = (host.getAttribute('value') ?? host.getAttribute('data-value') ?? targetText) || hostText;

    this.dispatchEvent(
      new CustomEvent<MenuItemSelectDetail>('menuitemselect', {
        bubbles: true,
        composed: true,
        detail: {
          selectedItem: host,
          selectedValue: value,
          selectedIndex: index,
        },
      }),
    );

    this.closeMenu();
    this.#opener?.focus();
  }

  #isOpen(): boolean {
    return this.#opener?.getAttribute('aria-expanded') === 'true';
  }
}
