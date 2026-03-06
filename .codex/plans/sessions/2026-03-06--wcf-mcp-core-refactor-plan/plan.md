# Plan

## Execution Plan

### P-01
- Objective: 公開 export と import site を固定し、互換対象を決める。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/runtime.test.js`, `packages/mcp-server/server.test.js`, `scripts/mcp/check-response-size.mjs`
- Work: 直参照されている export を棚卸しし、facade に残すものと内部専用へ落とせるものを分類する。
- Verification: import site checklist を作り、最小変更で動く前提を固定する。

### P-02
- Objective: pure helper を先に内部 module へ抽出する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/core/response.mjs`, `packages/mcp-server/core/prefix.mjs`, `packages/mcp-server/core/constants.mjs`
- Work: response / prefix / constants 系を抽出し、`core.mjs` から re-export する。
- Verification: helper import tests、`scripts/mcp/check-response-size.mjs` の回帰確認。

### P-03
- Objective: plugin runtime helper を分離する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/core/plugins.mjs`, `packages/mcp-server/runtime.test.js`
- Work: `PLUGIN_CONTRACT_VERSION`、`normalizePlugins()`、`buildPluginDataSourceMap()` と plugin helper 注入ロジックを module 化する。
- Verification: `packages/mcp-server/runtime.test.js`

### P-04
- Objective: catalog/search/patterns 系の純ロジックを分離する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/core/cem.mjs`, `packages/mcp-server/core/tokens.mjs`, `packages/mcp-server/core/patterns.mjs`
- Work: CEM index、tokens、patterns、selector/guide 系の pure function を責務別に移す。
- Verification: contract tests、`npm run mcp:check:response-size`

### P-05
- Objective: `createMcpServer()` から register 層を抽出する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/core/register.mjs`, `packages/mcp-server/server.test.js`
- Work: built-in tools / resources / prompt / plugin bridge の登録処理を register helper 化し、`createMcpServer()` は orchestration に縮退させる。
- Verification: tool/resource/prompt contract tests

### P-06
- Objective: package 同梱条件と最小 docs 追従を行う。
- Files: `packages/mcp-server/package.json`, `packages/mcp-server/README.md`, `docs/knowledge/design-system-mcp.md`
- Work: 新規内部 module を `files` に追加し、必要最小限の docs 追従だけ行う。
- Verification: `npm run mcp:check`

### P-07
- Objective: 全体ゲートを通して完了判定する。
- Files: 変更一式
- Work: targeted tests → package/data checks → response-size → agents verify の順で検証する。
- Verification:
  - `npm run test:run`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`
