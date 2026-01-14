# code-simplifier: GH Pages向け差分の最小化＋検証

## Context
- `/prompts:code-simplifier` に従い、現状の git 差分（未コミット変更）を中心に「挙動を変えずに」単純化・整頓し、必要な検証まで行う。
- 現在の差分は主に以下の意図に見える：
  - GitHub Pages（静的配信）で拡張子無し ESM import が 404 になる問題を避ける（例：`./dom` → `./dom.js`）
  - Constructable Stylesheets で `@import` が使えずエラーになるのを避ける（Google Fonts の `@import` 削除/無効化）
  - favicon の 404 ノイズ抑制（`viewer.html`）

## Scope
- やること：
  - 対象は原則「現在の git 差分ファイル」：`packages/utils/behaviors.ts`、`packages/styles/design-tokens/typography-tokens.ts`、`packages/components/button/button.ts`、`packages/components/accordion/accordion.ts`、`packages/components/index.ts`、`viewer.html`
  - 既存規約/既存ユーティリティ（特にフォント初期化）に合わせて、差分を最小限に整える
  - `type-check` / `test` / `pages:build` / `pages:preview` で動作確認する
- やらないこと：
  - 依存追加、ビルド/設定の大改造、大量整形、公開APIの削除/互換性破壊
  - 差分外ファイルへの波及（必要なら別Planに切り出し）

## Assumptions
- フォント読み込みは `ensureFontsInitialized()` による `<link>` 注入が正（`@import` は Constructable Stylesheets では不可）
- `.js` 拡張子付き import は既にプロジェクト方針として許容されている
- `dist-pages/` は生成物（`.gitignore` 対象）なのでローカル生成で検証してよい

## Risks / Edge cases
- `.js` 拡張子付き import への統一は一部ツール/環境の解決挙動に影響し得る（ただし既存方針に寄せるためリスクは低め）
- `fontImport` を no-op にすることで「以前 `@import` に依存していた」想定があると挙動が変わるが、Constructable Stylesheets ではそもそも動作不能なので是正扱い
- `viewer.html` の `data:,` favicon は一部環境のCSP等で弾かれる可能性（通常は問題になりにくい）

## Action items
1. 承認済みPlanを保存する（完了条件: `.codex/plans/2026-01-14--code-simplifier-gh-pages-diff-tidy.md` を作成し、このPlan本文が保存されている）
2. 対象ファイルを確定する（完了条件: `git diff --name-only` の結果が上記6ファイルであると提示できる）
3. ナレッジ/遺産チェックをまとめる（完了条件: `CLAUDE.md`/`package.json`/フォント初期化実装/`.js` import方針の根拠ファイルを列挙できる）
4. 差分ファイルをレビューし、安全に減らせる冗長さだけを特定する（完了条件: 「触る/触らない」をファイル別に短く決められる）
5. 必要な範囲だけ単純化を適用する（完了条件: 追加差分が最小限で、公開APIや挙動を変えないと説明できる）
6. `@import`/拡張子無し import が残っていないことを確認する（完了条件: 対象範囲の検索結果が「コメントのみ」または「ゼロ」になる）
7. 検証コマンドを実行する（完了条件: `npm run type-check` と `npm run test:run` が成功する）
8. Pages ビルド＋プレビューで目視確認する（完了条件: `npm run pages:build`→`npm run pages:preview` で 404/Consoleエラーが無いことを確認できる）
9. code-simplifier 固定フォーマットで結果報告する（完了条件: Mode/Scope/Changes/Verification/Notes を揃えて報告できる）

## Test plan
- `npm run type-check`
- `npm run test:run`
- `npm run pages:build`
- `npm run pages:preview` を開き、`/?component=switch`（または該当パラメータ）で表示・Network 404・Console を確認

## Open questions
- （なし）
