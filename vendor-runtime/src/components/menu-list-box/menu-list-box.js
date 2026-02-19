/**
 * @module menu-list-box
 * デジタル庁デザインシステム Menu List Box
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
var _DadsMenuListBox_instances, _DadsMenuListBox_opener, _DadsMenuListBox_popup, _DadsMenuListBox_menu, _DadsMenuListBox_iconSlot, _DadsMenuListBox_itemsSlot, _DadsMenuListBox_labelFallback, _DadsMenuListBox_subscriptions, _DadsMenuListBox_documentSubscriptions, _DadsMenuListBox_menuItemSubscriptions, _DadsMenuListBox_focusReturnTarget, _DadsMenuListBox_setupEventListeners, _DadsMenuListBox_syncDocumentListeners, _DadsMenuListBox_isEventInside, _DadsMenuListBox_isEventOnFocusReturnTarget, _DadsMenuListBox_handleOpenerClick, _DadsMenuListBox_handleOpenerKeydown, _DadsMenuListBox_handleMenuKeydown, _DadsMenuListBox_handleClickOutside, _DadsMenuListBox_handleFocusIn, _DadsMenuListBox_handleEscape, _DadsMenuListBox_syncLabel, _DadsMenuListBox_syncOpenerIconVisibility, _DadsMenuListBox_syncOpenState, _DadsMenuListBox_syncMenuItems, _DadsMenuListBox_syncDividers, _DadsMenuListBox_syncPopupScrollState, _DadsMenuListBox_getMenuItemEntries, _DadsMenuListBox_isDividerElement, _DadsMenuListBox_getMenuItemTarget, _DadsMenuListBox_currentIndex, _DadsMenuListBox_focusItem, _DadsMenuListBox_selectMenuItem, _DadsMenuListBox_isOpen, _DadsMenuListBox_getFocusReturnTarget;
import { html, PropertyAttr, BooleanAttr, ElementSelection } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { menuListBoxTokens } from './menu-list-box-tokens.js';
import { menuListBoxStyles } from './menu-list-box-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
function subscribe(el, type, listener, options) {
    el.addEventListener(type, listener, options);
    return () => el.removeEventListener(type, listener, options);
}
function unsubscribeAll(subscriptions) {
    for (const unsubscribe of subscriptions)
        unsubscribe();
    subscriptions.length = 0;
}
function getDeepActiveElement(root = document) {
    let active = root.activeElement instanceof Element ? root.activeElement : null;
    while (active && active.shadowRoot?.activeElement instanceof Element) {
        active = active.shadowRoot.activeElement;
    }
    return active;
}
function isUnsupportedFocusWithinSelectorError(error) {
    return error instanceof DOMException && error.name === 'SyntaxError';
}
function isFocusWithin(host) {
    try {
        return host.matches(':focus-within');
    }
    catch (error) {
        if (isUnsupportedFocusWithinSelectorError(error))
            return false;
        throw error;
    }
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
 * @attr {boolean} opener-hidden - opener を非表示にして外部トリガー連携する
 *
 * @fires menuitemselect - 項目選択時に発火（detail: { selectedItem, selectedValue, selectedIndex }）
 */
