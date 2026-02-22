# dads-global-menu

> グローバルメニュー（コンテナ）

- **Category**: Navigation
- **Class**: `DadsGlobalMenu`
- **Extends**: `TypographyWebComponent`
- **Dependencies**: `menu-list-box`
- **Source**: `./packages/components/global-menu/global-menu.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component global-menu
```

## Usage

```html
<dads-global-menu>...</dads-global-menu>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | ナビゲーションラベル |
| `aria-labelledby` | string | - | ナビゲーションラベル参照先 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | dads-global-menu-item 群 |


## CSS Parts

| Part | Description |
|------|-------------|
| `list` | メニュー一覧 |
| `nav` | ナビゲーションルート |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-global-menu-border-color` | - |  |
| `--dads-global-menu-color` | - |  |
| `--dads-global-menu-font-family` | - |  |
| `--dads-global-menu-font-size` | - |  |
| `--dads-global-menu-font-weight` | - |  |
| `--dads-global-menu-item-chevron-margin-top` | - |  |
| `--dads-global-menu-item-chevron-size` | - |  |
| `--dads-global-menu-item-current-bg` | - |  |
| `--dads-global-menu-item-current-border-color` | - |  |
| `--dads-global-menu-item-current-border-width` | - |  |
| `--dads-global-menu-item-current-color` | - |  |
| `--dads-global-menu-item-current-color-hover` | - |  |
| `--dads-global-menu-item-focus-background` | - |  |
| `--dads-global-menu-item-focus-border-radius` | - |  |
| `--dads-global-menu-item-focus-outline-color` | - |  |
| `--dads-global-menu-item-focus-outline-offset` | - |  |
| `--dads-global-menu-item-focus-outline-width` | - |  |
| `--dads-global-menu-item-focus-ring-color` | - |  |
| `--dads-global-menu-item-focus-ring-width` | - |  |
| `--dads-global-menu-item-gap` | - |  |
| `--dads-global-menu-item-hover-bg` | - |  |
| `--dads-global-menu-item-hover-border-color` | - |  |
| `--dads-global-menu-item-hover-border-width` | - |  |
| `--dads-global-menu-item-min-height` | - |  |
| `--dads-global-menu-item-padding-x` | - |  |
| `--dads-global-menu-item-padding-y` | - |  |
| `--dads-global-menu-item-start-icon-size` | - |  |
| `--dads-global-menu-item-text-decoration-thickness` | - |  |
| `--dads-global-menu-item-underline-offset` | - |  |
| `--dads-global-menu-letter-spacing` | - |  |
| `--dads-global-menu-line-height` | - |  |


## Styling

```css
/* Custom properties */
dads-global-menu {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-global-menu::part(list) {
  /* Style the メニュー一覧 */
}
```
