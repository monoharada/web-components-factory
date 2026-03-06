# Goal

## Goal Statement
`packages/mcp-server` の `@monoharada/wcf-mcp` について、公開 MCP 契約を壊さずに保守性・データ整合性・検証容易性を改善するためのコードベース評価と段階的リファクタリング計画を確定する。

## Success Criteria
- KR-01: アーキテクチャ上の主要ホットスポットを、具体的なファイル/責務/ドリフト根拠付きで整理できる。
- KR-02: 公開契約（built-in 16 tools、1 prompt、5 resources、plugin/config/prefix/structuredContent 挙動）をハード制約として固定できる。
- KR-03: `core.mjs` / `validator.mjs` / `server.mjs` / `bin.mjs` / `server.test.js` / build-docs 系まで含む段階的リファクタリング順序を確定できる。
- KR-04: package 同梱データ、repo-local wrapper、README/knowledge docs の整合回復計画を含められる。
- KR-05: 実装時の検証ゲート（unit/contract/package/response-size/agent verify）と rollback 条件を定義できる。
- KR-06: 保存済み planning pack（goal/scope/research/plan/risk/contract/audit/readiness）から、そのまま実装に着手できる。

## Hard Constraints
- F-01: 既存の MCP 契約（tool 名・resource URI・prompt 名・主要レスポンス shape）を、明示合意なしに破壊しない。
- F-02: `npx @monoharada/wcf-mcp` の bundled 実行系と `npm run mcp:design-system` の repo-local 実行系を両立させる。
- F-03: prefix 対応、plugin contract、`WCF_MCP_DISABLE_STRUCTURED_CONTENT`、100KB 応答ガードの意味論を維持する。
- F-04: big-bang rewrite を避け、互換 shim を使いながら小さくレビュー可能な単位で進める。
- F-05: `mcp:build` / `mcp:check` / `mcp:check:response-size` / `agents:verify` による生成物・同梱物・契約検証を維持する。

## Definition of Done
- D-01: 現状アーキテクチャの責務分離とホットスポットを文書化できる。
- D-02: 具体的なドリフト/負債（例: 巨大モジュール、重複 loader map、手書きレスポンス混在、docs/同梱データ不整合）を列挙できる。
- D-03: 公開契約を守るための refactor boundary と compatibility strategy を定義できる。
- D-04: `core.mjs` 分割の段階計画と互換 shim 方針を定義できる。
- D-05: `validator.mjs` 分割と診断ルールの境界設計を定義できる。
- D-06: `server.test.js` の分割・CLI smoke test・wrapper 検証強化の計画を定義できる。
- D-07: package data / build script / repo-local wrapper の整合回復計画を定義できる。
- D-08: README / knowledge docs / テストコメントのドリフト解消方針を定義できる。
- D-09: 実装フェーズで実行すべき検証コマンドとゲート条件を定義できる。
- D-10: planning pack を保存し、`READY_FOR_IMPLEMENTATION` 判定を出せる。

## DoD Notes
- `dod` 入力は未指定のため、`D-01..D-10` は依頼内容と現行コードベース観察結果から正規化した暫定 DoD。
- 実装開始条件はユーザーの `APPROVE PLAN`。
