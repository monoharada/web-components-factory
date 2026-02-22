# dads-emergency-banner

> 緊急時バナーコンポーネント

- **Category**: Display
- **Class**: `DadsEmergencyBanner`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/emergency-banner/emergency-banner.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component emergency-banner
```

## Usage

```html
<dads-emergency-banner>
  <div slot="action"><!-- CTAラベル --></div>
  <div slot="heading"><!-- 見出し本文 --></div>
  <div slot="timestamp"><!-- 更新日時 --></div>
</dads-emergency-banner>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading-level` | '2' \| '3' \| '4' \| '5' \| '6' | - | 見出しレベル |
| `href` | string | - | CTAリンク先 |
| `prefix-label` | string | - | 接頭辞テキスト |
| `prefix-mode` | 'auto' \| 'manual' | - | 接頭辞表示モード |
| `rel` | string | - | CTAリンクrel |
| `target` | '_self' \| '_blank' | - | CTAリンクターゲット |


## Slots

| Slot | Description |
|------|-------------|
| `action` | CTAラベル |
| `default` | 本文 |
| `heading` | 見出し本文 |
| `timestamp` | 更新日時 |


## CSS Parts

| Part | Description |
|------|-------------|
| `action` | CTAコンテナ |
| `action-icon` | 新規タブアイコン |
| `action-label` | CTAラベル |
| `action-link` | CTAリンク |
| `base` | ルート要素 |
| `body` | 本文領域 |
| `header` | ヘッダー領域 |
| `heading` | 見出し領域 |
| `prefix` | 見出し接頭辞 |
| `timestamp` | 更新日時領域 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-emergency-banner-action-background` | - | CTA背景色 |
| `--dads-emergency-banner-action-background-hover` | - | CTAホバー背景色 |
| `--dads-emergency-banner-action-border-radius` | - | CTA角丸 |
| `--dads-emergency-banner-action-border-width` | - |  |
| `--dads-emergency-banner-action-color` | - | CTA文字色 |
| `--dads-emergency-banner-action-font-size` | - |  |
| `--dads-emergency-banner-action-font-weight` | - |  |
| `--dads-emergency-banner-action-icon-size` | - |  |
| `--dads-emergency-banner-action-inner-border-radius` | - |  |
| `--dads-emergency-banner-action-inner-border-width` | - |  |
| `--dads-emergency-banner-action-letter-spacing` | - |  |
| `--dads-emergency-banner-action-line-height` | - |  |
| `--dads-emergency-banner-action-min-width` | - |  |
| `--dads-emergency-banner-action-padding` | - |  |
| `--dads-emergency-banner-action-padding-bottom` | - |  |
| `--dads-emergency-banner-action-padding-top` | - |  |
| `--dads-emergency-banner-background` | - | 背景色 |
| `--dads-emergency-banner-body-row-gap` | - |  |
| `--dads-emergency-banner-border-color` | - | 外枠色 |
| `--dads-emergency-banner-border-width` | - |  |
| `--dads-emergency-banner-color` | - | 本文文字色 |
| `--dads-emergency-banner-focus-outline-color` | - |  |
| `--dads-emergency-banner-focus-outline-offset` | - |  |
| `--dads-emergency-banner-focus-outline-width` | - |  |
| `--dads-emergency-banner-focus-ring-color` | - |  |
| `--dads-emergency-banner-focus-ring-width` | - |  |
| `--dads-emergency-banner-font-size` | - |  |
| `--dads-emergency-banner-header-gap` | - |  |
| `--dads-emergency-banner-heading-color` | - | 見出し色 |
| `--dads-emergency-banner-heading-font-size` | - |  |
| `--dads-emergency-banner-heading-font-weight` | - |  |
| `--dads-emergency-banner-heading-line-height` | - |  |
| `--dads-emergency-banner-letter-spacing` | - |  |
| `--dads-emergency-banner-line-height` | - |  |
| `--dads-emergency-banner-padding-block` | - |  |
| `--dads-emergency-banner-padding-inline` | - |  |
| `--dads-emergency-banner-row-gap` | - |  |


## Styling

```css
/* Custom properties */
dads-emergency-banner {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-emergency-banner::part(action) {
  /* Style the CTAコンテナ */
}
```
