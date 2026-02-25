# 2026-02-25 dads-tab a11y-annotate 位置調整ナレッジ

## Context
- Feature: `dads-tab` デモのアクセシビリティ注釈（`a11y-annotate`）位置調整
- Date: 2026-02-25
- Scope: `src/demos/tab.ts`（注釈レーン/距離トークン調整）

## 症状
- `callout-lane="top"` で注釈タグが上部に密集し、線が長く交差して読みにくくなる。
- `role="tablist"` など近接ターゲット同士で、線の起点/終点が視覚的にずれて見える。
- 注釈タグが preview 上端に寄りすぎると、見切れや窮屈な印象が出る。

## 根本原因
- タブの注釈は `tab` / `indicator` / `label` / `tablist` / `tabpanel` と対象が多く、`top` レーンに集約するとレイアウト競合が起きやすい。
- `top` レーンは横方向の可用域を超えると、線の引き回しが長くなりやすい。
- ガター/オフセット/ギャップが不足すると、線同士の視認性が急激に悪化する。

## 有効だった調整
- レーンを `top` から `side` に変更し、注釈タグを左右に分散した。
- 以下の変数を拡張して、線の交差と過密を緩和した。
  - `--a11y-annotate-callout-gutter: clamp(5rem, 12vw, 10rem)`
  - `--a11y-annotate-callout-lane-offset: 72px`
  - `--a11y-annotate-callout-lane-gap: 12px`

対象実装（抜粋）:

```html
<a11y-annotate
  target-selector="#tab-annotate-target"
  callout-lane="side"
  style="
    --a11y-annotate-callout-gutter: clamp(5rem, 12vw, 10rem);
    --a11y-annotate-callout-lane-offset: 72px;
    --a11y-annotate-callout-lane-gap: 12px;
  "
>
```

## 調整の判断基準（再利用用）
1. 注釈対象が4つ以上ある場合は、まず `side` レーンを第一候補にする。
2. 線の交差が目立つ場合は `gap` より先に `offset` を増やす。
3. タグが preview 枠に近すぎる場合は `gutter` を広げる。
4. `target-selector` は安定したIDを使い、意図しない要素を注釈対象にしない。

## 再発防止チェック
- [ ] 注釈タグ同士が重なっていない
- [ ] 線が長距離で交差し続けていない
- [ ] preview 枠内で注釈が見切れていない
- [ ] `target-selector` が意図した単一ターゲットに解決される
- [ ] `npm run validate:wc` が通る

## 検証ログ
- `npm run test:run -- src/viewer-api-controls.test.ts` ✅
- `npm run validate:wc` ✅
