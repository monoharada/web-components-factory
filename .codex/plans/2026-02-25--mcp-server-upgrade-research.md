# MCP Server Upgrade - Research

## Comparison Report Summary

Source: `docs/reports/wcf-mcp-vs-serendie-comparison.md`

### Key Gaps Identified

1. **Token/Style Management (-3)**: serendie-mcp exposes design tokens via MCP tools; wcf-mcp does not
2. **Guideline Search**: serendie-mcp provides guideline querying; wcf-mcp relies on external docs
3. **Transport**: serendie-mcp supports both stdio and HTTP; wcf-mcp is stdio-only

### Industry Patterns

- Design token exposure via structured JSON (type + category + CSS variable)
- Keyword-based guideline search with section-level granularity
- HTTP transport for local IDE integration (VS Code, Cursor)

## Token Source Analysis

- `packages/styles/design-tokens/index.ts`: ~315 CSS custom properties (color, typography, radius, elevation)
- `packages/styles/spacing-tokens.ts`: ~75 CSS custom properties (spacing scale, rem, px)
- Extraction pattern: regex on template literals (`--name: value;`)

## Guideline Source Analysis

- `docs/rules/*.md`: 8 files (component rules, patterns)
- `docs/adr/*.md`: 5 files (architecture decisions)
- `.claude/skills/css-writing-rules/references/*.md`: 7 files (CSS guidelines)
- Other `docs/*.md`: accessibility, design tokens, typography
