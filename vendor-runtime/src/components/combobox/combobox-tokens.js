/**
 * Combobox コンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const comboboxSemanticTokensText = `
  :host {
    --combobox-label-color: var(--color-neutral-solid-gray-800, #333333);
    --combobox-label-weight: var(--font-weight-700, 700);
    --combobox-label-size-sm: var(--font-size-16, 1rem);
    --combobox-label-size-md: var(--font-size-17, 1.0625rem);
    --combobox-label-size-lg: var(--font-size-18, 1.125rem);

    --combobox-support-color: var(--color-neutral-solid-gray-600, #666666);
    --combobox-error-color: var(--color-semantic-error-1, #ec0000);
    --combobox-required-color: var(--color-semantic-error-1, #ec0000);

    --combobox-bg: var(--color-neutral-white, #ffffff);
    --combobox-bg-disabled: var(--color-neutral-solid-gray-50, #f2f2f2);

    --combobox-border-color: var(--color-neutral-solid-gray-600, #666666);
    --combobox-border-color-hover: var(--color-neutral-black, #000000);
    --combobox-border-color-focus: var(--color-neutral-black, #000000);
    --combobox-border-color-error: var(--color-semantic-error-1, #ec0000);
    --combobox-border-color-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    --combobox-text-color: var(--color-neutral-solid-gray-800, #333333);
    --combobox-text-color-disabled: var(--color-neutral-solid-gray-420, #949494);
    --combobox-placeholder-color: var(--color-neutral-solid-gray-500, #808080);

    --combobox-option-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --combobox-option-active-bg: var(--color-primitive-yellow-100, #fff6cc);
    --combobox-option-selected-bg: var(--color-primitive-blue-50, #ebf4ff);
    --combobox-option-selected-color: var(--color-primitive-blue-900, #004097);

    --combobox-chip-bg: var(--color-primitive-blue-50, #ebf4ff);
    --combobox-chip-color: var(--color-primitive-blue-900, #004097);
    --combobox-chip-border-color: var(--color-primitive-blue-300, #8fb7ff);

    --combobox-gap: var(--spacing-2, 0.5rem);
    --combobox-padding-y: calc(11 / 16 * 1rem);
    --combobox-padding-inline: var(--spacing-4, 1rem);
    --combobox-indicator-size: calc(20 / 16 * 1rem);

    --combobox-control-height-sm: 40px;
    --combobox-control-height-md: 48px;
    --combobox-control-height-lg: 56px;

    --combobox-border-width: 1px;
    --combobox-border-radius: var(--border-radius-8, 0.5rem);
    --combobox-font-size: var(--font-size-16, 1rem);
    --combobox-list-max-height: 16rem;
    --combobox-list-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;
const comboboxLocalTokensText = `
  :host {
    --dads-combobox-label-color: var(--combobox-label-color);
    --dads-combobox-label-weight: var(--combobox-label-weight);
    --dads-combobox-label-size: var(--combobox-label-size-md);
    --dads-combobox-support-color: var(--combobox-support-color);
    --dads-combobox-error-color: var(--combobox-error-color);
    --dads-combobox-required-color: var(--combobox-required-color);

    --dads-combobox-background: var(--combobox-bg);
    --dads-combobox-border-color: var(--combobox-border-color);
    --dads-combobox-border-width: var(--combobox-border-width);
    --dads-combobox-border-radius: var(--combobox-border-radius);
    --dads-combobox-text-color: var(--combobox-text-color);
    --dads-combobox-placeholder-color: var(--combobox-placeholder-color);
    --dads-combobox-control-height: var(--combobox-control-height-md);
    --dads-combobox-padding-y: var(--combobox-padding-y);
    --dads-combobox-padding-inline: var(--combobox-padding-inline);
    --dads-combobox-indicator-size: var(--combobox-indicator-size);
    --dads-combobox-font-size: var(--combobox-font-size);

    --dads-combobox-option-hover-bg: var(--combobox-option-hover-bg);
    --dads-combobox-option-active-bg: var(--combobox-option-active-bg);
    --dads-combobox-option-selected-bg: var(--combobox-option-selected-bg);
    --dads-combobox-option-selected-color: var(--combobox-option-selected-color);

    --dads-combobox-chip-bg: var(--combobox-chip-bg);
    --dads-combobox-chip-color: var(--combobox-chip-color);
    --dads-combobox-chip-border-color: var(--combobox-chip-border-color);

    --dads-combobox-list-max-height: var(--combobox-list-max-height);
    --dads-combobox-list-shadow: var(--combobox-list-shadow);
  }

  :host([size="sm"]) {
    --dads-combobox-label-size: var(--combobox-label-size-sm);
    --dads-combobox-control-height: var(--combobox-control-height-sm);
  }

  :host([size="lg"]) {
    --dads-combobox-label-size: var(--combobox-label-size-lg);
    --dads-combobox-control-height: var(--combobox-control-height-lg);
  }

  :host([error]) {
    --dads-combobox-border-color: var(--combobox-border-color-error);
  }
`;
export const comboboxSemanticTokens = css `${comboboxSemanticTokensText}`;
export const comboboxLocalTokens = css `${comboboxLocalTokensText}`;
export const comboboxTokens = css `
  ${comboboxSemanticTokensText}
  ${comboboxLocalTokensText}
`;
