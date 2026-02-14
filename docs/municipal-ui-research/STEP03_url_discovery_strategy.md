# STEP03 URL Discovery 戦略文書

作成日: 2026-02-14
前提入力: `data/derived/roster_300.csv`（STEP02出力）
最終出力: `data/derived/roster_300_with_pages.csv`

---

## 1. 概要

本文書は、STEP02で構築された300自治体ロスター（`roster_300.csv`）を入力とし、各自治体の公式サイトから5種類のページURLを効率的かつ正確に特定するための戦略を定義する。

### 1.1 目的

STEP04（UI浅観測）の入力となる `roster_300_with_pages.csv` を生成する。各自治体につき最大5ページのURLを特定し、推測ではなく実際のリンク構造に基づいた確実なURLのみを記録する。

### 1.2 5つのページタイプ

| # | カラム名 | ページタイプ | 説明 |
|---|---------|------------|------|
| 1 | `top_page_url` | トップページ | 自治体サイトのトップ。通常 `official_site_url` と同一 |
| 2 | `contact_page_url` | お問い合わせ | 代表連絡先・窓口案内ページ |
| 3 | `service_page_url` | 行政手続き詳細 | 住民がよく使う手続きの個別ページ（子育て・引越し・防災等） |
| 4 | `hub_page_url` | カテゴリハブ | 分野別一覧・カテゴリトップページ（「くらし」「手続き」等） |
| 5 | `article_page_url` | お知らせ記事 | 新着情報・お知らせの個別記事ページ |

### 1.3 完了条件

| ページタイプ | 目標充足率 | 最低充足行数（/300） |
|------------|----------|-------------------|
| top_page_url | 97%以上 | 290 |
| contact_page_url | 83%以上 | 250 |
| service_page_url | 67%以上 | 200 |
| hub_page_url | 67%以上 | 200 |
| article_page_url | 67%以上 | 200 |

---

## 2. ページタイプ別 探索パターン

### 2.1 top_page_url（トップページ）

**探索方針**: 最も単純。`official_site_url` をそのまま採用し、HTTPステータス200またはリダイレクト先を確認する。

**処理手順**:
1. `official_site_url` にHTTP GETを送信
2. ステータス200であればそのURLを `top_page_url` に記録
3. 301/302リダイレクトの場合、最終到達URLを記録（notesにリダイレクト元も記載）
4. 404/500/タイムアウトの場合は空欄とし、notesにエラー内容を記録

**注意事項**:
- `http://` から `https://` へのリダイレクトは正常（最終URLを採用）
- `www.` 有無のリダイレクトも正常
- ドメインが完全に異なる先へリダイレクトする場合はnotesに「ドメイン変更」と記録

---

### 2.2 contact_page_url（お問い合わせページ）

**典型的なURL命名パターン**:

```
/contact/
/inquiry/
/toiawase/
/otoiawase/
/madoguchi/
/access/
/soshiki/
/renraku/
/soudan/
/koe/
/goiken/
/mail/
/form/
```

**日本の自治体サイトで頻出するパス構造**:

| パターン | 例 |
|---------|---|
| 専用パス型 | `/contact/`, `/inquiry/` |
| CMS生成ID型 | `/page/12345.html`, `/contents/contact.html` |
| 組織配下型 | `/soshiki/soumu/contact.html` |
| カテゴリ配下型 | `/shisei/toiawase/`, `/about/contact/` |
| フォームシステム型 | `/cgi-bin/inquiry/`, `/enquete/`, `/form/` |

**DOM手がかり（探索優先順）**:

| 優先度 | 探索箇所 | マッチキーワード |
|-------|---------|---------------|
| 1 | `<footer>` 内リンク | 「お問い合わせ」「問い合わせ」「ご意見」「連絡先」 |
| 2 | グローバルナビ（`<nav>`, `<header>`） | 「お問い合わせ」「窓口」「アクセス」 |
| 3 | ユーティリティバー（ページ最上部） | 「お問い合わせ」「contact」 |
| 4 | サイトマップページ | 上記キーワードのいずれか |
| 5 | `<a>` 要素全件走査 | テキスト or title属性に上記キーワード |

**注意**:
- 各課の個別問い合わせではなく、自治体全体の代表問い合わせページを優先する
- フォーム送信ページ（`/cgi-bin/`等）よりも、電話・窓口案内を含む総合案内ページを優先する

---

### 2.3 service_page_url（行政手続き詳細ページ）

**選定対象**: 住民がよく利用する手続きの個別詳細ページを1つ選ぶ。

**優先テーマ**（上から順に探索し、最初に見つかったものを採用）:

