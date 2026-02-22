# STEP04 パイロット検証準備文書

作成日: 2026-02-14
ステータス: 準備完了・レビュー待ち

---

## 1. 目的

本番の300団体クロール（STEP04）に先立ち、パイロット30団体でUI検出精度を検証する。
検出ルールの妥当性、スキーマの網羅性、クロール安定性を確認し、合格基準を満たした上で本番に進む。

### 1.1 合格基準（計画書確定済み）

| 指標 | 閾値 | 測定方法 |
|------|------|----------|
| Precision（適合率） | >= 85% | 検出した部品のうち、正しいものの割合 |
| Recall（再現率） | >= 75% | 実際に存在する部品のうち、検出できたものの割合 |
| ページ取得失敗率 | <= 10% | HTTP 200以外またはタイムアウトの割合 |
| CSV整合性 | 100% | スキーマ準拠・データ型一致・欠損なし |

---

## 2. パイロット30自治体の選定基準

### 2.1 層化条件（必須）

#### 2.1.1 人口カテゴリ配分

300団体全体の分布比率に近似させ、各カテゴリの検出特性を検証する。

| カテゴリ | 300団体での概算比率 | パイロット30件 | 根拠 |
|---------|-------------------|---------------|------|
| A（政令指定都市） | ~7% (20/300) | **3件** | 大規模・複雑なUI構造の代表 |
| B（中核市・大規模市） | ~18% (50/300) | **7件** | CMS多様性が高い層 |
| C（一般市・特別区） | ~38% (110/300) | **12件** | 最大母集団・検出精度の統計的信頼性確保 |
| D（町村・小規模市） | ~27% (75/300) | **8件** | シンプル構造・検出漏れリスクの確認 |
| **合計** | | **30件** | |

**注**: 都道府県サイト（prefecture層）は上記カテゴリとは別軸で5件を確保する（下記layer配分参照）。都道府県サイトの人口カテゴリはA相当として扱うが、UIの性質が市区町村とは異なるため独立して評価する。

#### 2.1.2 layer配分

| layer | パイロット30件 | 根拠 |
|-------|--------------|------|
| prefecture | **5件** | 都道府県サイト固有のUI構造（ポータル型・部局型）を検証 |
| municipality | **25件** | 市区町村サイトの多様なUI構造をカバー |

#### 2.1.3 地域ブロック配分

全8ブロックから最低2件ずつ確保し、地域特有のCMS/ベンダー偏りに対応する。

| ブロック | region_block | 最低件数 | 推奨件数 | 根拠 |
|---------|-------------|---------|---------|------|
| 北海道 | hokkaido | 2 | 2-3 | 1ブロック1道のため最小 |
| 東北 | tohoku | 2 | 3-4 | 6県・UI多様性中程度 |
| 関東 | kanto | 2 | 5-6 | 最大母集団・CMS多様性高 |
| 中部 | chubu | 2 | 3-4 | 9県・ベンダー分散 |
| 近畿 | kinki | 2 | 3-4 | 7県・大都市圏含む |
| 中国 | chugoku | 2 | 2-3 | 5県・中規模自治体中心 |
| 四国 | shikoku | 2 | 2-3 | 4県・小規模自治体多 |
| 九州沖縄 | kyushu_okinawa | 2 | 3-4 | 8県・離島含む |
| **合計** | | **16** (最低) | **30** | |

### 2.2 多様性条件（推奨）

パイロット30件では、以下の多様性を意図的に確保する。

#### 2.2.1 CMS/ベンダーの多様性

| 観点 | 目標 | 確認方法 |
|------|------|----------|
| CMSの種類 | 少なくとも5種類以上 | `cms_fingerprint` で事後確認 |
| ベンダー推定 | 少なくとも3社以上 | `theme_vendor_hint` で事後確認 |
| 独自開発 | 1-2件含む | 事前のURL/DOM構造確認 |

