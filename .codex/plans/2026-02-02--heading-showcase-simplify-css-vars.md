# Heading Showcase Simplify (CSS Vars Rows)

## 目標
`src/demos/showcase-components.ts` の heading デモ内「CSS vars」テーブルを、直書き行の重複を減らしつつ挙動/出力を変えずに読みやすくする。

## 背景
heading デモは仕様追加に伴い行数が増え、レビューやメンテが難しくなりやすい。`data-api-css-var` などの属性を落とさずに、行生成を関数化して見通しを改善する。

## スコープ
- やること：
  - heading デモの CSS vars 行を「配列 + map」または小さな helper で生成
  - 既存の `data-api-css-var` / `data-default` / label を維持
- やらないこと：
  - 表示内容（文言/順序）や DOM 構造の変更
  - Props/Attrs テーブルの大規模整理（別Mini Plan）

## 前提 / 制約
- 出力HTMLは同等（少なくとも UI / Controls / Usage への影響を出さない）
- helper を新設するなら既存の `src/demos/shared.ts` に寄せ、最小限にする

## 変更内容（案）
### UI / UX
- CSS vars 行を以下のようなデータ構造へ寄せる：
  - `[{ name, defaultCellHtml, desc, controlLabel? }, ...]` を `map()`
- 行HTML生成の小さな関数 `renderCssVarRow(...)` を用意

### その他
- 該当なし

## 受入基準
- [ ] heading デモの CSS vars テーブルが同じ項目/順序で表示される
- [ ] CSS vars の Controls が従来通り効く
- [ ] `npm test` / `npm run validate:wc` / E2E（usage minimal）が通る

## リスク / エッジケース
- `data-api-css-var` / `data-default` の付け忘れで Controls が壊れる
- HTMLのエスケープが必要な値を直書きする場合の取り扱い

## 作業項目（Action items）
1. 対象セクション（heading CSS vars テーブル）を抽出（完了条件: 置換範囲が明確）
2. 行生成の helper を設計/実装（完了条件: 行定義の重複が減る）
3. `npm test` を実行（完了条件: pass）
4. `npm run validate:wc` を実行（完了条件: pass）
5. `npm run test:e2e -- e2e-evidence/heading.usage-minimal.spec.ts`（完了条件: pass）

## テスト計画
- `npm test`
- `npm run validate:wc`
- `npm run test:e2e -- e2e-evidence/heading.usage-minimal.spec.ts`

## オープンクエスチョン
- 該当なし
