# Menu List / Menu List Box：レビューFB対応 Plan

## 目標
`dads-menu-list` / `dads-menu-list-item` / `dads-menu-list-box` に対するレビューFB（正しさ・性能・拡張性）を反映し、既存の公開APIとテストを維持したまま改善する。

## 背景
レビューで以下が指摘された：
- `dads-menu-list-item` の MutationObserver 設定により slot 変更の追従が不十分な可能性
- `href` 指定時（link描画時）に子メニュー（slot="children"）が描画されない
- `dads-menu-list-box` がフォーカス移動ごとに `#syncMenuItems()` を呼び、不要な再バインド/副作用の懸念
- `menu-list-box` が menu item の属性（variant/size/end-icon）を常時上書きしてしまう
- `menuitemselect` が `composed` でない
- CSSの hover メディアクエリ方針の統一（ガイドライン準拠）

## スコープ
- やること：
  - `menu-list-item` の slot/children/link まわりを仕様として一貫させ、テストで担保する
  - `menu-list-box` の roving tabindex を副作用少なく・軽量にする（必要時のみ同期）
  - `menu-list-box` が子要素の明示指定属性を上書きしない（デフォルト適用は「未指定時のみ」）
  - `menuitemselect` のイベント到達性（Shadow DOM越え）を方針に沿って整理
  - hover メディアクエリをプロジェクト方針に合わせる
- やらないこと：
  - `:has()` のフォールバック実装（今回対象外）
  - 依存追加（polyfill導入など）

## 前提 / 制約
- CSSは `!important` 禁止、状態は属性、Shadow DOM は `part` 公開、ネスト最小（`css-writing-rules` 準拠）
- トークンは 3層（Primitive→Semantic→Local `--dads-*`）で管理し、プロパティ割当は1箇所（`headless-component-design` 準拠）
- 既存の公開API/属性/イベントの後方互換を優先（変更が出る場合は明文化＋テスト更新）
- `:has()` は利用する（フォールバック不要）
- `dads-menu-list-item` は `href` 指定時でも子 `<dads-menu-list>` をサポートする

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/menu-list/menu-list.ts`
  - MutationObserver fallback を slot 属性変更も拾えるように修正
  - `href` 指定時の template にも `<slot name="children">` を含める
- `packages/components/menu-list-box/menu-list-box.ts`
  - roving tabindex のために `#syncMenuItems()` を毎回呼ばない（必要タイミングでのみ同期）
  - `dads-menu-list-item` の `variant/size/end-icon` は未指定時のみデフォルト適用
  - `menuitemselect` に `composed: true` を付与

### その他（Docs/Marketing/Infra など）
必要なら最小限の補足ドキュメントを追加（仕様決定の明文化のみ）

## 受入基準
- [ ] `dads-menu-list-item` の link/children が両立し、子メニューが描画される
- [ ] MutationObserver fallback が slot 属性変更を追従できる
- [ ] `dads-menu-list-box` のキーボード操作（Arrow/Home/End）が維持され、不要な再バインドをしない
- [ ] `dads-menu-list-box` が子 `dads-menu-list-item` の明示指定属性を上書きしない
- [ ] `menuitemselect` が Shadow DOM 越えで購読可能（`composed: true`）
- [ ] `npm run type-check` と `npm test` が成功する

## リスク / エッジケース
- template 構造変更で DOM 差分が入り、既存テスト/デモが壊れる可能性
- 同期タイミング変更で、slotchange直後のフォーカス対象解決にズレが出る可能性

## 作業項目（Action items）
1. Plan を保存（完了条件: `.codex/plans/` に承認済みPlanが存在する）
2. `menu-list-item` の link template に children slot を追加（完了条件: link item でも子メニューが描画される）
3. `menu-list-item` の MutationObserver 設定を修正（完了条件: slot属性変更で再同期する）
4. `menu-list-box` の `#syncMenuItems()` 呼び出しを整理（完了条件: focus移動で再バインドしない）
5. `menu-list-box` の item デフォルト適用を「未指定時のみ」に変更（完了条件: 明示指定が保持される）
6. `menuitemselect` に `composed: true` を付与（完了条件: Shadow境界越えで購読できる）
7. hover メディアクエリを方針に合わせて統一（完了条件: `any-hover` などに揃う）
8. テスト追加/更新（完了条件: 仕様の重要点がテストで担保される）
9. `npm run type-check` と `npm test` を実行（完了条件: 両方成功）

## テスト計画
- `npm run type-check`
- `npm test`
- viewer で `Menu List` / `Menu List Box` を目視確認（open/close・矢印移動・選択イベント）

## オープンクエスチョン
該当なし（承認時に解消済み）
