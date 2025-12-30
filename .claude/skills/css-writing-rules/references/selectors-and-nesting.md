# Selectors and Nesting

## Nesting Rules

### 最大1階層

`@layer`、疑似クラス、メディアクエリを除き、ネストは1階層まで。

```css
/* OK: フラットなネスト */
.card {
  padding: var(--space-md);

  &:hover { /* 疑似クラスはOK */ }

  @media (width >= 768px) { /* メディアクエリはOK */ }

  > article { /* 直接子孫は1階層 */ }
}
```

```css
/* NG: 深いネスト */
.card {
  > article {
    header {
      span { /* 深すぎる */ }
    }
  }
}
```

### 代替: コンビネータ使用

```css
/* OK: フラットに記述 */
.card-group > article header { }
.card-group > article header span { }
```

### メディアクエリの位置

セレクタ内にネスト（外に出さない）：

```css
/* OK */
.card {
  @media (width >= 768px) {
    --card-columns: 3;
  }

  display: grid;
  grid-template-columns: repeat(var(--card-columns, 1), 1fr);
}

/* NG: 外に出す */
@media (width >= 768px) {
  .card { --card-columns: 3; }
}
```

## Selector Patterns

### スコープベース（BEM脱却）

コンポーネントルートにクラス、子要素は直接子孫セレクタ：

```css
/* OK: スコープベース */
.card-group {
  > article { }
  > article > header { }
  > article > h3 { }
}

/* NG: BEMスタイル */
.card { }
.card__header { }
.card__title { }
.card-header__icon { }
```

### :where()のスコープ制限

`:where()`は直接子孫に限定：

```css
/* NG: 広すぎる */
.component {
  :where(div) { /* すべてのdivに適用 */ }
}

/* OK: スコープ制限 */
.component {
  :where(> div) { /* 直接子孫のみ */ }
}
```

## State Management

### HTML属性を使用

`.is-open`、`.active`などの状態クラスは禁止。

```css
/* OK: ネイティブ属性 */
details[open] { }
dialog:modal { }
input:checked { }
button:disabled { }

/* OK: ARIA属性 */
[aria-expanded="true"] { }
[aria-hidden="true"] { }
[aria-selected="true"] { }

/* OK: data属性（スタイルガイド用） */
[data-state="hover"] { }

/* NG: 状態クラス */
.is-open { }
.is-active { }
.is-disabled { }
```

### 状態の組み合わせ

```css
/* アコーディオン */
details[open] > summary::marker { }

/* ボタンの展開状態 */
.accordion > button[aria-expanded="true"] + div { }

/* フォーム要素 */
input:checked + label { }
input:invalid:not(:placeholder-shown) { }
```

### CSS変数での状態管理

スクロール位置などの動的状態：

```css
header {
  --header-state: relative;
  position: var(--header-state);
}
```

```javascript
// JavaScript
document.addEventListener('scroll', () => {
  const state = window.scrollY > 0 ? 'fixed' : 'relative';
  header.style.setProperty('--header-state', state);
});
```

## Shadow DOM Considerations

Shadow DOM内では`:host()`でホスト要素の状態を参照：

```css
/* ホストの属性で内部スタイルを変更 */
:host([variant="solid"]) [part="base"] { }
:host([disabled]) [part="base"] { }
:host(:hover) [part="base"] { }

/* ネイティブ状態との組み合わせ */
:host([variant="solid"]:not([disabled])) [part="base"]:hover { }
```
