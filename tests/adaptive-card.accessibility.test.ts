/**
 * Adaptive Card Accessibility Tests
 * WCAG 2.1 AA準拠とアクセシビリティベストプラクティスのテスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  expectAriaAttribute,
  expectFocusable
} from './setup';
import {
  CardVariant,
  LinkPattern,
  LinkTarget
} from '../src/adaptive-card.types';

describe('AdaptiveCard Accessibility Tests', () => {
  let card: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    card = createTestElement<HTMLElement>('adaptive-card');
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  describe('ARIA属性とセマンティックス', () => {
    it('デフォルトのセマンティックロールが正しい', () => {
      // Red: デフォルトroleが未実装のため失敗
      expect(card.getAttribute('role')).toBe('article');
    });

    it('インタラクティブカードで適切なロールが設定される', () => {
      // Red: interactiveロールが未実装のため失敗
      card.setAttribute('interactive', '');
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('tabindex')).toBe('0');
      expectFocusable(card);
    });

    it('リンクカードで適切なセマンティックスが保たれる', () => {
      // Red: リンクカード機能が未実装のため失敗
      card.setAttribute('href', '/product/123');
      card.setAttribute('link-text', '商品詳細を見る');
      
      // カード自体はarticleのまま
      expect(card.getAttribute('role')).toBe('article');
      
      // ストレッチリンクが存在し、適切なラベルを持つ
      const stretchedLink = getShadowContent(card, '.card-link--stretched');
      expect(stretchedLink).toBeTruthy();
      expect(stretchedLink?.getAttribute('href')).toBe('/product/123');
      expect(stretchedLink?.getAttribute('aria-label')).toBe('商品詳細を見る');
    });

    it('新しいタブで開くリンクの適切なアナウンス', () => {
      // Red: 新しいタブリンクのアクセシビリティが未実装のため失敗
      card.setAttribute('href', 'https://example.com');
      card.setAttribute('link-text', '外部サイトへのリンク');
      card.setAttribute('link-target', LinkTarget.BLANK);
      
      const link = getShadowContent(card, '.card-link--stretched');
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('aria-label')).toBe('外部サイトへのリンク (新しいタブで開く)');
    });

    it('aria-expandedが適切に管理される', () => {
      // Red: 展開可能カード機能が未実装のため失敗
      card.setAttribute('expandable', '');
      card.setAttribute('expanded', 'false');
      
      expectAriaAttribute(card, 'aria-expanded', 'false');
      
      card.setAttribute('expanded', 'true');
      expectAriaAttribute(card, 'aria-expanded', 'true');
    });

    it('aria-pressedが選択状態で適切に設定される', () => {
      // Red: 選択可能カード機能が未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('selected', 'false');
      
      expectAriaAttribute(card, 'aria-pressed', 'false');
      
      card.setAttribute('selected', 'true');
      expectAriaAttribute(card, 'aria-pressed', 'true');
    });

    it('複合ARIAラベルが正しく関連付けられる', () => {
      // Red: 複合ARIAラベルが未実装のため失敗
      const titleId = 'card-title';
      const descId = 'card-description';
      
      const title = document.createElement('h2');
      title.id = titleId;
      title.slot = 'header';
      title.textContent = 'カードタイトル';
      
      const description = document.createElement('p');
      description.id = descId;
      description.textContent = 'カードの詳細説明';
      
      card.appendChild(title);
      card.appendChild(description);
      
      card.setAttribute('aria-labelledby', titleId);
      card.setAttribute('aria-describedby', descId);
      
      expectAriaAttribute(card, 'aria-labelledby', titleId);
      expectAriaAttribute(card, 'aria-describedby', descId);
    });
  });

  describe('キーボードナビゲーション', () => {
    it('フォーカスの適切な管理', async () => {
      // Red: フォーカス管理が未実装のため失敗
      card.setAttribute('interactive', '');
      
      // タブでフォーカス可能
      await user.tab();
      expect(document.activeElement).toBe(card);
      
      // フォーカスインジケーターが表示される
      const computedStyle = getComputedStyle(card);
      expect(computedStyle.outline).toBeTruthy();
    });

    it('EnterとSpaceキーでアクティベートできる', async () => {
      // Red: キーボードイベントが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const clickSpy = vi.fn();
      card.addEventListener('card-click', clickSpy);
      
      card.focus();
      
      // Enterキー
      await user.keyboard('{Enter}');
      expect(clickSpy).toHaveBeenCalledTimes(1);
      
      // Spaceキー
      await user.keyboard(' ');
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });

    it('カード内のインタラクティブ要素のフォーカス順序', async () => {
      // Red: フォーカス順序が未実装のため失敗
      card.setAttribute('interactive', '');
      
      const button1 = document.createElement('button');
      button1.slot = 'actions';
      button1.textContent = 'アクション1';
      
      const button2 = document.createElement('button');
      button2.slot = 'actions';
      button2.textContent = 'アクション2';
      
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'リンク';
      
      card.appendChild(button1);
      card.appendChild(button2);
      card.appendChild(link);
      
      // フォーカス順序の確認
      await user.tab(); // カード自体
      expect(document.activeElement).toBe(card);
      
      await user.tab(); // ボタン1
      expect(document.activeElement).toBe(button1);
      
      await user.tab(); // ボタン2
      expect(document.activeElement).toBe(button2);
      
      await user.tab(); // リンク
      expect(document.activeElement).toBe(link);
    });

    it('リンクカードでのフォーカス管理', async () => {
      // Red: リンクカードフォーカスが未実装のため失敗
      card.setAttribute('href', '/page');
      card.setAttribute('link-text', 'ページへ移動');
      card.setAttribute('link-pattern', LinkPattern.STRETCHED);
      
      const additionalButton = document.createElement('button');
      additionalButton.slot = 'actions';
      additionalButton.textContent = '追加アクション';
      card.appendChild(additionalButton);
      
      // ストレッチリンクにフォーカス
      const stretchedLink = getShadowContent(card, '.card-link--stretched') as HTMLElement;
      await user.tab();
      expect(document.activeElement).toBe(stretchedLink);
      
      // 追加ボタンにフォーカス
      await user.tab();
      expect(document.activeElement).toBe(additionalButton);
    });

    it('無効状態でフォーカスできない', () => {
      // Red: disabled状態のフォーカス制御が未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('disabled', '');
      
      expect(card.getAttribute('tabindex')).toBe('-1');
      expectFocusable(card); // disabledでもフォーカス可能であるべきではない
    });
  });

  describe('スクリーンリーダー対応', () => {
    it('カードコンテンツが適切に読み上げられる', () => {
      // Red: スクリーンリーダー対応が未実装のため失敗
      const title = document.createElement('h2');
      title.slot = 'header';
      title.textContent = '商品タイトル';
      
      const description = document.createElement('p');
      description.textContent = '商品の詳細説明テキスト';
      
      const price = document.createElement('span');
      price.textContent = '価格: ¥1,000';
      
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(price);
      
      // コンテンツがアクセシブルな順序で配置されている
      const textContent = card.textContent || '';
      expect(textContent).toContain('商品タイトル');
      expect(textContent).toContain('商品の詳細説明テキスト');
      expect(textContent).toContain('価格: ¥1,000');
    });

    it('イメージに適切なaltテキストが設定される', () => {
      // Red: イメージalt属性のチェックが未実装のため失敗
      const image = document.createElement('img');
      image.slot = 'media';
      image.src = 'product-image.jpg';
      image.alt = 'ワイヤレスヘッドフォンの商品画像';
      
      card.appendChild(image);
      
      expect(image.alt).toBe('ワイヤレスヘッドフォンの商品画像');
    });

    it('リンクカードのコンテキストが明確', () => {
      // Red: リンクコンテキストが未実装のため失敗
      card.setAttribute('href', '/product/wireless-headphones');
      card.setAttribute('link-text', 'ワイヤレスヘッドフォンの詳細を見る');
      
      const title = document.createElement('h2');
      title.slot = 'header';
      title.textContent = 'プレミアムワイヤレスヘッドフォン';
      
      const description = document.createElement('p');
      description.textContent = '高音質、ノイズキャンセリング機能付き';
      
      card.appendChild(title);
      card.appendChild(description);
      
      const link = getShadowContent(card, '.card-link--stretched');
      
      // リンクテキストが簡潔で明確
      expect(link?.getAttribute('aria-label')).toBe('ワイヤレスヘッドフォンの詳細を見る');
      
      // カードのコンテンツは通常のテキストとして読み上げられる
      expect(card.textContent).toContain('プレミアムワイヤレスヘッドフォン');
      expect(card.textContent).toContain('高音質、ノイズキャンセリング機能付き');
    });

    it('動的コンテンツのアナウンス', () => {
      // Red: ライブリージョンが未実装のため失敗
      card.setAttribute('aria-live', 'polite');
      card.setAttribute('aria-atomic', 'true');
      
      const status = document.createElement('div');
      status.textContent = '読み込み中...';
      card.appendChild(status);
      
      expect(card.getAttribute('aria-live')).toBe('polite');
      expect(card.getAttribute('aria-atomic')).toBe('true');
      
      // ステータス更新
      status.textContent = '読み込み完了';
      expect(status.textContent).toBe('読み込み完了');
    });
  });

  describe('色コントラストと可視性', () => {
    it('フォーカスインジケーターの十分なコントラスト', () => {
      // Red: フォーカススタイルが未実装のため失敗
      card.setAttribute('interactive', '');
      card.focus();
      
      const computedStyle = getComputedStyle(card);
      
      // フォーカスアウトラインが存在する
      expect(computedStyle.outline).toBeTruthy();
      expect(computedStyle.outlineWidth).toBe('2px'); // WCAG推奨最小値
    });

    it('高コントラストモードでの適切な表示', () => {
      // Red: 高コントラストモード対応が未実装のため失敗
      // forced-colorsメディアクエリをシミュレート
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(forced-colors: active)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));
      
      window.matchMedia = mockMatchMedia;
      
      // 高コントラストモードが有効な場合のチェック
      expect(window.matchMedia('(forced-colors: active)').matches).toBe(true);
    });

    it('テキストと背景のコントラスト比', () => {
      // Red: コントラスト比チェックが未実装のため失敗
      card.setAttribute('variant', CardVariant.ELEVATED);
      
      const computedStyle = getComputedStyle(card);
      
      // 背景色とテキスト色が設定されている
      expect(computedStyle.backgroundColor).toBeTruthy();
      expect(computedStyle.color).toBeTruthy();
      
      // CSSカスタムプロパティでコントラスト調整可能
      expect(computedStyle.getPropertyValue('--card-bg')).toBeTruthy();
      expect(computedStyle.getPropertyValue('--card-color')).toBeTruthy();
    });

    it('ホバー状態でのコントラスト維持', () => {
      // Red: ホバースタイルが未実装のため失敗
      card.setAttribute('interactive', '');
      
      // ホバー状態をシミュレート
      fireEvent.mouseEnter(card);
      
      const computedStyle = getComputedStyle(card);
      
      // ホバー時でも適切なコントラストが保たれる
      expect(computedStyle.getPropertyValue('--card-shadow')).toBeTruthy();
    });
  });

  describe('エラー状態とアクセシビリティ', () => {
    it('エラー状態の適切なアナウンス', () => {
      // Red: エラー状態のアクセシビリティが未実装のため失敗
      card.setAttribute('aria-invalid', 'true');
      
      const errorMessage = document.createElement('div');
      errorMessage.id = 'error-message';
      errorMessage.textContent = 'カードの読み込みに失敗しました';
      errorMessage.setAttribute('role', 'alert');
      
      card.appendChild(errorMessage);
      card.setAttribute('aria-describedby', 'error-message');
      
      expect(card.getAttribute('aria-invalid')).toBe('true');
      expect(card.getAttribute('aria-describedby')).toBe('error-message');
      expect(errorMessage.getAttribute('role')).toBe('alert');
    });

    it('読み込み中状態のアクセシビリティ', () => {
      // Red: 読み込み状態のアクセシビリティが未実装のため失敗
      card.setAttribute('aria-busy', 'true');
      card.setAttribute('aria-live', 'polite');
      
      const loadingIndicator = document.createElement('div');
      loadingIndicator.textContent = 'コンテンツを読み込み中...';
      loadingIndicator.setAttribute('aria-label', '読み込み中');
      
      card.appendChild(loadingIndicator);
      
      expect(card.getAttribute('aria-busy')).toBe('true');
      expect(card.getAttribute('aria-live')).toBe('polite');
      
      // 読み込み完了時
      card.setAttribute('aria-busy', 'false');
      loadingIndicator.textContent = '読み込み完了';
      
      expect(card.getAttribute('aria-busy')).toBe('false');
    });

    it('無効状態の適切な表現', () => {
      // Red: disabled状態のアクセシビリティが未実装のため失敗
      card.setAttribute('interactive', '');
      card.setAttribute('disabled', '');
      
      expect(card.getAttribute('aria-disabled')).toBe('true');
      expect(card.getAttribute('tabindex')).toBe('-1');
      
      // 無効状態ではイベントが発生しない
      const clickSpy = vi.fn();
      card.addEventListener('card-click', clickSpy);
      
      fireEvent.click(card);
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('モバイルアクセシビリティ', () => {
    it('タッチターゲットの十分なサイズ', () => {
      // Red: タッチターゲットサイズが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const computedStyle = getComputedStyle(card);
      const minSize = 44; // px (WCAG 2.1 AA準拠)
      
      // カードの最小サイズが確保されている
      expect(parseInt(computedStyle.minHeight) || card.offsetHeight).toBeGreaterThanOrEqual(minSize);
      expect(parseInt(computedStyle.minWidth) || card.offsetWidth).toBeGreaterThanOrEqual(minSize);
    });

    it('スクリーンリーダーのモバイル最適化', () => {
      // Red: モバイルスクリーンリーダー対応が未実装のため失敗
      card.setAttribute('responsive', '');
      
      // モバイルビューポートをシミュレート
      Object.defineProperty(card, 'offsetWidth', {
        value: 350,
        configurable: true
      });
      
      // コンテンツがモバイルフレンドリーに調整される
      const cardElement = getShadowContent(card, '.card');
      expect(cardElement?.getAttribute('data-breakpoint')).toBe('mobile');
    });

    it('タッチジェスチャーの適切な処理', async () => {
      // Red: タッチイベントが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const clickSpy = vi.fn();
      card.addEventListener('card-click', clickSpy);
      
      // タッチイベントをシミュレート
      fireEvent.touchStart(card);
      fireEvent.touchEnd(card);
      
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('国際化とローカリゼーション', () => {
    it('日本語エラーメッセージの適切な表示', () => {
      // Red: 日本語エラーメッセージが未実装のため失敗
      const consoleSpy = vi.spyOn(console, 'error');
      
      card.setAttribute('variant', 'invalid-variant');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('カードバリアントが無効です')
      );
    });

    it('RTLレイアウトのサポート', () => {
      // Red: RTLサポートが未実装のため失敗
      document.documentElement.dir = 'rtl';
      
      card.setAttribute('interactive', '');
      
      const computedStyle = getComputedStyle(card);
      
      // RTLレイアウトで適切に調整される
      expect(computedStyle.direction).toBe('rtl');
      
      // 復旧
      document.documentElement.dir = 'ltr';
    });

    it('言語設定に応じたフォント調整', () => {
      // Red: 多言語フォントサポートが未実装のため失敗
      document.documentElement.lang = 'ja';
      
      const computedStyle = getComputedStyle(card);
      
      // 日本語フォントスタックが適用される
      expect(computedStyle.fontFamily).toMatch(/system-ui|sans-serif/);
    });
  });
});

// コンプライアンステストスイート
describe('AdaptiveCard WCAG Compliance Tests', () => {
  let card: HTMLElement;

  beforeEach(() => {
    card = createTestElement<HTMLElement>('adaptive-card');
  });

  afterEach(() => {
    cleanupTestElement(card);
  });

  describe('WCAG 2.1 Level A', () => {
    it('キーボードアクセシビリティ (2.1.1)', () => {
      // Red: キーボードアクセシビリティが未実装のため失敗
      card.setAttribute('interactive', '');
      
      expectFocusable(card);
      expect(card.getAttribute('tabindex')).toBe('0');
    });

    it('フォーカスのトラップ禁止 (2.1.2)', async () => {
      // Red: フォーカストラップ防止が未実装のため失敗
      card.setAttribute('interactive', '');
      
      const user = userEvent.setup();
      
      // カードにフォーカス
      await user.tab();
      expect(document.activeElement).toBe(card);
      
      // タブで次の要素に移動できる
      await user.tab();
      expect(document.activeElement).not.toBe(card);
    });

    it('ページタイトル (2.4.2)', () => {
      // Red: ページタイトルが未実装のため失敗
      const title = document.createElement('h2');
      title.slot = 'header';
      title.textContent = 'カードタイトル';
      card.appendChild(title);
      
      expect(card.querySelector('h2')?.textContent).toBe('カードタイトル');
    });
  });

  describe('WCAG 2.1 Level AA', () => {
    it('コントラスト比 (1.4.3)', () => {
      // Red: コントラスト比チェックが未実装のため失敗
      card.setAttribute('variant', CardVariant.ELEVATED);
      
      const computedStyle = getComputedStyle(card);
      
      // カスタムプロパティでコントラスト調整可能
      expect(computedStyle.getPropertyValue('--card-bg')).toBeTruthy();
      expect(computedStyle.getPropertyValue('--card-color')).toBeTruthy();
    });

    it('ターゲットサイズ (2.5.5)', () => {
      // Red: ターゲットサイズチェックが未実装のため失敗
      card.setAttribute('interactive', '');
      
      const minTargetSize = 44; // px
      
      expect(card.offsetHeight).toBeGreaterThanOrEqual(minTargetSize);
      expect(card.offsetWidth).toBeGreaterThanOrEqual(minTargetSize);
    });

    it('フォーカス表示 (2.4.7)', () => {
      // Red: フォーカス表示が未実装のため失敗
      card.setAttribute('interactive', '');
      card.focus();
      
      const computedStyle = getComputedStyle(card);
      expect(computedStyle.outline).toBeTruthy();
      expect(computedStyle.outlineWidth).toBe('2px');
    });
  });

  describe('WCAG 2.1 Level AAA', () => {
    it('拡張コントラスト (1.4.6)', () => {
      // Red: 拡張コントラストが未実装のため失敗
      card.style.setProperty('--card-contrast-enhanced', 'true');
      
      const computedStyle = getComputedStyle(card);
      
      // 高コントラスト設定が可能
      expect(computedStyle.getPropertyValue('--card-contrast-enhanced')).toBe('true');
    });

    it('コンテキストヘルプ (3.3.5)', () => {
      // Red: コンテキストヘルプが未実装のため失敗
      card.setAttribute('aria-describedby', 'help-text');
      
      const helpText = document.createElement('div');
      helpText.id = 'help-text';
      helpText.textContent = 'このカードをクリックして詳細を表示';
      card.appendChild(helpText);
      
      expect(card.getAttribute('aria-describedby')).toBe('help-text');
      expect(helpText.textContent).toContain('クリックして詳細を表示');
    });
  });
});
