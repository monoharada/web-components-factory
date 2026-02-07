/**
 * @module input-text
 * デジタル庁デザインシステム InputTextコンポーネント
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
var _DadsInputText_instances, _DadsInputText_input, _DadsInputText_labelSlot, _DadsInputText_supportSlot, _DadsInputText_errorSlot, _DadsInputText_labelFallback, _DadsInputText_supportText, _DadsInputText_supportFallback, _DadsInputText_errorText, _DadsInputText_errorFallback, _DadsInputText_requirement, _DadsInputText_validationErrorType, _DadsInputText_formValidation, _DadsInputText_syncAllState, _DadsInputText_initInput, _DadsInputText_initSlots, _DadsInputText_syncInputAttributes, _DadsInputText_updateInputWidth, _DadsInputText_updateAriaDescribedBy, _DadsInputText_handleInput, _DadsInputText_handleChange, _DadsInputText_handleFormSubmit, _DadsInputText_validateRequired, _DadsInputText_validateTypeMismatch, _DadsInputText_showValidationError, _DadsInputText_clearValidationError, _DadsInputText_updateValidationUI, _DadsInputText_getErrorMessage;
import { html, BooleanAttr, PropertyAttr, } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { inputTextTokens } from './input-text-tokens.js';
import { inputTextStyles } from './input-text-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { checkDeprecatedAttrs, DEPRECATED_FORM_ATTRS, } from '../../utils/deprecated-attrs.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { setDefaultAttributes, setupFormValidation, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, updateValidationUI, showValidationError, clearValidationError, updateAriaDescribedBy, setupSlotChangeListeners, } from '../../utils/form-component-helpers.js';
/**
 * InputTextコンポーネント
 *
 * @customElement dads-input-text
 * @tagname dads-input-text
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot type-mismatch-error - タイプ不一致（email形式）バリデーションのカスタムエラーメッセージ
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキストラッパー
 * @csspart requirement - 要否ラベル（必須/読み取り専用）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart input-wrapper - インプットを囲むコンテナ
 * @csspart input - ネイティブinput要素
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {string} type - 入力タイプ (text | email | tel)
 * @attr {boolean} required - 必須項目
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} readonly - 読み取り専用
 * @attr {string} name - フォーム名
 * @attr {string} value - 値
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {string} input-width - 幅バリアント (short | medium | full | カスタム値)
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 * @attr {string} autocomplete - オートコンプリートヒント
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 *
 * @example
 * ```html
 * <dads-input-text label="メールアドレス" type="email" required>
 *   <span slot="support-text">例: example@example.com</span>
 * </dads-input-text>
 * ```
 */
