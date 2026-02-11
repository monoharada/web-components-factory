/**
 * @module dialog
 * デジタル庁デザインシステム Dialog（モーダル）コンポーネント
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
var _DadsDialog_instances, _DadsDialog_base, _DadsDialog_panel, _DadsDialog_closeButton, _DadsDialog_closeButtonLabel, _DadsDialog_titleSlot, _DadsDialog_footerSlot, _DadsDialog_subscriptions, _DadsDialog_documentSubscriptions, _DadsDialog_ignoreOpenAttrChange, _DadsDialog_openState, _DadsDialog_lastInvoker, _DadsDialog_setupListeners, _DadsDialog_handleBaseClick, _DadsDialog_handleNativeCancel, _DadsDialog_handleCloseButtonClick, _DadsDialog_handleDadsCommand, _DadsDialog_handleCommandEvent, _DadsDialog_handleCommand, _DadsDialog_requestOpen, _DadsDialog_requestClose, _DadsDialog_createEventDetail, _DadsDialog_applyOpenState, _DadsDialog_applyClosedState, _DadsDialog_syncDocumentListeners, _DadsDialog_handleDocumentKeyDown, _DadsDialog_handleDocumentFocusIn, _DadsDialog_isEventInsideDialog, _DadsDialog_isElementInsidePanel, _DadsDialog_getDeepActiveElement, _DadsDialog_focusInitialElement, _DadsDialog_resolveInitialFocus, _DadsDialog_getTitleFocusTarget, _DadsDialog_findInitialFocusElement, _DadsDialog_getFocusableElements, _DadsDialog_restoreFocusToInvoker, _DadsDialog_setOpenAttribute, _DadsDialog_isOpen, _DadsDialog_resolveInvoker, _DadsDialog_syncCloseButtonVisibility, _DadsDialog_syncCloseButtonLabel, _DadsDialog_syncFooterVisibility, _DadsDialog_syncAccessibleName, _DadsDialog_syncSize, _DadsDialog_isPreviewContained;
import { BooleanAttr, PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { dialogTokens } from './dialog-tokens.js';
import { dialogStyles } from './dialog-styles.js';
function normalizeDialogSize(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (normalized === 's' || normalized === 'sm')
        return 's';
    if (normalized === 'l' || normalized === 'lg')
        return 'l';
    return 'm';
}
function normalizeInitialFocus(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (normalized === 'title')
        return 'title';
    return 'auto';
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
    constructor() {
        super(...arguments);
        _DadsDialog_instances.add(this);
        _DadsDialog_base.set(this, null);
        _DadsDialog_panel.set(this, null);
        _DadsDialog_closeButton.set(this, null);
        _DadsDialog_closeButtonLabel.set(this, null);
        _DadsDialog_titleSlot.set(this, null);
        _DadsDialog_footerSlot.set(this, null);
        _DadsDialog_subscriptions.set(this, []);
        _DadsDialog_documentSubscriptions.set(this, []);
        _DadsDialog_ignoreOpenAttrChange.set(this, false);
        _DadsDialog_openState.set(this, false);
        _DadsDialog_lastInvoker.set(this, null);
        _DadsDialog_handleBaseClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isOpen).call(this))
                return;
            const panel = __classPrivateFieldGet(this, _DadsDialog_panel, "f");
            if (!panel)
                return;
            const path = event.composedPath();
            if (path.includes(panel))
                return;
            // light dismiss 無効化
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_focusInitialElement).call(this);
        });
        _DadsDialog_handleNativeCancel.set(this, (event) => {
            // ネイティブの自動 close を抑止して、常にコンポーネントの close フローを通す
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, { reason: 'escape', invoker: __classPrivateFieldGet(this, _DadsDialog_lastInvoker, "f"), originalEvent: event });
        });
        _DadsDialog_handleCloseButtonClick.set(this, (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, {
                reason: 'close-button',
                invoker: __classPrivateFieldGet(this, _DadsDialog_closeButton, "f"),
                originalEvent: event,
            });
        });
        _DadsDialog_handleDadsCommand.set(this, (event) => {
            if (event.target !== this)
                return;
            if (!(event instanceof CustomEvent))
                return;
            const detail = event.detail;
            const command = detail?.command?.trim() ?? '';
            if (command === '')
                return;
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_handleCommand).call(this, command, detail?.invoker ?? null, detail?.originalEvent ?? event);
        });
        _DadsDialog_handleCommandEvent.set(this, (event) => {
            if (event.target !== this)
                return;
            const command = String(event.command ?? '').trim();
            if (command === '')
                return;
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_handleCommand).call(this, command, __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_resolveInvoker).call(this, null), event);
        });
        _DadsDialog_handleDocumentKeyDown.set(this, (event) => {
            if (!(event instanceof KeyboardEvent))
                return;
            if (!__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isOpen).call(this))
                return;
            if (event.key === 'Escape') {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, { reason: 'escape', invoker: __classPrivateFieldGet(this, _DadsDialog_lastInvoker, "f"), originalEvent: event });
                return;
            }
            if (event.key !== 'Tab')
                return;
            const focusables = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_getFocusableElements).call(this);
            if (focusables.length === 0) {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsDialog_panel, "f")?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const [firstInPath] = typeof event.composedPath === 'function' ? event.composedPath() : [];
            const active = (firstInPath instanceof HTMLElement ? firstInPath : null) ?? __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_getDeepActiveElement).call(this);
            if (event.shiftKey) {
                if (active === first || !__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isElementInsidePanel).call(this, active)) {
                    event.preventDefault();
                    last.focus();
                }
                return;
            }
            if (active === last || !__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isElementInsidePanel).call(this, active)) {
                event.preventDefault();
                first.focus();
            }
        });
        _DadsDialog_handleDocumentFocusIn.set(this, (event) => {
            if (!(event instanceof FocusEvent))
                return;
            if (!__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isOpen).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isEventInsideDialog).call(this, event))
                return;
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_focusInitialElement).call(this);
        });
        _DadsDialog_syncCloseButtonVisibility.set(this, () => {
            const button = __classPrivateFieldGet(this, _DadsDialog_closeButton, "f");
            if (!button)
                return;
            button.hidden = !this.hasAttribute('close-button');
        });
        _DadsDialog_syncCloseButtonLabel.set(this, () => {
            const label = __classPrivateFieldGet(this, _DadsDialog_closeButtonLabel, "f");
            if (!label)
                return;
            label.textContent = this.getAttribute('close-label')?.trim() || '閉じる';
        });
        _DadsDialog_syncFooterVisibility.set(this, () => {
            this.toggleAttribute('data-has-footer', hasSlotContent(__classPrivateFieldGet(this, _DadsDialog_footerSlot, "f")));
        });
        _DadsDialog_syncAccessibleName.set(this, () => {
            const base = __classPrivateFieldGet(this, _DadsDialog_base, "f");
            if (!base)
                return;
            const explicitLabel = this.getAttribute('aria-label')?.trim() ?? '';
            const hasTitle = hasSlotContent(__classPrivateFieldGet(this, _DadsDialog_titleSlot, "f"));
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
        });
        _DadsDialog_syncSize.set(this, () => {
            const normalized = normalizeDialogSize(this.getAttribute('size'));
            if (this.getAttribute('size') === normalized)
                return;
            this.setAttribute('size', normalized);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsDialog_base, this.shadowRoot?.querySelector('#base'), "f");
        __classPrivateFieldSet(this, _DadsDialog_panel, this.shadowRoot?.querySelector('#panel'), "f");
        __classPrivateFieldSet(this, _DadsDialog_closeButton, this.shadowRoot?.querySelector('#close-button'), "f");
        __classPrivateFieldSet(this, _DadsDialog_closeButtonLabel, this.shadowRoot?.querySelector('#close-button-label'), "f");
        __classPrivateFieldSet(this, _DadsDialog_titleSlot, this.shadowRoot?.querySelector('#title-slot'), "f");
        __classPrivateFieldSet(this, _DadsDialog_footerSlot, this.shadowRoot?.querySelector('#footer-slot'), "f");
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setupListeners).call(this);
        __classPrivateFieldGet(this, _DadsDialog_syncSize, "f").call(this);
        __classPrivateFieldGet(this, _DadsDialog_syncCloseButtonVisibility, "f").call(this);
        __classPrivateFieldGet(this, _DadsDialog_syncCloseButtonLabel, "f").call(this);
        __classPrivateFieldGet(this, _DadsDialog_syncFooterVisibility, "f").call(this);
        __classPrivateFieldGet(this, _DadsDialog_syncAccessibleName, "f").call(this);
        if (this.hasAttribute('open')) {
            const opened = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestOpen).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
            if (!opened)
                __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setOpenAttribute).call(this, false);
        }
        else {
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_applyClosedState).call(this, { restoreFocus: false });
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsDialog_subscriptions, "f"));
        unsubscribeAll(__classPrivateFieldGet(this, _DadsDialog_documentSubscriptions, "f"));
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_applyClosedState).call(this, { restoreFocus: false });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'aria-label' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDialog_syncAccessibleName, "f").call(this);
        if (name === 'size' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDialog_syncSize, "f").call(this);
        if (name === 'close-button' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDialog_syncCloseButtonVisibility, "f").call(this);
        if (name === 'close-label' && oldValue !== newValue)
            __classPrivateFieldGet(this, _DadsDialog_syncCloseButtonLabel, "f").call(this);
    }
    openChanged(_oldValue, newValue) {
        if (__classPrivateFieldGet(this, _DadsDialog_ignoreOpenAttrChange, "f"))
            return;
        if (!this.isConnected || !__classPrivateFieldGet(this, _DadsDialog_base, "f"))
            return;
        if (newValue !== null) {
            const opened = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestOpen).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
            if (!opened)
                __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setOpenAttribute).call(this, false);
            return;
        }
        const closed = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, { reason: 'attribute', invoker: null, originalEvent: null });
        if (!closed)
            __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setOpenAttribute).call(this, true);
    }
    show() {
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestOpen).call(this, { reason: 'programmatic', invoker: null, originalEvent: null });
    }
    close() {
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, { reason: 'programmatic', invoker: null, originalEvent: null });
    }
}
_DadsDialog_base = new WeakMap(), _DadsDialog_panel = new WeakMap(), _DadsDialog_closeButton = new WeakMap(), _DadsDialog_closeButtonLabel = new WeakMap(), _DadsDialog_titleSlot = new WeakMap(), _DadsDialog_footerSlot = new WeakMap(), _DadsDialog_subscriptions = new WeakMap(), _DadsDialog_documentSubscriptions = new WeakMap(), _DadsDialog_ignoreOpenAttrChange = new WeakMap(), _DadsDialog_openState = new WeakMap(), _DadsDialog_lastInvoker = new WeakMap(), _DadsDialog_handleBaseClick = new WeakMap(), _DadsDialog_handleNativeCancel = new WeakMap(), _DadsDialog_handleCloseButtonClick = new WeakMap(), _DadsDialog_handleDadsCommand = new WeakMap(), _DadsDialog_handleCommandEvent = new WeakMap(), _DadsDialog_handleDocumentKeyDown = new WeakMap(), _DadsDialog_handleDocumentFocusIn = new WeakMap(), _DadsDialog_syncCloseButtonVisibility = new WeakMap(), _DadsDialog_syncCloseButtonLabel = new WeakMap(), _DadsDialog_syncFooterVisibility = new WeakMap(), _DadsDialog_syncAccessibleName = new WeakMap(), _DadsDialog_syncSize = new WeakMap(), _DadsDialog_instances = new WeakSet(), _DadsDialog_setupListeners = function _DadsDialog_setupListeners() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsDialog_subscriptions, "f"));
    if (__classPrivateFieldGet(this, _DadsDialog_base, "f")) {
        __classPrivateFieldGet(this, _DadsDialog_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDialog_base, "f"), 'click', __classPrivateFieldGet(this, _DadsDialog_handleBaseClick, "f")), subscribe(__classPrivateFieldGet(this, _DadsDialog_base, "f"), 'cancel', __classPrivateFieldGet(this, _DadsDialog_handleNativeCancel, "f")));
    }
    if (__classPrivateFieldGet(this, _DadsDialog_closeButton, "f")) {
        __classPrivateFieldGet(this, _DadsDialog_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDialog_closeButton, "f"), 'click', __classPrivateFieldGet(this, _DadsDialog_handleCloseButtonClick, "f")));
    }
    if (__classPrivateFieldGet(this, _DadsDialog_titleSlot, "f")) {
        __classPrivateFieldGet(this, _DadsDialog_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDialog_titleSlot, "f"), 'slotchange', __classPrivateFieldGet(this, _DadsDialog_syncAccessibleName, "f")));
    }
    if (__classPrivateFieldGet(this, _DadsDialog_footerSlot, "f")) {
        __classPrivateFieldGet(this, _DadsDialog_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsDialog_footerSlot, "f"), 'slotchange', __classPrivateFieldGet(this, _DadsDialog_syncFooterVisibility, "f")));
    }
    __classPrivateFieldGet(this, _DadsDialog_subscriptions, "f").push(subscribe(this, 'dads-command', __classPrivateFieldGet(this, _DadsDialog_handleDadsCommand, "f")), subscribe(this, 'command', __classPrivateFieldGet(this, _DadsDialog_handleCommandEvent, "f")));
}, _DadsDialog_handleCommand = function _DadsDialog_handleCommand(command, invoker, originalEvent) {
    if (command === 'show-modal' || command === 'open') {
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestOpen).call(this, { reason: 'command', invoker, originalEvent });
        return;
    }
    if (command === 'close' || command === 'request-close') {
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_requestClose).call(this, { reason: 'command', invoker, originalEvent });
    }
}, _DadsDialog_requestOpen = function _DadsDialog_requestOpen(context) {
    if (__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isOpen).call(this))
        return true;
    const invoker = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_resolveInvoker).call(this, context.invoker);
    const beforeDetail = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_createEventDetail).call(this, context, invoker, invoker);
    const beforeEvent = new CustomEvent('dads-dialog-before-open', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent))
        return false;
    __classPrivateFieldSet(this, _DadsDialog_lastInvoker, invoker, "f");
    __classPrivateFieldGet(this, _DadsDialog_syncAccessibleName, "f").call(this);
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_applyOpenState).call(this);
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setOpenAttribute).call(this, true);
    const afterDetail = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_createEventDetail).call(this, context, invoker);
    this.dispatchEvent(new CustomEvent('dads-dialog-open', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
    }));
    return true;
}, _DadsDialog_requestClose = function _DadsDialog_requestClose(context) {
    if (!__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isOpen).call(this))
        return true;
    const invoker = context.invoker ?? __classPrivateFieldGet(this, _DadsDialog_lastInvoker, "f");
    const beforeDetail = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_createEventDetail).call(this, context, invoker);
    const beforeEvent = new CustomEvent('dads-dialog-before-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: beforeDetail,
    });
    if (!this.dispatchEvent(beforeEvent))
        return false;
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_applyClosedState).call(this, { restoreFocus: true });
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_setOpenAttribute).call(this, false);
    const afterDetail = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_createEventDetail).call(this, context, invoker);
    this.dispatchEvent(new CustomEvent('dads-dialog-close', {
        bubbles: true,
        composed: true,
        detail: afterDetail,
    }));
    return true;
}, _DadsDialog_createEventDetail = function _DadsDialog_createEventDetail(context, invoker, returnFocusTo = __classPrivateFieldGet(this, _DadsDialog_lastInvoker, "f")) {
    return {
        reason: context.reason,
        invoker,
        originalEvent: context.originalEvent,
        returnFocusTo,
    };
}, _DadsDialog_applyOpenState = function _DadsDialog_applyOpenState() {
    const base = __classPrivateFieldGet(this, _DadsDialog_base, "f");
    if (!base)
        return;
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_syncDocumentListeners).call(this, true);
    if (__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isPreviewContained).call(this) && typeof base.show === 'function') {
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
    __classPrivateFieldSet(this, _DadsDialog_openState, true, "f");
    queueMicrotask(() => __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_focusInitialElement).call(this));
}, _DadsDialog_applyClosedState = function _DadsDialog_applyClosedState(options) {
    const base = __classPrivateFieldGet(this, _DadsDialog_base, "f");
    __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_syncDocumentListeners).call(this, false);
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
    __classPrivateFieldSet(this, _DadsDialog_openState, false, "f");
    if (options.restoreFocus)
        __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_restoreFocusToInvoker).call(this);
}, _DadsDialog_syncDocumentListeners = function _DadsDialog_syncDocumentListeners(isOpen) {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsDialog_documentSubscriptions, "f"));
    if (!isOpen || __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_isPreviewContained).call(this))
        return;
    __classPrivateFieldGet(this, _DadsDialog_documentSubscriptions, "f").push(subscribe(document, 'keydown', __classPrivateFieldGet(this, _DadsDialog_handleDocumentKeyDown, "f"), true), subscribe(document, 'focusin', __classPrivateFieldGet(this, _DadsDialog_handleDocumentFocusIn, "f"), true));
}, _DadsDialog_isEventInsideDialog = function _DadsDialog_isEventInsideDialog(event) {
    const base = __classPrivateFieldGet(this, _DadsDialog_base, "f");
    if (!base)
        return false;
    const path = event.composedPath();
    return path.includes(base) || path.includes(this);
}, _DadsDialog_isElementInsidePanel = function _DadsDialog_isElementInsidePanel(element) {
    const panel = __classPrivateFieldGet(this, _DadsDialog_panel, "f");
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
}, _DadsDialog_getDeepActiveElement = function _DadsDialog_getDeepActiveElement() {
    let active = this.shadowRoot?.activeElement ?? document.activeElement;
    while (active && active instanceof HTMLElement && active.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
}, _DadsDialog_focusInitialElement = function _DadsDialog_focusInitialElement() {
    if (__classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_resolveInitialFocus).call(this) === 'title') {
        const title = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_getTitleFocusTarget).call(this);
        if (title) {
            title.focus();
            return;
        }
    }
    const explicit = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_findInitialFocusElement).call(this);
    if (explicit) {
        explicit.focus();
        return;
    }
    const focusables = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_getFocusableElements).call(this);
    const preferred = focusables.find((el) => el.hasAttribute('autofocus'));
    const target = preferred ?? focusables[0] ?? __classPrivateFieldGet(this, _DadsDialog_panel, "f");
    target?.focus();
}, _DadsDialog_resolveInitialFocus = function _DadsDialog_resolveInitialFocus() {
    return normalizeInitialFocus(this.getAttribute('initial-focus'));
}, _DadsDialog_getTitleFocusTarget = function _DadsDialog_getTitleFocusTarget() {
    if (!hasSlotContent(__classPrivateFieldGet(this, _DadsDialog_titleSlot, "f")))
        return null;
    return this.shadowRoot?.querySelector('#title') ?? null;
}, _DadsDialog_findInitialFocusElement = function _DadsDialog_findInitialFocusElement() {
    const candidates = Array.from(this.querySelectorAll('[data-dialog-initial-focus]'));
    if (candidates.length > 0)
        return candidates[0];
    return this.shadowRoot?.querySelector('[data-dialog-initial-focus]') ?? null;
}, _DadsDialog_getFocusableElements = function _DadsDialog_getFocusableElements() {
    const panel = __classPrivateFieldGet(this, _DadsDialog_panel, "f");
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
    // happy-dom では slot.assignedElements() が環境差で不足することがあるため、
    // host の light DOM もフォールバックとして走査する。
    visit(this);
    return out;
}, _DadsDialog_restoreFocusToInvoker = function _DadsDialog_restoreFocusToInvoker() {
    const invoker = __classPrivateFieldGet(this, _DadsDialog_lastInvoker, "f");
    if (!invoker || !invoker.isConnected)
        return;
    invoker.focus();
}, _DadsDialog_setOpenAttribute = function _DadsDialog_setOpenAttribute(isOpen) {
    if (this.hasAttribute('open') === isOpen)
        return;
    __classPrivateFieldSet(this, _DadsDialog_ignoreOpenAttrChange, true, "f");
    this.toggleAttribute('open', isOpen);
    __classPrivateFieldSet(this, _DadsDialog_ignoreOpenAttrChange, false, "f");
}, _DadsDialog_isOpen = function _DadsDialog_isOpen() {
    return __classPrivateFieldGet(this, _DadsDialog_openState, "f");
}, _DadsDialog_resolveInvoker = function _DadsDialog_resolveInvoker(invoker) {
    if (invoker instanceof HTMLElement)
        return invoker;
    const active = __classPrivateFieldGet(this, _DadsDialog_instances, "m", _DadsDialog_getDeepActiveElement).call(this);
    return active instanceof HTMLElement ? active : null;
}, _DadsDialog_isPreviewContained = function _DadsDialog_isPreviewContained() {
    return this.hasAttribute('data-preview-contained');
};
DadsDialog.definition = {
    name: 'dads-dialog',
    template: html `
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
    styles: withReset([applyDADSTokens(), applySpacingTokens(), dialogTokens, dialogStyles, applyDADSFocusStyles()], 'minimal'),
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
