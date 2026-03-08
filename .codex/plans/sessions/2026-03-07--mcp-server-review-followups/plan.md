# Plan

## Remediation Order

### P-01: HTTP 起動を fail-fast に揃える
- `main()` の HTTP 分岐で `createServer({ configPath })` を先に実行し、config/runtime load 失敗を `listen()` 前に表面化させる。
- startup validation で作った server instance は即 close し、request handling は現行どおり per-request server/transport を維持する。
- Touches:
  - `packages/mcp-server/bin.mjs`
  - `packages/mcp-server/bin.test.js`
- Contract:
  - C-01
- Risks:
  - R-01

### P-02: HTTP endpoint 契約を `/mcp` に固定する
- request handler で path を検証し、`/mcp` 以外は transport に渡さず 404 を返す。
- README の transport 記述を実装と一致させる。
- Touches:
  - `packages/mcp-server/bin.mjs`
  - `packages/mcp-server/README.md`
  - `packages/mcp-server/bin.test.js`
- Contract:
  - C-02
- Risks:
  - R-02

### P-03: allowlist の default-port 揺れを潰す
- `buildHttpTransportOptions()` で loopback host の同義表現と、default port 時の port 省略形を許可する。
- security を弱めず、`127.0.0.1` / `localhost` 以外へ広げない。
- Touches:
  - `packages/mcp-server/bin.mjs`
  - `packages/mcp-server/bin.test.js`
- Contract:
  - C-03
- Risks:
  - R-03

### P-04: response-size fallback を最終保証付きにする
- compact text-only 返却前にもサイズ計測を入れる。
- それでも上限を超える場合の明示的 overflow fallback を定義する。
- oversize case の unit test を追加する。
- Touches:
  - `packages/mcp-server/core/response.mjs`
  - `packages/mcp-server/server.test.js`
- Contract:
  - C-04
- Risks:
  - R-04

## Validation Plan
- `npx vitest run packages/mcp-server/bin.test.js packages/mcp-server/runtime.test.js packages/mcp-server/server.test.js`
- `npm pack --dry-run ./packages/mcp-server`
- Manual repro
  - `node packages/mcp-server/bin.mjs --transport=http --port=43121 --config=./definitely-missing-config.json`
  - `/mcp` と `/wrong` への request 差分確認
  - `buildJsonToolResponse({ blob: 'x'.repeat(120 * 1024) })` の最終サイズ確認

## Expected Outcome
- HTTP mode は startup health check で invalid config を即検知できる。
- endpoint 契約が `/mcp` に固定される。
- oversized payload でも 100KB 超過レスポンスを返さない。
- loopback default-port の host/origin 揺れがテストで固定化される。
