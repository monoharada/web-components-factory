# STEP04 浅観測パイロット実行プロンプト

あなたはUIインスペクタです。日本の自治体ウェブサイトのHTMLを取得し、18種のUIコンポーネントの有無を機械的に判定してCSVに記録します。

---

## 絶対ルール

1. **推測禁止**: HTMLソースで確認できない要素は `false` / 空欄とする
2. **1ページ1行**: 各ページURLに対して observation_shallow_schema の1行を出力
3. **エビデンス記録**: 検出した要素のCSSセレクタまたはテキスト断片を `notes` に記録
4. **取得失敗も記録**: HTTP取得不能の場合も行を作り、`http_status` と `notes` に理由を残す
5. **robots.txt遵守**: アクセス拒否のページはスキップし理由を記録

---

## 入力データ

### 30自治体 × 5ページタイプ（最大137ページ）

```csv
sample_id,municipality_name,layer,population_category,region_block,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url
S0001,北海道,prefecture,unknown,hokkaido,https://www.pref.hokkaido.lg.jp/,https://www.pref.hokkaido.lg.jp/site-info/contact.html,https://www.pref.hokkaido.lg.jp/sm/ktk/saigai-bousai.html,https://www.pref.hokkaido.lg.jp/category/d007/,https://www.pref.hokkaido.lg.jp/ss/tkk/hodo/pressrelease/r7/247096.html
S0004,宮城県,prefecture,unknown,tohoku,https://www.pref.miyagi.jp/,https://www.pref.miyagi.jp/site/gyoseisabisu/soudan-index.html,https://www.pref.miyagi.jp/life/sub/5/index.html,https://www.pref.miyagi.jp/site/kosodate/index.html,https://www.pref.miyagi.jp/soshiki/densho/tinkon-press2026.html
S0013,東京都,prefecture,unknown,kanto,https://www.metro.tokyo.lg.jp/,https://www.metro.tokyo.lg.jp/tosei/iken-sodan/otoiawase/otoiawase/index.html,https://fukushi.metro.tokyo.lg.jp/kodomo/kosodate/teate/zidouteate/,https://www.metro.tokyo.lg.jp/kurashi/,https://www.metro.tokyo.lg.jp/information/press/2026/02/2026021210
S0027,大阪府,prefecture,unknown,kinki,https://www.pref.osaka.lg.jp/,https://www.pref.osaka.lg.jp/o070050/fumin/occ/index.html,https://www.pref.osaka.lg.jp/kenkoufukushi/kosodate/teate/index.html,https://www.pref.osaka.lg.jp/kenkoufukushi/kosodate/index.html,https://www.pref.osaka.lg.jp/hodo/fumin/o070110/prs_51141.html
S0047,沖縄県,prefecture,unknown,kyushu_okinawa,https://www.pref.okinawa.lg.jp/,https://www.pref.okinawa.lg.jp/kensei/kochokoho/1014932/1015136/index.html,https://www.pref.okinawa.lg.jp/kurashikankyo/passport/1005195.html,https://www.pref.okinawa.lg.jp/kurashikankyo/index.html,https://www.pref.okinawa.lg.jp/kensei/gikai/1016839/1037683/1037684.html
S0048,札幌市,municipality,A,hokkaido,https://www.city.sapporo.jp/,https://www.city.sapporo.jp/somu/shiminnokoe/iken/koukai_form.html,https://www.city.sapporo.jp/chuo/info/0202/jidouteate.html,https://www.city.sapporo.jp/kenko/kosodate/index.html,https://www.city.sapporo.jp/museum/oshirase/2025tejisitsunikki.html
S0049,旭川市,municipality,B,hokkaido,https://www.city.asahikawa.hokkaido.jp/,https://www.city.asahikawa.hokkaido.jp/1000/index.html,https://www.city.asahikawa.hokkaido.jp/kurashi/218/228/229/p004671.html,https://www.city.asahikawa.hokkaido.jp/kurashi/408/index.html,https://www.city.asahikawa.hokkaido.jp/700/723/735/d083393.html
S0051,帯広市,municipality,C,hokkaido,https://www.city.obihiro.hokkaido.jp/,https://www.city.obihiro.hokkaido.jp/shisei/gaiyo/soshiki/1006025/index.html,https://www.city.obihiro.hokkaido.jp/kyoiku/kosodate/teate/1017578.html,https://www.city.obihiro.hokkaido.jp/kurashi/gomi/index.html,https://www.city.obihiro.hokkaido.jp/shisei/mayor/kaiken/1017170/1019208.html
S0084,郡山市,municipality,B,tohoku,https://www.city.koriyama.lg.jp/,https://www.city.koriyama.lg.jp/life/4/24/,https://www.city.koriyama.lg.jp/site/kosodate/1373.html,https://www.city.koriyama.lg.jp/site/kosodate/,https://www.city.koriyama.lg.jp/soshiki/23/171592.html
S0086,会津若松市,municipality,C,tohoku,https://www.city.aizuwakamatsu.fukushima.jp/,https://www.city.aizuwakamatsu.fukushima.jp/docs/2007080601965/,https://www.city.aizuwakamatsu.fukushima.jp/docs/2016111100025/,https://www.city.aizuwakamatsu.fukushima.jp/category/bunya/sougoukeikaku/01kosodate/,https://www.city.aizuwakamatsu.fukushima.jp/docs/2026020300010/
S0095,横浜市,municipality,A,kanto,https://www.city.yokohama.lg.jp/,https://www.city.yokohama.lg.jp/callcenter/call.html,https://www.city.yokohama.lg.jp/kosodate-kyoiku/oyakokenko/teate/teate/jite-gaiyou.html,https://www.city.yokohama.lg.jp/kosodate-kyoiku/index.html,https://www.city.yokohama.lg.jp/city-info/koho-kocho/press/seya/2025/0204seyairodori.html
S0104,川口市,municipality,B,kanto,https://www.city.kawaguchi.lg.jp/,https://www.city.kawaguchi.lg.jp/homepage/4550.html,https://www.city.kawaguchi.lg.jp/soshiki/01080/020/5/2/44350.html,https://www.city.kawaguchi.lg.jp/kurashi_tetsuzuki/gomi_risaikuru/2/index.html,https://www.city.kawaguchi.lg.jp/soshiki/06020/010/17/49662.html
S0111,新宿区,municipality,C,kanto,https://www.city.shinjuku.lg.jp/,https://www.city.shinjuku.lg.jp/kusei/file04_00002.html,https://www.city.shinjuku.lg.jp/kodomo/file03_04_00004.html,https://www.city.shinjuku.lg.jp/kenkou/index.html,https://www.city.shinjuku.lg.jp/whatsnew/pub/2026/0125-01.html
S0117,世田谷区,municipality,C,kanto,https://www.city.setagaya.lg.jp/,https://www.city.setagaya.lg.jp/02002/25858.html,https://www.city.setagaya.lg.jp/mokuji/kodomo/008/002/d00039056.html,https://www.city.setagaya.lg.jp/kodomokyouiku/kosodate/13020.html,https://www.city.setagaya.lg.jp/02006/31154.html
S0118,渋谷区,municipality,C,kanto,https://www.city.shibuya.tokyo.jp/,https://www.city.shibuya.tokyo.jp/kusei/kocho/opinionindex/inquiry.html,https://www.city.shibuya.tokyo.jp/kodomo/kodomo-teate-josei/kodomo-teate/jido_t.html,https://www.city.shibuya.tokyo.jp/kodomo/kodomo-teate-josei/kodomo-teate/,https://www.city.shibuya.tokyo.jp/contents/koho-news/1602/20260215_bousai.html
S0139,小笠原村,municipality,D,kanto,https://www.vill.ogasawara.tokyo.jp/,https://www.vill.ogasawara.tokyo.jp/toiawase/,,https://www.vill.ogasawara.tokyo.jp/sonmin/kosodate/,
S0153,金沢市,municipality,B,chubu,https://www4.city.kanazawa.lg.jp/,https://www4.city.kanazawa.lg.jp/23047.html,https://www4.city.kanazawa.lg.jp/soshikikarasagasu/kosodateshienka/gyomuannai/2/1/9397.html,https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/jidoteate_jidofuyoteate/index.html,https://www4.city.kanazawa.lg.jp/news/30509.html
S0162,長岡市,municipality,C,chubu,https://www.city.nagaoka.niigata.jp/,https://www.city.nagaoka.niigata.jp/other/toiawase.html,https://www.city.nagaoka.niigata.jp/kosodate/cate01/child-allowance/index.html,https://www.city.nagaoka.niigata.jp/kosodate/index.html,https://www.city.nagaoka.niigata.jp/shisei/cate02/blog/20260104-1.html
S0178,佐渡市,municipality,D,chubu,https://www.city.sado.niigata.jp/,,https://www.city.sado.niigata.jp/soshiki/2010/3996.html,https://www.city.sado.niigata.jp/life/1/9/56/,
S0201,姫路市,municipality,B,kinki,https://www.city.himeji.lg.jp/,https://www.city.himeji.lg.jp/anzen/0000007110.html,https://www.city.himeji.lg.jp/waku2child/0000013458.html,https://www.city.himeji.lg.jp/kurashi/index.html,https://www.city.himeji.lg.jp/shisei/0000032587.html
S0204,四日市市,municipality,C,kinki,https://www.city.yokkaichi.lg.jp/,,https://www.city.yokkaichi.lg.jp/www/contents/1740701284355/index.html,,https://www.city.yokkaichi.lg.jp/www/contents/1767598860957/index.html
S0234,山口市,municipality,C,chugoku,https://www.city.yamaguchi.lg.jp/,https://www.city.yamaguchi.lg.jp/ques/questionnaire.php?openid=3,https://www.city.yamaguchi.lg.jp/site/kodomo/3711.html,https://www.city.yamaguchi.lg.jp/life/1/,https://www.city.yamaguchi.lg.jp/soshiki/16/188549.html
S0238,東広島市,municipality,C,chugoku,https://www.city.higashihiroshima.lg.jp/,https://www.city.higashihiroshima.lg.jp/toiawase.html,https://www.city.higashihiroshima.lg.jp/soshiki/kodomomirai/1/5/3022.html,https://www.city.higashihiroshima.lg.jp/kurashi/index.html,https://www.city.higashihiroshima.lg.jp/soshiki/somu/2/1/8/2/1/44657.html
S0250,松山市,municipality,B,shikoku,https://www.city.matsuyama.ehime.jp/,,https://www.city.matsuyama.ehime.jp/kurashi/fukushi/jido/jidouteate.html,https://www.city.matsuyama.ehime.jp/kurashi/index.html,https://www.city.matsuyama.ehime.jp/shicho/kaiken/260210.html
S0252,今治市,municipality,C,shikoku,https://www.city.imabari.ehime.jp/,,https://www.city.imabari.ehime.jp/kodomo/fukusi/jidouteate/,,
S0265,福岡市,municipality,A,kyushu_okinawa,https://www.city.fukuoka.lg.jp/,https://www.city.fukuoka.lg.jp/soudan/index.html,https://www.city.fukuoka.lg.jp/kodomo-mirai/k-katei/child/kodomoteate.html,,https://www.city.fukuoka.lg.jp/kyoiku/kikaku/ed/166.html
S0272,鹿児島市,municipality,B,kyushu_okinawa,https://www.city.kagoshima.lg.jp/,https://www.city.kagoshima.lg.jp/soumu/soumu/jousys/soshiki/iken.html,https://www.city.kagoshima.lg.jp/faq-kosodate-kyoiku/kodomofuku/q31.html,https://www.city.kagoshima.lg.jp/kosodate/kosodate/teate/index.html,https://www.city.kagoshima.lg.jp/senkyokanri/senkyokanri/konzatujyoukyou.html
S0274,佐賀市,municipality,C,kyushu_okinawa,https://www.city.saga.lg.jp/,https://www.city.saga.lg.jp/main/55234.html,https://www.city.saga.lg.jp/main/3789.html,https://www.city.saga.lg.jp/main/84805.html,https://www.city.saga.lg.jp/main/100390.html
S0286,沖縄市,municipality,C,kyushu_okinawa,https://www.city.okinawa.okinawa.jp/,https://www.city.okinawa.okinawa.jp/k003/otoiawase.html,https://www.city.okinawa.okinawa.jp/k028/kosodate/kosodateshien/jidouteate/p00001.html,https://www.city.okinawa.okinawa.jp/kosodate/kosodateshien/jidouteate/index.html,
S0298,奄美市,municipality,D,kyushu_okinawa,https://www.city.amami.lg.jp/,https://www.city.amami.lg.jp/kikaku/shise/koho/soudan.html,https://www.city.amami.lg.jp/fukushi/20150219-3.html,https://www.city.amami.lg.jp/wpm/kodomokosodate.html,
```

