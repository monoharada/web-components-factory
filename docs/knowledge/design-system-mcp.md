# Design System MCP（stdio）

この repo には、`custom-elements.json`（CEM）を読み込み、Design System 向けの “skills（安定した道具）” を提供する **MCP サーバー**を同梱しています。

## 起動

```bash
npm run mcp:design-system
```

MCP クライアント側からは、stdio サーバーとして次のように登録します（例）:

```json
{
  "command": "node",
  "args": ["scripts/mcp/design-system-mcp.mjs"]
}
```

repo-local 起動時は、`cwd/wcf-mcp.config.json` を自動探索します。  
`npm run mcp:design-system` を repo root で実行する場合は、`<repo-root>/wcf-mcp.config.json` を配置してください。

## 提供 tools / prompt / resources（19 tools + 2 prompts + 5 resources）

### `get_design_system_overview()`

最初に呼ぶ前提情報（カテゴリ別コンポーネント数、利用可能パターン、推奨ワークフロー、IDE 設定テンプレート、prompt/resource 導線）を返します。

- IDE テンプレート: Claude Desktop / Claude Code / Cursor / VS Code (GitHub Copilot) / Windsurf
- `setupInfo` にランタイムセットアップ情報を含む: `noCDN`, `deliveryModel`, `importMapHint`, `bootScript`, `vendorSetup`, `htmlSetup`

### `list_components({ prefix? })`

コンポーネント一覧を返します。

- `prefix` を指定すると、`dads-*` の tagName を `<prefix>-*` に置換した形で返します

### `search_icons({ query?, limit?, offset?, prefix? })`

アイコン名をキーワード検索して返します。

- `usageExample` を含むため、`generate_usage_snippet` やマークアップ生成前の候補絞り込みに使えます

### `get_component_api({ tagName?, className?, component?, components?, prefix? })`

単一または複数コンポーネントの API を返します（attributes / slots / events / cssParts）。

### `generate_usage_snippet({ component, prefix? })`

指定コンポーネントの最小 usage snippet を返します。

### `get_install_recipe({ component, prefix? })`

install recipe（componentId / deps / define / usageSnippet）を返します。

- `usageContext: "body-only"`: usageSnippet が `<body>` 内用 HTML であることを明示
- `vendorHint`: vendor セットアップに必要な CLI コマンド・import map テンプレート・boot.js 参照を提供

### `validate_markup({ html, prefix? })`

HTML 断片を CEM と突き合わせて検証し、diagnostics を返します。

- `unknownElement`: `error`
- `unknownAttribute`: `warning`
- `forbiddenAttribute` / `tokenMisuse` / `ariaLiveNotRecommended` / `roleAlertNotRecommended`: `warning`
- common template syntax（`{{ }}`, `{% %}`, `<% %>`, `<? ?>`, script/style blocks）は HTML と誤認しないようにマスクして扱います

### `validate_files({ files, prefix? })`

複数ファイルをまとめて検証し、ファイル別 diagnostics と集計を返します。

- `files[].content` を渡した場合はその文字列を検証
- `files[].content` を省略した場合は `files[].path` をローカルディスクから読み込み
- `duplicateId` を含む複数診断をまとめて返せるため、ページやテンプレート群のチェックに向きます

### `validate_project({ root, include?, exclude?, maxFiles?, prefix? })`

ディレクトリを走査し、glob 条件に一致するファイル群をまとめて検証します。

- 既定の include は `**/*.html`, `**/*.htm`, `**/*.njk`, `**/*.liquid`, `**/*.astro`, `**/*.twig`, `**/*.hbs`
- 既定の exclude は `node_modules`, `.git`, `dist`, `coverage`
- `maxFiles` で走査対象の上限を制御できます

## UI パターン（レイアウト/画面レシピ）

`registry/pattern-registry.json` に、AI がそのまま使える **画面/レイアウトのレシピ**を持ちます。

- Pattern の SoT は `registry/pattern-registry.json`
- `vendor-runtime/registry.json` の pattern は CLI 用の生成物（SoT から反映）

### `list_patterns()`

パターンの一覧を返します。

### `get_pattern_recipe({ patternId, prefix? })`

パターンの recipe を返します（必要 componentId + prefix適用済み snippet）。

- `entryHints`: パターンのエントリポイント（通常 `["boot"]`）
- `scaffoldHint`: 完全な HTML ページを構築するための雛形情報（doctype, importMap, bootScript, noscript, serveOverHttp）

### `generate_pattern_snippet({ patternId, prefix? })`

HTML snippet だけを返します。

### `generate_full_page_html({ html, prefix? })`

HTML フラグメントを `<!DOCTYPE html>` / import map / `boot.js` 付きの完全ページへ変換します。

### `get_design_tokens({ type?, category?, query?, theme? })`

デザイントークンを type/category/query/theme でフィルタして返します。

