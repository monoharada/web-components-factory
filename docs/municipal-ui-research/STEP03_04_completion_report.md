# STEP03+04 完了報告

> **報告日**: 2026-02-16
> **ブランチ**: `monoharada/municipal-ui-research`
> **レビュー判定**: **GO** （STEP05 移行承認済み）

---

## 1. 完了ステータス

| STEP | 名称 | 状態 | 完了日 |
|------|------|------|--------|
| 03 | URL Discovery | **完了** | 2026-02-16 |
| 04 | Shallow Probe | **完了** | 2026-02-16 |
| レビュー | 品質レビュー | **GO** | 2026-02-16 |

---

## 2. 成果物一覧

### 正本（STEP05 入力契約）

| # | ファイル | 行数 | 列数 | サイズ |
|---|---------|------|------|--------|
| 1 | `.context/municipal-ui-research/data/derived/observations_shallow.csv` | 1,471 | 45 | 790 KB |
| 2 | `.context/municipal-ui-research/data/derived/roster_300_with_pages.csv` | 300 | 15 | 151 KB |
| 3 | `.context/municipal-ui-research/data/derived/observations_shallow_270.csv` | 1,334 | 45 | 684 KB |

### 作業キャッシュ（バッチ出力）

| # | ファイル | 件数 |
|---|---------|------|
| 4 | `docs/municipal-ui-research/data/batches/batch_B{01-41}_observations.csv` | 41ファイル |
| 5 | `docs/municipal-ui-research/data/batches/batch_B{01-41}_urls.csv` | 41ファイル |
| 6 | `docs/municipal-ui-research/data/batches/batch_manifest.csv` | 41バッチ管理台帳 |

### ドキュメント

| # | ファイル | 用途 |
|---|---------|------|
| 7 | `.context/municipal-ui-research/review/STEP03_04_review_report.md` | 品質レビューレポート |
| 8 | `docs/municipal-ui-research/STEP03_04_combined_execution_prompt.md` | バッチ実行プロンプト |
| 9 | `docs/municipal-ui-research/STEP03_04_operator_guide.md` | オペレータガイド |
| 10 | `docs/municipal-ui-research/STEP03_04_review_prompt.md` | レビュー依頼プロンプト |
| 11 | `docs/municipal-ui-research/PROGRESS.md` | 進捗サマリー（更新済み） |

---

## 3. 実行規模

### 3-1. 対象

| 項目 | 値 |
|------|---|
| 対象自治体 | **300**（47都道府県 + 253市区町村） |
| パイロット（STEP03+04 個別実行） | 30自治体, 137観測行 |
| 拡大バッチ（STEP03+04 統合実行） | 270自治体, 1,334観測行, 41バッチ |
| 観測行総数 | **1,471** |
| ページタイプ | 5種（top / contact / service / hub / article） |

### 3-2. 地域分布

| 地域ブロック | 自治体数 | バッチ数 |
|------------|---------|---------|
| hokkaido | 18 | 2 |
| tohoku | 34 | 5 |
| kanto | 62 | 8 |
| chubu | 49 | 7 |
| kinki | 45 | 6 |
| chugoku | 27 | 4 |
| shikoku | 20 | 3 |
| kyushu_okinawa | 45 | 6 |
| **合計** | **300** | **41** |

### 3-3. 人口カテゴリ分布

| カテゴリ | 自治体数 | 説明 |
|---------|---------|------|
| A | 20 | 政令指定都市 |
| B | 61 | 中核市・大規模市 |
| C | 105 | 一般市・特別区 |
| D | 67 | 町村・小規模市 |
| unknown | 47 | 都道府県 |

### 3-4. ページタイプ別行数

| ページタイプ | 行数 | 欠損 | 欠損理由 |
|------------|------|------|---------|
| top | 300 | 0 | — |
| hub | 295 | 5 | サイト構造上カテゴリページなし |
| contact | 294 | 6 | 専用ページなし（mailto等） |
| article | 292 | 8 | 離島・過疎地域で個別記事なし |
| service | 290 | 10 | 過疎地域で児童手当ページなし |

---

## 4. 品質指標

### 4-1. HTTP取得

| 指標 | 値 | 閾値 | 判定 |
|------|---|------|------|
| HTTP 200 成功率 | **99.0%** (1,457/1,471) | >= 95% | PASS |
| 取得失敗行 | 14行 (0.95%) | < 1% | PASS |

