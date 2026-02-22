# dads-menu-list-box

> メニューリストボックスコンポーネント

- **Category**: Navigation
- **Class**: `DadsMenuListBox`
- **Extends**: `TypographyWebComponent`
- **Dependencies**: `divider`, `menu-list`
- **Source**: `./packages/components/menu-list-box/menu-list-box.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component menu-list-box
```

## Usage

```html
<dads-menu-list-box
  label=""
  variant=""
  size=""
>
  <div slot="icon"><!-- opener 先頭アイコン --></div>
  <div slot="label"><!-- opener ラベル --></div>
</dads-menu-list-box>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `bold` | boolean | - | 太字表示 |
| `label` | string | - | ラベル（slot未使用時のフォールバック） |
| `open` | boolean | - | 開閉状態 |
| `opener-hidden` | boolean | - | opener を非表示にして外部トリガー連携する |
| `size` | string | - | サイズ（sm | md） |
| `variant` | string | - | バリアント（text | outlined | filled） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | メニュー項目（例: dads-menu-list-item） |
| `icon` | opener 先頭アイコン |
| `label` | opener ラベル |


## CSS Parts

| Part | Description |
|------|-------------|
| `menu` | role="menu" のメニュー領域 |
| `opener` | opener ボタン |
| `opener-arrow` | 末尾矢印アイコン |
| `opener-icon` | 先頭アイコン領域 |
| `opener-label` | ラベル領域 |
| `popup` | ポップアップ領域 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-menu-list-box-color` | - |  |
| `--dads-menu-list-box-divider-color` | - |  |
| `--dads-menu-list-box-divider-margin-block` | - |  |
| `--dads-menu-list-box-divider-margin-inline` | - |  |
| `--dads-menu-list-box-font-family` | - |  |
| `--dads-menu-list-box-font-size` | - |  |
| `--dads-menu-list-box-letter-spacing` | - |  |
| `--dads-menu-list-box-line-height` | - |  |
| `--dads-menu-list-box-min-width` | - |  |
| `--dads-menu-list-box-opener-arrow-margin-left` | - |  |
| `--dads-menu-list-box-opener-arrow-margin-top` | - |  |
| `--dads-menu-list-box-opener-arrow-size` | - |  |
| `--dads-menu-list-box-opener-background` | - |  |
| `--dads-menu-list-box-opener-border-color` | - |  |
| `--dads-menu-list-box-opener-border-radius` | - |  |
| `--dads-menu-list-box-opener-border-width` | - |  |
| `--dads-menu-list-box-opener-focus-background` | - |  |
| `--dads-menu-list-box-opener-focus-outline-color` | - |  |
| `--dads-menu-list-box-opener-focus-outline-offset` | - |  |
| `--dads-menu-list-box-opener-focus-outline-width` | - |  |
| `--dads-menu-list-box-opener-focus-ring-color` | - |  |
| `--dads-menu-list-box-opener-focus-ring-width` | - |  |
| `--dads-menu-list-box-opener-font-weight` | - |  |
| `--dads-menu-list-box-opener-gap` | - |  |
| `--dads-menu-list-box-opener-hover-background` | - |  |
| `--dads-menu-list-box-opener-hover-border-color` | - |  |
| `--dads-menu-list-box-opener-icon-size` | - |  |
| `--dads-menu-list-box-opener-min-height` | - |  |
| `--dads-menu-list-box-opener-padding-x` | - |  |
| `--dads-menu-list-box-opener-padding-y` | - |  |
| `--dads-menu-list-box-opener-underline-offset` | - |  |
| `--dads-menu-list-box-popup-background` | - |  |
| `--dads-menu-list-box-popup-border-color` | - |  |
| `--dads-menu-list-box-popup-border-color-scroll` | - |  |
| `--dads-menu-list-box-popup-border-radius` | - |  |
| `--dads-menu-list-box-popup-item-divider` | - |  |
| `--dads-menu-list-box-popup-item-divider-scroll` | - |  |
| `--dads-menu-list-box-popup-max-height` | - |  |
| `--dads-menu-list-box-popup-min-width` | - |  |
| `--dads-menu-list-box-popup-min-width-scroll` | - |  |
| `--dads-menu-list-box-popup-padding-x` | - |  |
| `--dads-menu-list-box-popup-padding-y` | - |  |
| `--dads-menu-list-box-popup-scrollbar-padding-right` | - |  |
| `--dads-menu-list-box-popup-shadow` | - |  |
| `--dads-menu-list-box-popup-z-index` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `menuitemselect` | CustomEvent | 項目選択時に発火（detail: { selectedItem, selectedValue, selectedIndex }） |


## Styling

```css
/* Custom properties */
dads-menu-list-box {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-menu-list-box::part(menu) {
  /* Style the role="menu" のメニュー領域 */
}
```
