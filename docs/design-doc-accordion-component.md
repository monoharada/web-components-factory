# デジタル庁デザインシステム アコーディオンWeb Component 設計書

## 概要

### プロジェクト概要
デジタル庁のデザインシステムに準拠したアコーディオンコンポーネントをWeb Components技術で実装する。本コンポーネントは、情報の階層的な表示と効率的な画面スペースの活用を目的とし、アクセシビリティとユーザビリティを最優先に設計される。

### 背景と動機
現在のデジタル庁デザインシステムのアコーディオン実装は、HTML標準のdetails/summary要素とBEMクラスベースのスタイリングに依存している。これをWeb Componentsベースの実装に移行することで、以下の利点を実現する：

- コンポーネントの完全なカプセル化
- 再利用性の向上
- メンテナンス性の改善
- 一貫したAPIの提供
- Shadow DOMによるスタイル汚染の防止

## 目標と非目標

### 目標
- デジタル庁デザインシステムのビジュアル仕様を完全に準拠
- WCAG 2.1 AAレベルのアクセシビリティ要件を満たす
- Shadow DOMを活用した堅牢なカプセル化
- TypeScriptによる型安全な実装
- レスポンシブデザインの実現（モバイル・デスクトップ対応）
- スムーズなアニメーションとインタラクション

### 非目標
- レガシーブラウザ（IE11等）のサポート
- 外部ライブラリへの依存
- サーバーサイドレンダリング（SSR）の完全サポート
- 既存のdetails/summary実装との100%の後方互換性

## 設計

### システムアーキテクチャ

#### コンポーネント構成
```
dads-accordion (親コンテナ)
├── dads-accordion-item (個別アイテム)
│   ├── [slot="header"] (質問/タイトル部分)
│   └── [slot="content"] (回答/コンテンツ部分)
└── dads-accordion-item
    ├── [slot="header"]
    └── [slot="content"]
```

#### 技術スタック
- **フレームワーク**: Vanilla Web Components (Custom Elements v1)
- **型システム**: TypeScript (strict mode)
- **スタイリング**: Shadow DOM + CSS Custom Properties
- **ビルドツール**: TypeScript Compiler
- **テスティング**: Vitest + Playwright

### API仕様

#### 使用例
```html
<!-- アクセシビリティファースト: デフォルトはアニメーションなし -->
<dads-accordion>
  <dads-accordion-item>...</dads-accordion-item>
</dads-accordion>

<!-- アニメーション有効化（ユーザーが明示的に選択） -->
<dads-accordion animation="smooth">
  <dads-accordion-item>...</dads-accordion-item>
</dads-accordion>

<!-- prefers-reduced-motion を尊重 -->
<dads-accordion animation="smooth" respect-motion-preference>
  <dads-accordion-item>...</dads-accordion-item>
</dads-accordion>

<!-- カスタムアニメーション -->
<dads-accordion animation="custom" animation-name="spring">
  <dads-accordion-item>...</dads-accordion-item>
</dads-accordion>
```

#### dads-accordion コンポーネント

##### 属性（Attributes）  
web-components.tsライブラリに準拠した定義:

```typescript
import { BooleanAttr, PropertyAttr } from './web-components';

class DadsAccordion extends WebComponent {
  static definition = {
    name: 'dads-accordion',
    attributes: [
      BooleanAttr('allow-multiple'),  // 複数アイテムの同時展開を許可
      PropertyAttr('animation', {     // アニメーションタイプ  
        validate: (v) => ['none', 'smooth', 'bounce', 'custom'].includes(v as string),
        default: 'none'  // アクセシビリティファースト：デフォルトはアニメーションなし
      }),
      BooleanAttr('respect-motion-preference'), // prefers-reduced-motion を尊重（デフォルト: true）
      BooleanAttr('keyboard-nav')     // キーボードナビゲーション有効化
    ]
  };
  
  // カスタムアニメーション登録
  static #customAnimations = new Map<string, AnimationFunction>();
  
  static registerAnimation(name: string, animationFn: AnimationFunction) {
    this.#customAnimations.set(name, animationFn);
  }
}
```

