# Plan

## Execution Plan

### P-01
- Objective: 現行 contract と drift baseline を固定する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/README.md`, `docs/knowledge/design-system-mcp.md`, `packages/mcp-server/server.test.js`
- Work: built-in tools/resources/prompt 数、公開 resource、plugin/config/prefix/structuredContent 制約、既知 drift（tool count, bundled data, docs）を一覧化し、互換対象を固定する。
- Verification: contract checklist レビュー、`server.test.js` の既存 contract 群を baseline として整理。

### P-02
- Objective: data source 解決を単一モジュールへ寄せる。
- Files: `packages/mcp-server/server.mjs`, `scripts/mcp/design-system-mcp.mjs`, `packages/mcp-server/bin.mjs`, `packages/mcp-server/server.test.js`
- Work: `REPO_FILE_MAP` / `FILE_MAP` / loader helpers を共通 runtime module に抽出し、bundled/repo-local の差異を設定値で表現する。
- Verification: config loader tests、repo-local / bundled path resolution tests。

### P-03
- Objective: tool response envelope を統一し、size guard の適用経路を一本化する。
- Files: `packages/mcp-server/core.mjs`, `scripts/mcp/check-response-size.mjs`, `packages/mcp-server/server.test.js`
- Work: `buildJsonToolResponse()` または同等 helper を single source にし、手書き JSON response を整理。structuredContent opt-out と 100KB guard の境界を契約化する。
- Verification: response shape tests、`npm run mcp:check:response-size`。

### P-04
- Objective: `core.mjs` を関心ごとごとに分割し、互換 shim を維持する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/lib/**/*.mjs`（新設想定）, `scripts/mcp/check-response-size.mjs`, `packages/mcp-server/server.test.js`
- Work: `catalog/indexes`, `patterns`, `tokens`, `guidelines`, `snippets`, `plugins`, `mcp-registration` などに分離し、`core.mjs` は re-export + `createMcpServer()` の薄い facade にする。
- Verification: existing helper import compatibility、MCP server contract tests。

### P-05
- Objective: `validator.mjs` の rule orchestration を分割し、診断ルール境界を明確化する。
- Files: `packages/mcp-server/validator.mjs`, `packages/mcp-server/validator/**/*.mjs`（新設想定）, `packages/mcp-server/server.test.js`
- Work: enum / slot / required / orphan / a11y / token misuse / runtime scaffold などを rules module 化し、集約器で順序と共通ユーティリティを管理する。
- Verification: validator rule regression tests、diagnostic ordering/shape checks。

### P-06
- Objective: テスト構造を責務別に再編し、壊れやすい検査を挙動検証へ置き換える。
- Files: `packages/mcp-server/server.test.js`, `packages/mcp-server/**/*.test.js`（分割想定）, `packages/mcp-server/bin.mjs`
- Work: unit / contract / runtime(config/cli/http) に分割し、source string 検査を減らして CLI 引数パース・HTTP 起動・wrapper の smoke test を追加する。
- Verification: `npm run test:run -- packages/mcp-server/server.test.js` 相当の回帰確認、分割後の対象テスト pass。

### P-07
- Objective: package bundled data と build pipeline の整合を回復する。
- Files: `scripts/mcp/build-mcp-package.mjs`, `packages/mcp-server/data/*`, `packages/mcp-server/package.json`, `packages/mcp-server/server.test.js`
- Work: `skills-registry.json` を含む同梱物・`files`・examples/documentation の整合を確認し、`wcf://skills` を含む resource の package correctness を固定する。
- Verification: `npm run mcp:build`, `npm run mcp:check`。

### P-08
- Objective: docs / comments / knowledge を現行 contract に同期し、再ドリフトを減らす。
- Files: `packages/mcp-server/README.md`, `docs/knowledge/design-system-mcp.md`, `packages/mcp-server/server.test.js`
- Work: tool count、resource 数、plugin contract 制約、runtime setup、validation workflow をコードに合わせて更新し、可能なら docs drift check の自動化候補を残す。
- Verification: docs diff review、README と knowledge doc の count/terms 一致確認。

### P-09
- Objective: 全体ゲートを通して refactor-ready / ship-ready 状態を確認する。
- Files: 変更一式
- Work: targeted tests → package checks → response-size → agents verify の順で回し、必要なら rollback 条件を再確認する。
- Verification:
  - `npm run test:run -- packages/mcp-server/server.test.js`
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`
