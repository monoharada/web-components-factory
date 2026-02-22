# dads-table

> テーブル（Data Table）コンポーネント

- **Category**: Content
- **Class**: `DadsTable`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/table/table.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component table
```

## Usage

```html
<dads-table
  size=""
>...</dads-table>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hover` | boolean | - | 行ホバー |
| `selectable` | boolean | - | 行選択を有効化 |
| `size` | string | - | サイズ |
| `sort-behavior` | string | - | ソート挙動（例: dom） |
| `striped` | boolean | - | 交互行背景 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | テーブルマークアップ（<table> 等） |


## CSS Parts

None


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-table-block-gap` | - |  |
| `--dads-table-body-background` | - |  |
| `--dads-table-border-color` | - |  |
| `--dads-table-border-color-strong` | - |  |
| `--dads-table-cell-padding-x` | - |  |
| `--dads-table-cell-padding-y` | - |  |
| `--dads-table-checkbox-accent-color` | - |  |
| `--dads-table-checkbox-accent-hover-color` | - |  |
| `--dads-table-checkbox-border-color` | - |  |
| `--dads-table-checkbox-border-hover-color` | - |  |
| `--dads-table-checkbox-border-width` | - |  |
| `--dads-table-checkbox-check-color` | - |  |
| `--dads-table-checkbox-size` | - |  |
| `--dads-table-control-border-radius` | - |  |
| `--dads-table-control-focus-outline-color` | - |  |
| `--dads-table-control-focus-outline-offset` | - |  |
| `--dads-table-control-focus-outline-width` | - |  |
| `--dads-table-control-focus-ring-color` | - |  |
| `--dads-table-control-focus-ring-width` | - |  |
| `--dads-table-font-family` | - |  |
| `--dads-table-font-size` | - |  |
| `--dads-table-font-weight` | - |  |
| `--dads-table-header-background` | - |  |
| `--dads-table-header-divider-color` | - |  |
| `--dads-table-header-text-color` | - |  |
| `--dads-table-letter-spacing` | - |  |
| `--dads-table-line-height` | - |  |
| `--dads-table-row-background` | - |  |
| `--dads-table-row-background-hover` | - |  |
| `--dads-table-row-background-selected` | - |  |
| `--dads-table-row-background-selected-hover` | - |  |
| `--dads-table-row-background-stripe` | - |  |
| `--dads-table-scroll-shadow-color` | - |  |
| `--dads-table-scroll-shadow-padding` | - |  |
| `--dads-table-scroll-shadow-size` | - |  |
| `--dads-table-selection-column-width` | - |  |
| `--dads-table-sort-icon-gap` | - |  |
| `--dads-table-sort-icon-size` | - |  |
| `--dads-table-text-color` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-selection-change` | CustomEvent | 行選択変更時に発火（detail: { selectedRowIds, selectedRowIndexes, selectedCount, totalSelectableRows }） |
| `dads-sort-change` | CustomEvent | ソート変更時に発火（detail: { columnId, columnIndex, direction }） |


## Styling

```css
/* Custom properties */
dads-table {
  /* Override component tokens here */
}

```
