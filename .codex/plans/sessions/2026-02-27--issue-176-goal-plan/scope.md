# Scope

## In Scope
- `packages/mcp-server/core.mjs` への prompt/resource 登録実装。
- `figma_to_wcf` prompt の入力/出力契約定義。
- `wcf://components` / `wcf://tokens` / `wcf://guidelines/{topic}` / `wcf://llms-full` の resource 実装。
- resources/prompts に対する契約テスト追加（`packages/mcp-server/server.test.js`）。
- 3 IDE 以上の設定導線を docs と overview で統合。
- §4.6 Evidence 更新（#176 の実装証跡反映）。

## Out of Scope
- Figma MCP サーバー本体の機能追加。
- OpenAI Apps SDK / AutoRAG の新規導入。
- #177 主責務（structuredContent 横断記述/検証）の本実装。
- `packages/components/**` のコンポーネント改修。
- transport の再設計（#167 既存範囲外）。

## Assumptions
- #167（HTTP transport）は main マージ済み。
- `@modelcontextprotocol/sdk` は現行バージョンで resources/prompts API を利用可能。
- `llms-full.txt` は repo root に存在し、resource ソースとして利用できる。
- IDE テンプレートは `get_design_system_overview` への集約を継続できる。

## Unknown Handling
- U-01: Figma URL の厳密バリデーションは最小（URL文字列受理 + 手順提示）で開始。
- U-02: prompt 応答はまず text 契約を優先し、structuredContent 追加は #177 と整合して検討。
- U-03: `wcf://guidelines/{topic}` の topic は既存 `search_guidelines` と同じ `accessibility|css|patterns|all` に固定。
- U-04: docs 配置は `packages/mcp-server/README.md` と `docs/knowledge/design-system-mcp.md` を主対象に固定。
- U-05: `wcf://llms-full` は repo root の `llms-full.txt` をソースとし、再生成責務は既存 `llms:*` スクリプトに委譲。

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
