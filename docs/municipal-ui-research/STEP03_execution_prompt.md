# STEP03 URL Discovery 実行プロンプト

> **用途**: 別セッション（Claude Code / Conductor / etc.）にコピーして実行するための自己完結型プロンプト。
> **前提ツール**: WebFetch, WebSearch, Bash(curl) のいずれか1つ以上が使用可能であること。

---

## プロンプト本文（ここから下をコピー）

---

あなたは日本の自治体ウェブサイト調査の専門エージェントです。以下のタスクを正確に実行してください。

## タスク概要

30の日本の自治体（都道府県5 + 市区町村25）の公式サイトにアクセスし、各サイトから **5種類のページURL** を発見・記録してください。

## 絶対ルール

1. **推測禁止**: 実際にWebページにアクセスして確認したURLのみ記録する。未確認URLは絶対に書かない。
2. **見つからなければ空欄**: 無理に埋めない。空欄のまま notes に「NOT_FOUND: 理由」を記録。
3. **根拠記録**: 各URLの発見経路を notes に記録（例: "footer link 'お問い合わせ'"）。
4. **ドメイン一致**: URLは official_site_url と同一ドメインまたはそのサブドメインのみ。外部サイトは不可。
5. **レート配慮**: 同一サイトへの連続アクセスは1-2秒間隔をあける。

## 5つのページタイプ定義

| # | カラム名 | 何を探すか | 判定基準 |
|---|---------|-----------|---------|
| 1 | `top_page_url` | トップページ | official_site_url にアクセスして最終到達URL。リダイレクトがあれば最終URLを記録 |
| 2 | `contact_page_url` | お問い合わせページ | 自治体全体の代表問い合わせ先（電話/住所/フォーム）。各課個別ではなく総合案内を優先 |
| 3 | `service_page_url` | 行政手続き詳細ページ | 「児童手当」「転入届」「住民票」など住民向け手続きの個別説明ページ（「対象者」「必要書類」等の記載があるもの）。一覧ページではなく個別詳細 |
| 4 | `hub_page_url` | カテゴリハブページ | 「くらし」「子育て」等のカテゴリトップで、複数の手続き/サービスへのリンク集になっているページ。service_page_url とは別のURLであること |
| 5 | `article_page_url` | お知らせ記事ページ | 新着情報/お知らせの **個別記事**（一覧ページではない）。日付・タイトル・本文がある。できるだけ直近の記事 |

## 探索手順（各自治体ごとに上から順に実行）

### Step 1: トップページ確認
- `official_site_url` にアクセス（WebFetch）
- HTTP 200 なら top_page_url に記録
- リダイレクトされた場合は最終URLを記録

### Step 2: トップページのリンク解析
トップページのHTMLから以下を探す:

**contact を探す場所（優先順）:**
1. `<footer>` 内のリンクで「お問い合わせ」「問い合わせ」「ご意見」テキストを含むもの
2. `<header>` / `<nav>` 内の「お問い合わせ」リンク
3. ページ内の `a[href]` で上記テキストを含むもの

**hub を探す場所:**
1. グローバルナビ（`<nav>`）の第1階層リンクで「くらし」「暮らし」「子育て」「健康」等
2. メインコンテンツのカテゴリカード/アイコングリッド

**service を探す場所:**
1. グローバルナビの子メニューで「児童手当」「転入届」「住民票」等
2. トップページの「よくある手続き」「人気の手続き」セクション
3. hub_page_url にアクセスして、そこから個別手続きページへ辿る
- **重要**: hub と service が同じURLにならないこと。hub=カテゴリ一覧、service=個別手続き詳細

**article を探す場所:**
1. トップページの「新着情報」「お知らせ」「トピックス」セクション内のリンク
2. 一覧ページではなく、**日付付きの個別記事リンク** を選ぶ
3. 「一覧を見る」「もっと見る」は除外。記事タイトルのリンクを選ぶ

### Step 3: 補完（Step 2 で見つからないものがあれば）
- WebSearch で `site:{domain} お問い合わせ` 等を検索
- 検索結果のURLにアクセスして存在確認してから記録

## 対象30自治体リスト

以下のCSVデータが入力です。`top_page_url` 〜 `article_page_url` の5列を埋めてください。

