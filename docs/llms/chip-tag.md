# dads-chip-tag

> チップタグコンポーネント

- **Category**: Display
- **Class**: `DadsChipTag`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/chip-tag/chip-tag.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component chip-tag
```

## Usage

```html
<dads-chip-tag
  value=""
  size=""
  disabled
>
  <div slot="end-icon"><!-- 末尾アイコン（オプション / 削除アクション用） --></div>
  <div slot="start-icon"><!-- 先頭アイコン（オプション） --></div>
</dads-chip-tag>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `action` | 'remove' \| 'none' | - | 末尾アクションの表示制御 |
| `disabled` | boolean | - | 無効状態 |
| `remove-label` | string | - | 末尾アクションのaria-label |
| `size` | string | - | サイズ (sm | md | lg) |
| `value` | string | - | 任意の値（イベントdetailに含まれる） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ラベルテキスト |
| `end-icon` | 末尾アイコン（オプション / 削除アクション用） |
| `start-icon` | 先頭アイコン（オプション） |


## CSS Parts

| Part | Description |
|------|-------------|
| `action` | 末尾アクションボタン |
| `action-icon` | 末尾アイコンコンテナ |
| `base` | チップタグ本体 |
| `label` | ラベルテキストコンテナ |
| `start-icon` | 先頭アイコンスロット |
| `value` | value属性の表示テキスト |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-chip-tag-click` | Event | action="none"時、チップ本体押下で発火（detail: { label, value }) NOTE: Invoker API / commandfor は現時点では採用せず、CustomEvent で操作を公開します。 |
| `dads-chip-tag-remove` | Event | 末尾アクション押下時に発火（detail: { label, value, remove() }) |


## Styling

```css
/* Custom properties */
dads-chip-tag {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-chip-tag::part(action) {
  /* Style the 末尾アクションボタン */
}
```
