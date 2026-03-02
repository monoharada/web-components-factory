# Contract: wcf-mcp v0.2.1→v0.5.0

## 契約一覧

### C-01: distribution フィールドが overview に追加される
- **関連Plan**: P-01
- **条件**: `get_design_system_overview` のレスポンスに `distribution` オブジェクトが存在し、`selfHosted: true`, `strategy: 'vendor-importmap'`, `quickStart` に `npx web-components-factory init` が含まれる
- **verification**: `server.test.js` 統合テストで `client.callTool({ name: 'get_design_system_overview' })` を実行し、レスポンスの `distribution` フィールドを JSON パースして各プロパティを assert
- **DoD trace**: D-01

### C-02: 既存 overview レスポンスの後方互換性
- **関連Plan**: P-01
- **条件**: `setupInfo`, `ideSetupTemplates`, `availableTools`, `availablePrompts`, `availableResources`, `recommendedWorkflow` の全フィールドが v0.3.0 と同一の構造・値で返される
- **verification**: 既存テスト `returns overview with prompt/resource discovery and 5 IDE templates` が変更なしで PASS する
- **DoD trace**: D-02

### C-03: fullPageHtml が opt-in で返される
- **関連Plan**: P-02
- **条件**: `get_pattern_recipe(patternId, { include: ['fullPage'] })` の結果に `fullPageHtml` フィールドが存在し、有効なHTML5文書構造（`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`）を含む
- **verification**: `server.test.js` で `include: ['fullPage']` 付きの `client.callTool()` を実行し、`fullPageHtml` の存在と構造を正規表現で assert
- **DoD trace**: D-03

### C-04: fullPageHtml のimport mapが依存コンポーネントと一致する
- **関連Plan**: P-02
- **条件**: `fullPageHtml` 内の `<script type="importmap">` のエントリキーが、パターンの `resolveComponentClosure()` で解決される全コンポーネントのタグ名と一致する
- **verification**: テストで fullPageHtml をパースし、import map JSON のキーと `components` 配列のタグ名を比較
- **DoD trace**: D-04

### C-05: get_pattern_recipe の後方互換性
- **関連Plan**: P-02
- **条件**: `get_pattern_recipe(patternId)` を `include` 未指定で呼び出した場合、`fullPageHtml` フィールドが存在せず、既存レスポンス（html, canonicalHtml, install, scaffoldHint 等）が v0.3.0 と同一構造で返される
- **verification**: 既存テスト群が変更なしで PASS する + `include` 未指定時に `fullPageHtml` が `undefined` であることを assert
- **DoD trace**: D-05

### C-06: validate_markup の name 属性検証
- **関連Plan**: P-03
- **条件**: フォーム系コンポーネント（input-text, textarea, select 等）で `name` 属性が欠落している場合に warning/error が返される
- **verification**: `server.test.js` で `<dads-input-text label="Name"></dads-input-text>` に対して `missingRequiredAttribute` (attrName=name) の診断が返ることを assert
- **DoD trace**: D-06

### C-07: interactionExamples がフォーム系8コンポーネントに含まれる
- **関連Plan**: P-04
- **条件**: `get_component_api` で `dads-input-text`, `dads-select`, `dads-textarea`, `dads-checkbox`, `dads-radio`, `dads-combobox`, `dads-date-picker`, `dads-file-upload` を取得した際に `interactionExamples` 配列が含まれ、各要素に `scenario`, `code`, `trigger` が存在する
- **verification**: `server.test.js` で8コンポーネントそれぞれに対して `client.callTool({ name: 'get_component_api', arguments: { component: '<name>' } })` を実行し、`interactionExamples` の構造を assert
- **DoD trace**: D-07

### C-08: interactionExamples が非フォーム系に含まれない
- **関連Plan**: P-04
- **条件**: `get_component_api` で `dads-heading`, `dads-card`, `dads-avatar` 等の非フォーム系コンポーネントを取得した際に `interactionExamples` が存在しない
- **verification**: `server.test.js` で非フォーム系コンポーネントに対してレスポンスの `interactionExamples` が `undefined` であることを assert
- **DoD trace**: D-08

