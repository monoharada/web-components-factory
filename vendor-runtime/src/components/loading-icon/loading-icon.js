/**
 * @module loading-icon
 * デジタル庁デザインシステム LoadingIconコンポーネント
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
var _DadsLoadingIcon_instances, _DadsLoadingIcon_svg, _DadsLoadingIcon_labelEl, _DadsLoadingIcon_setDefaultAttributes, _DadsLoadingIcon_syncAccessibility;
import { html, PropertyAttr, BooleanAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { loadingIconTokens } from './loading-icon-tokens.js';
import { loadingIconStyles } from './loading-icon-styles.js';
/**
 * LoadingIconコンポーネント
 *
 * 砂時計形状の静的アイコンで非同期処理中を表示する。
 * アニメーションなし。dads-iconのlabel/ARIAパターンを踏襲。
 *
 * @customElement
 * @tagname dads-loading-icon
 *
 * @csspart base - ルートコンテナ
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart icon - SVGアイコン要素
 * @csspart label - ラベルテキスト
 *
 * @attr {'sm' | 'lg'} size - サイズ（sm: 24px, lg: 48px）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名（指定時はaria-hidden解除、role="img"、title要素追加）
 *
 * @cssprop --dads-loading-icon-color - アイコン色
 * @cssprop --dads-loading-icon-label-color - ラベルテキスト色
 * @cssprop --dads-loading-icon-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-loading-icon-underlay-border - アンダーレイ枠線色
 *
 * @example
 * ```html
 * <dads-loading-icon label="読み込み中"></dads-loading-icon>
 * <dads-loading-icon size="sm" composition="inlined" label="処理中..."></dads-loading-icon>
 * <dads-loading-icon underlay label="データ取得中"></dads-loading-icon>
 * ```
 */
export class DadsLoadingIcon extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsLoadingIcon_instances.add(this);
        _DadsLoadingIcon_svg.set(this, null);
        _DadsLoadingIcon_labelEl.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsLoadingIcon_svg, this.shadowRoot?.querySelector('[part="icon"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsLoadingIcon_labelEl, this.shadowRoot?.querySelector('[part="label"]') ?? null, "f");
        __classPrivateFieldGet(this, _DadsLoadingIcon_instances, "m", _DadsLoadingIcon_setDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsLoadingIcon_instances, "m", _DadsLoadingIcon_syncAccessibility).call(this);
    }
    labelChanged() {
        __classPrivateFieldGet(this, _DadsLoadingIcon_instances, "m", _DadsLoadingIcon_syncAccessibility).call(this);
    }
}
_DadsLoadingIcon_svg = new WeakMap(), _DadsLoadingIcon_labelEl = new WeakMap(), _DadsLoadingIcon_instances = new WeakSet(), _DadsLoadingIcon_setDefaultAttributes = function _DadsLoadingIcon_setDefaultAttributes() {
    if (!this.hasAttribute('size')) {
        this.setAttribute('size', 'lg');
    }
    if (!this.hasAttribute('composition')) {
        this.setAttribute('composition', 'stacked');
    }
}, _DadsLoadingIcon_syncAccessibility = function _DadsLoadingIcon_syncAccessibility() {
    if (!__classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f") || !__classPrivateFieldGet(this, _DadsLoadingIcon_labelEl, "f"))
        return;
    const labelText = this.getAttribute('label');
    if (labelText && labelText.length > 0) {
        // label set: remove aria-hidden, add role="img" + aria-labelledby + <title>
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").removeAttribute('aria-hidden');
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").setAttribute('role', 'img');
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").setAttribute('aria-labelledby', 'icon-title');
        let title = __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").querySelector(':scope > title');
        if (!title) {
            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").prepend(title);
        }
        title.id = 'icon-title';
        title.textContent = labelText;
        __classPrivateFieldGet(this, _DadsLoadingIcon_labelEl, "f").textContent = labelText;
    }
    else {
        // label unset: add aria-hidden="true", remove role/aria-labelledby/<title>
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").setAttribute('aria-hidden', 'true');
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").removeAttribute('role');
        __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").removeAttribute('aria-labelledby');
        const title = __classPrivateFieldGet(this, _DadsLoadingIcon_svg, "f").querySelector(':scope > title');
        if (title)
            title.remove();
        __classPrivateFieldGet(this, _DadsLoadingIcon_labelEl, "f").textContent = '';
    }
};
DadsLoadingIcon.version = '1.0.0';
DadsLoadingIcon.definition = {
    name: 'dads-loading-icon',
    template: html `
      <div part="base">
        <div part="underlay" aria-hidden="true"></div>
        <svg part="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M14 4v4.01c0 2.12.84 4.16 2.34 5.66L22 19.33c1.1 1.1 1.1 2.9 0 4l-5.66 5.66A7.986 7.986 0 0014 34.65V40h20v-5.35c0-2.12-.84-4.16-2.34-5.66L26 23.33c-1.1-1.1-1.1-2.9 0-4l5.66-5.66A7.986 7.986 0 0034 8.01V4H14zm16 30.65V38H18v-3.35c0-1.59.63-3.12 1.76-4.24L24 26.17l4.24 4.24A5.993 5.993 0 0130 34.65zM30 8.01a5.993 5.993 0 01-1.76 4.24L24 16.49l-4.24-4.24A5.993 5.993 0 0118 8.01V6h12v2.01z" fill="currentColor"/>
        </svg>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        loadingIconTokens,
        loadingIconStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('size'),
        PropertyAttr('composition'),
        BooleanAttr('underlay'),
        PropertyAttr('label'),
    ],
};