##### メソッド
```typescript
class DadsAccordion {
  expandAll(): void;    // すべてのアイテムを展開
  collapseAll(): void;  // すべてのアイテムを閉じる
  getExpandedItems(): DadsAccordionItem[];  // 展開中のアイテムを取得
}
```

##### イベント
```typescript
// イベントマップの型安全な定義
interface DadsAccordionEventMap {
  'dads-accordion-change': CustomEvent<{
    expanded: DadsAccordionItem[];
    collapsed: DadsAccordionItem[];
  }>;
}

// 型安全なaddEventListener
addEventListener<K extends keyof DadsAccordionEventMap>(
  type: K,
  listener: (ev: DadsAccordionEventMap[K]) => void
): void;
```

#### dads-accordion-item コンポーネント

##### 属性（Attributes）  
web-components.tsライブラリに準拠した定義:

```typescript
class DadsAccordionItem extends WebComponent {
  static definition = {
    name: 'dads-accordion-item',
    attributes: [
      BooleanAttr('expanded'),     // 展開状態
      BooleanAttr('disabled'),     // 無効化状態
      PropertyAttr('icon-position', {
        validate: (v) => ['left', 'right'].includes(v as string),
        default: 'left'
      })
    ]
  };
}
```

##### メソッド
```typescript
class DadsAccordionItem {
  toggle(): void;    // 開閉をトグル
  expand(): void;    // 展開
  collapse(): void;  // 閉じる
}
```

##### イベント
```typescript
interface DadsAccordionItemEventMap {
  'dads-accordion-item-toggle': CustomEvent<{
    expanded: boolean;
    item: DadsAccordionItem;
  }>;
  'dads-accordion-item-before-toggle': CustomEvent<{
    expanded: boolean;
    cancelable: true;  // キャンセル可能
  }>;
}

// Shadow DOM境界を超えるイベント再発火
private redispatchEvent(originalEvent: Event): void {
  const newEvent = new CustomEvent(originalEvent.type, {
    detail: originalEvent,
    bubbles: true,
    composed: true  // Shadow DOM境界を超える
  });
  this.dispatchEvent(newEvent);
}
```

### データモデルとスキーマ

#### 内部状態管理
```typescript
interface AccordionState {
  items: Map<string, ItemState>;
  allowMultiple: boolean;
  animationType: AnimationType;
  keyboardNavEnabled: boolean;
  focusedIndex: number;
}

interface ItemState {
  id: string;
  expanded: boolean;
  disabled: boolean;
  height: number | 'auto';
  animating: boolean;
}
```

### アクセシビリティ最適化

#### 高コントラストモード対応
```typescript
class DadsAccordion extends WebComponent {
  #setupHighContrastMode() {
    // Windows高コントラストモードの検出
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    this.#applyHighContrastStyles(mediaQuery.matches);
    
    // 動的な変更を監視
    mediaQuery.addEventListener('change', (e) => {
      this.#applyHighContrastStyles(e.matches);
    });
  }
  
  #applyHighContrastStyles(isHighContrast: boolean) {
    if (isHighContrast) {
      // 高コントラストモード用のスタイル適用
      this.shadowRoot?.adoptedStyleSheets.push(highContrastStyles);
      // フォーカスリングを強化
      this.style.setProperty('--focus-ring-width', '4px');
      this.style.setProperty('--focus-ring-offset', '2px');
    }
  }
}

// 高コントラストモード用CSS
const highContrastStyles = css`
  :host {
    --border-width: 2px;
    --text-decoration-thickness: 2px;
  }
  
  .accordion-button {
    border: var(--border-width) solid ButtonText;
    color: ButtonText;
    background: ButtonFace;
  }
  
  .accordion-button:hover {
    border-color: Highlight;
    color: HighlightText;
    background: Highlight;
  }
