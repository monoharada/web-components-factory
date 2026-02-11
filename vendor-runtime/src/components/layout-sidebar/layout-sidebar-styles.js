/**
 * レイアウトサイドバーコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const layoutSidebarStyles = css `
  :host {
    display: block;
    min-inline-size: 0;
  }

  [part='base'] {
    display: block;
    min-inline-size: 0;
    inline-size: 100%;
    box-sizing: border-box;
    padding: var(--dads-layout-sidebar-padding);
    background: var(--dads-layout-sidebar-background);
    border: 1px solid var(--dads-layout-sidebar-border-color);
    border-radius: var(--border-radius-8, 0.5rem);
  }

  [part='base'] ::slotted(*) {
    min-inline-size: 0;
  }
`;