| 優先度 | テーマ | 探索キーワード |
|-------|-------|-------------|
| 1 | 子育て・児童手当 | 「児童手当」「子育て」「jidouteate」「kosodate」 |
| 2 | 転入届・引越し | 「転入届」「転出届」「引越し」「tennyu」「hikkoshi」 |
| 3 | 国民健康保険 | 「国民健康保険」「国保」「kokuho」 |
| 4 | 住民票 | 「住民票」「juuminhyo」 |
| 5 | 防災 | 「防災」「bousai」「hazardmap」 |
| 6 | ごみ・環境 | 「ごみ」「分別」「gomi」「bunbetsu」 |

**典型的なURL命名パターン**:

```
/kurashi/kosodate/jidouteate/
/tetsuzuki/todokede/tennyu/
/kenko/kokuho/
/shinsei/juminhyo/
/bousai/
/kurashi/gomi/
/life/child/
/service/procedure/
```

**DOM手がかり**:

| 優先度 | 探索箇所 | マッチ方法 |
|-------|---------|----------|
| 1 | グローバルナビの子メニュー | 「くらし」「手続き」配下のリンク |
| 2 | トップページのバナー・カード | 「子育て」「引越し」画像+リンク |
| 3 | トップページの「よくある手続き」セクション | リスト内リンク |
| 4 | サイトマップ | 上記キーワード |

**重要**: カテゴリトップ（ハブ）ではなく、手続きの詳細説明を含む個別ページを選ぶこと。ページ内に「対象者」「必要書類」「申請方法」等の見出しがあれば詳細ページと判断できる。

---

### 2.4 hub_page_url（カテゴリハブページ）

**定義**: 複数のサービスや手続きへのリンクをまとめた分野別トップページ。

**典型的なURL命名パターン**:

```
/kurashi/
/bunnya/
/category/
/life/
/business/
/shisei/
/kenko/
/kosodate/
/kanko/
/sangyo/
/bousai/
/kyoiku/
```

**DOM手がかり**:

| 優先度 | 探索箇所 | マッチ方法 |
|-------|---------|----------|
| 1 | グローバルナビの第1階層リンク | 「くらし」「暮らし」「子育て」「健康」等 |
| 2 | トップページのメインカテゴリカード | 大きなアイコン+ラベルの配列 |
| 3 | パンくずリストの第2階層 | トップ > **くらし** > ... |
| 4 | サイトマップの第1階層項目 | カテゴリ名 |

**選定基準**:
- 「くらし」「暮らし」「生活」系のカテゴリトップを最優先
- 見つからなければ「子育て」「健康・福祉」「まちづくり」等
- ページ内にサブカテゴリへのリンク一覧が存在することを確認

**service_page_urlとの区別**:
- hub_page_url: 複数手続きへのリンク集（目次的なページ）
- service_page_url: 1つの手続きの詳細説明ページ

---

### 2.5 article_page_url（お知らせ記事ページ）

**定義**: 新着情報・お知らせ・トピックスの個別記事ページ。日付付きの時系列コンテンツ。

**典型的なURL命名パターン**:

```
/news/YYYYMMDD_xxx.html
/oshirase/12345/
/topics/2026/02/xxx/
/whatsnew/detail/12345
/information/xxx.html
/kinkyu/xxx.html
/shinchaku/xxx/
/press/detail/xxx
```

**CMS別の典型パス**:

| CMS/ベンダ推定 | URLパターン例 |
|-------------|-------------|
| CMS全般 | `/news/detail.php?id=12345` |
| WordPress系 | `/2026/02/14/article-slug/` |
| J-LIS/LGWAN系 | `/contents/xxxxxxxx.html` |
| Joruri CMS | `/docs/2026021400001/` |
| TOWN CMS | `/info/xxx.html` |

**DOM手がかり**:

| 優先度 | 探索箇所 | マッチ方法 |
|-------|---------|----------|
| 1 | トップページの「新着情報」「お知らせ」セクション | 日付付きリスト内の最初のリンク |
| 2 | トップページの「トピックス」「ニュース」エリア | 同上 |
| 3 | `<header>` / `<nav>` の「お知らせ」リンク先ページの個別記事 | 一覧ページの最新記事リンク |
| 4 | サイトマップの「新着」「お知らせ」セクション | リンク先の個別記事 |

**選定基準**:
- 一覧ページ（`/news/`）ではなく、個別記事ページを選ぶ
- 記事に公開日・タイトル・本文が含まれていることを確認
- できるだけ直近（3か月以内）の記事を選ぶ
- 緊急情報・防災速報よりも通常のお知らせを優先

---

