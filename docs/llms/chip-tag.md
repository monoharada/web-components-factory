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


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-chip-tag-action-background` | - |  |
| `--dads-chip-tag-action-background-active` | - |  |
| `--dads-chip-tag-action-background-hover` | - |  |
| `--dads-chip-tag-action-border-color` | - |  |
| `--dads-chip-tag-action-border-width` | - |  |
| `--dads-chip-tag-action-hit-area` | - | アクションのヒット領域（見た目は維持したまま拡張） |
| `--dads-chip-tag-action-hit-padding` | - |  |
| `--dads-chip-tag-action-icon-color` | - |  |
| `--dads-chip-tag-action-icon-color-active` | - |  |
| `--dads-chip-tag-action-icon-color-hover` | - |  |
| `--dads-chip-tag-action-icon-size` | - | アクション内アイコンサイズ |
| `--dads-chip-tag-action-size` | - |  |
| `--dads-chip-tag-background` | - | 背景色 |
| `--dads-chip-tag-border-color` | - | 枠線色 |
| `--dads-chip-tag-border-radius` | - | 角丸 |
| `--dads-chip-tag-border-shadow` | - | 外周の補助線 |
| `--dads-chip-tag-border-shadow-hover` | - | hover時の外周補助線 |
| `--dads-chip-tag-border-width` | - | 枠線の太さ |
| `--dads-chip-tag-focus-text-element-bg` | - |  |
| `--dads-chip-tag-font-family` | - |  |
| `--dads-chip-tag-font-size` | - |  |
| `--dads-chip-tag-font-weight` | - |  |
| `--dads-chip-tag-icon-size` | - | アイコンサイズ |
| `--dads-chip-tag-label-padding-bottom` | - | ラベルの下パディング |
| `--dads-chip-tag-label-padding-inline` | - | ラベルの左右パディング |
| `--dads-chip-tag-label-text-decoration` | - | ラベルの装飾線 |
| `--dads-chip-tag-label-underline-offset` | - | ラベル下線のオフセット |
| `--dads-chip-tag-label-underline-thickness` | - | ラベル下線の太さ |
| `--dads-chip-tag-label-underline-thickness-hover` | - | hover/active時のラベル下線の太さ |
| `--dads-chip-tag-letter-spacing` | - |  |
| `--dads-chip-tag-line-height` | - |  |
| `--dads-chip-tag-min-height` | - | 最小高さ |
| `--dads-chip-tag-padding-block` | - | 上下パディング |
| `--dads-chip-tag-padding-inline` | - | 左右パディング |
| `--dads-chip-tag-text-color` | - | テキスト色 |
| `--dads-chip-tag-text-color-active` | - | active時のテキスト色 |
| `--dads-chip-tag-text-color-hover` | - | hover時のテキスト色 |


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
