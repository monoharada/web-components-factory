import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { demos } from './showcase-table-control.js';
import { mountTableControlDemo } from './table-control-mvc.js';
import { defineTableControl } from '../../packages/components/table-control/table-control-define.js';

type SearchDetail = Readonly<{ query: string; scope: string }>;
type PageSizeDetail = Readonly<{ value: string; itemsPerPage: number }>;

function setupDemo(): HTMLElement {
  defineTableControl();

  const host = document.createElement('div');
  host.innerHTML = demos.tableControl();
  document.body.append(host);

  const root = host.querySelector<HTMLElement>('#demo-table-control-root');
  if (!root) {
    throw new Error('table-control mvc demo root が見つかりません。');
  }

  mountTableControlDemo(root);
  return root;
}

function setControlValue(el: Element | null, value: string): void {
  if (!(el instanceof HTMLElement)) return;
  (el as unknown as { value?: string }).value = value;
  el.setAttribute('value', value);
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('table-control-mvc', () => {
  it('4状態シナリオを切り替えられる', () => {
    const root = setupDemo();
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-table-control-scenario]'));
    const header = root.querySelector<HTMLElement>('#demo-table-control-header');
    const presets = root.querySelector<HTMLElement>('#demo-table-control-presets');
    const summary = root.querySelector<HTMLElement>('#demo-table-control-summary');
    const emptyMessage = root.querySelector<HTMLElement>('#demo-table-control-empty');

    const before = buttons.find((button) => button.dataset.tableControlScenario === 'before-search');
    const after = buttons.find((button) => button.dataset.tableControlScenario === 'after-search');
    const empty = buttons.find((button) => button.dataset.tableControlScenario === 'empty-result');
    const preset = buttons.find((button) => button.dataset.tableControlScenario === 'preset-visible');

    expect(before?.getAttribute('aria-pressed')).toBe('true');

    after?.click();
    expect(header?.getAttribute('query')).toBe('申請');
    expect(presets?.hidden).toBe(true);
    expect(after?.getAttribute('aria-pressed')).toBe('true');

    empty?.click();
    expect(summary?.textContent).toContain('検索結果: 0 件');
    expect(emptyMessage?.hidden).toBe(false);

    preset?.click();
    expect(header?.getAttribute('query')).toBe('');
    expect(presets?.hidden).toBe(false);
    expect(preset?.getAttribute('aria-pressed')).toBe('true');
  });

  it('検索・リセット・プリセットが連動する', () => {
    const root = setupDemo();
    const header = root.querySelector<HTMLElement>('#demo-table-control-header');
    const presets = root.querySelector<HTMLElement>('#demo-table-control-presets');
    const summary = root.querySelector<HTMLElement>('#demo-table-control-summary');
    const resetVisible = (): boolean => header?.hasAttribute('show-reset') ?? false;

    header?.dispatchEvent(new CustomEvent<SearchDetail>('dads-table-control-search', {
      detail: { query: '補助金', scope: '' },
      bubbles: true,
      composed: true,
    }));

    expect(header?.getAttribute('query')).toBe('補助金');
    expect(resetVisible()).toBe(true);
    expect(summary?.textContent).not.toContain('検索結果: 0 件');

    header?.dispatchEvent(new CustomEvent('dads-table-control-reset', {
      bubbles: true,
      composed: true,
    }));

    expect(header?.getAttribute('query')).toBe('');
    expect(resetVisible()).toBe(false);

    const scenarioPreset = document.querySelector<HTMLButtonElement>('[data-table-control-scenario="preset-visible"]');
    scenarioPreset?.click();

    const presetChip = root.querySelector<HTMLElement>('#demo-table-control-presets dads-chip-tag[data-query="補助金"]');
    presetChip?.dispatchEvent(new CustomEvent('dads-chip-tag-click', { bubbles: true, composed: true }));

    expect(header?.getAttribute('query')).toBe('補助金');
    expect(presets?.hidden).toBe(true);
    expect(resetVisible()).toBe(true);
  });

  it('キーボード操作で検索・表示件数切替・ページ送り・リセットができる', async () => {
    const root = setupDemo();
    const user = userEvent.setup();
    const header = root.querySelector<HTMLElement>('#demo-table-control-header');
    const footer = root.querySelector<HTMLElement>('#demo-table-control-footer');
    const pagination = root.querySelector<HTMLElement>('#demo-table-control-pagination');
    const summary = root.querySelector<HTMLElement>('#demo-table-control-summary');

    const searchBox = header?.shadowRoot?.querySelector<HTMLElement>('dads-search-box');
    const searchInput = searchBox?.shadowRoot?.querySelector<HTMLInputElement>('#input');
    if (!searchInput) {
      throw new Error('検索入力が見つかりません。');
    }

    searchInput.focus();
    searchInput.value = '補助金';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await user.keyboard('{Enter}');
    expect(header?.getAttribute('query')).toBe('補助金');
    expect(summary?.textContent).toContain('検索結果:');
    expect(header?.hasAttribute('show-reset')).toBe(true);

    const pageSize10 = footer?.shadowRoot?.querySelector<HTMLButtonElement>('button[data-items-value="10"]');
    if (!pageSize10) {
      throw new Error('表示件数ボタンが見つかりません。');
    }
    pageSize10.focus();
    await user.keyboard('{Enter}');
    expect(footer?.getAttribute('items-per-page')).toBe('10');

    const resetButton = header?.shadowRoot?.querySelector<HTMLButtonElement>('#reset');
    if (!resetButton) {
      throw new Error('リセットボタンが見つかりません。');
    }
    resetButton.focus();
    await user.keyboard('{Enter}');
    expect(header?.getAttribute('query')).toBe('');
    expect(header?.hasAttribute('show-reset')).toBe(false);
    expect(pagination?.getAttribute('current')).toBe('1');
    expect(pagination?.getAttribute('total')).toBe('3');
    expect(pagination?.hasAttribute('disabled-next')).toBe(false);

    const nextButton = pagination?.shadowRoot?.querySelector<HTMLButtonElement>('#next-button');
    if (!nextButton) {
      throw new Error('ページナビゲーションの次へボタンが見つかりません。');
    }
    nextButton.focus();
    await user.keyboard('{Enter}');
    expect(pagination?.getAttribute('current')).toBe('2');
  });

  it('Tab移動とSpace操作でキーボード経路を通過できる', async () => {
    const root = setupDemo();
    const user = userEvent.setup();

    const before = document.querySelector<HTMLButtonElement>('[data-table-control-scenario="before-search"]');
    const beforeBase = before?.shadowRoot?.querySelector<HTMLButtonElement>('button');
    const sortButton = root.querySelector<HTMLButtonElement>('button[data-sort]');
    if (!before || !beforeBase || !sortButton) {
      throw new Error('キーボード検証用の要素が見つかりません。');
    }

    beforeBase.focus();
    const activeBeforeTab = document.activeElement;
    await user.tab();
    expect(document.activeElement).not.toBe(activeBeforeTab);

    const sortKeydownSpy = vi.fn<(event: KeyboardEvent) => void>();
    sortButton.addEventListener('keydown', sortKeydownSpy);
    sortButton.focus();
    await user.keyboard('{Space}');
    expect(sortKeydownSpy).toHaveBeenCalled();
    const lastCall = sortKeydownSpy.mock.calls.at(-1)?.[0];
    expect(lastCall?.key).toBe('Space');
  });

  it('表示件数切替とページ送りが動作する', () => {
    const root = setupDemo();
    const footer = root.querySelector<HTMLElement>('#demo-table-control-footer');
    const pagination = root.querySelector<HTMLElement>('#demo-table-control-pagination');

    footer?.dispatchEvent(new CustomEvent<PageSizeDetail>('dads-table-control-page-size-change', {
      detail: { value: '10', itemsPerPage: 10 },
      bubbles: true,
      composed: true,
    }));

    expect(pagination?.getAttribute('current')).toBe('1');
    expect(pagination?.getAttribute('total')).toBe('3');
    expect(pagination?.hasAttribute('disabled-prev')).toBe(true);

    pagination?.dispatchEvent(new CustomEvent('next', { bubbles: true, composed: true }));
    expect(pagination?.getAttribute('current')).toBe('2');

    pagination?.dispatchEvent(new CustomEvent('next', { bubbles: true, composed: true }));
    expect(pagination?.getAttribute('current')).toBe('3');
    expect(pagination?.hasAttribute('disabled-next')).toBe(true);

    pagination?.dispatchEvent(new CustomEvent('prev', { bubbles: true, composed: true }));
    expect(pagination?.getAttribute('current')).toBe('2');

    footer?.dispatchEvent(new CustomEvent<PageSizeDetail>('dads-table-control-page-size-change', {
      detail: { value: '0', itemsPerPage: 0 },
      bubbles: true,
      composed: true,
    }));
    expect(footer?.getAttribute('items-per-page')).toBe('10');
  });

  it('新規追加ダイアログで必須エラーと保存を処理する', () => {
    const root = setupDemo();
    const openButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-open');
    const saveButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-save');
    const cancelButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-cancel');
    const dialog = root.querySelector<HTMLElement>('#demo-table-control-create-dialog');
    const title = root.querySelector<HTMLElement>('#demo-table-control-create-title');
    const summary = root.querySelector<HTMLElement>('#demo-table-control-summary');

    openButton?.click();
    expect(dialog?.hasAttribute('open')).toBe(true);

    const focusSpy = vi.spyOn(title as HTMLElement, 'focus');
    saveButton?.click();
    expect(title?.hasAttribute('error')).toBe(true);
    expect(focusSpy).toHaveBeenCalled();

    setControlValue(title, '追加案件');
    title?.dispatchEvent(new CustomEvent('dads-input', { bubbles: true, composed: true }));
    expect(title?.hasAttribute('error')).toBe(false);

    setControlValue(root.querySelector('#demo-table-control-create-department'), '総務課');
    setControlValue(root.querySelector('#demo-table-control-create-category'), '交付');
    setControlValue(root.querySelector('#demo-table-control-create-status'), '審査完了');
    saveButton?.click();

    expect(dialog?.hasAttribute('open')).toBe(false);
    expect(summary?.textContent).toContain('検索結果: 29 件');

    const firstRowText = root.querySelector<HTMLElement>('#demo-table-control-body tr:first-child td:nth-child(2)')?.textContent?.trim();
    expect(firstRowText).toBe('追加案件');

    openButton?.click();
    cancelButton?.click();
    expect(dialog?.hasAttribute('open')).toBe(false);
  });

  it('同じrootへ再mountしても新規追加が重複しない', () => {
    const root = setupDemo();
    mountTableControlDemo(root);
    const openButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-open');
    const saveButton = root.querySelector<HTMLButtonElement>('#demo-table-control-create-save');
    const summary = root.querySelector<HTMLElement>('#demo-table-control-summary');
    const title = root.querySelector<HTMLElement>('#demo-table-control-create-title');

    openButton?.click();
    setControlValue(title, '再mount追加');
    saveButton?.click();

    const titles = Array.from(root.querySelectorAll<HTMLElement>('#demo-table-control-body tr td:nth-child(2)'))
      .map((cell) => cell.textContent?.trim());

    expect(summary?.textContent).toContain('検索結果: 29 件');
    expect(titles.filter((value) => value === '再mount追加')).toHaveLength(1);
    expect(root.dataset.tableControlDemoMounted).toBe('true');
  });
});
