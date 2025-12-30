# Naming Rules

## Contents

- [General Principles](#general-principles)
- [CSS Class Names](#css-class-names)
- [CSS Variables](#css-variables)
- [HTML Naming](#html-naming)
- [File Naming](#file-naming)

## General Principles

### 正確なスペル

CSpellなどのツールで検証。スペルミスはコードの明確さを損なう。

### 省略禁止

省略しないことでコードの明確さが向上：

```css
/* NG: 省略 */
.btn { }
.nav-ctnr { }
.usr-info { }

/* OK: 完全形 */
.button { }
.navigation-container { }
.user-info { }
```

**例外**（一般的な英語略語のみ許可）：
- `attr`, `nav`, `res`, `arg`, `err`, `auth`, `opt`, `init`

### ローマ字禁止

日本語の発音をローマ字にしない：

```css
/* NG: ローマ字 */
.oshirase { }
.shouhin-card { }

/* OK: 英語 */
.notice { }
.product-card { }
```

### 意味のある名前

数字の連番、ハッシュ値、文脈のない略語は禁止：

```css
/* NG: 無意味 */
.item1 { }
.a7x3f { }
.tmp { }

/* OK: 意味が明確 */
.featured-item { }
.product-card { }
.temporary-notice { }
```

## CSS Class Names

### Format: kebab-case

```css
.image-card { }
.warning-box { }
.search-form { }
.primary-button { }
```

### Naming Pattern: 役割/特徴 + UI名

```css
/* OK: 役割ベース */
.primary-button { }
.error-message { }
.featured-product { }
.navigation-header { }

/* NG: 見た目ベース */
.border-orange { }
.text-pink-500 { }
.margin-large { }
```

### Avoid

1. **サイズ指示子**
   ```css
   /* NG */
   .card-xs { }
   .large-text { }
   ```

2. **ラッパー/コンテナ接尾辞**
   ```css
   /* NG */
   .card-wrapper { }
   .content-container { }
   .button-inner { }
   ```

3. **マルチクラスパターン**
   ```css
   /* NG: Tailwind-like */
   <div class="flex items-center p-4">

   /* OK: 単一クラス + data属性でバリアント */
   <div class="card" data-card-variant="featured">
   ```

## CSS Variables

### Global Pattern

```
--category-unit/value
```

Examples:
```css
--color-white: #ffffff;
--space-xxs: 0.25rem;
--rounded-xs: 0.125rem;
--system-border-base: 1px solid #ccc;
```

### Scoped Pattern (Component)

```
--component-property
```

Examples:
```css
--button-primary-bg: #0017c1;
--card-border-radius: 0.5rem;
--modal-backdrop-opacity: 0.5;
```

### Local Token Pattern (Customization)

```
--prefix-component-property
```

Examples:
```css
--dads-button-background: var(--button-primary-bg);
--dads-card-padding: var(--space-md);
```

### Never Reference Primitives Directly

```css
/* NG: プリミティブを直接参照 */
.button {
  background: var(--color-primitive-blue-900);
}

/* OK: セマンティック経由 */
:host {
  --button-primary-bg: var(--color-primitive-blue-900);
}
.button {
  background: var(--button-primary-bg);
}
```

## HTML Naming

### id Attributes

kebab-case または PascalCase（プロジェクト内で統一）：

```html
<header id="site-header">
<nav id="table-of-contents">
```

### data Attributes

kebab-case：

```html
<!-- 構造化データ用 -->
<main data-scheme="article">

<!-- JS選択用 -->
<details data-accordion="faq">

<!-- バリアント用 -->
<article data-card-variant="featured">

<!-- 状態表示用（スタイルガイド） -->
<a data-state="hover">
```

## File Naming

### CSS Files

kebab-case：
- `button.css`
- `card-group.css`
- `navigation-header.css`

### Directory Structure

```
src/assets/css/
├── common/
│   ├── reset.css
│   ├── tokens.css
│   └── components.css
├── _import/
│   ├── button.css
│   └── card.css
└── about/
    └── about.css
```
