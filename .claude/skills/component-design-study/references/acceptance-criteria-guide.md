# Acceptance Criteria Guide

Step4 の「正解条件」を一貫して定義するためのガイド。

## Step0: Prerequisite Gate (Before Step1)

Step1 に入る前に、最低限次を確認する。

- `standards.required` に `WCAG 2.2 AA` が入っている
- 対象コンポーネントに関係する AA 必須項目の読解メモがある
- 非対象 (`non_goals`) と `scope.excluded` が明示されている

未達の場合:
- `STUDY_STANDARD_GAP` を返して `status=blocked`
- Step0 を満たしてから Step1 に戻る

## 1. Criteria Extraction Flow

1. Step3 の状態一覧から、ユーザー操作と失敗パターンを抽出する
2. 各状態で関係し得る達成基準を列挙する
3. 次を除外する:
   - デザインシステムを自然利用すれば満たせるもの
   - UI デザイン以外で担保すべきもの
4. 残った項目を `acceptance_criteria` として固定する
5. 各 criterion を `study_questions` に変換する

## 2. AA Coverage Rule

この Skill では次を合格ラインとする:

- 各案件で AA 必須項目 100% 定義

計算例:

```text
aa_definition_ratio = defined_required_items / required_items
pass if aa_definition_ratio == 1.0
```

## 3. Required Artifact Shape

```json
{
  "acceptance_criteria": [
    {
      "id": "AC-01",
      "criterion": "例: エラー状態で再入力手順が理解可能",
      "related_standard": ["WCAG 2.2 AA: 3.3.1"],
      "applies_to_states": ["validation_error", "format_error"]
    }
  ],
  "study_questions": [
    "Q-01: エラー要約とフィールドの導線をどう設計すれば再試行が最短になるか"
  ],
  "priority_policy": [
    {
      "level": "must",
      "rule": "AA 必須項目は 100% 定義し、未定義が1件でも次Stepへ進めない"
    },
    {
      "level": "should",
      "rule": "非機能品質の向上案は判断ログに採否理由を残す"
    }
  ]
}
```

## 4. Review Questions

- 基準は「UIで設計すべき内容」に絞れているか
- 各 criterion に状態・操作文脈が紐付いているか
- 未定義の AA 必須項目がないか
- `study_questions` が検証可能な問いになっているか

## 5. Block Conditions

- `acceptance_criteria` が空
- `related_standard` が空の criterion がある
- AA 定義率が 100% 未満

上記いずれかで `STUDY_NO_QUALITY_BASIS` を返し、Step4 をやり直す。
