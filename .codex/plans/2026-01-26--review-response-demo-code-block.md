# Review対応: demo-code-block 検証の安定化 + `dads-code-block` 初期表示改善

## 目標
- CI の `validate:demo-code-block` を確実にパスさせる（`searchBox` も含めて Usage code block を強制）
- `dads-code-block` のステータス領域が idle 時に完全に非表示になるようにする
- 併せて、検証スクリプト/デモの脆さを最小差分で解消する

## 背景
- 新規 CI ステップ `npm run validate:demo-code-block` が追加されたが、baseline が `searchBox` を含まず “新規扱い” となるため失敗している
- `dads-code-block` は初期接続時に `data-copy-result="idle"` を付与していないため、ステータス領域が空白スペースとして見える可能性がある
- `validate-demo-code-block.mjs` の末尾 slice が `text.length` まで伸びるため、将来の変更で誤判定しうる
- `src/demos.ts` の一部 `<script>` ブロックにインデントの乱れがある

## スコープ
- やること：
  - `searchBox` デモに Usage（HTML）コードブロック（`<dads-code-block data-api-code>`）を追加し、CI で必須化する
  - `packages/components/code-block/code-block.ts` の idle 時ステータスを完全に非表示にする
  - `scripts/wc/validate-demo-code-block.mjs` のチェック範囲を demos オブジェクト内に限定して堅牢化する
  - `src/demos.ts` の該当 `<script>` インデントを整える（差分最小）
- やらないこと：
  - 既存すべてのデモに `<dads-code-block>` を一斉追加（今回のCI方針と逆行するため）
  - シンタックスハイライト導入等の拡張

## 前提 / 制約
- 変更は最小限・レビューしやすい差分に留める
- CEM（`custom-elements.json`）は “単一の真実” のため、コンポーネント実装変更が入る場合は `npm run cem:analyze` で差分を揃える
- CI観点で最低限 `npm run validate:demo-code-block` / `npm run validate:wc` / `npm run ci` を通す

## 変更内容（案）
### データ / バックエンド
- `validate-demo-code-block.mjs` の slice 範囲を demos オブジェクト終端に制限する

### UI / UX
- `searchBox` デモに Usage（HTML）コードブロックを追加（`import('dads-code-block')` を含む）
- `dads-code-block` は idle 時にステータス領域を完全に隠し、copy 成功/失敗時のみ表示する

### その他（Docs/Marketing/Infra など）
- `src/demos.ts` の該当 `<script>` ブロックのインデントを整形（差分最小）

## 受入基準
- [ ] `searchBox` デモに `<dads-code-block ...>` が含まれている
- [ ] `npm run validate:demo-code-block` がパスする
- [ ] `dads-code-block` の初期表示でステータス領域が見えない（success/error 時のみ表示）
- [ ] `validate-demo-code-block.mjs` が demos オブジェクト外の文字列に影響されず判定できる
- [ ] `npm run validate:wc` と `npm run ci` がパスする

## リスク / エッジケース
- `validate-demo-code-block.mjs` のキー抽出は `key: () =>` の形に依存しているため、`src/demos.ts` の書き方が変わると検出が壊れる可能性
- `dads-code-block` のステータス非表示は a11y（aria-live）通知に影響しないよう注意（DOMは残して表示制御のみ）

## 作業項目（Action items）
1. `searchBox` デモに Usage code block と import を追加（完了条件: `searchBox` の slice に `<dads-code-block` が含まれる）
2. `validate-demo-code-block.mjs` の末尾 slice を demos 終端に制限（完了条件: 最後のキーでもファイル末尾まで読まない）
3. `dads-code-block` の idle 時ステータス非表示を保証（完了条件: `data-copy-result="idle"` が初期付与されるか、CSS が default 非表示）
4. `src/demos.ts` の `<script>` インデントを整える（完了条件: タブ混在がなくなる）
5. `npm run validate:demo-code-block` / `npm run validate:wc` / `npm run ci`（完了条件: すべてパス）
6. （必要なら）`npm run cem:analyze` → `custom-elements.json` 差分整合（完了条件: CEM が実装に追従している）

## テスト計画
- 重点: `npm run validate:demo-code-block`（今回の主原因の再発防止）
- 併せて: `npm run validate:wc` / `npm run ci`
- UI確認（任意）: viewer で `dads-code-block` の初期表示・Copy成功/失敗時の表示/aria-live を目視

## オープンクエスチョン
該当なし

