# `dads-list` 実装ナレッジ（マーカー整列 / 入れ子余白 / VRT）

更新日: 2026-02-06  
タグ: #dads #webcomponents #css #tokens #vrt #figma

## 概要
- `dads-list` で問題化したのは次の2点。
  - マーカーの縦位置が本文に対して上付き/下付きに見える
  - 親項目本文と入れ子リスト先頭項目の間隔だけ `spacing` 連動が効かず詰まる
- 解決は「マーカー描画責務の整理」と「余白責務の整理」で行う。

## 症状と根本原因

### 1) マーカー位置ずれ（上付き）
- 原因候補:
  - `line-height: 1` / `block-size: 1lh` をマーカー列コンテナ側に置く
  - `transform` 補正で一時合わせをすると、フォントやOS差で再びずれる
- 失敗例:
  - ネイティブ `::marker` を `font-size: 6px` まで縮小すると、`disc/circle` が `.` っぽく劣化するケースがある。

### 2) 親本文と入れ子先頭の間隔不足
- 典型的な誤解:
  - リスト本体 (`[part='base']`) の `row-gap` は「兄弟 `dads-list-item` 同士」には効くが、
  - 親項目の本文テキストと、その中の入れ子 `dads-list` の間には直接効かない。
- 結果:
  - `項目2（入れ子あり）` と `入れ子項目A` の間だけ狭く見える。

## 採用した実装方針

### A. マーカー整列（`variant="marker"`）
- `transform` は使わない。
- マーカーは `marker-glyph` 文字描画で管理し、縦位置は通常フローに合わせる。
- コンテナに過剰な縦補正 (`block-size: 1lh` など) を持たせない。
- `variant="number"` は従来どおり `slot="marker"` を優先（コピー可能性を維持）。

### B. 余白責務の分離
- `兄弟 item 間`:
  - `[part='base'] { row-gap: var(--dads-list-item-gap); }`
- `親本文と入れ子 list 間`:
  - `[part='content'] > slot { display: flex; flex-direction: column; row-gap: var(--_dads-list-item-gap); }`
- `::slotted(dads-list)` 側では追加マージンを持たせず `margin: 0;` に統一して二重余白を防ぐ。

## spacing トークン運用ルール
- `spacing` は `lg|md|sm` を `12/8/4` として扱う。
- 値はトークン経由で管理する。
  - `--list-item-gap-lg: var(--spacing-3, 12px)`
  - `--list-item-gap-md: var(--spacing-2, 8px)`
  - `--list-item-gap-sm: var(--spacing-1, 4px)`
- `padding-block: var(--_dads-list-item-gap)` のような上下同時付与は、どの境界に効かせるかが曖昧になるため避ける。

## 実装上のチェックポイント（Do / Don’t）

### Do
- 余白を「どの境界に効かせるか」で分ける（base row-gap と content slot row-gap）。
- `marker` と `number` で責務を分離する（装飾マーカー vs 情報マーカー）。
- `spacing` 未指定のネストは親の `spacing` を継承する（既定 `md` フォールバック）。

### Don’t
- `transform` での見た目合わせに依存しない。
- `::marker` の極端な縮小で `.` 化する構成を採用しない。
- `padding-block` で上下に同時余白を入れて、意図しない二重/欠落を招かない。

## VRT 運用ナレッジ（Figma比較）
- `listFidelity` で比較用DOMを固定し、ノイズの多いUI（注釈/コントロール）を排除する。
- Figmaノード対応の固定IDを使って要素クロップ撮影する。
- `localhost:3000` の誤サーバー再利用を避けるため、specで対象ID可視を fail-fast 条件にする。

推奨コマンド:
```bash
npm run test:e2e:list-fidelity:update
npm run test:e2e:list-fidelity
```

## 最低限の回帰確認観点
- `spacing="lg|md|sm"` 変更で、次の2種類の間隔が同時に追随すること。
  - `項目A` と `項目B`（兄弟 item 間）
  - `親本文` と `入れ子先頭項目`（親子境界）
- `variant="number"` で `slot="marker"` のDOMが保持されること。
- マーカー整列に `transform` が入っていないこと。
