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
          <path d="M24 24C34.5 24 35.5 6 35.5 4.78V4M24 24C13.5 24 12.5 6 12.5 4.78V4M24 24C31 24 35.5 35.79 35.5 42.26V44M24 24C17 24 12.5 35.79 12.5 42.26V44M9 4H39M9 44H39" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M17 15C17 17.5 19.241 22 24 22C28.759 22 31 17 31 15H17Z" fill="currentColor"/>
          <path d="M15 42C16.895 42 31.579 42 33 42C33 40.001 32 37.5 32 37.5L24 34L16 37.5C16 37.5 15 40.001 15 42Z" fill="currentColor"/>
          <circle cx="24" cy="28" r="1" fill="currentColor"/>
          <circle cx="24" cy="31" r="1" fill="currentColor"/>
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
