/**
 * @module global-menu
 * デジタル庁デザインシステム グローバルメニュー
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DadsGlobalMenu_instances, _DadsGlobalMenu_subscriptions, _DadsGlobalMenu_itemObserver, _DadsGlobalMenu_handleItemMutations, _DadsGlobalMenu_handleKeydown, _DadsGlobalMenu_isEventFromSubmenu, _DadsGlobalMenu_resolveCurrentTarget, _DadsGlobalMenu_syncItems, _DadsGlobalMenu_getItems, _DadsGlobalMenu_getItemEntries, _DadsGlobalMenu_getItemFocusTarget, _DadsGlobalMenu_closeItemSubmenu, _DadsGlobalMenu_enforceSingleExpanded, _DadsGlobalMenuItem_instances, _DadsGlobalMenuItem_trigger, _DadsGlobalMenuItem_startIconSlot, _DadsGlobalMenuItem_subscriptions, _DadsGlobalMenuItem_submenuSubscriptions, _DadsGlobalMenuItem_childObserver, _DadsGlobalMenuItem_submenuOpenObserver, _DadsGlobalMenuItem_isRenderedAsLink, _DadsGlobalMenuItem_isSyncingExpanded, _DadsGlobalMenuItem_isSyncingSubmenuOpen, _DadsGlobalMenuItem_syncStructure, _DadsGlobalMenuItem_syncSubmenuSlotting, _DadsGlobalMenuItem_hasSubmenu, _DadsGlobalMenuItem_shouldRenderAsLink, _DadsGlobalMenuItem_renderTemplate, _DadsGlobalMenuItem_createTemplate, _DadsGlobalMenuItem_handleTriggerClick, _DadsGlobalMenuItem_handleTriggerKeydown, _DadsGlobalMenuItem_syncCurrentState, _DadsGlobalMenuItem_syncExpandedState, _DadsGlobalMenuItem_syncLinkAttributes, _DadsGlobalMenuItem_syncStartIconVisibility, _DadsGlobalMenuItem_syncSubmenuBridge, _DadsGlobalMenuItem_setSubmenuOpen, _DadsGlobalMenuItem_getSubmenu;
import { html, BooleanAttr, PropertyAttr, TransferringPropertyAttr, ElementSelection, Keys, Orientation, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { globalMenuTokens } from './global-menu-tokens.js';
import { globalMenuStyles, globalMenuItemStyles } from './global-menu-styles.js';
function subscribe(el, type, listener, options) {
    el.addEventListener(type, listener, options);
    return () => el.removeEventListener(type, listener, options);
}
function unsubscribeAll(subscriptions) {
    for (const unsubscribe of subscriptions)
        unsubscribe();
    subscriptions.length = 0;
}
function isMeaningfulNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE)
        return true;
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '')
        return true;
    return false;
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
    constructor() {
        super(...arguments);
        _DadsGlobalMenu_instances.add(this);
        _DadsGlobalMenu_subscriptions.set(this, []);
        _DadsGlobalMenu_itemObserver.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenu_subscriptions, "f"));
        __classPrivateFieldGet(this, _DadsGlobalMenu_subscriptions, "f").push(subscribe(this, 'keydown', (e) => __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_handleKeydown).call(this, e)));
        const itemsSlot = this.shadowRoot?.querySelector('#items-slot');
        if (itemsSlot) {
            __classPrivateFieldGet(this, _DadsGlobalMenu_subscriptions, "f").push(subscribe(itemsSlot, 'slotchange', () => __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_syncItems).call(this)));
        }
        __classPrivateFieldSet(this, _DadsGlobalMenu_itemObserver, new MutationObserver((mutations) => __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_handleItemMutations).call(this, mutations)), "f");
        __classPrivateFieldGet(this, _DadsGlobalMenu_itemObserver, "f").observe(this, {
            subtree: true,
            attributes: true,
            attributeFilter: ['expanded'],
        });
        __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_syncItems).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsGlobalMenu_itemObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsGlobalMenu_itemObserver, null, "f");
        unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenu_subscriptions, "f"));
        super.disconnectedCallback();
    }
    /**
     * すべてのサブメニューを閉じる
     */
    closeAllSubmenus() {
        for (const item of __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItems).call(this)) {
            __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_closeItemSubmenu).call(this, item);
        }
    }
}
_DadsGlobalMenu_subscriptions = new WeakMap(), _DadsGlobalMenu_itemObserver = new WeakMap(), _DadsGlobalMenu_instances = new WeakSet(), _DadsGlobalMenu_handleItemMutations = function _DadsGlobalMenu_handleItemMutations(mutations) {
    for (const mutation of mutations) {
        if (mutation.type !== 'attributes')
            continue;
        if (mutation.attributeName !== 'expanded')
            continue;
        if (!(mutation.target instanceof HTMLElement))
            continue;
        if (!mutation.target.localName.endsWith('-global-menu-item'))
            continue;
        const targetItem = mutation.target;
        if (targetItem.hasAttribute('expanded')) {
            __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_enforceSingleExpanded).call(this, targetItem);
        }
    }
}, _DadsGlobalMenu_handleKeydown = function _DadsGlobalMenu_handleKeydown(event) {
    // サブメニュー側（menu-list-box）がすでに処理したキー操作は再処理しない。
    if (event.defaultPrevented)
        return;
    if (__classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_isEventFromSubmenu).call(this, event))
        return;
    if (event.key !== Keys.arrowLeft &&
        event.key !== Keys.arrowRight &&
        event.key !== Keys.home &&
        event.key !== Keys.end) {
        return;
    }
    const entries = __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItemEntries).call(this);
    if (entries.length === 0)
        return;
    const currentTarget = __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_resolveCurrentTarget).call(this, entries, event);
    if (!currentTarget)
        return;
    const selection = new ElementSelection(entries.map((entry) => entry.target), currentTarget);
    selection.processKey(event, (target) => {
        this.closeAllSubmenus();
        target.focus();
    }, {
        orientation: Orientation.horizontal,
        wrap: true,
        preventDefaultHomeEnd: true,
    });
}, _DadsGlobalMenu_isEventFromSubmenu = function _DadsGlobalMenu_isEventFromSubmenu(event) {
    const path = event.composedPath();
    for (const node of path) {
        if (node === this)
            break;
        if (!(node instanceof HTMLElement))
            continue;
        if (node.localName.endsWith('-menu-list-box'))
            return true;
    }
    return false;
}, _DadsGlobalMenu_resolveCurrentTarget = function _DadsGlobalMenu_resolveCurrentTarget(entries, event) {
    const path = event.composedPath();
    for (const entry of entries) {
        if (path.includes(entry.target) || path.includes(entry.item))
            return entry.target;
    }
    const active = document.activeElement;
    if (!active)
        return null;
    for (const entry of entries) {
        if (active === entry.target || active === entry.item)
            return entry.target;
    }
    return null;
}, _DadsGlobalMenu_syncItems = function _DadsGlobalMenu_syncItems() {
    const items = __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItems).call(this);
    for (const item of items) {
        item.setAttribute('role', 'listitem');
    }
    __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_enforceSingleExpanded).call(this);
}, _DadsGlobalMenu_getItems = function _DadsGlobalMenu_getItems() {
    const items = [];
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.getAttribute('slot'))
            continue;
        if (!child.localName.endsWith('-global-menu-item'))
            continue;
        items.push(child);
    }
    return items;
}, _DadsGlobalMenu_getItemEntries = function _DadsGlobalMenu_getItemEntries() {
    const entries = [];
    for (const item of __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItems).call(this)) {
        const target = __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItemFocusTarget).call(this, item);
        if (!target)
            continue;
        entries.push({ item, target });
    }
    return entries;
}, _DadsGlobalMenu_getItemFocusTarget = function _DadsGlobalMenu_getItemFocusTarget(item) {
    if (typeof item.getFocusTarget === 'function') {
        const target = item.getFocusTarget();
        if (target)
            return target;
    }
    return item;
}, _DadsGlobalMenu_closeItemSubmenu = function _DadsGlobalMenu_closeItemSubmenu(item) {
    if (typeof item.closeSubmenu === 'function') {
        item.closeSubmenu();
        return;
    }
    item.removeAttribute('expanded');
}, _DadsGlobalMenu_enforceSingleExpanded = function _DadsGlobalMenu_enforceSingleExpanded(preferredItem) {
    const items = __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_getItems).call(this);
    const expandedItems = items.filter((item) => item.hasAttribute('expanded'));
    if (expandedItems.length <= 1)
        return;
    const keep = preferredItem && preferredItem.hasAttribute('expanded')
        ? preferredItem
        : expandedItems[0];
    for (const item of expandedItems) {
        if (item === keep)
            continue;
        __classPrivateFieldGet(this, _DadsGlobalMenu_instances, "m", _DadsGlobalMenu_closeItemSubmenu).call(this, item);
    }
};
DadsGlobalMenu.definition = {
    name: 'dads-global-menu',
    template: html `
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
    constructor() {
        super(...arguments);
        _DadsGlobalMenuItem_instances.add(this);
        _DadsGlobalMenuItem_trigger.set(this, null);
        _DadsGlobalMenuItem_startIconSlot.set(this, null);
        _DadsGlobalMenuItem_subscriptions.set(this, []);
        _DadsGlobalMenuItem_submenuSubscriptions.set(this, []);
        _DadsGlobalMenuItem_childObserver.set(this, null);
        _DadsGlobalMenuItem_submenuOpenObserver.set(this, null);
        _DadsGlobalMenuItem_isRenderedAsLink.set(this, false);
        _DadsGlobalMenuItem_isSyncingExpanded.set(this, false);
        _DadsGlobalMenuItem_isSyncingSubmenuOpen.set(this, false);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncSubmenuSlotting).call(this);
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_renderTemplate).call(this, __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_shouldRenderAsLink).call(this, __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this)));
        if (!__classPrivateFieldGet(this, _DadsGlobalMenuItem_childObserver, "f")) {
            __classPrivateFieldSet(this, _DadsGlobalMenuItem_childObserver, new MutationObserver(() => {
                __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncStructure).call(this);
            }), "f");
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_childObserver, "f").observe(this, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['slot'],
            });
        }
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncStructure).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_childObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_childObserver, null, "f");
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuOpenObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_submenuOpenObserver, null, "f");
        unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenuItem_subscriptions, "f"));
        unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuSubscriptions, "f"));
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'href') {
            const shouldRenderAsLink = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_shouldRenderAsLink).call(this, __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this));
            if (shouldRenderAsLink !== __classPrivateFieldGet(this, _DadsGlobalMenuItem_isRenderedAsLink, "f")) {
                __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_renderTemplate).call(this, shouldRenderAsLink);
            }
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncLinkAttributes).call(this);
            return;
        }
        if (name === 'target' || name === 'rel' || name === 'download') {
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncLinkAttributes).call(this);
            return;
        }
        if (name === 'current') {
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncCurrentState).call(this);
            return;
        }
        if (name === 'expanded') {
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncExpandedState).call(this);
        }
    }
    /**
     * 親コンポーネントがフォーカス対象を参照するためのAPI
     */
    getFocusTarget() {
        return __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f");
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f")?.focus(options);
    }
    openSubmenu() {
        if (!__classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this))
            return;
        this.setAttribute('expanded', '');
    }
    closeSubmenu() {
        this.removeAttribute('expanded');
    }
    toggleSubmenu() {
        if (!__classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this))
            return;
        if (this.hasAttribute('expanded'))
            this.closeSubmenu();
        else
            this.openSubmenu();
    }
}
_DadsGlobalMenuItem_trigger = new WeakMap(), _DadsGlobalMenuItem_startIconSlot = new WeakMap(), _DadsGlobalMenuItem_subscriptions = new WeakMap(), _DadsGlobalMenuItem_submenuSubscriptions = new WeakMap(), _DadsGlobalMenuItem_childObserver = new WeakMap(), _DadsGlobalMenuItem_submenuOpenObserver = new WeakMap(), _DadsGlobalMenuItem_isRenderedAsLink = new WeakMap(), _DadsGlobalMenuItem_isSyncingExpanded = new WeakMap(), _DadsGlobalMenuItem_isSyncingSubmenuOpen = new WeakMap(), _DadsGlobalMenuItem_instances = new WeakSet(), _DadsGlobalMenuItem_syncStructure = function _DadsGlobalMenuItem_syncStructure() {
    const hasSubmenu = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncSubmenuSlotting).call(this);
    const shouldRenderAsLink = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_shouldRenderAsLink).call(this, hasSubmenu);
    if (shouldRenderAsLink !== __classPrivateFieldGet(this, _DadsGlobalMenuItem_isRenderedAsLink, "f")) {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_renderTemplate).call(this, shouldRenderAsLink);
    }
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncStartIconVisibility).call(this);
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncCurrentState).call(this);
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncExpandedState).call(this);
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncLinkAttributes).call(this);
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncSubmenuBridge).call(this);
}, _DadsGlobalMenuItem_syncSubmenuSlotting = function _DadsGlobalMenuItem_syncSubmenuSlotting() {
    let hasSubmenu = false;
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (!child.localName.endsWith('-menu-list-box'))
            continue;
        hasSubmenu = true;
        if (!child.getAttribute('slot')) {
            child.setAttribute('slot', 'submenu');
        }
    }
    return hasSubmenu;
}, _DadsGlobalMenuItem_hasSubmenu = function _DadsGlobalMenuItem_hasSubmenu() {
    return __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_getSubmenu).call(this) !== null;
}, _DadsGlobalMenuItem_shouldRenderAsLink = function _DadsGlobalMenuItem_shouldRenderAsLink(hasSubmenu) {
    return !hasSubmenu && this.hasAttribute('href');
}, _DadsGlobalMenuItem_renderTemplate = function _DadsGlobalMenuItem_renderTemplate(isLink) {
    if (!this.shadowRoot)
        return;
    const template = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_createTemplate).call(this, isLink);
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_trigger, this.shadowRoot.querySelector('#trigger'), "f");
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_startIconSlot, this.shadowRoot.querySelector('#start-icon-slot'), "f");
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_isRenderedAsLink, isLink, "f");
    unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenuItem_subscriptions, "f"));
    if (__classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f")) {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f"), 'click', (e) => __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_handleTriggerClick).call(this, e)), subscribe(__classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f"), 'keydown', (e) => __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_handleTriggerKeydown).call(this, e)));
    }
    if (__classPrivateFieldGet(this, _DadsGlobalMenuItem_startIconSlot, "f")) {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsGlobalMenuItem_startIconSlot, "f"), 'slotchange', () => __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncStartIconVisibility).call(this)));
    }
    const submenuSlot = this.shadowRoot.querySelector('#submenu-slot');
    if (submenuSlot) {
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_subscriptions, "f").push(subscribe(submenuSlot, 'slotchange', () => __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_syncStructure).call(this)));
    }
}, _DadsGlobalMenuItem_createTemplate = function _DadsGlobalMenuItem_createTemplate(isLink) {
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
}, _DadsGlobalMenuItem_handleTriggerClick = function _DadsGlobalMenuItem_handleTriggerClick(event) {
    if (!__classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this))
        return;
    event.preventDefault();
    this.toggleSubmenu();
}, _DadsGlobalMenuItem_handleTriggerKeydown = function _DadsGlobalMenuItem_handleTriggerKeydown(event) {
    if (!__classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_hasSubmenu).call(this))
        return;
    const submenu = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_getSubmenu).call(this);
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
            __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f")?.focus();
            break;
    }
}, _DadsGlobalMenuItem_syncCurrentState = function _DadsGlobalMenuItem_syncCurrentState() {
    const trigger = __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f");
    if (!trigger)
        return;
    if (this.hasAttribute('current')) {
        trigger.setAttribute('aria-current', 'page');
        return;
    }
    trigger.removeAttribute('aria-current');
}, _DadsGlobalMenuItem_syncExpandedState = function _DadsGlobalMenuItem_syncExpandedState() {
    const submenu = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_getSubmenu).call(this);
    const hasSubmenu = submenu !== null;
    if (!hasSubmenu && this.hasAttribute('expanded') && !__classPrivateFieldGet(this, _DadsGlobalMenuItem_isSyncingExpanded, "f")) {
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingExpanded, true, "f");
        this.removeAttribute('expanded');
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingExpanded, false, "f");
    }
    const isExpanded = hasSubmenu && this.hasAttribute('expanded');
    const trigger = __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f");
    if (trigger) {
        if (hasSubmenu) {
            trigger.setAttribute('aria-haspopup', 'menu');
            trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
        else {
            trigger.removeAttribute('aria-haspopup');
            trigger.removeAttribute('aria-expanded');
        }
    }
    if (!submenu)
        return;
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_setSubmenuOpen).call(this, submenu, isExpanded);
}, _DadsGlobalMenuItem_syncLinkAttributes = function _DadsGlobalMenuItem_syncLinkAttributes() {
    const trigger = __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f");
    if (!(trigger instanceof HTMLAnchorElement))
        return;
    const href = this.getAttribute('href');
    trigger.setAttribute('href', href && isSafeHref(href) ? href : '#');
    const target = this.getAttribute('target');
    const rel = this.getAttribute('rel');
    const download = this.hasAttribute('download');
    if (target)
        trigger.setAttribute('target', target);
    else
        trigger.removeAttribute('target');
    if (rel)
        trigger.setAttribute('rel', rel);
    else
        trigger.removeAttribute('rel');
    if (download)
        trigger.setAttribute('download', '');
    else
        trigger.removeAttribute('download');
}, _DadsGlobalMenuItem_syncStartIconVisibility = function _DadsGlobalMenuItem_syncStartIconVisibility() {
    const slot = __classPrivateFieldGet(this, _DadsGlobalMenuItem_startIconSlot, "f");
    if (!slot)
        return;
    let hasStartIcon = false;
    const nodes = slot.assignedNodes({ flatten: true });
    for (const node of nodes) {
        if (!isMeaningfulNode(node))
            continue;
        hasStartIcon = true;
        break;
    }
    this.toggleAttribute('data-has-start-icon', hasStartIcon);
}, _DadsGlobalMenuItem_syncSubmenuBridge = function _DadsGlobalMenuItem_syncSubmenuBridge() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuSubscriptions, "f"));
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuOpenObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_submenuOpenObserver, null, "f");
    const submenu = __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_getSubmenu).call(this);
    this.toggleAttribute('data-has-submenu', submenu !== null);
    if (!submenu) {
        return;
    }
    submenu.setAttribute('opener-hidden', '');
    submenu.setFocusReturnTarget?.(__classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f"));
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_instances, "m", _DadsGlobalMenuItem_setSubmenuOpen).call(this, submenu, this.hasAttribute('expanded'));
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuSubscriptions, "f").push(subscribe(submenu, 'menuitemselect', () => {
        this.closeSubmenu();
        __classPrivateFieldGet(this, _DadsGlobalMenuItem_trigger, "f")?.focus();
    }));
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_submenuOpenObserver, new MutationObserver(() => {
        if (__classPrivateFieldGet(this, _DadsGlobalMenuItem_isSyncingSubmenuOpen, "f"))
            return;
        const isOpen = submenu.hasAttribute('open');
        if (isOpen === this.hasAttribute('expanded'))
            return;
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingExpanded, true, "f");
        if (isOpen)
            this.setAttribute('expanded', '');
        else
            this.removeAttribute('expanded');
        __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingExpanded, false, "f");
    }), "f");
    __classPrivateFieldGet(this, _DadsGlobalMenuItem_submenuOpenObserver, "f").observe(submenu, {
        attributes: true,
        attributeFilter: ['open'],
    });
}, _DadsGlobalMenuItem_setSubmenuOpen = function _DadsGlobalMenuItem_setSubmenuOpen(submenu, isOpen) {
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingSubmenuOpen, true, "f");
    if (isOpen)
        submenu.setAttribute('open', '');
    else
        submenu.removeAttribute('open');
    __classPrivateFieldSet(this, _DadsGlobalMenuItem_isSyncingSubmenuOpen, false, "f");
}, _DadsGlobalMenuItem_getSubmenu = function _DadsGlobalMenuItem_getSubmenu() {
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.getAttribute('slot') !== 'submenu')
            continue;
        if (!child.localName.endsWith('-menu-list-box'))
            continue;
        return child;
    }
    return null;
};
DadsGlobalMenuItem.definition = {
    name: 'dads-global-menu-item',
    template: html `
      <button part="trigger" id="trigger" type="button">
        ${itemInnerHtml}
      </button>
      <slot name="submenu" id="submenu-slot"></slot>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), globalMenuTokens, globalMenuItemStyles], 'minimal'),
    attributes: [
        BooleanAttr('current'),
        BooleanAttr('expanded'),
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('download'),
    ],
};
