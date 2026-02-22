# STEP03+04 完了レビュー依頼

> **用途**: 別セッションにコピーし、STEP03（URL Discovery）+STEP04（Shallow Observation）の成果物を品質レビューする。
> **前提**: レビュー対象のファイルはすべてリポジトリ内に存在する。読み取り専用で分析し、修正は行わない。

---

## あなたの役割

あなたはデータ品質レビュアーです。
日本の300自治体公式ウェブサイトに対して実施した **URL Discovery（STEP03）** と **UI浅観測（STEP04）** の成果物を、STEP05（集計+50抽出）への移行可否を判断するためにレビューします。

---

## レビュー対象ファイル

| # | ファイル | 説明 |
|---|---------|------|
| 1 | `.context/municipal-ui-research/data/derived/observations_shallow.csv` | **主成果物**: 300自治体×最大5ページの浅観測データ（1,471行 × 45列） |
| 2 | `.context/municipal-ui-research/data/derived/roster_300_with_pages.csv` | **主成果物**: 300自治体の発見済みURL一覧（300行 × 15列） |
| 3 | `docs/municipal-ui-research/data/batches/batch_manifest.csv` | バッチ進捗管理台帳（41バッチ） |
| 4 | `.context/municipal-ui-research/schemas/observation_shallow_schema.csv` | 45列スキーマ定義 |
| 5 | `.context/municipal-ui-research/config/sampling_rules.yaml` | STEP05 サンプリングルール |
| 6 | `docs/municipal-ui-research/STEP03_04_combined_execution_prompt.md` | 実行プロンプト（検出ルール定義） |

---

## レビュー手順

### Phase 1: 構造検証（自動化可能）

以下のPythonスクリプトを実行し、結果をレポートに含めてください。

```python
import csv
from collections import Counter

OBSFILE = ".context/municipal-ui-research/data/derived/observations_shallow.csv"
URLFILE = ".context/municipal-ui-research/data/derived/roster_300_with_pages.csv"

with open(OBSFILE, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    obs_header = next(reader)
    obs_rows = list(reader)

with open(URLFILE, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    url_header = next(reader)
    url_rows = list(reader)

# --- Check 1: Column counts ---
print(f"[CHECK-1] observations columns: {len(obs_header)} (expected: 45)")
print(f"[CHECK-1] roster columns: {len(url_header)} (expected: 15)")

# --- Check 2: Row counts ---
print(f"[CHECK-2] observations rows: {len(obs_rows)} (expected: 1471)")
print(f"[CHECK-2] roster rows: {len(url_rows)} (expected: 300)")

# --- Check 3: Column width consistency ---
bad = [i+2 for i, r in enumerate(obs_rows) if len(r) != 45]
print(f"[CHECK-3] observations width errors: {len(bad)} rows")
bad_u = [i+2 for i, r in enumerate(url_rows) if len(r) != 15]
print(f"[CHECK-3] roster width errors: {len(bad_u)} rows")

# --- Check 4: Boolean validation ---
BOOL_COLS = [14,15,16,18,20,21,22,24,25,26,27,29,30,32,33,35,36,37]
bool_errs = [(i+2, obs_header[c], r[c], r[0]) for i, r in enumerate(obs_rows) for c in BOOL_COLS if r[c].strip() not in ('true','false')]
print(f"[CHECK-4] boolean errors: {len(bool_errs)}")

# --- Check 5: sample_id+page_type uniqueness ---
combos = Counter(f"{r[0]}_{r[5]}" for r in obs_rows)
dupes = {k: v for k, v in combos.items() if v > 1}
print(f"[CHECK-5] duplicate sample_id+page_type: {len(dupes)}")

# --- Check 6: Cross-reference ---
obs_ids = set(r[0] for r in obs_rows)
url_ids = set(r[0] for r in url_rows)
print(f"[CHECK-6] unique sample_ids in observations: {len(obs_ids)} (expected: 300)")
print(f"[CHECK-6] unique sample_ids in roster: {len(url_ids)} (expected: 300)")
print(f"[CHECK-6] in obs but not roster: {sorted(obs_ids - url_ids)}")
print(f"[CHECK-6] in roster but not obs: {sorted(url_ids - obs_ids)}")

# --- Check 7: http_status distribution ---
hs = Counter(r[8] for r in obs_rows)
print(f"[CHECK-7] http_status: {dict(hs)}")

# --- Check 8: page_type distribution ---
pt = Counter(r[5] for r in obs_rows)
print(f"[CHECK-8] page_type: {dict(pt)}")

# --- Check 9: layer/population coverage ---
layers = Counter(r[3] for r in obs_rows)
pops = Counter(r[4] for r in obs_rows)
print(f"[CHECK-9] layers: {dict(layers)}")
print(f"[CHECK-9] populations: {dict(pops)}")
```

### Phase 2: データ品質レビュー（手動分析）

#### 2-A: ページ取得の網羅性

以下を確認してください：

