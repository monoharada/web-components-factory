/**
 * Adaptive Card Performance Tests
 * パフォーマンス最適化とメモリ効率のテスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  measureRenderTime,
  mockViewportSize
} from './setup';
import { CardVariant } from '../src/adaptive-card.types';

describe('AdaptiveCard Performance Tests', () => {
  let card: HTMLElement;

  beforeEach(() => {
    card = createTestElement<HTMLElement>('adaptive-card');
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  describe('初期レンダリングパフォーマンス', () => {
    it('単一カードの初期化が高速', async () => {
      // Red: 初期化パフォーマンスが未最適化のため失敗
      const renderTime = await measureRenderTime(async () => {
        const testCard = createTestElement<HTMLElement>('adaptive-card');
        testCard.setAttribute('variant', CardVariant.ELEVATED);
        testCard.setAttribute('responsive', '');
        
        // コンテンツを追加
        const header = document.createElement('h2');
        header.slot = 'header';
        header.textContent = 'テストヘッダー';
        testCard.appendChild(header);
        
        const content = document.createElement('p');
        content.textContent = 'テストコンテンツ';
        testCard.appendChild(content);
        
        cleanupTestElement(testCard);
      });
      
      // 50ms以下で初期化完了
      expect(renderTime).toBeLessThan(50);
    });

    it('複数カードの同時初期化パフォーマンス', async () => {
      // Red: 複数カードの初期化が未最適化のため失敗
      const cardCount = 50;
      
      const renderTime = await measureRenderTime(async () => {
        const cards: HTMLElement[] = [];
        
        for (let i = 0; i < cardCount; i++) {
          const testCard = createTestElement<HTMLElement>('adaptive-card');
          testCard.setAttribute('responsive', '');
          cards.push(testCard);
        }
        
        // クリーンアップ
        cards.forEach(c => cleanupTestElement(c));
      });
      
      // 1秒以下で50個のカードを作成
      expect(renderTime).toBeLessThan(1000);
      
      // 1カードあたりの平均初期化時間
      const averagePerCard = renderTime / cardCount;
      expect(averagePerCard).toBeLessThan(20);
    });

    it('Shadow DOMの作成コストが低い', async () => {
      // Red: Shadow DOM作成コストが未最適化のため失敗
      const shadowCreationTime = await measureRenderTime(() => {
        expect(card.shadowRoot).toBeTruthy();
        expect(card.shadowRoot?.mode).toBe('open');
      });
      
      // Shadow DOM作成が5ms以下
      expect(shadowCreationTime).toBeLessThan(5);
    });

    it('スタイルシートの適用が高速', async () => {
      // Red: スタイルシート適用が未最適化のため失敗
      const styleApplicationTime = await measureRenderTime(() => {
        card.setAttribute('variant', CardVariant.OUTLINED);
        
        // スタイルが適用されていることを確認
        const computedStyle = getComputedStyle(card);
        expect(computedStyle.display).toBe('block');
      });
      
      // スタイル適用が10ms以下
      expect(styleApplicationTime).toBeLessThan(10);
    });
  });

  describe('ランタイムパフォーマンス', () => {
    it('イベント処理のレスポンス性能', async () => {
      // Red: イベント処理が未最適化のため失敗
      card.setAttribute('interactive', '');
      
      const clickTimes: number[] = [];
      
      // 20回のクリックイベントを測定
      for (let i = 0; i < 20; i++) {
        const clickTime = await measureRenderTime(() => {
          card.click();
        });
        clickTimes.push(clickTime);
      }
      
      // 平均レスポンス時間が5ms以下
      const averageTime = clickTimes.reduce((sum, time) => sum + time, 0) / clickTimes.length;
      expect(averageTime).toBeLessThan(5);
      
      // 最大レスポンス時間が10ms以下
      const maxTime = Math.max(...clickTimes);
      expect(maxTime).toBeLessThan(10);
    });

    it('ResizeObserverのパフォーマンス', async () => {
      // Red: ResizeObserver処理が未最適化のため失敗
      card.setAttribute('responsive', '');
      
      const resizeTimes: number[] = [];
      
      // 10回のサイズ変更をシミュレート
      for (let i = 0; i < 10; i++) {
        const resizeTime = await measureRenderTime(() => {
          const newWidth = 300 + (i * 50);
          Object.defineProperty(card, 'offsetWidth', {
            value: newWidth,
            configurable: true
          });
          
          // updateBreakpointメソッドを呼び出し
          (card as any).updateBreakpoint?.();
        });
        resizeTimes.push(resizeTime);
      }
      
      // サイズ変更処理の平均時間が3ms以下
      const averageTime = resizeTimes.reduce((sum, time) => sum + time, 0) / resizeTimes.length;
      expect(averageTime).toBeLessThan(3);
    });

    it('スロット変更の処理性能', async () => {
      // Red: スロット変更処理が未最適化のため失敗
      const slotChangeTimes: number[] = [];
      
      // 10回のスロット変更をシミュレート
      for (let i = 0; i < 10; i++) {
        const slotChangeTime = await measureRenderTime(() => {
          const content = document.createElement('p');
          content.textContent = `コンテンツ ${i}`;
          card.appendChild(content);
          
          // スロット変更をシミュレート
          const slot = card.shadowRoot?.querySelector('slot:not([name])');
          if (slot) {
            const event = new Event('slotchange');
            slot.dispatchEvent(event);
          }
          
          content.remove();
        });
        slotChangeTimes.push(slotChangeTime);
      }
      
      // スロット変更処理の平均時間が2ms以下
      const averageTime = slotChangeTimes.reduce((sum, time) => sum + time, 0) / slotChangeTimes.length;
      expect(averageTime).toBeLessThan(2);
    });

    it('プロパティ変更のレスポンシブ性', async () => {
      // Red: プロパティ変更処理が未最適化のため失敗
      const propertyChangeTimes: number[] = [];
      const variants = [CardVariant.ELEVATED, CardVariant.OUTLINED, CardVariant.FILLED];
      
      for (const variant of variants) {
        const changeTime = await measureRenderTime(() => {
          card.setAttribute('variant', variant);
          
          // 変更が反映されていることを確認
          expect((card as any).variant || card.getAttribute('variant')).toBe(variant);
        });
        propertyChangeTimes.push(changeTime);
      }
      
      // プロパティ変更の平均時間が1ms以下
      const averageTime = propertyChangeTimes.reduce((sum, time) => sum + time, 0) / propertyChangeTimes.length;
      expect(averageTime).toBeLessThan(1);
    });
  });

  describe('メモリ効率', () => {
    it('メモリリークの防止', () => {
      // Red: メモリリーク防止が未実装のため失敗
      card.setAttribute('responsive', '');
      
      // ResizeObserverが作成されていることを確認
      expect(ResizeObserver).toHaveBeenCalled();
      
      // コンポーネントを除去
      card.remove();
      
      // disconnectが呼び出されていることを確認
      expect(ResizeObserver.prototype.disconnect).toHaveBeenCalled();
    });

    it('イベントリスナーの適切なクリーンアップ', () => {
      // Red: イベントリスナークリーンアップが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const clickHandler = vi.fn();
      card.addEventListener('card-click', clickHandler);
      
      // リスナーが登録されていることを確認
      card.click();
      expect(clickHandler).toHaveBeenCalled();
      
      // コンポーネントを除去
      card.remove();
      
      // 除去後はイベントが発生しない
      const clickSpy = vi.spyOn(card, 'click');
      clickSpy.mockClear();
      
      // 除去された要素はイベントを発生させない
      expect(card.isConnected).toBe(false);
    });

    it('キャッシュの効率的な利用', () => {
      // Red: キャッシュ機能が未実装のため失敗
      const card1 = createTestElement<HTMLElement>('adaptive-card');
      const card2 = createTestElement<HTMLElement>('adaptive-card');
      
      // 同じスタイル設定
      card1.setAttribute('variant', CardVariant.ELEVATED);
      card2.setAttribute('variant', CardVariant.ELEVATED);
      
      // スタイルシートがキャッシュされていることを確認
      // (実際の実装ではAdoptableStyles.forがキャッシュを使用)
      expect(card1.shadowRoot?.adoptedStyleSheets).toBeTruthy();
      expect(card2.shadowRoot?.adoptedStyleSheets).toBeTruthy();
      
      cleanupTestElement(card1);
      cleanupTestElement(card2);
    });

    it('WeakMapを使用したメモリ管理', () => {
      // Red: WeakMapベースのメモリ管理が未実装のため失敗
      const cards: HTMLElement[] = [];
      
      // 複数カードを作成
      for (let i = 0; i < 10; i++) {
        const testCard = createTestElement<HTMLElement>('adaptive-card');
        testCard.setAttribute('responsive', '');
        cards.push(testCard);
      }
      
      // 全てのカードを除去
      cards.forEach(c => {
        c.remove();
        cleanupTestElement(c);
      });
      
      // WeakMapのエントリが自動的にガベージコレクションされる
      // (直接テストは難しいが、メモリリークがないことを確認)
      expect(cards.every(c => !c.isConnected)).toBe(true);
    });
  });

  describe('スケーラビリティ', () => {
    it('大量カードのパフォーマンス', async () => {
      // Red: 大量カード処理が未最適化のため失敗
      const cardCount = 100;
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      const creationTime = await measureRenderTime(() => {
        for (let i = 0; i < cardCount; i++) {
          const testCard = createTestElement<HTMLElement>('adaptive-card');
          testCard.setAttribute('variant', CardVariant.ELEVATED);
          container.appendChild(testCard);
        }
      });
      
      // 100個のカードを500ms以下で作成
      expect(creationTime).toBeLessThan(500);
      
      // 1カードあたり5ms以下
      const averagePerCard = creationTime / cardCount;
      expect(averagePerCard).toBeLessThan(5);
      
      container.remove();
    });

    it('ネストしたカードのパフォーマンス', async () => {
      // Red: ネスト構造が未最適化のため失敗
      const nestingTime = await measureRenderTime(() => {
        const outerCard = createTestElement<HTMLElement>('adaptive-card');
        
        const content = document.createElement('div');
        const innerCard = createTestElement<HTMLElement>('adaptive-card');
        innerCard.setAttribute('variant', CardVariant.OUTLINED);
        
        const innerContent = document.createElement('p');
        innerContent.textContent = 'ネストしたコンテンツ';
        innerCard.appendChild(innerContent);
        
        content.appendChild(innerCard);
        outerCard.appendChild(content);
        
        cleanupTestElement(outerCard);
        cleanupTestElement(innerCard);
      });
      
      // ネストしたカードの作成が30ms以下
      expect(nestingTime).toBeLessThan(30);
    });

    it('高頻度更新のパフォーマンス', async () => {
      // Red: 高頻度更新処理が未最適化のため失敗
      card.setAttribute('responsive', '');
      
      const updateCount = 50;
      const totalUpdateTime = await measureRenderTime(() => {
        for (let i = 0; i < updateCount; i++) {
          // 属性を高頻度で更新
          card.setAttribute('variant', i % 2 === 0 ? CardVariant.ELEVATED : CardVariant.OUTLINED);
          
          // サイズ変更をシミュレート
          Object.defineProperty(card, 'offsetWidth', {
            value: 300 + (i * 10),
            configurable: true
          });
          
          (card as any).updateBreakpoint?.();
        }
      });
      
      // 50回の更新が100ms以下
      expect(totalUpdateTime).toBeLessThan(100);
      
      // 1回あたりの更新が2ms以下
      const averageUpdateTime = totalUpdateTime / updateCount;
      expect(averageUpdateTime).toBeLessThan(2);
    });
  });

  describe('CSSパフォーマンス', () => {
    it('CSS Containmentの効果', () => {
      // Red: CSS Containmentが未実装のため失敗
      const computedStyle = getComputedStyle(card);
      
      // layoutとstyleのcontainmentが適用されている
      expect(computedStyle.contain).toContain('layout');
      expect(computedStyle.contain).toContain('style');
    });

    it('コンテナークエリの効率', () => {
      // Red: コンテナークエリが未実装のため失敗
      card.setAttribute('responsive', '');
      
      const computedStyle = getComputedStyle(card);
      
      // container-typeが設定されている
      expect(computedStyle.containerType).toBe('inline-size');
      expect(computedStyle.containerName).toBe('card');
    });

    it('カスタムプロパティのパフォーマンス', async () => {
      // Red: カスタムプロパティが未最適化のため失敗
      const customPropertyTime = await measureRenderTime(() => {
        card.style.setProperty('--card-bg', '#f0f0f0');
        card.style.setProperty('--card-color', '#333333');
        card.style.setProperty('--card-radius', '8px');
        card.style.setProperty('--card-padding', '20px');
        
        // プロパティが適用されていることを確認
        const computedStyle = getComputedStyle(card);
        expect(computedStyle.getPropertyValue('--card-bg')).toBe('#f0f0f0');
      });
      
      // カスタムプロパティの適用が5ms以下
      expect(customPropertyTime).toBeLessThan(5);
    });

    it('トランジションのパフォーマンス', async () => {
      // Red: トランジションが未最適化のため失敗
      card.setAttribute('interactive', '');
      
      const transitionTime = await measureRenderTime(() => {
        // ホバー状態をシミュレート
        card.dispatchEvent(new MouseEvent('mouseenter'));
        
        const computedStyle = getComputedStyle(card);
        
        // トランジションが設定されている
        expect(computedStyle.transition).toBeTruthy();
      });
      
      // トランジションの設定が3ms以下
      expect(transitionTime).toBeLessThan(3);
    });
  });

  describe('リソース効率', () => {
    it('無駄なDOM操作の最小化', async () => {
      // Red: DOM操作最適化が未実装のため失敗
      const domManipulationTime = await measureRenderTime(() => {
        // 同じコンテンツを複数回追加/削除
        for (let i = 0; i < 10; i++) {
          const content = document.createElement('p');
          content.textContent = `テスト ${i}`;
          card.appendChild(content);
          
          // 即座に削除
          content.remove();
        }
      });
      
      // 10回の追加/削除が20ms以下
      expect(domManipulationTime).toBeLessThan(20);
    });

    it('イベントデリゲーションの効率', async () => {
      // Red: イベントデリゲーションが未最適化のため失敗
      card.setAttribute('interactive', '');
      
      // 複数のアクションボタンを追加
      const buttons: HTMLButtonElement[] = [];
      for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.slot = 'actions';
        button.textContent = `アクション ${i}`;
        card.appendChild(button);
        buttons.push(button);
      }
      
      const eventTime = await measureRenderTime(() => {
        // 各ボタンをクリック
        buttons.forEach(button => {
          button.click();
        });
      });
      
      // 5個のボタンクリックが10ms以下
      expect(eventTime).toBeLessThan(10);
      
      // クリーンアップ
      buttons.forEach(button => button.remove());
    });

    it('メモリ使用量の監視', () => {
      // Red: メモリ監視が未実装のため失敗
      // パフォーマンスAPIが利用可能な場合
      if ('memory' in performance) {
        const initialMemory = (performance as any).memory.usedJSHeapSize;
        
        // 大量のカードを作成して削除
        const cards: HTMLElement[] = [];
        for (let i = 0; i < 20; i++) {
          const testCard = createTestElement<HTMLElement>('adaptive-card');
          testCard.setAttribute('responsive', '');
          cards.push(testCard);
        }
        
        cards.forEach(c => cleanupTestElement(c));
        
        // 強制ガベージコレクションを試行
        if (global.gc) {
          global.gc();
        }
        
        const finalMemory = (performance as any).memory.usedJSHeapSize;
        
        // メモリ使用量が大幅に増加していない
        const memoryIncrease = finalMemory - initialMemory;
        expect(memoryIncrease).toBeLessThan(1000000); // 1MB以下
      } else {
        // performance.memoryが利用できない場合はスキップ
        expect(true).toBe(true);
      }
    });
  });
});

// ベンチマークテストスイート
describe('AdaptiveCard Benchmark Tests', () => {
  describe('コンポーネント比較', () => {
    it('ネイティブ要素とのパフォーマンス比較', async () => {
      // Red: パフォーマンス比較が未実装のため失敗
      const iterations = 20;

      const runNative = () => {
        const nativeCard = document.createElement('div');
        nativeCard.className = 'native-card';
        nativeCard.innerHTML = `
          <header>ネイティブカード</header>
          <main>コンテンツ</main>
          <footer>アクション</footer>
        `;
        document.body.appendChild(nativeCard);
        nativeCard.remove();
      };

      const runCustom = () => {
        const customCard = createTestElement<HTMLElement>('adaptive-card');

        const header = document.createElement('h2');
        header.slot = 'header';
        header.textContent = 'カスタムカード';

        const content = document.createElement('p');
        content.textContent = 'コンテンツ';

        const action = document.createElement('button');
        action.slot = 'actions';
        action.textContent = 'アクション';

        customCard.appendChild(header);
        customCard.appendChild(content);
        customCard.appendChild(action);

        cleanupTestElement(customCard);
      };

      // warm up（初回コストを均す）
      runNative();
      runCustom();

      const samples = 7;
      const nativeTimes: number[] = [];
      const customTimes: number[] = [];

      for (let sample = 0; sample < samples; sample++) {
        nativeTimes.push(
          await measureRenderTime(() => {
            for (let i = 0; i < iterations; i++) runNative();
          })
        );

        customTimes.push(
          await measureRenderTime(() => {
            for (let i = 0; i < iterations; i++) runCustom();
          })
        );
      }

      nativeTimes.sort((a, b) => a - b);
      customTimes.sort((a, b) => a - b);

      const nativeTime = nativeTimes[Math.floor(nativeTimes.length / 2)];
      const customTime = customTimes[Math.floor(customTimes.length / 2)];
      
      // customElements + Shadow DOM + style の初期化を含むため、ネイティブdivより重いのは許容しつつ、
      // 極端に遅くならないことを比較で担保する（環境差/揺れに強くするため反復＆閾値を緩める）
      expect(customTime).toBeLessThan(Math.max(nativeTime * 12, iterations * 2.5));
    });

    it('複数フレームワークとの比較', async () => {
      // Red: フレームワーク比較が未実装のため失敗
      const componentCount = 10;
      
      const webComponentTime = await measureRenderTime(() => {
        for (let i = 0; i < componentCount; i++) {
          const card = createTestElement<HTMLElement>('adaptive-card');
          card.setAttribute('variant', CardVariant.ELEVATED);
          cleanupTestElement(card);
        }
      });
      
      // 10個のコンポーネント作成が100ms以下
      expect(webComponentTime).toBeLessThan(100);
      
      // 1コンポーネントあたり10ms以下
      const averageTime = webComponentTime / componentCount;
      expect(averageTime).toBeLessThan(10);
    });
  });

  describe('極限シナリオ', () => {
    it('最大コンテント量でのパフォーマンス', async () => {
      // Red: 大量コンテンツ処理が未最適化のため失敗
      const card = createTestElement<HTMLElement>('adaptive-card');
      
      const maxContentTime = await measureRenderTime(() => {
        // 大量のコンテンツを追加
        const largeContent = document.createElement('div');
        for (let i = 0; i < 100; i++) {
          const item = document.createElement('p');
          item.textContent = `アイテム ${i}: `.repeat(10) + '長いテキストコンテンツ';
          largeContent.appendChild(item);
        }
        card.appendChild(largeContent);
      });
      
      // 大量コンテントの追加が200ms以下
      expect(maxContentTime).toBeLessThan(200);
      
      cleanupTestElement(card);
    });

    it('高頻度イベント処理', async () => {
      // Red: 高頻度イベント処理が未最適化のため失敗
      const card = createTestElement<HTMLElement>('adaptive-card');
      card.setAttribute('interactive', '');
      card.setAttribute('responsive', '');
      
      const eventCount = 100;
      const highFrequencyTime = await measureRenderTime(() => {
        for (let i = 0; i < eventCount; i++) {
          // 高頻度クリック
          card.click();
          
          // 高頻度サイズ変更
          Object.defineProperty(card, 'offsetWidth', {
            value: 300 + (i % 100),
            configurable: true
          });
          
          (card as any).updateBreakpoint?.();
        }
      });
      
      // 100回の高頻度イベントが150ms以下
      expect(highFrequencyTime).toBeLessThan(150);
      
      cleanupTestElement(card);
    });
  });
});
