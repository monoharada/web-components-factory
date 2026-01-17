# DADS セレクトボックス（`dads-select`）実装

## 目標
- DADS（HTML版 `select.css`）に準拠したセレクトボックスを Web Components として追加する
- `viewer.html` で既存コンポーネント同等以上のデモ/操作感（エラー・必須・無効・サイズ）を確認できる状態にする

## 背景
- 現状 `packages/components/` に Select が未実装
- 公式の参照元として、DADS HTML版の `select.css`/サンプルHTML、および React版の `aria-disabled` 運用（推奨）を確認済み

## スコープ
- やること：
  - `dads-select` コンポーネント本体（DOM/スタイル/トークン/フォーム参加/バリデーション）
  - `packages/autoload/dads/select.ts`（autoloadアダプター）
  - `viewer.html` の importmap/セレクタ/プリロード、`src/demos.ts` のデモ追加
  - Storybook ストーリー、Vitest テスト追加
- やらないこと：
  - 独自ドロップダウン（非ネイティブ）実装、検索可能select、multi-select対応
  - `dads-form-control-label` 相当の別コンポーネント新設（今回は `dads-select` 内で label/support/error を扱う方針）

## 前提 / 制約
- `<dads-select>…<option>…</option></dads-select>` のように light DOM に置かれた `option/optgroup` を内部 `<select>` に複製する
  - Shadow DOM の slot を `<select>` 直下に置いても options として解釈されない可能性が高いため
- 見た目は DADS HTML版 `select.css` をベースに `::part()` 前提で移植する（色/角丸/hover/focus/error/forced-colors）
- 無効化は DADS React の説明に合わせ、`disabled` と `aria-disabled` を両対応する：
  - `disabled`: ネイティブ disabled（フォーカス不可・送信除外の通常挙動）
  - `aria-disabled`: 見た目は無効＋操作を抑止（Tab移動は許容）＝「readonly相当」の挙動に寄せる

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 新規コンポーネント `dads-select`
  - label/support/error の slot + 属性フォールバック（既存 `dads-input-text`/`dads-textarea` と同等）
  - `<select>` + chevron SVG の構造（DADS `select.css` と同等のスタイル）
  - `size="sm|md|lg"`（高さの切替）
  - `required` + `auto-validate`（submit時に value 空でエラー付与、選択変更でクリア）
  - `error` / `error-text`（外部からの強制エラーも可）
  - `name`/`value`/フォーム送信（Form-Associated Custom Element）
  - `dads-change`（必要なら `dads-input` も）発火
  - `::part()` での外部スタイル上書きが可能な part 設計
- `viewer.html` / `src/demos.ts`
  - セレクトのデモ（基本・サイズ・エラー・必須バリデーション・disabled/aria-disabled・幅例）
  - `a11y-annotate` の注釈表示（既存と同様）

### その他（Docs/Marketing/Infra など）
- `packages/utils/form-component-helpers.ts` の型を `HTMLSelectElement` 対応
  - `updateAriaDescribedBy` / `updateValidationUI` / `showValidationError` の引数型を拡張

## 受入基準
- [ ] `dads-select` が登録され、Shadow DOM 内に `<select>` が存在する
- [ ] DADS HTML版 `select.css` と同等の見た目（border/hover/focus/chevron/error/disabled/forced-colors）になっている
- [ ] `size="sm|md|lg"` で高さが 40/48/56px 相当に切り替わる
- [ ] `<dads-select>` 配下の `option/optgroup` が内部 select に反映され、選択が動作する
- [ ] `name`/`value` がフォーム値として扱われる（変更時に internals の値が更新される）
- [ ] `required` + `auto-validate` で submit 時に未選択ならエラー表示し、選択で解除される
- [ ] `disabled` と `aria-disabled` が両方期待通りに動作する（見た目＋操作性）
- [ ] `viewer.html` のセレクタから Select デモを表示できる
- [ ] Storybook ストーリーが追加され、Vitest が通る

## リスク / エッジケース
- Light DOM の option 更新（属性/テキスト/追加削除）をどこまで追従するか：MutationObserver で追従するが、頻繁な更新時のパフォーマンスに注意
- `aria-disabled` の厳密挙動（Tab は許可、他操作は抑止）の実装がブラウザ差分を生む可能性
- `disabled` 時のフォーム送信仕様（送信除外）が期待と合うか：Form-Associated CE としても disabled を尊重する実装にする
- `value` 属性が存在しない/不正な場合の初期選択（先頭 option になる）を許容する

## 作業項目（Action items）
1. 承認済みPlanを保存（完了条件: `.codex/plans/2026-01-17--feature-select.md` を作成し内容がこのPlanと一致）
2. `packages/components/select/` 追加（完了条件: `select.ts / select-styles.ts / select-tokens.ts / select-define.ts / index.ts` が揃う）
3. options複製・属性同期・イベント/フォーム値更新を実装（完了条件: demo/テストで option/値が同期する）
4. required/auto-validate と error UI を実装（完了条件: submitでエラー→選択で解除が動作）
5. `disabled`/`aria-disabled` の挙動とスタイルを実装（完了条件: viewerデモで差分が確認できる）
6. `packages/utils/form-component-helpers.ts` の型拡張（完了条件: select 実装が共通ヘルパーを利用できる）
7. `packages/autoload/dads/select.ts` と `packages/components/index.ts` を更新（完了条件: importmap 経由で `import('dads-select')` が成功）
8. `viewer.html` と `src/demos.ts` を更新（完了条件: ViewerでSelectデモが表示される）
9. Storybook + Vitest を追加（完了条件: `packages/components/select/select.stories.ts` と `select.test.ts` が追加される）
10. 最低限の検証を実行（完了条件: `npm run type-check` と `npm run test:run` が通る）

## テスト計画
- 単体: `npm run test:run`（`packages/components/select/select.test.ts` を中心に確認）
- 型: `npm run type-check`
- 手動: `bun server.ts` → `http://localhost:3000/?component=select` で表示・操作（required/disabled/error/size/aria-disabled）を確認

## オープンクエスチョン
- 該当なし（DADS HTML版 `select.css` と既存フォーム系コンポーネントの作法に合わせて実装方針を固定）

