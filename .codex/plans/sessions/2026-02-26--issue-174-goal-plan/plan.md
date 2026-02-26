# Plan

## Execution Plan

### P-01
- Objective: #174 の実装境界を固定する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: structuredContent 対象を主要3ツールに限定し、scope外変更を防ぐテスト観点を定義する。
- Verification: 対象/非対象ツールの契約観点をテストケースとして列挙する。

### P-02
- Objective: `get_component_api` を dual response 化する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: 既存 `content` を維持したまま `structuredContent: { type: 'application/json', data: ... }` で同等データを返す。
- Verification: not found 含むレスポンス形状テスト。

### P-03
- Objective: `get_design_tokens` を dual response 化する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: `total/tokens/summary` を `content` と `structuredContent: { type: 'application/json', data: ... }` で整合させる。
- Verification: `type/category/query` フィルタで契約一致確認。

### P-04
- Objective: `search_guidelines` を dual response 化する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: `query/topic/totalHits/results` を `structuredContent: { type: 'application/json', data: ... }` で machine-readable に返す。
- Verification: スコア順/`maxResults` の既存挙動が不変であることを確認。

### P-05
- Objective: token misuse 検出ロジックを追加する。
- Files: `packages/mcp-server/validator.mjs`, `packages/mcp-server/core.mjs`
- Work: `style="..."`（inline style）内のハードコード値を warning として検出し、完全一致テーブルによるトークン提案文を生成する。初期対象は `color`,`background-color`,`padding`,`padding-top`,`padding-right`,`padding-bottom`,`padding-left` に限定する。
- Verification: 検出 3件以上 + 非検出（正しいトークン使用）テスト。

### P-06
- Objective: `validate_markup` の診断統合を行う。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: 既存診断に加えて token misuse 診断を併存させる。
- Verification: 既存 `unknownElement/unknownAttribute` を壊さない回帰テスト。

### P-07
- Objective: 品質ゲートを実行し、#174 の完了条件を満たす。
- Files: `packages/mcp-server/*`
- Work: 必須コマンドを通して互換性・サイズ・CIゲートを確認する。
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run test:run -- packages/mcp-server/server.test.js`
  - `npm run agents:verify`
  - `WCF_MCP_DISABLE_STRUCTURED_CONTENT=1` で content-only fallback 回帰を確認する。

### P-08
- Objective: Evidence 更新可能な状態で #177 へ引き継ぐ。
- Files: `docs/reports/wcf-mcp-vs-serendie-comparison.md`（更新手順の確認のみ）
- Work: #174 の証跡項目（実装/テスト/ファイル/スコア根拠）を記録し、#177 前提を満たす。
- Verification: Evidence テンプレ項目が埋められるログを確認。