### C-09: layoutBehavior が3コンポーネントに含まれる
- **関連Plan**: P-05
- **条件**: `get_component_api` で `dads-layout-shell`, `dads-device-mock`, `dads-layout-sidebar` を取得した際に `layoutBehavior` オブジェクトが含まれ、`responsive`, `overflow`, `constraints` のうち該当するフィールドが存在する
- **verification**: `server.test.js` で3コンポーネントそれぞれに対して `client.callTool()` を実行し、`layoutBehavior` の構造を assert
- **DoD trace**: D-09

### C-10: SYNONYM_TABLE が拡張されている
- **関連Plan**: P-06
- **条件**: `SYNONYM_TABLE` が10エントリ以上に拡張され、`aria error`, `layout`, `responsive` 等のクエリで同義語展開が機能する
- **verification**: `server.test.js` で `expandQueryWithSynonyms('aria error')` 等のユニットテストを追加し、展開結果に期待される同義語が含まれることを assert
- **DoD trace**: D-10

### C-11: ベンチマーク6クエリが全て >0 結果を返す
- **関連Plan**: P-06
- **条件**: `search_guidelines` に対して `keyboard navigation`, `focus management`, `color contrast`, `form validation error`, `heading hierarchy`, `skip navigation` の6クエリが全て `totalHits > 0` を返す
- **verification**: 既存テスト `search_guidelines benchmark: all 6 builder queries return >0 results` が PASS する
- **DoD trace**: D-11

### C-12: 全テストが PASS しバージョンが更新される
- **関連Plan**: P-07
- **条件**: `npm test` が全件 PASS し、`npm run agents:verify` が PASS し、package.json version と McpServer version が一致する
- **verification**: CI パイプラインで `npm run agents:verify` を実行し、exit code 0 を確認
- **DoD trace**: D-12

### C-13: Usefulness Test第4回で定量改善を実証
- **関連Plan**: P-08
- **条件**: Usefulness Test第4回を実施し、E2Eブラウザ描画成功率100%、バリデーションRecall 75%+、ガイドラインヒット率50%+を達成
- **verification**: テスト結果レポートを作成し、ベースライン比較テーブルで各メトリクスの改善を確認
- **DoD trace**: D-13

### C-14: buildFullPageHtml が専用関数として実装される
- **関連Plan**: P-02
- **条件**: `buildFullPageHtml(options)` 関数が core.mjs 内に存在し、`dir`, `vendorDir`, `lang` パラメータを受け取り、プレースホルダ（`./<dir>/`）が残存しない完全な HTML を生成する
- **verification**: `server.test.js` で `buildFullPageHtml()` の出力にプレースホルダ文字列が含まれないことを assert + import map パスが有効なパスであることを検証
- **DoD trace**: D-14

### C-15: fullPageHtml に distribution 情報が自己完結的に含まれる
- **関連Plan**: P-02
- **条件**: `fullPageHtml` レスポンスに distribution 情報（selfHosted, vendor-importmap 等）が含まれ、overview 未呼び出しでも配信方式が判別できる
- **verification**: `server.test.js` で fullPageHtml 内に distribution 関連情報（コメントまたは data 属性）が含まれることを assert
- **DoD trace**: D-15

### C-16: validate_markup がランタイム scaffold を検証する
- **関連Plan**: P-03
- **条件**: CDN URL（`cdn.jsdelivr.net`, `unpkg.com` 等）を含むマークアップに warning が返され、`<script type="importmap">` 欠落時に warning が返される
- **verification**: `server.test.js` で CDN 参照マークアップと importmap 欠落マークアップに対する診断を assert
- **DoD trace**: D-16

