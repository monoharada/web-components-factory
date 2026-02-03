# 差分簡素化（calendar/date-picker 系）プラン再整理

## 目標
このブランチの差分ファイルに対し、挙動を変えずに重複・冗長さ・責務の混在を解消して読みやすくする。

## 背景
calendar/date-picker の a11y 分離、lite 入口追加、prefix 付与の共通化、サイズ計測スクリプト追加が入っており、差分量が大きい。可読性と保守性を高め、将来の変更が局所化できる状態にしたい。

## スコープ
- やること：
  - 差分ファイルのみを対象に簡素化（git 差分 + 新規追加）
  - 重複ロジックの抽出・命名整理・責務分離
  - 既存ユーティリティへの寄せ（新規 helper 追加は最小限）
- やらないこと：
  - 公開API/仕様/DOM構造の変更
  - CSS設計方針の刷新
  - 差分外ファイルへの広域変更

## 前提 / 制約
- Plan フェーズのため編集は行わない。
- 既存の util を優先採用し、挙動差が疑われる統一は preview で提案に留める（code-simplifier ルール）。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし（DOM/見た目/挙動を維持）

### その他（Docs/Marketing/Infra など）
- define 系の重複（calendar/date-picker の define と lite-define）を共通化または局所 helper 化。
- calendar-impl / date-picker-impl の同期ロジック（sync 系）を責務ごとに小さな関数に整理。
- `custom-element-name` の prefix 付与処理（ensure/derive）を統一して利用箇所を簡潔化。
- `scripts/size/measure-esm.mjs` の引数解析・依存解析を分割し可読性を向上。

## 受入基準
- [ ] `packages/components/calendar/*` と `packages/components/date-picker/*` の公開 API・イベント・a11y の挙動が変わらない
- [ ] lite 入口は a11yAnnotations を読み込まないまま維持される
- [ ] `custom-element-name` の利用が整理され、同等処理の重複が減っている
- [ ] `scripts/size/measure-esm.mjs` の責務が分離され読みやすい
- [ ] 変更は差分ファイル内に閉じている（不要な周辺変更なし）

## リスク / エッジケース
- define 関数共通化で registry/prefix の扱いを誤ると二重登録や SSR 安全性が崩れる
- a11yAnnotations の読み込み境界が崩れると lite が肥大化する
- sync 系の順序依存（disabled/readonly/aria/form value）があるため、分割時に副作用順序が変わる可能性

## 作業項目（Action items）
1. 差分ファイルの責務を一覧化（完了条件: 各ファイルの目的と重複箇所が明確）
2. 既存 util の再利用候補を洗い出し（`packages/utils`, `packages/core`）へ寄せる方針決定（完了条件: 採用/不採用の理由が決まる）
3. calendar/date-picker の define/lite-define の重複整理方針を決定（完了条件: 具体的な共通化案が確定）
4. calendar-impl の sync 系を責務ごとに分割（完了条件: 同一処理が重複せず読みやすい構成）
5. date-picker-impl の入力同期/ARIA/フォーム反映を局所 helper 化（完了条件: 同種処理の集中化）
6. `custom-element-name` の利用箇所を整理（完了条件: prefix 付与/置換の呼び出しが一貫）
7. `scripts/size/measure-esm.mjs` の関数分割と命名整理（完了条件: 主要責務が追いやすい）
8. 影響テストの実施（完了条件: 対象テストがパス）

## テスト計画
- `npm test -- packages/components/calendar/calendar.test.ts`
- `npm test -- packages/components/date-picker/date-picker.test.ts`
- `npm run type-check`
- スクリプト変更時: `npm run size:esm`

## オープンクエスチョン
- 該当なし
