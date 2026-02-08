type PresetStatus = '要連絡' | '完了' | '進行中';
type PresetApplicationType = 'マイナンバーカード' | 'パスポート' | '住民票';

type PresetRow = Readonly<{
  id: string;
  applicantName: string;
  applicationNo: string;
  status: PresetStatus;
  applicationType: PresetApplicationType;
  applicationDate: string;
  keywords: readonly string[];
}>;

type PresetSnapshot = Readonly<{
  query: string;
  totalCount: number;
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  itemsPerPage: number;
  rows: readonly PresetRow[];
  selectedRowIds: readonly string[];
  selectedCount: number;
  bulkStatus: PresetStatus;
}>;

type SearchEventDetail = Readonly<{
  query: string;
  scope: string;
}>;

type PageSizeEventDetail = Readonly<{
  value: string;
  itemsPerPage: number;
}>;

type SelectionChangeDetail = Readonly<{
  selectedRowIds: readonly string[];
  selectedRowIndexes: readonly number[];
  selectedCount: number;
  totalSelectableRows: number;
}>;

type MenuItemSelectDetail = Readonly<{
  selectedItem: HTMLElement;
  selectedValue: string;
  selectedIndex: number;
}>;

type EditInput = Readonly<{
  applicantName: string;
  status: PresetStatus;
  applicationType: PresetApplicationType;
  applicationDate: string;
}>;

type SearchBoxElement = HTMLElement & {
  value?: string;
};

type DialogElement = HTMLElement & {
  show?: () => void;
  close?: () => void;
};

const PRESET_ALL_ROWS: readonly PresetRow[] = (() => {
  const firstPageRows: readonly PresetRow[] = [
    {
      id: 'APP-0001',
      applicantName: 'デジ田 太郎',
      applicationNo: '123456789012345',
      status: '要連絡',
      applicationType: 'マイナンバーカード',
      applicationDate: '2025年8月23日',
      keywords: ['マイナンバーカード'],
    },
    {
      id: 'APP-0002',
      applicantName: 'デジ濱 実',
      applicationNo: '123456789012345',
      status: '完了',
      applicationType: 'パスポート',
      applicationDate: '2025年8月23日',
      keywords: ['パスポート'],
    },
    {
      id: 'APP-0003',
      applicantName: 'デジ山 ひかり',
      applicationNo: '123456789012345',
      status: '進行中',
      applicationType: 'マイナンバーカード',
      applicationDate: '2025年9月12日',
      keywords: ['マイナンバーカード', 'パスポート'],
    },
    {
      id: 'APP-0004',
      applicantName: '出而足 長一郎',
      applicationNo: '123456789012345',
      status: '完了',
      applicationType: 'パスポート',
      applicationDate: '2025年9月12日',
      keywords: ['パスポート'],
    },
    {
      id: 'APP-0005',
      applicantName: '電磁 多留子',
      applicationNo: '123456789012345',
      status: '完了',
      applicationType: '住民票',
      applicationDate: '2025年8月23日',
      keywords: ['住民票'],
    },
    {
      id: 'APP-0006',
      applicantName: 'デジ田 太郎',
      applicationNo: '123456789012345',
      status: '完了',
      applicationType: 'マイナンバーカード',
      applicationDate: '2025年8月23日',
      keywords: ['マイナンバーカード'],
    },
    {
      id: 'APP-0007',
      applicantName: 'デジ濱 実',
      applicationNo: '123456789012345',
      status: '要連絡',
      applicationType: 'パスポート',
      applicationDate: '2025年8月23日',
      keywords: ['パスポート'],
    },
    {
      id: 'APP-0008',
      applicantName: 'デジ山 ひかり',
      applicationNo: '123456789012345',
      status: '進行中',
      applicationType: 'マイナンバーカード',
      applicationDate: '2025年8月23日',
      keywords: ['マイナンバーカード'],
    },
    {
      id: 'APP-0009',
      applicantName: '出而足 長一郎',
      applicationNo: '123456789012345',
      status: '要連絡',
      applicationType: 'パスポート',
      applicationDate: '2025年8月23日',
      keywords: ['パスポート'],
    },
    {
      id: 'APP-0010',
      applicantName: '電磁 多留子',
      applicationNo: '123456789012345',
      status: '完了',
      applicationType: '住民票',
      applicationDate: '2025年9月12日',
      keywords: ['住民票'],
    },
  ];

  const names = ['山田 太郎', '佐藤 花子', '鈴木 一郎', '高橋 未来', '伊藤 蓮'] as const;
  const statuses: readonly PresetStatus[] = ['完了', '進行中', '要連絡'];
  const applicationTypes: readonly PresetApplicationType[] = [
    'マイナンバーカード',
    'パスポート',
    '住民票',
  ];

  const generated = Array.from({ length: 110 }, (_, index): PresetRow => {
    const number = index + 11;
    const month = ((number - 1) % 12) + 1;
    const day = ((number - 1) % 28) + 1;
    const applicationType = applicationTypes[number % applicationTypes.length];

    return {
      id: `APP-${String(number).padStart(4, '0')}`,
      applicantName: names[number % names.length],
      applicationNo: String(223456789012300 + number),
      status: statuses[number % statuses.length],
      applicationType,
      applicationDate: `2025年${month}月${day}日`,
      keywords: [applicationType],
    };
  });

  return [...firstPageRows, ...generated];
})();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('ja-JP');
}

function isNativeClickEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

function findEventTargetByAttr(event: Event, attribute: string): HTMLElement | null {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
  for (const node of path) {
    if (node instanceof HTMLElement && node.hasAttribute(attribute)) {
      return node;
    }
  }
  return null;
}

function writeElementValue(el: HTMLElement | null, value: string): void {
  if (!el) return;

  const target = el as unknown as { value?: unknown };
  if (typeof target.value === 'string' || target.value === undefined) {
    target.value = value;
  }

  el.setAttribute('value', value);
}

function readElementValue(el: HTMLElement | null): string {
  if (!el) return '';

  const value = (el as { value?: unknown }).value;
  if (typeof value === 'string') return value;

  return el.getAttribute('value') ?? '';
}

function isPresetStatus(value: string): value is PresetStatus {
  return value === '要連絡' || value === '完了' || value === '進行中';
}

function isApplicationType(value: string): value is PresetApplicationType {
  return value === 'マイナンバーカード' || value === 'パスポート' || value === '住民票';
}

function resolveStatusColor(status: PresetStatus): 'red' | 'green' | 'blue' {
  if (status === '要連絡') return 'red';
  if (status === '進行中') return 'blue';
  return 'green';
}

function isJapaneseDateString(value: string): boolean {
  return /^\d{4}年\d{1,2}月\d{1,2}日$/.test(value.trim());
}

class PresetTableModel {
  #rows: PresetRow[] = [...PRESET_ALL_ROWS];
  #query = '';
  #itemsPerPage = 10;
  #page = 1;
  #selectedRowIds: string[] = [];
  #bulkStatus: PresetStatus = '進行中';

  setQuery(query: string): void {
    this.#query = query.trim();
    this.#page = 1;
    this.#selectedRowIds = [];
  }

  resetQuery(): void {
    this.#query = '';
    this.#page = 1;
    this.#selectedRowIds = [];
  }

  applyPreset(keyword: string): void {
    this.#query = keyword.trim();
    this.#page = 1;
    this.#selectedRowIds = [];
  }

  setItemsPerPage(itemsPerPage: number): void {
    if (!Number.isFinite(itemsPerPage) || itemsPerPage <= 0) return;

    this.#itemsPerPage = itemsPerPage;
    this.#page = 1;
    this.#selectedRowIds = [];
  }

  nextPage(): void {
    if (!this.hasNext) return;
    this.#page += 1;
    this.#selectedRowIds = [];
  }

  prevPage(): void {
    if (!this.hasPrev) return;
    this.#page -= 1;
    this.#selectedRowIds = [];
  }

  setSelection(rowIds: readonly string[]): void {
    const onPageIds = new Set(this.pagedRows.map((row) => row.id));
    this.#selectedRowIds = rowIds.filter((id) => onPageIds.has(id));
  }

  setBulkStatus(status: string): void {
    if (!isPresetStatus(status)) return;
    this.#bulkStatus = status;
  }

  applyBulkStatus(): void {
    if (this.#selectedRowIds.length === 0) return;
    const selected = new Set(this.#selectedRowIds);

    this.#rows = this.#rows.map((row) => {
      if (!selected.has(row.id)) return row;
      return {
        ...row,
        status: this.#bulkStatus,
      };
    });
  }

  deleteRowsById(rowIds: readonly string[]): void {
    if (rowIds.length === 0) return;
    const selected = new Set(rowIds);
    this.#rows = this.#rows.filter((row) => !selected.has(row.id));
    this.#selectedRowIds = this.#selectedRowIds.filter((id) => !selected.has(id));
    if (this.#page > this.pageCount) {
      this.#page = this.pageCount;
    }
  }