**取得失敗の内訳：**

| HTTP status | 行数 | 対象 |
|-------------|------|------|
| 404 | 5 | S0048, S0058, S0117, S0178(service), S0265(article) |
| dns_error | 7 | S0225(top×1), S0229(top×1), S0244(全5ページ) |
| 403 | 1 | S0171(contact) |
| 0 (ECONNREFUSED) | 1 | S0013(service) |

### 4-2. Boolean検出精度（サンプル10自治体の内部整合性検証）

| 指標 | 値 | 閾値 | 判定 |
|------|---|------|------|
| Precision | **100.0%** (64/64) | >= 85% | PASS |
| Recall | **97.0%** (64/66, 保守的推定) | >= 75% | PASS |

### 4-3. 構造検証（全9項目PASS）

| Check | 結果 |
|-------|------|
| 列数 | observations=45, roster=15 |
| 行数 | observations=1,471, roster=300 |
| 列幅一貫性 | 全行一致 |
| Boolean値 | true/false のみ（空欄なし） |
| sample_id+page_type一意性 | 重複なし |
| sample_id相互参照 | observations ⇔ roster 完全一致 |

---

## 5. UIコンポーネント検出結果

### 5-1. 全ページ出現率

| コンポーネント | 出現率 | 件数/総数 |
|--------------|--------|----------|
| has_global_nav | 99.0% | 1,457/1,471 |
| has_header_brand | 95.2% | 1,400/1,471 |
| has_footer_policies | 92.5% | 1,360/1,471 |
| has_search | 89.1% | 1,310/1,471 |
| has_breadcrumb | 75.4% | 1,109/1,471 |
| has_skip_link | 72.5% | 1,066/1,471 |
| has_contact_info | 69.7% | 1,026/1,471 |
| has_accessibility_link | 64.6% | 950/1,471 |
| has_contact_form | 47.3% | 696/1,471 |
| has_local_nav | 41.9% | 617/1,471 |
| has_article_meta | 37.5% | 552/1,471 |
| has_news_list | 35.9% | 528/1,471 |
| has_hub_cards | 29.2% | 429/1,471 |
| has_carousel | 28.2% | 415/1,471 |
| has_attachments | 24.3% | 357/1,471 |
| has_pickup | 15.5% | 228/1,471 |
| has_emergency_notice | 12.3% | 181/1,471 |
| has_toc | 4.2% | 62/1,471 |

### 5-2. トップページ出現率（n=300）

トップページ固有のUI構成要素の普及状況：

| コンポーネント | 出現率 | 特記事項 |
|--------------|--------|---------|
| has_global_nav | 99.0% | ほぼ全自治体で標準装備 |
| has_header_brand | 95.3% | ロゴ/自治体名 |
| has_news_list | 91.7% | トップに新着情報を配置 |
| has_footer_policies | 91.7% | 個人情報・著作権等のリンク |
| has_carousel | 89.0% | スライダー/バナー回転 |
| has_search | 88.7% | サイト内検索 |
| has_hub_cards | 86.3% | カテゴリ導線カード群 |
| has_skip_link | 71.7% | アクセシビリティ対応 |
| has_contact_info | 67.3% | 電話番号・所在地 |
| has_accessibility_link | 64.3% | アクセシビリティ方針ページ |
| has_emergency_notice | 54.0% | 災害・感染症の緊急情報 |
| has_contact_form | 40.7% | 問い合わせフォーム/リンク |
| has_pickup | 38.0% | ピックアップ/注目情報 |
| has_local_nav | 4.3% | サイドナビ（トップでは稀） |
| has_breadcrumb | 0.3% | トップページでは不要 |
| has_attachments | 0.7% | トップではほぼなし |
| has_article_meta | 0.0% | トップでは検出されない |
| has_toc | 0.0% | トップでは検出されない |

### 5-3. CMS分布（上位10種、自治体ベース）

| CMS fingerprint | 自治体数 |
|-----------------|---------|
| custom（独自CMS） | 68 |
| SMART CMS | 17 |
| proprietary（プロプライエタリ） | 15 |
| WordPress | 8 |
| smart_cms | 7 |
| FI（FIシリーズ） | 6 |
| jquery_based | 5 |
| KanaboWeb | 4 |
| Joruri | 4 |
| Joruri CMS | 2 |

