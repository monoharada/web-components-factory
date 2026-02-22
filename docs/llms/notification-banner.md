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
