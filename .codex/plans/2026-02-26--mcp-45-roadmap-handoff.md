---
title: MCP 45/45 引き継ぎ書
version: 2.0
branch: worktree-feat-mcp-server-upgrade
sha: a6a3658
focus_file: docs/reports/wcf-mcp-vs-serendie-comparison.md
---

# MCP 45/45 引き継ぎ書

## 1. ゴール
- `@monoharada/wcf-mcp` の 45/45 到達に向け、残Issue（#170-#178）を依存順で実装し、§4 Evidence に根拠付きで再採点を反映する。

## 2. ここまでの完了事項（今回まで）
- PR #180 をマージ（ユーザー確認済み）。
- npm 公開: `@monoharada/wcf-mcp@0.1.1`（latest=0.1.1）を確認。
- レビュー指摘を反映:
  - `scripts/mcp/index-guidelines.mjs`: `docs/knowledge` 全量探索を廃止し、`accessibility-guidelines.md` を明示取り込み。
  - `packages/mcp-server/bin.mjs`: 引数バリデーション強化 + `--help` の stdout 出力化。
  - `package.json`: `mcp:check:response-size` を追加し `agents:pre-pr` に組み込み。
  - `scripts/mcp/check-response-size.mjs`: F-03（100KB制約）を実測で検出。
  - `packages/mcp-server/core.mjs`: `dads-tab` を Navigation へ追加、`search_guidelines.maxResults` を 1..20 に制限。
- ドキュメント整合:
  - スコープ表記を `@monoharada/wcf-mcp` に統一。
  - Contract の F-03 検出方法を実装コマンドに合わせて更新。

## 3. 現在のスコア認識
- SOT: `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- 現在地: 約 35/45（45/45 は未達）
- 未達の主因: #170〜#178 未完了

## 4. 残タスク（Issue別）
- #170 Token/Style 5/5
  - `get_design_token_detail`
  - テーマAPI先行（lightのみ）
  - トークン関係性マップ
- #171 Extensibility 5/5
  - `@experimental` プラグイン機構
  - マルチソース設定
  - カスタムツール登録API
- #172 DX 5/5
  - マルチIDE設定テンプレート
  - エラーリカバリ提案
- #173 Discoverability 5/5
  - Progressive Disclosure
  - `search_icons`
  - カテゴリ/クエリフィルタ
- #174 CodeGen 5/5
  - トークン誤用検出
  - structuredContent（主要3ツール）
- #175 A11y 5/5
  - `get_accessibility_docs`
  - WCAGレベルフィルタ
- #176 Integration 5/5
  - Figma MCP prompt
  - MCP resources (`wcf://`)
- #177 Docs 5/5
  - structuredContent 記述
  - MCP resources 記述
  - Dual Response整備
- #178 Performance 5/5
  - ストリーミング
  - ページネーション
  - 応答最適化

## 5. 検証コマンド（現行）
- `npm run mcp:build`
- `npm run mcp:check`
- `npm run mcp:check:response-size`
- `npm test -- --run packages/mcp-server/server.test.js`
- `npm run agents:verify`

## 6. リスクと注意点
- F-03 の最大ケース探索は「候補クエリ集合ベース」であり、理論全探索ではない。
- structuredContent / MCP resources は #174/#176 と #177 のクロス依存が強く、同時進行で重複実装しやすい。
- 45/45 判定は §4 Evidence 更新の粒度に依存するため、PRごとに path:line とテスト結果を必ず記録する。

## 7. 次のアクション（推奨順）
1. `#174 + #177` を先に進める（structuredContent を横断で効かせる）
2. `#173 + #178` を続ける（発見性改修と性能計測を同時に閉じる）
3. `#170` を API先行で閉じる（lightのみ）
4. `#171/#172/#175/#176` を小PRで分割

## 8. 再開用 Prompt
- `.codex/prompts/continue-mcp-45-roadmap.md` をそのまま使用

## 9. 関連コミット（直近）
- `a6a3658` chore(mcp): switch package scope to @monoharada
- `beba4b8` fix(mcp): include empty query in response-size worst-case
- `05b8047` chore(mcp): make F-03 check executable and tighten UX
- `d12991f` fix(mcp): align tab update and docs for 0.1.1