- `theme` パラメータは `light` / `dark` / `all`
- 現在の実データは `light` のみ。`all` は利用可能テーマ全体として `light` を返し、`dark` は `INVALID_THEME` エラーです
- token 関係性では `var(--token-a, var(--token-b))` のような token fallback は拾うが、literal fallback（例 `#fff`）は relationship graph に含めない

### `get_design_token_detail({ name, theme? })`

単一トークンの詳細を返します。

- `name`: `--color-primary` または `var(--color-primary)` 形式
- 返却: `token`, `references`, `referencedBy`, `relatedTokens`, `usageExamples`
- `theme` は `get_design_tokens` と同様に `all` を受理し、利用可能テーマ全体を返せます（現状は `light` のみ）

### `get_accessibility_docs({ component?, topic?, wcagLevel?, maxResults?, prefix? })`

アクセシビリティのチェックリストとガイドライン要点を返します。

- `component`: tagName/className/componentId で絞り込み
- `topic`: 例 `semantics`, `keyboard`, `labels`, `guideline`
- `wcagLevel`: `A` / `AA` / `AAA` / `all`
- `topic=all` かつ `component` 未指定時は、`component` と `guideline` の両ソースが結果に含まれるように返却

### `search_guidelines({ query, topic?, maxResults? })`

設計ガイドラインを topic/query で検索し、スコア付きで返します。

### `search_design_system_knowledge({ query, sources?, maxResults?, prefix? })`

components / patterns / guidelines / tokens / skills を横断して検索します。

- broad first-pass discovery 用の入口
- `source` と `followUp` を返すため、後続で `get_component_api` や `get_pattern_recipe` などに繋げやすい
- `sources` で対象を絞れます
- exact / prefix / intent-aware ranking を行い、broad query では source が偏りすぎないようにします

### `get_component_selector_guide({ category?, useCase? })`

カテゴリやユースケースから候補コンポーネントを返します。

## Prompt / Resources

### Prompt: `build_page({ patternId?, components?, userIntent? })`

パターン ID またはコンポーネントリストから no-build HTML ページを構築するガイド付きプロンプトです。

- `patternId` 指定時: `get_pattern_recipe` → `validate_markup` のフルページ生成フロー
- `components` 指定時: 各コンポーネントの `generate_usage_snippet` → `generate_full_page_html` → `validate_markup`
- 両方指定時: `patternId` が優先され、`components` は無視されます
- 未指定時: 上記2つのワークフローオプションを提示

### Prompt: `figma_to_wcf({ figmaUrl, userIntent? })`

Figma URL を受け取り、以下の順序で実装を進めるプロンプトを返します。

1. `get_design_system_overview`
2. `get_design_tokens`
3. `get_component_api`
4. `generate_usage_snippet`（または `get_pattern_recipe`）
5. `validate_markup`

### Resources (`wcf://`)

- `wcf://components`: コンポーネントカタログ（カテゴリ集計付き）
- `wcf://tokens`: トークン summary
- `wcf://guidelines/{topic}`: topic 別ガイドライン（`accessibility|css|patterns|all`）
- `wcf://llms-full`: `llms-full.txt` 全文
- `wcf://skills`: `skills-registry.json` ベースのスキルカタログ

## 拡張（plugin contract v1.1）

`cwd/wcf-mcp.config.json`（または npx 実行時 `--config=` 指定ファイル）で以下を拡張できます。

- `dataSources`: 既定の JSON データソース差し替え
- `plugins[].module`: ESM module plugin 読み込み
- `plugins[].staticTools`: 固定 payload を返す軽量ツール定義
- `plugins[].validators`: `validate_*` 系に独自診断を差し込む validator hook
- `plugins[].prompts` / `plugins[].resources`: plugin から prompt / resource を追加
- `plugins[].resourceTemplates`: plugin から resource template を追加

相対パスの解決基準:

- ルート `dataSources` / static plugin `dataSources`: config ファイル基準
- module plugin が export する `dataSources`: plugin module ファイル基準

制約:

- plugin tool 名は組み込み19ツールと重複不可
- data source key は `custom-elements.json` / `install-registry.json` / `pattern-registry.json` / `component-selector-guide.json` / `design-tokens.json` / `guidelines-index.json` / `skills-registry.json` / `llms-full.txt` をサポート
- plugin contract 本体は v1.1。ライフサイクル hook など未実装の将来拡張のみ experimental 扱い

## 品質ゲート

- `npm run mcp:check`: パッケージ同梱データの最新性チェック
- `npm run mcp:check:response-size`: 最大レスポンスと p95 latency のチェック
- `npm run mcp:summary`: `packages/mcp-server/mcp-spec-test/summary/v3-final.json` を生成
- `npm run mcp:summary:check`: 上記 summary JSON の drift をチェック

### 追加済み mockup patterns

- `mockup-website`
- `mockup-app-shell`
- `mockup-mobile-form`

## wctools MCP / language server との違い

- wctools / language server: CEM を中心にした汎用ツール（ドキュメント/補完/検証）
- この DS-MCP: **この repo 固有の前提（prefix 戦略、viewer 運用、usage snippet 生成、validate など）**まで含めた “設計システム専用スキル”
