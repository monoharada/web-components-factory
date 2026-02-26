# MCP Server Upgrade - Goal

## Purpose

wcf-mcp server の主要ギャップ3点を解消し、業界水準のデザインシステムMCPサーバーに近づける。

## Background

比較レポート (`docs/reports/wcf-mcp-vs-serendie-comparison.md`) の分析結果:
- Token/Style Management スコアが業界最大ギャップ (-3点)
- ガイドライン検索機能の欠如
- stdio のみのトランスポート対応

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Tool count | 9 | 11 |
| Transport | stdio only | stdio + HTTP (local) |
| Token query | N/A | get_design_tokens |
| Guideline search | N/A | search_guidelines |
| Code duplication | server.mjs + design-system-mcp.mjs | core.mjs (single source) |

## Related Issues

- #165: `get_design_tokens`
- #166: `search_guidelines`
- #167: HTTP transport + server refactoring
