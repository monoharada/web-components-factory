---
name: wcf-mcp-release
description: Bump and verify the publishable @monoharada/wcf-mcp package. Use when preparing an MCP server release or npm publish for packages/mcp-server, especially when version/package-lock/generated MCP artifacts must stay in sync.
---

# wcf-mcp-release

目的: `@monoharada/wcf-mcp` を publish できる状態へ上げる。

## Scope

- 対象は `packages/mcp-server` の version bump
- root package の version は触らない
- bump 後に generated artifacts と verify を揃える

## Standard Workflow

1. 現在 version を確認
   - `packages/mcp-server/package.json`
   - `packages/mcp-server/package-lock.json`
2. semver を決めて bump
   - 推奨: `npm --prefix packages/mcp-server version <x.y.z> --no-git-tag-version`
3. publish 影響のある生成物を更新
   - `npm run cem:analyze`
   - `npm run llms:generate`
   - `npm run mcp:build`
   - `npm run mcp:summary`
4. 品質ゲート
   - `npm run validate:wc`
   - `npm run mcp:check`
   - `npm run mcp:check:response-size`
   - `npm run agents:verify`
5. commit 前に確認
   - `packages/mcp-server/package.json`
   - `packages/mcp-server/package-lock.json`
   - `packages/mcp-server/mcp-spec-test/summary/v3-final.json`
   - `packages/mcp-server/data/*`
   - `custom-elements.json`
   - `llms-full.txt`
   - `docs/llms/*`
6. publish する場合
   - `cd packages/mcp-server`
   - `npm publish --access public`

## Guardrails

- `npm version` の git tag 自動作成は使わない
- generated files を含めずに publish しない
- `agents:verify` が generated-clean で止まったら、未コミット生成物を含めて再度実行する
- version mismatch を残さない
  - `packages/mcp-server/package.json`
  - `packages/mcp-server/package-lock.json`
  - MCP summary の package version

## Quick Checklist

- `@monoharada/wcf-mcp` version が更新されている
- package-lock も同じ version
- `npm run agents:verify` 成功
- publish 対象 branch / PR に generated files が含まれている
