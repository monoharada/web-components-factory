# STEP03+04 統合実行プロンプト

> **用途**: 別セッション（Claude Code / Conductor）にコピーして実行するための自己完結型プロンプト。
> **入力**: バッチCSV（7-8自治体 × roster 15列）を `{BATCH_DATA}` に貼り付け。
> **出力**: 2つのCSV（URL roster + 観測データ）。

---

## あなたの役割

あなたはURL探索エージェント兼UIインスペクタです。以下の2タスクを **1パス** で実行します:

1. **STEP03: URL Discovery** — 各自治体の公式サイトから5種類のページURLを発見
2. **STEP04: Shallow Probe** — 発見したページのHTMLを分析し、18種UIコンポーネントの有無を記録

---

## 絶対ルール

1. **推測禁止**: HTMLソースで確認できない要素は `false` / 空欄とする。URLは実際にアクセスして確認したもののみ記録
2. **1ページ1行**: 各ページURLに対して 45列CSVの1行を出力
3. **エビデンス記録**: 検出した要素のCSSセレクタまたはテキスト断片を `notes` に記録
4. **取得失敗も記録**: HTTP取得不能の場合も行を作り、`http_status` と `notes` に理由を残す
5. **robots.txt遵守**: アクセス拒否のページはスキップし理由を記録
6. **ドメイン一致**: URLは `official_site_url` と同一ドメインまたはそのサブドメインのみ。外部サイトは不可
7. **見つからなければ空欄**: 無理にURLを埋めない。空欄のまま notes に「NOT_FOUND: 理由」を記録
8. **boolean は `true`/`false` のみ**: 空欄は許容しない。判定不能でも `false` を記録

---

## 統合手順（自治体ごとに実行）

### Phase A: トップページ取得 + URL探索 + 観測

1. `official_site_url` に WebFetch
2. **STEP04 観測**: トップページの18コンポーネントを分析し、CSV 1行目を記録（`page_type=top`）
3. **STEP03 URL探索**: トップページHTMLから以下のURLを抽出:

**contact_page_url を探す場所（優先順）:**
1. `<footer>` 内のリンクで「お問い合わせ」「問い合わせ」「ご意見」テキストを含むもの
2. `<header>` / `<nav>` 内の「お問い合わせ」リンク
3. ページ内の `a[href]` で上記テキストを含むもの

**hub_page_url を探す場所:**
1. グローバルナビ（`<nav>`）の第1階層リンクで「くらし」「暮らし」「子育て」「健康」等
2. メインコンテンツのカテゴリカード/アイコングリッド

**service_page_url を探す場所:**
1. グローバルナビの子メニューで「児童手当」「転入届」「住民票」等
2. トップページの「よくある手続き」「人気の手続き」セクション
3. hub_page_url にアクセスして、そこから個別手続きページへ辿る
- **重要**: hub と service が同じURLにならないこと

**article_page_url を探す場所:**
1. トップページの「新着情報」「お知らせ」「トピックス」セクション内の個別記事リンク
2. 一覧ページではなく、**日付付きの個別記事リンク** を選ぶ
3. 「一覧を見る」「もっと見る」は除外

### Phase B: 補完（Phase Aで見つからないURLがあれば）

4. WebSearch で `site:{domain} お問い合わせ` / `site:{domain} 児童手当` 等を検索
5. 検索結果のURLにアクセスして存在確認してから記録

### Phase C: 残りページの観測

6. 発見した contact / service / hub / article の各URLに WebFetch
7. 各ページの18コンポーネントを分析し、CSV行を記録
8. 404/timeout の場合: `http_status` に記録、booleanは全て `false`、notes に理由

### 処理順序

- 自治体ごとに `top` → `contact` → `service` → `hub` → `article` の順
- URLが空欄（NOT_FOUND）のページタイプはスキップ（行を作らない）

---

## 探索キーワード辞書

### contact を示すリンクテキスト
- 一次: 「お問い合わせ」「問い合わせ」「お問合せ」「ご意見・お問い合わせ」
- 二次: 「連絡先」「窓口」「相談」「ご意見」「代表電話」「コールセンター」
- URLパス: `contact`, `inquiry`, `toiawase`, `otoiawase`, `madoguchi`, `soudan`

### service を示すリンクテキスト
- 「児童手当」「転入届」「住民票」「国民健康保険」「防災」「ごみ」
- URLパス: `jidouteate`, `kosodate`, `tennyu`, `hikkoshi`, `juminhyo`, `kokuho`, `bousai`, `gomi`

