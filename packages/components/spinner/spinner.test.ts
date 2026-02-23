/**
 * DadsSpinnerコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsSpinner - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('defineSpinner() 重複実行で問題なく登録', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();
    defineDefaultSpinner();

    expect(customElements.get('dads-spinner')).toBeTruthy();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner label="読み込み中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('Shadow DOM内にSVG要素が存在', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner label="読み込み中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const svg = getShadowElement(component, '[part="svg"]');
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName.toLowerCase()).toBe('svg');
  });

  it('SVGにcircle(track)とcircle(indicator)が存在', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const track = getShadowElement(component, '[part="track"]');
    const indicator = getShadowElement(component, '[part="indicator"]');

    expect(track).toBeInTheDocument();
    expect(track?.tagName.toLowerCase()).toBe('circle');
    expect(track?.getAttribute('r')).toBe('20');
    expect(track?.getAttribute('stroke-width')).toBe('4');

    expect(indicator).toBeInTheDocument();
    expect(indicator?.tagName.toLowerCase()).toBe('circle');
    expect(indicator?.getAttribute('r')).toBe('20');
    expect(indicator?.getAttribute('stroke-dasharray')).toBe('125.66');
  });

  it('[part="base"]にrole="progressbar"が設定', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('role')).toBe('progressbar');
  });
});

describe('DadsSpinner - サイズ', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトsize="lg"', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    expect(component.getAttribute('size')).toBe('lg');
  });

  it('size="sm"が反映される', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner size="sm"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    expect(component.getAttribute('size')).toBe('sm');
  });
});

describe('DadsSpinner - レイアウト', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトcomposition="stacked"', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    expect(component.getAttribute('composition')).toBe('stacked');
  });

  it('composition="inlined"が反映', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner composition="inlined"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    expect(component.getAttribute('composition')).toBe('inlined');
  });

  it('underlay属性でunderlay partが存在', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner underlay label="読み込み中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const underlay = getShadowElement(component, '[part="underlay"]');
    expect(underlay).toBeInTheDocument();
  });
});

describe('DadsSpinner - ARIA/アクセシビリティ', () => {
  afterEach(() => {
    cleanup();
  });

  it('indeterminate: aria-valuenow/min/maxが存在しない', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-valuenow')).toBeNull();
    expect(base?.getAttribute('aria-valuemin')).toBeNull();
    expect(base?.getAttribute('aria-valuemax')).toBeNull();
  });

  it('label指定時にaria-labelが設定される', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner label="読み込み中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBe('読み込み中');
  });

  it('label未指定時にaria-labelがない', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBeNull();
  });

  it('label指定時にlabel partが存在しテキストが表示', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner label="処理中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const labelEl = getShadowElement(component, '[part="label"]');
    expect(labelEl).toBeInTheDocument();
    expect(labelEl?.textContent).toBe('処理中');
  });

  it('label削除でaria-labelも削除', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner label="読み込み中"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');
    const base = getShadowElement(component, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBe('読み込み中');

    component.removeAttribute('label');
    await waitForComponent('dads-spinner');
    expect(base?.getAttribute('aria-label')).toBeNull();
  });
});

describe('DadsSpinner - CSS Parts', () => {
  afterEach(() => {
    cleanup();
  });

  it('全6パーツが存在する', async () => {
    const { defineDefaultSpinner } = await import('./spinner-define');
    defineDefaultSpinner();

    const component = renderWebComponent(`
      <dads-spinner underlay label="テスト"></dads-spinner>
    `);

    await waitForComponent('dads-spinner');

    const parts = ['base', 'svg', 'track', 'indicator', 'label', 'underlay'];
    for (const part of parts) {
      const el = getShadowElement(component, `[part="${part}"]`);
      expect(el, `part="${part}" should exist`).toBeInTheDocument();
    }
  });
});
