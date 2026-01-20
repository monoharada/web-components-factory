/**
 * Menu List / Menu List Item styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';

export const menuListStyles = css`
  :host {
    position: relative;
    z-index: 0;
    display: block;
    font-family: var(--dads-menu-list-font-family);
    font-size: var(--dads-menu-list-font-size);
    letter-spacing: var(--dads-menu-list-letter-spacing);
    color: var(--dads-menu-list-color);
    font-weight: var(--font-weight-400, 400);
    line-height: var(--line-height-130, 1.3);
  }

  [part="base"] {
    display: block;
  }
`;

export const menuListItemStyles = css`
  :host {
    display: block;
  }

  [part="base"] {
    display: flex;
    align-items: center;
    column-gap: var(--dads-menu-list-item-gap);
    box-sizing: border-box;
    width: -webkit-fill-available;
    width: -moz-available;
    width: stretch;
    border: 0;
    background-color: var(--dads-menu-list-item-background);
    padding-top: var(--dads-menu-list-item-padding-y);
    padding-bottom: var(--dads-menu-list-item-padding-y);
    padding-right: var(--dads-menu-list-item-padding-x);
    padding-left: var(--dads-menu-list-item-padding-x);
    min-height: var(--dads-menu-list-item-min-height);
    color: var(--dads-menu-list-item-color);
    font-weight: var(--dads-menu-list-item-font-weight);
    text-align: left;
    font: inherit;
    letter-spacing: inherit;
    line-height: var(--dads-menu-list-item-line-height);
    text-decoration: none;
    text-decoration-thickness: var(--dads-menu-list-item-text-decoration-thickness);
  }

  /* Size */
  :host([size="regular"]) [part="base"] {
    line-height: var(--line-height-130, 1.3);
  }

  :host([size="small"]) [part="base"] {
    line-height: var(--line-height-120, 1.2);
  }

  /* Variants */
  :host([variant="standard"]) [part="base"] {
    border-radius: var(--dads-menu-list-item-border-radius);
    margin-left: calc(var(--spacing-4, 1rem) * var(--dads-menu-list-indentation));
  }

  :host([variant="box"]) [part="base"] {
    border-radius: 0;
    padding-left: calc(
      var(--dads-menu-list-item-padding-x) + var(--spacing-4, 1rem) * var(--dads-menu-list-indentation)
    );
  }

  /* Current */
  :host([current]) {
    --dads-menu-list-item-background: var(--dads-menu-list-item-current-background);
    --dads-menu-list-item-color: var(--dads-menu-list-item-current-color);
    --dads-menu-list-item-font-weight: var(--font-weight-700, 700);
  }

  /* Parent of current (DADS: :has(+ * [data-current])) */
  :host(:has(+ * [current])) {
    --dads-menu-list-item-background: var(--dads-menu-list-item-current-parent-background);
    --dads-menu-list-item-color: var(--dads-menu-list-item-current-color);
  }

  /* Hover */
  @media (hover: hover) {
    [part="base"]:hover {
      --dads-menu-list-item-background: var(--dads-menu-list-item-hover-background);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: var(--dads-menu-list-item-underline-offset);
    }

    :host([current]) [part="base"]:hover,
    :host(:has(+ * [current])) [part="base"]:hover {
      --dads-menu-list-item-background: var(--dads-menu-list-item-current-hover-background);
      --dads-menu-list-item-color: var(--dads-menu-list-item-current-hover-color);
    }
  }

  /* Focus */
  [part="base"]:focus {
    outline: none;
  }

  [part="base"]:focus-visible {
    position: relative;
    z-index: 1;
    --dads-menu-list-item-background: var(--dads-focus-text-element-bg, var(--color-primitive-yellow-300, #ffd43d));
  }

  :host([variant="standard"]) [part="base"]:focus-visible {
    outline: var(--dads-menu-list-item-focus-outline-width) solid
      var(--dads-menu-list-item-focus-outline-color);
    outline-offset: var(--dads-menu-list-item-focus-outline-offset-standard);
    box-shadow: 0 0 0 var(--dads-menu-list-item-focus-ring-width)
      var(--dads-menu-list-item-focus-ring-color);
  }

  :host([variant="box"]) [part="base"]:focus-visible {
    outline: var(--dads-menu-list-item-focus-outline-width) solid
      var(--dads-menu-list-item-focus-outline-color);
    outline-offset: var(--dads-menu-list-item-focus-outline-offset-box);
    box-shadow: inset 0 0 0 var(--dads-menu-list-item-focus-box-inset-width)
      var(--dads-menu-list-item-focus-ring-color);
  }

  :host([current]) [part="base"]:focus-visible {
    --dads-menu-list-item-background: var(--dads-menu-list-item-current-background);
  }

  :host(:has(+ * [current])) [part="base"]:focus-visible {
    --dads-menu-list-item-background: var(--dads-menu-list-item-current-parent-background);
  }

  /* Icons */
  [part="start-icon"] {
    display: none;
    flex-shrink: 0;
    width: var(--dads-menu-list-item-start-icon-size);
    height: var(--dads-menu-list-item-start-icon-size);
    align-items: center;
    justify-content: center;
    visibility: visible;
  }

  :host([data-has-start-icon]) [part="start-icon"] {
    display: inline-flex;
  }

  :host(:not([data-has-start-icon])) [part="start-icon"] {
    display: var(--dads-menu-list-item-start-icon-display-empty);
    visibility: hidden;
  }

  [part="label"] {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1, 0.25rem); /* 4px */
    flex: 1 0 0;
    min-width: 0;
  }

  [part="tail-icon"] {
    display: none;
    vertical-align: -0.15em;
  }

  :host([data-has-tail-icon]) [part="tail-icon"] {
    display: inline-block;
  }

  [part="end-icon"] {
    margin-top: var(--dads-menu-list-item-end-icon-margin-top);
    margin-right: var(--dads-menu-list-item-end-icon-margin-right);
    margin-left: auto;
    flex-shrink: 0;
  }

  /* hidden 属性は minimal reset の svg{display:block} で上書きされるため、明示的に非表示にする */
  [part="end-icon"] svg[hidden] {
    display: none;
  }

  :host([expanded]) [part="end-icon"] {
    transform: rotate(180deg);
  }

  :host([end-icon="none"]) [part="end-icon"] {
    display: none;
  }

  /* Forced colors */
  @media (forced-colors: active) {
    [part="base"] {
      border: 1px solid ButtonText;
      color: ButtonText;
    }
    [part="base"]:focus-visible {
      outline-color: ButtonText;
      box-shadow: 0 0 0 var(--dads-menu-list-item-focus-ring-width) ButtonText;
    }
  }
`;
