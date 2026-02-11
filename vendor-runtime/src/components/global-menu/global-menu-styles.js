/**
 * Global Menu / Global Menu Item styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';
export const globalMenuStyles = css `
  :host {
    display: block;
    color: var(--dads-global-menu-color);
    font-weight: var(--dads-global-menu-font-weight);
    font-size: var(--dads-global-menu-font-size);
    line-height: var(--dads-global-menu-line-height);
    font-family: var(--dads-global-menu-font-family);
    letter-spacing: var(--dads-global-menu-letter-spacing);
  }

  [part='nav'] {
    display: block;
  }

  [part='list'] {
    margin: 0;
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--dads-global-menu-border-color);
    padding: 0;
    list-style-type: none;
  }
`;
export const globalMenuItemStyles = css `
  :host {
    position: relative;
    display: flex;
    align-items: stretch;
    color: inherit;
  }

  [part='trigger'],
  [part='trigger']:any-link {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: var(--dads-global-menu-item-gap);
    box-sizing: border-box;
    min-height: var(--dads-global-menu-item-min-height);
    border: 0;
    background-color: transparent;
    padding: var(--dads-global-menu-item-padding-y) var(--dads-global-menu-item-padding-x);
    color: inherit;
    font: inherit;
    text-decoration: none;
    text-decoration-thickness: var(--dads-global-menu-item-text-decoration-thickness);
    text-underline-offset: var(--dads-global-menu-item-underline-offset);
  }

  button[part='trigger'] {
    cursor: pointer;
  }

  [part='start-icon'] {
    display: none;
    flex-shrink: 0;
    width: var(--dads-global-menu-item-start-icon-size);
    height: var(--dads-global-menu-item-start-icon-size);
    align-items: center;
    justify-content: center;
  }

  :host([data-has-start-icon]) [part='start-icon'] {
    display: inline-flex;
  }

  [part='label'] {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }

  [part='chevron'] {
    display: none;
    margin-top: var(--dads-global-menu-item-chevron-margin-top);
    box-sizing: content-box;
    flex-shrink: 0;
    width: var(--dads-global-menu-item-chevron-size);
    height: var(--dads-global-menu-item-chevron-size);
  }

  :host([data-has-submenu]) [part='chevron'] {
    display: inline-flex;
  }

  :host([expanded]) [part='chevron'] {
    transform: rotate(180deg);
  }

  @media (any-hover: hover) {
    [part='trigger']:hover {
      background-color: var(--dads-global-menu-item-hover-bg);
    }

    [part='trigger']:hover::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: var(--dads-global-menu-item-hover-border-width) solid
        var(--dads-global-menu-item-hover-border-color);
      content: '';
    }

    :host([current]) [part='trigger']:hover {
      color: var(--dads-global-menu-item-current-color-hover);
      text-decoration: underline;
    }
  }

  :host([current]) [part='trigger'] {
    background-color: var(--dads-global-menu-item-current-bg);
    color: var(--dads-global-menu-item-current-color);
  }

  :host([current]) [part='trigger']::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: var(--dads-global-menu-item-current-border-width) solid
      var(--dads-global-menu-item-current-border-color);
    content: '';
  }

  [part='trigger']:focus {
    outline: none;
  }

  [part='trigger']:focus-visible {
    outline: var(--dads-global-menu-item-focus-outline-width) solid
      var(--dads-global-menu-item-focus-outline-color);
    outline-offset: var(--dads-global-menu-item-focus-outline-offset);
    border-radius: var(--dads-global-menu-item-focus-border-radius);
    background-color: var(--dads-global-menu-item-focus-background);
    box-shadow: 0 0 0 var(--dads-global-menu-item-focus-ring-width)
      var(--dads-global-menu-item-focus-ring-color);
    z-index: 1;
  }

  :host([current]) [part='trigger']:focus-visible {
    background-color: var(--dads-global-menu-item-current-bg);
  }

  ::slotted(*[slot='submenu']) {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
  }

  @media (forced-colors: active) {
    [part='trigger'],
    [part='trigger']:any-link {
      color: ButtonText;
      border-color: ButtonText;
      background-color: Canvas;
    }

    [part='trigger']:focus-visible {
      outline-color: ButtonText;
      box-shadow: 0 0 0 var(--dads-global-menu-item-focus-ring-width) ButtonText;
    }
  }
`;
