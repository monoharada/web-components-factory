# Plan: wcf-mcp v0.2.1→v0.5.0

## 実装順序

依存関係とクリティカルパスに基づく実装順序:

```
Phase 1 (基盤): P-01 (#203) → P-02 (#204)    ← E2E描画成功率100%のクリティカルパス
Phase 2 (並行): P-03 (#200) | P-04 (#206) | P-05 (#207) | P-06 (#201)
Phase 3 (検証): P-07 (統合テスト + バージョンバンプ)
Phase 4 (Post-Implementation): P-08 (Usefulness Test + 定量メトリクス計測)
```

---

## ステップ詳細

### P-01: get_design_system_overview に distribution フィールド追加
- **Issue**: #203
- **変更ファイル**:
  - `packages/mcp-server/core.mjs` (overview構築部分 L1806-L1911)
  - `packages/mcp-server/server.test.js` (テスト追加)
- **テスト**:
  - distribution フィールドの存在確認
  - `distribution.selfHosted === true`
  - `distribution.strategy === 'vendor-importmap'`
  - `distribution.quickStart` に `npx web-components-factory init` が含まれる
  - 既存フィールド（setupInfo, ideSetupTemplates等）が変更されていない後方互換テスト
- **依存**: なし
- **受入条件**:
  - `get_design_system_overview` レスポンスに `distribution` フィールドが存在する
  - 既存レスポンスの全フィールドが維持されている
  - テストが全て PASS する

---

### P-02: get_pattern_recipe に fullPageHtml 対応
- **Issue**: #204
- **実装方式（確定）**: U-01解決済み。`generatePage()` APIは存在しないため、`buildFullPageHtml()` 専用関数を core.mjs 内に新設し、scaffoldHint（L2364-2370）の情報を動的パラメータ化して HTML を生成する。外部依存の追加なし。
- **Codex指摘対応**:
  - **E2（scaffoldHintプレースホルダ問題）**: `./<dir>/...` が動的置換されていない問題を `buildFullPageHtml(options)` 関数で解決。`dir`/`vendorDir`/`lang` をパラメータとして受け取る
  - **E3（overview未呼び出しリスク）**: fullPageHtml レスポンスに `distribution` 情報を自己完結的に含め、overview 未呼び出しでも最低限機能するようにする
  - **E5（100KB制限超過）**: 全パターンの fullPageHtml レスポンスサイズを計測し、`MAX_TOOL_RESULT_BYTES`（100KB）を超えないことを契約テストで保証
  - **U4（lang固定回避）**: `<html lang="ja">` をハードコードせず、`lang` パラメータ（デフォルト: `"ja"`）で制御
- **変更ファイル**:
  - `packages/mcp-server/core.mjs` (get_pattern_recipe ツール L2309-L2399 + `buildFullPageHtml()` 関数新設)
  - `packages/mcp-server/server.test.js` (テスト追加)
- **テスト**:
  - `include` 未指定時のレスポンスが既存と同一（後方互換）
  - `include: ['fullPage']` 指定時に `fullPageHtml` フィールドが返る
  - `fullPageHtml` に `<!DOCTYPE html>`, `<html lang="ja">`, `<script type="importmap">`, `boot.js`, `<body>` が含まれる
  - `fullPageHtml` のimport mapエントリが依存コンポーネントと一致する
  - `vendorSetup.command` が存在し `wcf` コマンドを含む
  - **（追加）** `fullPageHtml` に `distribution` 情報コメントまたは data 属性が含まれる
  - **（追加）** 全12パターンの fullPageHtml レスポンスサイズが 100KB 未満であることを検証
  - **（追加）** import map パスにプレースホルダ（`./dir/`）が残存していないことを検証
- **依存**: P-01（distribution 情報を fullPageHtml 生成に参照）
- **受入条件**:
  - `get_pattern_recipe(patternId)` の既存レスポンスに変更がない
  - `get_pattern_recipe(patternId, { include: ['fullPage'] })` で `fullPageHtml` が返る
  - `fullPageHtml` が有効なHTML5文書構造を持つ
  - `buildFullPageHtml()` が専用関数として切り出されている
  - import map パスが実際のファイルパスに解決されている（プレースホルダなし）
  - 全パターンのレスポンスサイズが 100KB 未満
  - テストが全て PASS する

---

