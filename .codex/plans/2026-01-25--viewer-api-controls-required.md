# viewer APIテーブルを「操作可能」必須化 + `dads-search-box` 対応 Plan

## 目標
- viewer の「APIテーブル」は **実際に値を変更できる（Controlsがある）**ことを必須要件として **ルール化**する
- ルール化の後、`dads-search-box` の API セクションも **操作可能なAPI/Controlsパネル**へ修正する

## 背景
- フィードバック: 「APIテーブルは実際に値を変更できないと（必須）」「ルール化して本件も修正してほしい」
- 既に viewer 側には `bindApiControls()`（`src/viewer-api-controls.ts`）と作例（`src/demos.ts` の Button）が存在するため、これを標準パターンとして採用できる

## スコープ
- やること：
  - **ルール（DoD）**に「操作可能なAPIテーブル（Controls）必須」を追記し、参照先を明確化する
  - `dads-search-box` デモの API セクションを **操作可能**（`data-api-*` + `bindApiControls()`）に更新する
  - `dads-search-box` の Controls に「検索対象 option の有無（Light DOM children）」を含める
- やらないこと：
  - 既存全デモの追従（別タスク）
  - CIでの機械的強制（lint/test追加）までは行わない（まずはドキュメントルール化で運用を固める）

## 前提 / 制約
- viewer の Controls 仕様は `docs/knowledge/viewer-api-controls-table.md` と `src/viewer-api-controls.ts` を正とする
- デモHTMLは `innerHTML` 差し替えのため、Controls 初期化は Button と同様に `document.currentScript.parentElement` でスコープを閉じる
- `validate:wc` の対象は `viewer.html` と `src/demos.ts`（`wc.config.js`）なので、デモ記述は CEM 整合と同等に重要

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `dads-search-box` デモに「API / Controls」パネルを追加（現行 API 節を置換）
  - Preview に `data-api-target` の `<dads-search-box>` を置く
  - Props/Attrs テーブルに `Control` 列を追加し、`dads-input-text` / `dads-switch` / ネイティブ要素で変更できるようにする
  - CSS vars テーブルも `data-api-css-var` で変更可能にする
  - 「検索対象 option の有無」切り替えは `data-api-*` ではなく、デモ側スクリプトで Light DOM children（`option/optgroup`）を追加/削除する

### その他（Docs/Marketing/Infra など）
- `docs/rules/new-component-dod.md` の (D) Demos に「操作可能なAPI / Controls必須」を追加し、`docs/knowledge/viewer-api-controls-table.md` へ誘導する
- DoD のコピペ用チェックリストにも同項目を追加する

## 受入基準
- [ ] `docs/rules/new-component-dod.md` に「操作可能なAPIテーブル（Controls）必須」が明記されている
- [ ] `dads-search-box` デモの API テーブルで、主要項目が **UI操作で変更でき、Previewに反映**される
- [ ] `dads-search-box` の Controls に「検索対象 option の有無（Light DOM children）」があり、切り替えで scope UI が出し分けされる
- [ ] CSS vars も 1つ以上 UI操作で変更でき、Previewに反映される
- [ ] `npm run validate:wc` が通る
- [ ] `npm run ci` が通る

## 作業項目（Action items）
1. DoD に要件追記（完了条件: `docs/rules/new-component-dod.md` に必須要件と参照が追加されている）
2. DoD のコピペ用チェックリスト更新（完了条件: チェックリストに同項目が追加されている）
3. `dads-search-box` デモの API 節を “API / Controls” パネルに置換（完了条件: Preview + Props/Attrs(Controls列) + CSS vars(Controls列) を持つ）
4. `bindApiControls()` で接続（完了条件: `data-api-*` の変更で Preview が更新される）
5. Light DOM children（scope option）切替を追加（完了条件: 切替で scope UI と FormData の内容が変化する）
6. `npm run validate:wc`（完了条件: no issues）
7. `npm run ci`（完了条件: type-check/test/build が通る）

## テスト計画
- viewer で `?component=searchBox` を開き、API/Controls の入力変更 → Preview反映を確認
- `npm run validate:wc`
- `npm run ci`

