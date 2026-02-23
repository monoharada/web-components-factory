/**
 * DadsProgressBarコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsProgressBar - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('defineProgressBar() 重複実行で問題なく登録', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();
    defineDefaultProgressBar();

    expect(customElements.get('dads-progress-bar')).toBeTruthy();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar label="読み込み中"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('[part="base"]にrole="progressbar"が設定', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('role')).toBe('progressbar');
  });
});

describe('DadsProgressBar - Determinate', () => {
  afterEach(() => {
    cleanup();
  });

  it('value="0.5" で aria-valuenow="50", aria-valuemin="0", aria-valuemax="100"', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar value="0.5"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('50');
    expect(base?.getAttribute('aria-valuemin')).toBe('0');
    expect(base?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('value="3" max="10" で aria-valuenow="30"', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar value="3" max="10"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('30');
  });

  it('value="2" max="1" → clamp → aria-valuenow="100"', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar value="2" max="1"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('value="-1" → clamp → aria-valuenow="0"', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar value="-1"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('0');
  });
});

describe('DadsProgressBar - フォールバック', () => {
  afterEach(() => {
    cleanup();
  });

  it('value未設定で aria-valuenow="0"（0%扱い）', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('0');
    expect(base?.getAttribute('aria-valuemin')).toBe('0');
    expect(base?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('value="abc" (NaN) → 0%扱い', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar value="abc"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBe('0');
    expect(base?.getAttribute('aria-valuemin')).toBe('0');
    expect(base?.getAttribute('aria-valuemax')).toBe('100');
  });
});

describe('DadsProgressBar - レイアウト', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルト composition="stacked"', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    expect(component.getAttribute('composition')).toBe('stacked');
  });

  it('underlay属性でunderlay partが存在', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar underlay label="読み込み中"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const underlay = getShadowElement(component, '[part="underlay"]');
    expect(underlay).toBeInTheDocument();
  });
});

describe('DadsProgressBar - ARIA/アクセシビリティ', () => {
  afterEach(() => {
    cleanup();
  });

  it('label指定時にaria-labelが設定される', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar label="読み込み中"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBe('読み込み中');
  });

  it('label未指定時にaria-labelがない', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBeNull();
  });

  it('label削除でaria-labelも削除', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar label="読み込み中"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBe('読み込み中');

    component.removeAttribute('label');
    await waitForComponent('dads-progress-bar');
    expect(base?.getAttribute('aria-label')).toBeNull();
  });
});

describe('DadsProgressBar - CSS Parts', () => {
  afterEach(() => {
    cleanup();
  });

  it('全5パーツが存在する', async () => {
    const { defineDefaultProgressBar } = await import('./progress-bar-define');
    defineDefaultProgressBar();

    const component = renderWebComponent(`
      <dads-progress-bar underlay label="テスト"></dads-progress-bar>
    `);

    await waitForComponent('dads-progress-bar');

    const parts = ['base', 'track', 'indicator', 'label', 'underlay'];
    for (const part of parts) {
      const el = getShadowElement(component, `[part="${part}"]`);
      expect(el, `part="${part}" should exist`).toBeInTheDocument();
    }
  });
});