1. **全300自治体に `top` ページの行が存在するか**（top = 300行）
2. **欠損ページタイプの妥当性**：top 以外（contact/service/hub/article）の欠損について、`notes` にNOT_FOUNDの理由が記載されているか
3. **HTTP取得失敗（200以外）** の行について：
   - `dns_error`/`404`/`403`/`0` の各行に適切な `notes` があるか
   - boolean 列が全て `false` になっているか（取得失敗なので検出不可能）
   - 失敗行数が全体の1%未満であるか

#### 2-B: Boolean 検出の妥当性

ランダムに **10自治体（50行前後）** を抽出し、以下の観点で真偽を検証してください：

```python
import random
sample_ids = list(set(r[0] for r in obs_rows))
random.seed(42)
review_ids = sorted(random.sample(sample_ids, 10))
print("Review sample_ids:", review_ids)
review_rows = [r for r in obs_rows if r[0] in review_ids]
```

**検証ポイント：**

| # | 検証項目 | 判定基準 |
|---|---------|---------|
| 1 | `has_skip_link` | `top` ページでtrue→そのURLにWebFetchし `<a href="#main">` 等のスキップリンクが存在するか |
| 2 | `has_global_nav` | `top` ページでfalse→本当にグローバルナビがないか（D-catの極小自治体以外でfalseは要注意） |
| 3 | `has_emergency_notice` | trueの場合→`emergency_variant`と`notes`に具体的な緊急内容（災害名/感染症名）が記載されているか。常設「防災」リンクとの誤検知ではないか |
| 4 | `has_hub_cards` | `top`/`hub` 以外のページでtrue→グローバルナビのアイコン群を誤検出していないか |
| 5 | `has_article_meta` | `top` ページでtrue→新着一覧の日付を誤検出していないか。article ページでfalse→公開日/更新日が本当にないか |
| 6 | `has_accessibility_link` | true の場合→`accessibility_url` にURLが記録されているか。ReadSpeaker/文字サイズ変更を誤検出していないか |
| 7 | `has_contact_form` | true の場合→`contact_form_variant` が記録されているか |
| 8 | `heading_outline_score` | HTTP 200 の行で空欄になっていないか |
| 9 | `contrast_risk_hint` | HTTP 200 の行で空欄になっていないか |

#### 2-C: URL品質

roster_300_with_pages.csv から以下を検証：

1. **ドメイン一致**: 各自治体の `top_page_url` のドメインと他のページURL（contact/service/hub/article）のドメインが一致するか
2. **URL重複**: 同一自治体で `hub_page_url` と `service_page_url` が同一URLになっていないか（ルール違反）
3. **空URL**: `contact_page_url` / `service_page_url` / `hub_page_url` / `article_page_url` が空の行について、observation CSV の `notes` に NOT_FOUND 理由が記載されているか

```python
# ドメイン一致チェック
from urllib.parse import urlparse
domain_mismatches = []
for r in url_rows:
    top_domain = urlparse(r[8]).netloc if r[8] else ''
    for col_idx, col_name in [(9,'contact'), (10,'service'), (11,'hub'), (12,'article')]:
        url = r[col_idx]
        if url:
            domain = urlparse(url).netloc
            if domain and top_domain and domain != top_domain:
                domain_mismatches.append((r[0], col_name, top_domain, domain))
print(f"Domain mismatches: {len(domain_mismatches)}")
for dm in domain_mismatches[:10]:
    print(f"  {dm}")
```

#### 2-D: CMS・テーマの一貫性

同一自治体の5ページで `cms_fingerprint` / `theme_vendor_hint` が一貫しているか確認：

```python
from collections import defaultdict
cms_per_id = defaultdict(set)
for r in obs_rows:
    if r[12].strip():
        cms_per_id[r[0]].add(r[12].strip())
inconsistent = {k: v for k, v in cms_per_id.items() if len(v) > 1}
print(f"CMS inconsistencies: {len(inconsistent)} municipalities")
for k, v in list(inconsistent.items())[:5]:
    print(f"  {k}: {v}")
```

### Phase 3: 統計レビュー

#### 3-A: Boolean 出現率の妥当性

以下の出現率が常識的な範囲にあるか確認し、異常値にフラグを立ててください：

| コンポーネント | 出現率 | 期待される範囲 | 判定 |
|--------------|--------|--------------|------|
| has_global_nav | 99.4% | 95-100% | |
| has_header_brand | 95.2% | 90-100% | |
| has_footer_policies | 92.8% | 85-100% | |
| has_search | 89.1% | 80-95% | |
| has_breadcrumb | 75.6% | 60-85% | |
| has_skip_link | 72.5% | 50-80% | |
| has_contact_info | 69.7% | 50-80% | |
| has_accessibility_link | 64.6% | 40-70% | |
| has_contact_form | 47.3% | 20-50% | |
| has_local_nav | 42.0% | 30-60% | |
| has_article_meta | 37.7% | 20-50% | |
| has_news_list | 36.1% | 25-50% | |
| has_hub_cards | 29.2% | 15-40% | |
| has_carousel | 28.2% | 15-40% | |
| has_attachments | 24.3% | 15-35% | |
| has_pickup | 15.6% | 5-25% | |
| has_emergency_notice | 12.3% | 5-20% | |
| has_toc | 4.2% | 2-10% | |

