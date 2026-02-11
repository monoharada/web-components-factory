# Frontend Implementation Learnings

## Context
- Feature or PR: a11y-annotate パネルの typeset 適用と縦余白調整
- Date: 2026-02-11
- Scope: `/packages/components/annotate/annotate.ts`, `/viewer.html`

## What Worked
- `data-dads-typeset` を `part="panel-body"` と各 `section` に付与すると、Viewer で注釈パネル内の縦リズムを統一できた。
- セクション見出し（`h3`）だけに `margin-block-start: 0.75lh` を入れると、情報塊の区切りが明確になった。
- 箇条書き（`section > ul`）に追加 `gap` を持たせない方が、本文密度と視線移動のバランスが良かった。

## What Blocked Progress
- `npm run test:coverage` は `tests/pages-build-viewer.test.ts` の 5 秒 timeout で失敗しやすい。

## Root Causes
- カバレッジ実行時はページ生成を含むテストが通常より遅くなり、デフォルト timeout（5 秒）を超える場合がある。

## New Rules
- Rule: postflight の coverage 比較は `--testTimeout 30000` で実行する。
- Rationale: base/HEAD 両方で安定して同条件比較するため。
- Example: `npx vitest run --coverage --testTimeout 30000`

## Next Time Checklist
- [ ] 注釈パネルの縦余白調整は `h3` 見出し間隔から先に調整する
- [ ] list 行間は `line-height` 優先、`ul` の追加 `gap` は必要時のみ使う
- [ ] coverage 比較は base/HEAD とも同一 timeout 条件で実行する
