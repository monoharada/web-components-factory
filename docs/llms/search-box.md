# dads-search-box

> SearchBoxコンポーネント

- **Category**: Form
- **Class**: `DadsSearchBox`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Dependencies**: `button`
- **Source**: `./packages/components/search-box/search-box.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component search-box
```

## Usage

```html
<dads-search-box
  label=""
  value=""
  name=""
>...</dads-search-box>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-describedby` | string | - | 検索語inputへ転写（外部説明参照） |
| `aria-label` | string | - | 検索語inputへ転写（labelの代替） |
| `aria-labelledby` | string | - | 検索語inputへ転写（外部ラベル参照） |
| `button-label` | string | - | 送信ボタンのラベル（デフォルト: 検索） |
| `label` | string | - | 検索語の視覚的に非表示ラベル（デフォルト: 検索） |
| `name` | string | - | 検索語のフォーム名（デフォルト: q） |
| `scope-label` | string | - | 検索対象の可視ラベル（デフォルト: 検索対象） |
| `scope-name` | string | - | 検索対象のフォーム名（デフォルト: scope） |
| `scope-value` | string | - | 検索対象の選択値 |
| `value` | string | - | 検索語 |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルート（横並びコンテナ） |
| `button` | 送信ボタン（<dads-button>） |
| `fields` | フィールド群（scope + query） |
| `input` | 検索語 input[type="search"] |
| `query` | 検索語入力のラベルコンテナ |
| `scope` | 検索対象セレクトのラベルコンテナ |
| `scope-icon` | 検索対象セレクトの矢印アイコン |
| `scope-label` | 検索対象ラベルテキスト |
| `scope-select` | 検索対象セレクト |
| `search-icon` | 虫眼鏡アイコン |
| `visually-hidden` | スクリーンリーダー向けラベル |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-search-box-gap` | - | fields と button の間隔 |
| `--dads-search-box-color` | - | 全体の文字色 |
| `--dads-search-box-font-size` | - | ベース文字サイズ |
| `--dads-search-box-letter-spacing` | - | 文字詰め |
| `--dads-search-box-border-color` | - | 枠線色 |
| `--dads-search-box-border-color-hover` | - | hover時の枠線色 |
| `--dads-search-box-border-radius` | - | 角丸（8px） |
| `--dads-search-box-border-width` | - | 枠線幅（デフォルト: 1px） |
| `--dads-search-box-control-min-height` | - | input/select の最小高さ（44px相当） |
| `--dads-search-box-scope-width` | - | scope select 幅 |
| `--dads-search-box-scope-bg` | - | scope select 背景 |
| `--dads-search-box-scope-label-color` | - | scopeラベル色 |
| `--dads-search-box-scope-icon-color` | - | scopeアイコン色 |
| `--dads-search-box-scope-icon-size` | - | scopeアイコンサイズ（デフォルト: 16px） |
| `--dads-search-box-scope-padding` | - | scope select のパディング |
| `--dads-search-box-input-bg` | - | input 背景 |
| `--dads-search-box-input-min-width` | - | input 最小幅（デフォルト: 8rem） |
| `--dads-search-box-input-padding` | - | input padding |
| `--dads-search-box-search-icon-color` | - | 虫眼鏡色 |
| `--dads-search-box-search-icon-size` | - | 虫眼鏡アイコンサイズ（デフォルト: 24px） |
| `--dads-search-box-button-bg` | - | ボタン背景色 |
| `--dads-search-box-button-color` | - | ボタン文字色 |
| `--dads-search-box-button-bg-hover` | - | ボタンホバー時背景色 |
| `--dads-search-box-button-border-color` | - | ボタン枠線色 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 値変更確定時に発火（detail: { query: string, scope: string }） |
| `dads-input` | Event | 入力時に発火（detail: { query: string, scope: string }） |
| `dads-search` | Event | 検索実行時に発火（detail: { query: string, scope: string }、cancelable） |


## Styling

```css
/* Custom properties */
dads-search-box {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-search-box::part(base) {
  /* Style the ルート（横並びコンテナ） */
}
```
