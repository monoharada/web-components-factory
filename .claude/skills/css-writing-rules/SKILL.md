---
name: css-writing-rules
description: CSS coding guidelines for Web Components with Shadow DOM. Use when (1) writing new CSS styles for components, (2) reviewing CSS code, (3) implementing design tokens, (4) creating responsive layouts, (5) managing CSS variables. Covers @layer structure, ::part() styling, variable patterns, accessibility (reduced motion, any-hover), and naming conventions.
---

# CSS Writing Rules

Web ComponentsプロジェクトにおけるCSS実装ガイドライン。monosusコーディングガイドラインとプロジェクト固有ルールを統合。

## Quick Reference

### Critical Rules（必須遵守）

1. **!important禁止** - `@layer`で詳細度を管理
2. **::part()必須** - Shadow DOM内でクラスではなくpart属性を使用
3. **Div Soup禁止** - 不要なwrapper div削除、最小限のDOM構造を維持
4. **変数マッピングは一度だけ** - プロパティ定義は1箇所、状態変化は変数再代入
5. **ネスト1階層** - `@layer`・疑似クラス・メディアクエリを除く
6. **状態はHTML属性** - `.is-open`ではなく`[open]`、`[aria-expanded="true"]`
7. **グローバルトークン必須** - `#000000`ではなく`var(--color-neutral-black)`

### Prohibited（絶対禁止）

```css
/* NG: !important */
color: red !important;

/* NG: カラーキーワード */
color: black;  /* → var(--color-neutral-black) */

/* NG: ハードコード色値 */
--dads-button-color: #000000;  /* → var(--color-neutral-black) */

/* NG: html font-size 62.5% */
html { font-size: 62.5%; }

/* NG: Shadow DOM内でクラス */
<div class="accordion-summary">  /* → part="summary" */

/* NG: 状態クラス */
.is-open { }  /* → [open] { } */
```

```html
<!-- NG: Div Soup（不要なwrapper div） -->
<div part="outer">
  <div part="wrapper">
    <div part="container">
      <slot></slot>
    </div>
  </div>
</div>

<!-- OK: フラット構造 -->
<blockquote part="blockquote">
  <slot name="lead" part="lead"></slot>
  <slot part="body"></slot>
</blockquote>
```

## Decision Tree

| ユースケース | 参照ドキュメント |
|-------------|-----------------|
| コンポーネントのCSS実装 | [web-components.md](references/web-components.md) |
| マークアップ・テンプレート設計 | [web-components.md](references/web-components.md)（Div Soup禁止セクション） |
| @layer構造の設定 | [layer-structure.md](references/layer-structure.md) |
| CSS変数の設計 | [css-variables.md](references/css-variables.md) |
| レスポンシブ対応 | [media-queries.md](references/media-queries.md) |
| セレクタの書き方 | [selectors-and-nesting.md](references/selectors-and-nesting.md) |
| クラス・変数の命名 | [naming-rules.md](references/naming-rules.md) |
| 基本原則の確認 | [core-principles.md](references/core-principles.md) |

## Core Workflow

### 新規コンポーネントCSS作成

1. **@layer配置を決定**（通常は`components`）
2. **CSS変数構造を設計**
   - セマンティックトークン → ローカルトークン → プロパティ
3. **ベーススタイル定義**
   - `[part="base"]`でプロパティ-変数マッピング
4. **状態バリエーション追加**
   - 変数再代入のみ（プロパティ再定義禁止）
5. **アクセシビリティ対応**
   - `prefers-reduced-motion`
   - `@media (any-hover: hover)`
6. **レスポンシブ対応**

### CSSレビュー時チェックリスト

- [ ] `!important`が使用されていない
- [ ] `@layer`が適切に使用されている
- [ ] ネストが1階層以内
- [ ] 状態管理がHTML属性で行われている
- [ ] 変数命名が`--category-unit/value`形式
- [ ] プロパティ定義が1箇所のみ
- [ ] アクセシビリティ対応（motion、hover）
- [ ] カラーキーワード未使用（HEX/RGB/HSL）

## Token Architecture

```
Primitive Tokens        Semantic Tokens         Local Tokens           Properties
--color-blue-900   →   --button-primary-bg  →  --dads-button-bg   →  background-color
```

### 正しいパターン

```css
/* ベース: プロパティ-変数マッピング（一度だけ） */
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
}

/* 状態: 変数再代入のみ */
:host([variant="solid"]:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
}
```

### トークン定義（TypeScript）

```typescript
// 文字列として定義
const tokenText = `
  :host {
    --button-primary-bg: var(--color-primitive-blue-900);
  }
`;

// 最後にcss関数で変換
export const tokens = css`${tokenText}`;
```

**重要**: CSSStyleSheetオブジェクトを文字列テンプレート内で展開しないこと

## Style Application Order

```typescript
styles: withReset([
  applyDADSTokens(),    // 1. グローバルトークン
  buttonTokens,          // 2. コンポーネントトークン
  buttonStyles,          // 3. スタイル定義
  applyDADSFocusStyles() // 4. フォーカススタイル
], 'minimal')
```

## Reference Files

詳細なルールは以下のリファレンスを参照：

| ファイル | 内容 |
|---------|------|
| [core-principles.md](references/core-principles.md) | 基本原則、禁止事項、ツール設定 |
| [layer-structure.md](references/layer-structure.md) | @layer 8層構造と役割 |
| [selectors-and-nesting.md](references/selectors-and-nesting.md) | セレクタパターン、ネスト制限、状態管理 |
| [media-queries.md](references/media-queries.md) | レスポンシブ、アクセシビリティ、単位 |
| [css-variables.md](references/css-variables.md) | 変数パターン、トークン設計、スコープ |
| [naming-rules.md](references/naming-rules.md) | クラス・変数の命名規則 |
| [web-components.md](references/web-components.md) | Div Soup禁止、::part()、Shadow DOM、リセットCSS |

## Relationship with Other Docs

このスキルは `/docs/css-variable-pattern.md` の内容を包含・拡張したものです。

| ドキュメント | 用途 |
|-------------|------|
| `/docs/css-variable-pattern.md` | 人間向けクイックリファレンス |
| このスキル | Claude Code向け包括的ガイドライン |

変更時は両方を更新してください。

## Sources

- [monosus CSS Coding Guidelines](https://coding-guidelines.pages.dev/05-coding-style/03-css/)
- [monosus Naming Rules](https://coding-guidelines.pages.dev/07-naming-rules/)
