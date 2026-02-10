/**
 * DadsCarousel コンポーネント テスト
 */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import type { DadsCarousel, DadsCarouselItem } from './carousel.js';
import { defineDefaultCarousel } from './carousel-define.js';

beforeAll(() => {
  defineDefaultCarousel();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function waitTick(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

function makeItems(total: number): DadsCarouselItem[] {
  const items: DadsCarouselItem[] = [];
  for (let i = 0; i < total; i += 1) {
    items.push({
      src: `/images/slide-${i + 1}.jpg`,
      alt: `slide-${i + 1}`,
      title: `タイトル ${i + 1}`,
    });
  }
  return items;
}

function createCarousel(markup = '<dads-carousel></dads-carousel>'): DadsCarousel & HTMLElement {
  return renderWebComponent(markup) as DadsCarousel & HTMLElement;
}

function stubResizeObserverWidth(width: number): void {
  class MockResizeObserver {
    readonly #callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.#callback = callback;
    }

    observe(): void {
      this.#callback(
        [
          {
            borderBoxSize: [{ inlineSize: width }],
            contentRect: { width },
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver,
      );
    }

    disconnect(): void {}
  }

  vi.stubGlobal('ResizeObserver', MockResizeObserver);
}

describe('DadsCarousel', () => {
  it('items モードで 0/1/複数 の表示分岐が正しい', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = [];
    await waitTick();
    expect(carousel.hidden).toBe(true);

    carousel.items = makeItems(1);
    await waitTick();
    expect(carousel.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(carousel, '#controls')?.hidden).toBe(true);
    expect(getShadowElement<HTMLDetailsElement>(carousel, '#all-slides')?.hidden).toBe(true);

    carousel.items = makeItems(3);
    await waitTick();
    expect(getShadowElement<HTMLElement>(carousel, '#controls')?.hidden).toBe(false);
    expect(getShadowElement<HTMLDetailsElement>(carousel, '#all-slides')?.hidden).toBe(false);
  });

  it('slot モードで 0/1/複数 の表示分岐が正しい', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    expect(carousel.hidden).toBe(true);

    const slide1 = document.createElement('img');
    slide1.src = '/images/slot-1.jpg';
    slide1.alt = 'slot-1';
    carousel.appendChild(slide1);
    await waitTick();

    expect(carousel.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(carousel, '#controls')?.hidden).toBe(true);

    const slide2 = document.createElement('img');
    slide2.src = '/images/slot-2.jpg';
    slide2.alt = 'slot-2';
    carousel.appendChild(slide2);
    await waitTick();

    expect(getShadowElement<HTMLElement>(carousel, '#controls')?.hidden).toBe(false);
  });

  it('items と slot 併用時は items が優先される', async () => {
    const carousel = createCarousel(`
      <dads-carousel>
        <img src="/images/slot-1.jpg" alt="slot-1" />
        <img src="/images/slot-2.jpg" alt="slot-2" />
      </dads-carousel>
    `);
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(2);
    await waitTick();

    const mainImage = getShadowElement<HTMLElement>(carousel, '#main-images')?.querySelector('img');
    expect(carousel.getAttribute('data-source')).toBe('items');
    expect(mainImage?.getAttribute('src')).toBe('/images/slide-1.jpg');
  });

  it('current-index の clamp（負数・範囲外・非数値）が正しい', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    carousel.setAttribute('current-index', '-3');
    await waitTick();
    expect(carousel.currentIndex).toBe(0);
    expect(carousel.getAttribute('current-index')).toBe('0');

    carousel.setAttribute('current-index', '99');
    await waitTick();
    expect(carousel.currentIndex).toBe(2);
    expect(carousel.getAttribute('current-index')).toBe('2');

    carousel.setAttribute('current-index', 'abc');
    await waitTick();
    expect(carousel.currentIndex).toBe(0);
    expect(carousel.getAttribute('current-index')).toBe('0');
  });

  it('next()/prev()/goTo() が公式挙動通り遷移する（next/prev は循環）', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    carousel.next();
    expect(carousel.currentIndex).toBe(1);

    carousel.next();
    expect(carousel.currentIndex).toBe(2);

    carousel.next();
    expect(carousel.currentIndex).toBe(0);

    carousel.prev();
    expect(carousel.currentIndex).toBe(2);

    carousel.goTo(9);
    expect(carousel.currentIndex).toBe(2);

    carousel.goTo(-1);
    expect(carousel.currentIndex).toBe(0);
  });

  it('dads-carousel-change の detail が正しい（ユーザー操作時のみ）', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-change', handler);

    const nextButton = getShadowElement<HTMLButtonElement>(carousel, '#next-preview-button');
    nextButton?.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.detail).toEqual({
      currentIndex: 1,
      previousIndex: 0,
      total: 3,
      source: 'next',
    });

    const prevButton = getShadowElement<HTMLButtonElement>(carousel, '#page-prev-button');
    prevButton?.click();
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[1]?.[0]?.detail).toEqual({
      currentIndex: 0,
      previousIndex: 1,
      total: 3,
      source: 'prev',
    });

    carousel.goTo(2);
    expect(handler).toHaveBeenCalledTimes(2);

    const indicator = getShadowElement<HTMLElement>(carousel, '#indicators')?.querySelector<HTMLButtonElement>(
      'button[data-index="1"]',
    );
    indicator?.click();
    expect(handler).toHaveBeenCalledTimes(3);
    expect(handler.mock.calls[2]?.[0]?.detail).toEqual({
      currentIndex: 1,
      previousIndex: 2,
      total: 3,
      source: 'indicator',
    });
  });

  it('dads-carousel-before-change を cancel すると遷移しない', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const beforeHandler = vi.fn((event: Event) => {
      event.preventDefault();
    });
    const indexHandler = vi.fn();
    const legacyHandler = vi.fn();

    carousel.addEventListener('dads-carousel-before-change', beforeHandler);
    carousel.addEventListener('dads-carousel-index-change', indexHandler);
    carousel.addEventListener('dads-carousel-change', legacyHandler);

    carousel.next();
    await waitTick();

    expect(carousel.currentIndex).toBe(0);
    expect(beforeHandler).toHaveBeenCalledTimes(1);
    expect(beforeHandler.mock.calls[0]?.[0]?.detail).toEqual({
      currentIndex: 0,
      nextIndex: 1,
      total: 3,
      source: 'next',
      wrapped: false,
      userInitiated: true,
    });
    expect(indexHandler).toHaveBeenCalledTimes(0);
    expect(legacyHandler).toHaveBeenCalledTimes(0);
  });

  it('dads-carousel-index-change は user/api/attribute のすべてで発火する', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const indexHandler = vi.fn();
    const legacyHandler = vi.fn();
    carousel.addEventListener('dads-carousel-index-change', indexHandler);
    carousel.addEventListener('dads-carousel-change', legacyHandler);

    carousel.goTo(1);
    await waitTick();
    carousel.setAttribute('current-index', '2');
    await waitTick();
    getShadowElement<HTMLButtonElement>(carousel, '#next-preview-button')?.click();
    await waitTick();

    expect(indexHandler).toHaveBeenCalledTimes(3);
    expect(indexHandler.mock.calls[0]?.[0]?.detail).toMatchObject({
      previousIndex: 0,
      currentIndex: 1,
      source: 'api',
      userInitiated: false,
      wrapped: false,
    });
    expect(indexHandler.mock.calls[1]?.[0]?.detail).toMatchObject({
      previousIndex: 1,
      currentIndex: 2,
      source: 'attribute',
      userInitiated: false,
      wrapped: false,
    });
    expect(indexHandler.mock.calls[2]?.[0]?.detail).toMatchObject({
      previousIndex: 2,
      currentIndex: 0,
      source: 'next',
      userInitiated: true,
      wrapped: true,
    });
    expect(legacyHandler).toHaveBeenCalledTimes(1);
    expect(legacyHandler.mock.calls[0]?.[0]?.detail?.source).toBe('next');
  });

  it('dads-carousel-slide-inactive -> dads-carousel-slide-active の順で発火する', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const calls: Array<{ type: string; detail: unknown }> = [];
    carousel.addEventListener('dads-carousel-slide-inactive', (event) => {
      calls.push({ type: 'inactive', detail: (event as CustomEvent).detail });
    });
    carousel.addEventListener('dads-carousel-slide-active', (event) => {
      calls.push({ type: 'active', detail: (event as CustomEvent).detail });
    });

    carousel.goTo(1);
    await waitTick();

    expect(calls.map((entry) => entry.type)).toEqual(['inactive', 'active']);
    expect(calls[0]?.detail).toEqual({
      index: 0,
      id: 'item-1',
      label: 'タイトル 1',
      source: 'api',
    });
    expect(calls[1]?.detail).toEqual({
      index: 1,
      id: 'item-2',
      label: 'タイトル 2',
      source: 'api',
    });
  });

  it('dads-carousel-slides-change は items 更新時に発火する', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-slides-change', handler);

    carousel.items = makeItems(2);
    await waitTick();
    carousel.items = makeItems(4);
    await waitTick();

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[0]?.[0]?.detail).toEqual({
      previousTotal: 0,
      total: 2,
      source: 'items',
      reason: 'items',
    });
    expect(handler.mock.calls[1]?.[0]?.detail).toEqual({
      previousTotal: 2,
      total: 4,
      source: 'items',
      reason: 'items',
    });
  });

  it('dads-carousel-slides-change は slot 変化時にも発火する', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-slides-change', handler);

    const slide1 = document.createElement('img');
    slide1.src = '/images/slot-1.jpg';
    slide1.alt = 'slot-1';
    carousel.appendChild(slide1);
    await waitTick();
    await waitTick();

    const detail = handler.mock.calls
      .map((call) => call[0]?.detail)
      .find((entry) => entry?.source === 'slot' && entry?.total === 1);

    expect(detail).toBeTruthy();
    expect(detail?.previousTotal).toBe(0);
    expect(['slotchange', 'mutation']).toContain(detail?.reason);
  });

  it('dads-carousel-layout-change はレイアウト状態変更時に発火する', async () => {
    stubResizeObserverWidth(1400);
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-layout-change', handler);

    carousel.setAttribute('image-slider', '');
    await waitTick();

    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls.at(-1)?.[0]?.detail;
    expect(detail).toMatchObject({
      previousWide: true,
      wide: false,
      imageSlider: true,
      reason: 'image-slider',
    });
    expect(typeof detail?.containerWidthPx).toBe('number');
    expect(typeof detail?.breakpointRem).toBe('number');
  });

  it('dads-carousel-controls-update が desktop/mobile の状態を返す', async () => {
    stubResizeObserverWidth(1400);
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-controls-update', handler);

    carousel.items = makeItems(3);
    await waitTick();

    const desktopDetail = handler.mock.calls.at(-1)?.[0]?.detail;
    expect(desktopDetail).toMatchObject({
      mode: 'desktop',
      showStepNav: true,
      showPageNav: false,
      showNextPreview: true,
      showAllSlides: true,
      total: 3,
      currentIndex: 0,
    });

    carousel.setAttribute('image-slider', '');
    await waitTick();

    const mobileDetail = handler.mock.calls.at(-1)?.[0]?.detail;
    expect(mobileDetail).toMatchObject({
      mode: 'mobile',
      showStepNav: false,
      showPageNav: true,
      showNextPreview: false,
      showAllSlides: true,
      total: 3,
      currentIndex: 0,
      imageSlider: true,
    });
  });

  it('dads-carousel-media-loaded が描画対象のメディア情報を返す', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const handler = vi.fn();
    carousel.addEventListener('dads-carousel-media-loaded', handler);

    carousel.goTo(1);
    await waitTick();

    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls[0]?.[0]?.detail;
    expect(detail?.source).toBe('api');
    expect(detail?.index).toBeGreaterThanOrEqual(0);
    expect(['main', 'main-bg', 'next-preview', 'next-bg']).toContain(detail?.role);
    expect(typeof detail?.src).toBe('string');
  });

  it('dads-carousel-media-error が decode 失敗時に発火する', async () => {
    const originalDecode = (HTMLImageElement.prototype as { decode?: () => Promise<void> }).decode;
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error('decode failed')),
    });

    try {
      const carousel = createCarousel();
      await waitForComponent('dads-carousel');

      const handler = vi.fn();
      carousel.addEventListener('dads-carousel-media-error', handler);

      carousel.items = makeItems(2);
      await waitTick();
      await waitTick();

      expect(handler).toHaveBeenCalled();
      const detail = handler.mock.calls[0]?.[0]?.detail;
      expect(detail?.error).toBe('decode-error');
      expect(['main', 'main-bg', 'next-preview', 'next-bg']).toContain(detail?.role);
      expect(typeof detail?.src).toBe('string');
    } finally {
      if (originalDecode) {
        Object.defineProperty(HTMLImageElement.prototype, 'decode', {
          configurable: true,
          value: originalDecode,
        });
      } else {
        Reflect.deleteProperty(HTMLImageElement.prototype, 'decode');
      }
    }
  });

  it('next-label は右ペインラベルにも反映される', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    carousel.setAttribute('next-label', '次へ進む');
    await waitTick();

    const nextImageLabel = getShadowElement<HTMLElement>(carousel, '#next-image-label');
    const pageNextLabel = getShadowElement<HTMLElement>(carousel, '#page-next-label');

    expect(nextImageLabel?.textContent).toBe('次へ進む');
    expect(pageNextLabel?.textContent).toBe('次へ進む');
  });

  it('role/tablist/tab/aria-current/aria-live が仕様通り', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    const root = getShadowElement<HTMLElement>(carousel, '#root');
    const indicators = getShadowElement<HTMLElement>(carousel, '#indicators');
    const tabs = indicators?.querySelectorAll<HTMLButtonElement>('button[data-index]') ?? [];
    const status = getShadowElement<HTMLElement>(carousel, '#status');

    expect(root?.getAttribute('role')).toBe('region');
    expect(root?.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root?.getAttribute('aria-label')).toBe('カルーセル');
    expect(indicators?.getAttribute('role')).toBe('tablist');
    expect(tabs.length).toBe(3);
    expect(tabs[0]?.getAttribute('role')).toBe('tab');
    expect(tabs[0]?.getAttribute('aria-current')).toBe('true');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.textContent).toContain('全3枚中1枚目');
  });

  it('インジケーターのキーボード操作（Arrow/Home/End）で移動できる', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(4);
    await waitTick();

    const indicators = getShadowElement<HTMLElement>(carousel, '#indicators');
    const first = indicators?.querySelector<HTMLButtonElement>('button[data-index="0"]');
    first?.focus();

    first?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitTick();
    expect(carousel.currentIndex).toBe(1);

    const second = indicators?.querySelector<HTMLButtonElement>('button[data-index="1"]');
    second?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await waitTick();
    expect(carousel.currentIndex).toBe(3);

    const last = indicators?.querySelector<HTMLButtonElement>('button[data-index="3"]');
    last?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitTick();
    expect(carousel.currentIndex).toBe(0);

    const current = indicators?.querySelector<HTMLButtonElement>('button[data-index="0"]');
    current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await waitTick();
    expect(carousel.currentIndex).toBe(3);
  });

  it('すべてのスライドの開閉と Escape 閉じるが正しい', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(4);
    await waitTick();

    const details = getShadowElement<HTMLDetailsElement>(carousel, '#all-slides');
    const list = getShadowElement<HTMLElement>(carousel, '#all-slides-list');
    const toggleHandler = vi.fn();
    carousel.addEventListener('dads-carousel-toggle-all', toggleHandler);

    carousel.toggleAllSlides(true);
    await waitTick();
    expect(carousel.expanded).toBe(true);
    expect(details?.open).toBe(true);
    expect(list?.children.length).toBe(3);
    expect(toggleHandler).toHaveBeenCalled();
    expect(toggleHandler.mock.calls.at(-1)?.[0]?.detail).toEqual({ expanded: true });

    getShadowElement<HTMLElement>(carousel, '#root')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await waitTick();
    expect(carousel.expanded).toBe(false);
    expect(details?.open).toBe(false);
  });

  it('href 有無でメイン表示がリンク/非リンクになる', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = [
      { src: '/images/with-link.jpg', alt: 'with-link', href: '/detail' },
      { src: '/images/no-link.jpg', alt: 'no-link' },
    ];
    await waitTick();

    const mainLink = getShadowElement<HTMLAnchorElement>(carousel, '#main-link');
    expect(mainLink?.getAttribute('href')).toBe('/detail');

    carousel.goTo(1);
    await waitTick();
    expect(mainLink?.hasAttribute('href')).toBe(false);
  });

  it('type=container / key-visual の反映と正規化が正しい', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(2);
    await waitTick();
    expect(carousel.getAttribute('type')).toBe('container');
    expect(carousel.getAttribute('data-carousel-type')).toBe('container');

    carousel.setAttribute('type', 'key-visual');
    await waitTick();
    expect(carousel.getAttribute('type')).toBe('key-visual');
    expect(carousel.getAttribute('data-carousel-type')).toBe('key-visual');

    carousel.setAttribute('type', 'unknown');
    await waitTick();
    expect(carousel.getAttribute('type')).toBe('container');
    expect(carousel.getAttribute('data-carousel-type')).toBe('container');

    carousel.setAttribute('type', 'key-visual');
    carousel.setAttribute('image-slider', '');
    await waitTick();
    expect(carousel.getAttribute('type')).toBe('container');
    expect(carousel.getAttribute('data-carousel-type')).toBe('container');
    expect(carousel.getAttribute('data-image-slider')).toBe('true');

    carousel.removeAttribute('image-slider');
    await waitTick();
    expect(carousel.getAttribute('data-image-slider')).toBe('false');
  });

  it('data-wide に応じて desktop/mobile の制御要素表示が切り替わる', async () => {
    stubResizeObserverWidth(1400);
    const desktop = createCarousel();
    await waitForComponent('dads-carousel');
    desktop.items = makeItems(3);
    await waitTick();

    expect(desktop.getAttribute('data-wide')).toBe('true');
    expect(getShadowElement<HTMLElement>(desktop, '#indicators')?.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(desktop, '#next')?.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(desktop, '#page-nav')?.hidden).toBe(true);

    cleanup();
    vi.unstubAllGlobals();

    stubResizeObserverWidth(600);
    const mobile = createCarousel();
    await waitForComponent('dads-carousel');
    mobile.items = makeItems(3);
    await waitTick();

    expect(mobile.getAttribute('data-wide')).toBe('false');
    expect(getShadowElement<HTMLElement>(mobile, '#indicators')?.hidden).toBe(true);
    expect(getShadowElement<HTMLElement>(mobile, '#next')?.hidden).toBe(true);
    expect(getShadowElement<HTMLElement>(mobile, '#page-nav')?.hidden).toBe(false);
  });

  it('data-wide / data-expanded は値付き属性で同期される', async () => {
    const carousel = createCarousel();
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    expect(carousel.getAttribute('data-wide')).toBe('true');
    expect(carousel.getAttribute('data-expanded')).toBe('false');

    carousel.toggleAllSlides(true);
    await waitTick();
    expect(carousel.getAttribute('data-expanded')).toBe('true');
  });

  it('image-slider=true のときは幅に関係なく幅狭UIになる', async () => {
    stubResizeObserverWidth(1400);
    const carousel = createCarousel('<dads-carousel image-slider></dads-carousel>');
    await waitForComponent('dads-carousel');

    carousel.items = makeItems(3);
    await waitTick();

    expect(carousel.getAttribute('data-image-slider')).toBe('true');
    expect(carousel.getAttribute('data-wide')).toBe('false');
    expect(getShadowElement<HTMLElement>(carousel, '#indicators')?.hidden).toBe(true);
    expect(getShadowElement<HTMLElement>(carousel, '#next')?.hidden).toBe(true);
    expect(getShadowElement<HTMLElement>(carousel, '#page-nav')?.hidden).toBe(false);

    carousel.removeAttribute('image-slider');
    await waitTick();

    expect(carousel.getAttribute('data-image-slider')).toBe('false');
    expect(carousel.getAttribute('data-wide')).toBe('true');
    expect(getShadowElement<HTMLElement>(carousel, '#indicators')?.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(carousel, '#next')?.hidden).toBe(false);
    expect(getShadowElement<HTMLElement>(carousel, '#page-nav')?.hidden).toBe(true);
  });
});

describe('DadsCarousel - a11yAnnotations', () => {
  it('calloutsが主要な要素を含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-carousel');
    const ids = annotations?.callouts?.map((callout) => callout.id) ?? [];

    expect(annotations?.summary).toContain('カルーセル');
    expect(ids).toEqual(
      expect.arrayContaining([
        'root',
        'main-panel',
        'next-preview',
        'indicators',
        'page-nav',
        'all-slides-summary',
        'status-live',
      ]),
    );
  });
});
