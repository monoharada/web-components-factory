# Goal

## Goal Statement
`packages/mcp-server/core.mjs` を「純ロジック」と「MCP 登録・オーケストレーション」に段階分割し、公開契約を壊さずに変更安全性・レビュー容易性・保守性を上げる。

## Success Criteria
- KR-01: `core.mjs` の責務クラスタと高リスク境界を、既存 import/contract を含めて明文化できる。
- KR-02: 小さくレビュー可能な段階計画（pure helper 抽出 → register 層抽出 → facade 縮退）を定義できる。
- KR-03: `core.mjs` を当面の互換 facade（re-export + orchestration）として維持する方針を固定できる。
- KR-04: `createMcpServer()` を register 層呼び出し中心へ寄せる実装順序を定義できる。
- KR-05: npm package の `files` と周辺 script/test import を壊さない条件を固定できる。
- KR-06: 実装完了判定に必要な検証ゲートを明示できる。

## Hard Constraints
- F-01: tool/resource/prompt の公開面（名前、件数、説明、返却 shape、登録順の実質契約）を明示合意なく変更しない。
- F-02: `core.mjs` 直接 import に依存する tests / scripts は、当面互換維持する。
- F-03: `buildJsonToolResponse()`、`structuredContent` opt-out、100KB guard、plugin helper 契約を維持する。
- F-04: big-bang rewrite を避け、re-export と薄い facade を残しながら段階移行する。
- F-05: `npm run mcp:check` / `npm run mcp:check:response-size` / `npm run agents:verify` を最終ゲートにする。

## Definition of Done
- D-01: `core.mjs` の責務分離方針と移設候補モジュールを定義できる。
- D-02: `core.mjs` の既存 export 互換維持方針を定義できる。
- D-03: `createMcpServer()` の register 層抽出順序と境界を定義できる。
- D-04: tool/resource/prompt contract の不変条件を contract に固定できる。
- D-05: npm package の `files` 更新条件と package risk を定義できる。
- D-06: 高リスク項目に detection / rollback を付けられる。
- D-07: 実装時に通すべき検証コマンドと完了条件を固定できる。
- D-08: planning pack を保存し、`READY_FOR_IMPLEMENTATION` 判定を出せる。

## DoD Notes
- 本 DoD は「`core.mjs` refactor 実装に着手できる計画が揃っているか」の判定用。
- ユーザー依頼により、本 planning pack は GitHub Issue 化の入力にも使う。
