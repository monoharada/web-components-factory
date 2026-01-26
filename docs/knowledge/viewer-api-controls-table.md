# viewer.html：Storybook風「API / Controls テーブル」パターン

`viewer.html`（コンポーネントビューア）上で、各コンポーネントの API（Attributes / Properties）と CSS vars を説明しつつ、
テーブル内の操作でデモ（ターゲット要素）へ即時反映するための “Storybook Controls 風” パターンです。

作例は `src/demos.ts` の Button デモ内「API / Controls（Storybook風・サンプル）」を参照してください。

## 仕組み（概要）
- `viewer.html` 側に固定デザイン（`.wc-api-*`）のCSSを持たせる
- デモ側（`src/demos.ts`）は **テーブル行に `data-*` を宣言**するだけでOK
- 反映ロジックは `src/viewer-api-controls.ts` の `bindApiControls()` を使う

## 使い方（最短手順）
1. デモHTML内にパネル（`.wc-api-panel`）を配置する
2. ターゲット要素に `data-api-target` を付ける
3. コントロール要素に `data-api-attr` / `data-api-prop` / `data-api-css-var` を付ける
4. Resetボタンに `data-api-reset` と `data-default` を用意する
5. パネル末尾にスコープ付きの初期化スクリプトを入れる（`document.currentScript` 起点）

## data-* 仕様（必須）
### ターゲット指定
- `data-api-target`：この属性が付いた要素が反映先になります
- 代替（任意）：ルート要素に `data-api-target-selector="..."` を置く（`querySelector()` できるセレクタ）
- 追加（任意）：各コントロール要素に `data-api-target-selector="..."` を置くと、**そのコントロールだけ**指定した要素へ反映します（ルートの反映先より優先）

### Usage（HTML）コードブロック連動（任意）
- `<dads-code-block data-api-code>` を同じパネル内に置くと、`bindApiControls()` が `<dads-code-block>` 内の `<template>` を **Usage（HTML）の正**として扱い、Controls 操作（attrs / inline style / 一部prop）に追従してHTMLスニペットを生成・整形して表示します
- 連動させる場合は、初期化スクリプトで `import('dads-code-block')` を追加してください（定義前に `setCode()` を呼ばないため）

### Controls（Attributes / Properties）
- `data-api-attr="attr-name"`：属性として反映（boolean は presence）
- `data-api-prop="propName"`：プロパティとして反映（`el[propName] = ...`）
- `data-default="..."`：Reset 時に戻す値
  - boolean 系：`"true"` / `"false"`
  - string 系：任意文字列（空文字は「未指定」扱い）

### CSS vars
- `data-api-css-var="--some-var"`：`style.setProperty/removeProperty` で反映
- `data-default="..."`：Reset 時に戻す値（通常は空＝remove）

### Reset
- `data-api-reset`：クリックで全コントロールを `data-default` へ戻す

## 対応しているコントロール（v1）
`bindApiControls()` は以下のイベント・要素を拾います（デモ差し替えに強い設計）。

- `dads-switch`
  - `dads-change`（`event.detail.checked`）を boolean として扱う
- `dads-input-text`
  - `dads-input` / `dads-change`（`event.detail.value`）を string として扱う
- ネイティブ要素
  - `<select>`：`change`
  - `<input>`：`input` / `change`（checkbox は boolean）

## 初期化スクリプト（コピペ）
`src/demos.ts` の文字列HTMLは `innerHTML` で差し替えられるため、**必ずスコープを閉じる**必要があります。
以下の形（`document.currentScript` → `parentElement`）を使ってください。

```html
<script>
  (function() {
    var currentScript = document.currentScript;
    Promise.all([
      import('dads-table'),
      import('dads-switch'),
      import('dads-input-text'),
      import('/src/viewer-api-controls.js')
    ]).then(function(mods) {
      var root = currentScript?.parentElement;
      if (!root || !root.isConnected) return;
      var api = mods[3];
      if (api && api.bindApiControls) api.bindApiControls(root);
    });
  })();
<\/script>
```

### Usage（HTML）コードブロック連動版（コピペ）

```html
<script>
  (function() {
    var currentScript = document.currentScript;
    Promise.all([
      import('dads-table'),
      import('dads-switch'),
      import('dads-input-text'),
      import('dads-code-block'),
      import('/src/viewer-api-controls.js')
    ]).then(function(mods) {
      var root = currentScript?.parentElement;
      if (!root || !root.isConnected) return;
      var api = mods[4];
      if (api && api.bindApiControls) api.bindApiControls(root);
    });
  })();
<\/script>
```

## 応用：コントロール単位の反映先（slotテキスト編集など）
ターゲット要素（`data-api-target`）とは別に、**一部の行だけ別の要素へ反映**したい場合は、
コントロール要素に `data-api-target-selector` を指定します。

```html
<div data-api-target><!-- preview target --></div>
<span data-summary>見出し</span>

<dads-input-text
  label="summaryText"
  value="見出し"
  data-api-prop="textContent"
  data-api-target-selector="[data-summary]"
  data-default="見出し"
></dads-input-text>
```

## レイアウト / 見た目（固定デザイン）
- パネルCSSは `viewer.html` の `.wc-api-*` セクションにあります
- テーブルは `<dads-table>` を “器” として使います（水平スクロール等を活用）
- `.wc-api-control` 内の `dads-input-text` は、テーブル内で邪魔にならないよう label/support/error を視覚的に隠します

## よくある落とし穴
- **custom element 定義前に property を触る**：必ず先に `import('dads-...')` を完了させてから `bindApiControls()` を呼ぶ
- **イベントが拾えない**：`dads-switch` は `dads-change`、`dads-input-text` は `dads-input` を使う（ネイティブ `input` ではない）
- **空文字の扱い**：
  - `data-api-attr`：空文字は `removeAttribute()`（未指定に戻す）
  - `data-api-css-var`：空文字は `removeProperty()`（トークンへ戻す）
