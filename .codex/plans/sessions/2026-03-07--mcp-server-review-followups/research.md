# Research

## Scope of reading
- `packages/mcp-server/bin.mjs`
- `packages/mcp-server/core/response.mjs`
- `packages/mcp-server/bin.test.js`
- `packages/mcp-server/server.test.js`
- `packages/mcp-server/README.md`

## Current facts

### 1. HTTP mode は listen 後まで config を検証しない
- `main()` は `transport === 'http'` のとき `createHttpRequestHandler()` を組み立ててすぐ `httpServer.listen()` する。
- `createServer()` は request handler の中で初めて呼ばれる。
- そのため `--config` が壊れていても起動ログは成功し、最初の request で 500 JSON-RPC error になる。
- `stdio` は `main()` 内で `await createServer()` するため、失敗タイミングが一致していない。

### 2. HTTP endpoint path は未検証
- README は endpoint を `http://127.0.0.1:3100/mcp` と説明している。
- 実装は `req.url` や path を見ず、HTTP server に届いた全 request を transport へ渡している。
- 既存テストも `sendHttpRequest()` の default path が `/mcp` なだけで、他 path を拒否する契約は持っていない。

### 3. default port の allowlist は host:port 固定
- `buildHttpTransportOptions()` は `127.0.0.1:PORT` と `localhost:PORT` を許可し、それを元に `http://host:port` を origin 許可へ変換している。
- default port でも port 付き表記しか許可しないため、SDK が `Host: localhost` / `Origin: http://localhost` を完全一致で評価する場合に揺れが残る。

### 4. response-size fallback は最終 compact text-only を未計測
- `buildJsonToolResponse()` は以下の順で fallback する。
  1. pretty + structured
  2. compact + structured
  3. pretty text-only
  4. compact text-only
- 最後の `compact text-only` 返却だけ `measureToolResultBytes()` を通していない。
- そのため payload が十分大きい場合、`MAX_TOOL_RESULT_BYTES` を超えた応答が返りうる。

### 5. 既存テストのギャップ
- `bin.test.js`
  - repeated request と disallowed origin はある。
  - invalid config の HTTP startup fail-fast はない。
  - `/mcp` 以外 path を拒否するテストはない。
  - default-port allowlist のテストはない。
- `server.test.js`
  - size fallback は 70KB payload で `structuredContent` を外すケースのみ。
  - compact text-only でも上限超過するケースは未検証。

## Constraints from current design
- HTTP transport は stateless per-request 方針で既に修正済みなので、この方針は維持したい。
- version drift と structuredContent shape は解消済みで、今回の変更対象ではない。
- response-size 対応は `MAX_TOOL_RESULT_BYTES` を single source of truth として保つべき。

## Unknowns
- U-01: oversized response の最終 fallback を error として扱うか、warning payload として扱うか。
  - Validation method: 既存の tool error envelope とクライアント影響を確認し、最小破壊な契約を選ぶ。
