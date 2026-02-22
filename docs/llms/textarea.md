# dads-textarea

> Textareaコンポーネント

- **Category**: Form
- **Class**: `DadsTextarea`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/textarea/textarea.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component textarea
```

## Usage

```html
<dads-textarea
  label=""
  support-text=""
  value=""
  name=""
>
  <div slot="error-text"><!-- エラーメッセージ --></div>
  <div slot="label"><!-- ラベルテキスト --></div>
  <div slot="overflow-error"><!-- 文字数超過バリデーションのカスタムエラーメッセージ --></div>
  <div slot="required-error"><!-- 必須バリデーションのカスタムエラーメッセージ --></div>
  <div slot="support-text"><!-- サポートテキスト（ヒント） --></div>
</dads-textarea>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `auto-validate` | boolean | - | 自動バリデーションを有効化 |
| `counter-max` | number | - | カウンター用最大値（maxlength未設定時） |
| `disabled` | boolean | - | 無効状態 |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラーメッセージ（スロット未使用時のフォールバック） |
| `label` | string | - | ラベルテキスト（スロット未使用時のフォールバック） |
| `maxlength` | number | - | 最大文字数 |
| `name` | string | - | フォーム名 |
| `readonly` | boolean | - | 読み取り専用 |
| `required` | boolean | - | 必須項目 |
| `rows` | number | - | 行数（デフォルト: 3） |
| `show-counter` | boolean | - | 文字数カウンター表示 |
| `size` | string | - | サイズ (sm | md | lg) |
| `support-text` | string | - | サポートテキスト（スロット未使用時のフォールバック） |
| `value` | string | - | 値 |


## Slots

| Slot | Description |
|------|-------------|
| `error-text` | エラーメッセージ |
| `label` | ラベルテキスト |
| `overflow-error` | 文字数超過バリデーションのカスタムエラーメッセージ |
| `required-error` | 必須バリデーションのカスタムエラーメッセージ |
| `support-text` | サポートテキスト（ヒント） |


## CSS Parts

| Part | Description |
|------|-------------|
| `counter` | 文字数カウンター（show-counter未設定時は:emptyで自動非表示） |
| `error-text` | エラーメッセージコンテナ |
| `label` | ラベル要素 |
| `requirement` | 要否ラベル（必須/読み取り専用） |
| `support-text` | サポートテキストコンテナ |
| `textarea` | ネイティブtextarea要素 |
| `textarea-wrapper` | テキストエリアを囲むコンテナ |
| `wrapper` | 全体を囲むコンテナ |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-textarea-background` | - |  |
| `--dads-textarea-border-color` | - |  |
| `--dads-textarea-border-radius` | - |  |
| `--dads-textarea-border-width` | - |  |
| `--dads-textarea-color` | - |  |
| `--dads-textarea-counter-color` | - |  |
| `--dads-textarea-error-color` | - |  |
| `--dads-textarea-font-size` | - |  |
| `--dads-textarea-label-color` | - |  |
| `--dads-textarea-label-size` | - |  |
| `--dads-textarea-label-weight` | - |  |
| `--dads-textarea-min-height` | - |  |
| `--dads-textarea-padding` | - |  |
| `--dads-textarea-placeholder-color` | - |  |
| `--dads-textarea-requirement-color` | - |  |
| `--dads-textarea-resize` | - |  |
| `--dads-textarea-support-color` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 値変更確定時に発火 |
| `dads-input` | Event | 入力時に発火 |


## Styling

```css
/* Custom properties */
dads-textarea {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-textarea::part(counter) {
  /* Style the 文字数カウンター（show-counter未設定時は:emptyで自動非表示） */
}
```
