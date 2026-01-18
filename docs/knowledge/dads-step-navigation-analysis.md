# DADS コンポーネント分析: step-navigation（ステップナビゲーション）

## 対象

- DADS公式: ステップナビゲーション
  - 概要: https://design.digital.go.jp/dads/components/step-navigation/
  - 使い方: 404（未提供）
  - アクセシビリティ: 404（未提供）

## 取得状況（ローカル資材）

- 取得結果（manifest）: `resources/dads/components/step-navigation/manifest.json`
- DADS公式ページ（キャプチャ/テキスト）:
  - 概要: `resources/dads/components/step-navigation/docs/overview/`
  - 使い方/アクセシビリティ: 未提供（manifestに `missing` として記録）
- DADS HTML版 Storybook（UI + canvas + HTML）:
  - `resources/dads/components/step-navigation/storybook/`
- 上流 `design-system-example-components-html`（HTML版実装例）:
  - `resources/dads/components/step-navigation/upstream/design-system-example-components-html/src/components/step-navigation/`
- Figma（任意）:
  - 設定: `resources/dads/components/step-navigation/figma/config.json`
  - 画像（Figma API）:
    - `resources/dads/components/step-navigation/figma/images/`
    - Examples（大きい合成）: `resources/dads/components/step-navigation/figma/images/17934-43545@1x.png`
    - Examples配下のサブセクション（子FRAME）: `resources/dads/components/step-navigation/figma/images/17938-43547@1x.png` 等
  - nodes（Figma API / 抽出JSON）:
    - index: `resources/dads/components/step-navigation/figma/nodes/index.json`
    - サブセクション単位: `resources/dads/components/step-navigation/figma/nodes/17938-43547.json` 等
    - `componentProperties` により、Figma上のバリアント選択（Position/Size/Link/State等）を機械的に追跡できる
  - 取得済み（MCP手動エクスポート / 補助）:
    - 変数/スタイル: `resources/dads/components/step-navigation/figma/variable-defs.json`
    - ノードメタデータ（抜粋）: `resources/dads/components/step-navigation/figma/metadata/`

## DADS公式の記載（概要）

- 「ステップナビゲーションのガイドラインは準備中」
- 各種リソースでは、HTML版のソースコード（GitHub）/サンプル（Storybook）が **提供中**

## HTML版（上流ソース）から読み取れる仕様

参照元（スナップショット）:
- `resources/dads/components/step-navigation/upstream/design-system-example-components-html/src/components/step-navigation/playground-single.html`
- `resources/dads/components/step-navigation/upstream/design-system-example-components-html/src/components/step-navigation/playground-full.html`
- `resources/dads/components/step-navigation/upstream/design-system-example-components-html/src/components/step-navigation/step-navigation.css`

### ルート要素

- ルートは `.dads-step-navigation`
- バリエーションは data属性で切り替え:
  - `data-orientation="horizontal" | "vertical"`
  - `data-size="normal" | "small"`
- 水平配置では横スクロールを許容（`overflow-x: auto`）

### 構造（概略）

- 進捗テキスト（視覚的に隠す）:
  - `p.dads-u-visually-hidden` に「全{total}ステップ中、{reached}ステップ目まで到達済み」
- `ul` / `li` でステップを並べる:
  - `li.dads-step-navigation__step`

### ステップ要素

- 先頭/末尾の判定:
  - `data-first` / `data-last`
  - 区切り線は `::before` / `::after` で描画し、先頭/末尾は非表示
- 現在ステップ:
  - `aria-current="true"` を `li` に付与（番号にアウトラインが付く）

### 状態（data-state）

`data-state` により番号の見た目/アイコン/ラベルが変化する（例: `playground-single.html` より）。

- `default`
- `reached`（到達済み: 番号が反転）
- `completed`（完了: チェックアイコン + SR向け「完了」）
- `editing`（編集中: アイコン + 可視ラベル「編集中」）
- `error`（エラー: アイコン + 可視ラベル「エラー」）
- `skipped`（スキップ: 破線ボーダー + SR向け「スキップされました」）

### クリック/遷移の表現

上流Storybookの単一ステップ（Playground Single）では、インタラクションにより以下のようにタグを差し替えている。

- `interaction: link`
  - ルートを `NAV` に変更し `aria-label="ステップ"`
  - `.dads-step-navigation__header` を `A`（`href="#"`）に変更
- `interaction: button`
  - `.dads-step-navigation__header` を `BUTTON type="button"` に変更

（上流実装上は「リンク/ボタンにできる構造」を前提にしている）

### 幅指定（水平時）

CSSは以下のカスタムプロパティを参照する:

- `--_step-width`（デフォルト: 320）
- `--_step-min-width`（デフォルト: 160）

※ HTML版 Storybook の `Playground (Full)` では `--_width` を設定しており、CSSの参照名（`--_step-width`）と不一致になっている点に注意（`resources/dads/components/step-navigation/storybook/html/` を参照）。

## Storybook（HTML版）エビデンス

- Docs:
  - UI: `resources/dads/components/step-navigation/storybook/ui/docs--docs--2e7e54f5.png`
  - Canvas: `resources/dads/components/step-navigation/storybook/canvas/docs--docs--2e7e54f5.png`
  - HTML: `resources/dads/components/step-navigation/storybook/html/docs--docs--2e7e54f5.html`
- Story:
  - Playground (Single)
    - UI: `resources/dads/components/step-navigation/storybook/ui/story--playground-single--4f7e49c7.png`
    - Canvas: `resources/dads/components/step-navigation/storybook/canvas/story--playground-single--4f7e49c7.png`
    - HTML: `resources/dads/components/step-navigation/storybook/html/story--playground-single--4f7e49c7.html`
  - Playground (Full)
    - UI: `resources/dads/components/step-navigation/storybook/ui/story--playground-full--6dc1f9be.png`
    - Canvas: `resources/dads/components/step-navigation/storybook/canvas/story--playground-full--6dc1f9be.png`
    - HTML: `resources/dads/components/step-navigation/storybook/html/story--playground-full--6dc1f9be.html`
