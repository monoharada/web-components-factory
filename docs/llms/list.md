# dads-list

> 箇条書きリスト（コンテナ）コンポーネント

- **Category**: Content
- **Class**: `DadsList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/list/list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component list
```

## Usage

```html
<dads-list
  variant=""
>...</dads-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `marker-width` | number | - | 項番タイプのマーカー幅（全角n文字相当、CSSでは n em） |
| `spacing` | 'lg' \| 'md' \| 'sm' | - | 項目間隔（12/8/4） |
| `variant` | 'marker' \| 'number' | - | 表示タイプ（リストマーク / 項番） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | リスト項目（dads-list-item） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | role="list" のルート |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-list-indent` | - | インデント（depthに応じて設定） |
| `--dads-list-item-display` | - |  |
| `--dads-list-item-gap` | - | アイテム間隔（spacingに応じて設定） |
| `--dads-list-item-position` | - |  |
| `--dads-list-marker-color` | - | マーカー色 |
| `--dads-list-marker-content` | - | リストマーク（markerタイプ用、装飾用途） |
| `--dads-list-marker-content-1` | - | マーカー種別1（depth1） |
| `--dads-list-marker-content-2` | - | マーカー種別2（depth2-4） |
| `--dads-list-marker-content-3` | - | マーカー種別3（depth5+） |
| `--dads-list-marker-gap` | - | マーカー列と本文列の間隔 |
| `--dads-list-marker-inset-block-start` | - |  |
| `--dads-list-marker-inset-inline-start` | - |  |
| `--dads-list-marker-line-height` | - |  |
| `--dads-list-marker-position` | - |  |
| `--dads-list-marker-size` | - | マーカー記号のサイズ（markerタイプ向け） |
| `--dads-list-marker-slot-display` | - |  |
| `--dads-list-marker-text-align` | - |  |
| `--dads-list-marker-width` | - | マーカー列の幅（marker-widthで上書き可能） |


## Styling

```css
/* Custom properties */
dads-list {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-list::part(base) {
  /* Style the role="list" のルート */
}
```
