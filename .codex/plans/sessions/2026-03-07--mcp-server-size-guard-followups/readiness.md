# Readiness

- Ready for implementation: YES

## DoD Coverage
- D-01: PASS（plugin raw result の未ガード経路を scope と plan に落とした）
- D-02: PASS（error helper の境界超過を contract 化した）
- D-03: PASS（built-in / plugin / error helper を横断した最終 size guarantee を定義した）
- D-04: PASS（検証コマンドと regression test 追加先を明示した）
- done/total: 4/4

## Open issues
- U-01: oversize raw plugin result で `isError` を継承するか
- U-02: README へどこまで外部契約を書くか

## User questions
- なし

## Next action
1. P-01 で共通 finalize helper を設計する。
2. P-02 / P-03 で plugin raw result と error helper をその helper に寄せる。
3. P-04 で tests と必要最小限の docs を揃える。
