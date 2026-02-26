# Contract

## C-01 Backward Compatibility (NG-04 / F-01)
- Rule: 既存ツール引数・既存 `content` レスポンスを破壊しない。
- Verification: `npm test -- --run packages/mcp-server/server.test.js`

## C-02 CI Gate (F-02)
- Rule: PR前に `agents:verify` を必ず通す。
- Verification: `npm run agents:verify`

## C-03 Response Size (NG-05 / F-03)
- Rule: 単一ツール応答は 100KB 以下。
- Verification: `npm run mcp:check:response-size`

## C-04 Evidence Update (F-04)
- Rule: 各Issueで §4 Evidence を更新し、5/5根拠を記載する。
- Verification: `docs/reports/wcf-mcp-vs-serendie-comparison.md` の該当行更新レビュー

## C-05 SDK Compatibility (F-05)
- Rule: structuredContent/resources/prompts/streaming は SDK 対応機能のみ使用。
- Verification: SDKスモーク + `npm run agents:verify`

## C-06 Non-goals Guard NG-01
- Rule: AutoRAG/ベクトル検索を導入しない。
- Verification: 差分レビュー（新規ベクトル依存なし）

## C-07 Non-goals Guard NG-02
- Rule: OpenAI Apps SDK 対応を実装しない。
- Verification: 差分レビュー（Apps SDK依存なし）

## C-08 Non-goals Guard NG-03
- Rule: 移行支援ツールを追加しない。
- Verification: 差分レビュー（migration CLI/guide追加なし）

## C-09 Theme Constraint NG-06 (`#170`)
- Rule: テーマ対応は API 先行。実データ返却は `light` のみ。
- Verification: `theme=light|dark|all` 契約テスト

## C-10 Experimental Constraint NG-07 (`#171`)
- Rule: プラグインAPIは `@experimental` を維持。
- Verification: 型定義/README/issue checklist の注記確認

## C-11 PR Granularity
- Rule: 1 PR = 1 Issue を基本。cross-cuttingは owner issue で実装、他は記述/検証のみ。
- Verification: PRスコープレビュー

## C-12 Mandatory Command Set (per PR)
- Rule: 下記コマンドを Done 条件に含める。
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm test -- --run packages/mcp-server/server.test.js`
  - `npm run agents:verify`
