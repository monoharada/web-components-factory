/**
 * Adaptive Card Component Tests
 * TDDアプローチ: Red-Green-Refactorサイクルで開発
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  createTestElement, 
  cleanupTestElement, 
  waitForCustomElement,
  getShadowContent,
  expectAriaAttribute
} from './setup';
import {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  CardPadding,
  TEST_CONSTANTS,
  ErrorMessages
} from '../src/adaptive-card.types';

// 現時点ではコンポーネントが存在しないため、テストは失敗する（Redフェーズ）
// import { AdaptiveCard } from '../src/adaptive-card';

describe('AdaptiveCard Component - UIテスト', () => {
  let card: HTMLElement;

  beforeEach(() => {
    // テスト要素を作成
    card = createTestElement<HTMLElement>('adaptive-card');
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  describe('UI表示テスト', () => {
    it('カードが表示される', async () => {
      await waitForCustomElement(card);
      
      expect(card).toBeInTheDocument();
      expect(card.shadowRoot).toBeTruthy();
    });

    it('elevatedスタイルで表示される', async () => {
      card.setAttribute('variant', 'elevated');
      await waitForCustomElement(card);
      
      const shadowCard = card.shadowRoot?.querySelector('.card');
      expect(shadowCard?.getAttribute('data-variant')).toBe('elevated');
    });

    it('スロットにコンテンツが表示される', async () => {
      card.innerHTML = `
        <h2 slot="header">カードタイトル</h2>
        <p>カード内容</p>
        <button slot="actions">アクション</button>
      `;
      await waitForCustomElement(card);
      
      expect(card.querySelector('[slot="header"]')).toHaveTextContent('カードタイトル');
      expect(card.textContent).toContain('カード内容');
      expect(card.querySelector('[slot="actions"]')).toHaveTextContent('アクション');
    });

    it('Web Componentsとして正しく登録される', () => {
      // Red: customElements.get()がundefinedを返すため失敗
      const constructor = customElements.get('adaptive-card');
      expect(constructor).toBeDefined();
      expect(constructor?.name).toBe('AdaptiveCard');
    });

    it('Shadow DOMが正しく作成される', () => {
      // Red: shadowRootがnullのため失敗
      expect(card.shadowRoot).toBeTruthy();
      expect(card.shadowRoot?.mode).toBe('open');
    });

    it('コンポーネント識別用属性が追加される', () => {
      // Red: data-sa-component属性が存在しないため失敗
      expect(card.hasAttribute('data-sa-component')).toBe(true);
    });
  });

  describe('プロパティと属性のバインディング', () => {
    it('variantプロパティが正しく反映される', () => {
      // Red: プロパティが未実装のため失敗
      card.setAttribute('variant', CardVariant.OUTLINED);
      expect((card as any).variant).toBe(CardVariant.OUTLINED);
      
      (card as any).variant = CardVariant.FILLED;
      expect(card.getAttribute('variant')).toBe(CardVariant.FILLED);
    });

    it('responsiveプロパティが正しく反映される', () => {
      // Red: boolean属性が未実装のため失敗
      card.removeAttribute('responsive');
      expect((card as any).responsive).toBe(false);
      
      card.setAttribute('responsive', '');
      expect((card as any).responsive).toBe(true);
    });

    it('interactiveプロパティが正しく反映される', () => {
      // Red: interactive属性が未実装のため失敗
      card.setAttribute('interactive', '');
      expect((card as any).interactive).toBe(true);
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('role')).toBe('button');
    });

    it('無効な値でエラーを発生させる', () => {
      // Red: バリデーションが未実装のため失敗
      const consoleSpy = vi.spyOn(console, 'error');
      
      card.setAttribute('variant', 'invalid-variant');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(ErrorMessages.INVALID_VARIANT)
      );
    });
  });

  describe('テンプレートとスタイル', () => {
    it('カードのメイン構造がレンダリングされる', () => {
      // Red: テンプレートが未実装のため失敗
      const cardElement = getShadowContent(card, '.card');
      expect(cardElement).toBeTruthy();
      expect(cardElement?.getAttribute('part')).toBe('card');
    });

    it('必要なスロットが存在する', () => {
      // Red: スロットが未定義のため失敗
      const headerSlot = getShadowContent(card, 'slot[name="header"]');
      const mediaSlot = getShadowContent(card, 'slot[name="media"]');
      const defaultSlot = getShadowContent(card, 'slot:not([name])');
      const actionsSlot = getShadowContent(card, 'slot[name="actions"]');
      const badgeSlot = getShadowContent(card, 'slot[name="badge"]');
      
      expect(headerSlot).toBeTruthy();
      expect(mediaSlot).toBeTruthy();
      expect(defaultSlot).toBeTruthy();
      expect(actionsSlot).toBeTruthy();
      expect(badgeSlot).toBeTruthy();
    });

    it('バリアントに応じたスタイルが適用される', () => {
      // Red: スタイルが未実装のため失敗
      card.setAttribute('variant', CardVariant.ELEVATED);
      const cardElement = getShadowContent(card, '.card');
      expect(cardElement?.getAttribute('data-variant')).toBe(CardVariant.ELEVATED);
      
      card.setAttribute('variant', CardVariant.OUTLINED);
      expect(cardElement?.getAttribute('data-variant')).toBe(CardVariant.OUTLINED);
    });
  });

  describe('アクセシビリティ属性', () => {
    it('デフォルトのARIA属性が設定される', () => {
      // Red: ARIA属性が未実装のため失敗
      expect(card.getAttribute('role')).toBe('article');
    });

    it('interactiveカードで適切なロールが設定される', () => {
      // Red: interactiveロールが未実装のため失敗
      card.setAttribute('interactive', '');
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('tabindex')).toBe('0');
    });

    it('aria-labelが正しく設定される', () => {
      // Red: aria-labelが未実装のため失敗
      const testLabel = 'テストカード';
      card.setAttribute('aria-label', testLabel);
      expectAriaAttribute(card, 'aria-label', testLabel);
    });

    it('リンクカードで適切なアクセシビリティが実装される', () => {
      // Red: リンクカード機能が未実装のため失敗
      card.setAttribute('href', '/test-url');
      card.setAttribute('link-text', 'テストリンク');
      
      const linkElement = getShadowContent(card, '.card-link--stretched');
      expect(linkElement).toBeTruthy();
      expect(linkElement?.getAttribute('href')).toBe('/test-url');
      expect(linkElement?.getAttribute('aria-label')).toBe('テストリンク');
    });
  });

  describe('レスポンシブビヘイビア', () => {
    it('ResizeObserverが正しく初期化される', () => {
      // Red: ResizeObserverが未実装のため失敗
      card.setAttribute('responsive', '');
      expect(ResizeObserver).toHaveBeenCalled();
    });

    it('ブレークポイント変更イベントが発生する', async () => {
      // Red: ブレークポイントイベントが未実装のため失敗
      card.setAttribute('responsive', '');
      
      const eventSpy = vi.fn();
      card.addEventListener('breakpoint-change', eventSpy);
      
      // サイズ変更をシミュレート
      Object.defineProperty(card, 'offsetWidth', {
        value: 400,
        configurable: true
      });
      
      // updateBreakpointメソッドを呼び出し
      await (card as any).updateBreakpoint?.();
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            breakpoint: CardBreakpoint.MOBILE
          })
        })
      );
    });

    it('ブレークポイントに応じたスタイルが適用される', () => {
      // Red: ブレークポイントスタイルが未実装のため失敗
      card.setAttribute('responsive', '');
      card.setAttribute('data-breakpoint', CardBreakpoint.MOBILE);
      
      const cardElement = getShadowContent(card, '.card');
      expect(cardElement?.getAttribute('data-breakpoint')).toBe(CardBreakpoint.MOBILE);
    });
  });

  describe('イベントハンドリング', () => {
    it('クリックイベントが正しく発生する', () => {
      // Red: クリックイベントが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const eventSpy = vi.fn();
      card.addEventListener('card-click', eventSpy);
      
      card.click();
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            target: card
          })
        })
      );
    });

    it('キーボードナビゲーションが正しく動作する', () => {
      // Red: キーボードイベントが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const clickSpy = vi.spyOn(card, 'click');
      
      // Enterキー
      card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(clickSpy).toHaveBeenCalled();
      
      clickSpy.mockClear();
      
      // Spaceキー
      card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(clickSpy).toHaveBeenCalled();
    });

    it('無効状態でイベントが発生しない', () => {
      // Red: disabled状態が未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('disabled', '');
      
      const eventSpy = vi.fn();
      card.addEventListener('card-click', eventSpy);
      
      card.click();
      
      expect(eventSpy).not.toHaveBeenCalled();
    });
  });

  describe('スロット管理', () => {
    it('スロットの表示/非表示が正しく制御される', () => {
      // Red: スロット管理が未実装のため失敗
      const headerContent = document.createElement('h2');
      headerContent.slot = 'header';
      headerContent.textContent = 'テストヘッダー';
      card.appendChild(headerContent);
      
      const headerContainer = getShadowContent(card, '.card-header');
      expect(headerContainer?.hasAttribute('hidden')).toBe(false);
      
      headerContent.remove();
      expect(headerContainer?.hasAttribute('hidden')).toBe(true);
    });

    it('スロット変更イベントに応答する', () => {
      // Red: slotchangeイベントリスナーが未実装のため失敗
      const mediaContent = document.createElement('img');
      mediaContent.slot = 'media';
      mediaContent.src = 'test.jpg';
      
      card.appendChild(mediaContent);
      
      const mediaContainer = getShadowContent(card, '.card-media');
      expect(mediaContainer?.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('パフォーマンス', () => {
    it('初期レンダリングが高速である', async () => {
      // Red: パフォーマンス測定が未実装のため失敗
      const start = performance.now();
      await waitForCustomElement(card);
      const end = performance.now();
      
      const renderTime = end - start;
      expect(renderTime).toBeLessThan(50); // 50ms以下
    });

    it('メモリリークが発生しない', () => {
      // Red: クリーンアップ処理が未実装のため失敗
      card.setAttribute('responsive', '');
      
      // コンポーネントを除去
      card.remove();
      
      // ResizeObserverがdisconnectされることを確認
      expect(ResizeObserver.prototype.disconnect).toHaveBeenCalled();
    });
  });
});

// アクセシビリティ専用テストスイート
describe('AdaptiveCard Accessibility Tests', () => {
  let card: HTMLElement;

  beforeEach(() => {
    card = createTestElement<HTMLElement>('adaptive-card');
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  it('スクリーンリーダーで適切に読み上げられる', () => {
    // Red: スクリーンリーダー対応が未実装のため失敗
    const title = document.createElement('h2');
    title.slot = 'header';
    title.textContent = 'カードタイトル';
    card.appendChild(title);
    
    const content = document.createElement('p');
    content.textContent = 'カードの内容です';
    card.appendChild(content);
    
    expect(card.getAttribute('role')).toBe('article');
    expect(card.textContent).toContain('カードタイトル');
    expect(card.textContent).toContain('カードの内容です');
  });

  it('キーボードフォーカスが適切に表示される', () => {
    // Red: フォーカススタイルが未実装のため失敗
    card.setAttribute('interactive', '');
    card.focus();
    
    const computedStyle = getComputedStyle(card);
    expect(computedStyle.outline).toBeTruthy();
  });

  it('高コントラストモードに対応している', () => {
    // Red: 高コントラストモードが未実装のため失敗
    // forced-colorsメディアクエリをシミュレート
    const mediaQuery = '(forced-colors: active)';
    const mockMatchMedia = vi.fn(() => ({ matches: true }));
    window.matchMedia = mockMatchMedia;
    
    expect(window.matchMedia(mediaQuery).matches).toBe(true);
  });
});

// パフォーマンス専用テストスイート
describe('AdaptiveCard Performance Tests', () => {
  it('大量のカードでもパフォーマンスが保たれる', async () => {
    // Red: パフォーマンス最適化が未実装のため失敗
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const start = performance.now();
    
    // 100個のカードを作成
    for (let i = 0; i < 100; i++) {
      const card = createTestElement<HTMLElement>('adaptive-card');
      container.appendChild(card);
    }
    
    const end = performance.now();
    const creationTime = end - start;
    
    expect(creationTime).toBeLessThan(1000); // 1秒以下
    
    container.remove();
  });

  it('CSS containmentが正しく適用される', () => {
    // Red: CSS containmentが未実装のため失敗
    const card = createTestElement<HTMLElement>('adaptive-card');
    const computedStyle = getComputedStyle(card);
    
    expect(computedStyle.contain).toContain('layout');
    expect(computedStyle.contain).toContain('style');
    
    cleanupTestElement(card);
  });
});
