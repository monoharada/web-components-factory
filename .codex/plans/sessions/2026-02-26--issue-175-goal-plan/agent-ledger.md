# Agent Ledger

## Orchestrator
- Main agent: Codex
- Mode: planning-only (`goal-plan-orchestrator`)

## Goal Cell
- `Spruce` (`019c98a1-7a0d-75b0-99ae-64d448925a75`)
  - Role: Goal Framer
  - Outcome: Goal Statement / KR / Constraints / DoD 初稿を作成。
- `Banyan` (`019c98a1-7a25-7ea0-88b9-3eaf0d4d112c`)
  - Role: KR Definer + DoD Normalizer
  - Outcome: D-01..D-08 と検証観点、確認質問候補を作成。
- `Cactus` (`019c98a1-7a3a-7122-b62d-60bae9b1f04e`)
  - Role: Scope/Constraint Mapper
  - Outcome: 応答未取得（`pending_init`）。
- `Apple` (`019c98b6-abb9-7ca1-8cf4-d730130a3e84`)
  - Role: Scope/Constraint Mapper（代替）
  - Outcome: In/Out scope、assumptions、影響ファイル、検証コマンドを確定。

## Planning Cells
- `Ironwood` (`019c98a1-7a59-72c3-84eb-22ba13225c37`)
  - Role: Research Cell (Boundary Scout)
  - Outcome: 現状実装事実、Issue境界、検証経路、Unknown を整理。

## Readiness Cell
- Main agent self-audit
  - Role: Auditor + Reviser
  - Outcome: 初回監査で F-04（SDK互換）のトレース不足を検出し、`P-09` / `C-11` / `R-08` を追加して改訂。
- `Alder` (`019c98ba-6ca1-7861-b94d-4eef57cb8927`)
  - Role: Independent Auditor
  - Outcome: `NEEDS_REVISION` を返し、F-04 契約化不足（B-01）を指摘。
- `Baobab` (`019c98bc-4934-7303-ac94-fed12ca5db71`)
  - Role: Independent Auditor (2nd pass)
  - Outcome: `READY_FOR_IMPLEMENTATION` を返し、6基準すべて pass を確認。

## Consolidation Notes
- #175 は独立Issueだが、#176/#177 の責務越境回避を契約で明記。
- `dod` 未指定のため DoD は暫定正規化として扱い、`APPROVE PLAN` を開始条件に固定。
