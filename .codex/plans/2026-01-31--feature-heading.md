# 見出しコンポーネント（dads-heading）実装計画

## 目標
DADS準拠の見出しコンポーネントを新規実装し、マージン付き作例も含めて viewer で検証できる状態にする。

## 背景
DADSのコードスニペット更新情報では、HTML版の見出し追加（2025-09-19）およびReact版の見出し追加（2026-01-21）が明示されており、公式の仕様/挙動に寄せる必要がある。([design.digital.go.jp](https://design.digital.go.jp/dads/updates-code-snippet/))  
また、HTML版コードスニペットのGitHubリポジトリとStorybookが公開済みのため、実装時の一次参照先として扱える。([design.digital.go.jp](https://design.digital.go.jp/dads/updates-code-snippet/))

## スコープ
- やること：
  - `dads-heading` コンポーネントの新規追加（tokens / styles / define / index / tests）
  - マージン付き作例を含む viewer デモ追加（API controls + Usage）
  - autoload / exports / viewer セレクタ / CEM 更新
- やらないこと：
  - 既存 `dads-text` の大幅改修
  - タイポグラフィ全バリエーションの全面実装
  - 他コンポーネント（paragraph等）の同時追加

## 前提 / 制約
- 新規コンポーネント DoD（CEM / demos / tests / validate:wc）に従う。
- CSS設計は `css-writing-rules`、API設計は `headless-component-design` に準拠。
- Figma の指定ノードから見出しのサイズ/行間/余白値を抽出する（取得不能時は DADS Storybook / HTMLスニペットの値で補完）。
- Shadow DOM内の見出しは `role="heading"` + `aria-level` をホストに付与し、セマンティクスを保証する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
**アプローチ案（2–3案）**
- **A（推奨）**: `dads-heading` を新規実装し、`level` 属性で `aria-level` を制御。`part="heading"` を公開し、`--dads-heading-*` でサイズ/余白/色などを上書き可能にする。マージンは `margin="none"` 等の属性で制御し、デフォルトはFigma/DADS準拠。  
  - ✅ セマンティクスが明確 / DADS準拠しやすい / overrideしやすい  
  - ⚠️ 新規コンポーネント追加・デモ・CEM更新が必要  
- **B**: `dads-text` を流用し、外部CSSで見出し相当スタイルを当てる  
  - ✅ 実装が軽い  
  - ❌ セマンティクス/マージン/デザイン統一が担保できない  
- **C**: Shadow内で `h1`〜`h6` を動的生成する  
  - ✅ ネイティブタグの見た目  
  - ❌ DOM組み換えが複雑、`aria-level` との整合管理が必要  

**採用方針**  
A を採用。ホストに `role="heading"` と `aria-level` を付け、内部は `<span part="heading"><slot></slot></span>` にして構造を最小化。マージンは host に `margin-block` を設定し、`--dads-heading-margin-block-start/end` を公開する。

### その他（Docs/Marketing/Infra など）
- `src/demos/showcase-components.ts` に heading セクション追加（Usage + API controls）。
- `viewer.html` にコンポーネント選択肢・import map・preload 追加。
- `packages/autoload/dads/heading.ts` を追加。
- `custom-elements.json` 更新（`npm run cem:analyze`）。

## 受入基準
- [ ] `dads-heading` が `role="heading"` と `aria-level` を正しく反映し、`level` 不正値はデフォルトへフォールバックする
- [ ] DADS/Figma に合わせた文字サイズ・行間・余白がデフォルトで再現される（`margin="none"` で余白無効化可）
- [ ] `::part(heading)` と `--dads-heading-*` で外部カスタムが可能
- [ ] viewer のデモに Usage / API controls が追加される
- [ ] `custom-elements.json` が更新され、CEMカバレッジテストが通る
- [ ] `validate:wc` と `test:run` がパスする

## リスク / エッジケース
- Shadow DOM見出しのセマンティクスがATで期待通りに読まれない可能性 → host の `role="heading"` + `aria-level` を必須化。
- デフォルト `level` を誤ると文書構造ガイドラインに反する可能性。
- Figma/Storybook の値取得ができない場合、暫定値で出荷してしまうリスク。

## 作業項目（Action items）
1. Figma指定ノードとDADS Storybook/HTMLスニペットから見出しのサイズ・行間・余白・フォントウェイトを抽出（完了条件: レベル別の数値マッピングをメモ化）
2. APIを確定（`level`/`margin`/`size`の要否、デフォルト値、aria戦略）（完了条件: 仕様メモが1枚でまとまる）
3. `packages/components/heading/` に本体・tokens・styles・define・index・testsを追加（完了条件: ローカルで型/テストが通る）
4. `packages/autoload/dads/heading.ts` と `packages/components/index.ts` を更新（完了条件: autoload & export が動作）
5. `src/demos/showcase-components.ts` と `viewer.html` を更新し、API controls/Usage を用意（完了条件: viewerで見出しデモが表示）
6. `npm run cem:analyze` を実行して `custom-elements.json` を更新（完了条件: CEM差分が反映）
7. `npm run validate:wc` / `npm run test:run` / `npm run type-check` を実行（完了条件: すべてPASS）

## テスト計画
- `npm run cem:analyze`
- `npm run validate:wc`
- `npm run test:run`
- `npm run type-check`

## オープンクエスチョン
- デフォルトの見出しレベルは `level="2"` で良いですか？（DADSの推奨があればそれに合わせたいです）
