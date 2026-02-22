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
