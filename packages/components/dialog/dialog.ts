/**
 * @module dialog
 * デジタル庁デザインシステム Dialog（モーダル）コンポーネント
 * @version 1.0.0
 */

import { BooleanAttr, PropertyAttr, html } from '../../core/web-components.js';
import type { DadsCommandDetail } from '../../utils/command-store.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { dialogTokens } from './dialog-tokens.js';
import { dialogStyles } from './dialog-styles.js';

type DadsDialogReason = 'programmatic' | 'attribute' | 'command' | 'escape' | 'close-button';
type DadsDialogSize = 's' | 'm' | 'l';
type DadsDialogInitialFocus = 'auto' | 'title';

type DialogActionContext = Readonly<{
  reason: DadsDialogReason;
  invoker: Element | null;
  originalEvent: Event | null;
}>;

export type DadsDialogEventDetail = Readonly<{
  reason: DadsDialogReason;
  invoker: Element | null;
  originalEvent: Event | null;
  returnFocusTo: HTMLElement | null;
}>;

function normalizeDialogSize(value: string | null): DadsDialogSize {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (normalized === 's' || normalized === 'sm') return 's';
  if (normalized === 'l' || normalized === 'lg') return 'l';
  return 'm';
}

function normalizeInitialFocus(value: string | null): DadsDialogInitialFocus {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (normalized === 'title') return 'title';
  return 'auto';
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

/**
 * Dialog（モーダル）コンポーネント
 *
 * @customElement
 * @tagname dads-dialog
 *
 * @slot title - ダイアログタイトル
 * @slot default - ダイアログ本文
 * @slot footer - フッター（操作ボタン群）
 *
 * @csspart base - ルートの dialog 要素
 * @csspart panel - ダイアログ本体
 * @csspart header - ヘッダー領域
 * @csspart title - タイトル領域
 * @csspart close-button - 閉じるボタン（オプション）
 * @csspart content - 本文領域
 * @csspart footer - フッター領域
 *
 * @attr {boolean} open - 開閉状態
 * @attr {string} size - サイズ (s | m | l)
 * @attr {string} initial-focus - 初期フォーカス位置 (auto | title)
 * @attr {boolean} close-button - 閉じるボタン表示
 * @attr {string} close-label - 閉じるボタンラベル
 * @attr {string} aria-label - 指定時はタイトルより優先されるダイアログ名
 *
 * @cssprop --dads-dialog-backdrop-background - 背景(backdrop)色
 * @cssprop --dads-dialog-border-color - ダイアログ境界線色
 * @cssprop --dads-dialog-border-width - ダイアログ境界線幅
 * @cssprop --dads-dialog-width - ダイアログ幅
 * @cssprop --dads-dialog-border-radius - ダイアログ角丸
 *
 * @fires dads-dialog-before-open - 開く前に発火（cancelable）
 * @fires dads-dialog-open - 開いた後に発火
 * @fires dads-dialog-before-close - 閉じる前に発火（cancelable）
 * @fires dads-dialog-close - 閉じた後に発火
 *
 * @example
 * ```html
 * <dads-button commandfor="#user-confirm" command="show-modal">確認する</dads-button>
 *
 * <dads-dialog id="user-confirm" close-button>
 *   <span slot="title">申請を確定しますか？</span>
 *   送信後は取り消せません。
 *   <div slot="footer">
 *     <dads-button commandfor="#user-confirm" command="close" variant="outlined">キャンセル</dads-button>
 *     <dads-button>確定</dads-button>
 *   </div>
 * </dads-dialog>
 * ```
 */
export class DadsDialog extends TypographyWebComponent {
  #base: HTMLDialogElement | null = null;
  #panel: HTMLElement | null = null;
  #closeButton: HTMLButtonElement | null = null;
  #closeButtonLabel: HTMLElement | null = null;
  #titleSlot: HTMLSlotElement | null = null;
  #footerSlot: HTMLSlotElement | null = null;
  #subscriptions: Array<() => void> = [];
  #documentSubscriptions: Array<() => void> = [];
  #ignoreOpenAttrChange = false;
  #openState = false;
  #lastInvoker: HTMLElement | null = null;

  static definition = {
    name: 'dads-dialog',
    template: html`
      <dialog part="base" id="base" closedby="none">
        <section part="panel" id="panel" tabindex="-1">
          <header part="header">
            <div part="title" id="title" tabindex="-1">
              <slot name="title" id="title-slot"></slot>
            </div>
            <button part="close-button" id="close-button" type="button" hidden>
              <span part="close-button-label" id="close-button-label">閉じる</span>
            </button>
          </header>
          <div part="content" id="content">
            <slot></slot>
          </div>
          <footer part="footer" id="footer">
            <slot name="footer" id="footer-slot"></slot>
          </footer>
        </section>
      </dialog>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), dialogTokens, dialogStyles, applyDADSFocusStyles()],
      'minimal',
    ),
    attributes: [
      BooleanAttr('open'),
      PropertyAttr('size'),
      PropertyAttr('initial-focus'),
      { attribute: 'data-preview-contained' },
      BooleanAttr('close-button'),
      PropertyAttr('close-label'),
      PropertyAttr('aria-label'),
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
    this.#footerSlot = this.shadowRoot?.querySelector('#footer-slot') as HTMLSlotElement | null;

    this.#setupListeners();
    this.#syncSize();
    this.#syncCloseButtonVisibility();
    this.#syncCloseButtonLabel();
    this.#syncFooterVisibility();
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
    if (name === 'size' && oldValue !== newValue) this.#syncSize();
    if (name === 'close-button' && oldValue !== newValue) this.#syncCloseButtonVisibility();
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

    if (this.#footerSlot) {
      this.#subscriptions.push(subscribe(this.#footerSlot, 'slotchange', this.#syncFooterVisibility));
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
    // light dismiss 無効化
    event.preventDefault();
    this.#focusInitialElement();
  };

  #handleNativeCancel = (event: Event): void => {
    // ネイティブの自動 close を抑止して、常にコンポーネントの close フローを通す
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

  #requestOpen(context: DialogActionContext): boolean {
    if (this.#isOpen()) return true;

    const invoker = this.#resolveInvoker(context.invoker);
    const beforeDetail = this.#createEventDetail(context, invoker, invoker);

    const beforeEvent = new CustomEvent<DadsDialogEventDetail>('dads-dialog-before-open', {
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
      new CustomEvent<DadsDialogEventDetail>('dads-dialog-open', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
      }),
    );

    return true;
  }

  #requestClose(context: DialogActionContext): boolean {
    if (!this.#isOpen()) return true;

    const invoker = context.invoker ?? this.#lastInvoker;
    const beforeDetail = this.#createEventDetail(context, invoker);

    const beforeEvent = new CustomEvent<DadsDialogEventDetail>('dads-dialog-before-close', {
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
      new CustomEvent<DadsDialogEventDetail>('dads-dialog-close', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
      }),
    );

    return true;
  }

  #createEventDetail(
    context: DialogActionContext,
    invoker: Element | null,
    returnFocusTo: HTMLElement | null = this.#lastInvoker,
  ): DadsDialogEventDetail {
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

    this.#openState = true;
    queueMicrotask(() => this.#focusInitialElement());
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
    if (this.#isEventInsideDialog(event)) return;
    this.#focusInitialElement();
  };

  #isEventInsideDialog(event: Event): boolean {
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
    if (this.#resolveInitialFocus() === 'title') {
      const title = this.#getTitleFocusTarget();
      if (title) {
        title.focus();
        return;
      }
    }

    const explicit = this.#findInitialFocusElement();
    if (explicit) {
      explicit.focus();
      return;
    }

    const focusables = this.#getFocusableElements();
    const preferred = focusables.find((el) => el.hasAttribute('autofocus'));

    const target = preferred ?? focusables[0] ?? this.#panel;
    target?.focus();
  }

  #resolveInitialFocus(): DadsDialogInitialFocus {
    return normalizeInitialFocus(this.getAttribute('initial-focus'));
  }

  #getTitleFocusTarget(): HTMLElement | null {
    if (!hasSlotContent(this.#titleSlot)) return null;
    return this.shadowRoot?.querySelector<HTMLElement>('#title') ?? null;
  }

  #findInitialFocusElement(): HTMLElement | null {
    const candidates = Array.from(this.querySelectorAll<HTMLElement>('[data-dialog-initial-focus]'));
    if (candidates.length > 0) return candidates[0];

    return this.shadowRoot?.querySelector<HTMLElement>('[data-dialog-initial-focus]') ?? null;
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

    // happy-dom では slot.assignedElements() が環境差で不足することがあるため、
    // host の light DOM もフォールバックとして走査する。
    visit(this);

    return out;
  }

  #restoreFocusToInvoker(): void {
    const invoker = this.#lastInvoker;
    if (!invoker || !invoker.isConnected) return;
    invoker.focus();
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

  #syncCloseButtonVisibility = (): void => {
    const button = this.#closeButton;
    if (!button) return;
    button.hidden = !this.hasAttribute('close-button');
  };

  #syncCloseButtonLabel = (): void => {
    const label = this.#closeButtonLabel;
    if (!label) return;
    label.textContent = this.getAttribute('close-label')?.trim() || '閉じる';
  };

  #syncFooterVisibility = (): void => {
    this.toggleAttribute('data-has-footer', hasSlotContent(this.#footerSlot));
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

    base.setAttribute('aria-label', 'ダイアログ');
    base.removeAttribute('aria-labelledby');
  };

  #syncSize = (): void => {
    const normalized = normalizeDialogSize(this.getAttribute('size'));
    if (this.getAttribute('size') === normalized) return;
    this.setAttribute('size', normalized);
  };

  #isPreviewContained(): boolean {
    return this.hasAttribute('data-preview-contained');
  }
}
