# TDD Workflow Guide for Adaptive Card Component

このドキュメントは、Adaptive Card コンポーネントの開発における TDD (Test-Driven Development) アプローチのガイドラインです。

## TDD の基本原則

### 1. Red-Green-Refactor サイクル

```
🔴 RED    → 失敗するテストを書く
🟢 GREEN  → 最小限の実装でテストを通す  
🔵 REFACTOR → 設計を改善する
```

### 2. テストファーストの思考法

- **不安をテストに変える**: 「この機能は正しく動くか？」→ テストコードで表現
- **仕様の明確化**: テストコードが実行可能な仕様書になる
- **設計の誘導**: テストから API 設計が自然に導かれる

## プロジェクト構造

```
web-components-factory/
├── src/
│   ├── adaptive-card.ts          # メインコンポーネント
│   ├── adaptive-card.types.ts    # 型定義
│   └── adaptive-card.styles.ts   # スタイル定義
├── tests/
│   ├── setup.ts                  # テスト環境セットアップ
│   ├── adaptive-card.test.ts     # 基本テスト
│   ├── adaptive-card.integration.test.ts
│   ├── adaptive-card.accessibility.test.ts
│   └── adaptive-card.performance.test.ts
├── package.json
├── vitest.config.ts
└── tsconfig.json
```

## テストカテゴリ

### 1. Unit Tests (50%)

**対象**: 個別機能の単体テスト

```typescript
// プロパティ/属性のバインディング
it('variant プロパティが正しく反映される', () => {
  card.setAttribute('variant', CardVariant.OUTLINED);
  expect((card as any).variant).toBe(CardVariant.OUTLINED);
});

// イベント処理
it('クリックイベントが正しく発生する', () => {
  card.setAttribute('interactive', '');
  const eventSpy = vi.fn();
  card.addEventListener('card-click', eventSpy);
  card.click();
  expect(eventSpy).toHaveBeenCalled();
});
```

### 2. Integration Tests (30%)

**対象**: コンポーネント間連携とユーザーフロー

```typescript
// ユーザーインタラクションフロー
it('カードクリックからアクション実行までのフロー', async () => {
  // シナリオ全体をテスト
  await user.click(card);
  await user.click(actionButton);
  expect(actionCallback).toHaveBeenCalled();
});
```

### 3. Accessibility Tests (10%)

**対象**: WCAG 2.1 AA 準拠とアクセシビリティ

```typescript
// ARIA属性の適切な設定
it('インタラクティブカードで適切なロールが設定される', () => {
  card.setAttribute('interactive', '');
  expect(card.getAttribute('role')).toBe('button');
  expect(card.getAttribute('tabindex')).toBe('0');
});
```

### 4. Performance Tests (5%)

**対象**: レンダリング性能とメモリ効率

```typescript
// 初期化パフォーマンス
it('単一カードの初期化が高速', async () => {
  const renderTime = await measureRenderTime(async () => {
    const testCard = createTestElement<HTMLElement>('adaptive-card');
    cleanupTestElement(testCard);
  });
  expect(renderTime).toBeLessThan(50); // 50ms以下
});
```

### 5. Visual/Snapshot Tests (5%)

**対象**: レイアウトと視覚的回帰

```typescript
// CSS スナップショット
it('バリアントに応じたスタイルが適用される', () => {
  card.setAttribute('variant', CardVariant.ELEVATED);
  expect(card).toMatchSnapshot();
});
```

## TDD 実践ワークフロー

### Phase 1: RED (失敗するテストを書く)

#### 1.1 要件の明確化

```typescript
// 例: リンクカード機能の要件
describe('リンクカード機能', () => {
  it('href属性が設定されるとストレッチリンクが作成される', () => {
    // Red: まだ実装されていないため失敗
    card.setAttribute('href', '/product/123');
    card.setAttribute('link-text', '商品詳細を見る');
    
    const stretchedLink = getShadowContent(card, '.card-link--stretched');
    expect(stretchedLink).toBeTruthy();
    expect(stretchedLink?.getAttribute('href')).toBe('/product/123');
  });
});
```

#### 1.2 API 設計の検証

```typescript
// インターフェースレベルでのテスト
it('リンクカードの設定が型安全', () => {
  const config: LinkCardConfig = {
    href: '/page',
    linkText: 'ページへ移動',
    target: LinkTarget.BLANK,
    pattern: LinkPattern.STRETCHED
  };
  
  // TypeScript エラーが発生しないことを確認
  card.setAttribute('href', config.href);
  card.setAttribute('link-text', config.linkText);
});
```

### Phase 2: GREEN (最小限の実装)

#### 2.1 基本構造の実装

