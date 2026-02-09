/**
 * Global Menu / Global Menu Item tokens (DADS準拠)
 */
import { css } from '../../core/web-components.js';

/**
 * セマンティックトークン
 */
const globalMenuSemanticTokensText = `
  :host {
    /* Typography */
    --global-menu-font-family: var(--font-family-sans);
    --global-menu-font-size: var(--font-size-16, 1rem);
    --global-menu-font-weight: var(--font-weight-700, 700);
    --global-menu-line-height: var(--line-height-130, 1.3);
    --global-menu-letter-spacing: 0;

    /* Colors */
    --global-menu-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --global-menu-border-color: var(--color-neutral-solid-gray-420, #949494);
    --global-menu-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --global-menu-hover-border-color: var(--color-neutral-black, #000000);
    --global-menu-current-color: var(--color-primitive-blue-1000, #00118f);
    --global-menu-current-color-hover: var(--color-primitive-blue-900, #001073);
    --global-menu-current-bg: var(--color-neutral-white, #ffffff);
    --global-menu-current-border-color: var(--color-primitive-blue-900, #001073);

    /* Layout */
    --global-menu-item-min-height: calc(64 / 16 * 1rem);
    --global-menu-item-padding-x: calc(20 / 16 * 1rem);
    --global-menu-item-padding-y: calc(16 / 16 * 1rem);
    --global-menu-item-gap: var(--spacing-1, 0.25rem);

    /* Icons */
    --global-menu-start-icon-size: calc(24 / 16 * 1rem);
    --global-menu-chevron-size: calc(16 / 16 * 1rem);
    --global-menu-chevron-margin-top: calc(4 / 16 * 1rem);

    /* Decoration */
    --global-menu-hover-border-width: calc(2 / 16 * 1rem);
    --global-menu-current-border-width: calc(4 / 16 * 1rem);
    --global-menu-text-decoration-thickness: calc(1 / 16 * 1rem);
    --global-menu-underline-offset: calc(3 / 16 * 1rem);

    /* Focus */
    --global-menu-focus-outline-color: var(--color-neutral-black, #000000);
    --global-menu-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --global-menu-focus-outline-width: var(--dads-focus-outline-width, 0.25rem);
    --global-menu-focus-outline-offset: var(--dads-focus-outline-offset, 0.125rem);
    --global-menu-focus-ring-width: var(--dads-focus-ring-width, 0.125rem);
    --global-menu-focus-background: var(--dads-focus-text-element-bg, var(--color-primitive-yellow-300, #ffd43d));
    --global-menu-focus-border-radius: var(--border-radius-4, 0.25rem);
  }
`;

/**
 * ローカルトークン（コンポーネントAPI）
 */
const globalMenuLocalTokensText = `
  :host {
    --dads-global-menu-font-family: var(--global-menu-font-family);
    --dads-global-menu-font-size: var(--global-menu-font-size);
    --dads-global-menu-font-weight: var(--global-menu-font-weight);
    --dads-global-menu-line-height: var(--global-menu-line-height);
    --dads-global-menu-letter-spacing: var(--global-menu-letter-spacing);
    --dads-global-menu-color: var(--global-menu-color);

    --dads-global-menu-border-color: var(--global-menu-border-color);

    --dads-global-menu-item-min-height: var(--global-menu-item-min-height);
    --dads-global-menu-item-padding-x: var(--global-menu-item-padding-x);
    --dads-global-menu-item-padding-y: var(--global-menu-item-padding-y);
    --dads-global-menu-item-gap: var(--global-menu-item-gap);

    --dads-global-menu-item-hover-bg: var(--global-menu-hover-bg);
    --dads-global-menu-item-hover-border-color: var(--global-menu-hover-border-color);
    --dads-global-menu-item-hover-border-width: var(--global-menu-hover-border-width);

    --dads-global-menu-item-current-bg: var(--global-menu-current-bg);
    --dads-global-menu-item-current-color: var(--global-menu-current-color);
    --dads-global-menu-item-current-color-hover: var(--global-menu-current-color-hover);
    --dads-global-menu-item-current-border-color: var(--global-menu-current-border-color);
    --dads-global-menu-item-current-border-width: var(--global-menu-current-border-width);

    --dads-global-menu-item-text-decoration-thickness: var(--global-menu-text-decoration-thickness);
    --dads-global-menu-item-underline-offset: var(--global-menu-underline-offset);

    --dads-global-menu-item-start-icon-size: var(--global-menu-start-icon-size);
    --dads-global-menu-item-chevron-size: var(--global-menu-chevron-size);
    --dads-global-menu-item-chevron-margin-top: var(--global-menu-chevron-margin-top);

    --dads-global-menu-item-focus-outline-color: var(--global-menu-focus-outline-color);
    --dads-global-menu-item-focus-ring-color: var(--global-menu-focus-ring-color);
    --dads-global-menu-item-focus-outline-width: var(--global-menu-focus-outline-width);
    --dads-global-menu-item-focus-outline-offset: var(--global-menu-focus-outline-offset);
    --dads-global-menu-item-focus-ring-width: var(--global-menu-focus-ring-width);
    --dads-global-menu-item-focus-background: var(--global-menu-focus-background);
    --dads-global-menu-item-focus-border-radius: var(--global-menu-focus-border-radius);
  }
`;

export const globalMenuSemanticTokens = css`${globalMenuSemanticTokensText}`;
export const globalMenuLocalTokens = css`${globalMenuLocalTokensText}`;

export const globalMenuTokens = css`
  ${globalMenuSemanticTokensText}
  ${globalMenuLocalTokensText}
`;
