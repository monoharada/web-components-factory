# Scope

## In Scope
- `packages/mcp-server/core.mjs` へ `get_accessibility_docs` を追加。
- `get_accessibility_docs` の `component/topic/wcagLevel` フィルタ実装。
- component-level A11y checklist の返却（`get_component_api` 連携を含む）。
- A11y index データ整備（最低10件）と取得経路の固定。
- `validate_markup` の A11y 診断追加（mcp-server 側で閉じる）。
- `packages/mcp-server/server.test.js` の #175 契約テスト追加。
- `packages/mcp-server/README.md` のツール説明更新。
- #175 Evidence 更新に必要なログ/検証コマンドの固定。

## Out of Scope
- `wcf://` resources 実装（#176）。
- structuredContent 方針の横断再設計（#174/#177）。
- Token/Style 拡張（#170）。
- Extensibility プラグイン実装（#171）。
- Performance ストリーミング最適化（#178）。
- `packages/components/**` のコンポーネント本体改修。
- AutoRAG / OpenAI Apps SDK / migration ツール追加。
- 大規模リファクタや transport 変更。

## Assumptions
- #174 完了により dual response 基盤は利用可能。
- #175 は独立Issueとして単体実装できる。
- WCAG レベルは `A|AA|AAA` の単一値フィルタで開始できる。
- A11y checklist の一次ソースは `custom-elements.json` の `custom.a11yAnnotations` と docs index の併用で足りる。
- `validate_markup` 追加診断は mcp-server 専用 detector で閉じる。

## Artifacts
- `goal.md`
- `scope.md`
- `research.md`
- `plan.md`
- `risk.md`
- `contract.md`
- `audit.json`
- `readiness.md`
- `agent-ledger.md`
