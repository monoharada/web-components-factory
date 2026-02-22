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
| `color` | string | - | カラー (gray | blue | light-blue | cyan | green | lime | yellow | orange | red | magenta | purple) |
| `variant` | string | - | バリアント (text | outline | filled-outline | fill) |


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
