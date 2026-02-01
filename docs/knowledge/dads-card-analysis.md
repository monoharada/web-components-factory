# DADS コンポーネント分析: card（カード）

## 対象

- DADS公式: カード
  - 概要: https://design.digital.go.jp/dads/components/card/
  - 使い方: https://design.digital.go.jp/dads/components/card/usage/
  - アクセシビリティ: 404（未提供）

## 取得状況（ローカル資材）

- 取得結果（manifest）: `resources/dads/components/card/manifest.json`
- DADS公式ページ（キャプチャ/テキスト）:
  - 概要: `resources/dads/components/card/docs/overview/`
  - 使い方: `resources/dads/components/card/docs/usage/`
  - アクセシビリティ: 未提供（manifestに `missing` として記録）
- DADS HTML版 Storybook（UI + canvas + HTML）:
  - `resources/dads/components/card/storybook/`
- 上流 `design-system-example-components-html`（HTML版実装例）:
  - `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/`
- Figma（任意）:
  - 設定: `resources/dads/components/card/figma/config.json`
  - 取得: 環境変数未設定のため `skipped`（必要: `FIGMA_ACCESS_TOKEN`）

## DADS公式の記載（使い方）

### 構成（最大4パーツ）

「使い方」より:
- コンテナ（必須）
- メインエリア（必須）
- イメージエリア（任意）: サブエリアに隣接させることはできない
- サブエリア（任意）: イメージエリアに隣接させることはできない

→ 画像とサブが同時にある場合、メインが必ず間に入る構成（上→中→下）を基本にするのが安全。

### クリッカブルエリア（重要）

「クリッカブルエリア（フォーカス可能エリア）」として以下が可能、と明記されている:
- コンテナ/メイン/イメージをクリッカブルエリア（フォーカス可能エリア）にできる
- ただしその場合、当該エリア内にリンク先やフォームコントロール（ボタン、チェックボックス等）を持てない
- サブエリアはエリア自体をクリッカブルエリアにできない

→ “カード全体クリック”を **セマンティクス上のリンク化**で実現すると、内部アクションとの共存が難しくなる。

## 実装方針（このリポジトリでの落とし込み）

### 1) 構造

`dads-card` は DADS のパーツを Shadow DOM の `part` と Light DOM の `slot` で表現する。

- `part="base"`（コンテナ）
- `part="media"`（イメージエリア）
- `part="main"`（メインエリア）
- `part="sub"`（サブエリア）

### 2) スロット設計（例）

メインを「title/label/function/content」に分割し、DADS作例の多様な組み合わせを **wrapper少なめ**で作れるようにする。

例:
- `slot="media"` / `media-label` / `media-function`
- `slot="title"` / `main-label` / `main-function` / `content`
- `slot="sub-label"` / `sub-function` / `sub`

### 3) カード面クリック（pointer の利便機能）

キーボード操作は「主リンクへフォーカス→Enter」で通常どおり成立させる。

一方で、pointer では “カード面クリック” を補助したいケースがあるため、以下の方式を採用する:

- 主リンク（primary link）: `data-dads-card-primary`
- カード面クリック委譲 ON: 主リンクに `data-dads-card-delegate`

`data-dads-card-delegate` が付いている場合のみ、カード内の非インタラクティブ領域クリックを主リンクへ委譲する。

ガード:
- テキスト選択中（カード内 selection）では委譲しない
- pointer drag（一定距離以上移動）では委譲しない
- クリック経路に `a/button/input/select/textarea/label/summary` が含まれる場合は委譲しない

→ “リンク in リンク” を作らず、内部のアクション（ボタン等）と共存しやすい。

## Storybook / 上流HTMLの観察メモ

- DADS HTML版 Storybook には Example 1〜6 が存在（`resources/dads/components/card/storybook/html/`）
- 上流 `design-system-example-components-html` の `card` は、単一の「カードCSS」ではなく作例ごとの CSS/HTML で表現されている
  - `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/example-*.html`
  - `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-example-*.css`

→ このリポジトリでは “作例CSS” をそのまま移植するのではなく、DADSの構成ルールを満たす **汎用カード**として実装し、作例は demos 側で再現していく。

