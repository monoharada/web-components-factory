# Media Queries and Accessibility

## Responsive Design Approaches

### 1. トークン層（推奨）

`:root`でデバイス別の値を定義：

```css
@layer tokens {
  :root {
    --text-size-lg: 1.25rem;

    @media (width < 900px) {
      --text-size-lg: 1.125rem;
    }
  }
}

/* コンポーネントでは変数を参照するだけ */
.heading { font-size: var(--text-size-lg); }
```

### 2. ルートトグル変数

表示/非表示の切り替え：

```css
:root {
  --sp-hide: none;
  --pc-hide: ;

  @media (width < 900px) {
    --sp-hide: ;
    --pc-hide: none;
  }
}

/* 使用 */
.sp-only { display: var(--sp-hide, block); }
.pc-only { display: var(--pc-hide, block); }
```

### 3. コンポーネント層（レガシー互換）

最小限に抑える：

```css
.card {
  --card-columns: 1;

  @media (width >= 900px) {
    --card-columns: 3;
  }

  grid-template-columns: repeat(var(--card-columns), 1fr);
}
```

## Media Query Patterns

### プロパティ追加優先

プロパティを削除するのではなく追加：

```css
/* NG: プロパティ削除 */
.component {
  border: 2px solid blue;
}
@media (width < 900px) {
  .component {
    border: none;  /* 削除 */
  }
}

/* OK: プロパティ追加 */
.component {
  padding: 10px;

  @media (width >= 900px) {
    border: 2px solid blue;  /* 追加 */
  }
}
```

### セレクタ内にネスト

```css
/* OK */
.card {
  @media (width >= 768px) {
    --card-gap: 2rem;
  }
}

/* NG: 外に出す */
@media (width >= 768px) {
  .card { --card-gap: 2rem; }
}
```

## Accessibility Requirements

### Reduced Motion（必須）

前庭障害を持つユーザーへの配慮：

```css
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Note**: この`!important`は唯一許可される例外。

### Hover Capability（必須）

ポインターデバイスでのみホバーを適用：

```css
/* OK: any-hoverでチェック */
@media (any-hover: hover) {
  .button:hover,
  .button[data-state="hover"] {
    background: var(--button-bg-hover);
  }
}

/* NG: 常にホバースタイルを適用 */
.button:hover {
  background: var(--button-bg-hover);
}
```

`[data-state="hover"]`はスタイルガイドでの状態表示用。

## Unit Guidelines

| 用途 | 単位 | 理由 |
|------|------|------|
| フォントサイズ | `rem`, `em` | ユーザースケーリング |
| 垂直方向の余白 | `rem` | 比例スケーリング |
| 装飾的ボーダー | `px` | 固定の視覚効果 |
| ボタン幅 | `rem`, `em` | テキストに比例 |
| 水平方向の余白 | `px`, `%`, `dvw` | コンテキスト依存 |

### Critical: font-size単位

```css
/* OK */
.text { font-size: 1.25rem; }
.small { font-size: 0.875em; }

/* NG: px固定 */
.text { font-size: 20px; }
```

### アクセシビリティ検証

ルートfont-sizeを拡大しても読みやすいか確認：
- ブラウザズームではなく、`:root { font-size: 150%; }`で検証
- テキストの折り返し、レイアウト崩れをチェック

## Transition Property Specification

アニメーション対象を明示：

```css
/* NG: 全プロパティ */
.link {
  transition: var(--speed-md);
}

/* OK: プロパティ指定 */
.link {
  transition: var(--speed-md);
  transition-property: background-color, color;
}
```
