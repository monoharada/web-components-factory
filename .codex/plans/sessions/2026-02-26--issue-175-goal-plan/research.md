# Research

## Sources
- `docs/reports/wcf-mcp-vs-serendie-comparison.md`（#175要件行、依存表）
- `packages/mcp-server/core.mjs`（tool実装・validate入口）
- `packages/mcp-server/validator.mjs`（既存A11yルール）
- `packages/mcp-server/server.test.js`（既存契約テスト）
- `scripts/mcp/index-guidelines.mjs`（guidelines index 生成）
- `packages/mcp-server/data/custom-elements.json`（`custom.a11yAnnotations`）

## Current Facts
- `get_accessibility_docs` は未実装。
- A11y 入口は現状 `search_guidelines(topic=accessibility)` と `validate_markup`。
- `get_component_api` は `custom` を返却しており、`custom.a11yAnnotations` を活用可能。
- `validate_markup` は CEM 検証 + token misuse 診断を合成する構造。
- 既存 `server.test.js` に #175 で必要な A11y 専用契約テストは不足。
- comparison report では #175 に「専用ツール + component checklist + WCAG filter」が明記されている。

## Boundary Notes
- #175 は独立Issueで、実装責務は tool/data/test の閉域変更。
- #176/#177 の resources・文書横断責務へ越境しない。
- #174 で導入済みの互換方針（`content` 維持）を継承する。
- shared validator 全体を変更せず、mcp-server 側で検知追加する方針を優先。

## Validation Path
- `npm run mcp:build`
- `npm run mcp:check`
- `npm run mcp:check:response-size`
- `npm run test:run -- packages/mcp-server/server.test.js`
- `npm run agents:verify`

## Resolved Unknowns
- U-01: `wcagLevel` は `A|AA|AAA` の単一値指定を初期仕様にする（既定は `all`）。
- U-02: checklist の一次ソースは `custom.a11yAnnotations`、不足時に docs index を補助利用する。
- U-03: `validate_markup` A11y 診断は mcp-server 専用 detector で追加し、shared validator の波及を避ける。

## Fixed Low-Risk Decisions
- `get_accessibility_docs` の初期返却キーを `query, wcagLevel, totalHits, results` に固定。
- checklist 返却は `get_component_api` で `accessibilityChecklist` として明示化。
- フィルタ未一致は空配列返却、入力不正のみ明示エラー。
