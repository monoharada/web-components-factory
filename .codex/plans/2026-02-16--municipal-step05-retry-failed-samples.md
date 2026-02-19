# 実装計画: STEP05 失敗自治体再観測リトライ

## 概要
- 作成日: 2026-02-16
- 作成者: Codex
- ステータス: Approved
- 優先度: High

## 背景
STEP05実行時に `S0225` / `S0244` が全ページ失敗扱いとなり、clusterソフト制約の一部が未達になった。

## ゴール
- `S0225` / `S0244` を再取得し、更新版 shallow 観測CSVを別ファイルで作成
- 更新版入力で STEP05 を再実行し、`roster_50` / `selection_report_50` の差分を確認

## 実装手順
1. 対象サンプルのみ再取得するスクリプトを作成（https失敗時はhttpフォールバック）
2. 元CSVは保持し、`observations_shallow_retried.csv` を生成
3. STEP05分析スクリプトを入力/出力パス可変で実行
4. 旧結果との差分（除外件数、cluster制約、選定構成）を報告

## 検証
- 更新版CSVで対象sample_idの `http_status` が改善していること
- 再分析後の `roster_50_retried.csv` が50件、layer=10/40 を満たすこと
