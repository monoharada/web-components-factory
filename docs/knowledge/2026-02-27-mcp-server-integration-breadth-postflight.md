# 2026-02-27 MCP Server Integration Breadth Postflight

## Context
- Feature or PR: #176 `feat(mcp): Integration Breadth 5/5`
- Date: 2026-02-27
- Scope:
  - `packages/mcp-server/core.mjs`
  - `packages/mcp-server/server.mjs`
  - `scripts/mcp/design-system-mcp.mjs`
  - `scripts/mcp/build-mcp-package.mjs`
  - `packages/mcp-server/server.test.js`
  - `packages/mcp-server/README.md`
  - `docs/knowledge/design-system-mcp.md`
  - `docs/reports/wcf-mcp-vs-serendie-comparison.md`

## What Worked
- `figma_to_wcf` prompt と `wcf://` resources を overview に集約し、導線を1箇所で発見できる形にできた。
- `ResourceTemplate` で `wcf://guidelines/{topic}` を実装し、topic の許容値を固定できた。
- `InMemoryTransport` 契約テストで `list/get/read` と異常系を同時に担保できた。

## What Blocked Progress
- coverage base 比較は一時 worktree 側で依存解決（`npm ci`）が必要で、実行コストが高かった。

## Root Causes
- base/head 比較を自動化する専用スクリプトがなく、毎回手順を組み立てる必要がある。

## New Rules
- Rule: MCP の prompt/resource を追加したら、`core.mjs` 実装・`server.test.js` 契約テスト・README/knowledge/report を同一PRで同期更新する。
- Rationale: 実装と導線/証跡のずれを防ぐため。
- Scope: `packages/mcp-server/**`, `docs/knowledge/design-system-mcp.md`, `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Example: `wcf://llms-full` 追加時に loader（server/script）と build copy、tests、docs を同時更新する。
- Exceptions: 緊急 hotfix で docs 同期が遅れる場合は、同日中に follow-up を必須にする。

## Next Time Checklist
- [ ] base/head coverage 比較は `0.1pp` しきい値で 4 指標を必ず記録する。
- [ ] text resource を追加したら `mcp:build` のコピー対象と `.gitignore` の運用を先に確認する。
- [ ] PR作成前に `npm run agents:verify` と `npm run mcp:check:response-size` を再実行する。
