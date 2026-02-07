/**
 * @module calendar
 * デジタル庁デザインシステム Calendarコンポーネント
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
var _DadsCalendar_instances, _DadsCalendar_yearSelect, _DadsCalendar_prevMonthButton, _DadsCalendar_nextMonthButton, _DadsCalendar_currentMonth, _DadsCalendar_calendarHeading, _DadsCalendar_calendarTable, _DadsCalendar_tbody, _DadsCalendar_cellTemplate, _DadsCalendar_deleteButton, _DadsCalendar_todayButton, _DadsCalendar_rangeContainer, _DadsCalendar_rangeSupport, _DadsCalendar_rangeStart, _DadsCalendar_rangeEnd, _DadsCalendar_rangeLive, _DadsCalendar_displayYear, _DadsCalendar_displayMonth, _DadsCalendar_selectedDate, _DadsCalendar_rangeStartDate, _DadsCalendar_rangeEndDate, _DadsCalendar_minDate, _DadsCalendar_maxDate, _DadsCalendar_autoManageHostAriaLabel, _DadsCalendar_suppressAriaAttributeCallback, _DadsCalendar_ariaLabelCacheKey, _DadsCalendar_ariaLabelCache, _DadsCalendar_subscriptions, _DadsCalendar_setupEventListeners, _DadsCalendar_initializeCalendar, _DadsCalendar_sanitizeSelectionWithinRange, _DadsCalendar_initializeDateRange, _DadsCalendar_populateYearSelect, _DadsCalendar_renderCalendar, _DadsCalendar_createDateCell, _DadsCalendar_getDateAriaLabel, _DadsCalendar_handleDateClick, _DadsCalendar_handleKeydown, _DadsCalendar_handleYearChange, _DadsCalendar_selectDate, _DadsCalendar_selectRangeDate, _DadsCalendar_navigateToDate, _DadsCalendar_navigateMonth, _DadsCalendar_selectToday, _DadsCalendar_isDateInRange, _DadsCalendar_getClosestDateInRange, _DadsCalendar_previousMaxDate, _DadsCalendar_isPreviousMonthAvailable, _DadsCalendar_isNextMonthAvailable, _DadsCalendar_calendarHasSelectedDate, _DadsCalendar_calendarHasToday, _DadsCalendar_calendarHasRangeSelection, _DadsCalendar_isRangeMode, _DadsCalendar_setRangeStart, _DadsCalendar_syncRangeUI, _DadsCalendar_getRangeSupportText, _DadsCalendar_setText;
import { html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { calendarStyles } from './calendar-styles.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { parseIsoDate } from '../../utils/iso-date.js';
import { defineButton } from '../button/index.js';
const JAPANESE_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const MONTH_HEADING_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
});
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
    month: 'long',
});
const DATE_ARIA_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
});
let japaneseEraFormatter = null;
function getJapaneseEraFormatter() {
    if (japaneseEraFormatter)
        return japaneseEraFormatter;
    try {
        japaneseEraFormatter = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            era: 'long',
            year: 'numeric',
        });
        return japaneseEraFormatter;
    }
    catch {
        return null;
    }
}
function formatJapaneseYear(year) {
    try {
        const date = new Date(year, 0, 1);
        const formatter = getJapaneseEraFormatter();
        if (!formatter)
            return `${year}年`;
        const parts = formatter.formatToParts(date);
        let era = '';
        let yearValue = '';
        for (const part of parts) {
            if (part.type === 'era')
                era = part.value;
            if (part.type === 'year')
                yearValue = part.value;
        }
        if (!era || !yearValue)
            return `${year}年`;
        return `${year}年(${era}${yearValue}年)`;
    }
    catch {
        return `${year}年`;
    }
}
function formatJapaneseDate(date) {
    return JAPANESE_DATE_FORMATTER.format(date);
}
/**
 * カレンダーコンポーネント
 *
 * @customElement dads-calendar
 * @tagname dads-calendar
 *
 * @csspart controls - 上部コントロール
 * @csspart year-select - 年セレクト
 * @csspart navigation - 月移動ナビゲーション
 * @csspart table - カレンダーテーブル（role="grid"）
 * @csspart date - 日付ボタン
 * @csspart footer - フッター
 * @csspart range - 期間選択表示
 *
 * @attr {string} min-date - 最小日付（YYYY-MM-DD）
 * @attr {string} max-date - 最大日付（YYYY-MM-DD）
 * @attr {string} range - 範囲選択モード（値の有無で有効化）
 *
 * @fires date-selected - 日付選択時に発火（detail: { date: Date | null }）
 * @fires date-range-selected - 範囲選択時に発火（detail: { startDate: Date | null, endDate: Date | null }）
 */
