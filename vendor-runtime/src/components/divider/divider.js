/**
 * @module divider
 * デジタル庁デザインシステム Dividerコンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsDivider_instances, _DadsDivider_syncEnumAttribute, _DadsDivider_syncAccessibility;
import { html, PropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { dividerTokens } from './divider-tokens.js';
import { dividerStyles } from './divider-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
const VALID_ORIENTATIONS = ['horizontal', 'vertical'];
const VALID_COLORS = ['solid-gray-420', 'solid-gray-536', 'black'];
const VALID_STYLES = ['solid', 'dashed'];
const VALID_WIDTHS = ['1', '2', '3', '4'];
const DEFAULT_ORIENTATION = 'horizontal';
const DEFAULT_COLOR = 'solid-gray-420';
const DEFAULT_STYLE = 'solid';
const DEFAULT_WIDTH = '1';
function normalizeEnum(value, valid, fallback) {
    if (!value)
        return fallback;
    const trimmed = value.trim().toLowerCase();
    return valid.includes(trimmed) ? trimmed : fallback;
}
function normalizeOrientation(value) {
    return normalizeEnum(value, VALID_ORIENTATIONS, DEFAULT_ORIENTATION);
}
function normalizeColor(value) {
    return normalizeEnum(value, VALID_COLORS, DEFAULT_COLOR);
}
function normalizeStyle(value) {
    return normalizeEnum(value, VALID_STYLES, DEFAULT_STYLE);
}
function normalizeWidth(value) {
    return normalizeEnum(value, VALID_WIDTHS, DEFAULT_WIDTH);
}
/**
 * ディバイダーコンポーネント
 *
 * @customElement
 * @tagname dads-divider
 *
 * @csspart line - 区切り線
 *
 * @attr {'horizontal' | 'vertical'} orientation - 区切り方向
 * @attr {'solid-gray-420' | 'solid-gray-536' | 'black'} data-color - 区切り線の色（DADS互換）
 * @attr {'solid' | 'dashed'} data-style - 区切り線の線種（DADS互換）
 * @attr {'1' | '2' | '3' | '4'} data-width - 区切り線の太さ（DADS互換）
 *
 * @cssprop --dads-divider-color - 区切り線の色
 * @cssprop --dads-divider-style - 区切り線の線種
 * @cssprop --dads-divider-width - 区切り線の太さ
 * @cssprop --dads-divider-margin - 区切り余白（shorthand）。例: `8px 0`
 * @cssprop --dads-divider-margin-vertical - 垂直方向時の区切り余白（shorthand）。未指定時は block/inline から自動生成
 * @cssprop --dads-divider-margin-block - 上下余白
 * @cssprop --dads-divider-margin-inline - 左右余白
 * @cssprop --dads-divider-margin-block-start - 上側余白
 * @cssprop --dads-divider-margin-block-end - 下側余白
 * @cssprop --dads-divider-margin-inline-start - 左側余白
 * @cssprop --dads-divider-margin-inline-end - 右側余白
 * @cssprop --dads-divider-vertical-length - 垂直方向時の線長
 *
 * @example
 * ```html
 * <dads-divider></dads-divider>
 * <dads-divider data-color="black" data-style="dashed" data-width="2"></dads-divider>
 * <dads-divider orientation="vertical"></dads-divider>
 * ```
 */
export class DadsDivider extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsDivider_instances.add(this);
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, {
            orientation: DEFAULT_ORIENTATION,
            'data-color': DEFAULT_COLOR,
            'data-style': DEFAULT_STYLE,
            'data-width': DEFAULT_WIDTH,
        });
        __classPrivateFieldGet(this, _DadsDivider_instances, "m", _DadsDivider_syncAccessibility).call(this);
    }
    orientationChanged(_oldValue, newValue) {
        const normalized = normalizeOrientation(newValue);
        if (newValue !== normalized) {
            this.setAttribute('orientation', normalized);
            return;
        }
        __classPrivateFieldGet(this, _DadsDivider_instances, "m", _DadsDivider_syncAccessibility).call(this);
    }
    dataColorChanged(_oldValue, newValue) {
        __classPrivateFieldGet(this, _DadsDivider_instances, "m", _DadsDivider_syncEnumAttribute).call(this, 'data-color', newValue, normalizeColor);
    }
    dataStyleChanged(_oldValue, newValue) {
        __classPrivateFieldGet(this, _DadsDivider_instances, "m", _DadsDivider_syncEnumAttribute).call(this, 'data-style', newValue, normalizeStyle);
    }
    dataWidthChanged(_oldValue, newValue) {
        __classPrivateFieldGet(this, _DadsDivider_instances, "m", _DadsDivider_syncEnumAttribute).call(this, 'data-width', newValue, normalizeWidth);
    }
}
_DadsDivider_instances = new WeakSet(), _DadsDivider_syncEnumAttribute = function _DadsDivider_syncEnumAttribute(name, value, normalizer) {
    const normalized = normalizer(value);
    if (value !== normalized)
        this.setAttribute(name, normalized);
}, _DadsDivider_syncAccessibility = function _DadsDivider_syncAccessibility() {
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-orientation', orientation);
};
DadsDivider.version = '1.0.0';
DadsDivider.definition = {
    name: 'dads-divider',
    template: html `
      <hr part="line" id="line" aria-hidden="true">
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        dividerTokens,
        dividerStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('orientation'),
        PropertyAttr('dataColor', 'data-color'),
        PropertyAttr('dataStyle', 'data-style'),
        PropertyAttr('dataWidth', 'data-width'),
    ],
};
