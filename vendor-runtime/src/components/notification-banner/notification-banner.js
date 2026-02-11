/**
 * @module notification-banner
 * デジタル庁デザインシステム Notification Banner コンポーネント
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
var _DadsNotificationBanner_instances, _DadsNotificationBanner_base, _DadsNotificationBanner_header, _DadsNotificationBanner_title, _DadsNotificationBanner_close, _DadsNotificationBanner_closeLabel, _DadsNotificationBanner_body, _DadsNotificationBanner_meta, _DadsNotificationBanner_description, _DadsNotificationBanner_actions, _DadsNotificationBanner_restore, _DadsNotificationBanner_restoreText, _DadsNotificationBanner_restoreButton, _DadsNotificationBanner_titleSlot, _DadsNotificationBanner_metaSlot, _DadsNotificationBanner_descriptionSlot, _DadsNotificationBanner_actionsSlot, _DadsNotificationBanner_primaryLink, _DadsNotificationBanner_abortController, _DadsNotificationBanner_ensureDefaultAttributes, _DadsNotificationBanner_bindEvents, _DadsNotificationBanner_handleSlotChange, _DadsNotificationBanner_handleCloseClick, _DadsNotificationBanner_handleRestoreClick, _DadsNotificationBanner_applyDismissState, _DadsNotificationBanner_handleBaseClick, _DadsNotificationBanner_handleTitleClick, _DadsNotificationBanner_handleBaseKeydown, _DadsNotificationBanner_handleTitleKeydown, _DadsNotificationBanner_syncAll, _DadsNotificationBanner_normalizeEnumAttributes, _DadsNotificationBanner_normalizeAttributeValue, _DadsNotificationBanner_syncCloseState, _DadsNotificationBanner_syncSectionVisibility, _DadsNotificationBanner_syncDismissState, _DadsNotificationBanner_buildRestoreText, _DadsNotificationBanner_syncPrimaryLink, _DadsNotificationBanner_syncInteractionState, _DadsNotificationBanner_findPrimaryLink, _DadsNotificationBanner_findAnchorInSlot, _DadsNotificationBanner_handleLinkDelegationKeydown, _DadsNotificationBanner_maybeDelegateByInteraction, _DadsNotificationBanner_isInteractiveTarget, _DadsNotificationBanner_activatePrimaryLink, _DadsNotificationBanner_normalizeType, _DadsNotificationBanner_normalizeVariant, _DadsNotificationBanner_normalizeCloseStyle, _DadsNotificationBanner_normalizeActionsLayout, _DadsNotificationBanner_normalizeInteraction, _DadsNotificationBanner_normalizeDismissMode, _DadsNotificationBanner_getType, _DadsNotificationBanner_getVariant, _DadsNotificationBanner_getInteraction, _DadsNotificationBanner_getDismissMode, _DadsNotificationBanner_isDismissedCollapsed;
import { html, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { hasSlotContent } from '../../utils/dom.js';
import { notificationBannerTokens } from './notification-banner-tokens.js';
import { notificationBannerStyles } from './notification-banner-styles.js';
const VALID_TYPES = new Set(['success', 'error', 'warning', 'info-1', 'info-2']);
const VALID_VARIANTS = new Set(['standard', 'color-chip']);
const VALID_CLOSE_STYLES = new Set(['default', 'compact']);
const VALID_ACTIONS_LAYOUTS = new Set(['vertical', 'horizontal']);
const VALID_INTERACTIONS = new Set([
    'none',
    'title-and-actions',
    'whole',
    'actions-only',
]);
const VALID_DISMISS_MODES = new Set(['hide', 'collapse']);
const DEFAULT_ATTRIBUTE_VALUES = [
    ['type', 'info-1'],
    ['variant', 'standard'],
    ['close-style', 'default'],
    ['actions-layout', 'horizontal'],
    ['interaction', 'none'],
    ['dismiss-mode', 'hide'],
    ['close-label', '閉じる'],
    ['restore-label', '再表示'],
];
/**
 * ノティフィケーションバナーコンポーネント
 *
 * @customElement
 * @tagname dads-notification-banner
 *
 * @slot title - バナータイトル（必須）
 * @slot icon - バナーアイコン（未指定時はtypeに応じた既定アイコン）
 * @slot meta - 年月日などの補助情報
 * @slot default - バナーデスクリプション
 * @slot actions - アクションボタン群
 *
 * @csspart base - ルート要素
 * @csspart header - ヘッダー領域
 * @csspart icon - アイコン領域
 * @csspart title - タイトル領域
 * @csspart close - 閉じるボタン
 * @csspart close-icon - 閉じるアイコン
 * @csspart close-label - 閉じるラベル
 * @csspart body - 説明領域
 * @csspart meta - 年月日などの領域
 * @csspart description - バナーデスクリプション領域
 * @csspart actions - アクション領域
 * @csspart restore - 再表示導線の領域（dismiss-mode="collapse" 時）
 * @csspart restore-text - 折りたたみ時の補助テキスト
 * @csspart restore-button - 再表示ボタン
 *
 * @attr {'success' | 'error' | 'warning' | 'info-1' | 'info-2'} type - 情報タイプ
 * @attr {'standard' | 'color-chip'} variant - 表示スタイル
 * @attr {boolean} dismissible - 閉じるボタンを表示
 * @attr {boolean} dense - 省スペース表示（モバイル向け）
 * @attr {'default' | 'compact'} close-style - 閉じるボタンの見た目
 * @attr {'vertical' | 'horizontal'} actions-layout - アクションボタンの並び方向
 * @attr {'none' | 'title-and-actions' | 'whole' | 'actions-only'} interaction - リンク委譲のクリック領域
 * @attr {'hide' | 'collapse'} dismiss-mode - 閉じる押下時の挙動
 * @attr {string} close-label - 閉じるボタンのラベル
 * @attr {string} restore-label - 再表示ボタンのラベル
 *
 * @cssprop --dads-notification-banner-background - 背景色
 * @cssprop --dads-notification-banner-color - 本文文字色
 * @cssprop --dads-notification-banner-title-color - タイトル文字色
 * @cssprop --dads-notification-banner-border-color - 外枠色
 * @cssprop --dads-notification-banner-border-width - 外枠線幅
 * @cssprop --dads-notification-banner-border-radius - 角丸
 * @cssprop --dads-notification-banner-chip-color - color-chip左帯色
 * @cssprop --dads-notification-banner-icon-color - アイコン色
 * @cssprop --dads-notification-banner-action-color - アクション色
 *
 * @fires dads-notification-banner-close - 閉じる押下時に発火（detail: { type, variant, dismissMode }）
 * @fires dads-notification-banner-restore - 再表示押下時に発火（detail: { type, variant, dismissMode }）
 *
 * @example
 * ```html
 * <dads-notification-banner type="success" variant="standard" dismissible>
 *   <span slot="title">登録手続きは全て完了しました</span>
 *   <time slot="meta" datetime="2024-07-01">2024年7月1日</time>
 *   <p>ダミーテキストです。</p>
 *   <dads-button slot="actions" variant="outlined">詳細</dads-button>
 *   <dads-button slot="actions" variant="solid">確認</dads-button>
 * </dads-notification-banner>
 * ```
 */
