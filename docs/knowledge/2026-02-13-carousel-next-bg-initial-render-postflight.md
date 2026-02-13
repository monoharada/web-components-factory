# Frontend Implementation Learnings

## Context
- Feature or PR: `dads-carousel` next-bg initial render stabilization (follow-up of PR #98)
- Date: 2026-02-13
- Scope:
  - `packages/components/carousel/carousel.ts`
  - `packages/components/carousel/carousel.test.ts`
  - `e2e-evidence/carousel.initial-render.spec.ts`

## What Worked
- `next-bg` を `insert-immediately` に変更し、初期1tickで `img` を DOM に確実に挿入できた。
- `extractImageElement()` で実画像要素を取得して `loading='eager'` を上書きする方式は、slot の `picture` / image 要素の両経路で有効だった。
- `ready` 前イベント非発火を維持するテストを追加したことで、互換性要件を明示的にロックできた。

## What Blocked Progress
- 初期描画不具合の再現はロードタイミング依存のため、手動確認だけでは安定して判定しづらかった。
- ローカル `:3000` が別プロセスに占有されており、E2E 実行時にポート競合が発生した。

## Root Causes
- `next-bg` が `wait-before-insert` と lazy 画像ロードに依存していたため、初期描画時に背景側だけ DOM 挿入が遅延しやすかった。
- 「DOM 挿入タイミング」と「イベント発火タイミング」の責務が分離されておらず、仕様意図がコード上で読み取りづらかった。

## New Rules
- Rule:
  - 「初期表示で常に見えているべき補助メディア（next preview / next bg）」は `insert-immediately` を優先し、DOM 挿入を ready 判定から切り離す。
- Rationale:
  - 視覚的欠落の主因は ready 待機中の未挿入であり、表示保証には first tick での DOM 存在が必要なため。
- Example:
  - `next-bg` の `#replaceMediaWhenReady(..., { waitPolicy: 'insert-immediately' })`
  - ただし `dads-carousel-media-loaded/error` は ready 後のみ発火し、ready 前は発火しない。

## Next Time Checklist
- [ ] 初期描画バグ修正時は「first tick での DOM 存在」を unit + e2e の両方で検証する
- [ ] `insert-immediately` 採用時は「ready前イベント非発火」の回帰テストを同時に追加する
- [ ] E2E 実行前に使用ポートを固定チェックし、競合時は `PORT` / `WCF_E2E_BASE_URL` を明示して実行する
