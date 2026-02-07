/**
 * @module list
 * デジタル庁デザインシステム 箇条書きリスト（List / List Item）コンポーネント
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
var _DadsList_instances, _DadsList_rawDepth, _DadsList_syncVariant, _DadsList_applyDefaultAttributes, _DadsList_syncSpacing, _DadsList_syncRawDepth, _DadsList_syncClampedDepth, _DadsList_syncVariantRenderingVars, _DadsList_syncMarkerWidth;
import { html, PropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { listTokens, listItemTokens } from './list-tokens.js';
import { listStyles, listItemStyles } from './list-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
const VALID_VARIANTS = ['marker', 'number'];
const VALID_SPACINGS = ['lg', 'md', 'sm'];
function normalizeVariant(value) {
    if (!value)
        return 'marker';
    const trimmed = value.trim().toLowerCase();
    return VALID_VARIANTS.includes(trimmed) ? trimmed : 'marker';
}
function normalizeSpacing(value) {
    if (!value)
        return 'md';
    const trimmed = value.trim().toLowerCase();
    return VALID_SPACINGS.includes(trimmed) ? trimmed : 'md';
}
function parseMarkerWidth(value) {
    if (!value)
        return null;
    const n = Number(String(value).trim());
    if (Number.isNaN(n) || n <= 0)
        return null;
    return n;
}
function findNearestAncestorList(element) {
    let node = element.parentElement;
    while (node) {
        if (node.tagName.toLowerCase() === 'dads-list')
            return node;
        node = node.parentElement;
    }
    return null;
}
/**
 * 箇条書きリスト（コンテナ）コンポーネント
 *
 * @customElement
 * @tagname dads-list
 *
 * @slot default - リスト項目（dads-list-item）
 *
 * @csspart base - role="list" のルート
 *
 * @attr {'marker' | 'number'} variant - 表示タイプ（リストマーク / 項番）
 * @attr {'lg' | 'md' | 'sm'} spacing - 項目間隔（12/8/4）
 * @attr {number} marker-width - 項番タイプのマーカー幅（全角n文字相当、CSSでは n em）
 *
 * @cssprop --dads-list-indent - インデント（depthに応じて設定）
 * @cssprop --dads-list-item-gap - アイテム間隔（spacingに応じて設定）
 * @cssprop --dads-list-marker-width - マーカー列の幅（marker-widthで上書き可能）
 * @cssprop --dads-list-marker-gap - マーカー列と本文列の間隔
 * @cssprop --dads-list-marker-color - マーカー色
 * @cssprop --dads-list-marker-size - マーカー記号のサイズ（markerタイプ向け）
 * @cssprop --dads-list-marker-content - リストマーク（markerタイプ用、装飾用途）
 * @cssprop --dads-list-marker-content-1 - マーカー種別1（depth1）
 * @cssprop --dads-list-marker-content-2 - マーカー種別2（depth2-4）
 * @cssprop --dads-list-marker-content-3 - マーカー種別3（depth5+）
 *
 * @example
 * ```html
 * <!-- リストマークタイプ -->
 * <dads-list variant="marker" spacing="md">
 *   <dads-list-item>項目</dads-list-item>
 *   <dads-list-item>項目</dads-list-item>
 * </dads-list>
 *
 * <!-- 項番タイプ（<ol>は使わず、項番は地のテキストとして記載） -->
 * <dads-list variant="number" marker-width="2">
 *   <dads-list-item>
 *     <span slot="marker">1.</span>
 *     本文
 *   </dads-list-item>
 * </dads-list>
 * ```
 */
