# 実装計画: Municipal UI Research STEP05 実行

## 概要
- 作成日: 2026-02-16
- 作成者: Codex
- ステータス: Approved
- 優先度: High
- 見積もり工数: 1.5h

## 背景と目的
`docs/municipal-ui-research/STEP05_execution_prompt.md` に基づき、300自治体の浅観測データを再現可能なPythonスクリプトで集計し、STEP06向け50自治体を層化条件つきで抽出する。

## ゴールと成功条件
- [ ] `docs/municipal-ui-research/scripts/step05_analysis.py` を作成し、Task 1-9を再現可能に実装
- [ ] `shallow_stats` 配下の5種CSV＋`ui_structure_vectors.csv`＋`cluster_summary.csv` を生成
- [ ] `.context/municipal-ui-research/data/derived/roster_50.csv` を50件で生成（prefecture=10, municipality=40）
- [ ] `.context/municipal-ui-research/data/derived/selection_report_50.md` に50件全ての理由を記録

## 実装手順
1. データ読込・検証・正規化（BOM, boolean, 品質スコア, http_statusベース除外判定）
2. 集計出力（prevalence/variant/CMS/a11y）
3. topページ18次元ベクトル作成 + K-means（k=5..10, silhouette選定, cluster_id再採番）
4. 50件選定（prefecture10 + municipality40, ソフト制約を満たすよう貪欲補正）
5. 選定理由レポート生成と成功基準チェック

## リスクと対策
- リスク: ソフト制約が競合し同時充足できない
- 対策: ハード制約優先で選定し、未達制約は理由をレポートに明記

## 検証方法
1. スクリプトを実行して出力ファイル有無を確認
2. 行数・layer内訳・カテゴリ分布を集計して成功基準と照合
3. 生成物とスクリプトを最終報告

## 更新履歴
- 2026-02-16: APPROVE PLAN 後に保存
