/**
 * Utility Link tokens (semantic + local override API)
 */
import { css } from '../../core/web-components.js';
const utilityLinkSemanticTokensText = `
  :host {
    /* Typography */
    --utility-link-font-family: var(--font-family-sans);
    --utility-link-font-size: var(--font-size-16, 1rem);
    --utility-link-font-weight: var(--font-weight-400, 400);
    --utility-link-line-height: 1.3;
    --utility-link-letter-spacing: 0;

    /* Colors */
    --utility-link-label-color: var(--color-neutral-solid-gray-800, #333333);
    --utility-link-label-color-hover: var(--color-neutral-solid-gray-800, #333333);
    --utility-link-label-color-active: var(--color-neutral-solid-gray-800, #333333);
    --utility-link-icon-color: var(--color-neutral-solid-gray-900, #1a1a1a);

    /* Link decoration */
    --utility-link-underline-thickness: calc(1 / 16 * 1rem);
    --utility-link-underline-thickness-hover: calc(3 / 16 * 1rem);
    --utility-link-underline-offset: calc(3 / 16 * 1rem);

    /* Focus */
    --utility-link-focus-outline-color: var(--color-neutral-black, #000000);
    --utility-link-focus-outline-width: calc(4 / 16 * 1rem);
    --utility-link-focus-outline-offset: calc(2 / 16 * 1rem);
    --utility-link-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --utility-link-focus-ring-width: calc(2 / 16 * 1rem);
    --utility-link-focus-background: var(--color-primitive-yellow-300, #ffd43d);
    --utility-link-focus-border-radius: calc(4 / 16 * 1rem);

    /* Icon */
    --utility-link-icon-size: calc(16 / 16 * 1rem);
    --utility-link-item-gap: calc(4 / 16 * 1rem);
    --utility-link-icon-vertical-align: -0.15em;
  }
`;
const utilityLinkLocalTokensText = `
  :host {
    --dads-utility-link-font-family: var(--utility-link-font-family);
    --dads-utility-link-font-size: var(--utility-link-font-size);
    --dads-utility-link-font-weight: var(--utility-link-font-weight);
    --dads-utility-link-line-height: var(--utility-link-line-height);
    --dads-utility-link-letter-spacing: var(--utility-link-letter-spacing);

    --dads-utility-link-label-color: var(--utility-link-label-color);
    --dads-utility-link-label-color-hover: var(--utility-link-label-color-hover);
    --dads-utility-link-label-color-active: var(--utility-link-label-color-active);
    --dads-utility-link-icon-color: var(--utility-link-icon-color);

    --dads-utility-link-underline-thickness: var(--utility-link-underline-thickness);
    --dads-utility-link-underline-thickness-hover: var(--utility-link-underline-thickness-hover);
    --dads-utility-link-underline-offset: var(--utility-link-underline-offset);

    --dads-utility-link-focus-outline-color: var(--utility-link-focus-outline-color);
    --dads-utility-link-focus-outline-width: var(--utility-link-focus-outline-width);
    --dads-utility-link-focus-outline-offset: var(--utility-link-focus-outline-offset);
    --dads-utility-link-focus-ring-color: var(--utility-link-focus-ring-color);
    --dads-utility-link-focus-ring-width: var(--utility-link-focus-ring-width);
    --dads-utility-link-focus-background: var(--utility-link-focus-background);
    --dads-utility-link-focus-border-radius: var(--utility-link-focus-border-radius);

    --dads-utility-link-icon-size: var(--utility-link-icon-size);
    --dads-utility-link-item-gap: var(--utility-link-item-gap);
    --dads-utility-link-icon-vertical-align: var(--utility-link-icon-vertical-align);
  }
`;
export const utilityLinkSemanticTokens = css `${utilityLinkSemanticTokensText}`;
export const utilityLinkLocalTokens = css `${utilityLinkLocalTokensText}`;
export const utilityLinkTokens = css `
  ${utilityLinkSemanticTokensText}
  ${utilityLinkLocalTokensText}
`;
