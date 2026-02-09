/**
 * @module drawer
 * デジタル庁デザインシステム Drawer（ドロワー）コンポーネント
 * @version 1.0.0
 */

import { BooleanAttr, PropertyAttr, html } from '../../core/web-components.js';
import type { DadsCommandDetail } from '../../utils/command-store.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { drawerTokens } from './drawer-tokens.js';
import { drawerStyles } from './drawer-styles.js';

type DadsDrawerReason =
  | 'programmatic'
  | 'attribute'
  | 'command'
  | 'escape'
  | 'close-button'
  | 'light-dismiss';
type DadsDrawerPlacement = 'left' | 'right';

type DrawerActionContext = Readonly<{
  reason: DadsDrawerReason;
  invoker: Element | null;
  originalEvent: Event | null;
}>;

export type DadsDrawerEventDetail = Readonly<{
  reason: DadsDrawerReason;
  invoker: Element | null;
  originalEvent: Event | null;
  returnFocusTo: HTMLElement | null;
}>;

function normalizePlacement(value: string | null): DadsDrawerPlacement {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (normalized === 'right') return 'right';
  return 'left';
}

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

function hasSlotContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  const nodes = slot.assignedNodes({ flatten: true });
  for (const node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return true;
  }
  return false;
}

function isTabbable(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.hasAttribute('hidden')) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  if (el.matches(':disabled, [disabled], [aria-disabled="true"]')) return false;

  const tabIndexAttr = el.getAttribute('tabindex');
  const isNativeFocusable = el.matches(
    'button,input,select,textarea,a[href],summary,iframe,[contenteditable="true"]',
  );

  if (tabIndexAttr !== null) {
    const normalized = tabIndexAttr.trim();
    if (normalized === '') return true;
    const parsed = Number.parseInt(normalized, 10);
    return !Number.isNaN(parsed) && parsed >= 0;
  }

  return isNativeFocusable;
}

function focusWithoutScroll(target: HTMLElement | null): void {
  if (!target) return;
  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
  }
}

/**
 * Drawer（ドロワー）コンポーネント
 *
 * @customElement
 * @tagname dads-drawer
 *
 * @slot title - ドロワータイトル
 * @slot default - ドロワー本文
 *
 * @csspart base - ルートの dialog 要素
 * @csspart panel - ドロワー本体
 * @csspart header - ヘッダー領域
 * @csspart title - タイトル領域
 * @csspart close-button - 閉じるボタン
 * @csspart close-button-icon - 閉じるアイコン
 * @csspart content - 本文領域
 *
 * @attr {boolean} open - 開閉状態
 * @attr {'left' | 'right'} placement - 表示位置
 * @attr {string} close-label - 閉じるボタンラベル
 * @attr {string} aria-label - 指定時はタイトルより優先されるアクセシブル名
 * @attr {boolean} light-dismiss - 背景クリックで閉じる
 *
 * @cssprop --dads-drawer-width - ドロワー幅
 * @cssprop --dads-drawer-backdrop-background - 背景(backdrop)色
 * @cssprop --dads-drawer-shadow - ドロワー影
 *
 * @fires dads-drawer-before-open - 開く前に発火（cancelable）
 * @fires dads-drawer-open - 開いた後に発火
 * @fires dads-drawer-before-close - 閉じる前に発火（cancelable）
 * @fires dads-drawer-close - 閉じた後に発火
 *
 * @example
 * ```html
 * <dads-hamburger-menu-button commandfor="#global-nav" command="show-modal"></dads-hamburger-menu-button>
 *
 * <dads-drawer id="global-nav" placement="left" close-label="閉じる">
 *   <span slot="title">メニュー</span>
 *   <nav>...</nav>
 * </dads-drawer>
 * ```
 */
export class DadsDrawer extends TypographyWebComponent {
  #base: HTMLDialogElement | null = null;
  #panel: HTMLElement | null = null;
  #closeButton: HTMLButtonElement | null = null;
  #closeButtonLabel: HTMLElement | null = null;
  #titleSlot: HTMLSlotElement | null = null;
  #subscriptions: Array<() => void> = [];
  #documentSubscriptions: Array<() => void> = [];
  #ignoreOpenAttrChange = false;
  #openState = false;
  #lastInvoker: HTMLElement | null = null;

