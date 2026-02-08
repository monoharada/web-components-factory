type TableControlScenario = 'before-search' | 'after-search' | 'empty-result' | 'preset-visible';

type TableControlRow = {
  id: string;
  title: string;
  department: string;
  category: string;
  updatedAt: string;
  status: string;
};

type TableControlSnapshot = Readonly<{
  scenario: TableControlScenario;
  query: string;
  resultCount: number;
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  itemsPerPage: number;
  rows: readonly TableControlRow[];
  presetsVisible: boolean;
}>;

type SearchEventDetail = Readonly<{
  query: string;
  scope: string;
}>;

type PageSizeEventDetail = Readonly<{
  value: string;
  itemsPerPage: number;
}>;

type CreateRowInput = Readonly<{
  title: string;
  department: string;
  category: string;
  status: string;
}>;

type SearchBoxElement = HTMLElement & {
  value?: string;
};

type DialogElement = HTMLElement & {
  show?: () => void;
  close?: () => void;
};

const DEPARTMENTS = ['デジタル推進課', '地域連携課', '統計管理課', '総務課'] as const;
const CATEGORIES = ['申請', '審査', '交付', '公開'] as const;
const STATUSES = ['受付中', '確認中', '審査完了', '公開中'] as const;

const TABLE_ROWS: readonly TableControlRow[] = Array.from({ length: 28 }, (_, index) => {
  const no = index + 1;
  const day = String((index % 28) + 1).padStart(2, '0');
  const title = no % 3 === 0
    ? `補助金申請 ${no}`
    : no % 3 === 1
      ? `住民手続き ${no}`
      : `調達案件 ${no}`;

  return {
    id: `REQ-${String(no).padStart(4, '0')}`,
    title,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    category: CATEGORIES[index % CATEGORIES.length],
    updatedAt: `2026-01-${day}`,
    status: STATUSES[index % STATUSES.length],
  };
});

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('ja-JP');
}

