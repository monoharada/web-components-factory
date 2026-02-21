/**
 * DadsChipTagコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsChipTag - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    expect(component).toBeInTheDocument();
  });

  it('baseパートが含まれる', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const base = getShadowElement(component, '[part="base"]');
    expect(base).toBeInTheDocument();
  });

  it('デフォルトの削除アイコンは円形パスを含まない', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const endIconSlot = getShadowElement(component, 'slot[name="end-icon"]');
    const path = endIconSlot?.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('d') ?? '').not.toContain('M9.50165 19');
  });
});

describe('DadsChipTag - 属性', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトでaction="remove" / remove-label="削除" が設定される', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    expect(component.getAttribute('action')).toBe('remove');
    expect(component.getAttribute('remove-label')).toBe('削除');
    expect(component.getAttribute('size')).toBe('md');
  });

  it('action="none" の場合にbaseがクリック可能になる', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag action="none">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('role')).toBe('button');
    expect(base?.getAttribute('tabindex')).toBe('0');
  });

  it('disabled の場合はアクションを無効化し、baseをフォーカス不可にする', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag disabled>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const base = getShadowElement(component, '[part="base"]');
    const action = getShadowElement(component, '[part="action"]') as HTMLButtonElement | null;
    expect(base?.getAttribute('role')).toBeNull();
    expect(base?.getAttribute('tabindex')).toBeNull();
    expect(base?.getAttribute('aria-disabled')).toBe('true');
    expect(action?.disabled).toBe(true);
    expect(action?.tabIndex).toBe(-1);
  });

  it('disabled を後から付与してもアクション状態が更新される', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);
    await waitForComponent('dads-chip-tag');

    component.setAttribute('disabled', '');
    await Promise.resolve();

    const base = getShadowElement(component, '[part="base"]');
    const action = getShadowElement(component, '[part="action"]') as HTMLButtonElement | null;
    expect(base?.getAttribute('role')).toBeNull();
    expect(base?.getAttribute('tabindex')).toBeNull();
    expect(base?.getAttribute('aria-disabled')).toBe('true');
    expect(action?.disabled).toBe(true);
  });

  it('valueを設定すると表示テキストがvalueで上書きされる', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag value="ValueText">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    expect(component.hasAttribute('data-has-value')).toBe(true);

    const valueEl = getShadowElement(component, '[part="value"]');
    expect(valueEl?.textContent).toBe('ValueText');
  });
});

describe('DadsChipTag - スタイル', () => {
  afterEach(() => {
    cleanup();
  });

  it('start-icon スロットは :empty で非表示にしない', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).not.toContain("[part='start-icon']:empty");
  });

  it('hover/active の再代入は action 状態ごとに限定される', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).not.toContain(':host(:hover)');
    expect(sheetText).not.toContain(':host(:active)');
    expect(sheetText).toContain(":host([action='none']:hover)");
    expect(sheetText).toContain(":host([action='none']:active)");
    expect(sheetText).toContain(":host([action='remove']) [part='action'] {");
    expect(sheetText).toContain(":host([action='remove']) [part='action']:hover");
    expect(sheetText).toContain(":host([action='remove']) [part='action']:active");
    expect(sheetText).toContain('--chip-tag-text-color-hover: var(--color-primitive-blue-1000');
    expect(sheetText).toContain('--chip-tag-text-color-active: var(--color-primitive-blue-1200');
    expect(sheetText).toContain('--chip-tag-action-background-hover: var(--color-primitive-blue-1000');
    expect(sheetText).toContain('--chip-tag-action-background-active: var(--color-primitive-blue-1200');
  });

  it('action のヒット領域拡張（::before）と size バリアントを持つ', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag>ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain("[part='action']::before");
    expect(sheetText).toContain(':host([size="sm"])');
    expect(sheetText).toContain(':host([size="lg"])');
    expect(sheetText).toContain('--chip-tag-action-hit-area: calc(');
  });

  it('action="none" は下線を持ち、hover/active で太くなる', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag action="none">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');
    const normalized = sheetText.replace(/\s+/g, ' ').trim();

    expect(normalized).toContain('text-decoration: var(--dads-chip-tag-label-text-decoration)');
    expect(normalized).toContain(
      'text-decoration-thickness: var(--dads-chip-tag-label-underline-thickness)',
    );
    expect(normalized).toContain(
      'text-underline-offset: var(--dads-chip-tag-label-underline-offset)',
    );
    expect(normalized).toContain(":host([action='none']) { --dads-chip-tag-label-text-decoration: underline; }");
    expect(normalized).toMatch(
      /:host\(\[action='none'\]:hover\)\s*\{[^}]*--dads-chip-tag-text-color: var\(--dads-chip-tag-text-color-hover\);[^}]*--dads-chip-tag-label-underline-thickness: var\(\s*--dads-chip-tag-label-underline-thickness-hover\s*\);[^}]*--dads-chip-tag-border-shadow: var\(--dads-chip-tag-border-shadow-hover\);/u,
    );
    expect(normalized).toMatch(
      /:host\(\[action='none'\]:active\)\s*\{[^}]*--dads-chip-tag-text-color: var\(--dads-chip-tag-text-color-active\);[^}]*--dads-chip-tag-label-underline-thickness: var\(\s*--dads-chip-tag-label-underline-thickness-hover\s*\);/u,
    );
  });
});

describe('DadsChipTag - イベント', () => {
  afterEach(() => {
    cleanup();
  });

  it('action="remove" で dads-chip-tag-remove が発火する', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag value="x">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');

    const handler = vi.fn();
    component.addEventListener('dads-chip-tag-remove', handler);

    const action = getShadowElement<HTMLButtonElement>(component, '[part="action"]');
    action?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const detail = handler.mock.calls[0]?.[0]?.detail;
    expect(detail?.label).toBe('ラベル');
    expect(detail?.value).toBe('x');
    expect(typeof detail?.remove).toBe('function');
  });

  it('dads-command(command="remove") で remove が実行される', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag value="x">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');

    const handler = vi.fn();
    component.addEventListener('dads-chip-tag-remove', handler);

    component.dispatchEvent(
      new CustomEvent('dads-command', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          command: 'remove',
          invoker: document.createElement('button'),
          target: component,
          value: null,
          originalEvent: null,
        },
      }),
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(component.isConnected).toBe(false);
  });

  it('action="none" で dads-chip-tag-click が発火する', async () => {
    const { defineDefaultChipTag } = await import('./chip-tag-define');
    defineDefaultChipTag();

    const component = renderWebComponent(`
      <dads-chip-tag action="none">ラベル</dads-chip-tag>
    `);

    await waitForComponent('dads-chip-tag');

    const handler = vi.fn();
    component.addEventListener('dads-chip-tag-click', handler);

    const base = getShadowElement(component, '[part="base"]');
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