```csv
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,notes
S0001,010006,北海道,北海道,prefecture,unknown,hokkaido,https://www.pref.hokkaido.lg.jp/,,,,,,prefecture_site,総務省コード一覧より
S0004,040002,宮城県,宮城県,prefecture,unknown,tohoku,https://www.pref.miyagi.jp/,,,,,,prefecture_site,総務省コード一覧より
S0013,130001,東京都,東京都,prefecture,unknown,kanto,https://www.metro.tokyo.lg.jp/,,,,,,prefecture_site,総務省コード一覧より
S0027,270008,大阪府,大阪府,prefecture,unknown,kinki,https://www.pref.osaka.lg.jp/,,,,,,prefecture_site,総務省コード一覧より
S0047,470007,沖縄県,沖縄県,prefecture,unknown,kyushu_okinawa,https://www.pref.okinawa.jp/,,,,,,prefecture_site,総務省コード一覧より
S0048,011002,北海道,札幌市,municipality,A,hokkaido,https://www.city.sapporo.jp/,,,,,,designated_city,政令指定都市
S0049,012041,北海道,旭川市,municipality,B,hokkaido,https://www.city.asahikawa.hokkaido.jp/,,,,,,core_city,中核市
S0051,012076,北海道,帯広市,municipality,C,hokkaido,https://www.city.obihiro.hokkaido.jp/,,,,,,population_top,人口約16万
S0084,072036,福島県,郡山市,municipality,B,tohoku,https://www.city.koriyama.lg.jp/,,,,,,core_city,中核市
S0086,072028,福島県,会津若松市,municipality,C,tohoku,https://www.city.aizuwakamatsu.fukushima.jp/,,,,,,regional_balance,人口約11万
S0095,141003,神奈川県,横浜市,municipality,A,kanto,https://www.city.yokohama.lg.jp/,,,,,,designated_city,政令指定都市
S0104,112038,埼玉県,川口市,municipality,B,kanto,https://www.city.kawaguchi.lg.jp/,,,,,,core_city,中核市
S0111,131041,東京都,新宿区,municipality,C,kanto,https://www.city.shinjuku.lg.jp/,,,,,,special_ward,特別区
S0117,131121,東京都,世田谷区,municipality,C,kanto,https://www.city.setagaya.lg.jp/,,,,,,special_ward,特別区
S0118,131130,東京都,渋谷区,municipality,C,kanto,https://www.city.shibuya.tokyo.jp/,,,,,,special_ward,特別区
S0139,134210,東京都,小笠原村,municipality,D,kanto,https://www.vill.ogasawara.tokyo.jp/,,,,,,island_municipality,離島
S0153,172014,石川県,金沢市,municipality,B,chubu,https://www4.city.kanazawa.lg.jp/,,,,,,core_city,中核市・県庁所在地
S0162,152021,新潟県,長岡市,municipality,C,chubu,https://www.city.nagaoka.niigata.jp/,,,,,,population_top,人口約26万
S0178,152242,新潟県,佐渡市,municipality,D,chubu,https://www.city.sado.niigata.jp/,,,,,,island_municipality,離島
S0201,282014,兵庫県,姫路市,municipality,B,kinki,https://www.city.himeji.lg.jp/,,,,,,core_city,中核市
S0204,242021,三重県,四日市市,municipality,C,kinki,https://www.city.yokkaichi.lg.jp/,,,,,,population_top,人口約31万
S0234,352039,山口県,山口市,municipality,C,chugoku,https://www.city.yamaguchi.lg.jp/,,,,,,prefecture_capital,県庁所在地
S0238,342122,広島県,東広島市,municipality,C,chugoku,https://www.city.higashihiroshima.lg.jp/,,,,,,population_top,人口約19万
S0250,382019,愛媛県,松山市,municipality,B,shikoku,https://www.city.matsuyama.ehime.jp/,,,,,,core_city,中核市・県庁所在地
S0252,382027,愛媛県,今治市,municipality,C,shikoku,https://www.city.imabari.ehime.jp/,,,,,,regional_balance,人口約15万
S0265,401307,福岡県,福岡市,municipality,A,kyushu_okinawa,https://www.city.fukuoka.lg.jp/,,,,,,designated_city,政令指定都市
S0272,462012,鹿児島県,鹿児島市,municipality,B,kyushu_okinawa,https://www.city.kagoshima.lg.jp/,,,,,,core_city,中核市・県庁所在地
S0274,412015,佐賀県,佐賀市,municipality,C,kyushu_okinawa,https://www.city.saga.lg.jp/,,,,,,prefecture_capital,県庁所在地
S0286,472115,沖縄県,沖縄市,municipality,C,kyushu_okinawa,https://www.city.okinawa.okinawa.jp/,,,,,,regional_balance,人口約14万
S0298,462225,鹿児島県,奄美市,municipality,D,kyushu_okinawa,https://www.city.amami.lg.jp/,,,,,,island_municipality,離島・奄美大島
```

