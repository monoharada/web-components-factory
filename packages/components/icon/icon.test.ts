/**
 * DadsIcon コンポーネント テスト
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  waitForCustomElement,
} from '../../../tests/setup';

function waitTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('DadsIcon - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineIcon } = await import('./icon-define');
    defineIcon();
    defineIcon();
    expect(customElements.get('dads-icon')).toBeTruthy();
  });

  it('name指定でSVGパスが描画される', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    const path = svg?.querySelector('path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toBeTruthy();
    expect(path?.getAttribute('d')?.length).toBeGreaterThan(0);
  });

  it('未知のname → 空pathで開発者警告', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'nonexistent-icon');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    const path = svg?.querySelector('path');
    expect(path?.getAttribute('d')).toBe('');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown icon name: "nonexistent-icon"'),
    );

    warnSpy.mockRestore();
  });

  it('name未指定 → 空path', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    const path = svg?.querySelector('path');
    expect(path?.getAttribute('d')).toBe('');
  });

  it('name変更でpathが再描画される', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    await waitForCustomElement(element);

    const path = element.shadowRoot?.querySelector('svg path');
    const searchPath = path?.getAttribute('d');

    element.setAttribute('name', 'edit');
    await waitTick();

    const editPath = path?.getAttribute('d');
    expect(editPath).not.toBe(searchPath);
    expect(editPath?.length).toBeGreaterThan(0);
  });
});

describe('DadsIcon - サイズ', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('size属性でSVGのwidth/heightが変更される', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    element.setAttribute('size', '32');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('デフォルトsize → 20', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('20');
  });

  it('非数値size → デフォルト20にフォールバック', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    element.setAttribute('size', 'banana');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('20');
  });
});

describe('DadsIcon - アクセシビリティ', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルトでaria-hidden="true"がSVGとhostに設定', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('label指定 → role="img", title要素, aria-labelledby', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    element.setAttribute('label', '検索');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(svg?.getAttribute('aria-labelledby')).toBe('icon-title');
    expect(element.getAttribute('aria-hidden')).toBeNull();

    const title = svg?.querySelector(':scope > title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe('検索');
  });

  it('label削除 → 装飾モードに復帰', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    element.setAttribute('label', '検索');
    await waitForCustomElement(element);

    element.removeAttribute('label');
    await waitTick();

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
    expect(svg?.querySelector(':scope > title')).toBeNull();
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('SVGにfocusable="false"が設定されている', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    element = createTestElement('dads-icon');
    element.setAttribute('name', 'search');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });
});

describe('DadsIcon - 新規アイコン', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('document, image, folder, person アイコンが使用可能', async () => {
    const { defineDefaultIcon } = await import('./icon-define');
    defineDefaultIcon();

    for (const iconName of ['document', 'image', 'folder', 'person']) {
      element = createTestElement('dads-icon');
      element.setAttribute('name', iconName);
      await waitForCustomElement(element);

      const path = element.shadowRoot?.querySelector('svg path');
      expect(path?.getAttribute('d')?.length).toBeGreaterThan(0);

      cleanupTestElement(element);
      element = null;
    }
  });
});
