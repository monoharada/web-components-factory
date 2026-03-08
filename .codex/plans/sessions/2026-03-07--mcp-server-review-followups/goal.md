# Goal

## Goal Statement
PR #254 の再レビューで挙がった `packages/mcp-server` の残件 4 件を解消し、merge/publish 前に HTTP transport と response contract の整合性を仕上げる。

## Success Criteria
- KR-01: HTTP mode で壊れた `--config` を起動時に検知し、`stdio` と同じ失敗タイミングに揃える。
- KR-02: HTTP mode は `/mcp` のみを MCP endpoint として扱い、README と実装の契約を一致させる。
- KR-03: `buildJsonToolResponse()` はどの fallback 経路でも最終返却サイズが `MAX_TOOL_RESULT_BYTES` 以下になる。
- KR-04: `allowedHosts` / `allowedOrigins` は loopback + default port の揺れを吸収し、既存の localhost 利用を壊さない。

## Hard Constraints
- F-01: 修正範囲は `packages/mcp-server/**` と、その検証に必要な README / テストに限定する。
- F-02: 既に通っている MCP contract 修正は巻き戻さず、review で指摘された差分だけを最小で直す。
- F-03: HTTP transport の security posture は現状より弱めない。

## Definition of Done
- D-01: invalid config の HTTP 起動失敗を自動テストで再現・防止できる。
- D-02: `/mcp` 以外の path が明確に MCP handler 対象外になる。
- D-03: oversized payload に対する最終 fallback 契約が定義され、100KB 上限を超えない。
- D-04: README / 実装 / テストの transport 契約が一致する。
