/**
 * @module radio
 * デジタル庁デザインシステム Radioコンポーネント
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
var _DadsRadio_instances, _a, _DadsRadio_base, _DadsRadio_input, _DadsRadio_labelEl, _DadsRadio_requirement, _DadsRadio_errorText, _DadsRadio_formDisabled, _DadsRadio_validationError, _DadsRadio_formValidation, _DadsRadio_syncAll, _DadsRadio_syncLabel, _DadsRadio_syncRequirement, _DadsRadio_syncErrorText, _DadsRadio_syncInputFromAttributes, _DadsRadio_syncAria, _DadsRadio_syncAriaInvalid, _DadsRadio_syncFormValue, _DadsRadio_getGroupName, _DadsRadio_getRadioQueryRoot, _DadsRadio_getGroupRadiosForName, _DadsRadio_getGroupRadios, _DadsRadio_getGroupErrorAnchor, _DadsRadio_getGroupDefaultCheckedRadio, _DadsRadio_setCheckedFromGroup, _DadsRadio_enforceSingleSelection, _DadsRadio_syncGroupTabStop, _DadsRadio_setupFormValidation, _DadsRadio_handleFormSubmit, _DadsRadio_showGroupValidationError, _DadsRadio_clearGroupValidationError, _DadsRadio_clearValidationError, _DadsRadio_clearGroupValidationErrorIfNeeded, _DadsRadio_getRequiredErrorMessage, _DadsRadio_handleChange, _DadsRadio_handleKeyDown, _DadsRadio_handleErrorAttributeChange, _DadsRadio_handleErrorTextAttributeChange, _DadsRadio_isDisabled;
import { html, BooleanAttr, PropertyAttr, ElementSelection } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes, setupFormValidation, updateRequirement, } from '../../utils/form-component-helpers.js';
import { VALIDATION_RULES, getValidationMessage } from '../../utils/validation.js';
import { radioStyles } from './radio-styles.js';
import { radioTokens } from './radio-tokens.js';
/**
 * Radioコンポーネント
 *
 * DADS HTML版の構造・見た目に準拠しつつ、Form-Associated Custom Elementとしてフォームに参加します。
 *
 * ⚠️ 注意: Shadow DOM内のネイティブinput[type="radio"]は、他のShadowRoot内inputとグルーピングされません。
 * そのため、本コンポーネントは `name` 属性をキーに同一スコープ内の `*-radio` 同士を排他制御します。
 *
 * @customElement dads-radio
 * @tagname dads-radio
 *
 * @csspart base - label相当のラッパー
 * @csspart radio - ラジオ枠（背景ホバー含む）
 * @csspart input - ネイティブinput[type=radio]
 * @csspart label - ラベルテキスト
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart error-text - エラーメッセージ
 *
 * @attr {string} label - ラベルテキスト
 * @attr {string} size - サイズ (sm | md | lg)
 * @attr {boolean} checked - 初期チェック状態（属性はデフォルト値として扱う）
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須（グループ内で未選択のままsubmit時にinvalid）
 * @attr {boolean} auto-validate - submit時の自動バリデーション
 * @attr {boolean} error - エラー状態（aria-invalid="true"）
 * @attr {string} error-text - エラーメッセージ（バリデーション時に設定）
 * @attr {string} name - フォーム名（グループ判定に使用）
 * @attr {string} value - 送信値（未指定時は "on"）
 * @attr {string} aria-label - アクセシビリティラベル（ラベルなし時に推奨）
 * @attr {string} aria-labelledby - 外部ラベル参照
 * @attr {string} aria-describedby - 補足/エラー参照
 *
 * @slot required-error - 必須バリデーションのカスタムエラーメッセージ（非表示）
 */
