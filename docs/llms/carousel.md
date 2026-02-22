# dads-carousel

> カルーセル

- **Category**: Display
- **Class**: `DadsCarousel`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/carousel/carousel.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component carousel
```

## Usage

```html
<dads-carousel
  type=""
>
  <div slot="heading"><!-- 見出し（container タイプ向け） --></div>
</dads-carousel>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `all-slides-label` | string | - | 一覧展開ボタンのラベル |
| `aria-label` | string | - | カルーセルの aria-label |
| `breakpoint-rem` | number | - | desktop 判定のブレークポイント（rem） |
| `current-index` | number | - | 現在スライドの 0 始まり index |
| `image-slider` | boolean | - | イメージスライダー（幅狭コンテナ）モードを強制 |
| `next-label` | string | - | 次ボタンのラベル |
| `prev-label` | string | - | 前ボタンのラベル |
| `type` | 'container'\|'key-visual' | - | 表示タイプ |
| `unit` | string | - | スライドの単位（例: スライド） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | スライド要素（items 未指定時に利用） |
| `heading` | 見出し（container タイプ向け） |


## CSS Parts

| Part | Description |
|------|-------------|
| `all-slides` | すべてのスライド領域 |
| `all-slides-button` | すべてのスライド切替ボタン |
| `all-slides-content` | すべてのスライド内容 |
| `all-slides-item` | すべてのスライド項目 |
| `controls` | コントロール領域 |
| `image-container` | 画像コンテナ |
| `indicator-button` | ステップボタン |
| `indicators` | ステップナビゲーション |
| `inner` | 内部レイアウト |
| `main` | メインパネル領域 |
| `main-bg` | メイン背景 |
| `main-images` | メイン画像コンテナ |
| `main-label` | メインラベル（スクリーンリーダー向け） |
| `main-link` | メインリンク |
| `main-panel` | メインパネル |
| `next` | 次スライド領域 |
| `next-bg` | 次スライド背景 |
| `next-button` | 次ボタン |
| `next-image-container` | 次スライド画像コンテナ |
| `next-image-label` | 次スライドラベル |
| `next-preview-button` | 次スライドプレビューボタン |
| `number` | 番号表示 |
| `page-nav` | ページナビゲーション |
| `panel-number` | パネル番号（一覧展開時） |
| `panel-set` | パネルセット |
| `panels` | パネル領域 |
| `prev-button` | 前ボタン |
| `root` | ルート領域 |
| `status` | ステータス（aria-live） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-carousel-all-slides-content-margin-top` | - |  |
| `--dads-carousel-all-slides-extra-gap` | - |  |
| `--dads-carousel-all-slides-icon-color` | - |  |
| `--dads-carousel-all-slides-margin-top` | - |  |
| `--dads-carousel-all-slides-row-gap` | - |  |
| `--dads-carousel-bg-blur-size` | - |  |
| `--dads-carousel-bg-soft-light-color` | - |  |
| `--dads-carousel-border-color` | - |  |
| `--dads-carousel-border-width` | - |  |
| `--dads-carousel-control-gap-desktop` | - |  |
| `--dads-carousel-control-gap-mobile` | - |  |
| `--dads-carousel-control-padding-block` | - |  |
| `--dads-carousel-control-padding-bottom-expanded` | - |  |
| `--dads-carousel-focus-outline-color` | - |  |
| `--dads-carousel-focus-outline-offset-inner` | - |  |
| `--dads-carousel-focus-outline-offset-outer` | - |  |
| `--dads-carousel-focus-outline-width` | - |  |
| `--dads-carousel-focus-ring-color` | - |  |
| `--dads-carousel-focus-ring-width` | - |  |
| `--dads-carousel-font-family` | - |  |
| `--dads-carousel-font-size` | - |  |
| `--dads-carousel-font-size-heading-default` | - |  |
| `--dads-carousel-font-size-heading-lg` | - |  |
| `--dads-carousel-font-size-heading-sm` | - |  |
| `--dads-carousel-font-weight-bold` | - |  |
| `--dads-carousel-font-weight-normal` | - |  |
| `--dads-carousel-hit-area` | - |  |
| `--dads-carousel-image-outline-width` | - |  |
| `--dads-carousel-letter-spacing` | - |  |
| `--dads-carousel-line-color` | - |  |
| `--dads-carousel-link-color` | - |  |
| `--dads-carousel-link-hover-color` | - |  |
| `--dads-carousel-main-ratio` | - |  |
| `--dads-carousel-main-ratio-key-visual` | - |  |
| `--dads-carousel-max-width` | - |  |
| `--dads-carousel-max-width-key-visual` | - |  |
| `--dads-carousel-next-label-font-size` | - |  |
| `--dads-carousel-next-label-padding` | - |  |
| `--dads-carousel-next-padding` | - |  |
| `--dads-carousel-next-ratio` | - |  |
| `--dads-carousel-number-font-size` | - |  |
| `--dads-carousel-number-size` | - |  |
| `--dads-carousel-page-button-size` | - |  |
| `--dads-carousel-page-nav-gap` | - |  |
| `--dads-carousel-panel-grid-side` | - |  |
| `--dads-carousel-radius-lg` | - |  |
| `--dads-carousel-radius-md` | - |  |
| `--dads-carousel-radius-sm` | - |  |
| `--dads-carousel-side-padding` | - |  |
| `--dads-carousel-step-gap` | - |  |
| `--dads-carousel-summary-padding-block` | - |  |
| `--dads-carousel-summary-padding-inline` | - |  |
| `--dads-carousel-surface-color` | - |  |
| `--dads-carousel-text-color` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-carousel-before-change` | Event | スライド変更直前（cancelable） |
| `dads-carousel-change` | Event | 現在スライド変更時（ユーザー操作のみ） |
| `dads-carousel-controls-update` | Event | controls 表示モードや状態が更新された時 |
| `dads-carousel-index-change` | Event | スライド変更完了後（API/属性変更含む） |
| `dads-carousel-layout-change` | Event | data-wide などレイアウト状態が変わった時 |
| `dads-carousel-media-error` | Event | 描画対象メディアの読み込み失敗時 |
| `dads-carousel-media-loaded` | Event | 描画対象メディアの準備完了時 |
| `dads-carousel-slide-active` | Event | 新しいスライドがアクティブ化された時 |
| `dads-carousel-slide-inactive` | Event | 直前スライドが非アクティブ化された時 |
| `dads-carousel-slides-change` | Event | slides 構成（枚数/source）が変わった時 |
| `dads-carousel-toggle-all` | Event | 一覧展開状態の変更時 |


## Styling

```css
/* Custom properties */
dads-carousel {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-carousel::part(all-slides) {
  /* Style the すべてのスライド領域 */
}
```
