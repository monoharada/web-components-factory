# Research

## Sources
- `packages/mcp-server/core.mjs`
- `packages/mcp-server/bin.mjs`
- `packages/mcp-server/server.mjs`
- `packages/mcp-server/server.test.js`
- `scripts/mcp/check-response-size.mjs`
- `packages/mcp-server/README.md`
- `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- `.codex/plans/sessions/2026-02-26--mcp-45-roadmap-170-178-replan/plan.md`
- GitHub Issue `#178`

## Current Facts
- `list_components` は `limit` 未指定時に全件返却し、互換テストでも固定されている（`server.test.js` の backward compatibility ケース）。
- `list_components` / `search_icons` は `query/limit/offset` を持ち、Progressive Disclosure の土台は実装済み。
- `get_design_tokens` は `type/category/query/theme` を受けるが、独立した pagination/truncation 契約は未整備。
- 100KB ガードは `MAX_STRUCTURED_CONTENT_BYTES` と `mcp:check:response-size` で担保しているが、scenario は限定的。
- HTTP transport は `StreamableHTTPServerTransport` で接続済みだが、実際の streaming 経路テストは不足している。
- §4.7 Performance は現時点で 4/5 の記載で、#178 Evidence が未更新。
- cache invalidation / hot-reload / perf logging の専用実装は未整備。

## Boundary Notes
- #178 は #173 の再実装ではなく「効果検証 + 追加最適化」が主責務。
- 互換（F-01）と default 20 の達成条件には衝突があるため、互換優先の段階導線（新経路）を第一案とする。
- 100KB 制約（F-03/NG-05）は新規機能追加後も必ず自動検証に残す。

## Validation Path
- `npm run test:run -- packages/mcp-server/server.test.js`
- `npm run mcp:check:response-size`
- `npm run mcp:check`
- `npm run agents:verify`
- （必要時）`node packages/mcp-server/bin.mjs --transport=http --port=<port>` を使った streaming スモーク

## Resolved Unknowns
- U-02: streaming の最低保証は E2E 契約（接続・呼び出し・異常系）で定義可能。

## Open Unknowns
- U-01: default 20 達成方式の最終採択（互換維持のまま新経路追加で進める前提）。