**注**: CMS情報はクロール前には不明な場合が多い。事前にトップページのソース確認（metaタグの `generator`、特徴的なCSS class名）で推定し、偏りを回避する。

#### 2.2.2 URL構造の多様性

| URL構造パターン | 期待件数 | 例 |
|----------------|---------|-----|
| `*.lg.jp` ドメイン | 10-15件 | www.city.example.lg.jp |
| 独自ドメイン（`*.jp`） | 8-12件 | www.city.example.jp |
| 都道府県ドメイン配下 | 3-5件 | www.pref.example.jp |
| その他（`*.go.jp`等） | 0-2件 | 特殊ケース |

#### 2.2.3 ページ構造の多様性

| 構造パターン | 目標件数 | 特徴 |
|------------|---------|------|
| シンプル（部品10種未満） | 5-8件 | 小規模自治体に多い |
| 標準（部品10-20種） | 12-15件 | 一般的な市町村サイト |
| 複雑（部品20種超） | 5-8件 | 政令市・都道府県に多い |

### 2.3 選定除外基準

以下に該当する自治体はパイロットから除外する。

| 除外理由 | 判定方法 |
|---------|----------|
| サイトリニューアル中（工事中表示） | トップページ目視確認 |
| robots.txt で全面クロール拒否 | robots.txt 事前取得 |
| アクセス不安定（3回中2回以上タイムアウト） | 事前疎通確認 |
| フレームセット等の極端に古い構造 | ソース確認 |
| 完全SPA（SSR無し、DOM解析不能） | ソース確認 |

### 2.4 選定の実行手順

```
入力: data/derived/roster_300.csv（300団体名簿）
出力: data/derived/roster_pilot_30.csv（パイロット30団体）
      data/derived/ground_truth_pilot.csv（手動検証結果）
```

#### Step 1: 層化サンプリング（自動）

1. `roster_300.csv` を `population_category` x `region_block` x `layer` の3軸で分類
2. 各セルからの抽出数を、上記2.1の配分に従って決定
3. 各セル内ではランダム抽出（seed値を固定して再現可能にする）
4. 最低配分を満たさないセルが出た場合、近隣セルから補填

#### Step 2: 多様性の手動調整

1. 抽出した30件のトップページURL群を目視確認
2. CMS推定（meta generator, HTML構造のパターン）
3. CMS/ベンダーが偏っている場合、同セル内で入替
4. URL構造が偏っている場合、同カテゴリ内で入替
5. 調整理由は `selection_reason` と `notes` に記録

#### Step 3: 事前疎通確認

1. 30件のトップURLに対してHTTP HEAD/GETリクエスト
2. タイムアウト（20秒）、非200レスポンス、リダイレクトループを検出
3. 失敗した場合、同セル内の別候補と入替

#### Step 4: Ground Truth作成

1. 30団体のうち **20団体** を手動検証対象として選定
   - 20団体の内訳: A 2件, B 5件, C 8件, D 5件
2. 各団体のトップページについて、shallow_schemaの全boolean/variantカラムを人手で判定
3. 判定結果を `data/derived/ground_truth_pilot.csv` に記録
4. 判定者は2名体制（1名判定 + 1名レビュー）でクロスチェック

#### Step 5: 出力CSVフォーマット

**roster_pilot_30.csv** のカラム:

```csv
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,pilot_selection_reason,notes
```

`pilot_selection_reason` カラムを追加し、パイロット選定理由を記録する:
- `stratified_random`: 層化ランダム抽出
- `diversity_swap`: 多様性調整で入替
- `manual_override`: 手動指定（理由をnotesに記載）

**ground_truth_pilot.csv** のカラム:

