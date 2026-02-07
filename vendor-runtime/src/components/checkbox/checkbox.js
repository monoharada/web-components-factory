/**
 * @module checkbox
 * デジタル庁デザインシステム Checkboxコンポーネント
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
var _DadsCheckbox_instances, _DadsCheckbox_base, _DadsCheckbox_input, _DadsCheckbox_labelEl, _DadsCheckbox_requirement, _DadsCheckbox_errorText, _DadsCheckbox_formDisabled, _DadsCheckbox_validationError, _DadsCheckbox_formValidation, _DadsCheckbox_syncAll, _DadsCheckbox_syncLabel, _DadsCheckbox_syncRequirement, _DadsCheckbox_syncErrorText, _DadsCheckbox_syncInputFromAttributes, _DadsCheckbox_syncAria, _DadsCheckbox_syncAriaInvalid, _DadsCheckbox_syncFormValue, _DadsCheckbox_setupFormValidation, _DadsCheckbox_handleFormSubmit, _DadsCheckbox_showValidationError, _DadsCheckbox_clearValidationError, _DadsCheckbox_syncValidationOnUserFix, _DadsCheckbox_getRequiredErrorMessage, _DadsCheckbox_handleChange, _DadsCheckbox_handleErrorAttributeChange, _DadsCheckbox_handleErrorTextAttributeChange, _DadsCheckbox_isDisabled;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes, setupFormValidation, updateRequirement, } from '../../utils/form-component-helpers.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { checkboxStyles } from './checkbox-styles.js';
/**
 * Checkboxコンポーネント
 *
 * DADS HTML版の構造・見た目に準拠しつつ、Form-Associated Custom Elementとしてフォームに参加します。
 *
 * @customElement dads-checkbox
 * @tagname dads-checkbox
 *
 * @csspart base - label相当のラッパー
 * @csspart checkbox - チェックボックス枠（背景ホバー含む）
 * @csspart input - ネイティブinput[type=checkbox]
 * @csspart label - ラベルテキスト
 * @csspart requirement - 要否ラベル（※必須）
 *
 * @attr {string} label - ラベルテキスト
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {boolean} checked - 初期チェック状態（属性はデフォルト値として扱う）
 * @attr {boolean} indeterminate - 不確定状態
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須（未チェックでsubmit時にinvalid）
 * @attr {boolean} auto-validate - submit時の自動バリデーション
 * @attr {boolean} error - エラー状態（aria-invalid="true"）
 * @attr {string} error-text - エラーメッセージ（バリデーション時に設定）
 * @attr {string} name - フォーム名
 * @attr {string} value - 送信値（未指定時は "on"）
 * @attr {string} aria-label - アクセシビリティラベル（ラベルなし時に推奨）
 * @attr {string} aria-labelledby - 外部ラベル参照
 * @attr {string} aria-describedby - 補足/エラー参照
 *
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ（非表示）
 */
