# Contract

## C-01 Scope Lock
- Rule: #178 は performance 向上（size/streaming/cache/logging/evidence）に限定し、他Issueの機能再実装に越境しない。
- Trace: D-01, D-12
- Verification: `git diff --name-only` で対象境界を確認。

## C-02 Compatibility Gate (F-01)
- Rule: 既存 `list_components` 契約を維持するか、互換例外を明示合意してから変更する。
- Trace: D-02, D-03
- Verification: backward compatibility テスト + README 契約文。

## C-03 Progressive Disclosure Contract
- Rule: デフォルト20件相当の段階取得経路を提供し、`total/limit/offset/hasMore/items` を返せるようにする。
- Trace: D-02
- Verification: 新経路契約テスト。

## C-04 Truncation Contract
- Rule: 100KB 超過時の挙動（切り詰め対象/メタ情報/互換）を固定し、応答は常にパース可能にする。
- Trace: D-04, D-05
- Verification: 境界値テスト。

## C-05 Token Response Contract
- Rule: `get_design_tokens` は worst-case でも 100KB 以下を維持できる。
- Trace: D-04, D-09
- Verification: `mcp:check:response-size` + tool契約テスト。

## C-06 HTTP Streaming Contract
- Rule: HTTP transport で `callTool` が安定動作し、異常リクエストでもサーバーが維持される。
- Trace: D-06
- Verification: streaming 統合テスト。

## C-07 Cache/Reload Contract
- Rule: データ変更時のみ再読込し、未変更時はキャッシュを維持する。
- Trace: D-07
- Verification: 更新/非更新の対テスト。

## C-08 Perf Logging Contract
- Rule: opt-in で tool performance メトリクスを出力し、通常時は出力しない。
- Trace: D-08
- Verification: env on/off テスト。

## C-09 Size Gate Contract (F-03 / NG-05)
- Rule: 単一ツール応答を 100KB 以下に制約し、自動チェックで fail-fast する。
- Trace: D-09, D-11
- Verification: `npm run mcp:check:response-size`。

## C-10 Test Gate Contract
- Rule: #178 追加テスト込みで mcp-server テストを全件 pass させる。
- Trace: D-10
- Verification: `npm run test:run -- packages/mcp-server/server.test.js`。

## C-11 CI Gate Contract
- Rule: `mcp:check` と `agents:verify` を通過する。
- Trace: D-11
- Verification:
  - `npm run mcp:check`
  - `npm run agents:verify`

## C-12 Evidence Contract (F-04)
- Rule: §4.7 Evidence に実装/検証/結果/スコア変更を記録する。
- Trace: D-12
- Verification: report 差分レビュー（Issue/Files/Commands/Results/Score）。
