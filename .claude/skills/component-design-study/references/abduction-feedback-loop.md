# Abduction Feedback Loop

Step7-8 は「作例を作るほど仕様が見える」前提で回す。

## 1. Parallel Model

- Step6（洗練）と Step7（作例リサーチ）は並行で進める
- Step8（作例制作）は Step4-6 への差し戻しを前提にする
- 差し戻しは失敗ではなく、仕様を強化する通常動作

## 2. Step7: Example Research

目的:
- 実使用文脈で起こる情報・導線・状態の揺らぎを把握する

成果物:
- `example_case_log`

最低記録項目:
- 画面コンテキスト
- 使われる文言タイプ
- 失敗/例外の文脈

## 3. Step8: Breathing Examples

目的:
- 作例からコンポーネント仕様の欠損を検知し、明示的に返す

品質水準:
- ダミーテキストではなく実運用に近い内容で作る
- そのままテンプレート転用しても破綻しにくい粒度で記述する

成果物:
- `examples`
- `spec_feedback`

## 4. Rollback Rules (Step8 -> Step4/5/6)

次の条件を検知したら差し戻す:

1. 新しい状態が必要になった -> Step4
2. 説明テキストが増殖し始めた -> Step4
3. エラーが複数系統へ分岐した -> Step5
4. 想定外の導線/文脈が現れた -> Step4

## 5. Feedback Record Template

```json
{
  "spec_feedback": [
    {
      "id": "FB-01",
      "trigger": "new_state_detected",
      "detail": "rate_limit 状態が必要",
      "rollback_to": 4,
      "impact": ["acceptance_criteria", "study_questions"]
    }
  ]
}
```

## 6. Exit Conditions

Step8 完了条件:
- 主要ユースケースを作例として再現できる
- 差し戻しが必要な項目が `spec_feedback` に明記されている
- 差し戻し不要の場合も「不要理由」を判断ログへ残している
