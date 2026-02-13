# 実装計画: MunicipalUI テンプレートIssue整理（Top/Contact/Service/Hub/Article）

## 概要
- 作成日: 2026-02-13
- ステータス: Approved
- 優先度: High
- 対象: MunicipalUI pattern issue 起票とEpic連携

## 背景と目的
- 自治体サイト向けテンプレート実装の前提として、5画面（Top/Contact/Service/Hub/Article）の Pattern Issue を整備した。
- #104 で定義した DADS準拠運用（ベースプロンプト + template workflow）に従い、実装セッションへ渡せる粒度でIssue本文を固定した。

## 反映済みIssue
- Epic: https://github.com/monoharada/web-components-factory/issues/127
- Component:
  - https://github.com/monoharada/web-components-factory/issues/108
  - https://github.com/monoharada/web-components-factory/issues/128
  - https://github.com/monoharada/web-components-factory/issues/129
  - https://github.com/monoharada/web-components-factory/issues/130
  - https://github.com/monoharada/web-components-factory/issues/131
  - https://github.com/monoharada/web-components-factory/issues/132
  - https://github.com/monoharada/web-components-factory/issues/133
- Pattern:
  - https://github.com/monoharada/web-components-factory/issues/135
  - https://github.com/monoharada/web-components-factory/issues/136
  - https://github.com/monoharada/web-components-factory/issues/137
  - https://github.com/monoharada/web-components-factory/issues/138
  - https://github.com/monoharada/web-components-factory/issues/139

## Pattern契約（Issueで固定）
- `municipal-top-page`
  - requires: `["global-menu","search-box","notification-banner","emergency-banner","heading","card"]`
- `municipal-contact-page`
  - requires: `["contact-panel","error-summary","input-text","select","textarea","button"]`
- `municipal-service-page`
  - requires: `["service-facts","step-navigation","file-upload","safe-link-list","button","heading"]`
- `municipal-hub-page`
  - requires: `["hub-filter","card","breadcrumb","page-navigation","search-box","heading"]`
- `municipal-article-page`
  - requires: `["article-meta","safe-link-list","heading","list","utility-link"]`

## 重要な固定仕様
- `dads-contact-panel` は受付番号表示（完了画面）まで責務に含める。
- `dads-safe-link-list` の `allow-domains` はCSV属性文字列のみ許可する。
- `allow-domains` の解釈は `trim`、小文字比較、重複除去、空要素無視。
- JSON入力は非対応。

## 実装セッションへの引き継ぎ
- Pattern Issue の本文にある「新規セッション実装プロンプト」をそのまま利用する。
- 実装時は以下のチェックを必須とする。
  1. `npm run patterns:check`
  2. `npm run validate:wc`
  3. `npm run validate:templates:quick`
  4. `npm run agents:verify`

## 非ゴール
- 本ドキュメントはIssue整理記録であり、`registry/pattern-registry.json` の実装差分は含まない。

