# dads-notification-banner

> ノティフィケーションバナーコンポーネント

- **Category**: Display
- **Class**: `DadsNotificationBanner`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/notification-banner/notification-banner.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component notification-banner
```

## Usage

```html
<dads-notification-banner
  type=""
  variant=""
>
  <div slot="actions"><!-- アクションボタン群 --></div>
  <div slot="icon"><!-- バナーアイコン（未指定時はtypeに応じた既定アイコン） --></div>
  <div slot="meta"><!-- 年月日などの補助情報 --></div>
  <div slot="title"><!-- バナータイトル（必須） --></div>
</dads-notification-banner>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `actions-layout` | 'vertical' \| 'horizontal' | - | アクションボタンの並び方向 |
| `close-label` | string | - | 閉じるボタンのラベル |
| `close-style` | 'default' \| 'compact' | - | 閉じるボタンの見た目 |
| `dense` | boolean | - | 省スペース表示（モバイル向け） |
| `dismiss-mode` | 'hide' \| 'collapse' | - | 閉じる押下時の挙動 |
| `dismissible` | boolean | - | 閉じるボタンを表示 |
| `interaction` | 'none' \| 'title-and-actions' \| 'whole' \| 'actions-only' | - | リンク委譲のクリック領域 |
| `restore-label` | string | - | 再表示ボタンのラベル |
| `type` | 'success' \| 'error' \| 'warning' \| 'info-1' \| 'info-2' | - | 情報タイプ |
| `variant` | 'standard' \| 'color-chip' | - | 表示スタイル |


## Slots

| Slot | Description |
|------|-------------|
| `actions` | アクションボタン群 |
| `default` | バナーデスクリプション |
| `icon` | バナーアイコン（未指定時はtypeに応じた既定アイコン） |
| `meta` | 年月日などの補助情報 |
| `title` | バナータイトル（必須） |


## CSS Parts

| Part | Description |
|------|-------------|
| `actions` | アクション領域 |
| `base` | ルート要素 |
| `body` | 説明領域 |
| `close` | 閉じるボタン |
| `close-icon` | 閉じるアイコン |
| `close-label` | 閉じるラベル |
| `description` | バナーデスクリプション領域 |
| `header` | ヘッダー領域 |
| `icon` | アイコン領域 |
| `meta` | 年月日などの領域 |
| `restore` | 再表示導線の領域（dismiss-mode="collapse" 時） |
| `restore-button` | 再表示ボタン |
| `restore-text` | 折りたたみ時の補助テキスト |
| `title` | タイトル領域 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-notification-banner-action-color` | - | アクション色 |
| `--dads-notification-banner-action-color-active` | - |  |
| `--dads-notification-banner-action-color-hover` | - |  |
| `--dads-notification-banner-action-gap` | - |  |
| `--dads-notification-banner-action-outline-active-bg` | - |  |
| `--dads-notification-banner-action-outline-hover-bg` | - |  |
| `--dads-notification-banner-action-text-color` | - |  |
| `--dads-notification-banner-actions-padding-inline-end` | - |  |
| `--dads-notification-banner-background` | - | 背景色 |
| `--dads-notification-banner-body-gap` | - |  |
| `--dads-notification-banner-body-margin-top` | - |  |
| `--dads-notification-banner-body-padding-block-end` | - |  |
| `--dads-notification-banner-body-padding-inline-end` | - |  |
| `--dads-notification-banner-border-color` | - | 外枠色 |
| `--dads-notification-banner-border-radius` | - | 角丸 |
| `--dads-notification-banner-border-width` | - | 外枠線幅 |
| `--dads-notification-banner-chip-color` | - | color-chip左帯色 |
| `--dads-notification-banner-close-color` | - |  |
| `--dads-notification-banner-close-compact-size` | - |  |
| `--dads-notification-banner-close-hover-bg` | - |  |
| `--dads-notification-banner-close-icon-size` | - |  |
| `--dads-notification-banner-color` | - | 本文文字色 |
| `--dads-notification-banner-color-chip-border-width` | - |  |
| `--dads-notification-banner-color-chip-inset-width` | - |  |
| `--dads-notification-banner-color-chip-padding-inline-start` | - |  |
| `--dads-notification-banner-color-chip-radius` | - |  |
| `--dads-notification-banner-dense-action-gap` | - |  |
| `--dads-notification-banner-dense-body-gap` | - |  |
| `--dads-notification-banner-dense-body-margin-top` | - |  |
| `--dads-notification-banner-dense-color-chip-inset-width` | - |  |
| `--dads-notification-banner-dense-color-chip-padding-inline-start` | - |  |
| `--dads-notification-banner-dense-gap` | - |  |
| `--dads-notification-banner-dense-icon-padding-top` | - |  |
| `--dads-notification-banner-dense-icon-size` | - |  |
| `--dads-notification-banner-dense-padding-block-end` | - |  |
| `--dads-notification-banner-dense-padding-block-start` | - |  |
| `--dads-notification-banner-dense-padding-inline-end` | - |  |
| `--dads-notification-banner-dense-padding-inline-start` | - |  |
| `--dads-notification-banner-gap` | - |  |
| `--dads-notification-banner-icon-color` | - | アイコン色 |
| `--dads-notification-banner-icon-padding-top` | - |  |
| `--dads-notification-banner-icon-size` | - |  |
| `--dads-notification-banner-padding-block-end` | - |  |
| `--dads-notification-banner-padding-block-start` | - |  |
| `--dads-notification-banner-padding-inline-end` | - |  |
| `--dads-notification-banner-padding-inline-start` | - |  |
| `--dads-notification-banner-restore-button-active-bg` | - |  |
| `--dads-notification-banner-restore-button-background` | - |  |
| `--dads-notification-banner-restore-button-color` | - |  |
| `--dads-notification-banner-restore-button-color-active` | - |  |
| `--dads-notification-banner-restore-button-color-hover` | - |  |
| `--dads-notification-banner-restore-button-hover-bg` | - |  |
| `--dads-notification-banner-restore-button-padding-block` | - |  |
| `--dads-notification-banner-restore-button-padding-inline` | - |  |
| `--dads-notification-banner-restore-button-radius` | - |  |
| `--dads-notification-banner-restore-gap` | - |  |
| `--dads-notification-banner-restore-text-color` | - |  |
| `--dads-notification-banner-restore-text-size` | - |  |
| `--dads-notification-banner-title-color` | - | タイトル文字色 |
| `--dads-notification-banner-title-font-size` | - |  |
| `--dads-notification-banner-title-font-weight` | - |  |
| `--dads-notification-banner-title-letter-spacing` | - |  |
| `--dads-notification-banner-title-line-height` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-notification-banner-close` | Event | 閉じる押下時に発火（detail: { type, variant, dismissMode }） |
| `dads-notification-banner-restore` | Event | 再表示押下時に発火（detail: { type, variant, dismissMode }） |


## Styling

```css
/* Custom properties */
dads-notification-banner {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-notification-banner::part(actions) {
  /* Style the アクション領域 */
}
```
