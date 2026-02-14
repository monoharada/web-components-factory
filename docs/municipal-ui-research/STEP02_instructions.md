# STEP02 実行手順書: 300自治体ロスターCSV構築

作成日: 2026-02-14
対象出力: `data/derived/roster_300.csv`
前提入力: `schemas/roster_300_template.csv`, `config/sampling_rules.yaml`

---

## 1. 概要

本手順書は、日本全国300自治体（都道府県47 + 市区町村253）のロスターCSVを構築するための詳細な実行手順を定義する。このCSVは後続の浅観測（STEP03-04）の入力データとなるため、正確性と網羅性が最も重要である。

### 1.1 最終成果物

`data/derived/roster_300.csv` -- 以下のカラムを持つ300行のCSV:

| カラム名 | 型 | 必須 | 説明 | STEP02で入力 |
|---------|---|------|------|:---:|
| `sample_id` | string | YES | `S0001`-`S0300` の連番 | YES |
| `municipality_code` | string | YES | 総務省の全国地方公共団体コード（6桁） | YES |
| `prefecture` | string | YES | 都道府県名（例: 北海道、東京都） | YES |
| `municipality_name` | string | YES | 自治体名（例: 札幌市、千代田区） | YES |
| `layer` | string | YES | `prefecture` または `municipality` | YES |
| `population_category` | string | YES | `A` / `B` / `C` / `D` / `unknown` | YES |
| `region_block` | string | YES | 地域ブロック（後述） | YES |
| `official_site_url` | string | YES | 公式サイトのトップURL | YES |
| `top_page_url` | string | - | トップページURL（STEP03で入力） | NO（空欄） |
| `contact_page_url` | string | - | お問い合わせページURL（STEP03で入力） | NO（空欄） |
| `service_page_url` | string | - | サービスページURL（STEP03で入力） | NO（空欄） |
| `hub_page_url` | string | - | ハブページURL（STEP03で入力） | NO（空欄） |
| `article_page_url` | string | - | 記事ページURL（STEP03で入力） | NO（空欄） |
| `selection_reason` | string | YES | 選定理由（カテゴリコード） | YES |
| `notes` | string | - | 参照元・補足情報 | YES |

> **注**: テンプレートCSV (`schemas/roster_300_template.csv`) は15列。STEP02では10列を入力し、5つのページURL列はSTEP03（URL Discovery）で入力する。出力CSVは15列構造を維持し、未入力列は空欄とする。

### 1.2 完了条件

- [ ] CSVが正確に300行（ヘッダー除く）
- [ ] 全行に `official_site_url` が入っている
- [ ] 都道府県47件が全て含まれている
- [ ] 政令指定都市が全数（20市）含まれている
- [ ] 市区町村に重複がない

---

## 2. サンプリング設計

### 2.1 全体構成（300 = 47 + 253）

| 区分 | layer | 件数 | sample_id範囲 |
|------|-------|------|---------------|
| 都道府県 | `prefecture` | 47 | S0001-S0047 |
| 市区町村 | `municipality` | 253 | S0048-S0300 |

### 2.2 人口カテゴリ定義

**判定ルール（排他的・上から順に適用）**:

```
1. 政令指定都市に指定されている → A
2. 中核市に指定されている → B
3. 特別区（東京23区）である → C
4. 人口 >= 20万人（上記以外） → B_extended（Bとして扱う）
5. 人口 >= 5万人 → C
6. 人口 < 5万人 → D
7. 人口不明 → unknown
```

| カテゴリ | コード | 判定条件 | 必須サンプル数 |
|---------|--------|---------|---------------|
| 政令指定都市 | `A` | 政令指定都市指定（判定1） | **全数（20）** |
| 中核市・大規模市 | `B` | 中核市指定 or 人口20万以上の一般市（判定2,4） | **40-55** |
| 一般市・特別区 | `C` | 特別区 or 人口5万-20万未満（判定3,5） | **100-120** |
| 町村・小規模市 | `D` | 人口5万未満（判定6） | **60-80** |

> **修正点（v2）**: v1では20万超の非中核市（町田市、藤沢市等）と人口20万超の特別区（世田谷区等）がどのカテゴリにも該当しなかった。v2では判定を上から順に適用する排他的ルールとし、特別区→C、20万超の一般市→Bに明示的に分類。
>
> **カテゴリ合計の調整**: A(20) + B(40-55) + C(100-120) + D(60-80) = 220-275。目標253に対し、BとDの間で調整する。各地域ブロックの目標数を優先し、カテゴリ配分は目安とする。

### 2.3 地域ブロック定義と目標配分

| ブロック | `region_block` | 都道府県数 | 市区町村目標数 |
|---------|---------------|-----------|---------------|
| 北海道 | `hokkaido` | 1 | 15-20 |
| 東北 | `tohoku` | 6 | 25-30 |
| 関東 | `kanto` | 7 | 50-60 |
| 中部 | `chubu` | 9 | 35-45 |
| 近畿 | `kinki` | 7 | 35-40 |
| 中国 | `chugoku` | 5 | 20-25 |
| 四国 | `shikoku` | 4 | 15-20 |
| 九州沖縄 | `kyushu_okinawa` | 8 | 30-40 |

### 2.4 選定理由コード

| コード | 意味 |
|--------|------|
| `designated_city` | 政令指定都市（全数） |
| `core_city` | 中核市（代表） |
| `prefecture_capital` | 県庁所在地 |
| `population_top` | 人口上位都市 |
| `rural_representative` | 過疎・中山間代表 |
| `island_municipality` | 離島自治体 |
| `ui_diversity` | UI多様性確保 |
| `regional_balance` | 地域バランス調整 |
| `special_ward` | 特別区 |
| `prefecture_site` | 都道府県サイト |