### hub を示すリンクテキスト
- 一次: 「くらし」「暮らし」「くらしの情報」「くらし・手続き」
- 二次: 「子育て・教育」「健康・福祉」「まちづくり」「分野別」「カテゴリ」
- URLパス: `kurashi`, `life`, `category`, `bunnya`, `kosodate`, `kenko`

### article を示すセクション
- 「新着情報」「お知らせ」「トピックス」「ニュース」「最新情報」「What's New」
- URLパス: `news`, `oshirase`, `topics`, `whatsnew`, `information`, `shinchaku`

---

## 18種UIコンポーネント検出ルール

### レイアウト系（3種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_skip_link` | スキップリンク | `<a href="#main">`, `<a href="#content">`, テキスト「本文へ」「メインへ」「コンテンツへ」を含むページ上部のリンク |
| `has_header_brand` | ヘッダーの自治体名/ロゴ | `<header>` 内の `<a href="/">` にロゴ画像またはサイト名テキストがある |
| `has_footer_policies` | フッターのポリシーリンク群 | `<footer>` 内に「個人情報」「著作権」「アクセシビリティ」「免責」等へのリンクがある |

### ナビゲーション系（3種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_global_nav` | グローバルナビ | `<nav>` 要素 + `<ul><li><a>` のリスト構造。テキスト「くらし」「防災」「子育て」「観光」「事業者」等 |
| `global_nav_variant` | バリアント | `horizontal` / `dropdown` / `mega` / `drawer` |
| `has_breadcrumb` | パンくずリスト | `<nav aria-label="パンくず">`, `<ol class="breadcrumb">`, テキスト「ホーム >」。トップページでは通常 false |
| `has_local_nav` | サイドナビ | `<aside>` 内の `<nav>` または `.side-nav`, `.local-nav` |

### 検索系（1種 + バリアント）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_search` | サイト内検索 | `<form role="search">`, `<input type="search">`, テキスト「検索」付きフォーム |
| `search_variant` | バリアント | `header` / `fullpage` |

### お知らせ系（1種 + バリアント）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_emergency_notice` | 緊急情報バナー | **条件（両方必須）**: (1) `.emergency`, `.alert`, `[role="alert"]`, 赤/黄色背景の目立つバナー (2) **現在進行中の災害・感染症等の緊急内容**。常設の「防災情報」リンクや「現在情報はありません」は `false` |
| `emergency_variant` | バリアント | `banner` / `ticker` / `modal` |

### コンテンツ系（6種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_news_list` | お知らせ一覧 | 日付+リンクの繰り返しパターン。テキスト「お知らせ」「新着情報」 |
| `has_pickup` | ピックアップ枠 | `.pickup`, `.featured`, テキスト「ピックアップ」「注目」 |
| `has_carousel` | カルーセル/スライダー | `.swiper`, `.slider`, `.carousel`, `.slick`, `owl-carousel` |
| `has_hub_cards` | カテゴリ導線カード群 | 複数の `<a>` を含むグリッド/フレックスレイアウト。各カードにアイコン+テキスト。**ページ固有のカード群のみ。全ページ共通のグローバルナビアイコンは `false`** |
| `hub_cards_variant` | バリアント | `icon` / `image` / `text` |
| `has_attachments` | PDF/添付ファイルリンク | `<a href="....pdf">`, テキスト「PDF」「様式」 |
| `attachments_variant` | バリアント | `pdf` / `doc` / `xls` / `mixed` |

### 問い合わせ系（2種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_contact_info` | 問い合わせ先ブロック | `<a href="tel:">`, テキスト「電話」「所在地」「開庁時間」「〒」 |
| `has_contact_form` | 問い合わせフォーム | `<form>` + `<input>` + `<textarea>`, テキスト「お問い合わせ」 |
| `contact_form_variant` | バリアント | `simple` / `multi_step` / `external` |

### 記事系（1種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_article_meta` | 記事メタ情報 | `<time>` 要素 + テキスト「公開日」「更新日」「掲載日」。**個別ページの公開日/更新日のみ。トップページの新着一覧の日付は `false`** |
| `has_toc` | ページ内目次 | `<nav aria-label="目次">`, `.toc`, テキスト「目次」+ ページ内リンク |