```csv
sample_id,page_url,page_type,evaluator,evaluation_date,has_skip_link_gt,has_header_brand_gt,has_global_nav_gt,global_nav_variant_gt,has_search_gt,search_variant_gt,has_breadcrumb_gt,has_local_nav_gt,has_emergency_notice_gt,emergency_variant_gt,has_news_list_gt,has_pickup_gt,has_carousel_gt,has_hub_cards_gt,hub_cards_variant_gt,has_footer_policies_gt,has_accessibility_link_gt,has_contact_info_gt,has_contact_form_gt,contact_form_variant_gt,has_article_meta_gt,has_toc_gt,has_attachments_gt,attachments_variant_gt,notes
```

`_gt` サフィックスは Ground Truth であることを明示する。

---

## 3. component_taxonomy.csv と observation_shallow_schema.csv の整合チェック

### 3.1 分析の全体像

| 区分 | 件数 | 説明 |
|------|------|------|
| taxonomy 定義数 | **44種** | component_taxonomy.csv の全行 |
| shallow_schema で直接検出 | **18種** | boolean/variantカラムで判定 |
| shallow_schema で間接検出 | **2種** | 他カラムから推定可能 |
| shallow_schema で検出対象外 | **25種** | STEP06（深層分析）で検出すべき（社会リンク群含む） |

### 3.2 shallow_schema で直接検出される18種

以下のtaxonomy項目は、shallow_schemaのboolean/variantカラムと1対1で対応する。

| # | taxonomy component_id | shallow_schema カラム | 検出方式 |
|---|----------------------|---------------------|----------|
| 1 | `layout.skip_link` | `has_skip_link` | boolean |
| 2 | `layout.header_brand` | `has_header_brand` | boolean |
| 3 | `layout.footer_policies` | `has_footer_policies` | boolean |
| 4 | `nav.global` | `has_global_nav` + `global_nav_variant` | boolean + variant |
| 5 | `nav.breadcrumb` | `has_breadcrumb` | boolean |
| 6 | `nav.sidenav` | `has_local_nav` | boolean |
| 7 | `nav.toc` | `has_toc` | boolean |
| 8 | `search.site` | `has_search` + `search_variant` | boolean + variant |
| 9 | `notice.emergency_banner` | `has_emergency_notice` + `emergency_variant` | boolean + variant |
| 10 | `content.news_list` | `has_news_list` | boolean |
| 11 | `content.pickup` | `has_pickup` | boolean |
| 12 | `content.carousel` | `has_carousel` | boolean |
| 13 | `content.hub_cards` | `has_hub_cards` + `hub_cards_variant` | boolean + variant |
| 14 | `content.pdf_links` | `has_attachments` + `attachments_variant` | boolean + variant |
| 15 | `contact.info_block` | `has_contact_info` | boolean |
| 16 | `contact.form` | `has_contact_form` + `contact_form_variant` | boolean + variant |
| 17 | `article.meta` | `has_article_meta` | boolean |
| 18 | `utility.accessibility_statement` | `has_accessibility_link` + `accessibility_url` | boolean + URL |

### 3.3 shallow_schema で間接検出される2種

以下はshallow_schemaの他カラムから間接的に推定できる。

| # | taxonomy component_id | 推定元カラム | 推定方法 | 信頼度 |
|---|----------------------|------------|----------|--------|
| 1 | `nav.hamburger` | `global_nav_variant` | variant値に `drawer` が含まれる場合 | 中 |
| 2 | `utility.privacy` | `has_footer_policies` + `notes` | フッターポリシーリンクの中に個人情報が含まれる場合 | 低 |

**注意**: これらは正確な検出ではなく推定であり、Precision/Recall算出には使用しない。

### 3.4 shallow_schema にカラムがあるが taxonomy に直接対応がないもの

以下のshallow_schemaカラムは、taxonomyの単一コンポーネントではなく、ページ全体の品質指標またはメタ情報として設計されている。

