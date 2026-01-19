/**
 * DadsTableコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  renderWebComponent,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import type { DadsTableSelectionChangeDetail, DadsTableSortChangeDetail } from './table';

describe('DadsTable - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table>
        <table>
          <thead><tr><th scope="col">ラベル</th></tr></thead>
          <tbody><tr><td>データ</td></tr></tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');
    expect(component).toBeInTheDocument();
  });

  it('スクロールコンテナにtableが移動される', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table>
        <table>
          <thead><tr><th scope="col">ラベル</th></tr></thead>
          <tbody><tr><td>データ</td></tr></tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');
    const scroll = component.querySelector('[part="scroll"]');
    expect(scroll).toBeInTheDocument();
    expect(scroll?.querySelector('table')).toBeInTheDocument();
  });
});

describe('DadsTable - 行選択（チェックボックス）', () => {
  afterEach(() => {
    cleanup();
  });

  it('行のchecked状態がaria-selectedに反映され、全選択がindeterminateになる', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table selectable>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" data-select-all aria-label="すべて選択" />
              </th>
              <th scope="col">ラベル</th>
            </tr>
          </thead>
          <tbody>
            <tr data-row-id="a">
              <td><input type="checkbox" data-select-row aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
            <tr data-row-id="b">
              <td><input type="checkbox" data-select-row aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const onSelection = vi.fn();
    component.addEventListener('dads-selection-change', onSelection);

    const rowCbs = Array.from(
      component.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-select-row]'),
    );
    const selectAll = component.querySelector<HTMLInputElement>(
      'input[type="checkbox"][data-select-all]',
    );
    expect(selectAll).toBeTruthy();

    rowCbs[0].checked = true;
    rowCbs[0].dispatchEvent(new Event('change', { bubbles: true }));

    const rows = Array.from(component.querySelectorAll('tbody tr'));
    expect(rows[0].getAttribute('aria-selected')).toBe('true');
    expect(rows[1].hasAttribute('aria-selected')).toBe(false);

    expect(selectAll?.indeterminate).toBe(true);
    expect(selectAll?.checked).toBe(false);

    expect(onSelection).toHaveBeenCalledTimes(1);
    const evt = onSelection.mock.calls[0][0] as CustomEvent<DadsTableSelectionChangeDetail>;
    expect(evt.detail.selectedRowIds).toEqual(['a']);
    expect(evt.detail.selectedCount).toBe(1);
    expect(evt.detail.totalSelectableRows).toBe(2);
  });

  it('全選択で全行が選択される', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table selectable>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" data-select-all aria-label="すべて選択" />
              </th>
              <th scope="col">ラベル</th>
            </tr>
          </thead>
          <tbody>
            <tr data-row-id="a">
              <td><input type="checkbox" data-select-row aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
            <tr data-row-id="b">
              <td><input type="checkbox" data-select-row aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const onSelection = vi.fn();
    component.addEventListener('dads-selection-change', onSelection);

    const selectAll = component.querySelector<HTMLInputElement>(
      'input[type="checkbox"][data-select-all]',
    );
    const rowCbs = Array.from(
      component.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-select-row]'),
    );

    selectAll!.checked = true;
    selectAll!.dispatchEvent(new Event('change', { bubbles: true }));

    for (const cb of rowCbs) {
      expect(cb.checked).toBe(true);
    }

    const rows = Array.from(component.querySelectorAll('tbody tr'));
    for (const row of rows) {
      expect(row.getAttribute('aria-selected')).toBe('true');
    }

    expect(selectAll?.indeterminate).toBe(false);
    expect(selectAll?.checked).toBe(true);

    const evt = onSelection.mock.calls.at(-1)?.[0] as CustomEvent<DadsTableSelectionChangeDetail>;
    expect(evt.detail.selectedRowIds).toEqual(['a', 'b']);
  });

  it('data-js-check* のマークアップでも同様に動作する', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" data-js-check-all aria-label="すべて選択" />
              </th>
              <th scope="col">ラベル</th>
            </tr>
          </thead>
          <tbody>
            <tr data-row-id="a">
              <td><input type="checkbox" data-js-check aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
            <tr data-row-id="b">
              <td><input type="checkbox" data-js-check aria-label="行を選択" /></td>
              <td>データ</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const onSelection = vi.fn();
    component.addEventListener('dads-selection-change', onSelection);

    const rowCbs = Array.from(
      component.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-js-check]'),
    );
    const selectAll = component.querySelector<HTMLInputElement>(
      'input[type="checkbox"][data-js-check-all]',
    );
    expect(selectAll).toBeTruthy();

    rowCbs[0].checked = true;
    rowCbs[0].dispatchEvent(new Event('change', { bubbles: true }));

    const rows = Array.from(component.querySelectorAll('tbody tr'));
    expect(rows[0].getAttribute('aria-selected')).toBe('true');
    expect(rows[1].hasAttribute('aria-selected')).toBe(false);

    expect(selectAll?.indeterminate).toBe(true);
    expect(selectAll?.checked).toBe(false);

    expect(onSelection).toHaveBeenCalledTimes(1);
    const evt = onSelection.mock.calls[0][0] as CustomEvent<DadsTableSelectionChangeDetail>;
    expect(evt.detail.selectedRowIds).toEqual(['a']);
    expect(evt.detail.selectedCount).toBe(1);
    expect(evt.detail.totalSelectableRows).toBe(2);
  });
});

describe('DadsTable - ソート（aria-sort）', () => {
  afterEach(() => {
    cleanup();
  });

  it('クリックでaria-sortが切り替わり、dads-sort-changeが発火する', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table>
        <table>
          <thead>
            <tr>
              <th scope="col">未ソート</th>
              <th scope="col" data-column="name">
                <button type="button" data-sort>ラベル</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td>データ</td><td>データ</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const onSort = vi.fn();
    component.addEventListener('dads-sort-change', onSort);

    const button = component.querySelector<HTMLButtonElement>('[data-sort]');
    const th = button?.closest('th');
    expect(button).toBeTruthy();
    expect(th).toBeTruthy();

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(th?.getAttribute('aria-sort')).toBe('ascending');

    const evt1 = onSort.mock.calls[0][0] as CustomEvent<DadsTableSortChangeDetail>;
    expect(evt1.detail.columnId).toBe('name');
    expect(evt1.detail.columnIndex).toBe(1);
    expect(evt1.detail.direction).toBe('ascending');

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(th?.getAttribute('aria-sort')).toBe('descending');

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(th?.hasAttribute('aria-sort')).toBe(false);
  });

  it('data-js-sort のマークアップでも同様に動作する', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table>
        <table>
          <thead>
            <tr>
              <th scope="col" data-column="name" data-js-sort-header>
                <button type="button" data-js-sort>ラベル</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td>データ</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const onSort = vi.fn();
    component.addEventListener('dads-sort-change', onSort);

    const button = component.querySelector<HTMLButtonElement>('[data-js-sort]');
    const th = button?.closest('th');
    expect(button).toBeTruthy();
    expect(th).toBeTruthy();

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(th?.getAttribute('aria-sort')).toBe('ascending');

    const evt1 = onSort.mock.calls[0][0] as CustomEvent<DadsTableSortChangeDetail>;
    expect(evt1.detail.columnId).toBe('name');
    expect(evt1.detail.columnIndex).toBe(0);
    expect(evt1.detail.direction).toBe('ascending');
  });

  it('sort-behavior="dom" のとき、DOM上で行が並び替わり、noneで元の順序に戻る', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table sort-behavior="dom">
        <table>
          <thead>
            <tr>
              <th scope="col" data-sort-type="number">
                <button type="button" data-sort>数値</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td>2</td></tr>
            <tr><td>10</td></tr>
            <tr><td>1</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const getOrder = () =>
      Array.from(component.querySelectorAll('tbody tr')).map(
        (row) => row.querySelector('td')?.textContent?.trim() ?? '',
      );

    const button = component.querySelector<HTMLButtonElement>('[data-sort]');
    expect(button).toBeTruthy();

    expect(getOrder()).toEqual(['2', '10', '1']);

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getOrder()).toEqual(['1', '2', '10']);

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getOrder()).toEqual(['10', '2', '1']);

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getOrder()).toEqual(['2', '10', '1']);
  });

  it('data-sort-type="string" で判定を上書きできる', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table sort-behavior="dom">
        <table>
          <thead>
            <tr>
              <th scope="col" data-sort-type="string">
                <button type="button" data-sort>文字列</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td>2</td></tr>
            <tr><td>10</td></tr>
            <tr><td>1</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const getOrder = () =>
      Array.from(component.querySelectorAll('tbody tr')).map(
        (row) => row.querySelector('td')?.textContent?.trim() ?? '',
      );

    const button = component.querySelector<HTMLButtonElement>('[data-sort]');
    expect(button).toBeTruthy();

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getOrder()).toEqual(['1', '10', '2']);
  });

  it('data-sort-value を使って表示テキストとソート値を分離できる', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table sort-behavior="dom">
        <table>
          <thead>
            <tr>
              <th scope="col" data-sort-type="number">
                <button type="button" data-sort>順序</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td data-sort-value="2">B</td></tr>
            <tr><td data-sort-value="1">A</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const getOrder = () =>
      Array.from(component.querySelectorAll('tbody tr')).map(
        (row) => row.querySelector('td')?.textContent?.trim() ?? '',
      );

    const button = component.querySelector<HTMLButtonElement>('[data-sort]');
    expect(button).toBeTruthy();

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getOrder()).toEqual(['A', 'B']);
  });

  it('複数tbodyがある場合、各tbody内で独立に並び替える', async () => {
    const { defineTable } = await import('./table-define');
    defineTable();

    const component = renderWebComponent(`
      <dads-table sort-behavior="dom">
        <table>
          <thead>
            <tr>
              <th scope="col" data-sort-type="number">
                <button type="button" data-sort>数値</button>
              </th>
            </tr>
          </thead>
          <tbody id="group-a">
            <tr><td>2</td></tr>
            <tr><td>1</td></tr>
          </tbody>
          <tbody id="group-b">
            <tr><td>9</td></tr>
            <tr><td>8</td></tr>
          </tbody>
        </table>
      </dads-table>
    `);

    await waitForComponent('dads-table');

    const button = component.querySelector<HTMLButtonElement>('[data-sort]');
    expect(button).toBeTruthy();

    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const a = component.querySelector('#group-a');
    const b = component.querySelector('#group-b');
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();

    const aOrder = Array.from(a!.querySelectorAll('tr')).map((row) => row.textContent?.trim() ?? '');
    const bOrder = Array.from(b!.querySelectorAll('tr')).map((row) => row.textContent?.trim() ?? '');

    expect(aOrder).toEqual(['1', '2']);
    expect(bOrder).toEqual(['8', '9']);
  });
});
