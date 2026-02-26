# MCP Server Upgrade - Contract

## Completion Criteria

### Step 1: Server Refactoring + HTTP Transport (#167)

- [ ] `packages/mcp-server/core.mjs` exists and exports `createMcpServer()`
- [ ] `packages/mcp-server/server.mjs` is a thin wrapper (~50 lines)
- [ ] `scripts/mcp/design-system-mcp.mjs` imports from core.mjs
- [ ] `npm test -- packages/mcp-server/server.test.js` passes
- [ ] `bin.mjs --transport=http` starts HTTP server on 127.0.0.1

### Step 2: get_design_tokens (#165)

- [ ] `scripts/mcp/extract-design-tokens.mjs` generates `data/design-tokens.json`
- [ ] Token count: color > 100, spacing > 30, typography > 10
- [ ] `get_design_tokens` tool filters by type, category, query
- [ ] Test validates data shape and filter logic

### Step 3: search_guidelines (#166)

- [ ] `scripts/mcp/index-guidelines.mjs` generates `data/guidelines-index.json`
- [ ] Document count >= 20
- [ ] `search_guidelines` tool filters by topic and keyword
- [ ] Test validates search hit relevance

### Overall

- [ ] `npm test -- packages/mcp-server/server.test.js` all pass
- [ ] `get_design_system_overview` reports 11 tools
- [ ] Build pipeline includes token extraction and guideline indexing