---

## 分析手順（1ページあたり）

### Step 1: ページ取得
- WebFetchでページHTMLを取得
- `http_status`: 200, 301, 403, 404, timeout 等を記録
- `final_url`: リダイレクト後の最終URLを記録
- 取得失敗時は `notes` に理由を書いて次のページへ進む

### Step 2: メタ情報抽出
- `page_title`: `<title>` タグの内容
- `lang_attr`: `<html lang="...">` の値
- `cms_fingerprint`: `<meta name="generator">` の値、または特徴的なクラス名/パス構造から推定
  - 例: `/www/contents/` → Joruri CMS, `/site/` → CMS不明だが構造型, `wp-content` → WordPress
- `theme_vendor_hint`: CSSファイル名やコメントからベンダー推定（不明なら空欄）

### Step 3: 18種UIコンポーネント検出

以下の各コンポーネントについて、HTMLソース内で確認し true/false を判定する。

#### 3.1 レイアウト系（3種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_skip_link` | スキップリンク | `<a href="#main">`, `<a href="#content">`, `<a class="skip-link">`, テキスト「本文へ」「メインへ」「コンテンツへ」を含むページ上部のリンク |
| `has_header_brand` | ヘッダーの自治体名/ロゴ | `<header>` 内の `<a href="/">` にロゴ画像またはサイト名テキストがある |
| `has_footer_policies` | フッターのポリシーリンク群 | `<footer>` 内に「個人情報」「著作権」「アクセシビリティ」「免責」等へのリンクがある |

