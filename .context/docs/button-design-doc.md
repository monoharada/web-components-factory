# ボタンコンポーネント設計書（Design Doc）

## 1. 背景と目的

### 1.1 背景
デジタル庁デザインシステムv2.7.0に準拠したWeb Componentsライブラリの中核となるボタンコンポーネントが必要。

### 1.2 目的
- 再利用可能で一貫性のあるボタンコンポーネントの提供
- アクセシビリティとパフォーマンスの両立
- Shadow DOMによるスタイルのカプセル化
- ::part()によるカスタマイズ性の確保

## 2. アーキテクチャ設計

### 2.1 コンポーネント構造
```
DadsButton (WebComponent)
├── Shadow DOM
│   ├── <button part="base">
│   │   ├── <span part="icon-start">
│   │   │   └── <slot name="icon-start"></slot>
│   │   ├── <span part="label">
│   │   │   └── <slot></slot>
│   │   └── <span part="icon-end">
│   │       └── <slot name="icon-end"></slot>
└── Light DOM
    └── ユーザーコンテンツ
```

### 2.2 トークンアーキテクチャ
```
Global Tokens (DADS)
    ↓
Semantic Tokens (意味的な役割)
    ↓
Local Component Tokens (コンポーネント固有)
    ↓
Instance CSS Variables (インスタンス上書き)
```

### 2.3 スタイル戦略
1. **リセットCSS**: kiso.css minimal版を適用
2. **デザイントークン**: 3層構造で管理
3. **カスタマイズ**: CSS変数で外部から上書き可能
4. **::part()**: 主要要素を公開してスタイリング可能に

## 3. 実装設計

### 3.1 ファイル構成
```
packages/components/button/
├── button.ts              # メインコンポーネント
├── button-styles.ts       # スタイル定義
├── button-define.ts       # 登録関数
├── button.test.ts         # テスト（TDD）
├── button.stories.ts      # Storybook
└── index.ts              # エクスポート

packages/styles/design-tokens/
└── button-tokens.ts      # トークン定義
```

### 3.2 クラス設計
```typescript
export class DadsButton extends WebComponent {
  // プライベートフィールド
  #internals: ElementInternals;
  #handleClick: (event: MouseEvent) => void;
  
  // 静的定義
  static override definition = {
    name: 'dads-button',
    template: html`...`,
    styles: [...],
    attributes: [...]
  };
  
  // ライフサイクル
  connectedCallback(): void
  disconnectedCallback(): void
  attributeChangedCallback(name, oldValue, newValue): void
  
  // メソッド
  focus(): void
  blur(): void
  click(): void
}
```

### 3.3 状態管理
- **variant**: 属性で管理、CSSの:host([variant])で適用
- **size**: 属性で管理、CSSの:host([size])で適用
- **disabled**: 属性で管理、内部buttonのdisabled属性に反映
- **pressed**: ARIA属性として管理（トグルボタン用）

## 4. テスト戦略（TDD）

### 4.1 テストファースト開発フロー
1. **RED**: 失敗するテストを書く
2. **GREEN**: テストを通す最小限の実装
3. **REFACTOR**: コードを改善

### 4.2 テストカテゴリ
1. **基本レンダリング**
   - コンポーネントの存在確認
   - Shadow DOM構造の確認
   - デフォルト属性の確認

2. **バリアント**
   - solid/outlined/text各バリアントの適用
   - スタイルの切り替え確認

3. **サイズ**
   - 各サイズの適用確認
   - 高さ・パディング・フォントサイズの確認

4. **インタラクション**
   - クリックイベントの発火
   - disabled時のイベント抑制
   - キーボード操作（Enter/Space）

5. **アクセシビリティ**
   - ARIA属性の適用
   - フォーカス管理
   - タブナビゲーション

### 4.3 テスト環境
- **ランナー**: Vitest
- **DOM環境**: happy-dom
- **アサーション**: @testing-library/jest-dom
- **カバレッジ目標**: 90%以上

## 5. パフォーマンス最適化

### 5.1 レンダリング最適化
- テンプレートのキャッシング
- CSSStyleSheetの再利用
- 不要な再レンダリングの防止

### 5.2 バンドルサイズ最適化
- Tree-shakingサポート
- 未使用スタイルの削除
- コード分割対応

### 5.3 実行時パフォーマンス
- イベントリスナーの適切な管理
- メモリリークの防止
- アニメーションのGPU最適化

## 6. セキュリティ考慮事項
- XSS対策: Shadow DOMによる隔離
- CSP対応: インラインスタイルを使用しない
- イベントの適切なサニタイズ

## 7. 移行戦略
既存のHTMLボタンからの移行パス：
```html
<!-- 既存 -->
<button class="btn btn-primary">Click</button>

<!-- 移行後 -->
<dads-button variant="solid">Click</dads-button>
```

## 8. 今後の拡張性
- アイコンボタン対応
- ボタングループ対応
- ローディング状態の追加
- ツールチップ統合

## 9. リスクと対策
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Shadow DOMブラウザ非対応 | 低 | Polyfill提供 |
| パフォーマンス劣化 | 中 | プロファイリングと最適化 |
| アクセシビリティ不足 | 高 | 自動テストと手動検証 |

## 10. 承認と決定事項
- [ ] TDD方式での実装承認
- [ ] デザイントークン3層構造承認
- [ ] Shadow DOM + ::part()戦略承認
- [ ] Figmaデザイン準拠承認