export class DadsMenuListBox extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsMenuListBox_instances.add(this);
        _DadsMenuListBox_opener.set(this, null);
        _DadsMenuListBox_popup.set(this, null);
        _DadsMenuListBox_menu.set(this, null);
        _DadsMenuListBox_iconSlot.set(this, null);
        _DadsMenuListBox_itemsSlot.set(this, null);
        _DadsMenuListBox_labelFallback.set(this, null);
        _DadsMenuListBox_subscriptions.set(this, []);
        _DadsMenuListBox_documentSubscriptions.set(this, []);
        _DadsMenuListBox_menuItemSubscriptions.set(this, []);
        _DadsMenuListBox_focusReturnTarget.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, {
            size: 'sm',
            variant: 'text',
        });
        __classPrivateFieldSet(this, _DadsMenuListBox_opener, this.shadowRoot?.querySelector('#opener'), "f");
        __classPrivateFieldSet(this, _DadsMenuListBox_popup, this.shadowRoot?.querySelector('#popup'), "f");
        __classPrivateFieldSet(this, _DadsMenuListBox_menu, this.shadowRoot?.querySelector('#menu'), "f");
        __classPrivateFieldSet(this, _DadsMenuListBox_iconSlot, this.shadowRoot?.querySelector('#icon-slot'), "f");
        __classPrivateFieldSet(this, _DadsMenuListBox_itemsSlot, this.shadowRoot?.querySelector('#items-slot'), "f");
        __classPrivateFieldSet(this, _DadsMenuListBox_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncLabel).call(this);
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncOpenerIconVisibility).call(this);
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncOpenState).call(this, this.hasAttribute('open'));
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncMenuItems).call(this);
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncPopupScrollState).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f"));
        unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_documentSubscriptions, "f"));
        unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_menuItemSubscriptions, "f"));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'label') {
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncLabel).call(this);
            return;
        }
        if (name === 'open') {
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncOpenState).call(this, newValue !== null);
            return;
        }
        if (name === 'opener-hidden') {
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_setupEventListeners).call(this);
            return;
        }
    }
    toggleMenu() {
        if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
            this.closeMenu();
        else
            this.openMenu();
    }
    openMenu() {
        this.setAttribute('open', '');
    }
    closeMenu() {
        this.removeAttribute('open');
    }
    /**
     * メニューを閉じたあとのフォーカス復帰先を指定する
     */
    setFocusReturnTarget(target) {
        __classPrivateFieldSet(this, _DadsMenuListBox_focusReturnTarget, target, "f");
    }
    focusFirstMenuItem() {
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, 0);
    }
    focusLastMenuItem() {
        const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
        if (entries.length === 0)
            return;
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, entries.length - 1);
    }
    focusNextMenuItem() {
        const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
        if (entries.length === 0)
            return;
        const current = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_currentIndex).call(this, entries);
        if (current >= entries.length - 1)
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, 0);
        else
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, current + 1);
    }
    focusPreviousMenuItem() {
        const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
        if (entries.length === 0)
            return;
        const current = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_currentIndex).call(this, entries);
        if (current <= 0)
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, entries.length - 1);
        else
            __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, current - 1);
    }
}
_DadsMenuListBox_opener = new WeakMap(), _DadsMenuListBox_popup = new WeakMap(), _DadsMenuListBox_menu = new WeakMap(), _DadsMenuListBox_iconSlot = new WeakMap(), _DadsMenuListBox_itemsSlot = new WeakMap(), _DadsMenuListBox_labelFallback = new WeakMap(), _DadsMenuListBox_subscriptions = new WeakMap(), _DadsMenuListBox_documentSubscriptions = new WeakMap(), _DadsMenuListBox_menuItemSubscriptions = new WeakMap(), _DadsMenuListBox_focusReturnTarget = new WeakMap(), _DadsMenuListBox_instances = new WeakSet(), _DadsMenuListBox_setupEventListeners = function _DadsMenuListBox_setupEventListeners() {
    const opener = __classPrivateFieldGet(this, _DadsMenuListBox_opener, "f");
    const menu = __classPrivateFieldGet(this, _DadsMenuListBox_menu, "f");
    const iconSlot = __classPrivateFieldGet(this, _DadsMenuListBox_iconSlot, "f");
    const itemsSlot = __classPrivateFieldGet(this, _DadsMenuListBox_itemsSlot, "f");
    const isOpenerHidden = this.hasAttribute('opener-hidden');
    unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f"));
    if (!menu)
        return;
    if (opener && !isOpenerHidden) {
        __classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f").push(subscribe(opener, 'click', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleOpenerClick).call(this, e)), subscribe(opener, 'keydown', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleOpenerKeydown).call(this, e)));
    }
    __classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f").push(subscribe(menu, 'keydown', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleMenuKeydown).call(this, e)));
    if (iconSlot) {
        __classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f").push(subscribe(iconSlot, 'slotchange', () => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncOpenerIconVisibility).call(this)));
    }
    if (itemsSlot) {
        __classPrivateFieldGet(this, _DadsMenuListBox_subscriptions, "f").push(subscribe(itemsSlot, 'slotchange', () => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncMenuItems).call(this)));
    }
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncDocumentListeners).call(this, __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this));
}, _DadsMenuListBox_syncDocumentListeners = function _DadsMenuListBox_syncDocumentListeners(isOpen) {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_documentSubscriptions, "f"));
    if (!isOpen)
        return;
    __classPrivateFieldGet(this, _DadsMenuListBox_documentSubscriptions, "f").push(subscribe(document, 'click', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleClickOutside).call(this, e)), subscribe(document, 'keydown', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleEscape).call(this, e)), subscribe(document, 'focusin', (e) => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_handleFocusIn).call(this, e), true));
}, _DadsMenuListBox_isEventInside = function _DadsMenuListBox_isEventInside(event) {
    const path = event.composedPath();
    return path.includes(this);
}, _DadsMenuListBox_isEventOnFocusReturnTarget = function _DadsMenuListBox_isEventOnFocusReturnTarget(event) {
    const focusReturnTarget = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getFocusReturnTarget).call(this);
    if (!focusReturnTarget)
        return false;
    return event.composedPath().includes(focusReturnTarget);
}, _DadsMenuListBox_handleOpenerClick = function _DadsMenuListBox_handleOpenerClick(event) {
    event.preventDefault();
    this.toggleMenu();
    if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        this.focusFirstMenuItem();
}, _DadsMenuListBox_handleOpenerKeydown = function _DadsMenuListBox_handleOpenerKeydown(event) {
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
}, _DadsMenuListBox_handleMenuKeydown = function _DadsMenuListBox_handleMenuKeydown(event) {
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        return;
    const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
    if (entries.length === 0)
        return;
    const currentIndex = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_currentIndex).call(this, entries);
    const currentTarget = entries[currentIndex >= 0 ? currentIndex : 0].target;
    const targets = entries.map((entry) => entry.target);
    const targetIndex = new Map();
    for (let i = 0; i < targets.length; i += 1) {
        targetIndex.set(targets[i], i);
    }
    const selection = new ElementSelection(targets, currentTarget);
    selection.processKey(event, (target) => {
        const index = targetIndex.get(target);
        if (index === undefined)
            return;
        __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_focusItem).call(this, index);
    }, {
        wrap: true,
        preventDefaultHomeEnd: true,
    });
}, _DadsMenuListBox_handleClickOutside = function _DadsMenuListBox_handleClickOutside(event) {
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        return;
    if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isEventInside).call(this, event))
        return;
    if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isEventOnFocusReturnTarget).call(this, event))
        return;
    this.closeMenu();
}, _DadsMenuListBox_handleFocusIn = function _DadsMenuListBox_handleFocusIn(event) {
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        return;
    if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isEventInside).call(this, event))
        return;
    if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isEventOnFocusReturnTarget).call(this, event))
        return;
    this.closeMenu();
}, _DadsMenuListBox_handleEscape = function _DadsMenuListBox_handleEscape(event) {
    if (event.key !== 'Escape')
        return;
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        return;
    event.preventDefault();
    this.closeMenu();
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getFocusReturnTarget).call(this)?.focus();
}, _DadsMenuListBox_syncLabel = function _DadsMenuListBox_syncLabel() {
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_labelFallback, "f"))
        return;
    __classPrivateFieldGet(this, _DadsMenuListBox_labelFallback, "f").textContent = this.getAttribute('label') ?? '';
}, _DadsMenuListBox_syncOpenerIconVisibility = function _DadsMenuListBox_syncOpenerIconVisibility() {
    const slot = __classPrivateFieldGet(this, _DadsMenuListBox_iconSlot, "f");
    if (!slot)
        return;
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
}, _DadsMenuListBox_syncOpenState = function _DadsMenuListBox_syncOpenState(isOpen) {
    const opener = __classPrivateFieldGet(this, _DadsMenuListBox_opener, "f");
    const popup = __classPrivateFieldGet(this, _DadsMenuListBox_popup, "f");
    if (!popup)
        return;
    popup.hidden = !isOpen;
    opener?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncDocumentListeners).call(this, isOpen);
    if (!isOpen) {
        this.removeAttribute('data-has-popup-scrollbar');
        return;
    }
    // Wait for layout to settle before measuring.
    queueMicrotask(() => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncPopupScrollState).call(this));
}, _DadsMenuListBox_syncMenuItems = function _DadsMenuListBox_syncMenuItems() {
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncDividers).call(this);
    const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
    unsubscribeAll(__classPrivateFieldGet(this, _DadsMenuListBox_menuItemSubscriptions, "f"));
    let hasAnyStartIcon = false;
    for (const { host } of entries) {
        if (!host.localName.endsWith('-menu-list-item'))
            continue;
        if (host.querySelector('[slot="start-icon"]') !== null) {
            hasAnyStartIcon = true;
            break;
        }
    }
    this.toggleAttribute('data-reserve-item-start-icon-space', hasAnyStartIcon);
    for (const [index, entry] of entries.entries()) {
        const { host, target } = entry;
        target.setAttribute('role', 'menuitem');
        __classPrivateFieldGet(this, _DadsMenuListBox_menuItemSubscriptions, "f").push(subscribe(target, 'click', () => __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_selectMenuItem).call(this, host, target, index)));
    }
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_syncPopupScrollState).call(this);
}, _DadsMenuListBox_syncDividers = function _DadsMenuListBox_syncDividers() {
    const children = Array.from(this.children).filter((el) => el instanceof HTMLElement);
    for (const el of children) {
        if (el.getAttribute('slot'))
            continue;
        if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isDividerElement).call(this, el))
            continue;
        if (el.matches('dads-divider') && !el.hasAttribute('orientation')) {
            el.setAttribute('orientation', 'horizontal');
        }
        if (!el.matches('dads-divider')) {
            // Keep legacy divider markup resilient against global CSS resets.
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
}, _DadsMenuListBox_syncPopupScrollState = function _DadsMenuListBox_syncPopupScrollState() {
    if (!__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isOpen).call(this))
        return;
    const popup = __classPrivateFieldGet(this, _DadsMenuListBox_popup, "f");
    if (!popup)
        return;
    // In non-layout test environments, clientHeight/scrollHeight may be 0.
    if (popup.clientHeight === 0) {
        this.removeAttribute('data-has-popup-scrollbar');
        return;
    }
    const hasScrollbar = popup.scrollHeight > popup.clientHeight + 1;
    this.toggleAttribute('data-has-popup-scrollbar', hasScrollbar);
}, _DadsMenuListBox_getMenuItemEntries = function _DadsMenuListBox_getMenuItemEntries() {
    // Note: rely on light DOM children instead of slot assignment to support test environments
    // where slot distribution/slotchange are not fully implemented (e.g. happy-dom).
    const children = Array.from(this.children).filter((el) => el instanceof HTMLElement);
    const entries = [];
    for (const host of children) {
        if (host.getAttribute('slot'))
            continue;
        // Allow non-interactive content (e.g. dividers) inside the menu slot.
        if (__classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_isDividerElement).call(this, host))
            continue;
        const target = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemTarget).call(this, host);
        if (!target)
            continue;
        entries.push({ host, target });
    }
    return entries;
}, _DadsMenuListBox_isDividerElement = function _DadsMenuListBox_isDividerElement(el) {
    return el.matches('dads-divider, [data-menu-list-box-divider], hr, [role="separator"]');
}, _DadsMenuListBox_getMenuItemTarget = function _DadsMenuListBox_getMenuItemTarget(host) {
    const maybe = host;
    if (typeof maybe.getFocusTarget === 'function') {
        const target = maybe.getFocusTarget();
        if (target)
            return target;
    }
    return host;
}, _DadsMenuListBox_currentIndex = function _DadsMenuListBox_currentIndex(entries) {
    const active = getDeepActiveElement(document);
    return entries.findIndex(({ host, target }) => active === target || active === host || isFocusWithin(host));
}, _DadsMenuListBox_focusItem = function _DadsMenuListBox_focusItem(index) {
    const entries = __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getMenuItemEntries).call(this);
    if (index < 0 || index >= entries.length)
        return;
    for (const { target } of entries) {
        target.setAttribute('tabindex', '-1');
    }
    const entry = entries[index];
    entry.target.setAttribute('tabindex', '0');
    entry.target.focus();
}, _DadsMenuListBox_selectMenuItem = function _DadsMenuListBox_selectMenuItem(host, target, index) {
    const targetText = (target.textContent ?? '').trim();
    const hostText = (host.textContent ?? '').trim();
    const value = (host.getAttribute('value') ?? host.getAttribute('data-value') ?? targetText) || hostText;
    this.dispatchEvent(new CustomEvent('menuitemselect', {
        bubbles: true,
        composed: true,
        detail: {
            selectedItem: host,
            selectedValue: value,
            selectedIndex: index,
        },
    }));
    this.closeMenu();
    __classPrivateFieldGet(this, _DadsMenuListBox_instances, "m", _DadsMenuListBox_getFocusReturnTarget).call(this)?.focus();
}, _DadsMenuListBox_isOpen = function _DadsMenuListBox_isOpen() {
    return this.hasAttribute('open');
}, _DadsMenuListBox_getFocusReturnTarget = function _DadsMenuListBox_getFocusReturnTarget() {
    if (__classPrivateFieldGet(this, _DadsMenuListBox_focusReturnTarget, "f"))
        return __classPrivateFieldGet(this, _DadsMenuListBox_focusReturnTarget, "f");
    if (this.hasAttribute('opener-hidden'))
        return null;
    return __classPrivateFieldGet(this, _DadsMenuListBox_opener, "f");
};
DadsMenuListBox.definition = {
    name: 'dads-menu-list-box',
    template: html `
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
        BooleanAttr('opener-hidden'),
    ],
};
