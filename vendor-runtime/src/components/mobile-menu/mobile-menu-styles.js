/**
 * Mobile Menu styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';
export const mobileMenuStyles = css `
  :host {
    display: block;
    font-family: var(--dads-mobile-menu-font-family);
    font-size: var(--dads-mobile-menu-font-size);
    line-height: var(--dads-mobile-menu-line-height);
    letter-spacing: var(--dads-mobile-menu-letter-spacing);
    color: var(--dads-mobile-menu-color);
  }

  [part='base'] {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    inline-size: var(--dads-mobile-menu-width);
    max-inline-size: 100%;
    border: 0;
    border-block-end: var(--dads-mobile-menu-border-width) solid var(--dads-mobile-menu-border-color);
    background-color: var(--dads-mobile-menu-background);
    color: inherit;
    padding-block: var(--dads-mobile-menu-padding-block);
    padding-inline: var(--dads-mobile-menu-padding-inline);
  }

  [part='back'] {
    padding-inline: var(--dads-mobile-menu-back-padding-inline);
    padding-block-start: var(--dads-mobile-menu-back-padding-block-start);
    padding-block-end: var(--dads-mobile-menu-back-padding-block-end);
  }

  [part='back'][hidden] {
    display: none;
  }

  #back-slot::slotted(*) {
    margin: 0;
  }

  [part='content'] {
    display: grid;
    gap: var(--dads-mobile-menu-content-gap);
    min-inline-size: 0;
  }

  #content-slot::slotted(*) {
    box-sizing: border-box;
  }

  #content-slot::slotted(dads-menu-list) {
    display: block;
    inline-size: 100%;
  }

  #content-slot::slotted(dads-divider) {
    --dads-divider-color: var(--dads-mobile-menu-border-color);
    --dads-divider-margin-block: var(--spacing-4, 1rem);
    --dads-divider-margin-inline: var(--dads-mobile-menu-divider-margin-inline);
  }
`;