## 3. 探索メソッド（効率順）

3つの探索メソッドを効率の高い順に適用する。上位メソッドで見つからない場合のみ下位メソッドに進む。

### 3.1 メソッド1: サイトマップ活用（最速）

**手順**:
1. `{official_site_url}/sitemap.xml` にアクセス
2. 200が返れば、XML形式のサイトマップをパース
3. `<loc>` 要素からURLを抽出し、各ページタイプのキーワードでフィルタ
4. `/sitemap.xml` が404の場合、`/sitemap/` や `/site-map/` も試行

**サイトマップXMLの処理**:
```
サイトマップインデックス（sitemap index）の場合:
  → 子サイトマップURLを取得し、必要な範囲のみパース

単一サイトマップの場合:
  → 全URLを取得しキーワードマッチング
```

**キーワードマッチング例**:
- contact_page_url: URL内に `contact`, `toiawase`, `inquiry`, `madoguchi` を含む
- service_page_url: URL内に `kosodate`, `jidouteate`, `tetsuzuki`, `tennyu` を含む
- hub_page_url: URL内に `kurashi`, `life`, `category`, `bunnya` を含む
- article_page_url: URL内に `news`, `oshirase`, `topics`, `whatsnew` + 数字（記事ID/日付） を含む

**期待される充足率**: 自治体サイトの約30-40%がsitemap.xmlを公開している。

**レート制限**: サイトマップ取得は1リクエスト/オリジンのため負荷は低い。

---

### 3.2 メソッド2: トップページのリンク解析（標準）

**手順**:
1. `top_page_url` のHTMLを取得（既にSTEP02で確認済みのURL）
2. HTMLパース → DOM構築
3. 以下の順でリンクを探索

**探索フロー**:

```
Phase A: ヘッダー・グローバルナビ解析
  <header> 内の <nav> → <a> を全件取得
  <nav role="navigation"> → <a> を全件取得
  id/class に "gnav", "global-nav", "main-nav" を含む要素 → <a>

Phase B: フッター解析
  <footer> 内の <a> を全件取得
  id/class に "footer" を含む要素 → <a>

Phase C: メインコンテンツ解析
  <main> 内の <a>
  id/class に "main", "content", "topics", "news" を含む要素 → <a>

Phase D: 全ページ <a> フォールバック
  ページ内の全 <a> からキーワードマッチ
```

**リンクテキストのマッチングルール**:

| ページタイプ | 一次キーワード（完全一致優先） | 二次キーワード（部分一致） |
|------------|------------------------|---------------------|
| contact | 「お問い合わせ」「問い合わせ」 | 「連絡」「窓口」「ご意見」「相談」 |
| service | 「児童手当」「転入届」「住民票」 | 「手続き」「申請」「届出」 |
| hub | 「くらし」「暮らし」「くらしの情報」 | 「分野別」「カテゴリ」「手続き一覧」 |
| article | N/A（リンクテキストではなくセクション構造で判定） | 「新着」「お知らせ」「トピックス」 |

**article_page_url の特殊処理**:
1. 「新着情報」「お知らせ」セクションを特定
2. そのセクション内の `<a>` から日付パターン付きリンクを抽出
3. 最新（最上部）のリンクを採用
4. 一覧ページへのリンク（「一覧を見る」等）は除外

---

### 3.3 メソッド3: Web検索活用（フォールバック）

**使用条件**: メソッド1・2で特定できなかったページタイプのみに限定。

**検索クエリテンプレート**:

| ページタイプ | クエリ |
|------------|-------|
| contact | `site:{domain} お問い合わせ` |
| service | `site:{domain} 児童手当` または `site:{domain} 転入届` |
| hub | `site:{domain} くらし カテゴリ` |
| article | `site:{domain} お知らせ 2026` |

**`{domain}` の導出**:
- `official_site_url` からドメイン部分を抽出
- 例: `https://www.city.sapporo.jp/` → `www.city.sapporo.jp`

**運用ルール**:
- 1自治体あたり最大4クエリ（未発見ページタイプ分のみ）
- 検索間隔: 2-5秒
- robots.txtを尊重
- 検索結果の上位3件のみを確認

**注意**: Web検索で見つかったURLは必ずHTTPアクセスで存在を確認してからCSVに記録する。

---

## 4. 4スカウト並列実行設計

### 4.1 スカウト割り当て

