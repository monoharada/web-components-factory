# dads-layout-aside

> レイアウト補助領域

- **Category**: Layout
- **Class**: `DadsLayoutAside`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/layout-aside/layout-aside.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component layout-aside
```

## Usage

```html
<dads-layout-aside>...</dads-layout-aside>
```

## Attributes

None


## Slots

| Slot | Description |
|------|-------------|
| `default` | 補助領域内コンテンツ |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | 補助領域 |


## Styling

```css
/* Custom properties */
dads-layout-aside {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-layout-aside::part(base) {
  /* Style the 補助領域 */
}
```
