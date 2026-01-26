# `src/demos.ts` の分割（entry維持）+ 共有 helper 抽出

## 目標

- `src/demos.ts` を複数ファイルに分割し、読みやすさ・差分のレビュー容易性を上げる
- `viewer.html` の importmap（`/src/demos.js`）互換を維持する（entry は `src/demos.ts` のまま）
- `validate:wc` の検証対象から漏れないようにする（`wc.config.js` の include を明示更新）
- 仕様/挙動は変えない（デモの見た目・Controls の追従・Code block 生成）

## 背景 / 制約

- `viewer.html` は `@demos` を `/src/demos.js` に向けているが、`bun server.ts` が `.js -> .ts` を解決するため、entry を `src/demos.ts` に残す必要がある
- `validate:wc` は include の glob を解釈しないため、分割後のファイルは `wc.config.js` で個別に列挙する
- `<script>` は `innerHTML` の差し替え後に再実行されるため、`document.currentScript` 起点のスコープ化を維持する

## スコープ

- やること：
  - 共有 helper（A11y トグル、API Panel 初期化、共通 HTML 断片）を `src/demos/shared.ts` に移動
  - デモ定義を `src/demos/*.ts` に分割し、`src/demos.ts` は `export const demos = { ... }` の集約のみ残す
  - `wc.config.js` の include に分割ファイルを追加
- やらないこと：
  - デモの UI/構造の追加変更（機能追加や大幅な見た目変更）
  - Fidelity/Validation 系デモの整理（今回は対象外）

## 受入基準

- [ ] `viewer.html` でデモが今まで通り表示される（`@demos` の export が維持される）
- [ ] `npm run validate:wc` がパスする
- [ ] `npm run type-check` / `npm run test:run` がパスする
- [ ] 差分が “移動/分割” 中心で、内容変更が最小限

## 作業項目

1. `src/demos/shared.ts` を作成（共通 helper/const を移動）
2. `src/demos/*.ts` を作成し、デモ定義をカテゴリ単位で分割
3. `src/demos.ts` を entry として残し、分割モジュールを import して `demos` を合成
4. `wc.config.js` の include に分割ファイルを列挙
5. `npm run validate:wc` / `npm run type-check` / `npm run test:run`

