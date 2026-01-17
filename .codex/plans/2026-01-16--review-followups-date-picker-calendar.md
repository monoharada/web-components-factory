# レビュー対応（`dads-date-picker` / `dads-calendar`）

Approved: 2026-01-16

## Context
- `dads-date-picker` / `dads-calendar` に対して、フォーカス復帰・日付パース・disabled 表現・CSS 互換性・入力の厳格化に関する指摘が入ったため対応する。

## Decisions（レビュー質問の回答）
- `dads-date-picker` の年入力は 4 桁必須（`24` は無効）。
- `dads-calendar` の当月内の範囲外日付は **非表示ではなく disabled 表示**（日付が欠けない方がアクセシブル）。

## Scope
1) `dads-date-picker`: `#closeCalendar()` のフォーカス復帰を「実際に開いていた」かつ「ユーザー操作起因」のみに限定
2) `dads-calendar`: `min-date` / `max-date` の ISO 日付パースで「実在しない日付」を reject
3) `dads-calendar`: 当月外のみ非表示にし、当月内の範囲外は disabled 表示へ
4) `dads-date-picker` styles: `align-items: end` を `flex-end` に変更し、`:has()` を使用しない表現へ
5) `dads-date-picker`: 年/月/日のパースを strict にし、年は 4 桁必須にする

## Test plan
- `npm run type-check`
- `npm run test:run -- packages/components/date-picker/date-picker.test.ts packages/components/calendar/calendar.test.ts`

