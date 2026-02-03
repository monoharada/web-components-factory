# レビュー指摘対応: date-picker レース対策 & measure-esm type-only 除外

## 目標
- カレンダー動的ロード中のクローズ/再オープン競合で、非表示ポップオーバーへフォーカスが移るレースを防ぐ
- `measure-esm.mjs` が type-only import/export をランタイム依存として計測しないようにする
- date-picker が `calendar-lite-define` を動的ロードするよう差し替える

## 背景
- `#openCalendar()` の await 後に `focus()` が走り、ユーザーが閉じた場合でもフォーカスが移る可能性がある
- `import { type Foo }` / `export { type Foo }` が regex で除外されず、サイズ計測が過大/解決失敗の可能性がある

## スコープ
- やること：
  - `date-picker-impl.ts` の動的ロード競合対策（open/close の整合性チェック or トークン）
  - `calendar-lite-define` への動的ロード差し替え
  - `measure-esm.mjs` の type-only specifier 除外（軽量 regex）
  - 必要なテスト追加/更新
- やらないこと：
  - 仕様変更（新しい UI/UX 追加）
  - 依存追加を伴う大規模パーサ導入

## 前提 / 制約
- 既存の API/挙動を維持しつつ、レースを防ぐ最小修正に留める
- `measure-esm.mjs` は軽量 regex で対応する

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `#openCalendar()` の post-await で「現在も open 状態か」「接続中か」を確認し、閉じられていたら `focus()`/反映を中止
- 代替案: open 要求トークン（インクリメント/UUID）を導入し、`#closeCalendar()` で無効化して post-await の処理を抑止

### その他（Docs/Marketing/Infra など）
- `parseImports()` で `import { type Foo }` / `export { type Foo }` を除外
  - specifier 内の `type` のみを軽量 regex で除外

## 受入基準
- [ ] カレンダー動的ロード中に閉じても、非表示ポップオーバーへフォーカスが移動しない
- [ ] ロード中の再オープンが無視される場合でも、最終状態が意図どおりになる
- [ ] `calendar-lite-define` が動的ロードされる
- [ ] `import { type Foo }` / `export { type Foo }` が計測対象から除外される
- [ ] 既存の date-picker テストがパスし、必要な追加テストが追加される

## リスク / エッジケース
- open/close の競合対策で、従来のフォーカス移動や aria-expanded の整合性が崩れるリスク
- type-only の除外が過剰になると、本来のランタイム依存を見落とす可能性

## 作業項目（Action items）
1. date-picker の競合を再現するテストを追加（完了条件: 現行コードでテストが失敗する）
2. `#openCalendar()` の post-await ガードを実装（完了条件: テストがパスする）
3. `calendar-lite-define` への動的ロード差し替え（完了条件: 既存テストがパスする）
4. `measure-esm` の type-only 除外を再現するテストを追加（完了条件: 現行コードでテストが失敗する）
5. `parseImports()` の軽量 regex を修正（完了条件: テストがパスする）
6. 影響範囲の簡易確認（完了条件: 変更ファイルのユニットテストがパスする）

## テスト計画
- `npm run test:run -- packages/components/date-picker/date-picker.test.ts`
- `npm run test:run -- tests/size/measure-esm.test.ts`

## オープンクエスチョン
- 該当なし
