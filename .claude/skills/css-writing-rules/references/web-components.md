# Web Components CSS Rules

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