export class DadsList extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsList_instances.add(this);
        _DadsList_rawDepth.set(this, 1);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_applyDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncVariant).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncSpacing).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncVariantRenderingVars).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncRawDepth).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncClampedDepth).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncMarkerWidth).call(this);
    }
    variantChanged(_oldValue, newValue) {
        const normalized = normalizeVariant(newValue);
        if (newValue !== normalized) {
            this.setAttribute('variant', normalized);
            return;
        }
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncVariantRenderingVars).call(this);
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncClampedDepth).call(this);
    }
    spacingChanged(_oldValue, newValue) {
        const normalized = normalizeSpacing(newValue);
        if (newValue !== normalized) {
            this.setAttribute('spacing', normalized);
        }
    }
    markerWidthChanged() {
        __classPrivateFieldGet(this, _DadsList_instances, "m", _DadsList_syncMarkerWidth).call(this);
    }
}
_DadsList_rawDepth = new WeakMap(), _DadsList_instances = new WeakSet(), _DadsList_syncVariant = function _DadsList_syncVariant() {
    const normalized = normalizeVariant(this.getAttribute('variant'));
    if (this.getAttribute('variant') !== normalized)
        this.setAttribute('variant', normalized);
}, _DadsList_applyDefaultAttributes = function _DadsList_applyDefaultAttributes() {
    setDefaultAttributes(this, {
        variant: 'marker',
    });
    if (this.hasAttribute('spacing'))
        return;
    const ancestor = findNearestAncestorList(this);
    if (!ancestor) {
        this.setAttribute('spacing', 'md');
        return;
    }
    const inherited = normalizeSpacing(ancestor.getAttribute('spacing'));
    this.setAttribute('spacing', inherited);
}, _DadsList_syncSpacing = function _DadsList_syncSpacing() {
    const normalized = normalizeSpacing(this.getAttribute('spacing'));
    if (this.getAttribute('spacing') !== normalized)
        this.setAttribute('spacing', normalized);
}, _DadsList_syncRawDepth = function _DadsList_syncRawDepth() {
    // Count ancestor dads-list elements in the light DOM tree (excluding self).
    let depth = 1;
    let el = this.parentElement;
    while (el) {
        if (el.tagName.toLowerCase() === 'dads-list')
            depth += 1;
        el = el.parentElement;
    }
    __classPrivateFieldSet(this, _DadsList_rawDepth, depth, "f");
}, _DadsList_syncClampedDepth = function _DadsList_syncClampedDepth() {
    const variant = normalizeVariant(this.getAttribute('variant'));
    const max = variant === 'marker' ? 6 : 5;
    const clamped = Math.max(1, Math.min(max, __classPrivateFieldGet(this, _DadsList_rawDepth, "f")));
    this.setAttribute('data-depth', String(clamped));
}, _DadsList_syncVariantRenderingVars = function _DadsList_syncVariantRenderingVars() {
    const isNumber = normalizeVariant(this.getAttribute('variant')) === 'number';
    this.style.setProperty('--dads-list-marker-slot-display', isNumber ? 'inline' : 'none');
}, _DadsList_syncMarkerWidth = function _DadsList_syncMarkerWidth() {
    const n = parseMarkerWidth(this.getAttribute('marker-width'));
    if (n === null) {
        this.style.removeProperty('--dads-list-marker-width');
        return;
    }
    this.style.setProperty('--dads-list-marker-width', `${n}em`);
};
DadsList.version = '1.0.0';
DadsList.definition = {
    name: 'dads-list',
    template: html `
      <div part="base" role="list">
        <slot></slot>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        listTokens,
        listStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('variant'),
        PropertyAttr('spacing'),
        PropertyAttr('markerWidth', 'marker-width'),
    ],
};
/**
 * 箇条書きリスト（アイテム）コンポーネント
 *
 * @customElement
 * @tagname dads-list-item
 *
 * @slot marker - 項番（numberタイプ向け、コピー可能な“地のテキスト”）
 * @slot default - 本文（ネストした dads-list を含められます）
 *
 * @csspart item - role="listitem" のルート
 * @csspart marker - マーカー列
 * @csspart marker-glyph - 予備のマーカー記号領域（通常は非表示）
 * @csspart content - 本文列
 *
 * @cssprop --dads-list-marker-width - マーカー列の幅
 * @cssprop --dads-list-marker-gap - マーカー列と本文列の間隔
 * @cssprop --dads-list-marker-color - マーカー色
 * @cssprop --dads-list-marker-size - マーカー記号のサイズ（markerタイプ向け）
 * @cssprop --dads-list-marker-content - リストマーク（markerタイプ用、装飾用途）
 */
export class DadsListItem extends TypographyWebComponent {
}
DadsListItem.version = '1.0.0';
DadsListItem.definition = {
    name: 'dads-list-item',
    template: html `
      <div part="item" role="listitem">
        <span part="marker">
          <span part="marker-glyph" aria-hidden="true"></span>
          <slot name="marker"></slot>
        </span>
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        listItemTokens,
        listItemStyles,
    ], 'minimal'),
    attributes: [],
};
