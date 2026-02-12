/**
 * Resource List コンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const resourceListSemanticTokensText = `
  :host {
    --resource-list-font-family: var(--font-family-sans);
    --resource-list-font-size: var(--font-size-16, 1rem);
    --resource-list-line-height: var(--line-height-130, 1.3);
    --resource-list-letter-spacing: 0;

    --resource-list-background: var(--color-neutral-white, #ffffff);
    --resource-list-background-selected: var(--color-primitive-blue-100, #d9e6ff);
    --resource-list-background-disabled: var(--color-neutral-solid-gray-50, #f2f2f2);
    --resource-list-color: var(--color-neutral-solid-gray-800, #333333);
    --resource-list-color-disabled: var(--color-neutral-solid-gray-420, #949494);
    --resource-list-border-color: var(--color-neutral-solid-gray-420, #949494);
    --resource-list-border-color-selected: var(--color-neutral-solid-gray-420, #949494);
    --resource-list-border-color-disabled: var(--color-neutral-solid-gray-300, #b6b6b6);

    --resource-list-title-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --resource-list-title-link-color: var(--color-primitive-blue-1000, #00118f);
    --resource-list-title-link-color-hover: var(--color-primitive-blue-900, #001073);
    --resource-list-title-link-color-active: var(--color-primitive-orange-800, #ba4b00);

    --resource-list-padding-block: calc(16 / 16 * 1rem);
    --resource-list-padding-inline: calc(16 / 16 * 1rem);
    --resource-list-gap: calc(16 / 16 * 1rem);
    --resource-list-content-gap: calc(4 / 16 * 1rem);
    --resource-list-control-hit-area: calc(48 / 16 * 1rem);
    --resource-list-action-width: calc(44 / 16 * 1rem);
    --resource-list-border-radius: calc(16 / 16 * 1rem);

    --resource-list-title-font-size: calc(20 / 16 * 1rem);
    --resource-list-title-font-weight: var(--font-weight-700, 700);
    --resource-list-title-line-height: var(--line-height-150, 1.5);
    --resource-list-title-letter-spacing: 0.02em;

    --resource-list-title-underline-thickness: calc(1 / 16 * 1rem);
    --resource-list-title-underline-thickness-hover: calc(3 / 16 * 1rem);
    --resource-list-title-underline-offset: calc(3 / 16 * 1rem);

    --resource-list-focus-outline-color: var(--color-neutral-black, #000000);
    --resource-list-focus-outline-width: calc(4 / 16 * 1rem);
    --resource-list-whole-focus-outline-width: calc(6 / 16 * 1rem);
    --resource-list-focus-outline-offset: calc(2 / 16 * 1rem);
    --resource-list-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --resource-list-focus-ring-width: calc(2 / 16 * 1rem);

    --resource-list-hover-outline-width: calc(2 / 16 * 1rem);
    --resource-list-hover-background: var(--color-neutral-solid-gray-50, #f2f2f2);
  }
`;
const resourceListLocalTokensText = `
  :host {
    --dads-resource-list-font-family: var(--resource-list-font-family);
    --dads-resource-list-font-size: var(--resource-list-font-size);
    --dads-resource-list-line-height: var(--resource-list-line-height);
    --dads-resource-list-letter-spacing: var(--resource-list-letter-spacing);

    --dads-resource-list-background: var(--resource-list-background);
    --dads-resource-list-background-selected: var(--resource-list-background-selected);
    --dads-resource-list-background-disabled: var(--resource-list-background-disabled);
    --dads-resource-list-color: var(--resource-list-color);
    --dads-resource-list-color-disabled: var(--resource-list-color-disabled);
    --dads-resource-list-border-color: var(--resource-list-border-color);
    --dads-resource-list-border-color-selected: var(--resource-list-border-color-selected);
    --dads-resource-list-border-color-disabled: var(--resource-list-border-color-disabled);

    --dads-resource-list-title-color: var(--resource-list-title-color);
    --dads-resource-list-title-link-color: var(--resource-list-title-link-color);
    --dads-resource-list-title-link-color-hover: var(--resource-list-title-link-color-hover);
    --dads-resource-list-title-link-color-active: var(--resource-list-title-link-color-active);

    --dads-resource-list-padding-block: var(--resource-list-padding-block);
    --dads-resource-list-padding-inline: var(--resource-list-padding-inline);
    --dads-resource-list-gap: var(--resource-list-gap);
    --dads-resource-list-content-gap: var(--resource-list-content-gap);
    --dads-resource-list-control-hit-area: var(--resource-list-control-hit-area);
    --dads-resource-list-action-width: var(--resource-list-action-width);
    --dads-resource-list-border-radius: var(--resource-list-border-radius);

    --dads-resource-list-title-font-size: var(--resource-list-title-font-size);
    --dads-resource-list-title-font-weight: var(--resource-list-title-font-weight);
    --dads-resource-list-title-line-height: var(--resource-list-title-line-height);
    --dads-resource-list-title-letter-spacing: var(--resource-list-title-letter-spacing);

    --dads-resource-list-title-underline-thickness: var(--resource-list-title-underline-thickness);
    --dads-resource-list-title-underline-thickness-hover: var(--resource-list-title-underline-thickness-hover);
    --dads-resource-list-title-underline-offset: var(--resource-list-title-underline-offset);

    --dads-resource-list-focus-outline-color: var(--resource-list-focus-outline-color);
    --dads-resource-list-focus-outline-width: var(--resource-list-focus-outline-width);
    --dads-resource-list-whole-focus-outline-width: var(--resource-list-whole-focus-outline-width);
    --dads-resource-list-focus-outline-offset: var(--resource-list-focus-outline-offset);
    --dads-resource-list-focus-ring-color: var(--resource-list-focus-ring-color);
    --dads-resource-list-focus-ring-width: var(--resource-list-focus-ring-width);

    --dads-resource-list-hover-outline-width: var(--resource-list-hover-outline-width);
    --dads-resource-list-hover-background: var(--resource-list-hover-background);
  }
`;
export const resourceListSemanticTokens = css `${resourceListSemanticTokensText}`;
export const resourceListLocalTokens = css `${resourceListLocalTokensText}`;
export const resourceListTokens = css `
  ${resourceListSemanticTokensText}
  ${resourceListLocalTokensText}
`;
