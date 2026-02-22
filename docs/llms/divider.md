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


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-divider-color` | - | 区切り線の色 |
| `--dads-divider-style` | - | 区切り線の線種 |
| `--dads-divider-width` | - | 区切り線の太さ |
| `--dads-divider-margin` | - | 区切り余白（shorthand）。例: `8px 0` |
| `--dads-divider-margin-vertical` | - | 垂直方向時の区切り余白（shorthand）。未指定時は block/inline から自動生成 |
| `--dads-divider-margin-block` | - | 上下余白 |
| `--dads-divider-margin-inline` | - | 左右余白 |
| `--dads-divider-margin-block-start` | - | 上側余白 |
| `--dads-divider-margin-block-end` | - | 下側余白 |
| `--dads-divider-margin-inline-start` | - | 左側余白 |
| `--dads-divider-margin-inline-end` | - | 右側余白 |
| `--dads-divider-vertical-length` | - | 垂直方向時の線長 |


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
