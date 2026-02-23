# dads-progress-bar

> Progress Barコンポーネント

- **Category**: Other
- **Class**: `DadsProgressBar`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/progress-bar/progress-bar.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component progress-bar
```

## Usage

```html
<dads-progress-bar
  label=""
  value=""
>...</dads-progress-bar>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `composition` | 'stacked' \| 'inlined' | - | レイアウト方向 |
| `label` | string | - | 表示ラベル兼アクセシブル名 |
| `max` | string | - | 最大値（デフォルト: 1、0以下は1にクランプ） |
| `underlay` | boolean | - | カード背景表示 |
| `value` | string | - | 進捗値（0〜max、未設定=indeterminate） |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートコンテナ（role="progressbar"） |
| `indicator` | インジケーターバー（進捗表示） |
| `label` | ラベルテキスト |
| `track` | トラックバー（背景） |
| `underlay` | カード背景（underlay属性時に表示） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-progress-bar-` | - |  |
| `--dads-progress-bar-indicator-color` | - | インジケーター色 |
| `--dads-progress-bar-label-color` | - | ラベルテキスト色 |
| `--dads-progress-bar-track-color` | - | トラック色 |
| `--dads-progress-bar-underlay-bg` | - | アンダーレイ背景色 |
| `--dads-progress-bar-underlay-border` | - | アンダーレイ枠線色 |


## Styling

```css
/* Custom properties */
dads-progress-bar {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-progress-bar::part(base) {
  /* Style the ルートコンテナ（role="progressbar"） */
}
```
