# Risk

## R-01: raw plugin result を overflow payload へ潰すことで plugin 側期待値が変わる
- Impact:
  - plugin author が oversized `content` をそのまま受け取れる前提でいた場合、レスポンス shape が warning payload に変わる。
- Likelihood:
  - Medium
- Detection:
  - oversize raw result integration test
- Mitigation:
  - 上限超過時のみ shape が変わることを contract とテストで固定する。
- Rollback:
  - finalize helper の plugin raw result 適用を戻す。

## R-02: `isError` の付与順変更で error response shape を壊す
- Impact:
  - consumer が `isError` 付き error payload を期待している経路で回帰する。
- Likelihood:
  - Low
- Detection:
  - 既存 error helper test と境界 regression test
- Mitigation:
  - shape は維持し、サイズ計測順だけ変える。
- Rollback:
  - error helper を旧実装に戻し、別 helper で再設計する。

## R-03: raw plugin result に text 以外の content item がある場合の overflow 振る舞いが曖昧
- Impact:
  - 画像 / resource content を返す plugin で期待と異なる warning fallback になる可能性がある。
- Likelihood:
  - Low
- Detection:
  - raw result helper の unit test 追加可否確認
- Mitigation:
  - 今回は JSON size の最終保証を優先し、content type を問わず overflow 時は warning payload へ統一する。
- Rollback:
  - content type 別の branch を追加する。

## R-04: README 更新が過剰になり実装詳細を固定しすぎる
- Impact:
  - 将来の内部実装変更がしにくくなる。
- Likelihood:
  - Low
- Detection:
  - diff review
- Mitigation:
  - README は「100KB を超える結果は metadata-only fallback になる」程度の外部契約に留める。
- Rollback:
  - README 変更を見送る。