| スカウト | 担当地域 | 含む地域ブロック | 推定自治体数 | 含む都道府県数 |
|---------|---------|---------------|------------|-------------|
| **Scout A** | 北海道 + 東北 + 関東 | hokkaido, tohoku, kanto | ~100 | 14 |
| **Scout B** | 中部 + 近畿 | chubu, kinki | ~85 | 16 |
| **Scout C** | 中国 + 四国 + 九州沖縄 | chugoku, shikoku, kyushu_okinawa | ~80 | 17 |
| **Scout D** | 検証・補完（全国横断） | 全ブロック | ~35 | 全国 |

### 4.2 各スカウトの役割

#### Scout A / B / C（一次探索スカウト）

**入力**: `roster_300.csv` から自担当地域の行を抽出

**処理手順**:
1. パイロット自治体（後述）を最優先で処理
2. 担当地域の全自治体について、メソッド1→2→3の順で探索
3. 発見したURLとその根拠をCSVに記録
4. 各自治体の処理結果をパーシャルCSVとして出力

**出力ファイル**:
```
data/derived/partial/scout_a_urls.csv
data/derived/partial/scout_b_urls.csv
data/derived/partial/scout_c_urls.csv
```

#### Scout D（検証・補完スカウト）

**役割**: 品質保証と欠損補完の専任

**処理手順**:
1. Scout A/B/Cの出力を受け取る
2. 全300行のURL有効性を検証（HTTP 200チェック）
3. 空欄が多い自治体を特定し、メソッド2/3で再探索
4. リダイレクト先の最終URLを確認・修正
5. 重複URLの検出と修正（同一URLが異なるページタイプに入っていないか）
6. notes列の記載漏れチェック

**出力ファイル**:
```
data/derived/partial/scout_d_verification.csv
```

### 4.3 並列実行タイムライン

```
時間軸 →

Phase 1（パイロット30自治体）  [Scout A/B/C 同時開始]
  Scout A: 北海道+東北+関東のパイロット分（~10自治体）
  Scout B: 中部+近畿のパイロット分（~10自治体）
  Scout C: 中国+四国+九州のパイロット分（~10自治体）
  ↓ パイロット完了 → STEP04パイロット開始可能

Phase 2（残り270自治体）  [Scout A/B/C 並列継続]
  Scout A: 残り ~90自治体
  Scout B: 残り ~75自治体
  Scout C: 残り ~70自治体

Phase 3（検証・補完）  [Scout D]
  Scout D: 全300行の検証 + 空欄補完（~35自治体再探索）

Phase 4（マージ・最終確認）
  4つのパーシャルCSVをマージ → roster_300_with_pages.csv
```

### 4.4 スカウト間の通信プロトコル

**パーシャルCSVフォーマット**（Scout A/B/C出力）:

| カラム | 説明 |
|-------|------|
| sample_id | ロスターのsample_id |
| top_page_url | 発見URL or 空欄 |
| contact_page_url | 発見URL or 空欄 |
| service_page_url | 発見URL or 空欄 |
| hub_page_url | 発見URL or 空欄 |
| article_page_url | 発見URL or 空欄 |
| discovery_method | `sitemap` / `link_analysis` / `web_search` / `manual` |
| discovery_evidence | リンクテキスト、メニュー項目、検索クエリ等 |
| http_status | 確認時のHTTPステータスコード |
| redirect_url | リダイレクト先URL（あれば） |
| notes | 補足情報 |

---

## 5. 品質管理ルール

### 5.1 絶対ルール（違反禁止）

| # | ルール | 理由 |
|---|-------|------|
| Q1 | **推測禁止**: URLが確認できなければ空欄 | 不正確なURLはSTEP04で無駄なアクセスを発生させる |
| Q2 | **robots.txt遵守**: `/robots.txt` を事前確認 | 倫理的・法的要件 |
| Q3 | **レート制限**: 同一オリジンへ1並列接続、300-900msディレイ | サーバー負荷軽減 |
| Q4 | **根拠記録**: 発見経路をnotes列に記録 | 再現性と検証可能性の確保 |
| Q5 | **ドメイン一致**: URLは `official_site_url` と同一ドメインまたは明確なサブドメイン | 外部サイトへの誤記録防止 |

### 5.2 URL有効性チェック

**チェック手順**（全URLに適用）:

```
1. HTTP HEAD リクエスト送信（タイムアウト: 20秒）
2. ステータス判定:
   - 200: 有効 → そのまま記録
   - 301/302: リダイレクト → 最終URLを記録、redirect_url にも記録
   - 403: アクセス制限 → notes に「403 Forbidden」記録、URLは採用しない
   - 404: 不存在 → 空欄にする
   - 5xx: サーバーエラー → 3回リトライ後、なお失敗なら空欄
   - タイムアウト: → 2回リトライ後、なお失敗なら空欄
3. Content-Type確認: text/html であることを確認
```

