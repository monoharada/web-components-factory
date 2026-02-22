# dads-icon

> アイコンコンポーネント

- **Category**: Display
- **Class**: `DadsIcon`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/icon/icon.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component icon
```

## Usage

```html
<dads-icon
  label=""
  name=""
  size=""
>...</dads-icon>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | - | アクセシブルラベル（指定時はaria-hidden解除、role="img"、title要素追加） |
| `name` | string | - | アイコン名（iconPathsのキー: dummy, checkmark, check, edit, delete, duplicate, download, add, subtract, search, print, update, menu, close, home, language, favorite, lock, dragIndicator, more, moreVert, mic, scanner, login, logout, settings, caret, arrowRight, arrowLeft, arrowDown, arrowUp, arrowDropUp, arrowDropDown, arrowUpward, arrowDownward, arrowForward, arrowBack, error, attention, warning, information, help, complete, checkCircle, cancel, notification, history, visibility, visibilityOff, externalLink, document, pdf, image, folder, person, location, checkbox, checkboxBlank, indeterminateCheckbox, radioChecked, radioUnchecked, circle） |
| `size` | string | - | サイズpx（デフォルト: '20'） |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `svg` | SVG要素 |


## Styling

```css
/* Custom properties */
dads-icon {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-icon::part(svg) {
  /* Style the SVG要素 */
}
```
