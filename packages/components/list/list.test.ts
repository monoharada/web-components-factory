/**
 * DadsList / DadsListItem テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsList - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = createTestElement('dads-list');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('marker-width 属性で --dads-list-marker-width を設定できる（不正値は解除）', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = createTestElement('dads-list');
    element.setAttribute('marker-width', '3');
    await waitForCustomElement(element);

    expect(element.style.getPropertyValue('--dads-list-marker-width')).toBe('3em');

    element.setAttribute('marker-width', '0');
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(element.style.getPropertyValue('--dads-list-marker-width')).toBe('');
  });

  it('data-depth を祖先 dads-list の数 + 1 で付与し、variant に応じてクランプする', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = renderWebComponent(`
      <dads-list variant="marker">
        <dads-list-item>
          item
          <dads-list variant="marker">
            <dads-list-item>
              nested
              <dads-list variant="marker">
                <dads-list-item>
                  nested
                  <dads-list variant="marker">
                    <dads-list-item>
                      nested
                      <dads-list variant="marker">
                        <dads-list-item>
                          nested
                          <dads-list variant="marker">
                            <dads-list-item>deep</dads-list-item>
                          </dads-list>
                        </dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </dads-list-item>
          </dads-list>
        </dads-list-item>
      </dads-list>
    `);
    await waitForCustomElement(element);

    const nested = element.querySelector('dads-list dads-list') as HTMLElement | null;
    expect(nested).toBeInTheDocument();
    if (!nested) return;
    await waitForCustomElement(nested);

    // depth: 2
    expect(nested.getAttribute('data-depth')).toBe('2');

    // Deepest list should be clamped (marker: max 6)
    const lists = Array.from(element.querySelectorAll('dads-list')) as HTMLElement[];
    const deepest = lists[lists.length - 1] ?? null;
    expect(deepest).toBeInTheDocument();
    if (!deepest) return;
    await waitForCustomElement(deepest);
    expect(deepest.getAttribute('data-depth')).toBe('6');

    // Switch to number variant (max 5)
    deepest.setAttribute('variant', 'number');
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(deepest.getAttribute('data-depth')).toBe('5');
  });

  it('nested dads-list は spacing 未指定時に親 spacing を継承する', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = renderWebComponent(`
      <dads-list spacing="lg">
        <dads-list-item>
          parent
          <dads-list>
            <dads-list-item>child</dads-list-item>
          </dads-list>
        </dads-list-item>
      </dads-list>
    `);
    await waitForCustomElement(element);

    const nested = element.querySelector('dads-list dads-list') as HTMLElement | null;
    expect(nested).toBeInTheDocument();
    if (!nested) return;
    await waitForCustomElement(nested);

    expect(nested.getAttribute('spacing')).toBe('lg');
  });
});

describe('DadsListItem - marker slot visibility (via inherited vars)', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('marker variant では marker slot が非表示、number variant では表示', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = renderWebComponent(`
      <dads-list variant="marker">
        <dads-list-item>
          <a slot="marker" href="https://example.com/">1.</a>
          item
        </dads-list-item>
      </dads-list>
    `);
    await waitForCustomElement(element);

    const item = element.querySelector('dads-list-item') as HTMLElement | null;
    expect(item).toBeInTheDocument();
    if (!item) return;
    await waitForCustomElement(item);

    const markerSlot = getShadowContent(item, 'slot[name="marker"]') as HTMLElement | null;
    expect(markerSlot).toBeInTheDocument();
    if (!markerSlot) return;

    // list 側が CSS 変数（継承）で表示モードを制御する
    expect(getComputedStyle(markerSlot).display).toBe('none');

    element.setAttribute('variant', 'number');
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(getComputedStyle(markerSlot).display).toBe('inline');

    // marker slot の中身（地のテキスト/リンク）は保持される
    const markerLink = item.querySelector('[slot="marker"]');
    expect(markerLink).toBeInTheDocument();
  });

  it('marker-size の既定フォールバックは 6px', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = createTestElement('dads-list-item');
    await waitForCustomElement(element);

    const sheets = element.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map((sheet) => Array.from(sheet.cssRules ?? []).map((rule) => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain('--_dads-list-marker-size: var(--dads-list-marker-size, 6px);');
    expect(sheetText).toContain('--_dads-list-item-gap: var(--dads-list-item-gap, var(--spacing-2, 8px));');
  });

  it('marker は marker 列で描画し、transform 補正を持たない', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = createTestElement('dads-list-item');
    await waitForCustomElement(element);

    const sheets = element.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map((sheet) => Array.from(sheet.cssRules ?? []).map((rule) => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain("grid-template-columns: var(--_dads-list-marker-width) minmax(0, 1fr);");
    expect(sheetText).toContain("[part='item'] {");
    expect(sheetText).toContain("[part='marker-glyph']::before");
    expect(sheetText).not.toContain("[part='item']::marker");
    expect(sheetText).not.toContain('transform:');
  });

  it('入れ子 dads-list の上余白と行間は spacing で制御される', async () => {
    const { defineDefaultList } = await import('./list-define');
    defineDefaultList();

    element = renderWebComponent(`
      <dads-list spacing="md">
        <dads-list-item>
          parent
          <dads-list>
            <dads-list-item>child A</dads-list-item>
            <dads-list-item>child B</dads-list-item>
          </dads-list>
        </dads-list-item>
      </dads-list>
    `);
    await waitForCustomElement(element);

    const nested = element.querySelector('dads-list dads-list') as HTMLElement | null;
    expect(nested).toBeInTheDocument();
    if (!nested) return;
    await waitForCustomElement(nested);

    const nestedSheets = nested.shadowRoot?.adoptedStyleSheets ?? [];
    const nestedSheetText = nestedSheets
      .map((sheet) => Array.from(sheet.cssRules ?? []).map((rule) => rule.cssText).join('\n'))
      .join('\n');
    expect(nestedSheetText).toContain("[part='base'] {");
    expect(nestedSheetText).toContain('row-gap: var(--dads-list-item-gap);');

    const item = element.querySelector('dads-list-item') as HTMLElement | null;
    expect(item).toBeInTheDocument();
    if (!item) return;
    await waitForCustomElement(item);
    const itemSheets = item.shadowRoot?.adoptedStyleSheets ?? [];
    const itemSheetText = itemSheets
      .map((sheet) => Array.from(sheet.cssRules ?? []).map((rule) => rule.cssText).join('\n'))
      .join('\n');
    expect(itemSheetText).toContain("[part='content'] > slot {");
    expect(itemSheetText).toContain('display: flex;');
    expect(itemSheetText).toContain('row-gap: var(--_dads-list-item-gap);');
    expect(itemSheetText).toContain('::slotted(dads-list) {');
    expect(itemSheetText).toContain('margin: 0px;');
    expect(itemSheetText).not.toContain('padding-block-start: var(--_dads-list-item-gap);');
    expect(itemSheetText).not.toContain('padding-block-end: var(--_dads-list-item-gap);');
  });
});
