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
