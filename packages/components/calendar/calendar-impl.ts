/**
 * @module calendar
 * デジタル庁デザインシステム Calendarコンポーネント
 * @version 1.0.0
 */

import { html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { calendarStyles } from './calendar-styles.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { parseIsoDate } from '../../utils/iso-date.js';
import { defineButton } from '../button/index.js';


/**
 * DadsCalendarコンポーネントの公開API（型安全な参照用）
 */
export interface DadsCalendarPublicAPI {
  /** 選択日付を設定 */
  setSelectedDate(date: Date | null): void;
  /** 表示月を設定 */
  setDisplayMonth(year: number, monthIndex0: number): void;
  /** カレンダーにフォーカスを移動 */
  focus(): void;
}

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

let japaneseEraFormatter: Intl.DateTimeFormat | null = null;

function getJapaneseEraFormatter(): Intl.DateTimeFormat | null {
  if (japaneseEraFormatter) return japaneseEraFormatter;
  try {
    japaneseEraFormatter = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
      era: 'long',
      year: 'numeric',
    });
    return japaneseEraFormatter;
  } catch {
    return null;
  }
}

function formatJapaneseYear(year: number): string {
  try {
    const date = new Date(year, 0, 1);
    const formatter = getJapaneseEraFormatter();
    if (!formatter) return `${year}年`;
    const parts = formatter.formatToParts(date);

    let era = '';
    let yearValue = '';
    for (const part of parts) {
      if (part.type === 'era') era = part.value;
      if (part.type === 'year') yearValue = part.value;
    }
    if (!era || !yearValue) return `${year}年`;
    return `${year}年(${era}${yearValue}年)`;
  } catch {
    return `${year}年`;
  }
}

