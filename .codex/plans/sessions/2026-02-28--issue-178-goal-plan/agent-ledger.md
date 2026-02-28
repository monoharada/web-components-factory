# Agent Ledger

## Orchestrator
- Main agent: Codex
- Mode: planning-only (`goal-plan-orchestrator`)

## Goal Cell
- Main agent (Codex)
  - Role: Goal Framer / KR Definer / DoD Normalizer
  - Outcome: `goal.md`, `scope.md`, `D-01..D-12` 初稿を作成。

## Planning Cells
- `Baobab` (`019ca208-b679-7ee1-ba03-32e3eaf67785`)
  - Role: Codebase Facts Scout
  - Outcome: #178 観点の satisfied/gap を抽出、主要 path:line を提示。
- `Maple` (`019ca208-b6db-7dd1-9c97-6a83c68d4576`)
  - Role: Constraint Mapper
  - Outcome: default 20 と F-01 互換衝突を分析し、実装方針候補を提示。
- `Violet` (`019ca208-b7a2-7c31-8ea3-ff0c113b7f7e`)
  - Role: Validation Path Scout
  - Outcome: streaming/truncation/cache/perf logging のテスト不足点と優先度を提示。

## Readiness Cell
- Main agent (Codex)
  - Role: Planner + Auditor
  - Outcome: `audit.json` / `readiness.md` を確定し `READY_FOR_IMPLEMENTATION` を判定。

## Consolidation Notes
- `dod` 未指定のため DoD は issue 本文から正規化。
- 互換優先（F-01）を維持しつつ default 20 要件は新経路導入で満たす前提で統合。
- 実装開始条件はユーザーの `APPROVE PLAN`。
