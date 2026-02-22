# dads-accordion-item-details

> アコーディオンアイテムコンポーネント

- **Category**: Actions
- **Class**: `DadsAccordionItemDetails`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/accordion/accordion.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component accordion-item-details
```

## Usage

```html
<dads-accordion-item-details
  disabled
>
  <div slot="content"><!-- 本文 --></div>
  <div slot="header"><!-- 見出し --></div>
</dads-accordion-item-details>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `disabled` | boolean | - | 無効状態 |
| `expanded` | boolean | - | 初期展開状態 |
| `icon-position` | string | - | アイコン位置 |


## Slots

| Slot | Description |
|------|-------------|
| `content` | 本文 |
| `header` | 見出し |


## CSS Parts

| Part | Description |
|------|-------------|
| `content` | 本文領域 |
| `content-inner` | 本文内側 |
| `details` | <details> 要素 |
| `header` | 見出しラッパー |
| `icon` | 開閉状態アイコン |
| `return-button` | 先頭に戻るリンク |
| `return-icon` | 戻るアイコン |
| `return-text` | 戻るテキスト |
| `summary` | <summary> 要素 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `toggle` | Event | 展開/折りたたみ時に発火（bubbles） |


## Styling

```css
/* Custom properties */
dads-accordion-item-details {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-accordion-item-details::part(content) {
  /* Style the 本文領域 */
}
```
