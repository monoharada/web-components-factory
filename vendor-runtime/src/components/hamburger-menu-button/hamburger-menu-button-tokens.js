/**
 * ハンバーガーメニューボタン用デザイントークン
 */
import { css } from '../../core/web-components.js';
const hamburgerMenuButtonSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --hamburger-menu-button-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --hamburger-menu-button-background: transparent;
    --hamburger-menu-button-background-hover: var(--color-neutral-solid-gray-50, #f2f2f2);
    --hamburger-menu-button-background-active: var(--color-neutral-solid-gray-100, #e5e5e5);

    --hamburger-menu-button-gap: var(--spacing-1, 0.25rem);
    --hamburger-menu-button-padding-inline: var(--spacing-3, 0.75rem);
    --hamburger-menu-button-padding-block: calc(6 / 16 * 1rem);
    --hamburger-menu-button-min-height: calc(44 / 16 * 1rem);
    --hamburger-menu-button-radius: var(--border-radius-6, 0.375rem);
    --hamburger-menu-button-underline-offset: calc(3 / 16 * 1rem);

    --hamburger-menu-button-label-size: var(--font-size-16, 1rem);
    --hamburger-menu-button-label-line-height: var(--line-height-150, 1.5);
    --hamburger-menu-button-icon-size: calc(24 / 16 * 1rem);

    --hamburger-menu-button-icon-only-size: calc(44 / 16 * 1rem);
    --hamburger-menu-button-icon-only-radius: var(--border-radius-4, 0.25rem);
    --hamburger-menu-button-icon-only-hover-outline-width: 1px;
    --hamburger-menu-button-icon-only-hover-outline-color: var(--color-neutral-solid-gray-900, #1a1a1a);
  }
`;
const hamburgerMenuButtonLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-hamburger-menu-button-color: var(--hamburger-menu-button-color);
    --dads-hamburger-menu-button-background: var(--hamburger-menu-button-background);
    --dads-hamburger-menu-button-background-hover: var(--hamburger-menu-button-background-hover);
    --dads-hamburger-menu-button-background-active: var(--hamburger-menu-button-background-active);

    --dads-hamburger-menu-button-gap: var(--hamburger-menu-button-gap);
    --dads-hamburger-menu-button-padding-inline: var(--hamburger-menu-button-padding-inline);
    --dads-hamburger-menu-button-padding-block: var(--hamburger-menu-button-padding-block);
    --dads-hamburger-menu-button-min-height: var(--hamburger-menu-button-min-height);
    --dads-hamburger-menu-button-radius: var(--hamburger-menu-button-radius);
    --dads-hamburger-menu-button-underline-offset: var(--hamburger-menu-button-underline-offset);

    --dads-hamburger-menu-button-label-size: var(--hamburger-menu-button-label-size);
    --dads-hamburger-menu-button-label-line-height: var(--hamburger-menu-button-label-line-height);
    --dads-hamburger-menu-button-icon-size: var(--hamburger-menu-button-icon-size);

    --dads-hamburger-menu-button-icon-only-size: var(--hamburger-menu-button-icon-only-size);
    --dads-hamburger-menu-button-icon-only-radius: var(--hamburger-menu-button-icon-only-radius);
    --dads-hamburger-menu-button-icon-only-hover-outline-width: var(--hamburger-menu-button-icon-only-hover-outline-width);
    --dads-hamburger-menu-button-icon-only-hover-outline-color: var(--hamburger-menu-button-icon-only-hover-outline-color);
  }
`;
export const hamburgerMenuButtonSemanticTokens = css `${hamburgerMenuButtonSemanticTokensText}`;
export const hamburgerMenuButtonLocalTokens = css `${hamburgerMenuButtonLocalTokensText}`;
export const hamburgerMenuButtonTokens = css `
  ${hamburgerMenuButtonSemanticTokensText}
  ${hamburgerMenuButtonLocalTokensText}
`;