### 5.3 重複チェック

- 同一自治体内で `hub_page_url` と `service_page_url` が同じURLになっていないか
- `top_page_url` と `hub_page_url` が同じURLになっていないか
- 異なる自治体間で同じURLが記録されていないか（コピーミス防止）

### 5.4 notes列の記載基準

**必須記載項目**:

```
[contact] footer: "お問い合わせ" リンクテキスト
[service] gnav: "くらし" > "子育て" > "児童手当" パンくず経由
[hub] gnav: "くらしの情報" 第1階層リンク
[article] top: "新着情報" セクション内 最新記事 (2026-02-10)
[top] redirect: http→https, www追加
```

**エラー記載例**:

```
[contact] NOT_FOUND: footer/gnav/sitemap いずれにも該当リンクなし
[service] TIMEOUT: 3回リトライ全てタイムアウト
[hub] ROBOTS_BLOCKED: /kurashi/ が robots.txt で Disallow
```

---

## 6. パイロット30自治体の優先処理

### 6.1 パイロットの目的

STEP03の探索手法が有効に機能するかを早期に検証し、問題があれば戦略を修正する。パイロット完了後、STEP04のパイロット実行も開始可能とする。

### 6.2 パイロット30自治体の選定基準

ロスター300の中から以下の条件で30自治体を選定する:

| 条件 | 配分 | 理由 |
|-----|------|------|
| 政令指定都市 | 5 | 大規模サイト、CMS多様性 |
| 中核市 | 5 | 中規模の代表的パターン |
| 県庁所在地（非政令市） | 5 | 都道府県サイトとの関連 |
| 一般市（C） | 5 | 標準的な市のサイト |
| 町村（D） | 5 | 小規模サイトの特殊性 |
| 都道府県 | 5 | prefectureレイヤーの代表 |

**地域分散**: 各地域ブロックから最低2自治体を含む

### 6.3 パイロットの具体的な候補（推奨）

以下はSTEP02ロスターから選定する際の参考候補:

**政令指定都市（5）**: 札幌市、横浜市、名古屋市、大阪市、福岡市
- 理由: 各地域ブロックの代表、サイト規模・CMS多様性が高い

**中核市（5）**: 旭川市、宇都宮市、金沢市、姫路市、鹿児島市
- 理由: 地域分散、人口規模の幅

**県庁所在地・非政令市（5）**: 盛岡市、甲府市、大津市、松江市、那覇市
- 理由: 各ブロックの代表、地域特性の多様性

**一般市（5）**: 帯広市、つくば市、安城市、東広島市、宮崎市
- 理由: 中間的な人口規模、地域分散

**町村（5）**: 東川町（北海道）、檜原村（東京都）、白川村（岐阜県）、直島町（香川県）、竹富町（沖縄県）
- 理由: 過疎・離島・観光地型など多様な特性

**都道府県（5）**: 北海道、東京都、愛知県、大阪府、福岡県
- 理由: 規模・地域ブロック代表

### 6.4 パイロットの成功判定基準

| 指標 | 合格ライン |
|-----|----------|
| top_page_url 充足率 | 30/30（100%） |
| contact_page_url 充足率 | 25/30以上（83%以上） |
| service_page_url 充足率 | 20/30以上（67%以上） |
| hub_page_url 充足率 | 20/30以上（67%以上） |
| article_page_url 充足率 | 20/30以上（67%以上） |
| 全URL有効性 | HTTPステータス200到達率95%以上 |
| 平均探索時間/自治体 | 5分以内 |

**不合格時のアクション**:
- 充足率が基準未満 → 探索キーワード・DOMパターンを拡充して再実行
- URL有効性が低い → リダイレクト追跡ロジックを修正
- 探索時間超過 → メソッド適用順の最適化、タイムアウト値調整

---

## 7. 技術仕様

### 7.1 クロール設定（`config/research_params.yaml` 準拠）

| パラメータ | 値 | 備考 |
|----------|---|------|
| User-Agent | `MunicipalUITemplateResearchBot/1.0 (template research)` | 明示的なbot宣言 |
| robots.txt | 遵守 | Disallow パスはスキップ |
| 同時接続数 | 3（全体）、1（同一オリジン） | サーバー負荷軽減 |
| タイムアウト | 20,000ms | ページ取得上限 |
| リトライ | 2回 | Exponential Backoff推奨 |
| ディレイ | 300-900ms（ランダム） | 同一オリジン間 |
| 1自治体あたり最大リクエスト | 10 | sitemap(1) + top(1) + 候補ページ(5) + 予備(3) |

### 7.2 HTTPクライアント設定

