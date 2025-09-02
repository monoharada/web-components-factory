# CSS変数設計パターンガイド

## 🎯 基本方針

Web Componentsにおける CSS変数の管理は、以下の原則に従います：

1. **プロパティと変数のマッピングは一度だけ定義**
2. **状態変化は変数の再代入で実現**
3. **重複定義の徹底排除**

## 📐 推奨パターン

### ✅ 正しい実装

```css
/* ベース要素で全プロパティを変数マッピング */
[part="base"] {
  /* 一度だけ定義 */
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
  border-color: var(--dads-button-border-color);
}

/* 状態変化は変数の再代入のみ */
:host([variant="solid"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-primary-bg-hover);
  /* プロパティの再定義はしない */
}
```

### ❌ 避けるべき実装

```css
/* 悪い例: プロパティを何度も定義 */
:host([variant="solid"]) [part="base"] {
  background-color: var(--dads-button-background, #0017c1);
}

:host([variant="solid"]) [part="base"]:hover {
  background-color: var(--dads-button-background-hover, #00118f); /* 重複 */
}
```

## 🏗️ 実装構造

### 1. トークン定義層（design-tokens/）

```typescript
// セマンティックトークンとローカルトークンは文字列として定義
const buttonSemanticTokensText = `
  :host {
    --button-primary-bg: var(--color-primitive-blue-900);
    --button-primary-bg-hover: var(--color-primitive-blue-1000);
  }
`;

// 最終的にcssテンプレートリテラルで変換
export const buttonTokens = css`
  ${buttonSemanticTokensText}
  ${buttonLocalTokensText}
`;
```

**重要**: CSSStyleSheetオブジェクトを文字列テンプレート内で展開しないこと。変数が失われます。

### 2. コンポーネントスタイル層

```css
/* ========== 共通プロパティ定義 ========== */
[part="base"] {
  /* すべてのバリアントで共通 */
  display: inline-flex;
  align-items: center;
  
  /* プロパティ → 変数マッピング（一度だけ） */
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
  border: var(--dads-button-border-width) solid var(--dads-button-border-color);
}

/* ========== バリアント別の変数再代入 ========== */

/* Solidバリアント */
:host([variant="solid"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-primary-bg-hover);
}

/* Outlinedバリアント */
:host([variant="outlined"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-secondary-bg-hover);
  --dads-button-color: var(--button-secondary-text-hover);
  --dads-button-border-color: var(--button-secondary-border-hover);
}
```

### 3. トークンスコープ

```css
/* バリアント初期値はbutton-tokens.tsで定義 */
:host([variant="solid"]) {
  --dads-button-background: var(--button-primary-bg);
  --dads-button-color: var(--button-primary-text);
}

:host([variant="outlined"]) {
  --dads-button-background: var(--button-secondary-bg);
  --dads-button-color: var(--button-secondary-text);
}
```

## 🔍 Shadow DOM内での変数解決

Shadow DOM内でCSS変数が正しく解決されるために：

1. **applyDADSTokens()** - グローバルトークンを提供
2. **componentTokens** - コンポーネント固有トークン
3. **componentStyles** - 実際のスタイル定義

```typescript
styles: withReset([
  applyDADSTokens(),    // 1. グローバルトークン
  buttonTokens,          // 2. コンポーネントトークン
  buttonStyles,          // 3. スタイル定義
  applyDADSFocusStyles() // 4. フォーカススタイル
], 'minimal')
```

## 💡 利点

1. **保守性**: 変更箇所が明確で追跡しやすい
2. **パフォーマンス**: CSSパーサーの処理が効率的
3. **可読性**: カスケーディングルールが明確
4. **再利用性**: 変数の組み合わせで新しい状態を簡単に作成
5. **デバッグ**: DevToolsで変数の継承と上書きが追跡可能

## ⚠️ 注意事項

### CSS変数が未定義にならないために

1. **文字列結合に注意**
   ```typescript
   // ❌ 悪い: CSSStyleSheetを文字列内で展開
   export const styles = css`
     ${someStyleSheet}
   `;
   
   // ✅ 良い: 文字列を結合してからcss関数に渡す
   const stylesText = `...`;
   export const styles = css`${stylesText}`;
   ```

2. **スコープチェーン**
   - `:host` → `[part="base"]` → 疑似クラスの順で継承
   - 各レベルで変数を再定義可能

3. **フォールバック値**
   - 開発中はフォールバック値を設定
   - 本番環境では削除（トークンシステムを信頼）

## 📚 参考実装

- `/packages/components/button/button-styles.ts` - 完全に合理化された実装
- `/packages/components/accordion/accordion.ts` - 正しいトークン結合の例

## 🔄 今後の方針

このパターンをすべてのコンポーネントで採用し、一貫性のある実装を維持します。

---

*このドキュメントは Claude Code が参照し、一貫した実装を維持するためのガイドラインです。*