### P-03: validate_markup semantic validation 追加強化
- **Issue**: #200
- **Codex指摘対応**:
  - **E1（ランタイムscaffold検証）**: validate_markup に「CDN参照検出」「importmap/boot.js欠落検出」ルールを追加し、AIがfullPageHtmlを改変した場合でも検知できるようにする
  - **E4（Recall 75%未達リスク）**: name + case warning だけでは FN 42% を捕捉不可能。以下の追加ルールを優先順で実装:
    1. required 対象タグ拡大（combobox, file-upload 等）
    2. empty interactive 対象拡張（button以外）
    3. slot 検証の親コンポーネント文脈考慮（可能な範囲で）
- **変更ファイル**:
  - `packages/mcp-server/validator.mjs` (REQUIRED_ATTRIBUTES に `name` 追加 + ランタイムscaffold検証 + Recall改善ルール)
  - `packages/mcp-server/server.test.js` (追加テスト)
- **テスト**:
  - フォーム系コンポーネントで `name` 属性なしの場合に warning/error が出る
  - attribute case sensitivity: `Variant="solid"` のような大文字混在に warning が出る
  - **（追加）** CDN URL（`cdn.jsdelivr.net`, `unpkg.com` 等）を含むマークアップに warning が出る
  - **（追加）** `<script type="importmap">` が欠落しているページに warning が出る
  - **（追加）** combobox, file-upload の required 属性なし検出
  - **（追加）** empty interactive（button以外: 空の link, 空の summary 等）検出
  - 既存の enum/slot/required/orphan/empty テストが全て PASS
- **依存**: なし
- **受入条件**:
  - `REQUIRED_ATTRIBUTES` に `name` が追加されている
  - attribute case warning が実装されている
  - CDN参照検出ルールが実装されている
  - importmap/boot.js 欠落検出ルールが実装されている
  - required 対象タグが拡大されている
  - 既存バリデーション機能に退行がない
  - テストが全て PASS する

**注**: #200 の主要項目（enum, slot, required label, orphan, empty）は v0.3.0 で実装済み。このステップは残りの追加改善 + Codex指摘のランタイム検証を含む

---

### P-04: interactionExamples 追加（Phase 1）
- **Issue**: #206
- **プリステップ（U-03解決）**: CEMデータからフォーム系8コンポーネントのevents/attributes/propertiesを抽出し、interactionExamplesの内容を確定する
- **変更ファイル**:
  - `packages/mcp-server/core.mjs` (INTERACTION_EXAMPLES_MAP 定義 + get_component_api ハンドラ拡張)
  - `packages/mcp-server/server.test.js` (テスト追加)
- **テスト**:
  - フォーム系8コンポーネントの `get_component_api` レスポンスに `interactionExamples` が含まれる
  - 各 example に `scenario`, `code`, `trigger` プロパティが存在する
  - 非フォーム系コンポーネント（例: heading, card）には `interactionExamples` が存在しない
  - 既存レスポンス（attributes, slots, events等）に変更がない
- **依存**: なし
- **受入条件**:
  - `dads-input-text`, `dads-select`, `dads-textarea`, `dads-checkbox`, `dads-radio`, `dads-combobox`, `dads-date-picker`, `dads-file-upload` の8コンポーネントに `interactionExamples` が含まれる
  - 各 example は実装可能なコードスニペットを含む
  - テストが全て PASS する

---

### P-05: layoutBehavior 追加
- **Issue**: #207
- **変更ファイル**:
  - `packages/mcp-server/core.mjs` (LAYOUT_BEHAVIOR_MAP 定義 + get_component_api ハンドラ拡張)
  - `packages/mcp-server/server.test.js` (テスト追加)
- **テスト**:
  - `dads-layout-shell` の `get_component_api` に `layoutBehavior` が含まれる
  - `dads-device-mock` の `get_component_api` に `layoutBehavior` が含まれる
  - `dads-layout-sidebar` の `get_component_api` に `layoutBehavior` が含まれる
  - 各 layoutBehavior に `responsive`, `overflow`, `constraints` のうち該当するフィールドが存在する
  - 非レイアウト系コンポーネントには `layoutBehavior` が存在しない
- **依存**: なし
- **受入条件**:
  - 3コンポーネントの `layoutBehavior` が正しく返る
  - 既存レスポンスに破壊的変更がない
  - テストが全て PASS する

---