```
- リダイレクト: 最大5段まで追跡
- SSL: 証明書エラーはスキップ（自治体サイトは期限切れが散見される）
- エンコーディング: Shift_JIS / EUC-JP / UTF-8 自動判定
- Cookie: 受け入れるが永続化しない
- JavaScript: 実行しない（静的HTML解析のみ）
```

### 7.3 HTML解析の注意点

**日本の自治体サイト固有の問題**:

| 問題 | 対処 |
|-----|------|
| Shift_JIS/EUC-JPエンコーディング | meta charset + HTTP Content-Type で判定、UTF-8変換 |
| フレーム構造（`<frameset>`） | noframes 内のリンク確認、frameのsrcも探索 |
| JavaScript生成ナビゲーション | 静的解析で取れない場合はメソッド3にフォールバック |
| 画像リンク（alt属性にテキスト） | `<a>` 内の `<img alt="">` もテキストとして扱う |
| SSLなしの `http://` サイト | そのまま記録（`https://` への自動変換はしない） |

---

## 8. 出力仕様

### 8.1 最終出力ファイル

**ファイル名**: `data/derived/roster_300_with_pages.csv`

**カラム構成**（15列、STEP02出力に5列のURLが埋まった状態）:

```csv
sample_id,municipality_code,prefecture,municipality_name,layer,population_category,region_block,official_site_url,top_page_url,contact_page_url,service_page_url,hub_page_url,article_page_url,selection_reason,notes
```

### 8.2 URL記録のフォーマット規則

| ルール | 例 |
|-------|---|
| プロトコル付き完全URL | `https://www.city.sapporo.jp/contact/` |
| 末尾スラッシュ: ディレクトリの場合は付ける | `/kurashi/` (OK), `/kurashi` (NG) |
| 末尾スラッシュ: ファイルの場合は付けない | `/news/12345.html` (OK) |
| クエリパラメータ: 必要な場合のみ含める | `/cgi-bin/inquiry?category=general` |
| フラグメント（#）: 含めない | `#main-content` は除外 |
| URLエンコード: 日本語パスはエンコード済み | `/%E3%81%8F%E3%82%89%E3%81%97/` |

### 8.3 notes列の更新

STEP02のnotesに追記する形式:

```
STEP02の既存notes | [contact] footer "お問い合わせ"; [service] gnav "児童手当"; [hub] gnav "くらし"; [article] top "新着情報" 2026-02-10記事
```

区切りは ` | ` （パイプ記号の前後にスペース）。

### 8.4 補助出力ファイル

**スカウト実行ログ**: `data/derived/partial/scout_execution_log.md`

| 記録項目 | 内容 |
|---------|------|
| 実行日時 | 開始〜終了 |
| スカウト別処理件数 | A: xx, B: xx, C: xx, D: xx |
| メソッド別発見件数 | sitemap: xx, link_analysis: xx, web_search: xx |
| ページタイプ別充足率 | top: xx%, contact: xx%, ... |
| 未発見自治体リスト | sample_id + 未発見ページタイプ |
| 発生した問題 | タイムアウト、SSL、robots.txt等 |

---

## 9. エラーハンドリングと例外処理

### 9.1 自治体サイトアクセス不能時

| 状況 | 対処 |
|-----|------|
| ドメイン名解決失敗 | top含め全URL空欄、notes「DNS解決不能」 |
| 接続タイムアウト（3回連続） | 全URL空欄、notes「接続タイムアウト」 |
| SSL証明書エラー | http:// で再試行、成功すればそのURLを記録 |
| 403 Forbidden（トップページ） | IP制限の可能性あり。全URL空欄、notes「403」 |
| サイト移転・統合 | 移転先URLが判明すれば採用、notes「サイト移転: 旧URL→新URL」 |

### 9.2 ページタイプ判定の曖昧さ

| 状況 | 判断基準 |
|-----|---------|
| 「お問い合わせ」が課別に分かれている | 「代表」「総合窓口」「市役所へのお問い合わせ」を優先 |
| ハブと詳細の区別が曖昧 | ページ内にサブカテゴリリンクが3つ以上→ハブ、手続き説明が中心→詳細 |
| 新着情報が外部サービス | 自治体ドメインの記事がなければ空欄（外部ドメインは不採用） |
| 複数言語サイト | 日本語版を優先 |

### 9.3 リトライ戦略

```
リトライ1回目: 即時（同じメソッド）
リトライ2回目: 1秒待機後（同じメソッド）
リトライ3回目（Scout D）: 別メソッドで再探索

Exponential Backoff:
  wait = min(base_delay * 2^attempt, max_delay)
  base_delay = 1000ms
  max_delay = 10000ms
```

