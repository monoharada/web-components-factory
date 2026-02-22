# dads-global-menu-item

> グローバルメニュー項目

- **Category**: Navigation
- **Class**: `DadsGlobalMenuItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/global-menu/global-menu.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component global-menu-item
```

## Usage

```html
<dads-global-menu-item>
  <div slot="start-icon"><!-- 先頭アイコン --></div>
  <div slot="submenu"><!-- サブメニュー（dads-menu-list-box） --></div>
</dads-global-menu-item>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `current` | boolean | - | 現在地 |
| `download` | boolean | - | download属性 |
| `expanded` | boolean | - | サブメニュー展開状態 |
| `href` | string | - | リンクURL（submenu未指定時のみ） |
| `rel` | string | - | リンクrel |
| `target` | string | - | リンクターゲット |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ラベル |
| `start-icon` | 先頭アイコン |
| `submenu` | サブメニュー（dads-menu-list-box） |


## CSS Parts

| Part | Description |
|------|-------------|
| `chevron` | サブメニュー用矢印 |
| `label` | ラベル領域 |
| `start-icon` | 先頭アイコン領域 |
| `trigger` | 項目本体（ボタン/リンク） |


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
dads-global-menu-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-global-menu-item::part(chevron) {
  /* Style the サブメニュー用矢印 */
}
```
