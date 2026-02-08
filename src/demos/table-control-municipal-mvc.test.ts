import { afterEach, describe, expect, it, vi } from 'vitest';
import { demos } from './showcase-table-control.js';
import { mountTableControlMunicipalDemo } from './table-control-municipal-mvc.js';

function setupMunicipalDemo(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = demos.tableControl();
  document.body.append(host);

  const root = host.querySelector<HTMLElement>('#demo-table-control-municipal-root');
  if (!root) {
    throw new Error('自治体デモの root が見つかりません。');
  }

  mountTableControlMunicipalDemo(root);
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

describe('table-control-municipal-mvc', () => {
  it('検索後に検索行のリセットボタンが表示される', () => {
    const root = setupMunicipalDemo();
    const searchBox = root.querySelector<HTMLElement>('#demo-municipal-search');
    const resetButton = root.querySelector<HTMLButtonElement>('#demo-municipal-reset');
    expect(searchBox).toBeTruthy();
    expect(resetButton).toBeTruthy();

    searchBox?.dispatchEvent(new CustomEvent('dads-search', {
      detail: { query: 'パスポート', scope: '' },
      bubbles: true,
      composed: true,
    }));

    expect(resetButton?.getAttribute('data-visible')).toBe('true');
    expect(resetButton?.getAttribute('aria-hidden')).toBe('false');
    expect(resetButton?.tabIndex).toBe(0);

    resetButton?.click();

    expect(resetButton?.getAttribute('data-visible')).toBe('false');
    expect(resetButton?.getAttribute('aria-hidden')).toBe('true');
    expect(resetButton?.tabIndex).toBe(-1);
  });

  it('新規追加は1回クリックで1件だけ追加される', () => {
    const root = setupMunicipalDemo();
    const count = root.querySelector<HTMLElement>('#demo-municipal-count');
    const openButton = root.querySelector<HTMLElement>('#demo-municipal-create');
    const saveButton = root.querySelector<HTMLElement>('#demo-municipal-create-save');

    expect(count?.textContent).toContain('1,200 件');

    openButton?.click();

    setControlValue(root.querySelector('#demo-municipal-create-request-type'), '住民票写し申請');
    setControlValue(root.querySelector('#demo-municipal-create-applicant-name'), '確認 太郎');
    setControlValue(root.querySelector('#demo-municipal-create-status'), '進行中');
    setControlValue(root.querySelector('#demo-municipal-create-application-type'), '電子');

    saveButton?.click();

    expect(count?.textContent).toContain('1,201 件');

    const titles = Array.from(root.querySelectorAll<HTMLElement>('#demo-municipal-tbody th[scope="row"]'))
      .map((el) => el.textContent?.trim());
    expect(titles[0]).toBe('住民票写し申請');
    expect(titles.filter((value) => value === '住民票写し申請')).toHaveLength(1);
  });

  it('入力中は他フィールドへフォーカス移動しない', () => {
    const root = setupMunicipalDemo();
    const openButton = root.querySelector<HTMLElement>('#demo-municipal-create');
    const requestType = root.querySelector<HTMLElement>('#demo-municipal-create-request-type');
    const applicantName = root.querySelector<HTMLElement>('#demo-municipal-create-applicant-name');

    openButton?.click();
    expect(requestType).toBeTruthy();
    expect(applicantName).toBeTruthy();

    const applicantFocusSpy = vi.spyOn(applicantName as HTMLElement, 'focus');

    setControlValue(requestType, 'あ');
    requestType?.dispatchEvent(new CustomEvent('dads-input', {
      bubbles: true,
      composed: true,
    }));

    expect(applicantFocusSpy).not.toHaveBeenCalled();
  });

  it('保存時は先頭の未入力項目へフォーカスする', () => {
    const root = setupMunicipalDemo();
    const openButton = root.querySelector<HTMLElement>('#demo-municipal-create');
    const saveButton = root.querySelector<HTMLElement>('#demo-municipal-create-save');
    const requestType = root.querySelector<HTMLElement>('#demo-municipal-create-request-type');
    const applicantName = root.querySelector<HTMLElement>('#demo-municipal-create-applicant-name');

    openButton?.click();
    expect(requestType).toBeTruthy();
    expect(applicantName).toBeTruthy();

    const requestTypeFocusSpy = vi.spyOn(requestType as HTMLElement, 'focus');
    const applicantFocusSpy = vi.spyOn(applicantName as HTMLElement, 'focus');

    saveButton?.click();

    expect(requestTypeFocusSpy).toHaveBeenCalledTimes(1);
    expect(applicantFocusSpy).not.toHaveBeenCalled();
  });

  it('同じrootに再mountしても新規追加が重複しない', () => {
    const root = setupMunicipalDemo();
    const count = root.querySelector<HTMLElement>('#demo-municipal-count');
    const openButton = root.querySelector<HTMLElement>('#demo-municipal-create');
    const saveButton = root.querySelector<HTMLElement>('#demo-municipal-create-save');

    mountTableControlMunicipalDemo(root);

    openButton?.click();
    setControlValue(root.querySelector('#demo-municipal-create-request-type'), '再mount確認申請');
    setControlValue(root.querySelector('#demo-municipal-create-applicant-name'), '単発 登録');
    saveButton?.click();

    expect(count?.textContent).toContain('1,201 件');

    const titles = Array.from(root.querySelectorAll<HTMLElement>('#demo-municipal-tbody th[scope="row"]'))
      .map((el) => el.textContent?.trim());
    expect(titles.filter((value) => value === '再mount確認申請')).toHaveLength(1);
  });

  it('印刷とCSVダウンロードの操作経路が動作する', () => {
    const root = setupMunicipalDemo();
    const printButton = root.querySelector<HTMLElement>('#demo-municipal-print');
    const csvButton = root.querySelector<HTMLElement>('#demo-municipal-csv');

    const printSpy = vi.fn();
    Object.defineProperty(window, 'print', {
      configurable: true,
      writable: true,
      value: printSpy,
    });

    const createObjectURLSpy = vi.fn(() => 'blob:test');
    const revokeObjectURLSpy = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURLSpy,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURLSpy,
    });

    printButton?.click();
    csvButton?.click();

    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
  });
});
