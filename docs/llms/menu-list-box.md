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
