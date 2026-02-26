# Plan

## Execution Order (G1/G2/G3, dependency-aware)
- P-01: `#173` (G2)
- P-02: `#172` (G3)
- P-03: `#170` (G2)
- P-04: `#174` (G1)
- P-05: `#176` (G3)
- P-06: `#178` (G3, depends on #173)
- P-07: `#177` (G1, depends on #174 + #176)
- P-08: `#175` (G2)
- P-09: `#171` (G3, high-risk architecture)

---

## Issue Plans

### #170 (Token/Style 5/5)
- goal: `get_design_token_detail` と theme API 基盤を追加し Token/Style を 5/5 にする。
- research: §4.4 の不足（detail/theme/relationship）+ NG-06 + Issue #170 実装項目。
- risk: `R-04`, `R-05`, `R-08`。
- plan:
  1. `get_design_token_detail` を追加（value/type/category/cssVariable/references/referencedBy）。
  2. `get_design_tokens` に `theme` 引数を追加（実返却は `light` のみ）。
  3. 抽出スクリプトでトークン参照関係マップを生成。
- todo:
  - [ ] ツール実装
  - [ ] `theme=light|dark|all` 契約テスト（dark/allはlight fallback）
  - [ ] `npm run mcp:check:response-size`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:338`

### #171 (Extensibility 5/5)
- goal: `@experimental` の範囲でプラグイン機構を導入し 3->5 に引き上げる。
- research: §4.9 と NG-07、Issue #171 のDI互換要件。
- risk: `R-01`, `R-06`, `R-08`。
- plan:
  1. `WcfMcpPlugin` 型を `@experimental` で定義。
  2. `createMcpServer({ plugins })` を追加（既存DIを維持）。
  3. `wcf-mcp.config.json` の任意読込 + サンプルプラグイン。
- todo:
  - [ ] `createMcpServer()` 既存呼び出しの回帰テスト
  - [ ] `@experimental` 注記の静的確認
  - [ ] `npm run agents:verify`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:469`

### #172 (DX 5/5)
- goal: マルチIDE設定テンプレートと `validate_markup` suggestion で 4->5。
- research: §4.1 の5/5条件 + Issue #172。
- risk: `R-04`, `R-08`。
- plan:
  1. `get_design_system_overview` に IDE スニペット（3種以上）を追加。
  2. `validate_markup` 診断に `suggestion` を加算（既存形は維持）。
  3. 推奨ツール呼び出し順を overview に明示。
- todo:
  - [ ] unknownElement / forbiddenAttribute の suggestion テスト
  - [ ] overview payload サイズ検証
  - [ ] `npm test -- --run packages/mcp-server/server.test.js`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:248`

### #173 (Discoverability 5/5)
- goal: Progressive Disclosure と icon search で発見性を5/5化し #178 を解放。
- research: §4.2, §10 cross-cutting（#173 owner -> #178 verify）。
- risk: `R-04`, `R-07`, `R-08`。
- plan:
  1. `list_components` に `category/query/limit/offset` と default `limit=20` を追加。
  2. summary 返却（tagName/description 中心）を既定に。
  3. `search_icons` を追加。
  4. `get_component_api.relatedComponents` を追加。
- todo:
  - [ ] 既存呼び出し互換テスト
  - [ ] pagination/filter テスト
  - [ ] `npm run mcp:check:response-size`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:273`

### #174 (Code Generation 5/5)
- goal: token misuse detection + structuredContent で CodeGen を5/5化。
- research: §4.3 + SDK要件（>=1.26）+ #177依存元。
- risk: `R-02`, `R-03`, `R-04`, `R-08`。
- plan:
  1. `validate_markup` にハードコード値検出 warning を追加。
  2. `get_component_api/get_design_tokens/search_guidelines` に structuredContent 追加。
  3. dual-response 互換テスト（content + structuredContent）を追加。
- todo:
  - [ ] token misuse 検出テスト（3件以上）
  - [ ] SDK機能スモーク
  - [ ] `npm run agents:verify`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:298`

### #175 (Accessibility 5/5)
- goal: 専用 A11y ツールと component-level checklist で 4->5。
- research: §4.5 + Spindle参照パターン + Issue #175。
- risk: `R-04`, `R-07`, `R-08`。
- plan:
  1. `get_accessibility_docs(component/topic/wcagLevel)` 追加。
  2. `get_component_api.accessibilityChecklist` 追加。
  3. A11y index を 10件以上に拡張。
  4. `validate_markup` の ARIA 妥当性検証を追加。
- todo:
  - [ ] フィルタ契約テスト
  - [ ] A11y index 件数テスト
  - [ ] `npm run mcp:check:response-size`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:363`

### #176 (Integration 5/5)
- goal: Figma prompt + `wcf://` resources で統合幅を5/5化。
- research: §4.6 + #177の前提依存。
- risk: `R-03`, `R-04`, `R-08`。
- plan:
  1. `figma_to_wcf` prompt を追加。
  2. resources (`wcf://components`, `wcf://tokens`, `wcf://guidelines/{topic}`, `wcf://llms-full`) を追加。
  3. IDE設定テンプレを docs + overview に統合。
- todo:
  - [ ] URI契約テスト
  - [ ] resources size 検証
  - [ ] SDK互換スモーク
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:394`

### #177 (Documentation 5/5)
- goal: #174/#176 の成果を docs 観点で統合して 4->5。
- research: §4.8 + §10 cross-cutting owner（記述/検証）。
- risk: `R-02`, `R-04`, `R-08`。
- plan:
  1. structuredContent JSON schema を文書化。
  2. `wcf://` resources 一覧/用途/更新頻度を文書化。
  3. 全ツール description を When/Returns/After に統一。
- todo:
  - [ ] `#174` と `#176` 完了の事前確認
  - [ ] doc-only 境界（再実装禁止）のレビュー項目追加
  - [ ] `npm run agents:verify`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:448`

### #178 (Performance 5/5)
- goal: #173 の効果検証 + streaming/size最適化で 4->5。
- research: §4.7 + #173前提。
- risk: `R-03`, `R-04`, `R-08`。
- plan:
  1. `#173` 後のレスポンスサイズを計測し 100KB制約を確認。
  2. 大応答の truncation/limit を導入（互換維持）。
  3. HTTP transport の streaming 対応を追加。
- todo:
  - [ ] 全ツール response-size テスト
  - [ ] streaming 統合テスト
  - [ ] `npm run mcp:check:response-size`
  - [ ] Evidence 更新: `docs/reports/wcf-mcp-vs-serendie-comparison.md:418`

---

## Report Update Proposal (§4 / §10)

### §4 更新案
- 各次元の Evidence に以下を追記するテンプレを統一適用:
  - 実装ツール/機能
  - テストコマンド
  - テスト結果
  - 該当ファイル
  - PR/マージSHA
  - スコア変更
  - 5/5根拠
- 更新対象 line anchor:
  - DX: `:248`
  - Discoverability: `:273`
  - CodeGen: `:298`
  - Token/Style: `:338`
  - A11y: `:363`
  - Integration: `:394`
  - Performance: `:418`
  - Documentation: `:448`
  - Extensibility: `:469`

### §10 更新案
- `10.4 グループ分割` に「推奨実行順（2026-02-26 replan）」列を追加。
- `10.6 前提` に cross-cutting 依存（`#173->#178`, `#174/#176->#177`）を強調表記。
- `10.3 Failure Definition` に PRチェックリスト導線（`agents:verify`, `mcp:check:response-size`）を追記。

---

## Next 2 PR Plan

### PR-1 (small, unblock-first)
- Target Issue: `#173`
- Scope:
  - `list_components` filter/pagination/summary
  - `search_icons`
  - `relatedComponents`
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm test -- --run packages/mcp-server/server.test.js`
  - `npm run agents:verify`
- Done:
  - `#173` 達成条件を満たす
  - Evidence 更新 `:273`
  - #178 前提を満たす（default 20件 + size改善）

### PR-2 (protocol-foundation)
- Target Issue: `#174`
- Scope:
  - token misuse warning
  - structuredContent（主要3ツール）
- Verification:
  - `npm run mcp:build`
  - `npm run mcp:check`
  - `npm run mcp:check:response-size`
  - `npm test -- --run packages/mcp-server/server.test.js`
  - `npm run agents:verify`
- Done:
  - `#174` 達成条件を満たす
  - Evidence 更新 `:298`
  - #177 前提の structuredContent 実装が成立