| # | shallow_schema カラム | 性質 | 関連する taxonomy（間接） |
|---|---------------------|------|------------------------|
| 1 | `cms_fingerprint` | メタ情報 | - (CMS識別、コンポーネントではない) |
| 2 | `theme_vendor_hint` | メタ情報 | - (ベンダー推定) |
| 3 | `heading_outline_score` | 品質スコア | 複数コンポーネントのセマンティクス評価 |
| 4 | `keyboard_nav_risk` | 品質スコア | 複数コンポーネントのa11y評価 |
| 5 | `contrast_risk_hint` | 品質スコア | 複数コンポーネントのa11y評価 |
| 6 | `lang_attr` | メタ情報 | `layout.language_switch` に間接関連 |
| 7 | `page_title` | メタ情報 | - |
| 8 | `http_status` / `final_url` | メタ情報 | - |

**結論**: shallow_schema にカラムがあるがtaxonomyに**対応がないもの**は存在しない。上記カラムは意図的にメタ情報/品質スコアとして設計されており、taxonomy（部品分類）とは異なるレイヤーの情報である。設計上の問題はない。

### 3.5 taxonomy に定義があるが shallow_schema では検出対象外の24種

これらはSTEP06（深層分析）で検出すべきコンポーネントである。

#### STEP06 deep_schema との対応

| # | taxonomy component_id | name_ja | deep_schema での対応カラム | 深層検出理由 |
|---|----------------------|---------|--------------------------|-------------|
| 1 | `layout.language_switch` | 言語切替 | （直接カラムなし、`multilingual_emergency` で間接参照） | ドロップダウン等の動的要素検出が必要 |
| 2 | `layout.font_size` | 文字サイズ変更 | （直接カラムなし） | ボタン動作の検証が必要 |
| 3 | `layout.contrast_toggle` | コントラスト/配色切替 | （直接カラムなし） | ボタン動作の検証が必要 |
| 4 | `nav.hamburger` | ハンバーガーメニュー | `has_mega_menu`（間接） | aria-expanded等の動的状態検出が必要 |
| 5 | `nav.sitemap` | サイトマップ | （直接カラムなし） | リンク先ページの存在確認が必要 |
| 6 | `nav.audience` | 利用者別導線 | `audience_segmentation` | 導線構造の詳細分析が必要 |
| 7 | `nav.life_event` | ライフイベントナビ | `life_event_nav` | 導線構造の詳細分析が必要 |
| 8 | `search.faceted` | 絞り込み検索 | `search_scope_options` | フォーム要素の詳細分析が必要 |
| 9 | `notice.covid` | 感染症等の特設 | （`emergency_*` で包括） | 緊急バナーとの区別が必要 |
| 10 | `notice.weather_disaster` | 気象・防災導線 | `disaster_portal_link`, `evacuation_info_link` | 外部リンク先の確認が必要 |
| 11 | `content.hero` | ヒーロー/メインビジュアル | （直接カラムなし） | 画像解析・レイアウト判定が必要 |
| 12 | `content.events` | イベント情報一覧 | `event_calendar_link` | カレンダー形式の判定が必要 |
| 13 | `content.quick_tasks` | よく使う手続き | `task_shortcuts_count` | ショートカット群の構造分析が必要 |
| 14 | `content.related_links` | 関連リンク束 | （直接カラムなし） | コンテキスト依存の判定が必要 |
| 15 | `content.faq` | FAQ | `service_has_faq` | アコーディオン/details構造の検出が必要 |
| 16 | `content.revision_history` | 更新履歴 | `service_has_revision_history` | 記事ページ固有の構造 |
| 17 | `content.department_badge` | 担当課/部署情報 | （`contact_has_department_list` で間接） | インライン要素の検出が必要 |
| 18 | `contact.department_list` | 担当課一覧 | `contact_has_department_list` | テーブル構造の詳細分析が必要 |
| 19 | `article.print` | 印刷ボタン | `print_button_present` | ボタン検出・onclick解析が必要 |
| 20 | `article.share` | SNSシェア | `share_buttons_present` | 外部サービスWidget検出が必要 |
| 21 | `article.feedback` | ページ評価 | `page_feedback_present` | フォーム要素の詳細分析が必要 |
| 22 | `utility.cookie_consent` | Cookie同意 | （直接カラムなし） | オーバーレイ・動的表示の検出が必要 |
| 23 | `utility.chatbot` | チャットボット | `chatbot_present` | iframe/Widget検出が必要 |
| 24 | `utility.open_data` | オープンデータ導線 | `open_data_link` | リンク先の確認が必要 |