#### 3.2 ナビゲーション系（3種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_global_nav` | グローバルナビ | `<nav>` 要素 + `<ul><li><a>` のリスト構造。テキスト「くらし」「防災」「子育て」「観光」「事業者」等 |
| `global_nav_variant` | バリアント | `horizontal`（横並び）/ `dropdown`（ドロップダウン）/ `mega`（メガメニュー）/ `drawer`（ドロワー/ハンバーガー） |
| `has_breadcrumb` | パンくずリスト | `<nav aria-label="パンくず">`, `<ol class="breadcrumb">`, テキスト「ホーム >」パターン。トップページでは通常 false |
| `has_local_nav` | サイドナビ | `<aside>` 内の `<nav>` または `.side-nav`, `.local-nav`。カテゴリ内のサブナビゲーション |

#### 3.3 検索系（1種 + バリアント）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_search` | サイト内検索 | `<form role="search">`, `<input type="search">`, `<input placeholder="検索">`, テキスト「検索」付きフォーム |
| `search_variant` | バリアント | `header`（ヘッダー内）/ `fullpage`（検索専用ページ） |

#### 3.4 お知らせ系（1種 + バリアント）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_emergency_notice` | 緊急情報バナー | ページ上部の `.emergency`, `.alert`, `[role="alert"]`, 背景色つきバナー。テキスト「緊急」「重要なお知らせ」「警報」。**注意**: 通常の「お知らせ」欄とは区別すること。赤/黄色背景、目立つ位置、緊急性の高い内容（災害・感染症等）が条件 |
| `emergency_variant` | バリアント | `banner`（帯状）/ `ticker`（スクロール）/ `modal`（ポップアップ） |

