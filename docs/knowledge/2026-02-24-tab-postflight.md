# 2026-02-24 dads-tab postflight（デザイン準拠 + a11y）

## Context
- Feature: `dads-tab` のデザイン準拠修正（top/bottom/left/right, selected/hover/focus, panel境界）
- Date: 2026-02-24
- Scope: `packages/components/tab/**`, `src/demos/tab.ts`, `src/viewer-api-controls.ts`, `src/viewer-api-controls.test.ts`, `docs/rules/tab-implementation-rules.md`

## What Worked
- selectedバーをタブ本体ボーダーと別レイヤー（`::before`/`::after`）に分離したことで、`top`/`bottom` の境界破綻を安定して解消できた。
- hoverを `:not([aria-selected=\"true\"])` に限定し、selectedとの同居崩れを防止できた。
- `data-api-target-selector` で panel内 `data-tab-label` を APIテーブルから直接操作できるようにし、viewer操作性を維持したまま検証できた。
- APG準拠のキーボード操作（矢印キー移動、Tabはループしない、Enterでpanel遷移）をテストで固定化できた。

## What Blocked Progress
- selected状態の青バーとタブ側面ボーダーが重なる実装で、見た目上「縦線が青バーを突き抜ける」崩れが繰り返し発生した。
- `agents:verify` は生成物差分（`custom-elements.json`, `registry/install-registry.json`）が未コミットだと pre-pr ガードで停止するため、途中実行では常に失敗扱いになる。

## Root Causes
- selected表現を単一ボーダーで完結させようとすると、orientation別に境界要件が競合しやすい。
- 色指定ルールが「トークン必須」であるにもかかわらず、局所修正時に直値へ寄りやすい。
- postflightの運用上、生成物差分を含む変更では「検証順序」と「コミット前提」を明確に分ける必要がある。

## New Rules
- Rule: selectedバーはタブ本体ボーダーと分離し、`top` は `::before`、`bottom` は `::after` で描画する。
  - Rationale: panel境界線とselectedバーの競合を避け、orientation差分を安定化するため。
  - Example: `packages/components/tab/tab-styles.ts`
- Rule: `dads-tab` の色は必ずトークン変数のみを使用し、`rgb()/rgba()/#hex` 直書きを禁止する。
  - Rationale: デザイン同期とテーマ差し替え互換を維持するため。
  - Example: `--dads-tab-indicator-color`, `--dads-tab-border-color`
- Rule: タブ改修時は必ず `docs/rules/tab-implementation-rules.md` を先に確認してから修正する。
  - Rationale: 同一不具合（selected境界・hover干渉）の再発防止。

## Next Time Checklist
- [ ] `top`/`bottom` selectedで「バー上に縦線が見えない」ことを目視確認したか
- [ ] hoverセレクタに `:not([aria-selected=\"true\"])` が入っているか
- [ ] `rg -n \"rgb\\(|rgba\\(|#[0-9a-fA-F]{3,8}\" packages/components/tab` が0件か
- [ ] `npm run test:run -- packages/components/tab/tab.test.ts src/viewer-api-controls.test.ts` を実行したか
- [ ] `npm run validate:wc` を実行したか
