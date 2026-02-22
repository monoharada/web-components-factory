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
