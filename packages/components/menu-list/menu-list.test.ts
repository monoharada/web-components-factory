/**
 * DadsMenuList / DadsMenuListItem テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsMenuList - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('indentation 属性で --menu-list-indentation を設定できる', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list');
    element.setAttribute('indentation', '2');
    await waitForCustomElement(element);

    expect(element.style.getPropertyValue('--menu-list-indentation')).toBe('2');

    element.setAttribute('indentation', '-1');
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(element.style.getPropertyValue('--menu-list-indentation')).toBe('');
  });
});

describe('DadsMenuListItem - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルトは button を描画する', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base');
    expect(base).toBeInTheDocument();
    expect(base).toBeInstanceOf(HTMLButtonElement);
  });

  it('href を指定すると a を描画する', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = renderWebComponent(
      '<dads-menu-list-item href="https://example.com/">リンク</dads-menu-list-item>',
    );
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base');
    expect(base).toBeInTheDocument();
    expect(base).toBeInstanceOf(HTMLAnchorElement);
    expect((base as HTMLAnchorElement).getAttribute('href')).toBe('https://example.com/');
  });

  it('start-icon の slot ありで data-has-start-icon が付与される', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    expect(element.hasAttribute('data-has-start-icon')).toBe(false);

    const icon = document.createElement('span');
    icon.setAttribute('slot', 'start-icon');
    icon.textContent = 'x';
    element.appendChild(icon);

    // slotchange / MutationObserver の反映待ち（happy-dom環境では遅延することがある）
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(element.hasAttribute('data-has-start-icon')).toBe(true);
  });

  it('tail-icon="new-window" で data-has-tail-icon が付与される', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    expect(element.hasAttribute('data-has-tail-icon')).toBe(false);

    element.setAttribute('tail-icon', 'new-window');
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(element.hasAttribute('data-has-tail-icon')).toBe(true);
  });

  it('tail-icon の slot フォールバックは slotted として扱わない', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    expect(element.hasAttribute('data-has-tail-icon')).toBe(false);

    const tailSlot = getShadowContent(element, '#tail-icon-slot') as HTMLSlotElement | null;
    expect(tailSlot).toBeInTheDocument();
    if (!tailSlot) return;

    const fallbackNodes = Array.from(tailSlot.childNodes);
    // Simulate an environment where assignedNodes() incorrectly includes fallback nodes.
    (tailSlot as unknown as { assignedNodes: () => Node[] }).assignedNodes = () => fallbackNodes;

    tailSlot.dispatchEvent(new Event('slotchange'));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(element.hasAttribute('data-has-tail-icon')).toBe(false);
  });

  it('子の dads-menu-list は slot="children" に自動配置される', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    const child = document.createElement('dads-menu-list');
    child.setAttribute('indentation', '1');
    element.appendChild(child);

    await waitForCustomElement(child);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(child.getAttribute('slot')).toBe('children');
  });

  it('getFocusTarget() で内部のフォーカス対象を取得できる', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    element = createTestElement('dads-menu-list-item');
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base') as HTMLElement | null;
    const focusTarget = (element as unknown as { getFocusTarget: () => HTMLElement | null }).getFocusTarget();

    expect(focusTarget).toBe(base);
  });

  it('javascript: URL はブロックされ # にフォールバックする', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    // Suppress expected console warning
    const originalWarn = console.warn;
    const warnings: string[] = [];
    console.warn = (msg: string) => warnings.push(msg);

    element = renderWebComponent(
      '<dads-menu-list-item href="javascript:alert(1)">XSS attempt</dads-menu-list-item>',
    );
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base') as HTMLAnchorElement | null;
    expect(base).toBeInstanceOf(HTMLAnchorElement);
    expect(base?.getAttribute('href')).toBe('#');
    expect(warnings.some((w) => w.includes('Invalid href value blocked'))).toBe(true);

    console.warn = originalWarn;
  });

  it('有効な URL (http/https/相対パス) は許可される', async () => {
    const { defineDefaultMenuList } = await import('./menu-list-define');
    defineDefaultMenuList();

    const validUrls = [
      'https://example.com',
      'http://example.com',
      '/path/to/page',
      './relative',
      '../parent',
      '#anchor',
    ];

    for (const url of validUrls) {
      const testEl = renderWebComponent(
        `<dads-menu-list-item href="${url}">Link</dads-menu-list-item>`,
      );
      await waitForCustomElement(testEl);

      const base = getShadowContent(testEl, '#base') as HTMLAnchorElement | null;
      expect(base?.getAttribute('href')).toBe(url);

      cleanupTestElement(testEl);
    }
  });
});
