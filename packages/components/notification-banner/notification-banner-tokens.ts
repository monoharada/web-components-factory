/**
 * Notification Banner コンポーネント用トークン
 */
import { css } from '../../core/web-components.js';

const notificationBannerSemanticTokensText = `
  :host {
    --notification-banner-base-color: var(--color-primitive-blue-900, #0017c1);
    --notification-banner-chip-color: var(--color-primitive-blue-900, #0017c1);

    --notification-banner-background: var(--color-neutral-white, #ffffff);
    --notification-banner-color: var(--color-neutral-solid-gray-800, #333333);
    --notification-banner-title-color: var(--color-neutral-solid-gray-900, #1a1a1a);

    --notification-banner-icon-color: var(--notification-banner-base-color);
    --notification-banner-border-color: var(--notification-banner-base-color);

    --notification-banner-border-width: calc(3 / 16 * 1rem);
    --notification-banner-border-radius: calc(12 / 16 * 1rem);

    --notification-banner-color-chip-border-width: calc(2 / 16 * 1rem);
    --notification-banner-color-chip-radius: 0;
    --notification-banner-color-chip-inset-width: calc(8 / 16 * 1rem);

    --notification-banner-padding-block-start: calc(8 / 16 * 1rem);
    --notification-banner-padding-block-end: calc(16 / 16 * 1rem);
    --notification-banner-padding-inline-start: calc(16 / 16 * 1rem);
    --notification-banner-padding-inline-end: calc(4 / 16 * 1rem);
    --notification-banner-gap: calc(12 / 16 * 1rem);
    --notification-banner-color-chip-padding-inline-start: calc(24 / 16 * 1rem);
    --notification-banner-dense-padding-block-start: calc(8 / 16 * 1rem);
    --notification-banner-dense-padding-block-end: calc(12 / 16 * 1rem);
    --notification-banner-dense-padding-inline-start: calc(16 / 16 * 1rem);
    --notification-banner-dense-padding-inline-end: calc(16 / 16 * 1rem);
    --notification-banner-dense-gap: calc(12 / 16 * 1rem);
    --notification-banner-dense-color-chip-padding-inline-start: calc(24 / 16 * 1rem);
    --notification-banner-dense-color-chip-inset-width: calc(8 / 16 * 1rem);

    --notification-banner-icon-size: calc(24 / 16 * 1rem);
    --notification-banner-icon-padding-top: var(--spacing-1, calc(4 / 16 * 1rem));
    --notification-banner-dense-icon-size: calc(20 / 16 * 1rem);
    --notification-banner-dense-icon-padding-top: calc(2 / 16 * 1rem);

    --notification-banner-title-font-size: var(--font-size-17, 1.0625rem);
    --notification-banner-title-line-height: var(--line-height-170, 1.7);
    --notification-banner-title-letter-spacing: 0.02em;
    --notification-banner-title-font-weight: var(--font-weight-700, 700);

    --notification-banner-body-gap: calc(8 / 16 * 1rem);
    --notification-banner-body-margin-top: 0;
    --notification-banner-body-padding-inline-end: calc(12 / 16 * 1rem);
    --notification-banner-body-padding-block-end: calc(16 / 16 * 1rem);
    --notification-banner-dense-body-gap: calc(4 / 16 * 1rem);
    --notification-banner-dense-body-margin-top: calc(-2 / 16 * 1rem);
    --notification-banner-actions-padding-inline-end: calc(12 / 16 * 1rem);

    --notification-banner-close-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --notification-banner-close-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --notification-banner-close-icon-size: calc(24 / 16 * 1rem);
    --notification-banner-close-compact-size: calc(44 / 16 * 1rem);

    --notification-banner-restore-gap: calc(12 / 16 * 1rem);
    --notification-banner-restore-text-color: var(--notification-banner-color);
    --notification-banner-restore-text-size: var(--font-size-16, 1rem);
    --notification-banner-restore-button-background: var(--color-neutral-white, #ffffff);
    --notification-banner-restore-button-radius: calc(8 / 16 * 1rem);
    --notification-banner-restore-button-padding-block: calc(10 / 16 * 1rem);
    --notification-banner-restore-button-padding-inline: calc(16 / 16 * 1rem);
    --notification-banner-restore-button-color: var(--notification-banner-action-color);
    --notification-banner-restore-button-color-hover: var(--notification-banner-action-color-hover);
    --notification-banner-restore-button-color-active: var(--notification-banner-action-color-active);
    --notification-banner-restore-button-hover-bg: var(--notification-banner-action-outline-hover-bg);
    --notification-banner-restore-button-active-bg: var(--notification-banner-action-outline-active-bg);

    --notification-banner-action-gap: calc(8 / 16 * 1rem);
    --notification-banner-dense-action-gap: calc(8 / 16 * 1rem);
    --notification-banner-action-color: var(--notification-banner-base-color);
    --notification-banner-action-color-hover: var(--color-primitive-blue-1000, #00118f);
    --notification-banner-action-color-active: var(--color-primitive-blue-1200, #000060);
    --notification-banner-action-outline-hover-bg: var(--color-primitive-blue-200, #c5d7fb);
    --notification-banner-action-outline-active-bg: var(--color-primitive-blue-300, #9db7f9);
    --notification-banner-action-text-color: var(--color-neutral-white, #ffffff);
  }

  :host([type='success']) {
    --notification-banner-base-color: var(--color-semantic-success-2, #197a4b);
    --notification-banner-chip-color: var(--color-semantic-success-2, #197a4b);
    --notification-banner-action-color: var(--color-semantic-success-2, #197a4b);
    --notification-banner-action-color-hover: var(--color-primitive-green-1000, #0c472a);
    --notification-banner-action-color-active: var(--color-primitive-green-1200, #032213);
    --notification-banner-action-outline-hover-bg: var(--color-primitive-green-200, #9bd4b5);
    --notification-banner-action-outline-active-bg: var(--color-primitive-green-300, #71c598);
  }

  :host([type='error']) {
    --notification-banner-base-color: var(--color-semantic-error-1, #c00);
    --notification-banner-chip-color: var(--color-semantic-error-1, #c00);
    --notification-banner-action-color: var(--color-semantic-error-1, #c00);
    --notification-banner-action-color-hover: var(--color-primitive-red-1000, #a90000);
    --notification-banner-action-color-active: var(--color-primitive-red-1200, #620000);
    --notification-banner-action-outline-hover-bg: var(--color-primitive-red-200, #ffbbbb);
    --notification-banner-action-outline-active-bg: var(--color-primitive-red-300, #ff9696);
  }

  :host([type='warning']) {
    --notification-banner-base-color: var(--color-semantic-warning-yellow-2, #927200);
    --notification-banner-chip-color: var(--color-primitive-yellow-400, #ffc700);
    --notification-banner-action-color: var(--color-semantic-warning-yellow-2, #927200);
    --notification-banner-action-color-hover: var(--color-primitive-yellow-1000, #806300);
    --notification-banner-action-color-active: var(--color-primitive-yellow-1200, #604b00);
    --notification-banner-action-outline-hover-bg: var(--color-primitive-yellow-200, #ffe380);
    --notification-banner-action-outline-active-bg: var(--color-primitive-yellow-300, #ffd43d);
  }

  :host([type='info-1']) {
    --notification-banner-base-color: var(--color-primitive-blue-900, #0017c1);
    --notification-banner-chip-color: var(--color-primitive-blue-900, #0017c1);
    --notification-banner-action-color: var(--color-primitive-blue-900, #0017c1);
    --notification-banner-action-color-hover: var(--color-primitive-blue-1000, #00118f);
    --notification-banner-action-color-active: var(--color-primitive-blue-1200, #000060);
    --notification-banner-action-outline-hover-bg: var(--color-primitive-blue-200, #c5d7fb);
    --notification-banner-action-outline-active-bg: var(--color-primitive-blue-300, #9db7f9);
  }

  :host([type='info-2']) {
    --notification-banner-base-color: var(--color-neutral-solid-gray-536, #767676);
    --notification-banner-chip-color: var(--color-neutral-solid-gray-536, #767676);
    --notification-banner-action-color: var(--color-neutral-solid-gray-700, #4d4d4d);
    --notification-banner-action-color-hover: var(--color-neutral-solid-gray-800, #333333);
    --notification-banner-action-color-active: var(--color-neutral-solid-gray-900, #1a1a1a);
    --notification-banner-action-outline-hover-bg: var(--color-neutral-solid-gray-100, #e6e6e6);
    --notification-banner-action-outline-active-bg: var(--color-neutral-solid-gray-200, #cccccc);
  }

  @media (min-width: 48rem) {
    :host(:not([data-mobile-demo])) {
      --notification-banner-padding-block-start: calc(24 / 16 * 1rem);
      --notification-banner-padding-block-end: calc(32 / 16 * 1rem);
      --notification-banner-padding-inline-start: calc(24 / 16 * 1rem);
      --notification-banner-padding-inline-end: calc(24 / 16 * 1rem);
      --notification-banner-gap: calc(24 / 16 * 1rem);
      --notification-banner-icon-size: calc(36 / 16 * 1rem);
      --notification-banner-icon-padding-top: 0;
      --notification-banner-color-chip-padding-inline-start: calc(40 / 16 * 1rem);
      --notification-banner-color-chip-inset-width: calc(16 / 16 * 1rem);
      --notification-banner-dense-padding-block-start: calc(12 / 16 * 1rem);
      --notification-banner-dense-padding-block-end: calc(16 / 16 * 1rem);
      --notification-banner-dense-padding-inline-start: calc(16 / 16 * 1rem);
      --notification-banner-dense-padding-inline-end: calc(16 / 16 * 1rem);
      --notification-banner-dense-gap: calc(16 / 16 * 1rem);
      --notification-banner-dense-color-chip-padding-inline-start: calc(24 / 16 * 1rem);
      --notification-banner-dense-color-chip-inset-width: calc(8 / 16 * 1rem);
      --notification-banner-dense-icon-size: calc(24 / 16 * 1rem);
      --notification-banner-dense-icon-padding-top: 0;
      --notification-banner-title-font-size: var(--font-size-20, 1.25rem);
      --notification-banner-title-line-height: var(--line-height-150, 1.5);
      --notification-banner-body-margin-top: 0;
      --notification-banner-body-padding-inline-end: 0;
      --notification-banner-body-padding-block-end: 0;
      --notification-banner-actions-padding-inline-end: 0;
      --notification-banner-action-gap: calc(16 / 16 * 1rem);
      --notification-banner-dense-body-gap: calc(8 / 16 * 1rem);
      --notification-banner-dense-body-margin-top: 0;
      --notification-banner-dense-action-gap: calc(12 / 16 * 1rem);
      --notification-banner-restore-gap: calc(16 / 16 * 1rem);
    }
  }
`;

