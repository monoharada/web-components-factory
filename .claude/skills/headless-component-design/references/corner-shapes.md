# 角の形状（Corner Shapes）

DADS公式に準拠した角丸設計ガイドライン。

## 公式リファレンス

https://design.digital.go.jp/dads/foundations/corner-shapes/

## 5段階のスタイル

| スタイル | 正方形 | 長方形 | CSS値 |
|---------|--------|--------|-------|
| 角丸なし | 0px | 0px | `0` |
| **角丸スモール** | **8px** | **8px** | `0.5rem` |
| 角丸ミディアム | 16px | 12px | `1rem` / `0.75rem` |
| 角丸ラージ | 32px | 16px | `2rem` / `1rem` |
| 角丸フル | 50% | 高さの50% | `50%` / `9999px` |

## 重要な原則

### サイズによる視覚的差異

**同じスタイルでもコンポーネントサイズによって視覚的印象が異なる**

- 小さいコンポーネント → 角丸の影響が強く見える
- 大きいコンポーネント → 角丸の影響が弱く見える

### コンポーネント単位で規定

スタイルガイドにおいて、コンポーネント単位で角丸値を規定して使用することを推奨。

## コンポーネント別の適用ルール

| コンポーネント | スタイル | 値 | 理由 |
|---------------|---------|-----|------|
| Button | 角丸スモール | 8px (0.5rem) | フォーム要素として統一 |
| Textarea | 角丸スモール | 8px (0.5rem) | 公式実装 `rounded-8` |
| Input | 角丸スモール | 8px (0.5rem) | フォーム要素として統一 |
| Select | 角丸スモール | 8px (0.5rem) | フォーム要素として統一 |
| Card | 角丸ミディアム | 12px (0.75rem) | 長方形なので12px |
| Modal | 角丸ミディアム | 16px (1rem) | 正方形に近いので16px |
| Avatar | 角丸フル | 50% | 円形表現 |
| Badge/Tag | 角丸フル | 9999px | ピル形状 |

## トークン設計

### プリミティブ層（DADS公式値）

```css
--border-radius-0: 0;
--border-radius-4: 0.25rem;   /* 4px - 極小要素用 */
--border-radius-8: 0.5rem;    /* 8px - 角丸スモール ★フォーム要素標準 */
--border-radius-12: 0.75rem;  /* 12px - 角丸ミディアム（長方形） */
--border-radius-16: 1rem;     /* 16px - 角丸ミディアム（正方形） */
--border-radius-32: 2rem;     /* 32px - 角丸ラージ（正方形） */
--border-radius-full: 9999px; /* 角丸フル */
```

### セマンティック層

```css
/* フォーム要素は角丸スモール（8px）を使用 */
--textarea-border-radius: var(--border-radius-8);
--button-border-radius: var(--border-radius-8);
--input-border-radius: var(--border-radius-8);

/* カード系は角丸ミディアム */
--card-border-radius: var(--border-radius-12);
```

### ローカル層（オーバーライド用API）

```css
--dads-textarea-border-radius: var(--textarea-border-radius);
--dads-button-border-radius: var(--button-border-radius);
```

## 部分的な角丸

すべての角に丸みを施す必要はない。

```css
/* 上部のみ角丸 */
border-radius: var(--border-radius-8) var(--border-radius-8) 0 0;

/* 左側のみ角丸 */
border-radius: var(--border-radius-8) 0 0 var(--border-radius-8);
```

## オーバーライド例

```css
/* フォーム要素の角丸をカスタマイズ */
dads-textarea {
  --dads-textarea-border-radius: 0;  /* 角丸なし */
}

dads-button {
  --dads-button-border-radius: 9999px;  /* ピル形状 */
}
```

## よくある間違い

### ❌ 4px (0.25rem) をフォーム要素に使用

```css
/* 間違い: 4pxは極小要素用 */
--textarea-border-radius: var(--border-radius-4, 0.25rem);
```

### ✅ 8px (0.5rem) をフォーム要素に使用

```css
/* 正解: 角丸スモール（8px）を使用 */
--textarea-border-radius: var(--border-radius-8, 0.5rem);
```

## 関連ドキュメント

- [設計思想](../../../docs/architecture/design-philosophy.md)
- [トークンAPIパターン](./token-api-pattern.md)
