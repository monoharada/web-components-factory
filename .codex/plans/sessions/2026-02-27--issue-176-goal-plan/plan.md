# Plan

## Execution Plan

### P-01
- Objective: #176 の境界と互換制約を固定する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: tools 互換維持（F-01）を前提に、prompt/resource 追加を非破壊で設計する。
- Verification: 変更ファイルレビュー（既存ツール契約変更なし）。

### P-02
- Objective: `figma_to_wcf` prompt を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: Figma URL 入力を受け、`overview -> tokens -> api -> snippet -> validate` の手順案内を返す prompt を実装。
- Verification: prompt 登録テスト + 応答順序テスト。

### P-03
- Objective: `wcf://components` resource を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: component catalog の読み取り resource を実装。
- Verification: resource list/read 契約テスト。

### P-04
- Objective: `wcf://tokens` resource を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: design token summary を返す resource を実装。
- Verification: resource read テスト + 返却キー整合テスト。

### P-05
- Objective: `wcf://guidelines/{topic}` resource を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: topic 別ガイドライン resource を実装し、未知 topic のエラー契約を定義。
- Verification: 正常系/異常系テスト。

### P-06
- Objective: `wcf://llms-full` resource を追加する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/server.test.js`
- Work: `llms-full.txt` を返す resource 実装と存在しない場合のエラー契約を定義。
- Verification: 内容整合テスト + エラー契約テスト。

### P-07
- Objective: IDE 設定導線を Integration 観点で統合する。
- Files: `packages/mcp-server/core.mjs`, `packages/mcp-server/README.md`, `docs/knowledge/design-system-mcp.md`
- Work: 3 IDE 以上の設定テンプレートを overview と docs で同期。
- Verification: overview 出力テスト + docs 差分レビュー。

### P-08
- Objective: #176 の契約テストを追加する。
- Files: `packages/mcp-server/server.test.js`
- Work: prompt/resource URI 契約、異常系、互換非劣化を表駆動で追加。
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`。

### P-09
- Objective: SDK 互換とサイズ制約を確認する。
- Files: `package.json`, `packages/mcp-server/*`
- Work: `@modelcontextprotocol/sdk` 互換 API のみ利用し、100KB 制約を維持する。
- Verification:
  - `npm ls @modelcontextprotocol/sdk`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`

### P-10
- Objective: Integration 5/5 の Evidence を確定する。
- Files: `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- Work: #176 実装内容・検証・スコア根拠を §4.6 Evidence に反映。
- Verification: Evidence テンプレ項目（Issue/実装/テスト/結果/スコア変更）充足レビュー。
