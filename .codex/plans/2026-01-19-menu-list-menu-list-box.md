# Menu List / Menu List Box（Figma + DADS準拠）実装 Plan

## 目標
Figma（Menu List Items / Select List Default）および DADS（デジタル庁デザインシステム）HTML版の仕様に合わせて、Web Components として **メニューリスト**と **メニューリストボックス** を追加する。

## 背景
- 参照デザイン（Figma）:
  - `8268-30420` / `8268-30421`: Standard / Menu List Items, Boxed / Menu List Items
  - `8268-31235`: Select List Default（メニューリストボックス相当の見た目・スクロール例）
- DADS HTML版（上流）:
  - `menu-list.css`: サイズ/hover/current/focus/indent の定義
  - `menu-list-box.css` + `menu-list-box.js`: opener + popup の開閉、キーボード操作（矢印/Home/End/Escape）、外側クリックでのクローズ、`menuitemselect` イベント

## スコープ
- やること：
  - `dads-menu-list` と `dads-menu-list-item` を追加（standard/box、regular/small、current、expanded、indent）
  - `dads-menu-list-box` を追加（opener + popup + menuitems / open-close / keyboard / click-outside / escape / `menuitemselect`）
  - tokens/styles/define/stories/tests/export まで一通り揃える
- やらないこと：
  - Figma `8268-31234` の「Openers」セクションを個別コンポーネントとして実装（menu-list-box 内の opener は実装対象）

## 前提 / 制約
- CSS: `!important` 禁止、Shadow DOM 内は `part` 公開、状態は属性（例: `[open]` / `[current]`）で表現
- トークン: 3層（Primitive→Semantic→Local `--dads-*`）を基本とし、プロパティ割当は1箇所に集約
- 既存の `applyDADSTokens()` / `applySpacingTokens()` / `withReset()` を使用

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `dads-menu-list`
  - role="list" 相当のコンテナ（slotで item を受ける）
  - indentation は CSS変数 `--menu-list-indentation`（DADS互換）を採用し、必要なら属性からも設定
- `dads-menu-list-item`
  - 内部は `<button>` か `<a>`（`href` があれば link）
  - 見た目: DADS `menu-list.css` に準拠（hover/current/focus/indent/expanded）
  - アイコンは slot（start/tail/end）で差し替え可能、既定の end-icon は矢印、tail-icon は任意で表示
- `dads-menu-list-box`
  - opener: size(sm/md), variant(text/outlined/filled), bold、arrow回転
  - popup: border + radius + `--elevation-1`、max-height + overflow-y auto
  - open/close: click / keydown / click-outside / focusout / escape
  - menu キーボード: ArrowUp/Down/Home/End（roving tabindex）
  - 選択: menu item click で `menuitemselect` を dispatch（detail に item/value/index）

### その他（Docs/Marketing/Infra など）
- Storybook 追加
- Vitest 追加
- `packages/components/index.ts` への export 追加

## 受入基準
- [ ] `dads-menu-list-item` が `variant="standard|box"` と `size="regular|small"` を切替できる
- [ ] hover/current/focus/indent/expanded の見た目が DADS `menu-list.css` と一致する（許容差はブラウザ差の範囲）
- [ ] `dads-menu-list-box` が opener + popup を持ち、DADS `menu-list-box.js` 相当の操作（クリック/矢印/Escape/外側クリック）で動作する
- [ ] `menuitemselect` が期待の detail（item/value/index）で発火し、発火後に閉じて opener にフォーカス復帰する
- [ ] `--dads-*` のローカルトークンが用意され、外部から上書き可能
- [ ] `npm run type-check` / `npm run test:run` が通る

## リスク / エッジケース
- `:has()` を使う「子に current がある親項目のハイライト」はブラウザ差があり得る（DADSも採用しているため基本は同様）
- スクロールバー見た目はOS/ブラウザ差が大きく、完全一致が難しい

## 作業項目（Action items）
1. Plan保存（完了条件: `.codex/plans/` に承認済み plan が保存されている）
2. `menu-list` 実装（完了条件: define/export/stories/tests まで揃う）
3. `menu-list-box` 実装（完了条件: define/export/stories/tests まで揃う）
4. 検証（完了条件: typecheck + vitest が green）

## テスト計画
- 自動: `npm run type-check`, `npm run test:run`
- 手動: Storybook で hover/focus/open/keyboard を確認

## オープンクエスチョン
なし

