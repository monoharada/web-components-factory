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
