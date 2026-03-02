# Research: wcf-mcp v0.2.1→v0.5.0

## 技術調査結果

### アーキテクチャ概要

wcf-mcp サーバーは以下の構成で動作する:

| ファイル | 行数 | 役割 |
|---------|------|------|
| `core.mjs` | 2,744行 | 全ツール定義・ヘルパー関数・`createMcpServer()` |
| `validator.mjs` | 868行 | HTML検証ロジック（CEM照合・enum・slot・required等） |
| `server.mjs` | - | スタンドアロン起動・設定読み込み |
| `server.test.js` | 2,200行 | vitest テスト（ユニット + InMemoryTransport統合テスト） |
| `bin.mjs` | - | npx エントリーポイント |

#### データソース

- `custom-elements.json`: CEM (Custom Elements Manifest) — コンポーネントAPI定義
- `registry/install-registry.json` (758行): コンポーネントID・タグ・deps・ソース情報
- `registry/pattern-registry.json` (126行): UIパターン定義（12パターン）
- `design-tokens.json`: デザイントークン（色・スペーシング・タイポグラフィ等）
- `guidelines-index.json`: ガイドライン索引（アクセシビリティ・CSS・パターン）

#### 登録ツール一覧（14ツール）

1. `get_design_system_overview` — 概要（最初に呼ぶべき）
2. `list_components` — コンポーネント一覧（カテゴリ・検索・ページネーション）
3. `search_icons` — アイコン検索
4. `get_component_api` — コンポーネントAPI詳細
5. `generate_usage_snippet` — HTML使用例生成
6. `get_install_recipe` — インストール手順・依存ツリー
7. `validate_markup` — HTMLバリデーション
8. `list_patterns` — パターン一覧
9. `get_pattern_recipe` — パターンレシピ（依存解決+HTML）
10. `generate_pattern_snippet` — パターンHTMLのみ
11. `get_design_tokens` — デザイントークン
12. `get_design_token_detail` — トークン詳細
13. `get_accessibility_docs` — アクセシビリティガイド
14. `search_guidelines` — ガイドライン検索

#### 重要な設計判断

- **単一ファイル構成**: core.mjs に全ロジックが集約。TypeScriptソースなし。直接 `.mjs` を編集する
- **structuredContent**: 100KB制限のガードレール付き
- **prefix対応**: `dads-` をカスタムプレフィックスに置換可能
- **plugin contract v1**: 外部プラグインによるツール・データソース拡張可能
- **InMemoryTransport テスト**: server.test.js がクライアント-サーバー間の統合テストを実行

---

### 各Issue の技術的実現可能性

#### #203: distribution.selfHosted

**変更箇所**: `core.mjs` — `get_design_system_overview` ツールのレスポンス構築部分（L1806-L1911）

**現状**: `setupInfo` に `noCDN: true`, `deliveryModel: 'vendor-local'` が既に存在（v0.3.0で追加済み）。ただし `distribution` フィールドとしての構造化はされていない。

**必要な変更**:
- `overview` オブジェクトに `distribution` フィールドを追加
- `distribution.selfHosted: true`
- `distribution.strategy: 'vendor-importmap'`
- `distribution.description` と `distribution.quickStart` を追加
- 既存の `setupInfo.noCDN` 等は後方互換のため残す

**テスト**: `server.test.js` に distribution フィールドの存在・値検証を追加

**工数**: 小（1-2時間）

**リスク**: 低。追加フィールドのみで破壊的変更なし

---

#### #204: fullPageHtml 対応

**変更箇所**: `core.mjs` — `get_pattern_recipe` ツール（L2309-L2399）

**現状**: `html`（body内HTML）、`scaffoldHint`（import map + boot.js のテンプレート）、`installHint` を返している。`fullPageHtml` フィールドは未実装。

**必要な変更**:
1. `inputSchema` に `include` パラメータ（z.array(z.enum(['fullPage'])).optional()）を追加
2. `include` に `'fullPage'` が含まれる場合、`scaffoldHint` の情報を使って完全なHTML文書を組み立てる
3. `fullPageHtml` フィールドを結果に追加
4. `vendorSetup` フィールド（コマンド・説明）を追加

**実装方針**:
- Issue本文は `web-components-factory/core` の `generatePage()` をimportする案だが、現時点で wcf-mcp は `@modelcontextprotocol/sdk` と `zod` のみの依存。`web-components-factory` を依存に追加すると package.json の変更が必要
- **代替案（推奨）**: 既存の `scaffoldHint` データ（import map, boot.js, noscript）を組み合わせて `core.mjs` 内で直接HTMLテンプレートを生成する。外部依存なしで実現可能

