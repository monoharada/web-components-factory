/**
 * @module resource-list
 * デジタル庁デザインシステム Resource List コンポーネント
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
var _DadsResourceList_instances, _a, _DadsResourceList_body, _DadsResourceList_controlPart, _DadsResourceList_contentsPart, _DadsResourceList_controlSlot, _DadsResourceList_iconSlot, _DadsResourceList_titleSlot, _DadsResourceList_labelSlot, _DadsResourceList_supportSlot, _DadsResourceList_subSlot, _DadsResourceList_actionSlot, _DadsResourceList_slotMutationObserver, _DadsResourceList_pendingControlUpgradeTags, _DadsResourceList_boundControlHost, _DadsResourceList_boundControlInput, _DadsResourceList_primaryTitleLink, _DadsResourceList_instanceId, _DadsResourceList_slots, _DadsResourceList_bindSlotListeners, _DadsResourceList_unbindSlotListeners, _DadsResourceList_observeSlotMutations, _DadsResourceList_handleSlotChange, _DadsResourceList_syncAll, _DadsResourceList_syncControlComponentSize, _DadsResourceList_syncPresenceFlags, _DadsResourceList_syncControlTarget, _DadsResourceList_unbindControlListeners, _DadsResourceList_syncControlAccessibleName, _DadsResourceList_resolveControlAccessibleNameTarget, _DadsResourceList_resolveControlLabelReferenceIds, _DadsResourceList_resolveLabelSourceElements, _DadsResourceList_isLabelSourceElement, _DadsResourceList_ensureLabelSourceElementId, _DadsResourceList_clearAutoControlLabelledby, _DadsResourceList_clearAutoControlLabelledbyFrom, _DadsResourceList_resolveControlTarget, _DadsResourceList_resolveControlTargetFromSlot, _DadsResourceList_resolveControlTargetFromElement, _DadsResourceList_queueControlUpgradeSync, _DadsResourceList_syncControlStateFlags, _DadsResourceList_isControlChecked, _DadsResourceList_isControlDisabled, _DadsResourceList_syncBodyMode, _DadsResourceList_syncBodyLinkAttributes, _DadsResourceList_syncInteractionFlags, _DadsResourceList_syncActionStateFlags, _DadsResourceList_resolvePrimaryActionElement, _DadsResourceList_resolvePrimaryActionElementFromSlot, _DadsResourceList_isActionDisabled, _DadsResourceList_hasMeaningfulSlotContent, _DadsResourceList_isWholeControlInteraction, _DadsResourceList_isInlineControlInteraction, _DadsResourceList_isControlRegionClick, _DadsResourceList_isContentsRegionClick, _DadsResourceList_isSlottedContentsClick, _DadsResourceList_isSlottedControlClick, _DadsResourceList_isWholeDelegatedLinkInteraction, _DadsResourceList_getHostHref, _DadsResourceList_syncPrimaryTitleLink, _DadsResourceList_resolvePrimaryTitleLink, _DadsResourceList_resolvePrimaryTitleLinkFromSlot, _DadsResourceList_resolvePrimaryTitleLinkFromElement, _DadsResourceList_isUsablePrimaryTitleLink, _DadsResourceList_syncPrimaryFocusFlag, _DadsResourceList_activatePrimaryTitleLink, _DadsResourceList_activateControl, _DadsResourceList_handleControlStateChange, _DadsResourceList_handleFocusStateChange, _DadsResourceList_handleBodyClick, _DadsResourceList_handleHostClick, _DadsResourceList_syncRelatedRadioRows, _DadsResourceList_queueControlStateSync, _DadsResourceList_resolveRadioControlGroup, _DadsResourceList_isSameRadioControlGroup, _DadsResourceList_resolveRadioControlName;
import { html, PropertyAttr, BooleanAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { resourceListTokens } from './resource-list-tokens.js';
import { resourceListStyles } from './resource-list-styles.js';
const VALID_STYLES = ['list', 'frame'];
const VALID_INTERACTIONS = ['inline', 'whole'];
const DEFAULT_STYLE = 'list';
const DEFAULT_INTERACTION = 'inline';
const CONTROL_DEFAULT_SIZE = 'md';
const AUTO_CONTROL_LABELLED_BY_ATTR = 'data-resource-list-auto-labelled-by';
let resourceListInstanceCounter = 0;
function normalizeStyle(value) {
    if (!value)
        return DEFAULT_STYLE;
    const normalized = value.trim().toLowerCase();
    return VALID_STYLES.includes(normalized)
        ? normalized
        : DEFAULT_STYLE;
}
function normalizeInteraction(value) {
    if (!value)
        return DEFAULT_INTERACTION;
    const normalized = value.trim().toLowerCase();
    return VALID_INTERACTIONS.includes(normalized)
        ? normalized
        : DEFAULT_INTERACTION;
}
function isMeaningfulNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        if (element.hasAttribute('hidden'))
            return false;
        return true;
    }
    if (node.nodeType === Node.TEXT_NODE)
        return (node.textContent ?? '').trim() !== '';
    return false;
}
function isInteractiveElement(node) {
    return Boolean(node.closest('a,button,input,select,textarea,label,summary,[contenteditable="true"]'));
}
function shouldCancelControlActivationFromNode(node, options) {
    const { boundControlInput, boundControlHost, allowLabelClick = false } = options;
    if (node === boundControlInput)
        return true;
    if (boundControlHost && node !== boundControlHost && boundControlHost.contains(node))
        return true;
    if (!isInteractiveElement(node))
        return false;
    if (allowLabelClick && node.tagName.toLowerCase() === 'label')
        return false;
    return true;
}
/**
 * リソースリストコンポーネント
 *
 * DADS の Resource List を Web Components として提供します。
 *
 * @customElement
 * @tagname dads-resource-list
 *
 * @slot control - チェックボックス/ラジオ等の選択コントロール
 * @slot icon - 先頭アイコン
 * @slot title - タイトル
 * @slot label - ラベル
 * @slot support - サポートテキスト
 * @slot sub - サブラベル
 * @slot action - 右端アクション
 *
 * @csspart base - ルート領域
 * @csspart body - 本体領域（全体リンク時は <a>）
 * @csspart control - 選択コントロール領域
 * @csspart icon - 先頭アイコン領域
 * @csspart contents - タイトル/ラベル/サポートテキスト領域
 * @csspart title - タイトル領域
 * @csspart label - ラベル領域
 * @csspart support - サポートテキスト領域
 * @csspart sub - サブラベル領域
 * @csspart action - 右端アクション領域
 *
 * @attr {'list' | 'frame'} data-style - スタイル種別（DADS互換）
 * @attr {'inline' | 'whole'} data-interaction - 操作方式（DADS互換）
 * @attr {string} href - 全体リンク時の遷移先URL
 * @attr {string} target - 全体リンク時のtarget属性
 * @attr {string} rel - 全体リンク時のrel属性
 * @attr {boolean} download - 全体リンク時のdownload属性
 *
 * @cssprop --dads-resource-list-background - 背景色
 * @cssprop --dads-resource-list-background-selected - 選択時背景色
 * @cssprop --dads-resource-list-background-disabled - 無効時背景色
 * @cssprop --dads-resource-list-color - 文字色
 * @cssprop --dads-resource-list-color-disabled - 無効時文字色
 * @cssprop --dads-resource-list-border-color - 罫線色
 * @cssprop --dads-resource-list-border-color-selected - 選択時罫線色
 * @cssprop --dads-resource-list-border-color-disabled - 無効時罫線色
 * @cssprop --dads-resource-list-padding-block - 上下余白
 * @cssprop --dads-resource-list-padding-inline - 左右余白
 * @cssprop --dads-resource-list-gap - body 内要素間隔
 * @cssprop --dads-resource-list-content-gap - contents 内行間
 * @cssprop --dads-resource-list-control-hit-area - control 領域の最小ヒットサイズ
 * @cssprop --dads-resource-list-action-width - action 幅
 */
