# 2026-02-24 Figma Export Postflight

**タグ**: #tooling #workflow #webcomponents #a11y

## 概要
Figma export 向けスクリプトの後処理で、重複処理を共通化しつつ postflight を実施した。

## 変更点
- `scripts/figma/export-shared.mjs` を追加し、以下を共通化
  - Bun サーバ起動
  - サーバ起動待機
  - Playwright Chromium 実行ファイル探索
  - ブラウザ/サーバの終了処理
- `scripts/figma/export-button.mjs` / `scripts/figma/export-card.mjs` から重複実装を削除
- `figma-export/button.ts` の未使用 import（`serializeNode`）を削除
- `docs/knowledge/figma-export-pipeline.md` に共通ユーティリティ利用方針を追記

## 学び
1. Figma export スクリプトはサーバ制御とブラウザ起動手順がほぼ同じため、共通化メリットが大きい。
2. `figma:export:*` を同時実行すると同一ポート (`3456`) 競合で失敗しうる。CI/手動検証ともに直列実行が安全。
3. `a11y_diff_lint` は Markdown/コメント内の `<img>` 断片や `outline: none` 例示を実装コードとして誤検出する場合があるため、結果の文脈確認が必須。

## 再発防止ルール
- export スクリプト新規追加時は `scripts/figma/export-shared.mjs` を使い、同等ロジックを再実装しない。
- export コマンドをまとめて回すときは並列実行しない。
- a11y lint で `high` が出た場合でも、まず「実コードか文書断片か」を判定してから対処方針を決める。
