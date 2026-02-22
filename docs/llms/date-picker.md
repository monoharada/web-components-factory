# dads-date-picker

> 日付ピッカーコンポーネント

- **Category**: Form
- **Class**: `DadsDatePicker`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Dependencies**: `calendar`
- **Source**: `./packages/components/date-picker/date-picker-impl.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component date-picker
```

## Usage

```html
<dads-date-picker
  value=""
  size=""
  disabled
>
  <div slot="error-text"><!-- エラーテキスト --></div>
</dads-date-picker>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-describedby` | string | - | 外部説明要素の関連付け |
| `calendar` | boolean | - | カレンダー表示を有効化 |
| `data-type` | string | - | 表示タイプ（consolidated | separated） |
| `disabled` | boolean | - | 無効状態 |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラーテキスト（スロット未使用時のフォールバック） |
| `max-date` | string | - | 最大日付（YYYY-MM-DD） |
| `min-date` | string | - | 最小日付（YYYY-MM-DD） |
| `readonly` | boolean | - | 読み取り専用 |
| `size` | string | - | サイズ（sm | md | lg） |
| `value` | string | - | 値（YYYY-MM-DD） |


## Slots

| Slot | Description |
|------|-------------|
| `error-text` | エラーテキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `calendar` | 内包カレンダー |
| `calendar-button` | カレンダーボタン |
| `calendar-popover` | カレンダー（role="dialog"） |
| `error-text` | エラーテキスト領域 |
| `input` | 入力欄 |
| `inputs` | 入力欄グループ |
| `root` | ルート |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 値確定時に発火（detail: { value: string }） |
| `dads-input` | Event | 入力時に発火（detail: { value: string }） |


## Styling

```css
/* Custom properties */
dads-date-picker {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-date-picker::part(calendar) {
  /* Style the 内包カレンダー */
}
```
