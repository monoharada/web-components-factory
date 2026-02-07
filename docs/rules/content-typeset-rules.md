# Content Typeset Rules

コンテンツ内の縦リズムをそろえるための共通ルール。行政サービス/自治体サイト向けの標準実装として扱う。

## 目的

- ページごとの手作業マージン調整を減らす
- Web Components とプリミティブ要素を混在させても一定の縦リズムを保つ
- テンプレート生成時に同じ見た目品質を再現できるようにする

## 適用契約

- コンテナに `data-dads-typeset` を付与する
- 密度を詰める場合だけ `data-dads-density="compact"` を付与する
- `compact` は固定値 (`gap: 1em`, `dads-heading[margin="top"]`: `1em`) を使う
- 実際の見た目の圧縮率はフォント/line-height により変動する

```html
<main data-dads-typeset>
  ...
</main>

<main data-dads-typeset data-dads-density="compact">
  ...
</main>
```

## レイヤー契約

- レイヤー宣言: `@layer reset, tokens, base, layout, components, contents, page;`
- 組版ルールは `@layer contents` に限定する
- `!important` は使わない

## スペーシング設計

- 基本ギャップ: `--dads-typeset-gap-normal: 1lh;`
- compact: `--dads-typeset-gap-compact: 1em;`
- 実適用: `row-gap: var(--dads-typeset-gap-current);`
- `dads-heading[margin="top"]` の上余白（default）: `--dads-typeset-heading-margin-top-normal: 1lh;`
- `dads-heading[margin="top"]` の上余白（compact）: `--dads-typeset-heading-margin-top-compact: 1em;`
- 見出し前余白（追加分）: `--dads-typeset-heading-before-extra-normal: 0.5lh;`
- compact時見出し前余白（追加分）: `--dads-typeset-heading-before-extra-compact: calc(var(--dads-typeset-heading-before-extra-normal) * 0.85);`

### 見出し上余白のコントロール方法

native見出し（`h1`〜`h6`）の「見出し前の追加余白」は次で調整できる。

```css
[data-dads-typeset] {
  --dads-typeset-heading-before-extra-normal: 0.75lh;
}

[data-dads-typeset][data-dads-density="compact"] {
  --dads-typeset-heading-before-extra-compact: 0.5lh;
}
```

## 見出しポリシー（重要）

- `dads-heading` の大きい余白は `margin="top"` を第一選択にする
- 組版CSSは `dads-heading` の大余白を上書き/再定義しない
- 組版側で加算するのは native 見出し (`h1`〜`h6`) のフォールバックのみ
- `dads-heading[margin="top"]` の最終値は `calc(base * scale)` で計算される

```css
[data-dads-typeset] {
  --dads-heading-margin-block-start-base: 1lh;
  --dads-heading-margin-scale: 1;
}

[data-dads-typeset][data-dads-density="compact"] {
  --dads-heading-margin-block-start-base: 1em;
}
```

## テンプレート制作ルール

- `wcf page create` 生成ページは組版CSSを標準同梱する
- パターンHTMLのルートには原則 `data-dads-typeset` を付与する
- 新規テンプレート/サンプル追加時も同じ契約を守る
