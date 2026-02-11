/**
 * テーブル／データテーブル用スタイル定義
 * - light DOM（shadowOptions: null）で使うため、タグ名でスコープを切る
 */
import { css } from '../../core/web-components.js';
function svgUrl(svg) {
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
const SORT_ICON_NONE = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M8 2l3 3H9v4H7V5H5l3-3z"/>
    <path d="M8 14l-3-3h2V7h2v4h2l-3 3z"/>
  </svg>`);
const SORT_ICON_ASC = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M8 2l3 3H9v9H7V5H5l3-3z"/>
  </svg>`);
const SORT_ICON_DESC = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M8 14l-3-3h2V2h2v9h2l-3 3z"/>
  </svg>`);
const MENU_ICON_ELLIPSIS = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <circle cx="8" cy="3" r="1.25"/>
    <circle cx="8" cy="8" r="1.25"/>
    <circle cx="8" cy="13" r="1.25"/>
  </svg>`);
const SELECTION_CHECKBOX_SELECTOR = "input[type='checkbox']:is([data-select-row], [data-select-all], [data-js-check], [data-js-check-all])";
const SORT_BUTTON_SELECTOR = ':is([data-sort], [data-js-sort], .dads-table__sort-button)';
export function createTableStyles(tagName) {
    return css `
    ${tagName},
    ${tagName} .dads-table {
      margin: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      row-gap: var(--dads-table-block-gap);
      color: var(--dads-table-text-color);
      font-weight: var(--dads-table-font-weight);
      font-family: var(--dads-table-font-family);
      font-size: var(--dads-table-font-size);
      line-height: var(--dads-table-line-height);
      letter-spacing: var(--dads-table-letter-spacing);

      /* internal */
      --_dads-table-border-color: var(--dads-table-border-color);
      --_dads-table-cell-padding: var(--dads-table-cell-padding-y) var(--dads-table-cell-padding-x);
    }

    ${tagName}:is(
        [striped],
        [hover],
        [selectable],
        [data-row-stripe],
        [data-row-hover-highlight],
        [data-selectable]
      ),
    ${tagName} .dads-table:is([data-row-stripe], [data-row-hover-highlight], [data-selectable]) {
      --_dads-table-border-color: var(--dads-table-border-color-strong);
    }

    ${tagName} [part='container'] {
      display: block;
      max-inline-size: 100%;
    }

    ${tagName} [part='scroll'] {
      position: relative;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
      max-inline-size: 100%;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
    }

    ${tagName} [part='scroll'][data-has-overflow] {
      padding-inline: var(--dads-table-scroll-shadow-padding, var(--dads-table-scroll-shadow-size, 24px));
      padding-block-end: calc(8 / 16 * 1rem);
    }

    ${tagName} [part='scroll'] > table {
      flex: 0 1 auto;
      min-inline-size: 100%;
    }

    ${tagName} [part='scroll-shadow-left'],
    ${tagName} [part='scroll-shadow-right'] {
      position: sticky;
      top: 0;
      bottom: 0;
      flex-shrink: 0;
      width: var(--dads-table-scroll-shadow-size, 24px);
      transition: opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
      z-index: 1;
    }

    ${tagName} [part='scroll-shadow-left'] {
      left: calc(var(--dads-table-scroll-shadow-padding, var(--dads-table-scroll-shadow-size, 24px)) * -1);
      margin-right: calc(var(--dads-table-scroll-shadow-size, 24px) * -1);
      background: linear-gradient(
        to right,
        var(--dads-table-scroll-shadow-color, rgba(0, 0, 0, 0.4)),
        transparent
      );
    }

    ${tagName} [part='scroll-shadow-right'] {
      right: calc(var(--dads-table-scroll-shadow-padding, var(--dads-table-scroll-shadow-size, 24px)) * -1);
      margin-left: calc(var(--dads-table-scroll-shadow-size, 24px) * -1);
      background: linear-gradient(
        to left,
        var(--dads-table-scroll-shadow-color, rgba(0, 0, 0, 0.4)),
        transparent
      );
    }

    ${tagName} [part='scroll'][data-shadow-left] [part='scroll-shadow-left'] {
      opacity: 1;
    }

    ${tagName} [part='scroll'][data-shadow-right] [part='scroll-shadow-right'] {
      opacity: 1;
    }

    /* ========== Table base ========== */
    ${tagName} table {
      border-collapse: collapse;
      background-color: var(--dads-table-body-background);
      color: inherit;
    }

    ${tagName} :is(caption, figcaption, .dads-table__caption) {
      text-align: left;
      font-weight: var(--font-weight-700, 700);
      font-size: var(--font-size-17, 1.0625rem);
      color: var(--dads-table-header-text-color);
    }

    ${tagName} caption {
      padding-block-end: var(--dads-table-block-gap);
    }

    ${tagName} table :is(td, th) {
      padding: var(--_dads-table-cell-padding);
      text-align: left;
      vertical-align: baseline;
      border: none;
      background-color: transparent;
      background-clip: padding-box;
    }

    ${tagName} table th {
      font-weight: var(--font-weight-700, 700);
    }

    ${tagName} thead :is(td, th),
    ${tagName} :is(.dads-table__col-header, .dads-table__row-header, .dads-table__sort-header) {
      --_dads-table-border-color: var(--dads-table-border-color-strong);
      background-color: var(--dads-table-header-background);
      color: var(--dads-table-header-text-color);
      font-weight: var(--font-weight-700, 700);
    }

    /* ========== Row background ========== */
    ${tagName} tbody tr {
      background-color: var(--dads-table-row-background);
    }

    ${tagName}:is([striped], [data-row-stripe]) tbody tr:nth-child(even),
    ${tagName} .dads-table[data-row-stripe] tbody tr:nth-child(even) {
      background-color: var(--dads-table-row-background-stripe);
    }

    @media (any-hover: hover) {
      ${tagName}:is([hover], [data-row-hover-highlight]) tbody tr:hover,
      ${tagName} .dads-table[data-row-hover-highlight] tbody tr:hover {
        background-color: var(--dads-table-row-background-hover);
      }
    }

    ${tagName} tbody tr[aria-selected='true'] {
      background-color: var(--dads-table-row-background-selected);
    }

    @media (any-hover: hover) {
      ${tagName}:is([hover], [data-row-hover-highlight]) tbody tr[aria-selected='true']:hover,
      ${tagName} .dads-table[data-row-hover-highlight] tbody tr[aria-selected='true']:hover {
        background-color: var(--dads-table-row-background-selected-hover);
      }
    }

    @supports (selector(:has(.x))) {
      ${tagName}:is([selectable], [data-selectable]) tbody tr:has(:checked),
      ${tagName} .dads-table[data-selectable] tbody tr:has(:checked) {
        background-color: var(--dads-table-row-background-selected);
      }

      @media (any-hover: hover) {
        ${tagName}:is([hover], [data-row-hover-highlight]) tbody tr:has(:checked):hover,
        ${tagName} .dads-table[data-row-hover-highlight] tbody tr:has(:checked):hover {
          background-color: var(--dads-table-row-background-selected-hover);
        }
      }
    }

    /* ========== Selection column ========== */
    ${tagName} [data-selection-cell] {
      inline-size: var(--dads-table-selection-column-width);
      box-sizing: border-box;
      position: relative;
      padding: 0;
      vertical-align: middle;
    }

    ${tagName} [data-selection-cell] > * {
      margin-inline: auto;
      margin-block: 0;
    }

    @supports (selector(:has(.x))) {
      ${tagName} td:has(.dads-checkbox:only-child, .dads-radio:only-child),
      ${tagName} th:has(.dads-checkbox:only-child, .dads-radio:only-child) {
        position: relative;
        box-sizing: border-box;
        inline-size: var(--dads-table-selection-column-width);
        padding: 0;
      }

      ${tagName} td > :is(.dads-checkbox:only-child, .dads-radio:only-child),
      ${tagName} th > :is(.dads-checkbox:only-child, .dads-radio:only-child) {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        inline-size: auto;
        padding-block-start: 0;
      }
    }

    /* ========== DADS utility (IndentedRows) ========== */
    ${tagName} .dads-u-visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* ========== DADS Link / List (LinkedTextInCell / OverflowOnMobile) ========== */
    ${tagName} .dads-link:any-link {
      color: var(--color-primitive-blue-1000);
      text-decoration: underline;
      text-decoration-thickness: calc(1 / 16 * 1rem);
      text-underline-offset: calc(3 / 16 * 1rem);
    }

    ${tagName} .dads-link:visited {
      color: var(--color-primitive-magenta-900);
    }

    @media (any-hover: hover) {
      ${tagName} .dads-link:hover {
        color: var(--color-primitive-blue-900);
        text-decoration-thickness: calc(3 / 16 * 1rem);
      }
    }

    ${tagName} .dads-link:active {
      color: var(--color-primitive-orange-800);
      text-decoration-thickness: calc(1 / 16 * 1rem);
    }

    ${tagName} .dads-link__icon {
      display: inline-block;
      width: calc(16 / 16 * 1rem);
      height: calc(16 / 16 * 1rem);
      vertical-align: -0.15em;
    }

    ${tagName} .dads-list {
      margin-top: 0;
      margin-bottom: 0;
      padding-left: calc(32 / 16 * 1rem);
      list-style-type: revert;
    }

    ${tagName} .dads-list > .dads-list__item {
      --_spacing: 0;
      padding-top: var(--_spacing);
      padding-bottom: var(--_spacing);
    }

    ${tagName} .dads-list > .dads-list__item > :first-child {
      margin-top: var(--_spacing);
    }

    ${tagName} .dads-list > .dads-list__item > :last-child {
      margin-bottom: calc(-1 * var(--_spacing));
    }

    ${tagName} .dads-list[data-spacing='4'] > .dads-list__item {
      --_spacing: calc(4 / 16 * 1rem);
    }

    ${tagName} .dads-list[data-spacing='8'] > .dads-list__item {
      --_spacing: calc(8 / 16 * 1rem);
    }

    ${tagName} .dads-list[data-spacing='12'] > .dads-list__item {
      --_spacing: calc(12 / 16 * 1rem);
    }

    /* ========== Focus styles for controls (DADS official) ========== */
    ${tagName} :where(button, a, [tabindex]):focus-visible {
      outline: var(--dads-table-control-focus-outline-width) solid
        var(--dads-table-control-focus-outline-color);
      outline-offset: var(--dads-table-control-focus-outline-offset);
      background-color: var(--dads-table-control-focus-ring-color);
      box-shadow: 0 0 0 var(--dads-table-control-focus-ring-width) var(--dads-table-control-focus-ring-color);
      border-radius: var(--dads-table-control-border-radius);
    }

    ${tagName} input:focus-visible {
      outline: var(--dads-table-control-focus-outline-width) solid
        var(--dads-table-control-focus-outline-color);
      outline-offset: var(--dads-table-control-focus-outline-offset);
      box-shadow: 0 0 0 var(--dads-table-control-focus-ring-width) var(--dads-table-control-focus-ring-color);
      border-radius: var(--dads-table-control-border-radius);
    }

    /* ========== Selection checkbox (native input) ========== */
    ${tagName} ${SELECTION_CHECKBOX_SELECTOR} {
      --_checkbox-border-color: var(--dads-table-checkbox-border-color);
      --_checkbox-fill-color: transparent;
      --_checkbox-accent: var(--dads-table-checkbox-accent-color);

      margin: 0;
      inline-size: var(--dads-table-checkbox-size);
      block-size: var(--dads-table-checkbox-size);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: grid;
      place-content: center;
      border-radius: calc(2 / 18 * 100%);
      background-color: var(--_checkbox-fill-color);
      background-clip: padding-box;
      border: var(--dads-table-checkbox-border-width) solid var(--_checkbox-border-color);
      cursor: pointer;
    }

    @media (any-hover: hover) {
      ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:not(:disabled):hover {
        --_checkbox-border-color: var(--dads-table-checkbox-border-hover-color);
      }
    }

    ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:is(:checked, :indeterminate) {
      --_checkbox-border-color: var(--_checkbox-accent);
      --_checkbox-fill-color: var(--_checkbox-accent);
    }

    @media (any-hover: hover) {
      ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:is(:checked, :indeterminate):not(:disabled):hover {
        --_checkbox-border-color: var(--dads-table-checkbox-accent-hover-color);
        --_checkbox-fill-color: var(--dads-table-checkbox-accent-hover-color);
      }
    }

    ${tagName} ${SELECTION_CHECKBOX_SELECTOR}::before {
      display: none;
      inline-size: calc(var(--dads-table-checkbox-size) * 0.7);
      block-size: calc(var(--dads-table-checkbox-size) * 0.7);
      background-color: var(--dads-table-checkbox-check-color);
      content: '';
    }

    ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:checked::before {
      display: block;
      clip-path: path(
        'M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z'
      );
    }

    ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:indeterminate::before {
      display: block;
      clip-path: path('M2,6h10v2H2Z');
    }

    ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:disabled {
      cursor: default;
      opacity: 1;
      --_checkbox-border-color: var(--color-neutral-solid-gray-300, #b3b3b3);
      --_checkbox-fill-color: var(--color-neutral-solid-gray-300, #b3b3b3);
    }

    /* 強制カラーモード対応 */
    @media (forced-colors: active) {
      ${tagName} ${SELECTION_CHECKBOX_SELECTOR} {
        border-color: ButtonText;
      }

      ${tagName} ${SELECTION_CHECKBOX_SELECTOR}:is(:checked, :indeterminate) {
        background-color: Highlight;
        border-color: Highlight;
      }

      ${tagName} ${SELECTION_CHECKBOX_SELECTOR}::before {
        background-color: HighlightText;
      }
    }

    /* ========== Width & layout (official attributes) ========== */
    ${tagName}[data-width='full'],
    ${tagName} [data-width='full'] {
      width: 100%;
    }

    ${tagName} table:is([data-width='full'], [data-layout='fixed']) {
      inline-size: 100%;
    }

    ${tagName}[data-width='full'] table {
      inline-size: 100%;
    }

    ${tagName} [data-width='full'] table {
      inline-size: 100%;
    }

    ${tagName} table[data-layout='fixed'] {
      table-layout: fixed;
    }

    ${tagName}[data-layout='fixed'] table {
      table-layout: fixed;
    }

    ${tagName} [data-layout='fixed'] table {
      table-layout: fixed;
    }

    /* ========== Cell borders (official attributes) ========== */
    ${tagName}[data-cell-border=''] :where(td, th),
    ${tagName} [data-cell-border=''] :where(td, th) {
      border: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-cell-border~='top'] :where(td, th),
    ${tagName} [data-cell-border~='top'] :where(td, th) {
      border-top: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-cell-border~='right'] :where(td, th),
    ${tagName} [data-cell-border~='right'] :where(td, th) {
      border-right: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-cell-border~='bottom'] :where(td, th),
    ${tagName} [data-cell-border~='bottom'] :where(td, th) {
      border-bottom: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-cell-border~='left'] :where(td, th),
    ${tagName} [data-cell-border~='left'] :where(td, th) {
      border-left: 1px solid var(--_dads-table-border-color);
    }

    ${tagName} thead tr:last-of-type > :is(td, th) {
      border-bottom: 1px solid var(--dads-table-header-divider-color);
    }

    ${tagName} th[scope='row']:last-of-type {
      border-right: 1px solid var(--dads-table-header-divider-color);
    }

    ${tagName}[data-border=''],
    ${tagName} [data-border=''] {
      border: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-border~='top'],
    ${tagName} [data-border~='top'] {
      border-top: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-border~='right'],
    ${tagName} [data-border~='right'] {
      border-right: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-border~='bottom'],
    ${tagName} [data-border~='bottom'] {
      border-bottom: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-border~='left'],
    ${tagName} [data-border~='left'] {
      border-left: 1px solid var(--_dads-table-border-color);
    }

    ${tagName}[data-border='hidden'],
    ${tagName} [data-border='hidden'] {
      border-style: hidden;
    }

    ${tagName}[data-border~='top-hidden'],
    ${tagName} [data-border~='top-hidden'] {
      border-top-style: hidden;
    }

    ${tagName}[data-border~='right-hidden'],
    ${tagName} [data-border~='right-hidden'] {
      border-right-style: hidden;
    }

    ${tagName}[data-border~='bottom-hidden'],
    ${tagName} [data-border~='bottom-hidden'] {
      border-bottom-style: hidden;
    }

    ${tagName}[data-border~='left-hidden'],
    ${tagName} [data-border~='left-hidden'] {
      border-left-style: hidden;
    }

    /* ========== Cell backgrounds (official attributes) ========== */
    ${tagName}[data-bg='white'],
    ${tagName} [data-bg='white'] {
      background-color: var(--color-neutral-white, #ffffff);
    }

    ${tagName}[data-bg='solid-gray-50'],
    ${tagName} [data-bg='solid-gray-50'] {
      --_dads-table-border-color: var(--dads-table-border-color-strong);
      background-color: var(--color-neutral-solid-gray-50, #f2f2f2);
    }

    ${tagName}[data-bg='solid-gray-100'],
    ${tagName} [data-bg='solid-gray-100'] {
      --_dads-table-border-color: var(--dads-table-border-color-strong);
      background-color: var(--color-neutral-solid-gray-100, #e6e6e6);
    }

    ${tagName}[data-bg='transparent'],
    ${tagName} [data-bg='transparent'] {
      background-color: transparent;
    }

    /* ========== Sort control ========== */
    ${tagName} ${SORT_BUTTON_SELECTOR} {
      display: inline-flex;
      align-items: start;
      column-gap: var(--dads-table-sort-icon-gap);
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: calc(3 / 16 * 1rem);
    }

    ${tagName} ${SORT_BUTTON_SELECTOR}:hover {
      text-decoration-thickness: calc(3 / 16 * 1rem);
    }

    ${tagName} [data-sort-icon] {
      inline-size: var(--dads-table-sort-icon-size);
      block-size: var(--dads-table-sort-icon-size);
      flex: 0 0 auto;
      margin-block-start: calc(2 / 16 * 1rem);
      background-color: currentColor;
      mask-image: ${SORT_ICON_NONE};
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: 100% 100%;
      -webkit-mask-image: ${SORT_ICON_NONE};
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      -webkit-mask-size: 100% 100%;
    }

    ${tagName} th[aria-sort='ascending'] [data-sort-icon] {
      mask-image: ${SORT_ICON_ASC};
      -webkit-mask-image: ${SORT_ICON_ASC};
    }

    ${tagName} th[aria-sort='descending'] [data-sort-icon] {
      mask-image: ${SORT_ICON_DESC};
      -webkit-mask-image: ${SORT_ICON_DESC};
    }

    /* Official sortable header layout */
    ${tagName} .dads-table__sort-header {
      padding: calc(12 / 16 * 1rem) calc(16 / 16 * 1rem);
    }

    ${tagName}:is([size='sm'], [size='dense'], [data-size='dense']) .dads-table__sort-header,
    ${tagName} .dads-table[data-size='dense'] .dads-table__sort-header {
      padding-block: 0;
    }

    ${tagName} .dads-table__sort-inner {
      display: flex;
      align-items: start;
      justify-content: space-between;
      column-gap: var(--dads-table-sort-icon-gap);
    }

    ${tagName} .dads-table__sort-label {
      display: flex;
      align-items: start;
      gap: var(--dads-table-sort-icon-gap);
      padding-block: calc(8 / 16 * 1rem);
    }

    ${tagName}:is([size='sm'], [size='dense'], [data-size='dense']) .dads-table__sort-label,
    ${tagName} .dads-table[data-size='dense'] .dads-table__sort-label {
      padding-block: calc(11 / 16 * 1rem);
    }

    ${tagName} .dads-table__sort-icon {
      flex-shrink: 0;
      padding-top: calc(2 / 16 * 1rem);
    }

    ${tagName}:is([size='sm'], [size='dense'], [data-size='dense']) .dads-table__sort-icon,
    ${tagName} .dads-table[data-size='dense'] .dads-table__sort-icon {
      margin-top: calc(-2 / 16 * 1rem);
      padding-top: 0;
    }

    ${tagName} .dads-table__sort-svg,
    ${tagName} .dads-table__action-svg {
      display: block;
      inline-size: var(--dads-table-sort-icon-size);
      block-size: var(--dads-table-sort-icon-size);
    }

    ${tagName} .dads-table__action {
      margin-right: calc(-16 / 16 * 1rem);
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      inline-size: calc(44 / 16 * 1rem);
      block-size: calc(44 / 16 * 1rem);
      border-radius: var(--dads-table-control-border-radius);
      border: 0;
      background-color: transparent;
      padding: 0;
      color: inherit;
    }

    /* ========== Header menu (vertical ellipsis) ========== */
    ${tagName} [data-menu-cell] {
      position: relative;
      padding-inline-end: calc(var(--dads-table-cell-padding-x) + var(--spacing-11, 44px));
    }

    ${tagName} [data-menu-cell] [data-menu] {
      position: absolute;
      inset-inline-end: var(--spacing-2, 8px);
      inset-block-start: 50%;
      transform: translateY(-50%);
    }

    ${tagName} [data-menu] {
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
      inline-size: var(--spacing-11, 44px);
      block-size: var(--spacing-11, 44px);
      display: inline-grid;
      place-content: center;
      border-radius: var(--dads-table-control-border-radius);
    }

    ${tagName} [data-menu-icon] {
      display: inline-block;
      inline-size: 1rem;
      block-size: 1rem;
      background-color: currentColor;
      mask-image: ${MENU_ICON_ELLIPSIS};
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: 100% 100%;
      -webkit-mask-image: ${MENU_ICON_ELLIPSIS};
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      -webkit-mask-size: 100% 100%;
    }
  `;
}
