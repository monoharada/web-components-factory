# Risk Register

## R-01 (HIGH)
- Risk: structuredContent 追加で既存 `content` 互換を壊す。
- Detection: 主要3ツールのレスポンス契約テスト、既存回帰テスト。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: `content` 必須 + `structuredContent` 追加のみの規約を固定。
- Rollback: structuredContent を feature flag で無効化し旧フォーマット運用へ戻す。

## R-02 (HIGH)
- Risk: token misuse の誤検知過多で実用性が落ちる。
- Detection: 正常fixtureで warning 件数を監視。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: 初期は inline style 限定 + 完全一致提案のみで段階導入。
- Rollback: 誤検知ルールを即時無効化（検出対象縮小/停止）。

## R-03 (HIGH)
- Risk: structuredContent 追加でレスポンスが 100KB を超過する。
- Detection: worst-case 入力のサイズ計測。
- Detection Command: `npm run mcp:check:response-size`
- Mitigation: 上限/要約/切り詰め戦略を適用。
- Rollback: 追加フィールドを縮退し上限超過を解消。

## R-04 (HIGH)
- Risk: SDK 非互換で structuredContent が不安定化する。
- Detection: SDK バージョン確認 + CI 検証。
- Detection Command: `npm ls @modelcontextprotocol/sdk && npm run agents:verify`
- Mitigation: 非対応時 fallback (`content` のみ) を保持。
- Rollback: 安定版へ pin し、該当機能を一時停止。

## R-05 (MEDIUM)
- Risk: #174 の実装が #176/#177 の責務へ越境する。
- Detection: 変更ファイルの範囲監査。
- Detection Command: `git diff --name-only`
- Mitigation: #174 は `packages/mcp-server` 中心に限定し docs/resources 実装を含めない。

## R-06 (MEDIUM)
- Risk: Evidence 不足で 5/5 根拠が不成立になる。
- Detection: Evidence テンプレ要件のチェック。
- Detection Command: `rg -n "Issue \| #174|スコア変更|テストコマンド" docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Mitigation: PR チェックリストに Evidence 更新項目を必須化。

## R-07 (MEDIUM)
- Risk: 入力HTML由来の機密情報/個人情報がログに出力される。
- Detection: デバッグログと失敗ログの出力内容レビュー。
- Detection Command: `rg -n "console\\.|logger\\." packages/mcp-server`
- Mitigation: HTML全文をログしない。診断は tag/attr 単位の最小情報のみ記録する。

## Resolved Unknowns
- U-01: token 提案は「完全一致のみ」を採用する。
- U-02: token misuse 対象は inline style 限定で開始する。
- U-03: structuredContent は `{ type: 'application/json', data: ... }` を採用する。