### C-17: 全パターンの fullPageHtml レスポンスが 100KB 未満
- **関連Plan**: P-02
- **条件**: 全12パターンに対して `include: ['fullPage']` で取得した `get_pattern_recipe` のレスポンスサイズが `MAX_TOOL_RESULT_BYTES`（100KB）未満
- **verification**: `server.test.js` で全パターンの fullPageHtml レスポンスの JSON.stringify サイズを計測し 100KB 未満を assert
- **DoD trace**: D-17

### C-18: 旧呼び出し互換テストが全ツールで PASS する
- **関連Plan**: P-07
- **条件**: 新パラメータ未指定で全14ツールの既存レスポンスが v0.3.0 と同一構造で返される。additive 変更チェックリストの全項目を満たす
- **verification**: `server.test.js` で各ツールの旧呼び出しパターンのテストが PASS することを assert
- **DoD trace**: D-18

---

## DoD一覧

### D-01: distribution フィールド存在
- **検証方法**: `npm test -- packages/mcp-server/server.test.js` で distribution 関連テスト実行
- **PASS条件**: `payload.distribution.selfHosted === true && payload.distribution.strategy === 'vendor-importmap' && payload.distribution.quickStart.includes('npx web-components-factory init')`
- **関連Contract**: C-01

### D-02: overview 後方互換
- **検証方法**: 既存テスト `returns overview with prompt/resource discovery and 5 IDE templates` の PASS
- **PASS条件**: テストが修正なしで PASS する
- **関連Contract**: C-02

### D-03: fullPageHtml 構造
- **検証方法**: `npm test` で fullPageHtml テスト実行
- **PASS条件**: `fullPageHtml` が `<!DOCTYPE html>`, `<html lang="ja">`, `<meta charset="UTF-8">`, `<script type="importmap">`, `boot.js`, `<body>` を含む
- **関連Contract**: C-03

### D-04: fullPageHtml import map 整合性
- **検証方法**: テストで fullPageHtml から import map を抽出し、パターンの依存コンポーネントタグ名と照合
- **PASS条件**: import map のキー集合が `resolveComponentClosure()` 結果のタグ名集合と一致する
- **関連Contract**: C-04

### D-05: get_pattern_recipe 後方互換
- **検証方法**: `include` 未指定時のテスト実行
- **PASS条件**: レスポンスに `fullPageHtml` が存在しない + 既存テストが PASS
- **関連Contract**: C-05

### D-06: name 属性検証
- **検証方法**: `validate_markup` に `name` 属性なしのフォーム要素を渡すテスト
- **PASS条件**: `missingRequiredAttribute` (attrName='name') の診断が返る
- **関連Contract**: C-06

### D-07: interactionExamples 存在（フォーム系8コンポーネント）
- **検証方法**: 8コンポーネントの `get_component_api` テスト
- **PASS条件**: 全8コンポーネントで `interactionExamples` が配列で返り、各要素に `scenario`, `code`, `trigger` が存在
- **関連Contract**: C-07

### D-08: interactionExamples 非存在（非フォーム系）
- **検証方法**: heading, card, avatar の `get_component_api` テスト
- **PASS条件**: `interactionExamples` が `undefined`
- **関連Contract**: C-08

### D-09: layoutBehavior 存在（3コンポーネント）
- **検証方法**: layout-shell, device-mock, layout-sidebar の `get_component_api` テスト
- **PASS条件**: 全3コンポーネントで `layoutBehavior` オブジェクトが返り、必要なフィールドが存在
- **関連Contract**: C-09

### D-10: SYNONYM_TABLE 拡張
- **検証方法**: `expandQueryWithSynonyms()` ユニットテスト
- **PASS条件**: `expandQueryWithSynonyms('aria error')` が2要素以上の配列を返し、`aria-describedby` が含まれる。SYNONYM_TABLE.size >= 10
- **関連Contract**: C-10

### D-11: ベンチマーク6クエリ >0 結果
- **検証方法**: 既存ベンチマークテスト `search_guidelines benchmark: all 6 builder queries return >0 results` の PASS
- **PASS条件**: 6クエリ全てで `totalHits > 0`
- **関連Contract**: C-11