**補足**: `utility.social_links`（SNSリンク群）はdeep_schemaの `sns_links` で検出される。taxonomyでは44種としてカウントされているが、上記24種の中にはカウントしていない。shallow_schemaの `notes` カラムに断片が記録される可能性があるため、グレーゾーンとして扱う。

再確認の結果: `utility.social_links` は shallow_schema には専用カラムがないため、検出対象外の24種に含めるべきである。正確には **25種** が shallow_schema 検出対象外となる。

#### 修正: 検出対象外は25種

| # | taxonomy component_id | name_ja | deep_schema での対応カラム | 深層検出理由 |
|---|----------------------|---------|--------------------------|-------------|
| 25 | `utility.social_links` | SNSリンク群 | `sns_links`（deep_schema） | フッター内の複数リンク群の判定が必要 |

### 3.6 整合性の総括

```
taxonomy 44種 (45カウント = 44種 + social_linksの再分類)
  |
  +-- shallow_schema 直接検出: 18種 (40.9%)
  +-- shallow_schema 間接推定:  1種 ( 2.3%)  ※nav.hamburger（Precision/Recall対象外）
  +-- deep_schema 検出対象:   25種 (56.8%)
  |     うち deep_schema に専用カラムあり: 17種
  |     うち deep_schema でも間接判定:      8種
  +-- 未対応:                  0種
```

**設計評価**: taxonomy 44種の全てが shallow_schema または deep_schema のいずれかでカバーされている。浅観測で約41%、深層分析で約57%、残り約2%が間接推定という配分は、段階的な検出精度向上の設計意図と整合している。

---

## 4. 検出ルールの懸念点と対策

### 4.1 `detection_dom_hints` の懸念点

taxonomy の `detection_dom_hints` に記載されたCSSセレクタについて、以下の懸念がある。

#### 4.1.1 セレクタの一般性が高すぎる（False Positive リスク）

| component_id | 問題のあるヒント | 懸念 | 対策案 |
|-------------|----------------|------|--------|
| `content.hub_cards` | `.card, .tile, .grid a` | `.card` はコンテンツカード以外にも広く使用される | 親要素のコンテキスト（トップページ、ハブページ内）を条件に追加 |
| `content.related_links` | `.related, .links` | `.links` は汎用的すぎる | `.related-links`, `[class*="related"]` に絞り込み |
| `article.share` | `a[href*='twitter'], a[href*='facebook']` | フッターSNSリンクとシェアボタンを区別できない | 記事本文近傍に限定する位置条件を追加 |
| `utility.social_links` | `.sns, a[href*='twitter'], a[href*='instagram']` | `article.share` と重複する | footer内に限定する位置条件を追加 |

#### 4.1.2 セレクタが古いまたは非標準（False Negative リスク）

| component_id | 問題のあるヒント | 懸念 | 対策案 |
|-------------|----------------|------|--------|
| `layout.skip_link` | `a[href^='#main'], a.skip, .skip-link` | `#content`, `#main-content` など異なるID名が多い | `a[href^='#'][class*='skip']` を追加 |
| `nav.global` | `nav[aria-label*='グローバル']` | aria-labelが日本語で「メインメニュー」「ナビゲーション」の場合もある | `nav[role='navigation']`, `header nav` を追加 |
| `search.site` | `form[role='search'] input[type='search']` | `input[type='text']` + placeholder="検索" パターンが多い | テキストヒントとの組み合わせ検出を追加 |
| `utility.accessibility_statement` | `a:contains('アクセシビリティ')` | `:contains()` は標準CSSセレクタではない（jQuery拡張） | DOM走査でテキスト検索に切り替え |

