# dads-menu-list

> メニューリストコンポーネント

- **Category**: Navigation
- **Class**: `DadsMenuList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/menu-list/menu-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component menu-list
```

## Usage

```html
<dads-menu-list>...</dads-menu-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `indentation` | number | - | インデント（CSS変数 --menu-list-indentation に反映） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | メニュー項目（dads-menu-list-item） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | role="list" のルート |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-menu-list-color` | - |  |
| `--dads-menu-list-font-family` | - |  |
| `--dads-menu-list-font-size` | - |  |
| `--dads-menu-list-indentation` | - |  |
| `--dads-menu-list-item-background` | - |  |
| `--dads-menu-list-item-border-radius` | - |  |
| `--dads-menu-list-item-color` | - |  |
| `--dads-menu-list-item-current-background` | - |  |
| `--dads-menu-list-item-current-color` | - |  |
| `--dads-menu-list-item-current-hover-background` | - |  |
| `--dads-menu-list-item-current-hover-color` | - |  |
| `--dads-menu-list-item-current-parent-background` | - |  |
| `--dads-menu-list-item-end-icon-margin-right` | - |  |
| `--dads-menu-list-item-end-icon-margin-top` | - |  |
| `--dads-menu-list-item-focus-box-inset-width` | - |  |
| `--dads-menu-list-item-focus-outline-color` | - |  |
| `--dads-menu-list-item-focus-outline-offset-box` | - |  |
| `--dads-menu-list-item-focus-outline-offset-standard` | - |  |
| `--dads-menu-list-item-focus-outline-width` | - |  |
| `--dads-menu-list-item-focus-ring-color` | - |  |
| `--dads-menu-list-item-focus-ring-width` | - |  |
| `--dads-menu-list-item-font-weight` | - |  |
| `--dads-menu-list-item-gap` | - |  |
| `--dads-menu-list-item-hover-background` | - |  |
| `--dads-menu-list-item-line-height` | - |  |
| `--dads-menu-list-item-min-height` | - |  |
| `--dads-menu-list-item-padding-x` | - |  |
| `--dads-menu-list-item-padding-y` | - |  |
| `--dads-menu-list-item-start-icon-display-empty` | - |  |
| `--dads-menu-list-item-start-icon-size` | - |  |
| `--dads-menu-list-item-text-decoration-thickness` | - |  |
| `--dads-menu-list-item-underline-offset` | - |  |
| `--dads-menu-list-letter-spacing` | - |  |


## Styling

```css
/* Custom properties */
dads-menu-list {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-menu-list::part(base) {
  /* Style the role="list" のルート */
}
```
