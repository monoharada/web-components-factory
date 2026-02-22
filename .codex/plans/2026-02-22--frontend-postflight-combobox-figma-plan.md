# 実装計画: frontend-postflight for combobox figma branch

## 概要
- 作成日: 2026-02-22
- 作成者: Codex
- ステータス: Approved
- 対象ブランチ: monoharada/combobox-figma-plan
- base: origin/main

## 目的
- 既存差分に対して postflight 品質ゲートを実施し、PR #151 をレビュー可能状態に整える。

## 実行手順
1. 変更対象と規約の再確認（AGENTS.md / README.md / 差分）
2. a11y監査（a11y-checker 流儀、✗/判定不能優先）
3. coverage 非劣化ゲート（base=origin/main、lines/statements/functions/branches）
4. 安全な修正の適用（高リスクは提案止まり）
5. code-simplifier 方針での簡素化確認（挙動変更なし）
6. docs/knowledge へ学びログ追加
7. 既存 PR #151 の本文更新とレビュー依頼文の生成

## 判定ルール
- coverage は 0.1pp 以内を同値、いずれか低下で FAIL
- coverage 取得不能は BLOCKER
- 危険変更は適用しない

## 検証
- npm run test:coverage
- npm run validate:wc
- npm run agents:pre-pr
- npm run agents:verify
