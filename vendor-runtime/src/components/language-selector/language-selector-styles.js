/**
 * Language Selector styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';
export const languageSelectorStyles = css `
  :host([opener="icon"]) [part="opener"] {
    min-width: auto;
    min-height: var(--dads-menu-list-box-opener-min-height);
    padding-top: 0;
    padding-bottom: 0;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    align-items: center;
    row-gap: 1px;
  }

  :host([opener="icon"]) [part="opener-icon"] {
    grid-column: 1;
    grid-row: 1;
    justify-self: center;
    align-items: center;
    justify-content: center;
    line-height: 0;
    width: calc(24 / 16 * 1rem);
    height: calc(24 / 16 * 1rem);
  }

  :host([opener="icon"]) [part="opener-label"] {
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
    justify-content: center;
    flex: none;
    min-width: auto;
    font-size: calc(11 / 16 * 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: 1;
    letter-spacing: 0;
  }

  :host([opener="icon"]) [part="opener-arrow"] {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    margin-top: 0;
  }

  :host([opener="icon"]) [part="opener-icon"] ::slotted(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
