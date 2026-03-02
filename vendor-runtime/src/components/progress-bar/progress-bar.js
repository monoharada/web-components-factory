/**
 * @module progress-bar
 * デジタル庁デザインシステム Progress Barコンポーネント
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
var _DadsProgressBar_instances, _DadsProgressBar_base, _DadsProgressBar_indicator, _DadsProgressBar_labelEl, _DadsProgressBar_setDefaultAttributes, _DadsProgressBar_syncProgress, _DadsProgressBar_syncValueText, _DadsProgressBar_syncLabel;
import { html, PropertyAttr, BooleanAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { progressBarTokens } from './progress-bar-tokens.js';
import { progressBarStyles } from './progress-bar-styles.js';
/**
 * Progress Barコンポーネント
 *
 * 水平バーで進捗状況を表示する。
 * 常にdeterminate（確定値）モードで動作する。不確定状態にはSpinnerを使用する。
 *
 * @customElement
 * @tagname dads-progress-bar
 *
 * @csspart base - ルートコンテナ（role="progressbar"）
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart track - トラックバー（背景）
 * @csspart indicator - インジケーターバー（進捗表示）
 * @csspart label - ラベルテキスト
 *
 * @attr {string} value - 進捗値（0〜max）
 * @attr {string} max - 最大値（デフォルト: 1、0以下は1にクランプ）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名
 * @attr {string} value-text - 人間可読な進捗テキスト（aria-valuetextに反映）
 *
 * @cssprop --dads-progress-bar-track-color - トラック色
 * @cssprop --dads-progress-bar-indicator-color - インジケーター色
 * @cssprop --dads-progress-bar-label-color - ラベルテキスト色
 * @cssprop --dads-progress-bar-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-progress-bar-underlay-border - アンダーレイ枠線色
 *
 * @example
 * ```html
 * <dads-progress-bar value="0.5" label="50%"></dads-progress-bar>
 * <dads-progress-bar value="3" max="10" label="30%"></dads-progress-bar>
 * <!-- 不確定状態には dads-spinner を使用 -->
 * <dads-progress-bar underlay value="0.7" label="70%"></dads-progress-bar>
 * ```
 */
export class DadsProgressBar extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsProgressBar_instances.add(this);
        _DadsProgressBar_base.set(this, null);
        _DadsProgressBar_indicator.set(this, null);
        _DadsProgressBar_labelEl.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsProgressBar_base, this.shadowRoot?.querySelector('[part="base"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsProgressBar_indicator, this.shadowRoot?.querySelector('[part="indicator"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsProgressBar_labelEl, this.shadowRoot?.querySelector('[part="label"]') ?? null, "f");
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_setDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncProgress).call(this);
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncLabel).call(this);
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncValueText).call(this);
    }
    valueChanged() {
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncProgress).call(this);
    }
    maxChanged() {
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncProgress).call(this);
    }
    labelChanged() {
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncLabel).call(this);
    }
    valueTextChanged() {
        __classPrivateFieldGet(this, _DadsProgressBar_instances, "m", _DadsProgressBar_syncValueText).call(this);
    }
}
_DadsProgressBar_base = new WeakMap(), _DadsProgressBar_indicator = new WeakMap(), _DadsProgressBar_labelEl = new WeakMap(), _DadsProgressBar_instances = new WeakSet(), _DadsProgressBar_setDefaultAttributes = function _DadsProgressBar_setDefaultAttributes() {
    if (!this.hasAttribute('composition')) {
        this.setAttribute('composition', 'stacked');
    }
}, _DadsProgressBar_syncProgress = function _DadsProgressBar_syncProgress() {
    if (!__classPrivateFieldGet(this, _DadsProgressBar_base, "f") || !__classPrivateFieldGet(this, _DadsProgressBar_indicator, "f"))
        return;
    const rawValue = this.getAttribute('value');
    const parsedValue = rawValue !== null ? Number(rawValue) : 0;
    const effectiveValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
    const rawMax = this.getAttribute('max');
    const parsedMax = rawMax !== null ? Number(rawMax) : 1;
    const effectiveMax = parsedMax > 0 ? parsedMax : 1;
    const clamped = Math.min(Math.max(0, effectiveValue), effectiveMax);
    const normalized = clamped / effectiveMax;
    const ariaValue = Math.round(normalized * 100);
    __classPrivateFieldGet(this, _DadsProgressBar_indicator, "f").style.setProperty('--progress', String(normalized));
    __classPrivateFieldGet(this, _DadsProgressBar_base, "f").setAttribute('aria-valuenow', String(ariaValue));
    __classPrivateFieldGet(this, _DadsProgressBar_base, "f").setAttribute('aria-valuemin', '0');
    __classPrivateFieldGet(this, _DadsProgressBar_base, "f").setAttribute('aria-valuemax', '100');
}, _DadsProgressBar_syncValueText = function _DadsProgressBar_syncValueText() {
    if (!__classPrivateFieldGet(this, _DadsProgressBar_base, "f"))
        return;
    const valueText = this.getAttribute('value-text');
    if (valueText && valueText.length > 0) {
        __classPrivateFieldGet(this, _DadsProgressBar_base, "f").setAttribute('aria-valuetext', valueText);
    }
    else {
        __classPrivateFieldGet(this, _DadsProgressBar_base, "f").removeAttribute('aria-valuetext');
    }
}, _DadsProgressBar_syncLabel = function _DadsProgressBar_syncLabel() {
    if (!__classPrivateFieldGet(this, _DadsProgressBar_base, "f") || !__classPrivateFieldGet(this, _DadsProgressBar_labelEl, "f"))
        return;
    const labelText = this.getAttribute('label');
    if (labelText && labelText.length > 0) {
        __classPrivateFieldGet(this, _DadsProgressBar_base, "f").setAttribute('aria-label', labelText);
        __classPrivateFieldGet(this, _DadsProgressBar_labelEl, "f").textContent = labelText;
    }
    else {
        __classPrivateFieldGet(this, _DadsProgressBar_base, "f").removeAttribute('aria-label');
        __classPrivateFieldGet(this, _DadsProgressBar_labelEl, "f").textContent = '';
    }
};
DadsProgressBar.version = '1.0.0';
DadsProgressBar.definition = {
    name: 'dads-progress-bar',
    template: html `
      <div part="base" role="progressbar">
        <div part="underlay" aria-hidden="true"></div>
        <div part="track">
          <div part="indicator"></div>
        </div>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        progressBarTokens,
        progressBarStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('value'),
        PropertyAttr('max'),
        PropertyAttr('composition'),
        BooleanAttr('underlay'),
        PropertyAttr('label'),
        PropertyAttr('valueText', 'value-text'),
    ],
};
