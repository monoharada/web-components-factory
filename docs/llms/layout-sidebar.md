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


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-layout-sidebar-background` | - | 背景色 |
| `--dads-layout-sidebar-border-color` | - | 境界線色 |
| `--dads-layout-sidebar-padding` | - | 内側余白 |


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