export class DadsRadio extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsRadio_instances.add(this);
        _DadsRadio_base.set(this, null);
        _DadsRadio_input.set(this, null);
        _DadsRadio_labelEl.set(this, null);
        _DadsRadio_requirement.set(this, null);
        _DadsRadio_errorText.set(this, null);
        _DadsRadio_formDisabled.set(this, false);
        _DadsRadio_validationError.set(this, false);
        _DadsRadio_formValidation.set(this, null);
        _DadsRadio_handleFormSubmit.set(this, (e) => {
            if (__classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this))
                return;
            const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadios).call(this);
            // グループ内の有効なrequiredが1つでもあれば、グループ必須として扱う
            let groupRequired = false;
            for (const radio of group) {
                if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
                    continue;
                if (!radio.hasAttribute('required'))
                    continue;
                groupRequired = true;
                break;
            }
            if (!groupRequired)
                return;
            let isValid = false;
            for (const radio of group) {
                if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
                    continue;
                if (!radio.checked)
                    continue;
                isValid = true;
                break;
            }
            const anchor = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupErrorAnchor).call(this, group);
            if (isValid) {
                __classPrivateFieldGet(anchor, _DadsRadio_instances, "m", _DadsRadio_clearGroupValidationError).call(anchor, group);
                return;
            }
            e.preventDefault();
            __classPrivateFieldGet(anchor, _DadsRadio_instances, "m", _DadsRadio_showGroupValidationError).call(anchor, group);
        });
        // ============================================================
        // Events
        // ============================================================
        _DadsRadio_handleChange.set(this, () => {
            if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
                return;
            if (__classPrivateFieldGet(this, _DadsRadio_input, "f").checked) {
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_enforceSingleSelection).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_clearGroupValidationErrorIfNeeded).call(this);
            }
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
            this.emitEvent('dads-change', {
                checked: this.checked,
                value: this.value,
            });
        });
        _DadsRadio_handleKeyDown.set(this, (e) => {
            if (__classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this))
                return;
            const name = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupName).call(this);
            if (!name)
                return;
            const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadiosForName).call(this, name);
            if (group.length <= 1)
                return;
            const enabled = [];
            for (const radio of group) {
                if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
                    continue;
                enabled.push(radio);
            }
            if (enabled.length <= 1)
                return;
            const selection = new ElementSelection(enabled, this);
            selection.processKey(e, (target) => {
                if (target === this || !__classPrivateFieldGet(target, _DadsRadio_input, "f"))
                    return;
                // Shadow DOMで失われるネイティブ挙動を補完: 矢印操作で選択＋フォーカス
                __classPrivateFieldGet(target, _DadsRadio_input, "f").click();
                target.focus();
            }, {
                wrap: true,
                allowAlternateAxis: true,
                preventDefaultHomeEnd: true,
            });
        });
    }
    // ベースクラスではobservedAttributesが自動で解決されないため明示（happy-dom含む互換性担保）
    static get observedAttributes() {
        return [
            'label',
            'size',
            'checked',
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
        __classPrivateFieldSet(this, _DadsRadio_base, this.shadowRoot?.querySelector('#base'), "f");
        __classPrivateFieldSet(this, _DadsRadio_input, this.shadowRoot?.querySelector('#input'), "f");
        __classPrivateFieldSet(this, _DadsRadio_labelEl, this.shadowRoot?.querySelector('#label'), "f");
        __classPrivateFieldSet(this, _DadsRadio_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        __classPrivateFieldSet(this, _DadsRadio_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAll).call(this);
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.addEventListener('change', __classPrivateFieldGet(this, _DadsRadio_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsRadio_handleKeyDown, "f"));
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_setupFormValidation).call(this);
        // 他のradioの初期化も完了したタイミングで、グループの状態を整える
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_enforceSingleSelection).call(this);
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
        });
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsRadio_handleChange, "f"));
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsRadio_handleKeyDown, "f"));
        __classPrivateFieldGet(this, _DadsRadio_formValidation, "f")?.cleanup();
        __classPrivateFieldSet(this, _DadsRadio_formValidation, null, "f");
    }
    // ============================================================
    // Public API
    // ============================================================
    get checked() {
        return __classPrivateFieldGet(this, _DadsRadio_input, "f")?.checked ?? this.hasAttribute('checked');
    }
    set checked(v) {
        if (!__classPrivateFieldGet(this, _DadsRadio_input, "f")) {
            // 初期化前は属性に退避（初期値として扱う）
            this.toggleAttribute('checked', v);
            return;
        }
        __classPrivateFieldGet(this, _DadsRadio_input, "f").checked = v;
        if (v) {
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_enforceSingleSelection).call(this);
        }
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
        if (v) {
            __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_clearGroupValidationErrorIfNeeded).call(this);
        }
    }
    get value() {
        return this.getAttribute('value') ?? 'on';
    }
    set value(v) {
        this.setAttribute('value', v);
    }
    // Focus delegation
    focus(options) {
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsRadio_input, "f")?.blur();
    }
    /**
     * ※必須表示の再同期
     * fieldsetから呼び出される（スロット変更時やrequired属性変更時）
     */
    syncRequirement() {
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncRequirement).call(this);
    }
    // ============================================================
    // Form callbacks
    // ============================================================
    formResetCallback() {
        // checked属性をデフォルト値として扱い、リセット時に復元
        // 同一nameで複数のchecked属性が存在する場合でも、復元結果が一意になるようにグループで調整する
        const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadios).call(this);
        const defaultChecked = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupDefaultCheckedRadio).call(this, group);
        for (const radio of group) {
            __classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_setCheckedFromGroup).call(radio, defaultChecked !== null && radio === defaultChecked);
        }
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_clearValidationError).call(this);
    }
    formStateRestoreCallback(state, _mode) {
        if (state === null) {
            this.checked = false;
            return;
        }
        if (typeof state === 'string') {
            this.checked = true;
        }
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsRadio_formDisabled, disabled, "f");
        if (__classPrivateFieldGet(this, _DadsRadio_input, "f")) {
            __classPrivateFieldGet(this, _DadsRadio_input, "f").disabled = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this);
        }
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
    }
    // ============================================================
    // Attribute changes
    // ============================================================
    attributeChangedCallback(name, oldValue, newValue) {
        var _b;
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
            return;
        switch (name) {
            case 'label':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncLabel).call(this);
                break;
            case 'size':
                break;
            case 'checked':
                __classPrivateFieldGet(this, _DadsRadio_input, "f").checked = newValue !== null;
                if (__classPrivateFieldGet(this, _DadsRadio_input, "f").checked) {
                    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_enforceSingleSelection).call(this);
                    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_clearGroupValidationErrorIfNeeded).call(this);
                }
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsRadio_input, "f").disabled = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
                break;
            case 'required':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncRequirement).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAria).call(this);
                break;
            case 'auto-validate':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_setupFormValidation).call(this);
                break;
            case 'error':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_handleErrorAttributeChange).call(this);
                break;
            case 'error-text':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_handleErrorTextAttributeChange).call(this);
                break;
            case 'name': {
                // name変更時は旧グループと新グループ両方のタブストップを再計算
                const oldName = (oldValue ?? '').trim();
                const newNameTrimmed = (newValue ?? '').trim();
                if (oldName && oldName !== newNameTrimmed) {
                    const oldGroup = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadiosForName).call(this, oldName);
                    if (oldGroup.length > 0) {
                        __classPrivateFieldGet((_b = oldGroup[0]), _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(_b);
                    }
                }
                if (this.checked) {
                    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_enforceSingleSelection).call(this);
                }
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
                break;
            }
            case 'value':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
                break;
            case 'aria-label':
            case 'aria-labelledby':
            case 'aria-describedby':
                __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAria).call(this);
                break;
        }
    }
}
_a = DadsRadio, _DadsRadio_base = new WeakMap(), _DadsRadio_input = new WeakMap(), _DadsRadio_labelEl = new WeakMap(), _DadsRadio_requirement = new WeakMap(), _DadsRadio_errorText = new WeakMap(), _DadsRadio_formDisabled = new WeakMap(), _DadsRadio_validationError = new WeakMap(), _DadsRadio_formValidation = new WeakMap(), _DadsRadio_handleFormSubmit = new WeakMap(), _DadsRadio_handleChange = new WeakMap(), _DadsRadio_handleKeyDown = new WeakMap(), _DadsRadio_instances = new WeakSet(), _DadsRadio_syncAll = function _DadsRadio_syncAll() {
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncLabel).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncRequirement).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncErrorText).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncInputFromAttributes).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAria).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAriaInvalid).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncGroupTabStop).call(this);
}, _DadsRadio_syncLabel = function _DadsRadio_syncLabel() {
    if (!__classPrivateFieldGet(this, _DadsRadio_labelEl, "f"))
        return;
    __classPrivateFieldGet(this, _DadsRadio_labelEl, "f").textContent = this.getAttribute('label') ?? '';
}, _DadsRadio_syncRequirement = function _DadsRadio_syncRequirement() {
    if (!__classPrivateFieldGet(this, _DadsRadio_requirement, "f"))
        return;
    // fieldset内にいる場合は、fieldsetのlegendに※必須が表示されるため非表示
    const parentFieldset = this.closest('dads-fieldset');
    const insideRequiredFieldset = parentFieldset?.hasAttribute('required') ?? false;
    const showRequirement = this.hasAttribute('required') && !insideRequiredFieldset;
    updateRequirement(__classPrivateFieldGet(this, _DadsRadio_requirement, "f"), showRequirement, false);
}, _DadsRadio_syncErrorText = function _DadsRadio_syncErrorText() {
    if (!__classPrivateFieldGet(this, _DadsRadio_errorText, "f"))
        return;
    const hasError = this.hasAttribute('error');
    const errorMessage = this.getAttribute('error-text') ?? '';
    __classPrivateFieldGet(this, _DadsRadio_errorText, "f").textContent = hasError && errorMessage ? `＊${errorMessage}` : '';
}, _DadsRadio_syncInputFromAttributes = function _DadsRadio_syncInputFromAttributes() {
    if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsRadio_input, "f").checked = this.hasAttribute('checked');
    __classPrivateFieldGet(this, _DadsRadio_input, "f").disabled = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this);
}, _DadsRadio_syncAria = function _DadsRadio_syncAria() {
    if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
        return;
    // required はネイティブrequiredに転送しない（Form-Associated側で制御）
    if (this.hasAttribute('required')) {
        __classPrivateFieldGet(this, _DadsRadio_input, "f").setAttribute('aria-required', 'true');
    }
    else {
        __classPrivateFieldGet(this, _DadsRadio_input, "f").removeAttribute('aria-required');
    }
    const ariaAttrs = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    for (const attr of ariaAttrs) {
        const v = this.getAttribute(attr);
        if (v === null)
            __classPrivateFieldGet(this, _DadsRadio_input, "f").removeAttribute(attr);
        else
            __classPrivateFieldGet(this, _DadsRadio_input, "f").setAttribute(attr, v);
    }
}, _DadsRadio_syncAriaInvalid = function _DadsRadio_syncAriaInvalid() {
    if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
        return;
    const hasError = this.hasAttribute('error');
    __classPrivateFieldGet(this, _DadsRadio_input, "f").setAttribute('aria-invalid', String(hasError));
}, _DadsRadio_syncFormValue = function _DadsRadio_syncFormValue() {
    // disabled/unchecked は送信しない（ネイティブラジオ準拠）
    if (__classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(this) || !this.checked) {
        this._internals.setFormValue(null);
        return;
    }
    this._internals.setFormValue(this.value);
}, _DadsRadio_getGroupName = function _DadsRadio_getGroupName() {
    const name = this.getAttribute('name') ?? '';
    const trimmed = name.trim();
    return trimmed ? trimmed : null;
}, _DadsRadio_getRadioQueryRoot = function _DadsRadio_getRadioQueryRoot() {
    const form = this._internals.form;
    if (form)
        return form;
    const root = this.getRootNode();
    if (root instanceof ShadowRoot)
        return root;
    return document;
}, _DadsRadio_getGroupRadiosForName = function _DadsRadio_getGroupRadiosForName(name) {
    const root = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getRadioQueryRoot).call(this);
    const selector = this.localName;
    const matched = [];
    const nodes = root.querySelectorAll(selector);
    for (const el of nodes) {
        if (!(el instanceof _a))
            continue;
        if (el.hasAttribute('hidden'))
            continue;
        if ((el.getAttribute('name') ?? '').trim() !== name)
            continue;
        matched.push(el);
    }
    return matched.length > 0 ? matched : [this];
}, _DadsRadio_getGroupRadios = function _DadsRadio_getGroupRadios() {
    const name = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupName).call(this);
    if (!name)
        return [this];
    return __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadiosForName).call(this, name);
}, _DadsRadio_getGroupErrorAnchor = function _DadsRadio_getGroupErrorAnchor(group) {
    // エラーメッセージはグループの末尾に表示したい（選択肢の途中に挟まない）
    // ただし disabled 要素をアンカーにすると、実装/UAによってはバリデーション対象外になる可能性があるため、
    // 末尾から探索して「有効な要素」を優先する。
    for (let i = group.length - 1; i >= 0; i -= 1) {
        const radio = group[i];
        if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
            continue;
        return radio;
    }
    return group[group.length - 1];
}, _DadsRadio_getGroupDefaultCheckedRadio = function _DadsRadio_getGroupDefaultCheckedRadio(group) {
    // checked属性は「デフォルト値」。グループ内で複数指定されている場合は末尾を優先する。
    // ただし disabled を優先してしまうと選択肢として扱いづらいため、末尾から探索して「有効な要素」を優先する。
    let fallback = null;
    for (let i = group.length - 1; i >= 0; i -= 1) {
        const radio = group[i];
        if (!radio.hasAttribute('checked'))
            continue;
        if (fallback === null)
            fallback = radio;
        if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
            continue;
        return radio;
    }
    return fallback;
}, _DadsRadio_setCheckedFromGroup = function _DadsRadio_setCheckedFromGroup(v) {
    if (!__classPrivateFieldGet(this, _DadsRadio_input, "f")) {
        this.toggleAttribute('checked', v);
        return;
    }
    __classPrivateFieldGet(this, _DadsRadio_input, "f").checked = v;
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncFormValue).call(this);
}, _DadsRadio_enforceSingleSelection = function _DadsRadio_enforceSingleSelection() {
    if (!this.checked)
        return;
    const name = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupName).call(this);
    if (!name)
        return;
    const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadiosForName).call(this, name);
    for (const radio of group) {
        if (radio === this)
            continue;
        __classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_setCheckedFromGroup).call(radio, false);
    }
}, _DadsRadio_syncGroupTabStop = function _DadsRadio_syncGroupTabStop() {
    if (!__classPrivateFieldGet(this, _DadsRadio_input, "f"))
        return;
    const name = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupName).call(this);
    if (!name) {
        __classPrivateFieldGet(this, _DadsRadio_input, "f").tabIndex = 0;
        return;
    }
    const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadiosForName).call(this, name);
    let selected = null;
    for (const radio of group) {
        if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
            continue;
        if (!radio.checked)
            continue;
        selected = radio;
        break;
    }
    let firstEnabled = null;
    if (!selected) {
        for (const radio of group) {
            if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio))
                continue;
            firstEnabled = radio;
            break;
        }
    }
    for (const radio of group) {
        if (!__classPrivateFieldGet(radio, _DadsRadio_input, "f"))
            continue;
        if (__classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_isDisabled).call(radio)) {
            __classPrivateFieldGet(radio, _DadsRadio_input, "f").tabIndex = -1;
            continue;
        }
        const isTabStop = selected ? radio === selected : radio === firstEnabled;
        __classPrivateFieldGet(radio, _DadsRadio_input, "f").tabIndex = isTabStop ? 0 : -1;
    }
}, _DadsRadio_setupFormValidation = function _DadsRadio_setupFormValidation() {
    // 付け替えを許容（auto-validate属性の動的変更に追従）
    __classPrivateFieldGet(this, _DadsRadio_formValidation, "f")?.cleanup();
    __classPrivateFieldSet(this, _DadsRadio_formValidation, setupFormValidation(this, this._internals, 'auto-validate', __classPrivateFieldGet(this, _DadsRadio_handleFormSubmit, "f")), "f");
}, _DadsRadio_showGroupValidationError = function _DadsRadio_showGroupValidationError(group) {
    const message = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getRequiredErrorMessage).call(this);
    for (const radio of group) {
        // 既に手動エラーが入っている場合は上書きしない
        const hasManualError = radio.hasAttribute('error') && !__classPrivateFieldGet(radio, _DadsRadio_validationError, "f");
        if (hasManualError)
            continue;
        __classPrivateFieldSet(radio, _DadsRadio_validationError, true, "f");
        radio.setAttribute('error', '');
        if (radio === this) {
            radio.setAttribute('error-text', message);
        }
        else {
            radio.removeAttribute('error-text');
        }
    }
    this._internals.setValidity({ valueMissing: true }, message, __classPrivateFieldGet(this, _DadsRadio_input, "f") ?? undefined);
}, _DadsRadio_clearGroupValidationError = function _DadsRadio_clearGroupValidationError(group) {
    for (const radio of group) {
        __classPrivateFieldGet(radio, _DadsRadio_instances, "m", _DadsRadio_clearValidationError).call(radio);
    }
}, _DadsRadio_clearValidationError = function _DadsRadio_clearValidationError() {
    if (!__classPrivateFieldGet(this, _DadsRadio_validationError, "f"))
        return;
    __classPrivateFieldSet(this, _DadsRadio_validationError, false, "f");
    this.removeAttribute('error');
    this.removeAttribute('error-text');
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAriaInvalid).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncErrorText).call(this);
    this._internals.setValidity({});
}, _DadsRadio_clearGroupValidationErrorIfNeeded = function _DadsRadio_clearGroupValidationErrorIfNeeded() {
    const group = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupRadios).call(this);
    let hasAnyValidationError = false;
    for (const radio of group) {
        if (!__classPrivateFieldGet(radio, _DadsRadio_validationError, "f"))
            continue;
        hasAnyValidationError = true;
        break;
    }
    if (!hasAnyValidationError)
        return;
    const anchor = __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_getGroupErrorAnchor).call(this, group);
    __classPrivateFieldGet(anchor, _DadsRadio_instances, "m", _DadsRadio_clearGroupValidationError).call(anchor, group);
}, _DadsRadio_getRequiredErrorMessage = function _DadsRadio_getRequiredErrorMessage() {
    return getValidationMessage(this, VALIDATION_RULES.required);
}, _DadsRadio_handleErrorAttributeChange = function _DadsRadio_handleErrorAttributeChange() {
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncAriaInvalid).call(this);
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncErrorText).call(this);
    if (!this.hasAttribute('error')) {
        if (!__classPrivateFieldGet(this, _DadsRadio_validationError, "f")) {
            this._internals.setValidity({});
        }
        return;
    }
    if (!__classPrivateFieldGet(this, _DadsRadio_validationError, "f")) {
        const message = this.getAttribute('error-text') ?? '';
        if (message) {
            this._internals.setValidity({ customError: true }, message, __classPrivateFieldGet(this, _DadsRadio_input, "f") ?? undefined);
        }
    }
}, _DadsRadio_handleErrorTextAttributeChange = function _DadsRadio_handleErrorTextAttributeChange() {
    __classPrivateFieldGet(this, _DadsRadio_instances, "m", _DadsRadio_syncErrorText).call(this);
    if (!this.hasAttribute('error'))
        return;
    const message = this.getAttribute('error-text') ?? '';
    const validityFlag = __classPrivateFieldGet(this, _DadsRadio_validationError, "f") ? { valueMissing: true } : { customError: true };
    this._internals.setValidity(validityFlag, message, __classPrivateFieldGet(this, _DadsRadio_input, "f") ?? undefined);
}, _DadsRadio_isDisabled = function _DadsRadio_isDisabled() {
    return this.hasAttribute('disabled') || __classPrivateFieldGet(this, _DadsRadio_formDisabled, "f");
};
DadsRadio.formAssociated = true;
DadsRadio.version = '1.0.0';
DadsRadio.definition = {
    name: 'dads-radio',
    template: html `
      <label part="base" id="base">
        <span part="radio" id="radio">
          <input part="input" id="input" type="radio" />
        </span>
        <span part="label" id="label"></span>
        <span part="requirement" id="requirement"></span>
      </label>

      <!-- エラーメッセージ表示 -->
      <span part="error-text" id="error-text"></span>

      <!-- バリデーション用カスタムエラーメッセージスロット（非表示） -->
      <slot name="required-error" id="required-error-slot" hidden></slot>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), radioTokens, radioStyles], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('size'),
        BooleanAttr('disabled'),
        BooleanAttr('required'),
        BooleanAttr('auto-validate'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        PropertyAttr('name'),
        // checked/value はカスタムgetter/setterを持つため PropertyAttr/BooleanAttr を使わない
        { attribute: 'checked' },
        { attribute: 'value' },
        { attribute: 'aria-label' },
        { attribute: 'aria-labelledby' },
        { attribute: 'aria-describedby' },
    ],
};
