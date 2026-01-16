# a11y注釈拡充（`dads-date-picker` / `dads-calendar`）

## Context
- `viewer.html` の a11y-annotate 表示において、カレンダー/日付ピッカーはインタラクション量に対してコールアウトが少なく、仕様理解に必要な注釈が不足している。
- DADS（デジタル庁デザインシステム）の「日付ピッカー／カレンダー」ガイドに合わせ、主要操作点（入力・ダイアログ・日付セル・状態表示）に注釈を追加したい。

## Goal
- `dads-calendar` / `dads-date-picker` の `a11yAnnotations` を拡充し、操作点と状態（ダイアログ、フォーカス、選択、aria-live等）がコールアウトで把握できるようにする。

## Scope
- やること
  - `dads-calendar` / `dads-date-picker` の `a11yAnnotations.categories` と `callouts` を増補
  - 追加したコールアウトIDが壊れないよう、Vitest に静的注釈のテストを追加（TDD）
- やらないこと
  - コンポーネント仕様の変更（UIの挙動追加・新属性追加など）はこの作業に含めない

## Proposed callouts
### `dads-calendar`
- 月移動ボタン（前/次）
- 現在月表示
- 日付セル（aria-label/選択状態）
- フッターボタン（削除/今日）
- range時: サポートテキスト / aria-live 読み上げ

### `dads-date-picker`
- 入力グループ（consolidated/separated）
- 年/月/日入力（ラベル関連付け）
- カレンダーボタン（aria-expanded/aria-haspopup）
- ポップオーバー（role=dialog, aria-modal, Esc/Tab制御）
- 内包カレンダー（`dads-calendar`）
- エラーテキスト（aria-describedby）

## Test plan（TDD）
1. `packages/components/calendar/calendar.test.ts` に「calloutsが主要IDを含む」テストを追加（RED）
2. `packages/components/date-picker/date-picker.test.ts` に同様のテストを追加（RED）
3. `dads-calendar` / `dads-date-picker` 側の `a11yAnnotations.callouts` を増補（GREEN）
4. `npm run type-check`
5. `npm run test:run -- packages/components/calendar/calendar.test.ts`
6. `npm run test:run -- packages/components/date-picker/date-picker.test.ts`

## Manual check（viewer）
- `viewer.html` → カレンダー（通常/期間選択）でコールアウトが増えている
- 日付ピッカーはポップオーバーを開いた状態でも注釈対象が把握できる

