type MunicipalScenario = 'before-search' | 'after-search' | 'empty-result';

type MunicipalStatus = '要連絡' | '完了' | '進行中';

type MunicipalRow = {
  requestType: string;
  applicantName: string;
  applicationNo: string;
  status: MunicipalStatus;
  applicationType: '電子' | '紙';
  applicationDate: string;
};

type MunicipalSnapshot = Readonly<{
  scenario: MunicipalScenario;
  query: string;
  totalCount: number;
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  itemsPerPage: number;
  rows: readonly MunicipalRow[];
}>;

type SearchEventDetail = Readonly<{
  query: string;
  scope: string;
}>;

type CreateMunicipalRowInput = Readonly<{
  requestType: string;
  applicantName: string;
  status: MunicipalStatus;
  applicationType: MunicipalRow['applicationType'];
}>;

type PageSizeEventDetail = Readonly<{
  value: string;
  itemsPerPage: number;
}>;

type SearchBoxElement = HTMLElement & {
  value?: string;
};

type DialogElement = HTMLElement & {
  show?: () => void;
  close?: () => void;
};

const BEFORE_PAGE_ROWS: readonly MunicipalRow[] = [
  {
    requestType: '住民票交付申請',
    applicantName: 'デジ田 太郎',
    applicationNo: '123456789012345',
    status: '要連絡',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: 'パスポート更新申請',
    applicantName: 'デジ濱 実',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '紙',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '戸籍謄本請求',
    applicantName: 'デジ山 ひかり',
    applicationNo: '123456789012345',
    status: '進行中',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: 'パスポート更新申請',
    applicantName: '出而足 長一郎',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: 'パスポート新規申請',
    applicantName: '電磁 多留子',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '転出届',
    applicantName: 'デジ田 太郎',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '転入届',
    applicantName: 'デジ濱 実',
    applicationNo: '123456789012345',
    status: '要連絡',
    applicationType: '紙',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '国民健康保険加入申請',
    applicantName: 'デジ山 ひかり',
    applicationNo: '123456789012345',
    status: '進行中',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '児童手当認定申請',
    applicantName: '出而足 長一郎',
    applicationNo: '123456789012345',
    status: '要連絡',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
  {
    requestType: '介護保険認定申',
    applicantName: '電磁 多留子',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2023年9月23日',
  },
];

const AFTER_SEARCH_ROWS: readonly MunicipalRow[] = [
  {
    requestType: 'パスポート更新申請',
    applicantName: '出而足 長一郎',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2025年9月12日',
  },
  {
    requestType: 'パスポート新規申請',
    applicantName: '電磁 多留子',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '電子',
    applicationDate: '2025年8月23日',
  },
  {
    requestType: 'パスポート新規申請',
    applicantName: 'デジ田 ひかり',
    applicationNo: '123456789012345',
    status: '要連絡',
    applicationType: '電子',
    applicationDate: '2025年11月23日',
  },
  {
    requestType: 'パスポート新規申請',
    applicantName: 'デジ濱 太郎',
    applicationNo: '123456789012345',
    status: '完了',
    applicationType: '紙',
    applicationDate: '2025年12月23日',
  },
  {
    requestType: 'パスポート新規申請',
    applicantName: 'デジ山 長一郎',
    applicationNo: '123456789012345',
    status: '進行中',
    applicationType: '電子',
    applicationDate: '2025年5月23日',
  },
];

const STATUS_CYCLE: readonly MunicipalStatus[] = ['完了', '進行中', '要連絡'];
const APPLICANT_NAMES = ['山田 太郎', '佐藤 花子', '鈴木 一郎', '高橋 未来', '伊藤 蓮'] as const;
const APPLICATION_TYPES: readonly MunicipalRow['applicationType'][] = ['電子', '紙'];

const BEFORE_ALL_ROWS: readonly MunicipalRow[] = [
  ...BEFORE_PAGE_ROWS,
  ...Array.from({ length: 1190 }, (_, offset) => {
    const no = offset + 11;
    const month = String(((no - 1) % 12) + 1);
    const day = String(((no - 1) % 28) + 1);

    return {
      requestType: `行政手続き ${no}`,
      applicantName: APPLICANT_NAMES[no % APPLICANT_NAMES.length],
      applicationNo: String(223456789012300 + no),
      status: STATUS_CYCLE[no % STATUS_CYCLE.length],
      applicationType: APPLICATION_TYPES[no % APPLICATION_TYPES.length],
      applicationDate: `2024年${month}月${day}日`,
    };
  }),
];

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('ja-JP');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isMunicipalScenario(value: string | null): value is MunicipalScenario {
  return value === 'before-search' || value === 'after-search' || value === 'empty-result';
}

function isNativeClickEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
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

function formatJapaneseDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(rows: readonly MunicipalRow[]): string {
  const header = ['申請名', '氏名', '申請番号', 'ステータス', '申請種別', '申請日'];
  const lines = [header.join(',')];

  for (const row of rows) {
    lines.push([
      row.requestType,
      row.applicantName,
      row.applicationNo,
      row.status,
      row.applicationType,
      row.applicationDate,
    ].map(csvEscape).join(','));
  }

  return lines.join('\n');
}

function resolveStatusColor(status: MunicipalStatus): 'red' | 'green' | 'blue' {
  switch (status) {
    case '要連絡':
      return 'red';
    case '進行中':
      return 'blue';
    default:
      return 'green';
  }
}

class MunicipalTableModel {
  #customRows: MunicipalRow[] = [];
  #scenario: MunicipalScenario = 'before-search';
  #query = '';
  #itemsPerPage = 10;
  #page = 1;

  applyScenario(scenario: MunicipalScenario): void {
    this.#scenario = scenario;
    this.#itemsPerPage = 10;
    this.#page = 1;

    switch (scenario) {
      case 'before-search':
        this.#query = '';
        return;
      case 'after-search':
        this.#query = 'パスポート';
        return;
      case 'empty-result':
        this.#query = '罹災証明書';
        return;
      default:
        this.#query = '';
    }
  }

  setQuery(query: string): void {
    const trimmed = query.trim();

    if (trimmed === '') {
      this.applyScenario('before-search');
      return;
    }

    const normalized = normalizeText(trimmed);
    if (normalized.includes(normalizeText('パスポート')) || this.#customRowsMatchQuery(trimmed)) {
      this.#scenario = 'after-search';
      this.#query = trimmed;
      this.#page = 1;
      return;
    }

    this.#scenario = 'empty-result';
    this.#query = trimmed;
    this.#page = 1;
  }

  addRow(input: CreateMunicipalRowInput): void {
    const requestType = input.requestType.trim();
    const applicantName = input.applicantName.trim();
    if (requestType === '' || applicantName === '') return;

    const row: MunicipalRow = {
      requestType,
      applicantName,
      applicationNo: this.#createApplicationNo(),
      status: input.status,
      applicationType: input.applicationType,
      applicationDate: formatJapaneseDate(new Date()),
    };

    this.#customRows = [row, ...this.#customRows];
    this.#scenario = 'before-search';
    this.#query = '';
    this.#page = 1;
  }

  resetQuery(): void {
    this.applyScenario('before-search');
  }

  setItemsPerPage(itemsPerPage: number): void {
    if (!Number.isFinite(itemsPerPage) || itemsPerPage <= 0) return;

    this.#itemsPerPage = itemsPerPage;
    this.#page = 1;
  }

  nextPage(): void {
    if (!this.hasNext) return;
    this.#page += 1;
  }

  prevPage(): void {
    if (!this.hasPrev) return;
    this.#page -= 1;
  }

  get #activeRows(): readonly MunicipalRow[] {
    if (this.#scenario === 'before-search') {
      return [...this.#customRows, ...BEFORE_ALL_ROWS];
    }

    if (this.#scenario === 'after-search') {
      const normalizedQuery = normalizeText(this.#query);
      const customMatched = this.#customRows.filter((row) => this.#rowMatchesQuery(row, normalizedQuery));
      const baseMatched = AFTER_SEARCH_ROWS.filter((row) => this.#rowMatchesQuery(row, normalizedQuery));
      return [...customMatched, ...baseMatched];
    }

    const normalizedQuery = normalizeText(this.#query);
    return this.#customRows.filter((row) => this.#rowMatchesQuery(row, normalizedQuery));
  }

  get totalCount(): number {
    return this.#activeRows.length;
  }

  get pageCount(): number {
    if (this.totalCount === 0) return 1;
    return Math.max(1, Math.ceil(this.totalCount / this.#itemsPerPage));
  }

  get hasNext(): boolean {
    return this.#page < this.pageCount;
  }

  get hasPrev(): boolean {
    return this.#page > 1;
  }

  get pagedRows(): readonly MunicipalRow[] {
    const start = (this.#page - 1) * this.#itemsPerPage;
    return this.#activeRows.slice(start, start + this.#itemsPerPage);
  }

  get exportRows(): readonly MunicipalRow[] {
    return this.#activeRows;
  }

  #createApplicationNo(): string {
    const base = Date.now().toString().slice(-13);
    const seq = (this.#customRows.length % 10).toString();
    return `9${base}${seq}`.slice(0, 15);
  }

  #rowMatchesQuery(row: MunicipalRow, normalizedQuery: string): boolean {
    if (normalizedQuery === '') return true;
    const haystack = normalizeText([
      row.requestType,
      row.applicantName,
      row.applicationNo,
      row.status,
      row.applicationType,
      row.applicationDate,
    ].join(' '));
    return haystack.includes(normalizedQuery);
  }

  #customRowsMatchQuery(query: string): boolean {
    const normalizedQuery = normalizeText(query);
    return this.#customRows.some((row) => this.#rowMatchesQuery(row, normalizedQuery));
  }

  get snapshot(): MunicipalSnapshot {
    return {
      scenario: this.#scenario,
      query: this.#query,
      totalCount: this.totalCount,
      page: this.#page,
      pageCount: this.pageCount,
      hasPrev: this.hasPrev,
      hasNext: this.hasNext,
      itemsPerPage: this.#itemsPerPage,
      rows: this.pagedRows,
    };
  }
}

class MunicipalTableView {
  #searchBox: SearchBoxElement;
  #count: HTMLElement;
  #resetButton: HTMLButtonElement;
  #printButton: HTMLButtonElement;
  #csvButton: HTMLButtonElement;
  #createButton: HTMLButtonElement;
  #createDialog: DialogElement | null;
  #createRequestType: HTMLElement | null;
  #createApplicantName: HTMLElement | null;
  #createStatus: HTMLElement | null;
  #createApplicationType: HTMLElement | null;
  #createSaveButton: HTMLButtonElement | null;
  #createCancelButton: HTMLButtonElement | null;
  #tbody: HTMLElement;
  #footer: HTMLElement;
  #pagination: HTMLElement;
  #scenarioButtons: readonly HTMLButtonElement[];

  constructor(root: HTMLElement) {
    this.#searchBox = root.querySelector<SearchBoxElement>('#demo-municipal-search') as SearchBoxElement;
    this.#count = root.querySelector<HTMLElement>('#demo-municipal-count') as HTMLElement;
    this.#resetButton = root.querySelector<HTMLButtonElement>('#demo-municipal-reset') as HTMLButtonElement;
    this.#printButton = root.querySelector<HTMLButtonElement>('#demo-municipal-print') as HTMLButtonElement;
    this.#csvButton = root.querySelector<HTMLButtonElement>('#demo-municipal-csv') as HTMLButtonElement;
    this.#createButton = root.querySelector<HTMLButtonElement>('#demo-municipal-create') as HTMLButtonElement;
    this.#createDialog = root.querySelector<DialogElement>('#demo-municipal-create-dialog');
    this.#createRequestType = root.querySelector<HTMLElement>('#demo-municipal-create-request-type');
    this.#createApplicantName = root.querySelector<HTMLElement>('#demo-municipal-create-applicant-name');
    this.#createStatus = root.querySelector<HTMLElement>('#demo-municipal-create-status');
    this.#createApplicationType = root.querySelector<HTMLElement>('#demo-municipal-create-application-type');
    this.#createSaveButton = root.querySelector<HTMLButtonElement>('#demo-municipal-create-save');
    this.#createCancelButton = root.querySelector<HTMLButtonElement>('#demo-municipal-create-cancel');
    this.#tbody = root.querySelector<HTMLElement>('#demo-municipal-tbody') as HTMLElement;
    this.#footer = root.querySelector<HTMLElement>('#demo-municipal-footer') as HTMLElement;
    this.#pagination = root.querySelector<HTMLElement>('#demo-municipal-pagination') as HTMLElement;

    const scenarioScope = root.closest('section') ?? root;
    this.#scenarioButtons = Array.from(
      scenarioScope.querySelectorAll<HTMLButtonElement>('[data-table-control-municipal-scenario]'),
    );
  }

  bind(controller: MunicipalTableController): void {
    this.#searchBox.addEventListener('dads-search', (event: Event) => {
      const detail = (event as CustomEvent<SearchEventDetail>).detail;
      controller.handleSearch(detail.query);
    });

    this.#resetButton.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleReset();
    });

    this.#printButton.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handlePrint();
    });

    this.#csvButton.addEventListener('click', (event: Event) => {
      if (!isNativeClickEvent(event)) return;
      controller.handleCsvDownload();
    });

    this.#createButton.addEventListener('click', (event: Event) => {
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

    this.#createRequestType?.addEventListener('dads-input', () => {
      controller.handleCreateInputChange();
    });

    this.#createApplicantName?.addEventListener('dads-input', () => {
      controller.handleCreateInputChange();
    });

    this.#footer.addEventListener('dads-table-control-page-size-change', (event: Event) => {
      const detail = (event as CustomEvent<PageSizeEventDetail>).detail;
      controller.handleItemsPerPage(detail.itemsPerPage);
    });

    this.#pagination.addEventListener('prev', () => {
      controller.handlePrev();
    });

    this.#pagination.addEventListener('next', () => {
      controller.handleNext();
    });

    for (const button of this.#scenarioButtons) {
      button.addEventListener('click', (event: Event) => {
        if (!isNativeClickEvent(event)) return;

        const scenario = button.getAttribute('data-table-control-municipal-scenario');
        if (!isMunicipalScenario(scenario)) return;

        controller.handleScenario(scenario);
      });
    }
  }

  render(snapshot: MunicipalSnapshot): void {
    writeElementValue(this.#searchBox, snapshot.query);
    this.#count.textContent = `${snapshot.totalCount.toLocaleString('ja-JP')} 件`;

    const showReset = snapshot.query.trim() !== '';
    this.#resetButton.setAttribute('data-visible', showReset ? 'true' : 'false');
    this.#resetButton.setAttribute('aria-hidden', showReset ? 'false' : 'true');
    this.#resetButton.tabIndex = showReset ? 0 : -1;

    this.#footer.setAttribute('items-per-page', String(snapshot.itemsPerPage));

    this.#pagination.toggleAttribute('hidden', snapshot.totalCount === 0);
    this.#pagination.setAttribute('current', String(snapshot.page));
    this.#pagination.setAttribute('total', String(snapshot.pageCount));
    this.#pagination.toggleAttribute('disabled-prev', !snapshot.hasPrev);
    this.#pagination.toggleAttribute('disabled-next', !snapshot.hasNext);

    this.#renderRows(snapshot.rows, snapshot.totalCount === 0);

    for (const button of this.#scenarioButtons) {
      const scenario = button.getAttribute('data-table-control-municipal-scenario');
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

  readCreateInput(): CreateMunicipalRowInput {
    const statusValue = readElementValue(this.#createStatus);
    const applicationTypeValue = readElementValue(this.#createApplicationType);

    const status: MunicipalStatus = statusValue === '要連絡' || statusValue === '進行中'
      ? statusValue
      : '完了';
    const applicationType: MunicipalRow['applicationType'] = applicationTypeValue === '紙'
      ? '紙'
      : '電子';

    return {
      requestType: readElementValue(this.#createRequestType),
      applicantName: readElementValue(this.#createApplicantName),
      status,
      applicationType,
    };
  }

  setCreateErrors(
    hasRequestTypeError: boolean,
    hasApplicantNameError: boolean,
    focusInvalidField = false,
  ): void {
    this.#setFieldError(this.#createRequestType, hasRequestTypeError);
    this.#setFieldError(this.#createApplicantName, hasApplicantNameError);

    if (!focusInvalidField) return;

    if (hasRequestTypeError) {
      this.#createRequestType?.focus();
      return;
    }

    if (hasApplicantNameError) {
      this.#createApplicantName?.focus();
    }
  }

  downloadCsv(filename: string, csv: string): void {
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  printPage(): void {
    window.print();
  }

  #resetCreateForm(): void {
    writeElementValue(this.#createRequestType, '');
    writeElementValue(this.#createApplicantName, '');
    writeElementValue(this.#createStatus, '要連絡');
    writeElementValue(this.#createApplicationType, '電子');
    this.setCreateErrors(false, false);
  }

  #setFieldError(field: HTMLElement | null, hasError: boolean): void {
    if (!field) return;
    if (hasError) {
      field.setAttribute('error', '');
      return;
    }
    field.removeAttribute('error');
  }

  #renderRows(rows: readonly MunicipalRow[], isEmpty: boolean): void {
    if (isEmpty) {
      this.#tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-control-municipal-demo__empty-cell">該当する項目がありません</td>
        </tr>
      `;
      return;
    }

    const html = rows
      .map((row) => `
        <tr>
          <th scope="row">${escapeHtml(row.requestType)}</th>
          <td>${escapeHtml(row.applicantName)}</td>
          <td>${escapeHtml(row.applicationNo)}</td>
          <td>
            <dads-chip-label
              variant="fill"
              color="${resolveStatusColor(row.status)}"
              class="table-control-municipal-demo__status-chip"
            >${escapeHtml(row.status)}</dads-chip-label>
          </td>
          <td>${escapeHtml(row.applicationType)}</td>
          <td>${escapeHtml(row.applicationDate)}</td>
        </tr>
      `)
      .join('');

    this.#tbody.innerHTML = html;
  }
}

class MunicipalTableController {
  #model: MunicipalTableModel;
  #view: MunicipalTableView;

  constructor(model: MunicipalTableModel, view: MunicipalTableView) {
    this.#model = model;
    this.#view = view;
  }

  mount(): void {
    this.#view.bind(this);
    this.#model.applyScenario('before-search');
    this.#render();
  }

  handleScenario(scenario: MunicipalScenario): void {
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

  handlePrint(): void {
    this.#view.printPage();
  }

  handleCsvDownload(): void {
    const csv = toCsv(this.#model.exportRows);
    this.#view.downloadCsv('municipal-table.csv', csv);
  }

  handleCreateOpen(): void {
    this.#view.openCreateDialog();
  }

  handleCreateCancel(): void {
    this.#view.closeCreateDialog();
  }

  handleCreateInputChange(): void {
    const draft = this.#view.readCreateInput();
    this.#view.setCreateErrors(draft.requestType.trim() === '', draft.applicantName.trim() === '');
  }

  handleCreateSave(): void {
    const draft = this.#view.readCreateInput();
    const hasRequestTypeError = draft.requestType.trim() === '';
    const hasApplicantNameError = draft.applicantName.trim() === '';
    this.#view.setCreateErrors(hasRequestTypeError, hasApplicantNameError, true);
    if (hasRequestTypeError || hasApplicantNameError) return;

    this.#model.addRow(draft);
    this.#view.closeCreateDialog();
    this.#render();
  }

  #render(): void {
    this.#view.render(this.#model.snapshot);
  }
}

export function mountTableControlMunicipalDemo(root: ParentNode): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.tableControlMunicipalMounted === 'true') return;
  root.dataset.tableControlMunicipalMounted = 'true';

  const model = new MunicipalTableModel();
  const view = new MunicipalTableView(root);
  const controller = new MunicipalTableController(model, view);

  controller.mount();
}