#### 4.1.3 動的コンテンツの検出困難

| component_id | 問題 | 対策案 |
|-------------|------|--------|
| `nav.hamburger` | aria-expanded のトグルが JavaScript 依存 | Playwrightで click 後のDOM変化を検出 |
| `content.carousel` | `.swiper` 等はJS初期化後にDOM生成される | waitForSelector で一定時間待機 |
| `utility.cookie_consent` | 初回訪問時のみ表示、Cookie保持で非表示化 | クリーンなブラウザプロファイルで毎回アクセス |
| `utility.chatbot` | iframe の遅延読み込み | DOMContentLoaded 後に追加の待機時間を設定 |

### 4.2 `detection_text_hints` の懸念点

| component_id | 問題のあるヒント | 懸念 | 対策案 |
|-------------|----------------|------|--------|
| `notice.emergency_banner` | `緊急, 重要, 警報` | 「重要なお知らせ」はニュースセクションでも使用される | DOMの位置（ページ上部）とスタイル（背景色等）を条件に追加 |
| `content.news_list` | `お知らせ, 新着` | 「新着情報」はフッターのRSSリンクにも出現する | リスト構造（`ul > li > a`）との共起を条件に追加 |
| `content.quick_tasks` | `よく使う, 人気, 手続き` | 「人気」は検索結果等にも出現する | トップページ上部の限定的な位置条件を追加 |
| `layout.language_switch` | `English, 中文, 한국어` | 翻訳されたコンテンツ内のテキストと区別困難 | ヘッダー/ナビ内の位置条件 + リンク（`a[hreflang]`）との共起 |

### 4.3 パイロットで優先検証すべき項目

上記の懸念点を踏まえ、パイロット30団体で特に注視すべき検出ルールを優先度順に整理する。

| 優先度 | 検出対象 | 検証観点 | パイロットでの確認方法 |
|--------|---------|----------|---------------------|
| **P0** | `has_skip_link` | False Negative（検出漏れ） | 20件のGround Truthと比較 |
| **P0** | `has_global_nav` + variant | variant分類の正確性 | 20件のGround Truthと比較 |
| **P0** | `has_search` + variant | 検索フォーム検出の網羅性 | 20件のGround Truthと比較 |
| **P1** | `has_emergency_notice` | False Positive（誤検出）リスク | 「重要なお知らせ」との区別精度 |
| **P1** | `has_hub_cards` + variant | False Positive リスク（`.card` の汎用性） | カード要素の位置コンテキスト評価 |
| **P1** | `has_breadcrumb` | 構造パターンの多様性 | ol/ul/microdata の検出率 |
| **P2** | `cms_fingerprint` | 推定精度 | 既知CMS 5種以上の判別率 |
| **P2** | `heading_outline_score` | スコアリング基準の妥当性 | 人手評価との相関確認 |
| **P2** | `has_carousel` | JS依存の検出 | Playwright待機時間の最適化 |

---

## 5. パイロット実行計画

### 5.1 タイムライン

| フェーズ | 作業内容 | 所要時間（目安） |
|---------|---------|-----------------|
| 5.1.1 | roster_300.csv からのパイロット30件抽出 | 1時間 |
| 5.1.2 | 事前疎通確認（30件のURL疎通チェック） | 30分 |
| 5.1.3 | 多様性の手動調整 | 1時間 |
| 5.1.4 | 検出スクリプトの実装/調整 | 2-4時間 |
| 5.1.5 | パイロットクロール実行 | 1-2時間 |
| 5.1.6 | Ground Truth 20件の手動作成 | 3-4時間 |
| 5.1.7 | Precision/Recall 算出と評価 | 1時間 |
| 5.1.8 | 検出ルール修正（不合格の場合） | 2-4時間 |
| 5.1.9 | 再実行と再評価 | 1-2時間 |

