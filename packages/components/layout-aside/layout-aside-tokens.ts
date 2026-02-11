/**
 * レイアウト補助領域コンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';

const layoutAsideSemanticTokensText = `
  :host {
    --layout-aside-background: var(--color-neutral-white, #ffffff);
    --layout-aside-border-color: var(--color-neutral-opacity-gray-200, rgba(0, 0, 0, 0.2));
    --layout-aside-padding: var(--spacing-4, 1rem);
  }
`;

const layoutAsideLocalTokensText = `
  :host {
    --dads-layout-aside-background: var(--layout-aside-background);
    --dads-layout-aside-border-color: var(--layout-aside-border-color);
    --dads-layout-aside-padding: var(--layout-aside-padding);
  }
`;

export const layoutAsideSemanticTokens = css`${layoutAsideSemanticTokensText}`;
export const layoutAsideLocalTokens = css`${layoutAsideLocalTokensText}`;

export const layoutAsideTokens = css`
  ${layoutAsideSemanticTokensText}
  ${layoutAsideLocalTokensText}
`;
