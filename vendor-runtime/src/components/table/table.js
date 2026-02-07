/**
 * @module table
 * デジタル庁デザインシステム Table / Data Table コンポーネント
 * @version 0.1.0
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
var _DadsTable_instances, _DadsTable_tableEl, _DadsTable_scrollEl, _DadsTable_mutationObserver, _DadsTable_resizeObserver, _DadsTable_raf, _DadsTable_originalRowIndex, _DadsTable_originalRowIndexCounter, _DadsTable_collator, _DadsTable_scheduleRefresh, _DadsTable_setupMutationObserver, _DadsTable_refresh, _DadsTable_ensureStructure, _DadsTable_ensureScrollShadows, _DadsTable_setupResizeObserver, _DadsTable_setScrollEl, _DadsTable_detachScrollListener, _DadsTable_updateOverflowIndicators, _DadsTable_handleScroll, _DadsTable_prepareControls, _DadsTable_getRowCheckboxes, _DadsTable_getSelectAllCheckbox, _DadsTable_syncSelectionState, _DadsTable_emitSelectionChange, _DadsTable_handleChange, _DadsTable_emitSortChange, _DadsTable_isDomSortingEnabled, _DadsTable_ensureOriginalIndexes, _DadsTable_getOriginalIndex, _DadsTable_getCollator, _DadsTable_normalizeDigits, _DadsTable_parseNumber, _DadsTable_parseDate, _DadsTable_getCellValue, _DadsTable_getTableBodies, _DadsTable_getTableRows, _DadsTable_getHeaderCellIndex, _DadsTable_getSortType, _DadsTable_restoreOriginalOrder, _DadsTable_applyDomSort, _DadsTable_handleClick;
import { BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { createTableTokens } from './table-tokens.js';
import { createTableStyles } from './table-styles.js';
const SORT_ICON_PATHS = {
    none: 'M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z',
    ascending: 'M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z',
    descending: 'M7 5.88L2.73 10L2 9.3L7.5 4L13 9.3L12.27 10L8 5.88V20H7V5.88ZM10 15.08L12.27 13L15 15.48V4H18V15.48L20.73 13L23 15.07L16.5 21L10 15.07Z',
};
const SORT_CONTROL_SELECTOR = '[data-sort], [data-js-sort]';
const MENU_CONTROL_SELECTOR = '[data-menu]';
const ROW_CHECKBOX_SELECTOR = 'input[type="checkbox"][data-select-row], input[type="checkbox"][data-js-check]';
const SELECT_ALL_CHECKBOX_PRIMARY_SELECTOR = 'input[type="checkbox"][data-select-all]';
const SELECT_ALL_CHECKBOX_FALLBACK_SELECTOR = 'input[type="checkbox"][data-js-check-all]';
function isCheckboxInput(el) {
    return el instanceof HTMLInputElement && el.type === 'checkbox';
}
function updateSortIcon(control, direction) {
    const path = control.querySelector('span.dads-table__sort-icon path') ?? control.querySelector('svg path');
    if (!(path instanceof Element))
        return;
    if (path.tagName.toLowerCase() !== 'path')
        return;
    path.setAttribute('d', SORT_ICON_PATHS[direction]);
}
function nextSortDirection(current) {
    if (current === 'ascending')
        return 'descending';
    if (current === 'descending')
        return 'none';
    return 'ascending';
}
function normalizeSortDirection(value) {
    if (value === 'ascending' || value === 'descending' || value === 'none')
        return value;
    return 'none';
}
/**
 * テーブル（Data Table）コンポーネント
 *
 * @customElement dads-table
 * @tagname dads-table
 *
 * @slot default - テーブルマークアップ（<table> 等）
 *
 * @attr {string} size - サイズ
 * @attr {string} sort-behavior - ソート挙動（例: dom）
 * @attr {boolean} striped - 交互行背景
 * @attr {boolean} hover - 行ホバー
 * @attr {boolean} selectable - 行選択を有効化
 *
 * @fires dads-selection-change - 行選択変更時に発火（detail: { selectedRowIds, selectedRowIndexes, selectedCount, totalSelectableRows }）
 * @fires dads-sort-change - ソート変更時に発火（detail: { columnId, columnIndex, direction }）
 */
