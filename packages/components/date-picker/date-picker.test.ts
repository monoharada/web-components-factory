/**
 * DadsDatePickerコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
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

describe('DadsDatePicker - a11y（ARIA属性）', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('カレンダーポップオーバーが dialog として適切な属性を持つ', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;

    expect(button?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button?.getAttribute('aria-controls')).toBe('calendar-popover');
    expect(button?.getAttribute('aria-expanded')).toBe('false');

    expect(popover?.getAttribute('role')).toBe('dialog');
    expect(popover?.getAttribute('aria-modal')).toBe('true');
    expect(popover?.getAttribute('aria-label')).toBe('カレンダー');
  });

  it('error属性でinputに aria-invalid と aria-describedby が反映される', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    const external = document.createElement('div');
    external.id = 'external-desc';
    external.textContent = '外部の説明テキスト';
    document.body.appendChild(external);

    element = createTestElement('dads-date-picker');
    element.setAttribute('error', '');
    element.setAttribute('error-text', '入力に誤りがあります');
    element.setAttribute('aria-describedby', 'external-desc');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    const errorText = getShadowContent(element, '#error-text') as HTMLElement | null;

    for (const input of [year, month, day]) {
      expect(input?.getAttribute('aria-invalid')).toBe('true');
      const describedBy = (input?.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
      expect(describedBy).toEqual(expect.arrayContaining(['external-desc', 'error-text']));
    }
    expect(errorText?.style.display).not.toBe('none');

    const proxy = getShadowContent(element, '#external-desc') as HTMLElement | null;
    expect(proxy?.textContent).toBe('外部の説明テキスト');

    external.remove();
  });
});

describe('DadsDatePicker - キーボード（入力フィールドの左右移動）', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('Consolidated: caret末尾でArrowRightすると次フィールドへフォーカス移動する', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    expect(year).toBeTruthy();
    expect(month).toBeTruthy();
    expect(day).toBeTruthy();

    year!.value = '2024';
    month!.value = '01';
    day!.value = '02';

    year!.setSelectionRange(year!.value.length, year!.value.length);
    const focusMonth = vi.spyOn(month!, 'focus');
    year!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(focusMonth).toHaveBeenCalledTimes(1);

    month!.setSelectionRange(month!.value.length, month!.value.length);
    const focusDay = vi.spyOn(day!, 'focus');
    month!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(focusDay).toHaveBeenCalledTimes(1);
  });

  it('Consolidated: caret先頭でArrowLeftすると前フィールドへフォーカス移動する', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    expect(year).toBeTruthy();
    expect(month).toBeTruthy();
    expect(day).toBeTruthy();

    year!.value = '2024';
    month!.value = '01';
    day!.value = '02';

    day!.setSelectionRange(0, 0);
    const focusMonth = vi.spyOn(month!, 'focus');
    day!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    expect(focusMonth).toHaveBeenCalledTimes(1);

    month!.setSelectionRange(0, 0);
    const focusYear = vi.spyOn(year!, 'focus');
    month!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    expect(focusYear).toHaveBeenCalledTimes(1);
  });

  it('Separated: 左右キーでフォーカス移動を行わない', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('data-type', 'separated');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    expect(year).toBeTruthy();
    expect(month).toBeTruthy();

    year!.value = '2024';
    year!.setSelectionRange(year!.value.length, year!.value.length);

    const focusMonth = vi.spyOn(month!, 'focus');
    year!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(focusMonth).toHaveBeenCalledTimes(0);
  });
});

describe('DadsDatePicker - キーボード（フォーカストラップ）', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('末尾要素でTabすると先頭要素へ移動する（Shadow DOM内のボタンも対象）', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    expect(button).toBeTruthy();
    button?.click();

    const calendar = getShadowContent(element, '#calendar') as HTMLElement | null;
    expect(calendar?.shadowRoot).toBeTruthy();
    await waitForCustomElement(calendar as HTMLElement);

    const yearSelect = calendar?.shadowRoot?.querySelector('#year-select') as HTMLSelectElement | null;
    const todayHost = calendar?.shadowRoot?.querySelector('#today-button') as HTMLElement | null;
    expect(yearSelect).toBeTruthy();
    expect(todayHost).toBeTruthy();
    await waitForCustomElement(todayHost as HTMLElement);

    const todayInner = todayHost?.shadowRoot?.querySelector('[part="base"]') as HTMLElement | null;
    expect(todayInner).toBeTruthy();

    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;
    expect(popover).toBeTruthy();

    const focusSpy = vi.spyOn(yearSelect as HTMLSelectElement, 'focus');
    focusSpy.mockClear();
    const ke = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true });
    Object.defineProperty(ke, 'composedPath', { value: () => [todayInner] });
    popover?.dispatchEvent(ke);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('Escapeでポップオーバーが閉じ、トリガーボタンへフォーカスが戻る', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;
    expect(button).toBeTruthy();
    expect(popover).toBeTruthy();

    const focusSpy = vi.spyOn(button as HTMLButtonElement, 'focus');

    button?.click();
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(popover?.style.display).toBe('block');
    focusSpy.mockClear();

    popover?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    );

    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(popover?.style.display).toBe('none');
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('先頭要素でShift+Tabすると末尾要素へ移動する（Shadow DOM内のボタンも対象）', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    element.setAttribute('calendar', '');
    await waitForCustomElement(element);

    const button = getShadowContent(element, '#calendar-button') as HTMLButtonElement | null;
    expect(button).toBeTruthy();
    button?.click();

    const calendar = getShadowContent(element, '#calendar') as HTMLElement | null;
    expect(calendar?.shadowRoot).toBeTruthy();
    await waitForCustomElement(calendar as HTMLElement);

    const yearSelect = calendar?.shadowRoot?.querySelector('#year-select') as HTMLSelectElement | null;
    const todayHost = calendar?.shadowRoot?.querySelector('#today-button') as HTMLElement | null;
    expect(yearSelect).toBeTruthy();
    expect(todayHost).toBeTruthy();
    await waitForCustomElement(todayHost as HTMLElement);

    const todayInner = todayHost?.shadowRoot?.querySelector('[part="base"]') as HTMLElement | null;
    expect(todayInner).toBeTruthy();

    const focusSpy = vi.spyOn(todayInner as HTMLElement, 'focus');
    focusSpy.mockClear();
    const popover = getShadowContent(element, '#calendar-popover') as HTMLElement | null;
    expect(popover).toBeTruthy();
    const ke = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, composed: true });
    Object.defineProperty(ke, 'composedPath', { value: () => [yearSelect] });
    popover?.dispatchEvent(ke);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});

describe('DadsDatePicker - 入力パース（4桁年必須）', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('年が4桁でない場合は value を生成しない', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    expect(year).toBeTruthy();
    expect(month).toBeTruthy();
    expect(day).toBeTruthy();

    year!.value = '24';
    month!.value = '01';
    day!.value = '02';
    expect((element as unknown as { value: string }).value).toBe('');
  });

  it('数字以外を含む場合は value を生成しない', async () => {
    const { defineDatePicker } = await import('./date-picker-define.js');
    defineDatePicker();

    element = createTestElement('dads-date-picker');
    await waitForCustomElement(element);

    const year = getShadowContent(element, '#year-input') as HTMLInputElement | null;
    const month = getShadowContent(element, '#month-input') as HTMLInputElement | null;
    const day = getShadowContent(element, '#day-input') as HTMLInputElement | null;
    expect(year).toBeTruthy();
    expect(month).toBeTruthy();
    expect(day).toBeTruthy();

    year!.value = '2024a';
    month!.value = '01';
    day!.value = '02';
    expect((element as unknown as { value: string }).value).toBe('');
  });
});
