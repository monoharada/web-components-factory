# Web Components CSS Rules

## Contents

- [Critical: No Div Soup (Markup Rules)](#critical-no-div-soup-markup-rules)
- [Critical: Use ::part() Instead of Classes](#critical-use-part-instead-of-classes)
- [Style Application Order](#style-application-order)
- [:host() Selector](#host-selector)
- [Token Resolution in Shadow DOM](#token-resolution-in-shadow-dom)
- [Reset CSS Integration](#reset-css-integration)
- [Native HTML Elements Priority](#native-html-elements-priority)
- [State Management](#state-management)
- [Slot Styling](#slot-styling)

## Critical: No Div Soup (Markup Rules)

**Div Soup禁止**: 不要なラッパー要素を作成しない。最小限のDOM構造を維持する。

### 原則

1. **フラット構造優先**: ネストは必要最小限に抑える
2. **セマンティック要素活用**: `<div>`より意味のある要素を使用
3. **display: contents活用**: レイアウト目的のwrapper divは`display: contents`で透明化
4. **直接スロット配置**: 可能な限り`<slot>`要素に直接`part`属性を付与

### NG: Div Soup

```html
<!-- 避ける: 無意味に深いネスト -->
<div part="outer">
  <div part="wrapper">
    <div part="container">
      <div part="content">
        <slot></slot>
      </div>
    </div>
  </div>
</div>
```

### OK: フラット構造

```html
<!-- 推奨: 最小限のネスト -->
<blockquote part="blockquote">
  <slot name="lead" part="lead"></slot>
  <slot part="body"></slot>
  <slot name="close" part="close"></slot>
</blockquote>
```

### Wrapper Divが許容されるケース

1. **複数スロットのグループ化が必要な場合**
2. **CSSでは実現できないレイアウト要件がある場合**
3. **アクセシビリティ目的（role属性が必要など）**

### Slot要素への直接属性付与

`<slot>`要素に`part`と`hidden`属性を直接付与可能：

```html
<!-- slot要素に直接属性を付与 -->
<slot name="lead" id="lead-slot" part="lead"></slot>
```

```css
/* 空のスロットを非表示 */
[part="lead"][hidden],
[part="body"][hidden],
[part="close"][hidden] {
  display: none;
}
```

### スロット要素のデフォルト動作

slot要素はデフォルトで `display: contents` 相当の振る舞いをする。これにより：

- **スロット要素自体はレイアウトボックスを生成しない**
- **親グリッドのgapが全要素間に適用される**

#### 自動スロット割り当て（デフォルト）の場合

追加のdisplay指定は通常不要：

```css
/* 親コンテナにgrid + gapを設定するだけで十分 */
[part="blockquote"] {
  display: grid;
  gap: var(--dads-blockquote-gap);
}
```

#### Manual Slot Assignment（slotAssignment: 'manual'）の場合

**重要**: 明示的に `display: contents` を指定すること：

```css
/* スロット要素を明示的に透明化 */
[part="lead"],
[part="body"],
[part="close"] {
  display: contents;
}

/* 空スロットは非表示（display: none が contents を上書き） */
[part="lead"][hidden],
[part="body"][hidden],
[part="close"][hidden] {
  display: none;
}
```

理由：`slotAssignment: 'manual'` 使用時はブラウザのデフォルト動作が一貫しない可能性があるため、明示的に指定してクロスブラウザ対応を確保する。

**注意**: `display: block` を明示指定すると、スロット要素がブロックボックスになり、親グリッドのgapがスロット内の要素間に適用されなくなる。

### チェックリスト

- [ ] 不要なwrapper divを削除したか
- [ ] 各要素に明確な目的があるか
- [ ] display: contentsで透明化できないか検討したか
- [ ] slot要素に直接part属性を付与できないか検討したか
- [ ] ネスト深度は最小限か（目安: 3層以内）

## Critical: Use ::part() Instead of Classes

Shadow DOM内のスタイリングにはクラスではなく`part`属性を使用。

### OK: part属性

```html
<!-- Shadow DOM内 -->
<summary part="summary">
  <span part="icon">
    <svg part="icon-svg">...</svg>
  </span>
  <span part="header-text">
    <slot name="header"></slot>
  </span>
</summary>
<div part="content">
  <slot name="content"></slot>
</div>
```

```css
/* 外部からのスタイリング */
my-accordion::part(summary) { padding: 1rem; }
my-accordion::part(icon) { color: var(--icon-color); }
my-accordion::part(content) { padding: 1rem; }
```

### NG: クラスベース

```html
<!-- 避ける -->
<div class="accordion-summary">
  <span class="accordion-icon">...</span>
</div>
```

### Why ::part()

1. **カプセル化維持**: Shadow DOM境界を保ちながら特定部分を公開
2. **明示的API**: カスタマイズ可能な箇所を作者が定義
3. **セマンティック**: part属性で要素の役割を表現
4. **スコープ明確化**: グローバルクラス名の衝突回避
5. **テーマ対応**: 親要素のクラスで子コンポーネントを一括変更可能

## Style Application Order

```typescript
styles: withReset([
  applyDADSTokens(),    // 1. グローバルトークン
  buttonTokens,          // 2. コンポーネントトークン
  buttonStyles,          // 3. スタイル定義
  applyDADSFocusStyles() // 4. フォーカススタイル
], 'minimal')
```

順序は重要：後のスタイルが前のスタイルを上書き。

## :host() Selector

ホスト要素（カスタム要素自体）の状態でスタイルを変更：

```css
/* バリアント */
:host([variant="solid"]) {
  --dads-button-background: var(--button-primary-bg);
}

:host([variant="outlined"]) {
  --dads-button-background: transparent;
}

/* 状態 */
:host([disabled]) {
  opacity: 0.5;
  pointer-events: none;
}

/* 疑似クラス */
:host(:hover) { }
:host(:focus-within) { }
```

### 組み合わせパターン

```css
/* バリアント + 状態 */
:host([variant="solid"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-primary-bg-hover);
}

/* 複数属性 */
:host([variant="solid"][size="large"]) {
  --dads-button-padding: var(--space-lg);
}
```

## Token Resolution in Shadow DOM

Shadow DOM内でCSS変数が正しく解決されるための構造：

### 1. グローバルトークン（applyDADSTokens）

プリミティブ値を提供：

```css
:host {
  --color-primitive-blue-900: #0017c1;
  --space-md: 1rem;
}
```

### 2. コンポーネントトークン（buttonTokens）

セマンティック値とローカル値を定義：

```css
:host {
  /* Semantic */
  --button-primary-bg: var(--color-primitive-blue-900);

  /* Local */
  --dads-button-background: var(--button-primary-bg);
}

:host([variant="solid"]) {
  --dads-button-background: var(--button-primary-bg);
}
```

### 3. コンポーネントスタイル（buttonStyles）

プロパティ-変数マッピング：

```css
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
}
```

## Reset CSS Integration

### withReset() Helper

```typescript
import { withReset } from './reset-css';

class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`...`,
    styles: withReset(css`
      :host { display: block; }
    `, 'full')
  };
}
```

### Reset Levels

- `'full'` - kiso.css完全版
- `'minimal'` - 最小限のリセット

### Architecture Decision

- **Shadow DOMのみ**: Light DOMには適用しない
- **opt-in方式**: 必要なコンポーネントのみ適用
- **パフォーマンス**: CSSStyleSheetキャッシング活用

## Native HTML Elements Priority

可能な限りネイティブHTML要素を活用：

| Use Case | Native Element |
|----------|----------------|
| アコーディオン | `<details>/<summary>` |
| モーダル | `<dialog>` |
| 日付選択 | `<input type="date">` |
| チェックボックス | `<input type="checkbox">` |

理由：
- ネイティブアクセシビリティ
- ブラウザ標準キーボード操作
- スクリーンリーダー対応
- プログレッシブエンハンスメント

## State Management

### Native States

```css
/* details/summary */
:host([open]) [part="content"] { display: block; }

/* form elements */
[part="base"]:disabled { opacity: 0.5; }
[part="base"]:checked { }
[part="base"]:invalid { }
```

### ARIA States

```css
[part="trigger"][aria-expanded="true"] { }
[part="option"][aria-selected="true"] { }
[part="tab"][aria-current="page"] { }
```

### Custom States（data属性）

```css
/* スタイルガイド用 */
[part="base"][data-state="hover"] { }
[part="base"][data-state="focus"] { }
```

## Slot Styling

スロットコンテンツのスタイリング：

```css
/* スロット要素自体 */
slot[name="header"] {
  display: block;
  font-weight: bold;
}

/* スロットに割り当てられた要素 */
::slotted(h2) {
  margin: 0;
}

::slotted(*) {
  /* すべてのスロットコンテンツ */
}
```

**注意**: `::slotted()`は直接の子要素のみ選択可能
