/**
 * DadsChipLabelコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsChipLabel - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label>ラベル</dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    expect(component).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label>ラベル</dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('baseパートが含まれる', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label>ラベル</dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    const base = getShadowElement(component, '[part="base"]');
    expect(base).toBeInTheDocument();
    expect(base?.tagName.toLowerCase()).toBe('span');
  });
});

describe('DadsChipLabel - 属性', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトでvariant="text" / color="gray" が設定される', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label>ラベル</dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    expect(component.getAttribute('variant')).toBe('text');
    expect(component.getAttribute('color')).toBe('gray');
  });

  it('指定したvariant/colorは上書きされない', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label variant="outline" color="blue">ラベル</dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    expect(component.getAttribute('variant')).toBe('outline');
    expect(component.getAttribute('color')).toBe('blue');
  });
});

describe('DadsChipLabel - スロット', () => {
  afterEach(() => {
    cleanup();
  });

  it('slot="icon" が割り当てられる', async () => {
    const { defineDefaultChipLabel } = await import('./chip-label-define');
    defineDefaultChipLabel();

    const component = renderWebComponent(`
      <dads-chip-label>
        <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
          <path d="M0 0h24v24H0z"/>
        </svg>
        ラベル
      </dads-chip-label>
    `);

    await waitForComponent('dads-chip-label');
    const iconSlot = getShadowElement<HTMLSlotElement>(component, 'slot[name="icon"]');
    expect(iconSlot).toBeInTheDocument();

    const assigned = iconSlot?.assignedElements?.() ?? [];
    expect(assigned.length).toBe(1);
    expect(assigned[0]?.tagName.toLowerCase()).toBe('svg');
  });
});
