# dads-table-control

> Table Control component.

- **Category**: Content
- **Class**: `DadsTableControl`
- **Extends**: `TypographyWebComponent`
- **Dependencies**: `button`, `chip-tag`, `page-navigation`, `search-box`
- **Source**: `./packages/components/table-control/table-control.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component table-control
```

## Usage

```html
<dads-table-control
  variant=""
>
  <div slot="actions"><!-- Header action area (e.g. print / csv / create buttons) --></div>
  <div slot="page-navigation"><!-- Footer page navigation area (e.g. dads-page-navigation) --></div>
  <div slot="presets"><!-- Header popular-search presets (e.g. chip tags) --></div>
</dads-table-control>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `items-per-page` | string | - | Current page size for footer |
| `page-size-label` | string | - | Page size label |
| `page-size-options` | string | - | Comma separated page size options |
| `pagination-position` | 'start' \| 'end' | - | Footer pagination alignment |
| `popular-label` | string | - | Popular search area label |
| `query` | string | - | Search query for header |
| `reset-label` | string | - | Reset button label |
| `result-count` | string | - | Result count for header |
| `show-reset` | boolean | - | Shows reset button in header |
| `variant` | 'header' \| 'footer' | - | Render variant |


## Slots

| Slot | Description |
|------|-------------|
| `actions` | Header action area (e.g. print / csv / create buttons) |
| `page-navigation` | Footer page navigation area (e.g. dads-page-navigation) |
| `presets` | Header popular-search presets (e.g. chip tags) |


## CSS Parts

| Part | Description |
|------|-------------|
| `actions` | Header actions area |
| `base` | Root wrapper |
| `count` | Result count label |
| `footer` | Footer control row |
| `header` | Header control row |
| `items-option` | Items-per-page option button |
| `items-per-page` | Items-per-page block |
| `pagination` | Pagination area |
| `popular` | Popular-search area |
| `reset` | Reset trigger button |
| `search` | Search control block |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-table-control-count-color` | - | Result count text color |
| `--dads-table-control-divider-color` | - | Divider color for action group |
| `--dads-table-control-focus-outline-color` | - |  |
| `--dads-table-control-focus-outline-offset` | - |  |
| `--dads-table-control-focus-outline-width` | - |  |
| `--dads-table-control-focus-ring-color` | - |  |
| `--dads-table-control-focus-ring-width` | - |  |
| `--dads-table-control-font-family` | - |  |
| `--dads-table-control-font-size` | - |  |
| `--dads-table-control-font-weight-bold` | - |  |
| `--dads-table-control-font-weight-regular` | - |  |
| `--dads-table-control-gap` | - | Primary spacing between blocks |
| `--dads-table-control-items-gap` | - | Gap between page size options |
| `--dads-table-control-letter-spacing` | - |  |
| `--dads-table-control-link-color` | - |  |
| `--dads-table-control-link-color-hover` | - |  |
| `--dads-table-control-option-min-width` | - |  |
| `--dads-table-control-popular-gap` | - | Gap between search and popular areas |
| `--dads-table-control-reset-min-width` | - |  |
| `--dads-table-control-search-max-width` | - |  |
| `--dads-table-control-search-min-width` | - |  |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-table-control-page-size-change` | Event | Fired when page size option changes |
| `dads-table-control-reset` | Event | Fired when reset is requested |
| `dads-table-control-search` | Event | Fired when search is requested |


## Styling

```css
/* Custom properties */
dads-table-control {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-table-control::part(actions) {
  /* Style the Header actions area */
}
```
