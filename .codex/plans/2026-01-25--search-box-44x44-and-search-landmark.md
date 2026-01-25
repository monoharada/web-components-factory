# dads-search-box: 44x44必達 + searchランドマーク両対応

## 目標
- `dads-search-box` 内の操作要素（scope select / query input / submit button）が **44x44px相当以上** になることをデフォルトで担保する。
- `role="search"`（searchランドマーク）を **`<dads-search-box>` 側でも `<form>` 側でも** 付与できる（どちらも正としてドキュメント化する）。

## 背景
- 現状、`[part="input"]` と `[part="scope-select"]` は padding 依存で、結果として **44px未満になり得る**（WCAG 2.2 / Target Size へのリスク）。
- searchランドマークは、実装側で `<form role="search">` に寄せる流儀と、コンポーネントをランドマークにする流儀が混在しがちなので、両方の使い方を明確化したい。

## スコープ
- やること：
  - `search-box` の CSS/トークンで min-size を設計し、44px相当を満たす
  - `role="search"` の付与パターン（コンポーネント/フォーム）を docs・a11y注釈・デモで明示
  - 必要なら e2e で実測（bounding box）を追加
- やらないこと：
  - 検索補完やオーバーレイUIなどの機能追加
  - 既存イベント（`dads-input`/`dads-change`/`dads-search`）の仕様変更

## 前提 / 制約
- 44x44 の「必達」は **デフォルトスタイルで担保**する（利用者が CSS で上書きして小さくすることまでは防げない）。
- `role` はグローバル属性として validator 的にも許容される（`scripts/wc/validator-core.mjs` で allow 済み）。
- `focus-visible` 前提の設計は維持（必要ならフォールバック検討は「リスク」に含める）。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 44x44 必達
  - `packages/components/search-box/search-box-tokens.ts` に min-height 系のトークンを追加（例：`--dads-search-box-control-min-height: calc(44/16*1rem)`）
  - `packages/components/search-box/search-box-styles.ts` で `[part="input"]` と `[part="scope-select"]` に `min-height`（必要なら `min-width` も）を適用
  - submit button は現状 `dads-button size="large"` だが、必達要件として必要なら `::part(base)` への `min-height` も検討
- searchランドマーク両対応
  - **実装は最小**：コンポーネント側は `role="search"` をそのまま許容（追加APIは基本なし）
  - ドキュメント/注釈/デモで以下を明記
    - パターンA: `<form role="search"> ... <dads-search-box> ...`
    - パターンB: `<dads-search-box role="search"> ...`（フォーム側には付与しない）
    - 同一ページに複数ある場合は `aria-label` / `aria-labelledby` による命名推奨

### その他（Docs/Marketing/Infra など）
- `packages/components/search-box/search-box.ts` の JSDoc（a11yAnnotations含む）を更新
- `src/demos.ts` の search-box セクションに両パターン例を追加/調整
- CEM運用に従い、必要なら `npm run cem:analyze` で `custom-elements.json` を更新

## 受入基準
- [ ] `dads-search-box` の input / scope-select / button がデフォルトで **高さ44px相当以上**（e2e実測 or 手動検証手順を残す）
- [ ] `role="search"` を **フォーム側/コンポーネント側**どちらで付与しても成立し、`npm run validate:wc` で警告が増えない
- [ ] `npm run test:run` / `npm run type-check` がパスする
- [ ] 必要に応じて `npm run cem:analyze` 後の差分が整合する

## リスク / エッジケース
- min-height 追加でアイコン位置や余白が微妙に変わる可能性（特に scope 側のラベル位置）
- `:focus { outline:none }` + `:focus-visible` 設計のため、`@supports not selector(:focus-visible)` を求めるブラウザ方針次第で追加検討が必要
- `<form role="search">` と `<dads-search-box role="search">` を併用するとランドマークが重複する（Docsで注意喚起）

## 作業項目（Action items）
1. トークン追加（完了条件: `search-box-tokens.ts` に min-height 用ローカルトークンが追加される）
2. input/scope-select の min-height 適用（完了条件: `search-box-styles.ts` に 44px相当以上のスタイルが入る）
3. button の 44x44 確認と必要なら補強（完了条件: ボタンもデフォルトで44px相当以上と確認できる）
4. searchランドマークの docs/a11y注釈更新（完了条件: 2パターンが `search-box.ts` の説明に明記される）
5. デモ更新（完了条件: `src/demos.ts` に両パターン例があり、表示が崩れない）
6. テスト追加/更新（完了条件: 可能なら Playwright で高さ実測、難しければ手動検証手順を明文化）
7. 検証コマンド実行（完了条件: `test:run`/`type-check`/`validate:wc` が通る）
8. CEM更新（完了条件: `npm run cem:analyze` 実行後の差分が意図通り）

## テスト計画
- 自動: `npm run test:run` / `npm run type-check` / `npm run validate:wc`
- e2e（可能なら）: Playwrightで `dads-search-box` 内の `input/select/button` の `boundingBox().height >= 44` を確認
- 手動: デモ（`src/demos.ts` の search-box）でズーム/フォーカス表示/キーボード操作の確認

## オープンクエスチョン
- 該当なし

