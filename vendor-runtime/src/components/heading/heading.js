/**
 * @module heading
 * デジタル庁デザインシステム 見出しコンポーネント
 * @version 1.0.0
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
var _DadsHeading_instances, _DadsHeading_shoulderSlot, _DadsHeading_iconSlot, _DadsHeading_slotObserver, _DadsHeading_onSlotChange, _DadsHeading_syncLevel, _DadsHeading_syncSize, _DadsHeading_syncRule, _DadsHeading_syncMargin, _DadsHeading_setupSlots, _DadsHeading_cleanupSlots;
import { html, PropertyAttr, BooleanAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { headingTokens } from './heading-tokens.js';
import { headingStyles } from './heading-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { hasSlotContent } from '../../utils/dom.js';
const VALID_LEVELS = ['1', '2', '3', '4', '5', '6'];
const VALID_SIZES = ['64', '57', '45', '36', '32', '28', '24', '20', '18', '16'];
const VALID_RULES = ['8', '6', '4', '2'];
const VALID_MARGINS = ['none', 'top'];
const normalizeLevel = (value) => {
    if (!value)
        return '2';
    const trimmed = value.trim().toLowerCase();
    const numeric = trimmed.startsWith('h') ? trimmed.slice(1) : trimmed;
    return VALID_LEVELS.includes(numeric) ? numeric : '2';
};
const normalizeSize = (value) => {
    if (!value)
        return '36';
    return VALID_SIZES.includes(value) ? value : '36';
};
const normalizeRule = (value) => {
    if (value === null)
        return null;
    if (value === '')
        return '6';
    return VALID_RULES.includes(value) ? value : '6';
};
const normalizeMargin = (value) => {
    if (!value)
        return 'none';
    return VALID_MARGINS.includes(value) ? value : 'none';
};
/**
 * 見出しコンポーネント
 *
 * @customElement
 * @tagname dads-heading
 *
 * @slot default - 見出しテキスト
 * @slot shoulder - ショルダーテキスト
 * @slot icon - 先頭アイコン
 *
 * 挙動メモ:
 * - `slot="shoulder"` と `slot="icon"` は同時に指定できます（shoulderは上、iconは見出し行の先頭）。
 * - slot が無い場合は該当パーツは表示されません（内部で `data-has-*` を付与して制御）。
 * - `chip` / `rule` は装飾（意匠）です。情報の唯一の手掛かりにしないでください。
 *
 * @csspart group - 見出しグループ
 * @csspart chip - 左チップ（装飾）※ 注釈用アンカーも兼ねる
 * @csspart shoulder - ショルダーテキスト
 * @csspart heading - 見出し本体
 * @csspart icon - アイコンラッパー
 *
 * @attr {string} level - 見出しレベル（1-6 or h1-h6）
 * @attr {string} size - 見出しサイズ（64|57|45|36|32|28|24|20|18|16）
 * @attr {string} margin - 上マージン（none|top）
 * @attr {string} rule - 下線の太さ（8|6|4|2）
 * @attr {boolean} chip - 左チップ（装飾）表示
 *
 * @cssprop --dads-heading-color - 文字色
 * @cssprop --dads-heading-font-size - 見出しフォントサイズ
 * @cssprop --dads-heading-line-height - 行高
 * @cssprop --dads-heading-letter-spacing - 文字間隔
 * @cssprop --dads-heading-shoulder-font-size - ショルダーのフォントサイズ
 * @cssprop --dads-heading-icon-size - アイコンサイズ
 * @cssprop --dads-heading-icon-gap - アイコンと本文の間隔
 * @cssprop --dads-heading-icon-vertical-align - アイコンのベースライン補正（vertical-align）
 * @cssprop --dads-heading-margin-block-start - 上マージン
 * @cssprop --dads-heading-chip-color - チップ色
 * @cssprop --dads-heading-chip-width - チップの幅
 * @cssprop --dads-heading-chip-padding-inline - チップのインライン余白
 * @cssprop --dads-heading-chip-top - チップの上位置
 * @cssprop --dads-heading-chip-bottom - チップの下位置
 * @cssprop --dads-heading-rule-color - ルール色
 *
 * @example
 * ```html
 * <dads-heading level="2" size="36">見出し</dads-heading>
 * <dads-heading level="3" size="28" margin="top">小見出し</dads-heading>
 * <dads-heading level="2" size="36" chip rule="6">見出し</dads-heading>
 * <dads-heading level="2" size="36">
 *   <span slot="shoulder">ショルダー</span>
 *   見出し
 * </dads-heading>
 * <dads-heading level="2" size="36">
 *   <span slot="icon" aria-hidden="true">★</span>
 *   見出し
 * </dads-heading>
 *
 * <!-- shoulder + icon は同時に使えます -->
 * <dads-heading level="2" size="36">
 *   <span slot="shoulder">カテゴリ</span>
 *   <svg slot="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="..."></path></svg>
 *   見出し
 * </dads-heading>
 * ```
 */