## 出力形式

### 1. メイン成果物: CSV（上記CSVの5列 URL を埋めたもの）

ファイル名: `roster_pilot_30_with_pages.csv`

- 上記CSVと同じ15列構成
- `top_page_url` 〜 `article_page_url` に発見したURLを記入
- `notes` 列に既存の内容 + URL発見根拠を `|` 区切りで追記

**notes 記載フォーマット例:**
```
総務省コード一覧より | [top] 200 OK; [contact] footer "お問い合わせ"; [service] gnav>くらし>子育て>児童手当; [hub] gnav "くらしの情報"; [article] 新着情報セクション 2026-02-10記事
```

### 2. 補助成果物: 実行サマリー

以下の統計を報告してください:

```
## STEP03 パイロット実行サマリー

### 充足率
| ページタイプ | 発見数/30 | 充足率 | 目標 |
|------------|----------|-------|------|
| top_page_url | ?/30 | ?% | 100% |
| contact_page_url | ?/30 | ?% | 83%以上 |
| service_page_url | ?/30 | ?% | 67%以上 |
| hub_page_url | ?/30 | ?% | 67%以上 |
| article_page_url | ?/30 | ?% | 67%以上 |

### 問題があった自治体
| sample_id | 自治体名 | 問題内容 |
|-----------|---------|---------|
| | | |

### 発見メソッド統計
| メソッド | 使用回数 |
|---------|---------|
| トップページリンク解析 | ? |
| Web検索フォールバック | ? |
| サイトマップ活用 | ? |
```

## 作業の進め方

### 推奨: 5自治体ずつバッチ処理

30自治体を一度にやるとコンテキストが溢れるため、以下のバッチに分けて処理してください:

**バッチ1（都道府県5件）:** S0001, S0004, S0013, S0027, S0047
**バッチ2（政令市+北海道）:** S0048, S0049, S0051, S0084, S0086
**バッチ3（関東）:** S0095, S0104, S0111, S0117, S0118
**バッチ4（離島+中部）:** S0139, S0153, S0162, S0178, S0201
**バッチ5（近畿〜四国）:** S0204, S0234, S0238, S0250, S0252
**バッチ6（九州・沖縄）:** S0265, S0272, S0274, S0286, S0298

各バッチの手順:
1. バッチ内の各自治体の official_site_url にアクセス（WebFetch）
2. トップページのHTML内容からリンクを解析
3. 5つのURLを特定（または NOT_FOUND を記録）
4. バッチ結果をCSV行として記録
5. 次のバッチへ

### 各自治体の処理テンプレート

```
## {sample_id}: {municipality_name}

1. WebFetch: {official_site_url} → top_page_url 確認
2. HTMLからリンク解析:
   - footer/header で「お問い合わせ」→ contact_page_url
   - nav で「くらし」等 → hub_page_url
   - nav 子メニューで「児童手当」等 → service_page_url
   - 「新着情報」セクションの個別記事 → article_page_url
3. 未発見分は WebSearch で補完
4. 結果記録
```

## 探索キーワード辞書（参考）

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

## 合格基準

| 指標 | 合格ライン |
|------|----------|
| top_page_url 充足率 | 30/30 (100%) |
| contact_page_url 充足率 | 25/30以上 (83%) |
| service_page_url 充足率 | 20/30以上 (67%) |
| hub_page_url 充足率 | 20/30以上 (67%) |
| article_page_url 充足率 | 20/30以上 (67%) |
| 全URLの有効性 | 記録したURL全てがHTTP 200到達 |

**不合格の場合**: 充足率が低いページタイプについて、探索キーワードを変えて再試行してください。

---

*このプロンプトは Municipal UI Codex Pack v1 の STEP03 パイロット実行用です。*
*30自治体の結果がOKなら、同じ手法で残り270自治体に拡大します。*
