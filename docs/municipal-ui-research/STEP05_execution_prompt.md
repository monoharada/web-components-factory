# STEP05 浅観測集計 + 50自治体抽出 実行プロンプト

> **用途**: Claude Code セッションにコピーして実行するための自己完結型プロンプト。
> **前提**: リポジトリ `kabul/` のルートで実行。ファイルシステムアクセス（Read/Bash）が使用可能。
> **Web アクセス**: 不要（ローカルデータ分析のみ）。

---

## あなたの役割

あなたはデータアナリストです。300自治体の浅観測データを集計・分析し、STEP06（深層観測）に進む**50自治体**を選定します。

---

## 絶対ルール

1. **入力データを変更しない**: 入力CSVは読み取り専用。出力は別ファイルに書く
2. **再現可能性**: 全ての分析はPythonスクリプトで実行し、スクリプトファイルを保存する
3. **根拠記録**: 50自治体の選定理由を全件記録する
4. **層化条件の遵守**: layer / population_category / region_block のバランスを維持
5. **手動調整は理由付き**: 自動選定結果を変更する場合は必ず理由を記録

---

## 入力ファイル

| # | ファイル | パス（リポジトリルートから） | 行数 | 列数 |
|---|---------|---------------------------|------|------|
| 1 | 浅観測データ | `.context/municipal-ui-research/data/derived/observations_shallow.csv` | 1,471 | 45 |
| 2 | 名簿（URL付き） | `.context/municipal-ui-research/data/derived/roster_300_with_pages.csv` | 300 | 15 |
| 3 | 深観測スキーマ | `.context/municipal-ui-research/schemas/observation_deep_schema.csv` | — | 60列定義 |

### observations_shallow.csv の構造

**識別列**: `sample_id`, `prefecture`, `municipality_name`, `layer`, `population_category`, `page_type`

**18種boolean列**（UI構造ベクトルの元になる）:
```
has_skip_link, has_header_brand, has_global_nav, has_search,
has_breadcrumb, has_local_nav, has_emergency_notice, has_news_list,
has_pickup, has_carousel, has_hub_cards, has_footer_policies,
has_accessibility_link, has_contact_info, has_contact_form,
has_article_meta, has_toc, has_attachments
```

**バリアント列**: `global_nav_variant`, `search_variant`, `emergency_variant`, `hub_cards_variant`, `contact_form_variant`, `attachments_variant`

**品質スコア列**: `heading_outline_score`（good/fair/poor）, `keyboard_nav_risk`（low/medium/high）, `contrast_risk_hint`（low/medium/high）

**その他**: `cms_fingerprint`, `theme_vendor_hint`, `page_title`, `http_status`, `notes`

### roster_300_with_pages.csv の列

```
sample_id, municipality_code, prefecture, municipality_name, layer,
population_category, region_block, official_site_url,
top_page_url, contact_page_url, service_page_url, hub_page_url,
article_page_url, selection_reason, notes
```

### 層化条件の母集団

| 軸 | 値 | 分布 |
|----|---|------|
| layer | prefecture=47, municipality=253 | — |
| population_category | A=20, B=61, C=105, D=67, unknown(prefecture)=47 | — |
| region_block | hokkaido=18, tohoku=34, kanto=62, chubu=49, kinki=45, chugoku=27, shikoku=20, kyushu_okinawa=45 | — |

---

## 分析手順

### Task 1: データ読み込み＆バリデーション

```python
# Pythonスクリプトとして保存: docs/municipal-ui-research/scripts/step05_analysis.py
import csv
import os

# 1. observations_shallow.csv 読み込み
# 2. roster_300_with_pages.csv 読み込み
# 3. バリデーション:
#    - observations の sample_id が roster に全て存在するか
#    - 45列であるか
#    - boolean列が true/false のみか（不正値があれば報告）
#    - 品質スコア列に不正値がないか（URL文字列等が混入している可能性あり）
```

**既知のデータ品質問題**:
- `heading_outline_score` に URL 文字列が混入している行がある（例: `api5th.smart-lgov.jp`）→ `unknown` として扱う
- `keyboard_nav_risk` に URL/パス文字列が混入 → `unknown` として扱う
- S0225（古座川町）: top の dns_error で boolean 全 false
- S0244（新庄村）: 全5ページ dns_error で boolean 全 false → 選定候補から除外推奨

---

### Task 2: ページタイプ別 部品出現率集計

ページタイプ別に18種booleanの出現率を算出。

**出力**: `data/derived/shallow_stats/prevalence_by_page_type.csv`

```
page_type,component,true_count,total_count,prevalence
top,has_skip_link,215,300,0.717
top,has_carousel,267,300,0.890
contact,has_contact_info,280,294,0.952
...
```

---

### Task 3: バリアント分布集計

各バリアント列の値分布を集計（ページタイプ別）。

