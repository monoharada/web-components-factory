# Frontend Implementation Learnings

## Context
- Feature or PR: WCF「shadcn的体験」拡張 v2（`wcf init`, `wcf vendor add`, `vendor install --force`）
- Date: 2026-02-11
- Scope: `scripts/wcf/*`, `tests/wcf-*.spec.ts`, `README`, `docs/knowledge/wcf-cli.md`

## What Worked
- `vendor add` の drift 判定を「既存導入集合のみで再生成した stage」と比較する方式にしたことで、追加コンポーネント由来の正常差分と手編集差分を分離できた。
- `init` を `vendor install -> page create` の直列実行に集約し、CLI からの導線を単純化できた。
- 回帰確認は `agents:verify` と指定テストを併用することで、局所仕様と全体品質ゲートを両立できた。

## What Blocked Progress
- 初回の `vendor add` drift 判定で `README.md` / `index.js` も drift 判定に含めてしまい、正常な追加ケースで誤検知した。
- 一部環境で `vitest` 未導入状態があり、先に `npm ci` が必要だった。

## Root Causes
- drift 判定対象の定義を「最終再生成物」と直接比較していたため、追加導入で必ず変わる管理ファイルとの差分まで検知対象に入っていた。
- テスト実行前提（依存導入済み）を暗黙に仮定していた。

## New Rules
- Rule: `vendor add` の drift 比較は「既存集合で再生成した stage」と target のみで判定する。  
  Rationale: 追加要求で増える正常差分を drift から除外し、手編集差分検知の精度を保つ。  
  Example: `existing=[button]`, `add=[card]` の場合、drift 判定は `button` 系管理ファイルで行い、`card` 追加差分は対象外。
- Rule: postflight 開始時に `npm ci` の要否を確認し、未導入なら最初に依存をそろえる。  
  Rationale: テスト失敗原因を実装起因と環境起因で混同しないため。  
  Example: `vitest: command not found` を検知したら即 `npm ci` 実行後に再試験する。

## Next Time Checklist
- [ ] `vendor add` の drift 判定対象が既存集合ベースになっていることをテストで固定する
- [ ] postflight の最初に環境チェック（`npm ci` / `gh auth status`）を実施する
