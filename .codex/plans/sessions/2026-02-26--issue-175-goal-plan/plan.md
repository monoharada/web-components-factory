# Plan

## Execution Plan

### P-01
- Objective: #175 の境界を固定する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: #175 の実装責務を tool/data/test に限定し、越境変更を防ぐ。
- Verification: 変更ファイルレビュー（#176/#177 領域へ越境なし）。

### P-02
- Objective: `get_accessibility_docs` を追加する。
- Files: `packages/mcp-server/core.mjs`
- Work: `component/topic/wcagLevel` フィルタを持つ専用ツールを実装。
- Verification: ツール登録と入出力契約テスト。

### P-03
- Objective: A11y index データを整備する。
- Files: `scripts/mcp/index-guidelines.mjs`, `packages/mcp-server/data/guidelines-index.json`（必要時）
- Work: component/topic/wcagLevel 検索に必要な索引を 10件以上で整備。
- Verification: index件数テスト + フィルタ結果整合テスト。

### P-04
- Objective: component-level checklist を API から取得可能にする。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: `get_component_api` に `accessibilityChecklist` を追加（既存契約維持）。
- Verification: `get_component_api` 回帰 + checklist 追加契約テスト。

### P-05
- Objective: `validate_markup` の A11y 診断を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: 既存診断と併存する A11y detector を追加。
- Verification: 既存診断非劣化 + 追加診断テスト。

### P-06
- Objective: ドキュメント/description を #175 要件に合わせる。
- Files: `packages/mcp-server/README.md`
- Work: `get_accessibility_docs` の When/Returns/After を追加。
- Verification: README 差分確認 + `mcp:check`。

### P-07
- Objective: 品質ゲートを通し #175 完了条件を満たす。
- Files: `packages/mcp-server/*`
- Work: 必須コマンド一式を実行し互換/サイズ/CI を確認。
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run test:run -- packages/mcp-server/server.test.js`
  - `npm run agents:verify`

### P-08
- Objective: Evidence 更新可能な状態を確定する。
- Files: `docs/reports/wcf-mcp-vs-serendie-comparison.md`（更新手順確認）
- Work: #175 の証跡（実装/テスト/根拠）を記録できる形にする。
- Verification: Evidence テンプレ項目が埋められるログ確認。

### P-09
- Objective: F-04（SDK互換）を実装前に固定する。
- Files: `packages/mcp-server/package.json`, `package.json`
- Work: `@modelcontextprotocol/sdk` の互換範囲を確認し、#175で使うAPIが現行バージョンで実行可能であることを確認する。
- Verification:
  - `npm ls @modelcontextprotocol/sdk`
  - `npm run agents:verify`