### D-12: 全テスト PASS + バージョン一致
- **検証方法**: `npm test && npm run agents:verify`
- **PASS条件**: exit code 0 + package.json version === McpServer constructor version
- **関連Contract**: C-12

### D-13: Usefulness Test第4回の定量改善
- **検証方法**: Usefulness Test第4回の実施結果レポート
- **PASS条件**: E2Eブラウザ描画成功率 >= 100%、バリデーションRecall >= 75%、ガイドラインヒット率 >= 50%
- **関連Contract**: C-13

### D-14: buildFullPageHtml 専用関数（プレースホルダなし）
- **検証方法**: `npm test` で buildFullPageHtml のユニットテスト + プレースホルダ残存チェック
- **PASS条件**: `buildFullPageHtml()` の出力に `./<dir>/` や `./<vendorDir>/` が含まれない。import map パスが実際のファイルパスに解決されている
- **関連Contract**: C-14

### D-15: fullPageHtml に distribution 情報含有
- **検証方法**: `npm test` で fullPageHtml 内の distribution 情報テスト
- **PASS条件**: fullPageHtml に `selfHosted` または `vendor-importmap` または同等の情報が含まれる
- **関連Contract**: C-15

### D-16: ランタイム scaffold 検証
- **検証方法**: `npm test` で CDN 参照検出 + importmap 欠落検出テスト
- **PASS条件**: CDN URL を含むマークアップに `cdnReference` 警告が返る。importmap 欠落マークアップに `missingImportmap` 警告が返る
- **関連Contract**: C-16

### D-17: 全パターン fullPageHtml 100KB 未満
- **検証方法**: `npm test` で全12パターンのレスポンスサイズ計測
- **PASS条件**: 全パターンの `JSON.stringify(response).length < 100 * 1024`
- **関連Contract**: C-17

### D-18: 旧呼び出し互換テスト PASS
- **検証方法**: `npm test` で全ツールの旧パラメータ呼び出しテスト
- **PASS条件**: 新パラメータ未指定時のレスポンス構造が v0.3.0 と同一
- **関連Contract**: C-18

---

## トレーサビリティマトリクス

| Contract | Plan | DoD | Risk |
|----------|------|-----|------|
| C-01 | P-01 | D-01 | - |
| C-02 | P-01 | D-02 | - |
| C-03 | P-02 | D-03 | R-01 |
| C-04 | P-02 | D-04 | R-01 |
| C-05 | P-02 | D-05 | R-05 |
| C-06 | P-03 | D-06 | - |
| C-07 | P-04 | D-07 | R-04 |
| C-08 | P-04 | D-08 | - |
| C-09 | P-05 | D-09 | - |
| C-10 | P-06 | D-10 | R-03 |
| C-11 | P-06 | D-11 | R-06 |
| C-12 | P-07 | D-12 | R-02 |
| C-13 | P-08 | D-13 | R-01 |
| C-14 | P-02 | D-14 | R-09 |
| C-15 | P-02 | D-15 | R-10 |
| C-16 | P-03 | D-16 | R-08 |
| C-17 | P-02 | D-17 | R-11 |
| C-18 | P-07 | D-18 | R-05 |

## Unknown 一覧

| ID | 内容 | 影響するContract | 解決方法 |
|----|------|----------------|---------|
| U-01 (RESOLVED) | `web-components-factory/core` の `generatePage()` は packages/ 配下に存在しないことを確認済み。core.mjs内で既存scaffoldHint（doctype, importMap, bootScript, noscript）を組み合わせてHTML文書を生成する方式で確定 | C-03, C-04 | 解決済み: core.mjs 内でテンプレート直接生成 |
| U-02 | guidelines-index.json の索引拡張スクリプトの実装詳細 | C-10, C-11 | P-06 着手前に `npm run mcp:index-guidelines` のスクリプトを確認 |
| U-03 | フォーム系8コンポーネントの実際のイベント・プロパティAPI | C-07 | P-04 着手前に CEM データから各コンポーネントの events/attributes を抽出 |
