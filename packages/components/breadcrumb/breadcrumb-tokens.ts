/**
 * Breadcrumb tokens (semantic + local override API)
 */
import { css } from '../../core/web-components.js';

const breadcrumbSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --breadcrumb-color: var(--color-neutral-solid-gray-800, #333333);
    --breadcrumb-current-color: var(--color-neutral-solid-gray-800, #333333);
    --breadcrumb-link-color: var(--color-primitive-blue-1000, #00118f);
    --breadcrumb-link-color-hover: var(--color-primitive-blue-900, #0017c1);
    --breadcrumb-link-color-active: var(--color-primitive-orange-800, #c74700);
    --breadcrumb-separator-color: var(--color-neutral-solid-gray-900, #1a1a1a);

    /* ========== Typography ========== */
    --breadcrumb-font-family: var(--font-family-sans);
    --breadcrumb-font-size: var(--font-size-16, 1rem);
    --breadcrumb-font-weight: var(--font-weight-400, 400);
    --breadcrumb-line-height: 1;
    --breadcrumb-letter-spacing: 0;
    --breadcrumb-current-letter-spacing: 0.02em;

    /* ========== Layout ========== */
    --breadcrumb-label-gap: calc(4 / 16 * 1rem);
    --breadcrumb-label-suffix-gap: calc(4 / 16 * 1rem);
    --breadcrumb-row-gap: calc(4 / 16 * 1rem);
    --breadcrumb-list-unit-gap: calc(8 / 16 * 1rem);
    --breadcrumb-list-item-gap: calc(4 / 16 * 1rem);
    --breadcrumb-home-icon-size: calc(16 / 16 * 1rem);
    --breadcrumb-separator-size: calc(12 / 16 * 1rem);
    --breadcrumb-separator-gap-start: calc(8 / 16 * 1rem);
    --breadcrumb-separator-margin-inline: calc(1 / 16 * 1rem);

    /* ========== Link ========== */
    --breadcrumb-link-underline-offset: calc(3 / 16 * 1rem);
    --breadcrumb-link-underline-thickness: calc(1 / 16 * 1rem);
    --breadcrumb-link-underline-thickness-hover: 0.2em;
  }
`;

const breadcrumbLocalTokensText = `
  :host {
    --dads-breadcrumb-color: var(--breadcrumb-color);
    --dads-breadcrumb-current-color: var(--breadcrumb-current-color);
    --dads-breadcrumb-link-color: var(--breadcrumb-link-color);
    --dads-breadcrumb-link-color-hover: var(--breadcrumb-link-color-hover);
    --dads-breadcrumb-link-color-active: var(--breadcrumb-link-color-active);
    --dads-breadcrumb-separator-color: var(--breadcrumb-separator-color);

    --dads-breadcrumb-font-family: var(--breadcrumb-font-family);
    --dads-breadcrumb-font-size: var(--breadcrumb-font-size);
    --dads-breadcrumb-font-weight: var(--breadcrumb-font-weight);
    --dads-breadcrumb-line-height: var(--breadcrumb-line-height);
    --dads-breadcrumb-letter-spacing: var(--breadcrumb-letter-spacing);
    --dads-breadcrumb-current-letter-spacing: var(--breadcrumb-current-letter-spacing);

    --dads-breadcrumb-label-gap: var(--breadcrumb-label-gap);
    --dads-breadcrumb-label-suffix-gap: var(--breadcrumb-label-suffix-gap);
    --dads-breadcrumb-row-gap: var(--breadcrumb-row-gap);
    --dads-breadcrumb-list-unit-gap: var(--breadcrumb-list-unit-gap);
    --dads-breadcrumb-list-item-gap: var(--breadcrumb-list-item-gap);
    --dads-breadcrumb-home-icon-size: var(--breadcrumb-home-icon-size);
    --dads-breadcrumb-separator-size: var(--breadcrumb-separator-size);
    --dads-breadcrumb-separator-gap-start: var(--breadcrumb-separator-gap-start);
    --dads-breadcrumb-separator-margin-inline: var(--breadcrumb-separator-margin-inline);

    --dads-breadcrumb-link-underline-offset: var(--breadcrumb-link-underline-offset);
    --dads-breadcrumb-link-underline-thickness: var(--breadcrumb-link-underline-thickness);
    --dads-breadcrumb-link-underline-thickness-hover: var(--breadcrumb-link-underline-thickness-hover);
  }
`;

export const breadcrumbSemanticTokens = css`${breadcrumbSemanticTokensText}`;
export const breadcrumbLocalTokens = css`${breadcrumbLocalTokensText}`;

export const breadcrumbTokens = css`
  ${breadcrumbSemanticTokensText}
  ${breadcrumbLocalTokensText}
`;
