# a11y改善（`dads-date-picker` / `dads-calendar`）

## Context
- `dads-date-picker` のカレンダーポップオーバー（`role="dialog"`）で、Tabキー操作時のフォーカストラップが不完全になり得る。
  - `dads-calendar` 内の `dads-button` は Shadow DOM 内部に実フォーカス要素（`<button>`）があるため、単純な `querySelectorAll` だと取得できず、フォーカストラップの先頭/末尾判定が崩れる可能性がある。
- `dads-calendar` がデフォルトで `role="application"` を付与しているが、これは不要（ユーザー要望）かつ一般にスクリーンリーダー操作性を下げうる。

## Goal
- ダイアログ内で Tab / Shift+Tab のフォーカストラップが安定して動作する（`dads-button` 等の Shadow DOM 内フォーカス要素も含めて判定）。
- `dads-calendar` の `role="application"` 自動付与を削除する（必要なら利用側で付与できる）。

## Scope
- やること
  - `dads-date-picker` のフォーカストラップ対象要素取得を「Shadow DOM を辿る」方式に変更
  - `dads-calendar` の `role="application"` 自動付与を削除
  - 必要最小限のテスト追加（フォーカストラップの境界ケース、role自動付与なし）
- やらないこと
  - 日付セルの `aria-selected` 付与位置など、ARIA設計の大幅変更

## Implementation outline
1. `dads-date-picker`: ダイアログ直下から DOM + Shadow DOM を DFS して tabbable 要素を列挙し、先頭/末尾に基づいて Tab をループ
2. `dads-calendar`: `connectedCallback()` の `role="application"` 自動付与を削除
3. テスト: Vitest で「末尾→Tabで先頭へ」「先頭→Shift+Tabで末尾へ」「roleが勝手に付かない」を確認

## Test plan
- `npm run test:run -- packages/components/date-picker/date-picker.test.ts packages/components/calendar/calendar.test.ts`

