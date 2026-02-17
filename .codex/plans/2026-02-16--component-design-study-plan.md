# 実装計画: component-design-study を A レベルへ引き上げる

## 概要
- 作成日: 2026-02-16
- ステータス: Approved
- 承認フレーズ: APPROVE PLAN
- 承認日時: 2026-02-16
- 優先度: High
- 対象: Skill ドキュメント改善（実装コード変更なし）

## 目標
- Agent Teams FB の P0/P1 を解消し、P2 を最小構成で導入する。
- 2週間3案件評価に必要な判定可能性（AA必須項目100%、Step6到達）を支える Skill 構造へ改訂する。

## Steps (P-xx)

- P-01: 現行Skillの情報設計を再編する（骨格整理）
  - Decision: `SKILL.md` は Quick Reference/Decision Tree/Core Workflow 中心に圧縮する。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
  - Contract: C-03, C-07
  - Risks: R-01

- P-02: `references/` を新設し、思想・詳細手順を分離する
  - Decision: 詳細は `references/` 側へ寄せ、段階読み込み可能な構造にする。
  - Touches:
    - `.claude/skills/component-design-study/references/design-philosophy.md`
    - `.claude/skills/component-design-study/references/observation-evaluation-protocol.md`
    - `.claude/skills/component-design-study/references/acceptance-criteria-guide.md`
    - `.claude/skills/component-design-study/references/variation-study-protocol.md`
    - `.claude/skills/component-design-study/references/abduction-feedback-loop.md`
    - `.claude/skills/component-design-study/references/finish-checklist-template.md`
    - `.claude/skills/component-design-study/references/prohibited-patterns.md`
  - Contract: C-02, C-07
  - Risks: R-01

- P-03: 実行モデル（並行実行/差し戻し/ループ）を明文化する
  - Decision: Step 5-8 のフィードバックループを独立セクションで定義する。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
    - `.claude/skills/component-design-study/references/abduction-feedback-loop.md`
  - Contract: C-05
  - Risks: R-03

- P-04: JSON schema を全Step artifacts で決定化し、不整合を解消する
  - Decision: Step 1〜10 の artifacts キーを `SKILL.md` 内 schema で統一定義する。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
  - Contract: C-04
  - Risks: R-02

- P-05: evidence_gates / failure code の発火条件を if-then で定義する
  - Decision: blocker と warning の境界を明示し、過剰停止を避ける。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
  - Contract: C-06
  - Risks: R-04

- P-06: Few-shot を3パターンへ拡張する
  - Decision: Step2完了時、Step5比較時、Step8差し戻し時の3出力例を固定する。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
  - Contract: C-08
  - Risks: R-03

- P-07: Sources / Related Docs / Step0前提チェックを追加する
  - Decision: Step 0 は「品質基準読解の前提チェック」として定義する（Step番号運用と矛盾しない形）。
  - Touches:
    - `.claude/skills/component-design-study/SKILL.md`
    - `.claude/skills/component-design-study/references/acceptance-criteria-guide.md`
  - Contract: C-05, C-07, C-10
  - Risks: R-01

- P-08: 周辺整合（docs/registry/tests）を修正し、必須チェックを通す
  - Decision: 影響がある箇所のみ最小変更する。
  - Touches:
    - `docs/codex-skills.md`
    - `registry/skills-registry.json`（必要時のみ）
    - `tests/skills-registry.test.ts`（必要時のみ）
  - Contract: C-09
  - Risks: R-02, R-04, R-05

- P-09: 検証と評価準備
  - Decision: Skill整合チェックを通し、2週間3案件評価に必要な観測項目を確認する。
  - Touches:
    - `.codex/plans/2026-02-16--component-design-study-*.md`（必要時追記）
  - Contract: C-09, C-10
  - Risks: R-06

## 検証計画
- `npm run skills:check`
- （必要に応じて）`npm run codex:install-skills -- --dry-run`
- 変更後レビュー観点:
  - P0/P1 の欠落が解消されていること
  - Step定義とJSON schemaが矛盾しないこと
  - docs記載件数と実体が一致すること

## TODO
- [ ] P-01 実施
- [ ] P-02 実施
- [ ] P-03 実施
- [ ] P-04 実施
- [ ] P-05 実施
- [ ] P-06 実施
- [ ] P-07 実施
- [ ] P-08 実施
- [ ] P-09 実施

## Open Issues
- なし

## Revision Log
- 2026-02-16: 初版作成（Agent Teams FB を反映した P0/P1/P2 構成）。
- 2026-02-16: U-01/U-02/U-03 を確定（自動検査 / 評価期間延長 / evidence_gates reason付き）。
