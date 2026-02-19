# 実装計画: STEP05 レビュー指摘フォローアップ

## 概要
- 作成日: 2026-02-18
- 作成者: Codex
- ステータス: Approved
- 優先度: High

## 背景
レビューで、再試行スクリプトの上書き範囲/失敗時整合、およびクラスタ制約表示の網羅性に改善指摘があった。

## ゴール
- retry_shallow_samples.py を「失敗行のみ再試行」既定へ修正
- 失敗時挙動を keep_original / normalize で明示化
- step05_analysis.py の cluster ソフト制約判定を全クラスタ対象化
- 旧選定との差分監視（Jaccard）を任意ゲートで追加

## 実装手順
1. retry_shallow_samples.py に CLI オプション追加と失敗時処理の明確化
2. step05_analysis.py に baseline 比較（Jaccard）と全クラスタ評価を追加
3. スクリプト実行で動作確認、成果物整合を確認
