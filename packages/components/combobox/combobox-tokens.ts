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
    --combobox-border-color-focus: var(--color-neutral-solid-gray-600, #666666);
    --combobox-border-color-error: var(--color-semantic-error-1, #ec0000);
    --combobox-border-color-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    --combobox-text-color: var(--color-neutral-solid-gray-800, #333333);
    --combobox-text-color-disabled: var(--color-neutral-solid-gray-420, #949494);
    --combobox-placeholder-color: var(--color-neutral-solid-gray-500, #808080);

    --combobox-option-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --combobox-option-active-bg: var(--color-primitive-yellow-100, #fff6cc);
    --combobox-option-selected-bg: var(--color-primitive-blue-50, #ebf4ff);
    --combobox-option-selected-color: var(--color-primitive-blue-900, #004097);

    --combobox-chip-bg: var(--color-neutral-white, #ffffff);
    --combobox-chip-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --combobox-chip-border-color: var(--color-neutral-solid-gray-700, #4d4d4d);

    --combobox-gap: var(--spacing-4, 1rem);
    --combobox-padding-y-s: 0.4375rem;
    --combobox-padding-y-m: 0.5625rem;
    --combobox-padding-y-l: 0.6875rem;
    --combobox-padding-y-sm: var(--combobox-padding-y-s);
    --combobox-padding-y-md: var(--combobox-padding-y-m);
    --combobox-padding-y-lg: var(--combobox-padding-y-l);
    --combobox-padding-inline: var(--spacing-3, 0.75rem);
    --combobox-indicator-size-s: 1.5rem;
    --combobox-indicator-size-m: 1.75rem;
    --combobox-indicator-size-l: 2rem;
    --combobox-indicator-size-sm: var(--combobox-indicator-size-s);
    --combobox-indicator-size-md: var(--combobox-indicator-size-m);
    --combobox-indicator-size-lg: var(--combobox-indicator-size-l);
    --combobox-indicator-radius: var(--border-radius-4, 0.25rem);
    --combobox-indicator-border-color: var(--color-primitive-blue-1000, #00118f);
    --combobox-indicator-background: var(--color-neutral-white, #ffffff);

    --combobox-control-height-s: 40px;
    --combobox-control-height-m: 48px;
    --combobox-control-height-l: 56px;
    --combobox-control-height-sm: var(--combobox-control-height-s);
    --combobox-control-height-md: var(--combobox-control-height-m);
    --combobox-control-height-lg: var(--combobox-control-height-l);

    --combobox-border-width: 1px;
    --combobox-border-radius: var(--border-radius-8, 0.5rem);
    --combobox-font-size: var(--font-size-16, 1rem);
    --combobox-list-max-height: 25.5rem;
    --combobox-list-shadow: var(--elevation-1);
    --combobox-option-divider-color: var(--color-neutral-solid-gray-500, #7f7f7f);
    --combobox-option-min-height: 4rem;
    --combobox-option-padding-y: var(--spacing-3, 0.75rem);
    --combobox-option-padding-inline: var(--spacing-3, 0.75rem);
    --combobox-multi-check-size: 1.5rem;
    --combobox-multi-check-radius: var(--border-radius-4, 0.25rem);
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
    --dads-combobox-control-height: var(--combobox-control-height-m);
    --dads-combobox-padding-y: var(--combobox-padding-y-m);
    --dads-combobox-padding-inline: var(--combobox-padding-inline);
    --dads-combobox-indicator-size: var(--combobox-indicator-size-m);
    --dads-combobox-indicator-radius: var(--combobox-indicator-radius);
    --dads-combobox-indicator-border-color: var(--combobox-indicator-border-color);
    --dads-combobox-indicator-background: var(--combobox-indicator-background);
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
    --dads-combobox-option-divider-color: var(--combobox-option-divider-color);
    --dads-combobox-option-min-height: var(--combobox-option-min-height);
    --dads-combobox-option-padding-y: var(--combobox-option-padding-y);
    --dads-combobox-option-padding-inline: var(--combobox-option-padding-inline);
    --dads-combobox-multi-check-size: var(--combobox-multi-check-size);
    --dads-combobox-multi-check-radius: var(--combobox-multi-check-radius);
  }

  :host([size="s"]),
  :host([size="sm"]) {
    --dads-combobox-label-size: var(--combobox-label-size-sm);
    --dads-combobox-control-height: var(--combobox-control-height-s);
    --dads-combobox-padding-y: var(--combobox-padding-y-s);
    --dads-combobox-indicator-size: var(--combobox-indicator-size-s);
  }

  :host([size="m"]),
  :host([size="md"]) {
    --dads-combobox-label-size: var(--combobox-label-size-md);
    --dads-combobox-control-height: var(--combobox-control-height-m);
    --dads-combobox-padding-y: var(--combobox-padding-y-m);
    --dads-combobox-indicator-size: var(--combobox-indicator-size-m);
  }

  :host([size="l"]),
  :host([size="lg"]) {
    --dads-combobox-label-size: var(--combobox-label-size-lg);
    --dads-combobox-control-height: var(--combobox-control-height-l);
    --dads-combobox-padding-y: var(--combobox-padding-y-l);
    --dads-combobox-indicator-size: var(--combobox-indicator-size-l);
  }

  :host([error]) {
    --dads-combobox-border-color: var(--combobox-border-color-error);
  }
`;

export const comboboxSemanticTokens = css`${comboboxSemanticTokensText}`;
export const comboboxLocalTokens = css`${comboboxLocalTokensText}`;
export const comboboxTokens = css`
  ${comboboxSemanticTokensText}
  ${comboboxLocalTokensText}
`;
