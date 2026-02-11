/**
 * レイアウトシェルコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';

const layoutShellSemanticTokensText = `
  :host {
    --layout-shell-space: var(--spacing-6, 1.5rem);
    --layout-shell-pane-width: 18rem;
    --layout-shell-main-max-width: 75rem;
    --layout-shell-mobile-space-scale: 0.6666666667;
  }
`;

const layoutShellLocalTokensText = `
  :host {
    --dads-layout-shell-space: var(--layout-shell-space);
    --dads-layout-shell-pane-width: var(--layout-shell-pane-width);
    --dads-layout-shell-main-max-width: var(--layout-shell-main-max-width);
    --dads-layout-shell-mobile-space-scale: var(--layout-shell-mobile-space-scale);

    --_dads-layout-shell-inline-padding-derived: var(--dads-layout-shell-space);
    --_dads-layout-shell-block-gap-derived: var(--dads-layout-shell-space);
    --_dads-layout-shell-sidebar-width-derived: var(--dads-layout-shell-pane-width);
    --_dads-layout-shell-sidebar-rail-width-derived: calc(var(--dads-layout-shell-pane-width) * 5 / 18);
    --_dads-layout-shell-aside-width-derived: calc(var(--dads-layout-shell-pane-width) + 4rem);
  }
`;

export const layoutShellSemanticTokens = css`${layoutShellSemanticTokensText}`;
export const layoutShellLocalTokens = css`${layoutShellLocalTokensText}`;

export const layoutShellTokens = css`
  ${layoutShellSemanticTokensText}
  ${layoutShellLocalTokensText}
`;
