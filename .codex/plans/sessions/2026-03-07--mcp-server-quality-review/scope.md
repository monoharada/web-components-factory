# Scope

## In Scope
- `packages/mcp-server/*.mjs`
- `packages/mcp-server/core/*.mjs`
- `packages/mcp-server/plugins/design-system-skills/*.mjs`
- `packages/mcp-server/*.test.js`
- `packages/mcp-server/README.md`
- MCP 仕様 / SDK 実装との整合確認

## Out of Scope
- `packages/components/**` など design system 本体の品質監査
- package publish 設定の全面見直し
- 実装修正、リファクタ、コミット

## Assumptions
- 依存 SDK は `@modelcontextprotocol/sdk@^1.26.0` を前提とする。
- stdio transport は主要経路、HTTP transport は補助経路だが壊れていてよい機能ではない。
- 今回の成果物は「修正着手前の review + plan」として使う。

## Unknowns
- U-01: HTTP transport を stateless のまま保つか、session 管理ありに切り替えるか。
- U-02: `validate_markup` の `aria-live` / `role=alert` severity を README 側に合わせるか、実装側に合わせるか。
