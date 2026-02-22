# dads-description-list

> 説明リストコンポーネント

- **Category**: Content
- **Class**: `DadsDescriptionList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/description-list/description-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component description-list
```

## Usage

```html
<dads-description-list>...</dads-description-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-marker` | 'none' \| 'bullet' \| 'custom' | - | DADS HTML 互換属性（marker と同期） |
| `marker` | 'none' \| 'bullet' \| 'custom' | - | マーカー表示種別 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | 説明リスト項目（例: div > dt + dd） |


## CSS Parts

None


## Styling

```css
/* Custom properties */
dads-description-list {
  /* Override component tokens here */
}

```