`;
```

#### モーション設定の尊重
```typescript
class DadsAccordion extends WebComponent {
  #respectMotionPreference() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // respect-motion-preference属性がtrueの場合のみ適用
    if (this.hasAttribute('respect-motion-preference')) {
      this.#adjustAnimationSettings(prefersReducedMotion.matches);
      
      prefersReducedMotion.addEventListener('change', (e) => {
        this.#adjustAnimationSettings(e.matches);
      });
    }
  }
  
  #adjustAnimationSettings(reducedMotion: boolean) {
    if (reducedMotion) {
      // モーションを削減または無効化
      this.setAttribute('animation', 'none');
      console.info('モーション削減設定を検出: アニメーションを無効化');
    } else if (!this.hasAttribute('animation')) {
      // ユーザーが明示的に設定していない場合のみ
      this.setAttribute('animation', 'smooth');
    }
  }
}
```

#### カスタムアニメーションAPI
```typescript
interface AnimationFunction {
  (element: HTMLElement, expanded: boolean): Animation | void;
}

class DadsAccordion extends WebComponent {
  static #customAnimations = new Map<string, AnimationFunction>();
  
  // カスタムアニメーション登録
  static registerAnimation(name: string, animationFn: AnimationFunction) {
    this.#customAnimations.set(name, animationFn);
  }
  
  // 使用例
  static {
    // スプリングアニメーション
    this.registerAnimation('spring', (element, expanded) => {
      return element.animate(
        [
          { 
            height: expanded ? '0' : 'auto',
            opacity: expanded ? '0' : '1'
          },
          { 
            height: expanded ? 'auto' : '0',
            opacity: expanded ? '1' : '0'
          }
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
      );
    });
    
    // フェードアニメーション
    this.registerAnimation('fade', (element, expanded) => {
      return element.animate(
        [
          { opacity: expanded ? '0' : '1' },
          { opacity: expanded ? '1' : '0' }
        ],
        { duration: 200, easing: 'ease-in-out' }
      );
    });
  }
  
  #applyAnimation(element: HTMLElement, expanded: boolean) {
    const animationType = this.getAttribute('animation') || 'none';
    
    // アニメーションなし（アクセシビリティ優先）
    if (animationType === 'none') {
      element.style.display = expanded ? 'block' : 'none';
      return;
    }
    
    // カスタムアニメーション
    if (animationType === 'custom') {
      const customName = this.getAttribute('animation-name');
      const customFn = DadsAccordion.#customAnimations.get(customName!);
      if (customFn) {
        customFn(element, expanded);
        return;
      }
    }
    
    // 組み込みアニメーション
    this.#builtInAnimation(element, expanded, animationType);
  }
}
```

### エラーハンドリングとバリデーション

#### 属性値バリデーション
```typescript
class DadsAccordion extends WebComponent {
  #validateAttribute(name: string, value: unknown): boolean {
    const validators = {
      'animation': (v) => ['none', 'smooth', 'bounce'].includes(v as string),
      'allow-multiple': (v) => typeof v === 'boolean',
      'keyboard-nav': (v) => typeof v === 'boolean'
    };
    
    const validator = validators[name];
    if (!validator || !validator(value)) {
      console.warn(`無効な属性値: ${name}="${value}"`);
      return false;
    }
    return true;
  }
}
```

#### 初期化エラー処理
```typescript
connectedCallback() {
  try {
    super.connectedCallback();
    this.#initialize();
  } catch (error) {
    console.error('アコーディオン初期化エラー:', error);
    this.#fallbackToBasicMode();
  }
}

#fallbackToBasicMode() {
  // 基本的な機能のみを有効化（アニメーションなし）
  this.setAttribute('animation', 'none');
  this.setAttribute('keyboard-nav', 'false');
  console.info('基本モードで動作します');
}
```

