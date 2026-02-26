# Goal

## Goal Statement
Issue `#174` の目的は、`validate_markup` にトークン誤用検出（warning + トークン提案）を追加し、`get_component_api` / `get_design_tokens` / `search_guidelines` の3ツールで `structuredContent` を返せるようにして、Code Generation 評価を 4/5 から 5/5 に引き上げること。

## Success Criteria
- KR-01: `validate_markup` に token misuse 検出テストを3件以上追加し、全件 pass する。
- KR-02: 主要3ツールが `content` と `structuredContent` の dual response を返す。
- KR-03: 既存 `content` 互換（既存テスト前提）が維持される。
- KR-04: `packages/mcp-server/server.test.js` が全件 pass する。
- KR-05: `mcp:check:response-size` を含む品質ゲートが pass する。
- KR-06: `#177` の前提（#174 で structuredContent 実装済み）を満たす証跡を残す。

## Hard Constraints
- F-01: 既存ツール互換を壊さない。
- F-04: `docs/reports/wcf-mcp-vs-serendie-comparison.md` の Code Generation Evidence を更新可能な証跡を用意する。
- F-05: `@modelcontextprotocol/sdk` 互換（`^1.26.0`）を前提にする。
- NG-04: 破壊的変更（`content` 廃止や既存入力契約破壊）をしない。
- NG-05: 1ツール応答 100KB 超過を避ける。
