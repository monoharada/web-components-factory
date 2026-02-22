# dads-dialog

> Dialog（モーダル）コンポーネント

- **Category**: Actions
- **Class**: `DadsDialog`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/dialog/dialog.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component dialog
```

## Usage

```html
<dads-dialog
  size=""
>
  <div slot="footer"><!-- フッター（操作ボタン群） --></div>
  <div slot="title"><!-- ダイアログタイトル --></div>
</dads-dialog>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | - | 指定時はタイトルより優先されるダイアログ名 |
| `close-button` | boolean | - | 閉じるボタン表示 |
| `close-label` | string | - | 閉じるボタンラベル |
| `initial-focus` | string | - | 初期フォーカス位置 (auto | title) |
| `open` | boolean | - | 開閉状態 |
| `size` | string | - | サイズ (s | m | l) |


## Slots

| Slot | Description |
|------|-------------|
| `default` | ダイアログ本文 |
| `footer` | フッター（操作ボタン群） |
| `title` | ダイアログタイトル |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートの dialog 要素 |
| `close-button` | 閉じるボタン（オプション） |
| `content` | 本文領域 |
| `footer` | フッター領域 |
| `header` | ヘッダー領域 |
| `panel` | ダイアログ本体 |
| `title` | タイトル領域 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-dialog-before-close` | Event | 閉じる前に発火（cancelable） |
| `dads-dialog-before-open` | Event | 開く前に発火（cancelable） |
| `dads-dialog-close` | CustomEvent | 閉じた後に発火 |
| `dads-dialog-open` | CustomEvent | 開いた後に発火 |


## Styling

```css
/* Custom properties */
dads-dialog {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-dialog::part(base) {
  /* Style the ルートの dialog 要素 */
}
```