#### 3.5 コンテンツ系（6種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_news_list` | お知らせ一覧 | `<ul>` or `<dl>` 内に日付（`<time>`, `YYYY年MM月DD日`）+ リンクの繰り返しパターン。テキスト「お知らせ」「新着情報」 |
| `has_pickup` | ピックアップ枠 | `.pickup`, `.featured`, テキスト「ピックアップ」「注目」。通常の一覧とは別の目立つ枠 |
| `has_carousel` | カルーセル/スライダー | `.swiper`, `.slider`, `.carousel`, `.slick`, `owl-carousel`。画像のスライド表示 |
| `has_hub_cards` | カテゴリ導線カード群 | 複数の `<a>` を含むグリッド/フレックスレイアウト。各カードにアイコン+テキスト（「くらし」「子育て」「防災」等）。**トップページとハブページで検出されやすい** |
| `hub_cards_variant` | バリアント | `icon`（アイコン付き）/ `image`（画像付き）/ `text`（テキストのみ） |
| `has_attachments` | PDF/添付ファイルリンク | `<a href="....pdf">`, `.attachments`, テキスト「PDF」「様式」 |
| `attachments_variant` | バリアント | `pdf` / `doc` / `xls` / `mixed` |

#### 3.6 問い合わせ系（2種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_contact_info` | 問い合わせ先ブロック | `<a href="tel:">`, テキスト「電話」「所在地」「開庁時間」「〒」、住所パターン |
| `has_contact_form` | 問い合わせフォーム | `<form>` + `<input>` + `<textarea>`, テキスト「お問い合わせ」 |
| `contact_form_variant` | バリアント | `simple`（1ページ完結）/ `multi_step`（ステップ式）/ `external`（外部フォームへリンク） |