**テスト**:
- `include` 未指定時の後方互換テスト
- `include=['fullPage']` で `fullPageHtml` が返るテスト
- `fullPageHtml` に `<!DOCTYPE html>`, `<script type="importmap">`, `boot.js` が含まれるテスト

**工数**: 中（4-6時間）

**リスク**: 中。fullPageHtml のテンプレート品質がE2E成功率に直結

---

#### #206: interactionExamples + パターンスクリプト

**変更箇所**:
- `core.mjs` — `get_component_api` ツール（L1990-L2041）
- CEM `custom` データまたは `core.mjs` 内にハードコード

**現状**: `get_component_api` は CEM の `decl.custom` からアクセシビリティチェックリスト（`a11yAnnotations`）を取得している。同様のパターンで `interactionExamples` を追加可能。

**必要な変更**:
1. フォーム系8コンポーネントの `interactionExamples` データを定義
   - input-text, select, textarea, checkbox, radio, combobox, date-picker, file-upload
2. `serializeApi()` または `get_component_api` ハンドラで `interactionExamples` を含める
3. Phase 2（パターンスクリプト）は Phase 1 の効果測定後に判断

**データ定義方式の選択肢**:
- **A: CEM custom plugin で CEM に埋め込む**: `custom-elements-manifest.config.js` の変更が必要。ビルドパイプライン変更
- **B: core.mjs 内にハードコード**: CEM 非依存。パターンと同じアプローチ

**推奨**: B（core.mjs 内にハードコード）。理由: パターンHTML等も同様にcore.mjs内で管理されており、一貫性がある。CEM変更は `npm run agents:verify` の生成物管理が複雑になる

**テスト**: 8コンポーネントそれぞれの interactionExamples 存在確認テスト

**工数**: 中（4-6時間）

**リスク**: 低。追加フィールドのみ

---

#### #200: validate_markup semantic validation 強化

**変更箇所**: `validator.mjs` + `core.mjs`（validate_markup ツール）

**現状（v0.3.0で対応済みの可能性あり）**:
コードベース調査の結果、以下が **既に実装済み**:
- `detectEnumValueMisuse()` — enum属性値の検証
- `detectInvalidSlotName()` — slot名の検証
- `detectMissingRequiredAttributes()` — required属性の検証（label）
- `detectOrphanedChildComponents()` — 親子制約検証
- `detectEmptyInteractiveElement()` — 空の操作要素
- `buildDiagnosticSuggestion()` — unknown element の提案（Levenshtein距離）

**server.test.js にも該当テストが存在**:
- `validate_markup detects invalid enum value with error severity`
- `validate_markup detects invalid slot name`
- `validate_markup detects missing label on form input`
- `validate_markup warns on orphaned child component`
- `validate_markup warns on empty interactive button`

**結論**: **#200 は実質的に完了済み（v0.2.0→v0.3.0のマージで対応済み）**。ただし以下の追加改善が可能:
- `type="banana"` のようなカスタム属性値の検証は `detectEnumValueMisuse()` でカバー済み
- `REQUIRED_ATTRIBUTES` マップに `name` 属性を追加する余地あり
- attribute canonical lowercase 推奨の検出機能は未実装

**追加対応が必要な項目**:
1. `REQUIRED_ATTRIBUTES` に `name` 属性を追加（フォーム系）
2. attribute case sensitivity warning（大文字小文字の誤り検出）

**工数**: 小（2-3時間、追加分のみ）

**リスク**: 低

---

#### #207: layoutBehavior 追加

**変更箇所**: `core.mjs` — `get_component_api` ツールハンドラ + データ定義

**現状**: `get_component_api` は CEM から `attributes`, `slots`, `events`, `cssParts`, `cssProperties`, `accessibilityChecklist`, `relatedComponents` を返す。`layoutBehavior` は未実装。

**必要な変更**:
1. 3コンポーネント（layout-shell, device-mock, layout-sidebar）の `layoutBehavior` データを定義
2. `serializeApi()` または `get_component_api` ハンドラで `layoutBehavior` を含める

**実装方式**:
- `LAYOUT_BEHAVIOR_MAP` を core.mjs 内にハードコード（Map<tagName, layoutBehavior>）
- `get_component_api` ハンドラで canonicalTag をキーに lookup

**テスト**: 3コンポーネントの layoutBehavior 存在・フィールド確認テスト

**工数**: 小（2-3時間）

**リスク**: 低

---

#### #201: search_guidelines 検索有用性改善

