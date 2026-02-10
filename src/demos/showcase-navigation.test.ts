import { describe, expect, it } from 'vitest';
import { demos } from './showcase-navigation.js';

describe('showcase-navigation (globalMenu demo)', () => {
  it('アクセシビリティ注釈セクションを含む', () => {
    const html = demos.globalMenu();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-global-menu"');
    expect(html).not.toContain('callout-lane="top"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / Controls'),
    );
  });

  it('nav 名の付与に aria-label を使用する作例を含む', () => {
    const html = demos.globalMenu();
    expect(html).toContain('<dads-global-menu data-api-target aria-label="グローバルナビゲーション">');
    expect(html).toContain('<code>aria-label</code>');
    expect(html).toContain('nav ランドマーク名');
  });

  it('a11y-annotate を読み込む', () => {
    const html = demos.globalMenu();
    expect(html).toContain("import('a11y-annotate')");
  });
});

describe('showcase-navigation (utilityLink demo)', () => {
  it('アクセシビリティ注釈セクションを含む', () => {
    const html = demos.utilityLink();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-utility-link"');
  });

  it('dads-utility-link を読み込む', () => {
    const html = demos.utilityLink();
    expect(html).toContain("import('dads-utility-link')");
  });

  it('APIテーブルに主要属性を含む', () => {
    const html = demos.utilityLink();
    expect(html).toContain('<code>href</code>');
    expect(html).toContain('<code>target</code>');
    expect(html).toContain('<code>rel</code>');
    expect(html).toContain('<code>download</code>');
  });

  it('lead-icon の表示切替は hidden 属性で制御する', () => {
    const html = demos.utilityLink();
    expect(html).toContain('data-api-target-selector="[data-utility-link-lead-icon]"');
    expect(html).toContain('data-api-attr="hidden"');
  });

  it('tail-icon の表示切替は hidden 属性で制御する', () => {
    const html = demos.utilityLink();
    expect(html).toContain('<code>tail-icon</code>');
    expect(html).toContain('data-api-target-selector="[data-utility-link-tail-icon]"');
    expect(html).toContain('aria-label="tail-icon"');
  });
});

describe('showcase-navigation (carousel demo)', () => {
  it('写真データ準備ガイドを含む', () => {
    const html = demos.carousel();
    expect(html).toContain('使い方（写真データの準備）');
    expect(html).toContain('<code>src</code>');
    expect(html).toContain('<code>alt</code>');
    expect(html).toContain('<code>srcset</code>');
    expect(html).toContain('<code>width</code> / <code>height</code>');
    expect(html).toContain("if (carousel) carousel.items = items;");
    expect(html).toContain('cmsResponse.banners.map');
  });

  it('API / Controls セクションを含み、dads-carousel を data-api-target として操作できる', () => {
    const html = demos.carousel();
    expect(html).toContain('API / Controls（Storybook風）');
    expect(html).toContain('data-carousel-api-target');
    expect(html).toContain('data-api-target');
    expect(html).toContain('<code>breakpoint-rem</code>');
    expect(html).toContain('<code>image-slider</code>');
    expect(html).toContain('<code>data-wide</code>');
    expect(html).toContain('<code>data-image-slider</code>');
  });

  it('Events API セクションと主要イベント名を含む', () => {
    const html = demos.carousel();
    expect(html).toContain('Events API');
    expect(html).toContain('dads-carousel-before-change');
    expect(html).toContain('dads-carousel-index-change');
    expect(html).toContain('dads-carousel-layout-change');
    expect(html).toContain('dads-carousel-controls-update');
    expect(html).toContain('dads-carousel-media-loaded');
    expect(html).toContain('dads-carousel-media-error');
  });

  it('Preview width と state 表示で data-wide 切替を確認できるUIを含む', () => {
    const html = demos.carousel();
    expect(html).toContain('data-carousel-api-width');
    expect(html).toContain('data-carousel-api-state');
    expect(html).toContain('value="1024" aria-label="Preview width" data-carousel-api-width');
    expect(html).toContain('data-carousel-api-frame style="width: 1024px; max-width: 100%;"');
    expect(html).toContain("observer.observe(carouselApiPreview");
    expect(html).toContain("attributeFilter: ['data-image-slider', 'data-wide', 'data-expanded', 'breakpoint-rem']");
    expect(html).toContain('state: data-image-slider=-, data-wide=-, data-expanded=-');
  });

  it('ローカル固定画像を使った6スライド構成になっている', () => {
    const html = demos.carousel();
    expect(html).toContain('/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-1.webp');
    expect(html).toContain('/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-6.webp');
    expect(html).not.toContain('picsum.photos');
  });

  it('image-slider API のサンプルを含む', () => {
    const html = demos.carousel();
    expect(html).toContain('image-slider API（幅狭固定）');
    expect(html).toContain('<dads-carousel data-carousel-image-slider image-slider aria-label="イメージスライダー"></dads-carousel>');
  });
});
