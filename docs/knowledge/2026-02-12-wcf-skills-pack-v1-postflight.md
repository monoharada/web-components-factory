# WCF Skills Pack v1 Postflight Learnings

## Context
- Feature or PR: WCF UI Skills Pack v1 (`wcf-ui-builder` + `wcf-discovery/install/compose/validate`)
- Date: 2026-02-12
- Scope: Skill分割、配布導線更新、品質ゲート運用、テスト安定化

## What Worked
- Skillを4分割しつつ、入口を `wcf-ui-builder` に固定したことで導線が単純になった。
- 全Skillで「Markdown + JSONブロック」「共通エラー契約」「共通フォールバック契約」を揃え、運用時の揺れを抑えられた。
- `npm run codex:install-skills -- --dry-run` と `validate:wc` を受け入れ条件として使うと、導入と契約の破綻を早期検知できた。

## What Blocked Progress
- `pages-build-viewer` 系のテストが環境次第で5秒タイムアウトし、coverage比較の再現性を下げた。
- base worktree側で依存解決とタイムアウト条件が揃わず、coverage比較が不安定になった。

## Root Causes
- I/Oを含むテストに対して、テストケース単位のtimeout明示が不足していた。
- base/HEAD比較時に同一条件（依存解決・timeout）を統一する運用ルールが曖昧だった。

## New Rules
- Rule: I/Oが重い統合テストは `LONG_IO_TIMEOUT_MS` を定数化し、各テストに明示適用する。
  - Rationale: 実装品質とは無関係な環境揺れでpostflightを落とさないため。
  - Example: `tests/wcf-init.spec.ts`, `tests/wcf-vendor.spec.ts`, `tests/pages-build-viewer.test.ts`
- Rule: coverage非劣化比較は base/HEAD で実行条件を揃えてから判定する。
  - Rationale: 条件差による疑似回帰を防ぎ、差分品質だけを評価するため。
  - Example: base側でも同一のcoverageコマンドと妥当な `--testTimeout` を適用

## Next Time Checklist
- [ ] Skill追加時は `install-skills.sh` / `docs/codex-skills.md` / `README.md` の3点を同時更新したか
- [ ] Skill契約（必須キー・エラーコード・フォールバック）を例示JSONまで含めて検証したか
- [ ] `validate:wc` / `agents:pre-pr` / `agents:verify` を実行し、結果をPR本文へ転記したか
- [ ] Postflight学びを `docs/knowledge` に記録したか
