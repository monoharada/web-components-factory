/**
 * Avatarコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const avatarStyles = css `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 0;
  }

  [part='svg'] {
    display: block;
  }

  [part='img'] {
    display: block;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (forced-colors: active) {
    [part='svg'] circle {
      fill: Highlight;
    }
    [part='svg'] text {
      fill: HighlightText;
    }
  }
`;
