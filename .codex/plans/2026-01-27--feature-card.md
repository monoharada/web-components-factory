# DADS Card コンポーネント（`dads-card`）追加

## 目標
- DADS（デジタル庁デザインシステム）準拠の `dads-card` を新規追加し、既存コンポーネント群と同等の規約（token設計 / `part` API / CEM / viewerデモ / テスト / validate）で提供する
- 「リンク in リンク」問題を避けつつ、**テキスト選択（ドラッグ）を壊さず**に“カード面クリックで主リンクへ遷移”できる（pointer向け）挙動を提供する

## 背景
- 参照元:
  - DADS docs: Card（概要/使い方/作例）
  - DADS HTML実装例（GitHub: `digital-go-jp/design-system-example-components-html` の `card`）
  - Figma v2.10.1（node-id: `11360-28331`, `11360-29149`）
- DADSの「使い方」では、**クリッカブルエリア（フォーカス可能エリア）にした領域の内部にリンク/フォームコントロールを置けない**制約が明記されている
- そのため、カード自体をリンク/ボタン化するのではなく、キーボードは「通常どおりリンクへフォーカスしてEnter」で成立させ、カード面クリックは pointer 向けの利便機能として提供する

## スコープ
- やること：
  - `dads-card` を `packages/components/` に追加（tokens/styles/define/autoload/test/demo/CEM）
  - DADS外部資料を `resources/dads/components/card/` に同期（docs/storybook/upstream/figma）
  - クリック委譲（delegate）による「カード面クリック」挙動を実装（選択/ドラッグを阻害しないガード込み）
- やらないこと：
  - DADS作例（多数）の全パターンを“別コンポーネント群”として個別に実装すること（まず `dads-card` で再現可能な共通構造を優先）
  - グローバルCSS前提の `.dads-*` クラス実装（Shadow DOM内の `part` とCSS varsで提供）
  - 既存コンポーネントの大規模リファクタ/命名変更

## 前提 / 制約
- 既存規約に合わせる（`TypographyWebComponent` / `withReset([...], 'minimal')` / token階層 / `.js` import拡張子 / `defineX(prefix, registry)` 形式）
- CEM（`custom-elements.json`）が単一の真実：JSDocの `@customElement` / `@tagname` / `@slot` / `@csspart` / `@attr` を必ず整備
- `validate:wc` 対象が `viewer.html` と `src/demos.ts` に固定されているため、デモ追加時に unknownElement/error を出さない
- クリック委譲は **カード自身をフォーカス可能にしない**（role/link/tabindex付与しない）
- クリック委譲のON/OFFは **カードの属性ではなく、カード内の“主リンク（primary link）”の属性**で切り替える

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- **コンポーネント骨格**
  - `packages/components/card/` を追加（`card.ts`, `card-tokens.ts`, `card-styles.ts`, `card-define.ts`, `index.ts`, `card.test.ts`）
  - `packages/autoload/dads/card.ts` を追加
  - `packages/components/index.ts` に export 追加
- **Shadow DOM 構造（案）**
  - `part`: `base`, `media`, `main`, `sub`
  - `slot`: `media`, `main`, `sub`
  - 空スロットはJSで `hidden` 制御（Safariで `:has(slot:empty)` が不安定な既存知見に合わせる）
- **レイアウト**
  - `layout` 属性（例: `vertical`/`horizontal`）で「イメージ上/左」切替（DADS作例の主要パターンを再現できるベース）
  - 境界線（media/main/sub間のborder）と外周 `border-radius` をDADS相当のトークンで制御
- **Token API（3層→Local公開）**
  - セマンティック: `--card-border-color`, `--card-bg`, `--card-radius`, `--card-padding-*`, `--card-gap-*` など
  - ローカル公開: `--dads-card-*`（`css-writing-rules` の「プロパティ定義は1箇所、状態は変数再代入」遵守）
- **リンク in リンク問題への対応（クリック委譲）**
  - “主リンク”は light DOM 内の要素を想定し、`data-dads-card-primary` で識別する
  - その主リンクに `data-dads-card-delegate` が付いている場合に限り、カード面クリック（pointer）を主リンクへ委譲する
  - ガード条件:
    - テキスト選択中（`getSelection()` が非空/非collapsed）なら委譲しない
    - ポインタ移動量が閾値超（ドラッグ意図）なら委譲しない
    - クリック経路に別のインタラクティブ要素（`a/button/input/...` や focusable要素）が含まれる場合は委譲しない
    - primary 自体をクリックした場合は二重発火防止で委譲しない

