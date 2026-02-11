/**
 * Emergency Banner コンポーネント用トークン
 */
import { css } from '../../core/web-components.js';

const emergencyBannerSemanticTokensText = `
  :host {
    --emergency-banner-border-color: var(--color-semantic-warning-orange-1, #f18d00);
    --emergency-banner-border-width: calc(6 / 16 * 1rem);

    --emergency-banner-background: var(--color-neutral-white, #ffffff);
    --emergency-banner-color: var(--color-neutral-solid-gray-800, #333333);
    --emergency-banner-font-size: var(--font-size-16, 1rem);
    --emergency-banner-line-height: var(--line-height-170, 1.7);
    --emergency-banner-letter-spacing: 0.02em;

    --emergency-banner-row-gap: calc(8 / 16 * 1rem);
    --emergency-banner-padding-block: calc(14 / 16 * 1rem);
    --emergency-banner-padding-inline: calc(10 / 16 * 1rem);

    --emergency-banner-header-gap: calc(8 / 16 * 1rem);

    --emergency-banner-heading-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --emergency-banner-heading-font-size: var(--font-size-20, 1.25rem);
    --emergency-banner-heading-line-height: var(--line-height-150, 1.5);
    --emergency-banner-heading-font-weight: var(--font-weight-700, 700);

    --emergency-banner-body-row-gap: calc(8 / 16 * 1rem);

    --emergency-banner-action-padding-top: calc(8 / 16 * 1rem);
    --emergency-banner-action-padding-bottom: 0;

    --emergency-banner-action-background: var(--color-semantic-error-1, #cc0000);
    --emergency-banner-action-background-hover: var(--color-semantic-error-2, #b40000);
    --emergency-banner-action-color: var(--color-neutral-white, #ffffff);
    --emergency-banner-action-font-size: var(--font-size-16, 1rem);
    --emergency-banner-action-font-weight: var(--font-weight-700, 700);
    --emergency-banner-action-line-height: 1;
    --emergency-banner-action-letter-spacing: 0.02em;
    --emergency-banner-action-padding: calc(18 / 16 * 1rem);
    --emergency-banner-action-border-width: calc(2 / 16 * 1rem);
    --emergency-banner-action-border-radius: calc(12 / 16 * 1rem);
    --emergency-banner-action-inner-border-width: calc(2 / 16 * 1rem);
    --emergency-banner-action-inner-border-radius: calc(10 / 16 * 1rem);
    --emergency-banner-action-icon-size: calc(16 / 16 * 1rem);
    --emergency-banner-action-min-width: 100%;

    --emergency-banner-focus-outline-width: calc(4 / 16 * 1rem);
    --emergency-banner-focus-outline-offset: calc(2 / 16 * 1rem);
    --emergency-banner-focus-outline-color: var(--color-neutral-black, #000000);
    --emergency-banner-focus-ring-width: calc(2 / 16 * 1rem);
    --emergency-banner-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
  }

  @media (min-width: 48rem) {
    :host {
      --emergency-banner-row-gap: calc(16 / 16 * 1rem);
      --emergency-banner-padding-block: calc(26 / 16 * 1rem);
      --emergency-banner-padding-inline: calc(26 / 16 * 1rem);

      --emergency-banner-heading-font-size: var(--font-size-24, 1.5rem);

      --emergency-banner-body-row-gap: calc(16 / 16 * 1rem);

      --emergency-banner-action-padding-top: calc(12 / 16 * 1rem);
      --emergency-banner-action-padding-bottom: calc(4 / 16 * 1rem);
      --emergency-banner-action-padding: calc(20 / 16 * 1rem);
      --emergency-banner-action-border-width: calc(4 / 16 * 1rem);
      --emergency-banner-action-border-radius: calc(16 / 16 * 1rem);
      --emergency-banner-action-inner-border-width: calc(4 / 16 * 1rem);
      --emergency-banner-action-inner-border-radius: calc(12 / 16 * 1rem);
      --emergency-banner-action-min-width: 50%;
    }
  }
`;

const emergencyBannerLocalTokensText = `
  :host {
    --dads-emergency-banner-border-color: var(--emergency-banner-border-color);
    --dads-emergency-banner-border-width: var(--emergency-banner-border-width);

    --dads-emergency-banner-background: var(--emergency-banner-background);
    --dads-emergency-banner-color: var(--emergency-banner-color);
    --dads-emergency-banner-font-size: var(--emergency-banner-font-size);
    --dads-emergency-banner-line-height: var(--emergency-banner-line-height);
    --dads-emergency-banner-letter-spacing: var(--emergency-banner-letter-spacing);

    --dads-emergency-banner-row-gap: var(--emergency-banner-row-gap);
    --dads-emergency-banner-padding-block: var(--emergency-banner-padding-block);
    --dads-emergency-banner-padding-inline: var(--emergency-banner-padding-inline);

    --dads-emergency-banner-header-gap: var(--emergency-banner-header-gap);

    --dads-emergency-banner-heading-color: var(--emergency-banner-heading-color);
    --dads-emergency-banner-heading-font-size: var(--emergency-banner-heading-font-size);
    --dads-emergency-banner-heading-line-height: var(--emergency-banner-heading-line-height);
    --dads-emergency-banner-heading-font-weight: var(--emergency-banner-heading-font-weight);

    --dads-emergency-banner-body-row-gap: var(--emergency-banner-body-row-gap);

    --dads-emergency-banner-action-padding-top: var(--emergency-banner-action-padding-top);
    --dads-emergency-banner-action-padding-bottom: var(--emergency-banner-action-padding-bottom);

    --dads-emergency-banner-action-background: var(--emergency-banner-action-background);
    --dads-emergency-banner-action-background-hover: var(--emergency-banner-action-background-hover);
    --dads-emergency-banner-action-color: var(--emergency-banner-action-color);
    --dads-emergency-banner-action-font-size: var(--emergency-banner-action-font-size);
    --dads-emergency-banner-action-font-weight: var(--emergency-banner-action-font-weight);
    --dads-emergency-banner-action-line-height: var(--emergency-banner-action-line-height);
    --dads-emergency-banner-action-letter-spacing: var(--emergency-banner-action-letter-spacing);
    --dads-emergency-banner-action-padding: var(--emergency-banner-action-padding);
    --dads-emergency-banner-action-border-width: var(--emergency-banner-action-border-width);
    --dads-emergency-banner-action-border-radius: var(--emergency-banner-action-border-radius);
    --dads-emergency-banner-action-inner-border-width: var(--emergency-banner-action-inner-border-width);
    --dads-emergency-banner-action-inner-border-radius: var(--emergency-banner-action-inner-border-radius);
    --dads-emergency-banner-action-icon-size: var(--emergency-banner-action-icon-size);
    --dads-emergency-banner-action-min-width: var(--emergency-banner-action-min-width);

    --dads-emergency-banner-focus-outline-width: var(--emergency-banner-focus-outline-width);
    --dads-emergency-banner-focus-outline-offset: var(--emergency-banner-focus-outline-offset);
    --dads-emergency-banner-focus-outline-color: var(--emergency-banner-focus-outline-color);
    --dads-emergency-banner-focus-ring-width: var(--emergency-banner-focus-ring-width);
    --dads-emergency-banner-focus-ring-color: var(--emergency-banner-focus-ring-color);
  }
`;

export const emergencyBannerTokens = css`
  ${emergencyBannerSemanticTokensText}
  ${emergencyBannerLocalTokensText}
`;
