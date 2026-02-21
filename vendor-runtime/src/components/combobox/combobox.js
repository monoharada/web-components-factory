/**
 * @module combobox
 * デジタル庁デザインシステム Comboboxコンポーネント
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DadsCombobox_instances, _DadsCombobox_input, _DadsCombobox_indicator, _DadsCombobox_listbox, _DadsCombobox_chipList, _DadsCombobox_labelSlot, _DadsCombobox_supportSlot, _DadsCombobox_errorSlot, _DadsCombobox_labelFallback, _DadsCombobox_supportText, _DadsCombobox_supportFallback, _DadsCombobox_errorText, _DadsCombobox_errorFallback, _DadsCombobox_requirement, _DadsCombobox_listboxId, _DadsCombobox_isOpen, _DadsCombobox_query, _DadsCombobox_activeIndex, _DadsCombobox_options, _DadsCombobox_selectedSingle, _DadsCombobox_selectedMultiple, _DadsCombobox_formDisabled, _DadsCombobox_optionsObserver, _DadsCombobox_documentAbort, _DadsCombobox_ensureDefaultBooleans, _DadsCombobox_upgradePreDefinedValueProperty, _DadsCombobox_mode_get, _DadsCombobox_sanitizeModeAttribute, _DadsCombobox_setupSlots, _DadsCombobox_setupControlListeners, _DadsCombobox_setupOptionsObserver, _DadsCombobox_shouldSyncOptionsFromMutation, _DadsCombobox_syncAllState, _DadsCombobox_syncFromLightDomOptions, _DadsCombobox_applyValueAttribute, _DadsCombobox_syncSelectionForModeChange, _DadsCombobox_isKnownOptionValue, _DadsCombobox_filterKnownValues, _DadsCombobox_syncInputAttributes, _DadsCombobox_syncInputAria, _DadsCombobox_syncFormValue, _DadsCombobox_isDisabled, _DadsCombobox_updateAriaDescribedBy, _DadsCombobox_handleInputClick, _DadsCombobox_handleIndicatorClick, _DadsCombobox_handleInput, _DadsCombobox_handleInputKeydown, _DadsCombobox_commitIndex, _DadsCombobox_syncOpenState, _DadsCombobox_syncDocumentListeners, _DadsCombobox_handleDocumentClick, _DadsCombobox_renderChipList, _DadsCombobox_renderOptions, _DadsCombobox_isOptionSelected, _DadsCombobox_getFilteredIndexes, _DadsCombobox_allEnabledAndDisabledIndexes, _DadsCombobox_findFirstFilteredEnabledIndex, _DadsCombobox_findLastFilteredEnabledIndex, _DadsCombobox_preferredActiveIndex, _DadsCombobox_moveActive, _DadsCombobox_setActiveIndex, _DadsCombobox_syncInputDisplay, _DadsCombobox_labelFromValue;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { comboboxTokens } from './combobox-tokens.js';
import { comboboxStyles } from './combobox-styles.js';
import { setDefaultAttributes, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, updateAriaDescribedBy, setupSlotChangeListeners, } from '../../utils/form-component-helpers.js';
let comboboxIdSequence = 0;
/**
 * Comboboxコンポーネント
 *
 * @customElement
 * @tagname dads-combobox
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト
 * @slot error-text - エラーテキスト
 * @slot required-error - 必須バリデーション用のカスタムメッセージ
 * @slot - option 要素
 *
 * @csspart wrapper - 全体ラッパー
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキスト
 * @csspart requirement - 必須表示
 * @csspart support-text - サポートテキスト
 * @csspart control - 入力コントロール
 * @csspart input - 入力欄
 * @csspart chip-list - 複数選択チップ群
 * @csspart chip - 複数選択チップ
 * @csspart indicator - ドロップダウンインジケータ
 * @csspart listbox - 候補リスト
 * @csspart option - 候補行
 * @csspart option-label - 候補ラベル
 * @csspart option-meta - 候補補助テキスト
 * @csspart error-text - エラーテキスト
 *
 * @attr {'single' | 'multiple'} mode - 選択モード
 * @attr {boolean} filterable - 入力絞り込みの有効化
 * @attr {boolean} clear-on-close - close時にqueryをクリア（常に実行）
 * @attr {boolean} restore-on-cancel - singleで未確定離脱時の復帰
 * @attr {boolean} open - 開閉状態
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須状態
 * @attr {string} name - フォーム名
 * @attr {string} value - 選択値（mode=multiple時はカンマ区切り）
 * @attr {string} placeholder - プレースホルダー
 * @attr {'sm' | 'md' | 'lg'} size - サイズ
 * @attr {string} label - ラベル属性フォールバック
 * @attr {string} support-text - サポート属性フォールバック
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラー属性フォールバック
 *
 * @fires dads-input - query入力変化時
 * @fires dads-change - 明示確定時のみ
 * @fires dads-open - ポップアップ開時
 * @fires dads-close - ポップアップ閉時
 */
