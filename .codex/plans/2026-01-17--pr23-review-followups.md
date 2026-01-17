# PR #23 指摘対応（vitest対象の明確化 + dads-radio reset堅牢化）

Status: APPROVED (2026-01-17)

## 目標
- `vitest.config.ts` のテスト対象変更を「意図した除外」として明確化し、思わぬ未実行テストを減らす
- `dads-radio` の `formResetCallback()` を、同一 `name` グループで複数 `checked` 初期値があっても決定的に復元できるようにする

## 変更内容（案）
- `vitest.config.ts`: `include` を `tests/**/*` に戻し、現状 import 解決で落ちる `tests/adaptive-card*.test.ts` を `exclude` で明示除外
- `packages/components/radio/radio.ts`: `formResetCallback()` でグループ内 default checked を一意に決定して復元
- `packages/components/radio/radio.test.ts`: reset の新規テスト追加

## 受入基準
- [ ] `npm run ci` が成功する
- [ ] `tests/**/*` が実行対象で、`tests/adaptive-card*.test.ts` のみ明示的に除外されている
- [ ] reset 後に同一 `name` グループで checked が複数にならない

