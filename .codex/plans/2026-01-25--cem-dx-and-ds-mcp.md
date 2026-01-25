# CEM駆動DX（CEM生成 + wctools validate + DS-MCP）導入プラン（承認済み）

## 目標
- `custom-elements.json`（Custom Elements Manifest, CEM）を再現性ある手順で生成できる
- CEM を根拠に `wctools validate` をCIで回し、unknown element/attribute を検知できる
- CEM を読んで Design System 向けの MCP サーバー（skills群）を提供できる
- Chrome DevTools MCP を `viewer.html` と併用できるドキュメント導線がある

## 背景
- CEM を「単一の真実」として IDE/カタログ/Lint/型生成/Docs を駆動したい
- このコードベースは `packages/core/web-components.ts` の独自基盤（`WebComponentDefinition` / `static definition`）を使い、`packages/config.ts` の `prefix`（デフォルト `dads`）でタグ名が可変
- 現状、主要コンポーネントの一部で `@customElement/@tagname/@slot/@csspart/@attr/@fires` の JSDoc が整備されている（= CEM抽出に相性が良い）
- ただし複数コンポーネントで `@customElement/@tagname` が不足しており、このままではCEMが“部分的”になりやすい（= wctools が価値を出しにくい）
- デモ/確認は `viewer.html` に集約するルールが既にある（新規HTMLは増やさない）

## スコープ
- やること：
  - CEM生成（`@custom-elements-manifest/analyzer`）導入と `custom-elements.json` 生成手順の確立
  - CEM品質向上（継承マージ / modulePath整形）
  - CEM検証（`@wc-toolkit/cem-validator`）導入（現状パッケージ事情に合わせて rules を段階導入）
  - CEM駆動Lint（`@wc-toolkit/wctools validate`）導入と `viewer.html` を対象にCIゲート化
  - CEMを読む Design System MCP サーバー（`list_components`, `get_component_api`, `generate_usage_snippet`, `validate_markup`）の設計・導入
  - Chrome DevTools MCP を viewer と併用する docs 整備
  - CEM抽出に必要な範囲で、コンポーネントJSDoc（`@customElement` 等）を不足分だけ追記
- やらないこと：
  - Storybook の再導入（viewer中心）
  - 新しいデモHTMLの追加（`viewer.html` 以外は増やさない）
  - コンポーネントの見た目/挙動の大規模改修
  - npm公開・配布形態の全面見直し（cem-validatorの厳格化は段階導入に留める）

## 前提 / 制約
- TypeScript strict / any禁止
- import は `.js` 拡張子運用を崩さない
- prefix は `packages/config.ts` の `dads` を canonical として扱い、CEMはまず `dads-*` を正として生成する
- `wctools` は alpha のため、CI導入時は設定とバージョン固定前提
- `custom-elements.json` はコミット運用（差分をレビュー可能にする）

## 変更内容（案）
### データ / バックエンド
- devDependencies 追加
  - `@custom-elements-manifest/analyzer`
  - `@wc-toolkit/cem-validator`
  - `@wc-toolkit/cem-inheritance`（CEMの継承APIマージ）
  - `@wc-toolkit/module-path-resolver`（CEMの modulePath を出力ターゲットに寄せる）
  - `@wc-toolkit/wctools`
  - `@modelcontextprotocol/sdk`
- CEM生成設定
  - `custom-elements-manifest.config.js` を追加
  - plugins（順序は検討）:
    - `modulePathResolverPlugin(options)`
    - `cemInheritancePlugin(options)`
    - `cemValidatorPlugin(options)`（rulesは段階導入）
  - `custom-elements.json` を repo root に出力
  - `package.json` に `"customElements": "custom-elements.json"` を追加（analyzerの自動書き換えは使わない）
- wctools 設定
  - `wc.config.js` を追加
  - 初期は `viewer.html` を主対象にする（段階的に対象拡大）
- prefix変換（必要時）
  - `scripts/cem/transform-prefix.mjs` を追加し、`custom-elements.json` を prefix 指定で変換した一時manifestを生成できるようにする
