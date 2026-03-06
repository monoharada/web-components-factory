# Readiness

- Ready for implementation: YES

## DoD Coverage
- D-01: PASS（責務クラスタと移設候補 module を `research.md` に固定済み）
- D-02: PASS（export 互換維持方針を `plan.md` / `contract.md` に固定済み）
- D-03: PASS（register 層抽出順序を `plan.md` に定義済み）
- D-04: PASS（tool/resource/prompt 不変条件を `contract.md` に定義済み）
- D-05: PASS（package `files` 更新条件を `research.md` / `contract.md` に定義済み）
- D-06: PASS（HIGH/MEDIUM risk に detection / rollback を付与済み）
- D-07: PASS（実装ゲートを `contract.md` に定義済み）
- D-08: PASS（planning pack 保存と readiness 判定を完了済み）
- done/total: 8/8

## Open issues
- U-01: public export の境界は P-01 で棚卸し確定が必要。
- U-02: 新規内部ディレクトリ名は P-01 で決める。
- U-03: error normalization は今回 scope 外に止めるのが安全。
- U-04: response-size script 向け API は re-export 互換で開始し、必要なら後続で専用化する。

## User questions
- なし（Issue 化して実装待ちにできる状態）。

## Next action
1. この planning pack を元に GitHub Issue を作成する。
2. 実装時は別 PR で `P-01` から `P-07` を順に進める。
