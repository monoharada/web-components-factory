# Municipal UI Research STEP06-10 Taskforce Plan

- Date: 2026-02-18
- Status: APPROVED (`APPROVE PLAN`)
- Scope: STEP06, STEP07, STEP08, STEP09, STEP10
- Strategy: 方式A（全量深観測を先に完了し、型抽出→仕様→実装→a11y QA を段階的に実施）

## Goal
STEP05で確定した50自治体を起点に、深観測データから再利用可能なテンプレ仕様を確定し、実装とa11y QAまで完遂する。

## Team and Gate Owners
- G06 (STEP06): Data QA Lead
- G07 (STEP07): IA Lead
- G08 (STEP08): DS Lead
- G09 (STEP09): FE Lead
- G10 (STEP10): A11y Lead

## Quality Gates
- STEP06:
  - `observations_deep.csv` の50自治体カバレッジ100%
  - 必須列欠損率 <= 3%
  - `notes` + 証跡パス（DOM or screenshot）記入率 >= 90%
- STEP07:
  - 5ページタイプすべてで型数 <= 3
  - 各型に代表自治体を最低1件紐付け
- STEP08:
  - 各ページタイプに「目的/構造/部品/状態/CMS入力/DS対応表」を記載
- STEP09:
  - `npm run validate:wc` PASS
  - `npm run test:run` PASS
- STEP10:
  - 重大a11y欠陥 0件
  - `outputs/qa_report.md` 完成
  - `npm run agents:verify` PASS

## Stop Conditions
- STEP06: 行数が必須下限未満（50自治体 x 必須3ページ = 150）
- STEP06: 必須列で欠損過多（3列以上が欠損率10%超）
- STEP07: 型が3以下に収束しない
- STEP09: `validate:wc` が連続2回失敗

## Retry and Rollback
- Retry:
  - 失敗自治体のみ再クロール/再抽出
  - 再実行は最大2回（2回失敗で手動レビュー）
- Rollback:
  - 直前Gate合格成果物へ戻す
  - スコープ変更や設計変更が必要なら再Planして再承認

## 1-Week Execution Cadence
- Day1: STEP06キックオフ、クロール拡張、先行10自治体でQC
- Day2: STEP06完走、QC修正、Gate G06
- Day3: STEP07型抽出、Mermaid/JSON、Gate G07
- Day4: STEP08仕様化、DS対応表、Gate G08
- Day5: STEP09実装 + STEP10 QA、Gate G09/G10

## Immediate Deliverables
- `docs/municipal-ui-research/STEP06_execution_prompt.md`
- `docs/municipal-ui-research/STEP07_execution_prompt.md`
- `docs/municipal-ui-research/STEP08_execution_prompt.md`
- `docs/municipal-ui-research/STEP09_execution_prompt.md`
- `docs/municipal-ui-research/STEP10_execution_prompt.md`
- `docs/municipal-ui-research/STEP06_10_taskforce_runbook.md`
