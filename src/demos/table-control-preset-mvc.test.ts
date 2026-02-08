import { afterEach, describe, expect, it } from 'vitest';
import { demos } from './showcase-table-control.js';
import { mountTableControlPresetDemo } from './table-control-preset-mvc.js';

function setupPresetDemo(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = demos.tableControl();
  document.body.append(host);

  const root = host.querySelector<HTMLElement>('#demo-table-control-preset-root');
  if (!root) {
    throw new Error('検索プリセット作例の root が見つかりません。');
  }

  mountTableControlPresetDemo(root);
  return root;
}

function parseCountText(text: string | null | undefined): number {
  if (!text) return 0;
  const digits = text.replace(/[^\d]/g, '');
  if (digits === '') return 0;
  return Number.parseInt(digits, 10);
}

function setControlValue(el: Element | null, value: string): void {
  if (!(el instanceof HTMLElement)) return;
  (el as unknown as { value?: string }).value = value;
  el.setAttribute('value', value);
}

function emitSelection(root: HTMLElement, rowIds: readonly string[]): void {
  const table = root.querySelector<HTMLElement>('#demo-preset-table');
  table?.dispatchEvent(new CustomEvent('dads-selection-change', {
    detail: {
      selectedRowIds: rowIds,
      selectedRowIndexes: [],
      selectedCount: rowIds.length,
      totalSelectableRows: 10,
    },
    bubbles: true,
    composed: true,
  }));
}

