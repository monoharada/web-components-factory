# Scope
## Included
- 一次利用者: デザイナー / エンジニア / デザインエンジニア。
- 対象: コンポーネント案件およびテンプレート画面案件。
- 各案件で Step6 以降まで進める運用検証。
- 各案件で AA 必須項目を定義し、判断ログを残す。
- `component-design-study` Skill 自体の品質向上（P0/P1/P2 の改善実施）。

## Excluded
- 意匠改善を主目的とした洗練検討。
- ブランド表現の最適化のみを目的とした検討。
- プロダクト本体コンポーネントコードの実装・改修。

## Assumptions
- 2週間で3案件を評価対象として確保できる。
- AA 判定基準を案件間で同一運用できる。
- Step 到達判定（Step6 以降）をレビューで記録できる。
- Skill 改訂は `.claude/skills/component-design-study/` 配下で完結できる。

## Fixed decisions
- U-01: A11y違反判定は自動検査を一次判定とし、違反検出時は失敗（見直し）とする。
- U-02: 2週間で3案件を満たせない場合の一次ルールは評価期間延長とする。
- U-03: `evidence_gates` は reason 付き形式（`gate`, `passed`, `reason`）を正とする。

## Unknowns
- なし
