# dads-text

> 基本テキストコンポーネント

- **Category**: Content
- **Class**: `DadsText`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/typography/dads-text.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component text
```

## Usage

```html
<dads-text
  variant=""
  size=""
>...</dads-text>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `display` | string | - | 表示（inline | block） |
| `size` | string | - | サイズ（16 | 20 | 32） |
| `variant` | string | - | バリアント（standard | display | dense） |
| `weight` | string | - | 太さ（normal | bold） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | テキストコンテンツ |


## CSS Parts

| Part | Description |
|------|-------------|
| `text` | テキストラッパー |


## Styling

```css
/* Custom properties */
dads-text {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-text::part(text) {
  /* Style the テキストラッパー */
}
```