---

## 3. 並列実行戦略（4リサーチャー体制）

| リサーチャー | 担当範囲 | 市区町村目標数 |
|-------------|---------|--------------|
| **Researcher A** | 北海道 + 東北 + 関東 | 90-110 |
| **Researcher B** | 中部 + 近畿 | 70-85 |
| **Researcher C** | 中国 + 四国 + 九州沖縄 | 65-85 |
| **Researcher D** | 47都道府県（prefectureレイヤー） | 47（都道府県のみ） |

### 出力ファイル
- `data/derived/partial/researcher_a_hokkaido_tohoku_kanto.csv`
- `data/derived/partial/researcher_b_chubu_kinki.csv`
- `data/derived/partial/researcher_c_chugoku_shikoku_kyushu.csv`
- `data/derived/partial/researcher_d_prefectures.csv`

---

## 4. データソース

1. **総務省 全国地方公共団体コード**: https://www.soumu.go.jp/denshijiti/code.html
2. **各都道府県公式サイト**: 市町村一覧ページ
3. **政令指定都市一覧（総務省）**: https://www.soumu.go.jp/main_sosiki/jichi_gyousei/bunken/shitei_toshi-ichiran.html
4. **中核市市長会**: https://www.chuukakushi.gr.jp/

---

## 5. 政令指定都市20市一覧（必須全数）

| # | 市名 | 都道府県 | municipality_code | region_block |
|---|------|---------|------------------|-------------|
| 1 | 札幌市 | 北海道 | 011002 | hokkaido |
| 2 | 仙台市 | 宮城県 | 041009 | tohoku |
| 3 | さいたま市 | 埼玉県 | 111007 | kanto |
| 4 | 千葉市 | 千葉県 | 121002 | kanto |
| 5 | 横浜市 | 神奈川県 | 141003 | kanto |
| 6 | 川崎市 | 神奈川県 | 141305 | kanto |
| 7 | 相模原市 | 神奈川県 | 141500 | kanto |
| 8 | 新潟市 | 新潟県 | 151009 | chubu |
| 9 | 静岡市 | 静岡県 | 221007 | chubu |
| 10 | 浜松市 | 静岡県 | 221309 | chubu |
| 11 | 名古屋市 | 愛知県 | 231002 | chubu |
| 12 | 京都市 | 京都府 | 261009 | kinki |
| 13 | 大阪市 | 大阪府 | 271004 | kinki |
| 14 | 堺市 | 大阪府 | 271403 | kinki |
| 15 | 神戸市 | 兵庫県 | 281000 | kinki |
| 16 | 岡山市 | 岡山県 | 331007 | chugoku |
| 17 | 広島市 | 広島県 | 341002 | chugoku |
| 18 | 北九州市 | 福岡県 | 401005 | kyushu_okinawa |
| 19 | 福岡市 | 福岡県 | 401307 | kyushu_okinawa |
| 20 | 熊本市 | 熊本県 | 431001 | kyushu_okinawa |

---

## 6. 各リサーチャー共通手順

### Step 1: 政令指定都市の登録（カテゴリA）
担当地域の政令指定都市を全てCSVに登録。

### Step 2: 県庁所在地の登録
政令指定都市でない県庁所在地を登録。

### Step 3: 中核市の選定（カテゴリB）
地域内で人口規模・地理的位置を分散させて選定。

### Step 4: 一般市・特別区の選定（カテゴリC）
各都道府県から最低1つ、人口規模の幅を持たせて選定。

### Step 5: 町村・小規模市の選定（カテゴリD）
過疎地域・離島・中山間地域の代表を含める。

### Step 6: 公式サイトURLの確認
全ての選定自治体のURLにアクセスし、有効性を確認。

---

## 7. マージ手順

1. 4つの部分CSVを結合（D→A→B→C順）
2. `sample_id` を S0001-S0300 で振り直し
3. 品質チェック実施（300行、重複なし、URL有効）

---

## 8. 表記統一ルール

| 項目 | ルール | 正しい例 |
|------|--------|---------|
| 都道府県名 | 「都」「道」「府」「県」を付ける | 東京都、北海道 |
| 市区町村名 | 「市」「区」「町」「村」を付ける | 札幌市、千代田区 |
| URL | 末尾スラッシュ統一 | https://www.city.sapporo.jp/ |
| 自治体コード | 6桁ゼロ埋め | 011002 |
| region_block | 小文字英字+アンダースコア | kyushu_okinawa |

---

## 9. region_block と都道府県の対応表

```
hokkaido:        北海道
tohoku:          青森県, 岩手県, 宮城県, 秋田県, 山形県, 福島県
kanto:           茨城県, 栃木県, 群馬県, 埼玉県, 千葉県, 東京都, 神奈川県
chubu:           新潟県, 富山県, 石川県, 福井県, 山梨県, 長野県, 岐阜県, 静岡県, 愛知県
kinki:           三重県, 滋賀県, 京都府, 大阪府, 兵庫県, 奈良県, 和歌山県
chugoku:         鳥取県, 島根県, 岡山県, 広島県, 山口県
shikoku:         徳島県, 香川県, 愛媛県, 高知県
kyushu_okinawa:  福岡県, 佐賀県, 長崎県, 熊本県, 大分県, 宮崎県, 鹿児島県, 沖縄県
```
