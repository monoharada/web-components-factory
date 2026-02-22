# dads-resource-list

> リソースリストコンポーネント

- **Category**: Content
- **Class**: `DadsResourceList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/resource-list/resource-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component resource-list
```

## Usage

```html
<dads-resource-list>
  <div slot="action"><!-- 右端アクション --></div>
  <div slot="control"><!-- チェックボックス/ラジオ等の選択コントロール --></div>
  <div slot="icon"><!-- 先頭アイコン --></div>
  <div slot="label"><!-- ラベル --></div>
  <div slot="sub"><!-- サブラベル --></div>
  <div slot="support"><!-- サポートテキスト --></div>
  <div slot="title"><!-- タイトル --></div>
</dads-resource-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-interaction` | 'inline' \| 'whole' | - | 操作方式（DADS互換） |
| `data-style` | 'list' \| 'frame' | - | スタイル種別（DADS互換） |
| `download` | boolean | - | 全体リンク時のdownload属性 |
| `href` | string | - | 全体リンク時の遷移先URL |
| `rel` | string | - | 全体リンク時のrel属性 |
| `target` | string | - | 全体リンク時のtarget属性 |


## Slots

| Slot | Description |
|------|-------------|
| `action` | 右端アクション |
| `control` | チェックボックス/ラジオ等の選択コントロール |
| `icon` | 先頭アイコン |
| `label` | ラベル |
| `sub` | サブラベル |
| `support` | サポートテキスト |
| `title` | タイトル |


## CSS Parts

| Part | Description |
|------|-------------|
| `action` | 右端アクション領域 |
| `base` | ルート領域 |
| `body` | 本体領域（全体リンク時は <a>） |
| `contents` | タイトル/ラベル/サポートテキスト領域 |
| `control` | 選択コントロール領域 |
| `icon` | 先頭アイコン領域 |
| `label` | ラベル領域 |
| `sub` | サブラベル領域 |
| `support` | サポートテキスト領域 |
| `title` | タイトル領域 |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-resource-list-background` | - | 背景色 |
| `--dads-resource-list-background-selected` | - | 選択時背景色 |
| `--dads-resource-list-background-disabled` | - | 無効時背景色 |
| `--dads-resource-list-color` | - | 文字色 |
| `--dads-resource-list-color-disabled` | - | 無効時文字色 |
| `--dads-resource-list-border-color` | - | 罫線色 |
| `--dads-resource-list-border-color-selected` | - | 選択時罫線色 |
| `--dads-resource-list-border-color-disabled` | - | 無効時罫線色 |
| `--dads-resource-list-padding-block` | - | 上下余白 |
| `--dads-resource-list-padding-inline` | - | 左右余白 |
| `--dads-resource-list-gap` | - | body 内要素間隔 |
| `--dads-resource-list-content-gap` | - | contents 内行間 |
| `--dads-resource-list-control-hit-area` | - | control 領域の最小ヒットサイズ |
| `--dads-resource-list-action-width` | - | action 幅 |


## Styling

```css
/* Custom properties */
dads-resource-list {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-resource-list::part(action) {
  /* Style the 右端アクション領域 */
}
```
