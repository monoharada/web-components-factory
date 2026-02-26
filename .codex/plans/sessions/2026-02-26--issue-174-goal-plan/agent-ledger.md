# Agent Ledger

## Orchestrator
- Main agent: Codex
- Mode: planning-only (goal-plan-orchestrator)

## Goal Cell
- `Cedar` (`019c9821-52cb-7162-bd7a-fb8d81ffa0b1`)
  - Role: Goal Framer
  - Outcome: Goal/Non-goals/Hard constraints を定義
- `Maple` (`019c9821-52ea-7770-86fa-ac106f0fe9b0`)
  - Role: KR Definer
  - Outcome: KR-01..KR-06 と Done 条件を定義
- `Dill` (`019c9821-5348-7a60-8660-bf4daa6b124a`)
  - Role: Scope/Constraint Mapper
  - Outcome: In/Out scope, Unknown, 再Planトリガを定義

## Planning Cells
- `Clover` (`019c9824-1e6a-7942-8805-698c18d6a13b`)
  - Role: Research Cell (Codebase Facts Scout)
  - Outcome: 対象実装位置・現行レスポンス形式・検証コマンドを確定
- `Acacia` (`019c9824-1ece-7d52-a03e-71013f4c2def`)
  - Role: Plan/Contract Cell
  - Outcome: P-01..P-08, C-01..C-08 草案を生成
- `Sequoia` (`019c9824-1f04-7bb3-8973-d42bd1b9f2a0`)
  - Role: Risk Cell
  - Outcome: R-01..R-06 + rollback/detection を生成

## Readiness Cell
- `Mint` (`019c9829-67ed-7f50-ad31-f0a6d2922ea0`)
  - Role: Auditor (1st pass)
  - Outcome: `NEEDS_USER_INPUT`（U-01..U-03 未確定）
- `Pine` (`019c982c-25ca-7f41-8eec-ff1ae3c04d2c`)
  - Role: Auditor (2nd pass)
  - Outcome: `READY_FOR_IMPLEMENTATION`

## Consolidation Notes
- 1st audit 指摘の U-01..U-03 は Issue #174 方針に沿って固定し再監査で解消。
- 計画は #174 単体に限定し、#176/#177 実装への越境を排除。