function formatJapaneseDate(date: Date): string {
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
  static readonly version = '1.0.0';

  // DOM refs
  #yearSelect: HTMLSelectElement | null = null;
  #prevMonthButton: HTMLElement | null = null;
  #nextMonthButton: HTMLElement | null = null;
  #currentMonth: HTMLElement | null = null;
  #calendarHeading: HTMLElement | null = null;
  #calendarTable: HTMLTableElement | null = null;
  #tbody: HTMLElement | null = null;
  #cellTemplate: HTMLTemplateElement | null = null;
  #deleteButton: HTMLElement | null = null;
  #todayButton: HTMLElement | null = null;
  #rangeContainer: HTMLElement | null = null;
  #rangeSupport: HTMLElement | null = null;
  #rangeStart: HTMLElement | null = null;
  #rangeEnd: HTMLElement | null = null;
  #rangeLive: HTMLElement | null = null;

  // State
  #displayYear = new Date().getFullYear();
  #displayMonth = new Date().getMonth();
  #selectedDate: Date | null = null;
  #rangeStartDate: Date | null = null;
  #rangeEndDate: Date | null = null;
  #minDate: Date | null = null;
  #maxDate: Date | null = null; // exclusive
  #autoManageHostAriaLabel = true;
  #suppressAriaAttributeCallback = false;
  #ariaLabelCacheKey = '';
  #ariaLabelCache = new Map<number, string>();

  #subscriptions: Array<() => void> = [];

  static definition = {
    name: 'dads-calendar',
    template: html`
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

  connectedCallback(): void {
    super.connectedCallback();

    // 依存コンポーネントを先に登録（内部でdads-buttonを利用）
    const prefix = getPrefixFromLocalName(this.localName, '-calendar');
    defineButton(prefix);

    const root = this.shadowRoot;
    if (!root) return;
    if (typeof customElements.upgrade === 'function') {
      customElements.upgrade(root);
    }

    this.#calendarHeading = this.shadowRoot?.querySelector('#calendar-heading') as HTMLElement | null;
    this.#yearSelect = this.shadowRoot?.querySelector('#year-select') as HTMLSelectElement | null;
    this.#prevMonthButton = ensurePrefixedElement(root, 'prev-month-button', `${prefix}-button`, true);
    this.#nextMonthButton = ensurePrefixedElement(root, 'next-month-button', `${prefix}-button`, true);
    this.#currentMonth = this.shadowRoot?.querySelector('#current-month') as HTMLElement | null;
    this.#calendarTable = this.shadowRoot?.querySelector('#calendar-table') as HTMLTableElement | null;
    this.#tbody = this.shadowRoot?.querySelector('#calendar-tbody') as HTMLElement | null;
    this.#cellTemplate = this.shadowRoot?.querySelector('#cell-template') as HTMLTemplateElement | null;
    this.#deleteButton = ensurePrefixedElement(root, 'delete-button', `${prefix}-button`, true);
    this.#todayButton = ensurePrefixedElement(root, 'today-button', `${prefix}-button`, true);
    this.#rangeContainer = this.shadowRoot?.querySelector('#range') as HTMLElement | null;
    this.#rangeSupport = this.shadowRoot?.querySelector('#range-support') as HTMLElement | null;
    this.#rangeStart = this.shadowRoot?.querySelector('#range-start') as HTMLElement | null;
    this.#rangeEnd = this.shadowRoot?.querySelector('#range-end') as HTMLElement | null;
    this.#rangeLive = this.shadowRoot?.querySelector('#range-live') as HTMLElement | null;

    this.#autoManageHostAriaLabel = !this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby');

    this.#setupEventListeners();
    this.#initializeCalendar();
  }

  disconnectedCallback(): void {
    for (const unsub of this.#subscriptions) unsub();
    this.#subscriptions = [];
  }

  static get observedAttributes(): string[] {
    return ['min-date', 'max-date', 'range', 'aria-label', 'aria-labelledby'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'aria-label' || name === 'aria-labelledby') {
      if (!this.#suppressAriaAttributeCallback) {
        this.#autoManageHostAriaLabel = false;
      }
      return;
    }

    if (oldValue === newValue) return;
    if (name !== 'min-date' && name !== 'max-date' && name !== 'range') return;

    // DOM未初期化の場合はconnected後に反映される
    if (!this.isConnected) return;
    if (name === 'range') {
      this.#syncRangeUI();
      this.#renderCalendar();
    } else {
      this.#initializeCalendar();
    }
  }

  // ============================================================
  // Public API
  // ============================================================

  setSelectedDate(date: Date | null): void {
    if (this.#isRangeMode()) {
      this.#setRangeStart(date);
    } else {
      if (date && this.#isDateInRange(date)) {
        this.#selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else {
        this.#selectedDate = null;
      }
    }
    this.#renderCalendar();
  }

  setDisplayMonth(year: number, monthIndex0: number): void {
    const monthToDisplay = this.#getClosestDateInRange(new Date(year, monthIndex0, 1));
    const nextYear = monthToDisplay.getFullYear();
    const nextMonth = monthToDisplay.getMonth();
    const changed = this.#displayYear !== nextYear || this.#displayMonth !== nextMonth;
    this.#displayYear = nextYear;
    this.#displayMonth = nextMonth;
    if (changed) this.#renderCalendar();
  }

  focus(): void {
    const focusable = this.#calendarTable?.querySelector('[tabindex="0"]') as HTMLElement | null;
    focusable?.focus();
  }

  // ============================================================
  // Setup
  // ============================================================

  #setupEventListeners(): void {
    const subscribe = (el: Element | null, type: string, handler: (e: Event) => void): void => {
      if (!el) return;
      el.addEventListener(type, handler);
      this.#subscriptions.push(() => el.removeEventListener(type, handler));
    };

    subscribe(this.#calendarTable, 'click', this.#handleDateClick);
    subscribe(this.#calendarTable, 'keydown', this.#handleKeydown);
    subscribe(this.#prevMonthButton, 'click', () => this.#navigateMonth(-1));
    subscribe(this.#nextMonthButton, 'click', () => this.#navigateMonth(1));
    subscribe(this.#yearSelect, 'change', this.#handleYearChange);
    subscribe(this.#deleteButton, 'click', () => this.#selectDate(null));
    subscribe(this.#todayButton, 'click', () => this.#selectToday());
  }

  #initializeCalendar(): void {
    this.#initializeDateRange();
    this.#sanitizeSelectionWithinRange();
    this.#populateYearSelect();
    this.#renderCalendar();
  }

  #sanitizeSelectionWithinRange(): void {
    if (this.#selectedDate && !this.#isDateInRange(this.#selectedDate)) {
      this.#selectedDate = null;
    }

    if (!this.#isRangeMode()) return;

    if (this.#rangeStartDate && !this.#isDateInRange(this.#rangeStartDate)) {
      this.#rangeStartDate = null;
    }
    if (this.#rangeEndDate && !this.#isDateInRange(this.#rangeEndDate)) {
      this.#rangeEndDate = null;
    }
    if (this.#rangeStartDate && this.#rangeEndDate && this.#rangeEndDate < this.#rangeStartDate) {
      const start = this.#rangeStartDate;
      this.#rangeStartDate = this.#rangeEndDate;
      this.#rangeEndDate = start;
    }
    this.#syncRangeUI();
  }

  #initializeDateRange(): void {
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
    this.#minDate = minParsed
      ? new Date(minParsed.year, minParsed.month - 1, minParsed.day)
      : new Date(nowYear - 1, nowMonth, nowDate);

    const maxParsed = maxDateAttr ? parseIsoDate(maxDateAttr) : null;
    this.#maxDate = maxParsed
      ? // max-date は「当日まで選択可能」にするため、排他的上限として +1 日
        new Date(maxParsed.year, maxParsed.month - 1, maxParsed.day + 1)
      : new Date(nowYear + 1, nowMonth, nowDate);

    const closest = this.#getClosestDateInRange(now);
    this.#displayYear = closest.getFullYear();
    this.#displayMonth = closest.getMonth();
  }

  #populateYearSelect(): void {
    if (!this.#yearSelect || !this.#minDate || !this.#maxDate) return;

    const startYear = this.#minDate.getFullYear();
    const endYear = this.#previousMaxDate().getFullYear();

    this.#yearSelect.innerHTML = '';

    for (let y = startYear; y <= endYear; y += 1) {
      const option = document.createElement('option');
      option.value = String(y);
      option.textContent = formatJapaneseYear(y);
      this.#yearSelect.appendChild(option);
    }

    this.#yearSelect.value = String(this.#displayYear);
  }

  // ============================================================
  // Rendering
  // ============================================================

  #renderCalendar(): void {
    if (!this.#tbody || !this.#cellTemplate || !this.#calendarTable || !this.#minDate || !this.#maxDate) return;

    this.#syncRangeUI();

    const nextCacheKey = `${this.#displayYear}-${this.#displayMonth}`;
    if (this.#ariaLabelCacheKey !== nextCacheKey) {
      this.#ariaLabelCacheKey = nextCacheKey;
      this.#ariaLabelCache.clear();
    }

    // コントロール要素の更新
    if (this.#yearSelect) this.#yearSelect.value = String(this.#displayYear);

    const prevAvailable = this.#isPreviousMonthAvailable();
    const nextAvailable = this.#isNextMonthAvailable();

    if (this.#prevMonthButton) {
      this.#prevMonthButton.setAttribute('aria-disabled', String(!prevAvailable));
      this.#prevMonthButton.toggleAttribute('disabled', !prevAvailable);
    }
    if (this.#nextMonthButton) {
      this.#nextMonthButton.setAttribute('aria-disabled', String(!nextAvailable));
      this.#nextMonthButton.toggleAttribute('disabled', !nextAvailable);
    }

    // テーブルを再描画
    this.#tbody.replaceChildren();

    const firstDay = new Date(this.#displayYear, this.#displayMonth, 1);
    const lastDay = new Date(this.#displayYear, this.#displayMonth + 1, 0);

    const startDate = new Date(firstDay);
    // 日曜日開始
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const currentDate = new Date(startDate);
    let weekCount = 0;
    const maxWeeks = 6;

    const isRangeMode = this.#isRangeMode();
    const calendarHasSelectedDate = isRangeMode
      ? this.#calendarHasRangeSelection()
      : this.#calendarHasSelectedDate();
    const calendarHasToday = this.#calendarHasToday();
    const todayTime = today.getTime();
    const lastDayTime = lastDay.getTime();

    const rangeStartTime = isRangeMode && this.#rangeStartDate ? this.#rangeStartDate.getTime() : null;
    const rangeEndTime = isRangeMode && this.#rangeEndDate ? this.#rangeEndDate.getTime() : null;
    const selectedTime = !isRangeMode && this.#selectedDate ? this.#selectedDate.getTime() : null;

    const focusCandidate = isRangeMode ? (this.#rangeEndDate ?? this.#rangeStartDate) : this.#selectedDate;
    const focusCandidateTime = focusCandidate ? focusCandidate.getTime() : null;
    const focusCandidateInMonth =
      focusCandidate !== null &&
      this.#displayYear === focusCandidate.getFullYear() &&
      this.#displayMonth === focusCandidate.getMonth();

    while (weekCount++ < maxWeeks) {
      const row = document.createElement('tr');
      let weekContainsLastDay = false;

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
        const date = currentDate;
        const dateTime = date.getTime();
        const isCurrentMonth = date.getMonth() === this.#displayMonth;
        const isOutsideMonth = !isCurrentMonth;
        const isDateInRange = this.#isDateInRange(date);
        const isToday = dateTime === todayTime;

        const isDisabled = isOutsideMonth || !isDateInRange;
        const isRangeStart = isRangeMode && rangeStartTime !== null && dateTime === rangeStartTime;
        const isRangeEnd = isRangeMode && rangeEndTime !== null && dateTime === rangeEndTime;
        const isInSelectedRange =
          isRangeMode &&
          rangeStartTime !== null &&
          rangeEndTime !== null &&
          dateTime >= rangeStartTime &&
          dateTime <= rangeEndTime &&
          !isDisabled;
        const isSelected = isRangeMode
          ? isRangeStart || isRangeEnd
          : selectedTime !== null && dateTime === selectedTime;
        const isFocusable =
          (focusCandidateInMonth && focusCandidateTime !== null && dateTime === focusCandidateTime) ||
          (!calendarHasSelectedDate && isToday && !isDisabled);

        const cell = this.#createDateCell(date, {
          isDisabled,
          isOutsideMonth,
          isSelected,
          isFocusable,
          isRangeStart,
          isRangeEnd,
          isInRange: isInSelectedRange,
        });
        row.appendChild(cell);

        weekContainsLastDay ||= lastDayTime === dateTime;

        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.#tbody.appendChild(row);

      if (weekContainsLastDay) break;
    }

    // 選択済み日付も今日も表示されていない場合、最初の有効な日付にtabindex=0
    if (!calendarHasSelectedDate && !calendarHasToday) {
      const buttons = this.#tbody.querySelectorAll('[data-js-date-button]:not(:disabled)');
      const firstEnabled = buttons[0] as HTMLElement | undefined;
      if (firstEnabled) firstEnabled.setAttribute('tabindex', '0');
    }

    // 見出しとラベルの更新
    const heading = MONTH_HEADING_FORMATTER.format(firstDay);

    // 利用側が aria-label / aria-labelledby を指定している場合は上書きしない
    // （未指定時のみ、このコンポーネントが aria-label を自動管理する）
    if (this.#autoManageHostAriaLabel && !this.hasAttribute('aria-labelledby')) {
      this.#suppressAriaAttributeCallback = true;
      try {
        this.setAttribute('aria-label', heading);
      } finally {
        this.#suppressAriaAttributeCallback = false;
      }
    }
    if (this.#calendarHeading) this.#calendarHeading.textContent = heading;
    this.#calendarTable.setAttribute('aria-label', heading);

    if (this.#currentMonth) {
      this.#currentMonth.textContent = MONTH_LABEL_FORMATTER.format(firstDay);
    }
  }

  #createDateCell(
    date: Date,
    flags: {
      isDisabled: boolean;
      isOutsideMonth?: boolean;
      isSelected: boolean;
      isFocusable: boolean;
      isRangeStart?: boolean;
      isRangeEnd?: boolean;
      isInRange?: boolean;
    }
  ): HTMLElement {
    const {
      isDisabled,
      isOutsideMonth = false,
      isSelected,
      isFocusable,
      isRangeStart = false,
      isRangeEnd = false,
      isInRange = false,
    } = flags;

    const frag = (this.#cellTemplate?.content.cloneNode(true) as DocumentFragment | null);
    const cell = frag?.firstElementChild as HTMLElement | null;
    if (!cell) {
      throw new Error('cell-template が見つかりません。');
    }
    const button = cell.querySelector('button') as HTMLButtonElement | null;
    if (!button) {
      throw new Error('date button が見つかりません。');
    }

    button.textContent = String(date.getDate());

    const ariaLabel = this.#getDateAriaLabel(date);

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
    } else {
      const prefix = isInRange ? '期間内' : '';
      button.setAttribute('aria-label', prefix ? `${prefix} ${ariaLabel}` : ariaLabel);
      button.removeAttribute('data-selected');
    }

    button.tabIndex = isFocusable ? 0 : -1;

    button.dataset.year = String(date.getFullYear());
    button.dataset.month = String(date.getMonth());
    button.dataset.date = String(date.getDate());

    return cell;
  }

  #getDateAriaLabel(date: Date): string {
    const key = date.getTime();
    const cached = this.#ariaLabelCache.get(key);
    if (cached) return cached;
    const next = DATE_ARIA_FORMATTER.format(date);
    this.#ariaLabelCache.set(key, next);
    return next;
  }

  // ============================================================
  // Events / Behavior
  // ============================================================

  #handleDateClick = (e: Event): void => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const button = target.matches('[data-js-date-button]')
      ? (target as HTMLButtonElement)
      : null;
    if (!button || button.disabled) return;

    const year = Number.parseInt(button.dataset.year ?? '', 10);
    const month = Number.parseInt(button.dataset.month ?? '', 10);
    const date = Number.parseInt(button.dataset.date ?? '', 10);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date)) return;

    this.#selectDate(new Date(year, month, date));
  };

  #handleKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    const target = ke.target;
    if (!(target instanceof Element)) return;
    if (!target.matches('[data-js-date-button]')) return;

    const button = target as HTMLButtonElement;
    const year = Number.parseInt(button.dataset.year ?? '', 10);
    const month = Number.parseInt(button.dataset.month ?? '', 10);
    const date = Number.parseInt(button.dataset.date ?? '', 10);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date)) return;

    const current = new Date(year, month, date);
    const next = new Date(current);

    switch (ke.key) {
      case 'ArrowUp':
        ke.preventDefault();
        next.setDate(next.getDate() - 7);
        this.#navigateToDate(next);
        break;
      case 'ArrowDown':
        ke.preventDefault();
        next.setDate(next.getDate() + 7);
        this.#navigateToDate(next);
        break;
      case 'ArrowLeft':
        ke.preventDefault();
        next.setDate(next.getDate() - 1);
        this.#navigateToDate(next);
        break;
      case 'ArrowRight':
        ke.preventDefault();
        next.setDate(next.getDate() + 1);
        this.#navigateToDate(next);
        break;
    }
  };

  #handleYearChange = (e: Event): void => {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const year = Number.parseInt(target.value, 10);
    if (Number.isNaN(year)) return;
    this.setDisplayMonth(year, this.#displayMonth);
  };

  #selectDate(date: Date | null): void {
    if (this.#isRangeMode()) {
      this.#selectRangeDate(date);
      return;
    }

    if (date) {
      const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.#selectedDate = normalized;
    } else {
      this.#selectedDate = null;
    }

    this.#renderCalendar();

    this.dispatchEvent(
      new CustomEvent('date-selected', {
        detail: { date: this.#selectedDate },
        bubbles: true,
        composed: true,
      })
    );
  }

  #selectRangeDate(date: Date | null): void {
    let announcement = '';

    if (!date) {
      this.#rangeStartDate = null;
      this.#rangeEndDate = null;
      announcement = '開始日と終了日をクリアしました。';
    } else if (!this.#rangeStartDate || (this.#rangeStartDate && this.#rangeEndDate)) {
      this.#rangeStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.#rangeEndDate = null;
      announcement = `開始日として${formatJapaneseDate(this.#rangeStartDate)}を選択しました。終了日をお選びください。`;
    } else {
      const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let start = this.#rangeStartDate;
      let end = selected;
      if (end < start) [start, end] = [end, start];
      this.#rangeStartDate = start;
      this.#rangeEndDate = end;
      announcement = `終了日として${formatJapaneseDate(end)}を選択しました。期間は${formatJapaneseDate(start)}から${formatJapaneseDate(end)}です。`;
    }

    this.#renderCalendar();

    if (this.#rangeLive) {
      // 同一文字列だと読み上げが発火しない場合があるため、一度空にして更新
      this.#rangeLive.textContent = '';
      this.#rangeLive.textContent = announcement;
    }

    this.dispatchEvent(
      new CustomEvent('date-range-selected', {
        detail: { startDate: this.#rangeStartDate, endDate: this.#rangeEndDate },
        bubbles: true,
        composed: true,
      })
    );
  }

  #navigateToDate(targetDate: Date): void {
    if (!this.#isDateInRange(targetDate)) return;

    this.setDisplayMonth(targetDate.getFullYear(), targetDate.getMonth());

    const selector = `[data-year="${targetDate.getFullYear()}"][data-month="${targetDate.getMonth()}"][data-date="${targetDate.getDate()}"]`;
    const targetButton = this.#calendarTable?.querySelector(selector) as HTMLElement | null;
    if (!targetButton) return;

    const currentFocusable = this.#calendarTable?.querySelectorAll('[tabindex="0"]') ?? [];
    for (const el of currentFocusable) {
      (el as HTMLElement).setAttribute('tabindex', '-1');
    }

    targetButton.setAttribute('tabindex', '0');
    targetButton.focus();
  }

  #navigateMonth(direction: -1 | 1): void {
    if (direction === -1 && !this.#isPreviousMonthAvailable()) return;
    if (direction === 1 && !this.#isNextMonthAvailable()) return;
    this.setDisplayMonth(this.#displayYear, this.#displayMonth + direction);
  }

  #selectToday(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!this.#isDateInRange(today)) return;
    this.setDisplayMonth(today.getFullYear(), today.getMonth());
    this.#selectDate(today);
  }

  // ============================================================
  // Range helpers
  // ============================================================

  #isDateInRange(date: Date): boolean {
    if (!this.#minDate || !this.#maxDate) return true;
    if (Number.isNaN(date.getTime())) return false;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateOnly >= this.#minDate && dateOnly < this.#maxDate;
  }

  #getClosestDateInRange(date: Date): Date {
    if (!this.#minDate || !this.#maxDate) return new Date(date);
    if (date < this.#minDate) return new Date(this.#minDate);
    if (date >= this.#maxDate) return new Date(this.#previousMaxDate());
    return new Date(date);
  }

  #previousMaxDate(): Date {
    if (!this.#maxDate) return new Date();
    return new Date(
      this.#maxDate.getFullYear(),
      this.#maxDate.getMonth(),
      this.#maxDate.getDate() - 1
    );
  }

  #isPreviousMonthAvailable(): boolean {
    const prevMonthLastDay = new Date(this.#displayYear, this.#displayMonth, 0);
    return this.#isDateInRange(prevMonthLastDay);
  }

  #isNextMonthAvailable(): boolean {
    const nextMonthFirstDay = new Date(this.#displayYear, this.#displayMonth + 1, 1);
    return this.#isDateInRange(nextMonthFirstDay);
  }

  #calendarHasSelectedDate(): boolean {
    if (!this.#selectedDate) return false;
    return (
      this.#displayYear === this.#selectedDate.getFullYear() &&
      this.#displayMonth === this.#selectedDate.getMonth()
    );
  }

  #calendarHasToday(): boolean {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return (
      this.#displayYear === today.getFullYear() &&
      this.#displayMonth === today.getMonth() &&
      this.#isDateInRange(today)
    );
  }

  #calendarHasRangeSelection(): boolean {
    const start = this.#rangeStartDate;
    const end = this.#rangeEndDate;
    if (start && this.#displayYear === start.getFullYear() && this.#displayMonth === start.getMonth()) {
      return true;
    }
    if (end && this.#displayYear === end.getFullYear() && this.#displayMonth === end.getMonth()) {
      return true;
    }
    return false;
  }

  #isRangeMode(): boolean {
    return this.hasAttribute('range');
  }

  #setRangeStart(date: Date | null): void {
    if (date && this.#isDateInRange(date)) {
      this.#rangeStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.#rangeEndDate = null;
    } else {
      this.#rangeStartDate = null;
      this.#rangeEndDate = null;
    }
    this.#syncRangeUI();
  }

  #syncRangeUI(): void {
    const isRangeMode = this.#isRangeMode();
    if (this.#rangeContainer) this.#rangeContainer.hidden = !isRangeMode;
    if (!isRangeMode) return;

    const startText = this.#rangeStartDate ? formatJapaneseDate(this.#rangeStartDate) : '未選択';
    const endText = this.#rangeEndDate ? formatJapaneseDate(this.#rangeEndDate) : '未選択';

    this.#setText(this.#rangeStart, startText);
    this.#setText(this.#rangeEnd, endText);
    this.#setText(this.#rangeSupport, this.#getRangeSupportText());
  }

  #getRangeSupportText(): string {
    if (!this.#rangeStartDate) return '開始日を選択してください。';
    if (!this.#rangeEndDate) return '終了日をお選びください。';
    return '開始日と終了日を選択しました。';
  }

  #setText(el: HTMLElement | null, value: string): void {
    if (el) el.textContent = value;
  }
}