function isTableControlScenario(value: string | null): value is TableControlScenario {
  return (
    value === 'before-search'
    || value === 'after-search'
    || value === 'empty-result'
    || value === 'preset-visible'
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readElementValue(el: HTMLElement | null): string {
  if (!el) return '';

  const value = (el as { value?: unknown }).value;
  if (typeof value === 'string') return value;

  return el.getAttribute('value') ?? '';
}

function writeElementValue(el: HTMLElement | null, value: string): void {
  if (!el) return;

  const target = el as unknown as { value?: unknown };
  if (typeof target.value === 'string' || target.value === undefined) {
    target.value = value;
  }

  el.setAttribute('value', value);
}

function isNativeClickEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

class TableControlModel {
  #allRows: TableControlRow[];
  #filteredRows: TableControlRow[];
  #scenario: TableControlScenario = 'before-search';
  #query = '';
  #itemsPerPage = 10;
  #page = 1;
  #presetsVisible = false;

  constructor(rows: readonly TableControlRow[]) {
    this.#allRows = [...rows];
    this.#filteredRows = [...rows];
  }

  applyScenario(scenario: TableControlScenario): void {
    this.#scenario = scenario;
    this.#itemsPerPage = 10;
    this.#page = 1;

    switch (scenario) {
      case 'before-search':
        this.#query = '';
        this.#presetsVisible = false;
        break;
      case 'after-search':
        this.#query = '申請';
        this.#presetsVisible = false;
        break;
      case 'empty-result':
        this.#query = '該当なしキーワード';
        this.#presetsVisible = false;
        break;
      case 'preset-visible':
        this.#query = '';
        this.#presetsVisible = true;
        break;
      default:
        this.#query = '';
        this.#presetsVisible = false;
    }

    this.#recompute();
  }

  setQuery(query: string): void {
    this.#query = query;
    this.#page = 1;
    this.#presetsVisible = false;
    this.#recompute();
  }

  resetQuery(): void {
    this.#query = '';
    this.#page = 1;
    this.#presetsVisible = false;
    this.#recompute();
  }

  setItemsPerPage(itemsPerPage: number): void {
    if (!Number.isFinite(itemsPerPage) || itemsPerPage <= 0) return;
    this.#itemsPerPage = itemsPerPage;
    this.#page = 1;
    this.#recompute();
  }

  goPrev(): void {
    if (this.#page <= 1) return;
    this.#page -= 1;
  }

  goNext(): void {
    if (this.#page >= this.pageCount) return;
    this.#page += 1;
  }

  applyPreset(query: string): void {
    this.#query = query;
    this.#page = 1;
    this.#presetsVisible = false;
    this.#recompute();
  }

  addRow(input: CreateRowInput): void {
    const title = input.title.trim();
    if (title === '') return;

    const row: TableControlRow = {
      id: this.#createNextId(),
      title,
      department: input.department,
      category: input.category,
      status: input.status,
      updatedAt: formatDate(new Date()),
    };

    this.#allRows = [row, ...this.#allRows];

    // 追加後はフィルターを解除して先頭ページに戻す。
    this.#scenario = 'before-search';
    this.#query = '';
    this.#page = 1;
    this.#presetsVisible = false;
    this.#recompute();
  }

  #createNextId(): string {
    let max = 0;

    for (const row of this.#allRows) {
      const matched = /^REQ-(\d+)$/.exec(row.id);
      if (!matched) continue;

      const parsed = Number.parseInt(matched[1], 10);
      if (Number.isFinite(parsed) && parsed > max) {
        max = parsed;
      }
    }

    return `REQ-${String(max + 1).padStart(4, '0')}`;
  }

  #recompute(): void {
    const query = normalizeText(this.#query);
    if (query === '') {
      this.#filteredRows = [...this.#allRows];
    } else {
      this.#filteredRows = this.#allRows.filter((row) => {
        const haystack = normalizeText([
          row.id,
          row.title,
          row.department,
          row.category,
          row.updatedAt,
          row.status,
        ].join(' '));
        return haystack.includes(query);
      });
    }

    if (this.#page > this.pageCount) {
      this.#page = this.pageCount;
    }
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.#filteredRows.length / this.#itemsPerPage));
  }

  get pagedRows(): readonly TableControlRow[] {
    const start = (this.#page - 1) * this.#itemsPerPage;
    return this.#filteredRows.slice(start, start + this.#itemsPerPage);
  }

  get snapshot(): TableControlSnapshot {
    return {
      scenario: this.#scenario,
      query: this.#query,
      resultCount: this.#filteredRows.length,
      page: this.#page,
      pageCount: this.pageCount,
      hasPrev: this.#page > 1,
      hasNext: this.#page < this.pageCount,
      itemsPerPage: this.#itemsPerPage,
      rows: this.pagedRows,
      presetsVisible: this.#presetsVisible,
    };
  }
}

class TableControlView {
  #root: HTMLElement;
  #header: HTMLElement;
  #footer: HTMLElement;
  #pagination: HTMLElement;
  #presets: HTMLElement;
  #tbody: HTMLElement;
  #emptyMessage: HTMLElement;
  #summary: HTMLElement;
  #scenarioButtons: readonly HTMLButtonElement[];
  #openCreateButton: HTMLButtonElement | null;
  #createDialog: DialogElement | null;
  #createTitle: HTMLElement | null;
  #createDepartment: HTMLElement | null;
  #createCategory: HTMLElement | null;
  #createStatus: HTMLElement | null;
  #createSaveButton: HTMLButtonElement | null;
  #createCancelButton: HTMLButtonElement | null;

  constructor(root: HTMLElement) {
    this.#root = root;
    this.#header = root.querySelector<HTMLElement>('#demo-table-control-header') as HTMLElement;
    this.#footer = root.querySelector<HTMLElement>('#demo-table-control-footer') as HTMLElement;
    this.#pagination = root.querySelector<HTMLElement>('#demo-table-control-pagination') as HTMLElement;
    this.#presets = root.querySelector<HTMLElement>('#demo-table-control-presets') as HTMLElement;
    this.#tbody = root.querySelector<HTMLElement>('#demo-table-control-body') as HTMLElement;
    this.#emptyMessage = root.querySelector<HTMLElement>('#demo-table-control-empty') as HTMLElement;
    this.#summary = root.querySelector<HTMLElement>('#demo-table-control-summary') as HTMLElement;
    const scenarioScope = root.closest('section') ?? root;
    this.#scenarioButtons = Array.from(
      scenarioScope.querySelectorAll<HTMLButtonElement>('[data-table-control-scenario]'),
    );
    this.#openCreateButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-open');
    this.#createDialog = root.querySelector<DialogElement>('#demo-table-control-create-dialog');
    this.#createTitle = root.querySelector<HTMLElement>('#demo-table-control-create-title');
    this.#createDepartment = root.querySelector<HTMLElement>('#demo-table-control-create-department');
    this.#createCategory = root.querySelector<HTMLElement>('#demo-table-control-create-category');
    this.#createStatus = root.querySelector<HTMLElement>('#demo-table-control-create-status');
    this.#createSaveButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-save');
    this.#createCancelButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-cancel');
  }

  bind(controller: TableControlController): void {
    this.#header.addEventListener('dads-table-control-search', (event: Event) => {
      const detail = (event as CustomEvent<SearchEventDetail>).detail;
      controller.handleSearch(detail.query);
    });

    this.#header.addEventListener('dads-table-control-reset', () => {
      controller.handleReset();
    });

    this.#footer.addEventListener('dads-table-control-page-size-change', (event: Event) => {
      const detail = (event as CustomEvent<PageSizeEventDetail>).detail;
      controller.handlePageSizeChange(detail.itemsPerPage);
    });

    this.#pagination.addEventListener('prev', () => {
      controller.handlePrev();
    });

    this.#pagination.addEventListener('next', () => {
      controller.handleNext();
    });

    this.#presets.addEventListener('dads-chip-tag-click', (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const chip = target.closest('dads-chip-tag[data-query]');
      if (!(chip instanceof HTMLElement)) return;
      const query = chip.dataset.query;
      if (!query) return;
      controller.handlePreset(query);
    });

    for (const button of this.#scenarioButtons) {
      button.addEventListener('click', (event: Event) => {
        if (!isNativeClickEvent(event)) return;
        const scenario = button.getAttribute('data-table-control-scenario');
        if (!isTableControlScenario(scenario)) return;
        controller.handleScenario(scenario);
      });
    }

    this.#openCreateButton?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleCreateOpen();
    });

    this.#createCancelButton?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleCreateCancel();
    });

    this.#createSaveButton?.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleCreateSave();
    });

    this.#createTitle?.addEventListener('dads-input', () => {
      controller.handleCreateTitleInput();
    });
  }

  render(snapshot: TableControlSnapshot): void {
    this.#header.setAttribute('query', snapshot.query);
    this.#header.setAttribute('result-count', String(snapshot.resultCount));
    this.#header.toggleAttribute('show-reset', snapshot.query.trim() !== '');

    this.#presets.hidden = !snapshot.presetsVisible;

    this.#footer.setAttribute('items-per-page', String(snapshot.itemsPerPage));

    this.#pagination.setAttribute('current', String(snapshot.page));
    this.#pagination.setAttribute('total', String(snapshot.pageCount));
    this.#pagination.toggleAttribute('disabled-prev', !snapshot.hasPrev);
    this.#pagination.toggleAttribute('disabled-next', !snapshot.hasNext);

    const countText = `${snapshot.resultCount.toLocaleString('ja-JP')} 件`;
    this.#summary.textContent = snapshot.resultCount > 0
      ? `検索結果: ${countText}`
      : '検索結果: 0 件';

    this.#renderRows(snapshot.rows);
    this.#emptyMessage.hidden = snapshot.resultCount !== 0;

    for (const button of this.#scenarioButtons) {
      const scenario = button.getAttribute('data-table-control-scenario');
      const isActive = scenario === snapshot.scenario;
      button.setAttribute('variant', isActive ? 'solid' : 'outlined');
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  openCreateDialog(): void {
    this.#resetCreateForm();
    if (typeof this.#createDialog?.show === 'function') {
      this.#createDialog.show();
    } else {
      this.#createDialog?.setAttribute('open', '');
    }
  }

  closeCreateDialog(): void {
    if (typeof this.#createDialog?.close === 'function') {
      this.#createDialog.close();
    } else {
      this.#createDialog?.removeAttribute('open');
    }
  }

  readCreateInput(): CreateRowInput {
    return {
      title: readElementValue(this.#createTitle),
      department: readElementValue(this.#createDepartment) || DEPARTMENTS[0],
      category: readElementValue(this.#createCategory) || CATEGORIES[0],
      status: readElementValue(this.#createStatus) || STATUSES[0],
    };
  }

  setCreateTitleError(hasError: boolean): void {
    if (!this.#createTitle) return;

    if (hasError) {
      this.#createTitle.setAttribute('error', '');
      if (typeof this.#createTitle.focus === 'function') {
        this.#createTitle.focus();
      }
      return;
    }

    this.#createTitle.removeAttribute('error');
  }

  #resetCreateForm(): void {
    writeElementValue(this.#createTitle, '');
    writeElementValue(this.#createDepartment, DEPARTMENTS[0]);
    writeElementValue(this.#createCategory, CATEGORIES[0]);
    writeElementValue(this.#createStatus, STATUSES[0]);
    this.setCreateTitleError(false);
  }

  #renderRows(rows: readonly TableControlRow[]): void {
    if (rows.length === 0) {
      this.#tbody.innerHTML = '';
      return;
    }

    const html = rows
      .map((row) => `
        <tr>
          <td>${escapeHtml(row.id)}</td>
          <td>${escapeHtml(row.title)}</td>
          <td>${escapeHtml(row.department)}</td>
          <td>${escapeHtml(row.category)}</td>
          <td>${escapeHtml(row.updatedAt)}</td>
          <td>${escapeHtml(row.status)}</td>
        </tr>
      `)
      .join('');

    this.#tbody.innerHTML = html;
  }
}

class TableControlController {
  #model: TableControlModel;
  #view: TableControlView;

  constructor(model: TableControlModel, view: TableControlView) {
    this.#model = model;
    this.#view = view;
  }

  mount(): void {
    this.#view.bind(this);
    this.#model.applyScenario('before-search');
    this.#render();
  }

  handleScenario(scenario: TableControlScenario): void {
    this.#model.applyScenario(scenario);
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

  handlePageSizeChange(itemsPerPage: number): void {
    this.#model.setItemsPerPage(itemsPerPage);
    this.#render();
  }

  handlePrev(): void {
    this.#model.goPrev();
    this.#render();
  }

  handleNext(): void {
    this.#model.goNext();
    this.#render();
  }

  handlePreset(query: string): void {
    this.#model.applyPreset(query);
    this.#render();
  }

  handleCreateOpen(): void {
    this.#view.openCreateDialog();
  }

  handleCreateCancel(): void {
    this.#view.closeCreateDialog();
  }

  handleCreateTitleInput(): void {
    const { title } = this.#view.readCreateInput();
    if (title.trim() !== '') {
      this.#view.setCreateTitleError(false);
    }
  }

  handleCreateSave(): void {
    const draft = this.#view.readCreateInput();

    if (draft.title.trim() === '') {
      this.#view.setCreateTitleError(true);
      return;
    }

    this.#view.setCreateTitleError(false);
    this.#model.addRow(draft);
    this.#view.closeCreateDialog();
    this.#render();
  }

  #render(): void {
    this.#view.render(this.#model.snapshot);
  }
}

export function mountTableControlDemo(root: ParentNode): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.tableControlDemoMounted === 'true') return;
  root.dataset.tableControlDemoMounted = 'true';

  const model = new TableControlModel(TABLE_ROWS);
  const view = new TableControlView(root);
  const controller = new TableControlController(model, view);

  controller.mount();
}