const notificationBannerLocalTokensText = `
  :host {
    --dads-notification-banner-background: var(--notification-banner-background);
    --dads-notification-banner-color: var(--notification-banner-color);
    --dads-notification-banner-title-color: var(--notification-banner-title-color);

    --dads-notification-banner-border-color: var(--notification-banner-border-color);
    --dads-notification-banner-border-width: var(--notification-banner-border-width);
    --dads-notification-banner-border-radius: var(--notification-banner-border-radius);

    --dads-notification-banner-chip-color: var(--notification-banner-chip-color);
    --dads-notification-banner-color-chip-border-width: var(--notification-banner-color-chip-border-width);
    --dads-notification-banner-color-chip-radius: var(--notification-banner-color-chip-radius);
    --dads-notification-banner-color-chip-inset-width: var(--notification-banner-color-chip-inset-width);

    --dads-notification-banner-padding-block-start: var(--notification-banner-padding-block-start);
    --dads-notification-banner-padding-block-end: var(--notification-banner-padding-block-end);
    --dads-notification-banner-padding-inline-start: var(--notification-banner-padding-inline-start);
    --dads-notification-banner-padding-inline-end: var(--notification-banner-padding-inline-end);
    --dads-notification-banner-gap: var(--notification-banner-gap);
    --dads-notification-banner-color-chip-padding-inline-start: var(--notification-banner-color-chip-padding-inline-start);
    --dads-notification-banner-dense-padding-block-start: var(--notification-banner-dense-padding-block-start);
    --dads-notification-banner-dense-padding-block-end: var(--notification-banner-dense-padding-block-end);
    --dads-notification-banner-dense-padding-inline-start: var(--notification-banner-dense-padding-inline-start);
    --dads-notification-banner-dense-padding-inline-end: var(--notification-banner-dense-padding-inline-end);
    --dads-notification-banner-dense-gap: var(--notification-banner-dense-gap);
    --dads-notification-banner-dense-color-chip-padding-inline-start: var(--notification-banner-dense-color-chip-padding-inline-start);
    --dads-notification-banner-dense-color-chip-inset-width: var(--notification-banner-dense-color-chip-inset-width);

    --dads-notification-banner-icon-color: var(--notification-banner-icon-color);
    --dads-notification-banner-icon-size: var(--notification-banner-icon-size);
    --dads-notification-banner-icon-padding-top: var(--notification-banner-icon-padding-top);
    --dads-notification-banner-dense-icon-size: var(--notification-banner-dense-icon-size);
    --dads-notification-banner-dense-icon-padding-top: var(--notification-banner-dense-icon-padding-top);

    --dads-notification-banner-title-font-size: var(--notification-banner-title-font-size);
    --dads-notification-banner-title-line-height: var(--notification-banner-title-line-height);
    --dads-notification-banner-title-letter-spacing: var(--notification-banner-title-letter-spacing);
    --dads-notification-banner-title-font-weight: var(--notification-banner-title-font-weight);

    --dads-notification-banner-body-gap: var(--notification-banner-body-gap);
    --dads-notification-banner-body-margin-top: var(--notification-banner-body-margin-top);
    --dads-notification-banner-body-padding-inline-end: var(--notification-banner-body-padding-inline-end);
    --dads-notification-banner-body-padding-block-end: var(--notification-banner-body-padding-block-end);
    --dads-notification-banner-dense-body-gap: var(--notification-banner-dense-body-gap);
    --dads-notification-banner-dense-body-margin-top: var(--notification-banner-dense-body-margin-top);
    --dads-notification-banner-actions-padding-inline-end: var(--notification-banner-actions-padding-inline-end);

    --dads-notification-banner-close-color: var(--notification-banner-close-color);
    --dads-notification-banner-close-hover-bg: var(--notification-banner-close-hover-bg);
    --dads-notification-banner-close-icon-size: var(--notification-banner-close-icon-size);
    --dads-notification-banner-close-compact-size: var(--notification-banner-close-compact-size);

    --dads-notification-banner-restore-gap: var(--notification-banner-restore-gap);
    --dads-notification-banner-restore-text-color: var(--notification-banner-restore-text-color);
    --dads-notification-banner-restore-text-size: var(--notification-banner-restore-text-size);
    --dads-notification-banner-restore-button-background: var(--notification-banner-restore-button-background);
    --dads-notification-banner-restore-button-radius: var(--notification-banner-restore-button-radius);
    --dads-notification-banner-restore-button-padding-block: var(--notification-banner-restore-button-padding-block);
    --dads-notification-banner-restore-button-padding-inline: var(--notification-banner-restore-button-padding-inline);
    --dads-notification-banner-restore-button-color: var(--notification-banner-restore-button-color);
    --dads-notification-banner-restore-button-color-hover: var(--notification-banner-restore-button-color-hover);
    --dads-notification-banner-restore-button-color-active: var(--notification-banner-restore-button-color-active);
    --dads-notification-banner-restore-button-hover-bg: var(--notification-banner-restore-button-hover-bg);
    --dads-notification-banner-restore-button-active-bg: var(--notification-banner-restore-button-active-bg);

    --dads-notification-banner-action-gap: var(--notification-banner-action-gap);
    --dads-notification-banner-dense-action-gap: var(--notification-banner-dense-action-gap);
    --dads-notification-banner-action-color: var(--notification-banner-action-color);
    --dads-notification-banner-action-color-hover: var(--notification-banner-action-color-hover);
    --dads-notification-banner-action-color-active: var(--notification-banner-action-color-active);
    --dads-notification-banner-action-outline-hover-bg: var(--notification-banner-action-outline-hover-bg);
    --dads-notification-banner-action-outline-active-bg: var(--notification-banner-action-outline-active-bg);
    --dads-notification-banner-action-text-color: var(--notification-banner-action-text-color);
  }
`;

export const notificationBannerTokens = css`
  ${notificationBannerSemanticTokensText}
  ${notificationBannerLocalTokensText}
`;
