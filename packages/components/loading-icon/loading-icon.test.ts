/**
 * DadsLoadingIconコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsLoadingIcon - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('defineLoadingIcon() 重複実行で問題なく登録', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();
    defineDefaultLoadingIcon();

    expect(customElements.get('dads-loading-icon')).toBeTruthy();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon label="読み込み中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('SVGにDADS砂時計pathが存在', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const svg = getShadowElement(component, '[part="icon"]');
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName.toLowerCase()).toBe('svg');

    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBe(3);
    // フレーム（ストローク）
    expect(paths?.[0].getAttribute('stroke')).toBe('currentColor');
    // 上砂 + 下砂（フィル）
    expect(paths?.[1].getAttribute('fill')).toBe('currentColor');
    expect(paths?.[2].getAttribute('fill')).toBe('currentColor');
    // 砂粒（circle要素）
    const circles = svg?.querySelectorAll('circle');
    expect(circles?.length).toBe(2);
  });
});

describe('DadsLoadingIcon - サイズ', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトsize="lg"', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    expect(component.getAttribute('size')).toBe('lg');
  });

  it('size="sm"が反映される', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon size="sm"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    expect(component.getAttribute('size')).toBe('sm');
  });
});

describe('DadsLoadingIcon - レイアウト', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトcomposition="stacked"', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    expect(component.getAttribute('composition')).toBe('stacked');
  });

  it('underlay属性でunderlay partが存在', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon underlay label="読み込み中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const underlay = getShadowElement(component, '[part="underlay"]');
    expect(underlay).toBeInTheDocument();
  });
});

describe('DadsLoadingIcon - ARIA/アクセシビリティ', () => {
  afterEach(() => {
    cleanup();
  });

  it('label未指定時にSVGにaria-hidden="true"が設定', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const svg = getShadowElement(component, '[part="icon"]');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
  });

  it('label指定時にrole="img"とaria-labelledbyが設定', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon label="読み込み中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const svg = getShadowElement(component, '[part="icon"]');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-labelledby')).toBe('icon-title');
  });

  it('label指定時にSVG内にtitle要素が存在', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon label="読み込み中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const svg = getShadowElement(component, '[part="icon"]');
    const title = svg?.querySelector('title');
    expect(title).toBeTruthy();
    expect(title?.id).toBe('icon-title');
    expect(title?.textContent).toBe('読み込み中');
  });

  it('label削除でaria-hidden="true"に戻る', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon label="読み込み中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const svg = getShadowElement(component, '[part="icon"]');
    expect(svg?.getAttribute('role')).toBe('img');

    component.removeAttribute('label');
    await waitForComponent('dads-loading-icon');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
    expect(svg?.querySelector('title')).toBeNull();
  });

  it('label指定時にlabel partにテキストが表示', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon label="処理中"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');
    const labelEl = getShadowElement(component, '[part="label"]');
    expect(labelEl).toBeInTheDocument();
    expect(labelEl?.textContent).toBe('処理中');
  });
});

describe('DadsLoadingIcon - CSS Parts', () => {
  afterEach(() => {
    cleanup();
  });

  it('全4パーツが存在する', async () => {
    const { defineDefaultLoadingIcon } = await import('./loading-icon-define');
    defineDefaultLoadingIcon();

    const component = renderWebComponent(`
      <dads-loading-icon underlay label="テスト"></dads-loading-icon>
    `);

    await waitForComponent('dads-loading-icon');

    const parts = ['base', 'icon', 'label', 'underlay'];
    for (const part of parts) {
      const el = getShadowElement(component, `[part="${part}"]`);
      expect(el, `part="${part}" should exist`).toBeInTheDocument();
    }
  });
});
