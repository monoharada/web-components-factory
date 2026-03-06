# Research

## Sources
- `packages/mcp-server/package.json`
- `packages/mcp-server/bin.mjs`
- `packages/mcp-server/server.mjs`
- `packages/mcp-server/core.mjs`
- `packages/mcp-server/validator.mjs`
- `packages/mcp-server/server.test.js`
- `packages/mcp-server/README.md`
- `packages/mcp-server/wcf-mcp.config.example.json`
- `packages/mcp-server/plugins/design-system-skills/*.mjs`
- `packages/mcp-server/examples/plugins/custom-validation-plugin.mjs`
- `packages/mcp-server/data/*`
- `scripts/mcp/design-system-mcp.mjs`
- `scripts/mcp/build-mcp-package.mjs`
- `scripts/mcp/check-response-size.mjs`
- `docs/knowledge/design-system-mcp.md`
- `.codex/plans/2026-02-25--mcp-server-upgrade-*.md`

## Current Facts
- `packages/mcp-server/core.mjs` は 3448 行・61 exports を持ち、定数辞書・検索/生成 helper・plugin contract・MCP tool/resource/prompt 登録が同居している。
- `packages/mcp-server/validator.mjs` は 1072 行で、HTML/CEM 検証の複数ルールを1ファイルで保持している。
- `packages/mcp-server/server.test.js` は 3984 行の単一ファイルで、core helper unit tests・validator tests・MCP contract tests・runtime config tests を混載している。
- `packages/mcp-server/server.test.js` は `core.mjs` / `validator.mjs` の多数 internal export を直接 import し、`REPO_FILE_MAP` と loader 関数も再定義しているため、内部構造変更に弱い。
- `packages/mcp-server/server.mjs` の `REPO_FILE_MAP` と `scripts/mcp/design-system-mcp.mjs` の `FILE_MAP` が重複しており、bundled/repo-local の data source 解決規則が二重管理になっている。
- `packages/mcp-server/core.mjs` には `buildJsonToolResponse()` がある一方、複数 tool は手書き `{ content: [{ type: 'text', text: ... }] }` を返しており、structuredContent と 100KB guard の適用が一貫していない。
- `scripts/mcp/check-response-size.mjs` は `core.mjs` の多数 helper に直接依存しており、モジュール分割時に coupling hotspot になる。
- `packages/mcp-server/data/` には `skills-registry.json` が存在しないが、`scripts/mcp/build-mcp-package.mjs` は同ファイルの同梱を前提にしており、`wcf://skills` resource との整合にギャップがある。
- `packages/mcp-server/README.md` は「16 tools + 1 prompt + 5 resources」と整合している一方、`docs/knowledge/design-system-mcp.md` や一部テストコメントは旧い tool count（14 tools）前提の記述が残っている。
- `packages/mcp-server/bin.mjs` は手書きの引数パースと transport 分岐を持つが、現行テストは source string 検査寄りで、CLI 挙動そのものの smoke test は薄い。
- 2026-02-25 の upgrade 計画で `core.mjs` への集約は達成済みだが、現在は plugin/config/prefix/structuredContent まで関心事が増え、集約後の再分割フェーズが必要になっている。

## Strengths
- `createMcpServer(loadJsonData, loadValidator, options)` の DI により、npx / repo-local / test の実行形態を切り替えやすい。
- build/check コマンド (`mcp:build`, `mcp:check`, `mcp:check:response-size`) が既にあり、リファクタリング後の退行防止レールを敷きやすい。
- plugin contract と runtime config loader が導入済みで、拡張ポイント自体は明示されている。

## Boundary Notes
- public surface は helper export まで完全 public とは限らないが、tests/scripts が依存しているため、段階的移行が必要。
- docs drift と bundled data drift は、設計負債であると同時に package correctness 問題でもあるため、モジュール分割より前に baseline を固定する価値が高い。
- response envelope を統一すると tool result byte 数が増減しうるため、`mcp:check:response-size` を計画の早い段階で回せる設計が必要。

## Validation Path
- `npm run test:run -- packages/mcp-server/server.test.js`
- `npm run mcp:build`
- `npm run mcp:check`
- `npm run mcp:check:response-size`
- `npm run agents:verify`
- 必要時: `node packages/mcp-server/bin.mjs --transport=http --port=<port>`
- 必要時: `npm run mcp:design-system`

## Resolved Unknowns
- U-01: 現状 contract では `wcf://skills` resource が register されるため、plan 上は bundled data 必須として扱う。
- U-03: test split の主軸は「unit / contract / runtime(cli/config)」でよい。

## Open Unknowns
- U-02: helper export を最終的にどこまで public 維持するかの線引きは、利用箇所棚卸し後に確定する必要がある。
