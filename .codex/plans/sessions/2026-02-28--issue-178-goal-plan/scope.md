# Scope

## In Scope
- `packages/mcp-server/core.mjs` の performance 関連契約実装（ページング/切り詰め/メタ情報）。
- `packages/mcp-server/bin.mjs` / `packages/mcp-server/server.mjs` の HTTP streaming 検証導線。
- `scripts/mcp/check-response-size.mjs` の worst-case 強化。
- `packages/mcp-server/server.test.js` の契約テスト追加（streaming/truncation/cache/perf logging）。
- `packages/mcp-server/README.md` と `docs/knowledge/design-system-mcp.md` の契約同期。
- `docs/reports/wcf-mcp-vs-serendie-comparison.md` §4.7 Evidence 更新。

## Out of Scope
- MCP SDK 自体の fork / 拡張。
- OpenAI Apps SDK 等の新規プラットフォーム統合。
- `packages/components/**` の UI コンポーネント改修。
- #177 の docs-only 改修領域の再実装。

## Assumptions
- #173 は実装済みで、`query/limit/offset` 導線は利用可能。
- #176 により HTTP transport は導入済み。
- 現行契約（`limit` 未指定時 all）はテストで固定されている。
- 100KB ガードは既存 `mcp:check:response-size` を基礎に拡張する。

## Unknown Handling
- U-01: 「default 20件」を既存 `list_components` の破壊変更で達成するか、新しい推奨経路（例: `list_components_v2`）で達成するかは実装方針選択が必要。Plan では互換優先案を採用する。
- U-02: HTTP streaming は SDK transport 実装依存のため、E2E 契約は「接続・呼び出し・並列・異常系」を最小保証として定義する。

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
