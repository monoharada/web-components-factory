# wcf-mcp vs Serendie Design System MCP — 9次元比較分析レポート

> **作成日**: 2026-02-25
> **対象**: `@monoharada/wcf-mcp` v0.1.0 vs Serendie Design System MCP
> **調査方法**: wcf-mcp ソースコード精読 + Serendie 公開ドキュメント + 業界15事例の横断調査（Deep Research）
> **補足**: Serendie MCP はリモート Streamable HTTP として公開済み（[serendie.design/get-started/ai-agent/mcp-server](https://serendie.design/get-started/ai-agent/mcp-server)）

---

## 1. エグゼクティブサマリー

### 総合スコア

| システム | 総合スコア (45点満点) | 特徴 |
|----------|----------------------|------|
| **wcf-mcp** | **30 / 45** | バリデーション・パターンレシピ・オフライン完結に強み |
| **Serendie MCP** | **33 / 45** | DX・トークン管理・ドキュメント・セマンティック検索に強み |

**差分は 3 点**であり、各次元の重み付け次第で逆転しうる**補完的な関係性**。wcf-mcp はWeb Components標準（CEM）に根ざした**バリデーション駆動型**、Serendie は React エコシステムに最適化された**ガードレール駆動型**という対照的な設計思想を持つ。

### 業界ポジショニング

Deep Research で特定した **15のDesign System MCP実装**を横断比較した結果、wcf-mcp は以下のポジションに位置する:

```
                    検証/品質保証 重視
                         ↑
                  Hopper  |  wcf-mcp ★
                  Panda   |
  ローカル ←─────────────┼─────────────→ リモート
                  Spindle |  Serendie
                  MFUI    |  Carbon
                         ↓
                    発見/探索 重視
```

- **wcf-mcp の独自ポジション**: `validate_markup` + パターンレシピ + BFS 依存解決の組み合わせは **業界唯一**
- **最も近い競合**: Hopper（`validate_hopper_code` で検証を提供する唯一の他事例）
- **最大の改善機会**: デザイントークン専用ツール（Serendie/Spindle/Panda/Hopper/PR TIMES の5事例が実装済み）

### 結論: wcf-mcp が優先的に取り組むべき改善

| 優先度 | 改善項目 | 実装コスト | 効果 | 業界での採用率 |
|--------|---------|-----------|------|--------------|
| **P1** | ガードレールツール追加 | Low | High | 2/15（Serendie, Storybook） |
| **P1** | ツール description 強化 | Low | High | ベストプラクティス（philschmid.de） |
| **P2** | デザイントークン専用ツール | Medium | High | **10/15**（業界標準） |
| **P2** | ガイドライン検索ツール | Medium | Medium | 5/15（Serendie, Carbon, Hopper, Spindle, Storybook） |
| **P3** | HTTP transport 追加 | Medium | Medium | 4/15（Serendie, Hopper, Carbon, Chakra） |

---

## 2. 業界横断分析: Design System MCP の現状（2026年2月）

### 2.1 調査対象15事例

Deep Research により特定した Design System MCP 実装を、提供機能・トランスポート・データソースで分類する。

| # | 名称 | 組織 | Transport | 主要データソース | ツール数 |
|---|------|------|-----------|----------------|---------|
| 1 | **wcf-mcp** | monoharada | stdio | CEM + レジストリ | 8 |
| 2 | **Serendie MCP** | Mitsubishi Electric | HTTP (Streamable) | マニフェスト + AutoRAG | 6+ |
| 3 | **Figma MCP** | Figma | stdio/remote | Figma API | 11 |
| 4 | **Storybook MCP** | Storybook | HTTP (addon) | Stories + Docs | 4 |
| 5 | **Chakra UI MCP** | Chakra | stdio | ドキュメント | 6+ |
| 6 | **Hopper MCP** | Workleap | HTTP (remote) | ドキュメント + トークン | 6+ |
| 7 | **Carbon MCP** | IBM | remote | ドキュメント + コード | 2 |
| 8 | **Panda CSS MCP** | Panda | stdio | プロジェクト設定 | 6+ |
| 9 | **Spindle MCP** | CyberAgent/Ameba | stdio | ソースファイル | 7 |
| 10 | **MFUI MCP** | Money Forward | stdio | ソースファイル | 2 |
| 11 | **Ubie Vitals MCP** | Ubie | stdio | 内部API | 3+ |
| 12 | **PR TIMES DS MCP** | PR TIMES | stdio | Storybook + CSS | 3 |
| 13 | **Design Tokens MCP** | (OSS) | stdio | CSS Custom Props | 4 |
| 14 | **Synergy DS MCP** | Synergy | stdio | CEM | 3+ |
| 15 | **Tyler Forge MCP** | Tyler Tech | stdio | ドキュメント | 不明 |

### 2.2 機能提供率ヒートマップ

各事例がどの機能カテゴリを提供しているかを集計:

| 機能カテゴリ | 提供率 | 代表的な実装 |
|-------------|--------|------------|
| **コンポーネント一覧/検索** | **15/15 (100%)** | 全事例 |
| **コンポーネント仕様 (Props/API)** | **13/15 (87%)** | Chakra, Hopper, Spindle, wcf-mcp |
| **コード例/スニペット** | **11/15 (73%)** | Chakra, Hopper, Carbon, wcf-mcp |
| **デザイントークン** | **10/15 (67%)** | Serendie, Spindle, Panda, Hopper, PR TIMES |
| **アイコン検索** | **6/15 (40%)** | Serendie, Spindle, Hopper, Carbon, Ubie |
| **ガイドライン/A11y文書** | **5/15 (33%)** | Serendie, Carbon, Hopper, Spindle, Storybook |
| **検証/監査** | **3/15 (20%)** | **wcf-mcp**, Hopper, Panda |
| **移行支援** | **2/15 (13%)** | Chakra (v2→v3), Hopper (Orbiter→Hopper) |
| **パターンレシピ** | **1/15 (7%)** | **wcf-mcp のみ** |
| **Figma連携 prompt** | **1/15 (7%)** | Hopper (`generate_code_from_figma_design` prompt) |

**重要な発見**:
- wcf-mcp の `validate_markup` は業界3事例しかない**検証/監査**カテゴリに属する希少機能
- wcf-mcp の**パターンレシピ**は調査15事例中**唯一の実装**
- 一方、**デザイントークン**は67%の事例が提供しており、wcf-mcp の最大の欠落

### 2.3 業界で確立された「必須ツールセット」

Deep Research の事例横断から、以下が DS-MCP の「必須ツールセット」として収束している:

```
【必須（全事例共通）】
├── search_components(query, category, limit)
├── get_component_usage(componentName)        ← Props + 使用例
└── get_component_api(componentName)          ← Props/型/イベント JSON

【準必須（67%以上）】
├── get_design_tokens(type, category)         ← wcf-mcp に不足 ⚠️
└── generate_snippet(componentName)

【推奨（33-66%）】
├── get_icons(query)                          ← wcf-mcp に不足 ⚠️
├── search_docs(query)                        ← wcf-mcp に不足 ⚠️
└── get_ui_building_instructions()            ← Storybook のガードレール

【差別化（20%未満だが高価値）】
├── validate_ui_code(snippet)                 ← wcf-mcp の強み ✅
├── get_pattern_recipe(patternId)             ← wcf-mcp の独自機能 ✅
├── get_usage_report()                        ← Panda の利用状況監査
└── migrate_component(from, to)               ← Chakra/Hopper の移行支援
```

### 2.4 「Figma MCP + DS MCP + Storybook MCP」3点セット

Deep Research で最も多く報告されたワークフローは:

```
Figma MCP                  DS MCP                    Storybook MCP
(デザインの真実)            (コンポーネント/トークン)     (実装の挙動/テスト)
     │                         │                          │
     ├─ get_design_context ──→├─ search_components ──→├─ get_ui_building_instructions
     ├─ get_variable_defs ──→ ├─ get_design_tokens       ├─ preview-stories
     ├─ get_screenshot        ├─ get_component_api       └─ list-all-documentation
     └─ get_metadata          ├─ validate_markup
                              └─ get_pattern_recipe
```

**事例**: PR TIMES（Figma MCP + DS MCP + スラッシュコマンド）、Ubie（Figma MCP + Vitals MCP）、Money Forward（Figma MCP + MFUI MCP）

---

## 3. 9次元比較マトリクス

| # | 次元 | wcf-mcp | Serendie | 差 | 優位 | 業界中央値 |
|---|------|:-------:|:--------:|:--:|:----:|:--------:|
| 1 | Developer Experience | 3 | 4 | -1 | Serendie | 3 |
| 2 | Component Discoverability | 4 | 4 | 0 | 引分 | 3 |
| 3 | Code Generation | 4 | 3 | +1 | **wcf-mcp** | 3 |
| 4 | Token/Style Management | 2 | 5 | -3 | Serendie | 3 |
| 5 | Accessibility | 4 | 3 | +1 | **wcf-mcp** | 2 |
| 6 | Integration Breadth | 3 | 4 | -1 | Serendie | 3 |
| 7 | Performance | 4 | 3 | +1 | **wcf-mcp** | 3 |
| 8 | Documentation | 3 | 4 | -1 | Serendie | 3 |
| 9 | Extensibility | 3 | 3 | 0 | 引分 | 2 |
| | **合計** | **30** | **33** | **-3** | | **25** |

**業界中央値との比較**: wcf-mcp は **+5**、Serendie は **+8**。両者とも業界平均を大きく上回るが、wcf-mcp は Token/Style Management が業界中央値を下回る唯一の次元。

---

## 4. 各次元の詳細分析

### 4.1 Developer Experience（開発者体験）

| 評価軸 | wcf-mcp (3/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **セットアップ** | `npx @monoharada/wcf-mcp` で即起動（Node.js 必須） | URL 設定のみ（HTTP transport）。ローカルインストール不要 |
| **ツール発見性** | 8ツールがフラット。呼び出し順序のガイダンスなし | `get-serendie-ui-overview` を最初に呼ぶよう description で誘導（ガードレールパターン） |
| **エラーメッセージ** | `isError: true` + テキストメッセージ。行/列情報付き診断（validate_markup） | 構造化エラー + ガイダンスメッセージ |
| **IDE対応** | Claude Code 向けスキルパック（4段階ワークフロー）あるが MCP 側に未統合 | ChatGPT（OpenAI Apps SDK）対応 |

**業界比較**:
- Storybook MCP: `get_ui_building_instructions` で開発規約を最初に返すガードレール
- Hopper: リモート URL + resources を `hopper://...` URI で体系化（高 DX）
- Spindle: ローカルファイル読込で高速（MFUIと同方式）

**Gap**: ガードレールパターンの欠如。Serendie の `get-serendie-ui-overview` と Storybook の `get_ui_building_instructions` は同じ設計思想。

---

### 4.2 Component Discoverability（コンポーネント発見性）

| 評価軸 | wcf-mcp (4/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **カタログ網羅性** | CEM ベースで全コンポーネントを自動列挙 | マニフェストベース（React コンポーネントのみ） |
| **検索** | tagName/className/componentId の3軸検索 | セマンティック検索（AutoRAG） |
| **段階的詳細取得** | `list_components` → `get_component_api` の2段階 | `get-serendie-ui-overview` → `get-component-details` → `get-component-code` の3段階 |
| **関連コンポーネント** | パターンレシピで「一緒に使うコンポーネント」を提示（BFS 依存解決） | 明示的な関連コンポーネント情報は限定的 |

**業界比較**:
- Figma: `get_metadata`（疎な XML）→ `get_design_context`（詳細）の段階的開示でトークン節約
- Carbon: `docs_search` + `code_search` の2ツール構成（シンプルだが効果的）
- MFUI: `get_available_components` → `get_component_files`（ソース丸ごと返却。トークン爆増の課題あり）

**Gap**: `list_components` のフィルタリング欠如。Figma の Progressive Disclosure パターンが参考になる。

---

### 4.3 Code Generation（コード生成）

| 評価軸 | wcf-mcp (4/5) | Serendie (3/5) |
|--------|---------------|----------------|
| **スニペット正確性** | CEM から自動生成。属性優先順位ロジック付き | テンプレートベース |
| **DS準拠検証** | `validate_markup` で CEM 準拠を機械的に検証 | ガードレールで使用指針を伝達するが、機械的検証なし |
| **A11yデフォルト** | パターンレシピに `aria-label` 等。禁止属性（`placeholder`）の検出 | コンポーネント props 型でガード |
| **プレフィックス対応** | 動的タグ名変換（マルチテナント対応） | なし |

**業界比較**:
- **Hopper `validate_hopper_code`**: トークン/props/UNSAFE_ 使用/構造/レイアウトを検証し警告/エラーを返す。**wcf-mcp の `validate_markup` と最も近い機能**だが、Hopper はトークン誤用検出も含む点で上位
- **Panda `get_usage_report`**: 未使用トークン/レシピを検出する監査機能。検証の方向性が異なる（生成時 vs 事後監査）
- **PR TIMES**: `search_components` + `get_component_usage` + スラッシュコマンドで「推測トークン禁止」を規約として固定

**wcf-mcp の独自優位**: `validate_markup` の行/列番号付き診断は、LLM の self-correction ループで極めて有効。Hopper 以外にこの粒度の検証を提供する事例はない。

---

### 4.4 Token/Style Management（トークン/スタイル管理）

| 評価軸 | wcf-mcp (2/5) | Serendie (5/5) |
|--------|---------------|----------------|
| **トークンカタログ** | CEM の `cssProperties` のみ。専用ツールなし | `get-design-tokens` 専用ツール |
| **型別フィルタ** | なし | 色/スペーシング/タイポグラフィ等で分類 |
| **テーマ別フィルタ** | なし | ライト/ダークテーマ切替対応 |
| **セマンティック区別** | なし | プリミティブ/セマンティックの明確な階層 |

**業界比較**（トークンツール提供 10/15 事例の設計パターン）:

| 事例 | ツール名 | フィルタ方式 | データソース |
|------|---------|------------|------------|
| Serendie | `get-design-tokens` | 型/カテゴリ/テーマ | マニフェスト |
| Spindle | `get_design_tokens` / `get_design_token` | 名前/カテゴリ | ソースファイル |
| Panda | `get_tokens` / `get_semantic_tokens` | primitive/semantic分離 | プロジェクト設定 |
| Hopper | `get_design_tokens` | カテゴリ/名前/CSS値/Props対応 | ドキュメント |
| PR TIMES | `get_design_tokens` | CSS変数として返却 | global.css |
| Figma | `get_variable_defs` | 色/余白/タイポ | Figma Variables |
| Design Tokens MCP | `list_tokens` / `search_tokens` | CSS Custom Properties解析 | CSSファイル |

**Gap**: **最大の差（-3 点）**。wcf-mcp は `packages/styles/` にトークンファイルを持つが MCP 経由でアクセスする手段がない。PR TIMES の `global.css → CSS変数取得` パターンが wcf-mcp の最小実装として参考になる。

---

### 4.5 Accessibility（アクセシビリティ）

| 評価軸 | wcf-mcp (4/5) | Serendie (3/5) |
|--------|---------------|----------------|
| **WCAG準拠** | DADS ガイドラインに基づく WCAG 2.2 AA 準拠 | WCAG 対応を謳うが MCP 経由の A11y 検証なし |
| **ARIAパターン** | パターンレシピに `aria-label`、`aria-required` 等 | コンポーネント props で ARIA をラップ |
| **自動テスト統合** | `validate_markup` が禁止属性（`placeholder`）を検出 | なし |
| **A11yドキュメント** | `docs/knowledge/accessibility-guidelines.md` | コンポーネント単位の A11y ドキュメント |

**業界比較**:
- Spindle: `get_accessibility_docs` で A11y 文書を専用ツールで提供。**wcf-mcp が参考にすべきパターン**
- Hopper: `validate_hopper_code` に A11y 検証（UNSAFE_ 属性検出等）を統合
- Storybook: interaction + accessibility テストの自動実行ループを計画中

**wcf-mcp の独自優位**: `placeholder` 禁止属性検出は、日本の公共サービス（DADS）に特化した A11y ベストプラクティス。Spindle の `get_accessibility_docs` パターンを追加することで +1 点の改善余地がある。

---

### 4.6 Integration Breadth（統合の広さ）

| 評価軸 | wcf-mcp (3/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **IDE** | Claude Code スキルパック | Claude Code + ChatGPT |
| **Figma** | 直接統合なし | Figma ユーティリティあり |
| **CI/CD** | `npm run agents:verify` | 不明 |
| **フレームワーク** | フレームワーク非依存（Web Components） | React 専用 |

**業界比較**:
- **Figma + DS MCP 連携**は PR TIMES / Ubie / MFUI / Hopper の4事例で報告。Hopper は `generate_code_from_figma_design` prompt で Figma MCP との連携を明示的に定義
- Serendie も「Figma MCP Server でレイヤー情報を読み取り、Serendie MCP Server で知識を引き出す」併用フローを公式ドキュメントで説明
- **wcf-mcp は Figma MCP との併用ガイドが未整備**。prompt テンプレートの追加が低コストで効果的

---

### 4.7 Performance（パフォーマンス）

| 評価軸 | wcf-mcp (4/5) | Serendie (3/5) |
|--------|---------------|----------------|
| **トークン効率** | `generate_usage_snippet` で最小限スニペット生成 | 全コンポーネント情報を返す可能性 |
| **レイテンシ** | ローカル stdio（遅延ゼロ） | HTTP + Edge（ネットワーク依存） |
| **キャッシュ** | Map ベース O(1) ルックアップ | CDN + Edge キャッシュ |

**業界比較**:
- MFUI: ソース丸ごと返却でトークン量が大きくなる課題を明記
- Figma: `get_metadata`（疎な XML）で大きいデザインのコンテキスト削減
- Spindle: ローカルファイル読込で高速（wcf-mcp と同方式）

**「全部返す」ではなく「探索→絞り込み→詳細取得」の段階設計が業界のベストプラクティス**。wcf-mcp の `list_components` が全件返却する点は改善余地あり。

---

### 4.8 Documentation（ドキュメント）

| 評価軸 | wcf-mcp (3/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **スキーマ記述性** | CEM 準拠（Web Components 標準） | 独自スキーマだが description が豊富 |
| **LLM最適化** | `llms-full.txt` 生成あり | AutoRAG でベクトル化 |
| **ツール description** | 簡潔だがワークフロー指示なし | ガードレール指示付き |

**業界比較**:
- Hopper: resources を `hopper://llms-full` 等の URI で体系化。MCP resources 機能の活用
- Carbon: `docs_search` で React/Web Components 両方のドキュメントを横断検索
- Storybook: `get_ui_building_instructions` で CSF3 等の開発規約を標準化して返却

---

### 4.9 Extensibility（拡張性）

| 評価軸 | wcf-mcp (3/5) | Serendie (3/5) |
|--------|---------------|----------------|
| **プラグイン機構** | `registry/` 構造でデータソース差し替え可能 | なし |
| **カスタムツール** | `server.registerTool()` パターン明確 | 不明 |
| **マルチソース** | CEM + install-registry + pattern-registry の3ソース | マニフェスト + AutoRAG |

**業界比較**:
- Panda CSS: プロジェクト設定から動的にトークン/レシピ/パターンを読み取る点が柔軟
- wcf-mcp の外部レジストリ拡張機構（`feat(extension)` PR）は業界でも珍しい先進的アプローチ

---

## 5. wcf-mcp が勝っている領域

### 5.1 HTML バリデーション（業界3/15のみ）

`validate_markup` は **Design System MCP 市場で希少な機能**。

| 事例 | 検証ツール | 検証対象 |
|------|----------|---------|
| **wcf-mcp** | `validate_markup` | 未知要素、未知属性、禁止属性（`placeholder`）、行/列番号付き |
| Hopper | `validate_hopper_code` | トークン誤用、props 誤用、UNSAFE_ 使用、構造、レイアウト |
| Panda | `get_usage_report` | 未使用トークン/レシピの利用状況監査 |

wcf-mcp の検証は**生成時即座のフィードバック**に特化しており、LLM の self-correction ループとの親和性が高い。

### 5.2 UIパターンレシピ + BFS 依存解決（業界唯一）

調査15事例中、**パターンレシピを提供するのは wcf-mcp のみ**。12パターン + BFS 依存解決 + `wcf add` コマンド生成の組み合わせは、他に類例がない。

### 5.3 プレフィックスシステム

動的タグ名変換（`dads-button` → `myprefix-button`）は Web Components ネイティブならではの機能。React ベースの DS MCP にはないマルチテナント対応。

### 5.4 アクセシビリティ（DADS準拠）

`placeholder` 禁止属性検出は、日本の公共サービスに特化した品質基準。DADS ガイドライン準拠の A11y は国内 DS MCP で最も厳格。

### 5.5 オフライン完結 + 低レイテンシ

stdio + npm パッケージによるローカル実行。ネットワーク依存ゼロ。Spindle, MFUI と同方式。

---

## 6. Serendie が勝っている領域

### 6.1 デザイントークン専用ツール（最大の差: -3点）

wcf-mcp にはトークンカタログにアクセスする MCP ツールが存在しない。業界 10/15 事例が提供する「準必須」機能。

### 6.2 ガードレールパターン

`get-serendie-ui-overview` の `"MUST be called first"` 記載で LLM の呼び出し順序を制御。Storybook の `get_ui_building_instructions` と同じ設計思想。

### 6.3 セマンティック検索

AutoRAG によるガイドライン文書のベクトル検索。ただし wcf-mcp の規模（30-40 コンポーネント）ではメモリ内検索で十分という判断も妥当。

### 6.4 マルチ AI プラットフォーム対応

HTTP transport + OpenAI Apps SDK で ChatGPT にもリーチ。

### 6.5 Dual Response 形式

MCP 仕様の `structuredContent` + `content` 二重レスポンスで LLM/SDK 両対応。

---

## 7. wcf-mcp 改善ロードマップ（業界事例に基づく具体化）

### Phase 1: 即座に実施（1-3日）— DX +2点

#### P1-1: `get_design_system_overview` ガードレールツール追加

| 項目 | 内容 |
|------|------|
| **影響度** | **High** |
| **実装難易度** | Low（新規ツール1つ） |
| **対象ファイル** | `packages/mcp-server/server.mjs`, `scripts/mcp/design-system-mcp.mjs` |
| **参考実装** | Serendie `get-serendie-ui-overview`, Storybook `get_ui_building_instructions` |

**設計方針**:
```javascript
server.registerTool('get_design_system_overview', {
  description: 'Get design system overview. MUST be called first before using other tools. ' +
    'Returns component categories, available patterns, design tokens summary, ' +
    'and recommended workflow (overview → component API → install → validate).',
  inputSchema: { prefix: z.string().optional() },
}, async ({ prefix }) => {
  // 1. カテゴリ別コンポーネント数サマリー
  // 2. 利用可能パターン一覧（12パターン）
  // 3. トークン概要（spacing: 20段階、color: N色等）
  // 4. 推奨ワークフロー
  // 5. プレフィックス説明
  // 6. 禁止事項（placeholder 禁止等）
});
```

#### P1-2: ツール description 強化

| 項目 | 内容 |
|------|------|
| **影響度** | **High** |
| **実装難易度** | Low（テキスト変更のみ） |
| **対象ファイル** | 全ツールの description |
| **参考** | [philschmid.de MCP Best Practices](https://www.philschmid.de/mcp-best-practices) |

**改善パターン**: When（いつ）/ Returns（何を）/ After（前提）の3点を明記。

| ツール | 現状 | 改善案 |
|--------|------|--------|
| `list_components` | `'List custom elements in the design system (from custom-elements.json).'` | `'List custom elements. Call get_design_system_overview first. Returns tagName, className, description. Use category filter for targeted results.'` |
| `validate_markup` | `'Validate an HTML snippet against CEM (unknownElement=error, unknownAttribute=warning).'` | `'Validate HTML snippet against design system. Use after generating markup to catch unknown elements, unknown attributes, and forbidden attributes (e.g. placeholder). Returns diagnostics with line/column numbers for self-correction.'` |

#### P1-3: `list_components` カテゴリフィルタ追加

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Low |
| **参考** | PR TIMES `search_components(query, ...)`, Carbon `docs_search` |

### Phase 2: 短期（1-2週間）— Token/Style +2点、Documentation +0.5点

#### P2-1: デザイントークンツール `get_design_tokens` 追加

| 項目 | 内容 |
|------|------|
| **影響度** | **High** |
| **実装難易度** | Medium |
| **対象ファイル** | `packages/mcp-server/server.mjs`（新規）, `packages/styles/spacing-tokens.ts`, `packages/styles/color-tokens.ts` |
| **参考実装** | Spindle `get_design_tokens`, PR TIMES `get_design_tokens`, Panda `get_tokens`/`get_semantic_tokens`, Hopper `get_design_tokens` |

**設計方針（PR TIMES パターンを参考に最小実装）**:
- ビルド時に `packages/styles/*.ts` から `data/design-tokens.json` を生成
- フィルタ: `type`（color/spacing/typography/radius/shadow/all）、`category`（primitive/semantic/all）

```javascript
server.registerTool('get_design_tokens', {
  description: 'Get design tokens (colors, spacing, typography, etc.). ' +
    'Use to ensure correct token values instead of hard-coded values. ' +
    'Filter by type and category. Returns token name, CSS variable, and value.',
  inputSchema: {
    type: z.enum(['color', 'spacing', 'typography', 'radius', 'shadow', 'all']).optional(),
    category: z.enum(['primitive', 'semantic', 'all']).optional(),
    query: z.string().optional(),  // トークン名の部分一致検索
  },
}, async ({ type, category, query }) => { /* ... */ });
```

#### P2-2: ガイドライン検索ツール `search_guidelines` 追加

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Medium |
| **参考実装** | Spindle `get_accessibility_docs`, Carbon `docs_search`, Serendie `search-guidelines` |

**設計方針**:
- `docs/knowledge/` + `docs/css-variable-pattern.md` 等をインデックス化
- キーワードベースの検索（AutoRAG は規模に対して過剰）

#### P2-3: `structuredContent` 対応

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Medium |
| **参考** | MCP 仕様 2025-06-18, Serendie Dual Response |

### Phase 3: 中期（1-2ヶ月）— Integration +1点

#### P3-1: HTTP transport 追加（デュアルトランスポート）

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Medium |
| **参考実装** | Serendie (Cloudflare Workers), Hopper (`https://hopper.workleap.design/mcp`) |

#### P3-2: Figma MCP 連携 prompt テンプレート

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Low |
| **参考実装** | Hopper `generate_code_from_figma_design` prompt, PR TIMES スラッシュコマンド |

**設計方針**: MCP prompts 機能として「Figma デザインから wcf コンポーネントに変換するワークフロー」を定義。

#### P3-3: アイコン検索ツール

| 項目 | 内容 |
|------|------|
| **影響度** | **Low** |
| **実装難易度** | Medium |
| **参考実装** | Spindle `get_icons`/`get_icon_info`, Hopper `get_icons`, Serendie `search-icons` |

#### P3-4: Progressive Disclosure 強化

| 項目 | 内容 |
|------|------|
| **影響度** | **Low** |
| **実装難易度** | Low |
| **参考実装** | Figma `get_metadata`（疎な XML）→ `get_design_context`（詳細）パターン |

### 採用しないもの（現時点）

| パターン | 理由 | 業界での採用率 |
|---------|------|--------------|
| AutoRAG / ベクトル検索 | 30-40 コンポーネント規模では過剰 | 2/15 (Serendie, Carbon) |
| OpenAI Apps SDK | MCP 標準プロトコルに注力 | 1/15 (Serendie) |
| 移行支援ツール | 現時点で旧バージョンが存在しない | 2/15 (Chakra, Hopper) |
| 利用状況監査 | Panda のみ。CI 統合で代替可能 | 1/15 (Panda) |

---

## 8. アーキテクチャ比較詳細

### 8.1 トランスポート方式

| 軸 | wcf-mcp (stdio) | Serendie (HTTP) | 業界傾向 |
|----|------------------|-----------------|---------|
| オフライン | 完全対応 | サーバー到達性に依存 | stdio: 10/15, HTTP: 5/15 |
| セットアップ | `npx` で起動 | URL 設定のみ | HTTP の方が DX 高い |
| セキュリティ | ローカル IPC | OAuth + CORS | 社内 DS → stdio, 公開 DS → HTTP |
| マルチクライアント | 1:1 | N:1 | — |

### 8.2 データソース戦略

| 軸 | wcf-mcp | Serendie | 業界傾向 |
|----|---------|----------|---------|
| コンポーネント定義 | CEM（標準） | 独自マニフェスト | CEM: 2/15, 独自: 13/15 |
| トークン | TypeScript（MCP 非公開） | 専用ツール公開 | 10/15 が専用ツール |
| ガイドライン | Markdown（MCP 非公開） | AutoRAG | 5/15 が何らかの形で提供 |
| パターン | JSON レジストリ | なし | wcf-mcp のみ |

### 8.3 ツール設計思想

```
wcf-mcp:     フラット → バリデーション駆動
              list → get → generate → validate
              （順序は暗黙的）

Serendie:    階層的 → ガードレール駆動
              overview (MUST) → details → code
              （順序は description で明示的）

Hopper:      リソース + ツール → 検証駆動
              resources (hopper://...) → tools → validate
              （MCP resources 活用）

PR TIMES:    3ツール + スラッシュコマンド
              search → usage → tokens + /figma-to-design
              （Figma MCP 連携に特化）
```

---

## 9. 参考文献

### 直接分析対象

| ソース | URL | 参照内容 |
|--------|-----|----------|
| wcf-mcp ソースコード | `packages/mcp-server/server.mjs` | 全8ツールの実装 |
| wcf-mcp バリデータ | `packages/mcp-server/validator.mjs` | HTML バリデーション |
| パターンレジストリ | `registry/pattern-registry.json` | 12 UI パターン |
| Serendie MCP | https://serendie.design/get-started/ai-agent/mcp-server | リモート MCP Server 仕様 |
| Serendie Design System | https://serendie.design/en/ | コンポーネント、トークン |

### 業界事例（Deep Research）

| ソース | URL | 参照内容 |
|--------|-----|----------|
| Figma MCP Server | https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/ | 11ツール, Design-to-Code |
| Storybook MCP Addon | https://github.com/storybookjs/mcp (README) | 4ツール, `get_ui_building_instructions` |
| Chakra UI MCP | https://chakra-ui.com/docs/get-started/ai/mcp-server | 6+ツール, v2→v3 移行 |
| Hopper MCP | https://hopper.workleap.design/getting-started/ai-for-agents/mcp-server | 6+ツール, `validate_hopper_code`, resources |
| Carbon MCP | https://carbondesignsystem.com/developing/carbon-mcp/overview/ | `docs_search`, `code_search` |
| Panda CSS MCP | https://panda-css.com/docs/ai/mcp-server | トークン/レシピ/監査 |
| Spindle MCP (CyberAgent) | https://developers.cyberagent.co.jp/blog/archives/56844/ | 7ツール, `get_accessibility_docs` |
| MFUI MCP (Money Forward) | https://zenn.dev/moneyforward/articles/43bcef16b033f8 | ソース返却方式, トークン量課題 |
| Ubie Vitals MCP | https://zenn.dev/ubie_dev/articles/f927aaff02d618 | Figma MCP 連携デモ |
| PR TIMES DS MCP | https://developers.prtimes.jp/2025/11/14/design-system-mcp-figma-development/ | 3ツール, スラッシュコマンド連携 |

### ベストプラクティス

| ソース | URL | 参照内容 |
|--------|-----|----------|
| MCP 仕様 2025-11-25 | https://modelcontextprotocol.io/specification/2025-11-25 | Resources/Prompts/Tools 定義 |
| MCP Best Practices | https://www.philschmid.de/mcp-best-practices | "Instructions as Context" 原則 |
| Figma "What is MCP" | https://www.figma.com/resource-library/what-is-mcp/ | MCP の概念説明 |

### wcf-mcp 内部ドキュメント

| ファイル | 参照内容 |
|---------|----------|
| `CLAUDE.md` | CSS Variable Pattern、Spacing Tokens、A11y ガイドライン |
| `docs/knowledge/ai-docs-guide.md` | カテゴリ分類マップ |
| `docs/knowledge/accessibility-guidelines.md` | DADS A11y ガイドライン |
| `.claude/skills/` | wcf-skills-pack（4段階ワークフロー） |

---

## 改善優先順位サマリー

| 優先度 | 改善項目 | 影響度 | 難易度 | 対象次元 | 期待スコア | 業界採用率 |
|--------|---------|--------|-------|---------|-----------|-----------|
| **P1** | `get_design_system_overview` | High | Low | DX +1 | 3→4 | 2/15 |
| **P1** | ツール description 強化 | High | Low | Docs +1 | 3→4 | ベストプラクティス |
| **P1** | `list_components` フィルタ | Medium | Low | Discovery +0.5 | — | 多数 |
| **P2** | `get_design_tokens` | **High** | Medium | **Token +2** | **2→4** | **10/15** |
| **P2** | `search_guidelines` | Medium | Medium | Docs +0.5 | — | 5/15 |
| **P2** | `structuredContent` | Medium | Medium | Docs +0.5 | — | 1/15 |
| **P3** | HTTP transport | Medium | Medium | Integration +1 | 3→4 | 5/15 |
| **P3** | Figma 連携 prompt | Medium | Low | Integration +0.5 | — | 4/15 |
| **P3** | アイコン検索 | Low | Medium | Discovery +0.5 | — | 6/15 |

**Phase 1 完了後**: 32 / 45（+2）— 業界上位層
**Phase 2 完了後**: 36 / 45（+6）— 業界トップクラス（Hopper と同等）
**Phase 3 完了後**: 38 / 45（+8）— Serendie を超える