export class DadsInputText extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsInputText_instances.add(this);
        // Private fields
        _DadsInputText_input.set(this, null);
        _DadsInputText_labelSlot.set(this, null);
        _DadsInputText_supportSlot.set(this, null);
        _DadsInputText_errorSlot.set(this, null);
        // UI要素参照
        _DadsInputText_labelFallback.set(this, null);
        _DadsInputText_supportText.set(this, null);
        _DadsInputText_supportFallback.set(this, null);
        _DadsInputText_errorText.set(this, null);
        _DadsInputText_errorFallback.set(this, null);
        _DadsInputText_requirement.set(this, null);
        // バリデーション状態
        _DadsInputText_validationErrorType.set(this, null);
        // フォームバリデーションセットアップ
        _DadsInputText_formValidation.set(this, null);
        _DadsInputText_handleInput.set(this, () => {
            // フォーム値を更新
            if (__classPrivateFieldGet(this, _DadsInputText_input, "f")) {
                this._internals.setFormValue(__classPrivateFieldGet(this, _DadsInputText_input, "f").value);
            }
            // auto-validate時、入力開始でバリデーションエラーをクリア
            if (this.hasAttribute('auto-validate') && __classPrivateFieldGet(this, _DadsInputText_validationErrorType, "f")) {
                __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_clearValidationError).call(this);
            }
            // カスタムイベント発火
            this.emitEvent('dads-input', { value: this.value });
        });
        _DadsInputText_handleChange.set(this, () => {
            this.emitEvent('dads-change', { value: this.value });
        });
        _DadsInputText_handleFormSubmit.set(this, (e) => {
            // disabled/readonlyの場合はバリデーションしない
            if (this.hasAttribute('disabled') || this.hasAttribute('readonly'))
                return;
            // 順序: required → typeMismatch
            const isRequiredValid = __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_validateRequired).call(this);
            if (!isRequiredValid) {
                e.preventDefault();
                return;
            }
            const isTypeMismatchValid = __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_validateTypeMismatch).call(this);
            if (!isTypeMismatchValid) {
                e.preventDefault();
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // Upgrade pre-defined properties.
        // If someone sets `el.value = ...` before the custom element is defined,
        // it becomes an own-property and shadows the accessor, breaking `this.value`.
        // (This happens easily in demos that run before the autoloader imports.)
        const hasOwnValue = Object.prototype.hasOwnProperty.call(this, 'value');
        const ownValue = hasOwnValue ? this.value : undefined;
        if (hasOwnValue) {
            // Expose the class accessor again.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete this.value;
        }
        // 非推奨属性のチェック（警告を出力）
        checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);
        // デフォルト属性の設定
        setDefaultAttributes(this, { size: 'md', 'input-width': 'full' });
        // 内部要素の参照を取得
        __classPrivateFieldSet(this, _DadsInputText_input, this.shadowRoot?.querySelector('[part="input"]'), "f");
        __classPrivateFieldSet(this, _DadsInputText_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsInputText_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsInputText_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        // UI要素参照取得
        __classPrivateFieldSet(this, _DadsInputText_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsInputText_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsInputText_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsInputText_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsInputText_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsInputText_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        // 初期化
        __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_initInput).call(this);
        __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_initSlots).call(this);
        // Re-apply the upgraded value after internal refs are ready.
        if (hasOwnValue) {
            this.value = ownValue == null ? '' : String(ownValue);
        }
        // フォームバリデーションのセットアップ
        __classPrivateFieldSet(this, _DadsInputText_formValidation, setupFormValidation(this, this._internals, 'auto-validate', __classPrivateFieldGet(this, _DadsInputText_handleFormSubmit, "f")), "f");
        // 属性が接続後に設定された場合のために再同期
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        // Form submit リスナーのクリーンアップ（メモリリーク防止）
        __classPrivateFieldGet(this, _DadsInputText_formValidation, "f")?.cleanup();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        // 初期化前は無視
        if (!__classPrivateFieldGet(this, _DadsInputText_input, "f"))
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsInputText_labelSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsInputText_supportSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_supportText, "f"), __classPrivateFieldGet(this, _DadsInputText_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateAriaDescribedBy).call(this);
                break;
            case 'type':
                if (newValue !== null && ['text', 'email', 'tel'].includes(newValue)) {
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").type = newValue;
                }
                else {
                    // 属性削除または無効値の場合は'text'にリセット
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").type = 'text';
                }
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsInputText_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
                // required は内部inputに転送しない（カスタムバリデーションで制御）
                // aria-required でアクセシビリティを維持
                if (this.hasAttribute('required')) {
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute('aria-required', 'true');
                }
                else {
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").removeAttribute('aria-required');
                }
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsInputText_errorSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_errorText, "f"), __classPrivateFieldGet(this, _DadsInputText_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateAriaDescribedBy).call(this);
                __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsInputText_input, "f").disabled = this.hasAttribute('disabled');
                break;
            case 'readonly':
                updateRequirement(__classPrivateFieldGet(this, _DadsInputText_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
                __classPrivateFieldGet(this, _DadsInputText_input, "f").readOnly = this.hasAttribute('readonly');
                break;
            case 'name':
            case 'autocomplete':
                if (newValue !== null)
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute(name, newValue);
                else
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").removeAttribute(name);
                break;
            case 'input-width':
                __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateInputWidth).call(this);
                break;
            case 'value':
                if (newValue !== null) {
                    __classPrivateFieldGet(this, _DadsInputText_input, "f").value = newValue;
                    this._internals.setFormValue(newValue);
                }
                break;
        }
    }
    // Public API
    get value() {
        return __classPrivateFieldGet(this, _DadsInputText_input, "f")?.value ?? '';
    }
    set value(v) {
        if (__classPrivateFieldGet(this, _DadsInputText_input, "f")) {
            __classPrivateFieldGet(this, _DadsInputText_input, "f").value = v;
            this._internals.setFormValue(v);
        }
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
        if (__classPrivateFieldGet(this, _DadsInputText_input, "f")) {
            __classPrivateFieldGet(this, _DadsInputText_input, "f").disabled = disabled;
        }
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsInputText_input, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsInputText_input, "f")?.blur();
    }
    select() {
        __classPrivateFieldGet(this, _DadsInputText_input, "f")?.select();
    }
    setSelectionRange(start, end, direction) {
        __classPrivateFieldGet(this, _DadsInputText_input, "f")?.setSelectionRange(start, end, direction);
    }
}
_DadsInputText_input = new WeakMap(), _DadsInputText_labelSlot = new WeakMap(), _DadsInputText_supportSlot = new WeakMap(), _DadsInputText_errorSlot = new WeakMap(), _DadsInputText_labelFallback = new WeakMap(), _DadsInputText_supportText = new WeakMap(), _DadsInputText_supportFallback = new WeakMap(), _DadsInputText_errorText = new WeakMap(), _DadsInputText_errorFallback = new WeakMap(), _DadsInputText_requirement = new WeakMap(), _DadsInputText_validationErrorType = new WeakMap(), _DadsInputText_formValidation = new WeakMap(), _DadsInputText_handleInput = new WeakMap(), _DadsInputText_handleChange = new WeakMap(), _DadsInputText_handleFormSubmit = new WeakMap(), _DadsInputText_instances = new WeakSet(), _DadsInputText_syncAllState = function _DadsInputText_syncAllState() {
    __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_syncInputAttributes).call(this);
    updateLabelFallback(__classPrivateFieldGet(this, _DadsInputText_labelSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_labelFallback, "f"), this.getAttribute('label'));
    updateSupportFallback(__classPrivateFieldGet(this, _DadsInputText_supportSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_supportText, "f"), __classPrivateFieldGet(this, _DadsInputText_supportFallback, "f"), this.getAttribute('support-text'));
    updateErrorFallback(__classPrivateFieldGet(this, _DadsInputText_errorSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_errorText, "f"), __classPrivateFieldGet(this, _DadsInputText_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
    updateRequirement(__classPrivateFieldGet(this, _DadsInputText_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
    __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateInputWidth).call(this);
    __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateAriaDescribedBy).call(this);
}, _DadsInputText_initInput = function _DadsInputText_initInput() {
    if (!__classPrivateFieldGet(this, _DadsInputText_input, "f"))
        return;
    // 属性の転送
    __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_syncInputAttributes).call(this);
    // イベントリスナー
    __classPrivateFieldGet(this, _DadsInputText_input, "f").addEventListener('input', __classPrivateFieldGet(this, _DadsInputText_handleInput, "f"));
    __classPrivateFieldGet(this, _DadsInputText_input, "f").addEventListener('change', __classPrivateFieldGet(this, _DadsInputText_handleChange, "f"));
}, _DadsInputText_initSlots = function _DadsInputText_initSlots() {
    setupSlotChangeListeners({
        label: __classPrivateFieldGet(this, _DadsInputText_labelSlot, "f"),
        support: __classPrivateFieldGet(this, _DadsInputText_supportSlot, "f"),
        error: __classPrivateFieldGet(this, _DadsInputText_errorSlot, "f"),
    }, {
        onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsInputText_labelSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_labelFallback, "f"), this.getAttribute('label')),
        onSupportChange: () => updateSupportFallback(__classPrivateFieldGet(this, _DadsInputText_supportSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_supportText, "f"), __classPrivateFieldGet(this, _DadsInputText_supportFallback, "f"), this.getAttribute('support-text')),
        onErrorChange: () => updateErrorFallback(__classPrivateFieldGet(this, _DadsInputText_errorSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_errorText, "f"), __classPrivateFieldGet(this, _DadsInputText_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error')),
    });
    updateRequirement(__classPrivateFieldGet(this, _DadsInputText_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
}, _DadsInputText_syncInputAttributes = function _DadsInputText_syncInputAttributes() {
    if (!__classPrivateFieldGet(this, _DadsInputText_input, "f"))
        return;
    // type属性の転送（無効値またはnullの場合は'text'にリセット）
    const typeAttr = this.getAttribute('type');
    if (typeAttr !== null && ['text', 'email', 'tel'].includes(typeAttr)) {
        __classPrivateFieldGet(this, _DadsInputText_input, "f").type = typeAttr;
    }
    else {
        __classPrivateFieldGet(this, _DadsInputText_input, "f").type = 'text';
    }
    // 転送する属性（文字列）
    const transferAttrs = ['name', 'autocomplete'];
    for (const attr of transferAttrs) {
        const value = this.getAttribute(attr);
        if (value !== null) {
            __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute(attr, value);
        }
    }
    // Boolean属性
    __classPrivateFieldGet(this, _DadsInputText_input, "f").disabled = this.hasAttribute('disabled');
    __classPrivateFieldGet(this, _DadsInputText_input, "f").readOnly = this.hasAttribute('readonly');
    // required は内部inputに転送しない（ネイティブバリデーションを使わず、カスタムバリデーションで制御）
    // 代わりに aria-required を設定してアクセシビリティを維持
    if (this.hasAttribute('required')) {
        __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute('aria-required', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsInputText_input, "f").removeAttribute('aria-required');
    }
    // 初期値の設定（value属性から）
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
        __classPrivateFieldGet(this, _DadsInputText_input, "f").value = valueAttr;
        this._internals.setFormValue(valueAttr);
    }
    // エラー状態
    const hasError = this.hasAttribute('error');
    __classPrivateFieldGet(this, _DadsInputText_input, "f").setAttribute('aria-invalid', hasError ? 'true' : 'false');
}, _DadsInputText_updateInputWidth = function _DadsInputText_updateInputWidth() {
    const width = this.getAttribute('input-width') || 'full';
    switch (width) {
        case 'short':
            this.style.setProperty('--dads-input-width', 'var(--input-width-short)');
            break;
        case 'medium':
            this.style.setProperty('--dads-input-width', 'var(--input-width-medium)');
            break;
        case 'full':
            this.style.setProperty('--dads-input-width', 'var(--input-width-full)');
            break;
        default:
            // カスタム値 (200px, 20ch, 50% など)
            if (/^\d+(\.\d+)?(px|ch|em|rem|vw|%)$/.test(width)) {
                this.style.setProperty('--dads-input-width', width);
            }
            else {
                // 無効な値はfullにフォールバック
                this.style.setProperty('--dads-input-width', 'var(--input-width-full)');
            }
    }
}, _DadsInputText_updateAriaDescribedBy = function _DadsInputText_updateAriaDescribedBy() {
    const supportVisible = __classPrivateFieldGet(this, _DadsInputText_supportText, "f")?.style.display !== 'none';
    updateAriaDescribedBy(__classPrivateFieldGet(this, _DadsInputText_input, "f"), supportVisible, this.hasAttribute('error'));
}, _DadsInputText_validateRequired = function _DadsInputText_validateRequired() {
    if (!this.hasAttribute('required'))
        return true;
    const isValid = this.value.trim().length > 0;
    if (!isValid) {
        __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_showValidationError).call(this, 'required');
    }
    return isValid;
}, _DadsInputText_validateTypeMismatch = function _DadsInputText_validateTypeMismatch() {
    // type="email" の場合のみバリデーション
    if (this.getAttribute('type') !== 'email')
        return true;
    // 空の値はバリデーションしない（requiredで別途チェック）
    if (this.value.trim().length === 0)
        return true;
    const isValid = VALIDATION_RULES.typeMismatch.validate(this.value, this);
    if (!isValid) {
        __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_showValidationError).call(this, 'typeMismatch');
    }
    return isValid;
}, _DadsInputText_showValidationError = function _DadsInputText_showValidationError(type) {
    __classPrivateFieldSet(this, _DadsInputText_validationErrorType, type, "f");
    const message = __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_getErrorMessage).call(this, type);
    showValidationError({
        element: this,
        control: __classPrivateFieldGet(this, _DadsInputText_input, "f"),
        internals: this._internals,
        message,
        updateUI: (hasError) => __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateValidationUI).call(this, hasError),
    });
}, _DadsInputText_clearValidationError = function _DadsInputText_clearValidationError() {
    if (__classPrivateFieldGet(this, _DadsInputText_validationErrorType, "f") === null)
        return;
    __classPrivateFieldSet(this, _DadsInputText_validationErrorType, null, "f");
    clearValidationError(this, this._internals, (hasError) => __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateValidationUI).call(this, hasError));
}, _DadsInputText_updateValidationUI = function _DadsInputText_updateValidationUI(hasError) {
    updateValidationUI(__classPrivateFieldGet(this, _DadsInputText_input, "f"), hasError, () => updateErrorFallback(__classPrivateFieldGet(this, _DadsInputText_errorSlot, "f"), __classPrivateFieldGet(this, _DadsInputText_errorText, "f"), __classPrivateFieldGet(this, _DadsInputText_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error')), () => __classPrivateFieldGet(this, _DadsInputText_instances, "m", _DadsInputText_updateAriaDescribedBy).call(this));
}, _DadsInputText_getErrorMessage = function _DadsInputText_getErrorMessage(type) {
    return getValidationMessage(this, VALIDATION_RULES[type]);
};
DadsInputText.formAssociated = true;
DadsInputText.definition = {
    name: 'dads-input-text',
    template: html `
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="input">
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

        <div part="input-wrapper" id="input-wrapper">
          <input
            part="input"
            id="input"
            type="text"
          />
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
        <slot name="type-mismatch-error" id="type-mismatch-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        inputTextTokens,
        inputTextStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('support-text'),
        PropertyAttr('type'),
        BooleanAttr('required'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        BooleanAttr('disabled'),
        BooleanAttr('readonly'),
        PropertyAttr('name'),
        PropertyAttr('size'),
        PropertyAttr('input-width'),
        BooleanAttr('auto-validate'),
        PropertyAttr('autocomplete'),
        // value は observedAttributes に含めるが、PropertyAttr は使わない
        { attribute: 'value' },
    ],
};
// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsInputText, 'value', 'value');
