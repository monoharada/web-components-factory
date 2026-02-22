# dads-breadcrumb-item

> 現在位置ナビゲーション（パンくず）項目

- **Category**: Navigation
- **Class**: `DadsBreadcrumbItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/breadcrumb/breadcrumb.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component breadcrumb-item
```

## Usage

```html
<dads-breadcrumb-item>...</dads-breadcrumb-item>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-current` | string | - | 現在位置（page） |
| `current` | boolean | - | 現在ページ |
| `home` | boolean | - | ホームアイコン表示 |
| `href` | string | - | リンク先URL |
| `rel` | string | - | リンクrel |
| `target` | string | - | リンクターゲット |


## Slots

| Slot | Description |
|------|-------------|
| `default` | 項目テキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `current` | 現在項目テキスト |
| `home-icon` | ホームアイコン |
| `item` | アイテムルート（p要素） |
| `link` | 非現在項目リンク |
| `separator` | 区切り |
| `separator-icon` | 区切りアイコン |
| `separator-text` | 区切りテキスト（slash / pipe） |


## Styling

```css
/* Custom properties */
dads-breadcrumb-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-breadcrumb-item::part(current) {
  /* Style the 現在項目テキスト */
}
```
