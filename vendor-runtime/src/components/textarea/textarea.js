/**
 * @module textarea
 * デジタル庁デザインシステム Textareaコンポーネント
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
var _DadsTextarea_instances, _DadsTextarea_textarea, _DadsTextarea_counter, _DadsTextarea_labelSlot, _DadsTextarea_supportSlot, _DadsTextarea_errorSlot, _DadsTextarea_labelFallback, _DadsTextarea_supportText, _DadsTextarea_supportFallback, _DadsTextarea_errorText, _DadsTextarea_errorFallback, _DadsTextarea_requirement, _DadsTextarea_validationErrorType, _DadsTextarea_formValidation, _DadsTextarea_syncAllState, _DadsTextarea_initTextarea, _DadsTextarea_initSlots, _DadsTextarea_syncTextareaAttributes, _DadsTextarea_updateCounter, _DadsTextarea_updateAriaDescribedBy, _DadsTextarea_handleInput, _DadsTextarea_handleChange, _DadsTextarea_handleBlur, _DadsTextarea_handleFormSubmit, _DadsTextarea_validateOverflow, _DadsTextarea_validateRequired, _DadsTextarea_showValidationError, _DadsTextarea_clearValidationError, _DadsTextarea_updateValidationUI, _DadsTextarea_getErrorMessage;
import { html, BooleanAttr, PropertyAttr, } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { textareaTokens } from './textarea-tokens.js';
import { textareaStyles } from './textarea-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { checkDeprecatedAttrs, DEPRECATED_FORM_ATTRS, } from '../../utils/deprecated-attrs.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { setDefaultAttributes, setupFormValidation, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, updateValidationUI, showValidationError, clearValidationError, updateAriaDescribedBy, setupSlotChangeListeners, } from '../../utils/form-component-helpers.js';
/**
 * Textareaコンポーネント
 *
 * @customElement dads-textarea
 * @tagname dads-textarea
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト（ヒント）
 * @slot error-text - エラーメッセージ
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ
 * @slot overflow-error - 文字数超過バリデーションのカスタムエラーメッセージ
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label - ラベル要素
 * @csspart requirement - 要否ラベル（必須/読み取り専用）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart textarea-wrapper - テキストエリアを囲むコンテナ
 * @csspart textarea - ネイティブtextarea要素
 * @csspart counter - 文字数カウンター（show-counter未設定時は:emptyで自動非表示）
 * @csspart error-text - エラーメッセージコンテナ
 *
 * @attr {string} label - ラベルテキスト（スロット未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（スロット未使用時のフォールバック）
 * @attr {boolean} required - 必須項目
 * @attr {number} maxlength - 最大文字数
 * @attr {boolean} show-counter - 文字数カウンター表示
 * @attr {number} counter-max - カウンター用最大値（maxlength未設定時）
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（スロット未使用時のフォールバック）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} readonly - 読み取り専用
 * @attr {string} name - フォーム名
 * @attr {number} rows - 行数（デフォルト: 3）
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {string} value - 値
 * @attr {boolean} auto-validate - 自動バリデーションを有効化
 *
 * @fires dads-input - 入力時に発火
 * @fires dads-change - 値変更確定時に発火
 *
 * @example
 * ```html
 * <dads-textarea label="お問い合わせ内容" required show-counter maxlength="500">
 *   <span slot="support-text">500文字以内で入力してください</span>
 * </dads-textarea>
 * ```
 */
