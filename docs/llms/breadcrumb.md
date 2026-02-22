# dads-breadcrumb

> 現在位置ナビゲーション（パンくず）コンテナ

- **Category**: Navigation
- **Class**: `DadsBreadcrumb`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/breadcrumb/breadcrumb.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component breadcrumb
```

## Usage

```html
<dads-breadcrumb>
  <div slot="label"><!-- ナビゲーションラベル（デフォルト: 現在位置） --></div>
</dads-breadcrumb>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | ナビゲーションのラベル |
| `aria-labelledby` | string | - | ナビゲーションラベルの参照先ID |
| `base-url` | string | - | 構造化データURL解決用ベースURL |
| `separator` | 'chevron' \| 'slash' \| 'pipe' | - | 区切り表示種別 |
| `show-label` | boolean | - | ラベルを視覚表示する |
| `structured-data` | 'off' \| 'microdata' | - | 構造化データ出力モード |


## Slots

| Slot | Description |
|------|-------------|
| `default` | dads-breadcrumb-item 群 |
| `label` | ナビゲーションラベル（デフォルト: 現在位置） |


## CSS Parts

| Part | Description |
|------|-------------|
| `label` | ナビゲーションラベル |
| `list` | パンくず一覧（p要素） |
| `nav` | ナビゲーションルート（nav要素） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-breadcrumb-color` | - |  |
| `--dads-breadcrumb-current-color` | - |  |
| `--dads-breadcrumb-current-letter-spacing` | - |  |
| `--dads-breadcrumb-font-family` | - |  |
| `--dads-breadcrumb-font-size` | - |  |
| `--dads-breadcrumb-font-weight` | - |  |
| `--dads-breadcrumb-home-icon-size` | - |  |
| `--dads-breadcrumb-label-gap` | - |  |
| `--dads-breadcrumb-label-suffix-gap` | - |  |
| `--dads-breadcrumb-letter-spacing` | - |  |
| `--dads-breadcrumb-line-height` | - |  |
| `--dads-breadcrumb-link-color` | - |  |
| `--dads-breadcrumb-link-color-active` | - |  |
| `--dads-breadcrumb-link-color-hover` | - |  |
| `--dads-breadcrumb-link-underline-offset` | - |  |
| `--dads-breadcrumb-link-underline-thickness` | - |  |
| `--dads-breadcrumb-link-underline-thickness-hover` | - |  |
| `--dads-breadcrumb-list-item-gap` | - |  |
| `--dads-breadcrumb-list-unit-gap` | - |  |
| `--dads-breadcrumb-row-gap` | - |  |
| `--dads-breadcrumb-separator-color` | - |  |
| `--dads-breadcrumb-separator-gap-start` | - |  |
| `--dads-breadcrumb-separator-margin-inline` | - |  |
| `--dads-breadcrumb-separator-size` | - |  |


## Styling

```css
/* Custom properties */
dads-breadcrumb {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-breadcrumb::part(label) {
  /* Style the ナビゲーションラベル */
}
```
