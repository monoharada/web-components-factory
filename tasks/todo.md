# MCP Server Capability Roadmap TODO

## Goal
- `packages/mcp-server` を、設計システム向け MCP として discovery / validation / extensibility の各面で一段引き上げる。
- SoT: [.codex/plans/sessions/2026-03-08--mcp-server-capability-roadmap/plan.md](/Users/reiharada/dev/web-components-factory/.codex/plans/sessions/2026-03-08--mcp-server-capability-roadmap/plan.md)

## Current Status
- Branch: `feat/mcp-capability-roadmap`
- Validation baseline: `npm run agents:pre-pr` pass
- Tracking rule: 完了した slice は `done`、未着手または継続作業は `todo`

## P-01 Contract Sync and Machine-Readable Metrics
- [x] `verify-readme-examples` を built-in tool inventory 連動にする
- [x] `check-response-size` に JSON 出力を追加する
- [x] `mcp-spec-test/summary/v3-final.json` を生成・check 可能にする
- [x] `agents:pre-pr` に summary check を組み込む
- [x] README / knowledge docs の契約表現を同期する

## P-02 Project-Scale Validation
- [x] `validate_files` を追加する
- [x] `duplicateId` 検出を追加する
- [x] parent-aware slot validation を追加する
- [x] `validate_project` を追加する
- [x] template 系拡張子（`.njk`, `.liquid`, `.astro`, `.twig`, `.hbs`）を既定 include に入れる
- [x] script/style/comment/template comment を validator で誤認しにくくする
- [x] parser 導入または tokenizer 強化で JSX / complex template の edge case を減らす

## P-03 Unified Knowledge Search
- [x] `search_design_system_knowledge` を追加する
- [x] source-qualified result を返す
- [x] `followUp` を返す
- [x] zero-hit 時の `alternativeTools` を返す
- [x] exact / prefix / intent-aware ranking を追加する
- [x] source 内の重複 cluster 抑制をさらに強くする
- [x] query intent ごとの weight を追加調整する

## P-04 Light/All Token Contract Cleanup
- [x] token data に `themeValues.light` を持たせる
- [x] `theme="all"` を利用可能テーマ全体として返せるようにする
- [x] `theme="dark"` を非サポートとして明示する
- [x] fallback token 参照を relationship/component reverse map に含める
- [x] `var(--token, fallback-literal)` の literal fallback 取り扱い方針を明文化する

## P-05 Metadata / Plugin Runtime Expansion
- [x] `component-selector-guide.json` / `skills-registry.json` / `llms-full.txt` を override 対象に追加する
- [x] plugin validator hook を追加する
- [x] plugin prompt hook を追加する
- [x] plugin resource hook を追加する
- [x] plugin contract docs を `v1.3.0` に更新する
- [x] resource template hook を追加する
- [x] prompt args schema の richer support を追加する
- [x] example plugin を validator/prompt/resource 複合例として整理する

## Deferred
- [ ] shared remote HTTP distribution の正式スコープ化

## Verification Commands
- `npm test -- --run packages/mcp-server/runtime.test.js packages/mcp-server/server.test.js packages/mcp-server/mcp-tooling.test.js`
- `npm run mcp:summary`
- `npm run agents:pre-pr`
