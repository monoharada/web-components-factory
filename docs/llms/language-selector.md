# dads-language-selector

> ランゲージセレクターコンポーネント

- **Category**: Navigation
- **Class**: `DadsLanguageSelector`
- **Extends**: `DadsMenuListBox`
- **Dependencies**: `menu-list-box`
- **Source**: `./packages/components/language-selector/language-selector.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component language-selector
```

## Usage

```html
<dads-language-selector
  label=""
  variant=""
  size=""
>
  <div slot="icon"><!-- opener 先頭アイコン（省略時は地球アイコン） --></div>
  <div slot="label"><!-- opener ラベル（省略時は opener に応じて Language/LANG） --></div>
</dads-language-selector>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `bold` | boolean | - | 太字表示 |
| `label` | string | - | opener ラベル（slot未使用時のフォールバック） |
| `open` | boolean | - | 開閉状態 |
| `opener` | 'text' \| 'icon' | - | opener 表示タイプ（text | icon） |
| `opener-hidden` | boolean | - | opener を非表示にして外部トリガー連携する |
| `size` | string | - | サイズ（sm=36px相当 / md=44px相当） |
| `variant` | string | - | バリアント（text | outlined | filled） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | 言語メニュー項目（dads-menu-list-item） |
| `icon` | opener 先頭アイコン（省略時は地球アイコン） |
| `label` | opener ラベル（省略時は opener に応じて Language/LANG） |


## CSS Parts

| Part | Description |
|------|-------------|
| `menu` | role="menu" のメニュー領域 |
| `opener` | opener ボタン |
| `opener-arrow` | opener 末尾矢印アイコン |
| `opener-icon` | opener 先頭アイコン領域 |
| `opener-label` | opener ラベル領域 |
| `popup` | ポップアップ領域 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 項目選択確定時に発火（detail: { value, selectedValue, selectedIndex, selectedItem }） |
| `menuitemselect` | CustomEvent | 項目選択時に発火（継承） |


## Styling

```css
/* Custom properties */
dads-language-selector {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-language-selector::part(menu) {
  /* Style the role="menu" のメニュー領域 */
}
```
