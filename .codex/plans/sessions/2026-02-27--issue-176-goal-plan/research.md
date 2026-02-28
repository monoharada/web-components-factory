# Research

## Sources
- `packages/mcp-server/core.mjs`
- `packages/mcp-server/server.mjs`
- `packages/mcp-server/server.test.js`
- `packages/mcp-server/README.md`
- `docs/knowledge/design-system-mcp.md`
- `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- `.codex/plans/sessions/2026-02-26--mcp-45-roadmap-170-178-replan/plan.md`
- `package.json`

## Current Facts
- 組み込み14ツール定義は [core.mjs:97](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:97)、登録実体は `createMcpServer` の `registerTool` 群（例: [core.mjs:1408](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:1408), [core.mjs:1500](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:1500), [core.mjs:2042](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:2042)）。
- plugin tool 追加登録は [core.mjs:2129](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:2129)。
- 現時点で `registerPrompt` / `registerResource` 実装は `packages/mcp-server` と `scripts/mcp` に存在しない（探索結果 0件）。
- runtime data source は5ファイルに固定（[server.mjs:20](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/server.mjs:20)）。
- `get_design_system_overview` は `ideSetupTemplates` を返し、現在は Claude Desktop / Claude Code / Cursor の3種（[core.mjs:123](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:123), [core.mjs:1435](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/core.mjs:1435), テスト: [server.test.js:174](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/packages/mcp-server/server.test.js:174)）。
- #176 の Evidence 更新対象は Integration セクション（[wcf-mcp-vs-serendie-comparison.md:375](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/docs/reports/wcf-mcp-vs-serendie-comparison.md:375), [wcf-mcp-vs-serendie-comparison.md:402](/Users/reiharada/dev/web-components-factory/.claude/worktrees/feat-mcp-server-upgrade/docs/reports/wcf-mcp-vs-serendie-comparison.md:402)）。

## Boundary Notes
- #176 は Integration 5/5 の実装オーナーとして resources URI 設計を確定する。
- #177 は docs/description 統合が主責務のため、#176 は必要最小限の docs 更新に留める。
- 既存 tool 契約互換（F-01）を最優先とし、新規機能は optional な経路で追加する。

## Validation Path
- `npm run test:run -- packages/mcp-server/server.test.js`
- `npm run mcp:build`
- `npm run mcp:check`
- `npm run mcp:check:response-size`
- `npm run agents:verify`

## Resolved Unknowns
- U-01: Figma URL は strict reject よりも「受理して手順提示」を優先する。
- U-02: prompt 応答は text 契約で開始し、structuredContent は互換確認後に拡張する。
- U-03: guideline topic は `accessibility|css|patterns|all` に限定する。
- U-04: IDE設定導線は overview + 2ドキュメント（README/knowledge）で同期する。
- U-05: `wcf://llms-full` の内容は `llms-full.txt` を一次ソースにする。

## Open Unknowns
- なし（現時点で実装開始に必要な追加ユーザー回答は不要）。
