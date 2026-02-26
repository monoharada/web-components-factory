# Risk Register

## R-01 (HIGH)
- Risk: `get_accessibility_docs` 追加で既存ツール契約を壊す。
- Detection: `server.test.js` の既存回帰 + 新規契約テスト。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: 新規ツール追加のみで既存引数/返却を変更しない。
- Rollback: 新規ツール登録を feature flag で無効化し旧状態に戻す。

## R-02 (HIGH)
- Risk: WCAG フィルタ仕様が曖昧で誤挙動になる。
- Detection: `A/AA/AAA/all` の表駆動テスト。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: 初期仕様を「単一値 + exact match」に固定。
- Rollback: `wcagLevel` を `all` 固定に縮退して誤判定を回避。

## R-03 (HIGH)
- Risk: A11y index 拡張で応答サイズが 100KB を超過する。
- Detection: response-size 計測。
- Detection Command: `npm run mcp:check:response-size`
- Mitigation: `maxResults` 既定値設定と summary 返却を徹底。
- Rollback: 返却フィールドを縮小し payload を制限。

## R-04 (HIGH)
- Risk: `validate_markup` 追加診断が既存診断を壊す。
- Detection: unknown/forbidden/tokenMisuse 回帰テスト。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: 診断追加は併存のみ（既存ロジック非変更）で実装。
- Rollback: 追加 detector を無効化して既存診断のみ運用。

## R-05 (MEDIUM)
- Risk: #176/#177 の責務（resources/文書横断）へ越境する。
- Detection: 変更ファイル範囲監査。
- Detection Command: `git diff --name-only`
- Mitigation: #175 は `packages/mcp-server` 中心に限定。

## R-06 (MEDIUM)
- Risk: checklist ソース不整合で component ごとの差が説明不能になる。
- Detection: サンプル component の比較テスト。
- Detection Command: `npm run test:run -- packages/mcp-server/server.test.js`
- Mitigation: `custom.a11yAnnotations` を優先し、fallback 優先順位を固定。

## R-07 (MEDIUM)
- Risk: Evidence 不足で 5/5 根拠が不成立になる。
- Detection: 比較レポート更新項目の欠落確認。
- Detection Command: `rg -n "#175|Accessibility|Evidence" docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Mitigation: PR チェックリストに Evidence 更新を必須化。

## R-08 (HIGH)
- Risk: `@modelcontextprotocol/sdk` 非互換で #175 の追加ツール/応答が不安定化する。
- Detection: SDK バージョン確認 + CI 検証。
- Detection Command: `npm ls @modelcontextprotocol/sdk && npm run agents:verify`
- Mitigation: #175 で利用する API を現行 SDK 互換範囲に限定する。
- Rollback: 非互換機能を停止し、既存ツールセットのみで運用継続する。

## Resolved Unknowns
- U-01: `wcagLevel` は `A|AA|AAA` + `all` を採用。
- U-02: A11y ソース優先順位を `custom.a11yAnnotations` > docs index に固定。
- U-03: A11y 診断追加は mcp-server 専用 detector で閉じる。
