# Plan

## Execution Plan

### P-01
- Objective: #178 の境界と互換制約を固定する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`, `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Work: F-01/F-03/F-04 を優先順で明文化し、default 20 達成の方式を互換優先で設計する。
- Verification: 仕様レビュー（互換戦略 + 達成条件トレース）。

### P-02
- Objective: baseline 計測を追加し #173 効果を定量化する。
- Files: `scripts/mcp/check-response-size.mjs`, `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Work: `list_components` / `search_icons` / `get_design_tokens` の baseline size をログ化。
- Verification: `npm run mcp:check:response-size` の出力確認。

### P-03
- Objective: default 20 件相当の段階取得経路を導入する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`, `packages/mcp-server/README.md`
- Work: 互換を壊さない形でデフォルトページング経路（例: v2 tool 追加 or opt-in mode）を実装。
- Verification: 新経路契約テスト + 既存互換テスト。

### P-04
- Objective: 大応答の truncation 契約を導入する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`, `packages/mcp-server/README.md`
- Work: 応答サイズ超過時の切り詰めとメタ情報返却（`truncated`, `originalSizeBytes` など）を実装。
- Verification: 境界値テスト（99KB / 100KB超）。

### P-05
- Objective: `get_design_tokens` 応答の最適化を実装する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`, `scripts/mcp/check-response-size.mjs`
- Work: pagination/limit/truncation の適用範囲を明確化し、worst-case でも 100KB 以内を保証。
- Verification: `get_design_tokens` 契約テスト + response-size 実測。

### P-06
- Objective: HTTP transport streaming の実動作検証を追加する。
- Files: `packages/mcp-server/server.test.js`, `packages/mcp-server/bin.mjs`
- Work: `--transport=http` の起動と `callTool` 成功、異常系を含む統合テストを追加。
- Verification: 追加テスト pass。

### P-07
- Objective: cache invalidation / hot-reload を実装する。
- Files: `packages/mcp-server/server.mjs`, `packages/mcp-server/server.test.js`
- Work: データソースの変更検知（hash/mtime ベース）と再読込導線を追加。
- Verification: 更新反映テスト、未更新時キャッシュヒットテスト。

### P-08
- Objective: performance logging を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.mjs`, `packages/mcp-server/server.test.js`
- Work: tool ごとの `durationMs/bytes/truncated/cacheHit/transport` を出力できる計測フックを実装。
- Verification: env on/off テスト、ログスナップショット。

### P-09
- Objective: response-size チェックを worst-case マトリクス化する。
- Files: `scripts/mcp/check-response-size.mjs`
- Work: 14 tools × summary on/off × 境界値ケースを追加し、最大ケースを自動判定。
- Verification: `npm run mcp:check:response-size`。

### P-10
- Objective: docs と report の契約を同期する。
- Files: `packages/mcp-server/README.md`, `docs/knowledge/design-system-mcp.md`, `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Work: 新しい performance 契約（段階取得、truncation、streaming、cache/logging）を反映。
- Verification: docs 差分レビュー。

### P-11
- Objective: 最終ゲート通過と Evidence 確定。
- Files: 変更一式
- Work: 検証コマンド実行、§4.7 Evidence 5/5 根拠を確定。
- Verification:
  - `npm run test:run -- packages/mcp-server/server.test.js`
  - `npm run mcp:check:response-size`
  - `npm run mcp:check`
  - `npm run agents:verify`
