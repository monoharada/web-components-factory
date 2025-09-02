# 🎓 Learnings

このファイルには、プロジェクト開発中に得られた学習内容を記録します。

---

## [2025-09-02] Claude Code開発フローの確立
**タグ**: #workflow #claudecode #productivity

### 概要
Zenn記事「私の好きなClaude Codeの使い方」を基に、プロジェクト固有の開発フローを確立。

### 詳細
- インクリメンタル開発の重要性を認識
- 小さく可逆的な変更の積み重ねが効率的
- 頻繁なコミットとレビューがコード品質を向上
- ナレッジ管理システムの構築で知識の蓄積が可能に

### 適用例
```bash
# 新機能開発の標準フロー
npm run claude:plan    # 計画
npm run tdd           # TDD開発
npm run claude:review # レビュー
npm run claude:verify # 検証
```

### 注意点
- 計画なしに実装を始めない
- テストを書いてから実装する
- 各ステップで検証を行う

---

## [2025-09-02] Web Componentsベストプラクティス
**タグ**: #webcomponents #architecture #css

### 概要
Web Components開発における重要な原則とパターンを確立。

### 詳細
1. **::part()の使用**: クラスではなく::part()でスタイリング
2. **ネイティブHTML優先**: details/summary, dialog等を活用
3. **Shadow DOM隔離**: スタイルの適切なカプセル化
4. **CSS変数パターン**: 重複定義を避け、変数の再代入で状態変化

### 適用例
```typescript
// 正しいpart属性の使用
template: html`
  <div part="base">
    <button part="trigger">
      <slot></slot>
    </button>
  </div>
`

// CSS変数パターン
styles: css`
  [part="base"] {
    background: var(--button-bg);
  }
  :host(:hover) {
    --button-bg: var(--button-bg-hover);
  }
`
```

### 注意点
- グローバルクラスの使用を避ける
- ネイティブ要素の機能を再実装しない
- CSS変数の重複定義に注意

---

## [2025-09-02] TypeScript厳格モードの価値
**タグ**: #typescript #quality #typesafety

### 概要
`strict: true`と`any`型の禁止による開発品質向上。

### 詳細
- 型安全性により実行時エラーを大幅に削減
- IDE支援が向上し、開発速度が向上
- リファクタリングが安全に実行可能
- ドキュメントとしての役割も果たす

### 適用例
```typescript
// BAD: any型の使用
function process(data: any) { /* ... */ }

// GOOD: 適切な型定義
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData) { /* ... */ }
```

### 注意点
- 初期段階から厳格モードを有効にする
- 型定義の作成に時間を投資する価値がある
- unknown型を適切に活用する

---

## [2025-09-02] TDDサイクルの効果
**タグ**: #testing #tdd #quality

### 概要
Test-Driven Development（TDD）による品質と設計の向上。

### 詳細
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコード
3. **Refactor**: コードを改善

このサイクルにより:
- 設計が明確になる
- 回帰テストが自動的に構築される
- リファクタリングが安全になる
- ドキュメントとしても機能する

### 適用例
```bash
# TDDワークフロー
npm run tdd  # watch modeでテスト駆動開発
```

### 注意点
- テストを書きすぎない（YAGNI原則）
- モックを適切に使用する
- E2Eテストとユニットテストのバランス

---

## テンプレート（新しい学習記録用）

## [日付] タイトル
**タグ**: #tag1 #tag2

### 概要
簡潔な説明

### 詳細
- ポイント1
- ポイント2
- ポイント3

### 適用例
```typescript
// コード例
```

### 注意点
- 注意点1
- 注意点2

---

*継続的に更新されます*