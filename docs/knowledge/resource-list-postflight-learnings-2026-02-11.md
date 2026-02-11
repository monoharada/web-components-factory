# Frontend Implementation Learnings

## Context
- Feature or PR: `dads-resource-list` 実装・Figma忠実度調整・a11y注釈/検証導線追加
- Date: 2026-02-11
- Scope:
  - `/Users/reiharada/.codex/worktrees/0eb5/web-components-factory/packages/components/resource-list/*`
  - `/Users/reiharada/.codex/worktrees/0eb5/web-components-factory/src/demos/showcase-components.ts`
  - `/Users/reiharada/.codex/worktrees/0eb5/web-components-factory/src/demos/extra.ts`
  - `/Users/reiharada/.codex/worktrees/0eb5/web-components-factory/viewer.html`
  - `/Users/reiharada/.codex/worktrees/0eb5/web-components-factory/e2e-evidence/resource-list.fidelity.vrt.spec.ts`

## What Worked
- `resourceListFidelity` を分離したことで、hover/focus/checked/menu のVRTが安定して検証できた。
- `a11y_diff_lint` で `outline: none` を機械検出し、安全に除去できた。
- `origin/main` と `HEAD` の比較を `git worktree` で分離し、coverage比較を再現可能な手順で実行できた。

## What Blocked Progress
- `inline title focus` の黄色背景欠落はコンポーネントCSSではなく viewer の全体ルールにより打ち消されていたため、原因特定に時間がかかった。
- 全体coverageコマンドは既存の非関連テスト失敗に引きずられ、差分評価に直接使えなかった。

## Root Causes
- `viewer.html` の `:defined { background: none; }` が slotted link の `:focus-visible` 背景を上書きしていた。
- デモ用 `summary` スタイルに `:focus/:active { outline: none; }` が残っており、a11y lint の高優先指摘対象になっていた。

## New Rules
- Rule: `viewer.html` にカスタム要素全体へ効く `background` 上書きを入れない。
- Rationale: シャドウDOM内で定義した focus 背景（特に slotted link）を壊しやすい。
- Example: `:defined { background: none; }` は禁止し、必要なら対象クラスを限定して指定する。

- Rule: フォーカス可視化対象に `outline: none` を使う場合は、同じセレクタ階層で代替フォーカス表現を保証できるときだけに限定する。
- Rationale: キーボードフォーカス消失リスクが高く、lintで高優先警告になる。
- Example: `.menu > summary:focus-visible { outline: ... }` のみを定義し、`:focus` / `:active` の `outline:none` は置かない。

- Rule: coverageの非劣化比較は「同一コマンド・同一対象」で `origin/HEAD` と `HEAD` を測定する。
- Rationale: 非関連テストの不安定性で評価がブレるのを防ぐ。
- Example:
  - `git worktree add --detach <tmp> origin/main`
  - `vitest run <target tests> --coverage --coverage.reporter=json-summary`
  - `lines/statements/functions/branches` を 0.1pp 許容で比較

## Next Time Checklist
- [ ] 画面差分不具合の切り分け時は、コンポーネントCSSだけでなく viewer グローバルCSSも先に確認する。
- [ ] `a11y_diff_lint` を修正前後で実行し、`high` 指摘をゼロ化してからVRT更新する。
- [ ] coverage比較は `origin/HEAD` の一時worktree方式を最初に採用する。