export class DadsCombobox extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsCombobox_instances.add(this);
        _DadsCombobox_input.set(this, null);
        _DadsCombobox_indicator.set(this, null);
        _DadsCombobox_listbox.set(this, null);
        _DadsCombobox_chipList.set(this, null);
        _DadsCombobox_labelSlot.set(this, null);
        _DadsCombobox_supportSlot.set(this, null);
        _DadsCombobox_errorSlot.set(this, null);
        _DadsCombobox_labelFallback.set(this, null);
        _DadsCombobox_supportText.set(this, null);
        _DadsCombobox_supportFallback.set(this, null);
        _DadsCombobox_errorText.set(this, null);
        _DadsCombobox_errorFallback.set(this, null);
        _DadsCombobox_requirement.set(this, null);
        _DadsCombobox_listboxId.set(this, `combobox-listbox-${comboboxIdSequence++}`);
        _DadsCombobox_isOpen.set(this, false);
        _DadsCombobox_query.set(this, '');
        _DadsCombobox_activeIndex.set(this, -1);
        _DadsCombobox_options.set(this, []);
        _DadsCombobox_selectedSingle.set(this, '');
        _DadsCombobox_selectedMultiple.set(this, new Set());
        _DadsCombobox_formDisabled.set(this, false);
        _DadsCombobox_optionsObserver.set(this, null);
        _DadsCombobox_documentAbort.set(this, null);
        _DadsCombobox_handleInputClick.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            this.setAttribute('open', '');
        });
        _DadsCombobox_handleIndicatorClick.set(this, (event) => {
            event.preventDefault();
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                this.removeAttribute('open');
            else
                this.setAttribute('open', '');
            __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.focus();
        });
        _DadsCombobox_handleInput.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (!this.hasAttribute('filterable'))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
                return;
            __classPrivateFieldSet(this, _DadsCombobox_query, __classPrivateFieldGet(this, _DadsCombobox_input, "f").value, "f");
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                this.setAttribute('open', '');
            __classPrivateFieldSet(this, _DadsCombobox_activeIndex, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this), "f");
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
            this.emitEvent('dads-input', { query: __classPrivateFieldGet(this, _DadsCombobox_query, "f") });
        });
        _DadsCombobox_handleInputKeydown.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
                        this.setAttribute('open', '');
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this));
                        break;
                    }
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, 1, false);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
                        this.setAttribute('open', '');
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findLastFilteredEnabledIndex).call(this));
                        break;
                    }
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, -1, false);
                    break;
                case 'Home':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this));
                    break;
                case 'End':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findLastFilteredEnabledIndex).call(this));
                    break;
                case 'Enter':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") < 0)
                        return;
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"));
                    break;
                case 'Escape':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    this.removeAttribute('open');
                    break;
                case 'Tab':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    this.removeAttribute('open');
                    break;
            }
        });
        _DadsCombobox_handleDocumentClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            if (event.composedPath().includes(this))
                return;
            this.removeAttribute('open');
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, { mode: 'single', size: 'md' });
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_ensureDefaultBooleans).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_upgradePreDefinedValueProperty).call(this);
        __classPrivateFieldSet(this, _DadsCombobox_input, this.shadowRoot?.querySelector('#input'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_indicator, this.shadowRoot?.querySelector('#indicator'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_listbox, this.shadowRoot?.querySelector('#listbox'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_chipList, this.shadowRoot?.querySelector('#chip-list'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupSlots).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupControlListeners).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupOptionsObserver).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncAllState).call(this);
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleInput, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleInputClick, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_indicator, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleIndicatorClick, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsCombobox_optionsObserver, null, "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, false);
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportText, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorText, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsCombobox_requirement, "f"), this.hasAttribute('required'), false);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
                break;
            case 'mode':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_sanitizeModeAttribute).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionForModeChange).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
                break;
            case 'filterable':
            case 'disabled':
            case 'placeholder':
            case 'name':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
                break;
            case 'open':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncOpenState).call(this, this.hasAttribute('open'));
                break;
            case 'value':
                if (newValue !== oldValue) {
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, newValue);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
                }
                break;
            case 'restore-on-cancel':
            case 'clear-on-close':
            case 'size':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
                break;
        }
    }
    get value() {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple')
            return Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"));
        return __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f");
    }
    set value(v) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple') {
            const next = new Set();
            if (Array.isArray(v)) {
                for (const value of v) {
                    if (typeof value === 'string' && value.length > 0)
                        next.add(value);
                }
            }
            else if (typeof v === 'string' && v.length > 0) {
                for (const token of v.split(',')) {
                    const parsed = token.trim();
                    if (parsed.length > 0)
                        next.add(parsed);
                }
            }
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, next), "f");
            this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        }
        else {
            const next = typeof v === 'string' ? v : String(v?.[0] ?? '');
            __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, next) ? next : '', "f");
            if (__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f").length > 0)
                this.setAttribute('value', __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
            else
                this.removeAttribute('value');
        }
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    }
    formResetCallback() {
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, this.getAttribute('value'));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    }
    formStateRestoreCallback(state, _mode) {
        if (typeof state !== 'string')
            return;
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple')
            this.value = state.split(',').map((v) => v.trim()).filter(Boolean);
        else
            this.value = state;
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsCombobox_formDisabled, disabled, "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.blur();
    }
}
_DadsCombobox_input = new WeakMap(), _DadsCombobox_indicator = new WeakMap(), _DadsCombobox_listbox = new WeakMap(), _DadsCombobox_chipList = new WeakMap(), _DadsCombobox_labelSlot = new WeakMap(), _DadsCombobox_supportSlot = new WeakMap(), _DadsCombobox_errorSlot = new WeakMap(), _DadsCombobox_labelFallback = new WeakMap(), _DadsCombobox_supportText = new WeakMap(), _DadsCombobox_supportFallback = new WeakMap(), _DadsCombobox_errorText = new WeakMap(), _DadsCombobox_errorFallback = new WeakMap(), _DadsCombobox_requirement = new WeakMap(), _DadsCombobox_listboxId = new WeakMap(), _DadsCombobox_isOpen = new WeakMap(), _DadsCombobox_query = new WeakMap(), _DadsCombobox_activeIndex = new WeakMap(), _DadsCombobox_options = new WeakMap(), _DadsCombobox_selectedSingle = new WeakMap(), _DadsCombobox_selectedMultiple = new WeakMap(), _DadsCombobox_formDisabled = new WeakMap(), _DadsCombobox_optionsObserver = new WeakMap(), _DadsCombobox_documentAbort = new WeakMap(), _DadsCombobox_handleInputClick = new WeakMap(), _DadsCombobox_handleIndicatorClick = new WeakMap(), _DadsCombobox_handleInput = new WeakMap(), _DadsCombobox_handleInputKeydown = new WeakMap(), _DadsCombobox_handleDocumentClick = new WeakMap(), _DadsCombobox_instances = new WeakSet(), _DadsCombobox_ensureDefaultBooleans = function _DadsCombobox_ensureDefaultBooleans() {
    if (!this.hasAttribute('filterable'))
        this.setAttribute('filterable', '');
    if (!this.hasAttribute('clear-on-close'))
        this.setAttribute('clear-on-close', '');
    if (!this.hasAttribute('restore-on-cancel'))
        this.setAttribute('restore-on-cancel', '');
}, _DadsCombobox_upgradePreDefinedValueProperty = function _DadsCombobox_upgradePreDefinedValueProperty() {
    const hasOwnValue = Object.prototype.hasOwnProperty.call(this, 'value');
    const ownValue = hasOwnValue ? this.value : undefined;
    if (hasOwnValue) {
        delete this.value;
        if (ownValue !== undefined)
            this.value = ownValue;
    }
}, _DadsCombobox_mode_get = function _DadsCombobox_mode_get() {
    return this.getAttribute('mode') === 'multiple' ? 'multiple' : 'single';
}, _DadsCombobox_sanitizeModeAttribute = function _DadsCombobox_sanitizeModeAttribute() {
    const rawMode = this.getAttribute('mode');
    if (rawMode === 'single' || rawMode === 'multiple')
        return;
    this.setAttribute('mode', 'single');
}, _DadsCombobox_setupSlots = function _DadsCombobox_setupSlots() {
    setupSlotChangeListeners({
        label: __classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"),
        support: __classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"),
        error: __classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"),
    }, {
        onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_labelFallback, "f"), this.getAttribute('label')),
        onSupportChange: () => {
            updateSupportFallback(__classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportText, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportFallback, "f"), this.getAttribute('support-text'));
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
        },
        onErrorChange: () => {
            updateErrorFallback(__classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorText, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
        },
    });
    updateRequirement(__classPrivateFieldGet(this, _DadsCombobox_requirement, "f"), this.hasAttribute('required'), false);
}, _DadsCombobox_setupControlListeners = function _DadsCombobox_setupControlListeners() {
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleInput, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleInputClick, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_indicator, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleIndicatorClick, "f"));
}, _DadsCombobox_setupOptionsObserver = function _DadsCombobox_setupOptionsObserver() {
    __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsCombobox_optionsObserver, new MutationObserver((mutations) => {
        if (!mutations.some((m) => __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_shouldSyncOptionsFromMutation).call(this, m)))
            return;
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f").observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });
}, _DadsCombobox_shouldSyncOptionsFromMutation = function _DadsCombobox_shouldSyncOptionsFromMutation(mutation) {
    if (mutation.type === 'childList')
        return true;
    if (mutation.type === 'attributes') {
        const target = mutation.target;
        return target instanceof HTMLOptionElement;
    }
    if (mutation.type === 'characterData') {
        return mutation.target.parentElement instanceof HTMLOptionElement;
    }
    return false;
}, _DadsCombobox_syncAllState = function _DadsCombobox_syncAllState() {
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncOpenState).call(this, this.hasAttribute('open'));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
}, _DadsCombobox_syncFromLightDomOptions = function _DadsCombobox_syncFromLightDomOptions() {
    const optionElements = Array.from(this.children).filter((node) => node instanceof HTMLOptionElement);
    __classPrivateFieldSet(this, _DadsCombobox_options, optionElements.map((option) => ({
        value: option.value,
        label: option.label || option.textContent || option.value,
        meta: option.getAttribute('data-meta') ?? '',
        disabled: option.disabled,
        selected: option.selected,
    })), "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, this.getAttribute('value'));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionForModeChange).call(this);
}, _DadsCombobox_applyValueAttribute = function _DadsCombobox_applyValueAttribute(attrValue) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple') {
        if (attrValue !== null) {
            const next = new Set();
            for (const token of attrValue.split(',')) {
                const parsed = token.trim();
                if (parsed.length > 0)
                    next.add(parsed);
            }
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, next), "f");
        }
        else {
            const selected = new Set();
            for (const option of __classPrivateFieldGet(this, _DadsCombobox_options, "f")) {
                if (option.selected)
                    selected.add(option.value);
            }
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, selected), "f");
        }
        return;
    }
    if (attrValue !== null) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, attrValue) ? attrValue : '', "f");
        return;
    }
    const selectedOption = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((option) => option.selected);
    if (selectedOption) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, selectedOption.value, "f");
        return;
    }
    if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, '', "f");
    }
}, _DadsCombobox_syncSelectionForModeChange = function _DadsCombobox_syncSelectionForModeChange() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'single') {
        if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
            const firstMultiple = Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"))[0];
            __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, firstMultiple) ? firstMultiple : '', "f");
        }
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").clear();
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").size === 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").add(__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
    }
}, _DadsCombobox_isKnownOptionValue = function _DadsCombobox_isKnownOptionValue(value) {
    if (!value)
        return false;
    return __classPrivateFieldGet(this, _DadsCombobox_options, "f").some((option) => option.value === value);
}, _DadsCombobox_filterKnownValues = function _DadsCombobox_filterKnownValues(values) {
    const filtered = new Set();
    for (const value of values) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, value))
            filtered.add(value);
    }
    return filtered;
}, _DadsCombobox_syncInputAttributes = function _DadsCombobox_syncInputAttributes() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f") || !__classPrivateFieldGet(this, _DadsCombobox_listbox, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-controls', __classPrivateFieldGet(this, _DadsCombobox_listboxId, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").id = __classPrivateFieldGet(this, _DadsCombobox_listboxId, "f");
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").setAttribute('aria-multiselectable', __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple' ? 'true' : 'false');
    const disabled = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").disabled = disabled;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").readOnly = !this.hasAttribute('filterable');
    __classPrivateFieldGet(this, _DadsCombobox_indicator, "f")?.toggleAttribute('disabled', disabled);
    const placeholder = this.getAttribute('placeholder');
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").placeholder = placeholder ?? '';
}, _DadsCombobox_syncInputAria = function _DadsCombobox_syncInputAria() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-expanded', __classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") ? 'true' : 'false');
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
    if (this.hasAttribute('required'))
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-required', 'true');
    else
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-required');
}, _DadsCombobox_syncFormValue = function _DadsCombobox_syncFormValue() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple') {
        this._internals.setFormValue(Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        return;
    }
    this._internals.setFormValue(__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
}, _DadsCombobox_isDisabled = function _DadsCombobox_isDisabled() {
    return __classPrivateFieldGet(this, _DadsCombobox_formDisabled, "f") || this.hasAttribute('disabled');
}, _DadsCombobox_updateAriaDescribedBy = function _DadsCombobox_updateAriaDescribedBy() {
    const supportVisible = __classPrivateFieldGet(this, _DadsCombobox_supportText, "f")?.style.display !== 'none';
    updateAriaDescribedBy(__classPrivateFieldGet(this, _DadsCombobox_input, "f"), supportVisible, this.hasAttribute('error'));
}, _DadsCombobox_commitIndex = function _DadsCombobox_commitIndex(index) {
    const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[index];
    if (!option || option.disabled)
        return;
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple') {
        if (__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(option.value))
            __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").delete(option.value);
        else
            __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").add(option.value);
        this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        this.emitEvent('dads-change', { value: Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")) });
        return;
    }
    __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, option.value, "f");
    this.setAttribute('value', __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
    this.emitEvent('dads-change', { value: __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f") });
    this.removeAttribute('open');
}, _DadsCombobox_syncOpenState = function _DadsCombobox_syncOpenState(nextOpen) {
    if (nextOpen === __classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
        return;
    __classPrivateFieldSet(this, _DadsCombobox_isOpen, nextOpen, "f");
    if (nextOpen) {
        __classPrivateFieldSet(this, _DadsCombobox_activeIndex, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_preferredActiveIndex).call(this), "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, true);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        this.emitEvent('dads-open');
        return;
    }
    // 拘束条件: close時は常にqueryをクリアする
    __classPrivateFieldSet(this, _DadsCombobox_query, '', "f");
    __classPrivateFieldSet(this, _DadsCombobox_activeIndex, -1, "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, false);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
    this.emitEvent('dads-close');
}, _DadsCombobox_syncDocumentListeners = function _DadsCombobox_syncDocumentListeners(enable) {
    __classPrivateFieldGet(this, _DadsCombobox_documentAbort, "f")?.abort();
    __classPrivateFieldSet(this, _DadsCombobox_documentAbort, null, "f");
    if (!enable)
        return;
    const controller = new AbortController();
    __classPrivateFieldSet(this, _DadsCombobox_documentAbort, controller, "f");
    document.addEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleDocumentClick, "f"), { signal: controller.signal });
}, _DadsCombobox_renderChipList = function _DadsCombobox_renderChipList() {
    const chipList = __classPrivateFieldGet(this, _DadsCombobox_chipList, "f");
    if (!chipList)
        return;
    chipList.replaceChildren();
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) !== 'multiple') {
        chipList.hidden = true;
        return;
    }
    const values = Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"));
    if (values.length === 0) {
        chipList.hidden = true;
        return;
    }
    for (const value of values) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((item) => item.value === value);
        if (!option)
            continue;
        const chip = document.createElement('span');
        chip.setAttribute('part', 'chip');
        chip.textContent = option.label;
        chipList.appendChild(chip);
    }
    chipList.hidden = false;
}, _DadsCombobox_renderOptions = function _DadsCombobox_renderOptions() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_listbox, "f") || !__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").hidden = !__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f");
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").replaceChildren();
    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
        return;
    }
    const filteredIndexes = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    if (filteredIndexes.length === 0) {
        const empty = document.createElement('div');
        empty.setAttribute('part', 'empty');
        empty.textContent = '候補がありません';
        __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").appendChild(empty);
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
        return;
    }
    for (const index of filteredIndexes) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[index];
        const optionId = `${__classPrivateFieldGet(this, _DadsCombobox_listboxId, "f")}-option-${index}`;
        const optionElement = document.createElement('button');
        optionElement.type = 'button';
        optionElement.id = optionId;
        optionElement.setAttribute('part', 'option');
        optionElement.setAttribute('role', 'option');
        optionElement.setAttribute('aria-selected', __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isOptionSelected).call(this, option) ? 'true' : 'false');
        optionElement.setAttribute('data-option-index', String(index));
        if (index === __classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"))
            optionElement.setAttribute('data-active', 'true');
        if (option.disabled)
            optionElement.setAttribute('aria-disabled', 'true');
        const label = document.createElement('span');
        label.setAttribute('part', 'option-label');
        label.textContent = __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple' && __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(option.value)
            ? `✓ ${option.label}`
            : option.label;
        optionElement.appendChild(label);
        if (option.meta.length > 0) {
            const meta = document.createElement('span');
            meta.setAttribute('part', 'option-meta');
            meta.textContent = option.meta;
            optionElement.appendChild(meta);
        }
        optionElement.addEventListener('click', (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitIndex).call(this, index);
        });
        __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").appendChild(optionElement);
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") >= 0) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-activedescendant', `${__classPrivateFieldGet(this, _DadsCombobox_listboxId, "f")}-option-${__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f")}`);
    }
    else {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
    }
}, _DadsCombobox_isOptionSelected = function _DadsCombobox_isOptionSelected(option) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'multiple')
        return __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(option.value);
    return __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f").length > 0 && __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f") === option.value;
}, _DadsCombobox_getFilteredIndexes = function _DadsCombobox_getFilteredIndexes() {
    if (!this.hasAttribute('filterable'))
        return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_allEnabledAndDisabledIndexes).call(this);
    const query = __classPrivateFieldGet(this, _DadsCombobox_query, "f").trim().toLowerCase();
    if (query.length === 0)
        return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_allEnabledAndDisabledIndexes).call(this);
    const indexes = [];
    for (let i = 0; i < __classPrivateFieldGet(this, _DadsCombobox_options, "f").length; i += 1) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[i];
        const haystack = `${option.label} ${option.value}`.toLowerCase();
        if (haystack.includes(query))
            indexes.push(i);
    }
    return indexes;
}, _DadsCombobox_allEnabledAndDisabledIndexes = function _DadsCombobox_allEnabledAndDisabledIndexes() {
    const indexes = [];
    for (let i = 0; i < __classPrivateFieldGet(this, _DadsCombobox_options, "f").length; i += 1)
        indexes.push(i);
    return indexes;
}, _DadsCombobox_findFirstFilteredEnabledIndex = function _DadsCombobox_findFirstFilteredEnabledIndex() {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    for (const index of filtered) {
        if (!__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled)
            return index;
    }
    return -1;
}, _DadsCombobox_findLastFilteredEnabledIndex = function _DadsCombobox_findLastFilteredEnabledIndex() {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    for (let i = filtered.length - 1; i >= 0; i -= 1) {
        const index = filtered[i];
        if (!__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled)
            return index;
    }
    return -1;
}, _DadsCombobox_preferredActiveIndex = function _DadsCombobox_preferredActiveIndex() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'single' && __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f")) {
        const selectedIndex = __classPrivateFieldGet(this, _DadsCombobox_options, "f").findIndex((option) => option.value === __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        if (selectedIndex >= 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this).includes(selectedIndex))
            return selectedIndex;
    }
    return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this);
}, _DadsCombobox_moveActive = function _DadsCombobox_moveActive(step, allowInitialize) {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this).filter((index) => !__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled);
    if (filtered.length === 0) {
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, -1);
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") < 0 || !filtered.includes(__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"))) {
        if (!allowInitialize)
            return;
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, step === 1 ? filtered[0] : filtered[filtered.length - 1]);
        return;
    }
    const current = filtered.indexOf(__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"));
    const next = (current + step + filtered.length) % filtered.length;
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, filtered[next]);
}, _DadsCombobox_setActiveIndex = function _DadsCombobox_setActiveIndex(index) {
    __classPrivateFieldSet(this, _DadsCombobox_activeIndex, index, "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
}, _DadsCombobox_syncInputDisplay = function _DadsCombobox_syncInputDisplay() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") && this.hasAttribute('filterable')) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = __classPrivateFieldGet(this, _DadsCombobox_query, "f");
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_mode_get) === 'single') {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_labelFromValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        return;
    }
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = '';
}, _DadsCombobox_labelFromValue = function _DadsCombobox_labelFromValue(value) {
    if (!value)
        return '';
    const found = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((option) => option.value === value);
    return found?.label ?? '';
};
DadsCombobox.formAssociated = true;
DadsCombobox.definition = {
    name: 'dads-combobox',
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

        <div part="control" id="control">
          <div part="chip-list" id="chip-list"></div>
          <input
            part="input"
            id="input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="false"
            autocomplete="off"
          />
          <button part="indicator" id="indicator" type="button" aria-label="候補を開閉" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"></path>
            </svg>
          </button>
        </div>

        <div part="listbox" id="listbox" role="listbox" hidden></div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <slot name="required-error" id="required-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), comboboxTokens, comboboxStyles, applyDADSFocusStyles()], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('support-text'),
        BooleanAttr('required'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        BooleanAttr('disabled'),
        PropertyAttr('name'),
        PropertyAttr('mode'),
        BooleanAttr('filterable'),
        BooleanAttr('clear-on-close'),
        BooleanAttr('restore-on-cancel'),
        BooleanAttr('open'),
        PropertyAttr('placeholder'),
        PropertyAttr('size'),
        { attribute: 'value' },
    ],
};
