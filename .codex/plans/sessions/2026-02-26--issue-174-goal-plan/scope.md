# Scope

## In Scope
- `packages/mcp-server/core.mjs` の以下4領域
  - `validate_markup` への token misuse warning 追加
  - `get_component_api` への `structuredContent` 追加
  - `get_design_tokens` への `structuredContent` 追加
  - `search_guidelines` への `structuredContent` 追加
- `packages/mcp-server/server.test.js` への #174 対応テスト追加（token misuse 3件以上、dual response 互換）
- #174 完了証跡として必要な検証コマンド・Evidence 更新要件の固定

## Out of Scope
- `wcf://` resources や prompt 追加（`#176`）
- structuredContent/resources のドキュメント整備（`#177` 実装本体）
- 主要3ツール以外への structuredContent 展開
- 大規模リファクタ、transport 変更、依存追加

## Assumptions
- `@modelcontextprotocol/sdk` `^1.26.0` で structuredContent が利用可能。
- dual response で既存クライアント互換を維持できる。
- token misuse 検出は初期段階では限定ルール（warning）で開始する。

## Artifacts
- `goal.md`
- `scope.md`
- `research.md`
- `plan.md`
- `risk.md`
- `contract.md`
- `audit.json`
- `readiness.md`
- `agent-ledger.md`
