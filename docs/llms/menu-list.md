# dads-menu-list

> メニューリストコンポーネント

- **Category**: Navigation
- **Class**: `DadsMenuList`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/menu-list/menu-list.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component menu-list
```

## Usage

```html
<dads-menu-list>...</dads-menu-list>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `indentation` | number | - | インデント（CSS変数 --menu-list-indentation に反映） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | メニュー項目（dads-menu-list-item） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | role="list" のルート |


## Styling

```css
/* Custom properties */
dads-menu-list {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-menu-list::part(base) {
  /* Style the role="list" のルート */
}
```
