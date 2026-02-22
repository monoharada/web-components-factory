# dads-file-upload

> File Upload / Drop Area コンポーネント

- **Category**: Form
- **Class**: `DadsFileUpload`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Dependencies**: `button`, `checkbox`
- **Source**: `./packages/components/file-upload/file-upload.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component file-upload
```

## Usage

```html
<dads-file-upload
  label=""
  support-text=""
  name=""
  required
>
  <div slot="error-text"><!-- エラーメッセージ --></div>
  <div slot="label"><!-- ラベルテキスト --></div>
  <div slot="support-text"><!-- サポートテキスト --></div>
</dads-file-upload>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `accept` | string | - | 許可するファイル形式（input accept互換） |
| `browse-label` | string | - | ファイル選択ボタン文言 |
| `disabled` | boolean | - | 無効化 |
| `drop-hint` | string | - | ドロップヒント文言 |
| `empty-text` | string | - | 未選択文言 |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラーメッセージ（slot未使用時のフォールバック） |
| `expand-label` | string | - | 全画面ドロップ領域拡大チェック文言 |
| `label` | string | - | ラベル（slot未使用時のフォールバック） |
| `max-file-size` | string | - | 最大ファイルサイズ（bytes / kb / mb / gb） |
| `max-files` | string | - | 最大ファイル数 |
| `mode` | string | - | 表示モード（drop-area | button-only） |
| `multiple` | boolean | - | 複数選択 |
| `name` | string | - | フォーム名 |
| `overlay-text` | string | - | 全画面オーバーレイ文言 |
| `required` | boolean | - | 必須 |
| `support-text` | string | - | サポートテキスト（slot未使用時のフォールバック） |


## Slots

| Slot | Description |
|------|-------------|
| `error-text` | エラーメッセージ |
| `label` | ラベルテキスト |
| `support-text` | サポートテキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `browse-button` | ファイル選択ボタン |
| `drop-hint` | ドラッグ&ドロップ案内 |
| `drop-main` | ボタン+ヒント行 |
| `dropzone` | ドロップエリア |
| `empty-text` | 未選択メッセージ |
| `error-text` | エラーメッセージ |
| `expand-checkbox` | 全画面ドロップ領域拡大チェック |
| `file-index` | ファイル番号 |
| `file-item` | ファイル行 |
| `file-item-error` | ファイル単位エラーメッセージ |
| `file-item-error-line` | ファイル単位エラーメッセージ行 |
| `file-list` | ファイル一覧 |
| `file-meta` | 補足情報（サイズ） |
| `file-name` | ファイル名 |
| `file-status` | 状態ラベル |
| `input` | ネイティブ input[type=file] |
| `label` | ラベル要素 |
| `label-text` | ラベルテキストラッパー |
| `overlay` | 全画面ドロップオーバーレイ |
| `overlay-text` | オーバーレイ文言 |
| `remove-button` | 解除ボタン |
| `requirement` | 要否ラベル（※必須） |
| `selection-summary` | 選択中ファイル数/合計サイズ |
| `support-text` | サポートテキスト |
| `wrapper` | 全体ラッパー |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-file-upload-before-add` | Event | ファイル追加前（cancelable） |
| `dads-file-upload-change` | Event | ファイル一覧変更時 |
| `dads-file-upload-fullscreen-change` | Event | 全画面ドロップ切り替え時 |
| `dads-file-upload-request` | Event | requestUpload() 呼び出し時 |
| `dads-file-upload-validation-error` | Event | バリデーションエラー時 |


## Styling

```css
/* Custom properties */
dads-file-upload {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-file-upload::part(browse-button) {
  /* Style the ファイル選択ボタン */
}
```
