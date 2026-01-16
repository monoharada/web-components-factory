# 日付ピッカー／カレンダー（`dads-date-picker` / `dads-calendar`）追加

## Context
- デジタル庁 DADS の「日付ピッカー／カレンダー」を、このリポジトリの Web Components として実装したい
- `viewer.html` で確実に表示・操作できることが最重要（Storybook は作らない）
- 既存コンポーネント（フォーム系・Shadow DOM・`::part`・トークン適用・a11y注釈）と実装方針を揃える

## Scope
- やること
  - `packages/components/date-picker/` に `dads-date-picker` を追加（Consolidated / Separated 両対応）
  - `packages/components/calendar/` に `dads-calendar` を追加（`min-date` / `max-date`、キーボード操作、`date-selected`）
  - DADS HTML版の `date-picker.css` / `calendar.css` / `select.css` 相当を Shadow DOM 向けに移植（既存のトークン/リセットの使い方に合わせる）
  - ポップアップ（カレンダー）: 開閉、Escで閉じる、Tabフォーカストラップ、閉じた後にボタンへフォーカス戻し
  - `viewer.html` の importmap / selector / preload と `src/demos.ts` を更新して Viewer から選べるようにする
  - `a11yAnnotations` を `dads-date-picker` / `dads-calendar` に付与（a11y-annotate で確認できる）
  - Vitest で最低限のレンダリング/挙動テストを追加
- やらないこと
  - Storybook の追加・更新
  - 入力値の自動バリデーション機構（UI側で勝手に error を出す等）は入れない（ただし `error` 属性による状態表示は実装）

## Spec（予定）
### `dads-date-picker`
- 表示タイプ: `data-type="consolidated" | "separated"`（default: `consolidated`）
- サイズ: `size="sm|md|lg"`（default: `md`）
- カレンダー表示: `calendar`（boolean、default: OFF）
- 状態: `disabled` / `readonly` / `error`
- 連携: `min-date` / `max-date` を内部の `dads-calendar` に転送（カレンダー有効時）
- 内部入力: 年/月/日 input（`inputmode="numeric"` + `pattern="[0-9]+"`）、DADS準拠のフォーカス/ホバー/エラー表示
- ARIA: `aria-invalid="true"` と `aria-describedby`（ホストの `aria-describedby` も含めて）を各入力に反映
- イベント: `dads-input` / `dads-change`

### `dads-calendar`
- 属性: `min-date="YYYY-MM-DD"` / `max-date="YYYY-MM-DD"`
- 操作: 月移動（前/次）、年セलेकタ、今日、削除、グリッド内矢印キー移動、フォーカス制御
- イベント: `date-selected`（`detail.date: Date | null`、`bubbles: true`）
- 公開メソッド: `setSelectedDate()` / `setDisplayMonth()` / `focus()`

## Action items
1. `packages/components/calendar/` を追加（`calendar.ts` / `calendar-styles.ts` / `calendar-define.ts` / `index.ts`）
2. `packages/components/date-picker/` を追加（`date-picker.ts` / `date-picker-styles.ts` / `date-picker-define.ts` / `index.ts`）
3. `packages/autoload/dads/calendar.ts` / `packages/autoload/dads/date-picker.ts` を追加
4. `packages/components/index.ts` に export を追加
5. `viewer.html` に importmap/selector/preload を追加
6. `src/demos.ts` にデモを追加
7. Vitest のテストを追加

## Test plan
- `npm run type-check`
- `npm run test:run`
- `bun server.ts` → `viewer.html` で Date Picker / Calendar を手動確認

