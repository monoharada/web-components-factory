# Research

## Sources
- GitHub Issue: `#174 feat(mcp): Code Generation 5/5 — トークン誤用検出 + structuredContent`
- `packages/mcp-server/core.mjs`（対象ツール実装）
- `packages/mcp-server/server.test.js`（既存テスト）
- `packages/mcp-server/package.json`（`@modelcontextprotocol/sdk:^1.26.0`）
- `docs/reports/wcf-mcp-vs-serendie-comparison.md`（§4.3, §10）

## Current Facts
- 現状、対象3ツール（`get_component_api`, `get_design_tokens`, `search_guidelines`）は `content` のみ返却しており `structuredContent` 未対応。
- `validate_markup` は CEM 検証診断を返すが、ハードコード値の token misuse 検出は未実装。
- `server.test.js` はヘルパー中心で、`validate_markup` の token misuse 契約テストは未整備。
- ルートと `packages/mcp-server` ともに SDK 依存は `@modelcontextprotocol/sdk:^1.26.0`。

## Boundary Notes
- #174 は「実装オーナー」として structuredContent を主要3ツールに追加する。
- #177 は「記述/検証オーナー」だが、本計画では実装スコープ外。
- `content` 互換は必須で、`structuredContent` は追加扱いに限定する。

## Validation Path
- `npm run mcp:build`
- `npm run mcp:check`
- `npm run mcp:check:response-size`
- `npm run test:run -- packages/mcp-server/server.test.js`
- `npm run agents:verify`

## Resolved Unknowns
- U-01: token 提案は初期実装では「完全一致のみ」を採用する（近似候補は #174 スコープ外）。
- U-02: token misuse 検出対象は `style="..."`（inline style）に限定する。
- U-03: structuredContent は Issue 記載に合わせ `{ type: 'application/json', data: ... }` を採用する。

## Fixed Low-Risk Decisions
- structuredContent の必須キーを固定する。
  - `get_component_api`: `tagName,className,attributes,slots,events,cssParts,cssProperties`
  - `get_design_tokens`: `total,tokens,summary`
  - `search_guidelines`: `query,topic,totalHits,results`
- rollback flag 名は `WCF_MCP_DISABLE_STRUCTURED_CONTENT` を採用する。
- token misuse 初期対象プロパティは `color`,`background-color`,`padding`,`padding-top`,`padding-right`,`padding-bottom`,`padding-left` に限定する。