---

## 6. レビューで検出された注意事項

### Warning（STEP05で考慮）

1. **hub/service URL重複3件**（S0247 美郷町, S0263 馬路村, S0294 水上村）
   - D-cat極小自治体のサイト構造上の制約。許容済み
2. **自治体内URL重複22件**
   - D-cat自治体で top=hub, top=article 等。STEP05で「distinct page count」算出を推奨
3. **has_contact_form / has_article_meta の検出範囲**
   - ページタイプ間で出現率が均一（フッター共通要素の可能性）。STEP06で精緻化推奨
4. **dns_error自治体**
   - S0225 古座川町（top×1）, S0244 新庄村（全5ページ）。STEP05サンプリングで考慮

### Advisory（STEP06で留意）

1. **ドメイン移行パターン**: lg.jp 統一が進行中（tochigi.jp → lg.jp等）
2. **CMS fingerprint粒度**: GA/GTMタグの有無でfingerprint分岐あり。CMS本体とトラッキングの分離を検討
3. **レビュープロンプト改善**: 6点の改善提案あり（レビューレポート参照）

---

## 7. 修正履歴

| 日時 | 対象 | 内容 | 修正セル数 |
|------|------|------|-----------|
| 2026-02-16 10:36 | S0225 古座川町 | dns_error行のboolean空欄→false | 7 |
| 2026-02-16 12:20 | S0244 新庄村 | dns_error行のboolean=true→false | 21 |

---

## 8. STEP05 への引継ぎ

### 入力ファイル（3点、全て準備完了）

| # | ファイル | パス |
|---|---------|------|
| 1 | observations_shallow.csv | `.context/municipal-ui-research/data/derived/observations_shallow.csv` |
| 2 | roster_300_with_pages.csv | `.context/municipal-ui-research/data/derived/roster_300_with_pages.csv` |
| 3 | sampling_rules.yaml | `.context/municipal-ui-research/config/sampling_rules.yaml` |

### STEP05 タスク概要

```
STEP05: 浅観測の集計 + 50抽出
├── 1) ページタイプ別に部品出現率・バリアント分布を集計
├── 2) UI構造ベクトル（one-hot）を作りクラスタリング
├── 3) 代表クラスタから候補を選び層化条件を調整
└── 4) selection_report_50.md に選定理由を記録
```

### STEP05 出力（期待）

- `data/derived/roster_50.csv` — 50自治体の選定結果
- `data/derived/selection_report_50.md` — 選定理由レポート
- `data/derived/shallow_stats/*` — 集計統計

### STEP05 実行時の留意事項

1. **dns_error自治体（S0225, S0244）**: boolean全false。クラスタリング時にUI特徴なしとなるため、除外またはフラグ付与を推奨
2. **S0229（倉敷市）**: topページのみdns_error、他4ページは200。topのboolean=falseだが実際はUIあり。クラスタリング時に top 以外のデータで補完可能
3. **hub/service重複3件**: one-hotベクトル生成時に同一ページの観測が二重カウントされないよう注意
4. **has_contact_form / has_article_meta**: ページタイプ間で均一分布。クラスタリングの弁別力が低い可能性

### サンプリングルール（sampling_rules.yaml）

```yaml
roster_50:
  keep_prefectures: 10      # 10都道府県
  keep_municipalities: 40   # 40市区町村
  method:
    - UI構造ベクトルからクラスタリング
    - 代表クラスタから候補選定
    - 層化条件（layer/population_category/region_block）で調整
  manual_overrides_allowed: true
```

---

## 9. 参照ドキュメント

| ドキュメント | パス |
|------------|------|
| 品質レビューレポート | `.context/municipal-ui-research/review/STEP03_04_review_report.md` |
| 45列スキーマ定義 | `.context/municipal-ui-research/schemas/observation_shallow_schema.csv` |
| STEP05 実行プロンプト | `.context/municipal-ui-research/prompts/STEP05_aggregate_select_50.md` |
| STEP03+04 統合実行プロンプト | `docs/municipal-ui-research/STEP03_04_combined_execution_prompt.md` |
| バッチ管理台帳 | `docs/municipal-ui-research/data/batches/batch_manifest.csv` |
| 進捗サマリー | `docs/municipal-ui-research/PROGRESS.md` |