export class DadsNotificationBanner extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsNotificationBanner_instances.add(this);
        _DadsNotificationBanner_base.set(this, null);
        _DadsNotificationBanner_header.set(this, null);
        _DadsNotificationBanner_title.set(this, null);
        _DadsNotificationBanner_close.set(this, null);
        _DadsNotificationBanner_closeLabel.set(this, null);
        _DadsNotificationBanner_body.set(this, null);
        _DadsNotificationBanner_meta.set(this, null);
        _DadsNotificationBanner_description.set(this, null);
        _DadsNotificationBanner_actions.set(this, null);
        _DadsNotificationBanner_restore.set(this, null);
        _DadsNotificationBanner_restoreText.set(this, null);
        _DadsNotificationBanner_restoreButton.set(this, null);
        _DadsNotificationBanner_titleSlot.set(this, null);
        _DadsNotificationBanner_metaSlot.set(this, null);
        _DadsNotificationBanner_descriptionSlot.set(this, null);
        _DadsNotificationBanner_actionsSlot.set(this, null);
        _DadsNotificationBanner_primaryLink.set(this, null);
        _DadsNotificationBanner_abortController.set(this, null);
        _DadsNotificationBanner_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncAll).call(this);
        });
        _DadsNotificationBanner_handleCloseClick.set(this, (event) => {
            // Close interaction should not trigger outer click delegation.
            event.preventDefault();
            event.stopPropagation();
            const detail = {
                type: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getType).call(this),
                variant: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getVariant).call(this),
                dismissMode: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getDismissMode).call(this),
            };
            const shouldClose = this.dispatchEvent(new CustomEvent('dads-notification-banner-close', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail,
            }));
            if (shouldClose) {
                __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_applyDismissState).call(this);
            }
        });
        _DadsNotificationBanner_handleRestoreClick.set(this, (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!this.hasAttribute('data-dismissed'))
                return;
            const detail = {
                type: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getType).call(this),
                variant: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getVariant).call(this),
                dismissMode: __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getDismissMode).call(this),
            };
            this.dispatchEvent(new CustomEvent('dads-notification-banner-restore', {
                bubbles: true,
                composed: true,
                detail,
            }));
            this.hidden = false;
            this.removeAttribute('data-dismissed');
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncAll).call(this);
        });
        _DadsNotificationBanner_handleBaseClick.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_maybeDelegateByInteraction).call(this, event, 'whole');
        });
        _DadsNotificationBanner_handleTitleClick.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_maybeDelegateByInteraction).call(this, event, 'title-and-actions');
        });
        _DadsNotificationBanner_handleBaseKeydown.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_handleLinkDelegationKeydown).call(this, event, 'whole');
        });
        _DadsNotificationBanner_handleTitleKeydown.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_handleLinkDelegationKeydown).call(this, event, 'title-and-actions');
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsNotificationBanner_base, this.shadowRoot?.querySelector('#base') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_header, this.shadowRoot?.querySelector('#header') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_title, this.shadowRoot?.querySelector('#title') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_close, this.shadowRoot?.querySelector('#close'), "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_closeLabel, this.shadowRoot?.querySelector('#close-label') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_body, this.shadowRoot?.querySelector('#body') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_meta, this.shadowRoot?.querySelector('#meta') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_description, this.shadowRoot?.querySelector('#description') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_actions, this.shadowRoot?.querySelector('#actions') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_restore, this.shadowRoot?.querySelector('#restore') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_restoreText, this.shadowRoot?.querySelector('#restore-text') ?? null, "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_restoreButton, this.shadowRoot?.querySelector('#restore-button'), "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_titleSlot, this.shadowRoot?.querySelector('#title-slot'), "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_metaSlot, this.shadowRoot?.querySelector('#meta-slot'), "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_descriptionSlot, this.shadowRoot?.querySelector('#description-slot'), "f");
        __classPrivateFieldSet(this, _DadsNotificationBanner_actionsSlot, this.shadowRoot?.querySelector('#actions-slot'), "f");
        __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_ensureDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_bindEvents).call(this);
        __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsNotificationBanner_abortController, "f")?.abort();
        __classPrivateFieldSet(this, _DadsNotificationBanner_abortController, null, "f");
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        if (!this.isConnected)
            return;
        if (name === 'type' ||
            name === 'variant' ||
            name === 'close-style' ||
            name === 'actions-layout' ||
            name === 'interaction' ||
            name === 'dismiss-mode') {
            __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeEnumAttributes).call(this);
        }
        __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncAll).call(this);
    }
}
_DadsNotificationBanner_base = new WeakMap(), _DadsNotificationBanner_header = new WeakMap(), _DadsNotificationBanner_title = new WeakMap(), _DadsNotificationBanner_close = new WeakMap(), _DadsNotificationBanner_closeLabel = new WeakMap(), _DadsNotificationBanner_body = new WeakMap(), _DadsNotificationBanner_meta = new WeakMap(), _DadsNotificationBanner_description = new WeakMap(), _DadsNotificationBanner_actions = new WeakMap(), _DadsNotificationBanner_restore = new WeakMap(), _DadsNotificationBanner_restoreText = new WeakMap(), _DadsNotificationBanner_restoreButton = new WeakMap(), _DadsNotificationBanner_titleSlot = new WeakMap(), _DadsNotificationBanner_metaSlot = new WeakMap(), _DadsNotificationBanner_descriptionSlot = new WeakMap(), _DadsNotificationBanner_actionsSlot = new WeakMap(), _DadsNotificationBanner_primaryLink = new WeakMap(), _DadsNotificationBanner_abortController = new WeakMap(), _DadsNotificationBanner_handleSlotChange = new WeakMap(), _DadsNotificationBanner_handleCloseClick = new WeakMap(), _DadsNotificationBanner_handleRestoreClick = new WeakMap(), _DadsNotificationBanner_handleBaseClick = new WeakMap(), _DadsNotificationBanner_handleTitleClick = new WeakMap(), _DadsNotificationBanner_handleBaseKeydown = new WeakMap(), _DadsNotificationBanner_handleTitleKeydown = new WeakMap(), _DadsNotificationBanner_instances = new WeakSet(), _DadsNotificationBanner_ensureDefaultAttributes = function _DadsNotificationBanner_ensureDefaultAttributes() {
    for (const [name, value] of DEFAULT_ATTRIBUTE_VALUES) {
        if (!this.hasAttribute(name)) {
            this.setAttribute(name, value);
        }
    }
}, _DadsNotificationBanner_bindEvents = function _DadsNotificationBanner_bindEvents() {
    __classPrivateFieldGet(this, _DadsNotificationBanner_abortController, "f")?.abort();
    __classPrivateFieldSet(this, _DadsNotificationBanner_abortController, new AbortController(), "f");
    const signal = __classPrivateFieldGet(this, _DadsNotificationBanner_abortController, "f").signal;
    __classPrivateFieldGet(this, _DadsNotificationBanner_close, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsNotificationBanner_handleCloseClick, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_restoreButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsNotificationBanner_handleRestoreClick, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsNotificationBanner_handleBaseClick, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsNotificationBanner_handleTitleClick, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsNotificationBanner_handleBaseKeydown, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsNotificationBanner_handleTitleKeydown, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_titleSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsNotificationBanner_handleSlotChange, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_metaSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsNotificationBanner_handleSlotChange, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_descriptionSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsNotificationBanner_handleSlotChange, "f"), { signal });
    __classPrivateFieldGet(this, _DadsNotificationBanner_actionsSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsNotificationBanner_handleSlotChange, "f"), { signal });
}, _DadsNotificationBanner_applyDismissState = function _DadsNotificationBanner_applyDismissState() {
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getDismissMode).call(this) === 'collapse') {
        this.setAttribute('data-dismissed', '');
        this.hidden = false;
        __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncAll).call(this);
        return;
    }
    this.removeAttribute('data-dismissed');
    this.hidden = true;
}, _DadsNotificationBanner_syncAll = function _DadsNotificationBanner_syncAll() {
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeEnumAttributes).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncCloseState).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncSectionVisibility).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncDismissState).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncPrimaryLink).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_syncInteractionState).call(this);
}, _DadsNotificationBanner_normalizeEnumAttributes = function _DadsNotificationBanner_normalizeEnumAttributes() {
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'type', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeType).call(this, value));
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'variant', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeVariant).call(this, value));
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'close-style', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeCloseStyle).call(this, value));
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'actions-layout', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeActionsLayout).call(this, value));
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'interaction', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeInteraction).call(this, value));
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeAttributeValue).call(this, 'dismiss-mode', (value) => __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeDismissMode).call(this, value));
}, _DadsNotificationBanner_normalizeAttributeValue = function _DadsNotificationBanner_normalizeAttributeValue(attrName, normalize) {
    const normalized = normalize(this.getAttribute(attrName));
    if (this.getAttribute(attrName) !== normalized) {
        this.setAttribute(attrName, normalized);
    }
}, _DadsNotificationBanner_syncCloseState = function _DadsNotificationBanner_syncCloseState() {
    if (!__classPrivateFieldGet(this, _DadsNotificationBanner_close, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_closeLabel, "f"))
        return;
    const label = this.getAttribute('close-label') || '閉じる';
    __classPrivateFieldGet(this, _DadsNotificationBanner_close, "f").hidden = !this.hasAttribute('dismissible');
    __classPrivateFieldGet(this, _DadsNotificationBanner_close, "f").setAttribute('aria-label', label);
    __classPrivateFieldGet(this, _DadsNotificationBanner_closeLabel, "f").textContent = label;
}, _DadsNotificationBanner_syncSectionVisibility = function _DadsNotificationBanner_syncSectionVisibility() {
    const hasMeta = hasSlotContent(__classPrivateFieldGet(this, _DadsNotificationBanner_metaSlot, "f"));
    const hasDescription = hasSlotContent(__classPrivateFieldGet(this, _DadsNotificationBanner_descriptionSlot, "f"));
    const hasActions = hasSlotContent(__classPrivateFieldGet(this, _DadsNotificationBanner_actionsSlot, "f"));
    const actionsCount = __classPrivateFieldGet(this, _DadsNotificationBanner_actionsSlot, "f")?.assignedElements({ flatten: true }).length ?? 0;
    __classPrivateFieldGet(this, _DadsNotificationBanner_meta, "f")?.toggleAttribute('hidden', !hasMeta);
    __classPrivateFieldGet(this, _DadsNotificationBanner_description, "f")?.toggleAttribute('hidden', !hasDescription);
    __classPrivateFieldGet(this, _DadsNotificationBanner_actions, "f")?.toggleAttribute('hidden', !hasActions);
    const hasBody = hasMeta || hasDescription;
    __classPrivateFieldGet(this, _DadsNotificationBanner_body, "f")?.toggleAttribute('hidden', !hasBody);
    this.toggleAttribute('data-has-actions', hasActions);
    this.toggleAttribute('data-multiple-actions', actionsCount > 1);
    this.toggleAttribute('data-has-body', hasBody);
}, _DadsNotificationBanner_syncDismissState = function _DadsNotificationBanner_syncDismissState() {
    if (!__classPrivateFieldGet(this, _DadsNotificationBanner_header, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_body, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_actions, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_restore, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_restoreText, "f") || !__classPrivateFieldGet(this, _DadsNotificationBanner_restoreButton, "f")) {
        return;
    }
    const dismissMode = __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getDismissMode).call(this);
    const collapsed = this.hasAttribute('data-dismissed') && dismissMode === 'collapse';
    const restoreLabel = this.getAttribute('restore-label') || '再表示';
    const hasBody = this.hasAttribute('data-has-body');
    const hasActions = this.hasAttribute('data-has-actions');
    if (dismissMode !== 'collapse' && this.hasAttribute('data-dismissed')) {
        this.removeAttribute('data-dismissed');
    }
    __classPrivateFieldGet(this, _DadsNotificationBanner_header, "f").toggleAttribute('hidden', collapsed);
    __classPrivateFieldGet(this, _DadsNotificationBanner_body, "f").toggleAttribute('hidden', collapsed || !hasBody);
    __classPrivateFieldGet(this, _DadsNotificationBanner_actions, "f").toggleAttribute('hidden', collapsed || !hasActions);
    __classPrivateFieldGet(this, _DadsNotificationBanner_restore, "f").toggleAttribute('hidden', !collapsed);
    __classPrivateFieldGet(this, _DadsNotificationBanner_restoreText, "f").textContent = __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_buildRestoreText).call(this);
    __classPrivateFieldGet(this, _DadsNotificationBanner_restoreButton, "f").textContent = restoreLabel;
    __classPrivateFieldGet(this, _DadsNotificationBanner_restoreButton, "f").setAttribute('aria-label', restoreLabel);
}, _DadsNotificationBanner_buildRestoreText = function _DadsNotificationBanner_buildRestoreText() {
    const titleText = __classPrivateFieldGet(this, _DadsNotificationBanner_titleSlot, "f")
        ?.assignedNodes({ flatten: true })
        .map((node) => node.textContent ?? '')
        .join(' ')
        .trim();
    if (!titleText)
        return '閉じた通知';
    return `閉じた通知: ${titleText}`;
}, _DadsNotificationBanner_syncPrimaryLink = function _DadsNotificationBanner_syncPrimaryLink() {
    __classPrivateFieldSet(this, _DadsNotificationBanner_primaryLink, __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_findPrimaryLink).call(this), "f");
}, _DadsNotificationBanner_syncInteractionState = function _DadsNotificationBanner_syncInteractionState() {
    const mode = __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getInteraction).call(this);
    const hasPrimaryLink = __classPrivateFieldGet(this, _DadsNotificationBanner_primaryLink, "f") !== null;
    this.removeAttribute('data-link-target');
    __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.removeAttribute('tabindex');
    __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.removeAttribute('role');
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.removeAttribute('tabindex');
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.removeAttribute('role');
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_isDismissedCollapsed).call(this)) {
        return;
    }
    if (!hasPrimaryLink || mode === 'none' || mode === 'actions-only') {
        return;
    }
    if (mode === 'whole') {
        this.setAttribute('data-link-target', 'whole');
        __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.setAttribute('tabindex', '0');
        __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f")?.setAttribute('role', 'link');
        return;
    }
    this.setAttribute('data-link-target', 'title');
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.setAttribute('tabindex', '0');
    __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f")?.setAttribute('role', 'link');
}, _DadsNotificationBanner_findPrimaryLink = function _DadsNotificationBanner_findPrimaryLink() {
    const fromTitle = __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_findAnchorInSlot).call(this, __classPrivateFieldGet(this, _DadsNotificationBanner_titleSlot, "f"));
    if (fromTitle)
        return fromTitle;
    const fallback = this.querySelector('a[href]');
    if (fallback instanceof HTMLAnchorElement) {
        return fallback;
    }
    return null;
}, _DadsNotificationBanner_findAnchorInSlot = function _DadsNotificationBanner_findAnchorInSlot(slot) {
    if (!slot)
        return null;
    const assigned = slot.assignedElements({ flatten: true });
    for (const element of assigned) {
        if (element instanceof HTMLAnchorElement && element.hasAttribute('href')) {
            return element;
        }
        const anchor = element.querySelector('a[href]');
        if (anchor instanceof HTMLAnchorElement) {
            return anchor;
        }
    }
    return null;
}, _DadsNotificationBanner_handleLinkDelegationKeydown = function _DadsNotificationBanner_handleLinkDelegationKeydown(event, expected) {
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_isDismissedCollapsed).call(this))
        return;
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getInteraction).call(this) !== expected)
        return;
    if (!__classPrivateFieldGet(this, _DadsNotificationBanner_primaryLink, "f"))
        return;
    const key = event.key;
    if (key !== 'Enter' && key !== ' ')
        return;
    const target = event.currentTarget;
    if (expected === 'whole' && target !== __classPrivateFieldGet(this, _DadsNotificationBanner_base, "f"))
        return;
    if (expected === 'title-and-actions' && target !== __classPrivateFieldGet(this, _DadsNotificationBanner_title, "f"))
        return;
    event.preventDefault();
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_activatePrimaryLink).call(this);
}, _DadsNotificationBanner_maybeDelegateByInteraction = function _DadsNotificationBanner_maybeDelegateByInteraction(event, expected) {
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_isDismissedCollapsed).call(this))
        return;
    if (__classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getInteraction).call(this) !== expected)
        return;
    if (!__classPrivateFieldGet(this, _DadsNotificationBanner_primaryLink, "f"))
        return;
    if (event.defaultPrevented)
        return;
    const target = event.target;
    const targetElement = target instanceof Element ? target : null;
    if (targetElement && __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_isInteractiveTarget).call(this, targetElement)) {
        return;
    }
    if (targetElement && __classPrivateFieldGet(this, _DadsNotificationBanner_close, "f")?.contains(targetElement)) {
        return;
    }
    if (targetElement && __classPrivateFieldGet(this, _DadsNotificationBanner_actions, "f")?.contains(targetElement)) {
        return;
    }
    event.preventDefault();
    __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_activatePrimaryLink).call(this);
}, _DadsNotificationBanner_isInteractiveTarget = function _DadsNotificationBanner_isInteractiveTarget(target) {
    return Boolean(target.closest('a[href],button,input,select,textarea,[role=button]'));
}, _DadsNotificationBanner_activatePrimaryLink = function _DadsNotificationBanner_activatePrimaryLink() {
    __classPrivateFieldGet(this, _DadsNotificationBanner_primaryLink, "f")?.click();
}, _DadsNotificationBanner_normalizeType = function _DadsNotificationBanner_normalizeType(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized === 'info1')
        return 'info-1';
    if (normalized === 'info2')
        return 'info-2';
    if (normalized && VALID_TYPES.has(normalized)) {
        return normalized;
    }
    return 'info-1';
}, _DadsNotificationBanner_normalizeVariant = function _DadsNotificationBanner_normalizeVariant(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_VARIANTS.has(normalized)) {
        return normalized;
    }
    return 'standard';
}, _DadsNotificationBanner_normalizeCloseStyle = function _DadsNotificationBanner_normalizeCloseStyle(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_CLOSE_STYLES.has(normalized)) {
        return normalized;
    }
    return 'default';
}, _DadsNotificationBanner_normalizeActionsLayout = function _DadsNotificationBanner_normalizeActionsLayout(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_ACTIONS_LAYOUTS.has(normalized)) {
        return normalized;
    }
    return 'horizontal';
}, _DadsNotificationBanner_normalizeInteraction = function _DadsNotificationBanner_normalizeInteraction(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_INTERACTIONS.has(normalized)) {
        return normalized;
    }
    return 'none';
}, _DadsNotificationBanner_normalizeDismissMode = function _DadsNotificationBanner_normalizeDismissMode(value) {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_DISMISS_MODES.has(normalized)) {
        return normalized;
    }
    return 'hide';
}, _DadsNotificationBanner_getType = function _DadsNotificationBanner_getType() {
    return __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeType).call(this, this.getAttribute('type'));
}, _DadsNotificationBanner_getVariant = function _DadsNotificationBanner_getVariant() {
    return __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeVariant).call(this, this.getAttribute('variant'));
}, _DadsNotificationBanner_getInteraction = function _DadsNotificationBanner_getInteraction() {
    return __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeInteraction).call(this, this.getAttribute('interaction'));
}, _DadsNotificationBanner_getDismissMode = function _DadsNotificationBanner_getDismissMode() {
    return __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_normalizeDismissMode).call(this, this.getAttribute('dismiss-mode'));
}, _DadsNotificationBanner_isDismissedCollapsed = function _DadsNotificationBanner_isDismissedCollapsed() {
    return this.hasAttribute('data-dismissed') && __classPrivateFieldGet(this, _DadsNotificationBanner_instances, "m", _DadsNotificationBanner_getDismissMode).call(this) === 'collapse';
};
DadsNotificationBanner.definition = {
    name: 'dads-notification-banner',
    template: html `
      <div part="base" id="base">
        <div part="header" id="header">
          <div part="icon" id="icon" aria-hidden="true">
            <slot name="icon" id="icon-slot">
              <svg data-default-icon="success" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="成功">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <path d="M9.6 18 3.6 12 5.292 10.308 9.6 14.604l9.108-9.108L20.4 7.2 9.6 18Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="error" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="エラー">
                <path d="M8.25 24 0 15.75v-7.5L8.25 0h7.5L24 8.25v7.5L15.75 24h-7.5Z" fill="currentcolor"></path>
                <path d="m12 13.4-2.85 2.85-1.4-1.4L10.6 12 7.75 9.15l1.4-1.4L12 10.6l2.85-2.85 1.4 1.4L13.4 12l2.85 2.85-1.4 1.4L12 13.4Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="warning" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="警告">
                <path d="M0 20.7273h24L12 0 0 20.7273Z" fill="currentcolor"></path>
                <path d="M13.0909 17.4545h-2.1818v-2.1818h2.1818v2.1818Zm0-4.3636h-2.1818V8.7273h2.1818v4.3636Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="info-1" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="インフォメーション">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <circle cx="12" cy="7.2" r="1.2" fill="Canvas"></circle>
                <path d="M10.8 10.8h2.4V18h-2.4z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="info-2" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="インフォメーション">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <circle cx="12" cy="7.2" r="1.2" fill="Canvas"></circle>
                <path d="M10.8 10.8h2.4V18h-2.4z" fill="Canvas"></path>
              </svg>
            </slot>
          </div>

          <div part="title" id="title">
            <slot name="title" id="title-slot"></slot>
          </div>

          <button part="close" id="close" type="button" hidden>
            <svg part="close-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.4 18.6-1-1 5.5-5.6-5.6-5.6 1.1-1 5.6 5.5 5.6-5.6 1 1.1L13 12l5.6 5.6-1 1L12 13l-5.6 5.6Z" fill="currentcolor"></path>
            </svg>
            <span part="close-label" id="close-label">閉じる</span>
          </button>
        </div>

        <div part="body" id="body">
          <div part="meta" id="meta" hidden>
            <slot name="meta" id="meta-slot"></slot>
          </div>
          <div part="description" id="description" hidden>
            <slot id="description-slot"></slot>
          </div>
        </div>

        <div part="actions" id="actions" hidden>
          <slot name="actions" id="actions-slot"></slot>
        </div>

        <div part="restore" id="restore" hidden>
          <span part="restore-text" id="restore-text"></span>
          <button part="restore-button" id="restore-button" type="button">再表示</button>
        </div>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        notificationBannerTokens,
        notificationBannerStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        { attribute: 'type' },
        { attribute: 'variant' },
        BooleanAttr('dismissible'),
        BooleanAttr('dense'),
        { attribute: 'close-style' },
        { attribute: 'actions-layout' },
        { attribute: 'interaction' },
        { attribute: 'dismiss-mode' },
        { attribute: 'close-label' },
        { attribute: 'restore-label' },
    ],
};
