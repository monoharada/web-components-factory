# 実装計画: Combobox 実装 Multi-Agent チーム設計

## 概要
- **作成日**: 2026-02-19
- **作成者**: Codex
- **対象**: `dads-combobox` Phase 1 実装
- **前提**: `docs/plans/feature-20260219-combobox-phase1-detailed-plan.md` を唯一の計画ソースとして扱う

## チーム設計方針
1. 役割を「意思決定」と「実装責務」で分離する。
2. すべての成果物を再監査可能な文書/差分として残す。
3. DADS準拠と a11y を品質ゲートの最上位に置く。
4. 仕様変更はオーケストレーター承認を必須にする。

## チーム構成（推奨）

| Agent | 主責務 | 主な入力 | 主な出力 |
|---|---|---|---|
| `A0 Orchestrator` | 全体進行・依存解決・最終判断 | 既存Plan/監査結果 | 日次進捗、意思決定ログ、最終ハンドオフ |
| `A1 UX Lead` | 行動科学/認知科学に基づく操作確定 | Figma study、利用文脈 | インタラクション仕様、離脱/復帰規則 |
| `A2 Product Designer` | Figma差分吸収、状態定義 | Figma node群 | 状態別UI仕様、視覚優先度 |
| `A3 UI Architect` | API/状態機械/境界設計 | A1/A2仕様、既存コンポーネント | API契約、状態遷移図、イベント規約 |
| `A4 Component Engineer` | Web Component実装 | A3契約、既存基盤 | 実装差分、単体テスト |
| `A5 A11y Engineer` | WCAG 2.2 / ARIA妥当性監査 | A4実装、仕様書 | a11y監査レポート、修正要求 |
| `A6 QA & Tooling` | 回帰検証とCIゲート | 実装差分 | 検証ログ、失敗要因、再現手順 |
| `A7 Docs & Handoff` | ドキュメント/利用例整備 | 全成果物 | README/デモ更新、handoff prompt更新 |

## 実行順序（フェーズ）

### Phase 0: 合意固定
- A0 が計画の拘束条件を固定（close時クリア、single復帰、DADS準拠）
- A1/A2 がFigmaとの差異を最終棚卸し
- 完了条件: 仕様論点が未解決ゼロ

### Phase 1: 契約設計
- A3 が API 契約と状態機械を確定
- A5 が ARIA/キーボード仕様を事前監査
- 完了条件: 実装に先行する契約文書が確定

### Phase 2: 実装
- A4 が最小差分でコンポーネント実装
- A6 が継続的に `validate:wc` / `test:run` / `type-check` を実行
- 完了条件: 機能成立 + 回帰なし

### Phase 3: 品質保証
- A5 が WCAG/操作性を監査
- A6 が `agents:pre-pr`、最終で `agents:verify`
- 完了条件: BLOCKER/HIGHゼロ

### Phase 4: 文書化と引き渡し
- A7 が docs と demo を同期
- A0 が最終ハンドオフを作成
- 完了条件: 他チームが再現実装できる

## RACI（簡易）

| タスク | R | A | C | I |
|---|---|---|---|---|
| 仕様確定 | A1/A2 | A0 | A3/A5 | A4/A6/A7 |
| API/状態機械 | A3 | A0 | A1/A5 | A2/A4/A6/A7 |
| 実装 | A4 | A0 | A3/A5 | A1/A2/A6/A7 |
| a11y監査 | A5 | A0 | A1/A3 | A2/A4/A6/A7 |
| テスト/CI | A6 | A0 | A4/A5 | A1/A2/A3/A7 |
| ドキュメント | A7 | A0 | A1/A2/A3 | A4/A5/A6 |

## 品質ゲート（必須）
1. 仕様ゲート: ユーザー確定事項3点を満たしている
2. APIゲート: CEMに公開契約が反映される
3. a11yゲート: combobox/listboxパターンを満たす
4. 回帰ゲート: 既存コンポーネントへ破壊的影響がない
5. PRゲート: `npm run agents:verify` を通過

## コミュニケーションプロトコル
- 1変更1理由を原則とし、意思決定は `Decision Log` で管理する。
- 仕様逸脱が必要になった時点で実装を停止し、再Planに戻る。
- エスカレーションは A0 のみが実施する。

## 実装向けサブチーム（2レーン）
1. **Core Lane**: A3 + A4 + A6  
API/状態機械/実装/テストを高速で回す。
2. **Quality Lane**: A1 + A2 + A5 + A7  
体験品質、視覚整合、a11y、文書整備を並行で担保する。

## Definition of Done（チーム）
- `dads-combobox` が single/multiple/filterable の主要シナリオを実装
- close時queryクリアが全離脱経路で一貫
- singleで未確定離脱時に既存選択へ復帰
- DADSフォーム要件（label/support/error/required/disabled）を満たす
- `agents:verify` 成功ログと最終ドキュメントが揃っている

## 更新履歴
- 2026-02-19: 初版作成
