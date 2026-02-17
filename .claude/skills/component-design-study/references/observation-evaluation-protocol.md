# Observation / Evaluation Protocol

Step2 と Step3 の精度を担保するための記述規約。

## 1. Separation Rule

- 観測 (`observation`): 画面で確認できる事実のみ
- 評価 (`evaluation`): 品質基準に照らした判断のみ
- 仮説 (`hypothesis`): 自分たちの設計方針案

禁止:
- 観測に「良い/悪い」を混ぜる
- 評価に「事実説明」を混ぜる

## 2. Record Template

```md
- id: O-01
  observation: [フォーカス移動時にエラー文へ到達できない]
  evaluation: [WCAG 2.2 AA の観点で再入力導線が不足]
  hypothesis: [エラー要約リンクと field-level の関連付けを追加]
  related_standard: [WCAG 2.2 SC 3.3.1 (A), WCAG 2.2 SC 3.3.3 (AA)]
```

## 3. NG/OK Examples

### NG

```md
observation: フォーム構造が悪くて分かりにくい
evaluation: ひとまずこのUIは直した方がよい
```

問題:
- 観測に判断語が混入
- 評価に基準根拠がない

### OK

```md
observation: 入力エラー時、キーボード操作のみでは最初のエラー項目に移動できない
evaluation: エラー訂正の再試行コストが高く、AA 必須項目の説明責務を満たしにくい
hypothesis: エラー要約にアンカーを設け、フォーカス遷移を定義する
```

## 4. Step3 State Inventory Rule

Step3 は「見た目の違い」ではなく「状態の違い」で洗い出す。

入力系の基本カテゴリ:
- 初期（未入力）
- 入力中（部分入力）
- 入力完了（妥当）
- 形式エラー（クライアント側）
- 検証エラー（サーバ側）
- 回復可能な制限（残回数など）
- 利用不能（ロック・期限切れなど）
- 成功（次アクションに進む）

入力系以外は次の枠で置換:
- 初期 / 操作中 / 完了 / 回復可能異常 / 回復不能異常

## 5. Exit Conditions

Step2 完了条件:
- `observations`, `evaluations`, `hypotheses` が 1:1:1 で対応
- すべての `evaluation` に品質基準の紐付けがある

Step3 完了条件:
- `state_inventory` が操作フロー全体をカバー
- `transition_conditions` が状態遷移ごとに明示されている
- `pseudo_wireframe` が主要状態を最低1つずつ表現している
