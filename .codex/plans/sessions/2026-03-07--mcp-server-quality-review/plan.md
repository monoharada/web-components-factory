# Plan

## Remediation Order

### P-01: HTTP transport を仕様準拠に直す
- request ごとに fresh `StreamableHTTPServerTransport` を生成するか、stateful mode に設計変更する。
- `/mcp` endpoint の method handling と error handling を SDK example に寄せる。
- DNS rebinding protection を有効化し、`allowedHosts` / `allowedOrigins` を明示する。

### P-02: `structuredContent` 契約を MCP 仕様へ揃える
- `buildJsonToolResponse()` の `structuredContent` shape を payload 直置きへ変更する。
- 関連テストを仕様準拠 shape へ更新する。
- README の rollback 説明も実挙動と整合させる。

### P-03: contract drift を解消する
- server metadata version / overview version を package version の単一ソースへ統一する。
- `validate_markup` severity の仕様を README と実装で一致させる。
- `createServer({ cwd })` の意味論を統一するか、明確に非対応とする。

### P-04: response size / error envelope を整える
- `get_component_api` batch の実効上限を見直す。
- pretty-print 方針、size guard、plain text error 混在を整理する。

### P-05: テストギャップを埋める
- HTTP transport の request-level test を追加する。
- `structuredContent` shape と security option の回帰テストを追加する。

## Validation Plan
- `npm test -- --run packages/mcp-server/server.test.js packages/mcp-server/runtime.test.js packages/mcp-server/bin.test.js packages/mcp-server/design-system-skills.test.js packages/mcp-server/runtime-data.test.js`
- HTTP mode の再現 test
  - 2 request 以上で 500 にならないこと
- `validate_markup` の severity contract test
- `get_component_api` batch size regression test

## Expected Outcome
- HTTP mode が継続利用可能になる。
- `structuredContent` と security が MCP 仕様に沿う。
- version / severity / cwd の contract drift が解消される。