#### スロット検証
```typescript
#validateSlots() {
  const headerSlot = this.shadowRoot?.querySelector('slot[name="header"]');
  const contentSlot = this.shadowRoot?.querySelector('slot[name="content"]');
  
  if (!headerSlot?.assignedNodes().length) {
    throw new Error('ヘッダースロットが空です');
  }
  
  if (!contentSlot?.assignedNodes().length) {
    console.warn('コンテンツスロットが空です');
  }
}
```

### コンポーネントインタラクション

#### 親子間の通信パターン
1. **イベントベース通信**: CustomEventによる疎結合
2. **コンテキスト共有**: 親コンポーネントが設定を子に伝播
3. **スロット管理**: Shadow DOMのslot機能を活用
4. **エラー境界**: 子コンポーネントのエラーを親で捕捉

#### ライフサイクル
```typescript
// 初期化フロー
connectedCallback() → attributeChangedCallback() → render() → setupEventListeners()

// 更新フロー
attributeChangedCallback() → updateState() → render() → dispatchEvent()

// 破棄フロー
disconnectedCallback() → cleanup() → removeEventListeners()
```

### セキュリティ考慮事項

#### XSS対策
- テンプレートリテラルによる自動エスケープ
- innerHTML使用の回避
- textContentまたはテンプレート要素の使用

#### CSP対応
- インラインスタイルの非使用
- Shadow DOM内でのスタイルシート管理
- nonceベースのセキュリティヘッダー対応

#### サンドボックス化
- Shadow DOMによるDOM隔離
- CSS変数によるスタイル制御の制限
- グローバル名前空間の汚染防止

### パフォーマンス最適化

#### レンダリング最適化
```typescript
// バッチ更新パターン
class BatchUpdater {
  #pending = new Set<() => void>();
  #scheduled = false;

  schedule(update: () => void) {
    this.#pending.add(update);
    if (!this.#scheduled) {
      this.#scheduled = true;
      requestAnimationFrame(() => {
        this.#pending.forEach(fn => fn());
        this.#pending.clear();
        this.#scheduled = false;
      });
    }
  }
}
```

#### メモリ管理
- WeakMapによる参照管理
- イベントリスナーの適切な削除
- Intersection Observerによる遅延初期化

#### アニメーション最適化
- CSS Transitionの優先使用
- will-changeプロパティの適切な適用
- GPU合成レイヤーの活用

## 代替案の検討

### 検討した代替アプローチ

#### 1. React/Vue コンポーネントとしての実装
**メリット**:
- 豊富なエコシステム
- 既存のコンポーネントライブラリとの統合が容易

**デメリット**:
- フレームワーク依存
- バンドルサイズの増加
- 技術的ロックイン

**却下理由**: フレームワーク非依存の要件を満たせない

#### 2. details/summary要素の拡張
**メリット**:
- ネイティブHTML要素の活用
- プログレッシブエンハンスメント

**デメリット**:
- スタイリングの制限
- ブラウザ間の挙動の差異
- カスタマイズ性の低さ

**却下理由**: デザインシステムの要件を完全に満たせない

#### 3. Lit/Stencilなどのライブラリ使用
**メリット**:
- 開発効率の向上
- テンプレート機能の充実

**デメリット**:
- 外部依存の追加
- 学習コスト
- バンドルサイズ

**却下理由**: ゼロ依存の方針に反する

## 実装計画

### フェーズ1: 基本構造（2日）
- [ ] WebComponentクラスの実装
- [ ] 基本的なHTML構造とShadow DOM設定
- [ ] TypeScript型定義

### フェーズ2: スタイリング（2日）
- [ ] デザイントークンの統合
- [ ] レスポンシブスタイル実装
- [ ] フォーカス/ホバー状態の視覚化

