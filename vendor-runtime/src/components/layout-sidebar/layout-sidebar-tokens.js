/**
 * レイアウトサイドバーコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const layoutSidebarSemanticTokensText = `
  :host {
    --layout-sidebar-background: var(--color-neutral-white, #ffffff);
    --layout-sidebar-border-color: var(--color-neutral-opacity-gray-200, rgba(0, 0, 0, 0.2));
    --layout-sidebar-padding: var(--spacing-4, 1rem);
  }
`;
const layoutSidebarLocalTokensText = `
  :host {
    --dads-layout-sidebar-background: var(--layout-sidebar-background);
    --dads-layout-sidebar-border-color: var(--layout-sidebar-border-color);
    --dads-layout-sidebar-padding: var(--layout-sidebar-padding);
  }
`;
export const layoutSidebarSemanticTokens = css `${layoutSidebarSemanticTokensText}`;
export const layoutSidebarLocalTokens = css `${layoutSidebarLocalTokensText}`;
export const layoutSidebarTokens = css `
  ${layoutSidebarSemanticTokensText}
  ${layoutSidebarLocalTokensText}
`;