export class DadsHeading extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsHeading_instances.add(this);
        _DadsHeading_shoulderSlot.set(this, null);
        _DadsHeading_iconSlot.set(this, null);
        _DadsHeading_slotObserver.set(this, null);
        _DadsHeading_onSlotChange.set(this, () => {
            const hasSlotShoulder = hasSlotContent(__classPrivateFieldGet(this, _DadsHeading_shoulderSlot, "f")) || !!this.querySelector('[slot="shoulder"]');
            const hasSlotIcon = hasSlotContent(__classPrivateFieldGet(this, _DadsHeading_iconSlot, "f")) || !!this.querySelector('[slot="icon"]');
            const hasChip = this.hasAttribute('chip');
            const hasShoulder = hasSlotShoulder;
            const hasIcon = hasSlotIcon;
            this.toggleAttribute('data-has-chip', hasChip);
            this.toggleAttribute('data-has-shoulder', hasShoulder);
            this.toggleAttribute('data-has-icon', hasIcon);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, {
            level: '2',
            size: '36',
            margin: 'none',
        });
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'heading');
        }
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_syncLevel).call(this);
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_syncSize).call(this);
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_syncRule).call(this);
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_syncMargin).call(this);
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_setupSlots).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsHeading_instances, "m", _DadsHeading_cleanupSlots).call(this);
        super.disconnectedCallback();
    }
    levelChanged(_oldValue, newValue) {
        const normalized = normalizeLevel(newValue);
        if (newValue !== normalized) {
            this.setAttribute('level', normalized);
            return;
        }
        this.setAttribute('aria-level', normalized);
    }
    sizeChanged(_oldValue, newValue) {
        const normalized = normalizeSize(newValue);
        if (newValue !== normalized) {
            this.setAttribute('size', normalized);
        }
    }
    chipChanged(_oldValue, _newValue) {
        __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f").call(this);
    }
    ruleChanged(_oldValue, newValue) {
        const normalized = normalizeRule(newValue);
        if (normalized === null)
            return;
        if (newValue !== normalized) {
            this.setAttribute('rule', normalized);
        }
    }
    marginChanged(_oldValue, newValue) {
        const normalized = normalizeMargin(newValue);
        if (newValue !== normalized) {
            this.setAttribute('margin', normalized);
        }
    }
}
_DadsHeading_shoulderSlot = new WeakMap(), _DadsHeading_iconSlot = new WeakMap(), _DadsHeading_slotObserver = new WeakMap(), _DadsHeading_onSlotChange = new WeakMap(), _DadsHeading_instances = new WeakSet(), _DadsHeading_syncLevel = function _DadsHeading_syncLevel() {
    const normalized = normalizeLevel(this.getAttribute('level'));
    if (this.getAttribute('level') !== normalized) {
        this.setAttribute('level', normalized);
    }
    this.setAttribute('aria-level', normalized);
}, _DadsHeading_syncSize = function _DadsHeading_syncSize() {
    const normalized = normalizeSize(this.getAttribute('size'));
    if (this.getAttribute('size') !== normalized) {
        this.setAttribute('size', normalized);
    }
}, _DadsHeading_syncRule = function _DadsHeading_syncRule() {
    const normalized = normalizeRule(this.getAttribute('rule'));
    if (normalized === null)
        return;
    if (this.getAttribute('rule') !== normalized) {
        this.setAttribute('rule', normalized);
    }
}, _DadsHeading_syncMargin = function _DadsHeading_syncMargin() {
    const normalized = normalizeMargin(this.getAttribute('margin'));
    if (this.getAttribute('margin') !== normalized) {
        this.setAttribute('margin', normalized);
    }
}, _DadsHeading_setupSlots = function _DadsHeading_setupSlots() {
    __classPrivateFieldSet(this, _DadsHeading_shoulderSlot, this.shadowRoot?.querySelector('slot[name="shoulder"]') ?? null, "f");
    __classPrivateFieldSet(this, _DadsHeading_iconSlot, this.shadowRoot?.querySelector('slot[name="icon"]') ?? null, "f");
    __classPrivateFieldGet(this, _DadsHeading_shoulderSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsHeading_iconSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f"));
    // slotchange が発火しない環境向けに Light DOM を監視
    __classPrivateFieldSet(this, _DadsHeading_slotObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f").call(this)), "f");
    __classPrivateFieldGet(this, _DadsHeading_slotObserver, "f").observe(this, {
        attributes: true,
        attributeFilter: ['slot'],
        characterData: true,
        childList: true,
        subtree: true,
    });
    __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f").call(this);
}, _DadsHeading_cleanupSlots = function _DadsHeading_cleanupSlots() {
    __classPrivateFieldGet(this, _DadsHeading_shoulderSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsHeading_iconSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsHeading_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsHeading_slotObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsHeading_slotObserver, null, "f");
};
DadsHeading.version = '1.0.0';
DadsHeading.definition = {
    name: 'dads-heading',
    template: html `
      <div part="group">
        <span part="chip" aria-hidden="true"></span>
        <span part="shoulder" id="shoulder">
          <slot name="shoulder"></slot>
        </span>
        <span part="heading" id="heading">
          <span part="icon" id="icon">
            <slot name="icon"></slot>
          </span>
          <slot></slot>
        </span>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        headingTokens,
        headingStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('level'),
        PropertyAttr('size'),
        PropertyAttr('margin'),
        PropertyAttr('rule'),
        BooleanAttr('chip'),
    ],
};
