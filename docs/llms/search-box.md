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
