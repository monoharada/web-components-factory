# dads-spinner

> Spinnerコンポーネント

- **Category**: Other
- **Class**: `DadsSpinner`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/spinner/spinner.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component spinner
```

## Usage

```html
<dads-spinner
  label=""
  size=""
>...</dads-spinner>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `composition` | 'stacked' \| 'inlined' | - | レイアウト方向 |
| `label` | string | - | 表示ラベル兼アクセシブル名 |
| `size` | 'sm' \| 'lg' | - | サイズ（sm: 24px, lg: 48px） |
| `speed` | 'slow' \| 'normal' \| 'fast' | - | アニメーション速度 |
| `underlay` | boolean | - | カード背景表示 |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートコンテナ（role="progressbar"） |
| `border` | 外周ボーダーライン |
| `indicator` | インジケーター円（アニメーション） |
| `label` | ラベルテキスト |
| `svg` | SVGコンテナ |
| `track` | トラックリング（背景ドーナツ） |
| `underlay` | カード背景（underlay属性時に表示） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-spinner-` | - |  |
| `--dads-spinner-dash-duration` | - | ダッシュアニメーション速度 |
| `--dads-spinner-indicator-color` | - | インジケーター色 |
| `--dads-spinner-label-color` | - | ラベルテキスト色 |
| `--dads-spinner-rotate-duration` | - | 回転アニメーション速度 |
| `--dads-spinner-track-color` | - | トラック色 |
| `--dads-spinner-underlay-bg` | - | アンダーレイ背景色 |
| `--dads-spinner-underlay-border` | - | アンダーレイ枠線色 |


## Styling

```css
/* Custom properties */
dads-spinner {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-spinner::part(base) {
  /* Style the ルートコンテナ（role="progressbar"） */
}
```