### その他（Docs/Marketing/Infra など）
- DADS資材同期（ADR-003準拠）
  - `npm run dads:figma:add -- --component card --url "<figma-url>" ...`
  - `npm run dads:sync -- --component card`
  - `npm run dads:validate -- --component card`
- （推奨）取得資材を根拠に `docs/knowledge/dads-card-analysis.md` を作成し、実装判断（スロット/境界/クリック制約）を文章化

## 受入基準
- [ ] `defineCard(prefix?, registry?)` で任意prefix/registryに登録でき、デフォルトで `dads-card` が動作する
- [ ] `@customElement` / `@tagname` / `@slot` / `@csspart` / `@attr` がJSDocに揃い、`npm run cem:analyze` 後に `custom-elements.json` に反映される
- [ ] `layout` 切替で media/main/sub の配置と境界線が期待通り変わる
- [ ] `--dads-card-*` の上書きで見た目が変えられる（少なくとも border/bg/radius/padding）
- [ ] `data-dads-card-delegate` 付き primary link がある場合、カード面クリックで primary が発火する
- [ ] delegate ON 時、内部ボタン/内部リンク/フォーム操作は阻害されない（委譲されない）
- [ ] delegate ON 時、テキストドラッグ選択では遷移（委譲）が起きない
- [ ] `npm run validate:wc` が通る
- [ ] `npm run test:run` / `npm run type-check` / `npm run build` / `npm run ci` が通る
- [ ] `resources/dads/components/card/` の同期が完了し、`npm run dads:validate -- --component card` が通る（導入する場合）

## リスク / エッジケース
- selection 判定はブラウザ差があり得る（`getSelection()` が空でもドラッグだった等）ため、移動量閾値と併用が必要
- composedPath 経由で“インタラクティブ判定”が漏れると誤遷移する
- 右クリック/修飾キー（Cmd/Ctrl）での「新規タブ」相当は委譲では完全再現できない（仕様として割り切り）
- slot空判定（特にSafari）をCSSに寄せすぎると表示崩れが起きるため、JSで `hidden` を制御する

## 作業項目（Action items）
1. DADS資材を `card` で同期（完了条件: `resources/dads/components/card/manifest.json` が生成され `npm run dads:validate -- --component card` が通る）
2. Cardの要件メモ/分析を作成（完了条件: 参照リンク・スロット案・クリック制約が `docs/knowledge/dads-card-analysis.md` にまとまる）
3. `packages/components/card/` の雛形追加（完了条件: `defineCard()` が用意され、最小レンダリングできる）
4. token/style 実装（完了条件: `--dads-card-*` が揃い、layout切替が視認できる）
5. クリック委譲（delegate）実装（完了条件: primary委譲 + ガード（選択/ドラッグ/内部操作）が動く）
6. unit test 追加（完了条件: delegateの主要ケースがVitestで担保される）
7. autoload + export + viewerデモ追加（完了条件: `viewer.html` で Card を選べて表示/Controls操作できる）
8. CEM/validate/CI 実行（完了条件: `cem:analyze`/`validate:wc`/`ci` が通り、必要な生成物差分がコミット対象になる）

## テスト計画
- 自動（Vitest）
  - define後に `dads-card` が生成できる
  - slot有無で該当partが `hidden` 制御される
  - delegate ON:
    - 非インタラクティブ領域クリックで primary の `.click()` が呼ばれる
    - 内部 `<button>` / 内部 `<a>` クリックでは呼ばれない
    - `getSelection()` が非空のとき呼ばれない（必要ならモック）
- 自動（repo標準）
  - `npm run validate:wc`
  - `npm run cem:analyze`
  - `npm run ci`
- 手動（viewer）
  - テキスト選択ドラッグしても遷移しない
  - クリックは主リンクへ遷移（デモでは `#` やログで確認）
  - 内部ボタン等は通常通り反応

## オープンクエスチョン
該当なし（ユーザー回答済み）

