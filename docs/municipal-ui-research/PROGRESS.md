# Municipal UI Research -- 進捗サマリー

作成日: 2026-02-14
ブランチ: `monoharada/municipal-ui-research`

---

## プロジェクト概要

日本の300自治体ウェブサイトを体系的に調査し、UIパターンを抽出、WCF（Web Components Factory）準拠のテンプレートとして実装する。

### 10ステップパイプライン

| STEP | 名称 | Phase | 状態 |
|------|------|-------|------|
| 01 | Repo Discovery | Phase 1 | **完了** |
| 02 | Build Roster 300 | Phase 1 | **完了** |
| 03 | URL Discovery | Phase 2 | パイロット30完了 / **270拡大準備完了** |
| 04 | Shallow Probe | Phase 2 | パイロット30完了(PASS) / **270拡大準備完了** |
| 05 | Aggregate & Select 50 | Phase 2 | 未着手 |
| 06 | Deep Probe | Phase 3 | 未着手 |
| 07 | Pattern Modeling | Phase 3 | 未着手 |
| 08 | Template Spec | Phase 4 | 未着手 |
| 09 | Implement Templates | Phase 4 | 未着手 |
| 10 | A11y QA | Phase 5 | 未着手 |

---

## Phase 1 成果物（完了）

### STEP01: Repo Discovery

**成果物**: `.context/municipal-ui-research/config/repo_profile.yaml` (v2)

WCFリポジトリの全棚卸し結果。CEM（custom-elements.json）から54コンポーネント、pattern-registry.jsonから12パターン、全ビルドコマンド、コーディング規約を構造化。

Codex CLI（gpt-5.3-codex）によるクロスモデルレビュー後、以下を修正:
- CEM tagNames: 53 -> 54（正確値）
- パターンID: 正式名称に修正（例: `layout-website` -> `layout-website-hero-section-footer`）
- ESLint設定: `eslint.config.js` -> `.eslintrc.cjs`
- Prettier設定: `.prettierrc` -> 設定ファイルなし（デフォルト）
- tsconfig paths: `@/` -> なし（ドキュメント慣例のみ）
- CEM更新コマンド: `npm run build` -> `npm run cem:analyze`

### STEP02: Build Roster 300

**成果物**: `.context/municipal-ui-research/data/derived/roster_300.csv`

300自治体（47都道府県 + 253市区町村）のロスターCSV。4リサーチャー並列実行で構築。

#### 品質検証結果（独立検証・全9項目Pass）

| # | チェック項目 | 結果 |
|---|-----------|------|
| 1 | 行数（300行 = 47pref + 253muni） | Pass |
| 2 | 一意性（code, sample_id, name重複なし） | Pass |
| 3 | 必須8フィールド空欄なし | Pass |
| 4 | 値域（layer/cat/block/reason）準拠 | Pass |
| 5 | フォーマット（6桁code/S+4桁id/https URL） | Pass |
| 6 | 政令指定都市20市全数・全てカテゴリA | Pass |
| 7 | 47都道府県網羅 | Pass |
| 8 | 地域ブロック整合性 | Pass |
| 9 | STEP03用5列が全行空欄 | Pass |

#### 分布

| カテゴリ | 件数 | 目標範囲 |
|---------|------|---------|
| A（政令指定都市） | 20 | 全数(20) |
| B（中核市・大規模市） | 61 | 40-55 *超過+6 |
| C（一般市・特別区） | 105 | 100-120 |
| D（町村・小規模市） | 67 | 60-80 |

| ブロック | 件数 | 目標範囲 |
|---------|------|---------|
| hokkaido | 17 | 15-20 |
| tohoku | 28 | 25-30 |
| kanto | 55 | 50-60 |
| chubu | 40 | 35-45 |
| kinki | 38 | 35-40 |
| chugoku | 22 | 20-25 |
| shikoku | 16 | 15-20 |
| kyushu_okinawa | 37 | 30-40 |

---

## Phase 2 準備（完了）

### STEP03: URL Discovery 戦略

**成果物**: `.context/municipal-ui-research/data/derived/STEP03_url_discovery_strategy.md`

300自治体 x 5ページタイプ（top/contact/service/hub/article）のURL探索戦略。4スカウト並列体制、3段階探索メソッド（サイトマップ -> リンク解析 -> Web検索）、品質管理ルール定義。

### STEP04: パイロット準備

**成果物**: `.context/municipal-ui-research/data/derived/STEP04_pilot_preparation.md`

パイロット30自治体の選定基準と、component_taxonomy.csv（44種）の整合チェック結果。

主要発見:
- taxonomy 44種のうちshallow観測で直接検出: **18種（40.9%）**
- 残り25種はSTEP06（深層分析）で検出
- `:contains()` 非標準セレクタ3箇所 -- パイロット前に修正必要
- `.card` 等の汎用セレクタによるFalse Positiveリスク

### パイロット合格基準

| 指標 | 閾値 |
|------|------|
| Precision（適合率） | >= 85% |
| Recall（再現率） | >= 75% |
| ページ取得失敗率 | <= 10% |
| CSV整合性 | 100% |

---

## ファイル構成（.context/municipal-ui-research/）

```
.context/municipal-ui-research/
  config/
    repo_profile.yaml          # STEP01成果物（v2）
    research_params.yaml       # クロールパラメータ
    sampling_rules.yaml        # サンプリングルール
  data/derived/
    roster_300.csv             # STEP02成果物（300行）
    STEP02_instructions.md     # STEP02実行手順書（v2）
    STEP03_url_discovery_strategy.md  # STEP03戦略
    STEP04_pilot_preparation.md       # STEP04パイロット準備
    partial/                   # STEP02部分CSV
      researcher_a_hokkaido_tohoku_kanto.csv
      researcher_b_chubu_kinki.csv
      researcher_c_chugoku_shikoku_kyushu.csv
      researcher_d_prefectures.csv
  handoffs/
    STEP02_handoff.md          # 別ワークスペース用ハンドオフ
  schemas/
    roster_300_template.csv    # ロスターCSVテンプレート
    component_taxonomy.csv     # 44種コンポーネント定義
    observation_shallow_schema.csv  # 浅観測スキーマ
    observation_deep_schema.csv     # 深層観測スキーマ
  docs/                        # codex pack原本ドキュメント
  prompts/                     # codex pack原本プロンプト
  scripts/                     # クロールスクリプトstub
```

---

## 次のアクション

1. **STEP03**: パイロット30自治体を優先してURL Discovery実行
2. **taxonomy修正**: `:contains()` セレクタ3箇所を標準セレクタに修正
3. **STEP04パイロット**: 30自治体DOM観測 -> Go/No-Go判定
4. **STEP04本番**: Go判定後に300自治体フルスケール実行

---

## Codex CLIレビュー履歴

| 日付 | Session ID | モデル | 判定 | 指摘数 |
|------|-----------|-------|------|--------|
| 2026-02-14 | `019c59f7-4a91-70b0-a1b9-52aa60a7111f` | gpt-5.3-codex | NEEDS_REVISION -> 修正完了 | 10 blocking + 4 advisory |
