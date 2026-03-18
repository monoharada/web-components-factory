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
<dads-resource-list
  href="/files/guide.pdf"
  download
  data-interaction="whole"
  data-style="frame"
>
  <span slot="title">申請ガイド（PDF）</span>
  <span slot="support">PDF 1.2MB</span>
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
| `--dads-resource-list-action-width` | - | action 幅 |
| `--dads-resource-list-background` | - | 背景色 |
| `--dads-resource-list-background-disabled` | - | 無効時背景色 |
| `--dads-resource-list-background-selected` | - | 選択時背景色 |
| `--dads-resource-list-border-color` | - | 罫線色 |
| `--dads-resource-list-border-color-disabled` | - | 無効時罫線色 |
| `--dads-resource-list-border-color-selected` | - | 選択時罫線色 |
| `--dads-resource-list-border-radius` | - |  |
| `--dads-resource-list-color` | - | 文字色 |
| `--dads-resource-list-color-disabled` | - | 無効時文字色 |
| `--dads-resource-list-content-gap` | - | contents 内行間 |
| `--dads-resource-list-control-hit-area` | - | control 領域の最小ヒットサイズ |
| `--dads-resource-list-focus-outline-color` | - |  |
| `--dads-resource-list-focus-outline-offset` | - |  |
| `--dads-resource-list-focus-outline-width` | - |  |
| `--dads-resource-list-focus-ring-color` | - |  |
| `--dads-resource-list-focus-ring-width` | - |  |
| `--dads-resource-list-font-family` | - |  |
| `--dads-resource-list-font-size` | - |  |
| `--dads-resource-list-gap` | - | body 内要素間隔 |
| `--dads-resource-list-hover-background` | - |  |
| `--dads-resource-list-hover-outline-width` | - |  |
| `--dads-resource-list-letter-spacing` | - |  |
| `--dads-resource-list-line-height` | - |  |
| `--dads-resource-list-padding-block` | - | 上下余白 |
| `--dads-resource-list-padding-inline` | - | 左右余白 |
| `--dads-resource-list-title-color` | - |  |
| `--dads-resource-list-title-font-size` | - |  |
| `--dads-resource-list-title-font-weight` | - |  |
| `--dads-resource-list-title-letter-spacing` | - |  |
| `--dads-resource-list-title-line-height` | - |  |
| `--dads-resource-list-title-link-color` | - |  |
| `--dads-resource-list-title-link-color-active` | - |  |
| `--dads-resource-list-title-link-color-hover` | - |  |
| `--dads-resource-list-title-underline-offset` | - |  |
| `--dads-resource-list-title-underline-thickness` | - |  |
| `--dads-resource-list-title-underline-thickness-hover` | - |  |
| `--dads-resource-list-whole-focus-outline-width` | - |  |


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
