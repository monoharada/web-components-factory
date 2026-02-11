/**
 * レイアウトシェルコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const layoutShellSemanticTokensText = `
  :host {
    --layout-shell-inline-padding: var(--spacing-6, 1.5rem);
    --layout-shell-block-gap: var(--spacing-6, 1.5rem);
    --layout-shell-main-max-width: 75rem;
    --layout-shell-sidebar-width: 18rem;
    --layout-shell-sidebar-rail-width: 5rem;
    --layout-shell-aside-width: 22rem;
  }
`;
const layoutShellLocalTokensText = `
  :host {
    --dads-layout-shell-inline-padding: var(--layout-shell-inline-padding);
    --dads-layout-shell-block-gap: var(--layout-shell-block-gap);
    --dads-layout-shell-main-max-width: var(--layout-shell-main-max-width);
    --dads-layout-shell-sidebar-width: var(--layout-shell-sidebar-width);
    --dads-layout-shell-sidebar-rail-width: var(--layout-shell-sidebar-rail-width);
    --dads-layout-shell-aside-width: var(--layout-shell-aside-width);
  }
`;
export const layoutShellSemanticTokens = css `${layoutShellSemanticTokensText}`;
export const layoutShellLocalTokens = css `${layoutShellLocalTokensText}`;
export const layoutShellTokens = css `
  ${layoutShellSemanticTokensText}
  ${layoutShellLocalTokensText}
`;
