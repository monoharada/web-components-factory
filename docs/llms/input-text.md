# dads-input-text

> InputTextコンポーネント

- **Category**: Form
- **Class**: `DadsInputText`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/input-text/input-text.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component input-text
```

## Usage

```html
<dads-input-text
  label=""
  support-text=""
  value=""
  name=""
>
  <div slot="error-text"><!-- エラーメッセージ --></div>
  <div slot="label"><!-- ラベルテキスト --></div>
  <div slot="required-error"><!-- 必須バリデーションのカスタムエラーメッセージ --></div>
  <div slot="support-text"><!-- サポートテキスト（ヒント） --></div>
  <div slot="type-mismatch-error"><!-- タイプ不一致（email形式）バリデーションのカスタムエラーメッセージ --></div>
</dads-input-text>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `auto-validate` | boolean | - | 自動バリデーションを有効化 |
| `autocomplete` | string | - | オートコンプリートヒント |
| `disabled` | boolean | - | 無効状態 |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラーメッセージ（スロット未使用時のフォールバック） |
| `input-width` | string | - | 幅バリアント (short | medium | full | カスタム値) |
| `inputmode` | 'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url' | - | モバイル向け入力モードヒント |
| `label` | string | - | ラベルテキスト（スロット未使用時のフォールバック） |
| `name` | string | - | フォーム名 |
| `readonly` | boolean | - | 読み取り専用 |
| `required` | boolean | - | 必須項目 |
| `size` | string | - | サイズ (sm | md | lg) |
| `support-text` | string | - | サポートテキスト（スロット未使用時のフォールバック） |
| `type` | string | - | 入力タイプ (text | email | tel) |
| `value` | string | - | 値 |


## Slots

| Slot | Description |
|------|-------------|
| `error-text` | エラーメッセージ |
| `label` | ラベルテキスト |
| `required-error` | 必須バリデーションのカスタムエラーメッセージ |
| `support-text` | サポートテキスト（ヒント） |
| `type-mismatch-error` | タイプ不一致（email形式）バリデーションのカスタムエラーメッセージ |


## CSS Parts

| Part | Description |
|------|-------------|
| `error-text` | エラーメッセージコンテナ |
| `input` | ネイティブinput要素 |
| `input-wrapper` | インプットを囲むコンテナ |
| `label` | ラベル要素 |
| `label-text` | ラベルテキストラッパー |
| `requirement` | 要否ラベル（必須/読み取り専用） |
| `support-text` | サポートテキストコンテナ |
| `wrapper` | 全体を囲むコンテナ |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-input-background` | - | 入力フィールドの背景色 |
| `--dads-input-border-color` | - | 枠線色 |
| `--dads-input-border-radius` | - | 角丸のサイズ |
| `--dads-input-border-width` | - | 枠線の太さ |
| `--dads-input-color` | - | 入力テキスト色 |
| `--dads-input-error-color` | - | エラーメッセージの色 |
| `--dads-input-font-size` | - | 入力テキストのフォントサイズ |
| `--dads-input-height` | - | 入力フィールドの高さ |
| `--dads-input-label-color` | - | ラベルの色 |
| `--dads-input-label-size` | - | ラベルのフォントサイズ |
| `--dads-input-label-weight` | - | ラベルのフォントウェイト |
| `--dads-input-padding` | - | 入力フィールドの内側余白 |
| `--dads-input-placeholder-color` | - | プレースホルダーテキスト色 |
| `--dads-input-requirement-color` | - | 必須/任意ラベルの色 |
| `--dads-input-support-color` | - | サポートテキストの色 |
| `--dads-input-width` | - | 入力フィールドの幅 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 値変更確定時に発火 |
| `dads-input` | Event | 入力時に発火 |


## Styling

```css
/* Custom properties */
dads-input-text {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-input-text::part(error-text) {
  /* Style the エラーメッセージコンテナ */
}
```
