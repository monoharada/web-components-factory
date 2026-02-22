# dads-button

> Buttonコンポーネント

- **Category**: Actions
- **Class**: `DadsButton`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/button/button.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component button
```

## Usage

```html
<dads-button
  type=""
  variant=""
  size=""
  disabled
>
  <div slot="icon-end"><!-- 末尾アイコン（オプション） --></div>
  <div slot="icon-start"><!-- 先頭アイコン（オプション） --></div>
</dads-button>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-describedby` | string | - | 補足説明要素ID（スペース区切り可） |
| `aria-label` | string | - | アクセシビリティラベル |
| `aria-labelledby` | string | - | ラベル要素ID（スペース区切り可） |
| `command` | string | - | command-store / commandfor 用（任意、動作は外部に委ねる） |
| `commandfor` | string | - | command-store / commandfor 用（任意、動作は外部に委ねる） |
| `disabled` | boolean | - | 無効化状態 |
| `full-width` | boolean | - | 幅100%表示 |
| `size` | string | - | サイズ (x-small | small | medium | large) |
| `type` | string | - | ボタンタイプ (button | submit | reset) |
| `variant` | string | - | バリアント (solid | outlined | text) |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ボタンのテキストコンテンツ |
| `icon-end` | 末尾アイコン（オプション） |
| `icon-start` | 先頭アイコン（オプション） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ボタン要素本体 |
| `icon-end` | 末尾アイコンコンテナ |
| `icon-start` | 先頭アイコンコンテナ |
| `label` | ラベルテキストコンテナ |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-button-aspect-ratio` | - | アスペクト比 |
| `--dads-button-background` | - | ボタンの背景色 |
| `--dads-button-background-active` | - |  |
| `--dads-button-background-hover` | - |  |
| `--dads-button-border-color` | - |  |
| `--dads-button-border-color-active` | - |  |
| `--dads-button-border-color-hover` | - |  |
| `--dads-button-border-radius` | - | 角丸のサイズ |
| `--dads-button-border-width` | - |  |
| `--dads-button-color` | - | ボタンのテキスト色 |
| `--dads-button-color-active` | - |  |
| `--dads-button-color-hover` | - |  |
| `--dads-button-font-size` | - | フォントサイズ |
| `--dads-button-font-weight` | - | フォントウェイト |
| `--dads-button-icon-color` | - | アイコン色 |
| `--dads-button-icon-gap` | - | アイコンとラベルの間隔 |
| `--dads-button-icon-size` | - | アイコンサイズ |
| `--dads-button-line-height` | - | 行の高さ |
| `--dads-button-max-width` | - | 最大幅 |
| `--dads-button-min-height` | - | 最小高さ |
| `--dads-button-min-height-default` | - |  |
| `--dads-button-min-width` | - | 最小幅 |
| `--dads-button-opacity` | - | 無効時の不透明度 |
| `--dads-button-padding` | - | 内側の余白 |
| `--dads-button-tap-highlight-color` | - | タップ時のハイライト色 |
| `--dads-button-text-align` | - | テキスト揃え |
| `--dads-button-text-decoration` | - | テキスト装飾 |
| `--dads-button-text-transform` | - | テキスト変換（大文字化等） |
| `--dads-button-transition` | - |  |
| `--dads-button-user-select` | - | テキスト選択の可否 |
| `--dads-button-white-space` | - | テキスト折り返し制御 |
| `--dads-button-width` | - | ボタンの幅 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `click` | CustomEvent | クリック時に発火（detail: {variant, size}） |


## Styling

```css
/* Custom properties */
dads-button {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-button::part(base) {
  /* Style the ボタン要素本体 */
}
```
