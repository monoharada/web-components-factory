# Usage スニペットの strip 処理を DocumentFragment でも確実に適用

## 目標
テンプレート由来の Usage でも `data-api-*` / `data-has-*` / `data-api-strip-attrs` が確実に除去されるようにする。

## 背景
`stripUsageAttrs()` が `Element` 以外で return しており、`usage.fragment`（DocumentFragment）経由の Usage では内部属性が残ることを確認した。テンプレート Usage でも意図どおりに剥がす必要がある。

## スコープ
- やること：
  - `stripUsageAttrs()` を DocumentFragment でも再帰的に処理できるよう修正
  - テンプレート Usage で内部属性が除去されることをテストで担保
- やらないこと：
  - 既存の Usage 生成ロジック/フォーマットの変更
  - デモの仕様変更、別機能のリファクタ

## 前提 / 制約
- 既存の strip 仕様（`ALWAYS_STRIP_*`, `STRIP_ATTR_PREFIXES`）の意味は維持する。
- 影響範囲は `src/viewer-api-controls.ts` と `src/viewer-api-controls.test.ts` に限定する。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- Usage 表示に含まれる内部属性がテンプレート経由でも除去される（見た目のテキスト改善のみ）。

### その他（Docs/Marketing/Infra など）
- ユニットテスト追加（`src/viewer-api-controls.test.ts`）。

## 受入基準
- [ ] `usage.fragment`（DocumentFragment）経由の Usage でも `data-api-*` / `data-has-*` / `data-api-strip-attrs` が出力に残らない
- [ ] `Element` 直 clone パスの挙動は現状と同一（既存テストが維持）
- [ ] `src/viewer-api-controls.test.ts` に該当テストが追加され、`npm run test:run -- src/viewer-api-controls.test.ts` が通る

## リスク / エッジケース
- DocumentFragment の子孫に対して strip が過剰に働く可能性（ただし対象は `data-api-*` 系中心で影響は限定的）
- 再帰順序変更でパフォーマンスが僅かに変わる可能性

## 作業項目（Action items）
1. `src/viewer-api-controls.ts` の `stripUsageAttrs()` の現状挙動を再確認（完了条件: DocumentFragment 経由で早期 return する箇所を把握）
2. `createUsageModel()` で `usage.fragment` が生成される流れを確認（完了条件: DocumentFragment が `syncUsageCode()` に渡る根拠を整理）
3. `stripUsageAttrs()` の修正方針を決定（Element のときだけ属性除去、全 Node で childNodes を再帰）をメモ（完了条件: 変更方針が 1–2 行で言語化できる）
4. `src/viewer-api-controls.test.ts` にテンプレート Usage での strip 検証ケースを設計（完了条件: 期待される出力文字列が決まる）
5. テストケースを追加（テンプレート内に `data-api-*` / `data-has-*` / `data-api-strip-attrs` 相当を含め、出力から消えることを確認）（完了条件: 新規テストが追加済み）
6. `npm run test:run -- src/viewer-api-controls.test.ts` を実行して失敗→修正→成功の流れを確認（完了条件: 該当テストがパス）
7. 既存テストで clone パスの挙動が維持されていることを確認（完了条件: 既存の usage formatting テストがパス）

## テスト計画
- ユニット: `npm run test:run -- src/viewer-api-controls.test.ts`
- 追加テストでテンプレート Usage の strip を検証し、既存の usage formatting テストで clone パスの挙動が維持されることを確認

## オープンクエスチョン
- `data-api-strip-attrs` はテンプレート由来の Usage にも確実に効かせたい理解で合っていますか？