export class DadsTable extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsTable_instances.add(this);
        _DadsTable_tableEl.set(this, null);
        _DadsTable_scrollEl.set(this, null);
        _DadsTable_mutationObserver.set(this, null);
        _DadsTable_resizeObserver.set(this, null);
        _DadsTable_raf.set(this, 0);
        _DadsTable_originalRowIndex.set(this, new WeakMap());
        _DadsTable_originalRowIndexCounter.set(this, 0);
        _DadsTable_collator.set(this, null);
        _DadsTable_handleScroll.set(this, () => {
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_updateOverflowIndicators).call(this);
        });
        _DadsTable_handleChange.set(this, (event) => {
            const target = event.target;
            if (!isCheckboxInput(target))
                return;
            const isSelectAll = target.hasAttribute('data-select-all') || target.hasAttribute('data-js-check-all');
            const isRow = target.hasAttribute('data-select-row') || target.hasAttribute('data-js-check');
            if (!isSelectAll && !isRow)
                return;
            if (isSelectAll) {
                const next = target.checked;
                const rowCbs = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getRowCheckboxes).call(this);
                for (const cb of rowCbs) {
                    if (cb.disabled)
                        continue;
                    cb.checked = next;
                }
            }
            // Keep aria-selected and header indeterminate/checked in sync.
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_syncSelectionState).call(this);
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_emitSelectionChange).call(this);
        });
        _DadsTable_handleClick.set(this, (event) => {
            const target = event.target;
            if (!(target instanceof Element))
                return;
            const sortControl = target.closest(SORT_CONTROL_SELECTOR);
            if (!sortControl || !this.contains(sortControl))
                return;
            const th = sortControl.closest('th');
            if (!(th instanceof HTMLTableCellElement))
                return;
            const current = th.getAttribute('aria-sort');
            const direction = nextSortDirection(current);
            // Clear other sort states in the same header row
            const row = th.parentElement;
            if (row) {
                const headers = row.querySelectorAll('th');
                for (const h of headers) {
                    if (!(h instanceof HTMLTableCellElement))
                        continue;
                    if (h === th)
                        continue;
                    h.removeAttribute('aria-sort');
                    const control = h.querySelector(SORT_CONTROL_SELECTOR);
                    if (control)
                        updateSortIcon(control, 'none');
                }
            }
            if (direction === 'none')
                th.removeAttribute('aria-sort');
            else
                th.setAttribute('aria-sort', direction);
            updateSortIcon(sortControl, direction);
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_applyDomSort).call(this, th, direction);
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_emitSortChange).call(this, th, direction);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, { size: 'md' });
        this.addEventListener('change', __classPrivateFieldGet(this, _DadsTable_handleChange, "f"));
        this.addEventListener('click', __classPrivateFieldGet(this, _DadsTable_handleClick, "f"));
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_setupMutationObserver).call(this);
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_refresh).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('change', __classPrivateFieldGet(this, _DadsTable_handleChange, "f"));
        this.removeEventListener('click', __classPrivateFieldGet(this, _DadsTable_handleClick, "f"));
        __classPrivateFieldGet(this, _DadsTable_mutationObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsTable_mutationObserver, null, "f");
        __classPrivateFieldGet(this, _DadsTable_resizeObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsTable_resizeObserver, null, "f");
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_detachScrollListener).call(this);
        if (__classPrivateFieldGet(this, _DadsTable_raf, "f"))
            cancelAnimationFrame(__classPrivateFieldGet(this, _DadsTable_raf, "f"));
        __classPrivateFieldSet(this, _DadsTable_raf, 0, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        if (name === 'size' ||
            name === 'striped' ||
            name === 'hover' ||
            name === 'selectable' ||
            name === 'sort-behavior') {
            __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_scheduleRefresh).call(this);
        }
    }
    refresh() {
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_refresh).call(this);
    }
}
_DadsTable_tableEl = new WeakMap(), _DadsTable_scrollEl = new WeakMap(), _DadsTable_mutationObserver = new WeakMap(), _DadsTable_resizeObserver = new WeakMap(), _DadsTable_raf = new WeakMap(), _DadsTable_originalRowIndex = new WeakMap(), _DadsTable_originalRowIndexCounter = new WeakMap(), _DadsTable_collator = new WeakMap(), _DadsTable_handleScroll = new WeakMap(), _DadsTable_handleChange = new WeakMap(), _DadsTable_handleClick = new WeakMap(), _DadsTable_instances = new WeakSet(), _DadsTable_scheduleRefresh = function _DadsTable_scheduleRefresh() {
    if (__classPrivateFieldGet(this, _DadsTable_raf, "f"))
        cancelAnimationFrame(__classPrivateFieldGet(this, _DadsTable_raf, "f"));
    __classPrivateFieldSet(this, _DadsTable_raf, requestAnimationFrame(() => {
        __classPrivateFieldSet(this, _DadsTable_raf, 0, "f");
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_refresh).call(this);
    }), "f");
}, _DadsTable_setupMutationObserver = function _DadsTable_setupMutationObserver() {
    if (__classPrivateFieldGet(this, _DadsTable_mutationObserver, "f"))
        return;
    if (typeof MutationObserver === 'undefined')
        return;
    __classPrivateFieldSet(this, _DadsTable_mutationObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_scheduleRefresh).call(this)), "f");
    __classPrivateFieldGet(this, _DadsTable_mutationObserver, "f").observe(this, { childList: true, subtree: true });
}, _DadsTable_refresh = function _DadsTable_refresh() {
    const nextTable = this.querySelector('table');
    __classPrivateFieldSet(this, _DadsTable_tableEl, nextTable instanceof HTMLTableElement ? nextTable : null, "f");
    if (!__classPrivateFieldGet(this, _DadsTable_tableEl, "f"))
        return;
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_ensureStructure).call(this, __classPrivateFieldGet(this, _DadsTable_tableEl, "f"));
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_prepareControls).call(this);
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_syncSelectionState).call(this);
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_updateOverflowIndicators).call(this);
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_setupResizeObserver).call(this);
}, _DadsTable_ensureStructure = function _DadsTable_ensureStructure(table) {
    const existingScroll = table.closest('[part="scroll"]');
    if (existingScroll instanceof HTMLElement && this.contains(existingScroll)) {
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_ensureScrollShadows).call(this, existingScroll, table);
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_setScrollEl).call(this, existingScroll);
        return;
    }
    const container = document.createElement('div');
    container.setAttribute('part', 'container');
    const scroll = document.createElement('div');
    scroll.setAttribute('part', 'scroll');
    const parent = table.parentNode;
    if (!parent)
        return;
    parent.insertBefore(container, table);
    container.appendChild(scroll);
    scroll.appendChild(table);
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_ensureScrollShadows).call(this, scroll, table);
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_setScrollEl).call(this, scroll);
}, _DadsTable_ensureScrollShadows = function _DadsTable_ensureScrollShadows(scroll, table) {
    const ensure = (part) => {
        const existing = scroll.querySelector(`[part="${part}"]`);
        if (existing)
            return existing;
        const el = document.createElement('div');
        el.setAttribute('part', part);
        el.setAttribute('aria-hidden', 'true');
        return el;
    };
    const left = ensure('scroll-shadow-left');
    const right = ensure('scroll-shadow-right');
    // Ensure they are direct children of the scroll container.
    if (left.parentElement !== scroll)
        scroll.appendChild(left);
    if (right.parentElement !== scroll)
        scroll.appendChild(right);
    // Ensure ordering: left -> table -> right.
    if (left.nextSibling !== table)
        scroll.insertBefore(left, table);
    if (table.nextSibling !== right)
        scroll.insertBefore(right, table.nextSibling);
}, _DadsTable_setupResizeObserver = function _DadsTable_setupResizeObserver() {
    const scroll = __classPrivateFieldGet(this, _DadsTable_scrollEl, "f");
    if (!scroll)
        return;
    if (typeof ResizeObserver === 'undefined')
        return;
    __classPrivateFieldSet(this, _DadsTable_resizeObserver, __classPrivateFieldGet(this, _DadsTable_resizeObserver, "f") ?? new ResizeObserver(() => __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_updateOverflowIndicators).call(this)), "f");
    // Re-observe only the current scroll container.
    __classPrivateFieldGet(this, _DadsTable_resizeObserver, "f").disconnect();
    __classPrivateFieldGet(this, _DadsTable_resizeObserver, "f").observe(scroll);
}, _DadsTable_setScrollEl = function _DadsTable_setScrollEl(next) {
    if (__classPrivateFieldGet(this, _DadsTable_scrollEl, "f") === next)
        return;
    __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_detachScrollListener).call(this);
    __classPrivateFieldSet(this, _DadsTable_scrollEl, next, "f");
    __classPrivateFieldGet(this, _DadsTable_scrollEl, "f").addEventListener('scroll', __classPrivateFieldGet(this, _DadsTable_handleScroll, "f"), { passive: true });
}, _DadsTable_detachScrollListener = function _DadsTable_detachScrollListener() {
    const scroll = __classPrivateFieldGet(this, _DadsTable_scrollEl, "f");
    if (!scroll)
        return;
    scroll.removeEventListener('scroll', __classPrivateFieldGet(this, _DadsTable_handleScroll, "f"));
    __classPrivateFieldSet(this, _DadsTable_scrollEl, null, "f");
}, _DadsTable_updateOverflowIndicators = function _DadsTable_updateOverflowIndicators() {
    const scroll = __classPrivateFieldGet(this, _DadsTable_scrollEl, "f");
    if (!scroll)
        return;
    const hasOverflow = scroll.scrollWidth > scroll.clientWidth + 1;
    scroll.toggleAttribute('data-has-overflow', hasOverflow);
    if (!hasOverflow) {
        scroll.removeAttribute('data-shadow-left');
        scroll.removeAttribute('data-shadow-right');
        return;
    }
    const styles = getComputedStyle(scroll);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
    const left = scroll.scrollLeft > paddingLeft + 1;
    const right = scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - paddingRight - 1;
    scroll.toggleAttribute('data-shadow-left', left);
    scroll.toggleAttribute('data-shadow-right', right);
}, _DadsTable_prepareControls = function _DadsTable_prepareControls() {
    // Sort buttons: add icon span if missing and ensure type="button"
    const sortControls = this.querySelectorAll(SORT_CONTROL_SELECTOR);
    for (const control of sortControls) {
        if (control instanceof HTMLButtonElement && !control.hasAttribute('type')) {
            control.type = 'button';
        }
        if (!control.querySelector('[data-sort-icon], .dads-table__sort-icon')) {
            const icon = document.createElement('span');
            icon.setAttribute('data-sort-icon', '');
            icon.setAttribute('aria-hidden', 'true');
            control.appendChild(icon);
        }
        const th = control.closest('th');
        if (th instanceof HTMLTableCellElement) {
            updateSortIcon(control, normalizeSortDirection(th.getAttribute('aria-sort')));
        }
    }
    // Header menu buttons: add icon span if empty and ensure type="button"
    const menuControls = this.querySelectorAll(MENU_CONTROL_SELECTOR);
    for (const control of menuControls) {
        if (control instanceof HTMLButtonElement && !control.hasAttribute('type')) {
            control.type = 'button';
        }
        const cell = control.closest('th,td');
        if (cell)
            cell.setAttribute('data-menu-cell', '');
        if (!control.querySelector('[data-menu-icon]')) {
            const hasMeaningfulContent = (control.textContent ?? '').trim() !== '' || control.childElementCount > 0;
            if (!hasMeaningfulContent) {
                const icon = document.createElement('span');
                icon.setAttribute('data-menu-icon', '');
                icon.setAttribute('aria-hidden', 'true');
                control.appendChild(icon);
            }
        }
    }
}, _DadsTable_getRowCheckboxes = function _DadsTable_getRowCheckboxes() {
    return Array.from(this.querySelectorAll(ROW_CHECKBOX_SELECTOR));
}, _DadsTable_getSelectAllCheckbox = function _DadsTable_getSelectAllCheckbox() {
    return (this.querySelector(SELECT_ALL_CHECKBOX_PRIMARY_SELECTOR) ??
        this.querySelector(SELECT_ALL_CHECKBOX_FALLBACK_SELECTOR));
}, _DadsTable_syncSelectionState = function _DadsTable_syncSelectionState() {
    if (!__classPrivateFieldGet(this, _DadsTable_tableEl, "f"))
        return;
    const rowCbs = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getRowCheckboxes).call(this);
    if (rowCbs.length === 0)
        return;
    // Mark selection column cells for styling
    const selectAll = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getSelectAllCheckbox).call(this);
    if (selectAll) {
        const cell = selectAll.closest('th,td');
        if (cell)
            cell.setAttribute('data-selection-cell', '');
    }
    for (const cb of rowCbs) {
        const cell = cb.closest('th,td');
        if (cell)
            cell.setAttribute('data-selection-cell', '');
    }
    // Reflect row selection to aria-selected
    for (const cb of rowCbs) {
        const row = cb.closest('tr');
        if (!row)
            continue;
        if (cb.checked)
            row.setAttribute('aria-selected', 'true');
        else
            row.removeAttribute('aria-selected');
    }
    // Update header checkbox state (checked / indeterminate)
    if (!selectAll)
        return;
    const selectable = rowCbs.filter((cb) => !cb.disabled);
    const total = selectable.length;
    const checked = selectable.filter((cb) => cb.checked).length;
    selectAll.indeterminate = checked > 0 && checked < total;
    selectAll.checked = total > 0 && checked === total;
}, _DadsTable_emitSelectionChange = function _DadsTable_emitSelectionChange() {
    const rowCbs = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getRowCheckboxes).call(this).filter((cb) => !cb.disabled);
    const total = rowCbs.length;
    const selectedRowIndexes = [];
    const selectedRowIds = [];
    for (const [index, cb] of rowCbs.entries()) {
        if (!cb.checked)
            continue;
        selectedRowIndexes.push(index);
        const id = cb.closest('tr')?.getAttribute('data-row-id');
        if (id)
            selectedRowIds.push(id);
    }
    const detail = {
        selectedRowIds,
        selectedRowIndexes,
        selectedCount: selectedRowIndexes.length,
        totalSelectableRows: total,
    };
    this.dispatchEvent(new CustomEvent('dads-selection-change', {
        detail,
        bubbles: true,
        composed: true,
    }));
}, _DadsTable_emitSortChange = function _DadsTable_emitSortChange(th, direction) {
    const columnIndex = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getHeaderCellIndex).call(this, th);
    const columnId = th.getAttribute('data-column') || th.id || null;
    const detail = {
        columnId,
        columnIndex,
        direction,
    };
    this.dispatchEvent(new CustomEvent('dads-sort-change', {
        detail,
        bubbles: true,
        composed: true,
    }));
}, _DadsTable_isDomSortingEnabled = function _DadsTable_isDomSortingEnabled() {
    if (this.getAttribute('sort-behavior') === 'dom')
        return true;
    const alias = this.querySelector('.dads-table[data-sort-behavior="dom"]');
    return alias !== null;
}, _DadsTable_ensureOriginalIndexes = function _DadsTable_ensureOriginalIndexes(rows) {
    var _a, _b;
    for (const row of rows) {
        if (!__classPrivateFieldGet(this, _DadsTable_originalRowIndex, "f").has(row)) {
            __classPrivateFieldGet(this, _DadsTable_originalRowIndex, "f").set(row, (__classPrivateFieldSet(this, _DadsTable_originalRowIndexCounter, (_b = __classPrivateFieldGet(this, _DadsTable_originalRowIndexCounter, "f"), _a = _b++, _b), "f"), _a));
        }
    }
}, _DadsTable_getOriginalIndex = function _DadsTable_getOriginalIndex(row) {
    var _a, _b;
    const existing = __classPrivateFieldGet(this, _DadsTable_originalRowIndex, "f").get(row);
    if (existing != null)
        return existing;
    const next = (__classPrivateFieldSet(this, _DadsTable_originalRowIndexCounter, (_b = __classPrivateFieldGet(this, _DadsTable_originalRowIndexCounter, "f"), _a = _b++, _b), "f"), _a);
    __classPrivateFieldGet(this, _DadsTable_originalRowIndex, "f").set(row, next);
    return next;
}, _DadsTable_getCollator = function _DadsTable_getCollator() {
    if (__classPrivateFieldGet(this, _DadsTable_collator, "f"))
        return __classPrivateFieldGet(this, _DadsTable_collator, "f");
    if (typeof Intl === 'undefined' || typeof Intl.Collator === 'undefined')
        return null;
    __classPrivateFieldSet(this, _DadsTable_collator, new Intl.Collator(undefined, { sensitivity: 'base' }), "f");
    return __classPrivateFieldGet(this, _DadsTable_collator, "f");
}, _DadsTable_normalizeDigits = function _DadsTable_normalizeDigits(value) {
    // Convert full-width digits and separators to ASCII equivalents.
    return value
        .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
        .replace(/[．。]/g, '.')
        .replace(/[／]/g, '/')
        .replace(/[－−]/g, '-')
        .replace(/[，]/g, ',');
}, _DadsTable_parseNumber = function _DadsTable_parseNumber(value) {
    const normalized = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_normalizeDigits).call(this, value).trim().replace(/[\s,_]/g, '');
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized))
        return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
}, _DadsTable_parseDate = function _DadsTable_parseDate(value) {
    const normalized = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_normalizeDigits).call(this, value).trim();
    const iso = normalized.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:\D|$)/);
    const jp = normalized.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);
    const match = iso ?? jp;
    if (!match)
        return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day))
        return null;
    if (month < 1 || month > 12)
        return null;
    if (day < 1 || day > 31)
        return null;
    const time = Date.UTC(year, month - 1, day);
    return Number.isFinite(time) ? time : null;
}, _DadsTable_getCellValue = function _DadsTable_getCellValue(row, columnIndex) {
    const cell = row.querySelectorAll('th,td')[columnIndex];
    if (!(cell instanceof HTMLTableCellElement))
        return null;
    const attr = cell.getAttribute('data-sort-value');
    const raw = (attr ?? cell.textContent ?? '').trim();
    return raw === '' ? null : raw;
}, _DadsTable_getTableBodies = function _DadsTable_getTableBodies(table) {
    return Array.from(table.querySelectorAll('tbody'));
}, _DadsTable_getTableRows = function _DadsTable_getTableRows(tbody) {
    return Array.from(tbody.querySelectorAll('tr'));
}, _DadsTable_getHeaderCellIndex = function _DadsTable_getHeaderCellIndex(cell) {
    // Some DOM environments don't implement HTMLTableCellElement#cellIndex.
    const raw = cell.cellIndex;
    if (typeof raw === 'number' && raw >= 0)
        return raw;
    const row = cell.parentElement;
    const siblings = row ? Array.from(row.children) : [];
    const fallback = siblings.indexOf(cell);
    return fallback < 0 ? 0 : fallback;
}, _DadsTable_getSortType = function _DadsTable_getSortType(th, columnIndex) {
    const explicit = th.getAttribute('data-sort-type');
    if (explicit === 'string' || explicit === 'number' || explicit === 'date')
        return explicit;
    const table = __classPrivateFieldGet(this, _DadsTable_tableEl, "f");
    if (!table)
        return 'string';
    const values = [];
    for (const tbody of __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableBodies).call(this, table)) {
        for (const row of __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableRows).call(this, tbody)) {
            const v = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getCellValue).call(this, row, columnIndex);
            if (v != null)
                values.push(v);
        }
    }
    if (values.length === 0)
        return 'string';
    if (values.every((v) => __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_parseNumber).call(this, v) != null))
        return 'number';
    if (values.every((v) => __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_parseDate).call(this, v) != null))
        return 'date';
    return 'string';
}, _DadsTable_restoreOriginalOrder = function _DadsTable_restoreOriginalOrder() {
    const table = __classPrivateFieldGet(this, _DadsTable_tableEl, "f");
    if (!table)
        return;
    for (const tbody of __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableBodies).call(this, table)) {
        const rows = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableRows).call(this, tbody);
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_ensureOriginalIndexes).call(this, rows);
        const sorted = [...rows].sort((a, b) => __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getOriginalIndex).call(this, a) - __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getOriginalIndex).call(this, b));
        const isSame = rows.every((row, i) => row === sorted[i]);
        if (isSame)
            continue;
        for (const row of sorted)
            tbody.appendChild(row);
    }
}, _DadsTable_applyDomSort = function _DadsTable_applyDomSort(th, direction) {
    if (!__classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_isDomSortingEnabled).call(this))
        return;
    const table = __classPrivateFieldGet(this, _DadsTable_tableEl, "f");
    if (!table)
        return;
    const safeColumnIndex = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getHeaderCellIndex).call(this, th);
    if (direction === 'none') {
        __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_restoreOriginalOrder).call(this);
        return;
    }
    const sortType = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getSortType).call(this, th, safeColumnIndex);
    const collator = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getCollator).call(this);
    for (const tbody of __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableBodies).call(this, table)) {
        const rows = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getTableRows).call(this, tbody);
        const items = rows.map((row) => {
            const raw = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getCellValue).call(this, row, safeColumnIndex);
            const originalIndex = __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_getOriginalIndex).call(this, row);
            return {
                row,
                raw,
                originalIndex,
                num: raw == null ? null : __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_parseNumber).call(this, raw),
                date: raw == null ? null : __classPrivateFieldGet(this, _DadsTable_instances, "m", _DadsTable_parseDate).call(this, raw),
            };
        });
        const sorted = [...items].sort((a, b) => {
            if (a.raw == null && b.raw == null)
                return a.originalIndex - b.originalIndex;
            if (a.raw == null)
                return 1;
            if (b.raw == null)
                return -1;
            let cmp = 0;
            if (sortType === 'number') {
                const av = a.num;
                const bv = b.num;
                if (av == null && bv == null)
                    cmp = 0;
                else if (av == null)
                    cmp = 1;
                else if (bv == null)
                    cmp = -1;
                else
                    cmp = av - bv;
            }
            else if (sortType === 'date') {
                const av = a.date;
                const bv = b.date;
                if (av == null && bv == null)
                    cmp = 0;
                else if (av == null)
                    cmp = 1;
                else if (bv == null)
                    cmp = -1;
                else
                    cmp = av - bv;
            }
            else {
                const av = a.raw;
                const bv = b.raw;
                cmp = collator ? collator.compare(av, bv) : av.localeCompare(bv);
            }
            if (cmp === 0)
                cmp = a.originalIndex - b.originalIndex;
            return direction === 'descending' ? -cmp : cmp;
        });
        const sortedRows = sorted.map((i) => i.row);
        const isSame = rows.every((row, i) => row === sortedRows[i]);
        if (isSame)
            continue;
        for (const row of sortedRows)
            tbody.appendChild(row);
    }
};
DadsTable.version = '0.1.0';
DadsTable.definition = {
    name: 'dads-table',
    shadowOptions: null,
    styles: [
        createTableTokens('dads-table'),
        createTableStyles('dads-table'),
    ],
    attributes: [
        PropertyAttr('size'),
        PropertyAttr('sortBehavior', 'sort-behavior'),
        BooleanAttr('striped'),
        BooleanAttr('hover'),
        BooleanAttr('selectable'),
    ],
};
