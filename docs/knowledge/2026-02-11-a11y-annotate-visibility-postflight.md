# Frontend Implementation Learnings

## Context
- Feature or PR: Viewer のコンポーネント並び/名称整理と、`a11y-annotate` 注釈視認性の全件監査・位置最適化
- Date: 2026-02-11
- Scope:
  - `/Users/reiharada/.codex/worktrees/6a50/web-components-factory/viewer.html`
  - `/Users/reiharada/.codex/worktrees/6a50/web-components-factory/src/demos.ts`
  - `/Users/reiharada/.codex/worktrees/6a50/web-components-factory/src/demos/*.ts`
  - `/Users/reiharada/.codex/worktrees/6a50/web-components-factory/src/demos/*.test.ts`
  - `/Users/reiharada/.codex/worktrees/6a50/web-components-factory/packages/components/annotate/annotate.test.ts`

## What Worked
- 45ビューを Desktop（1920x1080）で走査し、注釈あり43件/なし2件（`divider`, `resetCss`）を機械的に分類できた。
- `callout-lane="top"` を component 単位で上書きする方式により、デモAPIを変えずに視認性を改善できた。
- before/after キャプチャと監査JSONを `/tmp/codex-a11y-annotate` に分離保存したことで、差分確認を高速化できた。
- coverage 比較を `origin/main` worktree で独立実行し、4指標（lines/statements/functions/branches）の非劣化を定量確認できた。

## What Blocked Progress
- `agents:verify` 実行時に `packages/components/annotate/annotate.test.ts` の `window.localStorage.setItem` が環境依存で失敗した。
- 失敗は今回差分ではなく `origin/main` でも再現し、品質ゲートの通過判定を阻害した。

## Root Causes
- テストが `window.localStorage` を常に完全実装と仮定していたが、実行環境によっては `setItem` が関数でないケースがある。
- fallback がないため、a11y デバッグフラグ設定の1行でテスト全体が落ちる構造だった。

## New Rules
- Rule: a11y注釈の視認性調整は、まず `callout-lane` の明示上書きを優先し、必要時のみ `--a11y-annotate-*` 変数を調整する。
- Rationale: マークアップの意味構造を崩さず、最小差分で再現性の高い改善ができるため。
- Example: `viewer.html` の `annotationVisibilityOverrides` で対象コンポーネントに `lane: 'top'` を指定する。

- Rule: coverage 非劣化比較は `origin/HEAD` の一時 worktree で同一コマンドを実行して比較する。
- Rationale: ローカル未コミット差分や環境差を排除し、判定の再現性を担保するため。
- Example:
  - `npm run test:run -- --coverage --coverage.reporter=json-summary src/demos/*.test.ts`
  - base/HEAD の `coverage-summary.json` を `0.1pp` しきい値で比較

- Rule: `window.localStorage` 前提のテストは fallback を持たせる。
- Rationale: Node/DOM実装差で不安定化しやすく、変更と無関係にCIを赤化させるため。
- Example: `packages/components/annotate/annotate.test.ts` の `setA11yDebugFlag()` で `localStorage` を最小モックする。

## Next Time Checklist
- [ ] 注釈監査の before/after を同一 viewport・同一スクロール位置で保存する。
- [ ] a11y差分は `a11y_diff_lint` と目視キャプチャの両方で判定する。
- [ ] `agents:verify` 実行前に環境依存テスト（storage/fetch）を先に単体実行してつまずきを早期検知する。
