---
title: 引き継ぎ書
version: 1.2
branch: worktree-feat-mcp-server-upgrade
sha: ecf5921
focus_file: packages/mcp-server/
---

# 引き継ぎ書

## 1. ゴール（DoD：達成条件を1–2行）
- wcf-mcp サーバーに `get_design_tokens` / `search_guidelines` / HTTP transport を追加し、全11ツール・デュアルトランスポート対応の状態でPRマージ可能にする

## 2. タスク要約（1–3行）
- Issue #165（トークン公開）、#166（ガイドライン検索）、#167（HTTP transport + サーバーリファクタリング）を一括実装
- `server.mjs` / `design-system-mcp.mjs` の重複コードを `core.mjs` に抽出し、DI パターンで thin wrapper 化
- ビルドパイプラインに `mcp:extract-tokens` / `mcp:index-guidelines` を統合

## 3. 検証方法（合否基準・期待出力）
- `npm test -- --run packages/mcp-server/server.test.js` → 18テスト全パス
- `npm run mcp:build` → tokens 310件、guidelines 31件、全データ present
- `npm run test:run` → 全1454テスト パス

## 4. 現在の状態（状態インジケーター付き）
- 🟢 core.mjs 抽出完了: server.mjs 806→65行、design-system-mcp.mjs 783→40行
- 🟢 get_design_tokens: 310トークン（color:179, spacing:83, typography:30, radius:9, shadow:9）
- 🟢 search_guidelines: 31ドキュメント（css:10, patterns:13, accessibility:1, all:7）
- 🟢 HTTP transport: bin.mjs に `--transport=http --port=3100` 対応済み（127.0.0.1のみ）
- 🟢 テスト: MCP 18件 + 全体1454件パス、コミット済み

## 5. 変更ファイル（直近）
| Path | Note |
|---|---|
| `packages/mcp-server/core.mjs` | NEW: 全ツール・ヘルパーの一元管理（947行） |
| `packages/mcp-server/server.mjs` | MOD: thin wrapper化（65行） |
| `packages/mcp-server/bin.mjs` | MOD: HTTP transport + CLI引数対応 |
| `packages/mcp-server/server.test.js` | MOD: 8→18テスト、core.mjs からimport |
| `packages/mcp-server/package.json` | MOD: files に core.mjs 追加 |
| `scripts/mcp/design-system-mcp.mjs` | MOD: thin wrapper化（40行） |
| `scripts/mcp/extract-design-tokens.mjs` | NEW: TSからトークン抽出→JSON |
| `scripts/mcp/index-guidelines.mjs` | NEW: Markdownからインデックス構築 |
| `scripts/mcp/build-mcp-package.mjs` | MOD: 生成ファイル存在チェック追加 |
| `package.json` | MOD: mcp:extract-tokens, mcp:index-guidelines 追加 |
| `.codex/plans/` | NEW: Shape Up風6ファイル |

## 6. 次にやること（各1行）
- [ ] PR作成: `worktree-feat-mcp-server-upgrade` → `main`（成功条件: CI全パス／詰まったら: `agents:verify` で差分確認）
- [ ] HTTP transport の手動動作確認: `node packages/mcp-server/bin.mjs --transport=http` → curl で `tools/list` 呼び出し（成功条件: 11ツール返却）
- [ ] `accessibility` topic のドキュメント数が1件のみ → `docs/knowledge/accessibility-guidelines.md` 以外の a11y 関連ドキュメントの topic 割り当て見直し検討
- [ ] Issue #165, #166, #167 のクローズ（PR マージ後）
- [ ] CLAUDE.md にMCPツール一覧の更新反映を検討

## 7. スコープ外（今回はやらない）
- リモートデプロイ・認証対応
- トークン自動同期（手動 `mcp:build`）
- ガイドライン多言語対応
- 全文検索エンジン導入（Lunr.js等）

## 8. 未解決 / リスク（各1行）
- `accessibility` topic が1件しかない — `docs/knowledge/` 配下の a11y 関連ファイルが `all` に分類されている
- HTTP transport は `StreamableHTTPServerTransport` を使用 — MCP SDK のバージョンアップで API 変更の可能性あり
- `design-tokens.json` / `guidelines-index.json` は `.gitignore` 対象 — CI では `mcp:build` の実行が必要

## 8.5. 失敗した試み（時間の無駄を防ぐ）
- ❌ テストで `server.mjs` を直接読んで description 検証: core.mjs 抽出後は server.mjs にツール定義がないため失敗 → `core.mjs` を読むように修正

## 9. 決定事項（今回増分のみ）
- `createMcpServer(loadJsonData, loadValidator)` の DI パターンを採用（transport 分離）
- `generateSnippet` は design-system-mcp.mjs の customSnippet 対応版を core.mjs に統合
- トークン抽出は regex ベース（`/\s*--([\w-]+)\s*:\s*([^;]+);/g`）
- ガイドラインスコアリング: heading×3 > keyword×2 > snippet×1

## 10. 参照（再オープン用パス/Issue/PR）
- `packages/mcp-server/core.mjs` — 全ツール定義
- `scripts/mcp/extract-design-tokens.mjs` — トークン抽出
- `scripts/mcp/index-guidelines.mjs` — ガイドラインインデックス
- `.codex/plans/2026-02-25--mcp-server-upgrade-*.md` — 計画6ファイル
- Issue: #165, #166, #167

## 11. 再開カーソル（ファイル:行番号/関数名）
- `packages/mcp-server/core.mjs:280`（`createMcpServer` 関数 — 全ツール登録の起点）
- `scripts/mcp/index-guidelines.mjs:30`（`TOPIC_RULES` — topic 割り当てルール、a11y 追加時はここ）
