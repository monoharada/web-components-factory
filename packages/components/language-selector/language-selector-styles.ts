/**
 * Language Selector styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';

export const languageSelectorStyles = css`
  :host([opener="icon"]) [part="opener-label"] {
    letter-spacing: 0;
  }

  :host([opener="icon"]) [part="opener"] {
    min-width: auto;
  }
`;
