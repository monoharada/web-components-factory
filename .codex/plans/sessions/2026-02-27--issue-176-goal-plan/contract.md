# Contract

## C-01 Scope Lock
- Rule: #176 は prompt/resource/IDE導線/Evidence 更新に限定し、components 実装や #177 主責務へ越境しない。
- Trace: D-01, D-03, D-08, D-10
- Verification: `git diff --name-only` で対象ファイル境界を確認。

## C-02 Backward Compatibility (F-01)
- Rule: 既存14ツールの入力契約・`content` 互換を維持する。
- Trace: D-09, D-10
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`。

## C-03 Prompt Contract
- Rule: `figma_to_wcf` は Figma URL 入力を受け、5段階ワークフローを順序保証で返す。
- Trace: D-01, D-02
- Verification: prompt 登録/順序アサーションテスト。

## C-04 Resource URI Contract
- Rule: `wcf://components`, `wcf://tokens`, `wcf://guidelines/{topic}`, `wcf://llms-full` の URI 契約を固定する。
- Trace: D-03, D-04, D-05, D-06, D-07
- Verification: resource list/read 契約テスト。

## C-05 Guidelines Topic Contract
- Rule: `wcf://guidelines/{topic}` の topic は `accessibility|css|patterns|all` に限定し、未知 topic は定義済みエラー。
- Trace: D-06
- Verification: 正常系/異常系テスト。

## C-06 llms-full Contract
- Rule: `wcf://llms-full` は `llms-full.txt` をソースとし、内容欠落時のエラー契約を持つ。
- Trace: D-07
- Verification: 内容整合テスト + 欠落時エラーテスト。

## C-07 IDE Integration Contract
- Rule: 3 IDE 以上の設定導線を overview と docs で一致させる。
- Trace: D-08
- Verification: overview 出力テスト + `README.md`/`design-system-mcp.md` レビュー。

## C-08 Test Gate Contract
- Rule: #176 追加テスト込みで mcp-server テスト全件 pass を必須とする。
- Trace: D-09
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`。

## C-09 Size/CI Gate Contract
- Rule: response-size と pre-pr/ci を通過し、100KB 制約と回帰非劣化を保証する。
- Trace: D-10
- Verification:
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`

## C-10 Evidence Contract (F-04)
- Rule: §4.6 Evidence に #176 の 5/5 根拠（実装/テスト/結果/スコア変更）を記録する。
- Trace: D-10
- Verification: `docs/reports/wcf-mcp-vs-serendie-comparison.md` Evidence テンプレ充足確認。

## C-11 SDK Compatibility Contract (F-05)
- Rule: resources/prompts 実装は現行 `@modelcontextprotocol/sdk` 互換 API のみ使用する。
- Trace: D-09, D-10
- Verification:
  - `npm ls @modelcontextprotocol/sdk`
  - `npm run agents:verify`

## C-12 DoD Confirmation Contract
- Rule: `D-01..D-10` は暫定DoDとして扱い、`APPROVE PLAN` 承認後に実装フェーズへ進む。
- Trace: D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10
- Verification: ユーザー承認ログ（`APPROVE PLAN`）。
