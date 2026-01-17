/**
 * Adaptive Card Integration Tests
 * ユーザーフローや統合シナリオのテスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  createTestElement,
  cleanupTestElement,
  waitForCustomElement,
  getShadowContent,
  mockViewportSize,
  measureRenderTime
} from './setup';
import {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  LinkPattern,
  TEST_CONSTANTS
} from '../src/adaptive-card.types';

describe('AdaptiveCard Integration Tests', () => {
  let card: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    card = createTestElement<HTMLElement>('adaptive-card');
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  describe('ユーザーインタラクションフロー', () => {
    it('カードクリックからアクション実行までのフロー', async () => {
      // Red: ユーザーインタラクションが未実装のため失敗
      card.setAttribute('interactive', '');
      
      // カードコンテンツを設定
      const header = document.createElement('h2');
      header.slot = 'header';
      header.textContent = '商品カード';
      card.appendChild(header);
      
      const actionButton = document.createElement('button');
      actionButton.slot = 'actions';
      actionButton.textContent = '購入';
      card.appendChild(actionButton);
      
      // イベントリスナーを設定
      const cardClickSpy = vi.fn();
      const actionClickSpy = vi.fn();
      
      card.addEventListener('card-click', cardClickSpy);
      actionButton.addEventListener('click', actionClickSpy);
      
      // ユーザーアクション: カードをクリック
      await user.click(card);
      expect(cardClickSpy).toHaveBeenCalled();
      
      // ユーザーアクション: アクションボタンをクリック
      await user.click(actionButton);
      expect(actionClickSpy).toHaveBeenCalled();
    });

    it('キーボードナビゲーションでカードとアクションにアクセス', async () => {
      // Red: キーボードナビゲーションが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const actionButton = document.createElement('button');
      actionButton.slot = 'actions';
      actionButton.textContent = '詳細';
      card.appendChild(actionButton);
      
      const cardClickSpy = vi.fn();
      const actionClickSpy = vi.fn();
      
      card.addEventListener('card-click', cardClickSpy);
      actionButton.addEventListener('click', actionClickSpy);
      
      // Tabでカードにフォーカス
      await user.tab();
      expect(document.activeElement).toBe(card);
      
      // Enterでカードをアクティベート
      await user.keyboard('{Enter}');
      expect(cardClickSpy).toHaveBeenCalled();
      
      // Tabでアクションボタンに移動
      await user.tab();
      expect(document.activeElement).toBe(actionButton);
      
      // Enterでアクションを実行
      await user.keyboard('{Enter}');
      expect(actionClickSpy).toHaveBeenCalled();
    });

    it('リンクカードのアクセシブルなナビゲーション', async () => {
      // Red: リンクカード機能が未実装のため失敗
      card.setAttribute('href', '/product/123');
      card.setAttribute('link-text', '商品詳細を見る');
      card.setAttribute('link-pattern', LinkPattern.STRETCHED);
      
      const header = document.createElement('h2');
      header.slot = 'header';
      header.textContent = 'ワイヤレスヘッドフォン';
      card.appendChild(header);
      
      const additionalAction = document.createElement('button');
      additionalAction.slot = 'actions';
      additionalAction.textContent = 'お気に入り';
      card.appendChild(additionalAction);
      
      // ストレッチリンクが存在することを確認
      const stretchedLink = getShadowContent(card, '.card-link--stretched');
      expect(stretchedLink).toBeTruthy();
      expect(stretchedLink?.getAttribute('href')).toBe('/product/123');
      expect(stretchedLink?.getAttribute('aria-label')).toBe('商品詳細を見る');
      
      // 追加アクションボタンがクリック可能であることを確認
      const actionClickSpy = vi.fn();
      additionalAction.addEventListener('click', actionClickSpy);
      
      await user.click(additionalAction);
      expect(actionClickSpy).toHaveBeenCalled();
      
      // カードの他の部分をクリックするとリンクにナビゲート
      const linkClickSpy = vi.spyOn(stretchedLink as HTMLElement, 'click');
      await user.click(header);
      expect(linkClickSpy).toHaveBeenCalled();
    });
  });

  describe('レスポンシブビヘイビアの統合テスト', () => {
    it('ビューポート変更でレイアウトが適切に変更される', async () => {
      // Red: レスポンシブレイアウトが未実装のため失敗
      card.setAttribute('responsive', '');
      card.setAttribute('direction', CardDirection.HORIZONTAL);
      
      // メディアコンテンツを追加
      const media = document.createElement('img');
      media.slot = 'media';
      media.src = 'product.jpg';
      media.alt = '商品画像';
      card.appendChild(media);
      
      const content = document.createElement('p');
      content.textContent = '商品の説明文';
      card.appendChild(content);
      
      // モバイルサイズ: 縦並びレイアウト
      mockViewportSize(400, 800);
      Object.defineProperty(card, 'offsetWidth', {
        value: 350,
        configurable: true
      });
      
      await (card as any).updateBreakpoint?.();
      
      const cardElement = getShadowContent(card, '.card');
      expect(cardElement?.getAttribute('data-breakpoint')).toBe(CardBreakpoint.MOBILE);
      
      // タブレットサイズ: 横並びレイアウト
      mockViewportSize(768, 600);
      Object.defineProperty(card, 'offsetWidth', {
        value: 600,
        configurable: true
      });
      
      await (card as any).updateBreakpoint?.();
      expect(cardElement?.getAttribute('data-breakpoint')).toBe(CardBreakpoint.TABLET);
      
      // デスクトップサイズ: フル機能レイアウト
      mockViewportSize(1200, 800);
      Object.defineProperty(card, 'offsetWidth', {
        value: 800,
        configurable: true
      });
      
      await (card as any).updateBreakpoint?.();
      expect(cardElement?.getAttribute('data-breakpoint')).toBe(CardBreakpoint.DESKTOP);
    });

    it('ブレークポイント変更イベントのチェーン', async () => {
      // Red: ブレークポイントイベントチェーンが未実装のため失敗
      card.setAttribute('responsive', '');
      
      const breakpointChanges: string[] = [];
      card.addEventListener('breakpoint-change', (event) => {
        const detail = (event as CustomEvent).detail;
        breakpointChanges.push(detail.breakpoint);
      });
      
      // 段階的なサイズ変更
      const sizes = [
        { width: 400, expected: CardBreakpoint.MOBILE },
        { width: 600, expected: CardBreakpoint.TABLET },
        { width: 1000, expected: CardBreakpoint.DESKTOP },
        { width: 450, expected: CardBreakpoint.MOBILE }
      ];
      
      for (const { width, expected } of sizes) {
        Object.defineProperty(card, 'offsetWidth', {
          value: width,
          configurable: true
        });
        
        await (card as any).updateBreakpoint?.();
        expect(breakpointChanges).toContain(expected);
      }
      
      expect(breakpointChanges.length).toBeGreaterThan(0);
    });
  });

  describe('コンテンツ管理とスロットの統合', () => {
    it('動的コンテンツの追加と削除', async () => {
      // Red: 動的コンテンツ管理が未実装のため失敗
      const header = document.createElement('h2');
      header.slot = 'header';
      header.textContent = '初期タイトル';
      
      // ヘッダーを追加
      card.appendChild(header);
      await waitForCustomElement(card);
      
      let headerContainer = getShadowContent(card, '.card-header');
      expect(headerContainer?.hasAttribute('hidden')).toBe(false);
      
      // ヘッダーを更新
      header.textContent = '更新されたタイトル';
      expect(header.textContent).toBe('更新されたタイトル');
      
      // メディアを追加
      const media = document.createElement('video');
      media.slot = 'media';
      media.src = 'demo.mp4';
      media.controls = true;
      card.appendChild(media);
      
      const mediaContainer = getShadowContent(card, '.card-media');
      expect(mediaContainer?.hasAttribute('hidden')).toBe(false);
      
      // アクションを追加
      const action1 = document.createElement('button');
      action1.slot = 'actions';
      action1.textContent = 'アクション1';
      
      const action2 = document.createElement('a');
      action2.slot = 'actions';
      action2.href = '#';
      action2.textContent = 'アクション2';
      
      card.appendChild(action1);
      card.appendChild(action2);
      
      const actionsContainer = getShadowContent(card, '.card-actions');
      expect(actionsContainer?.hasAttribute('hidden')).toBe(false);
      
      // コンテンツを削除
      header.remove();
      headerContainer = getShadowContent(card, '.card-header');
      expect(headerContainer?.hasAttribute('hidden')).toBe(true);
      
      media.remove();
      expect(mediaContainer?.hasAttribute('hidden')).toBe(true);
    });

    it('複数スロットの同時管理', async () => {
      // Red: 複数スロットの同時管理が未実装のため失敗
      const elements = {
        header: document.createElement('h2'),
        media: document.createElement('img'),
        content: document.createElement('p'),
        action1: document.createElement('button'),
        action2: document.createElement('button'),
        badge: document.createElement('span')
      };
      
      // スロットとコンテンツを設定
      elements.header.slot = 'header';
      elements.header.textContent = 'コンプリートカード';
      
      elements.media.slot = 'media';
      elements.media.src = 'image.jpg';
      elements.media.alt = 'サンプル画像';
      
      elements.content.textContent = 'カードのメインコンテンツ';
      
      elements.action1.slot = 'actions';
      elements.action1.textContent = '主アクション';
      
      elements.action2.slot = 'actions';
      elements.action2.textContent = '副アクション';
      
      elements.badge.slot = 'badge';
      elements.badge.textContent = 'NEW';
      
      // 全ての要素をカードに追加
      Object.values(elements).forEach(el => card.appendChild(el));
      
      await waitForCustomElement(card);
      
      // 全てのコンテナーが表示されていることを確認
      const containers = {
        header: getShadowContent(card, '.card-header'),
        media: getShadowContent(card, '.card-media'),
        content: getShadowContent(card, '.card-content'),
        actions: getShadowContent(card, '.card-actions'),
        badge: getShadowContent(card, 'slot[name="badge"]')
      };
      
      Object.values(containers).forEach(container => {
        expect(container?.hasAttribute('hidden')).toBe(false);
      });
      
      // 部分的な削除で他のスロットに影響しないことを確認
      elements.media.remove();
      expect(containers.media?.hasAttribute('hidden')).toBe(true);
      expect(containers.header?.hasAttribute('hidden')).toBe(false);
      expect(containers.actions?.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('パフォーマンスとユーザビリティ', () => {
    it('複数インタラクションのパフォーマンス', async () => {
      // Red: パフォーマンス最適化が未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('responsive', '');
      
      const baselineButton = document.createElement('button');
      baselineButton.textContent = 'baseline';
      document.body.appendChild(baselineButton);

      const measureAverageClick = async (el: HTMLElement, times: number) => {
        const clickTimes: number[] = [];
        for (let i = 0; i < times; i++) {
          const clickTime = await measureRenderTime(async () => {
            await user.click(el);
          });
          clickTimes.push(clickTime);
        }
        return clickTimes.reduce((sum, time) => sum + time, 0) / clickTimes.length;
      };

      // warm up
      await user.click(baselineButton);
      await user.click(card);

      const sampleCount = 10;
      const baselineAverage = await measureAverageClick(baselineButton, sampleCount);
      const cardAverage = await measureAverageClick(card, sampleCount);

      baselineButton.remove();

      // 環境依存の絶対値に依存せず、ネイティブ要素と比較して極端に遅くないことを確認する
      expect(cardAverage).toBeLessThan(baselineAverage * 2);
    });

    it('メモリ使用量の最適化', () => {
      // Red: メモリリーク防止が未実装のため失敗
      const cards: HTMLElement[] = [];
      
      // 50個のカードを作成
      for (let i = 0; i < 50; i++) {
        const testCard = createTestElement<HTMLElement>('adaptive-card');
        testCard.setAttribute('responsive', '');
        testCard.setAttribute('interactive', '');
        cards.push(testCard);
      }
      
      // 全てのカードを削除
      cards.forEach(c => cleanupTestElement(c));
      
      // ResizeObserverが正しくdisconnectされていることを確認
      expect(ResizeObserver.prototype.disconnect).toHaveBeenCalledTimes(50);
    });

    it('アクセシビリティスコアの保持', async () => {
      // Red: アクセシビリティ機能が未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('aria-label', '商品カード: ワイヤレスヘッドフォン');
      
      const header = document.createElement('h2');
      header.slot = 'header';
      header.textContent = 'ワイヤレスヘッドフォン';
      card.appendChild(header);
      
      const description = document.createElement('p');
      description.id = 'card-description';
      description.textContent = '高音質なワイヤレスヘッドフォン';
      card.appendChild(description);
      
      card.setAttribute('aria-describedby', 'card-description');
      
      // アクセシビリティチェック
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('aria-label')).toBeTruthy();
      expect(card.getAttribute('aria-describedby')).toBe('card-description');
      expect(card.getAttribute('tabindex')).toBe('0');
      
      // フォーカス可能性の確認
      card.focus();
      expect(document.activeElement).toBe(card);
      
      // キーボードアクセシビリティ
      const clickSpy = vi.spyOn(card, 'click');
      await user.keyboard('{Enter}');
      expect(clickSpy).toHaveBeenCalled();
      
      clickSpy.mockClear();
      await user.keyboard(' ');
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('エラーハンドリングと堅牢性', () => {
    it('無効なプロパティ値のグレースフルな処理', () => {
      // Red: エラーハンドリングが未実装のため失敗
      const consoleSpy = vi.spyOn(console, 'error');
      
      // 無効な値を設定
      card.setAttribute('variant', 'invalid-variant');
      card.setAttribute('breakpoint', 'invalid-breakpoint');
      card.setAttribute('direction', 'invalid-direction');
      card.setAttribute('padding', 'invalid-padding');
      
      // エラーがログ出力されることを確認
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('カードバリアントが無効です')
      );
      
      // コンポーネントがクラッシュしないことを確認
      expect(card.isConnected).toBe(true);
      
      // デフォルト値にフォールバックされることを確認
      expect((card as any).variant || card.getAttribute('variant')).toBe(TEST_CONSTANTS.DEFAULT_VARIANT);
    });

    it('DOM操作エラーの耐性', () => {
      // Red: DOMエラー耐性が未実装のため失敗
      // Shadow DOMが存在しない状態をシミュレート
      Object.defineProperty(card, 'shadowRoot', {
        value: null,
        configurable: true
      });
      
      // エラーが発生してもクラッシュしないことを確誋
      expect(() => {
        const content = document.createElement('p');
        content.textContent = 'テスト';
        card.appendChild(content);
      }).not.toThrow();
    });

    it('メモリー不足時の適切なフォールバック', () => {
      // Red: メモリー不足対応が未実装のため失敗
      // ResizeObserverの作成が失敗する状況をシミュレート
      const originalResizeObserver = window.ResizeObserver;
      (window as any).ResizeObserver = undefined;
      
      card.setAttribute('responsive', '');
      
      // フォールバック処理が動作することを確認
      const windowResizeSpy = vi.spyOn(window, 'addEventListener');
      
      // コンポーネントの初期化を再実行
      (card as any).connectedCallback?.();
      
      expect(windowResizeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      
      // 復旧
      window.ResizeObserver = originalResizeObserver;
    });
  });
});
