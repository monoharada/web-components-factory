# Goal

## Goal Statement
`@monoharada/wcf-mcp` を 45/45 に到達させるため、残Issue `#170-#178` を依存順で小PR実装できる状態まで再計画し、各Issueの Evidence 更新条件を固定する。

## Success Criteria
- KR-01: `#170-#178` すべてに `goal / research / risk / plan / todo` が定義されている。
- KR-02: G1/G2/G3 の依存順・優先度が矛盾なく説明できる。
- KR-03: 各Issueに Evidence 更新位置（`docs/reports/wcf-mcp-vs-serendie-comparison.md` の line anchor）がある。
- KR-04: F-01〜F-05 と NG-01〜NG-07 の適合ゲートが Issue 単位で定義されている。
- KR-05: 直近2PRの対象・検証・Done 条件が確定している。

## Constraints (Hard)
- NG-04: 後方互換を壊さない。
- NG-05/F-03: 単一ツール応答は 100KB 以下。
- NG-06: `#170` のテーマ対応は API 先行（`light` のみ）。
- NG-07: `#171` のプラグイン機構は `@experimental` 維持。
