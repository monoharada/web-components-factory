# Scope

## In Scope
- `packages/mcp-server/core.mjs` の責務棚卸しと分割方針確定
- 新規内部モジュール候補の定義（例: `packages/mcp-server/core/*.mjs`）
- `createMcpServer()` からの register 層抽出計画
- `scripts/mcp/check-response-size.mjs` など `core.mjs` 直接 import 箇所の互換維持戦略
- `packages/mcp-server/package.json` の `files` 更新計画
- refactor 完了判定に必要な検証ゲート定義

## Out of Scope
- tool/resource/prompt 仕様変更
- `validator.mjs` の分割
- bundled data の内容変更や生成仕様変更
- docs の全面改稿
- plugin contract v1.1 の仕様変更

## Assumptions
- 直近 PR `#250` の test split により runtime / plugin / design-system-skills の回帰点は分離済みである。
- `core.mjs` 分割は別 PR / 別 Issue で進める。
- 実装では `core.mjs` を削除せず、段階的に薄くする。

## Unknowns
- U-01: `core.mjs` export のうち、将来も public と見なす範囲をどこまで固定するか。
- U-02: 新規ディレクトリ名を `core/` にするか `lib/` にするか。
- U-03: 混在している JSON error / text error / resource throw の扱いを今回どこまで対象に含めるか。
- U-04: `scripts/mcp/check-response-size.mjs` 向けに専用 public API を切るか、re-export 互換で止めるか。