export class DadsCalendar extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsCalendar_instances.add(this);
        // DOM refs
        _DadsCalendar_yearSelect.set(this, null);
        _DadsCalendar_prevMonthButton.set(this, null);
        _DadsCalendar_nextMonthButton.set(this, null);
        _DadsCalendar_currentMonth.set(this, null);
        _DadsCalendar_calendarHeading.set(this, null);
        _DadsCalendar_calendarTable.set(this, null);
        _DadsCalendar_tbody.set(this, null);
        _DadsCalendar_cellTemplate.set(this, null);
        _DadsCalendar_deleteButton.set(this, null);
        _DadsCalendar_todayButton.set(this, null);
        _DadsCalendar_rangeContainer.set(this, null);
        _DadsCalendar_rangeSupport.set(this, null);
        _DadsCalendar_rangeStart.set(this, null);
        _DadsCalendar_rangeEnd.set(this, null);
        _DadsCalendar_rangeLive.set(this, null);
        // State
        _DadsCalendar_displayYear.set(this, new Date().getFullYear());
        _DadsCalendar_displayMonth.set(this, new Date().getMonth());
        _DadsCalendar_selectedDate.set(this, null);
        _DadsCalendar_rangeStartDate.set(this, null);
        _DadsCalendar_rangeEndDate.set(this, null);
        _DadsCalendar_minDate.set(this, null);
        _DadsCalendar_maxDate.set(this, null); // exclusive
        _DadsCalendar_autoManageHostAriaLabel.set(this, true);
        _DadsCalendar_suppressAriaAttributeCallback.set(this, false);
        _DadsCalendar_ariaLabelCacheKey.set(this, '');
        _DadsCalendar_ariaLabelCache.set(this, new Map());
        _DadsCalendar_subscriptions.set(this, []);
        // ============================================================
        // Events / Behavior
        // ============================================================
        _DadsCalendar_handleDateClick.set(this, (e) => {
            const target = e.target;
            if (!(target instanceof Element))
                return;
            const button = target.matches('[data-js-date-button]')
                ? target
                : null;
            if (!button || button.disabled)
                return;
            const year = Number.parseInt(button.dataset.year ?? '', 10);
            const month = Number.parseInt(button.dataset.month ?? '', 10);
            const date = Number.parseInt(button.dataset.date ?? '', 10);
            if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date))
                return;
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_selectDate).call(this, new Date(year, month, date));
        });
        _DadsCalendar_handleKeydown.set(this, (e) => {
            const ke = e;
            const target = ke.target;
            if (!(target instanceof Element))
                return;
            if (!target.matches('[data-js-date-button]'))
                return;
            const button = target;
            const year = Number.parseInt(button.dataset.year ?? '', 10);
            const month = Number.parseInt(button.dataset.month ?? '', 10);
            const date = Number.parseInt(button.dataset.date ?? '', 10);
            if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date))
                return;
            const current = new Date(year, month, date);
            const next = new Date(current);
            switch (ke.key) {
                case 'ArrowUp':
                    ke.preventDefault();
                    next.setDate(next.getDate() - 7);
                    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateToDate).call(this, next);
                    break;
                case 'ArrowDown':
                    ke.preventDefault();
                    next.setDate(next.getDate() + 7);
                    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateToDate).call(this, next);
                    break;
                case 'ArrowLeft':
                    ke.preventDefault();
                    next.setDate(next.getDate() - 1);
                    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateToDate).call(this, next);
                    break;
                case 'ArrowRight':
                    ke.preventDefault();
                    next.setDate(next.getDate() + 1);
                    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateToDate).call(this, next);
                    break;
            }
        });
        _DadsCalendar_handleYearChange.set(this, (e) => {
            const target = e.target;
            if (!(target instanceof HTMLSelectElement))
                return;
            const year = Number.parseInt(target.value, 10);
            if (Number.isNaN(year))
                return;
            this.setDisplayMonth(year, __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f"));
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // 依存コンポーネントを先に登録（内部でdads-buttonを利用）
        const prefix = getPrefixFromLocalName(this.localName, '-calendar');
        defineButton(prefix);
        const root = this.shadowRoot;
        if (!root)
            return;
        if (typeof customElements.upgrade === 'function') {
            customElements.upgrade(root);
        }
        __classPrivateFieldSet(this, _DadsCalendar_calendarHeading, this.shadowRoot?.querySelector('#calendar-heading'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_yearSelect, this.shadowRoot?.querySelector('#year-select'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_prevMonthButton, ensurePrefixedElement(root, 'prev-month-button', `${prefix}-button`, true), "f");
        __classPrivateFieldSet(this, _DadsCalendar_nextMonthButton, ensurePrefixedElement(root, 'next-month-button', `${prefix}-button`, true), "f");
        __classPrivateFieldSet(this, _DadsCalendar_currentMonth, this.shadowRoot?.querySelector('#current-month'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_calendarTable, this.shadowRoot?.querySelector('#calendar-table'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_tbody, this.shadowRoot?.querySelector('#calendar-tbody'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_cellTemplate, this.shadowRoot?.querySelector('#cell-template'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_deleteButton, ensurePrefixedElement(root, 'delete-button', `${prefix}-button`, true), "f");
        __classPrivateFieldSet(this, _DadsCalendar_todayButton, ensurePrefixedElement(root, 'today-button', `${prefix}-button`, true), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeContainer, this.shadowRoot?.querySelector('#range'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeSupport, this.shadowRoot?.querySelector('#range-support'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeStart, this.shadowRoot?.querySelector('#range-start'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEnd, this.shadowRoot?.querySelector('#range-end'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeLive, this.shadowRoot?.querySelector('#range-live'), "f");
        __classPrivateFieldSet(this, _DadsCalendar_autoManageHostAriaLabel, !this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby'), "f");
        __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_initializeCalendar).call(this);
    }
    disconnectedCallback() {
        for (const unsub of __classPrivateFieldGet(this, _DadsCalendar_subscriptions, "f"))
            unsub();
        __classPrivateFieldSet(this, _DadsCalendar_subscriptions, [], "f");
    }
    static get observedAttributes() {
        return ['min-date', 'max-date', 'range', 'aria-label', 'aria-labelledby'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'aria-label' || name === 'aria-labelledby') {
            if (!__classPrivateFieldGet(this, _DadsCalendar_suppressAriaAttributeCallback, "f")) {
                __classPrivateFieldSet(this, _DadsCalendar_autoManageHostAriaLabel, false, "f");
            }
            return;
        }
        if (oldValue === newValue)
            return;
        if (name !== 'min-date' && name !== 'max-date' && name !== 'range')
            return;
        // DOM未初期化の場合はconnected後に反映される
        if (!this.isConnected)
            return;
        if (name === 'range') {
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_syncRangeUI).call(this);
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
        }
        else {
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_initializeCalendar).call(this);
        }
    }
    // ============================================================
    // Public API
    // ============================================================
    setSelectedDate(date) {
        if (__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isRangeMode).call(this)) {
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_setRangeStart).call(this, date);
        }
        else {
            if (date && __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, date)) {
                __classPrivateFieldSet(this, _DadsCalendar_selectedDate, new Date(date.getFullYear(), date.getMonth(), date.getDate()), "f");
            }
            else {
                __classPrivateFieldSet(this, _DadsCalendar_selectedDate, null, "f");
            }
        }
        __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
    }
    setDisplayMonth(year, monthIndex0) {
        const monthToDisplay = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_getClosestDateInRange).call(this, new Date(year, monthIndex0, 1));
        const nextYear = monthToDisplay.getFullYear();
        const nextMonth = monthToDisplay.getMonth();
        const changed = __classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") !== nextYear || __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") !== nextMonth;
        __classPrivateFieldSet(this, _DadsCalendar_displayYear, nextYear, "f");
        __classPrivateFieldSet(this, _DadsCalendar_displayMonth, nextMonth, "f");
        if (changed)
            __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
    }
    focus() {
        const focusable = __classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f")?.querySelector('[tabindex="0"]');
        focusable?.focus();
    }
}
_DadsCalendar_yearSelect = new WeakMap(), _DadsCalendar_prevMonthButton = new WeakMap(), _DadsCalendar_nextMonthButton = new WeakMap(), _DadsCalendar_currentMonth = new WeakMap(), _DadsCalendar_calendarHeading = new WeakMap(), _DadsCalendar_calendarTable = new WeakMap(), _DadsCalendar_tbody = new WeakMap(), _DadsCalendar_cellTemplate = new WeakMap(), _DadsCalendar_deleteButton = new WeakMap(), _DadsCalendar_todayButton = new WeakMap(), _DadsCalendar_rangeContainer = new WeakMap(), _DadsCalendar_rangeSupport = new WeakMap(), _DadsCalendar_rangeStart = new WeakMap(), _DadsCalendar_rangeEnd = new WeakMap(), _DadsCalendar_rangeLive = new WeakMap(), _DadsCalendar_displayYear = new WeakMap(), _DadsCalendar_displayMonth = new WeakMap(), _DadsCalendar_selectedDate = new WeakMap(), _DadsCalendar_rangeStartDate = new WeakMap(), _DadsCalendar_rangeEndDate = new WeakMap(), _DadsCalendar_minDate = new WeakMap(), _DadsCalendar_maxDate = new WeakMap(), _DadsCalendar_autoManageHostAriaLabel = new WeakMap(), _DadsCalendar_suppressAriaAttributeCallback = new WeakMap(), _DadsCalendar_ariaLabelCacheKey = new WeakMap(), _DadsCalendar_ariaLabelCache = new WeakMap(), _DadsCalendar_subscriptions = new WeakMap(), _DadsCalendar_handleDateClick = new WeakMap(), _DadsCalendar_handleKeydown = new WeakMap(), _DadsCalendar_handleYearChange = new WeakMap(), _DadsCalendar_instances = new WeakSet(), _DadsCalendar_setupEventListeners = function _DadsCalendar_setupEventListeners() {
    const subscribe = (el, type, handler) => {
        if (!el)
            return;
        el.addEventListener(type, handler);
        __classPrivateFieldGet(this, _DadsCalendar_subscriptions, "f").push(() => el.removeEventListener(type, handler));
    };
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f"), 'click', __classPrivateFieldGet(this, _DadsCalendar_handleDateClick, "f"));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f"), 'keydown', __classPrivateFieldGet(this, _DadsCalendar_handleKeydown, "f"));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_prevMonthButton, "f"), 'click', () => __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateMonth).call(this, -1));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_nextMonthButton, "f"), 'click', () => __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_navigateMonth).call(this, 1));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f"), 'change', __classPrivateFieldGet(this, _DadsCalendar_handleYearChange, "f"));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_deleteButton, "f"), 'click', () => __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_selectDate).call(this, null));
    subscribe(__classPrivateFieldGet(this, _DadsCalendar_todayButton, "f"), 'click', () => __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_selectToday).call(this));
}, _DadsCalendar_initializeCalendar = function _DadsCalendar_initializeCalendar() {
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_initializeDateRange).call(this);
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_sanitizeSelectionWithinRange).call(this);
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_populateYearSelect).call(this);
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
}, _DadsCalendar_sanitizeSelectionWithinRange = function _DadsCalendar_sanitizeSelectionWithinRange() {
    if (__classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f") && !__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f"))) {
        __classPrivateFieldSet(this, _DadsCalendar_selectedDate, null, "f");
    }
    if (!__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isRangeMode).call(this))
        return;
    if (__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") && !__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f"))) {
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, null, "f");
    }
    if (__classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") && !__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f"))) {
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, null, "f");
    }
    if (__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") && __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") && __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") < __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f")) {
        const start = __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f"), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, start, "f");
    }
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_syncRangeUI).call(this);
}, _DadsCalendar_initializeDateRange = function _DadsCalendar_initializeDateRange() {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();
    let minDateAttr = this.getAttribute('min-date');
    let maxDateAttr = this.getAttribute('max-date');
    // ISO日付の辞書順は日付順と一致
    if (minDateAttr && maxDateAttr && minDateAttr > maxDateAttr) {
        minDateAttr = null;
        maxDateAttr = null;
    }
    const minParsed = minDateAttr ? parseIsoDate(minDateAttr) : null;
    __classPrivateFieldSet(this, _DadsCalendar_minDate, minParsed
        ? new Date(minParsed.year, minParsed.month - 1, minParsed.day)
        : new Date(nowYear - 1, nowMonth, nowDate), "f");
    const maxParsed = maxDateAttr ? parseIsoDate(maxDateAttr) : null;
    __classPrivateFieldSet(this, _DadsCalendar_maxDate, maxParsed
        ? // max-date は「当日まで選択可能」にするため、排他的上限として +1 日
            new Date(maxParsed.year, maxParsed.month - 1, maxParsed.day + 1)
        : new Date(nowYear + 1, nowMonth, nowDate), "f");
    const closest = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_getClosestDateInRange).call(this, now);
    __classPrivateFieldSet(this, _DadsCalendar_displayYear, closest.getFullYear(), "f");
    __classPrivateFieldSet(this, _DadsCalendar_displayMonth, closest.getMonth(), "f");
}, _DadsCalendar_populateYearSelect = function _DadsCalendar_populateYearSelect() {
    if (!__classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f") || !__classPrivateFieldGet(this, _DadsCalendar_minDate, "f") || !__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return;
    const startYear = __classPrivateFieldGet(this, _DadsCalendar_minDate, "f").getFullYear();
    const endYear = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_previousMaxDate).call(this).getFullYear();
    __classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f").innerHTML = '';
    for (let y = startYear; y <= endYear; y += 1) {
        const option = document.createElement('option');
        option.value = String(y);
        option.textContent = formatJapaneseYear(y);
        __classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f").appendChild(option);
    }
    __classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f").value = String(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"));
}, _DadsCalendar_renderCalendar = function _DadsCalendar_renderCalendar() {
    if (!__classPrivateFieldGet(this, _DadsCalendar_tbody, "f") || !__classPrivateFieldGet(this, _DadsCalendar_cellTemplate, "f") || !__classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f") || !__classPrivateFieldGet(this, _DadsCalendar_minDate, "f") || !__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_syncRangeUI).call(this);
    const nextCacheKey = `${__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f")}-${__classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f")}`;
    if (__classPrivateFieldGet(this, _DadsCalendar_ariaLabelCacheKey, "f") !== nextCacheKey) {
        __classPrivateFieldSet(this, _DadsCalendar_ariaLabelCacheKey, nextCacheKey, "f");
        __classPrivateFieldGet(this, _DadsCalendar_ariaLabelCache, "f").clear();
    }
    // コントロール要素の更新
    if (__classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f"))
        __classPrivateFieldGet(this, _DadsCalendar_yearSelect, "f").value = String(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"));
    const prevAvailable = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isPreviousMonthAvailable).call(this);
    const nextAvailable = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isNextMonthAvailable).call(this);
    if (__classPrivateFieldGet(this, _DadsCalendar_prevMonthButton, "f")) {
        __classPrivateFieldGet(this, _DadsCalendar_prevMonthButton, "f").setAttribute('aria-disabled', String(!prevAvailable));
        __classPrivateFieldGet(this, _DadsCalendar_prevMonthButton, "f").toggleAttribute('disabled', !prevAvailable);
    }
    if (__classPrivateFieldGet(this, _DadsCalendar_nextMonthButton, "f")) {
        __classPrivateFieldGet(this, _DadsCalendar_nextMonthButton, "f").setAttribute('aria-disabled', String(!nextAvailable));
        __classPrivateFieldGet(this, _DadsCalendar_nextMonthButton, "f").toggleAttribute('disabled', !nextAvailable);
    }
    // テーブルを再描画
    __classPrivateFieldGet(this, _DadsCalendar_tbody, "f").replaceChildren();
    const firstDay = new Date(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"), __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f"), 1);
    const lastDay = new Date(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"), __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") + 1, 0);
    const startDate = new Date(firstDay);
    // 日曜日開始
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentDate = new Date(startDate);
    let weekCount = 0;
    const maxWeeks = 6;
    const isRangeMode = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isRangeMode).call(this);
    const calendarHasSelectedDate = isRangeMode
        ? __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_calendarHasRangeSelection).call(this)
        : __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_calendarHasSelectedDate).call(this);
    const calendarHasToday = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_calendarHasToday).call(this);
    const todayTime = today.getTime();
    const lastDayTime = lastDay.getTime();
    const rangeStartTime = isRangeMode && __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") ? __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f").getTime() : null;
    const rangeEndTime = isRangeMode && __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") ? __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f").getTime() : null;
    const selectedTime = !isRangeMode && __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f") ? __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f").getTime() : null;
    const focusCandidate = isRangeMode ? (__classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") ?? __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f")) : __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f");
    const focusCandidateTime = focusCandidate ? focusCandidate.getTime() : null;
    const focusCandidateInMonth = focusCandidate !== null &&
        __classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") === focusCandidate.getFullYear() &&
        __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") === focusCandidate.getMonth();
    while (weekCount++ < maxWeeks) {
        const row = document.createElement('tr');
        let weekContainsLastDay = false;
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
            const date = currentDate;
            const dateTime = date.getTime();
            const isCurrentMonth = date.getMonth() === __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f");
            const isOutsideMonth = !isCurrentMonth;
            const isDateInRange = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, date);
            const isToday = dateTime === todayTime;
            const isDisabled = isOutsideMonth || !isDateInRange;
            const isRangeStart = isRangeMode && rangeStartTime !== null && dateTime === rangeStartTime;
            const isRangeEnd = isRangeMode && rangeEndTime !== null && dateTime === rangeEndTime;
            const isInSelectedRange = isRangeMode &&
                rangeStartTime !== null &&
                rangeEndTime !== null &&
                dateTime >= rangeStartTime &&
                dateTime <= rangeEndTime &&
                !isDisabled;
            const isSelected = isRangeMode
                ? isRangeStart || isRangeEnd
                : selectedTime !== null && dateTime === selectedTime;
            const isFocusable = (focusCandidateInMonth && focusCandidateTime !== null && dateTime === focusCandidateTime) ||
                (!calendarHasSelectedDate && isToday && !isDisabled);
            const cell = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_createDateCell).call(this, date, {
                isDisabled,
                isOutsideMonth,
                isSelected,
                isFocusable,
                isRangeStart,
                isRangeEnd,
                isInRange: isInSelectedRange,
            });
            row.appendChild(cell);
            weekContainsLastDay || (weekContainsLastDay = lastDayTime === dateTime);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        __classPrivateFieldGet(this, _DadsCalendar_tbody, "f").appendChild(row);
        if (weekContainsLastDay)
            break;
    }
    // 選択済み日付も今日も表示されていない場合、最初の有効な日付にtabindex=0
    if (!calendarHasSelectedDate && !calendarHasToday) {
        const buttons = __classPrivateFieldGet(this, _DadsCalendar_tbody, "f").querySelectorAll('[data-js-date-button]:not(:disabled)');
        const firstEnabled = buttons[0];
        if (firstEnabled)
            firstEnabled.setAttribute('tabindex', '0');
    }
    // 見出しとラベルの更新
    const heading = MONTH_HEADING_FORMATTER.format(firstDay);
    // 利用側が aria-label / aria-labelledby を指定している場合は上書きしない
    // （未指定時のみ、このコンポーネントが aria-label を自動管理する）
    if (__classPrivateFieldGet(this, _DadsCalendar_autoManageHostAriaLabel, "f") && !this.hasAttribute('aria-labelledby')) {
        __classPrivateFieldSet(this, _DadsCalendar_suppressAriaAttributeCallback, true, "f");
        try {
            this.setAttribute('aria-label', heading);
        }
        finally {
            __classPrivateFieldSet(this, _DadsCalendar_suppressAriaAttributeCallback, false, "f");
        }
    }
    if (__classPrivateFieldGet(this, _DadsCalendar_calendarHeading, "f"))
        __classPrivateFieldGet(this, _DadsCalendar_calendarHeading, "f").textContent = heading;
    __classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f").setAttribute('aria-label', heading);
    if (__classPrivateFieldGet(this, _DadsCalendar_currentMonth, "f")) {
        __classPrivateFieldGet(this, _DadsCalendar_currentMonth, "f").textContent = MONTH_LABEL_FORMATTER.format(firstDay);
    }
}, _DadsCalendar_createDateCell = function _DadsCalendar_createDateCell(date, flags) {
    const { isDisabled, isOutsideMonth = false, isSelected, isFocusable, isRangeStart = false, isRangeEnd = false, isInRange = false, } = flags;
    const frag = __classPrivateFieldGet(this, _DadsCalendar_cellTemplate, "f")?.content.cloneNode(true);
    const cell = frag?.firstElementChild;
    if (!cell) {
        throw new Error('cell-template が見つかりません。');
    }
    const button = cell.querySelector('button');
    if (!button) {
        throw new Error('date button が見つかりません。');
    }
    button.textContent = String(date.getDate());
    const ariaLabel = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_getDateAriaLabel).call(this, date);
    if (isDisabled) {
        cell.setAttribute('aria-disabled', 'true');
        button.disabled = true;
    }
    cell.toggleAttribute('data-in-range', isInRange);
    cell.toggleAttribute('data-range-start', isRangeStart);
    cell.toggleAttribute('data-range-end', isRangeEnd);
    cell.toggleAttribute('data-outside-month', isOutsideMonth);
    if (isSelected) {
        cell.setAttribute('aria-selected', 'true');
        const prefix = isRangeStart ? '開始日 選択中' : isRangeEnd ? '終了日 選択中' : '選択中';
        button.setAttribute('aria-label', `${prefix} ${ariaLabel}`);
        button.setAttribute('data-selected', 'true');
    }
    else {
        const prefix = isInRange ? '期間内' : '';
        button.setAttribute('aria-label', prefix ? `${prefix} ${ariaLabel}` : ariaLabel);
        button.removeAttribute('data-selected');
    }
    button.tabIndex = isFocusable ? 0 : -1;
    button.dataset.year = String(date.getFullYear());
    button.dataset.month = String(date.getMonth());
    button.dataset.date = String(date.getDate());
    return cell;
}, _DadsCalendar_getDateAriaLabel = function _DadsCalendar_getDateAriaLabel(date) {
    const key = date.getTime();
    const cached = __classPrivateFieldGet(this, _DadsCalendar_ariaLabelCache, "f").get(key);
    if (cached)
        return cached;
    const next = DATE_ARIA_FORMATTER.format(date);
    __classPrivateFieldGet(this, _DadsCalendar_ariaLabelCache, "f").set(key, next);
    return next;
}, _DadsCalendar_selectDate = function _DadsCalendar_selectDate(date) {
    if (__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isRangeMode).call(this)) {
        __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_selectRangeDate).call(this, date);
        return;
    }
    if (date) {
        const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        __classPrivateFieldSet(this, _DadsCalendar_selectedDate, normalized, "f");
    }
    else {
        __classPrivateFieldSet(this, _DadsCalendar_selectedDate, null, "f");
    }
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
    this.dispatchEvent(new CustomEvent('date-selected', {
        detail: { date: __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f") },
        bubbles: true,
        composed: true,
    }));
}, _DadsCalendar_selectRangeDate = function _DadsCalendar_selectRangeDate(date) {
    let announcement = '';
    if (!date) {
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, null, "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, null, "f");
        announcement = '開始日と終了日をクリアしました。';
    }
    else if (!__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") || (__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") && __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f"))) {
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, new Date(date.getFullYear(), date.getMonth(), date.getDate()), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, null, "f");
        announcement = `開始日として${formatJapaneseDate(__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f"))}を選択しました。終了日をお選びください。`;
    }
    else {
        const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let start = __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f");
        let end = selected;
        if (end < start)
            [start, end] = [end, start];
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, start, "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, end, "f");
        announcement = `終了日として${formatJapaneseDate(end)}を選択しました。期間は${formatJapaneseDate(start)}から${formatJapaneseDate(end)}です。`;
    }
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_renderCalendar).call(this);
    if (__classPrivateFieldGet(this, _DadsCalendar_rangeLive, "f")) {
        // 同一文字列だと読み上げが発火しない場合があるため、一度空にして更新
        __classPrivateFieldGet(this, _DadsCalendar_rangeLive, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsCalendar_rangeLive, "f").textContent = announcement;
    }
    this.dispatchEvent(new CustomEvent('date-range-selected', {
        detail: { startDate: __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f"), endDate: __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") },
        bubbles: true,
        composed: true,
    }));
}, _DadsCalendar_navigateToDate = function _DadsCalendar_navigateToDate(targetDate) {
    if (!__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, targetDate))
        return;
    this.setDisplayMonth(targetDate.getFullYear(), targetDate.getMonth());
    const selector = `[data-year="${targetDate.getFullYear()}"][data-month="${targetDate.getMonth()}"][data-date="${targetDate.getDate()}"]`;
    const targetButton = __classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f")?.querySelector(selector);
    if (!targetButton)
        return;
    const currentFocusable = __classPrivateFieldGet(this, _DadsCalendar_calendarTable, "f")?.querySelectorAll('[tabindex="0"]') ?? [];
    for (const el of currentFocusable) {
        el.setAttribute('tabindex', '-1');
    }
    targetButton.setAttribute('tabindex', '0');
    targetButton.focus();
}, _DadsCalendar_navigateMonth = function _DadsCalendar_navigateMonth(direction) {
    if (direction === -1 && !__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isPreviousMonthAvailable).call(this))
        return;
    if (direction === 1 && !__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isNextMonthAvailable).call(this))
        return;
    this.setDisplayMonth(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"), __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") + direction);
}, _DadsCalendar_selectToday = function _DadsCalendar_selectToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, today))
        return;
    this.setDisplayMonth(today.getFullYear(), today.getMonth());
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_selectDate).call(this, today);
}, _DadsCalendar_isDateInRange = function _DadsCalendar_isDateInRange(date) {
    if (!__classPrivateFieldGet(this, _DadsCalendar_minDate, "f") || !__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return true;
    if (Number.isNaN(date.getTime()))
        return false;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateOnly >= __classPrivateFieldGet(this, _DadsCalendar_minDate, "f") && dateOnly < __classPrivateFieldGet(this, _DadsCalendar_maxDate, "f");
}, _DadsCalendar_getClosestDateInRange = function _DadsCalendar_getClosestDateInRange(date) {
    if (!__classPrivateFieldGet(this, _DadsCalendar_minDate, "f") || !__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return new Date(date);
    if (date < __classPrivateFieldGet(this, _DadsCalendar_minDate, "f"))
        return new Date(__classPrivateFieldGet(this, _DadsCalendar_minDate, "f"));
    if (date >= __classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return new Date(__classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_previousMaxDate).call(this));
    return new Date(date);
}, _DadsCalendar_previousMaxDate = function _DadsCalendar_previousMaxDate() {
    if (!__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f"))
        return new Date();
    return new Date(__classPrivateFieldGet(this, _DadsCalendar_maxDate, "f").getFullYear(), __classPrivateFieldGet(this, _DadsCalendar_maxDate, "f").getMonth(), __classPrivateFieldGet(this, _DadsCalendar_maxDate, "f").getDate() - 1);
}, _DadsCalendar_isPreviousMonthAvailable = function _DadsCalendar_isPreviousMonthAvailable() {
    const prevMonthLastDay = new Date(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"), __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f"), 0);
    return __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, prevMonthLastDay);
}, _DadsCalendar_isNextMonthAvailable = function _DadsCalendar_isNextMonthAvailable() {
    const nextMonthFirstDay = new Date(__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f"), __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") + 1, 1);
    return __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, nextMonthFirstDay);
}, _DadsCalendar_calendarHasSelectedDate = function _DadsCalendar_calendarHasSelectedDate() {
    if (!__classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f"))
        return false;
    return (__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") === __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f").getFullYear() &&
        __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") === __classPrivateFieldGet(this, _DadsCalendar_selectedDate, "f").getMonth());
}, _DadsCalendar_calendarHasToday = function _DadsCalendar_calendarHasToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return (__classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") === today.getFullYear() &&
        __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") === today.getMonth() &&
        __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, today));
}, _DadsCalendar_calendarHasRangeSelection = function _DadsCalendar_calendarHasRangeSelection() {
    const start = __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f");
    const end = __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f");
    if (start && __classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") === start.getFullYear() && __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") === start.getMonth()) {
        return true;
    }
    if (end && __classPrivateFieldGet(this, _DadsCalendar_displayYear, "f") === end.getFullYear() && __classPrivateFieldGet(this, _DadsCalendar_displayMonth, "f") === end.getMonth()) {
        return true;
    }
    return false;
}, _DadsCalendar_isRangeMode = function _DadsCalendar_isRangeMode() {
    return this.hasAttribute('range');
}, _DadsCalendar_setRangeStart = function _DadsCalendar_setRangeStart(date) {
    if (date && __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isDateInRange).call(this, date)) {
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, new Date(date.getFullYear(), date.getMonth(), date.getDate()), "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, null, "f");
    }
    else {
        __classPrivateFieldSet(this, _DadsCalendar_rangeStartDate, null, "f");
        __classPrivateFieldSet(this, _DadsCalendar_rangeEndDate, null, "f");
    }
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_syncRangeUI).call(this);
}, _DadsCalendar_syncRangeUI = function _DadsCalendar_syncRangeUI() {
    const isRangeMode = __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_isRangeMode).call(this);
    if (__classPrivateFieldGet(this, _DadsCalendar_rangeContainer, "f"))
        __classPrivateFieldGet(this, _DadsCalendar_rangeContainer, "f").hidden = !isRangeMode;
    if (!isRangeMode)
        return;
    const startText = __classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f") ? formatJapaneseDate(__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f")) : '未選択';
    const endText = __classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f") ? formatJapaneseDate(__classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f")) : '未選択';
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_setText).call(this, __classPrivateFieldGet(this, _DadsCalendar_rangeStart, "f"), startText);
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_setText).call(this, __classPrivateFieldGet(this, _DadsCalendar_rangeEnd, "f"), endText);
    __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_setText).call(this, __classPrivateFieldGet(this, _DadsCalendar_rangeSupport, "f"), __classPrivateFieldGet(this, _DadsCalendar_instances, "m", _DadsCalendar_getRangeSupportText).call(this));
}, _DadsCalendar_getRangeSupportText = function _DadsCalendar_getRangeSupportText() {
    if (!__classPrivateFieldGet(this, _DadsCalendar_rangeStartDate, "f"))
        return '開始日を選択してください。';
    if (!__classPrivateFieldGet(this, _DadsCalendar_rangeEndDate, "f"))
        return '終了日をお選びください。';
    return '開始日と終了日を選択しました。';
}, _DadsCalendar_setText = function _DadsCalendar_setText(el, value) {
    if (el)
        el.textContent = value;
};
DadsCalendar.version = '1.0.0';
DadsCalendar.definition = {
    name: 'dads-calendar',
    template: html `
      <div part="visually-hidden">
        <h2 id="calendar-heading" aria-live="polite"></h2>
      </div>

      <div part="controls">
        <span part="select">
          <span part="select-control">
            <select
              part="year-select"
              id="year-select"
              data-size="sm"
              aria-label="年"
            ></select>
            <svg part="select-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" fill="currentcolor"/>
            </svg>
          </span>
        </span>

        <div part="navigation">
          <dads-button
            part="nav-button prev-month-button"
            id="prev-month-button"
            type="button"
            variant="secondary"
            size="small"
            aria-label="前の月"
          >
            <svg slot="icon-start" width="16" height="16" viewBox="0 0 16 16" role="img" aria-hidden="true">
              <path d="m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z" fill="currentcolor" />
            </svg>
          </dads-button>
          <p part="current-month" id="current-month"></p>
          <dads-button
            part="nav-button next-month-button"
            id="next-month-button"
            type="button"
            variant="secondary"
            size="small"
            aria-label="次の月"
          >
            <svg slot="icon-start" width="16" height="16" viewBox="0 0 16 16" role="img" aria-hidden="true">
              <path d="m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z" fill="currentcolor" />
            </svg>
          </dads-button>
        </div>
      </div>

      <table part="table" id="calendar-table" role="grid">
        <thead>
          <tr>
            <th part="header-cell" scope="col">日</th>
            <th part="header-cell" scope="col">月</th>
            <th part="header-cell" scope="col">火</th>
            <th part="header-cell" scope="col">水</th>
            <th part="header-cell" scope="col">木</th>
            <th part="header-cell" scope="col">金</th>
            <th part="header-cell" scope="col">土</th>
          </tr>
        </thead>
        <tbody id="calendar-tbody"></tbody>
      </table>

      <template id="cell-template">
        <td part="data-cell" role="gridcell">
          <button part="date" data-js-date-button></button>
        </td>
      </template>

      <div part="footer">
        <dads-button part="footer-button" id="delete-button" type="button" variant="tertiary" size="small">削除</dads-button>
        <dads-button part="footer-button" id="today-button" type="button" variant="secondary" size="small">今日</dads-button>
      </div>

      <div part="range" id="range" hidden>
        <p part="support-text" id="range-support"></p>
        <p part="range-item">
          <span part="range-label">開始日:</span>
          <span part="range-value" id="range-start">未選択</span>
        </p>
        <p part="range-item">
          <span part="range-label">終了日:</span>
          <span part="range-value" id="range-end">未選択</span>
        </p>
        <div part="visually-hidden" id="range-live" aria-live="polite"></div>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), calendarStyles], 'minimal'),
    attributes: [
        { attribute: 'min-date' },
        { attribute: 'max-date' },
        { attribute: 'range' },
    ],
};
