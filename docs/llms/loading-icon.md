# dads-loading-icon

> LoadingIconコンポーネント

- **Category**: Other
- **Class**: `DadsLoadingIcon`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/loading-icon/loading-icon.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component loading-icon
```

## Usage

```html
<dads-loading-icon
  label=""
  size=""
>...</dads-loading-icon>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `composition` | 'stacked' \| 'inlined' | - | レイアウト方向 |
| `label` | string | - | 表示ラベル兼アクセシブル名（指定時はaria-hidden解除、role="img"、title要素追加） |
| `size` | 'sm' \| 'lg' | - | サイズ（sm: 24px, lg: 48px） |
| `underlay` | boolean | - | カード背景表示 |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートコンテナ |
| `icon` | SVGアイコン要素 |
| `label` | ラベルテキスト |
| `underlay` | カード背景（underlay属性時に表示） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-loading-icon-` | - |  |
| `--dads-loading-icon-color` | - | アイコン色 |
| `--dads-loading-icon-label-color` | - | ラベルテキスト色 |
| `--dads-loading-icon-underlay-bg` | - | アンダーレイ背景色 |
| `--dads-loading-icon-underlay-border` | - | アンダーレイ枠線色 |


## Styling

```css
/* Custom properties */
dads-loading-icon {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-loading-icon::part(base) {
  /* Style the ルートコンテナ */
}
```