### 5.2 Precision/Recall の算出方法

#### 5.2.1 対象カラム（18種のboolean/variant）

Precision と Recall は、以下の18個のbooleanカラムについて、Ground Truth との比較で算出する。

```
has_skip_link, has_header_brand, has_global_nav, has_search,
has_breadcrumb, has_local_nav, has_emergency_notice, has_news_list,
has_pickup, has_carousel, has_hub_cards, has_footer_policies,
has_accessibility_link, has_contact_info, has_contact_form,
has_article_meta, has_toc, has_attachments
```

#### 5.2.2 算出式

```
Precision = TP / (TP + FP)
  TP: 自動検出=true かつ Ground Truth=true
  FP: 自動検出=true かつ Ground Truth=false

Recall = TP / (TP + FN)
  TP: 自動検出=true かつ Ground Truth=true
  FN: 自動検出=false かつ Ground Truth=true
```

マクロ平均（18カラムの平均）とマイクロ平均（全判定の合算）の両方を算出する。

#### 5.2.3 variant の評価

variant カラム（`global_nav_variant`, `search_variant` 等）は、booleanが一致している場合のみ、文字列完全一致で評価する。variant の一致率は参考値とし、合格基準には含めない（STEP06以降で精度向上を図る）。

### 5.3 不合格時の対応フロー

```
パイロット実行 → 精度算出
  |
  +-- 合格 → 本番300団体クロールに進行
  |
  +-- 不合格（Precision < 85%）
  |     → False Positive の多いカラムを特定
  |     → 検出ルール（DOM hints / Text hints）を修正
  |     → 再実行（最大2回まで）
  |
  +-- 不合格（Recall < 75%）
  |     → False Negative の多いカラムを特定
  |     → 検出ルールの追加（新しいセレクタ/テキストパターン）
  |     → 再実行（最大2回まで）
  |
  +-- 不合格（ページ取得失敗率 > 10%）
  |     → タイムアウト値/リトライ設定の調整
  |     → User-Agent の見直し
  |     → 再実行
  |
  +-- 3回再実行しても不合格
        → taxonomy / shallow_schema の設計見直し
        → 検出対象カラムの削減/統合を検討
        → ステアリングコミッティにエスカレーション
```

---

## 6. 付録

### 6.1 taxonomy 44種のカテゴリ別内訳

| カテゴリ | 件数 | shallow検出 | deep検出 |
|---------|------|------------|----------|
| layout | 6 | 3 | 3 |
| navigation | 8 | 3 | 5 |
| search | 2 | 1 | 1 |
| notice | 3 | 1 | 2 |
| content | 12 | 6 | 6 |
| forms (contact) | 3 | 2 | 1 |
| article | 4 | 1 | 3 |
| utility | 6 | 1 | 5 |
| **合計** | **44** | **18** | **26** |

**注**: 間接推定の1種（`nav.hamburger`）は deep 検出にカウントしている。shallow で間接推定していた `utility.privacy` も、正確な検出にはフッター内リンクのテキスト走査が必要なため deep 検出に含める。合計: shallow直接18 + deep26 = 44（taxonomy全数）。

### 6.2 shallow_schema カラムの完全マッピング