export class DadsTextarea extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsTextarea_instances.add(this);
        // Private fields
        _DadsTextarea_textarea.set(this, null);
        _DadsTextarea_counter.set(this, null);
        _DadsTextarea_labelSlot.set(this, null);
        _DadsTextarea_supportSlot.set(this, null);
        _DadsTextarea_errorSlot.set(this, null);
        // UI要素参照
        _DadsTextarea_labelFallback.set(this, null);
        _DadsTextarea_supportText.set(this, null);
        _DadsTextarea_supportFallback.set(this, null);
        _DadsTextarea_errorText.set(this, null);
        _DadsTextarea_errorFallback.set(this, null);
        _DadsTextarea_requirement.set(this, null);
        // バリデーション状態
        _DadsTextarea_validationErrorType.set(this, null);
        // フォームバリデーションセットアップ
        _DadsTextarea_formValidation.set(this, null);
        _DadsTextarea_handleInput.set(this, () => {
            __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateCounter).call(this);
            // フォーム値を更新
            if (__classPrivateFieldGet(this, _DadsTextarea_textarea, "f")) {
                this._internals.setFormValue(__classPrivateFieldGet(this, _DadsTextarea_textarea, "f").value);
            }
            // auto-validate時、入力開始でバリデーションエラーをクリア
            if (this.hasAttribute('auto-validate') && __classPrivateFieldGet(this, _DadsTextarea_validationErrorType, "f")) {
                __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_clearValidationError).call(this);
            }
            // カスタムイベント発火
            this.emitEvent('dads-input', { value: this.value });
        });
        _DadsTextarea_handleChange.set(this, () => {
            this.emitEvent('dads-change', { value: this.value });
        });
        _DadsTextarea_handleBlur.set(this, () => {
            // auto-validateが有効で、disabled/readonlyでない場合のみバリデーション
            if (!this.hasAttribute('auto-validate'))
                return;
            if (this.hasAttribute('disabled') || this.hasAttribute('readonly'))
                return;
            __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_validateOverflow).call(this);
        });
        _DadsTextarea_handleFormSubmit.set(this, (e) => {
            // disabled/readonlyの場合はバリデーションしない
            if (this.hasAttribute('disabled') || this.hasAttribute('readonly'))
                return;
            const isRequiredValid = __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_validateRequired).call(this);
            const isOverflowValid = __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_validateOverflow).call(this);
            if (!isRequiredValid || !isOverflowValid) {
                e.preventDefault();
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // 非推奨属性のチェック（警告を出力）
        checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);
        // デフォルト属性の設定
        setDefaultAttributes(this, { size: 'md' });
        // 内部要素の参照を取得
        __classPrivateFieldSet(this, _DadsTextarea_textarea, this.shadowRoot?.querySelector('[part="textarea"]'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_counter, this.shadowRoot?.querySelector('[part="counter"]'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        // UI要素参照取得
        __classPrivateFieldSet(this, _DadsTextarea_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsTextarea_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        // 初期化
        __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_initTextarea).call(this);
        __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_initSlots).call(this);
        // フォームバリデーションのセットアップ
        __classPrivateFieldSet(this, _DadsTextarea_formValidation, setupFormValidation(this, this._internals, 'auto-validate', __classPrivateFieldGet(this, _DadsTextarea_handleFormSubmit, "f")), "f");
        // 属性が接続後に設定された場合のために再同期
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        // Form submit リスナーのクリーンアップ（メモリリーク防止）
        __classPrivateFieldGet(this, _DadsTextarea_formValidation, "f")?.cleanup();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        // 初期化前は無視
        if (!__classPrivateFieldGet(this, _DadsTextarea_textarea, "f"))
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsTextarea_labelSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsTextarea_supportSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportText, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateAriaDescribedBy).call(this);
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsTextarea_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
                // required は内部textareaに転送しない（カスタムバリデーションで制御）
                // aria-required でアクセシビリティを維持
                if (this.hasAttribute('required')) {
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute('aria-required', 'true');
                }
                else {
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").removeAttribute('aria-required');
                }
                break;
            case 'maxlength':
            case 'counter-max':
            case 'show-counter':
                __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateCounter).call(this);
                __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateAriaDescribedBy).call(this);
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsTextarea_errorSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorText, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateAriaDescribedBy).call(this);
                __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").disabled = this.hasAttribute('disabled');
                break;
            case 'readonly':
                updateRequirement(__classPrivateFieldGet(this, _DadsTextarea_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
                __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").readOnly = this.hasAttribute('readonly');
                break;
            case 'name':
                if (newValue !== null)
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute(name, newValue);
                else
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").removeAttribute(name);
                break;
            case 'rows':
                if (newValue !== null) {
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").rows = parseInt(newValue, 10);
                }
                break;
            case 'value':
                if (newValue !== null) {
                    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").value = newValue;
                    this._internals.setFormValue(newValue);
                    __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateCounter).call(this);
                }
                break;
        }
    }
    // Public API
    get value() {
        return __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.value ?? '';
    }
    set value(v) {
        if (__classPrivateFieldGet(this, _DadsTextarea_textarea, "f")) {
            __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").value = v;
            this._internals.setFormValue(v);
            __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateCounter).call(this);
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
        if (__classPrivateFieldGet(this, _DadsTextarea_textarea, "f")) {
            __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").disabled = disabled;
        }
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.blur();
    }
    select() {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.select();
    }
    setSelectionRange(start, end, direction) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.setSelectionRange(start, end, direction);
    }
}
_DadsTextarea_textarea = new WeakMap(), _DadsTextarea_counter = new WeakMap(), _DadsTextarea_labelSlot = new WeakMap(), _DadsTextarea_supportSlot = new WeakMap(), _DadsTextarea_errorSlot = new WeakMap(), _DadsTextarea_labelFallback = new WeakMap(), _DadsTextarea_supportText = new WeakMap(), _DadsTextarea_supportFallback = new WeakMap(), _DadsTextarea_errorText = new WeakMap(), _DadsTextarea_errorFallback = new WeakMap(), _DadsTextarea_requirement = new WeakMap(), _DadsTextarea_validationErrorType = new WeakMap(), _DadsTextarea_formValidation = new WeakMap(), _DadsTextarea_handleInput = new WeakMap(), _DadsTextarea_handleChange = new WeakMap(), _DadsTextarea_handleBlur = new WeakMap(), _DadsTextarea_handleFormSubmit = new WeakMap(), _DadsTextarea_instances = new WeakSet(), _DadsTextarea_syncAllState = function _DadsTextarea_syncAllState() {
    __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_syncTextareaAttributes).call(this);
    updateLabelFallback(__classPrivateFieldGet(this, _DadsTextarea_labelSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_labelFallback, "f"), this.getAttribute('label'));
    updateSupportFallback(__classPrivateFieldGet(this, _DadsTextarea_supportSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportText, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportFallback, "f"), this.getAttribute('support-text'));
    updateErrorFallback(__classPrivateFieldGet(this, _DadsTextarea_errorSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorText, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
    updateRequirement(__classPrivateFieldGet(this, _DadsTextarea_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
    __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateCounter).call(this);
    __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateAriaDescribedBy).call(this);
}, _DadsTextarea_initTextarea = function _DadsTextarea_initTextarea() {
    if (!__classPrivateFieldGet(this, _DadsTextarea_textarea, "f"))
        return;
    // 属性の転送
    __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_syncTextareaAttributes).call(this);
    // イベントリスナー
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").addEventListener('input', __classPrivateFieldGet(this, _DadsTextarea_handleInput, "f"));
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").addEventListener('change', __classPrivateFieldGet(this, _DadsTextarea_handleChange, "f"));
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").addEventListener('blur', __classPrivateFieldGet(this, _DadsTextarea_handleBlur, "f"));
}, _DadsTextarea_initSlots = function _DadsTextarea_initSlots() {
    setupSlotChangeListeners({
        label: __classPrivateFieldGet(this, _DadsTextarea_labelSlot, "f"),
        support: __classPrivateFieldGet(this, _DadsTextarea_supportSlot, "f"),
        error: __classPrivateFieldGet(this, _DadsTextarea_errorSlot, "f"),
    }, {
        onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsTextarea_labelSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_labelFallback, "f"), this.getAttribute('label')),
        onSupportChange: () => updateSupportFallback(__classPrivateFieldGet(this, _DadsTextarea_supportSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportText, "f"), __classPrivateFieldGet(this, _DadsTextarea_supportFallback, "f"), this.getAttribute('support-text')),
        onErrorChange: () => updateErrorFallback(__classPrivateFieldGet(this, _DadsTextarea_errorSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorText, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error')),
    });
    updateRequirement(__classPrivateFieldGet(this, _DadsTextarea_requirement, "f"), this.hasAttribute('required'), this.hasAttribute('readonly'));
}, _DadsTextarea_syncTextareaAttributes = function _DadsTextarea_syncTextareaAttributes() {
    if (!__classPrivateFieldGet(this, _DadsTextarea_textarea, "f"))
        return;
    // 転送する属性（文字列）
    // placeholder は非推奨: 内部textareaには転送しない
    // auto-validate時はmaxlengthを転送しない（ブラウザの制限を無効化してバリデーションで制御）
    const hasAutoValidate = this.hasAttribute('auto-validate');
    const transferAttrs = hasAutoValidate ? ['name'] : ['maxlength', 'name'];
    for (const attr of transferAttrs) {
        const value = this.getAttribute(attr);
        if (value !== null) {
            __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute(attr, value);
        }
    }
    // auto-validate時はmaxlengthを削除（属性変更で追加された場合に備えて）
    if (hasAutoValidate) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").removeAttribute('maxlength');
    }
    // rows属性は数値プロパティとして設定
    const rowsAttr = this.getAttribute('rows');
    if (rowsAttr !== null) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").rows = parseInt(rowsAttr, 10);
    }
    // Boolean属性
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").disabled = this.hasAttribute('disabled');
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").readOnly = this.hasAttribute('readonly');
    // required は内部textareaに転送しない（ネイティブバリデーションを使わず、カスタムバリデーションで制御）
    // 代わりに aria-required を設定してアクセシビリティを維持
    if (this.hasAttribute('required')) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute('aria-required', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").removeAttribute('aria-required');
    }
    // 初期値の設定（value属性から）
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
        __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").value = valueAttr;
        this._internals.setFormValue(valueAttr);
    }
    // エラー状態
    const hasError = this.hasAttribute('error');
    __classPrivateFieldGet(this, _DadsTextarea_textarea, "f").setAttribute('aria-invalid', hasError ? 'true' : 'false');
}, _DadsTextarea_updateCounter = function _DadsTextarea_updateCounter() {
    if (!__classPrivateFieldGet(this, _DadsTextarea_counter, "f"))
        return;
    const showCounter = this.hasAttribute('show-counter');
    if (!showCounter) {
        // :empty疑似クラスで非表示にするため、textContentを空にする
        __classPrivateFieldGet(this, _DadsTextarea_counter, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsTextarea_counter, "f").removeAttribute('data-exceeded');
        return;
    }
    const currentLength = __classPrivateFieldGet(this, _DadsTextarea_textarea, "f")?.value.length ?? 0;
    const maxLength = this.getAttribute('maxlength') ?? this.getAttribute('counter-max');
    if (maxLength) {
        __classPrivateFieldGet(this, _DadsTextarea_counter, "f").textContent = `${currentLength}/${maxLength}`;
        // 超過時のエラー状態
        const max = parseInt(maxLength, 10);
        if (currentLength > max) {
            __classPrivateFieldGet(this, _DadsTextarea_counter, "f").setAttribute('data-exceeded', '');
        }
        else {
            __classPrivateFieldGet(this, _DadsTextarea_counter, "f").removeAttribute('data-exceeded');
        }
    }
    else {
        __classPrivateFieldGet(this, _DadsTextarea_counter, "f").textContent = `${currentLength}`;
    }
}, _DadsTextarea_updateAriaDescribedBy = function _DadsTextarea_updateAriaDescribedBy() {
    const supportVisible = __classPrivateFieldGet(this, _DadsTextarea_supportText, "f")?.style.display !== 'none';
    const counterVisible = this.hasAttribute('show-counter');
    updateAriaDescribedBy(__classPrivateFieldGet(this, _DadsTextarea_textarea, "f"), supportVisible, this.hasAttribute('error'), counterVisible);
}, _DadsTextarea_validateOverflow = function _DadsTextarea_validateOverflow() {
    const maxLength = this.getAttribute('maxlength') ?? this.getAttribute('counter-max');
    if (!maxLength)
        return true;
    const max = parseInt(maxLength, 10);
    // 無効な数値の場合は検証スキップ
    if (Number.isNaN(max))
        return true;
    const isValid = this.value.length <= max;
    if (!isValid) {
        __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_showValidationError).call(this, 'overflow');
    }
    else if (__classPrivateFieldGet(this, _DadsTextarea_validationErrorType, "f") === 'overflow') {
        __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_clearValidationError).call(this);
    }
    return isValid;
}, _DadsTextarea_validateRequired = function _DadsTextarea_validateRequired() {
    if (!this.hasAttribute('required'))
        return true;
    const isValid = this.value.trim().length > 0;
    if (!isValid) {
        __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_showValidationError).call(this, 'required');
    }
    return isValid;
}, _DadsTextarea_showValidationError = function _DadsTextarea_showValidationError(type) {
    __classPrivateFieldSet(this, _DadsTextarea_validationErrorType, type, "f");
    const message = __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_getErrorMessage).call(this, type);
    showValidationError({
        element: this,
        control: __classPrivateFieldGet(this, _DadsTextarea_textarea, "f"),
        internals: this._internals,
        message,
        updateUI: (hasError) => __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateValidationUI).call(this, hasError),
    });
}, _DadsTextarea_clearValidationError = function _DadsTextarea_clearValidationError() {
    if (__classPrivateFieldGet(this, _DadsTextarea_validationErrorType, "f") === null)
        return;
    __classPrivateFieldSet(this, _DadsTextarea_validationErrorType, null, "f");
    clearValidationError(this, this._internals, (hasError) => __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateValidationUI).call(this, hasError));
}, _DadsTextarea_updateValidationUI = function _DadsTextarea_updateValidationUI(hasError) {
    updateValidationUI(__classPrivateFieldGet(this, _DadsTextarea_textarea, "f"), hasError, () => updateErrorFallback(__classPrivateFieldGet(this, _DadsTextarea_errorSlot, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorText, "f"), __classPrivateFieldGet(this, _DadsTextarea_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error')), () => __classPrivateFieldGet(this, _DadsTextarea_instances, "m", _DadsTextarea_updateAriaDescribedBy).call(this));
}, _DadsTextarea_getErrorMessage = function _DadsTextarea_getErrorMessage(type) {
    return getValidationMessage(this, VALIDATION_RULES[type]);
};
DadsTextarea.formAssociated = true;
DadsTextarea.definition = {
    name: 'dads-textarea',
    template: html `
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="textarea">
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

        <div part="textarea-wrapper" id="textarea-wrapper">
          <textarea
            part="textarea"
            id="textarea"
            rows="3"
          ></textarea>
        </div>

        <span part="counter" id="counter"></span>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
        <slot name="required-error" id="required-error-slot" hidden></slot>
        <slot name="overflow-error" id="overflow-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        textareaTokens,
        textareaStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('support-text'),
        BooleanAttr('required'),
        PropertyAttr('maxlength'),
        BooleanAttr('show-counter'),
        PropertyAttr('counter-max'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        BooleanAttr('disabled'),
        BooleanAttr('readonly'),
        // placeholder は非推奨: support-text を使用してください
        PropertyAttr('name'),
        PropertyAttr('rows'),
        PropertyAttr('size'),
        // value は observedAttributes に含めるが、PropertyAttr は使わない
        // カスタム getter/setter が定義されているため (property フィールドなし)
        { attribute: 'value' },
        BooleanAttr('auto-validate'),
    ],
};
// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsTextarea, 'value', 'value');
