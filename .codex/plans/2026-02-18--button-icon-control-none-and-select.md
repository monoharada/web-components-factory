# Plan: Button API の icon-start / icon-end を none + アイコン選択化

## 背景
- 現状の button API テーブルでは icon-start / icon-end のコントロールが On/Off（hidden 切替）になっている。
- 要望は「On/Off ではなく、none とアイコン選択を可能にする」こと。
- 既存パターンとして `chip-tag` に `none + select` と、選択値に応じて slot SVG を差し替える実装がある。

## 実装方針
1. `src/demos/showcase-components.ts` の button API Preview に、lead/end 用の data 属性を持つ slot SVG を配置（初期は `none` 想定）。
2. API テーブルの `icon-start` / `icon-end` 行を `select`（`none`, `login`, `logout` など）へ変更する。
3. button API セクションに専用スクリプトを追加し、選択値に応じて Preview と Usage の対象 SVG の `path[d]` と `hidden` を同期する。
4. `data-api-reset` 押下時も既定値（none）へ戻るよう同期する。
5. 既存テストを、On/Off 前提から「none + icon選択」前提に更新する。

## 検証
- `npm run test:run -- src/demos/showcase-components.test.ts`
- `npm run validate:wc`

## 想定影響
- 影響範囲は button デモ（showcase-components）とそのテストのみ。
- 実コンポーネント（packages/components/button）の実装は変更しない。
