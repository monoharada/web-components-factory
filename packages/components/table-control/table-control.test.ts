/**
 * DadsTableControl コンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import type {
  DadsTableControlPageSizeChangeDetail,
  DadsTableControlSearchDetail,
  DadsTableControlResetDetail,
} from './table-control';

async function renderTableControl(markup: string): Promise<HTMLElement> {
  const { defineTableControl } = await import('./table-control-define');
  defineTableControl();

  const component = renderWebComponent(markup);
  await waitForComponent('dads-table-control');
  return component;
}

describe('DadsTableControl - 基本表示', () => {
  afterEach(() => {
    cleanup();
  });

  it('variant を切り替えると header/footer が切り替わる', async () => {
    const component = await renderTableControl('<dads-table-control></dads-table-control>');

    const header = getShadowElement<HTMLElement>(component, '[part="header"]');
    const footer = getShadowElement<HTMLElement>(component, '[part="footer"]');

    expect(header?.hidden).toBe(false);
    expect(footer?.hidden).toBe(true);

    component.setAttribute('variant', 'footer');
    await Promise.resolve();

    expect(header?.hidden).toBe(true);
    expect(footer?.hidden).toBe(false);
  });

  it('不正な variant は header にフォールバックする', async () => {
    const component = await renderTableControl('<dads-table-control variant="unknown"></dads-table-control>');
    const header = getShadowElement<HTMLElement>(component, '[part="header"]');
    const footer = getShadowElement<HTMLElement>(component, '[part="footer"]');

    expect(component.getAttribute('variant')).toBe('header');
    expect(header?.hidden).toBe(false);
    expect(footer?.hidden).toBe(true);
  });

  it('query 属性が内部 search-box に同期される', async () => {
    const component = await renderTableControl('<dads-table-control query="初期"></dads-table-control>');

    const searchBox = getShadowElement<HTMLElement & { value?: string }>(component, '#search-box');

    expect(searchBox?.value).toBe('初期');

    component.setAttribute('query', '給付金');
    await Promise.resolve();

    expect(searchBox?.value).toBe('給付金');
  });

  it('result-count を件数表示へ整形する', async () => {
    const component = await renderTableControl('<dads-table-control result-count="1234"></dads-table-control>');

    const count = getShadowElement<HTMLElement>(component, '#count');
    expect(count?.textContent?.trim()).toBe('1,234 件');
  });

  it('result-count が空文字のとき件数表示を非表示にする', async () => {
    const component = await renderTableControl('<dads-table-control result-count=""></dads-table-control>');
    const count = getShadowElement<HTMLElement>(component, '#count');

    expect(count?.hidden).toBe(true);
    expect(count?.textContent).toBe('');
  });

  it('show-reset の有無でリセットボタン表示を切り替える', async () => {
    const component = await renderTableControl('<dads-table-control></dads-table-control>');

    const resetButton = getShadowElement<HTMLButtonElement>(component, '#reset');
    expect(resetButton?.hidden).toBe(true);

    component.setAttribute('show-reset', '');
    await Promise.resolve();
    expect(resetButton?.hidden).toBe(false);

    component.removeAttribute('show-reset');
    await Promise.resolve();
    expect(resetButton?.hidden).toBe(true);
  });
});

describe('DadsTableControl - イベント', () => {
  afterEach(() => {
    cleanup();
  });

  it('dads-table-control-search を発火する', async () => {
    const component = await renderTableControl('<dads-table-control></dads-table-control>');

    const handler = vi.fn();
    component.addEventListener('dads-table-control-search', handler);

    const searchBox = getShadowElement<HTMLElement>(component, '#search-box');
    searchBox?.dispatchEvent(
      new CustomEvent('dads-search', {
        detail: { query: '申請', scope: 'all' },
        bubbles: true,
        composed: true,
      }),
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<DadsTableControlSearchDetail>;
    expect(event.detail.query).toBe('申請');
    expect(event.detail.scope).toBe('all');
    expect(component.getAttribute('query')).toBe('申請');
  });

  it('検索イベントdetailが不足していても現在値を使って発火する', async () => {
    const component = await renderTableControl('<dads-table-control query="初期値"></dads-table-control>');
    const handler = vi.fn();
    component.addEventListener('dads-table-control-search', handler);

    const searchBox = getShadowElement<HTMLElement & { value?: string }>(component, '#search-box');
    if (searchBox) searchBox.value = '検索語';
    searchBox?.dispatchEvent(
      new CustomEvent('dads-search', {
        detail: { scope: 'all' },
        bubbles: true,
        composed: true,
      }),
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<DadsTableControlSearchDetail>;
    expect(event.detail.query).toBe('検索語');
    expect(event.detail.scope).toBe('all');
  });

  it('dads-table-control-reset を発火する', async () => {
    const component = await renderTableControl('<dads-table-control query="テスト" show-reset></dads-table-control>');

    const handler = vi.fn();
    component.addEventListener('dads-table-control-reset', handler);

    const resetButton = getShadowElement<HTMLButtonElement>(component, '#reset');
    resetButton?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<DadsTableControlResetDetail>;
    expect(event.detail.query).toBe('');
    expect(component.getAttribute('query')).toBe('');
  });

  it('dads-table-control-page-size-change を発火する', async () => {
    const component = await renderTableControl(`
      <dads-table-control
        variant="footer"
        items-per-page="10"
        page-size-options="10,50,100"
      ></dads-table-control>
    `);

    const handler = vi.fn();
    component.addEventListener('dads-table-control-page-size-change', handler);

    const option = getShadowElement<HTMLButtonElement>(component, 'button[data-items-value="50"]');
    option?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<DadsTableControlPageSizeChangeDetail>;
    expect(event.detail.value).toBe('50');
    expect(event.detail.itemsPerPage).toBe(50);
    expect(component.getAttribute('items-per-page')).toBe('50');
  });

  it('数値でない表示件数でもイベントを発火し itemsPerPage は 0 になる', async () => {
    const component = await renderTableControl(`
      <dads-table-control
        variant="footer"
        items-per-page="10"
        page-size-options="10,all"
      ></dads-table-control>
    `);

    const handler = vi.fn();
    component.addEventListener('dads-table-control-page-size-change', handler);

    const option = getShadowElement<HTMLButtonElement>(component, 'button[data-items-value="all"]');
    option?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<DadsTableControlPageSizeChangeDetail>;
    expect(event.detail.value).toBe('all');
    expect(event.detail.itemsPerPage).toBe(0);
    expect(component.getAttribute('items-per-page')).toBe('all');
  });
});

describe('DadsTableControl - フッター制御', () => {
  afterEach(() => {
    cleanup();
  });

  it('page-size-options に従って options を描画する', async () => {
    const component = await renderTableControl(`
      <dads-table-control
        variant="footer"
        items-per-page="50"
        page-size-options="10,50,100"
      ></dads-table-control>
    `);

    const options = Array.from(
      component.shadowRoot?.querySelectorAll<HTMLElement>('[part="items-option"]') ?? [],
    );

    expect(options.map((option) => option.textContent?.trim())).toEqual(['10件', '50件', '100件']);

    const active = getShadowElement<HTMLElement>(component, '[part="items-option"][data-active]');
    expect(active?.getAttribute('data-items-value')).toBe('50');
  });

  it('page-size-options は空値を除外し重複を排除する', async () => {
    const component = await renderTableControl(`
      <dads-table-control
        variant="footer"
        items-per-page="50"
        page-size-options="10, ,50,10,100,100"
      ></dads-table-control>
    `);

    const options = Array.from(
      component.shadowRoot?.querySelectorAll<HTMLButtonElement>('button[data-items-value]') ?? [],
    );

    expect(options.map((option) => option.getAttribute('data-items-value'))).toEqual(['10', '50', '100']);
    const itemsPerPage = getShadowElement<HTMLElement>(component, '[part="items-per-page"]');
    expect(itemsPerPage?.hidden).toBe(false);
  });

  it('page-size-options が空のとき表示件数ブロックを隠す', async () => {
    const component = await renderTableControl(`
      <dads-table-control
        variant="footer"
        items-per-page="10"
        page-size-options=" , "
      ></dads-table-control>
    `);

    const itemsPerPage = getShadowElement<HTMLElement>(component, '[part="items-per-page"]');
    expect(itemsPerPage?.hidden).toBe(true);
  });

  it('pagination-position を反映する', async () => {
    const component = await renderTableControl(`
      <dads-table-control variant="footer" pagination-position="end">
        <span slot="page-navigation">page</span>
      </dads-table-control>
    `);

    const footer = getShadowElement<HTMLElement>(component, '[part="footer"]');
    expect(footer?.getAttribute('data-pagination-position')).toBe('end');

    component.setAttribute('pagination-position', 'start');
    await Promise.resolve();

    expect(footer?.getAttribute('data-pagination-position')).toBe('start');
  });

  it('不正な pagination-position は start にフォールバックする', async () => {
    const component = await renderTableControl(`
      <dads-table-control variant="footer" pagination-position="middle">
        <span slot="page-navigation">page</span>
      </dads-table-control>
    `);

    const footer = getShadowElement<HTMLElement>(component, '[part="footer"]');
    expect(component.getAttribute('pagination-position')).toBe('start');
    expect(footer?.getAttribute('data-pagination-position')).toBe('start');
  });
});

describe('DadsTableControl - slot 表示制御', () => {
  afterEach(() => {
    cleanup();
  });

  it('actions slot がない場合は actions 領域を隠す', async () => {
    const component = await renderTableControl('<dads-table-control></dads-table-control>');
    const actions = getShadowElement<HTMLElement>(component, '[part="actions"]');
    expect(actions?.hidden).toBe(true);
  });

  it('presets slot が hidden のみの場合は popular 領域を隠す', async () => {
    const component = await renderTableControl(`
      <dads-table-control popular-label="よくある検索">
        <span slot="presets" hidden>preset</span>
      </dads-table-control>
    `);

    const popular = getShadowElement<HTMLElement>(component, '[part="popular"]');
    expect(popular?.hidden).toBe(true);
  });

  it('page-navigation slot の有無で pagination 領域を切り替える', async () => {
    const withSlot = await renderTableControl(`
      <dads-table-control variant="footer">
        <span slot="page-navigation">page</span>
      </dads-table-control>
    `);
    const withPagination = getShadowElement<HTMLElement>(withSlot, '[part="pagination"]');
    expect(withPagination?.hidden).toBe(false);

    cleanup();

    const withoutSlot = await renderTableControl('<dads-table-control variant="footer"></dads-table-control>');
    const withoutPagination = getShadowElement<HTMLElement>(withoutSlot, '[part="pagination"]');
    expect(withoutPagination?.hidden).toBe(true);
  });
});