### フェーズ3: インタラクション（3日）
- [ ] クリック/タップによる開閉
- [ ] キーボードナビゲーション
- [ ] ARIA属性の動的更新

### フェーズ4: アニメーション（2日）
- [ ] 高さアニメーション実装
- [ ] アイコン回転アニメーション
- [ ] パフォーマンス最適化

### フェーズ5: アクセシビリティ（2日）
- [ ] WAI-ARIAパターン実装
- [ ] スクリーンリーダーテスト
- [ ] キーボード操作の改善

### フェーズ6: テスト（3日）
- [ ] ユニットテスト作成
- [ ] E2Eテスト実装
- [ ] アクセシビリティテスト

### フェーズ7: ドキュメンテーション（1日）
- [ ] APIドキュメント
- [ ] 使用例とデモ
- [ ] 移行ガイド

## テスト戦略

### テストカバレッジ目標
- **ステートメントカバレッジ**: 90%以上
- **ブランチカバレッジ**: 85%以上
- **関数カバレッジ**: 95%以上
- **行カバレッジ**: 90%以上

### カバレッジ測定方法
```bash
# Vitestでカバレッジ測定
npm run test:coverage

# 閾値設定（vitest.config.ts）
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 95,
        lines: 90
      }
    }
  }
});
```

### ユニットテスト
```typescript
describe('DadsAccordion', () => {
  test('単一展開モードで他のアイテムが自動的に閉じる', () => {
    // テスト実装
  });
  
  test('キーボードナビゲーションが正しく機能する', () => {
    // テスト実装
  });
  
  test('アクセシビリティファースト: デフォルトでアニメーションなし', () => {
    const accordion = document.createElement('dads-accordion');
    expect(accordion.getAttribute('animation')).toBe('none');
  });
});
```

### E2Eテスト（Playwright）
```typescript
test('アコーディオンの基本操作', async ({ page }) => {
  await page.goto('/demo');
  const accordion = page.locator('dads-accordion');
  const firstItem = accordion.locator('dads-accordion-item').first();
  
  await firstItem.click();
  await expect(firstItem).toHaveAttribute('expanded', 'true');
});
```

### アクセシビリティテスト
- axe-coreによる自動テスト
- NVDAでの手動テスト
- VoiceOverでの手動テスト

### パフォーマンステスト

#### Core Web Vitals計測
```typescript
class PerformanceMonitor {
  #cumulativeLayoutShift = 0;
  
  measureCLS() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          this.#cumulativeLayoutShift += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  }
  
  measureFID() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        this.report('FID', fid);
      }
    }).observe({ type: 'first-input', buffered: true });
  }
  
  measureRenderTime() {
    const startTime = performance.now();
    // レンダリング処理
    const endTime = performance.now();
    console.log(`レンダリング時間: ${endTime - startTime}ms`);
  }
}
```

#### パフォーマンス基準
- Lighthouse CI スコア: 90以上
- アニメーションFPS: 60fps維持
- 初期レンダリング: 100ms以内
- メモリリーク: なし

## 国際化（i18n）対応

