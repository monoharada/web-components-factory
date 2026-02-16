---
name: component-design-study
description: 新規 Web コンポーネント開発時に、デザインスタディ（調査→仕様化→検証→作例→完成）を Step 1〜10 の循環で実行し、判断ログ付きで再現可能な形にする。Use when (1) 既存/新規のコンポーネントをデザインする前提検討が必要なとき, (2) 品質基準に沿う選定根拠を明文化したいとき, (3) 「どこまでが今回の範囲か」を短時間で合意したいとき。
---

# component-design-study

## 目的

仕様から離脱しない「正解条件駆動」のデザインスタディを実施し、次を満たす。
- いつでも Step 構造で現状説明できる。
- 各判断に根拠（基準・比較軸・採否）が残る。
- 次のステップに引き継げる成果物が揃う。

## 受け入れトリガ

- 新規コンポーネントの基本設計前
- 既存コンポーネント改修で Step 観点が曖昧になった時
- 作例作成前に品質条件と差別化根拠を明確化したい時

## Quick Reference

### 到達目標（5項目）
- 正解条件が言える
- バリエーションが作れる
- 選定理由が説明できる
- 作例で仕様が育つ
- 今どこにいて次に何をするかを即説明できる

### 禁止事項（4項目）
- 事例をそのまま写経しない
- 品質基準を無視した「便利さ」で決めない
- バリエーションを好みで選ばない（判断ログ必須）
- 作例で見つけた問題を握りつぶさない

### 失敗コード（if-then）
- `STUDY_INSUFFICIENT_INPUT`:
  - If: `component_name` または `quality_targets` が欠落
  - Then: `status=blocked` とし、不足入力を返す
- `STUDY_SCOPE_MISMATCH`:
  - If: 成果物が `scope.excluded` に含まれる内容へ逸脱
  - Then: `status=blocked` とし、該当Stepを差し戻す
- `STUDY_NO_QUALITY_BASIS`:
  - If: Step4 の `acceptance_criteria` が空、または Step5 の採択案に基準紐付けがない
  - Then: `status=blocked` とし、Step4 に差し戻す
- `STUDY_STANDARD_GAP`:
  - If: `standards.required` が空、または必須基準の読解記録がない
  - Then: `status=blocked` とし、Step0/4 を再実行する

## Decision Tree

| ユースケース | 参照ドキュメント |
| --- | --- |
| スタディ全体の思想と前提を揃える | [design-philosophy.md](references/design-philosophy.md) |
| Step2の観測/評価分離を精密化する | [observation-evaluation-protocol.md](references/observation-evaluation-protocol.md) |
| Step4の正解条件を定義する | [acceptance-criteria-guide.md](references/acceptance-criteria-guide.md) |
| Step5-6のバリエーション比較を進める | [variation-study-protocol.md](references/variation-study-protocol.md) |
| Step7-8の差し戻し判断を行う | [abduction-feedback-loop.md](references/abduction-feedback-loop.md) |
| Step9-10の完了判定・引き継ぎを行う | [finish-checklist-template.md](references/finish-checklist-template.md) |
| 禁止事項の具体例を確認する | [prohibited-patterns.md](references/prohibited-patterns.md) |

## 実行モデル

### 並行実行の原則
- Step分解は説明モデルであり、実務は同時並行で進める。
- 現在地は常に `current_step` で宣言し、同時に進んでいる補助Stepは `steps.N.outcome=partial` で示す。
- どの時点でも「現状/判断/次アクション」を1分で説明できる状態を維持する。

### 差し戻しポリシー
- 仕様境界が変わったら Step3 へ戻る。
- 正解条件が崩れたら Step4 へ戻る。
- 採択根拠が消えたら Step5 へ戻る。
- 洗練で品質が下がったら Step6 へ戻る。

### フィードバックループ（Step5-8）
- Step5 -> Step8: 採択案を作例へ適用して欠損検知
- Step8 -> Step4: 新状態/新導線が発生した場合
- Step8 -> Step5: 既存論点の比較不足が見つかった場合
- Step8 -> Step6: 採択済み案の品質低下のみを修正する場合

## 入力（最小）

- `component_name`: 対象コンポーネント名（必須）
- `target_flow`: 利用フロー
- `quality_targets`: 優先する品質軸（例: a11y, IA, 認知負荷）
- `design_constraints`: 禁止事項・技術制約・開発制約
- `state_list`: 扱う状態（最低: idle/default/error/disabled/success）

## Step0 前提チェック（Step1開始前）