  deleteSelected(): void {
    if (this.#selectedRowIds.length === 0) return;
    this.deleteRowsById(this.#selectedRowIds);
  }

  findRowById(targetId: string): PresetRow | null {
    return this.#rows.find((row) => row.id === targetId) ?? null;
  }

  saveEditById(targetId: string, input: EditInput): void {
    this.#rows = this.#rows.map((row) => {
      if (row.id !== targetId) return row;

      return {
        ...row,
        applicantName: input.applicantName.trim(),
        status: input.status,
        applicationType: input.applicationType,
        applicationDate: input.applicationDate.trim(),
      };
    });
  }

  get #filteredRows(): readonly PresetRow[] {
    const query = normalizeText(this.#query);
    if (query === '') return this.#rows;

    return this.#rows.filter((row) => {
      const haystack = normalizeText([
        row.applicantName,
        row.applicationNo,
        row.status,
        row.applicationType,
        row.applicationDate,
        ...row.keywords,
      ].join(' '));
      return haystack.includes(query);
    });
  }

  get totalCount(): number {
    return this.#filteredRows.length;
  }

  get pageCount(): number {
    if (this.totalCount === 0) return 1;
    return Math.max(1, Math.ceil(this.totalCount / this.#itemsPerPage));
  }

  get hasPrev(): boolean {
    return this.#page > 1;
  }

  get hasNext(): boolean {
    return this.#page < this.pageCount;
  }

  get pagedRows(): readonly PresetRow[] {
    const start = (this.#page - 1) * this.#itemsPerPage;
    return this.#filteredRows.slice(start, start + this.#itemsPerPage);
  }

  get snapshot(): PresetSnapshot {
    return {
      query: this.#query,
      totalCount: this.totalCount,
      page: this.#page,
      pageCount: this.pageCount,
      hasPrev: this.hasPrev,
      hasNext: this.hasNext,
      itemsPerPage: this.#itemsPerPage,
      rows: this.pagedRows,
      selectedRowIds: [...this.#selectedRowIds],
      selectedCount: this.#selectedRowIds.length,
      bulkStatus: this.#bulkStatus,
    };
  }
}

class PresetTableView {
  #searchBox: SearchBoxElement | null;
  #count: HTMLElement | null;
  #resetButton: HTMLButtonElement | null;
  #presets: HTMLElement | null;
  #table: HTMLElement | null;
  #tbody: HTMLElement | null;
  #footer: HTMLElement | null;
  #pagination: HTMLElement | null;
  #bulkBar: HTMLElement | null;
  #bulkStatus: HTMLElement | null;
  #bulkStatusSelect: HTMLElement | null;
  #bulkApply: HTMLButtonElement | null;
  #bulkDelete: HTMLButtonElement | null;
  #editDialog: DialogElement | null;
  #editName: HTMLElement | null;
  #editStatus: HTMLElement | null;
  #editType: HTMLElement | null;
  #editDate: HTMLElement | null;
  #editSave: HTMLButtonElement | null;
  #editCancel: HTMLButtonElement | null;
  #deleteDialog: DialogElement | null;
  #deleteConfirm: HTMLButtonElement | null;
  #deleteCancel: HTMLButtonElement | null;

  constructor(root: HTMLElement) {
    this.#searchBox = root.querySelector<SearchBoxElement>('#demo-preset-search');
    this.#count = root.querySelector<HTMLElement>('#demo-preset-count');
    this.#resetButton = root.querySelector<HTMLButtonElement>('#demo-preset-reset');
    this.#presets = root.querySelector<HTMLElement>('#demo-preset-presets');
    this.#table = root.querySelector<HTMLElement>('#demo-preset-table');
    this.#tbody = root.querySelector<HTMLElement>('#demo-preset-tbody');
    this.#footer = root.querySelector<HTMLElement>('#demo-preset-footer');
    this.#pagination = root.querySelector<HTMLElement>('#demo-preset-pagination');
    this.#bulkBar = root.querySelector<HTMLElement>('#demo-preset-bulk-bar');
    this.#bulkStatus = root.querySelector<HTMLElement>('#demo-preset-bulk-status');
    this.#bulkStatusSelect = root.querySelector<HTMLElement>('#demo-preset-bulk-status-select');
    this.#bulkApply = root.querySelector<HTMLButtonElement>('#demo-preset-bulk-apply');
    this.#bulkDelete = root.querySelector<HTMLButtonElement>('#demo-preset-bulk-delete');
    this.#editDialog = root.querySelector<DialogElement>('#demo-preset-edit-dialog');
    this.#editName = root.querySelector<HTMLElement>('#demo-preset-edit-name');
    this.#editStatus = root.querySelector<HTMLElement>('#demo-preset-edit-status');
    this.#editType = root.querySelector<HTMLElement>('#demo-preset-edit-type');
    this.#editDate = root.querySelector<HTMLElement>('#demo-preset-edit-date');
    this.#editSave = root.querySelector<HTMLButtonElement>('#demo-preset-edit-save');
    this.#editCancel = root.querySelector<HTMLButtonElement>('#demo-preset-edit-cancel');
    this.#deleteDialog = root.querySelector<DialogElement>('#demo-preset-delete-dialog');
    this.#deleteConfirm = root.querySelector<HTMLButtonElement>('#demo-preset-delete-confirm');
    this.#deleteCancel = root.querySelector<HTMLButtonElement>('#demo-preset-delete-cancel');
  }

  bind(controller: PresetTableController): void {
    this.#searchBox?.addEventListener('dads-search', (event: Event) => {
      const detail = (event as CustomEvent<SearchEventDetail>).detail;
      controller.handleSearch(detail.query);
    });

    this.#resetButton?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleReset();
    });

    this.#presets?.addEventListener('dads-chip-tag-click', (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const chip = target.closest<HTMLElement>('dads-chip-tag[data-query]');
      const query = chip?.dataset.query;
      if (!query) return;
      controller.handlePreset(query);
    });

    this.#table?.addEventListener('dads-selection-change', (event: Event) => {
      const detail = (event as CustomEvent<SelectionChangeDetail>).detail;
      controller.handleSelectionChange(detail.selectedRowIds);
    });

    this.#footer?.addEventListener('dads-table-control-page-size-change', (event: Event) => {
      const detail = (event as CustomEvent<PageSizeEventDetail>).detail;
      controller.handleItemsPerPage(detail.itemsPerPage);
    });

    this.#pagination?.addEventListener('prev', () => {
      controller.handlePrev();
    });

    this.#pagination?.addEventListener('next', () => {
      controller.handleNext();
    });

    const onBulkStatusChange = () => {
      controller.handleBulkStatusChange(readElementValue(this.#bulkStatusSelect));
    };
    this.#bulkStatusSelect?.addEventListener('dads-change', onBulkStatusChange);
    this.#bulkStatusSelect?.addEventListener('change', onBulkStatusChange);

    this.#bulkApply?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleBulkApply();
    });

    this.#bulkDelete?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleBulkDeleteOpen();
    });

    this.#tbody?.addEventListener('menuitemselect', (event: Event) => {
      const menu = findEventTargetByAttr(event, 'data-row-actions');
      const rowId = menu?.getAttribute('data-row-actions') ?? '';
      if (rowId === '') return;

      const detail = (event as CustomEvent<MenuItemSelectDetail>).detail;
      controller.handleRowMenuAction(rowId, detail.selectedValue);
    });

    this.#editCancel?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleEditCancel();
    });

    this.#editSave?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleEditSave();
    });

    this.#editName?.addEventListener('dads-input', () => {
      controller.handleEditInputChange();
    });
    this.#editDate?.addEventListener('dads-input', () => {
      controller.handleEditInputChange();
    });

    this.#deleteCancel?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleBulkDeleteCancel();
    });

    this.#deleteConfirm?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleBulkDeleteConfirm();
    });
  }

  render(snapshot: PresetSnapshot): void {
    writeElementValue(this.#searchBox, snapshot.query);

    if (this.#count) {
      this.#count.textContent = `${snapshot.totalCount.toLocaleString('ja-JP')} 件`;
    }

    const showReset = snapshot.query.trim() !== '';
    if (this.#resetButton) {
      this.#resetButton.setAttribute('data-visible', showReset ? 'true' : 'false');
      this.#resetButton.setAttribute('aria-hidden', showReset ? 'false' : 'true');
      this.#resetButton.tabIndex = showReset ? 0 : -1;
    }

    this.#footer?.setAttribute('items-per-page', String(snapshot.itemsPerPage));

    if (this.#pagination) {
      this.#pagination.toggleAttribute('hidden', snapshot.totalCount === 0);
      this.#pagination.setAttribute('current', String(snapshot.page));
      this.#pagination.setAttribute('total', String(snapshot.pageCount));
      this.#pagination.toggleAttribute('disabled-prev', !snapshot.hasPrev);
      this.#pagination.toggleAttribute('disabled-next', !snapshot.hasNext);
    }

    if (this.#bulkBar) {
      const hasSelection = snapshot.selectedCount > 0;
      this.#bulkBar.hidden = !hasSelection;
      this.#bulkBar.setAttribute('aria-hidden', hasSelection ? 'false' : 'true');
    }

    if (this.#bulkStatus) {
      this.#bulkStatus.textContent = `${snapshot.selectedCount}件選択中`;
    }

    writeElementValue(this.#bulkStatusSelect, snapshot.bulkStatus);

    this.#renderRows(snapshot.rows, snapshot.selectedRowIds);
  }

  openEditDialog(row: PresetRow): void {
    writeElementValue(this.#editName, row.applicantName);
    writeElementValue(this.#editStatus, row.status);
    writeElementValue(this.#editType, row.applicationType);
    writeElementValue(this.#editDate, row.applicationDate);
    this.setEditErrors(false, false);

    if (typeof this.#editDialog?.show === 'function') {
      this.#editDialog.show();
    } else {
      this.#editDialog?.setAttribute('open', '');
    }
  }

  closeEditDialog(): void {
    if (typeof this.#editDialog?.close === 'function') {
      this.#editDialog.close();
    } else {
      this.#editDialog?.removeAttribute('open');
    }
  }

  readEditInput(): EditInput {
    const statusRaw = readElementValue(this.#editStatus);
    const typeRaw = readElementValue(this.#editType);

    return {
      applicantName: readElementValue(this.#editName),
      status: isPresetStatus(statusRaw) ? statusRaw : '完了',
      applicationType: isApplicationType(typeRaw) ? typeRaw : 'マイナンバーカード',
      applicationDate: readElementValue(this.#editDate),
    };
  }

  setEditErrors(hasNameError: boolean, hasDateError: boolean, focusInvalidField = false): void {
    this.#setFieldError(this.#editName, hasNameError);
    this.#setFieldError(this.#editDate, hasDateError);

    if (!focusInvalidField) return;

    if (hasNameError) {
      this.#editName?.focus();
      return;
    }

    if (hasDateError) {
      this.#editDate?.focus();
    }
  }

  openDeleteDialog(): void {
    if (typeof this.#deleteDialog?.show === 'function') {
      this.#deleteDialog.show();
    } else {
      this.#deleteDialog?.setAttribute('open', '');
    }
  }

  closeDeleteDialog(): void {
    if (typeof this.#deleteDialog?.close === 'function') {
      this.#deleteDialog.close();
    } else {
      this.#deleteDialog?.removeAttribute('open');
    }
  }

  #setFieldError(field: HTMLElement | null, hasError: boolean): void {
    if (!field) return;
    if (hasError) {
      field.setAttribute('error', '');
      return;
    }
    field.removeAttribute('error');
  }

  #renderRows(rows: readonly PresetRow[], selectedRowIds: readonly string[]): void {
    if (!this.#tbody) return;

    if (rows.length === 0) {
      this.#tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-control-preset-demo__empty-cell">該当する項目がありません</td>
        </tr>
      `;
      return;
    }

    const selected = new Set(selectedRowIds);

    const html = rows.map((row) => `
      <tr data-row-id="${escapeHtml(row.id)}">
        <td>
          <label class="dads-checkbox" data-size="sm">
            <span class="dads-checkbox__checkbox">
              <input
                class="dads-checkbox__input"
                type="checkbox"
                data-select-row
                aria-label="行を選択: ${escapeHtml(row.applicantName)}"
                ${selected.has(row.id) ? 'checked' : ''}
              />
            </span>
          </label>
        </td>
        <td>${escapeHtml(row.applicantName)}</td>
        <td>${escapeHtml(row.applicationNo)}</td>
        <td>
          <dads-chip-label
            variant="fill"
            color="${resolveStatusColor(row.status)}"
            class="table-control-preset-demo__status-chip"
          >${escapeHtml(row.status)}</dads-chip-label>
        </td>
        <td>${escapeHtml(row.applicationType)}</td>
        <td>${escapeHtml(row.applicationDate)}</td>
        <td data-actions-col>
          <dads-menu-list-box
            class="table-control-preset-demo__row-menu"
            variant="text"
            size="sm"
            label="行操作"
            data-row-actions="${escapeHtml(row.id)}"
          >
            <svg
              slot="icon"
              class="table-control-preset-demo__menu-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="4.5" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="12" cy="19.5" r="2"></circle>
            </svg>
            <dads-menu-list-item value="edit">編集</dads-menu-list-item>
            <dads-menu-list-item value="delete">削除</dads-menu-list-item>
          </dads-menu-list-box>
        </td>
      </tr>
    `).join('');

    this.#tbody.innerHTML = html;
  }
}

class PresetTableController {
  #model: PresetTableModel;
  #view: PresetTableView;
  #editingRowId: string | null = null;
  #pendingDeleteRowIds: string[] = [];

  constructor(model: PresetTableModel, view: PresetTableView) {
    this.#model = model;
    this.#view = view;
  }

  mount(): void {
    this.#view.bind(this);
    this.#render();
  }

  handleSearch(query: string): void {
    this.#model.setQuery(query);
    this.#render();
  }

  handleReset(): void {
    this.#model.resetQuery();
    this.#render();
  }

  handlePreset(keyword: string): void {
    this.#model.applyPreset(keyword);
    this.#render();
  }

  handleItemsPerPage(itemsPerPage: number): void {
    this.#model.setItemsPerPage(itemsPerPage);
    this.#render();
  }

  handleNext(): void {
    this.#model.nextPage();
    this.#render();
  }

  handlePrev(): void {
    this.#model.prevPage();
    this.#render();
  }

  handleSelectionChange(rowIds: readonly string[]): void {
    this.#model.setSelection(rowIds);
    this.#render();
  }

  handleBulkStatusChange(status: string): void {
    this.#model.setBulkStatus(status);
    this.#render();
  }

  handleBulkApply(): void {
    this.#model.applyBulkStatus();
    this.#render();
  }

  handleBulkDeleteOpen(): void {
    const selectedRowIds = this.#model.snapshot.selectedRowIds;
    if (selectedRowIds.length === 0) return;
    this.#pendingDeleteRowIds = [...selectedRowIds];
    this.#view.openDeleteDialog();
  }

  handleBulkDeleteCancel(): void {
    this.#pendingDeleteRowIds = [];
    this.#view.closeDeleteDialog();
  }

  handleBulkDeleteConfirm(): void {
    if (this.#pendingDeleteRowIds.length > 0) {
      this.#model.deleteRowsById(this.#pendingDeleteRowIds);
    } else {
      this.#model.deleteSelected();
    }
    this.#pendingDeleteRowIds = [];
    this.#view.closeDeleteDialog();
    this.#render();
  }

  handleRowMenuAction(rowId: string, action: string): void {
    if (action === 'edit') {
      this.handleRowEditOpen(rowId);
      return;
    }

    if (action === 'delete') {
      this.#pendingDeleteRowIds = [rowId];
      this.#view.openDeleteDialog();
    }
  }

  handleRowEditOpen(rowId: string): void {
    const target = this.#model.findRowById(rowId);
    if (!target) return;
    this.#editingRowId = rowId;
    this.#view.openEditDialog(target);
  }

  handleEditCancel(): void {
    this.#editingRowId = null;
    this.#view.closeEditDialog();
  }

  handleEditInputChange(): void {
    const input = this.#view.readEditInput();
    const hasNameError = input.applicantName.trim() === '';
    const hasDateError = input.applicationDate.trim() === '';
    this.#view.setEditErrors(hasNameError, hasDateError);
  }

  handleEditSave(): void {
    if (!this.#editingRowId) return;

    const input = this.#view.readEditInput();
    const hasNameError = input.applicantName.trim() === '';
    const hasDateError = input.applicationDate.trim() === '' || !isJapaneseDateString(input.applicationDate);
    this.#view.setEditErrors(hasNameError, hasDateError, true);
    if (hasNameError || hasDateError) return;

    this.#model.saveEditById(this.#editingRowId, input);
    this.#editingRowId = null;
    this.#view.closeEditDialog();
    this.#render();
  }

  #render(): void {
    this.#view.render(this.#model.snapshot);
  }
}

export function mountTableControlPresetDemo(root: ParentNode): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.tableControlPresetMounted === 'true') return;
  root.dataset.tableControlPresetMounted = 'true';

  const model = new PresetTableModel();
  const view = new PresetTableView(root);
  const controller = new PresetTableController(model, view);
  controller.mount();
}
