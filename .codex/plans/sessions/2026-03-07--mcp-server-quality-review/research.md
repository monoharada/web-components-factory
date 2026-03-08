# Research

## Codebase Facts
- `createMcpServer()` は起動時に `custom-elements.json`, `install-registry.json`, `pattern-registry.json`, `design-tokens.json`, `guidelines-index.json`, `component-selector-guide.json`, `llms-full.txt` を読み込み、index を事前構築する。
- `registerAll()` が tool/resource/prompt/plugin wrapper を一括登録している。
- `buildJsonToolResponse()` が多くの tool の共通レスポンス組み立てを担う。
- HTTP transport は `packages/mcp-server/bin.mjs` で `StreamableHTTPServerTransport` を直接生成している。

## Findings

### High

#### F-01: `structuredContent` の shape が MCP 仕様とずれている
- Evidence:
  - `packages/mcp-server/core/response.mjs:50-54`
  - `packages/mcp-server/core/response.mjs:71-74`
  - `packages/mcp-server/server.test.js:2121-2124`
  - MCP spec: `structuredContent` は tool result の JSON object そのものを返す前提
- Detail:
  - 現実装は `structuredContent: { type: 'application/json', data: payload }` を返している。
  - テストもこの shape を固定しているため、仕様ずれが検出されない。
- Impact:
  - `structuredContent` を直接読むクライアントで相互運用性を落とす。
  - output schema を足す場合にも互換問題になる。

#### F-02: HTTP transport が stateless mode の前提を破っており、2 request 目で壊れる
- Evidence:
  - `packages/mcp-server/bin.mjs:130-139`
  - `node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js:137-140`
  - 再現: 同一 transport に 2 回 GET を流すと `406` の次に `500`
- Detail:
  - SDK は `sessionIdGenerator: undefined` の stateless mode では「request ごとに fresh transport」を要求している。
  - 現実装は 1 インスタンスを使い回しており、HTTP mode が継続利用できない。
- Impact:
  - `--transport=http` が実質 broken。

#### F-03: HTTP transport に DNS rebinding / Origin 保護が入っていない
- Evidence:
  - `packages/mcp-server/bin.mjs:135-137`
  - `node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js:68-70`
  - `node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js:107-120`
  - MCP transport spec の security warning
- Detail:
  - SDK の `enableDnsRebindingProtection` は default `false`。
  - 現実装は `allowedHosts` / `allowedOrigins` を一切設定していない。
- Impact:
  - localhost bind のみでも spec 推奨の保護を満たさない。

### Medium

#### F-04: package version と MCP metadata version が drift している
- Evidence:
  - `packages/mcp-server/package.json:3`
  - `packages/mcp-server/core.mjs:193-196`
  - `packages/mcp-server/core/register.mjs:387-390`
- Detail:
  - package は `0.9.0`、MCP server metadata と overview payload は `0.7.0`。
- Impact:
  - client 側の診断、bug report、互換判断が誤る。

#### F-05: `validate_markup` の severity 契約が README と実装で不一致
- Evidence:
  - `packages/mcp-server/README.md:79-90`
  - `packages/mcp-server/core/register.mjs:855-860`
  - 実測: `<div aria-live="polite">` で `ariaLiveNotRecommended` は `error`
- Detail:
  - README では `ariaLiveNotRecommended` / `roleAlertNotRecommended` は `warning`。
  - 実装は validator 呼び出し時に `severity: 'error'` を渡している。
- Impact:
  - tool consumer が README を信じていると制御方針がずれる。

#### F-06: `createServer({ cwd })` の意味論が一貫していない
- Evidence:
  - `packages/mcp-server/server.mjs:23-35`
  - `packages/mcp-server/server.mjs:123-126`
  - `packages/mcp-server/server.mjs:200-209`
- Detail:
  - config 解決は `options.cwd` を使うが、実データ読み込みは `process.cwd()` 固定。
- Impact:
  - public API として期待しにくく、埋め込み利用時の挙動が読みにくい。

#### F-07: `get_component_api` batch mode の advertised 上限 10 が実質使いにくい
- Evidence:
  - `packages/mcp-server/core/register.mjs:589-619`
  - `packages/mcp-server/core/response.mjs:61-79`
  - 実測: 代表的な 10 component batch は `isError: true`
- Detail:
  - pretty-printed `content` が大きく、10 件の典型入力で size guard に引っかかる。
  - 同 payload の minified object は約 75KB だが、pretty text は約 111KB まで膨らむ。
- Impact:
  - `max 10` という契約が実運用では過大。

### Low

#### F-08: error envelope が混在している
- Evidence:
  - `packages/mcp-server/core/cem.mjs:902-923`
  - `packages/mcp-server/core/register.mjs:721-738`
  - `packages/mcp-server/core/register.mjs:1062-1066`
  - `packages/mcp-server/core/register.mjs:1264-1271`
  - `packages/mcp-server/core/register.mjs:1319-1323`
- Detail:
  - plain text error と JSON error helper が混在している。
- Impact:
  - client 実装の分岐が増える。

#### F-09: 責務集中が大きく、変更局所性が悪い
- Evidence:
  - `packages/mcp-server/core/register.mjs:368-1468`
  - `packages/mcp-server/validator.mjs`
- Detail:
  - register layer が tool/resource/prompt/plugin wrapping を一括で持ち、validator も巨大単一ファイル。
- Impact:
  - 仕様変更 1 件で影響調査範囲が広い。

## Performance Notes
- `createServer()` 実測:
  - cold: 約 `52.9ms`
  - warm 5-run average: 約 `15.74ms`
- 静的入力総量:
  - 約 `3.2MB`
- 現状、起動時間そのものは許容範囲。
- 近い将来のボトルネック候補は `search_guidelines` の全文走査と batch payload の pretty-print 膨張。

## Verification Run
- `npm test -- --run packages/mcp-server/server.test.js packages/mcp-server/runtime.test.js packages/mcp-server/bin.test.js packages/mcp-server/design-system-skills.test.js packages/mcp-server/runtime-data.test.js`
  - Result: `258 passed`
- HTTP transport reproduction
  - 1st GET: `406`
  - 2nd GET: `500`