### P-06: search_guidelines 検索有用性改善
- **Issue**: #201
- **プリステップ（U-02解決）**: `npm run mcp:index-guidelines` スクリプトの実装を確認し、索引カバレッジを評価する
- **変更ファイル**:
  - `packages/mcp-server/core.mjs` (SYNONYM_TABLE 拡張 + スコアリングロジック改善)
  - `packages/mcp-server/server.test.js` (ベンチマークテスト強化)
- **テスト**:
  - 拡張 SYNONYM_TABLE の同義語展開テスト
    - `aria error` → `aria-describedby`, `error text` 等にマッチ
    - `layout` → `grid`, `flexbox` 等にマッチ
    - `responsive` → `media query`, `breakpoint` 等にマッチ
  - ベンチマーク6クエリ（keyboard navigation, focus management, color contrast, form validation error, heading hierarchy, skip navigation）が全て >0 結果を返す（既存テスト強化）
  - 0件時に alternativeQueries + alternativeTools が返る
  - body text の複数回出現によるスコアブースト検証
- **依存**: なし（ただし guidelines-index.json の索引拡張は前提条件）
- **受入条件**:
  - SYNONYM_TABLE が10エントリ以上に拡張されている
  - ベンチマーク6クエリが全て >0 結果
  - 0件率がベースライン（60%）から 30% 以下に改善（推定）
  - テストが全て PASS する

---

### P-07: 統合テスト + バージョンバンプ + リリース準備
- **Issue**: 全体（#203, #204, #206, #207, #200, #201）
- **Codex指摘対応**:
  - **additive変更チェックリスト**: (1)新規入力は必ずoptional, (2)未指定時の出力を既存と同等維持, (3)新規出力はopt-in時のみ, (4)既存キーの型不変, (5)エラーは既存文字列維持, (6)旧/新呼び出し両方の契約テスト, (7)rollback手順をdocsに明記
  - **旧呼び出し互換テスト**: include なしで全ツールの既存レスポンスが不変であることを明示的に検証
- **変更ファイル**:
  - `packages/mcp-server/package.json` (version bump → v0.5.0)
  - `packages/mcp-server/core.mjs` (McpServer version 文字列 → '0.5.0')
  - `packages/mcp-server/server.test.js` (統合回帰テスト)
- **テスト**:
  - 全既存テストの PASS 確認（`npm test`）
  - `npm run agents:verify` の PASS 確認
  - 14ツール全てが正常に動作する統合テスト
  - バージョン番号の一貫性（package.json と McpServer version が一致）
  - **（追加）** 旧呼び出し互換テスト: 新パラメータ未指定で全レスポンスが v0.3.0 と同一構造
  - **（追加）** additive 変更チェックリストの全7項目を検証
- **依存**: P-01, P-02, P-03, P-04, P-05, P-06
- **受入条件**:
  - 全テストが PASS する
  - package.json version が更新されている
  - `npm run agents:verify` が PASS する
  - 破壊的変更がない
  - 旧呼び出し互換テストが PASS する

---

### P-08: Usefulness Test 準備 + 定量メトリクス計測
- **Issue**: 全体（#208 Done条件）
- **変更ファイル**: なし（テスト実行のみ）
- **テスト**:
  - Usefulness Test第4回を実施し、以下のメトリクスを計測:
    - E2Eブラウザ描画成功率（目標: 100%）
    - ツール呼出効率（目標: < 1.3x）
    - バリデーションRecall（目標: 75%+）
    - 初回バリデーションPASS率（目標: 90%+）
    - ガイドラインヒット率（目標: 50%+）
    - ガイドライン0件率（目標: 30%以下）
  - ベースライン比較テーブルを更新
- **依存**: P-07
- **受入条件**:
  - Usefulness Test第4回が実施済み
  - ベースライン比較テーブルが更新済み
  - E2Eブラウザ描画成功率 100% 達成

---

## 見積もりサマリ

| ステップ | 工数 | 優先度 |
|---------|------|--------|
| P-01 | 1-2h | 必須（クリティカルパス） |
| P-02 | 5-8h | 必須（クリティカルパス・Codex指摘対応含む） |
| P-03 | 4-6h | 高（Codex指摘のランタイム検証+Recall改善ルール追加） |
| P-04 | 4-6h | 高 |
| P-05 | 2-3h | 中 |
| P-06 | 3-5h | 高 |
| P-07 | 1-2h | 必須 |
| P-08 | 2-4h | 必須（Post-Implementation） |
| **合計** | **22-37h** | |
