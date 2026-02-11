/**
 * Mobile Menu tokens (DADS準拠)
 */
import { css } from '../../core/web-components.js';
const mobileMenuSemanticTokensText = `
  :host {
    /* Typography */
    --mobile-menu-font-family: var(--font-family-sans);
    --mobile-menu-font-size: var(--font-size-16, 1rem);
    --mobile-menu-line-height: var(--line-height-120, 1.2);
    --mobile-menu-letter-spacing: 0;

    /* Colors */
    --mobile-menu-background: var(--color-neutral-white, #ffffff);
    --mobile-menu-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --mobile-menu-border-color: var(--color-neutral-solid-gray-420, #949494);

    /* Layout */
    --mobile-menu-width: 100%;
    --mobile-menu-border-width: 1px;
    --mobile-menu-padding-block: var(--spacing-4, 1rem);
    --mobile-menu-padding-inline: 0;
    --mobile-menu-content-gap: 0;
    --mobile-menu-divider-margin-inline: var(--spacing-4, 1rem);
    --mobile-menu-divider-margin-inline-wide: var(--spacing-8, 2rem);

    /* Back row */
    --mobile-menu-back-padding-inline: var(--spacing-4, 1rem);
    --mobile-menu-back-padding-block-start: var(--spacing-4, 1rem);
    --mobile-menu-back-padding-block-end: var(--spacing-6, 1.5rem);
  }
`;
const mobileMenuLocalTokensText = `
  :host {
    --dads-mobile-menu-font-family: var(--mobile-menu-font-family);
    --dads-mobile-menu-font-size: var(--mobile-menu-font-size);
    --dads-mobile-menu-line-height: var(--mobile-menu-line-height);
    --dads-mobile-menu-letter-spacing: var(--mobile-menu-letter-spacing);

    --dads-mobile-menu-width: var(--mobile-menu-width);
    --dads-mobile-menu-background: var(--mobile-menu-background);
    --dads-mobile-menu-color: var(--mobile-menu-color);
    --dads-mobile-menu-border-color: var(--mobile-menu-border-color);
    --dads-mobile-menu-border-width: var(--mobile-menu-border-width);
    --dads-mobile-menu-padding-block: var(--mobile-menu-padding-block);
    --dads-mobile-menu-padding-inline: var(--mobile-menu-padding-inline);
    --dads-mobile-menu-content-gap: var(--mobile-menu-content-gap);
    --dads-mobile-menu-divider-margin-inline: var(--mobile-menu-divider-margin-inline);
    --dads-mobile-menu-divider-margin-inline-wide: var(--mobile-menu-divider-margin-inline-wide);

    --dads-mobile-menu-back-padding-inline: var(--mobile-menu-back-padding-inline);
    --dads-mobile-menu-back-padding-block-start: var(--mobile-menu-back-padding-block-start);
    --dads-mobile-menu-back-padding-block-end: var(--mobile-menu-back-padding-block-end);
  }
`;
export const mobileMenuSemanticTokens = css `${mobileMenuSemanticTokensText}`;
export const mobileMenuLocalTokens = css `${mobileMenuLocalTokensText}`;
export const mobileMenuTokens = css `
  ${mobileMenuSemanticTokensText}
  ${mobileMenuLocalTokensText}
`;
