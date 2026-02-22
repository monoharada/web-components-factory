# dads-card

> Cardコンポーネント

- **Category**: Content
- **Class**: `DadsCard`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/card/card.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component card
```

## Usage

```html
<dads-card>
  <div slot="media"><!-- イメージエリア（任意） --></div>
  <div slot="sub"><!-- サブエリア（任意） --></div>
</dads-card>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `layout` | 'vertical' \| 'horizontal' | - | レイアウト（デフォルト: vertical） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | メインコンテンツ（デフォルトスロット、h2/p等を自由にマークアップ） |
| `media` | イメージエリア（任意） |
| `sub` | サブエリア（任意） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | コンテナ（overflow制御に使用） |
| `main` | メインエリア（padding・背景のカスタマイズ） |
| `media` | イメージエリア（背景・ボーダー等のカスタマイズ） |
| `sub` | サブエリア（アクション領域のカスタマイズ） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-card-` | - |  |
| `--dads-card-background` | - | 背景色 |
| `--dads-card-border-color` | - | 外周色 |
| `--dads-card-border-radius` | - | 角丸 |
| `--dads-card-border-width` | - | 外周の線幅 |
| `--dads-card-color` | - | 本文/ラベルなどの文字色 |
| `--dads-card-content-color` | - | コンテンツ（p）の文字色 |
| `--dads-card-content-font-size` | - | コンテンツのフォントサイズ |
| `--dads-card-content-font-weight` | - | コンテンツのフォントウェイト |
| `--dads-card-content-letter-spacing` | - | コンテンツの字間 |
| `--dads-card-content-line-height` | - | コンテンツの行高 |
| `--dads-card-divider-color` | - | エリア間の区切り線色（media/sub の境界） |
| `--dads-card-divider-width` | - | エリア間の区切り線幅 |
| `--dads-card-focus-outline-color` | - | フォーカスアウトライン色（委譲ON時） |
| `--dads-card-focus-outline-offset` | - | フォーカスアウトラインのオフセット（委譲ON時） |
| `--dads-card-focus-outline-width` | - | フォーカスアウトライン幅（委譲ON時） |
| `--dads-card-focus-ring-color` | - | フォーカスリング色（委譲ON時） |
| `--dads-card-focus-ring-width` | - | フォーカスリング幅（委譲ON時） |
| `--dads-card-gap` | - | エリア内の余白 |
| `--dads-card-media-aspect-ratio` | - | メディア領域の aspect-ratio |
| `--dads-card-media-width` | - | layout="horizontal" のメディア列幅 |
| `--dads-card-padding-block` | - | パディング（上下） |
| `--dads-card-padding-inline` | - | パディング（左右） |
| `--dads-card-title-color` | - | タイトル（h1-h6）の文字色 |
| `--dads-card-title-font-size` | - | タイトルのフォントサイズ |
| `--dads-card-title-font-weight` | - | タイトルのフォントウェイト |
| `--dads-card-title-letter-spacing` | - | タイトルの字間 |
| `--dads-card-title-line-height` | - | タイトルの行高 |


## Styling

```css
/* Custom properties */
dads-card {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-card::part(base) {
  /* Style the コンテナ（overflow制御に使用） */
}
```
