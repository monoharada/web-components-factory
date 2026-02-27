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

## 提供 tools（標準セット）

### `get_design_system_overview()`

最初に呼ぶ前提情報（カテゴリ別コンポーネント数、利用可能パターン、推奨ワークフロー、IDE 設定テンプレート、prompt/resource 導線）を返します。

- IDE テンプレート: Claude Desktop / Claude Code / Cursor / VS Code (GitHub Copilot) / Windsurf

### `list_components({ prefix? })`

コンポーネント一覧を返します。

- `prefix` を指定すると、`dads-*` の tagName を `<prefix>-*` に置換した形で返します

### `get_component_api({ tagName?, className?, prefix? })`

単一コンポーネントの API を返します（attributes / slots / events / cssParts）。

### `generate_usage_snippet({ component, prefix? })`

指定コンポーネントの最小 usage snippet を返します。

### `get_install_recipe({ component, prefix? })`

install recipe（componentId / deps / define / usageSnippet）を返します。

### `validate_markup({ html, prefix? })`

HTML 断片を CEM と突き合わせて検証し、diagnostics を返します。

- `unknownElement`: `error`
- `unknownAttribute`: `warning`
- `forbiddenAttribute` / `tokenMisuse` / `ariaLiveNotRecommended` / `roleAlertNotRecommended`: `warning`

## UI パターン（レイアウト/画面レシピ）

`registry/pattern-registry.json` に、AI がそのまま使える **画面/レイアウトのレシピ**を持ちます。

- Pattern の SoT は `registry/pattern-registry.json`
- `vendor-runtime/registry.json` の pattern は CLI 用の生成物（SoT から反映）

### `list_patterns()`

パターンの一覧を返します。

### `get_pattern_recipe({ patternId, prefix? })`

パターンの recipe を返します（必要 componentId + prefix適用済み snippet）。

### `generate_pattern_snippet({ patternId, prefix? })`

HTML snippet だけを返します。

### `get_design_tokens({ type?, category?, query?, theme? })`

デザイントークンを type/category/query/theme でフィルタして返します。

- `theme` は `light` / `dark` / `all` を受理
- 現在は `light` のみ対応のため、`dark` / `all` はエラーを返します（NG-06）

### `get_design_token_detail({ name, theme? })`

単一トークンの詳細を返します。

- `name`: `--color-primary` または `var(--color-primary)` 形式
- 返却: `token`, `references`, `referencedBy`, `relatedTokens`, `usageExamples`
- `theme` は `get_design_tokens` と同様に `light` のみ対応

### `get_accessibility_docs({ component?, topic?, wcagLevel?, maxResults?, prefix? })`

アクセシビリティのチェックリストとガイドライン要点を返します。

- `component`: tagName/className/componentId で絞り込み
- `topic`: 例 `semantics`, `keyboard`, `labels`, `guideline`
- `wcagLevel`: `A` / `AA` / `AAA` / `all`
- `topic=all` かつ `component` 未指定時は、`component` と `guideline` の両ソースが結果に含まれるように返却

### `search_guidelines({ query, topic?, maxResults? })`

設計ガイドラインを topic/query で検索し、スコア付きで返します。

## Prompt / Resources

### Prompt: `figma_to_wcf({ figmaUrl, userIntent? })`

Figma URL を受け取り、以下の順序で実装を進めるプロンプトを返します。

1. `get_design_system_overview`
2. `get_design_tokens`
3. `get_component_api`
4. `generate_usage_snippet`（または `get_pattern_recipe`）
5. `validate_markup`

### Resources (`wcf://`)

- `wcf://components`: コンポーネントカタログ（カテゴリ集計付き）
  - source: `data/custom-elements.json`
  - refresh: CEM 更新後に `npm run mcp:build`
- `wcf://tokens`: トークン summary
  - source: `data/design-tokens.json`
  - refresh: トークン抽出後に `npm run mcp:build`
- `wcf://guidelines/{topic}`: topic 別ガイドライン（`accessibility|css|patterns|all`）
  - source: `data/guidelines-index.json`
  - refresh: guidelines index 更新後に `npm run mcp:build`
- `wcf://llms-full`: `llms-full.txt` 全文
  - source: `data/llms-full.txt`
  - refresh: `npm run llms:generate` 後に `npm run mcp:build`

## レスポンス契約（structuredContent / summary）

14 tools はすべて `summary?: boolean` を受け付けます（default: `false`）。

- `summary=false`（既定）: 従来どおり `content` を返す（JSON or snippet text）
- `summary=true`: `content` を Markdown 要約にし、`structuredContent` に機械可読 JSON を返す

`structuredContent` 形式:

```json
{
  "type": "application/json",
  "data": { "...": "tool payload" }
}
```

補足:

- 100KB 制限を超える場合は `structuredContent` を省略して `content` のみ返却
- 緊急 rollback は `WCF_MCP_DISABLE_STRUCTURED_CONTENT=1`

## 拡張（@experimental）

`cwd/wcf-mcp.config.json`（または npx 実行時 `--config=` 指定ファイル）で以下を拡張できます。

- `dataSources`: 既定の JSON データソース差し替え
- `plugins[].module`: ESM module plugin 読み込み
- `plugins[].staticTools`: 固定 payload を返す軽量ツール定義

相対パスの解決基準:

- ルート `dataSources` / static plugin `dataSources`: config ファイル基準
- module plugin が export する `dataSources`: plugin module ファイル基準

制約:

- plugin tool 名は組み込み14ツールと重複不可
- data source key は `custom-elements.json` / `install-registry.json` / `pattern-registry.json` / `design-tokens.json` / `guidelines-index.json` のみ
- 契約は `@experimental`（将来変更の可能性あり）

### 追加済み mockup patterns

- `mockup-website`
- `mockup-app-shell`
- `mockup-mobile-form`

## wctools MCP / language server との違い

- wctools / language server: CEM を中心にした汎用ツール（ドキュメント/補完/検証）
- この DS-MCP: **この repo 固有の前提（prefix 戦略、viewer 運用、usage snippet 生成、validate など）**まで含めた “設計システム専用スキル”
