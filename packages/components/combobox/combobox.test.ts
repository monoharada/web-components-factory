/**
 * DadsCombobox コンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

const baseOptions = `
  <option value="tokyo">東京都</option>
  <option value="osaka">大阪府</option>
  <option value="fukuoka">福岡県</option>
`;

async function defineComboboxForTest(): Promise<void> {
  const { defineCombobox } = await import('./combobox-define.js');
  defineCombobox();
}

function getInput(host: HTMLElement): HTMLInputElement {
  const input = getShadowContent(host, '#input') as HTMLInputElement | null;
  if (!input) throw new Error('input not found');
  return input;
}

function getControl(host: HTMLElement): HTMLElement {
  const control = getShadowContent(host, '#control') as HTMLElement | null;
  if (!control) throw new Error('control not found');
  return control;
}

function getOptions(host: HTMLElement): HTMLElement[] {
  return Array.from(host.shadowRoot?.querySelectorAll('[part="option"]') ?? []) as HTMLElement[];
}

function getSearchInput(host: HTMLElement): HTMLInputElement {
  const input = getShadowContent(host, '[part="search-input"]') as HTMLInputElement | null;
  if (!input) throw new Error('search input not found');
  return input;
}

function getChipActionButtons(host: HTMLElement): HTMLButtonElement[] {
  const chips = Array.from(host.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []) as HTMLElement[];
  return chips
    .map((chip) => chip.shadowRoot?.querySelector('[part="action"]') as HTMLButtonElement | null)
    .filter((button): button is HTMLButtonElement => button instanceof HTMLButtonElement);
}

function waitMicrotask(): Promise<void> {
  return new Promise<void>((resolve) => queueMicrotask(resolve));
}

describe('DadsCombobox - API契約', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルト属性が設定される', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    expect(element.getAttribute('mode')).toBe('single');
    expect(element.hasAttribute('filterable')).toBe(true);
    expect(element.hasAttribute('clear-on-close')).toBe(true);
    expect(element.hasAttribute('restore-on-cancel')).toBe(true);
    expect(element.getAttribute('size')).toBe('md');
  });

  it('singleモードでplaceholder未指定時は既定文言を表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    expect(input.placeholder).toBe('選択してください');
  });

  it('明示確定時のみ dads-change を発火する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const events: CustomEvent[] = [];
    element.addEventListener('dads-change', (e) => events.push(e as CustomEvent));

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    input.value = '東';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await waitMicrotask();

    expect(events.length).toBe(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    expect(events.length).toBe(1);
  });
});

describe('DadsCombobox - 分岐補強', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('valueプロパティはmode=multipleで配列と文字列を正規化する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const host = element as unknown as { value: unknown };
    host.value = ['tokyo', '', 'unknown', 123 as unknown as string, 'osaka'] as unknown as string[];
    await waitMicrotask();
    expect(host.value).toEqual(['tokyo', 'osaka']);
    expect(element.getAttribute('value')).toBe('tokyo,osaka');

    host.value = 'fukuoka,unknown';
    await waitMicrotask();
    expect(host.value).toEqual(['fukuoka']);
    expect(element.getAttribute('value')).toBe('fukuoka');
  });

  it('formStateRestoreCallbackとmode正規化はsingle/multipleで整合する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const host = element as unknown as {
      value: unknown;
      formStateRestoreCallback: (state: unknown, mode: unknown) => void;
    };

    host.formStateRestoreCallback('tokyo,fukuoka', null);
    await waitMicrotask();
    expect(host.value).toEqual(['tokyo', 'fukuoka']);

    host.formStateRestoreCallback(123, null);
    await waitMicrotask();
    expect(host.value).toEqual(['tokyo', 'fukuoka']);

    element.setAttribute('mode', 'invalid');
    await waitMicrotask();
    expect(element.getAttribute('mode')).toBe('single');

    host.formStateRestoreCallback('osaka', null);
    await waitMicrotask();
    expect(host.value).toBe('osaka');

    host.value = ['fukuoka'] as unknown as string[];
    await waitMicrotask();
    expect(host.value).toBe('fukuoka');

    host.value = 'unknown';
    await waitMicrotask();
    expect(host.value).toBe('');
    expect(element.getAttribute('value')).toBeNull();
  });

  it('filterable無効時は検索入力を描画せずArrowUp/Home/Endでアクティブ行を移動できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        <option value="tokyo" disabled>東京都</option>
        <option value="osaka">大阪府</option>
        <option value="fukuoka">福岡県</option>
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    element.removeAttribute('filterable');
    await waitMicrotask();

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
    expect(element.shadowRoot?.querySelector('[part="search-input"]')).toBeNull();

    let options = getOptions(element);
    expect(options[2]?.getAttribute('data-active')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await waitMicrotask();
    options = getOptions(element);
    expect(options[1]?.getAttribute('data-active')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await waitMicrotask();
    options = getOptions(element);
    expect(options[2]?.getAttribute('data-active')).toBe('true');
  });

  it('検索結果が0件のときTab/ArrowDownしても空状態を維持する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.value = '一致しない';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect(getOptions(element).length).toBe(0);
    expect(element.shadowRoot?.querySelector('[part="empty"]')).not.toBeNull();

    const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    searchInput.dispatchEvent(arrowDown);
    await waitMicrotask();
    expect(element.shadowRoot?.querySelector('[part="empty"]')).not.toBeNull();

    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const dispatchResult = searchInput.dispatchEvent(tab);
    await waitMicrotask();
    expect(dispatchResult).toBe(true);
  });

  it('無効化された候補はクリックしても選択しない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        <option value="tokyo" disabled>東京都</option>
        <option value="osaka">大阪府</option>
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    const options = getOptions(element);
    options[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toBe('');
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('multipleモードでactive未設定のEnterはヘッダー開閉にフォールバックする', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });
});

describe('DadsCombobox - 拘束条件', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('close時にqueryをクリアする（Escape）', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    input.value = '東';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect(getOptions(element).length).toBe(1);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();
    expect(getOptions(element).length).toBe(3);
  });

  it('close時にqueryをクリアする（Esc）', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    input.value = '東';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(getOptions(element).length).toBe(1);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();
    expect(getOptions(element).length).toBe(3);
  });

  it('singleモードで未確定離脱すると既存選択へ復帰する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    expect((element as HTMLElement & { value?: unknown }).value).toBe('osaka');

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    input.value = '東';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(getOptions(element).length).toBe(1);

    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    outside.remove();
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toBe('osaka');
    expect(input.value).toContain('大阪府');
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('singleの選択表示中に再入力開始してもqueryが連結されない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    expect(input.value).toContain('大阪府');

    input.focus();
    input.value = `${input.value}f`;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const options = getOptions(element);
    expect(options.length).toBe(1);
    expect(options[0]?.textContent ?? '').toContain('福岡県');
  });

  it('singleモードの展開時はチェックボックスを表示せず検索入力を表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const checks = Array.from(element.shadowRoot?.querySelectorAll('[part="option-check"]') ?? []);
    expect(checks.length).toBe(0);
    expect(getSearchInput(element)).toBeInstanceOf(HTMLInputElement);
  });

  it('singleモードは検索入力で絞り込み、選択後に閉じて再展開で選択状態を維持する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.value = '福';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const filtered = getOptions(element);
    expect(filtered.length).toBe(1);
    expect(filtered[0]?.textContent ?? '').toContain('福岡県');

    filtered[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    const selected = getOptions(element).find((option) => option.getAttribute('aria-selected') === 'true');
    expect(selected?.textContent ?? '').toContain('福岡県');
  });

  it('singleモードの選択済み表示は dads-chip-tag(action=remove) を使う', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    expect(chips.length).toBe(1);
    expect(chips[0]?.getAttribute('action')).toBe('remove');
    expect(chips[0]?.getAttribute('value')).toBe('大阪府');

    const chipList = getShadowContent(element, '#chip-list') as HTMLElement | null;
    expect(chipList?.tagName).toBe('UL');
    expect(chipList?.firstElementChild?.tagName).toBe('LI');
  });

  it('singleモードでチップ削除イベントを受けると選択解除される', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    const target = chips[0] as HTMLElement | undefined;
    expect(target).toBeTruthy();

    target?.dispatchEvent(
      new CustomEvent('dads-chip-tag-remove', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { value: 'osaka' },
      }),
    );
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toBe('');
    expect(element.getAttribute('value')).toBeNull();
    expect(getInput(element).placeholder).toBe('選択してください');
  });

  it('singleモードでチップを全削除したらcontrolへフォーカスを戻す', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    const target = chips[0] as HTMLElement | undefined;
    expect(target).toBeTruthy();

    target?.dispatchEvent(
      new CustomEvent('dads-chip-tag-remove', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { value: 'osaka' },
      }),
    );
    await waitMicrotask();

    expect(element.shadowRoot?.activeElement).toBe(getInput(element));
  });

  it('singleモードはcontrol入力を先頭にし、削除ボタンはTab対象にする', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chipActions = getChipActionButtons(element);
    expect(chipActions.length).toBe(1);
    expect(chipActions[0]?.tabIndex).toBe(0);
    const input = getInput(element);
    const control = getControl(element);
    const chipList = getShadowContent(element, '#chip-list') as HTMLElement | null;
    expect(control.firstElementChild).toBe(input);
    expect(control.children[1]).toBe(chipList);
  });

  it('singleモードで選択済みチップ領域クリック時に展開できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
  });

  it('singleモードはヘッダー全体クリックで開閉できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('control入力はEnterとSpaceで開閉できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('open中にcontrolでTabすると検索入力へフォーカスが移る', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const input = getInput(element);
    expect(element.hasAttribute('open')).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(input);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(getSearchInput(element));
  });

  it('open中に検索入力でTabすると候補行へフォーカスが移る', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const input = getInput(element);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);

    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const options = getOptions(element);
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]?.tabIndex).toBe(0);
    expect(element.shadowRoot?.activeElement).toBe(options[0]);
  });

  it('候補行にフォーカス中でもEscapeで離脱し、controlへ戻る', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const input = getInput(element);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const options = getOptions(element);
    expect(element.shadowRoot?.activeElement).toBe(options[0]);

    options[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(getInput(element));
  });

  it('候補行にフォーカス中でもArrowUp/ArrowDownで候補移動できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const input = getInput(element);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let options = getOptions(element);
    expect(element.shadowRoot?.activeElement).toBe(options[0]);
    expect(options[0]?.getAttribute('data-active')).toBe('true');

    options[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await waitMicrotask();

    options = getOptions(element);
    expect(options[1]?.getAttribute('data-active')).toBe('true');
    expect(element.shadowRoot?.activeElement).toBe(options[1]);

    options[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    await waitMicrotask();

    options = getOptions(element);
    expect(options[0]?.getAttribute('data-active')).toBe('true');
    expect(element.shadowRoot?.activeElement).toBe(options[0]);
  });

  it('Escape文字列が取れない環境でもcode=Escapeならパネルを閉じる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const input = getInput(element);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Unidentified',
        code: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
  });

  it('チップ削除ボタンにフォーカス中でもEscapeで離脱し、パネルを閉じる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const actions = getChipActionButtons(element);
    expect(actions.length).toBe(1);
    const action = actions[0];
    action.focus();
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(getInput(element));
  });

  it('open中にdocumentへEscapeが届いた場合もパネルを閉じる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
  });

  it('singleモードを展開した直後はヘッダー入力にフォーカスが残る', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const indicator = getShadowContent(element, '#indicator') as HTMLButtonElement | null;
    if (!indicator) throw new Error('indicator not found');

    indicator.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(getInput(element));
  });
});

describe('DadsCombobox - mode=multiple', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('複数選択時はEnterでトグル選択し、openを維持する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    const value = (element as HTMLElement & { value?: unknown }).value;
    expect(Array.isArray(value)).toBe(true);
    expect(value).toEqual(['tokyo']);
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('multipleモードで未選択時も既定プレースホルダーを表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    expect(input.placeholder).toBe('選択してください');
  });

  it('multipleモードで選択済みチップがあるときはプレースホルダーを非表示にする', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo,osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    expect(input.placeholder).toBe('');
  });

  it('multipleモードはヘッダー全体クリックで開閉できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo,osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('multipleモードはcontrol入力を先頭にし、削除ボタンはTab対象にする', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo,osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const closedActions = getChipActionButtons(element);
    expect(closedActions.length).toBe(2);
    expect(closedActions.every((button) => button.tabIndex === 0)).toBe(true);

    const input = getInput(element);
    const control = getControl(element);
    const chipList = getShadowContent(element, '#chip-list') as HTMLElement | null;
    expect(control.firstElementChild).toBe(input);
    expect(control.children[1]).toBe(chipList);

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const openedActions = getChipActionButtons(element);
    expect(openedActions.length).toBe(2);
    expect(openedActions.every((button) => button.tabIndex === 0)).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    const closedAgainActions = getChipActionButtons(element);
    expect(closedAgainActions.length).toBe(2);
    expect(closedAgainActions.every((button) => button.tabIndex === 0)).toBe(true);
  });

  it('multipleモードの選択済み表示は dads-chip-tag を使う', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo,osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    expect(chips.length).toBe(2);
    expect(chips[0]?.getAttribute('action')).toBe('remove');
    expect(chips[0]?.getAttribute('value')).toBe('東京都');
    expect(chips[0]?.textContent ?? '').toContain('東京都');

    const chipList = getShadowContent(element, '#chip-list') as HTMLElement | null;
    expect(chipList?.tagName).toBe('UL');
    expect(chipList?.firstElementChild?.tagName).toBe('LI');
  });

  it('multipleモードでチップ削除イベントを受けると選択解除される', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo,osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    const target = chips[0] as HTMLElement | undefined;
    expect(target).toBeTruthy();

    target?.dispatchEvent(
      new CustomEvent('dads-chip-tag-remove', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { value: 'tokyo' },
      }),
    );
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toEqual(['osaka']);
  });

  it('multipleモードで最後のチップを削除したらcontrolへフォーカスを戻す', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple" value="tokyo">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const chips = Array.from(element.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    const target = chips[0] as HTMLElement | undefined;
    expect(target).toBeTruthy();

    target?.dispatchEvent(
      new CustomEvent('dads-chip-tag-remove', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { value: 'tokyo' },
      }),
    );
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toEqual([]);
    expect(element.shadowRoot?.activeElement).toBe(getInput(element));
  });

  it('multipleモードで開くと検索入力(part=search-input)を表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    const searchInput = getShadowContent(element, '[part="search-input"]') as HTMLInputElement | null;
    expect(searchInput).not.toBeNull();
  });

  it('検索入力フォーカス中でもArrowUp/ArrowDownで候補のアクティブ行を移動できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);

    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();
    searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);
    let options = getOptions(element);
    expect(options[0]?.getAttribute('data-active')).toBe('true');

    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();
    searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);
    options = getOptions(element);
    expect(options[1]?.getAttribute('data-active')).toBe('true');

    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await waitMicrotask();
    searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);
    options = getOptions(element);
    expect(options[0]?.getAttribute('data-active')).toBe('true');
  });

  it('multipleモードをクリック展開した直後は候補のactive強調を持たない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const active = getShadowContent(element, '[part="option"][data-active="true"]');
    expect(active).toBeNull();
  });

  it('multipleモードで開くと検索アイコン(part=search-icon)を表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    const searchIcon = getShadowContent(element, '[part="search-icon"]');
    expect(searchIcon).not.toBeNull();
  });

  it('multipleモードの候補行にチェック領域(part=option-check)を表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitMicrotask();

    const checks = Array.from(element.shadowRoot?.querySelectorAll('[part="option-check"]') ?? []);
    expect(checks.length).toBe(3);
  });
});

describe('DadsCombobox - 検索拡張', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('option[data-search] でひらがな一致できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        <option value="tokyo">東京都</option>
        <option value="fukuoka" data-search='["福岡","ふくおか","f"]'>福岡県</option>
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.value = 'ふくおか';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const options = getOptions(element);
    expect(options.length).toBe(1);
    expect(options[0]?.textContent ?? '').toContain('福岡県');
  });

  it('option[data-search] が不正JSONでも検索処理は継続する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        <option value="tokyo">東京都</option>
        <option value="fukuoka" data-search='not-json'>福岡県</option>
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.value = 'f';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const options = getOptions(element);
    expect(options.length).toBe(1);
    expect(options[0]?.textContent ?? '').toContain('福岡県');
  });

  it('query一致部分を option-match として強調表示する', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.value = '福';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const option = getOptions(element)[0];
    const match = option?.querySelector('[part="option-match"]');
    expect(match).not.toBeNull();
    expect(match?.textContent).toBe('福');
  });
});

describe('DadsCombobox - キーボード選択ユースケース', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('singleモードはキーボードだけで開く→検索→選択→確定できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let searchInput = getSearchInput(element);
    expect(element.shadowRoot?.activeElement).toBe(searchInput);

    searchInput.value = '福';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const filtered = getOptions(element);
    expect(filtered.length).toBe(1);
    expect(filtered[0]?.textContent ?? '').toContain('福岡県');

    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toBe('fukuoka');
    expect(element.hasAttribute('open')).toBe(false);
    expect(input.value).toContain('福岡県');
  });

  it('singleモードはキーボードだけで再選択できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox value="osaka">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let searchInput = getSearchInput(element);
    searchInput.value = '東';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toBe('tokyo');
    expect(element.hasAttribute('open')).toBe(false);
    expect(input.value).toContain('東京都');
  });

  it('multipleモードはキーボードだけで選択→解除をトグルできる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let searchInput = getSearchInput(element);
    searchInput.value = '東';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect((element as HTMLElement & { value?: unknown }).value).toEqual(['tokyo']);
    expect(element.hasAttribute('open')).toBe(true);

    searchInput = getSearchInput(element);
    searchInput.value = '東';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect((element as HTMLElement & { value?: unknown }).value).toEqual([]);
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('multipleモードはキーボードだけで複数選択を維持したまま閉じて再展開できる', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox mode="multiple">
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const input = getInput(element);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await waitMicrotask();

    let searchInput = getSearchInput(element);

    searchInput.value = '東';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();
    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    searchInput = getSearchInput(element);
    searchInput.value = '福';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();
    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();

    expect((element as HTMLElement & { value?: unknown }).value).toEqual(['tokyo', 'fukuoka']);
    expect(element.hasAttribute('open')).toBe(true);

    searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const selected = getOptions(element).filter((option) => option.getAttribute('aria-selected') === 'true');
    expect(selected.map((option) => option.textContent ?? '')).toEqual(
      expect.arrayContaining(['東京都', '福岡県']),
    );
  });
});

describe('DadsCombobox - IME入力', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('IME合成中のEnterは選択確定に使わない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const searchInput = getSearchInput(element);
    searchInput.value = '東';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    const composingEnter = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
      isComposing: true,
    });
    const dispatchResult = searchInput.dispatchEvent(composingEnter);
    await waitMicrotask();

    expect(dispatchResult).toBe(true);
    expect((element as HTMLElement & { value?: unknown }).value).toBe('');
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('IME合成中のArrowDownは候補アクティブ移動に使わない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    let options = getOptions(element);
    expect(options[0]?.getAttribute('data-active')).toBe('true');

    const searchInput = getSearchInput(element);
    const composingArrowDown = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
      isComposing: true,
    });
    const dispatchResult = searchInput.dispatchEvent(composingArrowDown);
    await waitMicrotask();

    options = getOptions(element);
    expect(dispatchResult).toBe(true);
    expect(options[0]?.getAttribute('data-active')).toBe('true');
    expect(options[1]?.getAttribute('data-active')).not.toBe('true');
  });

  it('IME合成中でも絞り込みでき、検索入力を再生成しない', async () => {
    await defineComboboxForTest();
    element = renderWebComponent(`
      <dads-combobox>
        ${baseOptions}
      </dads-combobox>
    `);
    await waitForCustomElement(element);

    const control = getControl(element);
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitMicrotask();

    const searchInput = getSearchInput(element);
    searchInput.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    searchInput.value = '福';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitMicrotask();

    expect(getOptions(element).length).toBe(1);
    expect(getOptions(element)[0]?.textContent ?? '').toContain('福岡県');
    expect(getSearchInput(element)).toBe(searchInput);

    searchInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    await waitMicrotask();

    expect(getOptions(element).length).toBe(1);
    expect(getOptions(element)[0]?.textContent ?? '').toContain('福岡県');
  });
});

describe('DadsCombobox - styles', () => {
  it('検索入力はDADS標準フォーカスインジケーターを持つ', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes("[part='search-input']:focus-visible")).toBe(true);
    expect(
      source.includes(
        "[part='search-input']:focus-visible {\n    border-color: var(--combobox-border-color-focus);\n    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);\n    outline-offset: var(--dads-focus-outline-offset);\n    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);\n  }",
      ),
    ).toBe(true);
  });

  it('open時にcontrolへフォーカス装飾を常時表示しない', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes(":host([open]:not([disabled])) [part='control'] {")).toBe(false);
  });

  it('combobox側でチップ外周ボックススタイルを持たない', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes("[part='chip'] {")).toBe(false);
  });

  it('矢印アイコン反転に transition を定義しない', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('transition: transform')).toBe(false);
  });

  it('singleで選択済みチップ表示時は入力幅を畳む', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes(":host([mode='single']) [part='control'][data-has-chip] [part='input'] {")).toBe(
      true,
    );
  });

  it('ヘッダー入力のfocus-visible装飾はcontrol優先にする', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes(":host [part='control'] [part='input']:focus-visible {")).toBe(true);
  });

  it('インジケーターを左側に配置するorder指定を持つ', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes("[part='indicator'] {\n    display: inline-flex;")).toBe(true);
    expect(source.includes('    order: 0;')).toBe(true);
  });

  it('single選択時の入力折りたたみはmultipleと同じで、pointer-events差分を持たない', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    const blockStart = ":host([mode='multiple']) [part='control'][data-has-chip] [part='input'],";
    const blockEnd = "  [part='input'] {";
    const startIndex = source.indexOf(blockStart);
    const endIndex = source.indexOf(blockEnd, startIndex);
    const collapseBlock = startIndex >= 0 && endIndex > startIndex ? source.slice(startIndex, endIndex) : '';

    expect(collapseBlock.includes(":host([mode='single']) [part='control'][data-has-chip] [part='input'] {")).toBe(
      true,
    );
    expect(collapseBlock.includes('pointer-events: none;')).toBe(false);
  });

  it('未選択時プレースホルダーは通常テキスト色を使う', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes("[part='input']::placeholder {\n    color: var(--dads-combobox-text-color);\n  }")).toBe(
      true,
    );
  });

  it('open時もヘッダーcontrolの角丸を上下左右同一で維持する', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes(":host([open]) [part='control'] {")).toBe(false);
    expect(source.includes('border-bottom-left-radius: 0;')).toBe(false);
    expect(source.includes('border-bottom-right-radius: 0;')).toBe(false);
  });

  it('listboxはcontrolと重ねない（負マージンと上辺削除を使わない）', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('margin-top: calc(var(--dads-combobox-border-width) * -1);')).toBe(false);
    expect(source.includes('border-top: 0;')).toBe(false);
  });

  it('listboxはフローティング表示のため絶対配置する', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('position: absolute;')).toBe(true);
    expect(source.includes('inset-inline: 0;')).toBe(true);
    expect(source.includes('z-index: var(--dads-combobox-list-z-index, 10);')).toBe(true);
  });

  it('listboxシャドーはmenu-list-boxと同じ elevation-1 を使う', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-tokens.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('--combobox-list-shadow: var(--elevation-1);')).toBe(true);
  });

  it('size属性 s/m/l で control 高さ 40/48/56 を切り替えできる', async () => {
    const sourcePath = join(process.cwd(), 'packages/components/combobox/combobox-tokens.ts');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('--combobox-control-height-s: 40px;')).toBe(true);
    expect(source.includes('--combobox-control-height-m: 48px;')).toBe(true);
    expect(source.includes('--combobox-control-height-l: 56px;')).toBe(true);
    expect(source.includes(':host([size="s"]),')).toBe(true);
    expect(source.includes(':host([size="m"]),')).toBe(true);
    expect(source.includes(':host([size="l"]),')).toBe(true);
  });

  it('size属性変更でcontrol高さが変わるよう、paddingとindicatorもサイズ連動する', async () => {
    const tokenSourcePath = join(process.cwd(), 'packages/components/combobox/combobox-tokens.ts');
    const tokenSource = readFileSync(tokenSourcePath, 'utf8');
    expect(tokenSource.includes('--combobox-padding-y-s: 0.4375rem;')).toBe(true);
    expect(tokenSource.includes('--combobox-padding-y-m: 0.5625rem;')).toBe(true);
    expect(tokenSource.includes('--combobox-padding-y-l: 0.6875rem;')).toBe(true);
    expect(tokenSource.includes('--combobox-indicator-size-s: 1.5rem;')).toBe(true);
    expect(tokenSource.includes('--combobox-indicator-size-m: 1.75rem;')).toBe(true);
    expect(tokenSource.includes('--combobox-indicator-size-l: 2rem;')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-padding-y: var(--combobox-padding-y-m);')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-indicator-size: var(--combobox-indicator-size-m);')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-padding-y: var(--combobox-padding-y-s);')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-indicator-size: var(--combobox-indicator-size-s);')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-padding-y: var(--combobox-padding-y-l);')).toBe(true);
    expect(tokenSource.includes('--dads-combobox-indicator-size: var(--combobox-indicator-size-l);')).toBe(true);

    const styleSourcePath = join(process.cwd(), 'packages/components/combobox/combobox-styles.ts');
    const styleSource = readFileSync(styleSourcePath, 'utf8');
    expect(styleSource.includes('height: var(--dads-combobox-control-height);')).toBe(true);
    expect(styleSource.includes(":host([mode='multiple']) [part='control'] {")).toBe(true);
    expect(styleSource.includes('height: auto;')).toBe(true);
    expect(styleSource.includes('min-height: var(--dads-combobox-control-height);')).toBe(true);
  });
});
