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
| `--dads-emergency-banner-border-color` | - | 外枠色 |
| `--dads-emergency-banner-background` | - | 背景色 |
| `--dads-emergency-banner-color` | - | 本文文字色 |
| `--dads-emergency-banner-heading-color` | - | 見出し色 |
| `--dads-emergency-banner-action-background` | - | CTA背景色 |
| `--dads-emergency-banner-action-background-hover` | - | CTAホバー背景色 |
| `--dads-emergency-banner-action-color` | - | CTA文字色 |
| `--dads-emergency-banner-action-border-radius` | - | CTA角丸 |


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
