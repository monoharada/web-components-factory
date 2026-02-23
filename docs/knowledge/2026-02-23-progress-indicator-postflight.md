# Frontend Implementation Learnings

## Context
- Feature or PR: progress-indicator component（spinner / progress-bar / loading-icon）
- Date: 2026-02-23
- Scope: postflight quality gate（a11y / coverage non-regression / generated artifacts / CI）

## What Worked
- `a11y-checker` の差分 lint で `origin/main...HEAD` に重大な指摘（✗）は出なかった。
- coverage 比較を base/HEAD の両方で再計測し、4指標の非劣化を確認できた（base→HEAD: lines `87.78→87.83`, statements `82.91→82.99`, functions `86.27→86.19`, branches `69.69→69.80`）。
- `npm run ci`（type-check + test + build）が通過し、実装全体の回帰は検出されなかった。
- デモ内で非同期更新されるステータスメッセージに `role="status" aria-live="polite" aria-atomic="true"` を付与し、読み上げ環境で進捗/結果が追従する状態にできた。

## What Blocked Progress
- `npm run agents:verify` は `check-generated-clean` で失敗した。
- 失敗理由は、CEM 生成物 `custom-elements.json` が HEAD に未反映だったため。

## Root Causes
- 進捗インジケーター実装の API/属性調整に対し、`cem:analyze` で更新される生成物の最終確定を commit 前に固定できていなかった。
- `agents:verify` は生成物差分を BLOCKER とするため、未反映のままでは必ず停止する。

## New Rules
- Rule: API/トークン/part を変更したら、同一作業セッションで `npm run cem:analyze && npm run llms:generate` を先に実行して差分を確定する。
- Rationale: postflight 最終段の `agents:verify` で停止せず、PR準備を一気通貫にできる。
- Example: `spinner` に `speed` を追加したら、同じ commit 群で `custom-elements.json` / `docs/llms/spinner.md` / `llms-full.txt` を同梱する。
- Rule: デモで非同期に文言更新する要素には、原則 `role="status"` と `aria-live="polite"`（必要に応じて `aria-atomic="true"`）を付与する。
- Rationale: 見た目確認だけでは気づきにくい「更新通知の非可視化」を防ぎ、スクリーンリーダー利用時の状態把握を担保する。
- Example: 郵便番号検索/アップロード進捗のステータス表示要素に live region 属性を追加する。

## Next Time Checklist
- [ ] `origin/main` との coverage delta（lines/statements/functions/branches）を `0.1pp` ルールで判定したか
- [ ] `agents:verify` の generated clean チェック対象（少なくとも `custom-elements.json`）を PR 差分に同梱したか
- [ ] `npm run ci` を postflight の最終確認として再実行したか
