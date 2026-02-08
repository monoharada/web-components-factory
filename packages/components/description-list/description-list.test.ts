/**
 * DadsDescriptionList テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';
import { createDescriptionListStyles } from './description-list-styles.js';
import { createDescriptionListTokens } from './description-list-tokens.js';

function waitForMicrotask(): Promise<void> {
  return new Promise<void>((resolve) => queueMicrotask(() => resolve()));
}

describe('DadsDescriptionList - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('defineDefaultDescriptionList() でコンポーネントが定義される', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = createTestElement('dads-description-list');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('defineDescriptionList(prefix) でプレフィックス付きタグが定義される', async () => {
    const { defineDescriptionList } = await import('./description-list-define.js');
    defineDescriptionList('my-ui');

    element = createTestElement('my-ui-description-list');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('marker 未指定時は none を既定値に正規化し、data-marker へ同期する', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = createTestElement('dads-description-list');
    await waitForCustomElement(element);

    expect(element.getAttribute('marker')).toBe('none');
    expect(element.getAttribute('data-marker')).toBe('none');
  });

  it('marker に不正値を設定すると none にフォールバックする', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = createTestElement('dads-description-list');
    await waitForCustomElement(element);

    element.setAttribute('marker', 'unknown');
    await waitForMicrotask();

    expect(element.getAttribute('marker')).toBe('none');
    expect(element.getAttribute('data-marker')).toBe('none');
  });

  it('marker 変更時に data-marker へ同期する', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = createTestElement('dads-description-list');
    await waitForCustomElement(element);

    element.setAttribute('marker', 'bullet');
    await waitForMicrotask();

    expect(element.getAttribute('marker')).toBe('bullet');
    expect(element.getAttribute('data-marker')).toBe('bullet');
  });

  it('data-marker 変更時に marker へ同期する', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = createTestElement('dads-description-list');
    await waitForCustomElement(element);

    element.setAttribute('data-marker', 'custom');
    await waitForMicrotask();

    expect(element.getAttribute('data-marker')).toBe('custom');
    expect(element.getAttribute('marker')).toBe('custom');
  });

  it('初期競合時は marker 属性を優先して正規化する', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = renderWebComponent(
      '<dads-description-list marker="bullet" data-marker="custom"></dads-description-list>'
    );
    await waitForCustomElement(element);

    expect(element.getAttribute('marker')).toBe('bullet');
    expect(element.getAttribute('data-marker')).toBe('bullet');
  });

  it('light DOM上で定義リスト（dl）を自動構築し、dt/dd を内包する', async () => {
    const { defineDefaultDescriptionList } = await import('./description-list-define.js');
    defineDefaultDescriptionList();

    element = renderWebComponent(`
      <dads-description-list>
        <div>
          <dt>項目名1</dt>
          <dd>説明1</dd>
        </div>
        <div>
          <dt>項目名2</dt>
          <dd>説明2</dd>
        </div>
      </dads-description-list>
    `);
    await waitForCustomElement(element);

    const base = element.querySelector('dl[data-dads-description-list-base]');
    expect(base).not.toBeNull();
    expect(base?.querySelectorAll('dt').length).toBe(2);
    expect(base?.querySelectorAll('dd').length).toBe(2);
  });
});

describe('DadsDescriptionList - styles', () => {
  it('none / bullet / custom の各セレクタが存在し、DADS互換ルールを含む', () => {
    const tokens = createDescriptionListTokens('dads-description-list');
    const styles = createDescriptionListStyles('dads-description-list');

    const sheetText = [tokens, styles]
      .map((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain("dads-description-list:is([marker='bullet'], [data-marker='bullet']) > dl[data-dads-description-list-base]");
    expect(sheetText).toContain("dads-description-list:is([marker='custom'], [data-marker='custom']) > dl[data-dads-description-list-base] dt > span:first-child");
    expect(sheetText).toContain('font-weight: var(--dads-description-list-term-font-weight);');
    expect(sheetText).toContain('margin-inline-start: var(--dads-description-list-indent);');
    expect(sheetText).toContain('display: grid;');
    expect(sheetText).toContain('overflow-wrap: var(--dads-description-list-overflow-wrap);');
  });
});
