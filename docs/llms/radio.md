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


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-radio-base-padding-block` | - |  |
| `--dads-radio-border-width` | - |  |
| `--dads-radio-error-text-color` | - |  |
| `--dads-radio-error-text-font-size` | - |  |
| `--dads-radio-error-text-line-height` | - |  |
| `--dads-radio-error-text-margin-block-start` | - |  |
| `--dads-radio-focus-outline-color` | - |  |
| `--dads-radio-focus-outline-offset` | - |  |
| `--dads-radio-focus-outline-width` | - |  |
| `--dads-radio-focus-ring-color` | - |  |
| `--dads-radio-focus-ring-width` | - |  |
| `--dads-radio-font-family` | - |  |
| `--dads-radio-font-weight` | - |  |
| `--dads-radio-force-border-color` | - |  |
| `--dads-radio-force-dot-color` | - |  |
| `--dads-radio-force-hover-bg` | - |  |
| `--dads-radio-gap` | - |  |
| `--dads-radio-hover-bg` | - |  |
| `--dads-radio-hover-bg-hover` | - |  |
| `--dads-radio-inner-size` | - |  |
| `--dads-radio-input-accent-color` | - |  |
| `--dads-radio-input-accent-hover-color` | - |  |
| `--dads-radio-input-base-color` | - |  |
| `--dads-radio-input-border-color` | - |  |
| `--dads-radio-input-border-hover-color` | - |  |
| `--dads-radio-input-disabled-accent-color` | - |  |
| `--dads-radio-input-disabled-accent-hover-color` | - |  |
| `--dads-radio-input-disabled-base-color` | - |  |
| `--dads-radio-input-disabled-border-color` | - |  |
| `--dads-radio-input-disabled-border-hover-color` | - |  |
| `--dads-radio-input-error-accent-color` | - |  |
| `--dads-radio-input-error-accent-hover-color` | - |  |
| `--dads-radio-input-error-border-color` | - |  |
| `--dads-radio-input-error-border-hover-color` | - |  |
| `--dads-radio-label-color` | - |  |
| `--dads-radio-label-font-size` | - |  |
| `--dads-radio-label-line-height` | - |  |
| `--dads-radio-label-padding-top` | - |  |
| `--dads-radio-outer-size` | - |  |
| `--dads-radio-requirement-color` | - |  |
| `--dads-radio-requirement-margin` | - |  |
| `--dads-radio-target-size` | - |  |


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
