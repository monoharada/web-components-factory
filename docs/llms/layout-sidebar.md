# dads-layout-sidebar

> レイアウトサイドバー

- **Category**: Layout
- **Class**: `DadsLayoutSidebar`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/layout-sidebar/layout-sidebar.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component layout-sidebar
```

## Usage

```html
<dads-layout-sidebar>...</dads-layout-sidebar>
```

## Attributes

None


## Slots

| Slot | Description |
|------|-------------|
| `default` | サイドバー内コンテンツ |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | サイドバー領域 |


## Styling

```css
/* Custom properties */
dads-layout-sidebar {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-layout-sidebar::part(base) {
  /* Style the サイドバー領域 */
}
```