#### 3.7 記事系（1種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_article_meta` | 記事メタ情報 | `<time>` 要素 + テキスト「公開日」「更新日」「掲載日」、カテゴリタグ。**主にarticle/serviceページで検出** |
| `has_toc` | ページ内目次 | `<nav aria-label="目次">`, `.toc`, `#toc`, テキスト「目次」+ ページ内リンク（`href="#..."` のリスト） |

#### 3.8 ユーティリティ系（1種）

| カラム | 検出対象 | 検出方法 |
|--------|---------|---------|
| `has_accessibility_link` | アクセシビリティ方針ページへのリンク | フッター等のリンクにテキスト「アクセシビリティ」「ウェブアクセシビリティ」を含む |
| `accessibility_url` | そのリンクURL | リンクのhref値を記録 |

### Step 4: 品質スコア（簡易評価）

| カラム | 評価方法 | 値 |
|--------|---------|---|
| `heading_outline_score` | 見出し階層の品質: `<h1>`が1つ、`<h2>`〜`<h6>`が論理的な順序で使われているか | `good`（適切）/ `fair`（概ね適切だが一部飛ばしあり）/ `poor`（h1複数、飛ばし多数） |
| `keyboard_nav_risk` | キーボードナビゲーションのリスク | `low`（tabindexの濫用なし）/ `medium`（一部問題あり）/ `high`（tabindex多数、フォーカストラップ懸念） |
| `contrast_risk_hint` | コントラストのリスク推定 | `low`（標準的な配色）/ `medium`（薄い色のテキストあり）/ `high`（読みにくい可能性高） ※HTMLのみから推定困難な場合は空欄可 |

---

## 出力フォーマット

### CSVヘッダー（1行目）

```
sample_id,prefecture,municipality_name,layer,population_category,page_type,page_url,captured_at,http_status,final_url,page_title,lang_attr,cms_fingerprint,theme_vendor_hint,has_skip_link,has_header_brand,has_global_nav,global_nav_variant,has_search,search_variant,has_breadcrumb,has_local_nav,has_emergency_notice,emergency_variant,has_news_list,has_pickup,has_carousel,has_hub_cards,hub_cards_variant,has_footer_policies,has_accessibility_link,accessibility_url,has_contact_info,has_contact_form,contact_form_variant,has_article_meta,has_toc,has_attachments,attachments_variant,heading_outline_score,keyboard_nav_risk,contrast_risk_hint,notes,evidence_dom_snippets_path,screenshot_path
```