export class DadsCheckbox extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsCheckbox_instances.add(this);
        _DadsCheckbox_base.set(this, null);
        _DadsCheckbox_input.set(this, null);
        _DadsCheckbox_labelEl.set(this, null);
        _DadsCheckbox_requirement.set(this, null);
        _DadsCheckbox_errorText.set(this, null);
        _DadsCheckbox_formDisabled.set(this, false);
        _DadsCheckbox_validationError.set(this, false);
        _DadsCheckbox_formValidation.set(this, null);
        _DadsCheckbox_handleFormSubmit.set(this, (e) => {
            // disabled時はバリデーションしない
            if (__classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_isDisabled).call(this))
                return;
            if (!this.hasAttribute('required'))
                return;
            const isValid = this.checked;
            if (isValid) {
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_clearValidationError).call(this);
                return;
            }
            e.preventDefault();
            __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_showValidationError).call(this);
        });
        // ============================================================
        // Events
        // ============================================================
        _DadsCheckbox_handleChange.set(this, () => {
            if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f"))
                return;
            // ネイティブ同様、ユーザー操作で不確定状態は解除される
            if (__classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate) {
                __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate = false;
            }
            __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
            __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncValidationOnUserFix).call(this);
            this.emitEvent('dads-change', {
                checked: this.checked,
                indeterminate: this.indeterminate,
                value: this.value,
            });
        });
    }
    // ベースクラスではobservedAttributesが自動で解決されないため明示（happy-dom含む互換性担保）
    static get observedAttributes() {
        return [
            'label',
            'size',
            'checked',
            'indeterminate',
            'disabled',
            'required',
            'auto-validate',
            'error',
            'error-text',
            'name',
            'value',
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, { size: 'sm' });
        __classPrivateFieldSet(this, _DadsCheckbox_base, this.shadowRoot?.querySelector('#base'), "f");
        __classPrivateFieldSet(this, _DadsCheckbox_input, this.shadowRoot?.querySelector('#input'), "f");
        __classPrivateFieldSet(this, _DadsCheckbox_labelEl, this.shadowRoot?.querySelector('#label'), "f");
        __classPrivateFieldSet(this, _DadsCheckbox_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        __classPrivateFieldSet(this, _DadsCheckbox_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAll).call(this);
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.addEventListener('change', __classPrivateFieldGet(this, _DadsCheckbox_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_setupFormValidation).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsCheckbox_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsCheckbox_formValidation, "f")?.cleanup();
        __classPrivateFieldSet(this, _DadsCheckbox_formValidation, null, "f");
    }
    // ============================================================
    // Public API
    // ============================================================
    get checked() {
        return __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.checked ?? this.hasAttribute('checked');
    }
    set checked(v) {
        if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f")) {
            // 初期化前は属性に退避（初期値として扱う）
            this.toggleAttribute('checked', v);
            return;
        }
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f").checked = v;
        // checked を変更した場合は、視覚的な不確定状態を解除（一般的な挙動）
        if (!v && __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate) {
            __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate = false;
        }
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncValidationOnUserFix).call(this);
    }
    get indeterminate() {
        return __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.indeterminate ?? this.hasAttribute('indeterminate');
    }
    set indeterminate(v) {
        if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f")) {
            this.toggleAttribute('indeterminate', v);
            return;
        }
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate = v;
    }
    get value() {
        return this.getAttribute('value') ?? 'on';
    }
    set value(v) {
        this.setAttribute('value', v);
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f")?.blur();
    }
    /**
     * ※必須表示の再同期
     * fieldsetから呼び出される（スロット変更時やrequired属性変更時）
     */
    syncRequirement() {
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncRequirement).call(this);
    }
    // ============================================================
    // Form callbacks
    // ============================================================
    formResetCallback() {
        // checked属性をデフォルト値として扱い、リセット時に復元
        this.checked = this.hasAttribute('checked');
        this.indeterminate = this.hasAttribute('indeterminate');
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_clearValidationError).call(this);
    }
    formStateRestoreCallback(state, _mode) {
        if (state === null) {
            this.checked = false;
            return;
        }
        if (typeof state === 'string') {
            // setFormValue(value) が復元される前提（値の内容には依存しない）
            this.checked = true;
        }
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsCheckbox_formDisabled, disabled, "f");
        if (__classPrivateFieldGet(this, _DadsCheckbox_input, "f")) {
            __classPrivateFieldGet(this, _DadsCheckbox_input, "f").disabled = __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_isDisabled).call(this);
        }
        __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
    }
    // ============================================================
    // Attribute changes
    // ============================================================
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f"))
            return;
        switch (name) {
            case 'label':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncLabel).call(this);
                break;
            case 'size':
                break;
            case 'checked':
                __classPrivateFieldGet(this, _DadsCheckbox_input, "f").checked = newValue !== null;
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
                break;
            case 'indeterminate':
                __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate = newValue !== null;
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsCheckbox_input, "f").disabled = __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_isDisabled).call(this);
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
                break;
            case 'required':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncRequirement).call(this);
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAria).call(this);
                break;
            case 'auto-validate':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_setupFormValidation).call(this);
                break;
            case 'error':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_handleErrorAttributeChange).call(this);
                break;
            case 'error-text':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_handleErrorTextAttributeChange).call(this);
                break;
            case 'value':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
                break;
            case 'aria-label':
            case 'aria-labelledby':
            case 'aria-describedby':
                __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAria).call(this);
                break;
        }
    }
}
_DadsCheckbox_base = new WeakMap(), _DadsCheckbox_input = new WeakMap(), _DadsCheckbox_labelEl = new WeakMap(), _DadsCheckbox_requirement = new WeakMap(), _DadsCheckbox_errorText = new WeakMap(), _DadsCheckbox_formDisabled = new WeakMap(), _DadsCheckbox_validationError = new WeakMap(), _DadsCheckbox_formValidation = new WeakMap(), _DadsCheckbox_handleFormSubmit = new WeakMap(), _DadsCheckbox_handleChange = new WeakMap(), _DadsCheckbox_instances = new WeakSet(), _DadsCheckbox_syncAll = function _DadsCheckbox_syncAll() {
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncLabel).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncRequirement).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncErrorText).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncInputFromAttributes).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAria).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAriaInvalid).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncFormValue).call(this);
}, _DadsCheckbox_syncLabel = function _DadsCheckbox_syncLabel() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_labelEl, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCheckbox_labelEl, "f").textContent = this.getAttribute('label') ?? '';
}, _DadsCheckbox_syncRequirement = function _DadsCheckbox_syncRequirement() {
    // connectedCallback前は何もしない
    if (!__classPrivateFieldGet(this, _DadsCheckbox_requirement, "f"))
        return;
    // fieldset内にいる場合は、fieldsetのlegendに※必須が表示されるため非表示
    const parentFieldset = this.closest('dads-fieldset');
    const insideRequiredFieldset = parentFieldset?.hasAttribute('required') ?? false;
    // fieldset内で親がrequired → checkbox自身は※必須を表示しない
    // checkboxはreadonlyがないのでfalse固定
    const showRequirement = this.hasAttribute('required') && !insideRequiredFieldset;
    updateRequirement(__classPrivateFieldGet(this, _DadsCheckbox_requirement, "f"), showRequirement, false);
}, _DadsCheckbox_syncErrorText = function _DadsCheckbox_syncErrorText() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_errorText, "f"))
        return;
    const hasError = this.hasAttribute('error');
    const errorMessage = this.getAttribute('error-text') ?? '';
    // エラーがある場合のみメッセージを表示
    __classPrivateFieldGet(this, _DadsCheckbox_errorText, "f").textContent = hasError && errorMessage ? `＊${errorMessage}` : '';
}, _DadsCheckbox_syncInputFromAttributes = function _DadsCheckbox_syncInputFromAttributes() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f"))
        return;
    // 初期値は属性から読み取る（checked/indeterminate は属性をデフォルト値として扱う）
    __classPrivateFieldGet(this, _DadsCheckbox_input, "f").checked = this.hasAttribute('checked');
    __classPrivateFieldGet(this, _DadsCheckbox_input, "f").indeterminate = this.hasAttribute('indeterminate');
    // disabled は属性・フォームからの無効化を合成
    __classPrivateFieldGet(this, _DadsCheckbox_input, "f").disabled = __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_isDisabled).call(this);
}, _DadsCheckbox_syncAria = function _DadsCheckbox_syncAria() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f"))
        return;
    // required はネイティブrequiredに転送しない（Form-Associated側で制御）
    if (this.hasAttribute('required')) {
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f").setAttribute('aria-required', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsCheckbox_input, "f").removeAttribute('aria-required');
    }
    const ariaAttrs = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    for (const attr of ariaAttrs) {
        const v = this.getAttribute(attr);
        if (v === null)
            __classPrivateFieldGet(this, _DadsCheckbox_input, "f").removeAttribute(attr);
        else
            __classPrivateFieldGet(this, _DadsCheckbox_input, "f").setAttribute(attr, v);
    }
}, _DadsCheckbox_syncAriaInvalid = function _DadsCheckbox_syncAriaInvalid() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_input, "f"))
        return;
    const hasError = this.hasAttribute('error');
    __classPrivateFieldGet(this, _DadsCheckbox_input, "f").setAttribute('aria-invalid', String(hasError));
}, _DadsCheckbox_syncFormValue = function _DadsCheckbox_syncFormValue() {
    // disabled/unchecked は送信しない（ネイティブcheckbox準拠）
    if (__classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_isDisabled).call(this) || !this.checked) {
        this._internals.setFormValue(null);
        return;
    }
    this._internals.setFormValue(this.value);
}, _DadsCheckbox_setupFormValidation = function _DadsCheckbox_setupFormValidation() {
    // 付け替えを許容（auto-validate属性の動的変更に追従）
    __classPrivateFieldGet(this, _DadsCheckbox_formValidation, "f")?.cleanup();
    __classPrivateFieldSet(this, _DadsCheckbox_formValidation, setupFormValidation(this, this._internals, 'auto-validate', __classPrivateFieldGet(this, _DadsCheckbox_handleFormSubmit, "f")), "f");
}, _DadsCheckbox_showValidationError = function _DadsCheckbox_showValidationError() {
    __classPrivateFieldSet(this, _DadsCheckbox_validationError, true, "f");
    const message = __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_getRequiredErrorMessage).call(this);
    this.setAttribute('error', '');
    this.setAttribute('error-text', message);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAriaInvalid).call(this);
    this._internals.setValidity({ valueMissing: true }, message, __classPrivateFieldGet(this, _DadsCheckbox_input, "f") ?? undefined);
}, _DadsCheckbox_clearValidationError = function _DadsCheckbox_clearValidationError() {
    if (!__classPrivateFieldGet(this, _DadsCheckbox_validationError, "f"))
        return;
    __classPrivateFieldSet(this, _DadsCheckbox_validationError, false, "f");
    this.removeAttribute('error');
    this.removeAttribute('error-text');
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAriaInvalid).call(this);
    this._internals.setValidity({});
}, _DadsCheckbox_syncValidationOnUserFix = function _DadsCheckbox_syncValidationOnUserFix() {
    if (!this.hasAttribute('auto-validate'))
        return;
    if (!__classPrivateFieldGet(this, _DadsCheckbox_validationError, "f"))
        return;
    if (!this.hasAttribute('required'))
        return;
    if (!this.checked)
        return;
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_clearValidationError).call(this);
}, _DadsCheckbox_getRequiredErrorMessage = function _DadsCheckbox_getRequiredErrorMessage() {
    return getValidationMessage(this, VALIDATION_RULES.required);
}, _DadsCheckbox_handleErrorAttributeChange = function _DadsCheckbox_handleErrorAttributeChange() {
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncAriaInvalid).call(this);
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncErrorText).call(this);
    if (!this.hasAttribute('error')) {
        if (!__classPrivateFieldGet(this, _DadsCheckbox_validationError, "f")) {
            this._internals.setValidity({});
        }
        return;
    }
    if (!__classPrivateFieldGet(this, _DadsCheckbox_validationError, "f")) {
        const message = this.getAttribute('error-text') ?? '';
        if (message) {
            this._internals.setValidity({ customError: true }, message, __classPrivateFieldGet(this, _DadsCheckbox_input, "f") ?? undefined);
        }
    }
}, _DadsCheckbox_handleErrorTextAttributeChange = function _DadsCheckbox_handleErrorTextAttributeChange() {
    __classPrivateFieldGet(this, _DadsCheckbox_instances, "m", _DadsCheckbox_syncErrorText).call(this);
    if (!this.hasAttribute('error'))
        return;
    const message = this.getAttribute('error-text') ?? '';
    const validityFlag = __classPrivateFieldGet(this, _DadsCheckbox_validationError, "f") ? { valueMissing: true } : { customError: true };
    this._internals.setValidity(validityFlag, message, __classPrivateFieldGet(this, _DadsCheckbox_input, "f") ?? undefined);
}, _DadsCheckbox_isDisabled = function _DadsCheckbox_isDisabled() {
    return this.hasAttribute('disabled') || __classPrivateFieldGet(this, _DadsCheckbox_formDisabled, "f");
};
DadsCheckbox.formAssociated = true;
DadsCheckbox.version = '1.0.0';
DadsCheckbox.definition = {
    name: 'dads-checkbox',
    template: html `
      <label part="base" id="base" class="dads-checkbox">
        <span part="checkbox" id="checkbox" class="dads-checkbox__checkbox">
          <input part="input" id="input" class="dads-checkbox__input" type="checkbox" />
        </span>
        <span part="label" id="label" class="dads-checkbox__label"></span>
        <span part="requirement" id="requirement"></span>
      </label>

      <!-- エラーメッセージ表示 -->
      <span part="error-text" id="error-text"></span>

      <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
      <slot name="required-error" id="required-error-slot" hidden></slot>
    `,
    styles: withReset([applyDADSTokens(), checkboxStyles], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('size'),
        BooleanAttr('disabled'),
        BooleanAttr('required'),
        BooleanAttr('auto-validate'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        PropertyAttr('name'),
        // checked/indeterminate/value はカスタムgetter/setterを持つため PropertyAttr/BooleanAttr を使わない
        { attribute: 'checked' },
        { attribute: 'indeterminate' },
        { attribute: 'value' },
        { attribute: 'aria-label' },
        { attribute: 'aria-labelledby' },
        { attribute: 'aria-describedby' },
    ],
};
