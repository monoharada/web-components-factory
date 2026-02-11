/**
 * Drawerコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 */
import { css } from '../../core/web-components.js';
const drawerSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --drawer-background: var(--color-neutral-white, #ffffff);
    --drawer-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --drawer-border-color: var(--color-neutral-opacity-gray-200, rgba(0, 0, 0, 0.2));
    --drawer-border-width: 1px;
    --drawer-width: calc(288 / 16 * 1rem);
    --drawer-max-width: 100dvw;
    --drawer-header-min-height: calc(68 / 16 * 1rem);
    --drawer-header-padding-inline: var(--spacing-4, 1rem);
    --drawer-content-padding-block: var(--spacing-4, 1rem);
    --drawer-content-padding-inline: var(--spacing-4, 1rem);
    --drawer-title-size: var(--font-size-20, 1.25rem);
    --drawer-title-line-height: var(--line-height-150, 1.5);

    --drawer-close-button-size: calc(44 / 16 * 1rem);
    --drawer-close-button-radius: var(--border-radius-8, 0.5rem);
    --drawer-close-button-gap: calc(4 / 16 * 1rem);
    --drawer-close-button-padding-inline: calc(12 / 16 * 1rem);
    --drawer-close-button-icon-size: calc(14 / 16 * 1rem);
    --drawer-close-button-border-color: var(--color-neutral-solid-gray-420, #949494);
    --drawer-close-button-hover-background: var(--color-neutral-solid-gray-50, #f2f2f2);

    --drawer-shadow: 0 0 calc(4 / 16 * 1rem) rgba(0, 0, 0, 0.1),
      0 calc(4 / 16 * 1rem) calc(16 / 16 * 1rem) rgba(0, 0, 0, 0.08);

    --drawer-backdrop-background: var(--color-neutral-opacity-gray-100, rgba(0, 0, 0, 0.1));
    --drawer-z-index: 1000;
  }
`;
const drawerLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-drawer-background: var(--drawer-background);
    --dads-drawer-color: var(--drawer-color);
    --dads-drawer-border-color: var(--drawer-border-color);
    --dads-drawer-border-width: var(--drawer-border-width);
    --dads-drawer-width: var(--drawer-width);
    --dads-drawer-max-width: var(--drawer-max-width);
    --dads-drawer-header-min-height: var(--drawer-header-min-height);
    --dads-drawer-header-padding-inline: var(--drawer-header-padding-inline);
    --dads-drawer-content-padding-block: var(--drawer-content-padding-block);
    --dads-drawer-content-padding-inline: var(--drawer-content-padding-inline);
    --dads-drawer-title-size: var(--drawer-title-size);
    --dads-drawer-title-line-height: var(--drawer-title-line-height);

    --dads-drawer-close-button-size: var(--drawer-close-button-size);
    --dads-drawer-close-button-radius: var(--drawer-close-button-radius);
    --dads-drawer-close-button-gap: var(--drawer-close-button-gap);
    --dads-drawer-close-button-padding-inline: var(--drawer-close-button-padding-inline);
    --dads-drawer-close-button-icon-size: var(--drawer-close-button-icon-size);
    --dads-drawer-close-button-border-color: var(--drawer-close-button-border-color);
    --dads-drawer-close-button-hover-background: var(--drawer-close-button-hover-background);

    --dads-drawer-shadow: var(--drawer-shadow);
    --dads-drawer-backdrop-background: var(--drawer-backdrop-background);
    --dads-drawer-z-index: var(--drawer-z-index);
  }
`;
export const drawerSemanticTokens = css `${drawerSemanticTokensText}`;
export const drawerLocalTokens = css `${drawerLocalTokensText}`;
export const drawerTokens = css `
  ${drawerSemanticTokensText}
  ${drawerLocalTokensText}
`;
