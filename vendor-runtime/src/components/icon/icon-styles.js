/**
 * Iconコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const iconStyles = css `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 0;
    color: var(--dads-icon-color, currentColor);
  }

  [part='svg'] {
    display: block;
    fill: currentColor;
  }

  @media (forced-colors: active) {
    [part='svg'] {
      fill: CanvasText;
    }
  }
`;
