# dads-list-item

> 箇条書きリスト（アイテム）コンポーネント

- **Category**: Content
- **Class**: `DadsListItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/list/list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component list-item
```

## Usage

```html
<dads-list-item>
  <div slot="marker"><!-- 項番（numberタイプ向け、コピー可能な“地のテキスト”） --></div>
</dads-list-item>
```

## Attributes

None


## Slots

| Slot | Description |
|------|-------------|
| `default` | 本文（ネストした dads-list を含められます） |
| `marker` | 項番（numberタイプ向け、コピー可能な“地のテキスト”） |


## CSS Parts

| Part | Description |
|------|-------------|
| `content` | 本文列 |
| `item` | role="listitem" のルート |
| `marker` | マーカー列 |
| `marker-glyph` | 予備のマーカー記号領域（通常は非表示） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-list-indent` | - |  |
| `--dads-list-item-display` | - |  |
| `--dads-list-item-gap` | - |  |
| `--dads-list-item-position` | - |  |
| `--dads-list-marker-color` | - | マーカー色 |
| `--dads-list-marker-content` | - | リストマーク（markerタイプ用、装飾用途） |
| `--dads-list-marker-content-1` | - |  |
| `--dads-list-marker-content-2` | - |  |
| `--dads-list-marker-content-3` | - |  |
| `--dads-list-marker-gap` | - | マーカー列と本文列の間隔 |
| `--dads-list-marker-inset-block-start` | - |  |
| `--dads-list-marker-inset-inline-start` | - |  |
| `--dads-list-marker-line-height` | - |  |
| `--dads-list-marker-position` | - |  |
| `--dads-list-marker-size` | - | マーカー記号のサイズ（markerタイプ向け） |
| `--dads-list-marker-slot-display` | - |  |
| `--dads-list-marker-text-align` | - |  |
| `--dads-list-marker-width` | - | マーカー列の幅 |


## Styling

```css
/* Custom properties */
dads-list-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-list-item::part(content) {
  /* Style the 本文列 */
}
```
