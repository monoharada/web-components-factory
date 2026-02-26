# MCP Server Upgrade - Risk

## Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Token regex misses complex values (calc, rgba, multi-value) | Medium | Medium | Test with actual token files; accept raw string values |
| Guidelines index grows too large | Low | Low | 500-char snippet limit; .md only; ~200KB estimate |
| HTTP transport security exposure | Low | High | 127.0.0.1 bind only; no auth needed for localhost |
| core.mjs extraction breaks existing behavior | Medium | High | Maintain startServer() backward compat; run all existing tests |
| design-system-mcp.mjs validator import path | Low | Medium | DI injection for loadValidator |

## Rabbit Holes to Avoid

1. Full-text search engine (Lunr.js, etc.) - simple keyword matching is sufficient
2. Token versioning/diffing - out of scope
3. Remote HTTP deployment - localhost only
4. Complex scoring algorithms for search - basic heading/keyword/snippet scoring
