/**
 * @module date-picker
 * デジタル庁デザインシステム DatePickerコンポーネント
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
var _DadsDatePicker_instances, _DadsDatePicker_inputs, _DadsDatePicker_yearInput, _DadsDatePicker_monthInput, _DadsDatePicker_dayInput, _DadsDatePicker_calendarButton, _DadsDatePicker_calendarPopover, _DadsDatePicker_backdrop, _DadsDatePicker_calendar, _DadsDatePicker_calendarPrefix, _DadsDatePicker_calendarReady, _DadsDatePicker_calendarLoading, _DadsDatePicker_calendarOpenToken, _DadsDatePicker_errorText, _DadsDatePicker_errorSlot, _DadsDatePicker_errorFallback, _DadsDatePicker_describedByProxies, _DadsDatePicker_formDisabled, _DadsDatePicker_subscriptions, _DadsDatePicker_syncAll, _DadsDatePicker_syncNormalizedAttributes, _DadsDatePicker_syncDisabled, _DadsDatePicker_syncReadonly, _DadsDatePicker_syncCalendarButtonDisabled, _DadsDatePicker_syncCalendarVisibility, _DadsDatePicker_syncCalendarRange, _DadsDatePicker_syncValidationA11y, _DadsDatePicker_syncAriaDescribedBy, _DadsDatePicker_refreshExternalAriaDescribedByProxies, _DadsDatePicker_getExternalDescribedByIds, _DadsDatePicker_syncExternalAriaDescribedByProxies, _DadsDatePicker_getInputYearMonth, _DadsDatePicker_getInputYearMonthDay, _DadsDatePicker_syncFormValue, _DadsDatePicker_computeIsoValue, _DadsDatePicker_setupEventListeners, _DadsDatePicker_handleInputFocusIn, _DadsDatePicker_handleInput, _DadsDatePicker_handleChange, _DadsDatePicker_handleDateSelected, _DadsDatePicker_handleInputKeydown, _DadsDatePicker_focusPreviousField, _DadsDatePicker_focusNextField, _DadsDatePicker_toggleCalendar, _DadsDatePicker_openCalendar, _DadsDatePicker_closeCalendar, _DadsDatePicker_handlePopoverKeydown, _DadsDatePicker_getFocusableElements, _DadsDatePicker_getDeepActiveElement, _DadsDatePicker_syncToInputs, _DadsDatePicker_clearInputs, _DadsDatePicker_isCalendarOpen, _DadsDatePicker_isConsolidated, _DadsDatePicker_isDisabled, _DadsDatePicker_ensureCalendarElement, _DadsDatePicker_setInputsState, _DadsDatePicker_prepareCalendar, _DadsDatePicker_getCalendarApi;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { datePickerStyles } from './date-picker-styles.js';
import { setDefaultAttributes, updateErrorFallback } from '../../utils/form-component-helpers.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { parseIsoDate, toIsoDateOrEmpty } from '../../utils/iso-date.js';
function isValidType(v) {
    return v === 'consolidated' || v === 'separated';
}
function isValidSize(v) {
    return v === 'sm' || v === 'md' || v === 'lg';
}
function parseDigits(value, re) {
    const trimmed = value.trim();
    if (!re.test(trimmed))
        return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : parsed;
}
/**
 * 日付ピッカーコンポーネント
 *
 * @customElement dads-date-picker
 * @tagname dads-date-picker
 *
 * @slot error-text - エラーテキスト
 *
 * @csspart root - ルート
 * @csspart inputs - 入力欄グループ
 * @csspart input - 入力欄
 * @csspart calendar-button - カレンダーボタン
 * @csspart calendar-popover - カレンダー（role="dialog"）
 * @csspart calendar - 内包カレンダー
 * @csspart error-text - エラーテキスト領域
 *
 * @attr {string} data-type - 表示タイプ（consolidated | separated）
 * @attr {string} size - サイズ（sm | md | lg）
 * @attr {boolean} calendar - カレンダー表示を有効化
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} readonly - 読み取り専用
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーテキスト（スロット未使用時のフォールバック）
 * @attr {string} min-date - 最小日付（YYYY-MM-DD）
 * @attr {string} max-date - 最大日付（YYYY-MM-DD）
 * @attr {string} value - 値（YYYY-MM-DD）
 * @attr {string} aria-describedby - 外部説明要素の関連付け
 *
 * @fires dads-input - 入力時に発火（detail: { value: string }）
 * @fires dads-change - 値確定時に発火（detail: { value: string }）
 */
