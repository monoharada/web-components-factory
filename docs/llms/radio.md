# dads-radio

> Radioコンポーネント

- **Category**: Form
- **Class**: `DadsRadio`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/radio/radio.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component radio
```

## Usage

```html
<dads-radio
  label=""
  value=""
  name=""
  size=""
>
  <div slot="required-error"><!-- 必須バリデーションのカスタムエラーメッセージ（非表示） --></div>
</dads-radio>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-describedby` | string | - | 補足/エラー参照 |
| `aria-label` | string | - | アクセシビリティラベル（ラベルなし時に推奨） |
| `aria-labelledby` | string | - | 外部ラベル参照 |
| `auto-validate` | boolean | - | submit時の自動バリデーション |
| `checked` | boolean | - | 初期チェック状態（属性はデフォルト値として扱う） |
| `disabled` | boolean | - | 無効状態 |
| `error` | boolean | - | エラー状態（aria-invalid="true"） |
| `error-text` | string | - | エラーメッセージ（バリデーション時に設定） |
| `label` | string | - | ラベルテキスト |
| `name` | string | - | フォーム名（グループ判定に使用） |
| `required` | boolean | - | 必須（グループ内で未選択のままsubmit時にinvalid） |
| `size` | string | - | サイズ (sm | md | lg) |
| `value` | string | - | 送信値（未指定時は "on"） |


## Slots

| Slot | Description |
|------|-------------|
| `required-error` | 必須バリデーションのカスタムエラーメッセージ（非表示） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | label相当のラッパー |
| `error-text` | エラーメッセージ |
| `input` | ネイティブinput[type=radio] |
| `label` | ラベルテキスト |
| `radio` | ラジオ枠（背景ホバー含む） |
| `requirement` | 要否ラベル（※必須） |


## Styling

```css
/* Custom properties */
dads-radio {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-radio::part(base) {
  /* Style the label相当のラッパー */
}
```
