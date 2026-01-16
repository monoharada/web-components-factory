# a11yテスト拡充（キーボード操作中心: `dads-date-picker` / `dads-calendar`）

## Context
- `dads-date-picker` のカレンダーポップオーバー（`role="dialog"`）は、Tab/Shift+Tab のフォーカストラップや Esc でのクローズなど、キーボード操作の回帰が起きやすい。
- `dads-calendar` は矢印キーでの日付移動・表示月更新・min/max境界の制御など、キーボード操作と ARIA ラベルの整合性が重要。
- 依存追加（axe-core / Playwright）なしで、Vitest + happy-dom のユニットテストとして回帰を担保する。

## Goal
- キーボード操作（左右キー/矢印キー/Tabトラップ/Esc）と、主要なARIA（`aria-expanded`/`aria-label`/`aria-disabled`/`aria-invalid`/`aria-describedby`）の回帰を自動テストで検知できるようにする。

## Scope
- やること
  - `packages/components/date-picker/date-picker.test.ts` に a11y/キーボード系テストを追加
  - `packages/components/calendar/calendar.test.ts` に a11y/キーボード系テストを追加
- やらないこと
  - 依存追加（axe-core 等）やブラウザE2Eの追加
  - 視覚（コントラスト等）の自動テスト

## Test cases
### `dads-date-picker`
- Consolidatedタイプ: 年/月/日 input の左右キー移動（caret境界でフォーカス移動）
- ポップオーバー: Escで閉じる + トリガーボタンへフォーカス復帰
- ポップオーバー: Tab/Shift+Tab のフォーカストラップ（Shadow DOM内実フォーカス要素を含む）
- error時: 各inputへ `aria-invalid="true"` と `aria-describedby`（外部 + error-text）の反映

### `dads-calendar`
- デフォルトで `role` を付与しない
- 表示月の更新でホスト/テーブルの `aria-label` が更新される
- 矢印キーで日付移動（同月内 / 月またぎ）
- min/max 境界で移動しない（フォーカス/表示月が変わらない）
- prev/next月ボタンの `aria-disabled` が境界で適切に切り替わる
- `focus()` が `[tabindex="0"]` にフォーカスする

## Verification
- `npm run test:run -- packages/components/date-picker/date-picker.test.ts packages/components/calendar/calendar.test.ts`
- （必要なら）`npm run type-check`

