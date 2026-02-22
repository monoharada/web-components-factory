# dads-combobox

> Comboboxコンポーネント

- **Category**: Form
- **Class**: `DadsCombobox`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Dependencies**: `avatar`, `chip-tag`, `icon`
- **Source**: `./packages/components/combobox/combobox.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component combobox
```

## Usage

```html
<dads-combobox
  label=""
  support-text=""
  value=""
  name=""
>
  <div slot="error-text"><!-- エラーテキスト --></div>
  <div slot="label"><!-- ラベルテキスト --></div>
  <div slot="required-error"><!-- 必須バリデーション用のカスタムメッセージ --></div>
  <div slot="support-text"><!-- サポートテキスト --></div>
</dads-combobox>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `behavior` | 'selection' \| 'input' | - | 操作モード（default: selection） |
| `clear-on-close` | boolean | - | close時にqueryをクリア（常に実行） |
| `disabled` | boolean | - | 無効状態 |
| `error` | boolean | - | エラー状態 |
| `error-text` | string | - | エラー属性フォールバック |
| `filterable` | boolean | - | 入力絞り込みの有効化 |
| `label` | string | - | ラベル属性フォールバック |
| `multiple` | boolean | - | 複数選択モード |
| `name` | string | - | フォーム名 |
| `no-match-behavior` | 'notice' \| 'create' | - | 候補なし時挙動（default: notice） |
| `open` | boolean | - | 開閉状態 |
| `placeholder` | string | - | プレースホルダー |
| `required` | boolean | - | 必須状態 |
| `restore-on-cancel` | boolean | - | singleで未確定離脱時の復帰 |
| `size` | 's' \| 'm' \| 'l' \| 'sm' \| 'md' \| 'lg' | - | サイズ |
| `support-text` | string | - | サポート属性フォールバック |
| `value` | string | - | 選択値（multiple時はカンマ区切り） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | option 要素（optionの `data-search` にJSON配列文字列を指定すると検索別名を追加可能） |
| `error-text` | エラーテキスト |
| `label` | ラベルテキスト |
| `required-error` | 必須バリデーション用のカスタムメッセージ |
| `support-text` | サポートテキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `chip` | 複数選択チップ |
| `chip-list` | 複数選択チップ群 |
| `control` | 入力コントロール |
| `error-text` | エラーテキスト |
| `indicator` | ドロップダウンインジケータ |
| `input` | 入力欄 |
| `label` | ラベル要素 |
| `label-text` | ラベルテキスト |
| `listbox` | 候補リスト |
| `option` | 候補行 |
| `option-avatar` | 候補行のアバター画像 |
| `option-check` | 候補行チェック領域（multiple） |
| `option-group-label` | グループ見出し |
| `option-icon` | 候補行のアイコン画像 |
| `option-label` | 候補ラベル |
| `option-match` | 候補ラベル内のquery一致強調 |
| `option-meta` | 候補補助テキスト |
| `panel` | フローティングパネル |
| `requirement` | 必須表示 |
| `search-box` | パネル内検索ラッパー |
| `search-icon` | パネル内検索アイコン |
| `search-input` | パネル内検索入力 |
| `support-text` | サポートテキスト |
| `wrapper` | 全体ラッパー |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 明示確定時のみ |
| `dads-close` | Event | ポップアップ閉時 |
| `dads-input` | Event | query入力変化時 |
| `dads-open` | Event | ポップアップ開時 |


## Styling

```css
/* Custom properties */
dads-combobox {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-combobox::part(chip) {
  /* Style the 複数選択チップ */
}
```
