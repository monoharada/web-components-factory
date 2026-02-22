# dads-divider

> ディバイダーコンポーネント

- **Category**: Content
- **Class**: `DadsDivider`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/divider/divider.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component divider
```

## Usage

```html
<dads-divider>...</dads-divider>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-color` | 'solid-gray-420' \| 'solid-gray-536' \| 'black' | - | 区切り線の色（DADS互換） |
| `data-style` | 'solid' \| 'dashed' | - | 区切り線の線種（DADS互換） |
| `data-width` | '1' \| '2' \| '3' \| '4' | - | 区切り線の太さ（DADS互換） |
| `orientation` | 'horizontal' \| 'vertical' | - | 区切り方向 |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `line` | 区切り線 |


## Styling

```css
/* Custom properties */
dads-divider {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-divider::part(line) {
  /* Style the 区切り線 */
}
```
