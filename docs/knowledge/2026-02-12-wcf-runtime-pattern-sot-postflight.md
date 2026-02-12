# Frontend Implementation Learnings

## Context
- Feature or PR: WCF runtime 全部品提供（54 suffix） + mockup pattern 提供 + Pattern SoT 固定化
- Date: 2026-02-12
- Scope: `scripts/vendor-runtime/build.js`, `registry/pattern-registry.json`, `vendor-runtime/*`, `tests/*`, `docs/*`

## What Worked
- `packages/autoload/dads/*.ts` から runtime components を動的抽出し、手書き14件依存を撤廃できた。
- `pattern-registry.json` を SoT 化し、CLI/MCP の参照元を実質一本化できた。
- `git worktree` を使った base 比較で coverage 非劣化を定量確認できた。

## What Blocked Progress
- coverage 集計で `coverage/coverage-summary.json` が出ず、`coverage-final.json` からの再集計が必要だった。
- 作業開始時に `vendor-runtime/src` の削除差分が大量にあり、復旧手順を先に挟む必要があった。

## Root Causes
- coverage 抽出の前提を Jest 系のサマリ出力に寄せすぎていた。
- runtime 生成物の差分運用ルール（削除差分がある場合のみ restore）が手順化されていなかった。

## New Rules
- Rule: Pattern の Source of Truth は `registry/pattern-registry.json` に固定し、`vendor-runtime/registry.json` の `patterns` は生成物として扱う。
- Rationale: CLI/MCP の二重管理による不整合を防ぐため。
- Example: pattern 追加・修正時は `registry/pattern-registry.json` を更新し、`npm run vendor:build` で反映する。

- Rule: runtime component の提供単位は suffix のみ（`--component <suffix>`）を維持し、`componentId` 混在導入は行わない。
- Rationale: 既存 CLI 契約とエラーハンドリング (`E_COMPONENT_UNKNOWN`) を保つため。
- Example: `wcf vendor install --component checkbox` は許可、`componentId` 指定は対象外。

- Rule: `vendor-runtime/src` の `git restore` は毎回ではなく削除差分検出時のみ実行する。
- Rationale: 不要な生成物巻き戻しと作業ノイズを減らすため。
- Example: `git status --short -- vendor-runtime/src` で `D` がある時だけ restore 実行。

## Next Time Checklist
- [ ] 実装前に `vendor-runtime/src` の削除差分有無を確認する。
- [ ] `npm run vendor:build` 後に `npm run patterns:check` と `npm run wcf:docs:check` を実行する。
- [ ] coverage 比較は `coverage-final.json` から `istanbul-lib-coverage` で集計する。
