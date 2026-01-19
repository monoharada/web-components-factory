# DADS Table：公式Storybookバリエーション対応

## 目標
DADS（デジタル庁デザインシステム）HTML Storybook にある「テーブル／データテーブル」の主要バリエーションを、`<dads-table>` で再現できるようにする（ページ実装で“そのまま貼って動く/使える”利便性も含める）。

## 背景
- 現状の `dads-table` は「ネイティブ `<table>` の見た目 + スクロールシャドウ + 行選択（`data-select-*`） + ソート（`data-sort`） + メニュー（`data-menu`）」は提供できている。
- 一方、DADS 公式 Storybook には **dense / border制御 / colspan・rowspan / indented rows / figcaption caption / 幅・レイアウト固定 / 公式data属性API** など、追加バリエーションが多い。
- 公式CSS（`table.css`相当）を確認すると、`data-*` 属性を中心に表現を切り替える設計になっているため、`<dads-table>` 側も **その属性APIを受け止める** 方向が最短で互換性が高い。

## スコープ
- やること：
  - 公式の属性API（`data-size="dense"`, `data-row-stripe`, `data-row-hover-highlight`, `data-selectable`, `data-border`, `data-cell-border`, `data-bg`, `data-width="full"`, `data-layout="fixed"`）に対応するCSSを追加
  - 既存API（`size/striped/hover/selectable`）は維持しつつ、公式 `data-*` を**エイリアス**として併用できるようにする
  - Storybookストーリー/デモを公式のバリエーション一覧に合わせて増やす
  - 公式HTML例の selectable/sortable で使われる selector（例：`data-js-check*`, `data-js-sort*`）も **JS側で互換対応**（既存の `data-select-*` / `data-sort` も維持）
- やらないこと：
  - ページネーション、仮想スクロール、列リサイズ、固定ヘッダー等の“データグリッド機能”
  - メニュー（縦三点）からの実際のポップオーバー/メニュー表示ロジック（見た目・ボタン配置の互換まで）

## 前提 / 制約
- `<dads-table>` は **light DOM（shadowなし）** を継続（ネイティブ `<table>` の自由度を優先）。
- CSSは `.claude/skills/css-writing-rules` に従い、**変数マッピングは一度だけ**・状態は属性で切替・セレクタは過剰にしない。
- 公式バリエーションに近づけるため、トークンの既定値（padding/line-height等）は調整する可能性がある。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- **トークン調整**：公式 `table.css` に合わせて、padding・line-height・letter-spacing・border色の既定を見直す（必要最小限の追加トークンも検討）。
- **属性API対応（CSS）**
  - `data-size="dense"`（および `size="dense"` / 既存 `size="sm"` の扱いを整理）
  - `data-row-stripe` / `data-row-hover-highlight` / `data-selectable` の見た目切替（既存 `striped/hover/selectable` も同等扱い）
  - `data-width="full"` / `data-layout="fixed"`
  - `data-cell-border`（table/thead/tbody単位で上下左右の線を制御）と `data-border`（tableやcellの外枠/補助線、`hidden`や`*-hidden`含む）
  - `data-bg`（`solid-gray-50/100`, `white`, `transparent`）
  - indented rows 例で使う `dads-u-visually-hidden` 相当を `dads-table` スコープ内で最低限サポート（貼り付け互換のため）
- **互換セレクタ（JS）**
  - 行選択：`data-js-check-all` / `data-js-check` を `data-select-all` / `data-select-row` のエイリアスとして扱う（イベント `dads-selection-change` は継続）
  - ソート：`data-js-sort` / `data-js-sort-header` を `data-sort` のエイリアスとして扱う（`aria-sort`更新と `dads-sort-change` は継続）
- **Storybook拡充**：公式の並びに近い stories を追加（Plain / FirstRowAsHeaderCell / FirstColumnAsHeaderCell / FirstRowAndColumnAsHeaderCell / Dense / Border variants / Colspan / Rowspan / IndentedRows / Stripe / HoverHighlight / Selectable / Sortable(+dense) / LinkedTextInCell / WithCaption / OverflowOnMobile）。

### その他（Docs/Marketing/Infra など）
- Storybook docs に「公式HTML貼り付け互換の `data-*` API」と「既存 `striped/hover/selectable/size` との対応表」を追記。
- 必要なら `src/demos.ts` の table デモも代表例を増やす（ページ実装目線の確認用）。

## 受入基準
- [ ] 公式Storybook相当の主要バリエーションが `<dads-table>` で再現できる（dense / border / rowspan/colspan / indented / caption / overflow / selectable / sortable）。
- [ ] `striped/hover/selectable/size` と `data-row-stripe/data-row-hover-highlight/data-selectable/data-size` が同等に動作する。
- [ ] `data-cell-border` と `data-border` が公式の意図（上下左右/hidden/補助線）で効く。
- [ ] 行選択が `data-select-*` と `data-js-check*` の両方で動き、`dads-selection-change` が発火する。
- [ ] ソートが `data-sort` と `data-js-sort*` の両方で動き、`dads-sort-change` が発火する。
- [ ] `npm run type-check` と `npm run test:run` が通る（必要に応じてテスト追加/更新）。

## リスク / エッジケース
- `:has()` 依存（公式の selectable 見た目等）：`@supports` でガードし、JS同期（`aria-selected`）も併用して破綻しないようにする。
- `figcaption` をコンポーネント内に置くセマンティクス：推奨は `<caption>` だが、貼り付け互換のため見た目だけ対応する方針にする。

## 作業項目（Action items）
1. トークンの既定値を公式 `table.css` に寄せる（完了条件: `table-tokens.ts` でpadding/line-height等が反映され、既存storiesが破綻しない）
2. `data-size`/`data-row-*`/`data-selectable` のCSSエイリアスを追加（完了条件: 公式と同じ `data-*` で見た目が切り替わる）
3. `data-width`/`data-layout` のCSSを追加（完了条件: `full/fixed` 指定で幅・レイアウトが変わる）
4. `data-cell-border`/`data-border`/`data-bg` のCSSを追加（完了条件: border系の公式バリエーション（row/col/rowspan/colspan）が再現できる）
5. indented rows 用の `dads-u-visually-hidden` を `dads-table` スコープで最小実装（完了条件: 公式 indented rows マークアップが表示崩れせず読み上げ意図も満たす）
6. JSで `data-js-check*`（選択）エイリアス対応（完了条件: 公式 selectable マークアップでも select-all/indeterminate が同期しイベント発火）
7. JSで `data-js-sort*`（ソート）エイリアス対応（完了条件: 公式 sortable マークアップでも `aria-sort` 切替とイベント発火）
8. Storybook stories を公式バリエーション分追加（完了条件: stories 一覧が公式に近い粒度で揃い、手動確認できる）
9. テストを追加/更新（完了条件: 互換セレクタ追加分のユニットテストがあり、`npm run test:run` が通る）

## テスト計画
- 自動：`npm run type-check` / `npm run test:run`
- 手動：Storybookで各バリエーションを確認（border/stripe/hover/selectable/sortable/overflow/caption/indented）

## オープンクエスチョン
（承認時に解決）

- `data-cell-border` 未指定時のデフォルト見た目は、**公式どおり「線は属性で出し分け」**とする。
- `size` は `md|sm` を残しつつ、`dense` を正式に追加し、**`sm` は `dense` エイリアス**として扱う。