**出力**: `data/derived/shallow_stats/variant_distribution.csv`

```
page_type,variant_column,variant_value,count
top,global_nav_variant,horizontal,120
top,global_nav_variant,dropdown,45
...
```

---

### Task 4: CMS分布集計

自治体単位（top ページの `cms_fingerprint`）で集計。類似名を正規化する。

**正規化ルール**:
- `SMART CMS` / `smart_cms` → `SMART_CMS`
- `Joruri` / `Joruri CMS` → `Joruri`
- `KanaboWeb` / `kanaboweb` / `kanaboweb_like` → `KanaboWeb`
- `FI` / `FI.jQuery` → `FI`
- `ReadSpeaker;custom` → `custom`（CMSではなくアドオン）
- `custom;Google_CSE` → `custom`（検索はCMSではない）

**出力**: `data/derived/shallow_stats/cms_distribution.csv`

---

### Task 5: アクセシビリティ成熟度スコア算出

自治体単位で、全ページ（最大5ページ）を横断してアクセシビリティ指標を集約する。

**a11y_maturity_score**（0-5点、以下の合算）:
| 指標 | 条件 | 点数 |
|------|------|------|
| skip_link | いずれかのページで `has_skip_link=true` | 1 |
| accessibility_link | いずれかのページで `has_accessibility_link=true` | 1 |
| heading_quality | top ページの `heading_outline_score=good` | 1 |
| keyboard_risk | top ページの `keyboard_nav_risk=low` | 1 |
| contrast_risk | top ページの `contrast_risk_hint=low` | 1 |

**出力**: `data/derived/shallow_stats/a11y_maturity.csv`

```
sample_id,municipality_name,a11y_maturity_score,has_skip_link_any,has_accessibility_link_any,heading_quality_good,keyboard_risk_low,contrast_risk_low
```

---

### Task 6: 自治体単位 UI構造ベクトル構築

**目的**: 各自治体のUI構造を18次元ベクトルで表現し、クラスタリングの入力とする。

**方法**: 各自治体の **top ページ** の18種boolean値をそのまま0/1ベクトルにする。

> なぜ top ページのみ？
> - 全自治体に存在する唯一のページタイプ（300/300）
> - トップページのUI構成が自治体のサイト設計方針を最も反映する
> - 他ページタイプは欠損あり（service=290, article=292 等）

**例外処理**:
- S0244（新庄村）: dns_error で全false → ベクトルは [0,0,...,0]。クラスタリングには含めるが選定候補からは除外
- S0225（古座川町）: top が dns_error → 同上

**出力**: `data/derived/shallow_stats/ui_structure_vectors.csv`

```
sample_id,municipality_name,layer,population_category,region_block,cms_fingerprint,a11y_maturity_score,has_skip_link,has_header_brand,...,has_attachments,cluster_id
```

---

### Task 7: クラスタリング

**アルゴリズム**: K-means（scikit-learn がなければ手動実装でも可）

**手順**:
1. UI構造ベクトル（18次元 0/1）を入力
2. k = 5〜10 で実行し、シルエットスコアで最適k を選定
3. 各クラスタの特徴（どのコンポーネントが多い/少ないか）を記述
4. 各自治体に `cluster_id` を付与

**scikit-learn が使えない場合の代替**:
- 手動でハミング距離ベースの階層的クラスタリングを実装
- または、主要コンポーネントの組み合わせパターンで分類:
  1. `has_carousel` + `has_hub_cards` + `has_pickup` → 「リッチUI」型
  2. `has_carousel` + `has_hub_cards` → 「標準UI」型
  3. `has_hub_cards` のみ → 「シンプルUI」型
  4. いずれもなし → 「最小UI」型

**出力**: `data/derived/shallow_stats/cluster_summary.csv`

```
cluster_id,size,description,top_components,missing_components
0,85,"リッチUI型: carousel+hub_cards+pickup+news_list","has_carousel,has_hub_cards,has_pickup,has_news_list","has_toc"
```

---

### Task 8: 50自治体選定

**ルール** (`sampling_rules.yaml` 準拠):

| 項目 | 値 |
|------|---|
| 都道府県 | 10件 |
| 市区町村 | 40件 |
| 合計 | **50件** |

#### 8-1. 都道府県 10件の選定

**方針**: 地域ブロック代表 + UI/a11y多様性

1. 8地域ブロックから最低1件ずつ → 8件
2. 残り2件は、クラスタの偏りを補正する目的で追加
3. 各地域内での選定基準:
   - a11y_maturity_score が高い/低い（両端を含める）
   - CMS が異なるもの優先

#### 8-2. 市区町村 40件の選定

**Step A: クラスタ代表選定** (25件)
- 各クラスタから、人口カテゴリ・地域が偏らないように代表を選定
- クラスタサイズに比例配分（最低2件/クラスタ）