- `standards.required` に `WCAG 2.2 AA` が含まれていること
- 対象に関連する AA 必須項目の読解メモがあること
- 欠落時は `STUDY_STANDARD_GAP` を返し、Step0 を満たすまで進行しない
- 詳細: [acceptance-criteria-guide.md](references/acceptance-criteria-guide.md)

## 出力契約

出力は必ず2部構成:
1. 人間向け要約（現在Step、判断ポイント、次アクション）
2. 機械可読JSON（再開・再現用）

```json
{
  "study_id": "component-study-<slug>-<YYYYMMDD>",
  "component_name": "例: dads-email-input",
  "current_step": 4,
  "status": "in_progress|blocked|done",
  "scope": {
    "included": [],
    "excluded": []
  },
  "standards": {
    "required": ["WCAG 2.2 AA"],
    "baseline": [],
    "deferred": []
  },
  "governance": {
    "non_goals": [],
    "constraints": [],
    "failure_definition": ""
  },
  "steps": {
    "1": {
      "outcome": "done",
      "artifacts": {
        "case_log": [],
        "pattern_map": []
      },
      "review_ok": true
    },
    "2": {
      "outcome": "done",
      "artifacts": {
        "observations": [],
        "evaluations": [],
        "hypotheses": []
      }
    },
    "3": {
      "outcome": "partial",
      "artifacts": {
        "state_inventory": [],
        "pseudo_wireframe": [],
        "transition_conditions": []
      }
    },
    "4": {
      "outcome": "done",
      "artifacts": {
        "acceptance_criteria": [],
        "study_questions": [],
        "priority_policy": []
      }
    },
    "5": {
      "outcome": "partial",
      "artifacts": {
        "variation_set": [],
        "selection_log": [],
        "verification_log": []
      }
    },
    "6": {
      "outcome": "todo",
      "artifacts": {
        "refined_design": [],
        "tradeoff_notes": []
      }
    },
    "7": {
      "outcome": "todo",
      "artifacts": {
        "example_case_log": []
      }
    },
    "8": {
      "outcome": "todo",
      "artifacts": {
        "examples": [],
        "spec_feedback": []
      }
    },
    "9": {
      "outcome": "todo",
      "artifacts": {
        "finish_checklist": [],
        "release_readiness": []
      }
    },
    "10": {
      "outcome": "todo",
      "artifacts": {
        "usage_patterns": [],
        "replaceability_scope": [],
        "handoff": []
      }
    }
  },
  "evidence_gates": [
    {
      "gate": "purpose_met",
      "passed": true,
      "reason": "Step目的を満たす成果物が揃っている"
    },
    {
      "gate": "handoff_ready",
      "passed": true,
      "reason": "次Stepが必要とする入力が不足していない"
    },
    {
      "gate": "scope_consistency",
      "passed": true,
      "reason": "included/excluded を逸脱していない"
    },
    {
      "gate": "no_drift",
      "passed": true,
      "reason": "禁止事項に該当する痕跡がない"
    },
    {
      "gate": "current_explainable",
      "passed": true,
      "reason": "現状/判断/次アクションを説明できる"
    }
  ],
  "open_questions": [],
  "assumptions": [],
  "risks": []
}
```

`steps.N.outcome` は `todo/partial/done/blocked` を使う。

## Evidence Gates 判定条件（if-then）
- `purpose_met`:
  - If: 現在Stepで定義された必須 artifacts が埋まり、レビュー観点の未達がない
  - Then: `passed=true`
- `handoff_ready`:
  - If: 次Stepに必要な入力が `open_questions` に残っていない
  - Then: `passed=true`
- `scope_consistency`:
  - If: 出力が `scope.excluded` を含まない
  - Then: `passed=true`
- `no_drift`:
  - If: 禁止事項4項目に該当しない
  - Then: `passed=true`
- `current_explainable`:
  - If: 「現状/判断/次アクション」を1分以内に説明できる
  - Then: `passed=true`

## Core Workflow（Step0 + 10ステップ要約）

### Step 0: 品質基準前提チェック
- 目的: 必須品質基準の欠落を先に防ぐ
- 成果物: `standards.required` と読解メモ
- 詳細: [acceptance-criteria-guide.md](references/acceptance-criteria-guide.md)

### Step 1: 観察リサーチ
- 目的: 反面教師を含む観察母集団を作る
- 成果物: `case_log`, `pattern_map`
- 詳細: [design-philosophy.md](references/design-philosophy.md)

### Step 2: 観測/評価分離
- 目的: 事実と判断を分ける
- 成果物: `observations`, `evaluations`, `hypotheses`
- 詳細: [observation-evaluation-protocol.md](references/observation-evaluation-protocol.md)

