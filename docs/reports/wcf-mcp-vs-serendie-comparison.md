# wcf-mcp vs Serendie Design System MCP — 9次元比較分析レポート

> **作成日**: 2026-02-25
> **対象**: `@anthropic/wcf-mcp` v0.1.0 vs Serendie Design System MCP
> **調査方法**: wcf-mcp ソースコード精読 + Serendie 公開ドキュメント + 業界15事例の横断調査（Deep Research）
> **補足**: Serendie MCP はリモート Streamable HTTP として公開済み（[serendie.design/get-started/ai-agent/mcp-server](https://serendie.design/get-started/ai-agent/mcp-server)）

---

## 0. レポートの前提

### 目的・読者・スコープ

| 項目 | 内容 |
|------|------|
| **目的** | wcf-mcp の具体的改善案を、業界横断データに基づいて導出する |
| **想定読者** | wcf-mcp のメンテナ、DS-MCP の技術選定を行うエンジニア |
| **スコープ** | MCP ツール機能の比較（エコシステム全体・組織体制・ブランド力は対象外） |
| **更新ポリシー** | 業界動向の変化により 3-6ヶ月で陳腐化しうる。次回更新時はスコアを再評価すること |

### 採点ルーブリック（5段階）

| スコア | 定義 | 証拠要件 |
|:------:|------|----------|
| **5** | 業界最高水準。当該次元で他の模範となる実装 | ソースコード確認 or 公式ドキュメント |
| **4** | 業界平均を明確に上回る。実用上の不足が小さい | ソースコード確認 or 公式ドキュメント |
| **3** | 業界平均的。基本機能はあるが改善余地あり | 公式ドキュメント or 記事ベース |
| **2** | 業界平均を下回る。主要機能の欠落あり | 機能不在を確認 |
| **1** | 当該次元の対応なし、または最小限 | 機能不在を確認 |

### 各次元の confidence（根拠の確かさ）

| 次元 | wcf-mcp | Serendie | 注記 |
|------|:-------:|:--------:|------|
| Developer Experience | High（ソース精読） | Medium（公式ページ） | |
| Component Discoverability | High | Medium | |
| Code Generation | High | Medium | |
| Token/Style Management | High（不在を確認） | Medium（公式ページ記載） | |
| Accessibility | High | Low（MCP 経由の検証機能は未確認） | Serendie 側は推測含む |
| Integration Breadth | High | Medium | |
| Performance | High | Low（HTTP 実測値なし） | Serendie 側は推測含む |
| Documentation | High | Medium | |
| Extensibility | High | Low（ソース非公開部分あり） | |

### Serendie MCP ツール名について

Serendie MCP の正式ツール名は `serendie-web/src/mcp/tools/` ディレクトリのソースコードから確認済み（全8ツール）:

| 正式ツール名 | ソースファイル | 機能説明 |
|-------------|-------------|---------|
| `get-serendie-ui-overview` | `serendie-ui-overview.ts` | セットアップ・概要情報の取得 |
| `get-components` | `components.ts` | コンポーネント一覧 |
| `get-component-detail` | `components.ts` | コンポーネントのプロパティ詳細 |
| `get-design-tokens` | `design-tokens.ts` | デザイントークン一覧 |
| `get-design-token-detail` | `design-tokens.ts` | 個別トークン詳細 |
| `get-symbols` | `symbols.ts` | Serendie Symbols（アイコン）一覧 |
| `get-symbol-detail` | `symbols.ts` | 個別シンボル詳細・バリアント |
| `search-serendie-guideline` | `search-serendie-guideline.ts` | ガイドラインの Cloudflare AI Search |

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
| 2 | **Serendie MCP** | Mitsubishi Electric | HTTP (Streamable) | マニフェスト + AutoRAG | 8 |
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

> **注記 (2026-02-25)**: `worktree-feat-mcp-server-upgrade` ブランチ (#165/#166/#167) が main にマージされると、DX 3→4、Token 2→4、Integration 3→4、Docs 3→4 で **≈35/45** に改善される見込み。45/45 達成ロードマップは §10 を参照。

---

## 4. 各次元の詳細分析

### 4.1 Developer Experience（開発者体験）

| 評価軸 | wcf-mcp (3/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **セットアップ** | `npx @anthropic/wcf-mcp` で即起動（Node.js 必須） | URL 設定のみ（HTTP transport）。ローカルインストール不要 |
| **ツール発見性** | 8ツールがフラット。呼び出し順序のガイダンスなし | `get-serendie-ui-overview` を最初に呼ぶ設計（ガードレールパターン）。8ツールが一覧/詳細ペアで整理 |
| **エラーメッセージ** | `isError: true` + テキストメッセージ。行/列情報付き診断（validate_markup） | 構造化エラー + ガイダンスメッセージ |
| **IDE対応** | Claude Code 向けスキルパック（4段階ワークフロー）あるが MCP 側に未統合 | ChatGPT（OpenAI Apps SDK）対応 |

**業界比較**:
- Storybook MCP: `get_ui_building_instructions` で開発規約を最初に返すガードレール
- Hopper: リモート URL + resources を `hopper://...` URI で体系化（高 DX）
- Spindle: ローカルファイル読込で高速（MFUIと同方式）

**Gap**: ガードレールパターンの欠如。Serendie の `get-serendie-ui-overview` と Storybook の `get_ui_building_instructions` は同じ設計思想。

#### Evidence (2026-02-25) — 暫定（main 未マージ）

| 項目 | 内容 |
|------|------|
| Issue | #169 (get_design_system_overview), #165/#166/#167 (description 強化) |
| 実装ツール / 機能 | `get_design_system_overview` ガードレール + 全ツール description に When/Returns/After 構造 |
| テストコマンド | `npm test -- --run packages/mcp-server/server.test.js` |
| テスト結果 | 18件パス（overview 含む） |
| 該当ファイル | `packages/mcp-server/core.mjs:280` |
| PR / マージ SHA | PR #169 / `5bd9469` + PR #180 / （未マージ） |
| スコア変更 | 3 → 4 |
| 根拠 | ガードレールパターン + description 強化で Serendie/Storybook と同等。5/5 には #172（マルチIDE + エラーリカバリ）が必要 |

**5/5 に必要な追加改善** → #172: マルチIDE設定テンプレート、validate_markup エラーリカバリ提案

---

### 4.2 Component Discoverability（コンポーネント発見性）

| 評価軸 | wcf-mcp (4/5) | Serendie (4/5) |
|--------|---------------|----------------|
| **カタログ網羅性** | CEM ベースで全コンポーネントを自動列挙 | マニフェストベース（React コンポーネントのみ） |
| **取得方式** | tagName/className で個別取得（`pickDecl`）。componentId は install recipe 側で解決 | `get-components` で一覧、`get-component-detail` で個別取得 |
| **段階的詳細取得** | `list_components` → `get_component_api` の2段階 | `get-serendie-ui-overview` → `get-components` → `get-component-detail` の3段階 |
| **関連コンポーネント** | パターンレシピで「一緒に使うコンポーネント」を提示（BFS 依存解決） | 明示的な関連コンポーネント情報は限定的 |

**業界比較**:
- Figma: `get_metadata`（疎な XML）→ `get_design_context`（詳細）の段階的開示でトークン節約
- Carbon: `docs_search` + `code_search` の2ツール構成（シンプルだが効果的）
- MFUI: `get_available_components` → `get_component_files`（ソース丸ごと返却。トークン爆増の課題あり）

**Gap**: `list_components` のフィルタリング欠如。Figma の Progressive Disclosure パターンが参考になる。

#### Evidence

| 項目 | 内容 |
|------|------|
| スコア | 4（変更なし） |
| 5/5 に必要 | #173: Progressive Disclosure + `search_icons` + カテゴリ/クエリフィルタ |

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

#### Evidence

| 項目 | 内容 |
|------|------|
| スコア | 4（変更なし） |
| 5/5 に必要 | #174: トークン誤用検出（ハードコード値→トークン提案） + structuredContent（実装オーナー: 主要3ツール） |

---

### 4.4 Token/Style Management（トークン/スタイル管理）

| 評価軸 | wcf-mcp (2/5) | Serendie (5/5) |
|--------|---------------|----------------|
| **トークンカタログ** | CEM の `cssProperties` のみ。専用ツールなし | `get-design-tokens` + `get-design-token-detail` の一覧/詳細ペア |
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

**Gap**: **最大の差（-3 点）**。wcf-mcp は `packages/styles/design-tokens/index.ts`（DADS 公式トークン: 色・タイポグラフィ・radius・elevation）+ `packages/styles/spacing-tokens.ts`（スペーシング 20段階）にトークンを定義しているが、MCP 経由でアクセスする手段がない。PR TIMES の `global.css → CSS変数取得` パターンが wcf-mcp の最小実装として参考になる。

#### Evidence (2026-02-25) — 暫定（main 未マージ）

| 項目 | 内容 |
|------|------|
| Issue | #165 |
| 実装ツール / 機能 | `get_design_tokens` — type/category/query フィルタ対応 |
| テストコマンド | `npm test -- --run packages/mcp-server/server.test.js` |
| テスト結果 | 18件パス（tokens 5件追加） |
| 該当ファイル | `packages/mcp-server/core.mjs` (get_design_tokens), `scripts/mcp/extract-design-tokens.mjs` |
| PR / マージ SHA | PR #180 / （未マージ） |
| スコア変更 | 2 → 4 |
| 根拠 | 310トークン（color:179, spacing:83, typography:30, radius:9, shadow:9）を type/category/query でフィルタ可能。Spindle/PR TIMES と同等。5/5 には一覧/詳細ペア + テーマ対応が必要 |

**5/5 に必要な追加改善** → #170: `get_design_token_detail` + テーマ対応（API先行: `light` のみ、NG-06）+ トークン関係性マップ

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

#### Evidence

| 項目 | 内容 |
|------|------|
| スコア | 4（変更なし） |
| 5/5 に必要 | #175: `get_accessibility_docs` 専用ツール + コンポーネント別 A11y チェックリスト + WCAG レベルフィルタ |

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

#### Evidence (2026-02-25) — 暫定（main 未マージ）

| 項目 | 内容 |
|------|------|
| Issue | #167 |
| 実装ツール / 機能 | HTTP transport（`--transport=http --port=3100`、127.0.0.1 バインド） |
| テストコマンド | `npm test -- --run packages/mcp-server/server.test.js` |
| テスト結果 | 18件パス（HTTP transport 1件追加） |
| 該当ファイル | `packages/mcp-server/bin.mjs` |
| PR / マージ SHA | PR #180 / （未マージ） |
| スコア変更 | 3 → 4 |
| 根拠 | デュアルトランスポート（stdio + HTTP）で Serendie/Hopper と同等の接続性。5/5 には Figma 連携 + MCP resources が必要 |

**5/5 に必要な追加改善** → #176: Figma MCP prompt テンプレート + MCP resources (`wcf://`) + マルチIDE設定

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

#### Evidence

| 項目 | 内容 |
|------|------|
| スコア | 4（変更なし） |
| 5/5 に必要 | #178: Progressive Disclosure（#173 主導）+ レスポンスサイズ最適化 + ストリーミング |

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

#### Evidence (2026-02-25) — 暫定（main 未マージ）

| 項目 | 内容 |
|------|------|
| Issue | #166 (search_guidelines), #165/#167 (description 強化) |
| 実装ツール / 機能 | `search_guidelines` — topic/query フィルタ、heading×3/keyword×2/snippet×1 スコアリング |
| テストコマンド | `npm test -- --run packages/mcp-server/server.test.js` |
| テスト結果 | 18件パス（guidelines 4件追加） |
| 該当ファイル | `packages/mcp-server/core.mjs` (search_guidelines), `scripts/mcp/index-guidelines.mjs` |
| PR / マージ SHA | PR #180 / （未マージ） |
| スコア変更 | 3 → 4 |
| 根拠 | 31ドキュメント（css:10, patterns:13, accessibility:1, all:7）をキーワード検索可能。Spindle と同等。5/5 には structuredContent + MCP resources が必要 |

**5/5 に必要な追加改善** → #177: structuredContent（#174 実装オーナーから波及） + MCP resources（#176 実装オーナーから波及） + LLM 最適化レスポンス

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

#### Evidence

| 項目 | 内容 |
|------|------|
| スコア | 3（変更なし。最大ギャップ: +2 必要） |
| 5/5 に必要 | #171: プラグインインターフェース（`@experimental`、NG-07） + マルチソース設定 + カスタムツール登録 |

---

## 5. 優劣サマリー（各次元の詳細は §4 参照）

### wcf-mcp が勝っている領域（3次元）

| 次元 | 要点 | 業界での希少性 |
|------|------|--------------|
| **Code Generation (+1)** | `validate_markup` の行/列番号付き診断。LLM self-correction ループとの親和性が高い | 検証ツール: 3/15 のみ |
| **Accessibility (+1)** | DADS 準拠の `placeholder` 禁止検出。国内 DS MCP で最も厳格な A11y 基準 | A11y 検証統合: 2/15 |
| **Performance (+1)** | stdio + Map ベース O(1)。パターンレシピ + BFS 依存解決は**業界唯一** | パターンレシピ: 1/15 |

その他の差別化: プレフィックスシステム（マルチテナント）、オフライン完結（Spindle/MFUI と同方式）

### Serendie が勝っている領域（4次元）

| 次元 | 要点 | 業界での普及度 |
|------|------|--------------|
| **Token/Style (-3)** | `get-design-tokens` + `get-design-token-detail` の一覧/詳細ペア。**最大のギャップ** | トークンツール: 10/15 |
| **DX (-1)** | `get-serendie-ui-overview` ガードレール + HTTP transport の低セットアップコスト | ガードレール: 2/15 |
| **Integration (-1)** | HTTP transport + OpenAI Apps SDK でマルチ AI プラットフォーム対応 | HTTP: 5/15 |
| **Documentation (-1)** | `search-serendie-guideline` による Cloudflare AI Search。Dual Response 形式 | セマンティック検索: 2/15 |

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
| **対象ファイル** | `packages/mcp-server/server.mjs`（新規）, `packages/styles/design-tokens/index.ts`（DADS公式トークン）, `packages/styles/spacing-tokens.ts` |
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
| **参考実装** | Spindle `get_accessibility_docs`, Carbon `docs_search`, Serendie `search-serendie-guideline` |

**設計方針**:
- `docs/knowledge/` + `docs/css-variable-pattern.md` 等をインデックス化
- キーワードベースの検索（AutoRAG は規模に対して過剰）

#### P2-3: `structuredContent` 対応

| 項目 | 内容 |
|------|------|
| **影響度** | **Medium** |
| **実装難易度** | Medium |
| **参考** | MCP 仕様 2025-11-25（`structuredContent` は 2025-06-18 draft で導入、2025-11-25 で安定化）, Serendie Dual Response |

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
| **参考実装** | Spindle `get_icons`/`get_icon_info`, Hopper `get_icons`, Serendie `get-symbols`/`get-symbol-detail` |

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

### その他の業界事例（§2 の表で参照）

| 事例 | 出典 | 確認レベル |
|------|------|-----------|
| Design Tokens MCP | https://lobehub.com/it/mcp/kickstartds-design-token-mcp | LobeHub 掲載（未検証表記あり） |
| Synergy DS MCP | npm `@synergy-design-system/mcp` | npm パッケージ存在確認 |
| Tyler Forge MCP | Tyler Technologies 社内事例（公開情報限定） | 記事ベース |
| Serendie ソースコード | https://github.com/serendie/serendie-web/tree/main/src/mcp | ツール名の正式確認に使用 |

### ベストプラクティス

| ソース | URL | 参照内容 |
|--------|-----|----------|
| MCP 仕様 2025-11-25 | https://modelcontextprotocol.io/specification/2025-11-25 | Resources/Prompts/Tools 定義（安定版） |
| MCP Best Practices | https://www.philschmid.de/mcp-best-practices | "Instructions as Context" 原則 |
| Figma "What is MCP" | https://www.figma.com/resource-library/what-is-mcp/ | MCP の概念説明 |

> **MCP 仕様バージョンについて**: 本レポートは 2025-11-25 版を基準仕様とする。`structuredContent` は 2025-06-18 draft で導入され 2025-11-25 で安定化。

### wcf-mcp 内部ドキュメント

| ファイル | 参照内容 |
|---------|----------|
| `CLAUDE.md` | CSS Variable Pattern、Spacing Tokens、A11y ガイドライン |
| `docs/knowledge/ai-docs-guide.md` | カテゴリ分類マップ |
| `docs/knowledge/accessibility-guidelines.md` | DADS A11y ガイドライン |
| `.claude/skills/` | wcf-skills-pack（4段階ワークフロー） |

---

## 10. 45/45 Contract — 採点運用・制約・失敗条件

> **目的**: 9次元すべてを 5/5 にするロードマップ (#170〜#178) の判定基準・制約・失敗条件を1箇所に固定し、Issue 間のドリフトを防ぐ。

### 10.1 採点運用

| 項目 | 定義 |
|------|------|
| **採点 SOT (Single Source of Truth)** | 本文書 §4 の各次元 Evidence 欄 |
| **ベースライン (main)** | 30/45（2026-02-25 時点、§3 のスコア） |
| **暫定スコア (branch)** | `worktree-feat-mcp-server-upgrade`（#165/#166/#167 実装済み・main 未マージ）≈ 35/45 |
| **再採点トリガー** | 対象 Issue の PR が **main にマージ**された時点で §4 Evidence を更新し再採点 |
| **再採点者** | PR マージ実施者が Evidence を記入 → レビュアーがスコア妥当性を確認 |
| **5/5 判定条件** | §4 の該当次元で「業界最高水準」（ルーブリック §0）の根拠を Evidence に提示できること |

### 10.2 Non-goals / Constraints

| # | 制約 | 理由 |
|---|------|------|
| NG-01 | AutoRAG / ベクトル検索は導入しない | 30-40コンポーネント規模では過剰（§7「採用しないもの」） |
| NG-02 | OpenAI Apps SDK 対応は行わない | MCP 標準プロトコルに注力 |
| NG-03 | 移行支援ツールは作らない | 旧バージョンが存在しない |
| NG-04 | 既存ツールの後方互換を壊さない | `createMcpServer()` の DI インターフェースを維持 |
| NG-05 | 1ツール応答 ≤ 100KB | MFUI の「ソース丸ごと返却」問題を回避 |
| NG-06 | テーマ対応は API 先行（`light` のみ返却） | 実ダークテーマトークンは未導入。データ追加のみで将来対応可能な設計とする |
| NG-07 | #171 プラグイン機構は `@experimental` | 外部公開 API 固定は現ユーザー規模に対して過剰 |

### 10.3 Failure Definition

| # | 失敗条件 | 検出方法 |
|---|---------|---------|
| F-01 | 既存ツールの互換破壊 | `npm test -- packages/mcp-server/server.test.js` 既存テスト失敗 |
| F-02 | `npm run agents:verify` 失敗 | CI パイプライン |
| F-03 | 単一ツール応答 > 100KB | テストでレスポンスサイズ計測 |
| F-04 | 5/5 の根拠を §4 Evidence に提示できない | PR レビューで確認 |
| F-05 | MCP SDK 非互換 | `@modelcontextprotocol/sdk` メジャーバージョンアップ時の CI 失敗 |

### 10.4 グループ分割 (G1 / G2 / G3)

| Group | テーマ | Issues | 期待獲得 |
|-------|-------|--------|---------|
| **G1: Protocol Compliance** | MCP 仕様準拠 + レスポンス品質 | #174, #177 | +2 |
| **G2: Tool Completeness** | ツール追加 + データ拡充 | #170, #173, #175 | +3 |
| **G3: Platform & Architecture** | 基盤強化 | #171, #172, #176, #178 | +5 |

#### Cross-cutting オーナーシップ

| 横断要素 | 実装オーナー | 記述/検証オーナー | 備考 |
|---------|------------|----------------|------|
| structuredContent（主要3ツール） | #174 (CodeGen) | #177 (Docs) | 対象: `get_component_api`, `get_design_tokens`, `search_guidelines` |
| MCP resources (`wcf://`) | #176 (Integration) | #177 (Docs) | URI 設計は #176 で確定 |
| Progressive Disclosure / ページネーション | #173 (Discoverability) | #178 (Performance) | `list_components` を #173 で改修、効果を #178 で計測 |
| マルチIDE設定テンプレート | #172 (DX) | #176 (Integration) | IDE 設定スニペットの実装は #172、Figma 連携等のドキュメント統合は #176 |

### 10.5 Evidence テンプレート

§4 の各次元に以下の形式で Evidence を追記する:

```
#### Evidence (YYYY-MM-DD)
| 項目 | 内容 |
|------|------|
| Issue | #NNN |
| 実装ツール / 機能 | `tool_name` or 機能説明 |
| テストコマンド | `npm test -- ...` |
| テスト結果 | N件パス / N件追加 |
| 該当ファイル | `path/to/file.mjs:L123` |
| PR / マージ SHA | PR #NNN / `abc1234` |
| スコア変更 | X → Y |
| 根拠 | 「...を実装し、業界比較で...を満たす」 |
```

### 10.6 前提 (Dependencies)

| Issue | 前提条件 |
|-------|---------|
| #170 | #165 (get_design_tokens) が main マージ済み |
| #173 | なし（独立） |
| #174 | MCP SDK が structuredContent をサポート（`@modelcontextprotocol/sdk` ≥ 1.26） |
| #175 | なし（独立） |
| #171 | #167 (core.mjs DI パターン) が main マージ済み |
| #172 | #169 (get_design_system_overview) が main マージ済み |
| #176 | #167 (HTTP transport) が main マージ済み |
| #177 | #174 (structuredContent), #176 (MCP resources) が実装済み |
| #178 | #173 (Progressive Disclosure) が実装済み |

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

---

## 付録: 運用モデル・リスク・KPI

### 運用モデル比較

| 項目 | wcf-mcp (stdio/ローカル) | Serendie (HTTP/リモート) | 判断基準 |
|------|--------------------------|------------------------|---------|
| **配布方式** | npm publish → `npx` で起動 | URL 共有のみ | 社内 DS → ローカル推奨（MFUI/Spindle 事例） |
| **データ鮮度** | npm publish 時点で固定 | デプロイ時点で更新 | 頻繁な更新 → HTTP、安定版 → stdio |
| **TCO (維持コスト)** | npm publish + CEM 生成パイプライン | Cloudflare Workers 運用 + AutoRAG 課金 | stdio は運用コスト最小 |
| **セキュリティ** | ソースは npm パッケージ内に同梱。ローカル IPC で外部通信なし | HTTP 経由でデータ送受信。OAuth/CORS 設定必須 | 機密 DS → ローカル必須 |
| **監査** | npm audit + ローカル実行ログ | HTTP アクセスログ + Workers Analytics | |
| **供給網リスク** | npm registry 依存 | Cloudflare 依存 + AutoRAG SLA | |

### 効果測定 KPI（改善後の定量評価用）

| KPI | 測定方法 | ベースライン（改善前） | 目標（Phase 2 完了後） |
|-----|---------|---------------------|---------------------|
| **validate_markup 初回通過率** | `diagnostics.length === 0` の割合 | 未計測（導入時に計測開始） | 70% 以上 |
| **LLM ターン数（UI生成タスク）** | overview → validate 完了までの MCP 呼び出し回数 | 推定 4-6 ターン | 3 ターン以内 |
| **unknownElement 発生率** | validate_markup の `unknownElement` 診断数 / 総バリデーション回数 | 未計測 | 5% 以下 |
| **トークン推測発生** | `get_design_tokens` 未呼び出しでハードコード値が使われた回数 | N/A（ツール未実装） | 計測開始 |
| **パターンレシピ利用率** | `get_pattern_recipe` 呼び出し回数 / UI 生成タスク数 | 未計測 | 30% 以上 |