**変更箇所**: `core.mjs` — `search_guidelines` ツール（L2564-L2681）+ `SYNONYM_TABLE`（L140-L148）

**現状**:
- `SYNONYM_TABLE`: 7エントリ（aria-live, keyboard, contrast, spacing, skip-navigation, heading, form）
- 検索アルゴリズム: heading(+3), keyword(+2), snippet(+1), body(+1), synonym(+1) のスコアリング
- 0件時: `alternativeQueries` + `alternativeTools` を提案
- guidelines-index.json にDADSトピック6件（keyboard-navigation, focus-management, contrast-color, form-validation, heading-hierarchy, skip-navigation）が存在

**必要な変更**:
1. `SYNONYM_TABLE` のエントリ拡張
   - `aria error` → `aria-describedby`, `error text`, `validation`
   - `layout` → `grid`, `flexbox`, `container query`
   - `responsive` → `media query`, `breakpoint`, `container query`
   - `color` → `contrast`, `wcag`, `palette`
2. guidelines-index.json の索引対象拡張（MCPサーバー外の作業）
3. 本文（body）テキストの検索精度改善
   - 現在のbody matchは weight 1。heading+keyword 不一致でもbody一致でヒットする
   - **追加案**: body match の weight を条件付きで引き上げ（例: 2回以上出現 → +2）
4. トピック別のスコアブースト（クエリが特定トピックに関連する場合）

**テスト**: ベンチマーククエリ（6件）の全ヒット確認テスト（既存テストを拡張）

**工数**: 中（3-5時間）

**リスク**: 中。検索精度の改善は主観的な要素が含まれる

---

### 依存関係マップ

```
#203 (distribution.selfHosted) ──→ なし（独立）
        │
        ↓（概念的に先行すべき: overviewの情報が下流ツールの前提）
#204 (fullPageHtml) ─────────────→ #203 に依存（distribution情報を fullPageHtml に含める）
        │
#205 (vendorHint) ───────────────→ 完了済み（マージ済み）
        │
#206 (interactionExamples) ──────→ なし（独立）
        │
#200 (semantic validation) ──────→ なし（独立、大部分完了済み）
        │
#207 (layoutBehavior) ───────────→ なし（独立）
        │
#201 (search_guidelines) ────────→ なし（独立、guidelines-index.json 依存）
```

**クリティカルパス**: #203 → #204 → E2E検証
**並行実行可能**: #200, #206, #207, #201 は全て独立

---

### 既存テストの分析

**テスト構造** (`server.test.js`, 2,200行):

| カテゴリ | テスト数(概算) | カバー範囲 |
|---------|-------------|-----------|
| CATEGORY_MAP | 2 | タグ→カテゴリマッピング |
| get_design_system_overview | 3 | overview shape, tool count, IDE templates |
| list_components | 5 | フィルタ, ページネーション, query, prefix |
| search_icons | 3 | 検索, ページネーション, prefix |
| prefix normalization | 1 | 大きなprefix, canonical変換 |
| get_component_api | 5 | tagName/className/component解決, 提案 |
| tool descriptions | 2 | MUST guardrail, When/Returns/After |
| MCP prompts/resources | 15+ | figma prompt, resources, tool calls |
| get_design_tokens | 6 | shape, filter, summary, themes, theme error |
| token detail helpers | 7 | normalize, extract, resolve, build |
| search_guidelines | 6 | shape, filter, count, search, synonym |
| get_accessibility_docs | 4 | index build, filter, balance |
| structuredContent | 5 | enable/disable, size limit |
| validate_markup | 10+ | enum, slot, required, orphan, empty |
| plugins | 10+ | normalize, collision, runtime, dataSource |

**テスト方式**:
- ユニットテスト: ヘルパー関数の直接テスト
- 統合テスト: `InMemoryTransport` でクライアント-サーバー間のフルラウンドトリップ

**カバレッジ状況**: 高い。各ツールに対して shape + エッジケースのテストが存在

---

### Unknown（調査不足の領域）

- **U-01 (RESOLVED)**: `web-components-factory/core` の `generatePage()` は packages/ 配下に存在しないことを確認。core.mjs内で既存scaffoldHint（doctype, importMap, bootScript, noscript）を組み合わせてHTML文書を生成する方式で確定。
- **U-02**: guidelines-index.json の索引対象拡張は MCP サーバー外の作業（`npm run mcp:index-guidelines`）。このスクリプトの実装詳細は未調査
- **U-03**: CEM custom data の `interactionExamples` 対象8コンポーネントの実際のイベントAPIは CEM データの精査が必要
