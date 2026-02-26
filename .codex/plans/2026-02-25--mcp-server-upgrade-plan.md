# MCP Server Upgrade - Implementation Plan

## Order

```
Step 1: Server Refactoring + HTTP Transport (#167)
  -> Step 2: get_design_tokens (#165)
  -> Step 3: search_guidelines (#166)
```

## Step 1: core.mjs Extraction + HTTP Transport

1. Create `packages/mcp-server/core.mjs`
   - Extract all helpers from server.mjs
   - Export `createMcpServer(loadJsonData, loadValidator)`
   - Include design-system-mcp.mjs custom snippet logic

2. Modify `packages/mcp-server/server.mjs` -> thin wrapper
   - Import createMcpServer from core.mjs
   - Provide bundled data loader + validator loader
   - Export createServer() and startServer()

3. Modify `packages/mcp-server/bin.mjs`
   - Parse --transport and --port args
   - Support stdio (default) and http transport

4. Modify `scripts/mcp/design-system-mcp.mjs` -> thin wrapper
   - Import createMcpServer from core.mjs
   - Provide repo-direct data loader + validator loader

5. Update `packages/mcp-server/package.json`
   - Add core.mjs to files array

## Step 2: get_design_tokens

1. Create `scripts/mcp/extract-design-tokens.mjs`
2. Add get_design_tokens tool to core.mjs
3. Update build pipeline

## Step 3: search_guidelines

1. Create `scripts/mcp/index-guidelines.mjs`
2. Add search_guidelines tool to core.mjs
3. Update build pipeline
4. Update overview tool with new tools
5. Add tests
