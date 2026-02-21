# Frontend Implementation Learnings

## Context
- Feature or PR: `dads-combobox`（single/multiple + filterable + keyboard/a11y）
- Date: 2026-02-21
- Scope:
  - Figma準拠のヘッダー/パネル状態
  - キーボード操作（開閉・選択・解除・離脱）
  - フォーカス順序（control → search → option → chip remove）
- coverage 非劣化ゲート

## What Worked
- 「close時にqueryを必ずクリア」「single未確定離脱時の復帰」をテストで拘束しながら実装できた。
- `dads-chip-tag` を使った選択済み表示へ統一し、single/multiple のUI差分を縮小できた。
- キーボード経路をユースケース単位で追加し、`Escape` 離脱と `Tab` 遷移を安定化できた。
- coverage比較で base を上回る結果を維持できた（lines/statements/functions/branches 全て改善）。
  - lines: 87.65% -> 87.94% (+0.29pp)
  - statements: 82.82% -> 83.11% (+0.29pp)
  - functions: 86.10% -> 86.45% (+0.35pp)
  - branches: 69.23% -> 69.54% (+0.31pp)

## What Blocked Progress
- `agents:pre-pr` / `agents:verify` は generated files clean-check で停止した。
  - `custom-elements.json`
  - `registry/install-registry.json`
- `a11y-checker` の diff lint は `outline: none` を機械検知しやすく、代替フォーカス実装の文脈評価が必要だった。

## Root Causes
- generated outputs を反映したコミット前だと `check-generated-clean.mjs` を通過できない。
- combobox のように control/input/search/option/chip が混在するUIは、意図したタブ順が崩れやすい。

## New Rules
- Rule: combobox系は「フォーカス順」と「Escape離脱」を必ずユースケーステストで固定する。
- Rationale: 視覚差分より先に操作不能が発生しやすく、回帰コストが高い。
- Example:
  - open後 `Tab` で `search-input` に移動
  - `search-input` から `Tab` で option へ移動
  - option/chip remove 上の `Escape` で close + control復帰

- Rule: generated file 差分を含む変更では、PR前に `cem:analyze` / `registry:generate` の出力更新を差分に含める。
- Rationale: `agents:pre-pr` の clean-check 条件を満たすため。
- Example:
  - `custom-elements.json`
  - `registry/install-registry.json`

## Next Time Checklist
- [ ] キーボードユースケース（single/multiple）を先に Red で追加する
- [ ] Figma状態差分はスクリーンショット比較で確認する
- [ ] generated file 差分を早期に確認し、PR差分へ含める
