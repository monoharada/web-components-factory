# Research

## Scope of reading
- `packages/mcp-server/core/register.mjs`
- `packages/mcp-server/core/response.mjs`
- `packages/mcp-server/runtime.test.js`
- `packages/mcp-server/server.test.js`
- `packages/mcp-server/test-support.js`

## Facts

### F-01: plugin handler の raw result 経路は size guard を通っていない
- `core/register.mjs` の plugin tool 登録で、`tool.handler()` の返り値が object かつ `Array.isArray(result.content)` の場合、そのまま返却している。
- この分岐は `buildJsonToolResponse()` / `buildJsonToolErrorResponse()` を経由しないため、現在の overflow fallback が効かない。

### F-02: built-in payload 経路の size guard は `buildJsonToolResponse()` に集約されている
- `core/response.mjs` は pretty / compact / text-only / overflow warning の順でサイズを絞り、通常 helper 経路では `measureToolResultBytes(result) <= MAX_TOOL_RESULT_BYTES` を満たす。
- 直近の follow-up で 120KB payload に対する overflow warning test は追加済み。

### F-03: error helper は helper 完了後に `isError: true` を後付けしている
- `buildJsonToolErrorResponse()` は `buildJsonToolResponse(payload, options)` の返り値を spread し、その後 `isError: true` を付けている。
- そのため、helper 内でちょうど上限内だった結果が `isError` 追加で 1 byte 超過する境界が残る。

### F-04: plugin handler のテスト基盤は既にある
- `test-support.js` の `createPluginTestPair()` で plugin tool を MCP client 経由で呼べる。
- `runtime.test.js` には plugin handler の基本 contract test があり、raw MCP result や oversize 境界の追加先として自然。

## Inference
- I-01: size guard を helper ごとに個別実装し続けるより、最終 result object を受けて bounded 化する共通 finalize helper を作る方が保守しやすい。
- I-02: plugin raw result も error helper も「最終返却 object 全体」を再計測する contract に寄せるべき。
