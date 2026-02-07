/**
 * @module switch
 * デジタル庁デザインシステム Switchコンポーネント
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
var _DadsSwitch_instances, _DadsSwitch_checkbox, _DadsSwitch_labelLeft, _DadsSwitch_labelRight, _DadsSwitch_value, _DadsSwitch_syncAllState, _DadsSwitch_initCheckbox, _DadsSwitch_handleKeydown, _DadsSwitch_triggerChange, _DadsSwitch_initLabels, _DadsSwitch_handleLabelClick, _DadsSwitch_syncCheckboxAttributes, _DadsSwitch_updateFormValue, _DadsSwitch_handleChange, _DadsSwitch_syncAriaChecked;
import { html, BooleanAttr, PropertyAttr, } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { switchTokens } from './switch-tokens.js';
import { switchStyles } from './switch-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
/**
 * Switchコンポーネント
 *
 * @customElement dads-switch
 * @tagname dads-switch
 *
 * @slot label-left - 左側ラベル
 * @slot label-right - 右側ラベル
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label-left - 左側ラベルコンテナ
 * @csspart label-right - 右側ラベルコンテナ
 * @csspart switch - スイッチのlabel要素
 * @csspart checkbox - 内部チェックボックス（visually hidden）
 * @csspart track - スイッチのトラック（背景）
 * @csspart knob - スイッチのノブ（つまみ）
 *
 * @attr {boolean} checked - スイッチの状態
 * @attr {boolean} disabled - 無効状態
 * @attr {string} name - フォーム名
 * @attr {string} value - チェック時のフォーム値（デフォルト: "on"）
 * @attr {string} size - サイズ（sm / md / lg）デフォルト: md
 *
 * @fires dads-change - 状態変更時に発火
 *
 * @example
 * ```html
 * <dads-switch>
 *   <span slot="label-left">OFF</span>
 *   <span slot="label-right">ON</span>
 * </dads-switch>
 * ```
 */
