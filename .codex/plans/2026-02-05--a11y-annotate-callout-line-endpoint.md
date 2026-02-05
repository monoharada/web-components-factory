# a11y-annotate：線の終点を“要素に刺さる”位置へ改善（L字/直線 auto）

## Goal

- コールアウト線（`.callout-line`）が target のコーナーに吸い寄せられて「同じ場所に刺さって見える」問題を解消する
- 線の終点を「タグ → ターゲット中心」レイが矩形に当たる交点（+少し内側）にする
- 線形状は auto（L字/直線）で読みやすさを優先する

## Scope

- 追加：`packages/components/annotate/annotate-geometry.ts`
- 追加：`packages/components/annotate/annotate-geometry.test.ts`
- 変更：`packages/components/annotate/annotate.ts`
- 変更：`packages/components/annotate/annotate.test.ts`

## Notes

- `--a11y-annotate-callout-line-inset`（px）で終点の内側オフセットを調整可能にする（デフォルト2px）
- callout-box の auto 表示ルール（container のみ枠）には影響しない

## Verification

- `npm test` が PASS
- 手動: `npm run dev` で card/calendar の a11y-annotate を目視

