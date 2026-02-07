# a11y-annotate：ラベルを外側レーンに整列＋線を中心寄りまで伸ばす

## Goal
- 点線の囲い枠（callout-box）は原則非表示（コンテナのみ自動で枠）。
- 注釈ラベル（赤タグ）をプレビューの外側（左右レーン）へ整列し、線を長くして読みやすくする。
- 線の終点を要素の“中心寄り”まで伸ばし、カード等で終点が同じ角に集まって見える問題を減らす。

## Decisions
- ラベルは `placement` の left/right を優先して左右レーンにドック（未指定はプレビュー中心との相対位置で決定）。
- レーン上では `desiredY = targetCenter.y` を目標に、重なりを避けるよう縦方向にスタックする。
- 線の始点/終点は「タグ中心→要素中心」のレイと矩形の交点（境界点）を基準にし、終点は要素サイズに比例した inset を加える。
- 角に寄りすぎる境界点は、同じ辺上で角から離れるようクランプして視認性を上げる。
- 経路は直線またはL字（auto）をスコアリングで選択する。

## Public API / Tokens
- `A11yCallout.targetHint?: 'auto' | 'box' | 'none'`（既存互換の optional）
- CSS variables（任意調整ポイント）
  - `--a11y-annotate-callout-gutter`（外側レーンの距離）
  - `--a11y-annotate-callout-line-inset`（最小 inset px）
  - `--a11y-annotate-callout-line-inset-ratio`（要素サイズ比例の inset）
  - `--a11y-annotate-callout-anchor-corner-margin`（角回避）

## Implementation
- `packages/utils/a11y-annotations.ts`
  - `targetHint` を `A11yCallout` に追加。
- `packages/components/annotate/annotate.ts`
  - callout-box：デフォルト非表示＋包含関係（auto）でコンテナのみ表示、`targetHint` で上書き可能。
  - callout-tag：左右レーンへドックして縦スタック。
  - callout-line：境界交点＋動的 inset（中心寄り）＋角回避で終点を決定し、auto path を生成。
- `packages/components/annotate/annotate-geometry.ts`
  - 矩形/レイ交差や auto path を pure function 化してテスト可能にする。

## Acceptance Criteria
- ラベルがコンポーネントから十分距離を取り、左右に整列して読み取りやすい。
- 線が要素の中心寄りまで届き、カードの container/media/main/sub が同じ点に吸い寄せられて見えない。
- 既存の注釈パネルやスナップショット表示は回帰しない。

## Verification
- `npm test` が全て PASS
- `npm run dev` で card/calendar の annotate を目視（ラベル距離・整列・終点の中心寄りを確認）

