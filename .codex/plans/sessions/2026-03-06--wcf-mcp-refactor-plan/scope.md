# Scope

## In Scope
- `packages/mcp-server/core.mjs` の責務棚卸し、分割方針、response builder/registration 境界の再設計。
- `packages/mcp-server/validator.mjs` の rule 分割・diagnostics orchestration の再設計。
- `packages/mcp-server/server.mjs` / `packages/mcp-server/bin.mjs` / `scripts/mcp/design-system-mcp.mjs` の runtime loader / config / transport 境界の整理。
- `packages/mcp-server/server.test.js` のテスト責務分離と refactor-safe な検証戦略策定。
- `scripts/mcp/build-mcp-package.mjs` / `scripts/mcp/check-response-size.mjs` と package bundled data の整合回復計画。
- `packages/mcp-server/README.md` / `docs/knowledge/design-system-mcp.md` / テストコメントの契約同期方針。

## Out of Scope
- 新規 MCP feature の追加（新 tool / resource / prompt の拡張）。
- `packages/components/**` や design token 生成元そのものの仕様変更。
- `@modelcontextprotocol/sdk` の upgrade / downgrade 実施。
- registry schema (`custom-elements.json`, `install-registry.json`, `pattern-registry.json`, `skills-registry.json`) の意味変更。
- HTTP transport の公開範囲変更（`127.0.0.1` bind 以外への拡張）。

## Assumptions
- 現行の built-in contract は `packages/mcp-server/core.mjs` 内 `BUILTIN_TOOL_NAMES` を基準に 16 tools とみなす。
- repo-local wrapper は `scripts/mcp/design-system-mcp.mjs`、配布用 runtime は `packages/mcp-server/server.mjs` / `bin.mjs` が正系である。
- 既存の helper export は tests / scripts から利用されており、即時削除ではなく互換 shim を前提にする。
- `packages/mcp-server/data/` は `mcp:build` の成果物であり、同梱漏れは build drift とみなす。

## Unknown Handling
- U-01: `wcf://skills` を published package の必須契約として固定するか、データ不在時 degrade gracefully とするかの最終判断が必要。Plan では「resource を公開している以上 bundled 必須」を前提にする。
- U-02: `core.mjs` の 61 exports のうち、どこまでを public helper として維持するかは実装時に棚卸しが必要。Plan では re-export shim 維持を前提にする。
- U-03: test 分割の最終粒度（unit/contract/integration/cli の何本にするか）は実装時に調整する。Plan では責務別 split を優先する。

## Artifacts
- `goal.md`
- `scope.md`
- `research.md`
- `plan.md`
- `risk.md`
- `contract.md`
- `audit.json`
- `readiness.md`
- `agent-ledger.md`