```typescript
// adaptive-card.ts - 最小限の実装
export class AdaptiveCard extends WebComponent {
  static definition = {
    name: 'adaptive-card',
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('href'),
      PropertyAttr('linkText', 'link-text'),
      BooleanAttr('responsive'),
      BooleanAttr('interactive')
    ]
  };
  
  // デフォルト値
  variant: CardVariant = CardVariant.ELEVATED;
  responsive: boolean = true;
  interactive: boolean = false;
  
  connectedCallback() {
    super.connectedCallback();
    this.setupComponent();
  }
  
  private setupComponent() {
    // 最小限の初期化処理
    if (this.interactive) {
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
    }
  }
}
```

#### 2.2 段階的な機能追加

```typescript
// ステップ1: 基本プロパティ
variantChanged(oldValue: string, newValue: string) {
  if (isValidVariant(newValue)) {
    this.variant = newValue;
    this.updateVariantStyles();
  } else {
    console.error(ErrorMessages.INVALID_VARIANT);
  }
}

// ステップ2: リンク機能
hrefChanged(oldValue: string, newValue: string) {
  if (newValue) {
    this.createStretchedLink(newValue);
  }
}

private createStretchedLink(href: string) {
  // 最小限のリンク作成処理
  const link = document.createElement('a');
  link.href = href;
  link.className = 'card-link--stretched';
  this.shadowRoot?.appendChild(link);
}
```

### Phase 3: REFACTOR (設計改善)

#### 3.1 コードの整理

```typescript
// リファクタリング後の構造
class LinkCardManager {
  constructor(private host: AdaptiveCard) {}
  
  createStretchedLink(config: LinkCardConfig): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = config.href;
    link.className = 'card-link--stretched';
    link.setAttribute('aria-label', config.linkText);
    
    if (config.target === LinkTarget.BLANK) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${config.linkText} (新しいタブで開く)`);
    }
    
    return link;
  }
}

class ResponsiveManager {
  constructor(private host: AdaptiveCard) {}
  
  setupResizeObserver() {
    // リファクタリングされたレスポンシブ処理
  }
}
```

#### 3.2 テストヘルパーの抽出

```typescript
// tests/helpers/card-test-builder.ts
export class CardTestBuilder {
  private config: Partial<AdaptiveCardProperties> = {};
  
  withVariant(variant: CardVariant): this {
    this.config.variant = variant;
    return this;
  }
  
  withLink(href: string, linkText: string): this {
    this.config.href = href;
    this.config.linkText = linkText;
    return this;
  }
  
  build(): HTMLElement {
    const card = createTestElement<HTMLElement>('adaptive-card');
    Object.entries(this.config).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        card.toggleAttribute(key, value);
      } else {
        card.setAttribute(key, String(value));
      }
    });
    return card;
  }
}
```

## npm scripts の活用

### TDD 開発用スクリプト

```bash
# 継続的テスト実行 (watch モード)
npm run tdd

# テストを実行してカバレッジ確認
npm run test:coverage

# 型チェック
npm run type-check

# 全体のCI実行
npm run ci
```

### 開発フロー例

```bash
# 1. 新機能開発開始
npm run tdd  # watch モードでテスト実行

# 2. テストファイル編集
# tests/adaptive-card.test.ts に新しいテストを追加

# 3. テストが失敗することを確認 (RED)

# 4. 最小限の実装 (GREEN)
# src/adaptive-card.ts を編集

# 5. テストが通ることを確認

# 6. リファクタリング (REFACTOR)

# 7. 全テスト実行
npm run test:run

# 8. カバレッジ確認
npm run test:coverage
```

## テスト命名規則

### ファイル命名

```
✅ 良い例:
adaptive-card.test.ts              # 基本単体テスト
adaptive-card.integration.test.ts  # 統合テスト
adaptive-card.accessibility.test.ts # アクセシビリティテスト
adaptive-card.performance.test.ts  # パフォーマンステスト

❌ 悪い例:
test.ts
card-test.ts
my-tests.ts
```

### テストケース命名

```typescript
// ✅ 良い例: 「何を」「どういう条件で」「どうなる」が明確
it('variant プロパティが正しく反映される', () => {});
it('インタラクティブカードでキーボードナビゲーションが動作する', () => {});
it('リンクカードで新しいタブ用の適切なアナウンスが提供される', () => {});

// ❌ 悪い例: 曖昧で何をテストしているか不明
it('プロパティのテスト', () => {});
it('動作確認', () => {});
it('リンクのテスト', () => {});
```

### describe ブロック構造

```typescript
describe('AdaptiveCard Component', () => {
  describe('コアコンポーネントの初期化', () => {
    // 基本的な初期化テスト
  });
  
  describe('プロパティと属性のバインディング', () => {
    // プロパティ関連テスト
  });
  
  describe('レスポンシブビヘイビア', () => {
    // レスポンシブ機能テスト
  });
  
  describe('アクセシビリティ', () => {
    // a11y テスト
  });
});
```

## Mock とテストダブル

### 適切な使い分け

```typescript
// Stub: 固定値を返すだけ
const mockElement = {
  offsetWidth: 400,
  offsetHeight: 300
};

