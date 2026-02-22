/**
 * Iconコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const iconTokensText = `
  :host {
    --dads-icon-color: currentColor;
  }
`;
export const iconTokens = css `${iconTokensText}`;
