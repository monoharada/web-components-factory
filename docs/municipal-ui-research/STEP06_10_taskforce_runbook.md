# STEP06-10 Taskforce Runbook

## 1. Team Structure
- TF-Lead: 依存管理、優先順位、エスカレーション
- STEP06 Squad (Data): 深観測取得、証跡収集、CSV品質保証
- STEP07 Squad (IA): 型抽出、バリアント整理、構造モデル化
- STEP08 Squad (DS): テンプレ仕様化、部品→DS対応表
- STEP09 Squad (FE): テンプレ実装、表示確認、検証コマンド
- STEP10 Squad (A11y): a11y監査、修正、QAレポート

## 2. Gate Owners
- G06: Data QA Lead
- G07: IA Lead
- G08: DS Lead
- G09: FE Lead
- G10: A11y Lead

## 3. KPI and Thresholds
- K1: STEP06 50自治体カバレッジ = 100%
- K2: STEP06 必須列欠損率 <= 3%
- K3: STEP06 `notes`+証跡記入率 >= 90%
- K4: STEP07 型数 <= 3 / page_type
- K5: STEP09 `validate:wc` and `test:run` PASS
- K6: STEP10 重大a11y欠陥 = 0

## 4. Stop Conditions
- S1: STEP06観測行数 < 150
- S2: 欠損過多（3列以上が欠損率10%超）
- S3: STEP07 型が3以下に収束しない
- S4: STEP09 `validate:wc` 2回連続失敗

## 5. Handoff Template
```md
# Handoff: <from> -> <to>

- Date:
- Owner:
- Input Artifacts:
- Output Artifacts:
- Gate Checklist:
  - [ ] 必須条件1
  - [ ] 必須条件2
- Open Risks:
- Notes for Next Step:
```

## 6. Daily Operation (10 min)
- 進捗: 前日完了 / 本日フォーカス / ブロッカー
- 依存: 受け渡し待ち成果物
- 品質: KPI逸脱の有無
- 判断: Go / Hold / Rework

## 7. Required Commands at STEP09-10
- `npm run dev`
- `npm run validate:wc`
- `npm run test:run`
- `npm run agents:verify`