// Mock: 呼び出しを検証
const resizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Spy: 実装を保持しつつ監視
const consoleSpy = vi.spyOn(console, 'error');

// Fake: 簡易実装
class FakeResizeObserver {
  private callbacks: ResizeObserverCallback[] = [];
  
  constructor(callback: ResizeObserverCallback) {
    this.callbacks.push(callback);
  }
  
  observe() { /* 簡易実装 */ }
  unobserve() { /* 簡易実装 */ }
  disconnect() { /* 簡易実装 */ }
  
  // テスト用ヘルパー
  simulateResize(entries: ResizeObserverEntry[]) {
    this.callbacks.forEach(callback => callback(entries, this));
  }
}
```

## カバレッジ目標

### 全体目標

```yaml
Statements: 85%+   # 文レベルカバレッジ
Branches: 80%+     # 分岐カバレッジ  
Functions: 85%+    # 関数カバレッジ
Lines: 85%+        # 行カバレッジ
```

### 機能別目標

```yaml
Core Component: 90%+        # コアコンポーネント
Accessibility: 95%+         # アクセシビリティ機能
Responsive: 85%+           # レスポンシブ機能
Event Handling: 90%+       # イベント処理
Error Handling: 80%+       # エラーハンドリング
```

## デバッグとトラブルシューティング

### よくある問題と解決法

#### 1. Shadow DOM テストの問題

```typescript
// ❌ 問題: Shadow DOM の要素が取得できない
const element = card.querySelector('.card');

// ✅ 解決: getShadowContent ヘルパーを使用
const element = getShadowContent(card, '.card');
```

#### 2. 非同期処理のテスト

```typescript
// ❌ 問題: 非同期処理の完了を待たない
card.updateBreakpoint();
expect(card.getAttribute('data-breakpoint')).toBe('mobile');

// ✅ 解決: 適切な待機処理
await waitForCustomElement(card);
expect(card.getAttribute('data-breakpoint')).toBe('mobile');
```

#### 3. イベントリスナーのクリーンアップ

```typescript
// ❌ 問題: テスト間でイベントリスナーが残る
beforeEach(() => {
  card = createTestElement('adaptive-card');
});

// ✅ 解決: 適切なクリーンアップ
afterEach(() => {
  cleanupTestElement(card);
});
```

### テスト実行の高速化

```typescript
// 並列実行の設定
export default defineConfig({
  test: {
    threads: true,
    maxThreads: 4,
    isolate: false  // 必要時のみ分離
  }
});

// テストのパフォーマンス最適化
beforeEach(() => {
  // 最小限の初期化のみ
  document.body.innerHTML = '';
});
```

## 継続的改善

### メトリクス監視

```bash
# テスト実行時間の監視
npm run test:run -- --reporter=verbose

# カバレッジトレンドの追跡
npm run test:coverage -- --reporter=json

# パフォーマンステストの実行
npm run test:performance
```

### コードレビューチェックリスト

- [ ] テストファーストで開発されているか
- [ ] Red-Green-Refactor サイクルが守られているか
- [ ] テスト名が明確で理解しやすいか
- [ ] アクセシビリティテストが含まれているか
- [ ] エラーハンドリングがテストされているか
- [ ] カバレッジ目標を満たしているか
- [ ] パフォーマンステストが適切か

### 技術的負債の管理

```typescript
// TODO コメントの使用例
// TODO: [Performance] ResizeObserver の debounce 実装
// FIXME: [A11y] Safari での focus-visible 対応
// NOTE: [Breaking] 次のメジャーバージョンで API 変更予定
```

## まとめ

TDD は単なるテスト手法ではなく、**設計とプログラミングの方法論**です。

### TDD の価値

1. **設計の誘導**: テストから自然に良い API が生まれる
2. **不安の解消**: 不確実性をテストコードで確実性に変える
3. **高速フィードバック**: 変更の影響を即座に検知
4. **リファクタリングの安全性**: 既存機能を壊さずに改善
5. **実行可能な仕様書**: テストコードが最新の仕様を表現

### 成功の鍵

- **小さなサイクル**: Red-Green-Refactor を短時間で回す
- **テストファースト**: 実装前に必ずテストを書く
- **継続的改善**: メトリクスを監視してプロセスを改善
- **チーム全体の理解**: TDD の価値をチーム全体で共有

**TDD は最初は時間がかかるように感じますが、中長期的には開発速度を大幅に向上させ、バグを激減させる強力な手法です。**
