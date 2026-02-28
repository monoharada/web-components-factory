# Goal

## Goal Statement
Issue `#178` の目的は、Performance スコアを 4/5 から 5/5 に引き上げるため、Progressive Disclosure の効果検証、レスポンスサイズ最適化、HTTP transport の streaming 実動作検証、キャッシュ/計測導線を実装し、`docs/reports/wcf-mcp-vs-serendie-comparison.md` §4.7 Evidence に 5/5 根拠を提示可能な状態にすること。

## Success Criteria
- KR-01: `list_components` 系の段階取得導線を明確化し、デフォルト20件相当の取得経路を提供する。
- KR-02: 既存互換（`limit` 未指定時の全件返却）を壊さない、または互換例外を明示して合意する。
- KR-03: 全ツール応答サイズが 100KB 以下であることを自動検証できる。
- KR-04: 大応答時の truncation 方針（しきい値/メタ情報/互換）を契約化し実装する。
- KR-05: HTTP transport の streaming 経路を実動作テストで担保する。
- KR-06: データファイル変更検出に基づく cache invalidation / hot-reload 方針を実装する。
- KR-07: ツールごとの latency/bytes を計測できるログ導線を追加する。
- KR-08: `npm run test:run -- packages/mcp-server/server.test.js` が pass する。
- KR-09: `npm run mcp:check:response-size` と `npm run agents:verify` が pass する。
- KR-10: §4.7 Evidence を #178 実装内容で更新し、Performance 5/5 の根拠を示せる。

## Hard Constraints
- F-01: 既存ツール契約の破壊を避ける（互換破壊時は明示合意を必須化）。
- F-03: 単一ツール応答 100KB 超過を許容しない。
- F-04: `docs/reports/wcf-mcp-vs-serendie-comparison.md` §4.7 に 5/5 根拠を提示する。
- F-05: `@modelcontextprotocol/sdk` の互換範囲で実装する。
- NG-05: 1ツール応答を 100KB 以下に保つ。

## Definition of Done
- D-01: #173 後の baseline（サイズ/件数/応答時間）を計測して記録できる。
- D-02: デフォルト20件相当の段階取得経路を実装し、契約テストを追加できる。
- D-03: 既存 `list_components` 契約との互換戦略（維持 or 例外合意）をコード/テスト/README で明示できる。
- D-04: `get_design_tokens` を含む大応答系でページング/制限/切り詰め契約を実装できる。
- D-05: truncation 発生時のメタ情報（例: truncated, originalSizeBytes）を返却できる。
- D-06: HTTP transport の streaming 実動作を統合テストで確認できる。
- D-07: cache invalidation / hot-reload の正常系・異常系テストを追加できる。
- D-08: performance logging（tool, durationMs, bytes, truncated, cacheHit, transport）を実装できる。
- D-09: response-size チェックを worst-case マトリクス化できる。
- D-10: `npm run test:run -- packages/mcp-server/server.test.js` が pass する。
- D-11: `npm run mcp:check:response-size` / `npm run agents:verify` が pass する。
- D-12: §4.7 Evidence に #178 の実装/検証/結果を追記できる。

## DoD Notes
- `dod` 入力は未指定のため、`D-01..D-12` は issue 本文と現行契約から正規化した暫定DoD。
- 実装開始条件はユーザーの `APPROVE PLAN`。
