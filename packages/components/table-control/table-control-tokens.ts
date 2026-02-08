/**
 * Table Control component tokens
 * DADS semantic/local token layering.
 */
import { css } from '../../core/web-components.js';

const tableControlSemanticTokensText = `
  :host {
    /* Color */
    --table-control-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --table-control-muted-color: var(--color-neutral-solid-gray-800, #333333);
    --table-control-link-color: var(--color-primitive-blue-1000, #00118f);
    --table-control-link-color-hover: var(--color-primitive-blue-900, #0017c1);
    --table-control-divider-color: var(--color-neutral-solid-gray-420, #949494);

    /* Typography */
    --table-control-font-family: var(--font-family-sans);
    --table-control-font-size: var(--font-size-16, 1rem);
    --table-control-font-weight-regular: var(--font-weight-400, 400);
    --table-control-font-weight-bold: var(--font-weight-700, 700);
    --table-control-letter-spacing: calc(2 / 100 * 1em);

    /* Layout */
    --table-control-gap: var(--spacing-4, 1rem);
    --table-control-items-gap: calc(24 / 16 * 1rem);
    --table-control-popular-gap: calc(32 / 16 * 1rem);
    --table-control-search-min-width: calc(320 / 16 * 1rem);
    --table-control-search-max-width: calc(534 / 16 * 1rem);
    --table-control-reset-min-width: calc(72 / 16 * 1rem);
    --table-control-option-min-width: calc(48 / 16 * 1rem);

    /* Focus */
    --table-control-focus-outline-color: var(--color-neutral-black, #000000);
    --table-control-focus-outline-width: .25rem;
    --table-control-focus-outline-offset: .125rem;
    --table-control-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --table-control-focus-ring-width: .125rem;
  }
`;

const tableControlLocalTokensText = `
  :host {
    --dads-table-control-gap: var(--table-control-gap);
    --dads-table-control-items-gap: var(--table-control-items-gap);
    --dads-table-control-popular-gap: var(--table-control-popular-gap);
    --dads-table-control-count-color: var(--table-control-color);
    --dads-table-control-divider-color: var(--table-control-divider-color);

    --dads-table-control-font-family: var(--table-control-font-family);
    --dads-table-control-font-size: var(--table-control-font-size);
    --dads-table-control-font-weight-regular: var(--table-control-font-weight-regular);
    --dads-table-control-font-weight-bold: var(--table-control-font-weight-bold);
    --dads-table-control-letter-spacing: var(--table-control-letter-spacing);

    --dads-table-control-link-color: var(--table-control-link-color);
    --dads-table-control-link-color-hover: var(--table-control-link-color-hover);

    --dads-table-control-search-min-width: var(--table-control-search-min-width);
    --dads-table-control-search-max-width: var(--table-control-search-max-width);
    --dads-table-control-reset-min-width: var(--table-control-reset-min-width);
    --dads-table-control-option-min-width: var(--table-control-option-min-width);

    --dads-table-control-focus-outline-color: var(--table-control-focus-outline-color);
    --dads-table-control-focus-outline-width: var(--table-control-focus-outline-width);
    --dads-table-control-focus-outline-offset: var(--table-control-focus-outline-offset);
    --dads-table-control-focus-ring-color: var(--table-control-focus-ring-color);
    --dads-table-control-focus-ring-width: var(--table-control-focus-ring-width);
  }
`;

export const tableControlSemanticTokens = css`${tableControlSemanticTokensText}`;
export const tableControlLocalTokens = css`${tableControlLocalTokensText}`;

export const tableControlTokens = css`
  ${tableControlSemanticTokensText}
  ${tableControlLocalTokensText}
`;
