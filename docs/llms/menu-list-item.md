# dads-menu-list-item

> メニューリスト項目コンポーネント

- **Category**: Navigation
- **Class**: `DadsMenuListItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/menu-list/menu-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component menu-list-item
```

## Usage

```html
<dads-menu-list-item
  variant=""
  size=""
>
  <div slot="children"><!-- 子メニュー（ネスト） --></div>
  <div slot="end-icon"><!-- 末尾アイコン（arrow-right / caret） --></div>
  <div slot="start-icon"><!-- 先頭アイコン --></div>
  <div slot="tail-icon"><!-- ラベル末尾アイコン（デフォルト: 新規タブで開く） --></div>
</dads-menu-list-item>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `current` | boolean | - | 現在地 |
| `download` | boolean | - | download属性 |
| `end-icon` | string | - | 末尾アイコン（arrow-right | caret | none） |
| `expanded` | boolean | - | 展開状態 |
| `href` | string | - | リンクURL（指定時は <a> として動作） |
| `rel` | string | - | リンクrel |
| `size` | string | - | サイズ（regular | small） |
| `tail-icon` | string | - | ラベル末尾アイコン（new-window | none） |
| `target` | string | - | リンクターゲット |
| `variant` | string | - | 表示タイプ（standard | box） |


## Slots

| Slot | Description |
|------|-------------|
| `children` | 子メニュー（ネスト） |
| `default` | ラベル |
| `end-icon` | 末尾アイコン（arrow-right / caret） |
| `start-icon` | 先頭アイコン |
| `tail-icon` | ラベル末尾アイコン（デフォルト: 新規タブで開く） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ボタン/リンク本体 |
| `end-icon` | 末尾アイコン領域 |
| `label` | ラベル領域 |
| `start-icon` | 先頭アイコン領域 |
| `tail-icon` | ラベル末尾アイコン領域 |


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
dads-menu-list-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-menu-list-item::part(base) {
  /* Style the ボタン/リンク本体 */
}
```
