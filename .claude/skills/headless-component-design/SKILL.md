---
name: headless-component-design
description: ヘッドレスWebComponentライブラリの設計パターン。Use when (1) designing new components, (2) implementing CSS token architecture, (3) creating override APIs, (4) implementing focus styles, (5) reviewing component design. DADS準拠 + オーバーライド可能なAPI設計。Radix UI/shadcn UI思想の適用。
---

# Headless Component Design

DADS準拠のヘッドレスWebComponentライブラリ設計ガイドライン。

## Quick Reference

### Core Principles

1. **DADS First**: デジタル庁公式をベースライン
2. **Override Points**: CSS変数（`--dads-*`）とpart属性で拡張可能
3. **Accessible by Default**: WCAG 2.2 AA準拠
4. **Token-Based**: 3層トークン構造

### 3層トークン構造

```
Primitive Tokens (DADS公式)
    ↓
Semantic Tokens (意味層)
    ↓
Local Tokens (--dads-* コンポーネントAPI)
    ↓
CSS Properties
```

### 角丸（DADS公式準拠）

| スタイル | 値 | 用途 |
|---------|-----|------|
| 角丸スモール | **8px (0.5rem)** | Button, Textarea, Input |
| 角丸ミディアム | 12-16px | Card, Modal |
| 角丸フル | 50% / 9999px | Avatar, Badge |

**重要**: フォーム要素は **0.5rem (8px)** を使用。0.25rem (4px) は間違い。

### フォーカススタイル（DADS公式準拠）

```css
/* 公式仕様 - border-radiusは変更しない */
outline: .25rem solid var(--dads-focus-outline-color);
outline-offset: .125rem;
box-shadow: 0 0 0 .125rem var(--dads-focus-ring-color);
```

## Decision Tree

| ユースケース | 参照ドキュメント |
|-------------|-----------------|
| 設計思想の理解 | [design-philosophy.md](references/design-philosophy.md) |
| トークンAPI設計 | [token-api-pattern.md](references/token-api-pattern.md) |
| 角丸・border-radius | [corner-shapes.md](references/corner-shapes.md) |
| フォーカススタイル | [focus-styles.md](references/focus-styles.md) |
| アクセシビリティ | [accessibility.md](references/accessibility.md) |
| オーバーライド例 | [override-examples.md](references/override-examples.md) |

## Core Workflow

### 新規コンポーネント設計

1. **トークン設計**
   - プリミティブ → セマンティック → ローカルの階層を定義
   - `--dads-{component}-{property}` 形式でAPI定義

2. **フォーカススタイル適用**
   - `applyDADSFocusStyles()` ミックスインを使用
   - border-radiusはフォーカス時に変更しない（公式準拠）

3. **オーバーライドポイント設計**
   - CSS変数で外部カスタマイズ可能に
   - `::part()` で要素レベルのスタイリング可能に

4. **アクセシビリティ確保**
   - WCAG 2.2 AA準拠
   - キーボード操作対応
   - スクリーンリーダー対応

### コンポーネントレビュー時チェックリスト

- [ ] 3層トークン構造に従っているか
- [ ] `--dads-*` プレフィックスでAPI定義されているか
- [ ] 角丸が公式準拠か（フォーム要素は8px/0.5rem）
- [ ] フォーカススタイルが公式準拠か（border-radius変更なし）
- [ ] オーバーライドポイントが明確か
- [ ] アクセシビリティ要件を満たしているか

## Token API Pattern

### 正しいパターン

```css
:host {
  /* セマンティック層 */
  --button-primary-bg: var(--color-primitive-blue-900);

  /* ローカル層（API） */
  --dads-button-background: var(--button-primary-bg);
}

/* プロパティ定義（一度だけ） */
[part="base"] {
  background-color: var(--dads-button-background);
}

/* 状態変化は変数再代入のみ */
:host(:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
}
```

### フォーカストークン

```css
:host {
  /* セマンティック層 */
  --focus-outline-color: var(--color-neutral-black);
  --focus-ring-color: var(--color-primitive-yellow-300);

  /* ローカル層（API） */
  --dads-focus-outline-color: var(--focus-outline-color);
  --dads-focus-ring-color: var(--focus-ring-color);
}
```

## Override Examples

### CSS変数でカスタマイズ

```html
<style>
  dads-button {
    --dads-button-background: var(--my-brand-color);
    --dads-focus-ring-color: var(--my-focus-color);
  }
</style>
```

### ::part()でスタイリング

```html
<style>
  dads-textarea::part(textarea) {
    font-family: monospace;
  }
</style>
```

## Sources

- [デジタル庁デザインシステム](https://design.digital.go.jp/)
- [GitHub: digital-go-jp/design-system-example-components](https://github.com/digital-go-jp/design-system-example-components)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Related Docs

| ドキュメント | 用途 |
|-------------|------|
| `/docs/architecture/design-philosophy.md` | 設計思想の詳細 |
| `/docs/css-variable-pattern.md` | CSS変数パターン |
| `.claude/skills/css-writing-rules/` | CSS実装ガイドライン |