---

## 10. STEP04パイロットとの連携

### 10.1 連携フロー

```
STEP03 Phase 1（パイロット30自治体のURL特定）
  ↓ 完了
STEP04パイロット開始（30自治体のUI浅観測）
  ↓ 同時並行
STEP03 Phase 2（残り270自治体のURL特定）
  ↓ 完了
STEP04本格実行（300自治体のUI浅観測）
```

### 10.2 パイロットデータの受け渡し

**中間出力**: `data/derived/partial/pilot_30_with_pages.csv`

パイロット30自治体分のみ切り出したCSV。STEP04パイロットはこのファイルを入力として使用する。

**フォーマット**: `roster_300_with_pages.csv` と同一カラム構成（30行）

### 10.3 パイロットのフィードバックループ

```
STEP03パイロット → STEP04パイロット → フィードバック
  ↑                                      ↓
  ← 探索パターン修正 ← URL品質問題の報告 ←
```

STEP04パイロットでURLアクセスに問題が発生した場合:
1. 問題URLとエラー内容をSTEP03担当にフィードバック
2. STEP03は該当URLを再探索
3. 修正後のURLでSTEP04再実行

---

## 11. マージ手順と最終チェック

### 11.1 マージ手順

```
1. Scout A/B/C のパーシャルCSV（3ファイル）を統合
2. Scout D の検証結果で上書き更新
3. roster_300.csv の元データとJOIN（sample_idキー）
4. 15列構造の roster_300_with_pages.csv を生成
5. notes列はSTEP02 notes + STEP03 notes を連結
```

### 11.2 最終品質チェックリスト

- [ ] 300行（ヘッダー除く）存在する
- [ ] sample_id が S0001-S0300 で重複なし
- [ ] top_page_url が290行以上埋まっている
- [ ] contact_page_url が250行以上埋まっている
- [ ] service_page_url が200行以上埋まっている
- [ ] hub_page_url が200行以上埋まっている
- [ ] article_page_url が200行以上埋まっている
- [ ] 全URLがHTTPステータス200（またはリダイレクト先で200）を返す
- [ ] URLはすべて `official_site_url` と同一ドメインまたはサブドメイン
- [ ] 同一自治体内でページタイプ間のURL重複がない
- [ ] notes列に発見根拠が記録されている
- [ ] CSV文字コードがUTF-8（BOMなし）
- [ ] カンマを含む値はダブルクォーテーションで囲まれている

---

## 12. リスク評価と軽減策

| リスク | 影響度 | 発生確率 | 軽減策 |
|-------|-------|---------|--------|
| サイトマップ非公開 | 中 | 高（60-70%） | メソッド2に即座にフォールバック |
| JavaScript動的生成ナビ | 高 | 中（20-30%） | メソッド3（Web検索）で補完 |
| robots.txtで主要パスがDisallow | 中 | 低（5-10%） | 遵守してそのページタイプは空欄 |
| サーバーダウン・メンテナンス | 低 | 低（3-5%） | Scout Dで再試行（時間をおいて） |
| CMS移行中でURL構造変更 | 中 | 低（2-3%） | notes記録、空欄許容 |
| IP制限・WAFブロック | 中 | 低（1-2%） | User-Agent明示、空欄許容 |
| Shift_JIS/EUC-JP文字化け | 低 | 中（15-20%） | 自動エンコーディング検出 |

---

## 付録A: 日本の自治体サイトURL構造の典型パターン

### A.1 ドメイン体系

| パターン | 例 | 割合推定 |
|---------|---|---------|
| `city.{name}.{pref}.jp` | `city.sapporo.jp` | 30-40% |
| `www.city.{name}.lg.jp` | `www.city.chuo.lg.jp` | 20-30% |
| `www.{name}.lg.jp` | `www.pref.hokkaido.lg.jp` | 10-20%（都道府県） |
| `town.{name}.{pref}.jp` | `town.higashikawa.hokkaido.jp` | 10-15%（町） |
| `www.vill.{name}.{pref}.jp` | `www.vill.shirakawa.gifu.jp` | 5%（村） |
| `www.{name}-city.lg.jp` | `www.tsukuba-city.lg.jp` | 5-10% |
| その他独自ドメイン | `www.kenoh.com`（見附市旧サイト等） | 5%未満 |

### A.2 CMS別の典型URL構造

