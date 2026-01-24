/**
 * @module date-picker
 * デジタル庁デザインシステム DatePickerコンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import { datePickerStyles } from './date-picker-styles.js';
import { setDefaultAttributes, updateErrorFallback } from '../../utils/form-component-helpers.js';
import type { A11yAnnotations, A11yElementRef } from '../../utils/a11y-annotations.js';
import { getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { parseIsoDate, toIsoDateOrEmpty } from '../../utils/iso-date.js';
import { defineCalendar } from '../calendar/calendar-define.js';
import type { DadsCalendarPublicAPI } from '../calendar/index.js';

type MaybeDate = Date | null;

const shadowTarget = (selector: string): A11yElementRef => ({ scope: 'shadow', selector });

function isValidType(v: string | null): v is 'consolidated' | 'separated' {
  return v === 'consolidated' || v === 'separated';
}

function isValidSize(v: string | null): v is 'sm' | 'md' | 'lg' {
  return v === 'sm' || v === 'md' || v === 'lg';
}

function parseDigits(value: string, re: RegExp): number | null {
  const trimmed = value.trim();
  if (!re.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export class DadsDatePicker extends TypographyFormComponent {
  static override readonly formAssociated = true;

  static readonly version = '1.0.0';

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: '日付ピッカー／カレンダーコンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部に年/月/日の入力欄（<input>）を持ち、日付入力のセマンティクスを提供します。',
        'カレンダーポップオーバーは role="dialog" で提供します。',
      ],
      keyboard: [
        'Tabで各入力欄へフォーカスできます。',
        'Consolidatedタイプでは左右キー（←→）でフィールド間の移動をサポートします。',
        'カレンダー表示中は Esc で閉じる操作が可能です。',
      ],
      zoom: [
        'サイズ（sm/md/lg）に応じて高さを調整します。',
      ],
      states: [
        'disabled / readonly / error をサポートします。',
        'error時は各入力に aria-invalid="true" を付与し、エラーテキストを表示します。',
      ],
      labels: [
        '各入力欄は <label> でラベル（年/月/日）と関連付けます。',
        'グループ全体のラベルは fieldset/legend による付与を推奨します（DADSガイドに準拠）。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'inputs',
        title: '入力欄グループ',
        label: 'inputs',
        description: '年/月/日の入力欄をまとめた領域です（data-type により見た目が変化）。',
        category: 'semantics',
        placement: 'top-left',
        target: shadowTarget('[part="inputs"]'),
      },
      {
        id: 'year-input',
        title: '年（入力）',
        label: '<input>',
        description: '年（西暦）の入力欄です。',
        category: 'keyboard',
        placement: 'top-left',
        target: shadowTarget('#year-input'),
      },
      {
        id: 'month-input',
        title: '月（入力）',
        label: '<input>',
        description: '月（01-12）の入力欄です。',
        category: 'keyboard',
        placement: 'top-left',
        target: shadowTarget('#month-input'),
      },
      {
        id: 'day-input',
        title: '日（入力）',
        label: '<input>',
        description: '日（01-31）の入力欄です。',
        category: 'keyboard',
        placement: 'top-left',
        target: shadowTarget('#day-input'),
      },
      {
        id: 'calendar-button',
        title: 'カレンダーボタン',
        label: 'button',
        description: 'クリックでカレンダー（ポップオーバー）を開閉します。',
        category: 'keyboard',
        placement: 'top-right',
        target: shadowTarget('[part="calendar-button"]'),
      },
      {
        id: 'calendar-popover',
        title: 'カレンダー（ダイアログ）',
        label: 'role="dialog"',
        description: 'カレンダーを role="dialog" として表示します。Escで閉じ、Tabでフォーカスがループします。',
        category: 'semantics',
        placement: 'top-right',
        target: shadowTarget('#calendar-popover'),
      },
      {
        id: 'calendar',
        title: '内包カレンダー',
        label: '<dads-calendar>',
        description: '日付選択UIは dads-calendar を内包して提供します（選択イベントで入力欄へ反映）。',
        category: 'semantics',
        placement: 'top-right',
        target: shadowTarget('#calendar'),
      },
      {
        id: 'error-text',
        title: 'エラーテキスト',
        label: 'error-text',
        description: 'error属性が指定されたときに表示されます。',
        category: 'states',
        placement: 'bottom-left',
        target: shadowTarget('[part="error-text"]'),
      },
    ],
  };

  // DOM refs
  #inputs: HTMLElement | null = null;
  #yearInput: HTMLInputElement | null = null;
  #monthInput: HTMLInputElement | null = null;
  #dayInput: HTMLInputElement | null = null;

  #calendarButton: HTMLButtonElement | null = null;
  #calendarPopover: HTMLElement | null = null;
  #backdrop: HTMLElement | null = null;
  #calendar: HTMLElement | null = null;

  #errorText: HTMLElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;
  #errorFallback: HTMLElement | null = null;
  #describedByProxies: HTMLElement | null = null;

  #formDisabled = false;

  #subscriptions: Array<() => void> = [];

  static definition = {
    name: 'dads-date-picker',
    template: html`
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
    styles: withReset([applyDADSTokens(), datePickerStyles], 'minimal'),
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

  connectedCallback(): void {
    super.connectedCallback();

    // 依存コンポーネントを先に登録（ポップオーバー内で利用）
    const prefix = getPrefixFromLocalName(this.localName, '-date-picker');
    defineCalendar(prefix);

    setDefaultAttributes(this, { 'data-type': 'consolidated', size: 'md' });

    this.#inputs = this.shadowRoot?.querySelector('#inputs') as HTMLElement | null;
    this.#yearInput = this.shadowRoot?.querySelector('#year-input') as HTMLInputElement | null;
    this.#monthInput = this.shadowRoot?.querySelector('#month-input') as HTMLInputElement | null;
    this.#dayInput = this.shadowRoot?.querySelector('#day-input') as HTMLInputElement | null;

    this.#calendarButton = this.shadowRoot?.querySelector('#calendar-button') as HTMLButtonElement | null;
    this.#calendarPopover = this.shadowRoot?.querySelector('#calendar-popover') as HTMLElement | null;
    this.#backdrop = this.shadowRoot?.querySelector('#backdrop') as HTMLElement | null;
    this.#calendar = this.shadowRoot?.querySelector('#calendar') as HTMLElement | null;
    this.#ensureCalendarElement(prefix);

    this.#errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement | null;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement | null;
    this.#errorFallback = this.shadowRoot?.querySelector('#error-fallback') as HTMLElement | null;
    this.#describedByProxies = this.shadowRoot?.querySelector('#describedby-proxies') as HTMLElement | null;

    this.#setupEventListeners();
    this.#syncAll();
  }

  disconnectedCallback(): void {
    for (const unsub of this.#subscriptions) unsub();
    this.#subscriptions = [];
  }

  // ============================================================
  // Form callbacks
  // ============================================================

  formResetCallback(): void {
    const defaultValue = this.getAttribute('value') ?? '';
    this.value = defaultValue;
  }

  formStateRestoreCallback(state: unknown, _mode: unknown): void {
    if (state !== null && typeof state === 'string') {
      this.value = state;
    }
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this.#formDisabled = disabled;
    this.#syncDisabled();
    this.#syncFormValue();
  }

  // ============================================================
  // Public API
  // ============================================================

  get value(): string {
    return this.#computeIsoValue();
  }

  set value(v: string) {
    const parsed = parseIsoDate(v);
    if (!parsed) {
      this.#clearInputs();
      this.#syncFormValue();
      return;
    }

    this.#syncToInputs(new Date(parsed.year, parsed.month - 1, parsed.day));
    this.#syncFormValue();
  }

  focus(options?: FocusOptions): void {
    this.#yearInput?.focus(options);
  }

  // ============================================================
  // Attribute changes
  // ============================================================

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-type':
      case 'size':
        this.#syncNormalizedAttributes();
        break;
      case 'calendar':
        this.#syncCalendarVisibility();
        break;
      case 'disabled':
        this.#syncDisabled();
        break;
      case 'readonly':
        this.#syncReadonly();
        break;
      case 'error':
      case 'error-text':
      case 'aria-describedby':
        this.#syncValidationA11y();
        break;
      case 'min-date':
      case 'max-date':
        this.#syncCalendarRange();
        break;
      case 'value':
        if (newValue !== null) {
          this.value = newValue;
        } else {
          this.value = '';
        }
        break;
    }
  }

  // ============================================================
  // Internal sync
  // ============================================================

  #syncAll(): void {
    this.#syncNormalizedAttributes();
    this.#syncCalendarVisibility();
    this.#syncDisabled();
    this.#syncReadonly();
    this.#syncCalendarRange();
    this.#syncValidationA11y();

    // 初期値
    const valueAttr = this.getAttribute('value');
    if (valueAttr) {
      this.value = valueAttr;
    } else {
      this.#syncFormValue();
    }
  }

  #syncNormalizedAttributes(): void {
    // data-type
    const typeAttr = this.getAttribute('data-type');
    const type = isValidType(typeAttr) ? typeAttr : 'consolidated';
    if (typeAttr !== type) this.setAttribute('data-type', type);

    // size
    const sizeAttr = this.getAttribute('size');
    const size = isValidSize(sizeAttr) ? sizeAttr : 'md';
    if (sizeAttr !== size) this.setAttribute('size', size);
  }

  #syncDisabled(): void {
    const isDisabled = this.#isDisabled();
    const inputs = [this.#yearInput, this.#monthInput, this.#dayInput];
    for (const input of inputs) {
      if (input) input.disabled = isDisabled;
    }

    if (this.#inputs) {
      this.#inputs.toggleAttribute('data-disabled', isDisabled);
    }

    // disabled時はカレンダー操作不可
    this.#syncCalendarButtonDisabled();

    if (isDisabled) {
      this.#closeCalendar({ restoreFocus: false });
    }
  }

  #syncReadonly(): void {
    const isReadonly = this.hasAttribute('readonly');
    const inputs = [this.#yearInput, this.#monthInput, this.#dayInput];
    for (const input of inputs) {
      if (input) input.readOnly = isReadonly;
    }

    if (this.#inputs) {
      this.#inputs.toggleAttribute('data-readonly', isReadonly);
    }

    this.#syncCalendarButtonDisabled();

    if (isReadonly) {
      this.#closeCalendar({ restoreFocus: false });
    }
  }

  #syncCalendarButtonDisabled(): void {
    if (!this.#calendarButton) return;
    this.#calendarButton.disabled = this.#isDisabled() || this.hasAttribute('readonly');
  }

  #syncCalendarVisibility(): void {
    const enabled = this.hasAttribute('calendar');
    if (!this.#calendarButton || !this.#calendarPopover) return;

    this.#calendarButton.style.display = enabled ? '' : 'none';
    if (!enabled) {
      this.#closeCalendar({ restoreFocus: false });
    }
  }

  #syncCalendarRange(): void {
    const calendar = this.#calendar;
    if (!calendar) return;

    const min = this.getAttribute('min-date');
    const max = this.getAttribute('max-date');
    if (min) calendar.setAttribute('min-date', min);
    else calendar.removeAttribute('min-date');
    if (max) calendar.setAttribute('max-date', max);
    else calendar.removeAttribute('max-date');
  }

  #syncValidationA11y(): void {
    const hasError = this.hasAttribute('error');

    updateErrorFallback(
      this.#errorSlot,
      this.#errorText,
      this.#errorFallback,
      this.getAttribute('error-text'),
      hasError
    );

    const inputs = [this.#yearInput, this.#monthInput, this.#dayInput];
    for (const input of inputs) {
      if (!input) continue;
      if (hasError) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    this.#syncAriaDescribedBy();
  }

  #syncAriaDescribedBy(): void {
    const external = this.getAttribute('aria-describedby') ?? '';
    const externalIds = external.split(' ').map((s) => s.trim()).filter(Boolean);

    this.#syncExternalAriaDescribedByProxies(externalIds);

    const ids = new Set<string>();
    for (const id of externalIds) ids.add(id);

    const hasError = this.hasAttribute('error');
    const errorVisible = this.#errorText?.style.display !== 'none';
    if (hasError && errorVisible) ids.add('error-text');

    const describedBy = ids.size > 0 ? Array.from(ids).join(' ') : '';
    const inputs = [this.#yearInput, this.#monthInput, this.#dayInput];
    for (const input of inputs) {
      if (!input) continue;
      if (describedBy) input.setAttribute('aria-describedby', describedBy);
      else input.removeAttribute('aria-describedby');
    }
  }

  #refreshExternalAriaDescribedByProxies(): void {
    const external = this.getAttribute('aria-describedby') ?? '';
    const externalIds = external.split(' ').map((s) => s.trim()).filter(Boolean);
    this.#syncExternalAriaDescribedByProxies(externalIds);
  }

  #syncExternalAriaDescribedByProxies(externalIds: string[]): void {
    const root = this.#describedByProxies;
    const shadow = this.shadowRoot;
    if (!root || !shadow) return;

    const desired = new Set(externalIds);

    for (const child of Array.from(root.children)) {
      const id = (child as HTMLElement).id;
      if (!id || !desired.has(id)) child.remove();
    }

    for (const id of desired) {
      const existing = shadow.getElementById(id);
      if (existing && !root.contains(existing)) continue;

      let proxy = (existing as HTMLElement | null) ?? null;
      if (!proxy) {
        proxy = document.createElement('span');
        proxy.id = id;
        root.appendChild(proxy);
      }

      const source = document.getElementById(id);
      proxy.textContent = source?.textContent ?? '';
    }
  }

  #getInputYearMonth(): { year: number; month: number } | null {
    if (!this.#yearInput || !this.#monthInput) return null;
    const year = parseDigits(this.#yearInput.value, /^\d{4}$/);
    const month = parseDigits(this.#monthInput.value, /^\d{1,2}$/);
    if (year === null || month === null) return null;
    return { year, month };
  }

  #getInputYearMonthDay(): { year: number; month: number; day: number } | null {
    if (!this.#dayInput) return null;
    const ym = this.#getInputYearMonth();
    if (!ym) return null;
    const day = parseDigits(this.#dayInput.value, /^\d{1,2}$/);
    if (day === null) return null;
    return { ...ym, day };
  }

  #syncFormValue(): void {
    const v = this.#computeIsoValue();
    this._internals.setFormValue(v ? v : null);
  }

  #computeIsoValue(): string {
    const ymd = this.#getInputYearMonthDay();
    if (!ymd) return '';
    return toIsoDateOrEmpty(ymd.year, ymd.month, ymd.day);
  }

  // ============================================================
  // Events
  // ============================================================

  #setupEventListeners(): void {
    const subscribe = (
      el: Element | null,
      type: string,
      handler: (e: Event) => void,
      options?: AddEventListenerOptions | boolean
    ): void => {
      if (!el) return;
      el.addEventListener(type, handler, options);
      this.#subscriptions.push(() => el.removeEventListener(type, handler, options));
    };

    const inputs = [this.#yearInput, this.#monthInput, this.#dayInput];
    for (const input of inputs) {
      subscribe(input, 'input', this.#handleInput);
      subscribe(input, 'change', this.#handleChange);
      subscribe(input, 'keydown', this.#handleInputKeydown);
      subscribe(input, 'focusin', this.#handleInputFocusIn);
    }

    // カレンダー関連
    subscribe(this, 'date-selected', this.#handleDateSelected as (e: Event) => void);
    subscribe(this.#calendarButton, 'click', () => this.#toggleCalendar());
    subscribe(this.#backdrop, 'click', () => this.#closeCalendar());
    subscribe(this.#calendarPopover, 'keydown', this.#handlePopoverKeydown);
  }

  #handleInputFocusIn = (): void => {
    this.#refreshExternalAriaDescribedByProxies();
  };

  #handleInput = (): void => {
    this.#syncFormValue();
    this.emitEvent('dads-input', { value: this.value });
  };

  #handleChange = (): void => {
    this.#syncFormValue();
    this.emitEvent('dads-change', { value: this.value });
  };

  #handleDateSelected = (e: Event): void => {
    const ev = e as CustomEvent<{ date: MaybeDate }>;
    const date = ev.detail?.date ?? null;

    this.#syncToInputs(date);
    this.#syncFormValue();
    this.emitEvent('dads-change', { value: this.value });
    this.#closeCalendar();
  };

  #handleInputKeydown = (e: Event): void => {
    if (!this.#isConsolidated()) return;

    const ke = e as KeyboardEvent;
    if (ke.key !== 'ArrowLeft' && ke.key !== 'ArrowRight') return;

    const target = ke.target;
    if (!(target instanceof HTMLInputElement)) return;

    const caret = target.selectionStart ?? 0;
    const atStart = caret === 0;
    const atEnd = caret === target.value.length;

    if (ke.key === 'ArrowLeft' && atStart) {
      ke.preventDefault();
      this.#focusPreviousField(target);
      return;
    }

    if (ke.key === 'ArrowRight' && atEnd) {
      ke.preventDefault();
      this.#focusNextField(target);
    }
  };

  #focusPreviousField(current: HTMLInputElement): void {
    if (current === this.#monthInput) {
      this.#yearInput?.focus();
    } else if (current === this.#dayInput) {
      this.#monthInput?.focus();
    }
  }

  #focusNextField(current: HTMLInputElement): void {
    if (current === this.#yearInput) {
      this.#monthInput?.focus();
    } else if (current === this.#monthInput) {
      this.#dayInput?.focus();
    }
  }

  // ============================================================
  // Calendar
  // ============================================================

  #toggleCalendar(): void {
    if (!this.hasAttribute('calendar')) return;
    if (this.#isCalendarOpen()) this.#closeCalendar();
    else this.#openCalendar();
  }

  #openCalendar(): void {
    if (this.#isDisabled() || this.hasAttribute('readonly')) return;
    if (!this.#calendarPopover || !this.#calendarButton) return;

    this.#refreshExternalAriaDescribedByProxies();

    // カレンダーコンポーネントのPublic APIを型安全に参照
    const calendar = this.#calendar as (HTMLElement & DadsCalendarPublicAPI) | null;

    if (calendar) {
      const ymd = this.#getInputYearMonthDay();
      if (ymd) {
        const iso = toIsoDateOrEmpty(ymd.year, ymd.month, ymd.day);
        calendar.setSelectedDate(iso ? new Date(ymd.year, ymd.month - 1, ymd.day) : null);
      } else {
        calendar.setSelectedDate(null);
      }

      const ym = this.#getInputYearMonth();
      if (ym && ym.month >= 1 && ym.month <= 12) {
        calendar.setDisplayMonth(ym.year, ym.month - 1);
      }
    }

    this.#calendarPopover.style.display = 'block';
    this.#calendarButton.setAttribute('aria-expanded', 'true');
    calendar?.focus?.();
  }

  #closeCalendar(options: { restoreFocus?: boolean } = {}): void {
    if (!this.#calendarPopover || !this.#calendarButton) return;
    const wasOpen = this.#isCalendarOpen();
    this.#calendarPopover.style.display = 'none';
    this.#calendarButton.setAttribute('aria-expanded', 'false');

    const restoreFocus = options.restoreFocus ?? true;
    if (!wasOpen || !restoreFocus) return;
    if (this.#calendarButton.disabled) return;
    if (this.#calendarButton.style.display === 'none') return;

    this.#calendarButton.focus();
  }

  #handlePopoverKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;

    if (ke.key === 'Escape') {
      ke.preventDefault();
      this.#closeCalendar();
      return;
    }

    if (ke.key !== 'Tab') return;

    const focusables = this.#getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const [firstInPath] = typeof ke.composedPath === 'function' ? ke.composedPath() : [];
    const active =
      (firstInPath instanceof HTMLElement ? firstInPath : null) ?? this.#getDeepActiveElement();

    if (ke.shiftKey) {
      if (active === first) {
        ke.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      ke.preventDefault();
      first.focus();
    }
  };

  #getFocusableElements(): HTMLElement[] {
    const root = this.#calendarPopover;
    if (!root) return [];

    // Shadow DOM内の実フォーカス要素（例: <dads-button> 内部の <button>）も含めて取得する
    // これにより Tab / Shift+Tab のフォーカストラップ判定が安定する
    const isTabbable = (el: Element): el is HTMLElement => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.hasAttribute('hidden')) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;

      // disabled / aria-disabled
      if (
        el instanceof HTMLButtonElement ||
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        if (el.disabled) return false;
      } else {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
      }

      const isNativelyFocusable = el.matches('button,input,select,textarea,a[href]');
      const tabIndexAttr = el.getAttribute('tabindex');

      // 通常のdiv/span等は除外（tabindex属性が付いているものだけを対象にする）
      if (!isNativelyFocusable && tabIndexAttr === null) return false;

      // tabindex が明示されている場合はそれを優先（Shadow DOM / テスト環境差異の影響を避ける）
      if (tabIndexAttr !== null) {
        const normalized = tabIndexAttr.trim();
        if (normalized === '') return true; // tabindex="" は 0 扱い
        const parsed = Number.parseInt(normalized, 10);
        return !Number.isNaN(parsed) && parsed >= 0;
      }

      // natively focusable は tabindex 指定なしでも Tab 対象
      return isNativelyFocusable;
    };

    const out: HTMLElement[] = [];

    const walk = (node: ParentNode): void => {
      for (const child of node.children) {
        if (isTabbable(child)) out.push(child);
        if (child instanceof HTMLElement && child.shadowRoot) walk(child.shadowRoot);
        walk(child);
      }
    };

    walk(root);

    return out;
  }

  #getDeepActiveElement(): HTMLElement | null {
    // document.activeElement は Shadow DOM 内部の場合、ホスト要素にリターゲットされる
    // そのため、shadowRoot.activeElement を辿って実際の要素を取得する
    let active: Element | null = this.shadowRoot?.activeElement ?? document.activeElement;
    while (active && active instanceof HTMLElement && active.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
  }

  // ============================================================
  // Inputs sync
  // ============================================================

  #syncToInputs(date: MaybeDate): void {
    if (!this.#yearInput || !this.#monthInput || !this.#dayInput) return;

    if (!date) {
      this.#clearInputs();
      return;
    }

    this.#yearInput.value = String(date.getFullYear()).padStart(4, '0');
    this.#monthInput.value = String(date.getMonth() + 1).padStart(2, '0');
    this.#dayInput.value = String(date.getDate()).padStart(2, '0');
  }

  #clearInputs(): void {
    if (this.#yearInput) this.#yearInput.value = '';
    if (this.#monthInput) this.#monthInput.value = '';
    if (this.#dayInput) this.#dayInput.value = '';
  }

  #isCalendarOpen(): boolean {
    return this.#calendarButton?.getAttribute('aria-expanded') === 'true';
  }

  #isConsolidated(): boolean {
    return this.getAttribute('data-type') === 'consolidated';
  }

  #isDisabled(): boolean {
    return this.hasAttribute('disabled') || this.#formDisabled;
  }

  #ensureCalendarElement(prefix: string): void {
    const expectedName = `${prefix}-calendar`;
    const current = this.#calendar;
    const popover = this.#calendarPopover;
    if (!popover) return;

    if (current && current.localName === expectedName) return;

    // 既存のcalendar要素を置き換え（prefixが変更された場合に対応）
    const replacement = document.createElement(expectedName) as HTMLElement;
    replacement.setAttribute('part', 'calendar');
    replacement.id = 'calendar';

    if (current && current.parentNode) {
      current.parentNode.replaceChild(replacement, current);
    } else {
      popover.appendChild(replacement);
    }

    this.#calendar = replacement;
  }
}
