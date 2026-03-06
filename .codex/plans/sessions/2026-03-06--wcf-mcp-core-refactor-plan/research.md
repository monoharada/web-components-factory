# Research

## Current Facts
- `packages/mcp-server/core.mjs` は 3408 行、`export` は 62 件ある。
- `createMcpServer()` が `core.mjs` 内で tool / resource / prompt 登録を一括で担っている。
- `buildJsonToolResponse()` は tool 応答の単一 helper だが、`core.mjs` に残ったまま tests / scripts からも直接参照されている。
- `scripts/mcp/check-response-size.mjs` は `buildJsonToolResponse()` を直接 import している。
- `packages/mcp-server/runtime.test.js` は `PLUGIN_CONTRACT_VERSION`、`normalizePlugins()`、`buildPluginDataSourceMap()`、`createMcpServer()` を `core.mjs` から直接 import している。
- `packages/mcp-server/package.json` の `files` には `core.mjs` / `server.mjs` / `runtime-data.mjs` / `validator.mjs` はあるが、新規内部モジュールを含む余地はまだない。

## Responsibility Clusters

### 1. Response / Prefix / Utility
- `buildJsonToolResponse()`
- prefix 正規化と canonical tag 変換
- plugin handler に渡す helpers

### 2. Plugin Runtime
- `PLUGIN_CONTRACT_VERSION`
- `normalizePlugins()`
- `buildPluginDataSourceMap()`
- plugin tool 実行時の helper 注入

### 3. Catalog / Index / Search
- CEM index
- tokens
- guidelines / accessibility / icons 検索
- snippets / patterns / full page generation

### 4. MCP Registration
- built-in tools 登録
- prompt 登録
- resources 登録
- plugin tools の bridge

## Risky Boundaries
- tests / scripts が `core.mjs` export を直接参照しており、内部 refactor の影響を受けやすい。
- tool/resource/prompt 登録ロジックと pure helper が同居しており、変更差分のレビュー単位が大きい。
- plugin 系は handler helper の shape が契約になっているため、内部 module 化でも API を維持する必要がある。
- package `files` の更新漏れがあると npm 配布版だけ壊れる。

## Candidate Module Split
- `packages/mcp-server/core/constants.mjs`
- `packages/mcp-server/core/response.mjs`
- `packages/mcp-server/core/prefix.mjs`
- `packages/mcp-server/core/plugins.mjs`
- `packages/mcp-server/core/cem.mjs`
- `packages/mcp-server/core/tokens.mjs`
- `packages/mcp-server/core/patterns.mjs`
- `packages/mcp-server/core/register.mjs`
- `packages/mcp-server/core.mjs` は facade として残す

## Verification Baseline
- Contract / response helper: `packages/mcp-server/server.test.js`
- Runtime / plugin contract: `packages/mcp-server/runtime.test.js`
- Skills resource/plugin contract: `packages/mcp-server/design-system-skills.test.js`
- Package/data correctness: `npm run mcp:check`
- Payload / latency guard: `npm run mcp:check:response-size`
- PR gate: `npm run agents:verify`
