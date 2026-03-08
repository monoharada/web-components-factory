# Scope

## Included
- plugin tool handler が raw MCP result を返す経路の size guard 方針整理
- `buildJsonToolErrorResponse()` の境界超過修正
- 関連 unit/integration test の追加
- 必要なら README への contract 追記

## Excluded
- `packages/mcp-server` 以外の component / app code
- transport 実装の追加変更
- publish version の再 bump

## Unknowns
- U-01: oversize な raw plugin result を overflow payload へ潰す際、`isError` をどう継承するか
- U-02: raw plugin result の `content` に text 以外が含まれるケースでも、同一 guard で十分か
