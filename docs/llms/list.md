# dads-list

> 箇条書きリスト（コンテナ）コンポーネント

- **Category**: Content
- **Class**: `DadsList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/list/list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component list
```

## Usage

```html
<dads-list
  variant=""
>...</dads-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `marker-width` | number | - | 項番タイプのマーカー幅（全角n文字相当、CSSでは n em） |
| `spacing` | 'lg' \| 'md' \| 'sm' | - | 項目間隔（12/8/4） |
| `variant` | 'marker' \| 'number' | - | 表示タイプ（リストマーク / 項番） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | リスト項目（dads-list-item） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | role="list" のルート |


## Styling

```css
/* Custom properties */
dads-list {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-list::part(base) {
  /* Style the role="list" のルート */
}
```
