# Contract

## C-01 Scope Lock
- Rule: #175 は `get_accessibility_docs` / checklist / A11y診断 / テスト / README に限定する。
- Trace: D-01, D-04, D-05
- Verification: 変更ファイルレビュー + `git diff --name-only`

## C-02 Backward Compatibility
- Rule: 既存ツールの入力契約と `content` 互換を維持する。
- Trace: D-03, D-05, D-06
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`

## C-03 Tool Contract: get_accessibility_docs
- Rule: `component/topic/wcagLevel` フィルタを受け、`query,wcagLevel,totalHits,results` を返す。
- Trace: D-01, D-02
- Verification: ツール契約テスト（正常/境界/異常）。

## C-04 Checklist Contract
- Rule: `get_component_api` で `accessibilityChecklist` を返し、既存キー欠落を起こさない。
- Trace: D-03
- Verification: `get_component_api` 回帰 + checklist 追加テスト。

## C-05 A11y Index Contract
- Rule: A11y index は 10件以上で、component/topic/wcagLevel で検索可能。
- Trace: D-04
- Verification: index件数テスト + フィルタ整合テスト。

## C-06 validate_markup Contract
- Rule: A11y 診断を追加しても既存診断を壊さない。
- Trace: D-05
- Verification: `validate_markup` 回帰テスト（unknown/forbidden/tokenMisuse/A11y）。

## C-07 Size/CI Gate
- Rule: response-size と CI ガードレールを必須通過。
- Trace: D-07
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm run agents:verify`

## C-08 Evidence Contract
- Rule: #175 Evidence を比較レポートへ反映できる証跡を残す。
- Trace: D-08
- Verification: `docs/reports/wcf-mcp-vs-serendie-comparison.md` 更新項目レビュー。

## C-09 Boundary Contract
- Rule: #176/#177 実装責務へ越境しない（resources/文書横断の本実装をしない）。
- Trace: D-08
- Verification: PRスコープレビュー。

## C-10 DoD Confirmation Contract
- Rule: `D-01..D-08` は暫定DoDとして `APPROVE PLAN` 承認後に実装フェーズへ進む。
- Trace: D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08
- Verification: ユーザー承認ログ（`APPROVE PLAN`）。

## C-11 SDK Compatibility Contract
- Rule: #175 で追加するツール/レスポンスは `@modelcontextprotocol/sdk` の現行互換範囲で実装する。
- Trace: D-07
- Verification:
  - `npm ls @modelcontextprotocol/sdk`
  - `npm run agents:verify`
