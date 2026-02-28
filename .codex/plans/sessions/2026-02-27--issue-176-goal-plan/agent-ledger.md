# Agent Ledger

## Orchestrator
- Main agent: Codex
- Mode: planning-only (`goal-plan-orchestrator`)

## Goal Cell
- `Elm` (`019c9d40-e715-7dc0-ae5d-004d55a3eb50`)
  - Role: Goal Framer + DoD Normalizer
  - Outcome: goal/scope/constraints と `D-01..D-10` 初稿、`U-xx` 候補を生成。

## Planning Cells
- `Clover` (`019c9d40-e77b-7832-b1c1-e4512b099af6`)
  - Role: Research Cell (Codebase Facts Scout)
  - Outcome: ツール登録箇所、prompts/resources 現状、IDEテンプレ現状、更新対象、検証コマンドを特定。
- `Larch` (`019c9d40-e7bf-7011-bf89-0a773c231b74`)
  - Role: Risk Cell
  - Outcome: `R-01..R-10`（severity/trigger/detection/rollback + F-01/F-04/F-05 trace）を作成。

## Readiness Cell
- `Yucca` (`019c9d47-f38a-7c71-9dc3-6b1b362be707`)
  - Role: Independent Auditor
  - Outcome: `READY_FOR_IMPLEMENTATION` を返し、5チェック全て pass を確認。

## Consolidation Notes
- `dod` 未指定のため DoD は暫定正規化として確定。
- Unknown は scope/research で解消し、`unknowns=[]` で監査通過。
- 実装開始条件はユーザーの `APPROVE PLAN`。