| CMS推定 | URL特徴 | 備考 |
|---------|--------|------|
| WordPress | `/yyyy/mm/dd/slug/` | パーマリンク構造 |
| Joruri CMS | `/docs/yyyymmddnnnnn/` | 文書ID形式 |
| TOWN CMS | `/info/xxx.html`, `/life/xxx.html` | カテゴリ+ファイル |
| CMS不明（静的） | `/section/page.html` | HTMLファイル直接 |
| J-LIS系 | `/contents/xxxxxxxx.html` | コンテンツID |

### A.3 よくあるディレクトリ構造

```
/                          # トップページ
├── shisei/                # 市政情報
│   ├── mayor/             # 市長の部屋
│   ├── soshiki/           # 組織一覧
│   └── toiawase/          # お問い合わせ
├── kurashi/               # くらしの情報
│   ├── kosodate/          # 子育て
│   │   └── jidouteate/    # 児童手当（service候補）
│   ├── hikkoshi/          # 引越し
│   ├── zeikin/            # 税金
│   └── gomi/              # ごみ
├── kenko/                 # 健康・福祉
├── sangyo/                # 産業・ビジネス
├── kanko/                 # 観光
├── bousai/                # 防災
├── kyoiku/                # 教育
├── news/                  # 新着情報
│   └── 2026/              # 年別
│       └── 0214_xxx.html  # 個別記事（article候補）
└── sitemap/               # サイトマップ
```

---

## 付録B: Scout実行用チェックシート

各Scoutは自治体ごとに以下を記録する:

```markdown
## {sample_id}: {municipality_name}

### 基本情報
- official_site_url: {url}
- robots.txt 確認: OK / Disallow あり（パス: ___）
- サイトマップ: 有 / 無

### 探索結果
| ページタイプ | URL | メソッド | 根拠 | HTTP | 備考 |
|------------|-----|---------|------|------|------|
| top | | | | | |
| contact | | | | | |
| service | | | | | |
| hub | | | | | |
| article | | | | | |

### 特記事項
- （サイト構造の特殊性、アクセス問題等）
```

---

## 付録C: 探索キーワード辞書（完全版）

### C.1 contact（お問い合わせ）

**一次キーワード**（リンクテキスト完全一致）:
`お問い合わせ`, `問い合わせ`, `お問合せ`, `問合せ`, `ご意見・お問い合わせ`

**二次キーワード**（部分一致）:
`連絡先`, `窓口`, `アクセス`, `相談`, `ご意見`, `ご要望`, `市への連絡`, `町への連絡`, `村への連絡`, `県への連絡`, `代表電話`, `コールセンター`

**URLパスキーワード**:
`contact`, `inquiry`, `toiawase`, `otoiawase`, `madoguchi`, `soudan`, `koe`, `goiken`, `renraku`, `access`

### C.2 service（行政手続き）

**テーマ別キーワード群**:

| テーマ | 日本語キーワード | URLパスキーワード |
|-------|---------------|----------------|
| 子育て・児童手当 | `児童手当`, `子育て支援`, `子ども手当` | `jidouteate`, `kosodate`, `kodomo` |
| 転入・引越し | `転入届`, `転出届`, `引越し手続き` | `tennyu`, `tenshutsu`, `hikkoshi` |
| 国民健康保険 | `国民健康保険`, `国保`, `加入・脱退` | `kokuho`, `hoken` |
| 住民票 | `住民票`, `戸籍`, `印鑑証明` | `juminhyo`, `koseki`, `inkan` |
| 防災 | `防災`, `ハザードマップ`, `避難所` | `bousai`, `hazard`, `hinan` |
| ごみ | `ごみの出し方`, `分別`, `収集日` | `gomi`, `bunbetsu`, `shushu` |

### C.3 hub（カテゴリハブ）

**一次キーワード**:
`くらし`, `暮らし`, `くらしの情報`, `生活`, `くらし・手続き`

**二次キーワード**:
`子育て・教育`, `健康・福祉`, `まちづくり`, `産業・ビジネス`, `市政情報`, `観光・文化`, `防災・安全`, `分野別`, `カテゴリ`, `手続き一覧`, `ライフイベント`

**URLパスキーワード**:
`kurashi`, `life`, `category`, `bunnya`, `service`, `tetsuzuki`, `kosodate`, `kenko`, `fukushi`

### C.4 article（お知らせ記事）

**セクション見出しキーワード**:
`新着情報`, `お知らせ`, `トピックス`, `ニュース`, `最新情報`, `重要なお知らせ`, `更新情報`, `What's New`

**URLパスキーワード**:
`news`, `oshirase`, `topics`, `whatsnew`, `information`, `info`, `shinchaku`, `press`, `kinkyu`

---

*本戦略文書はSTEP03実行の指針であり、実行中に得られた知見に基づいて更新される。*
*最終更新: 2026-02-14*
