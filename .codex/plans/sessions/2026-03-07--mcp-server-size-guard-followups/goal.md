# Goal

- `packages/mcp-server` の tool result size guard を built-in / plugin / error helper の全経路で一貫させる。
- `MAX_TOOL_RESULT_BYTES` を「最終返却 object 全体」の上限として保証する。
- 既存の MCP contract を壊さず、overflow 時の挙動をテストで固定化する。
