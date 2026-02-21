# Handoff Prompt: Combobox 実装オーケストレーション

以下を実装担当のマルチエージェントにそのまま渡してください。

```text
あなたは `dads-combobox` 実装のオーケストレーターです。
目的は「承認済み計画どおりに、DADS準拠の combobox を安全に実装し、品質ゲートを通してハンドオフすること」です。

## 必読ドキュメント
1. docs/plans/feature-20260219-combobox-phase1-detailed-plan.md
2. docs/plans/feature-20260219-combobox-implementation-multi-agent-team.md
3. .claude/skills/css-writing-rules/SKILL.md
4. .claude/skills/headless-component-design/SKILL.md
5. docs/rules/new-component-dod.md

## 拘束条件（絶対）
1. close時は検索queryをクリアする
2. singleモードで未確定離脱した場合は既存選択へ復帰する
3. その他仕様は DADS 準拠
4. 仕様逸脱が必要なら実装を停止して再Plan提案する

## 役割と着手順
- A0 Orchestrator: 依存調整、最終判断、進捗管理
- A1 UX Lead: 行動科学/認知科学に基づく操作の妥当性保証
- A2 Product Designer: Figmaノード整合（22900:119, 25022:13257, 24714:15074, 25036:16077）
- A3 UI Architect: API契約・状態機械・イベント定義
- A4 Component Engineer: Web Component実装
- A5 A11y Engineer: ARIA/WCAG 2.2監査
- A6 QA & Tooling: 検証コマンド実行と回帰管理
- A7 Docs & Handoff: デモ/README/計画同期

## 実装対象（Phase 1）
- 新規 `dads-combobox`
- single / multiple / filterable をサポート
- 既存基盤を再利用（input-text, menu-list-box, form helpers など）
- CEM反映、validate:wc通過、agents:verify通過

## 期待する成果物
1. 実装差分（最小差分・レビュー可能な粒度）
2. API契約（attr/property/event/slot/part）がCEMで確認可能
3. a11y監査結果（BLOCKER/HIGHゼロ）
4. 検証ログ（実行コマンドと結果）
5. 利用ドキュメントとデモ更新
6. 最終ハンドオフメモ（未解決課題と次フェーズ提案を含む）

## 品質ゲート実行順
1. npm run validate:wc
2. npm run cem:analyze
3. npm run test:run
4. npm run type-check
5. npm run agents:pre-pr
6. npm run agents:verify

## 実装ルール
- 変更は必要最小限。不要なリネーム/整形を避ける。
- 既存public APIとの互換性を壊さない。
- フォーカス管理とキーボード操作を先に成立させる。
- `dads-change` は明示確定時のみ発火させる。
- singleモードでは暗黙確定を禁止する。

## 進捗報告フォーマット
[Phase]
- 完了タスク:
- 未完了タスク:
- リスク:
- 次アクション:

## 完了条件（DoD）
- 仕様拘束条件3点を満たす
- 主要キーボード操作が仕様どおり
- DADSフォーム要件を満たす
- 品質ゲートをすべて通過
- 他チームが再現可能な文書が揃っている
```

## 補足（利用方法）
1. まず上記Promptを実装担当オーケストレーターへ渡す
2. サブエージェント分割は `feature-20260219-combobox-implementation-multi-agent-team.md` をそのまま使う
3. 仕様変更が出たら、必ず計画ドキュメントを先に改訂してから実装へ戻す

## 実装結果サマリ（2026-02-19）
- 実装済み: `dads-combobox`（single / multiple / filterable、フォーム連携、CEM反映）
- 拘束条件:
  - close時queryクリア: 実装済み
  - single未確定離脱で既存選択へ復帰: 実装済み（明示確定のみ `dads-change`）
  - その他DADS準拠: 実装済み（label/support/error/required/disabled整合）
- 検証結果:
  - `npm run validate:wc`: pass
  - `npm run cem:analyze`: pass
  - `npm run test:run`: pass
  - `npm run type-check`: pass
  - `npm run ci`: pass
  - `npm run agents:pre-pr`: fail（`custom-elements.json` / `registry/install-registry.json` の HEAD 差分ガード）
  - `npm run agents:verify`: fail（同上）
- 引き継ぎ時の最終手順:
  1. 生成物差分を含めてコミットする
  2. そのコミットHEADで `npm run agents:pre-pr`
  3. 続けて `npm run agents:verify`

## 更新履歴
- 2026-02-19: 初版作成
- 2026-02-19: 実装結果サマリと最終手順を追記
