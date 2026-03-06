# Contract

## C-01 Public MCP Contract Freeze
- Rule: built-in 16 tools、1 prompt、5 resources の公開 surface を、明示合意なしに破壊しない。
- Trace: D-02, D-03
- Verification: `packages/mcp-server/core.mjs` の登録一覧と README/knowledge docs の同期確認。

## C-02 Runtime Path Contract
- Rule: bundled (`npx`) と repo-local (`npm run mcp:design-system`) の両方で data source 解決が成立する。
- Trace: D-03, D-07
- Verification: loader/config tests、`npm run mcp:build`, `npm run mcp:check`。

## C-03 Response Envelope Contract
- Rule: JSON tool response の組み立ては single source を持ち、structuredContent opt-out と 100KB guard の適用条件を統一する。
- Trace: D-02, D-03, D-09
- Verification: response shape tests、`npm run mcp:check:response-size`。

## C-04 Core Facade Contract
- Rule: `core.mjs` 分割後も、`createMcpServer()` と必要な helper export は段階的に互換維持する。
- Trace: D-04, D-09
- Verification: existing import sites (`server.test.js`, `check-response-size.mjs`, wrappers) が通ること。

## C-05 Validator Rule Contract
- Rule: validator の診断 code / severity / 順序 / 基本 message 契約を不用意に変えない。
- Trace: D-05, D-09
- Verification: validator regression tests。

## C-06 Test Topology Contract
- Rule: unit / contract / runtime に責務分離しても、既存カバレッジを非劣化に保つ。
- Trace: D-06, D-09
- Verification: targeted test suite、必要なら coverage 比較。

## C-07 Bundled Data Contract
- Rule: 公開 resource/tool が依存する data file は package に同梱され、build/check で欠落を検知できる。
- Trace: D-02, D-07
- Verification: `npm run mcp:build`, `npm run mcp:check`。

## C-08 Docs Sync Contract
- Rule: README / knowledge docs / テストコメントの contract count・用語・導線を現行コードに合わせる。
- Trace: D-08
- Verification: docs diff review、count/URI/name の照合。

## C-09 Plugin and Prefix Contract
- Rule: plugin contract v1、prefix 変換、runtime config の意味論を維持する。
- Trace: D-03, D-07
- Verification: config/plugin tests、prefix-aware contract tests。

## C-10 Verification Gate Contract
- Rule: refactor 完了条件は test + package + response-size + agents verify のゲート通過とする。
- Trace: D-09
- Verification:
  - `npm run test:run -- packages/mcp-server/server.test.js`
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`
