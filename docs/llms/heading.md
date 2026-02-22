# dads-heading

> 見出しコンポーネント

- **Category**: Content
- **Class**: `DadsHeading`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/heading/heading.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component heading
```

## Usage

```html
<dads-heading
  size=""
>
  <div slot="icon"><!-- 先頭アイコン 挙動メモ: - `slot="shoulder"` と `slot="icon"` は同時に指定できます（shoulderは上、iconは見出し行の先頭）。 - slot が無い場合は該当パーツは表示されません（内部で `data-has-*` を付与して制御）。 - `chip` / `rule` は装飾（意匠）です。情報の唯一の手掛かりにしないでください。 --></div>
  <div slot="shoulder"><!-- ショルダーテキスト --></div>
</dads-heading>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `chip` | boolean | - | 左チップ（装飾）表示 |
| `level` | string | - | 見出しレベル（1-6 or h1-h6） |
| `margin` | string | - | 上マージン（none|top） |
| `rule` | string | - | 下線の太さ（8|6|4|2） |
| `size` | string | - | 見出しサイズ（64|57|45|36|32|28|24|20|18|16） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | 見出しテキスト |
| `icon` | 先頭アイコン 挙動メモ: - `slot="shoulder"` と `slot="icon"` は同時に指定できます（shoulderは上、iconは見出し行の先頭）。 - slot が無い場合は該当パーツは表示されません（内部で `data-has-*` を付与して制御）。 - `chip` / `rule` は装飾（意匠）です。情報の唯一の手掛かりにしないでください。 |
| `shoulder` | ショルダーテキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `chip` | 左チップ（装飾）※ 注釈用アンカーも兼ねる |
| `group` | 見出しグループ |
| `heading` | 見出し本体 |
| `icon` | アイコンラッパー |
| `shoulder` | ショルダーテキスト |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-heading-color` | - | 文字色 |
| `--dads-heading-font-size` | - | 見出しフォントサイズ |
| `--dads-heading-line-height` | - | 行高 |
| `--dads-heading-letter-spacing` | - | 文字間隔 |
| `--dads-heading-shoulder-font-size` | - | ショルダーのフォントサイズ |
| `--dads-heading-icon-size` | - | アイコンサイズ |
| `--dads-heading-icon-gap` | - | アイコンと本文の間隔 |
| `--dads-heading-icon-vertical-align` | - | アイコンのベースライン補正（vertical-align） |
| `--dads-heading-margin-block-start-base` | - | 上マージンのベース値 |
| `--dads-heading-margin-scale` | - | 上マージンの倍率（例: compact連動） |
| `--dads-heading-margin-block-start` | - | 上マージン |
| `--dads-heading-chip-color` | - | チップ色 |
| `--dads-heading-chip-width` | - | チップの幅 |
| `--dads-heading-chip-padding-inline` | - | チップのインライン余白 |
| `--dads-heading-chip-top` | - | チップの上位置 |
| `--dads-heading-chip-bottom` | - | チップの下位置 |
| `--dads-heading-rule-color` | - | ルール色 |


## Styling

```css
/* Custom properties */
dads-heading {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-heading::part(chip) {
  /* Style the 左チップ（装飾）※ 注釈用アンカーも兼ねる */
}
```
