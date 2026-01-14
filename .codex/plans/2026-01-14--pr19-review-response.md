# PR #19 レビュー対応プラン（GH Pages: import 404 / Constructable Stylesheets 対応）

## Context
- PR #19 は GitHub Pages（静的配信）で発生している ESM 相対 import（拡張子なし）による 404 と、Constructable Stylesheets 内 `@import` によるエラーを解消する意図。
- 追加で `packages/components/button/button.ts` のテンプレ生成リファクタと `a11yAnnotations` 追加が含まれるが、本PRに残す方針。
- `.codex/plans/*` は「レビュー対応の経緯/意図を残す」目的でコミットする方針。

## Scope
- やること：
  - Pages 向け出力（`dist-pages/`）で拡張子なし相対 import が残らないようにする
  - Constructable Stylesheets 内の `@import` を排除し、フォントは既存の `<link>` 注入（`ensureFontsInitialized()`）へ寄せる
  - `button.ts` の `a11yAnnotations` 追加を含む変更点をレビュー返信用に整理し、検証結果を添えて共有できる状態にする
- やらないこと：
  - adaptive-card 系のテスト修正（既存の失敗であり別スコープ）
  - bundler 導入などの大規模なビルド刷新

## Assumptions
- `scripts/build-pages.cjs` は TS→JS の変換のみで import specifier を書き換えないため、静的配信では拡張子なし相対 import が 404 になり得る。
- Constructable Stylesheets（`CSSStyleSheet.replaceSync`）では `@import` が使えないため、`@import` 依存を除去する必要がある。
- フォント読み込みは `ensureFontsInitialized()` が `<link rel="stylesheet">` で一度だけ行う設計。

## Risks / Edge cases
- `.js` 拡張子明示は利用側の解決挙動に影響し得る（ただし既存コードでも `.js` import が多数あり、方針として整合している）。
- `fontImport` を no-op にすることで、外部が `fontImport` の効果を期待していた場合のギャップが起きる可能性（互換のため export は維持する）。
- `.codex/plans/*` のコミット方針がチームの運用とズレる場合、ノイズとして指摘され得る（意図を明記する）。

## Action items
1. 変更点をレビュー返信向けに要約する（完了条件: 「拡張子 `.js` 明示」「`@import` 排除」「`fontImport` no-op の理由」「favicon」「buttonリファクタ/a11yAnnotations」を短く説明できる）
2. `dist-pages/` に拡張子なし相対 import が残っていないことを確認する（完了条件: `dist-pages/` の検索でコメント以外の拡張子なし相対 import が検出されない）
3. `dist-pages/` に `@import` が残っていないことを確認する（完了条件: `dist-pages/` の検索でコメント以外の `@import` が検出されない）
4. ローカル検証結果を揃える（完了条件: `npm run type-check` と `npm run pages:build` が成功し、変更コンポーネントのテスト（button/accordion）が個別に成功している）
5. 既存 failing tests がベース由来である根拠を示す（完了条件: `origin/main` と PR HEAD の両方で同種の失敗（adaptive-card import 解決 / dads-text の1件）が再現することを共有できる）
6. レビュー返信文案を用意する（完了条件: PR コメントに貼れる形で、背景/理由/検証/既知の失敗をまとめた文案ができている）

## Test plan
- `npm run type-check`
- `npm run pages:build`
- `npx vitest run packages/components/button/button.test.ts`
- `npx vitest run packages/components/accordion/accordion.test.ts`
- `rg -n \"from ['\\\"][.]{1,2}/\" dist-pages | rg -v \"\\\\.js['\\\"]\"`（コメント以外でヒットしない）
- `rg -n \"@import\" dist-pages`（コメント以外でヒットしない）
- `npx vitest run --reporter=dot`（既存 failing の確認用）

## Open questions
- （なし）