export class DadsDatePicker extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsDatePicker_instances.add(this);
        // DOM refs
        _DadsDatePicker_inputs.set(this, null);
        _DadsDatePicker_yearInput.set(this, null);
        _DadsDatePicker_monthInput.set(this, null);
        _DadsDatePicker_dayInput.set(this, null);
        _DadsDatePicker_calendarButton.set(this, null);
        _DadsDatePicker_calendarPopover.set(this, null);
        _DadsDatePicker_backdrop.set(this, null);
        _DadsDatePicker_calendar.set(this, null);
        _DadsDatePicker_calendarPrefix.set(this, null);
        _DadsDatePicker_calendarReady.set(this, null);
        _DadsDatePicker_calendarLoading.set(this, false);
        _DadsDatePicker_calendarOpenToken.set(this, 0);
        _DadsDatePicker_errorText.set(this, null);
        _DadsDatePicker_errorSlot.set(this, null);
        _DadsDatePicker_errorFallback.set(this, null);
        _DadsDatePicker_describedByProxies.set(this, null);
        _DadsDatePicker_formDisabled.set(this, false);
        _DadsDatePicker_subscriptions.set(this, []);
        _DadsDatePicker_handleInputFocusIn.set(this, () => {
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_refreshExternalAriaDescribedByProxies).call(this);
        });
        _DadsDatePicker_handleInput.set(this, () => {
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
            this.emitEvent('dads-input', { value: this.value });
        });
        _DadsDatePicker_handleChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
            this.emitEvent('dads-change', { value: this.value });
        });
        _DadsDatePicker_handleDateSelected.set(this, (e) => {
            const ev = e;
            const date = ev.detail?.date ?? null;
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncToInputs).call(this, date);
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
            this.emitEvent('dads-change', { value: this.value });
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this);
        });
        _DadsDatePicker_handleInputKeydown.set(this, (e) => {
            if (!__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isConsolidated).call(this))
                return;
            const ke = e;
            if (ke.key !== 'ArrowLeft' && ke.key !== 'ArrowRight')
                return;
            const target = ke.target;
            if (!(target instanceof HTMLInputElement))
                return;
            const caret = target.selectionStart ?? 0;
            const atStart = caret === 0;
            const atEnd = caret === target.value.length;
            if (ke.key === 'ArrowLeft' && atStart) {
                ke.preventDefault();
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_focusPreviousField).call(this, target);
                return;
            }
            if (ke.key === 'ArrowRight' && atEnd) {
                ke.preventDefault();
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_focusNextField).call(this, target);
            }
        });
        _DadsDatePicker_handlePopoverKeydown.set(this, (e) => {
            const ke = e;
            if (ke.key === 'Escape') {
                ke.preventDefault();
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this);
                return;
            }
            if (ke.key !== 'Tab')
                return;
            const focusables = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getFocusableElements).call(this);
            if (focusables.length === 0)
                return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const [firstInPath] = typeof ke.composedPath === 'function' ? ke.composedPath() : [];
            const active = (firstInPath instanceof HTMLElement ? firstInPath : null) ?? __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getDeepActiveElement).call(this);
            if (ke.shiftKey) {
                if (active === first) {
                    ke.preventDefault();
                    last.focus();
                }
            }
            else if (active === last) {
                ke.preventDefault();
                first.focus();
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        const prefix = getPrefixFromLocalName(this.localName, '-date-picker');
        __classPrivateFieldSet(this, _DadsDatePicker_calendarPrefix, prefix, "f");
        setDefaultAttributes(this, { 'data-type': 'consolidated', size: 'md' });
        __classPrivateFieldSet(this, _DadsDatePicker_inputs, this.shadowRoot?.querySelector('#inputs'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_yearInput, this.shadowRoot?.querySelector('#year-input'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_monthInput, this.shadowRoot?.querySelector('#month-input'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_dayInput, this.shadowRoot?.querySelector('#day-input'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_calendarButton, this.shadowRoot?.querySelector('#calendar-button'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_calendarPopover, this.shadowRoot?.querySelector('#calendar-popover'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_backdrop, this.shadowRoot?.querySelector('#backdrop'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_calendar, this.shadowRoot?.querySelector('#calendar'), "f");
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_ensureCalendarElement).call(this, prefix);
        __classPrivateFieldSet(this, _DadsDatePicker_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsDatePicker_describedByProxies, this.shadowRoot?.querySelector('#describedby-proxies'), "f");
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncAll).call(this);
    }
    disconnectedCallback() {
        for (const unsub of __classPrivateFieldGet(this, _DadsDatePicker_subscriptions, "f"))
            unsub();
        __classPrivateFieldSet(this, _DadsDatePicker_subscriptions, [], "f");
    }
    // ============================================================
    // Form callbacks
    // ============================================================
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
        __classPrivateFieldSet(this, _DadsDatePicker_formDisabled, disabled, "f");
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncDisabled).call(this);
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
    }
    // ============================================================
    // Public API
    // ============================================================
    get value() {
        return __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_computeIsoValue).call(this);
    }
    set value(v) {
        const parsed = parseIsoDate(v);
        if (!parsed) {
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_clearInputs).call(this);
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
            return;
        }
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncToInputs).call(this, new Date(parsed.year, parsed.month - 1, parsed.day));
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f")?.focus(options);
    }
    // ============================================================
    // Attribute changes
    // ============================================================
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        switch (name) {
            case 'data-type':
            case 'size':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncNormalizedAttributes).call(this);
                break;
            case 'calendar':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarVisibility).call(this);
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncDisabled).call(this);
                break;
            case 'readonly':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncReadonly).call(this);
                break;
            case 'error':
            case 'error-text':
            case 'aria-describedby':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncValidationA11y).call(this);
                break;
            case 'min-date':
            case 'max-date':
                __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarRange).call(this);
                break;
            case 'value':
                if (newValue !== null) {
                    this.value = newValue;
                }
                else {
                    this.value = '';
                }
                break;
        }
    }
}
_DadsDatePicker_inputs = new WeakMap(), _DadsDatePicker_yearInput = new WeakMap(), _DadsDatePicker_monthInput = new WeakMap(), _DadsDatePicker_dayInput = new WeakMap(), _DadsDatePicker_calendarButton = new WeakMap(), _DadsDatePicker_calendarPopover = new WeakMap(), _DadsDatePicker_backdrop = new WeakMap(), _DadsDatePicker_calendar = new WeakMap(), _DadsDatePicker_calendarPrefix = new WeakMap(), _DadsDatePicker_calendarReady = new WeakMap(), _DadsDatePicker_calendarLoading = new WeakMap(), _DadsDatePicker_calendarOpenToken = new WeakMap(), _DadsDatePicker_errorText = new WeakMap(), _DadsDatePicker_errorSlot = new WeakMap(), _DadsDatePicker_errorFallback = new WeakMap(), _DadsDatePicker_describedByProxies = new WeakMap(), _DadsDatePicker_formDisabled = new WeakMap(), _DadsDatePicker_subscriptions = new WeakMap(), _DadsDatePicker_handleInputFocusIn = new WeakMap(), _DadsDatePicker_handleInput = new WeakMap(), _DadsDatePicker_handleChange = new WeakMap(), _DadsDatePicker_handleDateSelected = new WeakMap(), _DadsDatePicker_handleInputKeydown = new WeakMap(), _DadsDatePicker_handlePopoverKeydown = new WeakMap(), _DadsDatePicker_instances = new WeakSet(), _DadsDatePicker_syncAll = function _DadsDatePicker_syncAll() {
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncNormalizedAttributes).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarVisibility).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncDisabled).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncReadonly).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarRange).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncValidationA11y).call(this);
    // 初期値
    const valueAttr = this.getAttribute('value');
    if (valueAttr) {
        this.value = valueAttr;
    }
    else {
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncFormValue).call(this);
    }
}, _DadsDatePicker_syncNormalizedAttributes = function _DadsDatePicker_syncNormalizedAttributes() {
    // data-type
    const typeAttr = this.getAttribute('data-type');
    const type = isValidType(typeAttr) ? typeAttr : 'consolidated';
    if (typeAttr !== type)
        this.setAttribute('data-type', type);
    // size
    const sizeAttr = this.getAttribute('size');
    const size = isValidSize(sizeAttr) ? sizeAttr : 'md';
    if (sizeAttr !== size)
        this.setAttribute('size', size);
}, _DadsDatePicker_syncDisabled = function _DadsDatePicker_syncDisabled() {
    const isDisabled = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isDisabled).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_setInputsState).call(this, isDisabled, 'disabled', 'data-disabled');
    // disabled時はカレンダー操作不可
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarButtonDisabled).call(this);
    if (isDisabled) {
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this, { restoreFocus: false });
    }
}, _DadsDatePicker_syncReadonly = function _DadsDatePicker_syncReadonly() {
    const isReadonly = this.hasAttribute('readonly');
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_setInputsState).call(this, isReadonly, 'readOnly', 'data-readonly');
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarButtonDisabled).call(this);
    if (isReadonly) {
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this, { restoreFocus: false });
    }
}, _DadsDatePicker_syncCalendarButtonDisabled = function _DadsDatePicker_syncCalendarButtonDisabled() {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f"))
        return;
    __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").disabled = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isDisabled).call(this) || this.hasAttribute('readonly');
}, _DadsDatePicker_syncCalendarVisibility = function _DadsDatePicker_syncCalendarVisibility() {
    const enabled = this.hasAttribute('calendar');
    if (!__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f"))
        return;
    __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").style.display = enabled ? '' : 'none';
    if (!enabled) {
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this, { restoreFocus: false });
    }
}, _DadsDatePicker_syncCalendarRange = function _DadsDatePicker_syncCalendarRange() {
    const calendar = __classPrivateFieldGet(this, _DadsDatePicker_calendar, "f");
    if (!calendar)
        return;
    const min = this.getAttribute('min-date');
    const max = this.getAttribute('max-date');
    if (min)
        calendar.setAttribute('min-date', min);
    else
        calendar.removeAttribute('min-date');
    if (max)
        calendar.setAttribute('max-date', max);
    else
        calendar.removeAttribute('max-date');
}, _DadsDatePicker_syncValidationA11y = function _DadsDatePicker_syncValidationA11y() {
    const hasError = this.hasAttribute('error');
    updateErrorFallback(__classPrivateFieldGet(this, _DadsDatePicker_errorSlot, "f"), __classPrivateFieldGet(this, _DadsDatePicker_errorText, "f"), __classPrivateFieldGet(this, _DadsDatePicker_errorFallback, "f"), this.getAttribute('error-text'), hasError);
    const inputs = [__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")];
    for (const input of inputs) {
        if (!input)
            continue;
        if (hasError)
            input.setAttribute('aria-invalid', 'true');
        else
            input.removeAttribute('aria-invalid');
    }
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncAriaDescribedBy).call(this);
}, _DadsDatePicker_syncAriaDescribedBy = function _DadsDatePicker_syncAriaDescribedBy() {
    const externalIds = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getExternalDescribedByIds).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncExternalAriaDescribedByProxies).call(this, externalIds);
    const ids = new Set();
    for (const id of externalIds)
        ids.add(id);
    const hasError = this.hasAttribute('error');
    const errorVisible = __classPrivateFieldGet(this, _DadsDatePicker_errorText, "f")?.style.display !== 'none';
    if (hasError && errorVisible)
        ids.add('error-text');
    const describedBy = ids.size > 0 ? Array.from(ids).join(' ') : '';
    const inputs = [__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")];
    for (const input of inputs) {
        if (!input)
            continue;
        if (describedBy)
            input.setAttribute('aria-describedby', describedBy);
        else
            input.removeAttribute('aria-describedby');
    }
}, _DadsDatePicker_refreshExternalAriaDescribedByProxies = function _DadsDatePicker_refreshExternalAriaDescribedByProxies() {
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncExternalAriaDescribedByProxies).call(this, __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getExternalDescribedByIds).call(this));
}, _DadsDatePicker_getExternalDescribedByIds = function _DadsDatePicker_getExternalDescribedByIds() {
    const external = this.getAttribute('aria-describedby') ?? '';
    return external
        .split(' ')
        .map((s) => s.trim())
        .filter(Boolean);
}, _DadsDatePicker_syncExternalAriaDescribedByProxies = function _DadsDatePicker_syncExternalAriaDescribedByProxies(externalIds) {
    const root = __classPrivateFieldGet(this, _DadsDatePicker_describedByProxies, "f");
    const shadow = this.shadowRoot;
    if (!root || !shadow)
        return;
    const desired = new Set(externalIds);
    for (const child of Array.from(root.children)) {
        const id = child.id;
        if (!id || !desired.has(id))
            child.remove();
    }
    for (const id of desired) {
        const existing = shadow.getElementById(id);
        if (existing && !root.contains(existing))
            continue;
        let proxy = existing ?? null;
        if (!proxy) {
            proxy = document.createElement('span');
            proxy.id = id;
            root.appendChild(proxy);
        }
        const source = document.getElementById(id);
        proxy.textContent = source?.textContent ?? '';
    }
}, _DadsDatePicker_getInputYearMonth = function _DadsDatePicker_getInputYearMonth() {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"))
        return null;
    const year = parseDigits(__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f").value, /^\d{4}$/);
    const month = parseDigits(__classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f").value, /^\d{1,2}$/);
    if (year === null || month === null)
        return null;
    return { year, month };
}, _DadsDatePicker_getInputYearMonthDay = function _DadsDatePicker_getInputYearMonthDay() {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f"))
        return null;
    const ym = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getInputYearMonth).call(this);
    if (!ym)
        return null;
    const day = parseDigits(__classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f").value, /^\d{1,2}$/);
    if (day === null)
        return null;
    return { ...ym, day };
}, _DadsDatePicker_syncFormValue = function _DadsDatePicker_syncFormValue() {
    const v = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_computeIsoValue).call(this);
    this._internals.setFormValue(v ? v : null);
}, _DadsDatePicker_computeIsoValue = function _DadsDatePicker_computeIsoValue() {
    const ymd = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getInputYearMonthDay).call(this);
    if (!ymd)
        return '';
    return toIsoDateOrEmpty(ymd.year, ymd.month, ymd.day);
}, _DadsDatePicker_setupEventListeners = function _DadsDatePicker_setupEventListeners() {
    const subscribe = (el, type, handler, options) => {
        if (!el)
            return;
        el.addEventListener(type, handler, options);
        __classPrivateFieldGet(this, _DadsDatePicker_subscriptions, "f").push(() => el.removeEventListener(type, handler, options));
    };
    const inputs = [__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")];
    for (const input of inputs) {
        subscribe(input, 'input', __classPrivateFieldGet(this, _DadsDatePicker_handleInput, "f"));
        subscribe(input, 'change', __classPrivateFieldGet(this, _DadsDatePicker_handleChange, "f"));
        subscribe(input, 'keydown', __classPrivateFieldGet(this, _DadsDatePicker_handleInputKeydown, "f"));
        subscribe(input, 'focusin', __classPrivateFieldGet(this, _DadsDatePicker_handleInputFocusIn, "f"));
    }
    // カレンダー関連
    subscribe(this, 'date-selected', __classPrivateFieldGet(this, _DadsDatePicker_handleDateSelected, "f"));
    subscribe(__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f"), 'click', () => __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_toggleCalendar).call(this));
    subscribe(__classPrivateFieldGet(this, _DadsDatePicker_backdrop, "f"), 'click', () => __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this));
    subscribe(__classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f"), 'keydown', __classPrivateFieldGet(this, _DadsDatePicker_handlePopoverKeydown, "f"));
}, _DadsDatePicker_focusPreviousField = function _DadsDatePicker_focusPreviousField(current) {
    if (current === __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f")) {
        __classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f")?.focus();
    }
    else if (current === __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")) {
        __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f")?.focus();
    }
}, _DadsDatePicker_focusNextField = function _DadsDatePicker_focusNextField(current) {
    if (current === __classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f")) {
        __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f")?.focus();
    }
    else if (current === __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f")) {
        __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")?.focus();
    }
}, _DadsDatePicker_toggleCalendar = function _DadsDatePicker_toggleCalendar() {
    if (!this.hasAttribute('calendar'))
        return;
    if (__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isCalendarOpen).call(this))
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this);
    else
        void __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_openCalendar).call(this);
}, _DadsDatePicker_openCalendar = async function _DadsDatePicker_openCalendar() {
    var _a;
    if (__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isDisabled).call(this) || this.hasAttribute('readonly'))
        return;
    if (!__classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f"))
        return;
    if (__classPrivateFieldGet(this, _DadsDatePicker_calendarLoading, "f"))
        return;
    __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_refreshExternalAriaDescribedByProxies).call(this);
    __classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f").style.display = 'block';
    __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").setAttribute('aria-expanded', 'true');
    const openToken = __classPrivateFieldSet(this, _DadsDatePicker_calendarOpenToken, (_a = __classPrivateFieldGet(this, _DadsDatePicker_calendarOpenToken, "f"), ++_a), "f");
    __classPrivateFieldSet(this, _DadsDatePicker_calendarLoading, true, "f");
    let shouldClose = false;
    try {
        const ready = await __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_prepareCalendar).call(this);
        if (!ready) {
            shouldClose = true;
            return;
        }
        if (!__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isCalendarOpen).call(this) || !this.isConnected || openToken !== __classPrivateFieldGet(this, _DadsDatePicker_calendarOpenToken, "f"))
            return;
        const calendar = await __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getCalendarApi).call(this);
        if (!__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isCalendarOpen).call(this) || !this.isConnected || openToken !== __classPrivateFieldGet(this, _DadsDatePicker_calendarOpenToken, "f"))
            return;
        if (calendar) {
            const ymd = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getInputYearMonthDay).call(this);
            if (ymd) {
                const iso = toIsoDateOrEmpty(ymd.year, ymd.month, ymd.day);
                calendar.setSelectedDate(iso ? new Date(ymd.year, ymd.month - 1, ymd.day) : null);
            }
            else {
                calendar.setSelectedDate(null);
            }
            const ym = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_getInputYearMonth).call(this);
            if (ym && ym.month >= 1 && ym.month <= 12) {
                calendar.setDisplayMonth(ym.year, ym.month - 1);
            }
        }
        if (__classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isCalendarOpen).call(this) && this.isConnected && openToken === __classPrivateFieldGet(this, _DadsDatePicker_calendarOpenToken, "f")) {
            calendar?.focus?.();
        }
    }
    finally {
        __classPrivateFieldSet(this, _DadsDatePicker_calendarLoading, false, "f");
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_syncCalendarButtonDisabled).call(this);
        if (shouldClose)
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_closeCalendar).call(this);
    }
}, _DadsDatePicker_closeCalendar = function _DadsDatePicker_closeCalendar(options = {}) {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f"))
        return;
    const wasOpen = __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_isCalendarOpen).call(this);
    __classPrivateFieldSet(this, _DadsDatePicker_calendarOpenToken, __classPrivateFieldGet(this, _DadsDatePicker_calendarOpenToken, "f") + 1, "f");
    __classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f").style.display = 'none';
    __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").setAttribute('aria-expanded', 'false');
    const restoreFocus = options.restoreFocus ?? true;
    if (!wasOpen || !restoreFocus)
        return;
    if (__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").disabled)
        return;
    if (__classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").style.display === 'none')
        return;
    __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f").focus();
}, _DadsDatePicker_getFocusableElements = function _DadsDatePicker_getFocusableElements() {
    const root = __classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f");
    if (!root)
        return [];
    // Shadow DOM内の実フォーカス要素（例: <dads-button> 内部の <button>）も含めて取得する
    // これにより Tab / Shift+Tab のフォーカストラップ判定が安定する
    const isTabbable = (el) => {
        if (!(el instanceof HTMLElement))
            return false;
        if (el.hasAttribute('hidden'))
            return false;
        if (el.getAttribute('aria-hidden') === 'true')
            return false;
        // disabled / aria-disabled
        if (el instanceof HTMLButtonElement ||
            el instanceof HTMLInputElement ||
            el instanceof HTMLSelectElement ||
            el instanceof HTMLTextAreaElement) {
            if (el.disabled)
                return false;
        }
        else {
            if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true')
                return false;
        }
        const isNativelyFocusable = el.matches('button,input,select,textarea,a[href]');
        const tabIndexAttr = el.getAttribute('tabindex');
        // 通常のdiv/span等は除外（tabindex属性が付いているものだけを対象にする）
        if (!isNativelyFocusable && tabIndexAttr === null)
            return false;
        // tabindex が明示されている場合はそれを優先（Shadow DOM / テスト環境差異の影響を避ける）
        if (tabIndexAttr !== null) {
            const normalized = tabIndexAttr.trim();
            if (normalized === '')
                return true; // tabindex="" は 0 扱い
            const parsed = Number.parseInt(normalized, 10);
            return !Number.isNaN(parsed) && parsed >= 0;
        }
        // natively focusable は tabindex 指定なしでも Tab 対象
        return isNativelyFocusable;
    };
    const out = [];
    const walk = (node) => {
        for (const child of node.children) {
            if (isTabbable(child))
                out.push(child);
            if (child instanceof HTMLElement && child.shadowRoot)
                walk(child.shadowRoot);
            walk(child);
        }
    };
    walk(root);
    return out;
}, _DadsDatePicker_getDeepActiveElement = function _DadsDatePicker_getDeepActiveElement() {
    // document.activeElement は Shadow DOM 内部の場合、ホスト要素にリターゲットされる
    // そのため、shadowRoot.activeElement を辿って実際の要素を取得する
    let active = this.shadowRoot?.activeElement ?? document.activeElement;
    while (active && active instanceof HTMLElement && active.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
}, _DadsDatePicker_syncToInputs = function _DadsDatePicker_syncToInputs(date) {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f") || !__classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f"))
        return;
    if (!date) {
        __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_clearInputs).call(this);
        return;
    }
    __classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f").value = String(date.getFullYear()).padStart(4, '0');
    __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f").value = String(date.getMonth() + 1).padStart(2, '0');
    __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f").value = String(date.getDate()).padStart(2, '0');
}, _DadsDatePicker_clearInputs = function _DadsDatePicker_clearInputs() {
    if (__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f"))
        __classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f").value = '';
    if (__classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"))
        __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f").value = '';
    if (__classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f"))
        __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f").value = '';
}, _DadsDatePicker_isCalendarOpen = function _DadsDatePicker_isCalendarOpen() {
    return __classPrivateFieldGet(this, _DadsDatePicker_calendarButton, "f")?.getAttribute('aria-expanded') === 'true';
}, _DadsDatePicker_isConsolidated = function _DadsDatePicker_isConsolidated() {
    return this.getAttribute('data-type') === 'consolidated';
}, _DadsDatePicker_isDisabled = function _DadsDatePicker_isDisabled() {
    return this.hasAttribute('disabled') || __classPrivateFieldGet(this, _DadsDatePicker_formDisabled, "f");
}, _DadsDatePicker_ensureCalendarElement = function _DadsDatePicker_ensureCalendarElement(prefix, forceReplace = false) {
    const popover = __classPrivateFieldGet(this, _DadsDatePicker_calendarPopover, "f");
    const root = this.shadowRoot;
    if (!popover || !root)
        return;
    const expectedName = `${prefix}-calendar`;
    let ensured = ensurePrefixedElement(root, 'calendar', expectedName, forceReplace);
    if (!ensured) {
        ensured = document.createElement(expectedName);
        ensured.setAttribute('part', 'calendar');
        ensured.id = 'calendar';
        popover.appendChild(ensured);
    }
    __classPrivateFieldSet(this, _DadsDatePicker_calendar, ensured, "f");
}, _DadsDatePicker_setInputsState = function _DadsDatePicker_setInputsState(value, prop, dataAttr) {
    const inputs = [__classPrivateFieldGet(this, _DadsDatePicker_yearInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_monthInput, "f"), __classPrivateFieldGet(this, _DadsDatePicker_dayInput, "f")];
    for (const input of inputs) {
        if (input)
            input[prop] = value;
    }
    if (__classPrivateFieldGet(this, _DadsDatePicker_inputs, "f")) {
        __classPrivateFieldGet(this, _DadsDatePicker_inputs, "f").toggleAttribute(dataAttr, value);
    }
}, _DadsDatePicker_prepareCalendar = async function _DadsDatePicker_prepareCalendar() {
    if (!__classPrivateFieldGet(this, _DadsDatePicker_calendarPrefix, "f"))
        return false;
    if (__classPrivateFieldGet(this, _DadsDatePicker_calendarReady, "f"))
        return __classPrivateFieldGet(this, _DadsDatePicker_calendarReady, "f");
    __classPrivateFieldSet(this, _DadsDatePicker_calendarReady, (async () => {
        try {
            const { defineCalendarLite } = await import('../calendar/calendar-lite-define.js');
            defineCalendarLite(__classPrivateFieldGet(this, _DadsDatePicker_calendarPrefix, "f") ?? undefined);
            __classPrivateFieldGet(this, _DadsDatePicker_instances, "m", _DadsDatePicker_ensureCalendarElement).call(this, __classPrivateFieldGet(this, _DadsDatePicker_calendarPrefix, "f") ?? 'dads', true);
            if (__classPrivateFieldGet(this, _DadsDatePicker_calendar, "f")) {
                await customElements.whenDefined(__classPrivateFieldGet(this, _DadsDatePicker_calendar, "f").localName);
                if (typeof customElements.upgrade === 'function') {
                    customElements.upgrade(__classPrivateFieldGet(this, _DadsDatePicker_calendar, "f"));
                }
            }
            return true;
        }
        catch (error) {
            console.warn('dads-date-picker: calendar load failed', error);
            __classPrivateFieldSet(this, _DadsDatePicker_calendarReady, null, "f");
            return false;
        }
    })(), "f");
    return __classPrivateFieldGet(this, _DadsDatePicker_calendarReady, "f");
}, _DadsDatePicker_getCalendarApi = async function _DadsDatePicker_getCalendarApi() {
    const calendar = __classPrivateFieldGet(this, _DadsDatePicker_calendar, "f");
    if (!calendar)
        return null;
    const maybeApi = calendar;
    if (typeof maybeApi.setSelectedDate === 'function') {
        return calendar;
    }
    await customElements.whenDefined(calendar.localName);
    await new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
        });
    });
    if (typeof calendar.setSelectedDate !== 'function')
        return null;
    return calendar;
};
DadsDatePicker.formAssociated = true;
DadsDatePicker.version = '1.0.0';
DadsDatePicker.definition = {
    name: 'dads-date-picker',
    template: html `
      <div part="controls" id="controls">
        <div part="inputs" id="inputs">
          <label part="field year" id="year-field">
            <span part="field-label">年</span>
            <input
              part="field-input"
              id="year-input"
              type="text"
              inputmode="numeric"
              pattern="[0-9]+"
              data-js-year-input
            />
          </label>
          <label part="field month" id="month-field">
            <span part="field-label">月</span>
            <input
              part="field-input"
              id="month-input"
              type="text"
              inputmode="numeric"
              pattern="[0-9]+"
              data-js-month-input
            />
          </label>
          <label part="field day" id="day-field">
            <span part="field-label">日</span>
            <input
              part="field-input"
              id="day-input"
              type="text"
              inputmode="numeric"
              pattern="[0-9]+"
              data-js-day-input
            />
          </label>
        </div>

        <button
          part="calendar-button"
          id="calendar-button"
          type="button"
          aria-haspopup="dialog"
          aria-controls="calendar-popover"
          aria-expanded="false"
        >
          <svg part="calendar-icon" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="カレンダー">
            <path d="M9 16.5C7.62 16.5 6.5 15.38 6.5 14C6.5 12.62 7.62 11.5 9 11.5C10.38 11.5 11.5 12.62 11.5 14C11.5 15.38 10.38 16.5 9 16.5ZM5 22C3.9 22 3 21.09 3 20V6C3 4.91 3.91 4 5 4H6V2H8V4H16V2H18V4H19C20.09 4 21 4.91 21 6V20C21 21.09 20.09 22 19 22H5ZM5 20H19V10H5V20Z" fill="currentcolor"/>
          </svg>
          <svg part="calendar-chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17.1L3 8L4 7L12 15L20 7L21 8L12 17.1Z" fill="currentcolor" />
          </svg>
        </button>

        <div
          part="calendar-popover"
          id="calendar-popover"
          role="dialog"
          aria-label="カレンダー"
          aria-modal="true"
          style="display: none;"
        >
          <div part="backdrop" id="backdrop"></div>
          <dads-calendar part="calendar" id="calendar"></dads-calendar>
        </div>
      </div>

      <div part="error-text" id="error-text">
        <slot name="error-text" id="error-slot"></slot>
        <span id="error-fallback"></span>
      </div>

      <div part="visually-hidden" id="describedby-proxies"></div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), datePickerStyles], 'minimal'),
    attributes: [
        { attribute: 'data-type' },
        PropertyAttr('size'),
        BooleanAttr('calendar'),
        BooleanAttr('disabled'),
        BooleanAttr('readonly'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        { attribute: 'min-date' },
        { attribute: 'max-date' },
        { attribute: 'value' },
        { attribute: 'aria-describedby' },
    ],
};
