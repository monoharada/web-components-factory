/**
 * @module spinner
 * デジタル庁デザインシステム Spinnerコンポーネント
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
var _DadsSpinner_instances, _DadsSpinner_base, _DadsSpinner_labelEl, _DadsSpinner_setDefaultAttributes, _DadsSpinner_syncLabel;
import { html, PropertyAttr, BooleanAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { spinnerTokens } from './spinner-tokens.js';
import { spinnerStyles } from './spinner-styles.js';
/**
 * Spinnerコンポーネント
 *
 * 円形の回転アニメーションで非同期処理中を表示する。
 * indeterminate専用（進捗率の表示には dads-progress-bar を使用）。
 *
 * @customElement
 * @tagname dads-spinner
 *
 * @csspart base - ルートコンテナ（role="progressbar"）
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart svg - SVGコンテナ
 * @csspart track - トラックリング（背景ドーナツ）
 * @csspart border - 外周ボーダーライン
 * @csspart indicator - インジケーター円（アニメーション）
 * @csspart label - ラベルテキスト
 *
 * @attr {'sm' | 'lg'} size - サイズ（sm: 24px, lg: 48px）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {'slow' | 'normal' | 'fast'} speed - アニメーション速度
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名
 *
 * @cssprop --dads-spinner-track-color - トラック色
 * @cssprop --dads-spinner-indicator-color - インジケーター色
 * @cssprop --dads-spinner-label-color - ラベルテキスト色
 * @cssprop --dads-spinner-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-spinner-underlay-border - アンダーレイ枠線色
 * @cssprop --dads-spinner-rotate-duration - 回転アニメーション速度
 * @cssprop --dads-spinner-dash-duration - ダッシュアニメーション速度
 *
 * @example
 * ```html
 * <dads-spinner label="読み込み中"></dads-spinner>
 * <dads-spinner size="sm" composition="inlined" label="処理中..."></dads-spinner>
 * <dads-spinner underlay label="データ取得中"></dads-spinner>
 * ```
 */
export class DadsSpinner extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsSpinner_instances.add(this);
        _DadsSpinner_base.set(this, null);
        _DadsSpinner_labelEl.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsSpinner_base, this.shadowRoot?.querySelector('[part="base"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsSpinner_labelEl, this.shadowRoot?.querySelector('[part="label"]') ?? null, "f");
        __classPrivateFieldGet(this, _DadsSpinner_instances, "m", _DadsSpinner_setDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsSpinner_instances, "m", _DadsSpinner_syncLabel).call(this);
        const labelValue = this.getAttribute('label');
        if (!labelValue || labelValue.length === 0) {
            console.warn('[dads-spinner] label属性が未指定です。スクリーンリーダーのために label 属性を設定してください。');
        }
    }
    labelChanged() {
        __classPrivateFieldGet(this, _DadsSpinner_instances, "m", _DadsSpinner_syncLabel).call(this);
    }
}
_DadsSpinner_base = new WeakMap(), _DadsSpinner_labelEl = new WeakMap(), _DadsSpinner_instances = new WeakSet(), _DadsSpinner_setDefaultAttributes = function _DadsSpinner_setDefaultAttributes() {
    if (!this.hasAttribute('size')) {
        this.setAttribute('size', 'lg');
    }
    if (!this.hasAttribute('composition')) {
        this.setAttribute('composition', 'stacked');
    }
    if (!this.hasAttribute('speed')) {
        this.setAttribute('speed', 'normal');
    }
}, _DadsSpinner_syncLabel = function _DadsSpinner_syncLabel() {
    if (!__classPrivateFieldGet(this, _DadsSpinner_base, "f") || !__classPrivateFieldGet(this, _DadsSpinner_labelEl, "f"))
        return;
    const labelText = this.getAttribute('label');
    if (labelText && labelText.length > 0) {
        __classPrivateFieldGet(this, _DadsSpinner_base, "f").setAttribute('aria-label', labelText);
        __classPrivateFieldGet(this, _DadsSpinner_labelEl, "f").textContent = labelText;
    }
    else {
        __classPrivateFieldGet(this, _DadsSpinner_base, "f").removeAttribute('aria-label');
        __classPrivateFieldGet(this, _DadsSpinner_labelEl, "f").textContent = '';
    }
};
DadsSpinner.version = '1.0.0';
DadsSpinner.definition = {
    name: 'dads-spinner',
    template: html `
      <div part="base" role="progressbar">
        <div part="underlay" aria-hidden="true"></div>
        <svg part="svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle part="track" cx="24" cy="24" r="20" />
          <circle part="border" cx="24" cy="24" r="22" />
          <circle part="indicator" cx="24" cy="24" r="20"
                  fill="none" stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="31.42 125.66" />
        </svg>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        spinnerTokens,
        spinnerStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('size'),
        PropertyAttr('composition'),
        PropertyAttr('speed'),
        BooleanAttr('underlay'),
        PropertyAttr('label'),
    ],
};
