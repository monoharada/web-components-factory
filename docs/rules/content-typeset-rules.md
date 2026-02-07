# Content Typeset Rules

コンテンツ内の縦リズムをそろえるための共通ルール。行政サービス/自治体サイト向けの標準実装として扱う。

## 目的

- ページごとの手作業マージン調整を減らす
- Web Components とプリミティブ要素を混在させても一定の縦リズムを保つ
- テンプレート生成時に同じ見た目品質を再現できるようにする

## 適用契約

- コンテナに `data-dads-typeset` を付与する
- 密度を詰める場合だけ `data-dads-density="compact"` を付与する
- `compact` は標準の約 15% 圧縮（`0.85` 倍）

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

- 基本ギャップ: `--dads-typeset-gap-normal: clamp(0.75lh, var(--spacing-6, 1rem), 1lh);`
- compact: `--dads-typeset-gap-compact: calc(var(--dads-typeset-gap-normal) * 0.85);`
- 実適用: `row-gap: var(--dads-typeset-gap-current);`

## 見出しポリシー（重要）

- `dads-heading` の大きい余白は `margin="top"` を第一選択にする
- 組版CSSは `dads-heading` の大余白を上書き/再定義しない
- 組版側で加算するのは native 見出し (`h1`〜`h6`) のフォールバックのみ

## テンプレート制作ルール

- `wcf page create` 生成ページは組版CSSを標準同梱する
- パターンHTMLのルートには原則 `data-dads-typeset` を付与する
- 新規テンプレート/サンプル追加時も同じ契約を守る
