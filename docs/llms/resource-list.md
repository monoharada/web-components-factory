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
