import { css } from '../../core/web-components.js';

export const utilityLinkStyles = css`
  :host {
    display: block;
    width: fit-content;
  }

  [part='base'] {
    display: flex;
    align-items: center;
    gap: var(--dads-utility-link-item-gap);
    width: fit-content;
    font-family: var(--dads-utility-link-font-family);
    font-size: var(--dads-utility-link-font-size);
    font-weight: var(--dads-utility-link-font-weight);
    line-height: var(--dads-utility-link-line-height);
    letter-spacing: var(--dads-utility-link-letter-spacing);
    text-decoration: none;
    text-wrap: pretty;
  }

  [part='lead-icon'],
  [part='tail-icon'] {
    display: inline-block;
    width: var(--dads-utility-link-icon-size);
    height: var(--dads-utility-link-icon-size);
    color: var(--dads-utility-link-icon-color);
    vertical-align: var(--dads-utility-link-icon-vertical-align);
    line-height: 1;
    flex-shrink: 0;
  }

  [part='lead-icon'] {
    display: none;
  }

  :host([data-has-lead-icon]) [part='lead-icon'] {
    display: inline-block;
  }

  [part='lead-icon']::slotted(*) {
    display: block;
    width: 100%;
    height: 100%;
    color: currentcolor;
  }

  [part='tail-icon'] svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part='tail-icon'][hidden] {
    display: none;
  }

  [part='label'] {
    color: var(--dads-utility-link-label-color);
    text-decoration: underline;
    text-decoration-thickness: var(--dads-utility-link-underline-thickness);
    text-underline-offset: var(--dads-utility-link-underline-offset);
  }

  [part='base']:visited [part='label'] {
    color: var(--dads-utility-link-label-color);
  }

  @media (any-hover: hover) {
    [part='base']:hover [part='label'] {
      color: var(--dads-utility-link-label-color-hover);
      text-decoration-thickness: var(--dads-utility-link-underline-thickness-hover);
    }
  }

  [part='base']:active [part='label'] {
    color: var(--dads-utility-link-label-color-active);
    text-decoration-thickness: var(--dads-utility-link-underline-thickness);
  }

  [part='base']:focus {
    outline: none;
  }

  [part='base']:focus-visible {
    outline: var(--dads-utility-link-focus-outline-width) solid var(--dads-utility-link-focus-outline-color);
    outline-offset: var(--dads-utility-link-focus-outline-offset);
    border-radius: var(--dads-utility-link-focus-border-radius);
    background-color: var(--dads-utility-link-focus-background);
    box-shadow: 0 0 0 var(--dads-utility-link-focus-ring-width) var(--dads-utility-link-focus-ring-color);
  }

  @media (forced-colors: active) {
    [part='base']:focus-visible {
      outline-color: ButtonText;
      box-shadow: 0 0 0 var(--dads-utility-link-focus-ring-width) ButtonText;
    }
  }
`;