**Step B: 層化条件充足** (10件)
- Step A 時点で不足しているカテゴリを補充:
  - population_category: A から最低 3件、B から最低 5件、C から最低 5件、D から最低 3件
  - region_block: 各地域から最低 2件（市区町村のみ）

**Step C: 多様性補完** (5件)
- CMS 分布: 主要CMS（SMART_CMS, WordPress, Joruri, KanaboWeb, FI）から最低1件
- a11y_maturity_score: スコア0-1 の自治体を最低2件含める（低成熟度の実態調査）
- a11y_maturity_score: スコア5 の自治体を最低2件含める（好事例調査）

#### 8-3. 除外条件

以下の自治体は選定候補から除外:
- S0244（新庄村）: 全ページ dns_error
- 他に全ページ取得失敗の自治体があれば同様に除外

#### 8-4. 手動調整

自動選定後、以下の観点で手動調整可能（理由は必ず記録）:
- 「テンプレに効く」多様性（STEP06の深層観測で最も情報が得られる自治体を優先）
- 極端に類似した自治体の片方を差し替え

**出力**: `.context/municipal-ui-research/data/derived/roster_50.csv`

roster_300_with_pages.csv と同じ15列構成。50行。

---

### Task 9: 選定理由レポート作成

**出力**: `.context/municipal-ui-research/data/derived/selection_report_50.md`

#### レポート構成

```markdown
# STEP05 50自治体選定レポート

## 1. 集計サマリー
- 300自治体の全体傾向（UIコンポーネント出現率上位/下位）
- ページタイプ別の特徴的パターン
- CMS分布概要

## 2. クラスタリング結果
- 最適クラスタ数とシルエットスコア
- 各クラスタの特徴・サイズ
- クラスタ × population_category のクロス集計

## 3. 都道府県 10件の選定
- 選定リスト（sample_id, municipality_name, region_block, cluster_id, a11y_score, 選定理由）
- 地域バランスの確認

## 4. 市区町村 40件の選定
- Step A: クラスタ代表（25件）
- Step B: 層化条件充足（10件）
- Step C: 多様性補完（5件）
- 各件の選定理由

## 5. 手動調整履歴
- 差し替え: なし / [あれば理由]

## 6. 層化条件の最終確認
- layer 分布: prefecture=10, municipality=40
- population_category 分布表
- region_block 分布表
- cluster 分布表
- CMS 分布表
- a11y_maturity_score 分布表
```

---

## 出力ファイル一覧

| # | ファイル | パス | 内容 |
|---|---------|------|------|
| 1 | `roster_50.csv` | `.context/municipal-ui-research/data/derived/` | 50自治体名簿（15列） |
| 2 | `selection_report_50.md` | `.context/municipal-ui-research/data/derived/` | 選定理由レポート |
| 3 | `prevalence_by_page_type.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | 部品出現率 |
| 4 | `variant_distribution.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | バリアント分布 |
| 5 | `cms_distribution.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | CMS分布 |
| 6 | `a11y_maturity.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | a11y成熟度スコア |
| 7 | `ui_structure_vectors.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | UI構造ベクトル+cluster_id |
| 8 | `cluster_summary.csv` | `.context/municipal-ui-research/data/derived/shallow_stats/` | クラスタ特徴 |
| 9 | `step05_analysis.py` | `docs/municipal-ui-research/scripts/` | 分析スクリプト（再現用） |

---

## 成功基準

| 指標 | 基準 |
|------|------|
| roster_50.csv 行数 | = 50 |
| 都道府県 | = 10件 |
| 市区町村 | = 40件 |
| population_category 各カテゴリ | >= 1件（A/B/C/D/unknown） |
| region_block 各地域 | >= 1件 |
| クラスタ 各クラスタ | >= 2件 |
| CMS 主要5種 | >= 1件ずつ |
| a11y_maturity_score | 0-1 が 2件以上、5 が 2件以上 |
| selection_report_50.md | 全50件の選定理由が記載 |
| 全出力ファイル | `data/derived/` に配置済み |

---

## STEP06 への接続

STEP06（深層観測）は `roster_50.csv` の50自治体に対して60列の詳細観測を行う。
STEP05での選定が、STEP06以降の**テンプレート設計の多様性と品質**を決定する。

選定で特に重視すべき観点:
1. **CMS多様性**: テンプレートがCMS非依存で設計できるか検証するため
2. **a11y成熟度の幅**: 好事例と改善事例の両方が必要
3. **UI構造の多様性**: テンプレートの柔軟性を検証するため
4. **人口カテゴリの分散**: 大規模市と過疎地域で必要な機能が異なる

---

*このプロンプトは Municipal UI Research STEP05 実行用です。*
*入力データの変更は禁止。出力は全て `data/derived/` に配置してください。*
