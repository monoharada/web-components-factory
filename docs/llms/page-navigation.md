# dads-page-navigation

> Page Navigation コンポーネント

- **Category**: Navigation
- **Class**: `DadsPageNavigation`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/page-navigation/page-navigation.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component page-navigation
```

## Usage

```html
<dads-page-navigation
  type=""
  size=""
>
  <div slot="status"><!-- 任意のステータス表示（例: `1/24`, `9,999 / 9,999`, `全120件 1/24`） --></div>
</dads-page-navigation>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | ナビゲーションのラベル（デフォルト: ページナビゲーション） |
| `as` | string | - | レンダリング要素（link | button）デフォルト: link |
| `current` | string | - | 現在値（数値文字列） |
| `disabled-next` | boolean | - | 次ボタン非表示（as="button" 時のみ有効） |
| `disabled-prev` | boolean | - | 前ボタン非表示（as="button" 時のみ有効） |
| `fill` | boolean | - | コントロールをコンテナ幅いっぱいに広げる（両側が50%ずつ） |
| `hide-status` | boolean | - | ステータスを強制的に非表示 |
| `next-href` | string | - | 次へリンク先（as="link" 時のみ有効） |
| `next-label` | string | - | 次へラベル（例: 次のページ / 次の3件） |
| `prev-href` | string | - | 前へリンク先（as="link" 時のみ有効） |
| `prev-label` | string | - | 前へラベル（例: 前のページ / 前の3件） |
| `size` | string | - | サイズ（arrowのみ: l | m | s | xs） |
| `status` | string | - | ステータス文字列（slot未指定時のフォールバック） |
| `status-separator` | string | - | current/total の区切り（デフォルト: `/`、例: ` / `） |
| `total` | string | - | 総数（数値文字列） |
| `type` | string | - | 表示タイプ（text | outlined | arrow） |


## Slots

| Slot | Description |
|------|-------------|
| `status` | 任意のステータス表示（例: `1/24`, `9,999 / 9,999`, `全120件 1/24`） |


## CSS Parts

| Part | Description |
|------|-------------|
| `control` | コントロール（a/button要素） |
| `icon` | 矢印アイコン（svg） |
| `label` | コントロールラベル |
| `nav` | ナビゲーションルート（nav要素） |
| `next` | 次へコントロール |
| `prev` | 前へコントロール |
| `status` | ステータス表示 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-page-navigation-control-background` | - |  |
| `--dads-page-navigation-control-background-active` | - |  |
| `--dads-page-navigation-control-background-hover` | - |  |
| `--dads-page-navigation-control-border-color` | - |  |
| `--dads-page-navigation-control-border-color-hover` | - |  |
| `--dads-page-navigation-control-border-radius` | - |  |
| `--dads-page-navigation-control-border-width` | - |  |
| `--dads-page-navigation-control-color` | - |  |
| `--dads-page-navigation-control-color-hover` | - |  |
| `--dads-page-navigation-control-gap` | - |  |
| `--dads-page-navigation-control-min-height` | - |  |
| `--dads-page-navigation-control-min-width` | - |  |
| `--dads-page-navigation-control-padding-x` | - |  |
| `--dads-page-navigation-control-padding-y` | - |  |
| `--dads-page-navigation-control-size` | - |  |
| `--dads-page-navigation-control-text-decoration` | - |  |
| `--dads-page-navigation-font-family` | - |  |
| `--dads-page-navigation-font-size` | - |  |
| `--dads-page-navigation-font-weight` | - |  |
| `--dads-page-navigation-gap` | - |  |
| `--dads-page-navigation-icon-size` | - |  |
| `--dads-page-navigation-justify-content` | - |  |
| `--dads-page-navigation-letter-spacing` | - |  |
| `--dads-page-navigation-line-height` | - |  |
| `--dads-page-navigation-status-color` | - |  |
| `--dads-page-navigation-status-font-size` | - |  |
| `--dads-page-navigation-status-font-weight` | - |  |
| `--dads-page-navigation-status-letter-spacing` | - |  |
| `--dads-page-navigation-status-line-height` | - |  |
| `--dads-page-navigation-width` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `next` | Event | 次ボタンクリック時（as="button" 時のみ） |
| `prev` | Event | 前ボタンクリック時（as="button" 時のみ） |


## Styling

```css
/* Custom properties */
dads-page-navigation {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-page-navigation::part(control) {
  /* Style the コントロール（a/button要素） */
}
```