function emitRowMenuAction(root: HTMLElement, rowId: string, action: 'edit' | 'delete'): void {
  const row = root.querySelector<HTMLElement>(`#demo-preset-tbody tr[data-row-id="${rowId}"]`);
  const menu = row?.querySelector<HTMLElement>('dads-menu-list-box[data-row-actions]');
  menu?.dispatchEvent(new CustomEvent('menuitemselect', {
    detail: {
      selectedItem: document.createElement('div'),
      selectedValue: action,
      selectedIndex: action === 'edit' ? 0 : 1,
    },
    bubbles: true,
    composed: true,
  }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('table-control-preset-mvc', () => {
  it('検索プリセットで件数が変わり、リセット表示を切り替える', () => {
    const root = setupPresetDemo();
    const count = root.querySelector<HTMLElement>('#demo-preset-count');
    const resetButton = root.querySelector<HTMLButtonElement>('#demo-preset-reset');
    const preset = root.querySelector<HTMLElement>('dads-chip-tag[data-query="パスポート"]');

    expect(parseCountText(count?.textContent)).toBe(120);
    expect(resetButton?.getAttribute('data-visible')).toBe('false');

    preset?.dispatchEvent(new CustomEvent('dads-chip-tag-click', { bubbles: true, composed: true }));

    expect(parseCountText(count?.textContent)).toBeGreaterThan(0);
    expect(parseCountText(count?.textContent)).toBeLessThan(120);
    expect(resetButton?.getAttribute('data-visible')).toBe('true');

    resetButton?.click();

    expect(parseCountText(count?.textContent)).toBe(120);
    expect(resetButton?.getAttribute('data-visible')).toBe('false');
  });

  it('行選択で一括操作バーを表示する', () => {
    const root = setupPresetDemo();
    const bulkBar = root.querySelector<HTMLElement>('#demo-preset-bulk-bar');
    const bulkStatus = root.querySelector<HTMLElement>('#demo-preset-bulk-status');
    const rowIds = Array.from(root.querySelectorAll<HTMLElement>('#demo-preset-tbody tr[data-row-id]'))
      .slice(0, 2)
      .map((row) => row.dataset.rowId || '');

    expect(bulkBar?.hidden).toBe(true);

    emitSelection(root, rowIds);

    expect(bulkBar?.hidden).toBe(false);
    expect(bulkStatus?.textContent).toContain('2件選択中');
  });

  it('一括ステータス更新で選択行のステータスを更新する', () => {
    const root = setupPresetDemo();
    const firstRow = root.querySelector<HTMLElement>('#demo-preset-tbody tr[data-row-id]');
    const rowId = firstRow?.dataset.rowId ?? '';
    const bulkStatusSelect = root.querySelector<HTMLElement>('#demo-preset-bulk-status-select');
    const applyButton = root.querySelector<HTMLButtonElement>('#demo-preset-bulk-apply');

    emitSelection(root, [rowId]);

    setControlValue(bulkStatusSelect, '進行中');
    bulkStatusSelect?.dispatchEvent(new Event('change', { bubbles: true }));
    applyButton?.click();

    const statusText = root.querySelector<HTMLElement>(
      `#demo-preset-tbody tr[data-row-id="${rowId}"] dads-chip-label`,
    )?.textContent?.trim();

    expect(statusText).toBe('進行中');
  });

  it('1件編集で対象行のみ更新する', () => {
    const root = setupPresetDemo();
    const firstRow = root.querySelector<HTMLElement>('#demo-preset-tbody tr[data-row-id]');
    const rowId = firstRow?.dataset.rowId ?? '';
    const editDialog = root.querySelector<HTMLElement>('#demo-preset-edit-dialog');
    const editSave = root.querySelector<HTMLButtonElement>('#demo-preset-edit-save');

    emitRowMenuAction(root, rowId, 'edit');

    expect(editDialog?.hasAttribute('open')).toBe(true);

    setControlValue(root.querySelector('#demo-preset-edit-name'), '編集 太郎');
    setControlValue(root.querySelector('#demo-preset-edit-status'), '要連絡');
    setControlValue(root.querySelector('#demo-preset-edit-type'), '住民票');
    setControlValue(root.querySelector('#demo-preset-edit-date'), '2026年1月15日');
    editSave?.click();

    const row = root.querySelector<HTMLElement>(`#demo-preset-tbody tr[data-row-id="${rowId}"]`);
    const cells = row?.querySelectorAll('td') ?? [];
    const nameText = cells[1]?.textContent?.trim();
    const typeText = cells[4]?.textContent?.trim();
    const dateText = cells[5]?.textContent?.trim();
    const statusText = row?.querySelector('dads-chip-label')?.textContent?.trim();

    expect(nameText).toBe('編集 太郎');
    expect(statusText).toBe('要連絡');
    expect(typeText).toBe('住民票');
    expect(dateText).toBe('2026年1月15日');
    expect(editDialog?.hasAttribute('open')).toBe(false);
  });

  it('申請種別セルにマイナンバーカード・パスポート・住民票が表示される', () => {
    const root = setupPresetDemo();
    const tableText = root.querySelector('#demo-preset-tbody')?.textContent ?? '';

    expect(tableText).toContain('マイナンバーカード');
    expect(tableText).toContain('パスポート');
    expect(tableText).toContain('住民票');
  });

  it('行メニューの削除で確認ダイアログを経由して1件削除する', () => {
    const root = setupPresetDemo();
    const count = root.querySelector<HTMLElement>('#demo-preset-count');
    const firstRow = root.querySelector<HTMLElement>('#demo-preset-tbody tr[data-row-id]');
    const rowId = firstRow?.dataset.rowId ?? '';
    const deleteDialog = root.querySelector<HTMLElement>('#demo-preset-delete-dialog');
    const deleteConfirm = root.querySelector<HTMLButtonElement>('#demo-preset-delete-confirm');

    expect(parseCountText(count?.textContent)).toBe(120);

    emitRowMenuAction(root, rowId, 'delete');
    expect(deleteDialog?.hasAttribute('open')).toBe(true);

    deleteConfirm?.click();

    expect(parseCountText(count?.textContent)).toBe(119);
    expect(deleteDialog?.hasAttribute('open')).toBe(false);
  });

  it('一括削除は確認ダイアログを経由して件数を減らす', () => {
    const root = setupPresetDemo();
    const count = root.querySelector<HTMLElement>('#demo-preset-count');
    const rowIds = Array.from(root.querySelectorAll<HTMLElement>('#demo-preset-tbody tr[data-row-id]'))
      .slice(0, 2)
      .map((row) => row.dataset.rowId || '');
    const deleteOpen = root.querySelector<HTMLButtonElement>('#demo-preset-bulk-delete');
    const deleteDialog = root.querySelector<HTMLElement>('#demo-preset-delete-dialog');
    const deleteConfirm = root.querySelector<HTMLButtonElement>('#demo-preset-delete-confirm');

    expect(parseCountText(count?.textContent)).toBe(120);

    emitSelection(root, rowIds);
    deleteOpen?.click();
    expect(deleteDialog?.hasAttribute('open')).toBe(true);

    deleteConfirm?.click();

    expect(parseCountText(count?.textContent)).toBe(118);
    expect(deleteDialog?.hasAttribute('open')).toBe(false);
  });
});
