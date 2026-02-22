# dads-select

> Selectコンポーネント

- **Category**: Form
- **Class**: `DadsSelect`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/select/select.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component select
```

## Usage

```html
<dads-select
  label=""
  support-text=""
  value=""
  name=""
>
  <div slot="error-text"><!-- エラーメッセージ --></div>
  <div slot="label"><!-- ラベルテキスト --></div>
  <div slot="required-error"><!-- 必須バリデーションのカスタムエラーメッセージ --></div>
  <div slot="support-text"><!-- サポートテキスト（ヒント） --></div>
</dads-select>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-disabled` | string | - | 無効相当（Tab移動は許容、操作は抑止） |
| `auto-validate` | boolean | - | 自動バリデーションを有効化 |
| `disabled` | boolean | - | 無効状態（ネイティブdisabled） |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラーメッセージ（スロット未使用時のフォールバック） |
| `label` | string | - | ラベルテキスト（スロット未使用時のフォールバック） |
| `name` | string | - | フォーム名 |
| `required` | boolean | - | 必須項目 |
| `size` | string | - | サイズ（sm | md | lg）+ 幅指定（例: "md 256", "sm 20ch", "lg full", "md fit-content"） |
| `support-text` | string | - | サポートテキスト（スロット未使用時のフォールバック） |
| `value` | string | - | 初期値 |


## Slots

| Slot | Description |
|------|-------------|
| `default` | option / optgroup（Light DOMに配置、内部selectへ複製） |
| `error-text` | エラーメッセージ |
| `label` | ラベルテキスト |
| `required-error` | 必須バリデーションのカスタムエラーメッセージ |
| `support-text` | サポートテキスト（ヒント） |


## CSS Parts

| Part | Description |
|------|-------------|
| `error-text` | エラーメッセージコンテナ |
| `label` | ラベル要素 |
| `label-text` | ラベルテキストラッパー |
| `requirement` | 要否ラベル（※必須） |
| `select` | ネイティブselect要素 |
| `select-chevron` | セレクトの矢印アイコン |
| `select-wrapper` | selectを囲むコンテナ |
| `support-text` | サポートテキストコンテナ |
| `wrapper` | 全体を囲むコンテナ |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-select-background` | - |  |
| `--dads-select-border-color` | - |  |
| `--dads-select-border-radius` | - |  |
| `--dads-select-border-width` | - |  |
| `--dads-select-chevron-color` | - |  |
| `--dads-select-color` | - |  |
| `--dads-select-error-color` | - |  |
| `--dads-select-font-size` | - |  |
| `--dads-select-height` | - |  |
| `--dads-select-label-color` | - |  |
| `--dads-select-label-size` | - |  |
| `--dads-select-label-weight` | - |  |
| `--dads-select-letter-spacing` | - |  |
| `--dads-select-padding-left` | - |  |
| `--dads-select-padding-right` | - |  |
| `--dads-select-padding-y` | - |  |
| `--dads-select-requirement-color` | - |  |
| `--dads-select-support-color` | - |  |
| `--dads-select-width` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 値変更確定時に発火 |
| `dads-input` | Event | 入力時に発火 |


## Styling

```css
/* Custom properties */
dads-select {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-select::part(error-text) {
  /* Style the エラーメッセージコンテナ */
}
```
