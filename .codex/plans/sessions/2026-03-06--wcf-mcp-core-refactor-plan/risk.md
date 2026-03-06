# Risk Register

## Context
- Target: `packages/mcp-server/core.mjs`
- Theme: contract-safe modularization

## R-01
- `severity`: HIGH
- `trigger`: `core.mjs` の export を内部 module に移した際、tests / scripts の import が壊れる。
- `detection`: `packages/mcp-server/runtime.test.js`、`packages/mcp-server/server.test.js`、`scripts/mcp/check-response-size.mjs` の回帰。
- `rollback`: `core.mjs` facade に re-export を戻し、内部移設だけ残す。
- `trace`: `F-02`, `F-04`

## R-02
- `severity`: HIGH
- `trigger`: register 層抽出で tool/resource/prompt の登録順・shape・件数が崩れる。
- `detection`: MCP contract tests 失敗、PR review で差分が大きくなる、response-size script の対象名ずれ。
- `rollback`: register helper を薄く戻し、domain split を 1 段階手前で止める。
- `trace`: `F-01`, `F-04`

## R-03
- `severity`: HIGH
- `trigger`: 新規 module を package `files` に含め忘れ、npm 配布版だけ壊れる。
- `detection`: package check 失敗、packaged CLI 起動失敗、ユーザー側 import error。
- `rollback`: `files` を即補正し、必要なら一時的に module を `core.mjs` へ戻す。
- `trace`: `F-02`, `F-05`

## R-04
- `severity`: MEDIUM
- `trigger`: response helper 抽出時に `structuredContent` や 100KB guard の条件が変わる。
- `detection`: `npm run mcp:check:response-size` 失敗、JSON envelope 差分。
- `rollback`: `response.mjs` を旧実装に寄せ、適用範囲を段階導入に戻す。
- `trace`: `F-03`, `F-05`

## R-05
- `severity`: MEDIUM
- `trigger`: plugin helper 注入の shape が変わり、plugin contract v1.1 を壊す。
- `detection`: `packages/mcp-server/runtime.test.js` 失敗。
- `rollback`: plugin helper 部分のみ `core.mjs` に戻して再分割する。
- `trace`: `F-03`, `F-04`

## R-06
- `severity`: MEDIUM
- `trigger`: `validator.mjs` や error normalization まで同時に触って scope が膨らむ。
- `detection`: PR 差分拡大、レビュー論点増加、unknown 解消不能。
- `rollback`: 今回は `core.mjs` のみで止め、別 Issue へ分離する。
- `trace`: `F-04`
