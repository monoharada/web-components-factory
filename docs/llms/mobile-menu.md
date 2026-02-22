# dads-mobile-menu

> モバイルメニューコンポーネント

- **Category**: Navigation
- **Class**: `DadsMobileMenu`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/mobile-menu/mobile-menu.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component mobile-menu
```

## Usage

```html
<dads-mobile-menu>
  <div slot="back"><!-- 戻るリンク行（L2用途） --></div>
</dads-mobile-menu>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | ナビゲーションラベル |
| `aria-labelledby` | string | - | ナビゲーションラベル参照先 |


## Slots

| Slot | Description |
|------|-------------|
| `back` | 戻るリンク行（L2用途） |
| `default` | メニュー本体 |


## CSS Parts

| Part | Description |
|------|-------------|
| `back` | 戻る行コンテナ |
| `base` | ルートの nav 要素 |
| `content` | メニュー本文 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-mobile-menu-back-padding-block-end` | - | 戻る行下余白 |
| `--dads-mobile-menu-back-padding-block-start` | - | 戻る行上余白 |
| `--dads-mobile-menu-back-padding-inline` | - | 戻る行左右余白 |
| `--dads-mobile-menu-background` | - | 背景色 |
| `--dads-mobile-menu-border-color` | - | 枠線色 |
| `--dads-mobile-menu-border-width` | - | 枠線幅 |
| `--dads-mobile-menu-color` | - |  |
| `--dads-mobile-menu-content-gap` | - |  |
| `--dads-mobile-menu-divider-margin-inline` | - | 区切り線の左右余白（標準） |
| `--dads-mobile-menu-divider-margin-inline-wide` | - | 区切り線の左右余白（ワイド） |
| `--dads-mobile-menu-font-family` | - |  |
| `--dads-mobile-menu-font-size` | - |  |
| `--dads-mobile-menu-letter-spacing` | - |  |
| `--dads-mobile-menu-line-height` | - |  |
| `--dads-mobile-menu-padding-block` | - | ルート上下余白 |
| `--dads-mobile-menu-padding-inline` | - | ルート左右余白 |
| `--dads-mobile-menu-width` | - | メニュー幅 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-mobile-menu-toggle` | CustomEvent | セクション開閉時に発火 |


## Styling

```css
/* Custom properties */
dads-mobile-menu {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-mobile-menu::part(back) {
  /* Style the 戻る行コンテナ */
}
```