### 基本設計
```typescript
interface I18nConfig {
  locale: string;
  messages: {
    expand: string;
    collapse: string;
    expandAll: string;
    collapseAll: string;
    loading: string;
    error: string;
    itemCount: (count: number) => string;
  };
  rtl?: boolean; // Right-to-Left言語サポート
}

class DadsAccordion extends WebComponent {
  static #i18n = new Map<string, I18nConfig>();
  
  // 言語設定の登録
  static registerLocale(locale: string, config: I18nConfig) {
    this.#i18n.set(locale, config);
  }
  
  // デフォルト言語設定
  static {
    this.registerLocale('ja', {
      locale: 'ja',
      messages: {
        expand: '展開',
        collapse: '折りたたむ',
        expandAll: 'すべて展開',
        collapseAll: 'すべて折りたたむ',
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        itemCount: (count) => `${count}個のアイテム`
      }
    });
    
    this.registerLocale('en', {
      locale: 'en',
      messages: {
        expand: 'Expand',
        collapse: 'Collapse',
        expandAll: 'Expand all',
        collapseAll: 'Collapse all',
        loading: 'Loading...',
        error: 'An error occurred',
        itemCount: (count) => `${count} item${count !== 1 ? 's' : ''}`
      }
    });
  }
  
  // 現在の言語設定を取得
  #getCurrentLocale(): string {
    return this.getAttribute('lang') || 
           document.documentElement.lang || 
           navigator.language.split('-')[0] || 
           'ja';
  }
  
  // メッセージ取得
  #getMessage(key: keyof I18nConfig['messages']): string | Function {
    const locale = this.#getCurrentLocale();
    const config = DadsAccordion.#i18n.get(locale) || 
                   DadsAccordion.#i18n.get('ja')!;
    return config.messages[key];
  }
}
```

### RTL（Right-to-Left）対応
```css
:host([dir="rtl"]) {
  direction: rtl;
}

:host([dir="rtl"]) .accordion-button {
  flex-direction: row-reverse;
  text-align: right;
}

:host([dir="rtl"]) .accordion-icon {
  transform: scaleX(-1);
  margin-right: 0;
  margin-left: var(--spacing-md);
}
```

## ロールアウト計画

### 段階的リリース

#### Phase 1: アルファリリース（内部テスト）
- 社内開発環境でのテスト
- フィードバック収集
- バグ修正

#### Phase 2: ベータリリース（限定公開）
- 選定プロジェクトでの試験導入
- パフォーマンス検証
- アクセシビリティ監査

#### Phase 3: 正式リリース
- npm パッケージ公開
- CDN配信
- ドキュメントサイト公開

### ロールバック手順
1. 問題検出時の即時通知システム
2. 以前のバージョンへの切り替え手順
3. データ移行スクリプトの準備

## 将来の拡張計画

### バージョン2.0での機能追加候補
- ネスト可能なアコーディオン
- 検索/フィルタリング機能
- ドラッグ&ドロップによる並び替え
- 遅延ローディング対応
- SSR/SSG完全サポート

### 長期的な改善項目
- Web Animaitons API活用
- Constructable Stylesheetsの最適化
- Custom State Pseudo Class の活用
- Declarative Shadow DOM対応

## 付録

### デザイントークン一覧
```css
/* 必須使用トークン */
--color-primitive-blue-1000: #00118f;      /* ボーダー、リンク */
--color-neutral-white: #ffffff;            /* ボタン背景 */
--color-neutral-solid-gray-800: #333333;   /* テキスト */
--color-neutral-solid-gray-420: #949494;   /* ボーダー */
--color-neutral-solid-gray-50: #f2f2f2;    /* ホバー背景 */
--color-primitive-yellow-300: #ffd43d;     /* フォーカス背景 */
--color-neutral-black: #000000;            /* フォーカス枠 */
--border-radius-full: 9999px;              /* ボタン */
--border-radius-8: 8px;                    /* デスクトップフォーカス */
--border-radius-4: 4px;                    /* モバイルフォーカス */
```

### 参考リンク
- [WAI-ARIA Authoring Practices - Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [デジタル庁デザインシステム](https://design.digital.go.jp/)

### 用語集
- **Shadow DOM**: Web Componentsの機能の一つで、DOMとスタイルのカプセル化を提供
- **Custom Elements**: 独自のHTML要素を定義するためのWeb標準API
- **Slot**: Shadow DOM内でライトDOMのコンテンツを挿入する場所を指定する要素
- **デザイントークン**: デザインシステムで統一的に使用される変数値

---

**文書バージョン**: 1.0.0  
**作成日**: 2025-08-28  
**作成者**: Claude Code  
**レビュアー**: (未定)  
**ステータス**: ドラフト