- Design System MCP サーバー
  - `scripts/mcp/design-system-mcp.mjs` を追加（stdio想定）
  - 読み込み元: `custom-elements.json`（prefix指定があれば変換結果を使用）
  - 提供ツール（最小）:
    - `list_components()`
    - `get_component_api({ tagName | className })`
    - `generate_usage_snippet({ component, prefix? })`
    - `validate_markup({ html, prefix? })`
      - **第一候補**: `wctools` の programmatic API を利用して diagnostics を返す（CLI spawn は最終手段）

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- Docs
  - `docs/knowledge/custom-elements-manifest.md`（生成/検証/運用、prefix戦略含む）
  - `docs/knowledge/wctools-validate.md`（`wc.config.js`、運用、CIの見方）
  - `docs/knowledge/design-system-mcp.md`（tools仕様、起動方法、ユースケース、wctools MCPとの差別化）
  - `docs/knowledge/chrome-devtools-mcp.md`（viewer起動→DevTools MCP接続→実行時検証）
  - prefix利用者向けに、language server / wctools 設定の `tagFormatter` 例も記載する
- CI
  - `.github/workflows/ci.yml` に CEM/wctools の実行を統合

## 受入基準
- [ ] `custom-elements.json` を生成できる（`npm run cem:analyze` 相当）
- [ ] `custom-elements.json` に viewer/importmap で使う主要タグ（`dads-*` 一式 + `a11y-annotate`）が含まれる
- [ ] CEM生成に必要な最小JSDoc不足分（例: accordion/calendar/date-picker/menu-list/menu-list-box/table/annotate/text）が補完され、CEMが“部分的”にならない
- [ ] `package.json` に `"customElements": "custom-elements.json"` が追加される
- [ ] cem-validator（設定した rules 範囲）が通る
- [ ] `wctools validate` が `viewer.html` を対象に実行できる（0 diagnostics もしくは合意した suppress 方針）
- [ ] GitHub Actions CI が新ゲート込みで green
- [ ] DS-MCP が起動し、`list_components/get_component_api/generate_usage_snippet/validate_markup` が最低1コンポーネント（例: `dads-button`）で期待通り動く
- [ ] Chrome DevTools MCP を viewer と併用する docs があり、手順が再現できる

## リスク / エッジケース
- analyzer が独自基盤を自動推論できず、JSDoc不足があると要素がmanifestに出ない
- `wctools` は alpha のため、破壊的変更や診断仕様変更のリスク（バージョン固定が必要）
- prefix変換は過剰変換の危険（tagNameフィールド限定で変換する）
- cem-validator は package.json の entrypoint 等も厳密に見るため、現状の “配布実態” とズレると落ちやすい（rulesを段階導入）

## 作業項目（Action items）
1. 現状監査: public扱いのタグ一覧とJSDoc不足箇所を棚卸し（完了条件: “CEMに載せるタグ一覧” と “要JSDoc追記ファイル一覧” が確定）
2. CEM生成導入: analyzer + `custom-elements-manifest.config.js` を追加（完了条件: `custom-elements.json` が生成できる）
3. CEM品質: modulePath-resolver / inheritance を plugins に追加（完了条件: CEMの modulePath / 継承API が期待通りに反映される）
4. JSDoc補完: 不足コンポーネントへJSDocを追記（完了条件: 主要タグがCEMに出力される）
5. CEM検証: cem-validator を導入し rules を調整（完了条件: 合意した範囲で検証が通る）
6. wctools導入: `wc.config.js` と `validate:wc` を追加（完了条件: `viewer.html` がlintで通る）
7. prefix変換: `scripts/cem/transform-prefix.mjs` を追加（完了条件: 任意prefixの manifest を生成できる）
8. DS-MCP: MCPサーバー実装と docs（完了条件: tools が手動で確認できる）
9. CI統合: CEM/wctools をCIに統合（完了条件: CI green）

## テスト計画
- `npm ci`
- `npm run cem:analyze`（`custom-elements.json` 生成）
- `npm run validate:wc`（まず `viewer.html`）
- `npm run test:run` / `npm run type-check` / `npm run ci`

## オープンクエスチョン
（承認時に解消）
1. `custom-elements.json` はコミットする？ → **コミット運用**
2. MCP の最優先クライアントは？ → **汎用MCPクライアント互換（stdio）**

