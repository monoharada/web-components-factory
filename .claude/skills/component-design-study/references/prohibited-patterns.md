# Prohibited Patterns

この Skill で禁止する行為と、検知時の対処。

## P-01 事例の写経

禁止内容:
- 世間の事例を根拠なしにそのまま採用する

検知シグナル:
- `case_log` の引用のみで `selection_log` がない
- 採択理由に品質基準参照がない

対処:
- Step2/5 を再実行し、観測と基準紐付けを追加

## P-02 品質基準を無視した便利さ優先

禁止内容:
- 「便利そう」「実装しやすい」だけで採択する

検知シグナル:
- `related_standard` が空
- AA 必須項目の未定義がある

対処:
- `STUDY_NO_QUALITY_BASIS` を返し Step4 へ差し戻す

## P-03 好みによる選定

禁止内容:
- 見た目の主観で案を選ぶ

検知シグナル:
- `selection_log.reason` が主観語のみ
- 不採用理由が空

対処:
- Step5 をやり直し、比較軸・不採用理由を埋める

## P-04 作例で見つけた問題の握りつぶし

禁止内容:
- Step8 で見つかった仕様欠損を記録せず進める

検知シグナル:
- 作例側で新状態や新導線が出たのに `spec_feedback` が空

対処:
- `status=blocked` とし、Step4/5/6 へ戻す

## Failure Code Mapping

| prohibited | failure code | action |
| --- | --- | --- |
| P-01 | `STUDY_NO_QUALITY_BASIS` | Step2/5 を再実行 |
| P-02 | `STUDY_NO_QUALITY_BASIS` | Step4 へ差し戻し |
| P-03 | `STUDY_SCOPE_MISMATCH` または `STUDY_NO_QUALITY_BASIS` | Step5 を再実行 |
| P-04 | `STUDY_SCOPE_MISMATCH` | Step8 から前段へ差し戻し |
