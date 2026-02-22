# dads-accordion-details

> アコーディオンコンテナコンポーネント

- **Category**: Actions
- **Class**: `DadsAccordionDetails`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/accordion/accordion.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component accordion-details
```

## Usage

```html
<dads-accordion-details>...</dads-accordion-details>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `allow-multiple` | boolean | - | 複数アイテムの同時展開を許可 |
| `animation` | string | - | アニメーション方針（例: none） |
| `respect-motion-preference` | boolean | - | prefers-reduced-motion に追従 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | アコーディオンアイテム（dads-accordion-item-details） |


## CSS Parts

| Part | Description |
|------|-------------|
| `container` | アイテムを内包するコンテナ |


## Styling

```css
/* Custom properties */
dads-accordion-details {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-accordion-details::part(container) {
  /* Style the アイテムを内包するコンテナ */
}
```
