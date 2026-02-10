/**
 * @module mobile-menu
 * デジタル庁デザインシステム Mobile Menu コンポーネント
 */

import {
  html,
  TransferringPropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { mobileMenuTokens } from './mobile-menu-tokens.js';
import { mobileMenuStyles } from './mobile-menu-styles.js';

export type DadsMobileMenuToggleEventDetail = Readonly<{
  trigger: HTMLElement;
  panel: HTMLElement;
  controlId: string;
  expanded: boolean;
  originalEvent: Event | null;
}>;

function subscribe<T extends EventTarget>(
  element: T,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean,
): () => void {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener, options);
}

function unsubscribeAll(subscriptions: Array<() => void>): void {
  for (const unsubscribe of subscriptions) unsubscribe();
  subscriptions.length = 0;
}

function isExpandedState(value: string | null): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function hasMeaningfulSlottedContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;

  const assigned = slot.assignedNodes({ flatten: true });
  for (const node of assigned) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (!element.hasAttribute('hidden')) return true;
      continue;
    }
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return true;
  }

  return false;
}

function escapeId(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

/**
 * モバイルメニューコンポーネント
 *
 * @customElement dads-mobile-menu
 * @tagname dads-mobile-menu
 *
 * @slot back - 戻るリンク行（L2用途）
 * @slot default - メニュー本体
 *
 * @csspart base - ルートの nav 要素
 * @csspart back - 戻る行コンテナ
 * @csspart content - メニュー本文
 *
 * @attr {string} aria-label - ナビゲーションラベル
 * @attr {string} aria-labelledby - ナビゲーションラベル参照先
 *
 * @cssprop --dads-mobile-menu-width - メニュー幅
 * @cssprop --dads-mobile-menu-background - 背景色
 * @cssprop --dads-mobile-menu-padding-block - ルート上下余白
 * @cssprop --dads-mobile-menu-padding-inline - ルート左右余白
 * @cssprop --dads-mobile-menu-border-color - 枠線色
 * @cssprop --dads-mobile-menu-border-width - 枠線幅
 * @cssprop --dads-mobile-menu-divider-margin-inline - 区切り線の左右余白（標準）
 * @cssprop --dads-mobile-menu-divider-margin-inline-wide - 区切り線の左右余白（ワイド）
 * @cssprop --dads-mobile-menu-back-padding-inline - 戻る行左右余白
 * @cssprop --dads-mobile-menu-back-padding-block-start - 戻る行上余白
 * @cssprop --dads-mobile-menu-back-padding-block-end - 戻る行下余白
 *
 * @fires dads-mobile-menu-toggle - セクション開閉時に発火
 */
export class DadsMobileMenu extends TypographyWebComponent {
  #back: HTMLElement | null = null;
  #backSlot: HTMLSlotElement | null = null;
  #contentSlot: HTMLSlotElement | null = null;
  #subscriptions: Array<() => void> = [];
  #mutationObserver: MutationObserver | null = null;

  static definition = {
    name: 'dads-mobile-menu',
    template: html`
      <nav part="base" id="base">
        <div part="back" id="back" hidden>
          <slot name="back" id="back-slot"></slot>
        </div>
        <div part="content" id="content">
          <slot id="content-slot"></slot>
        </div>
      </nav>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), mobileMenuTokens, mobileMenuStyles], 'minimal'),
    attributes: [
      TransferringPropertyAttr('base', 'ariaLabel', 'aria-label'),
      TransferringPropertyAttr('base', 'ariaLabelledby', 'aria-labelledby'),
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.#back = this.shadowRoot?.querySelector('#back') as HTMLElement | null;
    this.#backSlot = this.shadowRoot?.querySelector('#back-slot') as HTMLSlotElement | null;
    this.#contentSlot = this.shadowRoot?.querySelector('#content-slot') as HTMLSlotElement | null;

    this.#setupListeners();
    this.#observeMutations();
    this.#syncBackVisibility();
    this.#syncControlledPanels();
  }

  disconnectedCallback(): void {
    unsubscribeAll(this.#subscriptions);
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
    super.disconnectedCallback();
  }

  #setupListeners(): void {
    unsubscribeAll(this.#subscriptions);

    this.#subscriptions.push(
      subscribe(this, 'click', (event) => this.#handleClick(event as MouseEvent)),
    );

    if (this.#backSlot) {
      this.#subscriptions.push(
        subscribe(this.#backSlot, 'slotchange', () => this.#syncBackVisibility()),
      );
    }

    if (this.#contentSlot) {
      this.#subscriptions.push(
        subscribe(this.#contentSlot, 'slotchange', () => this.#syncControlledPanels()),
      );
    }
  }

  #observeMutations(): void {
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = new MutationObserver(() => {
      this.#syncControlledPanels();
      this.#syncBackVisibility();
    });

    this.#mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-controls', 'aria-expanded', 'id', 'slot', 'hidden'],
    });
  }

  #handleClick(event: MouseEvent): void {
    const trigger = this.#findToggleTrigger(event);
    if (!trigger) return;

    if (trigger.matches(':disabled,[disabled],[aria-disabled="true"]')) return;

    const controlId = trigger.getAttribute('aria-controls')?.trim() ?? '';
    if (!controlId) return;

    const panel = this.#resolvePanel(controlId);
    if (!panel) return;

    event.preventDefault();

    const nextExpanded = !isExpandedState(trigger.getAttribute('aria-expanded'));
    this.#applyExpandedState(trigger, panel, nextExpanded);

    const detail: DadsMobileMenuToggleEventDetail = {
      trigger,
      panel,
      controlId,
      expanded: nextExpanded,
      originalEvent: event,
    };

    this.dispatchEvent(
      new CustomEvent<DadsMobileMenuToggleEventDetail>('dads-mobile-menu-toggle', {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  #findToggleTrigger(event: Event): HTMLElement | null {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

    for (const node of path) {
      if (node === this) break;
      if (!(node instanceof HTMLElement)) continue;
      if (!this.contains(node)) continue;
      if (!node.hasAttribute('aria-controls')) continue;
      if (!node.hasAttribute('aria-expanded')) continue;
      return node;
    }

    const target = event.target;
    if (!(target instanceof Element)) return null;

    const fallback = target.closest('[aria-controls][aria-expanded]');
    if (!(fallback instanceof HTMLElement)) return null;
    if (!this.contains(fallback)) return null;
    return fallback;
  }

  #resolvePanel(controlId: string): HTMLElement | null {
    if (!controlId) return null;
    const selector = `#${escapeId(controlId)}`;
    const panel = this.querySelector(selector);
    return panel instanceof HTMLElement ? panel : null;
  }

  #getToggleTriggers(): HTMLElement[] {
    const out: HTMLElement[] = [];
    const candidates = this.querySelectorAll('[aria-controls][aria-expanded]');

    for (const node of candidates) {
      if (!(node instanceof HTMLElement)) continue;
      out.push(node);
    }

    return out;
  }

  #syncControlledPanels(): void {
    for (const trigger of this.#getToggleTriggers()) {
      const controlId = trigger.getAttribute('aria-controls')?.trim() ?? '';
      if (!controlId) continue;

      const panel = this.#resolvePanel(controlId);
      if (!panel) continue;

      const expanded = isExpandedState(trigger.getAttribute('aria-expanded'));
      this.#applyExpandedState(trigger, panel, expanded);
    }
  }

  #applyExpandedState(trigger: HTMLElement, panel: HTMLElement, expanded: boolean): void {
    const ariaExpandedValue = expanded ? 'true' : 'false';
    if (trigger.getAttribute('aria-expanded') !== ariaExpandedValue) {
      trigger.setAttribute('aria-expanded', ariaExpandedValue);
    }

    if (trigger.hasAttribute('expanded') !== expanded) {
      trigger.toggleAttribute('expanded', expanded);
    }

    const hidden = !expanded;
    if (panel.hasAttribute('hidden') !== hidden) {
      panel.toggleAttribute('hidden', hidden);
    }
  }

  #syncBackVisibility(): void {
    const hasBack = hasMeaningfulSlottedContent(this.#backSlot);
    if (this.#back) this.#back.hidden = !hasBack;
    this.toggleAttribute('data-has-back', hasBack);
  }
}
