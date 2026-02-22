# dads-drawer

> Drawer（ドロワー）コンポーネント

- **Category**: Actions
- **Class**: `DadsDrawer`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/drawer/drawer.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component drawer
```

## Usage

```html
<dads-drawer>
  <div slot="title"><!-- ドロワータイトル --></div>
</dads-drawer>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | 指定時はタイトルより優先されるアクセシブル名 |
| `close-label` | string | - | 閉じるボタンラベル |
| `light-dismiss` | boolean | - | 背景クリックで閉じる |
| `open` | boolean | - | 開閉状態 |
| `placement` | 'left' \| 'right' | - | 表示位置 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ドロワー本文 |
| `title` | ドロワータイトル |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートの dialog 要素 |
| `close-button` | 閉じるボタン |
| `close-button-icon` | 閉じるアイコン |
| `content` | 本文領域 |
| `header` | ヘッダー領域 |
| `panel` | ドロワー本体 |
| `title` | タイトル領域 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-drawer-width` | - | ドロワー幅 |
| `--dads-drawer-backdrop-background` | - | 背景(backdrop)色 |
| `--dads-drawer-shadow` | - | ドロワー影 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-drawer-before-close` | Event | 閉じる前に発火（cancelable） |
| `dads-drawer-before-open` | Event | 開く前に発火（cancelable） |
| `dads-drawer-close` | CustomEvent | 閉じた後に発火 |
| `dads-drawer-open` | CustomEvent | 開いた後に発火 |


## Styling

```css
/* Custom properties */
dads-drawer {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-drawer::part(base) {
  /* Style the ルートの dialog 要素 */
}
```
