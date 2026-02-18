# 2026-02-18 button icon API / postflight

## 変更の要点

- `dads-button` の `icon-start` / `icon-end` を APIテーブルで操作可能化。
- コントロール方式を `none + icon選択` に統一し、`dummy` も選択肢に追加。
- `commandfor / command-store` の運用ガイドを `docs/knowledge/command-store-usage.md` として追加。

## 学び

- デモ用アイコンパスは `showcase-components.ts` に直書きせず、`packages/utils/icons.ts` の `iconPaths` を参照すると重複を減らせる。
- APIテーブルの select は `aria-label` があっても、差分lintではヒューリスティック誤検知が出ることがあるため、人手確認を併用する。

## つまずき

- `agents:verify` は生成物差分（今回では `custom-elements.json`）が未コミットだと pre-pr ガードで失敗する。

## 再発防止

- 生成物が絡む変更では「`agents:verify` 1回目でガード確認 → コミット後に再実行」で進める。
- デモ追加時は先に共通ユーティリティ有無を検索し、同等実装の新規追加を避ける。