### ユーティリティ系（1種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_accessibility_link` | アクセシビリティ方針ページへのリンク | **リンクテキストに「アクセシビリティ」を含むもののみ**。ReadSpeaker、音声読み上げ、文字サイズ変更ボタンは `false` |
| `accessibility_url` | そのリンクURL | リンクの href 値を記録（テキストではなくURL） |

### 品質スコア（簡易評価）

| カラム | 評価方法 | 値 |
|--------|---------|---|
| `heading_outline_score` | 見出し階層の品質 | `good` / `fair` / `poor` |
| `keyboard_nav_risk` | キーボードナビゲーションのリスク | `low` / `medium` / `high` |
| `contrast_risk_hint` | コントラストのリスク推定 | `low` / `medium` / `high`（HTTP 200の場合は必ず値を入れる） |

---

## 出力フォーマット

### Output 1: URL Roster CSV

ファイル名: `batch_{BATCH_ID}_urls.csv`

入力バッチCSVと同じ15列構成。`top_page_url` 〜 `article_page_url` に発見したURLを記入。`notes` 列にURL発見根拠を追記。

### Output 2: Observations CSV

ファイル名: `batch_{BATCH_ID}_observations.csv`

#### CSVヘッダー（45列）

```
sample_id,prefecture,municipality_name,layer,population_category,page_type,page_url,captured_at,http_status,final_url,page_title,lang_attr,cms_fingerprint,theme_vendor_hint,has_skip_link,has_header_brand,has_global_nav,global_nav_variant,has_search,search_variant,has_breadcrumb,has_local_nav,has_emergency_notice,emergency_variant,has_news_list,has_pickup,has_carousel,has_hub_cards,hub_cards_variant,has_footer_policies,has_accessibility_link,accessibility_url,has_contact_info,has_contact_form,contact_form_variant,has_article_meta,has_toc,has_attachments,attachments_variant,heading_outline_score,keyboard_nav_risk,contrast_risk_hint,notes,evidence_dom_snippets_path,screenshot_path
```

#### カラム詳細

- `page_type`: `top` / `contact` / `service` / `hub` / `article`
- `captured_at`: ISO 8601形式（JST）
- boolean カラム: `true` / `false`（文字列。空欄不可）
- variant カラム: 該当する値 or 空欄
- `notes`: 検出エビデンスを `[component] selector_or_text` 形式で列挙（セミコロン区切り）
- `evidence_dom_snippets_path`: 空欄
- `screenshot_path`: 空欄

---

## 入力データ

### バッチCSV

以下の `{BATCH_DATA}` を実際のバッチCSVデータに置換して使用してください。

```csv
{BATCH_DATA}
```

---

## バッチ内の処理

1. バッチCSV の各行（自治体）を上から順に処理
2. 各自治体で Phase A → B → C を実行
3. **即時CSV記録**: 各自治体の処理が完了したら、その時点で CSV 行を出力ファイルに書き込む（コンテキスト切れ防止）
4. 全自治体の処理が完了したら、出力CSVを `docs/municipal-ui-research/data/batches/` に保存

---

## 成功基準

| 指標 | 目標 |
|------|------|
| ページ取得成功率（HTTP 200） | >= 90% |
| 全boolean カラムが `true`/`false` で埋まっている | 100% |
| `contrast_risk_hint` が HTTP 200 ページで埋まっている | 100% |
| notes にエビデンスが記録されている（true判定の全件） | 100% |
| CSV カラム数 | 45（全行） |
| `sample_id + page_type` の一意性 | 100% |

---

## パイロットからの教訓（必読）

1. **has_accessibility_link**: リンクテキストに「アクセシビリティ」を含むもの **のみ** true。ReadSpeaker/音声読み上げ/文字サイズ変更は false
2. **accessibility_url**: テキストではなく **href のURL** を記録
3. **has_emergency_notice**: 常設の防災リンク・準備情報は false。**現在進行中の災害・感染症** のアラートバナーのみ true
4. **has_article_meta**: 個別ページの `公開日`/`更新日`/`掲載日` のみ。トップページの新着一覧の日付は false
5. **has_hub_cards**: そのページ固有のカード群のみ。全ページ共通のグローバルナビアイコンは false
6. **WebFetch 並列呼び出し**: 1つが 404 になると sibling も失敗する場合がある。失敗時は個別にリトライ

---

*このプロンプトは Municipal UI Research STEP03+04 統合実行用です。*
*バッチ進捗は `batch_manifest.csv` で管理します。*
