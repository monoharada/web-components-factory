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
