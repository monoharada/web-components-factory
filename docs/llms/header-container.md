# dads-header-container

> ヘッダーコンテナコンポーネント

- **Category**: Layout
- **Class**: `DadsHeaderContainer`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/header-container/header-container.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component header-container
```

## Usage

```html
<dads-header-container>
  <div slot="global-menu"><!-- グローバルメニュー領域 --></div>
  <div slot="hamburger-menu"><!-- ハンバーガーメニュー領域 --></div>
  <div slot="logo"><!-- ロゴ領域 --></div>
  <div slot="utility"><!-- 補助リンク/ユーティリティ領域 --></div>
</dads-header-container>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | ヘッダー領域のアクセシブル名 |
| `mode` | 'auto' \| 'wide-full' \| 'wide-slim' \| 'medium' \| 'compact' | - | レイアウトモード |


## Slots

| Slot | Description |
|------|-------------|
| `global-menu` | グローバルメニュー領域 |
| `hamburger-menu` | ハンバーガーメニュー領域 |
| `logo` | ロゴ領域 |
| `utility` | 補助リンク/ユーティリティ領域 |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルート領域 |
| `global-menu` | グローバルメニュー領域 |
| `hamburger-menu` | ハンバーガーメニュー領域 |
| `logo` | ロゴ領域 |
| `primary-row` | 1段目レイアウト領域 |
| `utility` | 補助リンク領域 |


## Styling

```css
/* Custom properties */
dads-header-container {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-header-container::part(base) {
  /* Style the ルート領域 */
}
```