### Step 3: 状態棚卸し
- 目的: 見た目ではなく状態で仕様化する
- 成果物: `state_inventory`, `pseudo_wireframe`, `transition_conditions`
- 詳細: [observation-evaluation-protocol.md](references/observation-evaluation-protocol.md)

### Step 4: 正解条件設定
- 目的: 準拠基準に基づく論点を固定する
- 成果物: `acceptance_criteria`, `study_questions`, `priority_policy`
- 詳細: [acceptance-criteria-guide.md](references/acceptance-criteria-guide.md)

### Step 5: バリエーション比較
- 目的: 論点ごとに複数解を比較する
- 成果物: `variation_set`, `selection_log`, `verification_log`
- 詳細: [variation-study-protocol.md](references/variation-study-protocol.md)

### Step 6: 洗練
- 目的: 選定案を品質悪化なしで整える
- 成果物: `refined_design`, `tradeoff_notes`
- 詳細: [variation-study-protocol.md](references/variation-study-protocol.md)

### Step 7: 作例リサーチ
- 目的: 実使用文脈を補充する
- 成果物: `example_case_log`
- 詳細: [abduction-feedback-loop.md](references/abduction-feedback-loop.md)

### Step 8: 作例制作
- 目的: 作例から仕様欠損を発見する
- 成果物: `examples`, `spec_feedback`
- 詳細: [abduction-feedback-loop.md](references/abduction-feedback-loop.md)

### Step 9: フィニッシュワーク
- 目的: 本番移行可能性を点検する
- 成果物: `finish_checklist`, `release_readiness`
- 詳細: [finish-checklist-template.md](references/finish-checklist-template.md)

### Step 10: テンプレート化
- 目的: 再利用可能な提供形に整える
- 成果物: `usage_patterns`, `replaceability_scope`, `handoff`
- 詳細: [finish-checklist-template.md](references/finish-checklist-template.md)

## 各Step共通レビュー項目

- 目的は満たしたか
- 次Stepに引き継げる粒度か
- 逸脱していないか
- 現在状態を Step 構造で説明できるか

## 連携ルール

- CSS/セレクタ/トークンの判断は `css-writing-rules` に再確認する。
- コンポーネント API 整合は `headless-component-design` に再確認する。
- 実装依頼に進む場合は `status=blocked` として実装系スキルへ引き継ぐ。

## Few-shot Output Patterns

### Pattern A: Step2 完了時
```
Human summary:
- Step2 完了。観測12件、評価8件、仮説5件を整理。
- 観測と評価の混在は0件。
- 次アクション: Step3 で状態棚卸しを開始。

JSON excerpt:
{
  "current_step": 2,
  "steps": {
    "2": {
      "outcome": "done",
      "artifacts": {
        "observations": ["..."],
        "evaluations": ["..."],
        "hypotheses": ["..."]
      }
    }
  },
  "evidence_gates": [
    {"gate":"purpose_met","passed":true,"reason":"観測/評価分離が完了"}
  ]
}
```

### Pattern B: Step5 比較時
```
Human summary:
- Step5 進行中。論点Q-02に対して3案を比較。
- 採択候補は案B。理由は WCAG 2.2 AA の 2基準を同時に満たすため。
- 次アクション: Step6 で案Bの洗練を実施。

JSON excerpt:
{
  "current_step": 5,
  "steps": {
    "5": {
      "outcome": "partial",
      "artifacts": {
        "variation_set": ["A","B","C"],
        "selection_log": ["B selected with criteria mapping"],
        "verification_log": ["keyboard","sr","error-recovery","viewport"]
      }
    }
  }
}
```

### Pattern C: Step8 差し戻し検知時
```
Human summary:
- Step8 で新状態（rate-limit）を検知。
- Step4 の正解条件に未定義のため Step4 へ差し戻し。
- 次アクション: acceptance_criteria と study_questions を更新後、Step5 を再開。

JSON excerpt:
{
  "current_step": 8,
  "status": "blocked",
  "steps": {
    "8": {
      "outcome": "partial",
      "artifacts": {
        "spec_feedback": ["new state: rate-limit"]
      }
    }
  },
  "open_questions": ["Step4 criteria update for rate-limit state"]
}
```

## Sources
- `.context/attachments/デザインスタディガイド-v2.md`
- https://www.w3.org/TR/WCAG22/
- https://design.digital.go.jp/

## Related Docs
- `.claude/skills/css-writing-rules/SKILL.md`
- `.claude/skills/headless-component-design/SKILL.md`
- `docs/rules/content-typeset-rules.md`