### データ行の例

```
S0001,北海道,北海道,prefecture,unknown,top,https://www.pref.hokkaido.lg.jp/,2026-02-14T18:00:00+09:00,200,https://www.pref.hokkaido.lg.jp/,北海道庁,ja,Joruri CMS,,true,true,true,mega,true,header,false,false,false,,true,true,true,true,icon,true,true,https://www.pref.hokkaido.lg.jp/.../accessibility.html,false,false,,false,false,false,,good,low,,"[skip] a.skip-link; [gnav] nav#global-nav ul>li>a; [search] form[role=search]; [news] ul.news-list",,
```

### カラム詳細

- `page_type`: `top` / `contact` / `service` / `hub` / `article` のいずれか
- `captured_at`: ISO 8601形式（JST）
- boolean カラム: `true` / `false`（文字列）
- variant カラム: 該当する値 or 空欄
- `notes`: 検出エビデンスを `[component] selector_or_text` 形式で列挙（セミコロン区切り）
- `evidence_dom_snippets_path`: 空欄（本パイロットでは未使用）
- `screenshot_path`: 空欄（本パイロットでは未使用）

---

## バッチ処理計画

30自治体を6バッチに分割して処理する。各バッチ終了時に部分CSVを出力し、最終的に結合する。

| バッチ | 自治体 | 推定ページ数 |
|--------|--------|------------|
| 1 | 北海道, 宮城県, 東京都, 大阪府, 沖縄県 | 25 |
| 2 | 札幌市, 旭川市, 帯広市, 郡山市, 会津若松市 | 25 |
| 3 | 横浜市, 川口市, 新宿区, 世田谷区, 渋谷区 | 25 |
| 4 | 小笠原村, 金沢市, 長岡市, 佐渡市, 姫路市 | 21 |
| 5 | 四日市市, 山口市, 東広島市, 松山市, 今治市 | 19 |
| 6 | 福岡市, 鹿児島市, 佐賀市, 沖縄市, 奄美市 | 22 |

### バッチ内の処理順序

1. 自治体ごとに `top` → `contact` → `service` → `hub` → `article` の順でページを取得
2. 空欄（NOT_FOUND）のURLはスキップ
3. 同一オリジンへの連続アクセスは3秒以上の間隔を空ける

---

## 成功基準

| 指標 | 目標 |
|------|------|
| ページ取得成功率 | >= 90%（137ページ中123ページ以上） |
| 全boolean カラムが true/false で埋まっている | 100%（取得成功ページ） |
| notes にエビデンスが記録されている | true判定の全件 |
| CSV形式が正しい（カラム数一致、型整合） | 100% |

---

## 出力ファイル

完成CSVを以下に保存:
- `observations_shallow_pilot.csv` （全137行のCSV）

---

## 注意事項

1. **緊急バナーの誤検出に注意**: 「重要なお知らせ」は通常の情報欄である場合が多い。赤/黄色の警告色、災害・感染症など緊急性の高い内容である場合のみ `true`
2. **トップページ特有の要素**: `has_news_list`, `has_pickup`, `has_carousel`, `has_hub_cards` はトップページで検出されやすい。service/article ページでは false になることが多い
3. **パンくずリスト**: トップページでは通常 false（自身がルートのため）
4. **問い合わせフォーム**: contactページで主に検出。service/articleページでは稀
5. **記事メタ**: article/serviceページで主に検出。トップページでは稀
6. **CMS推定のヒント**: URL構造、HTMLコメント、meta generator、特徴的なクラス名から推定
   - `www/contents/` → Joruri CMS
   - `wp-content` → WordPress
   - `site/` → サイト構築ツール系
   - `soshiki/` → 組織別CMS
   - `category/bunya/` → 分野別CMS
