# Scope

## Included
- `packages/mcp-server/bin.mjs` の HTTP 起動シーケンス、endpoint path handling、host/origin allowlist
- `packages/mcp-server/core/response.mjs` の size fallback 契約
- `packages/mcp-server/README.md` の HTTP endpoint / startup behavior 記述
- `packages/mcp-server/bin.test.js` と `packages/mcp-server/server.test.js` の回帰テスト追加

## Excluded
- tool payload 自体の内容見直し
- stdio transport の挙動変更
- publish automation や npm release 手順の変更
- issue #253 で既に解消済みの structuredContent / version / severity ロジックの再設計

## Assumptions
- この PR の中で follow-up 修正を完結させる。
- HTTP endpoint は引き続き loopback bind のみを前提とする。
- oversized response 時は「データを縮退したことがわかる明示的な fallback」を返してよい。

## Unknowns
- U-01: 100KB 超過時の最終 fallback を `isError: true` にするか、warning payload として返すか。
