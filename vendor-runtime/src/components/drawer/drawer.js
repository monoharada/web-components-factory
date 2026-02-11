/**
 * @module drawer
 * デジタル庁デザインシステム Drawer（ドロワー）コンポーネント
 * @version 1.0.0
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
var _DadsDrawer_instances, _DadsDrawer_base, _DadsDrawer_panel, _DadsDrawer_closeButton, _DadsDrawer_closeButtonLabel, _DadsDrawer_titleSlot, _DadsDrawer_subscriptions, _DadsDrawer_documentSubscriptions, _DadsDrawer_ignoreOpenAttrChange, _DadsDrawer_openState, _DadsDrawer_lastInvoker, _DadsDrawer_setupListeners, _DadsDrawer_handleBaseClick, _DadsDrawer_handleNativeCancel, _DadsDrawer_handleCloseButtonClick, _DadsDrawer_handleDadsCommand, _DadsDrawer_handleCommandEvent, _DadsDrawer_handleCommand, _DadsDrawer_requestOpen, _DadsDrawer_requestClose, _DadsDrawer_createEventDetail, _DadsDrawer_applyOpenState, _DadsDrawer_applyClosedState, _DadsDrawer_syncDocumentListeners, _DadsDrawer_handleDocumentKeyDown, _DadsDrawer_handleDocumentFocusIn, _DadsDrawer_isEventInsideDrawer, _DadsDrawer_isElementInsidePanel, _DadsDrawer_getDeepActiveElement, _DadsDrawer_focusInitialElement, _DadsDrawer_findInitialFocusElement, _DadsDrawer_getFocusableElements, _DadsDrawer_restoreFocusToInvoker, _DadsDrawer_captureViewportScroll, _DadsDrawer_restoreViewportScroll, _DadsDrawer_setOpenAttribute, _DadsDrawer_isOpen, _DadsDrawer_resolveInvoker, _DadsDrawer_syncCloseButtonLabel, _DadsDrawer_syncAccessibleName, _DadsDrawer_syncPlacement, _DadsDrawer_isPreviewContained;
import { BooleanAttr, PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { drawerTokens } from './drawer-tokens.js';
import { drawerStyles } from './drawer-styles.js';
function normalizePlacement(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (normalized === 'right')
        return 'right';
    return 'left';
}
function subscribe(el, type, listener, options) {
    el.addEventListener(type, listener, options);
    return () => el.removeEventListener(type, listener, options);
}
function unsubscribeAll(subscriptions) {
    for (const unsubscribe of subscriptions)
        unsubscribe();
    subscriptions.length = 0;
}
function hasSlotContent(slot) {
    if (!slot)
        return false;
    const nodes = slot.assignedNodes({ flatten: true });
    for (const node of nodes) {
        if (node.nodeType === Node.ELEMENT_NODE)
            return true;
        if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '')
            return true;
    }
    return false;
}
function isTabbable(el) {
    if (!(el instanceof HTMLElement))
        return false;
    if (el.hasAttribute('hidden'))
        return false;
    if (el.getAttribute('aria-hidden') === 'true')
        return false;
    if (el.matches(':disabled, [disabled], [aria-disabled="true"]'))
        return false;
    const tabIndexAttr = el.getAttribute('tabindex');
    const isNativeFocusable = el.matches('button,input,select,textarea,a[href],summary,iframe,[contenteditable="true"]');
    if (tabIndexAttr !== null) {
        const normalized = tabIndexAttr.trim();
        if (normalized === '')
            return true;
        const parsed = Number.parseInt(normalized, 10);
        return !Number.isNaN(parsed) && parsed >= 0;
    }
    return isNativeFocusable;
}
function focusWithoutScroll(target) {
    if (!target)
        return;
    try {
        target.focus({ preventScroll: true });
    }
    catch {
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
    constructor() {
        super(...arguments);
        _DadsDrawer_instances.add(this);
        _DadsDrawer_base.set(this, null);
        _DadsDrawer_panel.set(this, null);
        _DadsDrawer_closeButton.set(this, null);
        _DadsDrawer_closeButtonLabel.set(this, null);
        _DadsDrawer_titleSlot.set(this, null);
        _DadsDrawer_subscriptions.set(this, []);
        _DadsDrawer_documentSubscriptions.set(this, []);
        _DadsDrawer_ignoreOpenAttrChange.set(this, false);
        _DadsDrawer_openState.set(this, false);
        _DadsDrawer_lastInvoker.set(this, null);
        _DadsDrawer_handleBaseClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isOpen).call(this))
                return;
            const panel = __classPrivateFieldGet(this, _DadsDrawer_panel, "f");
            if (!panel)
                return;
            const path = event.composedPath();
            if (path.includes(panel))
                return;
            event.preventDefault();
            if (this.hasAttribute('light-dismiss')) {
                __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, {
                    reason: 'light-dismiss',
                    invoker: __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_resolveInvoker).call(this, null),
                    originalEvent: event,
                });
                return;
            }
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_focusInitialElement).call(this);
        });
        _DadsDrawer_handleNativeCancel.set(this, (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, { reason: 'escape', invoker: __classPrivateFieldGet(this, _DadsDrawer_lastInvoker, "f"), originalEvent: event });
        });
        _DadsDrawer_handleCloseButtonClick.set(this, (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, {
                reason: 'close-button',
                invoker: __classPrivateFieldGet(this, _DadsDrawer_closeButton, "f"),
                originalEvent: event,
            });
        });
        _DadsDrawer_handleDadsCommand.set(this, (event) => {
            if (event.target !== this)
                return;
            if (!(event instanceof CustomEvent))
                return;
            const detail = event.detail;
            const command = detail?.command?.trim() ?? '';
            if (command === '')
                return;
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_handleCommand).call(this, command, detail?.invoker ?? null, detail?.originalEvent ?? event);
        });
        _DadsDrawer_handleCommandEvent.set(this, (event) => {
            if (event.target !== this)
                return;
            const command = String(event.command ?? '').trim();
            if (command === '')
                return;
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_handleCommand).call(this, command, __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_resolveInvoker).call(this, null), event);
        });
        _DadsDrawer_handleDocumentKeyDown.set(this, (event) => {
            if (!(event instanceof KeyboardEvent))
                return;
            if (!__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isOpen).call(this))
                return;
            if (event.key === 'Escape') {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, { reason: 'escape', invoker: __classPrivateFieldGet(this, _DadsDrawer_lastInvoker, "f"), originalEvent: event });
                return;
            }
            if (event.key !== 'Tab')
                return;
            const focusables = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_getFocusableElements).call(this);
            if (focusables.length === 0) {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsDrawer_panel, "f")?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const [firstInPath] = typeof event.composedPath === 'function' ? event.composedPath() : [];
            const active = (firstInPath instanceof HTMLElement ? firstInPath : null) ?? __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_getDeepActiveElement).call(this);
            if (event.shiftKey) {
                if (active === first || !__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isElementInsidePanel).call(this, active)) {
                    event.preventDefault();
                    last.focus();
                }
                return;
            }
            if (active === last || !__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isElementInsidePanel).call(this, active)) {
                event.preventDefault();
                first.focus();
            }
        });
        _DadsDrawer_handleDocumentFocusIn.set(this, (event) => {
            if (!(event instanceof FocusEvent))
                return;
            if (!__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isOpen).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isEventInsideDrawer).call(this, event))
                return;
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_focusInitialElement).call(this);
        });
        _DadsDrawer_syncCloseButtonLabel.set(this, () => {
            const label = __classPrivateFieldGet(this, _DadsDrawer_closeButtonLabel, "f");
            if (!label)
                return;
            label.textContent = this.getAttribute('close-label')?.trim() || '閉じる';
        });
        _DadsDrawer_syncAccessibleName.set(this, () => {
            const base = __classPrivateFieldGet(this, _DadsDrawer_base, "f");
            if (!base)
                return;
            const explicitLabel = this.getAttribute('aria-label')?.trim() ?? '';
            const hasTitle = hasSlotContent(__classPrivateFieldGet(this, _DadsDrawer_titleSlot, "f"));
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
        });
        _DadsDrawer_syncPlacement.set(this, () => {
            const normalized = normalizePlacement(this.getAttribute('placement'));
            if (this.getAttribute('placement') !== normalized)
                this.setAttribute('placement', normalized);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsDrawer_base, this.shadowRoot?.querySelector('#base'), "f");
        __classPrivateFieldSet(this, _DadsDrawer_panel, this.shadowRoot?.querySelector('#panel'), "f");
        __classPrivateFieldSet(this, _DadsDrawer_closeButton, this.shadowRoot?.querySelector('#close-button'), "f");
        __classPrivateFieldSet(this, _DadsDrawer_closeButtonLabel, this.shadowRoot?.querySelector('#close-button-label'), "f");
        __classPrivateFieldSet(this, _DadsDrawer_titleSlot, this.shadowRoot?.querySelector('#title-slot'), "f");
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setupListeners).call(this);
        __classPrivateFieldGet(this, _DadsDrawer_syncPlacement, "f").call(this);
        __classPrivateFieldGet(this, _DadsDrawer_syncCloseButtonLabel, "f").call(this);
        __classPrivateFieldGet(this, _DadsDrawer_syncAccessibleName, "f").call(this);
        if (this.hasAttribute('open')) {
            const opened = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestOpen).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
            if (!opened)
                __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setOpenAttribute).call(this, false);
        }
        else {
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_applyClosedState).call(this, { restoreFocus: false });
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f"));
        unsubscribeAll(__classPrivateFieldGet(this, _DadsDrawer_documentSubscriptions, "f"));
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_applyClosedState).call(this, { restoreFocus: false });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'aria-label' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDrawer_syncAccessibleName, "f").call(this);
        if (name === 'placement' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDrawer_syncPlacement, "f").call(this);
        if (name === 'close-label' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDrawer_syncCloseButtonLabel, "f").call(this);
    }
    openChanged(_oldValue, newValue) {
        if (__classPrivateFieldGet(this, _DadsDrawer_ignoreOpenAttrChange, "f"))
            return;
        if (!this.isConnected || !__classPrivateFieldGet(this, _DadsDrawer_base, "f"))
            return;
        if (newValue !== null) {
            const opened = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestOpen).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
            if (!opened)
                __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setOpenAttribute).call(this, false);
            return;
        }
        const closed = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
        if (!closed)
            __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setOpenAttribute).call(this, true);
    }
    show() {
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestOpen).call(this, { reason: 'programmatic', invoker: null, originalEvent: null });
    }
    close() {
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, { reason: 'programmatic', invoker: null, originalEvent: null });
    }
}
_DadsDrawer_base = new WeakMap(), _DadsDrawer_panel = new WeakMap(), _DadsDrawer_closeButton = new WeakMap(), _DadsDrawer_closeButtonLabel = new WeakMap(), _DadsDrawer_titleSlot = new WeakMap(), _DadsDrawer_subscriptions = new WeakMap(), _DadsDrawer_documentSubscriptions = new WeakMap(), _DadsDrawer_ignoreOpenAttrChange = new WeakMap(), _DadsDrawer_openState = new WeakMap(), _DadsDrawer_lastInvoker = new WeakMap(), _DadsDrawer_handleBaseClick = new WeakMap(), _DadsDrawer_handleNativeCancel = new WeakMap(), _DadsDrawer_handleCloseButtonClick = new WeakMap(), _DadsDrawer_handleDadsCommand = new WeakMap(), _DadsDrawer_handleCommandEvent = new WeakMap(), _DadsDrawer_handleDocumentKeyDown = new WeakMap(), _DadsDrawer_handleDocumentFocusIn = new WeakMap(), _DadsDrawer_syncCloseButtonLabel = new WeakMap(), _DadsDrawer_syncAccessibleName = new WeakMap(), _DadsDrawer_syncPlacement = new WeakMap(), _DadsDrawer_instances = new WeakSet(), _DadsDrawer_setupListeners = function _DadsDrawer_setupListeners() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f"));
    if (__classPrivateFieldGet(this, _DadsDrawer_base, "f")) {
        __classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDrawer_base, "f"), 'click', __classPrivateFieldGet(this, _DadsDrawer_handleBaseClick, "f")), subscribe(__classPrivateFieldGet(this, _DadsDrawer_base, "f"), 'cancel', __classPrivateFieldGet(this, _DadsDrawer_handleNativeCancel, "f")));
    }
    if (__classPrivateFieldGet(this, _DadsDrawer_closeButton, "f")) {
        __classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDrawer_closeButton, "f"), 'click', __classPrivateFieldGet(this, _DadsDrawer_handleCloseButtonClick, "f")));
    }
    if (__classPrivateFieldGet(this, _DadsDrawer_titleSlot, "f")) {
        __classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDrawer_titleSlot, "f"), 'slotchange', __classPrivateFieldGet(this, _DadsDrawer_syncAccessibleName, "f")));
    }
    __classPrivateFieldGet(this, _DadsDrawer_subscriptions, "f").push(subscribe(this, 'dads-command', __classPrivateFieldGet(this, _DadsDrawer_handleDadsCommand, "f")), subscribe(this, 'command', __classPrivateFieldGet(this, _DadsDrawer_handleCommandEvent, "f")));
}, _DadsDrawer_handleCommand = function _DadsDrawer_handleCommand(command, invoker, originalEvent) {
    if (command === 'show-modal' || command === 'open') {
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestOpen).call(this, { reason: 'command', invoker, originalEvent });
        return;
    }
    if (command === 'close' || command === 'request-close') {
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_requestClose).call(this, { reason: 'command', invoker, originalEvent });
    }
}, _DadsDrawer_requestOpen = function _DadsDrawer_requestOpen(context) {
    if (__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isOpen).call(this))
        return true;
    const invoker = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_resolveInvoker).call(this, context.invoker);
    const beforeDetail = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_createEventDetail).call(this, context, invoker, invoker);
    const beforeEvent = new CustomEvent('dads-drawer-before-open', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent))
        return false;
    __classPrivateFieldSet(this, _DadsDrawer_lastInvoker, invoker, "f");
    __classPrivateFieldGet(this, _DadsDrawer_syncAccessibleName, "f").call(this);
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_applyOpenState).call(this);
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setOpenAttribute).call(this, true);
    const afterDetail = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_createEventDetail).call(this, context, invoker);
    this.dispatchEvent(new CustomEvent('dads-drawer-open', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
    }));
    return true;
}, _DadsDrawer_requestClose = function _DadsDrawer_requestClose(context) {
    if (!__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isOpen).call(this))
        return true;
    const invoker = context.invoker ?? __classPrivateFieldGet(this, _DadsDrawer_lastInvoker, "f");
    const beforeDetail = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_createEventDetail).call(this, context, invoker);
    const beforeEvent = new CustomEvent('dads-drawer-before-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent))
        return false;
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_applyClosedState).call(this, { restoreFocus: true });
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_setOpenAttribute).call(this, false);
    const afterDetail = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_createEventDetail).call(this, context, invoker);
    this.dispatchEvent(new CustomEvent('dads-drawer-close', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
    }));
    return true;
}, _DadsDrawer_createEventDetail = function _DadsDrawer_createEventDetail(context, invoker, returnFocusTo = __classPrivateFieldGet(this, _DadsDrawer_lastInvoker, "f")) {
    return {
        reason: context.reason,
        invoker,
        originalEvent: context.originalEvent,
        returnFocusTo,
    };
}, _DadsDrawer_applyOpenState = function _DadsDrawer_applyOpenState() {
    const base = __classPrivateFieldGet(this, _DadsDrawer_base, "f");
    if (!base)
        return;
    const preservedScroll = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_captureViewportScroll).call(this);
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_syncDocumentListeners).call(this, true);
    if (__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isPreviewContained).call(this) && typeof base.show === 'function') {
        try {
            if (!base.open)
                base.show();
        }
        catch {
            base.setAttribute('open', '');
        }
    }
    else if (typeof base.showModal === 'function') {
        try {
            if (!base.open)
                base.showModal();
        }
        catch {
            base.setAttribute('open', '');
        }
    }
    else {
        base.setAttribute('open', '');
    }
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_restoreViewportScroll).call(this, preservedScroll);
    __classPrivateFieldSet(this, _DadsDrawer_openState, true, "f");
    queueMicrotask(() => {
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_restoreViewportScroll).call(this, preservedScroll);
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_focusInitialElement).call(this);
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_restoreViewportScroll).call(this, preservedScroll);
        requestAnimationFrame(() => __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_restoreViewportScroll).call(this, preservedScroll));
    });
}, _DadsDrawer_applyClosedState = function _DadsDrawer_applyClosedState(options) {
    const base = __classPrivateFieldGet(this, _DadsDrawer_base, "f");
    __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_syncDocumentListeners).call(this, false);
    if (base) {
        if (typeof base.close === 'function') {
            try {
                if (base.open)
                    base.close();
                else
                    base.removeAttribute('open');
            }
            catch {
                base.removeAttribute('open');
            }
        }
        else {
            base.removeAttribute('open');
        }
    }
    __classPrivateFieldSet(this, _DadsDrawer_openState, false, "f");
    if (options.restoreFocus)
        __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_restoreFocusToInvoker).call(this);
}, _DadsDrawer_syncDocumentListeners = function _DadsDrawer_syncDocumentListeners(isOpen) {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsDrawer_documentSubscriptions, "f"));
    if (!isOpen || __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isPreviewContained).call(this))
        return;
    __classPrivateFieldGet(this, _DadsDrawer_documentSubscriptions, "f").push(subscribe(document, 'keydown', __classPrivateFieldGet(this, _DadsDrawer_handleDocumentKeyDown, "f"), true), subscribe(document, 'focusin', __classPrivateFieldGet(this, _DadsDrawer_handleDocumentFocusIn, "f"), true));
}, _DadsDrawer_isEventInsideDrawer = function _DadsDrawer_isEventInsideDrawer(event) {
    const base = __classPrivateFieldGet(this, _DadsDrawer_base, "f");
    if (!base)
        return false;
    const path = event.composedPath();
    return path.includes(base) || path.includes(this);
}, _DadsDrawer_isElementInsidePanel = function _DadsDrawer_isElementInsidePanel(element) {
    const panel = __classPrivateFieldGet(this, _DadsDrawer_panel, "f");
    if (!panel || !element)
        return false;
    if (panel.contains(element))
        return true;
    let node = element;
    while (node) {
        if (node === panel)
            return true;
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
}, _DadsDrawer_getDeepActiveElement = function _DadsDrawer_getDeepActiveElement() {
    let active = this.shadowRoot?.activeElement ?? document.activeElement;
    while (active && active instanceof HTMLElement && active.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
}, _DadsDrawer_focusInitialElement = function _DadsDrawer_focusInitialElement() {
    const explicit = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_findInitialFocusElement).call(this);
    if (explicit) {
        focusWithoutScroll(explicit);
        return;
    }
    const focusables = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_getFocusableElements).call(this);
    const preferred = focusables.find((el) => el.hasAttribute('autofocus'));
    const target = preferred ?? focusables[0] ?? __classPrivateFieldGet(this, _DadsDrawer_panel, "f");
    focusWithoutScroll(target ?? null);
}, _DadsDrawer_findInitialFocusElement = function _DadsDrawer_findInitialFocusElement() {
    const candidates = Array.from(this.querySelectorAll('[data-drawer-initial-focus]'));
    if (candidates.length > 0)
        return candidates[0];
    return this.shadowRoot?.querySelector('[data-drawer-initial-focus]') ?? null;
}, _DadsDrawer_getFocusableElements = function _DadsDrawer_getFocusableElements() {
    const panel = __classPrivateFieldGet(this, _DadsDrawer_panel, "f");
    if (!panel)
        return [];
    const out = [];
    const visited = new Set();
    const visit = (node) => {
        for (const child of node.children) {
            if (visited.has(child))
                continue;
            visited.add(child);
            if (isTabbable(child))
                out.push(child);
            if (child instanceof HTMLSlotElement) {
                const assigned = child.assignedElements({ flatten: true });
                for (const assignedEl of assigned) {
                    if (visited.has(assignedEl))
                        continue;
                    visited.add(assignedEl);
                    if (isTabbable(assignedEl))
                        out.push(assignedEl);
                    if (assignedEl.shadowRoot)
                        visit(assignedEl.shadowRoot);
                    visit(assignedEl);
                }
            }
            if (child instanceof HTMLElement && child.shadowRoot)
                visit(child.shadowRoot);
            visit(child);
        }
    };
    visit(panel);
    visit(this);
    return out;
}, _DadsDrawer_restoreFocusToInvoker = function _DadsDrawer_restoreFocusToInvoker() {
    const invoker = __classPrivateFieldGet(this, _DadsDrawer_lastInvoker, "f");
    if (!invoker || !invoker.isConnected)
        return;
    focusWithoutScroll(invoker);
}, _DadsDrawer_captureViewportScroll = function _DadsDrawer_captureViewportScroll() {
    if (!__classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_isPreviewContained).call(this))
        return null;
    return {
        x: window.scrollX,
        y: window.scrollY,
    };
}, _DadsDrawer_restoreViewportScroll = function _DadsDrawer_restoreViewportScroll(position) {
    if (!position)
        return;
    if (window.scrollX === position.x && window.scrollY === position.y)
        return;
    window.scrollTo(position.x, position.y);
}, _DadsDrawer_setOpenAttribute = function _DadsDrawer_setOpenAttribute(isOpen) {
    if (this.hasAttribute('open') === isOpen)
        return;
    __classPrivateFieldSet(this, _DadsDrawer_ignoreOpenAttrChange, true, "f");
    this.toggleAttribute('open', isOpen);
    __classPrivateFieldSet(this, _DadsDrawer_ignoreOpenAttrChange, false, "f");
}, _DadsDrawer_isOpen = function _DadsDrawer_isOpen() {
    return __classPrivateFieldGet(this, _DadsDrawer_openState, "f");
}, _DadsDrawer_resolveInvoker = function _DadsDrawer_resolveInvoker(invoker) {
    if (invoker instanceof HTMLElement)
        return invoker;
    const active = __classPrivateFieldGet(this, _DadsDrawer_instances, "m", _DadsDrawer_getDeepActiveElement).call(this);
    return active instanceof HTMLElement ? active : null;
}, _DadsDrawer_isPreviewContained = function _DadsDrawer_isPreviewContained() {
    return this.hasAttribute('data-preview-contained');
};
DadsDrawer.definition = {
    name: 'dads-drawer',
    template: html `
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
    styles: withReset([applyDADSTokens(), applySpacingTokens(), drawerTokens, drawerStyles, applyDADSFocusStyles()], 'minimal'),
    attributes: [
        BooleanAttr('open'),
        PropertyAttr('placement'),
        PropertyAttr('close-label'),
        PropertyAttr('aria-label'),
        BooleanAttr('light-dismiss'),
        { attribute: 'data-preview-contained' },
    ],
};
