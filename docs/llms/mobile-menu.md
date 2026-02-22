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
