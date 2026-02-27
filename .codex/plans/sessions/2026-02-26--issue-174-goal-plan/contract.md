# Contract

## C-01 Scope Lock
- Rule: structuredContent は `get_component_api` / `get_design_tokens` / `search_guidelines` の3ツールにのみ追加する。
- Verification: 対象3ツールの契約テスト + 非対象ツール不変確認。

## C-02 Backward Compatibility
- Rule: 既存 `content` 形式を維持し、破壊的変更を行わない。
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`

## C-03 `get_component_api` Contract
- Rule: API payload を `structuredContent: { type: 'application/json', data: ... }` でも欠落なく返す。
- Verification: 正常系/Not Found 系レスポンステスト。

## C-04 `get_design_tokens` Contract
- Rule: `total/tokens/summary` を dual response（`structuredContent` は `{ type: 'application/json', data: ... }`）で整合させる。
- Verification: `type/category/query` 条件ごとの一致テスト。

## C-05 `search_guidelines` Contract
- Rule: `query/topic/totalHits/results` を dual response（`structuredContent` は `{ type: 'application/json', data: ... }`）で返し、ランキング規則を変えない。
- Verification: スコア順・件数上限テスト。

## C-05a StructuredContent Schema
- Rule:
  - `get_component_api`: `data` は `tagName,className,attributes,slots,events,cssParts,cssProperties` を必須とする。
  - `get_design_tokens`: `data` は `total,tokens,summary` を必須とする。
  - `search_guidelines`: `data` は `query,topic,totalHits,results` を必須とする。
- Verification: ツール別 schema 契約テスト（必須キー欠落時 fail）。

## C-06 Token Misuse Contract
- Rule: token misuse は inline style 限定で warning として返し、完全一致ベースのトークン提案を含める。初期対象プロパティは `color`,`background-color`,`padding`,`padding-top`,`padding-right`,`padding-bottom`,`padding-left` に限定する。
- Verification: 検出テスト3件以上 + 正常系誤検知ゼロ確認。

## C-07 Size/CI Gate
- Rule: response-size 制約と CI ガードレールを通す。
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`

## C-08 Cross-Issue Boundary
- Rule: #177 は依存先として明記するが、#174 で #177 実装を行わない。
- Verification: 変更範囲レビュー（#174 スコープ内のみ）。

## C-09 Rollback Flag Contract
- Rule: `structuredContent` は feature flag `WCF_MCP_DISABLE_STRUCTURED_CONTENT` で無効化可能にし、緊急時は `content` のみ返却へ切戻せること。
- Verification: flag ON/OFF の回帰テストを追加する。
