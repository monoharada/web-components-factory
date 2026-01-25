/**
 * @module table
 * デジタル庁デザインシステム Table / Data Table コンポーネント
 * @version 0.1.0
 */

import { BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';
import { createTableTokens } from './table-tokens.js';
import { createTableStyles } from './table-styles.js';

type SortDirection = 'ascending' | 'descending' | 'none';
type SortValueType = 'string' | 'number' | 'date';

export type DadsTableSelectionChangeDetail = Readonly<{
  selectedRowIds: readonly string[];
  selectedRowIndexes: readonly number[];
  selectedCount: number;
  totalSelectableRows: number;
}>;

export type DadsTableSortChangeDetail = Readonly<{
  columnId: string | null;
  columnIndex: number;
  direction: SortDirection;
}>;

const SORT_ICON_PATHS: Record<SortDirection, string> = {
  none: 'M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z',
  ascending:
    'M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z',
  descending:
    'M7 5.88L2.73 10L2 9.3L7.5 4L13 9.3L12.27 10L8 5.88V20H7V5.88ZM10 15.08L12.27 13L15 15.48V4H18V15.48L20.73 13L23 15.07L16.5 21L10 15.07Z',
};

const SORT_CONTROL_SELECTOR = '[data-sort], [data-js-sort]';
const MENU_CONTROL_SELECTOR = '[data-menu]';
const ROW_CHECKBOX_SELECTOR =
  'input[type="checkbox"][data-select-row], input[type="checkbox"][data-js-check]';
const SELECT_ALL_CHECKBOX_PRIMARY_SELECTOR = 'input[type="checkbox"][data-select-all]';
const SELECT_ALL_CHECKBOX_FALLBACK_SELECTOR = 'input[type="checkbox"][data-js-check-all]';

function isCheckboxInput(el: unknown): el is HTMLInputElement {
  return el instanceof HTMLInputElement && el.type === 'checkbox';
}

function updateSortIcon(control: Element, direction: SortDirection): void {
  const path =
    control.querySelector('span.dads-table__sort-icon path') ?? control.querySelector('svg path');
  if (!(path instanceof Element)) return;
  if (path.tagName.toLowerCase() !== 'path') return;
  path.setAttribute('d', SORT_ICON_PATHS[direction]);
}

function nextSortDirection(current: string | null): SortDirection {
  if (current === 'ascending') return 'descending';
  if (current === 'descending') return 'none';
  return 'ascending';
}

function normalizeSortDirection(value: string | null): SortDirection {
  if (value === 'ascending' || value === 'descending' || value === 'none') return value;
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
  static readonly version = '0.1.0';

  static definition = {
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

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'テーブル／データテーブル（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'ネイティブの <table> 要素をそのまま使用し、行・列の関係性をブラウザ標準のセマンティクスで提供します。',
        '列見出しは <th scope="col">、行見出しは <th scope="row"> を推奨します（複雑な表は見出し構造を簡素化）。',
      ],
      keyboard: [
        '選択（チェックボックス）やソート（ボタン）等の操作はネイティブ要素に委譲します。',
        'Tabで操作要素に移動し、Space/Enterで操作できます（ネイティブ挙動）。',
      ],
      zoom: [
        '横幅が足りない場合は水平スクロール（オーバーフロー）を許可し、視認性を確保します。',
      ],
      states: [
        'striped属性で交互行背景、hover属性で行ホバー、選択状態は <tr aria-selected="true"> として表現します。',
        'ソート状態は <th aria-sort="ascending|descending"> として表現します。',
        'sort-behavior="dom" を指定すると、ソート操作に連動して <tbody> の行順をDOM上で並び替えます（3クリック目のnoneで元の順序に戻ります）。',
        'DOM自動ソート時は data-sort-type="string|number|date" と data-sort-value で判定・比較を明示できます（複数tbodyは各tbody内でソート）。',
      ],
      labels: [
        '<caption> を使用してテーブルのタイトル／説明を提供できます。',
        '行選択用のチェックボックス（data-select-row / data-select-all）は aria-label 等でラベル付けしてください。',
      ],
      motion: ['アニメーションは使用しません。'],
    },
    callouts: [
      {
        id: 'table',
        title: 'テーブル本体',
        label: '<table>',
        description: 'ネイティブのtable要素をそのまま配置します。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'light', selector: 'table' },
      },
      {
        id: 'caption',
        title: 'キャプション',
        label: '<caption>',
        description:
          'テーブルのタイトル／説明は caption（または figure + figcaption）で提供すると、利用者が目的を把握しやすくなります。',
        category: 'labels',
        placement: 'top-right',
        target: { scope: 'light', selector: ':is(caption, figcaption, .dads-table__caption)' },
      },
      {
        id: 'header',
        title: '見出しセル',
        label: 'scope="col"',
        description:
          '列見出しは th scope="col"、行見出しは th scope="row" を推奨します（読み上げ時の関連付けが明確になります）。',
        category: 'semantics',
        placement: 'top-left',
        target: { scope: 'light', selector: 'th[scope="col"]' },
      },
      {
        id: 'scroll',
        title: 'スクロールコンテナ',
        label: 'overflow-x',
        description: '横幅不足時に水平スクロールできるようにします。',
        category: 'zoom',
        placement: 'top-left',
        target: { scope: 'light', selector: '[part="scroll"]' },
      },
      {
        id: 'sort',
        title: 'ソート操作',
        label: 'data-sort',
        description:
          'ヘッダーセル内のボタンをクリックすると aria-sort を切り替え、dads-sort-change を発火します。sort-behavior="dom" の場合はDOMも並び替えます。',
        category: 'states',
        placement: 'bottom-left',
        target: { scope: 'light', selector: '[data-sort], [data-js-sort]' },
      },
      {
        id: 'select-all',
        title: '全選択',
        label: 'data-select-all',
        description:
          'ヘッダーのチェックボックスで全行を一括選択できます（indeterminate も含め、状態はコンポーネントが同期します）。',
        category: 'states',
        placement: 'bottom-left',
        target: { scope: 'light', selector: '[data-select-all], [data-js-check-all]' },
      },
      {
        id: 'selection',
        title: '行選択',
        label: 'data-select-row',
        description:
          'チェック状態に応じて行へ aria-selected="true" を付与し、dads-selection-change を発火します。',
        category: 'states',
        placement: 'bottom-right',
        target: { scope: 'light', selector: '[data-select-row], [data-js-check]' },
      },
    ],
  };

  #tableEl: HTMLTableElement | null = null;
  #scrollEl: HTMLElement | null = null;
  #mutationObserver: MutationObserver | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #raf = 0;
  #originalRowIndex = new WeakMap<HTMLTableRowElement, number>();
  #originalRowIndexCounter = 0;
  #collator: Intl.Collator | null = null;

  connectedCallback() {
    super.connectedCallback();

    setDefaultAttributes(this, { size: 'md' });

    this.addEventListener('change', this.#handleChange);
    this.addEventListener('click', this.#handleClick);

    this.#setupMutationObserver();
    this.#refresh();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('change', this.#handleChange);
    this.removeEventListener('click', this.#handleClick);

    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;

    this.#detachScrollListener();

    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (
      name === 'size' ||
      name === 'striped' ||
      name === 'hover' ||
      name === 'selectable' ||
      name === 'sort-behavior'
    ) {
      this.#scheduleRefresh();
    }
  }

  refresh(): void {
    this.#refresh();
  }

  #scheduleRefresh(): void {
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = requestAnimationFrame(() => {
      this.#raf = 0;
      this.#refresh();
    });
  }

  #setupMutationObserver(): void {
    if (this.#mutationObserver) return;
    if (typeof MutationObserver === 'undefined') return;

    this.#mutationObserver = new MutationObserver(() => this.#scheduleRefresh());
    this.#mutationObserver.observe(this, { childList: true, subtree: true });
  }

  #refresh(): void {
    const nextTable = this.querySelector('table');
    this.#tableEl = nextTable instanceof HTMLTableElement ? nextTable : null;

    if (!this.#tableEl) return;

    this.#ensureStructure(this.#tableEl);
    this.#prepareControls();
    this.#syncSelectionState();
    this.#updateOverflowIndicators();
    this.#setupResizeObserver();
  }

  #ensureStructure(table: HTMLTableElement): void {
    const existingScroll = table.closest('[part="scroll"]');
    if (existingScroll instanceof HTMLElement && this.contains(existingScroll)) {
      this.#ensureScrollShadows(existingScroll, table);
      this.#setScrollEl(existingScroll);
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('part', 'container');

    const scroll = document.createElement('div');
    scroll.setAttribute('part', 'scroll');

    const parent = table.parentNode;
    if (!parent) return;

    parent.insertBefore(container, table);
    container.appendChild(scroll);
    scroll.appendChild(table);

    this.#ensureScrollShadows(scroll, table);
    this.#setScrollEl(scroll);
  }

  #ensureScrollShadows(scroll: HTMLElement, table: HTMLTableElement): void {
    const ensure = (part: 'scroll-shadow-left' | 'scroll-shadow-right'): HTMLElement => {
      const existing = scroll.querySelector<HTMLElement>(`[part="${part}"]`);
      if (existing) return existing;
      const el = document.createElement('div');
      el.setAttribute('part', part);
      el.setAttribute('aria-hidden', 'true');
      return el;
    };

    const left = ensure('scroll-shadow-left');
    const right = ensure('scroll-shadow-right');

    // Ensure they are direct children of the scroll container.
    if (left.parentElement !== scroll) scroll.appendChild(left);
    if (right.parentElement !== scroll) scroll.appendChild(right);

    // Ensure ordering: left -> table -> right.
    if (left.nextSibling !== table) scroll.insertBefore(left, table);
    if (table.nextSibling !== right) scroll.insertBefore(right, table.nextSibling);
  }

  #setupResizeObserver(): void {
    const scroll = this.#scrollEl;
    if (!scroll) return;
    if (typeof ResizeObserver === 'undefined') return;

    this.#resizeObserver ??= new ResizeObserver(() => this.#updateOverflowIndicators());
    // Re-observe only the current scroll container.
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(scroll);
  }

  #setScrollEl(next: HTMLElement): void {
    if (this.#scrollEl === next) return;
    this.#detachScrollListener();
    this.#scrollEl = next;
    this.#scrollEl.addEventListener('scroll', this.#handleScroll, { passive: true });
  }

  #detachScrollListener(): void {
    const scroll = this.#scrollEl;
    if (!scroll) return;
    scroll.removeEventListener('scroll', this.#handleScroll);
    this.#scrollEl = null;
  }

  #updateOverflowIndicators(): void {
    const scroll = this.#scrollEl;
    if (!scroll) return;

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
  }

  #handleScroll = (): void => {
    this.#updateOverflowIndicators();
  };

  #prepareControls(): void {
    // Sort buttons: add icon span if missing and ensure type="button"
    const sortControls = this.querySelectorAll<HTMLElement>(SORT_CONTROL_SELECTOR);
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
    const menuControls = this.querySelectorAll<HTMLElement>(MENU_CONTROL_SELECTOR);
    for (const control of menuControls) {
      if (control instanceof HTMLButtonElement && !control.hasAttribute('type')) {
        control.type = 'button';
      }

      const cell = control.closest('th,td');
      if (cell) cell.setAttribute('data-menu-cell', '');

      if (!control.querySelector('[data-menu-icon]')) {
        const hasMeaningfulContent =
          (control.textContent ?? '').trim() !== '' || control.childElementCount > 0;
        if (!hasMeaningfulContent) {
          const icon = document.createElement('span');
          icon.setAttribute('data-menu-icon', '');
          icon.setAttribute('aria-hidden', 'true');
          control.appendChild(icon);
        }
      }
    }
  }

  #getRowCheckboxes(): HTMLInputElement[] {
    return Array.from(this.querySelectorAll<HTMLInputElement>(ROW_CHECKBOX_SELECTOR));
  }

  #getSelectAllCheckbox(): HTMLInputElement | null {
    return (
      this.querySelector<HTMLInputElement>(SELECT_ALL_CHECKBOX_PRIMARY_SELECTOR) ??
      this.querySelector<HTMLInputElement>(SELECT_ALL_CHECKBOX_FALLBACK_SELECTOR)
    );
  }

  #syncSelectionState(): void {
    if (!this.#tableEl) return;

    const rowCbs = this.#getRowCheckboxes();
    if (rowCbs.length === 0) return;

    // Mark selection column cells for styling
    const selectAll = this.#getSelectAllCheckbox();
    if (selectAll) {
      const cell = selectAll.closest('th,td');
      if (cell) cell.setAttribute('data-selection-cell', '');
    }
    for (const cb of rowCbs) {
      const cell = cb.closest('th,td');
      if (cell) cell.setAttribute('data-selection-cell', '');
    }

    // Reflect row selection to aria-selected
    for (const cb of rowCbs) {
      const row = cb.closest('tr');
      if (!row) continue;
      if (cb.checked) row.setAttribute('aria-selected', 'true');
      else row.removeAttribute('aria-selected');
    }

    // Update header checkbox state (checked / indeterminate)
    if (!selectAll) return;

    const selectable = rowCbs.filter((cb) => !cb.disabled);
    const total = selectable.length;
    const checked = selectable.filter((cb) => cb.checked).length;

    selectAll.indeterminate = checked > 0 && checked < total;
    selectAll.checked = total > 0 && checked === total;
  }

  #emitSelectionChange(): void {
    const rowCbs = this.#getRowCheckboxes().filter((cb) => !cb.disabled);
    const total = rowCbs.length;

    const selectedRowIndexes: number[] = [];
    const selectedRowIds: string[] = [];

    for (const [index, cb] of rowCbs.entries()) {
      if (!cb.checked) continue;
      selectedRowIndexes.push(index);
      const id = cb.closest('tr')?.getAttribute('data-row-id');
      if (id) selectedRowIds.push(id);
    }

    const detail: DadsTableSelectionChangeDetail = {
      selectedRowIds,
      selectedRowIndexes,
      selectedCount: selectedRowIndexes.length,
      totalSelectableRows: total,
    };

    this.dispatchEvent(
      new CustomEvent<DadsTableSelectionChangeDetail>('dads-selection-change', {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  #handleChange = (event: Event): void => {
    const target = event.target;
    if (!isCheckboxInput(target)) return;

    const isSelectAll =
      target.hasAttribute('data-select-all') || target.hasAttribute('data-js-check-all');
    const isRow = target.hasAttribute('data-select-row') || target.hasAttribute('data-js-check');
    if (!isSelectAll && !isRow) return;

    if (isSelectAll) {
      const next = target.checked;
      const rowCbs = this.#getRowCheckboxes();
      for (const cb of rowCbs) {
        if (cb.disabled) continue;
        cb.checked = next;
      }
    }

    // Keep aria-selected and header indeterminate/checked in sync.
    this.#syncSelectionState();
    this.#emitSelectionChange();
  };

  #emitSortChange(th: HTMLTableCellElement, direction: SortDirection): void {
    const columnIndex = this.#getHeaderCellIndex(th);
    const columnId = th.getAttribute('data-column') || th.id || null;

    const detail: DadsTableSortChangeDetail = {
      columnId,
      columnIndex,
      direction,
    };

    this.dispatchEvent(
      new CustomEvent<DadsTableSortChangeDetail>('dads-sort-change', {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  #isDomSortingEnabled(): boolean {
    if (this.getAttribute('sort-behavior') === 'dom') return true;
    const alias = this.querySelector('.dads-table[data-sort-behavior="dom"]');
    return alias !== null;
  }

  #ensureOriginalIndexes(rows: readonly HTMLTableRowElement[]): void {
    for (const row of rows) {
      if (!this.#originalRowIndex.has(row)) {
        this.#originalRowIndex.set(row, this.#originalRowIndexCounter++);
      }
    }
  }

  #getOriginalIndex(row: HTMLTableRowElement): number {
    const existing = this.#originalRowIndex.get(row);
    if (existing != null) return existing;
    const next = this.#originalRowIndexCounter++;
    this.#originalRowIndex.set(row, next);
    return next;
  }

  #getCollator(): Intl.Collator | null {
    if (this.#collator) return this.#collator;
    if (typeof Intl === 'undefined' || typeof Intl.Collator === 'undefined') return null;
    this.#collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    return this.#collator;
  }

  #normalizeDigits(value: string): string {
    // Convert full-width digits and separators to ASCII equivalents.
    return value
      .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
      .replace(/[．。]/g, '.')
      .replace(/[／]/g, '/')
      .replace(/[－−]/g, '-')
      .replace(/[，]/g, ',');
  }

  #parseNumber(value: string): number | null {
    const normalized = this.#normalizeDigits(value).trim().replace(/[\s,_]/g, '');
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  }

  #parseDate(value: string): number | null {
    const normalized = this.#normalizeDigits(value).trim();
    const iso = normalized.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:\D|$)/);
    const jp = normalized.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);
    const match = iso ?? jp;
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    const time = Date.UTC(year, month - 1, day);
    return Number.isFinite(time) ? time : null;
  }

  #getCellValue(row: HTMLTableRowElement, columnIndex: number): string | null {
    const cell = row.querySelectorAll('th,td')[columnIndex];
    if (!(cell instanceof HTMLTableCellElement)) return null;
    const attr = cell.getAttribute('data-sort-value');
    const raw = (attr ?? cell.textContent ?? '').trim();
    return raw === '' ? null : raw;
  }

  #getTableBodies(table: HTMLTableElement): HTMLTableSectionElement[] {
    return Array.from(table.querySelectorAll<HTMLTableSectionElement>('tbody'));
  }

  #getTableRows(tbody: HTMLTableSectionElement): HTMLTableRowElement[] {
    return Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
  }

  #getHeaderCellIndex(cell: HTMLTableCellElement): number {
    // Some DOM environments don't implement HTMLTableCellElement#cellIndex.
    const raw = (cell as unknown as { cellIndex?: unknown }).cellIndex;
    if (typeof raw === 'number' && raw >= 0) return raw;

    const row = cell.parentElement;
    const siblings = row ? Array.from(row.children) : [];
    const fallback = siblings.indexOf(cell);
    return fallback < 0 ? 0 : fallback;
  }

  #getSortType(th: HTMLTableCellElement, columnIndex: number): SortValueType {
    const explicit = th.getAttribute('data-sort-type');
    if (explicit === 'string' || explicit === 'number' || explicit === 'date') return explicit;

    const table = this.#tableEl;
    if (!table) return 'string';

    const values: string[] = [];
    for (const tbody of this.#getTableBodies(table)) {
      for (const row of this.#getTableRows(tbody)) {
        const v = this.#getCellValue(row, columnIndex);
        if (v != null) values.push(v);
      }
    }

    if (values.length === 0) return 'string';

    if (values.every((v) => this.#parseNumber(v) != null)) return 'number';
    if (values.every((v) => this.#parseDate(v) != null)) return 'date';
    return 'string';
  }

  #restoreOriginalOrder(): void {
    const table = this.#tableEl;
    if (!table) return;

    for (const tbody of this.#getTableBodies(table)) {
      const rows = this.#getTableRows(tbody);
      this.#ensureOriginalIndexes(rows);

      const sorted = [...rows].sort((a, b) => this.#getOriginalIndex(a) - this.#getOriginalIndex(b));
      const isSame = rows.every((row, i) => row === sorted[i]);
      if (isSame) continue;
      for (const row of sorted) tbody.appendChild(row);
    }
  }

  #applyDomSort(th: HTMLTableCellElement, direction: SortDirection): void {
    if (!this.#isDomSortingEnabled()) return;
    const table = this.#tableEl;
    if (!table) return;

    const safeColumnIndex = this.#getHeaderCellIndex(th);

    if (direction === 'none') {
      this.#restoreOriginalOrder();
      return;
    }

    const sortType = this.#getSortType(th, safeColumnIndex);
    const collator = this.#getCollator();

    for (const tbody of this.#getTableBodies(table)) {
      const rows = this.#getTableRows(tbody);

      const items = rows.map((row) => {
        const raw = this.#getCellValue(row, safeColumnIndex);
        const originalIndex = this.#getOriginalIndex(row);
        return {
          row,
          raw,
          originalIndex,
          num: raw == null ? null : this.#parseNumber(raw),
          date: raw == null ? null : this.#parseDate(raw),
        };
      });

      const sorted = [...items].sort((a, b) => {
        if (a.raw == null && b.raw == null) return a.originalIndex - b.originalIndex;
        if (a.raw == null) return 1;
        if (b.raw == null) return -1;

        let cmp = 0;
        if (sortType === 'number') {
          const av = a.num;
          const bv = b.num;
          if (av == null && bv == null) cmp = 0;
          else if (av == null) cmp = 1;
          else if (bv == null) cmp = -1;
          else cmp = av - bv;
        } else if (sortType === 'date') {
          const av = a.date;
          const bv = b.date;
          if (av == null && bv == null) cmp = 0;
          else if (av == null) cmp = 1;
          else if (bv == null) cmp = -1;
          else cmp = av - bv;
        } else {
          const av = a.raw;
          const bv = b.raw;
          cmp = collator ? collator.compare(av, bv) : av.localeCompare(bv);
        }

        if (cmp === 0) cmp = a.originalIndex - b.originalIndex;
        return direction === 'descending' ? -cmp : cmp;
      });

      const sortedRows = sorted.map((i) => i.row);
      const isSame = rows.every((row, i) => row === sortedRows[i]);
      if (isSame) continue;

      for (const row of sortedRows) tbody.appendChild(row);
    }
  }

  #handleClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const sortControl = target.closest(SORT_CONTROL_SELECTOR);
    if (!sortControl || !this.contains(sortControl)) return;

    const th = sortControl.closest('th');
    if (!(th instanceof HTMLTableCellElement)) return;

    const current = th.getAttribute('aria-sort');
    const direction = nextSortDirection(current);

    // Clear other sort states in the same header row
    const row = th.parentElement;
    if (row) {
      const headers = row.querySelectorAll('th');
      for (const h of headers) {
        if (!(h instanceof HTMLTableCellElement)) continue;
        if (h === th) continue;
        h.removeAttribute('aria-sort');
        const control = h.querySelector(SORT_CONTROL_SELECTOR);
        if (control) updateSortIcon(control, 'none');
      }
    }

    if (direction === 'none') th.removeAttribute('aria-sort');
    else th.setAttribute('aria-sort', direction);

    updateSortIcon(sortControl, direction);
    this.#applyDomSort(th, direction);
    this.#emitSortChange(th, direction);
  };
}
