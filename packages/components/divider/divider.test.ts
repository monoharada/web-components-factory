/**
 * DadsDivider コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  getDefinitionStyles,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

function waitTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function toCssText(style: string | CSSStyleSheet): string {
  if (typeof style === 'string') return style;
  return Array.from(style.cssRules)
    .map((rule) => rule.cssText)
    .join('\n');
}

describe('DadsDivider - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineDivider } = await import('./divider-define');

    defineDivider();
    defineDivider();

    expect(customElements.get('dads-divider')).toBeTruthy();
  });

  it('デフォルト属性とアクセシビリティ属性が設定される', async () => {
    const { defineDefaultDivider } = await import('./divider-define');
    defineDefaultDivider();

    element = createTestElement('dads-divider');
    await waitForCustomElement(element);

    expect(element.getAttribute('orientation')).toBe('horizontal');
    expect(element.getAttribute('data-color')).toBe('solid-gray-420');
    expect(element.getAttribute('data-style')).toBe('solid');
    expect(element.getAttribute('data-width')).toBe('1');
    expect(element.getAttribute('role')).toBe('separator');
    expect(element.getAttribute('aria-orientation')).toBe('horizontal');
    expect(getShadowContent(element, '#line')).toBeTruthy();
    expect(getShadowContent(element, '#line')?.tagName).toBe('HR');
  });

  it('不正な属性値は正規化される', async () => {
    const { defineDefaultDivider } = await import('./divider-define');
    defineDefaultDivider();

    element = renderWebComponent(
      '<dads-divider orientation="diagonal" data-color="unknown" data-style="dot" data-width="9"></dads-divider>',
    );
    await waitForCustomElement(element);
    await waitTick();

    expect(element.getAttribute('orientation')).toBe('horizontal');
    expect(element.getAttribute('data-color')).toBe('solid-gray-420');
    expect(element.getAttribute('data-style')).toBe('solid');
    expect(element.getAttribute('data-width')).toBe('1');
  });

  it('orientation="vertical" で aria-orientation も vertical になる', async () => {
    const { defineDefaultDivider } = await import('./divider-define');
    defineDefaultDivider();

    element = createTestElement('dads-divider');
    await waitForCustomElement(element);

    element.setAttribute('orientation', 'vertical');
    await waitTick();

    expect(element.getAttribute('orientation')).toBe('vertical');
    expect(element.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('DADS互換属性セレクタをスタイルとして保持する', async () => {
    const { DadsDivider } = await import('./divider');
    const styles = getDefinitionStyles(DadsDivider.definition);
    const styleText = styles.map(toCssText).join('\n');

    expect(styleText).toContain(":host([data-color='solid-gray-420'])");
    expect(styleText).toContain(":host([data-style='dashed'])");
    expect(styleText).toContain(":host([data-width='4'])");
    expect(styleText).toContain(":host([orientation='vertical'])");
    expect(styleText).toContain('--dads-divider-margin');
    expect(styleText).toContain('--dads-divider-margin-vertical');
    expect(styleText).toContain('margin: var(');
    expect(styleText).toContain('--dads-divider-margin-block-start: var(--dads-divider-margin-block);');
    expect(styleText).toContain('--dads-divider-margin-block-end: var(--dads-divider-margin-block);');
    expect(styleText).toContain('--dads-divider-margin-inline-start: var(--dads-divider-margin-inline);');
    expect(styleText).toContain('--dads-divider-margin-inline-end: var(--dads-divider-margin-inline);');
  });
});
