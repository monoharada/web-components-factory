import { css } from '../../core/web-components.js';

export const emergencyBannerStyles = css`
  :host {
    display: block;
  }

  [part='base'] {
    display: grid;
    row-gap: var(--dads-emergency-banner-row-gap);
    border: var(--dads-emergency-banner-border-width) solid var(--dads-emergency-banner-border-color);
    background-color: var(--dads-emergency-banner-background);
    padding: var(--dads-emergency-banner-padding-block) var(--dads-emergency-banner-padding-inline);
    color: var(--dads-emergency-banner-color);
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-400, 400);
    font-size: var(--dads-emergency-banner-font-size);
    line-height: var(--dads-emergency-banner-line-height);
    letter-spacing: var(--dads-emergency-banner-letter-spacing);
  }

  [part='header'] {
    display: grid;
    row-gap: var(--dads-emergency-banner-header-gap);
  }

  [part='heading'] {
    margin: 0;
    color: var(--dads-emergency-banner-heading-color);
    font-weight: var(--dads-emergency-banner-heading-font-weight);
    font-size: var(--dads-emergency-banner-heading-font-size);
    line-height: var(--dads-emergency-banner-heading-line-height);
    letter-spacing: var(--dads-emergency-banner-letter-spacing);
    text-spacing-trim: trim-start;
  }

  [part='prefix'] {
    margin-right: 0.2em;
  }

  [part='prefix'][hidden] {
    display: none;
  }

  #heading-slot::slotted(*) {
    margin: 0;
    color: inherit;
    font-weight: inherit;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
  }

  [part='timestamp'] {
    display: block;
  }

  #timestamp-slot::slotted(*) {
    margin: 0;
    color: inherit;
    font: inherit;
    line-height: inherit;
    letter-spacing: inherit;
  }

  [part='timestamp'][hidden],
  [part='body'][hidden],
  [part='action'][hidden],
  [part='action-icon'][hidden] {
    display: none;
  }

  [part='body'] {
    display: grid;
    row-gap: var(--dads-emergency-banner-body-row-gap);
  }

  #body-slot::slotted(*) {
    margin: 0;
  }

  [part='action'] {
    padding-top: var(--dads-emergency-banner-action-padding-top);
    padding-bottom: var(--dads-emergency-banner-action-padding-bottom);
  }

  [part='action-link'],
  [part='action-link']:any-link {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: var(--dads-emergency-banner-action-min-width);
    border: var(--dads-emergency-banner-action-border-width) solid transparent;
    border-radius: var(--dads-emergency-banner-action-border-radius);
    background-color: var(--dads-emergency-banner-action-background);
    padding: var(--dads-emergency-banner-action-padding);
    color: var(--dads-emergency-banner-action-color);
    text-align: center;
    font-weight: var(--dads-emergency-banner-action-font-weight);
    font-size: var(--dads-emergency-banner-action-font-size);
    line-height: var(--dads-emergency-banner-action-line-height);
    letter-spacing: var(--dads-emergency-banner-action-letter-spacing);
    text-decoration: none;
  }

  [part='action-link']::after {
    position: absolute;
    inset: 0;
    border: var(--dads-emergency-banner-action-inner-border-width) solid var(--dads-emergency-banner-action-color);
    border-radius: var(--dads-emergency-banner-action-inner-border-radius);
    content: '';
    pointer-events: none;
  }

  #action-slot::slotted(*) {
    color: inherit;
    font: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    text-decoration: none;
  }

  [part='action-icon'] {
    display: inline-block;
    vertical-align: -0.15em;
    margin-left: 0.25em;
  }

  [part='action-icon']::before {
    content: ' ';
  }

  [part='action-icon'] svg {
    display: block;
    width: var(--dads-emergency-banner-action-icon-size);
    height: var(--dads-emergency-banner-action-icon-size);
    fill: currentcolor;
  }

  @media (any-hover: hover) {
    [part='action-link']:hover {
      background-color: var(--dads-emergency-banner-action-background-hover);
      text-decoration: underline;
      text-decoration-thickness: calc(1 / 16 * 1rem);
      text-underline-offset: calc(3 / 16 * 1rem);
    }
  }

  [part='action-link']:focus {
    outline: var(--dads-emergency-banner-focus-outline-width) solid var(--dads-emergency-banner-focus-outline-color);
    outline-offset: var(--dads-emergency-banner-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-emergency-banner-focus-ring-width) var(--dads-emergency-banner-focus-ring-color);
  }

  [part='action-link']:focus:not(:focus-visible) {
    outline-color: transparent;
    box-shadow: none;
  }

  @media (forced-colors: active) {
    [part='action-link']::after {
      inset: calc(4 / 16 * 1rem);
      border-width: calc(2 / 16 * 1rem);
      border-radius: calc(8 / 16 * 1rem);
    }
  }

  @media (min-width: 48rem) {
    [part='body'] {
      font-size: var(--font-size-20, 1.25rem);
      line-height: var(--line-height-150, 1.5);
    }

    [part='action'] {
      display: flex;
      justify-content: center;
    }

    [part='action-link'],
    [part='action-link']:any-link {
      width: fit-content;
    }
  }
`;
