# Heading: a11y-annotate を type 切替で見れるようにする（dads-select + type別コールアウト）

## 目標
- 見出しデモの「アクセシビリティ注釈（a11y-annotate）」で、`type="default|shoulder|icon|chip"` を `dads-select` で切り替えて表示できる
- 切り替えた `type` に応じて、該当パーツ（heading / shoulder / icon / chip）に適切な注釈コールアウトが出る（不要なコールアウトは出ない）

## 背景
- `a11y-annotate` は注釈対象要素（target）の `a11yAnnotations` を読み、`callouts[].target` の selector を解決してコールアウトを描画する
- `a11y-annotate` は target内の要素が `display:none` / `hidden` / 空スロット等の場合、コールアウト対象としてスキップする実装になっている（= 見せたい要素を「実際に表示」させるのが重要）
- 現在の `dads-heading` の注釈は type 別（shoulder/icon/chip）の“見せ分け”ができていない

## スコープ
- やること：
  - Headingデモ（注釈セクション）に `dads-select` を追加し、type を切り替えられるようにする（注釈枠の外に配置）
  - `dads-heading` の `a11yAnnotations.callouts` を type別に充実（heading / shoulder / icon / chip）
  - chip は擬似要素のため、注釈の“アンカー”用に shadow 内に marker パーツを追加して、`type="chip"` の時だけ表示する
- やらないこと：
  - `a11y-annotate` 自体の仕組み変更（コールアウトのフィルタリングロジック追加等）
  - Headingの見た目調整（デザインフィデリティ改善は別タスク）

## 前提 / 制約
- `a11y-annotate` のコールアウト対象判定は `display:none` / `hidden` を考慮するため、type別に見せたいパーツは実際に表示されている必要がある
- chip は現状 `::before` で描画しており selector で直接参照できない（= marker が必要）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
**Headingデモ（注釈セクション）**
- `src/demos/showcase-components.ts` の heading セクション内に `dads-select` を追加（注釈枠の外）
- `dads-change` で注釈対象の `<dads-heading>` を更新
  - `type` 属性を書き換える
  - `type="shoulder"` の時だけ shoulder slot ノードを追加（それ以外は remove）
  - `type="icon"` の時だけ icon slot ノードを追加（それ以外は remove）
- heading デモの module script に `import('dads-select')` を追加

**`dads-heading` の a11yAnnotations（type別パーツ向け）**
- `packages/components/heading/heading.ts` の `a11yAnnotations.callouts` を追加/拡張
  - heading: `[part="heading"]`
  - shoulder: `[part="shoulder"]`
  - icon: `[part="icon"]`
  - chip: marker part（例: `[part="chip"]`）

**chip marker（注釈アンカー用）**
- `packages/components/heading/heading.ts` の template に marker 要素を追加
- `packages/components/heading/heading-styles.ts` で marker を type="chip" の時だけ renderable にする（bbox が取れるように）

### その他（Docs/Marketing/Infra など）
- `custom-elements.json` 更新（`npm run cem:analyze`）

## 受入基準
- [ ] 見出しデモの注釈セクションに `dads-select` があり、type を選べる
- [ ] type を切り替えると `a11y-annotate` のコールアウトが type に応じて変わる
  - [ ] default: heading の注釈のみ
  - [ ] shoulder: shoulder と heading の注釈
  - [ ] icon: icon と heading の注釈
  - [ ] chip: chip（marker）と heading の注釈
- [ ] `npm run type-check` が通る
- [ ] `npx vitest run --cache=false packages/components/heading/heading.test.ts` が通る
- [ ] `npm run cem:analyze` 後、`custom-elements.json` が更新される

## リスク / エッジケース
- 目に見えない（bboxが取れない）markerだとコールアウトが出ない
  - 対策: marker は `display:none` ではなく bbox が取れる表示状態にする（透明 + width/top/bottom）
- slot ノードを残したまま type を変えると、意図しない callout が出る可能性
  - 対策: type 切替時に不要 slot ノードを remove して確実に対象外にする

## 作業項目（Action items）
1. `dads-heading` の callouts 設計（heading/shoulder/icon/chip の文言と target selector）。（完了条件: callouts の一覧が決まる）
2. chip marker の追加（template + styles）。（完了条件: `type="chip"` の時だけ marker が renderable）
3. `dads-heading` の `a11yAnnotations.callouts` を実装。（完了条件: marker/shoulder/icon を参照するcalloutが増える）
4. Headingデモ注釈セクションに `dads-select` を追加し、`dads-change` で type と slot 構造を差し替える。（完了条件: UI操作で注釈対象が切替わる）
5. `npm run type-check` / heading test / `npm run cem:analyze` を実行。（完了条件: 受入基準を満たす）

## テスト計画
- `npx vitest run --cache=false packages/components/heading/heading.test.ts`
- `npm run type-check`
- `npm run cem:analyze`
- viewer目視（Heading → アクセシビリティ注釈で type 切替）

## オープンクエスチョン
該当なし

