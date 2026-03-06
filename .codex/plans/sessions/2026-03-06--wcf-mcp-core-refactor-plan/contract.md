# Contract

## C-01 Export Compatibility Contract
- Rule: `core.mjs` 直参照の既存 export は、当面 re-export で互換維持する。
- Trace: D-02, D-08
- Verification: `packages/mcp-server/runtime.test.js`, `scripts/mcp/check-response-size.mjs`

## C-02 Registration Contract
- Rule: built-in tools / resources / prompt の名前・件数・返却 shape を変えない。
- Trace: D-03, D-04
- Verification: `packages/mcp-server/server.test.js`

## C-03 Response Envelope Contract
- Rule: `buildJsonToolResponse()` の意味論（`structuredContent` opt-out、text fallback、100KB guard）を変えない。
- Trace: D-04, D-07
- Verification: `packages/mcp-server/server.test.js`, `npm run mcp:check:response-size`

## C-04 Plugin Runtime Contract
- Rule: plugin helper context と tool collision / data source override 契約を維持する。
- Trace: D-02, D-04, D-07
- Verification: `packages/mcp-server/runtime.test.js`

## C-05 Packaging Contract
- Rule: 新規内部 module は npm package `files` に確実に含める。
- Trace: D-05, D-07
- Verification: `npm run mcp:check`

## C-06 Verification Gate Contract
- Rule: 実装完了条件は `test:run`、`mcp:check`、`mcp:check:response-size`、`agents:verify` の通過。
- Trace: D-07
- Verification:
  - `npm run test:run`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`
