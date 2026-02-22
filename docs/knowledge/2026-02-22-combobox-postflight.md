# Frontend Implementation Learnings

## Context
- Feature or PR: PR #151 (feat(combobox): input-assist mode, multiple boolean attr, keyboard fix)
- Date: 2026-02-22
- Scope: combobox + avatar/icon 追加差分の postflight（a11y / coverage / pre-PR gate）

## What Worked
- `a11y_diff_lint` を「現在差分（`git diff`）」に限定すると、実際の未解決指摘を素早く判定できた。
- coverage を `origin/main` と HEAD の両方で計測し、4指標（lines/statements/functions/branches）を機械比較できた。
- `npm run validate:wc` は今回差分で問題なしを維持できた。

## What Blocked Progress
- `npm run agents:pre-pr` / `npm run agents:verify` は generated clean check で停止した。
- 停止理由は `custom-elements.json` と `registry/install-registry.json` が HEAD に対して未確定差分のため。

## Root Causes
- 本リポジトリの PR ガードは、生成物差分がある状態での pre-pr/verify を失敗扱いにする設計。
- `agents:verify` は `agents:pre-pr` を内包するため、同じ理由で連鎖的に停止する。

## New Rules
- Rule: coverage 非劣化判定は `coverage-final.json` を `istanbul-lib-coverage` で集計し、4指標を 0.1pp しきい値で比較する。
- Rationale: 実行環境やログ形式に依存せず、再現性のある数値比較にするため。
- Example:
  - base: lines 87.64 / statements 82.81 / functions 86.10 / branches 69.23
  - head: lines 87.89 / statements 83.00 / functions 86.30 / branches 69.81

- Rule: `agents:verify` が generated clean check で止まった場合でも、品質確認のため `npm run ci` は別途実行して結果を記録する。
- Rationale: ガード失敗と実装品質（type/test/build）を分離して判断するため。
- Example:
  - `agents:verify`: fail（generated clean check）
  - `ci`: pass（type-check/test:run/build）

## Next Time Checklist
- [ ] `agents:pre-pr` 失敗時は、生成物ガード失敗か実装不整合かを先に分類したか
- [ ] coverage の base/HEAD 比較結果を 4指標で記録したか
- [ ] a11y diff lint は `origin/main...HEAD` と `git diff` のどちらを採用するかを先に明示したか