  static definition = {
    name: 'dads-drawer',
    template: html`
      <dialog part="base" id="base" closedby="none">
        <span part="backdrop-anchor" id="backdrop-anchor" aria-hidden="true"></span>
        <section part="panel" id="panel" tabindex="-1">
          <header part="header">
            <div part="title" id="title" tabindex="-1">
              <slot name="title" id="title-slot"></slot>
            </div>
            <button part="close-button" id="close-button" type="button">
              <span part="close-button-icon" id="close-button-icon" aria-hidden="true">
                <svg
                  id="close-button-icon-svg"
                  viewBox="0 0 14 14"
                  fill="none"
                  width="14"
                  height="14"
                  focusable="false"
                >
                  <path
                    id="close-button-icon-path"
                    fill="currentColor"
                    d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                  ></path>
                </svg>
              </span>
              <span part="close-button-label" id="close-button-label">閉じる</span>
            </button>
          </header>
          <div part="content" id="content">
            <slot></slot>
          </div>
        </section>
      </dialog>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), drawerTokens, drawerStyles, applyDADSFocusStyles()],
      'minimal',
    ),
    attributes: [
      BooleanAttr('open'),
      PropertyAttr('placement'),
      PropertyAttr('close-label'),
      PropertyAttr('aria-label'),
      BooleanAttr('light-dismiss'),
      { attribute: 'data-preview-contained' },
    ],
  };

  declare open: boolean;

  connectedCallback(): void {
    super.connectedCallback();

    this.#base = this.shadowRoot?.querySelector('#base') as HTMLDialogElement | null;
    this.#panel = this.shadowRoot?.querySelector('#panel') as HTMLElement | null;
    this.#closeButton = this.shadowRoot?.querySelector('#close-button') as HTMLButtonElement | null;
    this.#closeButtonLabel = this.shadowRoot?.querySelector('#close-button-label') as HTMLElement | null;
    this.#titleSlot = this.shadowRoot?.querySelector('#title-slot') as HTMLSlotElement | null;

    this.#setupListeners();
    this.#syncPlacement();
    this.#syncCloseButtonLabel();
    this.#syncAccessibleName();

    if (this.hasAttribute('open')) {
      const opened = this.#requestOpen({ reason: 'attribute', invoker: null, originalEvent: null });
      if (!opened) this.#setOpenAttribute(false);
    } else {
      this.#applyClosedState({ restoreFocus: false });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    unsubscribeAll(this.#subscriptions);
    unsubscribeAll(this.#documentSubscriptions);
    this.#applyClosedState({ restoreFocus: false });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'aria-label' && oldValue !== newValue) this.#syncAccessibleName();
    if (name === 'placement' && oldValue !== newValue) this.#syncPlacement();
    if (name === 'close-label' && oldValue !== newValue) this.#syncCloseButtonLabel();
  }

  openChanged(_oldValue: string | null, newValue: string | null): void {
    if (this.#ignoreOpenAttrChange) return;
    if (!this.isConnected || !this.#base) return;

    if (newValue !== null) {
      const opened = this.#requestOpen({ reason: 'attribute', invoker: null, originalEvent: null });
      if (!opened) this.#setOpenAttribute(false);
      return;
    }

    const closed = this.#requestClose({ reason: 'attribute', invoker: null, originalEvent: null });
    if (!closed) this.#setOpenAttribute(true);
  }

  show(): void {
    this.#requestOpen({ reason: 'programmatic', invoker: null, originalEvent: null });
  }

  close(): void {
    this.#requestClose({ reason: 'programmatic', invoker: null, originalEvent: null });
  }

  #setupListeners(): void {
    unsubscribeAll(this.#subscriptions);

    if (this.#base) {
      this.#subscriptions.push(
        subscribe(this.#base, 'click', this.#handleBaseClick),
        subscribe(this.#base, 'cancel', this.#handleNativeCancel),
      );
    }

    if (this.#closeButton) {
      this.#subscriptions.push(subscribe(this.#closeButton, 'click', this.#handleCloseButtonClick));
    }

    if (this.#titleSlot) {
      this.#subscriptions.push(subscribe(this.#titleSlot, 'slotchange', this.#syncAccessibleName));
    }

    this.#subscriptions.push(
      subscribe(this, 'dads-command', this.#handleDadsCommand as EventListener),
      subscribe(this, 'command', this.#handleCommandEvent as EventListener),
    );
  }

  #handleBaseClick = (event: Event): void => {
    if (!this.#isOpen()) return;
    const panel = this.#panel;
    if (!panel) return;

    const path = event.composedPath();
    if (path.includes(panel)) return;

    event.preventDefault();

    if (this.hasAttribute('light-dismiss')) {
      this.#requestClose({
        reason: 'light-dismiss',
        invoker: this.#resolveInvoker(null),
        originalEvent: event,
      });
      return;
    }

    this.#focusInitialElement();
  };

  #handleNativeCancel = (event: Event): void => {
    event.preventDefault();
    this.#requestClose({ reason: 'escape', invoker: this.#lastInvoker, originalEvent: event });
  };

  #handleCloseButtonClick = (event: Event): void => {
    event.preventDefault();
    this.#requestClose({
      reason: 'close-button',
      invoker: this.#closeButton,
      originalEvent: event,
    });
  };

  #handleDadsCommand = (event: Event): void => {
    if (event.target !== this) return;
    if (!(event instanceof CustomEvent)) return;

    const detail = event.detail as DadsCommandDetail | null;
    const command = detail?.command?.trim() ?? '';
    if (command === '') return;

    this.#handleCommand(command, detail?.invoker ?? null, detail?.originalEvent ?? event);
  };

  #handleCommandEvent = (event: Event): void => {
    if (event.target !== this) return;

    const command = String((event as Event & { command?: string }).command ?? '').trim();
    if (command === '') return;

    this.#handleCommand(command, this.#resolveInvoker(null), event);
  };

  #handleCommand(command: string, invoker: Element | null, originalEvent: Event | null): void {
    if (command === 'show-modal' || command === 'open') {
      this.#requestOpen({ reason: 'command', invoker, originalEvent });
      return;
    }

    if (command === 'close' || command === 'request-close') {
      this.#requestClose({ reason: 'command', invoker, originalEvent });
    }
  }

  #requestOpen(context: DrawerActionContext): boolean {
    if (this.#isOpen()) return true;

    const invoker = this.#resolveInvoker(context.invoker);
    const beforeDetail = this.#createEventDetail(context, invoker, invoker);

    const beforeEvent = new CustomEvent<DadsDrawerEventDetail>('dads-drawer-before-open', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent)) return false;

    this.#lastInvoker = invoker;
    this.#syncAccessibleName();
    this.#applyOpenState();
    this.#setOpenAttribute(true);

    const afterDetail = this.#createEventDetail(context, invoker);
    this.dispatchEvent(
      new CustomEvent<DadsDrawerEventDetail>('dads-drawer-open', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
      }),
    );

    return true;
  }

  #requestClose(context: DrawerActionContext): boolean {
    if (!this.#isOpen()) return true;

    const invoker = context.invoker ?? this.#lastInvoker;
    const beforeDetail = this.#createEventDetail(context, invoker);

    const beforeEvent = new CustomEvent<DadsDrawerEventDetail>('dads-drawer-before-close', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent)) return false;

    this.#applyClosedState({ restoreFocus: true });
    this.#setOpenAttribute(false);

    const afterDetail = this.#createEventDetail(context, invoker);
    this.dispatchEvent(
      new CustomEvent<DadsDrawerEventDetail>('dads-drawer-close', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
      }),
    );

    return true;
  }

  #createEventDetail(
    context: DrawerActionContext,
    invoker: Element | null,
    returnFocusTo: HTMLElement | null = this.#lastInvoker,
  ): DadsDrawerEventDetail {
    return {
      reason: context.reason,
      invoker,
      originalEvent: context.originalEvent,
      returnFocusTo,
    };
  }

  #applyOpenState(): void {
    const base = this.#base;
    if (!base) return;
    const preservedScroll = this.#captureViewportScroll();

    this.#syncDocumentListeners(true);

    if (this.#isPreviewContained() && typeof base.show === 'function') {
      try {
        if (!base.open) base.show();
      } catch {
        base.setAttribute('open', '');
      }
    } else if (typeof base.showModal === 'function') {
      try {
        if (!base.open) base.showModal();
      } catch {
        base.setAttribute('open', '');
      }
    } else {
      base.setAttribute('open', '');
    }
    this.#restoreViewportScroll(preservedScroll);

    this.#openState = true;
    queueMicrotask(() => {
      this.#restoreViewportScroll(preservedScroll);
      this.#focusInitialElement();
      this.#restoreViewportScroll(preservedScroll);
      requestAnimationFrame(() => this.#restoreViewportScroll(preservedScroll));
    });
  }

  #applyClosedState(options: Readonly<{ restoreFocus: boolean }>): void {
    const base = this.#base;
    this.#syncDocumentListeners(false);

    if (base) {
      if (typeof base.close === 'function') {
        try {
          if (base.open) base.close();
          else base.removeAttribute('open');
        } catch {
          base.removeAttribute('open');
        }
      } else {
        base.removeAttribute('open');
      }
    }

    this.#openState = false;
    if (options.restoreFocus) this.#restoreFocusToInvoker();
  }

  #syncDocumentListeners(isOpen: boolean): void {
    unsubscribeAll(this.#documentSubscriptions);
    if (!isOpen || this.#isPreviewContained()) return;

    this.#documentSubscriptions.push(
      subscribe(document, 'keydown', this.#handleDocumentKeyDown, true),
      subscribe(document, 'focusin', this.#handleDocumentFocusIn, true),
    );
  }

  #handleDocumentKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!this.#isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.#requestClose({ reason: 'escape', invoker: this.#lastInvoker, originalEvent: event });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = this.#getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      this.#panel?.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const [firstInPath] = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const active =
      (firstInPath instanceof HTMLElement ? firstInPath : null) ?? this.#getDeepActiveElement();

    if (event.shiftKey) {
      if (active === first || !this.#isElementInsidePanel(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !this.#isElementInsidePanel(active)) {
      event.preventDefault();
      first.focus();
    }
  };

  #handleDocumentFocusIn = (event: Event): void => {
    if (!(event instanceof FocusEvent)) return;
    if (!this.#isOpen()) return;
    if (this.#isEventInsideDrawer(event)) return;
    this.#focusInitialElement();
  };

  #isEventInsideDrawer(event: Event): boolean {
    const base = this.#base;
    if (!base) return false;
    const path = event.composedPath();
    return path.includes(base) || path.includes(this);
  }

  #isElementInsidePanel(element: HTMLElement | null): boolean {
    const panel = this.#panel;
    if (!panel || !element) return false;
    if (panel.contains(element)) return true;

    let node: Node | null = element;
    while (node) {
      if (node === panel) return true;

      if (node instanceof Element && node.assignedSlot) {
        node = node.assignedSlot;
        continue;
      }

      if (node.parentNode) {
        node = node.parentNode;
        continue;
      }

      const root = node.getRootNode();
      if (root instanceof ShadowRoot) {
        node = root.host;
        continue;
      }

      node = null;
    }
    return false;
  }

  #getDeepActiveElement(): HTMLElement | null {
    let active: Element | null = this.shadowRoot?.activeElement ?? document.activeElement;
    while (active && active instanceof HTMLElement && active.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
  }

  #focusInitialElement(): void {
    const explicit = this.#findInitialFocusElement();
    if (explicit) {
      focusWithoutScroll(explicit);
      return;
    }

    const focusables = this.#getFocusableElements();
    const preferred = focusables.find((el) => el.hasAttribute('autofocus'));

    const target = preferred ?? focusables[0] ?? this.#panel;
    focusWithoutScroll(target ?? null);
  }

  #findInitialFocusElement(): HTMLElement | null {
    const candidates = Array.from(this.querySelectorAll<HTMLElement>('[data-drawer-initial-focus]'));
    if (candidates.length > 0) return candidates[0];

    return this.shadowRoot?.querySelector<HTMLElement>('[data-drawer-initial-focus]') ?? null;
  }

  #getFocusableElements(): HTMLElement[] {
    const panel = this.#panel;
    if (!panel) return [];

    const out: HTMLElement[] = [];
    const visited = new Set<Element>();

    const visit = (node: ParentNode): void => {
      for (const child of node.children) {
        if (visited.has(child)) continue;
        visited.add(child);

        if (isTabbable(child)) out.push(child);

        if (child instanceof HTMLSlotElement) {
          const assigned = child.assignedElements({ flatten: true });
          for (const assignedEl of assigned) {
            if (visited.has(assignedEl)) continue;
            visited.add(assignedEl);
            if (isTabbable(assignedEl)) out.push(assignedEl);
            if (assignedEl.shadowRoot) visit(assignedEl.shadowRoot);
            visit(assignedEl);
          }
        }

        if (child instanceof HTMLElement && child.shadowRoot) visit(child.shadowRoot);
        visit(child);
      }
    };

    visit(panel);
    visit(this);

    return out;
  }

  #restoreFocusToInvoker(): void {
    const invoker = this.#lastInvoker;
    if (!invoker || !invoker.isConnected) return;
    focusWithoutScroll(invoker);
  }

  #captureViewportScroll(): Readonly<{ x: number; y: number }> | null {
    if (!this.#isPreviewContained()) return null;
    return {
      x: window.scrollX,
      y: window.scrollY,
    };
  }

  #restoreViewportScroll(position: Readonly<{ x: number; y: number }> | null): void {
    if (!position) return;
    if (window.scrollX === position.x && window.scrollY === position.y) return;
    window.scrollTo(position.x, position.y);
  }

  #setOpenAttribute(isOpen: boolean): void {
    if (this.hasAttribute('open') === isOpen) return;
    this.#ignoreOpenAttrChange = true;
    this.toggleAttribute('open', isOpen);
    this.#ignoreOpenAttrChange = false;
  }

  #isOpen(): boolean {
    return this.#openState;
  }

  #resolveInvoker(invoker: Element | null): HTMLElement | null {
    if (invoker instanceof HTMLElement) return invoker;
    const active = this.#getDeepActiveElement();
    return active instanceof HTMLElement ? active : null;
  }

  #syncCloseButtonLabel = (): void => {
    const label = this.#closeButtonLabel;
    if (!label) return;
    label.textContent = this.getAttribute('close-label')?.trim() || '閉じる';
  };

  #syncAccessibleName = (): void => {
    const base = this.#base;
    if (!base) return;

    const explicitLabel = this.getAttribute('aria-label')?.trim() ?? '';
    const hasTitle = hasSlotContent(this.#titleSlot);

    base.setAttribute('role', 'dialog');
    base.setAttribute('aria-modal', 'true');
    base.setAttribute('aria-describedby', 'content');

    if (explicitLabel !== '') {
      base.setAttribute('aria-label', explicitLabel);
      base.removeAttribute('aria-labelledby');
      return;
    }

    if (hasTitle) {
      base.setAttribute('aria-labelledby', 'title');
      base.removeAttribute('aria-label');
      return;
    }

    base.setAttribute('aria-label', 'ドロワー');
    base.removeAttribute('aria-labelledby');
  };

  #syncPlacement = (): void => {
    const normalized = normalizePlacement(this.getAttribute('placement'));
    if (this.getAttribute('placement') !== normalized) this.setAttribute('placement', normalized);
  };

  #isPreviewContained(): boolean {
    return this.hasAttribute('data-preview-contained');
  }
}
