# Risk Register

## Context
- Target: `packages/mcp-server` (`@monoharada/wcf-mcp`)
- Theme: maintainability / contract safety / bundled correctness / testability
- Failure Trace Target: `F-01` / `F-02` / `F-03` / `F-05`

## R-01
- `severity`: HIGH
- `trigger`: `core.mjs` を big-bang で分割し、tool registration や helper export の互換が崩れる。
- `detection`: contract tests 失敗、scripts import failure、`createMcpServer()` 呼び出し回帰。
- `rollback`: `core.mjs` facade に互換 re-export を戻し、内部モジュール分割だけを残す。
- `trace`: `F-01`, `F-04`

## R-02
- `severity`: HIGH
- `trigger`: data loader 統合時に bundled / repo-local の探索順または相対パス解決を壊す。
- `detection`: `mcp:build` / `mcp:check` 失敗、repo-local 起動不全、config loader tests 失敗。
- `rollback`: 既存 loader 分岐に戻し、共通化を path map 定数の共有に限定する。
- `trace`: `F-02`, `F-05`

## R-03
- `severity`: HIGH
- `trigger`: response envelope 統一により structuredContent や text payload が肥大化し、100KB guard または client 互換が崩れる。
- `detection`: `mcp:check:response-size` 失敗、tool response shape regression。
- `rollback`: large payload 系のみ旧レスポンスへ戻し、helper の適用対象を段階導入にする。
- `trace`: `F-01`, `F-03`

## R-04
- `severity`: HIGH
- `trigger`: `skills-registry.json` など bundled data の整合回復が漏れ、公開 resource と package contents が不一致のまま残る。
- `detection`: `wcf://skills` resource 失敗、`mcp:build` / `mcp:check` NG、README 実行例不整合。
- `rollback`: 該当 resource を一時的に graceful error 化し、同梱修正を別 patch に切り出す。
- `trace`: `F-02`, `F-05`

## R-05
- `severity`: MEDIUM
- `trigger`: `validator.mjs` 分割で diagnostics の順序・code・message が変わり、既存テストや利用者の期待を崩す。
- `detection`: validator regression tests 失敗、diagnostic snapshot 差分。
- `rollback`: aggregation 層で旧順序を再現し、message 変更を後続 PR に送る。
- `trace`: `F-01`

## R-06
- `severity`: MEDIUM
- `trigger`: test split により coverage が落ちるか、CLI smoke test が flakey になる。
- `detection`: targeted tests は pass するが `agents:verify` で退行、あるいは CI で不安定化。
- `rollback`: split 後もしばらく monolithic contract file を残し、smoke test は最小ケースに絞る。
- `trace`: `F-04`, `F-05`

## R-07
- `severity`: MEDIUM
- `trigger`: docs drift 修正だけ先に進み、コード/生成物との同期が再び外れる。
- `detection`: README と knowledge doc の count 差分、テストコメントの旧数値残存。
- `rollback`: docs 更新を `P-09` 直前にまとめ、count はコードから再採番する。
- `trace`: `F-05`
