/**
 * @module mobile-menu
 * デジタル庁デザインシステム Mobile Menu コンポーネント
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsMobileMenu_instances, _DadsMobileMenu_back, _DadsMobileMenu_backSlot, _DadsMobileMenu_contentSlot, _DadsMobileMenu_subscriptions, _DadsMobileMenu_mutationObserver, _DadsMobileMenu_setupListeners, _DadsMobileMenu_observeMutations, _DadsMobileMenu_handleClick, _DadsMobileMenu_findToggleTrigger, _DadsMobileMenu_resolvePanel, _DadsMobileMenu_getToggleTriggers, _DadsMobileMenu_syncControlledPanels, _DadsMobileMenu_applyExpandedState, _DadsMobileMenu_syncBackVisibility;
import { html, TransferringPropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { mobileMenuTokens } from './mobile-menu-tokens.js';
import { mobileMenuStyles } from './mobile-menu-styles.js';
function subscribe(element, type, listener, options) {
    element.addEventListener(type, listener, options);
    return () => element.removeEventListener(type, listener, options);
}
function unsubscribeAll(subscriptions) {
    for (const unsubscribe of subscriptions)
        unsubscribe();
    subscriptions.length = 0;
}
function isExpandedState(value) {
    return value?.trim().toLowerCase() === 'true';
}
function hasMeaningfulSlottedContent(slot) {
    if (!slot)
        return false;
    const assigned = slot.assignedNodes({ flatten: true });
    for (const node of assigned) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (!element.hasAttribute('hidden'))
                return true;
            continue;
        }
        if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '')
            return true;
    }
    return false;
}
function escapeId(value) {
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
    constructor() {
        super(...arguments);
        _DadsMobileMenu_instances.add(this);
        _DadsMobileMenu_back.set(this, null);
        _DadsMobileMenu_backSlot.set(this, null);
        _DadsMobileMenu_contentSlot.set(this, null);
        _DadsMobileMenu_subscriptions.set(this, []);
        _DadsMobileMenu_mutationObserver.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsMobileMenu_back, this.shadowRoot?.querySelector('#back'), "f");
        __classPrivateFieldSet(this, _DadsMobileMenu_backSlot, this.shadowRoot?.querySelector('#back-slot'), "f");
        __classPrivateFieldSet(this, _DadsMobileMenu_contentSlot, this.shadowRoot?.querySelector('#content-slot'), "f");
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_setupListeners).call(this);
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_observeMutations).call(this);
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncBackVisibility).call(this);
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncControlledPanels).call(this);
    }
    disconnectedCallback() {
        unsubscribeAll(__classPrivateFieldGet(this, _DadsMobileMenu_subscriptions, "f"));
        __classPrivateFieldGet(this, _DadsMobileMenu_mutationObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsMobileMenu_mutationObserver, null, "f");
        super.disconnectedCallback();
    }
}
_DadsMobileMenu_back = new WeakMap(), _DadsMobileMenu_backSlot = new WeakMap(), _DadsMobileMenu_contentSlot = new WeakMap(), _DadsMobileMenu_subscriptions = new WeakMap(), _DadsMobileMenu_mutationObserver = new WeakMap(), _DadsMobileMenu_instances = new WeakSet(), _DadsMobileMenu_setupListeners = function _DadsMobileMenu_setupListeners() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsMobileMenu_subscriptions, "f"));
    __classPrivateFieldGet(this, _DadsMobileMenu_subscriptions, "f").push(subscribe(this, 'click', (event) => __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_handleClick).call(this, event)));
    if (__classPrivateFieldGet(this, _DadsMobileMenu_backSlot, "f")) {
        __classPrivateFieldGet(this, _DadsMobileMenu_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsMobileMenu_backSlot, "f"), 'slotchange', () => __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncBackVisibility).call(this)));
    }
    if (__classPrivateFieldGet(this, _DadsMobileMenu_contentSlot, "f")) {
        __classPrivateFieldGet(this, _DadsMobileMenu_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsMobileMenu_contentSlot, "f"), 'slotchange', () => __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncControlledPanels).call(this)));
    }
}, _DadsMobileMenu_observeMutations = function _DadsMobileMenu_observeMutations() {
    __classPrivateFieldGet(this, _DadsMobileMenu_mutationObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsMobileMenu_mutationObserver, new MutationObserver(() => {
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncControlledPanels).call(this);
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_syncBackVisibility).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsMobileMenu_mutationObserver, "f").observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-controls', 'aria-expanded', 'id', 'slot', 'hidden'],
    });
}, _DadsMobileMenu_handleClick = function _DadsMobileMenu_handleClick(event) {
    const trigger = __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_findToggleTrigger).call(this, event);
    if (!trigger)
        return;
    if (trigger.matches(':disabled,[disabled],[aria-disabled="true"]'))
        return;
    const controlId = trigger.getAttribute('aria-controls')?.trim() ?? '';
    if (!controlId)
        return;
    const panel = __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_resolvePanel).call(this, controlId);
    if (!panel)
        return;
    event.preventDefault();
    const nextExpanded = !isExpandedState(trigger.getAttribute('aria-expanded'));
    __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_applyExpandedState).call(this, trigger, panel, nextExpanded);
    const detail = {
        trigger,
        panel,
        controlId,
        expanded: nextExpanded,
        originalEvent: event,
    };
    this.dispatchEvent(new CustomEvent('dads-mobile-menu-toggle', {
        bubbles: true,
        composed: true,
        detail,
    }));
}, _DadsMobileMenu_findToggleTrigger = function _DadsMobileMenu_findToggleTrigger(event) {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const node of path) {
        if (node === this)
            break;
        if (!(node instanceof HTMLElement))
            continue;
        if (!this.contains(node))
            continue;
        if (!node.hasAttribute('aria-controls'))
            continue;
        if (!node.hasAttribute('aria-expanded'))
            continue;
        return node;
    }
    const target = event.target;
    if (!(target instanceof Element))
        return null;
    const fallback = target.closest('[aria-controls][aria-expanded]');
    if (!(fallback instanceof HTMLElement))
        return null;
    if (!this.contains(fallback))
        return null;
    return fallback;
}, _DadsMobileMenu_resolvePanel = function _DadsMobileMenu_resolvePanel(controlId) {
    if (!controlId)
        return null;
    const selector = `#${escapeId(controlId)}`;
    const panel = this.querySelector(selector);
    return panel instanceof HTMLElement ? panel : null;
}, _DadsMobileMenu_getToggleTriggers = function _DadsMobileMenu_getToggleTriggers() {
    const out = [];
    const candidates = this.querySelectorAll('[aria-controls][aria-expanded]');
    for (const node of candidates) {
        if (!(node instanceof HTMLElement))
            continue;
        out.push(node);
    }
    return out;
}, _DadsMobileMenu_syncControlledPanels = function _DadsMobileMenu_syncControlledPanels() {
    for (const trigger of __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_getToggleTriggers).call(this)) {
        const controlId = trigger.getAttribute('aria-controls')?.trim() ?? '';
        if (!controlId)
            continue;
        const panel = __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_resolvePanel).call(this, controlId);
        if (!panel)
            continue;
        const expanded = isExpandedState(trigger.getAttribute('aria-expanded'));
        __classPrivateFieldGet(this, _DadsMobileMenu_instances, "m", _DadsMobileMenu_applyExpandedState).call(this, trigger, panel, expanded);
    }
}, _DadsMobileMenu_applyExpandedState = function _DadsMobileMenu_applyExpandedState(trigger, panel, expanded) {
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
}, _DadsMobileMenu_syncBackVisibility = function _DadsMobileMenu_syncBackVisibility() {
    const hasBack = hasMeaningfulSlottedContent(__classPrivateFieldGet(this, _DadsMobileMenu_backSlot, "f"));
    if (__classPrivateFieldGet(this, _DadsMobileMenu_back, "f"))
        __classPrivateFieldGet(this, _DadsMobileMenu_back, "f").hidden = !hasBack;
    this.toggleAttribute('data-has-back', hasBack);
};
DadsMobileMenu.definition = {
    name: 'dads-mobile-menu',
    template: html `
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
