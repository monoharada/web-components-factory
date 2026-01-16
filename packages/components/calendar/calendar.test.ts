/**
 * DadsCalendarコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsCalendar - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成され、年セレクトとテーブルが含まれる', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    element.setAttribute('min-date', '2024-01-01');
    element.setAttribute('max-date', '2024-12-31');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();

    const yearSelect = getShadowContent(element, '[part="year-select"]');
    expect(yearSelect).toBeInTheDocument();
    expect((yearSelect as HTMLSelectElement).tagName.toLowerCase()).toBe('select');

    const table = getShadowContent(element, '[part="table"]');
    expect(table).toBeInTheDocument();
    expect(table?.tagName.toLowerCase()).toBe('table');
  });

  it('操作ボタンはdads-button（secondary/tertiary）で実装される', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    await waitForCustomElement(element);

    const prev = getShadowContent(element, '#prev-month-button') as HTMLElement | null;
    const next = getShadowContent(element, '#next-month-button') as HTMLElement | null;
    const del = getShadowContent(element, '#delete-button') as HTMLElement | null;
    const today = getShadowContent(element, '#today-button') as HTMLElement | null;

    expect(prev).toBeInTheDocument();
    expect(next).toBeInTheDocument();
    expect(del).toBeInTheDocument();
    expect(today).toBeInTheDocument();

    expect(prev?.tagName.toLowerCase()).toBe('dads-button');
    expect(next?.tagName.toLowerCase()).toBe('dads-button');
    expect(del?.tagName.toLowerCase()).toBe('dads-button');
    expect(today?.tagName.toLowerCase()).toBe('dads-button');

    expect(prev?.getAttribute('variant')).toBe('secondary');
    expect(next?.getAttribute('variant')).toBe('secondary');
    expect(today?.getAttribute('variant')).toBe('secondary');
    expect(del?.getAttribute('variant')).toBe('tertiary');
  });
});

describe('DadsCalendar - 日付選択', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('日付ボタンのクリックで date-selected が発火し、detail.date が渡される', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    element.setAttribute('min-date', '2024-01-01');
    element.setAttribute('max-date', '2024-12-31');
    await waitForCustomElement(element);

    const calendar = element as unknown as {
      setDisplayMonth: (year: number, monthIndex0: number) => void;
    };
    calendar.setDisplayMonth(2024, 0);

    let selected: Date | null = null;
    element.addEventListener('date-selected', (e) => {
      const ev = e as CustomEvent<{ date: Date | null }>;
      selected = ev.detail.date;
    });

    const btn = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="15"]'
    ) as HTMLButtonElement | null;

    expect(btn).toBeTruthy();
    btn?.click();

    expect(selected).toBeInstanceOf(Date);
    expect(selected?.getFullYear()).toBe(2024);
    expect(selected?.getMonth()).toBe(0);
    expect(selected?.getDate()).toBe(15);
  });
});

describe('DadsCalendar - 期間選択（range）', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('range属性で開始日/終了日とサポートテキストが表示される', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    element.setAttribute('range', '');
    await waitForCustomElement(element);

    const range = getShadowContent(element, '#range') as HTMLElement | null;
    const support = getShadowContent(element, '#range-support') as HTMLElement | null;
    const start = getShadowContent(element, '#range-start') as HTMLElement | null;
    const end = getShadowContent(element, '#range-end') as HTMLElement | null;

    expect(range).toBeInTheDocument();
    expect(range?.hasAttribute('hidden')).toBe(false);
    expect(support?.textContent).toBe('開始日を選択してください。');
    expect(start?.textContent).toBe('未選択');
    expect(end?.textContent).toBe('未選択');
  });

  it('開始日→終了日の順に選択すると、表示と読み上げ用テキストが更新される', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    element.setAttribute('range', '');
    element.setAttribute('min-date', '2024-01-01');
    element.setAttribute('max-date', '2024-12-31');
    await waitForCustomElement(element);

    const calendar = element as unknown as {
      setDisplayMonth: (year: number, monthIndex0: number) => void;
    };
    calendar.setDisplayMonth(2024, 0);

    const startBtn = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="10"]'
    ) as HTMLButtonElement | null;
    expect(startBtn).toBeTruthy();
    startBtn?.click();

    const supportAfterStart = getShadowContent(element, '#range-support') as HTMLElement | null;
    const startText = getShadowContent(element, '#range-start') as HTMLElement | null;
    const liveAfterStart = getShadowContent(element, '#range-live') as HTMLElement | null;

    const expectedStart = new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(2024, 0, 10));

    expect(supportAfterStart?.textContent).toBe('終了日をお選びください。');
    expect(startText?.textContent).toBe(expectedStart);
    expect(liveAfterStart?.textContent).toContain('開始日として');

    const endBtn = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="15"]'
    ) as HTMLButtonElement | null;
    expect(endBtn).toBeTruthy();
    endBtn?.click();

    const supportAfterEnd = getShadowContent(element, '#range-support') as HTMLElement | null;
    const endText = getShadowContent(element, '#range-end') as HTMLElement | null;
    const liveAfterEnd = getShadowContent(element, '#range-live') as HTMLElement | null;

    const expectedEnd = new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(2024, 0, 15));

    const inRangeBtn = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="12"]'
    ) as HTMLButtonElement | null;
    expect(inRangeBtn).toBeTruthy();
    expect(inRangeBtn?.getAttribute('aria-label')).toContain('期間内');
    const inRangeCell = inRangeBtn?.closest('td');
    expect(inRangeCell?.hasAttribute('data-in-range')).toBe(true);

    expect(supportAfterEnd?.textContent).toBe('開始日と終了日を選択しました。');
    expect(endText?.textContent).toBe(expectedEnd);
    expect(liveAfterEnd?.textContent).toContain('終了日として');
  });

  it('rangeモードでは date-range-selected が発火し、開始日/終了日が渡される', async () => {
    const { defineCalendar } = await import('./calendar-define.js');
    defineCalendar();

    element = createTestElement('dads-calendar');
    element.setAttribute('range', '');
    element.setAttribute('min-date', '2024-01-01');
    element.setAttribute('max-date', '2024-12-31');
    await waitForCustomElement(element);

    const calendar = element as unknown as {
      setDisplayMonth: (year: number, monthIndex0: number) => void;
    };
    calendar.setDisplayMonth(2024, 0);

    let payload: { startDate: Date | null; endDate: Date | null } | null = null;
    element.addEventListener('date-range-selected', (e) => {
      const ev = e as CustomEvent<{ startDate: Date | null; endDate: Date | null }>;
      payload = ev.detail;
    });

    const btn = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="12"]'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn?.click();

    expect(payload?.startDate).toBeInstanceOf(Date);
    expect(payload?.endDate).toBeNull();

    const btn2 = element.shadowRoot?.querySelector(
      'button[data-year="2024"][data-month="0"][data-date="18"]'
    ) as HTMLButtonElement | null;
    expect(btn2).toBeTruthy();
    btn2?.click();

    expect(payload?.startDate).toBeInstanceOf(Date);
    expect(payload?.endDate).toBeInstanceOf(Date);
  });
});

describe('DadsCalendar - a11yAnnotations', () => {
  it('calloutsが主要な操作要素を含む', async () => {
    const { DadsCalendar } = await import('./calendar.js');

    const ids = DadsCalendar.a11yAnnotations.callouts.map((c) => c.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        'year-select',
        'calendar-table',
        'prev-month-button',
        'next-month-button',
        'current-month',
        'date-button',
        'delete-button',
        'today-button',
        'range',
        'range-support',
        'range-live',
      ])
    );
  });
});
