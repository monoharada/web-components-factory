# dads-disclosure

> Disclosure（ディスクロージャー）コンポーネント

- **Category**: Actions
- **Class**: `DadsDisclosure`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/disclosure/disclosure.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component disclosure
```

## Usage

```html
<dads-disclosure>
  <div slot="back-link"><!-- 先頭に戻るリンクのラベル（任意、未指定なら表示しない） --></div>
  <div slot="content"><!-- 本文 --></div>
  <div slot="summary"><!-- 見出し（summary内） --></div>
</dads-disclosure>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | - | 開閉状態（trueでopen） |


## Slots

| Slot | Description |
|------|-------------|
| `back-link` | 先頭に戻るリンクのラベル（任意、未指定なら表示しない） |
| `content` | 本文 |
| `summary` | 見出し（summary内） |


## CSS Parts

| Part | Description |
|------|-------------|
| `back-link` | 先頭に戻るリンク（任意） |
| `back-link-icon` | 戻るリンクのアイコン |
| `content` | 本文領域 |
| `details` | <details> 要素 |
| `icon` | 開閉状態アイコン |
| `icon-circle` | アイコン内側の円（hover時の反転用） |
| `icon-triangle` | アイコン内の三角形（hover時の反転用） |
| `summary` | <summary> 要素 |
| `summary-text` | 見出しテキストラッパー |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-disclosure-gap` | - | summary内のgap |
| `--dads-disclosure-icon-size` | - | アイコンサイズ |
| `--dads-disclosure-icon-color` | - | アイコン色 |
| `--dads-disclosure-content-padding-inline-start` | - | 本文のインライン開始padding |
| `--dads-disclosure-back-link-color` | - | 戻るリンク色 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `toggle` | Event | 開閉状態変更時に発火（bubbles） |


## Styling

```css
/* Custom properties */
dads-disclosure {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-disclosure::part(back-link) {
  /* Style the 先頭に戻るリンク（任意） */
}
```
