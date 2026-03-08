# Plan

## Remediation Order

### P-01: 最終 result object を bounded 化する共通 helper を導入する
- `core/response.mjs` に、任意の MCP tool result object を受けて `MAX_TOOL_RESULT_BYTES` 以下へ収める finalize helper を追加する。
- helper は raw result をまずそのまま計測し、超過時だけ overflow warning payload へ置き換える。
- `isError` の有無は helper 入力時点で確定させ、後付けでサイズを増やさない。
- Touches:
  - `packages/mcp-server/core/response.mjs`
  - `packages/mcp-server/server.test.js`
- Contract:
  - C-01
  - C-02
- Risks:
  - R-01
  - R-02

### P-02: plugin raw MCP result 経路を共通 helper に通す
- `core/register.mjs` の plugin handler 分岐で raw result をそのまま返さず、共通 finalize helper を通してから返す。
- plugin が plain payload を返す場合の現行 `buildJsonToolResponse()` 経路は維持する。
- oversize raw result の integration test を `runtime.test.js` に追加する。
- Touches:
  - `packages/mcp-server/core/register.mjs`
  - `packages/mcp-server/runtime.test.js`
- Contract:
  - C-01
- Risks:
  - R-03

### P-03: error helper の境界超過を潰す
- `buildJsonToolErrorResponse()` が `isError` を含めた最終 object を size guard できるよう順序を変える。
- 102400 byte 境界を跨ぐ regression test を `server.test.js` に追加する。
- Touches:
  - `packages/mcp-server/core/response.mjs`
  - `packages/mcp-server/server.test.js`
- Contract:
  - C-02
- Risks:
  - R-02

### P-04: contract 文書と検証を同期する
- overflow warning payload が built-in / plugin / error helper のどこで返るかを README に書く必要があるか確認し、必要最小限だけ更新する。
- ローカル検証で `vitest` と `npm pack --dry-run` を再実行する。
- Touches:
  - `packages/mcp-server/README.md`（必要な場合のみ）
  - `packages/mcp-server/runtime.test.js`
  - `packages/mcp-server/server.test.js`
- Contract:
  - C-01
  - C-02
- Risks:
  - R-04

## Validation Plan
- `npx vitest run packages/mcp-server/runtime.test.js packages/mcp-server/server.test.js`
- `npm pack --dry-run ./packages/mcp-server`
- Manual repro
  - raw plugin result で `content[0].text = 'x'.repeat(120 * 1024)` を返して上限内に潰れること
  - `buildJsonToolErrorResponse({ blob: 'x'.repeat(102325) })` が `MAX_TOOL_RESULT_BYTES` 以下で返ること

## Expected Outcome
- plugin raw result でも built-in と同じ最終 size guard が効く。
- `buildJsonToolErrorResponse()` でも 100KB 上限超過が残らない。
- size guarantee の contract が helper 境界ではなく「最終返却 object」で固定される。
