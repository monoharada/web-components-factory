# dads-chip-label

> チップラベルコンポーネント

- **Category**: Display
- **Class**: `DadsChipLabel`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/chip-label/chip-label.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component chip-label
```

## Usage

```html
<dads-chip-label
  variant=""
>
  <div slot="icon"><!-- アイコン（オプション） --></div>
</dads-chip-label>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | 'gray' \| 'blue' \| 'light-blue' \| 'cyan' \| 'green' \| 'lime' \| 'yellow' \| 'orange' \| 'red' \| 'magenta' \| 'purple' | - | カラー |
| `variant` | 'text' \| 'outline' \| 'filled-outline' \| 'fill' | - | バリアント |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ラベルテキスト |
| `icon` | アイコン（オプション） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | チップラベル本体 |
| `icon` | アイコンスロット |
| `label` | ラベルテキストコンテナ |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-chip-label-border-radius` | - |  |
| `--dads-chip-label-font-size` | - |  |
| `--dads-chip-label-font-weight` | - |  |
| `--dads-chip-label-icon-gap` | - |  |
| `--dads-chip-label-letter-spacing` | - |  |
| `--dads-chip-label-line-height` | - |  |
| `--dads-chip-label-min-height` | - |  |
| `--dads-chip-label-padding` | - |  |
| `--dads-chip-label-padding-block` | - |  |
| `--dads-chip-label-padding-inline` | - |  |
| `--dads-chip-label-padding-text` | - |  |


## Styling

```css
/* Custom properties */
dads-chip-label {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-chip-label::part(base) {
  /* Style the チップラベル本体 */
}
```
