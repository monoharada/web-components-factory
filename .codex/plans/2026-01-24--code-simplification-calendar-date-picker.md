# コード簡素化（Calendar / DatePicker を優先）Plan

## 目標
- 挙動・公開API・DOM構造を変えずに、読みやすさ/保守性を上げる（重複削減、責務分離、ネスト低減）。
- 変更後も `npm run type-check` / `npm run test:run` / `npm run build` が通る状態を維持する。

## 背景
- 依頼は「コードを簡素化」だが、現状 `git diff` が無く、対象ファイルが未指定。
- コード量の大きいファイルとして `packages/components/calendar/calendar.ts`（約1043行）、`packages/components/date-picker/date-picker.ts`（約915行）があり、相互に関連（date-picker が calendar を利用）しているため、まずここを候補にする。
- `calendar.ts` / `date-picker.ts` で「ISO日付(YYYY-MM-DD)の検証/変換」や「prefix推定（localNameから `dads-*` を組み立てる）」の重複が見えるため、挙動保持のまま整理できる余地がある。

## スコープ
- やること：
  - （未指定なら）第1優先：`packages/components/calendar/calendar.ts` と `packages/components/date-picker/date-picker.ts` の挙動保持リファクタ
  - 2ファイル以上で再利用できる場合のみ、`packages/utils/` に小さな純関数ユーティリティを追加して重複を削減
  - 既存テストを維持し、必要最小限の追加テストでリファクタの安全性を担保
- やらないこと：
  - 公開API変更（export増減、属性/イベント仕様変更、slot/part変更）
  - UI/DOM構造の変更や、デザイントークン/CSS設計方針の変更
  - 大規模フォーマット（ファイル全体のprettier適用等）や広範囲リネーム
  - 依存追加、設定/ビルド/リンタ方針変更

## 前提 / 制約
- 変更は「動作は変えずに単純化（behavior-preserving）」のみ。
- 既存のユーティリティ（`packages/utils/*`、`packages/core/*`）を先に探索し、同等機能があれば寄せる。
- TypeScript `strict` を維持し、`any` を増やさない。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし（内部ロジック整理のみ。DOM/CSS/見た目は不変）

### その他（Docs/Marketing/Infra など）
- （必要なら）`packages/utils/` に以下のような小ユーティリティを追加して重複排除
  - ISO日付 `YYYY-MM-DD` の厳密パース/検証（Date生成＋逆検証）
  - localName から prefix を導出する共通処理（`*-calendar` / `*-date-picker` の共通化）
- （必要なら）新規ユーティリティの最小テスト追加（挙動固定のため）

## 受入基準
- [ ] `calendar.ts` / `date-picker.ts` の公開API・属性・イベント・DOM構造が変わっていない（差分レビューで確認できる）
- [ ] 重複していた「ISO日付の検証/変換」「prefix推定」等が整理され、読みやすい単位に分割されている
- [ ] 変更後に `npm run type-check` が通る
- [ ] 変更後に `npm run test:run` が通る（少なくとも Calendar/DatePicker 関連テストは通る）
- [ ] 変更後に `npm run build` が通る

## リスク / エッジケース
- Dateの扱い（ローカルタイムゾーン前提の `new Date(y, m-1, d)`）を変えると挙動差が出やすい：既存仕様を厳守する
- 共有ユーティリティ化で import 方向を誤ると循環依存のリスク：`packages/utils` は純関数に限定し、components 参照を避ける
- リファクタで副作用（DOM操作/イベント/フォーカス制御）の順序が変わると体感挙動が変わる可能性：テストと手動確認を併用

## 作業項目（Action items）
1. 対象範囲を確定（完了条件: `calendar.ts` + `date-picker.ts` を対象とする旨が明記されている）
2. ナレッジ/遺産チェック（完了条件: 既存ユーティリティ候補を洗い出し、流用可否の方針が立つ）
3. 共有できる純関数の抽出方針を決定（完了条件: 新規 `packages/utils/*` を作る/作らないを判断できている）
4. `calendar.ts` の挙動保持リファクタ（完了条件: 重複/ネストが減り、差分がレビュー可能な粒度でまとまっている）
5. `date-picker.ts` の挙動保持リファクタ（完了条件: 重複/ネストが減り、差分がレビュー可能な粒度でまとまっている）
6. 必要最小限のテスト調整/追加（完了条件: リファクタ由来の不安定要素をテストで固定できている）
7. 検証コマンド実行（完了条件: type-check/test/build が成功し、結果を短く報告できる）

## テスト計画
- 変更ファイルを絞って実行（任意）: `npm run test:run -- packages/components/calendar/calendar.test.ts` / `npm run test:run -- packages/components/date-picker/date-picker.test.ts`
- 全体: `npm run type-check`
- 全体: `npm run test:run`
- ビルド: `npm run build`

