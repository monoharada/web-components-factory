# dads-menu-list-item

> メニューリスト項目コンポーネント

- **Category**: Navigation
- **Class**: `DadsMenuListItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/menu-list/menu-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component menu-list-item
```

## Usage

```html
<dads-menu-list-item
  variant=""
  size=""
>
  <div slot="children"><!-- 子メニュー（ネスト） --></div>
  <div slot="end-icon"><!-- 末尾アイコン（arrow-right / caret） --></div>
  <div slot="start-icon"><!-- 先頭アイコン --></div>
  <div slot="tail-icon"><!-- ラベル末尾アイコン（デフォルト: 新規タブで開く） --></div>
</dads-menu-list-item>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `current` | boolean | - | 現在地 |
| `download` | boolean | - | download属性 |
| `end-icon` | string | - | 末尾アイコン（arrow-right | caret | none） |
| `expanded` | boolean | - | 展開状態 |
| `href` | string | - | リンクURL（指定時は <a> として動作） |
| `rel` | string | - | リンクrel |
| `size` | string | - | サイズ（regular | small） |
| `tail-icon` | string | - | ラベル末尾アイコン（new-window | none） |
| `target` | string | - | リンクターゲット |
| `variant` | string | - | 表示タイプ（standard | box） |


## Slots

| Slot | Description |
|------|-------------|
| `children` | 子メニュー（ネスト） |
| `default` | ラベル |
| `end-icon` | 末尾アイコン（arrow-right / caret） |
| `start-icon` | 先頭アイコン |
| `tail-icon` | ラベル末尾アイコン（デフォルト: 新規タブで開く） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ボタン/リンク本体 |
| `end-icon` | 末尾アイコン領域 |
| `label` | ラベル領域 |
| `start-icon` | 先頭アイコン領域 |
| `tail-icon` | ラベル末尾アイコン領域 |


## Styling

```css
/* Custom properties */
dads-menu-list-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-menu-list-item::part(base) {
  /* Style the ボタン/リンク本体 */
}
```