export class DadsSwitch extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsSwitch_instances.add(this);
        /**
         * アクセシビリティ注釈メタデータ
         * a11y-annotateコンポーネントが参照
         */
        // Private fields
        _DadsSwitch_checkbox.set(this, null);
        _DadsSwitch_labelLeft.set(this, null);
        _DadsSwitch_labelRight.set(this, null);
        _DadsSwitch_value.set(this, 'on');
        _DadsSwitch_handleKeydown.set(this, (event) => {
            // disabled時は無視
            if (this.hasAttribute('disabled'))
                return;
            switch (event.key) {
                case 'Enter':
                    // Enterでトグル
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.click();
                    break;
                case 'ArrowLeft':
                    // 左矢印でOFF
                    event.preventDefault();
                    if (this.hasAttribute('checked')) {
                        this.removeAttribute('checked');
                        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_triggerChange).call(this, false);
                    }
                    break;
                case 'ArrowRight':
                    // 右矢印でON
                    event.preventDefault();
                    if (!this.hasAttribute('checked')) {
                        this.setAttribute('checked', '');
                        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_triggerChange).call(this, true);
                    }
                    break;
            }
        });
        _DadsSwitch_handleLabelClick.set(this, () => {
            // disabled時は無視
            if (this.hasAttribute('disabled'))
                return;
            // checkboxをクリックしてトグル
            __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.click();
        });
        _DadsSwitch_handleChange.set(this, () => {
            if (!__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f"))
                return;
            // checked属性を同期
            if (__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked) {
                this.setAttribute('checked', '');
            }
            else {
                this.removeAttribute('checked');
            }
            // aria-checked更新
            __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").setAttribute('aria-checked', __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked ? 'true' : 'false');
            // フォーム値更新
            __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
            // カスタムイベント発火
            this.emitEvent('dads-change', { checked: __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked });
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // デフォルト属性の設定
        setDefaultAttributes(this, { size: 'md' });
        // 内部要素の参照を取得
        __classPrivateFieldSet(this, _DadsSwitch_checkbox, this.shadowRoot?.querySelector('[part="checkbox"]'), "f");
        __classPrivateFieldSet(this, _DadsSwitch_labelLeft, this.shadowRoot?.querySelector('[part="label-left"]'), "f");
        __classPrivateFieldSet(this, _DadsSwitch_labelRight, this.shadowRoot?.querySelector('[part="label-right"]'), "f");
        // 初期化
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_initCheckbox).call(this);
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_initLabels).call(this);
        // 属性が接続後に設定された場合のために再同期
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        // イベントリスナーのクリーンアップ
        __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsSwitch_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsSwitch_handleKeydown, "f"));
        __classPrivateFieldGet(this, _DadsSwitch_labelLeft, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsSwitch_handleLabelClick, "f"));
        __classPrivateFieldGet(this, _DadsSwitch_labelRight, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsSwitch_handleLabelClick, "f"));
    }
    // BooleanAttr('checked')から呼び出されるコールバック
    checkedChanged() {
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_syncAriaChecked).call(this, this.hasAttribute('checked'));
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        // shadowRootが無い場合は無視（connectedCallback前）
        if (!this.shadowRoot)
            return;
        // checkboxを常にshadowRootから取得（キャッシュを使わない）
        const checkbox = this.shadowRoot.querySelector('[part="checkbox"]');
        if (!checkbox)
            return;
        switch (name) {
            case 'checked':
                checkbox.checked = this.hasAttribute('checked');
                checkbox.setAttribute('aria-checked', this.hasAttribute('checked') ? 'true' : 'false');
                __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
                break;
            case 'disabled':
                checkbox.disabled = this.hasAttribute('disabled');
                break;
            case 'name':
                if (newValue !== null) {
                    checkbox.setAttribute('name', newValue);
                }
                else {
                    checkbox.removeAttribute('name');
                }
                break;
            case 'value':
                __classPrivateFieldSet(this, _DadsSwitch_value, newValue ?? 'on', "f");
                __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
                break;
        }
    }
    // Public API
    get checked() {
        return this.hasAttribute('checked');
    }
    set checked(value) {
        if (value) {
            this.setAttribute('checked', '');
        }
        else {
            this.removeAttribute('checked');
        }
        // 直接aria-checkedも更新（attributeChangedCallbackの補完）
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_syncAriaChecked).call(this, value);
    }
    get value() {
        return __classPrivateFieldGet(this, _DadsSwitch_value, "f");
    }
    set value(v) {
        __classPrivateFieldSet(this, _DadsSwitch_value, v, "f");
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
    }
    // Form callbacks
    formResetCallback() {
        // 初期状態に戻す（checked属性が初期状態）
        const defaultChecked = this.hasAttribute('checked');
        if (__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")) {
            __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked = defaultChecked;
            __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").setAttribute('aria-checked', defaultChecked ? 'true' : 'false');
        }
        __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
    }
    formStateRestoreCallback(state, _mode) {
        if (state !== null && typeof state === 'string') {
            this.checked = state === __classPrivateFieldGet(this, _DadsSwitch_value, "f");
        }
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        if (__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")) {
            __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").disabled = disabled;
        }
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f")?.blur();
    }
}
_DadsSwitch_checkbox = new WeakMap(), _DadsSwitch_labelLeft = new WeakMap(), _DadsSwitch_labelRight = new WeakMap(), _DadsSwitch_value = new WeakMap(), _DadsSwitch_handleKeydown = new WeakMap(), _DadsSwitch_handleLabelClick = new WeakMap(), _DadsSwitch_handleChange = new WeakMap(), _DadsSwitch_instances = new WeakSet(), _DadsSwitch_syncAllState = function _DadsSwitch_syncAllState() {
    __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_syncCheckboxAttributes).call(this);
}, _DadsSwitch_initCheckbox = function _DadsSwitch_initCheckbox() {
    if (!__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f"))
        return;
    // 属性の転送
    __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_syncCheckboxAttributes).call(this);
    // イベントリスナー
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").addEventListener('change', __classPrivateFieldGet(this, _DadsSwitch_handleChange, "f"));
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").addEventListener('keydown', __classPrivateFieldGet(this, _DadsSwitch_handleKeydown, "f"));
}, _DadsSwitch_triggerChange = function _DadsSwitch_triggerChange(checked) {
    if (!__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f"))
        return;
    // checkbox状態を同期
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked = checked;
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").setAttribute('aria-checked', checked ? 'true' : 'false');
    // フォーム値更新
    __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
    // カスタムイベント発火
    this.emitEvent('dads-change', { checked });
}, _DadsSwitch_initLabels = function _DadsSwitch_initLabels() {
    // ラベルクリックでスイッチをトグル
    __classPrivateFieldGet(this, _DadsSwitch_labelLeft, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsSwitch_handleLabelClick, "f"));
    __classPrivateFieldGet(this, _DadsSwitch_labelRight, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsSwitch_handleLabelClick, "f"));
}, _DadsSwitch_syncCheckboxAttributes = function _DadsSwitch_syncCheckboxAttributes() {
    if (!__classPrivateFieldGet(this, _DadsSwitch_checkbox, "f"))
        return;
    // checked状態の同期
    const isChecked = this.hasAttribute('checked');
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").checked = isChecked;
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").setAttribute('aria-checked', isChecked ? 'true' : 'false');
    // disabled状態
    __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").disabled = this.hasAttribute('disabled');
    // name属性
    const name = this.getAttribute('name');
    if (name !== null) {
        __classPrivateFieldGet(this, _DadsSwitch_checkbox, "f").setAttribute('name', name);
    }
    // フォーム値の設定
    __classPrivateFieldGet(this, _DadsSwitch_instances, "m", _DadsSwitch_updateFormValue).call(this);
}, _DadsSwitch_updateFormValue = function _DadsSwitch_updateFormValue() {
    if (this.hasAttribute('checked')) {
        this._internals.setFormValue(__classPrivateFieldGet(this, _DadsSwitch_value, "f"));
    }
    else {
        this._internals.setFormValue(null);
    }
}, _DadsSwitch_syncAriaChecked = function _DadsSwitch_syncAriaChecked(isChecked) {
    const checkbox = this.shadowRoot?.querySelector('[part="checkbox"]');
    if (checkbox) {
        const checked = isChecked ?? this.hasAttribute('checked');
        checkbox.checked = checked;
        checkbox.setAttribute('aria-checked', checked ? 'true' : 'false');
    }
};
DadsSwitch.formAssociated = true;
DadsSwitch.definition = {
    name: 'dads-switch',
    template: html `
      <div part="wrapper">
        <span part="label-left">
          <slot name="label-left"></slot>
        </span>
        <label part="switch">
          <input
            type="checkbox"
            part="checkbox"
            id="checkbox"
            role="switch"
            aria-checked="false"
          />
          <span part="track">
            <span part="knob"></span>
          </span>
        </label>
        <span part="label-right">
          <slot name="label-right"></slot>
        </span>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        switchTokens,
        switchStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        BooleanAttr('checked'),
        BooleanAttr('disabled'),
        PropertyAttr('name'),
        // value は observedAttributes に含めるが、PropertyAttr は使わない（カスタムgetter/setterを保持）
        { attribute: 'value' },
        PropertyAttr('size'),
    ],
};
// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsSwitch, 'value', 'value');
