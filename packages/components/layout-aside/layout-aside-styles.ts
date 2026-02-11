/**
 * レイアウト補助領域コンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const layoutAsideStyles = css`
  :host {
    display: block;
    min-inline-size: 0;
  }

  [part='base'] {
    display: block;
    min-inline-size: 0;
    inline-size: 100%;
    box-sizing: border-box;
    padding: var(--dads-layout-aside-padding);
    background: var(--dads-layout-aside-background);
    border: 1px solid var(--dads-layout-aside-border-color);
    border-radius: var(--border-radius-8, 0.5rem);
  }

  [part='base'] ::slotted(*) {
    min-inline-size: 0;
  }
`;
