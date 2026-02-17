# Variation Study Protocol

Step5-6 のバリエーション検討と洗練を、再現可能な比較手順で進めるためのプロトコル。

## 1. Step5: Variation Comparison

### Input

- `acceptance_criteria`
- `study_questions`
- `state_inventory`

### Process

1. 論点ごとに最低2案のバリエーションを作る
2. 案ごとに、満たす基準と満たせない基準を明示する
3. 採用/不採用理由を `selection_log` に記録する
4. 最低限の検証セットを実施し、`verification_log` に残す

### Variation Matrix Template

```md
| question_id | variant | meets | misses | notes |
| --- | --- | --- | --- | --- |
| Q-01 | A | AC-01 | AC-02 | 視認性は高いが再試行導線が弱い |
| Q-01 | B | AC-01, AC-02 | - | 採択候補 |
```

## 2. Minimum Verification Set

- キーボード操作（主要状態横断）
- 支援技術（主要読み上げフロー）
- エラー発生 -> 修正 -> 再送信
- 表示条件（拡大 / 狭幅 / 高コントラスト）

## 3. Step6: Refinement

Step6 は「選んだ案を壊さずに磨く」段階。

禁止:
- 新しい論点を勝手に追加して比較をやり直すこと
- 根拠なしで見た目を優先し、Step5 の採択理由を崩すこと

必要時:
- 新論点や新状態を検知したら Step4 へ戻す
- 比較不足が見つかったら Step5 へ戻す

## 4. Required Artifact Shape

```json
{
  "variation_set": [
    { "id": "A", "question_id": "Q-01" },
    { "id": "B", "question_id": "Q-01" }
  ],
  "selection_log": [
    {
      "question_id": "Q-01",
      "selected": "B",
      "reason": "AC-01/AC-02 を同時に満たす",
      "rejected": [{ "id": "A", "reason": "再試行導線が不足" }]
    }
  ],
  "verification_log": [
    { "type": "keyboard", "result": "pass", "note": "..." },
    { "type": "sr", "result": "pass", "note": "..." },
    { "type": "error_recovery", "result": "pass", "note": "..." },
    { "type": "display_condition", "result": "pass", "note": "..." }
  ]
}
```

## 5. Exit Conditions

Step5 完了条件:
- すべての `study_questions` に採択案がある
- 採択案ごとに基準紐付けがある
- 最低限検証セットが実施済み

Step6 完了条件:
- 採択案の基準適合が維持されている
- 追加変更が `tradeoff_notes` に記録されている
- 次Step（7/8）で検証可能な作例入力が揃っている