export class DadsResourceList extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsResourceList_instances.add(this);
        _DadsResourceList_body.set(this, null);
        _DadsResourceList_controlPart.set(this, null);
        _DadsResourceList_contentsPart.set(this, null);
        _DadsResourceList_controlSlot.set(this, null);
        _DadsResourceList_iconSlot.set(this, null);
        _DadsResourceList_titleSlot.set(this, null);
        _DadsResourceList_labelSlot.set(this, null);
        _DadsResourceList_supportSlot.set(this, null);
        _DadsResourceList_subSlot.set(this, null);
        _DadsResourceList_actionSlot.set(this, null);
        _DadsResourceList_slotMutationObserver.set(this, null);
        _DadsResourceList_pendingControlUpgradeTags.set(this, new Set());
        _DadsResourceList_boundControlHost.set(this, null);
        _DadsResourceList_boundControlInput.set(this, null);
        _DadsResourceList_primaryTitleLink.set(this, null);
        _DadsResourceList_instanceId.set(this, ++resourceListInstanceCounter);
        _DadsResourceList_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this);
        });
        _DadsResourceList_handleControlStateChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlTarget).call(this);
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlStateFlags).call(this);
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncInteractionFlags).call(this);
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncRelatedRadioRows).call(this);
        });
        _DadsResourceList_handleFocusStateChange.set(this, () => {
            queueMicrotask(() => __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncPrimaryFocusFlag).call(this));
        });
        _DadsResourceList_handleBodyClick.set(this, (event) => {
            if (event.defaultPrevented)
                return;
            if (__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isWholeControlInteraction).call(this)) {
                if (__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlDisabled).call(this))
                    return;
                const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
                for (const node of path) {
                    if (!(node instanceof Element))
                        continue;
                    if (shouldCancelControlActivationFromNode(node, {
                        boundControlInput: __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"),
                        boundControlHost: __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"),
                    }))
                        return;
                }
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_activateControl).call(this);
                return;
            }
            if (__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isInlineControlInteraction).call(this)) {
                if (__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlDisabled).call(this))
                    return;
                const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
                const isControlRegion = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlRegionClick).call(this, path);
                const isContentsRegion = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isContentsRegionClick).call(this, path);
                if (!isControlRegion && !isContentsRegion)
                    return;
                for (const node of path) {
                    if (!(node instanceof Element))
                        continue;
                    if (shouldCancelControlActivationFromNode(node, {
                        boundControlInput: __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"),
                        boundControlHost: __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"),
                        allowLabelClick: isContentsRegion,
                    }))
                        return;
                }
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_activateControl).call(this);
                return;
            }
            if (!__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isWholeDelegatedLinkInteraction).call(this))
                return;
            if (this.hasAttribute('data-disabled'))
                return;
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            for (const node of path) {
                if (!(node instanceof Element))
                    continue;
                if (__classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") && (node === __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") || __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f").contains(node))) {
                    return;
                }
                if (isInteractiveElement(node))
                    return;
            }
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_activatePrimaryTitleLink).call(this);
        });
        _DadsResourceList_handleHostClick.set(this, (event) => {
            if (event.defaultPrevented)
                return;
            if (!__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isInlineControlInteraction).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlDisabled).call(this))
                return;
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            if (path.some((node) => node === __classPrivateFieldGet(this, _DadsResourceList_body, "f")))
                return;
            const isSlottedControl = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isSlottedControlClick).call(this, path);
            const isSlottedContents = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isSlottedContentsClick).call(this, path);
            if (!isSlottedControl && !isSlottedContents)
                return;
            for (const node of path) {
                if (!(node instanceof Element))
                    continue;
                if (shouldCancelControlActivationFromNode(node, {
                    boundControlInput: __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"),
                    boundControlHost: __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"),
                    allowLabelClick: isSlottedContents,
                }))
                    return;
            }
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_activateControl).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, {
            'data-style': DEFAULT_STYLE,
            'data-interaction': DEFAULT_INTERACTION,
        });
        __classPrivateFieldSet(this, _DadsResourceList_body, this.shadowRoot?.querySelector('#body'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_controlPart, this.shadowRoot?.querySelector('#control'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_contentsPart, this.shadowRoot?.querySelector('#contents'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_controlSlot, this.shadowRoot?.querySelector('#control-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_iconSlot, this.shadowRoot?.querySelector('#icon-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_titleSlot, this.shadowRoot?.querySelector('#title-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_subSlot, this.shadowRoot?.querySelector('#sub-slot'), "f");
        __classPrivateFieldSet(this, _DadsResourceList_actionSlot, this.shadowRoot?.querySelector('#action-slot'), "f");
        __classPrivateFieldGet(this, _DadsResourceList_body, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleBodyClick, "f"));
        this.addEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleHostClick, "f"));
        this.addEventListener('focusin', __classPrivateFieldGet(this, _DadsResourceList_handleFocusStateChange, "f"));
        this.addEventListener('focusout', __classPrivateFieldGet(this, _DadsResourceList_handleFocusStateChange, "f"));
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_bindSlotListeners).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_observeSlotMutations).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsResourceList_body, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleBodyClick, "f"));
        this.removeEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleHostClick, "f"));
        this.removeEventListener('focusin', __classPrivateFieldGet(this, _DadsResourceList_handleFocusStateChange, "f"));
        this.removeEventListener('focusout', __classPrivateFieldGet(this, _DadsResourceList_handleFocusStateChange, "f"));
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_unbindSlotListeners).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_unbindControlListeners).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_slotMutationObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsResourceList_slotMutationObserver, null, "f");
        __classPrivateFieldGet(this, _DadsResourceList_pendingControlUpgradeTags, "f").clear();
        __classPrivateFieldSet(this, _DadsResourceList_primaryTitleLink, null, "f");
        __classPrivateFieldSet(this, _DadsResourceList_controlPart, null, "f");
        __classPrivateFieldSet(this, _DadsResourceList_contentsPart, null, "f");
        this.removeAttribute('data-primary-focus');
        super.disconnectedCallback();
    }
    dataStyleChanged(_oldValue, newValue) {
        const normalized = normalizeStyle(newValue);
        if (newValue !== normalized) {
            this.setAttribute('data-style', normalized);
            return;
        }
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this);
    }
    dataInteractionChanged(_oldValue, newValue) {
        const normalized = normalizeInteraction(newValue);
        if (newValue !== normalized) {
            this.setAttribute('data-interaction', normalized);
            return;
        }
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this);
    }
    hrefChanged() {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this);
    }
    targetChanged() {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncBodyLinkAttributes).call(this);
    }
    relChanged() {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncBodyLinkAttributes).call(this);
    }
    downloadChanged() {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncBodyLinkAttributes).call(this);
    }
}
_a = DadsResourceList, _DadsResourceList_body = new WeakMap(), _DadsResourceList_controlPart = new WeakMap(), _DadsResourceList_contentsPart = new WeakMap(), _DadsResourceList_controlSlot = new WeakMap(), _DadsResourceList_iconSlot = new WeakMap(), _DadsResourceList_titleSlot = new WeakMap(), _DadsResourceList_labelSlot = new WeakMap(), _DadsResourceList_supportSlot = new WeakMap(), _DadsResourceList_subSlot = new WeakMap(), _DadsResourceList_actionSlot = new WeakMap(), _DadsResourceList_slotMutationObserver = new WeakMap(), _DadsResourceList_pendingControlUpgradeTags = new WeakMap(), _DadsResourceList_boundControlHost = new WeakMap(), _DadsResourceList_boundControlInput = new WeakMap(), _DadsResourceList_primaryTitleLink = new WeakMap(), _DadsResourceList_instanceId = new WeakMap(), _DadsResourceList_handleSlotChange = new WeakMap(), _DadsResourceList_handleControlStateChange = new WeakMap(), _DadsResourceList_handleFocusStateChange = new WeakMap(), _DadsResourceList_handleBodyClick = new WeakMap(), _DadsResourceList_handleHostClick = new WeakMap(), _DadsResourceList_instances = new WeakSet(), _DadsResourceList_slots = function _DadsResourceList_slots() {
    return [
        __classPrivateFieldGet(this, _DadsResourceList_controlSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_iconSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_labelSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_supportSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_subSlot, "f"),
        __classPrivateFieldGet(this, _DadsResourceList_actionSlot, "f"),
    ];
}, _DadsResourceList_bindSlotListeners = function _DadsResourceList_bindSlotListeners() {
    for (const slot of __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_slots).call(this)) {
        slot?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsResourceList_handleSlotChange, "f"));
    }
}, _DadsResourceList_unbindSlotListeners = function _DadsResourceList_unbindSlotListeners() {
    for (const slot of __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_slots).call(this)) {
        slot?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsResourceList_handleSlotChange, "f"));
    }
}, _DadsResourceList_observeSlotMutations = function _DadsResourceList_observeSlotMutations() {
    __classPrivateFieldGet(this, _DadsResourceList_slotMutationObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsResourceList_slotMutationObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this)), "f");
    __classPrivateFieldGet(this, _DadsResourceList_slotMutationObserver, "f").observe(this, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['slot', 'hidden', 'checked', 'disabled', 'aria-disabled', 'href'],
    });
}, _DadsResourceList_syncAll = function _DadsResourceList_syncAll() {
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncPresenceFlags).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncPrimaryTitleLink).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlTarget).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlComponentSize).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlAccessibleName).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlStateFlags).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncBodyMode).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncBodyLinkAttributes).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncInteractionFlags).call(this);
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncActionStateFlags).call(this);
}, _DadsResourceList_syncControlComponentSize = function _DadsResourceList_syncControlComponentSize() {
    const controlHost = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    if (!controlHost)
        return;
    const tagName = controlHost.tagName.toLowerCase();
    if (tagName !== 'dads-checkbox' && tagName !== 'dads-radio')
        return;
    const currentSize = controlHost.getAttribute('size');
    if (currentSize === CONTROL_DEFAULT_SIZE || currentSize === 'lg')
        return;
    controlHost.setAttribute('size', CONTROL_DEFAULT_SIZE);
}, _DadsResourceList_syncPresenceFlags = function _DadsResourceList_syncPresenceFlags() {
    const hasControl = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'control', __classPrivateFieldGet(this, _DadsResourceList_controlSlot, "f"));
    const hasIcon = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'icon', __classPrivateFieldGet(this, _DadsResourceList_iconSlot, "f"));
    const hasTitle = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'title', __classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f"));
    const hasLabel = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'label', __classPrivateFieldGet(this, _DadsResourceList_labelSlot, "f"));
    const hasSupport = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'support', __classPrivateFieldGet(this, _DadsResourceList_supportSlot, "f"));
    const hasSub = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'sub', __classPrivateFieldGet(this, _DadsResourceList_subSlot, "f"));
    const hasAction = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_hasMeaningfulSlotContent).call(this, 'action', __classPrivateFieldGet(this, _DadsResourceList_actionSlot, "f"));
    this.toggleAttribute('data-has-control', hasControl);
    this.toggleAttribute('data-has-icon', hasIcon);
    this.toggleAttribute('data-has-title', hasTitle);
    this.toggleAttribute('data-has-label', hasLabel);
    this.toggleAttribute('data-has-support', hasSupport);
    this.toggleAttribute('data-has-sub', hasSub);
    this.toggleAttribute('data-has-action', hasAction);
    this.toggleAttribute('data-has-contents', hasTitle || hasLabel || hasSupport);
}, _DadsResourceList_syncControlTarget = function _DadsResourceList_syncControlTarget() {
    const next = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlTarget).call(this);
    const hasChanged = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f") !== next.host || __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f") !== next.input;
    if (!hasChanged)
        return;
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_unbindControlListeners).call(this);
    __classPrivateFieldSet(this, _DadsResourceList_boundControlHost, next.host, "f");
    __classPrivateFieldSet(this, _DadsResourceList_boundControlInput, next.input, "f");
    __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")?.addEventListener('change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")?.addEventListener('input', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f") && __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f") !== __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")) {
        __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").addEventListener('dads-change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
        __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").addEventListener('change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    }
}, _DadsResourceList_unbindControlListeners = function _DadsResourceList_unbindControlListeners() {
    const previousHost = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    const previousInput = __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f");
    __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")?.removeEventListener('input', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f") && __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f") !== __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f")) {
        __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").removeEventListener('dads-change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
        __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").removeEventListener('change', __classPrivateFieldGet(this, _DadsResourceList_handleControlStateChange, "f"));
    }
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledbyFrom).call(this, previousHost);
    if (previousInput !== previousHost)
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledbyFrom).call(this, previousInput);
    __classPrivateFieldSet(this, _DadsResourceList_boundControlHost, null, "f");
    __classPrivateFieldSet(this, _DadsResourceList_boundControlInput, null, "f");
}, _DadsResourceList_syncControlAccessibleName = function _DadsResourceList_syncControlAccessibleName() {
    const target = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlAccessibleNameTarget).call(this);
    if (!target || !this.hasAttribute('data-has-control')) {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledby).call(this);
        return;
    }
    const hasAutoManagedLabel = target.hasAttribute(AUTO_CONTROL_LABELLED_BY_ATTR);
    const hasUserLabelledBy = target.hasAttribute('aria-labelledby') && !hasAutoManagedLabel;
    const hasUserLabel = target.hasAttribute('aria-label');
    if (hasUserLabelledBy || hasUserLabel) {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledby).call(this);
        return;
    }
    const labelIds = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlLabelReferenceIds).call(this);
    if (labelIds.length === 0) {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledby).call(this);
        return;
    }
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledby).call(this, target);
    target.setAttribute('aria-labelledby', labelIds.join(' '));
    target.setAttribute(AUTO_CONTROL_LABELLED_BY_ATTR, '');
}, _DadsResourceList_resolveControlAccessibleNameTarget = function _DadsResourceList_resolveControlAccessibleNameTarget() {
    const host = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    if (host) {
        const tagName = host.tagName.toLowerCase();
        if (tagName === 'dads-checkbox' || tagName === 'dads-radio')
            return host;
        if (host instanceof HTMLInputElement)
            return host;
    }
    return __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f");
}, _DadsResourceList_resolveControlLabelReferenceIds = function _DadsResourceList_resolveControlLabelReferenceIds() {
    const refs = [];
    const titleElements = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveLabelSourceElements).call(this, 'title', __classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f"));
    const supportElements = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveLabelSourceElements).call(this, 'support', __classPrivateFieldGet(this, _DadsResourceList_supportSlot, "f"));
    for (const [index, element] of titleElements.entries()) {
        refs.push(__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_ensureLabelSourceElementId).call(this, element, 'title', index));
    }
    for (const [index, element] of supportElements.entries()) {
        refs.push(__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_ensureLabelSourceElementId).call(this, element, 'support', index));
    }
    return Array.from(new Set(refs));
}, _DadsResourceList_resolveLabelSourceElements = function _DadsResourceList_resolveLabelSourceElements(slotName, slot) {
    const elements = [];
    if (slot) {
        const assigned = slot.assignedElements({ flatten: true });
        for (const candidate of assigned) {
            if (!(candidate instanceof HTMLElement))
                continue;
            if (!__classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isLabelSourceElement).call(this, candidate))
                continue;
            elements.push(candidate);
        }
    }
    if (elements.length > 0)
        return elements;
    const lightDomElements = Array.from(this.children).filter((element) => element instanceof HTMLElement &&
        element.getAttribute('slot') === slotName &&
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isLabelSourceElement).call(this, element));
    return lightDomElements;
}, _DadsResourceList_isLabelSourceElement = function _DadsResourceList_isLabelSourceElement(element) {
    if (element.hasAttribute('hidden'))
        return false;
    return (element.textContent ?? '').trim().length > 0;
}, _DadsResourceList_ensureLabelSourceElementId = function _DadsResourceList_ensureLabelSourceElementId(element, slotName, index) {
    const existingId = element.getAttribute('id');
    if (existingId && existingId.trim().length > 0)
        return existingId;
    const generatedId = `${this.localName}-${__classPrivateFieldGet(this, _DadsResourceList_instanceId, "f")}-${slotName}-${index + 1}`;
    element.id = generatedId;
    return generatedId;
}, _DadsResourceList_clearAutoControlLabelledby = function _DadsResourceList_clearAutoControlLabelledby(except = null) {
    const candidates = new Set();
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"))
        candidates.add(__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"));
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"))
        candidates.add(__classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"));
    for (const candidate of candidates) {
        if (candidate === except)
            continue;
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_clearAutoControlLabelledbyFrom).call(this, candidate);
    }
}, _DadsResourceList_clearAutoControlLabelledbyFrom = function _DadsResourceList_clearAutoControlLabelledbyFrom(candidate) {
    if (!candidate || !candidate.hasAttribute(AUTO_CONTROL_LABELLED_BY_ATTR))
        return;
    candidate.removeAttribute('aria-labelledby');
    candidate.removeAttribute(AUTO_CONTROL_LABELLED_BY_ATTR);
}, _DadsResourceList_resolveControlTarget = function _DadsResourceList_resolveControlTarget() {
    const bySlot = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlTargetFromSlot).call(this);
    if (bySlot.host || bySlot.input)
        return bySlot;
    // slot API が不安定なテスト環境向けフォールバック
    const direct = this.querySelector('[slot="control"]');
    if (direct instanceof HTMLElement) {
        return __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlTargetFromElement).call(this, direct);
    }
    return { host: null, input: null };
}, _DadsResourceList_resolveControlTargetFromSlot = function _DadsResourceList_resolveControlTargetFromSlot() {
    if (!__classPrivateFieldGet(this, _DadsResourceList_controlSlot, "f"))
        return { host: null, input: null };
    const assigned = __classPrivateFieldGet(this, _DadsResourceList_controlSlot, "f").assignedElements({ flatten: true });
    for (const candidate of assigned) {
        if (!(candidate instanceof HTMLElement))
            continue;
        const resolved = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveControlTargetFromElement).call(this, candidate);
        if (resolved.host || resolved.input)
            return resolved;
    }
    return { host: null, input: null };
}, _DadsResourceList_resolveControlTargetFromElement = function _DadsResourceList_resolveControlTargetFromElement(element) {
    if (element instanceof HTMLInputElement) {
        const type = element.type.toLowerCase();
        if (type === 'checkbox' || type === 'radio') {
            return { host: element, input: element };
        }
    }
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'dads-checkbox' || tagName === 'dads-radio') {
        const shadowInput = element.shadowRoot?.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!(shadowInput instanceof HTMLInputElement) && customElements.get(tagName) === undefined) {
            __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_queueControlUpgradeSync).call(this, tagName);
        }
        return {
            host: element,
            input: shadowInput instanceof HTMLInputElement ? shadowInput : null,
        };
    }
    const nestedInput = element.querySelector('input[type="checkbox"], input[type="radio"]');
    if (nestedInput instanceof HTMLInputElement) {
        return { host: element, input: nestedInput };
    }
    const shadowInput = element.shadowRoot?.querySelector('input[type="checkbox"], input[type="radio"]');
    if (shadowInput instanceof HTMLInputElement) {
        return { host: element, input: shadowInput };
    }
    if ('checked' in element || element.hasAttribute('checked')) {
        return { host: element, input: null };
    }
    return { host: null, input: null };
}, _DadsResourceList_queueControlUpgradeSync = function _DadsResourceList_queueControlUpgradeSync(tagName) {
    if (__classPrivateFieldGet(this, _DadsResourceList_pendingControlUpgradeTags, "f").has(tagName))
        return;
    if (customElements.get(tagName) !== undefined)
        return;
    __classPrivateFieldGet(this, _DadsResourceList_pendingControlUpgradeTags, "f").add(tagName);
    void customElements
        .whenDefined(tagName)
        .then(() => {
        __classPrivateFieldGet(this, _DadsResourceList_pendingControlUpgradeTags, "f").delete(tagName);
        if (!this.isConnected)
            return;
        queueMicrotask(() => __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncAll).call(this));
    })
        .catch(() => {
        __classPrivateFieldGet(this, _DadsResourceList_pendingControlUpgradeTags, "f").delete(tagName);
    });
}, _DadsResourceList_syncControlStateFlags = function _DadsResourceList_syncControlStateFlags() {
    if (!this.hasAttribute('data-has-control')) {
        this.removeAttribute('data-selected');
        this.removeAttribute('data-disabled');
        return;
    }
    this.toggleAttribute('data-selected', __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlChecked).call(this));
    this.toggleAttribute('data-disabled', __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isControlDisabled).call(this));
}, _DadsResourceList_isControlChecked = function _DadsResourceList_isControlChecked() {
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"))
        return __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f").checked;
    if (!__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"))
        return false;
    const shadowInput = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").shadowRoot?.querySelector('input[type="checkbox"], input[type="radio"]');
    if (shadowInput instanceof HTMLInputElement)
        return shadowInput.checked;
    const control = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    if (typeof control.checked === 'boolean')
        return control.checked;
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").getAttribute('aria-checked') === 'true')
        return true;
    return __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").hasAttribute('checked');
}, _DadsResourceList_isControlDisabled = function _DadsResourceList_isControlDisabled() {
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f"))
        return __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f").disabled;
    if (!__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"))
        return false;
    const shadowInput = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").shadowRoot?.querySelector('input[type="checkbox"], input[type="radio"]');
    if (shadowInput instanceof HTMLInputElement)
        return shadowInput.disabled;
    const control = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    if (typeof control.disabled === 'boolean')
        return control.disabled;
    return (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").hasAttribute('disabled') ||
        __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").getAttribute('aria-disabled') === 'true');
}, _DadsResourceList_syncBodyMode = function _DadsResourceList_syncBodyMode() {
    const interactionWhole = normalizeInteraction(this.getAttribute('data-interaction')) === 'whole';
    const hasControl = this.hasAttribute('data-has-control');
    const hasHostHref = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_getHostHref).call(this) !== null;
    const hasPrimaryTitleLink = __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") !== null;
    const shouldAnchor = interactionWhole && !hasControl && hasHostHref;
    const current = __classPrivateFieldGet(this, _DadsResourceList_body, "f");
    if (!current)
        return;
    const isCurrentAnchor = current instanceof HTMLAnchorElement;
    if (isCurrentAnchor === shouldAnchor)
        return;
    __classPrivateFieldGet(this, _DadsResourceList_body, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleBodyClick, "f"));
    const replacement = document.createElement(shouldAnchor ? 'a' : 'div');
    replacement.setAttribute('part', 'body');
    replacement.id = 'body';
    while (current.firstChild)
        replacement.appendChild(current.firstChild);
    current.replaceWith(replacement);
    __classPrivateFieldSet(this, _DadsResourceList_body, replacement, "f");
    __classPrivateFieldGet(this, _DadsResourceList_body, "f").addEventListener('click', __classPrivateFieldGet(this, _DadsResourceList_handleBodyClick, "f"));
}, _DadsResourceList_syncBodyLinkAttributes = function _DadsResourceList_syncBodyLinkAttributes() {
    if (!(__classPrivateFieldGet(this, _DadsResourceList_body, "f") instanceof HTMLAnchorElement))
        return;
    const href = this.getAttribute('href');
    const safeHref = href && isSafeHref(href) ? href : '#';
    __classPrivateFieldGet(this, _DadsResourceList_body, "f").setAttribute('href', safeHref);
    if (this.hasAttribute('download'))
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").setAttribute('download', '');
    else
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").removeAttribute('download');
    const rel = this.getAttribute('rel');
    if (rel)
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").setAttribute('rel', rel);
    else
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").removeAttribute('rel');
    const target = this.getAttribute('target');
    if (target && !this.hasAttribute('download'))
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").setAttribute('target', target);
    else
        __classPrivateFieldGet(this, _DadsResourceList_body, "f").removeAttribute('target');
}, _DadsResourceList_syncInteractionFlags = function _DadsResourceList_syncInteractionFlags() {
    const interaction = normalizeInteraction(this.getAttribute('data-interaction'));
    const hasControl = this.hasAttribute('data-has-control');
    const canWholeControl = interaction === 'whole' && hasControl && !this.hasAttribute('data-disabled');
    const canWholeLink = interaction === 'whole' &&
        !hasControl &&
        !this.hasAttribute('data-disabled') &&
        (__classPrivateFieldGet(this, _DadsResourceList_body, "f") instanceof HTMLAnchorElement || __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isWholeDelegatedLinkInteraction).call(this));
    this.toggleAttribute('data-interactive-whole', canWholeControl || canWholeLink);
    this.toggleAttribute('data-whole-control', canWholeControl);
    this.toggleAttribute('data-whole-link', canWholeLink);
    if (!canWholeLink)
        this.removeAttribute('data-primary-focus');
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncPrimaryFocusFlag).call(this);
}, _DadsResourceList_syncActionStateFlags = function _DadsResourceList_syncActionStateFlags() {
    if (!this.hasAttribute('data-has-action')) {
        this.removeAttribute('data-action-disabled');
        return;
    }
    const action = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryActionElement).call(this);
    const isDisabled = action ? __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isActionDisabled).call(this, action) : false;
    this.toggleAttribute('data-action-disabled', isDisabled);
}, _DadsResourceList_resolvePrimaryActionElement = function _DadsResourceList_resolvePrimaryActionElement() {
    const bySlot = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryActionElementFromSlot).call(this);
    if (bySlot)
        return bySlot;
    const direct = this.querySelector('[slot="action"]');
    if (direct instanceof HTMLElement && !direct.hasAttribute('hidden'))
        return direct;
    return null;
}, _DadsResourceList_resolvePrimaryActionElementFromSlot = function _DadsResourceList_resolvePrimaryActionElementFromSlot() {
    if (!__classPrivateFieldGet(this, _DadsResourceList_actionSlot, "f"))
        return null;
    const assigned = __classPrivateFieldGet(this, _DadsResourceList_actionSlot, "f").assignedElements({ flatten: true });
    for (const candidate of assigned) {
        if (!(candidate instanceof HTMLElement))
            continue;
        if (candidate.hasAttribute('hidden'))
            continue;
        return candidate;
    }
    return null;
}, _DadsResourceList_isActionDisabled = function _DadsResourceList_isActionDisabled(action) {
    const control = action;
    if (typeof control.disabled === 'boolean')
        return control.disabled;
    if (action.hasAttribute('disabled'))
        return true;
    return action.getAttribute('aria-disabled') === 'true';
}, _DadsResourceList_hasMeaningfulSlotContent = function _DadsResourceList_hasMeaningfulSlotContent(slotName, slot) {
    if (slot) {
        const hasAssigned = slot.assignedNodes({ flatten: true }).some((node) => isMeaningfulNode(node));
        if (hasAssigned)
            return true;
    }
    const lightDomSlotted = Array.from(this.children).filter((element) => element.getAttribute('slot') === slotName && !element.hasAttribute('hidden'));
    return lightDomSlotted.length > 0;
}, _DadsResourceList_isWholeControlInteraction = function _DadsResourceList_isWholeControlInteraction() {
    return (normalizeInteraction(this.getAttribute('data-interaction')) === 'whole' &&
        this.hasAttribute('data-has-control'));
}, _DadsResourceList_isInlineControlInteraction = function _DadsResourceList_isInlineControlInteraction() {
    return (normalizeInteraction(this.getAttribute('data-interaction')) === 'inline' &&
        this.hasAttribute('data-has-control'));
}, _DadsResourceList_isControlRegionClick = function _DadsResourceList_isControlRegionClick(path) {
    const controlPart = __classPrivateFieldGet(this, _DadsResourceList_controlPart, "f");
    if (!controlPart)
        return false;
    for (const node of path) {
        if (node === controlPart || node === __classPrivateFieldGet(this, _DadsResourceList_controlSlot, "f"))
            return true;
        if (!(node instanceof Node))
            continue;
        if (controlPart.contains(node))
            return true;
    }
    return false;
}, _DadsResourceList_isContentsRegionClick = function _DadsResourceList_isContentsRegionClick(path) {
    const contentsPart = __classPrivateFieldGet(this, _DadsResourceList_contentsPart, "f");
    if (!contentsPart)
        return false;
    for (const node of path) {
        if (node === contentsPart || node === __classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f") || node === __classPrivateFieldGet(this, _DadsResourceList_labelSlot, "f") || node === __classPrivateFieldGet(this, _DadsResourceList_supportSlot, "f")) {
            return true;
        }
        if (!(node instanceof Node))
            continue;
        if (contentsPart.contains(node))
            return true;
    }
    return false;
}, _DadsResourceList_isSlottedContentsClick = function _DadsResourceList_isSlottedContentsClick(path) {
    const targetSlots = new Set(['title', 'label', 'support']);
    for (const node of path) {
        if (!(node instanceof Element))
            continue;
        const slotName = node.getAttribute('slot');
        if (slotName && targetSlots.has(slotName) && this.contains(node))
            return true;
        if (!(node instanceof HTMLElement))
            continue;
        const slottedAncestor = node.closest('[slot]');
        if (!slottedAncestor)
            continue;
        const ancestorSlot = slottedAncestor.getAttribute('slot');
        if (ancestorSlot && targetSlots.has(ancestorSlot) && this.contains(slottedAncestor))
            return true;
    }
    return false;
}, _DadsResourceList_isSlottedControlClick = function _DadsResourceList_isSlottedControlClick(path) {
    for (const node of path) {
        if (!(node instanceof Element))
            continue;
        if (node === __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"))
            return true;
        const slotName = node.getAttribute('slot');
        if (slotName === 'control' && this.contains(node))
            return true;
        if (!(node instanceof HTMLElement))
            continue;
        const slottedAncestor = node.closest('[slot]');
        if (!slottedAncestor)
            continue;
        if (slottedAncestor.getAttribute('slot') === 'control' && this.contains(slottedAncestor)) {
            return true;
        }
    }
    return false;
}, _DadsResourceList_isWholeDelegatedLinkInteraction = function _DadsResourceList_isWholeDelegatedLinkInteraction() {
    return (normalizeInteraction(this.getAttribute('data-interaction')) === 'whole' &&
        !this.hasAttribute('data-has-control') &&
        !(__classPrivateFieldGet(this, _DadsResourceList_body, "f") instanceof HTMLAnchorElement) &&
        __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") !== null);
}, _DadsResourceList_getHostHref = function _DadsResourceList_getHostHref() {
    const href = this.getAttribute('href');
    if (href == null)
        return null;
    return href.trim() === '' ? null : href;
}, _DadsResourceList_syncPrimaryTitleLink = function _DadsResourceList_syncPrimaryTitleLink() {
    __classPrivateFieldSet(this, _DadsResourceList_primaryTitleLink, __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryTitleLink).call(this), "f");
    __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncPrimaryFocusFlag).call(this);
}, _DadsResourceList_resolvePrimaryTitleLink = function _DadsResourceList_resolvePrimaryTitleLink() {
    const bySlot = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryTitleLinkFromSlot).call(this);
    if (bySlot)
        return bySlot;
    const slottedTitleNodes = Array.from(this.querySelectorAll('[slot="title"]'));
    for (const node of slottedTitleNodes) {
        if (!(node instanceof HTMLElement))
            continue;
        const resolved = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryTitleLinkFromElement).call(this, node);
        if (resolved)
            return resolved;
    }
    return null;
}, _DadsResourceList_resolvePrimaryTitleLinkFromSlot = function _DadsResourceList_resolvePrimaryTitleLinkFromSlot() {
    if (!__classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f"))
        return null;
    const assigned = __classPrivateFieldGet(this, _DadsResourceList_titleSlot, "f").assignedElements({ flatten: true });
    for (const candidate of assigned) {
        if (!(candidate instanceof HTMLElement))
            continue;
        const resolved = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolvePrimaryTitleLinkFromElement).call(this, candidate);
        if (resolved)
            return resolved;
    }
    return null;
}, _DadsResourceList_resolvePrimaryTitleLinkFromElement = function _DadsResourceList_resolvePrimaryTitleLinkFromElement(element) {
    if (element instanceof HTMLAnchorElement && __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isUsablePrimaryTitleLink).call(this, element))
        return element;
    const nested = element.querySelector('a[href]');
    if (nested instanceof HTMLAnchorElement && __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_isUsablePrimaryTitleLink).call(this, nested))
        return nested;
    return null;
}, _DadsResourceList_isUsablePrimaryTitleLink = function _DadsResourceList_isUsablePrimaryTitleLink(link) {
    if (link.hasAttribute('hidden'))
        return false;
    const href = link.getAttribute('href');
    return Boolean(href && isSafeHref(href));
}, _DadsResourceList_syncPrimaryFocusFlag = function _DadsResourceList_syncPrimaryFocusFlag() {
    const active = document.activeElement;
    const hasFocus = this.hasAttribute('data-whole-link') &&
        __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") !== null &&
        active instanceof Node &&
        (active === __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f") || __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f").contains(active));
    this.toggleAttribute('data-primary-focus', hasFocus);
}, _DadsResourceList_activatePrimaryTitleLink = function _DadsResourceList_activatePrimaryTitleLink() {
    const link = __classPrivateFieldGet(this, _DadsResourceList_primaryTitleLink, "f");
    if (!link)
        return;
    link.click();
}, _DadsResourceList_activateControl = function _DadsResourceList_activateControl() {
    const input = __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f");
    if (input && !input.disabled) {
        input.click();
        input.focus();
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_queueControlStateSync).call(this);
        return;
    }
    const host = __classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f");
    if (!host)
        return;
    const shadowInput = host.shadowRoot?.querySelector('input[type="checkbox"], input[type="radio"]');
    if (shadowInput instanceof HTMLInputElement && !shadowInput.disabled) {
        shadowInput.click();
        shadowInput.focus();
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_queueControlStateSync).call(this);
        return;
    }
    const tagName = host.tagName.toLowerCase();
    const hostControl = host;
    if ((tagName === 'dads-checkbox' || tagName === 'dads-radio') &&
        typeof hostControl.checked === 'boolean' &&
        hostControl.disabled !== true) {
        const nextChecked = tagName === 'dads-radio' ? true : !hostControl.checked;
        hostControl.checked = nextChecked;
        host.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        host.dispatchEvent(new CustomEvent('dads-change', {
            detail: { checked: nextChecked },
            bubbles: true,
            composed: true,
        }));
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_queueControlStateSync).call(this);
        return;
    }
    if (typeof host.click === 'function') {
        host.click();
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_queueControlStateSync).call(this);
    }
}, _DadsResourceList_syncRelatedRadioRows = function _DadsResourceList_syncRelatedRadioRows() {
    const currentGroup = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveRadioControlGroup).call(this);
    if (!currentGroup)
        return;
    const lists = currentGroup.root.querySelectorAll(this.localName);
    for (const candidate of lists) {
        if (!(candidate instanceof _a))
            continue;
        if (candidate === this)
            continue;
        if (!__classPrivateFieldGet(candidate, _DadsResourceList_instances, "m", _DadsResourceList_isSameRadioControlGroup).call(candidate, currentGroup))
            continue;
        __classPrivateFieldGet(candidate, _DadsResourceList_instances, "m", _DadsResourceList_syncControlStateFlags).call(candidate);
        __classPrivateFieldGet(candidate, _DadsResourceList_instances, "m", _DadsResourceList_syncInteractionFlags).call(candidate);
    }
}, _DadsResourceList_queueControlStateSync = function _DadsResourceList_queueControlStateSync() {
    queueMicrotask(() => {
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlTarget).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncControlStateFlags).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncInteractionFlags).call(this);
        __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_syncRelatedRadioRows).call(this);
    });
}, _DadsResourceList_resolveRadioControlGroup = function _DadsResourceList_resolveRadioControlGroup() {
    const root = this.getRootNode();
    if (!(root instanceof Document || root instanceof ShadowRoot))
        return null;
    const name = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveRadioControlName).call(this);
    if (!name)
        return null;
    return {
        name,
        form: this.closest('form'),
        root,
    };
}, _DadsResourceList_isSameRadioControlGroup = function _DadsResourceList_isSameRadioControlGroup(group) {
    const current = __classPrivateFieldGet(this, _DadsResourceList_instances, "m", _DadsResourceList_resolveRadioControlGroup).call(this);
    if (!current)
        return false;
    return (current.root === group.root &&
        current.form === group.form &&
        current.name === group.name);
}, _DadsResourceList_resolveRadioControlName = function _DadsResourceList_resolveRadioControlName() {
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f") && __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f").type.toLowerCase() === 'radio') {
        const inputName = __classPrivateFieldGet(this, _DadsResourceList_boundControlInput, "f").name.trim();
        return inputName === '' ? null : inputName;
    }
    if (!__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f"))
        return null;
    if (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").tagName.toLowerCase() !== 'dads-radio')
        return null;
    const controlName = (__classPrivateFieldGet(this, _DadsResourceList_boundControlHost, "f").getAttribute('name') ?? '').trim();
    return controlName === '' ? null : controlName;
};
DadsResourceList.version = '1.0.0';
DadsResourceList.definition = {
    name: 'dads-resource-list',
    template: html `
      <div part="base" id="base">
        <div part="body" id="body">
          <span part="control" id="control">
            <slot name="control" id="control-slot"></slot>
          </span>
          <span part="icon" id="icon">
            <slot name="icon" id="icon-slot"></slot>
          </span>
          <div part="contents" id="contents">
            <div part="title" id="title">
              <slot name="title" id="title-slot"></slot>
            </div>
            <div part="label" id="label">
              <slot name="label" id="label-slot"></slot>
            </div>
            <div part="support" id="support">
              <slot name="support" id="support-slot"></slot>
            </div>
          </div>
          <div part="sub" id="sub">
            <slot name="sub" id="sub-slot"></slot>
          </div>
        </div>
        <div part="action" id="action">
          <slot name="action" id="action-slot"></slot>
        </div>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), resourceListTokens, resourceListStyles], 'minimal'),
    attributes: [
        PropertyAttr('dataStyle', 'data-style'),
        PropertyAttr('dataInteraction', 'data-interaction'),
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('download'),
    ],
};