#### 3-B: ページタイプ別の出現パターン

以下が合理的か確認してください：

- `has_carousel`: `top` ページでの出現率 >> 他のページタイプ（トップページにスライダーが多い）
- `has_breadcrumb`: `top` ページでの出現率 << 他のページタイプ（トップページにパンくずは通常不要）
- `has_hub_cards`: `top`/`hub` での出現率 >> `service`/`article`（カテゴリカードはトップ/ハブ固有）
- `has_article_meta`: `article` での出現率 >> 他のページタイプ
- `has_contact_form`: `contact` での出現率 >> 他のページタイプ
- `has_news_list`: `top` での出現率 >> `service`/`article`

```python
# ページタイプ × Boolean クロス集計
for bc_idx, bc_name in [(26,'has_carousel'), (20,'has_breadcrumb'), (27,'has_hub_cards'),
                         (35,'has_article_meta'), (33,'has_contact_form'), (24,'has_news_list')]:
    print(f"\n--- {bc_name} by page_type ---")
    for pt in ['top','contact','service','hub','article']:
        pt_rows = [r for r in obs_rows if r[5] == pt]
        true_count = sum(1 for r in pt_rows if r[bc_idx] == 'true')
        rate = 100 * true_count / len(pt_rows) if pt_rows else 0
        print(f"  {pt}: {true_count}/{len(pt_rows)} ({rate:.1f}%)")
```

### Phase 4: STEP05 移行準備チェック

| # | チェック項目 | 確認方法 |
|---|-----------|---------|
| 1 | `observations_shallow.csv` が `.context/municipal-ui-research/data/derived/` に存在 | ファイル存在確認 |
| 2 | `roster_300_with_pages.csv` が同パスに存在 | ファイル存在確認 |
| 3 | `config/sampling_rules.yaml` が存在 | ファイル存在確認 |
| 4 | 全300自治体の `sample_id` が両ファイルで一致 | Cross-validation（Phase 1で実施済み） |
| 5 | boolean列にtrue/false以外の値がない | Boolean validation（Phase 1で実施済み） |
| 6 | `batch_manifest.csv` の全41バッチが `complete` | manifest確認 |

---

## 出力フォーマット

### レビューレポート

以下の形式でレポートを出力してください：

```markdown
# STEP03+04 品質レビューレポート

## 実行日時
YYYY-MM-DD HH:MM

## 判定
**GO** / **CONDITIONAL GO** / **NO GO**

## Phase 1: 構造検証
| Check | 結果 | 状態 |
|-------|------|------|
| CHECK-1 列数 | ... | PASS/FAIL |
| CHECK-2 行数 | ... | PASS/FAIL |
| ... | ... | ... |

## Phase 2: データ品質

### 2-A ページ取得の網羅性
- 全体取得成功率: XX.X%
- 欠損ページの妥当性: [コメント]

### 2-B Boolean検出の妥当性
- 検証した10自治体: [ID一覧]
- 誤検出（False Positive）の疑い: X件
  - [詳細]
- 検出漏れ（False Negative）の疑い: X件
  - [詳細]
- Precision推定: XX%
- Recall推定: XX%

### 2-C URL品質
- ドメイン不一致: X件
- hub/service URL重複: X件
- NOT_FOUND理由未記載: X件

### 2-D CMS一貫性
- 不一致自治体数: X件
- [詳細]

## Phase 3: 統計レビュー

### 3-A 出現率判定
| コンポーネント | 出現率 | 期待範囲 | 判定 |
|...|...|...|...|

### 3-B ページタイプ別パターン
- [異常パターンがあれば記載]

## Phase 4: STEP05移行チェック
| # | 項目 | 状態 |
|---|------|------|
| 1 | observations_shallow.csv | PASS/FAIL |
| ... | ... | ... |

## 検出された課題

### Blocker（GO判定に必須の修正）
- [なし / 具体的な問題]

### Warning（STEP05で考慮すべき事項）
- [リスト]

### Advisory（将来のSTEP06で留意）
- [リスト]
```

---

## 合格基準

| 指標 | 閾値 | 備考 |
|------|------|------|
| 構造検証（Phase 1） | 全項目 PASS | Blocker |
| ページ取得成功率 | >= 95% | HTTP 200 の行 / 全行 |
| Boolean Precision | >= 85% | サンプル検証による推定 |
| Boolean Recall | >= 75% | サンプル検証による推定 |
| URL ドメイン一致率 | 100% | 例外は notes に理由があること |
| hub/service 重複率 | 0% | 同一URLは不可 |
| STEP05 入力ファイル | 全3ファイル存在 | Blocker |

---

## 注意事項

- レビュー中にWebFetchで自治体サイトにアクセスする場合は、レート制限を守り、過度なアクセスを避けてください
- サンプル検証（2-B）は最低10自治体・50行を対象としてください
- 判定に迷う場合は `CONDITIONAL GO` とし、条件を明記してください
- `dns_error` の自治体はサイト自体がアクセス不能であり、データ品質の問題ではありません