| shallow_schema カラム | 用途 | taxonomy対応 |
|---------------------|------|-------------|
| `sample_id` | ID | - |
| `prefecture` | メタ | - |
| `municipality_name` | メタ | - |
| `layer` | 層化 | - |
| `population_category` | 層化 | - |
| `page_type` | 分類 | - |
| `page_url` | メタ | - |
| `captured_at` | メタ | - |
| `http_status` | 品質 | - |
| `final_url` | メタ | - |
| `page_title` | メタ | - |
| `lang_attr` | メタ | layout.language_switch（間接） |
| `cms_fingerprint` | メタ | - |
| `theme_vendor_hint` | メタ | - |
| `has_skip_link` | 検出 | layout.skip_link |
| `has_header_brand` | 検出 | layout.header_brand |
| `has_global_nav` | 検出 | nav.global |
| `global_nav_variant` | 検出 | nav.global |
| `has_search` | 検出 | search.site |
| `search_variant` | 検出 | search.site |
| `has_breadcrumb` | 検出 | nav.breadcrumb |
| `has_local_nav` | 検出 | nav.sidenav |
| `has_emergency_notice` | 検出 | notice.emergency_banner |
| `emergency_variant` | 検出 | notice.emergency_banner |
| `has_news_list` | 検出 | content.news_list |
| `has_pickup` | 検出 | content.pickup |
| `has_carousel` | 検出 | content.carousel |
| `has_hub_cards` | 検出 | content.hub_cards |
| `hub_cards_variant` | 検出 | content.hub_cards |
| `has_footer_policies` | 検出 | layout.footer_policies |
| `has_accessibility_link` | 検出 | utility.accessibility_statement |
| `accessibility_url` | 検出 | utility.accessibility_statement |
| `has_contact_info` | 検出 | contact.info_block |
| `has_contact_form` | 検出 | contact.form |
| `contact_form_variant` | 検出 | contact.form |
| `has_article_meta` | 検出 | article.meta |
| `has_toc` | 検出 | nav.toc |
| `has_attachments` | 検出 | content.pdf_links |
| `attachments_variant` | 検出 | content.pdf_links |
| `heading_outline_score` | 品質 | - (a11y横断指標) |
| `keyboard_nav_risk` | 品質 | - (a11y横断指標) |
| `contrast_risk_hint` | 品質 | - (a11y横断指標) |
| `notes` | 自由記述 | - |
| `evidence_dom_snippets_path` | エビデンス | - |
| `screenshot_path` | エビデンス | - |

### 6.3 検出ルール改善の推奨事項（パイロット前に実施）

以下は、パイロット実行前にtaxonomyの `detection_dom_hints` を改善しておくべき推奨事項である。

| 優先度 | 対象 | 現状 | 推奨修正 |
|--------|------|------|---------|
| 高 | `utility.accessibility_statement` | `a:contains('アクセシビリティ')` | `:contains()` は非標準。DOM テキスト検索ロジックに変更 |
| 高 | `utility.privacy` | `a:contains('個人情報')` | 同上 |
| 高 | `utility.open_data` | `a:contains('オープンデータ')` | 同上 |
| 中 | `layout.skip_link` | `a[href^='#main']` のみ | `a[href^='#content']`, `a[href^='#wrapper']` 等を追加 |
| 中 | `search.site` | `form[role='search'] input[type='search']` | `input[type='text'][placeholder*='検索']` を追加 |
| 中 | `nav.global` | `nav[aria-label*='グローバル']` | `nav[aria-label*='メイン']`, `header > nav` を追加 |
| 低 | `content.hub_cards` | `.card` | 親コンテキスト条件を追加して絞り込み |
| 低 | `article.share` vs `utility.social_links` | セレクタが重複 | 位置コンテキスト（article内 vs footer内）で区別 |

---

## 7. チェックリスト（パイロット開始前の確認事項）

- [ ] `roster_300.csv` が300行で完成している
- [ ] パイロット30件の選定スクリプトが実装されている
- [ ] `roster_pilot_30.csv` が出力されている
- [ ] 30件全てのトップページURLが疎通確認済み
- [ ] `detection_dom_hints` の `:contains()` セレクタが修正されている
- [ ] Playwright スクリプトがローカルで1件テスト成功している
- [ ] Ground Truth 判定のガイドラインが文書化されている
- [ ] Precision/Recall 算出スクリプトが実装されている
- [ ] 不合格時の対応フローが関係者と合意されている
- [ ] `research_params.yaml` のクロール設定が確定している

---

*本文書は STEP04 パイロット検証の準備段階で作成されたものであり、roster_300.csv 完成後にパイロット30件の実選定を行う。*
