# GitHub Pages でのモジュール 404（`utils/dom`）と `@import` エラー修正

## Context
- 現状 `https://monoharada.github.io/web-components-factory/?component=switch` で以下が発生
  - `GET /web-components-factory/utils/dom 404`（`utils/dom.js` は存在するが `utils/dom` が無い）
  - それに起因して `dads-switch` の dynamic import が失敗しているように見える
  - `@import rules are not allowed here`（Constructable Stylesheets に `@import` を入れているため）
- 実体として、デプロイ済み `utils/behaviors.js` 先頭が `import { isNotWhitespace } from './dom';` になっており、GitHub Pages（静的配信）では拡張子無しパスが解決できないのが根因

## Scope
- やること：
  - `dist-pages` に出る ESM の相対 import を「`.js` 拡張子付き」に揃えて 404 を止める
  - Constructable Stylesheets 内の `@import` を撤去し、フォントは `link rel="stylesheet"` 経由に寄せる
  - （任意）favicon の 404 ノイズを消す
- やらないこと：
  - GitHub Pages 側の設定変更（ルーティング/リライト等）に依存する解決
  - bundler 導入など大規模なビルド刷新

## Assumptions
- Pages 生成は `scripts/build-pages.cjs`（`npm run pages:build`）が唯一の正で、GitHub Actions もそれを実行している
- `packages/**` の多くは既に TS から `.js` 拡張子付き import を書く方針（例: `../../core/web-components.js`）で運用しているため、今回もその方針に揃える

## Risks / Edge cases
- `.js` 拡張子を TS ソースに入れる変更が、他の実行環境（Node/bundler）での解決挙動に影響する可能性（ただし現状すでに同形式が多数ある）
- `@import` を撤去すると「外部で `fontImport` を直接使っていた」ケースがあれば挙動が変わる（互換のため no-op にする等の配慮が必要）
- 既に登録済みの Service Worker / ブラウザキャッシュが古い JS を握っている場合、修正後も一時的に再現する（ハードリロード/キャッシュ削除が必要）

## Action items
1. 失敗チェーンを確定する（完了条件: `utils/behaviors.js` が `./dom` を import しており、その結果 `utils/dom` が 404 になっていることを根拠付きで示せる）
2. `packages/utils/behaviors.ts` の import を `./dom.js` に修正する（完了条件: ビルド後 `dist-pages/utils/behaviors.js` が `./dom.js` を import し、`/utils/dom` へのリクエストが消える）
3. Pages 出力対象（`packages/{core,utils,styles,components,autoload}/**/*.ts`）の「拡張子無しの相対 import/export」を洗い出し、必要分だけ `.js` へ統一する（完了条件: `dist-pages` 内の JS で `from './x'` のような拡張子無し参照が残っていない）
4. Constructable Stylesheets 内の `@import` を撤去する（完了条件: `@import rules are not allowed here` がコンソールから消える）
   - `packages/components/button/button.ts` の `css\`@import ...\`` を削除/置換
   - `packages/components/accordion/accordion.ts` の `@import ...` を削除/置換
   - `packages/styles/design-tokens/typography-tokens.ts` の `fontImportText` を CSS から外し、フォントは `ensureFontsInitialized()`（既存の link 注入）に寄せる
5. （任意）favicon の参照を Project Pages 配下に寄せる（完了条件: `https://monoharada.github.io/favicon.ico 404` が出なくなる）
6. ローカルで `npm run pages:build` → 静的サーブして確認する（完了条件: `/?component=switch` で switch が表示され、Network に主要 404 が無い）
7. main へ反映して GitHub Pages で最終確認する（完了条件: 本番 URL で 404 と `@import` エラーが解消している）

## Test plan
- `npm run pages:build`
- `dist-pages/` を静的サーブして `/?component=switch` を確認（Network: 404 が無い、Console: `@import` エラーが無い）
- 本番でハードリロード（必要なら Service Worker / site data を削除）して同様に確認

## Open questions
1. `fontImport`（`typography-tokens.ts`）は互換のため **no-op として残す** 方針で良いですか？それとも export 自体を消しますか？
2. favicon の 404 は「ノイズなので消したい」扱いで対応しますか？（不要ならスコープ外にします）

