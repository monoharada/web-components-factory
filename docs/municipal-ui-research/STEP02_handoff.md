# STEP02 ハンドオフ文書: 300自治体ロスターCSV構築

作成日: 2026-02-14
ワークスペース: `municipal-roster`
ブランチ: `monoharada/municipal-roster-300`

---

## 目次

1. [プロジェクトコンテキスト](#1-プロジェクトコンテキスト)
2. [STEP02の位置付けと完了条件](#2-step02の位置付けと完了条件)
3. [CSV構造定義（15列）](#3-csv構造定義15列)
4. [サンプリング設計](#4-サンプリング設計)
5. [4リサーチャー並列実行戦略](#5-4リサーチャー並列実行戦略)
6. [Researcher D: 47都道府県 詳細手順](#6-researcher-d-47都道府県-詳細手順)
7. [Researcher A: 北海道+東北+関東 詳細手順](#7-researcher-a-北海道東北関東-詳細手順)
8. [Researcher B: 中部+近畿 詳細手順](#8-researcher-b-中部近畿-詳細手順)
9. [Researcher C: 中国+四国+九州沖縄 詳細手順](#9-researcher-c-中国四国九州沖縄-詳細手順)
10. [政令指定都市20市一覧（必須全数）](#10-政令指定都市20市一覧必須全数)
11. [中核市一覧（参照用）](#11-中核市一覧参照用)
12. [データソースと参照先](#12-データソースと参照先)
13. [マージ手順と品質チェック](#13-マージ手順と品質チェック)
14. [表記統一ルール](#14-表記統一ルール)
15. [Conductorワークスペース設定](#15-conductorワークスペース設定)
16. [トラブルシューティング](#16-トラブルシューティング)

---

## 1. プロジェクトコンテキスト

### 1.1 プロジェクト全体の目的

本プロジェクト「Municipal UI研究」は、日本の自治体ウェブサイトのUI構造を体系的に調査・分析し、Web Components Factory（WCF）のテンプレート実装に還元することを目的とする。

**全体フロー:**
```
300自治体の浅観測 → 50自治体の深掘り調査 → UIパターン抽出・モデル化 → WCFテンプレート実装
```

**具体的なゴール:**
- 300自治体のウェブサイトからUI部品の有無・バリアント・情報構造を機械的に記録する
- ページタイプ別の必須部品セット・頻出バリアントの型（テンプレ）を抽象化する
- 既存のデザインシステム（プリミティブDSコンポーネント・グローバルトークン）に則ったテンプレートを実装する
- JIS/WCAGアクセシビリティ基準に適合する設計チェックリストを整備する

### 1.2 全体ステップ構成

| STEP | 名称 | 概要 | 状態 |
|------|------|------|------|
| 01 | Repo Discovery | WCFリポジトリの構造解析 | 完了 |
| **02** | **Build Roster 300** | **300自治体名簿CSV構築** | **本文書の対象** |
| 03 | URL Discovery | 各自治体の5ページURL特定 | STEP02完了後に実行 |
| 04 | Shallow Probe | 300自治体の浅観測 | STEP03完了後に実行 |
| 05 | Aggregate & Select 50 | 集計+50自治体抽出 | STEP04完了後に実行 |
| 06 | Deep Probe | 50自治体の深掘り調査 | STEP05完了後に実行 |
| 07 | Pattern Modeling | 型モデル構築 | STEP06完了後に実行 |
| 08 | Template Spec | テンプレート仕様策定 | STEP07完了後に実行 |
| 09 | Implement Templates | テンプレート実装 | STEP08完了後に実行 |
| 10 | A11y QA | アクセシビリティQA | STEP09完了後に実行 |

---

## 2. STEP02の位置付けと完了条件

### 2.1 位置付け

STEP02は Phase 1 の最重要タスクである。ここで構築する300自治体のロスターCSVは、後続の全ステップ（STEP03〜STEP10）の入力データとなるため、正確性・網羅性・一貫性が最も重要である。

**依存関係:**
- STEP03（URL Discovery）: ロスターCSVの `official_site_url` を起点に各ページURLを発見する
- STEP04（Shallow Probe）: ロスターCSVの300行全てに対して浅観測を実施する
- STEP05以降: 全てSTEP02のデータに間接的に依存する

ロスターCSVに不備がある場合、後続全ステップのやり直しが必要になるため、品質チェックを厳格に行うこと。

### 2.2 完了条件（全て満たすこと）

- [ ] CSVが正確に **300行**（ヘッダー除く）
- [ ] **全行**に `official_site_url` が入っている（空欄不可）
- [ ] 都道府県 **47件が全て**含まれている（`layer=prefecture`の行が47件）
- [ ] 政令指定都市が**全数（20市）**含まれている（`population_category=A`の行が20件）
- [ ] 市区町村に**重複がない**（`municipality_code`の一意性）
- [ ] `sample_id` が `S0001`〜`S0300` の連番で振られている
- [ ] `layer` が `prefecture` の行が47件、`municipality` の行が253件
- [ ] 全ての `municipality_code` が6桁ゼロ埋めフォーマット
- [ ] 全ての `official_site_url` が `https://` で始まり末尾スラッシュで統一
- [ ] `population_category` が `A`/`B`/`C`/`D`/`unknown` のいずれか
- [ ] `region_block` が定義済みの8ブロックのいずれか

---

## 3. CSV構造定義（15列）

### 3.1 ヘッダー行

```csv
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,notes
```

### 3.2 列定義

#### STEP02で入力する列（10列）

| # | 列名 | 型 | 必須 | 説明 | 例 |
|---|------|---|------|------|---|
| 1 | `sample_id` | string | YES | S0001-S0300の連番。4桁ゼロ埋め | `S0001` |
| 2 | `municipality_code` | string | YES | 総務省の全国地方公共団体コード。6桁ゼロ埋め | `011002` |
| 3 | `prefecture` | string | YES | 都道府県名。「都」「道」「府」「県」付き | `北海道` |
| 4 | `municipality_name` | string | YES | 自治体名。都道府県の場合は都道府県名と同じ。市区町村の場合は「市」「区」「町」「村」付き | `札幌市` |
| 5 | `layer` | enum | YES | `prefecture` または `municipality` | `municipality` |
| 6 | `population_category` | enum | YES | `A`/`B`/`C`/`D`/`unknown` | `A` |
| 7 | `region_block` | enum | YES | 8ブロックのいずれか（後述） | `hokkaido` |
| 8 | `official_site_url` | string | YES | 公式サイトURL。https://始まり、末尾スラッシュ | `https://www.city.sapporo.jp/` |
| 14 | `selection_reason` | string | YES | 選定理由コード（後述） | `designated_city` |
| 15 | `notes` | string | - | 参照元URL・補足情報 | `総務省一覧より` |

#### STEP03で入力する列（5列、STEP02では空欄）

| # | 列名 | 説明 | STEP02での値 |
|---|------|------|------------|
| 9 | `top_page_url` | トップページURL | 空欄 |
| 10 | `contact_page_url` | お問い合わせページURL | 空欄 |
| 11 | `service_page_url` | サービス・手続きページURL | 空欄 |
| 12 | `hub_page_url` | くらし・分野別ハブページURL | 空欄 |
| 13 | `article_page_url` | 記事・お知らせ個別ページURL | 空欄 |

### 3.3 CSVサンプル行

```csv
S0001,010006,北海道,北海道,prefecture,unknown,hokkaido,https://www.pref.hokkaido.lg.jp/,,,,,,prefecture_site,総務省コード一覧より
S0048,011002,北海道,札幌市,municipality,A,hokkaido,https://www.city.sapporo.jp/,,,,,,designated_city,政令指定都市
S0070,131016,東京都,千代田区,municipality,C,kanto,https://www.city.chiyoda.lg.jp/,,,,,,special_ward,東京23区
```

> **注意**: CSVの列順は上記ヘッダーに厳密に従うこと。列の順序を変えないこと。

---

## 4. サンプリング設計

### 4.1 全体構成

| 区分 | `layer` | 件数 | `sample_id`範囲 | 備考 |
|------|---------|------|-----------------|------|
| 都道府県 | `prefecture` | 47 | S0001-S0047 | 全数 |
| 市区町村 | `municipality` | 253 | S0048-S0300 | サンプリング |
| **合計** | | **300** | S0001-S0300 | |

### 4.2 人口カテゴリ定義

**判定ルール（排他的・上から順に適用）:**

```
判定1: 政令指定都市に指定されている → A
判定2: 中核市に指定されている → B
判定3: 特別区（東京23区）である → C
判定4: 人口 >= 20万人（上記いずれにも該当しない） → B（B_extended、Bとして扱う）
判定5: 人口 >= 5万人（上記いずれにも該当しない） → C
判定6: 人口 < 5万人 → D
判定7: 人口不明 → unknown
```

> **重要**: 判定は上から順に適用し、最初に該当したカテゴリに分類する。例えば、中核市に指定されている自治体は人口に関わらずBとなる。特別区は人口に関わらずCとなる。

**カテゴリ別の目標数（市区町村253件中）:**

| カテゴリ | コード | 判定条件 | 目標数 | 補足 |
|---------|--------|---------|--------|------|
| 政令指定都市 | `A` | 判定1 | **20（全数）** | 必須 |
| 中核市・大規模市 | `B` | 判定2,4 | **40-55** | 中核市+人口20万超の一般市 |
| 一般市・特別区 | `C` | 判定3,5 | **100-120** | 特別区+人口5万-20万未満 |
| 町村・小規模市 | `D` | 判定6 | **60-80** | 人口5万未満 |

> **カテゴリ合計の調整**: A(20) + B(40-55) + C(100-120) + D(60-80) = 220-275。目標253に対し、BとDの間で調整する。各地域ブロックの目標数を優先し、カテゴリ配分は目安とする。

### 4.3 地域ブロック定義と目標配分

| ブロック | `region_block` | 都道府県数 | 市区町村目標数 | 合計目標（県+市区町村） |
|---------|---------------|-----------|--------------|---------------------|
| 北海道 | `hokkaido` | 1 | 15-20 | 16-21 |
| 東北 | `tohoku` | 6 | 25-30 | 31-36 |
| 関東 | `kanto` | 7 | 50-60 | 57-67 |
| 中部 | `chubu` | 9 | 35-45 | 44-54 |
| 近畿 | `kinki` | 7 | 35-40 | 42-47 |
| 中国 | `chugoku` | 5 | 20-25 | 25-30 |
| 四国 | `shikoku` | 4 | 15-20 | 19-24 |
| 九州沖縄 | `kyushu_okinawa` | 8 | 30-40 | 38-48 |
| **合計** | | **47** | **225-280** | **272-327** |

> **調整指針**: 市区町村合計が253になるよう、各ブロックの目標範囲内で調整する。関東は人口密集地帯のため多め、四国・中国は少なめが自然。

### 4.4 都道府県→地域ブロック対応表

```
hokkaido:
  - 北海道

tohoku:
  - 青森県
  - 岩手県
  - 宮城県
  - 秋田県
  - 山形県
  - 福島県

kanto:
  - 茨城県
  - 栃木県
  - 群馬県
  - 埼玉県
  - 千葉県
  - 東京都
  - 神奈川県

chubu:
  - 新潟県
  - 富山県
  - 石川県
  - 福井県
  - 山梨県
  - 長野県
  - 岐阜県
  - 静岡県
  - 愛知県

kinki:
  - 三重県
  - 滋賀県
  - 京都府
  - 大阪府
  - 兵庫県
  - 奈良県
  - 和歌山県

chugoku:
  - 鳥取県
  - 島根県
  - 岡山県
  - 広島県
  - 山口県

shikoku:
  - 徳島県
  - 香川県
  - 愛媛県
  - 高知県

kyushu_okinawa:
  - 福岡県
  - 佐賀県
  - 長崎県
  - 熊本県
  - 大分県
  - 宮崎県
  - 鹿児島県
  - 沖縄県
```

### 4.5 選定理由コード

| コード | 意味 | 使い分け |
|--------|------|---------|
| `designated_city` | 政令指定都市（全数） | カテゴリA（20市）に必ず付与 |
| `core_city` | 中核市（代表） | 中核市制度に基づく指定都市 |
| `prefecture_capital` | 県庁所在地 | 政令指定都市・中核市と重複する場合は上位コードを優先 |
| `population_top` | 人口上位都市 | 政令指定都市・中核市に含まれない大規模市 |
| `rural_representative` | 過疎・中山間代表 | 過疎地域指定の市町村、山間部の代表 |
| `island_municipality` | 離島自治体 | 離島振興法対象の市町村 |
| `ui_diversity` | UI多様性確保 | CMS・デザインパターンの多様性を確保するための選定 |
| `regional_balance` | 地域バランス調整 | ブロック内の目標数を満たすための追加選定 |
| `special_ward` | 特別区 | 東京23区の特別区 |
| `prefecture_site` | 都道府県サイト | 47都道府県（`layer=prefecture`）に必ず付与 |

> **選定理由の優先順位**: 複数該当する場合、`designated_city` > `core_city` > `prefecture_capital` > `special_ward` > `population_top` > 他の順で最も優先度の高いものを1つ記載する。

### 4.6 都道府県レイヤーのpopulation_category

都道府県（`layer=prefecture`）については、`population_category` は `unknown` を設定する。都道府県は全数（47件）を対象とするため、人口カテゴリによるサンプリング選定が不要であるため。

---

## 5. 4リサーチャー並列実行戦略

### 5.1 担当割り当て

| リサーチャー | エージェント種別 | 担当範囲 | 市区町村目標数 | 出力ファイル |
|-------------|----------------|---------|--------------|------------|
| **Researcher D** | `comprehensive-researcher` | 47都道府県（prefectureレイヤー） | 0（都道府県のみ47件） | `partial/researcher_d_prefectures.csv` |
| **Researcher A** | `comprehensive-researcher` | 北海道 + 東北 + 関東の市区町村 | 90-110 | `partial/researcher_a_hokkaido_tohoku_kanto.csv` |
| **Researcher B** | `comprehensive-researcher` | 中部 + 近畿の市区町村 | 70-85 | `partial/researcher_b_chubu_kinki.csv` |
| **Researcher C** | `comprehensive-researcher` | 中国 + 四国 + 九州沖縄の市区町村 | 65-85 | `partial/researcher_c_chugoku_shikoku_kyushu.csv` |

> **実行順序**: Researcher Dを最初に開始（最もシンプル）。Researcher A/B/Cは並列で同時開始可能。

### 5.2 出力ファイル配置

```
.context/municipal-ui-research/data/derived/
  partial/
    researcher_d_prefectures.csv          # 47行
    researcher_a_hokkaido_tohoku_kanto.csv # 90-110行
    researcher_b_chubu_kinki.csv           # 70-85行
    researcher_c_chugoku_shikoku_kyushu.csv # 65-85行
  roster_300.csv                           # 最終統合ファイル（300行）
```

### 5.3 各リサーチャー共通の作業手順

以下の手順を**この順序で**実施する。順序を守ることで、優先度の高い自治体（政令指定都市、県庁所在地）が確実に含まれる。

#### Step 1: 政令指定都市の登録（カテゴリA）

担当地域内の政令指定都市を全てCSVに登録する。セクション10の一覧を参照。

- `population_category`: `A`
- `selection_reason`: `designated_city`
- `municipality_code`: セクション10のコードを使用
- `official_site_url`: 各市の公式サイトURLを確認して入力

#### Step 2: 県庁所在地の登録

担当地域内の県庁所在地で、Step 1に含まれていないものを登録する。

- 政令指定都市かつ県庁所在地の場合: Step 1で登録済み（重複登録しない）
- `selection_reason`: `prefecture_capital`（既にdesignated_cityで登録済みの場合はそのまま）

#### Step 3: 中核市の選定（カテゴリB）

担当地域内の中核市から代表を選定。セクション11の一覧を参照。

- 全ての中核市を含める必要はないが、各都道府県の代表は含める
- `population_category`: `B`
- `selection_reason`: `core_city`

#### Step 4: 一般市・特別区の選定（カテゴリC）

各都道府県から最低1つ、人口規模の幅を持たせて選定。

- 東京都: 特別区（23区）から10-15区程度選定（`selection_reason`: `special_ward`）
- 他の都道府県: 人口5万-20万の一般市を中心に選定
- `population_category`: `C`

#### Step 5: 町村・小規模市の選定（カテゴリD）

過疎地域・離島・中山間地域の代表を含める。

- 各都道府県から少なくとも1つは人口5万未満の自治体を含める
- 離島自治体を各地域ブロックから1つ以上含める（`selection_reason`: `island_municipality`）
- `population_category`: `D`

#### Step 6: 公式サイトURLの確認

全ての選定自治体について以下を確認する:

1. URLが `https://` で始まること
2. 末尾にスラッシュ `/` があること
3. URLにアクセスしてリダイレクト先を確認し、最終的なURLを記録すること
4. リダイレクトで別ドメインに飛ぶ場合はリダイレクト先のURLを記録

> **URLパターン例**:
> - 都道府県: `https://www.pref.{県名ローマ字}.lg.jp/` または `https://www.pref.{県名ローマ字}.jp/`
> - 市: `https://www.city.{市名ローマ字}.{県名ローマ字}.jp/` または `https://www.city.{市名ローマ字}.lg.jp/`
> - 町村: `https://www.town.{町名ローマ字}.{県名ローマ字}.jp/` または `https://www.vill.{村名ローマ字}.{県名ローマ字}.jp/`

---

## 6. Researcher D: 47都道府県 詳細手順

### 6.1 担当概要

47都道府県の全てを `layer=prefecture` として登録する。

### 6.2 出力ファイル

`data/derived/partial/researcher_d_prefectures.csv`（47行）

### 6.3 共通設定

全行に以下を設定:
- `layer`: `prefecture`
- `population_category`: `unknown`
- `selection_reason`: `prefecture_site`
- `sample_id`: マージ後に振り直すため、仮のID（`D0001`-`D0047`）で良い

### 6.4 47都道府県一覧と自治体コード

以下の47件を全て登録すること。`municipality_name` は都道府県名と同じ値を入れる。

| # | `prefecture` | `municipality_name` | `municipality_code` | `region_block` | `official_site_url`（参考） |
|---|-------------|---------------------|--------------------|--------------|-----------------------------|
| 1 | 北海道 | 北海道 | 010006 | hokkaido | https://www.pref.hokkaido.lg.jp/ |
| 2 | 青森県 | 青森県 | 020001 | tohoku | https://www.pref.aomori.lg.jp/ |
| 3 | 岩手県 | 岩手県 | 030007 | tohoku | https://www.pref.iwate.jp/ |
| 4 | 宮城県 | 宮城県 | 040002 | tohoku | https://www.pref.miyagi.jp/ |
| 5 | 秋田県 | 秋田県 | 050008 | tohoku | https://www.pref.akita.lg.jp/ |
| 6 | 山形県 | 山形県 | 060003 | tohoku | https://www.pref.yamagata.jp/ |
| 7 | 福島県 | 福島県 | 070009 | tohoku | https://www.pref.fukushima.lg.jp/ |
| 8 | 茨城県 | 茨城県 | 080004 | kanto | https://www.pref.ibaraki.jp/ |
| 9 | 栃木県 | 栃木県 | 090000 | kanto | https://www.pref.tochigi.lg.jp/ |
| 10 | 群馬県 | 群馬県 | 100005 | kanto | https://www.pref.gunma.jp/ |
| 11 | 埼玉県 | 埼玉県 | 110001 | kanto | https://www.pref.saitama.lg.jp/ |
| 12 | 千葉県 | 千葉県 | 120006 | kanto | https://www.pref.chiba.lg.jp/ |
| 13 | 東京都 | 東京都 | 130001 | kanto | https://www.metro.tokyo.lg.jp/ |
| 14 | 神奈川県 | 神奈川県 | 140007 | kanto | https://www.pref.kanagawa.jp/ |
| 15 | 新潟県 | 新潟県 | 150002 | chubu | https://www.pref.niigata.lg.jp/ |
| 16 | 富山県 | 富山県 | 160008 | chubu | https://www.pref.toyama.jp/ |
| 17 | 石川県 | 石川県 | 170003 | chubu | https://www.pref.ishikawa.lg.jp/ |
| 18 | 福井県 | 福井県 | 180009 | chubu | https://www.pref.fukui.lg.jp/ |
| 19 | 山梨県 | 山梨県 | 190004 | chubu | https://www.pref.yamanashi.jp/ |
| 20 | 長野県 | 長野県 | 200000 | chubu | https://www.pref.nagano.lg.jp/ |
| 21 | 岐阜県 | 岐阜県 | 210005 | chubu | https://www.pref.gifu.lg.jp/ |
| 22 | 静岡県 | 静岡県 | 220001 | chubu | https://www.pref.shizuoka.jp/ |
| 23 | 愛知県 | 愛知県 | 230006 | chubu | https://www.pref.aichi.jp/ |
| 24 | 三重県 | 三重県 | 240001 | kinki | https://www.pref.mie.lg.jp/ |
| 25 | 滋賀県 | 滋賀県 | 250007 | kinki | https://www.pref.shiga.lg.jp/ |
| 26 | 京都府 | 京都府 | 260002 | kinki | https://www.pref.kyoto.jp/ |
| 27 | 大阪府 | 大阪府 | 270008 | kinki | https://www.pref.osaka.lg.jp/ |
| 28 | 兵庫県 | 兵庫県 | 280003 | kinki | https://www.pref.hyogo.lg.jp/ |
| 29 | 奈良県 | 奈良県 | 290009 | kinki | https://www.pref.nara.jp/ |
| 30 | 和歌山県 | 和歌山県 | 300004 | kinki | https://www.pref.wakayama.lg.jp/ |
| 31 | 鳥取県 | 鳥取県 | 310000 | chugoku | https://www.pref.tottori.lg.jp/ |
| 32 | 島根県 | 島根県 | 320005 | chugoku | https://www.pref.shimane.lg.jp/ |
| 33 | 岡山県 | 岡山県 | 330001 | chugoku | https://www.pref.okayama.jp/ |
| 34 | 広島県 | 広島県 | 340006 | chugoku | https://www.pref.hiroshima.lg.jp/ |
| 35 | 山口県 | 山口県 | 350001 | chugoku | https://www.pref.yamaguchi.lg.jp/ |
| 36 | 徳島県 | 徳島県 | 360007 | shikoku | https://www.pref.tokushima.lg.jp/ |
| 37 | 香川県 | 香川県 | 370002 | shikoku | https://www.pref.kagawa.lg.jp/ |
| 38 | 愛媛県 | 愛媛県 | 380008 | shikoku | https://www.pref.ehime.jp/ |
| 39 | 高知県 | 高知県 | 390003 | shikoku | https://www.pref.kochi.lg.jp/ |
| 40 | 福岡県 | 福岡県 | 400009 | kyushu_okinawa | https://www.pref.fukuoka.lg.jp/ |
| 41 | 佐賀県 | 佐賀県 | 410004 | kyushu_okinawa | https://www.pref.saga.lg.jp/ |
| 42 | 長崎県 | 長崎県 | 420000 | kyushu_okinawa | https://www.pref.nagasaki.jp/ |
| 43 | 熊本県 | 熊本県 | 430005 | kyushu_okinawa | https://www.pref.kumamoto.jp/ |
| 44 | 大分県 | 大分県 | 440001 | kyushu_okinawa | https://www.pref.oita.jp/ |
| 45 | 宮崎県 | 宮崎県 | 450006 | kyushu_okinawa | https://www.pref.miyazaki.lg.jp/ |
| 46 | 鹿児島県 | 鹿児島県 | 460001 | kyushu_okinawa | https://www.pref.kagoshima.jp/ |
| 47 | 沖縄県 | 沖縄県 | 470007 | kyushu_okinawa | https://www.pref.okinawa.jp/ |

> **重要**: 上記の `official_site_url` は参考値である。実際にアクセスして最終的なURLを確認し、リダイレクト先がある場合はリダイレクト後のURLを記録すること。

---

## 7. Researcher A: 北海道+東北+関東 詳細手順

### 7.1 担当概要

| ブロック | 都道府県 | 市区町村目標数 |
|---------|---------|--------------|
| 北海道 | 北海道 | 15-20 |
| 東北 | 青森県, 岩手県, 宮城県, 秋田県, 山形県, 福島県 | 25-30 |
| 関東 | 茨城県, 栃木県, 群馬県, 埼玉県, 千葉県, 東京都, 神奈川県 | 50-60 |
| **合計** | 14都道県 | **90-110** |

### 7.2 出力ファイル

`data/derived/partial/researcher_a_hokkaido_tohoku_kanto.csv`

### 7.3 担当地域の政令指定都市（必須全数）

| 市名 | 都道府県 | `municipality_code` | `region_block` |
|------|---------|--------------------|--------------|
| 札幌市 | 北海道 | 011002 | hokkaido |
| 仙台市 | 宮城県 | 041009 | tohoku |
| さいたま市 | 埼玉県 | 111007 | kanto |
| 千葉市 | 千葉県 | 121002 | kanto |
| 横浜市 | 神奈川県 | 141003 | kanto |
| 川崎市 | 神奈川県 | 141305 | kanto |
| 相模原市 | 神奈川県 | 141500 | kanto |

合計: 7市

### 7.4 担当地域の県庁所在地（政令指定都市除く）

以下は政令指定都市ではない県庁所在地。Step 2で登録する。

| 市名 | 都道府県 | `region_block` | 備考 |
|------|---------|--------------|------|
| 青森市 | 青森県 | tohoku | 中核市でもある |
| 盛岡市 | 岩手県 | tohoku | 中核市でもある |
| 秋田市 | 秋田県 | tohoku | 中核市でもある |
| 山形市 | 山形県 | tohoku | 中核市でもある |
| 福島市 | 福島県 | tohoku | 中核市でもある |
| 水戸市 | 茨城県 | kanto | 中核市でもある |
| 宇都宮市 | 栃木県 | kanto | 中核市でもある |
| 前橋市 | 群馬県 | kanto | 中核市でもある |

> **注意**: 札幌市（北海道）、仙台市（宮城県）、さいたま市（埼玉県）、千葉市（千葉県）、横浜市（神奈川県）は政令指定都市として既にStep 1で登録済み。重複登録しないこと。

### 7.5 選定の指針

#### 北海道（15-20市町村）
- 札幌市（政令指定都市・A）は必須
- 旭川市（中核市・B）、函館市（中核市・B）を含める
- 帯広市、釧路市、北見市、苫小牧市等の中規模都市からカテゴリCを選定
- 離島: 奥尻町、利尻町等から1つ以上
- 過疎: 夕張市、歌志内市等から1つ以上

#### 東北（25-30市町村）
- 仙台市（政令指定都市・A）は必須
- 各県庁所在地を含める（Step 2で登録）
- 郡山市、いわき市（福島）、八戸市（青森）等の中規模都市を含める
- 過疎: 各県から1つ以上の町村を選定

#### 関東（50-60市町村）
- 政令指定都市5市は必須（さいたま市、千葉市、横浜市、川崎市、相模原市）
- 東京都: 特別区（23区）から10-15区を選定。千代田区、新宿区、渋谷区、世田谷区、足立区、八王子市等。`selection_reason`: `special_ward`
- 東京都の市部: 八王子市、町田市、府中市等から3-5市
- 埼玉県: 川越市（中核市）、越谷市（中核市）等
- 千葉県: 船橋市（中核市）、柏市（中核市）等
- 神奈川県: 横須賀市（中核市）等
- 茨城県: 水戸市（県庁・中核市）、つくば市等
- 栃木県: 宇都宮市（県庁・中核市）等
- 群馬県: 前橋市（県庁・中核市）、高崎市（中核市）等
- 離島: 東京都の小笠原村、伊豆諸島の町村から1つ以上

---

## 8. Researcher B: 中部+近畿 詳細手順

### 8.1 担当概要

| ブロック | 都道府県 | 市区町村目標数 |
|---------|---------|--------------|
| 中部 | 新潟県, 富山県, 石川県, 福井県, 山梨県, 長野県, 岐阜県, 静岡県, 愛知県 | 35-45 |
| 近畿 | 三重県, 滋賀県, 京都府, 大阪府, 兵庫県, 奈良県, 和歌山県 | 35-40 |
| **合計** | 16府県 | **70-85** |

### 8.2 出力ファイル

`data/derived/partial/researcher_b_chubu_kinki.csv`

### 8.3 担当地域の政令指定都市（必須全数）

| 市名 | 都道府県 | `municipality_code` | `region_block` |
|------|---------|--------------------|--------------|
| 新潟市 | 新潟県 | 151009 | chubu |
| 静岡市 | 静岡県 | 221007 | chubu |
| 浜松市 | 静岡県 | 221309 | chubu |
| 名古屋市 | 愛知県 | 231002 | chubu |
| 京都市 | 京都府 | 261009 | kinki |
| 大阪市 | 大阪府 | 271004 | kinki |
| 堺市 | 大阪府 | 271403 | kinki |
| 神戸市 | 兵庫県 | 281000 | kinki |

合計: 8市

### 8.4 担当地域の県庁所在地（政令指定都市除く）

| 市名 | 都道府県 | `region_block` | 備考 |
|------|---------|--------------|------|
| 富山市 | 富山県 | chubu | 中核市でもある |
| 金沢市 | 石川県 | chubu | 中核市でもある |
| 福井市 | 福井県 | chubu | 中核市でもある |
| 甲府市 | 山梨県 | chubu | 中核市でもある |
| 長野市 | 長野県 | chubu | 中核市でもある |
| 岐阜市 | 岐阜県 | chubu | 中核市でもある |
| 津市 | 三重県 | kinki | |
| 大津市 | 滋賀県 | kinki | 中核市でもある |
| 奈良市 | 奈良県 | kinki | 中核市でもある |
| 和歌山市 | 和歌山県 | kinki | 中核市でもある |

### 8.5 選定の指針

#### 中部（35-45市町村）
- 政令指定都市4市は必須（新潟市、静岡市、浜松市、名古屋市）
- 各県庁所在地を含める
- 愛知県: 豊田市、豊橋市（中核市）、岡崎市（中核市）等の中規模都市を多めに
- 長野県: 松本市（中核市）等
- 過疎: 各県から1つ以上の町村
- 離島: 新潟県の佐渡市を含める

#### 近畿（35-40市町村）
- 政令指定都市4市は必須（京都市、大阪市、堺市、神戸市）
- 大阪府: 東大阪市（中核市）、豊中市（中核市）、高槻市（中核市）、枚方市（中核市）等を多めに
- 兵庫県: 姫路市（中核市）、尼崎市（中核市）、西宮市（中核市）等
- 過疎: 和歌山県、奈良県の山間部町村
- 離島: 兵庫県の淡路市等

---

## 9. Researcher C: 中国+四国+九州沖縄 詳細手順

### 9.1 担当概要

| ブロック | 都道府県 | 市区町村目標数 |
|---------|---------|--------------|
| 中国 | 鳥取県, 島根県, 岡山県, 広島県, 山口県 | 20-25 |
| 四国 | 徳島県, 香川県, 愛媛県, 高知県 | 15-20 |
| 九州沖縄 | 福岡県, 佐賀県, 長崎県, 熊本県, 大分県, 宮崎県, 鹿児島県, 沖縄県 | 30-40 |
| **合計** | 17県 | **65-85** |

### 9.2 出力ファイル

`data/derived/partial/researcher_c_chugoku_shikoku_kyushu.csv`

### 9.3 担当地域の政令指定都市（必須全数）

| 市名 | 都道府県 | `municipality_code` | `region_block` |
|------|---------|--------------------|--------------|
| 岡山市 | 岡山県 | 331007 | chugoku |
| 広島市 | 広島県 | 341002 | chugoku |
| 北九州市 | 福岡県 | 401005 | kyushu_okinawa |
| 福岡市 | 福岡県 | 401307 | kyushu_okinawa |
| 熊本市 | 熊本県 | 431001 | kyushu_okinawa |

合計: 5市

### 9.4 担当地域の県庁所在地（政令指定都市除く）

| 市名 | 都道府県 | `region_block` | 備考 |
|------|---------|--------------|------|
| 鳥取市 | 鳥取県 | chugoku | 中核市でもある |
| 松江市 | 島根県 | chugoku | 中核市でもある |
| 山口市 | 山口県 | chugoku | |
| 徳島市 | 徳島県 | shikoku | |
| 高松市 | 香川県 | shikoku | 中核市でもある |
| 松山市 | 愛媛県 | shikoku | 中核市でもある |
| 高知市 | 高知県 | shikoku | 中核市でもある |
| 佐賀市 | 佐賀県 | kyushu_okinawa | |
| 長崎市 | 長崎県 | kyushu_okinawa | 中核市でもある |
| 大分市 | 大分県 | kyushu_okinawa | 中核市でもある |
| 宮崎市 | 宮崎県 | kyushu_okinawa | 中核市でもある |
| 鹿児島市 | 鹿児島県 | kyushu_okinawa | 中核市でもある |
| 那覇市 | 沖縄県 | kyushu_okinawa | 中核市でもある |

### 9.5 選定の指針

#### 中国（20-25市町村）
- 政令指定都市2市は必須（岡山市、広島市）
- 各県庁所在地を含める
- 福山市（広島県・中核市）、倉敷市（岡山県・中核市）、呉市（広島県・中核市）等
- 過疎: 島根県、鳥取県の山間部町村
- 離島: 島根県の隠岐の島町等

#### 四国（15-20市町村）
- 各県庁所在地を含める（徳島市、高松市、松山市、高知市）
- 今治市（愛媛県）等の中規模都市
- 過疎: 各県から1つ以上の町村
- 離島: 愛媛県の上島町等

#### 九州沖縄（30-40市町村）
- 政令指定都市3市は必須（北九州市、福岡市、熊本市）
- 各県庁所在地を含める
- 久留米市（福岡県・中核市）、大分市（中核市）等
- 沖縄県: 那覇市（中核市）に加え、沖縄市、浦添市等の中規模都市と宮古島市等の離島を含める
- 離島: 沖縄県宮古島市、鹿児島県奄美市、長崎県五島市等
- 過疎: 各県から1つ以上の町村

---

## 10. 政令指定都市20市一覧（必須全数）

以下の20市は全て `population_category=A`、`selection_reason=designated_city` として登録すること。

| # | 市名 | 都道府県 | `municipality_code` | `region_block` | 担当 | `official_site_url`（参考） |
|---|------|---------|--------------------|--------------|----|--------------------------|
| 1 | 札幌市 | 北海道 | 011002 | hokkaido | A | https://www.city.sapporo.jp/ |
| 2 | 仙台市 | 宮城県 | 041009 | tohoku | A | https://www.city.sendai.jp/ |
| 3 | さいたま市 | 埼玉県 | 111007 | kanto | A | https://www.city.saitama.jp/ |
| 4 | 千葉市 | 千葉県 | 121002 | kanto | A | https://www.city.chiba.jp/ |
| 5 | 横浜市 | 神奈川県 | 141003 | kanto | A | https://www.city.yokohama.lg.jp/ |
| 6 | 川崎市 | 神奈川県 | 141305 | kanto | A | https://www.city.kawasaki.jp/ |
| 7 | 相模原市 | 神奈川県 | 141500 | kanto | A | https://www.city.sagamihara.kanagawa.jp/ |
| 8 | 新潟市 | 新潟県 | 151009 | chubu | B | https://www.city.niigata.lg.jp/ |
| 9 | 静岡市 | 静岡県 | 221007 | chubu | B | https://www.city.shizuoka.lg.jp/ |
| 10 | 浜松市 | 静岡県 | 221309 | chubu | B | https://www.city.hamamatsu.shizuoka.jp/ |
| 11 | 名古屋市 | 愛知県 | 231002 | chubu | B | https://www.city.nagoya.jp/ |
| 12 | 京都市 | 京都府 | 261009 | kinki | B | https://www.city.kyoto.lg.jp/ |
| 13 | 大阪市 | 大阪府 | 271004 | kinki | B | https://www.city.osaka.lg.jp/ |
| 14 | 堺市 | 大阪府 | 271403 | kinki | B | https://www.city.sakai.lg.jp/ |
| 15 | 神戸市 | 兵庫県 | 281000 | kinki | B | https://www.city.kobe.lg.jp/ |
| 16 | 岡山市 | 岡山県 | 331007 | chugoku | C | https://www.city.okayama.jp/ |
| 17 | 広島市 | 広島県 | 341002 | chugoku | C | https://www.city.hiroshima.lg.jp/ |
| 18 | 北九州市 | 福岡県 | 401005 | kyushu_okinawa | C | https://www.city.kitakyushu.lg.jp/ |
| 19 | 福岡市 | 福岡県 | 401307 | kyushu_okinawa | C | https://www.city.fukuoka.lg.jp/ |
| 20 | 熊本市 | 熊本県 | 431001 | kyushu_okinawa | C | https://www.city.kumamoto.jp/ |

> **注意**: URLは参考値。実際にアクセスして最終URLを確認すること。「担当」列はリサーチャー担当（A/B/C）を示す。

---

## 11. 中核市一覧（参照用）

2024年4月時点の中核市62市（全てを含める必要はないが、各地域の代表は含めること）。

### 北海道・東北（Researcher A担当）
旭川市、函館市、青森市、八戸市、盛岡市、秋田市、山形市、郡山市、いわき市、福島市

### 関東（Researcher A担当）
水戸市、宇都宮市、前橋市、高崎市、川越市、越谷市、川口市、船橋市、柏市、横須賀市

### 中部（Researcher B担当）
富山市、金沢市、福井市、甲府市、長野市、松本市、岐阜市、豊橋市、岡崎市、豊田市

### 近畿（Researcher B担当）
大津市、豊中市、高槻市、枚方市、東大阪市、八尾市、寝屋川市、吹田市、姫路市、尼崎市、西宮市、明石市、奈良市、和歌山市

### 中国・四国（Researcher C担当）
鳥取市、松江市、倉敷市、呉市、福山市、下関市、高松市、松山市、高知市

### 九州沖縄（Researcher C担当）
久留米市、長崎市、佐世保市、大分市、宮崎市、鹿児島市、那覇市

> **重要**: 上記リストは参照用。中核市の指定状況は変動するため、最新の中核市市長会のサイト（https://www.chuukakushi.gr.jp/）で確認すること。

---

## 12. データソースと参照先

### 12.1 必須参照データソース

| # | ソース | URL | 用途 |
|---|--------|-----|------|
| 1 | 総務省 全国地方公共団体コード | https://www.soumu.go.jp/denshijiti/code.html | `municipality_code`の確定 |
| 2 | 総務省 政令指定都市一覧 | https://www.soumu.go.jp/main_sosiki/jichi_gyousei/bunken/shitei_toshi-ichiran.html | 政令指定都市20市の確認 |
| 3 | 中核市市長会 | https://www.chuukakushi.gr.jp/ | 中核市の最新リスト確認 |
| 4 | 各都道府県公式サイト | （各県のURL） | 市町村一覧・リンク集の確認 |

### 12.2 補助参照データソース

| # | ソース | 用途 |
|---|--------|------|
| 5 | 総務省 統計でみる市区町村のすがた | 人口データの確認 |
| 6 | Wikipedia 日本の市の人口順位 | 人口カテゴリの簡易確認（正式データは総務省統計を使用） |
| 7 | 全国市長会 | 市の一覧確認 |
| 8 | 全国町村会 | 町村の一覧確認 |

### 12.3 municipality_codeの確認方法

総務省の全国地方公共団体コードは6桁の数字で構成される。

- 形式: `PPCCCC`（PP=都道府県コード2桁、CCCC=市区町村コード4桁）
- 都道府県の場合: `PP0006` または `PP000X`のパターン（チェックデジット付き）
- 市区町村の場合: 都道府県コード+市区町村固有番号+チェックデジット

例:
- 北海道: `010006`
- 札幌市: `011002`
- 東京都: `130001`
- 千代田区: `131016`

> **注意**: コードは必ず総務省の公式データで確認すること。Wikipediaや他のソースのコードにはチェックデジットの誤りがある場合がある。

---

## 13. マージ手順と品質チェック

### 13.1 マージ手順

統合エージェント（`data-analyst`）が以下の手順で実行する。

#### Step 1: 4つの部分CSVを結合

結合順序: **Researcher D（都道府県）→ Researcher A → Researcher B → Researcher C**

```
# 結合順序（概念的な処理フロー）
1. researcher_d_prefectures.csv     → S0001-S0047（47行）
2. researcher_a_hokkaido_tohoku_kanto.csv → S0048-S0157（90-110行）
3. researcher_b_chubu_kinki.csv     → S0158-S0232（70-85行）
4. researcher_c_chugoku_shikoku_kyushu.csv → S0233-S0300（65-85行）
```

#### Step 2: sample_id を振り直し

1. 全行を上記の結合順序で並べる
2. `sample_id` を `S0001` から `S0300` まで連番で振り直す（4桁ゼロ埋め）
3. 各リサーチャーが仮に付けたIDは全て上書きする

#### Step 3: ヘッダー行の確認

最終CSVのヘッダー行が以下と完全一致することを確認:
```
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,notes
```

### 13.2 品質チェック（全項目をパスすること）

#### チェック1: 行数検証
```
- ヘッダー除外後の行数 == 300
- layer=prefecture の行数 == 47
- layer=municipality の行数 == 253
```

#### チェック2: 一意性検証
```
- municipality_code に重複がないこと
- sample_id に重複がないこと
- sample_id が S0001-S0300 の連続であること
```

#### チェック3: 必須フィールド検証
```
- 全行の official_site_url が空でないこと
- 全行の municipality_code が空でないこと
- 全行の prefecture が空でないこと
- 全行の municipality_name が空でないこと
- 全行の layer が空でないこと
- 全行の region_block が空でないこと
- 全行の population_category が空でないこと
- 全行の selection_reason が空でないこと
```

#### チェック4: 値域検証
```
- layer の値が {prefecture, municipality} のいずれか
- population_category の値が {A, B, C, D, unknown} のいずれか
- region_block の値が {hokkaido, tohoku, kanto, chubu, kinki, chugoku, shikoku, kyushu_okinawa} のいずれか
- selection_reason の値が定義済みコードのいずれか
```

#### チェック5: フォーマット検証
```
- municipality_code が6桁の数字であること（正規表現: ^\d{6}$）
- sample_id が S + 4桁数字であること（正規表現: ^S\d{4}$）
- official_site_url が https:// で始まり / で終わること
```

#### チェック6: 政令指定都市全数検証
```
- 以下の20件の municipality_code が全て存在すること:
  011002, 041009, 111007, 121002, 141003, 141305, 141500,
  151009, 221007, 221309, 231002, 261009, 271004, 271403,
  281000, 331007, 341002, 401005, 401307, 431001
- 上記20件の population_category が全て A であること
```

#### チェック7: 都道府県全数検証
```
- 以下の47件の都道府県名が全て prefecture 列に存在すること:
  北海道, 青森県, 岩手県, 宮城県, 秋田県, 山形県, 福島県,
  茨城県, 栃木県, 群馬県, 埼玉県, 千葉県, 東京都, 神奈川県,
  新潟県, 富山県, 石川県, 福井県, 山梨県, 長野県, 岐阜県, 静岡県, 愛知県,
  三重県, 滋賀県, 京都府, 大阪府, 兵庫県, 奈良県, 和歌山県,
  鳥取県, 島根県, 岡山県, 広島県, 山口県,
  徳島県, 香川県, 愛媛県, 高知県,
  福岡県, 佐賀県, 長崎県, 熊本県, 大分県, 宮崎県, 鹿児島県, 沖縄県
```

#### チェック8: 地域ブロック整合性検証
```
- 各行の prefecture と region_block の対応がセクション4.4の対応表と一致すること
- 例: prefecture=北海道 の行は region_block=hokkaido であること
```

#### チェック9: STEP03用列の空欄確認
```
- top_page_url, contact_page_url, service_page_url, hub_page_url, article_page_url
  が全行空欄であること（STEP02では入力しない）
```

### 13.3 品質チェック不合格時の対応

1. 不合格項目を特定し、該当するリサーチャーに差し戻す
2. 修正後に再度マージと品質チェックを実施
3. 全チェック項目をパスするまで繰り返す

---

## 14. 表記統一ルール

### 14.1 日本語表記

| 項目 | ルール | 正しい例 | 誤りの例 |
|------|--------|---------|---------|
| 都道府県名 | 「都」「道」「府」「県」を付ける | 東京都、北海道、大阪府、京都府 | 東京、北海、大阪、京都 |
| 市名 | 「市」を付ける | 札幌市、横浜市 | 札幌、横浜 |
| 区名（特別区） | 「区」を付ける | 千代田区、渋谷区 | 千代田、渋谷 |
| 町名 | 「町」を付ける | 大磯町、葉山町 | 大磯、葉山 |
| 村名 | 「村」を付ける | 小笠原村、檜原村 | 小笠原、檜原 |

### 14.2 コードとID

| 項目 | ルール | 正しい例 | 誤りの例 |
|------|--------|---------|---------|
| sample_id | `S` + 4桁ゼロ埋め | S0001, S0300 | S1, S300, s0001 |
| municipality_code | 6桁ゼロ埋め | 011002, 010006 | 11002, 10006 |
| region_block | 小文字英字+アンダースコア | kyushu_okinawa | Kyushu_Okinawa, kyushu-okinawa |
| population_category | 大文字英字1文字 | A, B, C, D | a, b, cat_a |
| layer | 小文字英字 | prefecture, municipality | Prefecture, MUNICIPALITY |

### 14.3 URL表記

| 項目 | ルール | 正しい例 | 誤りの例 |
|------|--------|---------|---------|
| プロトコル | https:// を使用 | https://www.city.sapporo.jp/ | http://www.city.sapporo.jp/ |
| 末尾スラッシュ | 統一的に付与 | https://www.city.sapporo.jp/ | https://www.city.sapporo.jp |
| wwwの有無 | 実際のサイトに合わせる | （実際のURLに従う） | （勝手にwwwを付けたり外したりしない） |
| パス | トップページのみ（パスなし） | https://www.city.sapporo.jp/ | https://www.city.sapporo.jp/index.html |

### 14.4 CSVエンコーディング

- 文字コード: UTF-8（BOMなし）
- 改行コード: LF
- 区切り文字: カンマ（,）
- フィールド囲み: カンマやダブルクォートを含む場合のみダブルクォートで囲む
- notes列にURLを含む場合: ダブルクォートで囲む

---

## 15. Conductorワークスペース設定

### 15.1 ワークスペース基本情報

| 項目 | 値 |
|------|---|
| ワークスペース名 | `municipal-roster` |
| ブランチ名 | `monoharada/municipal-roster-300` |
| リポジトリ | `web-components-factory-v1/kabul`（同一リポジトリ） |
| 作業ディレクトリ | `.context/municipal-ui-research/` |

### 15.2 出力先パス

| ファイル | パス |
|---------|------|
| 最終CSV | `.context/municipal-ui-research/data/derived/roster_300.csv` |
| 部分CSV（A） | `.context/municipal-ui-research/data/derived/partial/researcher_a_hokkaido_tohoku_kanto.csv` |
| 部分CSV（B） | `.context/municipal-ui-research/data/derived/partial/researcher_b_chubu_kinki.csv` |
| 部分CSV（C） | `.context/municipal-ui-research/data/derived/partial/researcher_c_chugoku_shikoku_kyushu.csv` |
| 部分CSV（D） | `.context/municipal-ui-research/data/derived/partial/researcher_d_prefectures.csv` |

### 15.3 実行エージェント構成

| エージェント | 種別 | 数 | 役割 |
|------------|------|---|------|
| Researcher A | `comprehensive-researcher` | 1 | 北海道+東北+関東の市区町村 |
| Researcher B | `comprehensive-researcher` | 1 | 中部+近畿の市区町村 |
| Researcher C | `comprehensive-researcher` | 1 | 中国+四国+九州沖縄の市区町村 |
| Researcher D | `comprehensive-researcher` | 1 | 47都道府県（prefectureレイヤー） |
| Integrator | `data-analyst` | 1 | マージ・品質検証 |

### 15.4 実行フロー

```
[フェーズ1: 並列リサーチ]
  Researcher D (47都道府県) ─────────────────┐
  Researcher A (北海道+東北+関東) ────────────┤
  Researcher B (中部+近畿) ──────────────────┤
  Researcher C (中国+四国+九州沖縄) ──────────┤
                                              ▼
[フェーズ2: 統合・検証]
  Integrator (マージ + 品質チェック) ─────────→ roster_300.csv
                                              │
                                    不合格 ←──┤──→ 合格: 完了
                                      │
                              差し戻し → 該当Researcher修正
                                      │
                              再マージ → 品質チェック（繰り返し）
```

### 15.5 Conductorでの起動手順

1. `municipal-roster` ワークスペースを開く
2. ブランチ `monoharada/municipal-roster-300` を作成（または切り替え）
3. `data/derived/partial/` ディレクトリが存在することを確認（なければ作成）
4. 本文書（STEP02_handoff.md）をコンテキストとして各リサーチャーに渡す
5. 各リサーチャーに担当セクション（6/7/8/9）を指示して並列実行
6. 全リサーチャー完了後、Integratorにセクション13のマージ手順を実行させる
7. 品質チェック全項目パスを確認
8. PRを作成してレビュー

### 15.6 各リサーチャーへの指示テンプレート

#### Researcher D への指示
```
あなたは comprehensive-researcher です。
STEP02ハンドオフ文書のセクション6「Researcher D: 47都道府県 詳細手順」に従い、
47都道府県のCSVを作成してください。

出力先: .context/municipal-ui-research/data/derived/partial/researcher_d_prefectures.csv
CSV形式: セクション3のヘッダーに従うこと
表記ルール: セクション14に従うこと
URLは実際にアクセスして最終URLを確認すること
```

#### Researcher A への指示
```
あなたは comprehensive-researcher です。
STEP02ハンドオフ文書のセクション7「Researcher A: 北海道+東北+関東 詳細手順」に従い、
担当地域の市区町村CSVを作成してください。

出力先: .context/municipal-ui-research/data/derived/partial/researcher_a_hokkaido_tohoku_kanto.csv
CSV形式: セクション3のヘッダーに従うこと
サンプリング設計: セクション4に従うこと
政令指定都市: セクション10の該当市を全て含めること
表記ルール: セクション14に従うこと
URLは実際にアクセスして最終URLを確認すること
```

#### Researcher B への指示
```
あなたは comprehensive-researcher です。
STEP02ハンドオフ文書のセクション8「Researcher B: 中部+近畿 詳細手順」に従い、
担当地域の市区町村CSVを作成してください。

出力先: .context/municipal-ui-research/data/derived/partial/researcher_b_chubu_kinki.csv
CSV形式: セクション3のヘッダーに従うこと
サンプリング設計: セクション4に従うこと
政令指定都市: セクション10の該当市を全て含めること
表記ルール: セクション14に従うこと
URLは実際にアクセスして最終URLを確認すること
```

#### Researcher C への指示
```
あなたは comprehensive-researcher です。
STEP02ハンドオフ文書のセクション9「Researcher C: 中国+四国+九州沖縄 詳細手順」に従い、
担当地域の市区町村CSVを作成してください。

出力先: .context/municipal-ui-research/data/derived/partial/researcher_c_chugoku_shikoku_kyushu.csv
CSV形式: セクション3のヘッダーに従うこと
サンプリング設計: セクション4に従うこと
政令指定都市: セクション10の該当市を全て含めること
表記ルール: セクション14に従うこと
URLは実際にアクセスして最終URLを確認すること
```

#### Integrator への指示
```
あなたは data-analyst です。
STEP02ハンドオフ文書のセクション13「マージ手順と品質チェック」に従い、
4つの部分CSVを統合し、品質チェックを実施してください。

入力:
- .context/municipal-ui-research/data/derived/partial/researcher_d_prefectures.csv
- .context/municipal-ui-research/data/derived/partial/researcher_a_hokkaido_tohoku_kanto.csv
- .context/municipal-ui-research/data/derived/partial/researcher_b_chubu_kinki.csv
- .context/municipal-ui-research/data/derived/partial/researcher_c_chugoku_shikoku_kyushu.csv

出力:
- .context/municipal-ui-research/data/derived/roster_300.csv

品質チェック: セクション13.2の全チェック項目をパスすること
不合格の場合: セクション13.3の対応手順に従うこと
```

---

## 16. トラブルシューティング

### 16.1 よくある問題と対処

| 問題 | 原因 | 対処 |
|------|------|------|
| municipality_codeが見つからない | 総務省のコード表が更新されている | 最新のコード表をダウンロードして確認 |
| 公式サイトURLがリダイレクトする | サイトリニューアルやドメイン変更 | リダイレクト先のURLを記録 |
| 公式サイトがHTTPのみ | HTTPS未対応の自治体サイト | HTTPSでアクセスできない場合はHTTPで記録し、notesに「HTTPのみ」と記載 |
| 市町村が合併して存在しない | 平成・令和の市町村合併 | 現在の合併先の自治体に差し替え |
| 中核市の指定が変わった | 中核市制度の変更 | 最新の中核市市長会サイトで確認 |
| 合計が300にならない | 各ブロックの目標数の調整ミス | 地域バランスを維持しながらB/C/Dカテゴリ間で調整 |

### 16.2 市区町村合併に関する注意

2024年以降に合併・廃止された市区町村がある場合、現在存在する自治体のみを対象とすること。合併前の旧市町村は対象外。不明な場合は総務省の最新の地方公共団体コード一覧で確認。

### 16.3 HTTPSに関する例外

自治体サイトの大部分はHTTPS対応済みだが、一部の小規模町村でHTTPのみの場合がある。その場合:
1. まず `https://` でアクセスを試みる
2. HTTPS接続できない場合のみ `http://` で記録する
3. `notes` 列に `HTTPのみ（HTTPS非対応）` と記載する

---

## 付録A: CSVヘッダー行（コピー用）

```
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,notes
```

## 付録B: selection_reason コード一覧（コピー用）

```
designated_city
core_city
prefecture_capital
population_top
rural_representative
island_municipality
ui_diversity
regional_balance
special_ward
prefecture_site
```

## 付録C: region_block 一覧（コピー用）

```
hokkaido
tohoku
kanto
chubu
kinki
chugoku
shikoku
kyushu_okinawa
```

## 付録D: population_category 一覧（コピー用）

```
A
B
C
D
unknown
```

---

**文書終了**

本文書に記載された全ての情報をもとに、追加情報なしでSTEP02の実行を開始できます。不明点がある場合は、セクション12のデータソースを参照して最新情報を確認してください。
