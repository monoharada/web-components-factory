# PR #21 レビュー対応（Approve 後の軽微修正）

Approved: 2026-01-14

## Scope
1) Storybook の登録関数を `defineDefaultChipLabel()` に統一
   - 対象: `packages/components/chip-label/chip-label.stories.ts`

2) Chip Label のテストも `defineDefaultChipLabel()` に統一
   - 対象: `packages/components/chip-label/chip-label.test.ts`

3) a11y-annotate のテストを二重定義で落ちないようガード
   - `customElements.define()` の前に `customElements.get()` を確認
   - 対象: `packages/components/annotate/annotate.test.ts`

## Out of scope
- 既存の `tests/adaptive-card*` / `tests/components/typography/dads-text.test.ts` の失敗は PR #21 由来ではないため別対応

## Test plan
- `npm run type-check`
- `npx vitest run packages/components/chip-label/chip-label.test.ts packages/components/annotate/annotate.test.ts`

