/**
 * @module select
 * デジタル庁デザインシステム Selectコンポーネント
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
var _DadsSelect_instances, _DadsSelect_select, _DadsSelect_labelSlot, _DadsSelect_supportSlot, _DadsSelect_errorSlot, _DadsSelect_labelFallback, _DadsSelect_supportText, _DadsSelect_supportFallback, _DadsSelect_errorText, _DadsSelect_errorFallback, _DadsSelect_requirement, _DadsSelect_validationErrorType, _DadsSelect_formValidation, _DadsSelect_formDisabled, _DadsSelect_optionsObserver, _DadsSelect_syncAllState, _DadsSelect_initSelect, _DadsSelect_initSlots, _DadsSelect_setupFormValidation, _DadsSelect_setupOptionsObserver, _DadsSelect_shouldSyncOptionsFromMutation, _DadsSelect_parseSizeAttr, _DadsSelect_syncSelectAttributes, _DadsSelect_getLightDomOptionElements, _DadsSelect_syncOptions, _DadsSelect_updateAriaDescribedBy, _DadsSelect_handleInput, _DadsSelect_handleChange, _DadsSelect_handleAriaDisabledKeydown, _DadsSelect_handleAriaDisabledMouseDown, _DadsSelect_handleFormSubmit, _DadsSelect_validateRequired, _DadsSelect_showValidationError, _DadsSelect_clearValidationError, _DadsSelect_updateValidationUI, _DadsSelect_getErrorMessage, _DadsSelect_isAriaDisabled;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { selectTokens } from './select-tokens.js';
import { selectStyles } from './select-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { setDefaultAttributes, setupFormValidation, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, updateValidationUI, showValidationError, clearValidationError, updateAriaDescribedBy, setupSlotChangeListeners, } from '../../utils/form-component-helpers.js';
/**
 * Selectコンポーネント
 *
 * @customElement dads-select
 * @tagname dads-select
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot - option / optgroup（Light DOMに配置、内部selectへ複製）
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキストラッパー
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart select-wrapper - selectを囲むコンテナ
 * @csspart select - ネイティブselect要素
 * @csspart select-chevron - セレクトの矢印アイコン
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {boolean} required - 必須項目
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態（ネイティブdisabled）
 * @attr {string} aria-disabled - 無効相当（Tab移動は許容、操作は抑止）
 * @attr {string} name - フォーム名
 * @attr {string} size - サイズ（sm | md | lg）+ 幅指定（例: "md 256", "sm 20ch", "lg full", "md fit-content"）
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 * @attr {string} value - 初期値
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 */
export class DadsSelect extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsSelect_instances.add(this);
        // Private fields
        _DadsSelect_select.set(this, null);
        _DadsSelect_labelSlot.set(this, null);
        _DadsSelect_supportSlot.set(this, null);
        _DadsSelect_errorSlot.set(this, null);
        // UI要素参照
        _DadsSelect_labelFallback.set(this, null);
        _DadsSelect_supportText.set(this, null);
        _DadsSelect_supportFallback.set(this, null);
        _DadsSelect_errorText.set(this, null);
        _DadsSelect_errorFallback.set(this, null);
        _DadsSelect_requirement.set(this, null);
        // バリデーション状態
        _DadsSelect_validationErrorType.set(this, null);
        // フォームバリデーションセットアップ
        _DadsSelect_formValidation.set(this, null);
        // フォーム由来のdisabled状態（fieldset disabled等）
        _DadsSelect_formDisabled.set(this, false);
        // Light DOM option監視
        _DadsSelect_optionsObserver.set(this, null);
        _DadsSelect_handleInput.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsSelect_select, "f")) {
                this._internals.setFormValue(__classPrivateFieldGet(this, _DadsSelect_select, "f").value);
            }
            if (this.hasAttribute('auto-validate') && __classPrivateFieldGet(this, _DadsSelect_validationErrorType, "f")) {
                __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_clearValidationError).call(this);
            }
            this.emitEvent('dads-input', { value: this.value });
        });
        _DadsSelect_handleChange.set(this, () => {
            this.emitEvent('dads-change', { value: this.value });
        });
        _DadsSelect_handleAriaDisabledKeydown.set(this, (e) => {
            if (!__classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_isAriaDisabled).call(this))
                return;
            if (e.code === 'Tab')
                return;
            e.preventDefault();
        });
        _DadsSelect_handleAriaDisabledMouseDown.set(this, (e) => {
            if (!__classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_isAriaDisabled).call(this))
                return;
            e.preventDefault();
        });
        _DadsSelect_handleFormSubmit.set(this, (e) => {
            // disabled/aria-disabledの場合はバリデーションしない（ユーザーが修正できないため）
            if (this.hasAttribute('disabled') || __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_isAriaDisabled).call(this))
                return;
            const isValid = __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_validateRequired).call(this);
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // デフォルト属性の設定
        setDefaultAttributes(this, { size: 'md' });
        // 内部要素の参照を取得
        __classPrivateFieldSet(this, _DadsSelect_select, this.shadowRoot?.querySelector('[part="select"]'), "f");
        __classPrivateFieldSet(this, _DadsSelect_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsSelect_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsSelect_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        // UI要素参照取得
        __classPrivateFieldSet(this, _DadsSelect_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsSelect_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsSelect_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsSelect_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsSelect_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsSelect_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        // 初期化
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_initSelect).call(this);
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_initSlots).call(this);
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_setupFormValidation).call(this);
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_setupOptionsObserver).call(this);
        // 属性が接続後に設定された場合のために再同期
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.removeEventListener('input', __classPrivateFieldGet(this, _DadsSelect_handleInput, "f"));
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsSelect_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsSelect_handleAriaDisabledKeydown, "f"));
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.removeEventListener('mousedown', __classPrivateFieldGet(this, _DadsSelect_handleAriaDisabledMouseDown, "f"));
        __classPrivateFieldGet(this, _DadsSelect_formValidation, "f")?.cleanup();
        __classPrivateFieldSet(this, _DadsSelect_formValidation, null, "f");
        __classPrivateFieldGet(this, _DadsSelect_optionsObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsSelect_optionsObserver, null, "f");
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsSelect_select, "f"))
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsSelect_labelSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsSelect_supportSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_supportText, "f"), __classPrivateFieldGet(this, _DadsSelect_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this);
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsSelect_requirement, "f"), this.hasAttribute('required'), false);
                if (this.hasAttribute('required')) {
                    __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('aria-required', 'true');
                }
                else {
                    __classPrivateFieldGet(this, _DadsSelect_select, "f").removeAttribute('aria-required');
                }
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsSelect_errorSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_errorText, "f"), __classPrivateFieldGet(this, _DadsSelect_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this);
                __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
                break;
            case 'disabled':
            case 'name':
            case 'size':
            case 'aria-disabled':
                __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncSelectAttributes).call(this);
                break;
            case 'auto-validate':
                __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_setupFormValidation).call(this);
                break;
            case 'value':
                if (newValue !== null) {
                    this.value = newValue;
                }
                break;
        }
    }
    // Public API
    get value() {
        return __classPrivateFieldGet(this, _DadsSelect_select, "f")?.value ?? '';
    }
    set value(v) {
        if (!__classPrivateFieldGet(this, _DadsSelect_select, "f"))
            return;
        __classPrivateFieldGet(this, _DadsSelect_select, "f").value = v;
        this._internals.setFormValue(__classPrivateFieldGet(this, _DadsSelect_select, "f").value);
    }
    // Form callbacks
    formResetCallback() {
        const defaultValue = this.getAttribute('value') ?? '';
        this.value = defaultValue;
    }
    formStateRestoreCallback(state, _mode) {
        if (state !== null && typeof state === 'string') {
            this.value = state;
        }
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsSelect_formDisabled, disabled, "f");
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncSelectAttributes).call(this);
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsSelect_select, "f")?.blur();
    }
}
_DadsSelect_select = new WeakMap(), _DadsSelect_labelSlot = new WeakMap(), _DadsSelect_supportSlot = new WeakMap(), _DadsSelect_errorSlot = new WeakMap(), _DadsSelect_labelFallback = new WeakMap(), _DadsSelect_supportText = new WeakMap(), _DadsSelect_supportFallback = new WeakMap(), _DadsSelect_errorText = new WeakMap(), _DadsSelect_errorFallback = new WeakMap(), _DadsSelect_requirement = new WeakMap(), _DadsSelect_validationErrorType = new WeakMap(), _DadsSelect_formValidation = new WeakMap(), _DadsSelect_formDisabled = new WeakMap(), _DadsSelect_optionsObserver = new WeakMap(), _DadsSelect_handleInput = new WeakMap(), _DadsSelect_handleChange = new WeakMap(), _DadsSelect_handleAriaDisabledKeydown = new WeakMap(), _DadsSelect_handleAriaDisabledMouseDown = new WeakMap(), _DadsSelect_handleFormSubmit = new WeakMap(), _DadsSelect_instances = new WeakSet(), _DadsSelect_syncAllState = function _DadsSelect_syncAllState() {
    __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncOptions).call(this);
    __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncSelectAttributes).call(this);
    updateLabelFallback(__classPrivateFieldGet(this, _DadsSelect_labelSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_labelFallback, "f"), this.getAttribute('label'));
    updateSupportFallback(__classPrivateFieldGet(this, _DadsSelect_supportSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_supportText, "f"), __classPrivateFieldGet(this, _DadsSelect_supportFallback, "f"), this.getAttribute('support-text'));
    updateErrorFallback(__classPrivateFieldGet(this, _DadsSelect_errorSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_errorText, "f"), __classPrivateFieldGet(this, _DadsSelect_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
    updateRequirement(__classPrivateFieldGet(this, _DadsSelect_requirement, "f"), this.hasAttribute('required'), false);
    __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this);
    if (__classPrivateFieldGet(this, _DadsSelect_select, "f")) {
        this._internals.setFormValue(__classPrivateFieldGet(this, _DadsSelect_select, "f").value);
    }
}, _DadsSelect_initSelect = function _DadsSelect_initSelect() {
    if (!__classPrivateFieldGet(this, _DadsSelect_select, "f"))
        return;
    // 属性の転送
    __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncSelectAttributes).call(this);
    // option/optgroup の複製
    __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncOptions).call(this);
    // イベントリスナー
    __classPrivateFieldGet(this, _DadsSelect_select, "f").addEventListener('input', __classPrivateFieldGet(this, _DadsSelect_handleInput, "f"));
    __classPrivateFieldGet(this, _DadsSelect_select, "f").addEventListener('change', __classPrivateFieldGet(this, _DadsSelect_handleChange, "f"));
    __classPrivateFieldGet(this, _DadsSelect_select, "f").addEventListener('keydown', __classPrivateFieldGet(this, _DadsSelect_handleAriaDisabledKeydown, "f"));
    __classPrivateFieldGet(this, _DadsSelect_select, "f").addEventListener('mousedown', __classPrivateFieldGet(this, _DadsSelect_handleAriaDisabledMouseDown, "f"));
}, _DadsSelect_initSlots = function _DadsSelect_initSlots() {
    setupSlotChangeListeners({
        label: __classPrivateFieldGet(this, _DadsSelect_labelSlot, "f"),
        support: __classPrivateFieldGet(this, _DadsSelect_supportSlot, "f"),
        error: __classPrivateFieldGet(this, _DadsSelect_errorSlot, "f"),
    }, {
        onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsSelect_labelSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_labelFallback, "f"), this.getAttribute('label')),
        onSupportChange: () => {
            updateSupportFallback(__classPrivateFieldGet(this, _DadsSelect_supportSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_supportText, "f"), __classPrivateFieldGet(this, _DadsSelect_supportFallback, "f"), this.getAttribute('support-text'));
            __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this);
        },
        onErrorChange: () => {
            updateErrorFallback(__classPrivateFieldGet(this, _DadsSelect_errorSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_errorText, "f"), __classPrivateFieldGet(this, _DadsSelect_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
            __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this);
        },
    });
    updateRequirement(__classPrivateFieldGet(this, _DadsSelect_requirement, "f"), this.hasAttribute('required'), false);
}, _DadsSelect_setupFormValidation = function _DadsSelect_setupFormValidation() {
    // 付け替えを許容（auto-validate属性の動的変更に追従）
    __classPrivateFieldGet(this, _DadsSelect_formValidation, "f")?.cleanup();
    __classPrivateFieldSet(this, _DadsSelect_formValidation, setupFormValidation(this, this._internals, 'auto-validate', __classPrivateFieldGet(this, _DadsSelect_handleFormSubmit, "f")), "f");
}, _DadsSelect_setupOptionsObserver = function _DadsSelect_setupOptionsObserver() {
    __classPrivateFieldGet(this, _DadsSelect_optionsObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsSelect_optionsObserver, new MutationObserver((mutations) => {
        if (!mutations.some((mutation) => __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_shouldSyncOptionsFromMutation).call(this, mutation)))
            return;
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_syncOptions).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsSelect_optionsObserver, "f").observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });
}, _DadsSelect_shouldSyncOptionsFromMutation = function _DadsSelect_shouldSyncOptionsFromMutation(mutation) {
    switch (mutation.type) {
        case 'childList':
            return true;
        case 'attributes': {
            const el = mutation.target;
            if (!(el instanceof Element))
                return false;
            return el.tagName === 'OPTION' || el.tagName === 'OPTGROUP';
        }
        case 'characterData': {
            const parent = mutation.target.parentElement;
            if (!parent)
                return false;
            return parent.tagName === 'OPTION' || parent.tagName === 'OPTGROUP';
        }
        default:
            return false;
    }
}, _DadsSelect_parseSizeAttr = function _DadsSelect_parseSizeAttr() {
    const raw = this.getAttribute('size');
    const tokens = raw ? raw.trim().split(/\s+/).filter(Boolean) : [];
    let variant = null;
    let width = null;
    const isVariantToken = (token) => token === 'sm' || token === 'md' || token === 'lg';
    for (const token of tokens) {
        if (isVariantToken(token)) {
            if (variant === null) {
                variant = token;
                if (width !== null)
                    break;
            }
            continue;
        }
        if (width !== null)
            continue;
        if (token === 'full') {
            width = '100%';
            if (variant !== null)
                break;
            continue;
        }
        if (token === 'fit' || token === 'fit-content') {
            width = 'fit-content';
            if (variant !== null)
                break;
            continue;
        }
        if (token === 'auto' || token === 'min-content' || token === 'max-content') {
            width = token;
            if (variant !== null)
                break;
            continue;
        }
        // 数値のみは px として扱う（例: "256" → "256px"）
        if (/^\d+(\.\d+)?$/.test(token)) {
            width = `${token}px`;
            if (variant !== null)
                break;
            continue;
        }
        // カスタム値 (200px, 20ch, 50% など)
        if (/^\d+(\.\d+)?(px|ch|em|rem|vw|%)$/.test(token)) {
            width = token;
            if (variant !== null)
                break;
            continue;
        }
    }
    return { variant: variant ?? 'md', width };
}, _DadsSelect_syncSelectAttributes = function _DadsSelect_syncSelectAttributes() {
    if (!__classPrivateFieldGet(this, _DadsSelect_select, "f"))
        return;
    // name属性の転送
    const name = this.getAttribute('name');
    if (name !== null) {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('name', name);
    }
    else {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").removeAttribute('name');
    }
    // disabled属性（ネイティブ）
    __classPrivateFieldGet(this, _DadsSelect_select, "f").disabled = __classPrivateFieldGet(this, _DadsSelect_formDisabled, "f") || this.hasAttribute('disabled');
    // aria-disabled（無効相当: Tab移動は許容、操作は抑止）
    if (__classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_isAriaDisabled).call(this)) {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('aria-disabled', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").removeAttribute('aria-disabled');
    }
    // required は内部selectに転送しない（ネイティブバリデーションを使わず、カスタムバリデーションで制御）
    // 代わりに aria-required を設定してアクセシビリティを維持
    if (this.hasAttribute('required')) {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('aria-required', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsSelect_select, "f").removeAttribute('aria-required');
    }
    // error状態
    __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
    // size（サイズバリアント + 幅指定）
    const { variant, width } = __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_parseSizeAttr).call(this);
    __classPrivateFieldGet(this, _DadsSelect_select, "f").setAttribute('data-size', variant);
    if (width) {
        this.style.setProperty('--dads-select-width', width);
    }
    else {
        this.style.removeProperty('--dads-select-width');
    }
}, _DadsSelect_getLightDomOptionElements = function _DadsSelect_getLightDomOptionElements() {
    const out = [];
    for (const el of Array.from(this.children)) {
        if (el instanceof HTMLOptionElement || el instanceof HTMLOptGroupElement) {
            out.push(el);
        }
    }
    return out;
}, _DadsSelect_syncOptions = function _DadsSelect_syncOptions() {
    if (!__classPrivateFieldGet(this, _DadsSelect_select, "f"))
        return;
    const desiredValueAttr = this.getAttribute('value');
    const preserveValue = desiredValueAttr ?? (__classPrivateFieldGet(this, _DadsSelect_select, "f").options.length > 0 ? __classPrivateFieldGet(this, _DadsSelect_select, "f").value : null);
    const clones = __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_getLightDomOptionElements).call(this).map((el) => el.cloneNode(true));
    __classPrivateFieldGet(this, _DadsSelect_select, "f").replaceChildren(...clones);
    // 値の復元（存在しない場合はselect側のデフォルトにフォールバック）
    if (preserveValue !== null)
        __classPrivateFieldGet(this, _DadsSelect_select, "f").value = preserveValue;
    this._internals.setFormValue(__classPrivateFieldGet(this, _DadsSelect_select, "f").value);
}, _DadsSelect_updateAriaDescribedBy = function _DadsSelect_updateAriaDescribedBy() {
    const supportVisible = __classPrivateFieldGet(this, _DadsSelect_supportText, "f")?.style.display !== 'none';
    updateAriaDescribedBy(__classPrivateFieldGet(this, _DadsSelect_select, "f"), supportVisible, this.hasAttribute('error'));
}, _DadsSelect_validateRequired = function _DadsSelect_validateRequired() {
    if (!this.hasAttribute('required'))
        return true;
    const isValid = this.value.trim().length > 0;
    if (!isValid) {
        __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_showValidationError).call(this, 'required');
    }
    return isValid;
}, _DadsSelect_showValidationError = function _DadsSelect_showValidationError(type) {
    __classPrivateFieldSet(this, _DadsSelect_validationErrorType, type, "f");
    const message = __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_getErrorMessage).call(this, type);
    showValidationError({
        element: this,
        control: __classPrivateFieldGet(this, _DadsSelect_select, "f"),
        internals: this._internals,
        message,
        updateUI: (hasError) => __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateValidationUI).call(this, hasError),
    });
}, _DadsSelect_clearValidationError = function _DadsSelect_clearValidationError() {
    if (__classPrivateFieldGet(this, _DadsSelect_validationErrorType, "f") === null)
        return;
    __classPrivateFieldSet(this, _DadsSelect_validationErrorType, null, "f");
    clearValidationError(this, this._internals, (hasError) => __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateValidationUI).call(this, hasError));
}, _DadsSelect_updateValidationUI = function _DadsSelect_updateValidationUI(hasError) {
    updateValidationUI(__classPrivateFieldGet(this, _DadsSelect_select, "f"), hasError, () => updateErrorFallback(__classPrivateFieldGet(this, _DadsSelect_errorSlot, "f"), __classPrivateFieldGet(this, _DadsSelect_errorText, "f"), __classPrivateFieldGet(this, _DadsSelect_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error')), () => __classPrivateFieldGet(this, _DadsSelect_instances, "m", _DadsSelect_updateAriaDescribedBy).call(this));
}, _DadsSelect_getErrorMessage = function _DadsSelect_getErrorMessage(type) {
    return getValidationMessage(this, VALIDATION_RULES[type]);
}, _DadsSelect_isAriaDisabled = function _DadsSelect_isAriaDisabled() {
    const v = this.getAttribute('aria-disabled');
    if (v === null)
        return false;
    if (v.trim().toLowerCase() === 'false')
        return false;
    return true;
};
DadsSelect.formAssociated = true;
DadsSelect.definition = {
    name: 'dads-select',
    template: html `
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="select">
          <span part="label-text" id="label-text">
            <slot name="label" id="label-slot"></slot>
            <span id="label-fallback"></span>
          </span>
          <span part="requirement" id="requirement"></span>
        </label>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span id="support-fallback"></span>
        </div>

        <div part="select-wrapper" id="select-wrapper">
          <select part="select" id="select"></select>
          <svg part="select-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" fill="currentcolor" />
          </svg>
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), selectTokens, selectStyles, applyDADSFocusStyles()], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('support-text'),
        BooleanAttr('required'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        BooleanAttr('disabled'),
        // aria-disabled は文字列属性（"true"/"false" だけでなく空文字も許容）
        { attribute: 'aria-disabled' },
        PropertyAttr('name'),
        PropertyAttr('size'),
        BooleanAttr('auto-validate'),
        // value は observedAttributes に含めるが、PropertyAttr は使わない（カスタム getter/setter）
        { attribute: 'value' },
    ],
};
// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsSelect, 'value', 'value');
