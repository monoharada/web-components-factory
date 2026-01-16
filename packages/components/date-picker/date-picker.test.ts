/**
 * DadsDatePickerコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsDatePicker - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在し、デフォルト属性が設定される', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
    expect(element.shadowRoot).toBeTruthy();
    expect(element.getAttribute('data-type')).toBe('consolidated');
    expect(element.getAttribute('size')).toBe('md');
  });

  it('年/月/日のinputが含まれる', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;

    expect(year?.tagName.toLowerCase()).toBe('input');
    expect(month?.tagName.toLowerCase()).toBe('input');
    expect(day?.tagName.toLowerCase()).toBe('input');
  });
});

describe('DadsDatePicker - 状態', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('readonly属性でinputがreadOnlyになり、カレンダーボタンが無効化される', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('readonly', '');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;

    expect(year?.readOnly).toBe(true);
    expect(month?.readOnly).toBe(true);
    expect(day?.readOnly).toBe(true);
    expect(button?.disabled).toBe(true);
  });

  it('disabled属性でinputがdisabledになり、カレンダーボタンが無効化される', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('disabled', '');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;

    expect(year?.disabled).toBe(true);
    expect(month?.disabled).toBe(true);
    expect(day?.disabled).toBe(true);
    expect(button?.disabled).toBe(true);
  });
});

describe('DadsDatePicker - カレンダー連携', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('カレンダーボタンでポップオーバーが開閉する', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;
    const backdrop = getShadowContent(element, '#backdrop') as HTMLElement | null;

    expect(button).toBeTruthy();
    expect(popover).toBeTruthy();
    expect(backdrop).toBeTruthy();

    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(popover?.style.display).toBe('none');

    button?.click();
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(popover?.style.display).toBe('block');

    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(popover?.style.display).toBe('none');
  });

  it('date-selected を受け取ると入力へ反映され、ポップオーバーが閉じる', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;
    button?.click();

    // date-selected（bubbles）をdate-picker自身で受け取る
    element.dispatchEvent(
      new CustomEvent('date-selected', {
        detail: { date: new Date(2024, 0, 2) },
        bubbles: true,
        composed: true,
      })
    );

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;

    expect(year?.value).toBe('2024');
    expect(month?.value).toBe('01');
    expect(day?.value).toBe('02');

    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(popover?.style.display).toBe('none');
  });
});

describe('DadsDatePicker - a11yAnnotations', () => {
  it('calloutsが主要な操作要素を含む', async () => {
    const { DadsDatePicker } = await import('./date-picker.js');

    const ids = DadsDatePicker.a11yAnnotations.callouts.map((c) => c.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        'inputs',
        'year-input',
        'month-input',
        'day-input',
        'calendar-button',
        'calendar-popover',
        'calendar',
        'error-text',
      ])
    );
  });
});
