/**
 * カルーセルコンポーネント用デザイントークン
 * DADS Carousel（HTML実装）準拠の値を Web Components 向けに整理
 */
import { css } from '../../core/web-components.js';

const carouselSemanticTokensText = `
  :host {
    /* color */
    --carousel-text-color: var(--color-neutral-solid-gray-800);
    --carousel-surface-color: var(--color-neutral-white);
    --carousel-border-color: var(--color-neutral-solid-gray-420);
    --carousel-line-color: var(--color-neutral-solid-gray-800);
    --carousel-link-hover-color: var(--color-primitive-blue-900);
    --carousel-link-color: var(--color-primitive-blue-1000);
    --carousel-all-slides-icon-color: var(--color-primitive-blue-1000);
    --carousel-focus-outline-color: var(--color-neutral-black);
    --carousel-focus-ring-color: var(--color-primitive-yellow-300);

    --carousel-bg-soft-light-color: var(--color-neutral-white);
    --carousel-bg-blur-size: calc(25 / 16 * 1rem);

    /* typography */
    --carousel-font-family: var(--font-family-sans);
    --carousel-font-size: calc(16 / 16 * 1rem);
    --carousel-font-size-heading-sm: calc(24 / 16 * 1rem);
    --carousel-font-size-heading-lg: calc(32 / 16 * 1rem);
    --carousel-font-size-heading-default: calc(20 / 16 * 1rem);
    --carousel-font-weight-normal: var(--font-weight-400);
    --carousel-font-weight-bold: var(--font-weight-700);
    --carousel-letter-spacing: 0.02em;

    /* layout */
    --carousel-max-width-container: calc(1024 / 16 * 1rem);
    --carousel-max-width-key-visual: 100%;
    --carousel-side-padding: calc(48 / 16 * 1rem);

    --carousel-panel-grid-side: calc(48 / 16 * 1rem);
    --carousel-main-ratio-container: calc(696 / 392);
    --carousel-main-ratio-key-visual: calc(1008 / 392);
    --carousel-next-ratio: calc(336 / 392);

    --carousel-number-size: calc(32 / 16 * 1rem);
    --carousel-number-font-size: calc(16 / 16 * 1rem);
    --carousel-control-gap-mobile: calc(20 / 16 * 1rem);
    --carousel-control-gap-desktop: calc(32 / 16 * 1rem);
    --carousel-control-padding-block: calc(12 / 16 * 1rem);
    --carousel-control-padding-bottom-expanded: calc(56 / 16 * 1rem);

    --carousel-step-gap: calc(16 / 16 * 1rem);
    --carousel-page-nav-gap: calc(12 / 16 * 1rem);
    --carousel-hit-area: calc(44 / 16 * 1rem);
    --carousel-page-button-size: calc(24 / 16 * 1rem);

    --carousel-next-padding: calc(24 / 16 * 1rem);
    --carousel-next-label-padding: calc(16 / 16 * 1rem);
    --carousel-next-label-font-size: calc(16 / 16 * 1rem);

    --carousel-summary-padding-block: calc(8 / 16 * 1rem);
    --carousel-summary-padding-inline: calc(12 / 16 * 1rem);
    --carousel-all-slides-margin-top: calc(48 / 16 * 1rem);
    --carousel-all-slides-content-margin-top: calc(12 / 16 * 1rem);
    --carousel-all-slides-row-gap: calc(24 / 16 * 1rem);
    --carousel-all-slides-extra-gap: calc(12 / 16 * 1rem);

    --carousel-border-width: 1px;
    --carousel-image-outline-width: 2px;
    --carousel-focus-outline-width: calc(4 / 16 * 1rem);
    --carousel-focus-ring-width: calc(2 / 16 * 1rem);
    --carousel-focus-outline-offset-inner: calc(-2 / 16 * 1rem);
    --carousel-focus-outline-offset-outer: calc(2 / 16 * 1rem);

    --carousel-radius-sm: calc(4 / 16 * 1rem);
    --carousel-radius-md: calc(6 / 16 * 1rem);
    --carousel-radius-lg: calc(8 / 16 * 1rem);
  }
`;

const carouselLocalTokensText = `
  :host {
    --dads-carousel-text-color: var(--carousel-text-color);
    --dads-carousel-surface-color: var(--carousel-surface-color);
    --dads-carousel-border-color: var(--carousel-border-color);
    --dads-carousel-line-color: var(--carousel-line-color);
    --dads-carousel-link-hover-color: var(--carousel-link-hover-color);
    --dads-carousel-link-color: var(--carousel-link-color);
    --dads-carousel-all-slides-icon-color: var(--carousel-all-slides-icon-color);
    --dads-carousel-focus-outline-color: var(--carousel-focus-outline-color);
    --dads-carousel-focus-ring-color: var(--carousel-focus-ring-color);
    --dads-carousel-bg-soft-light-color: var(--carousel-bg-soft-light-color);
    --dads-carousel-bg-blur-size: var(--carousel-bg-blur-size);

    --dads-carousel-font-family: var(--carousel-font-family);
    --dads-carousel-font-size: var(--carousel-font-size);
    --dads-carousel-font-size-heading-sm: var(--carousel-font-size-heading-sm);
    --dads-carousel-font-size-heading-lg: var(--carousel-font-size-heading-lg);
    --dads-carousel-font-size-heading-default: var(--carousel-font-size-heading-default);
    --dads-carousel-font-weight-normal: var(--carousel-font-weight-normal);
    --dads-carousel-font-weight-bold: var(--carousel-font-weight-bold);
    --dads-carousel-letter-spacing: var(--carousel-letter-spacing);

    --dads-carousel-max-width: var(--carousel-max-width-container);
    --dads-carousel-max-width-key-visual: var(--carousel-max-width-key-visual);
    --dads-carousel-side-padding: var(--carousel-side-padding);
    --dads-carousel-panel-grid-side: var(--carousel-panel-grid-side);
    --dads-carousel-main-ratio: var(--carousel-main-ratio-container);
    --dads-carousel-main-ratio-key-visual: var(--carousel-main-ratio-key-visual);
    --dads-carousel-next-ratio: var(--carousel-next-ratio);

    --dads-carousel-number-size: var(--carousel-number-size);
    --dads-carousel-number-font-size: var(--carousel-number-font-size);
    --dads-carousel-control-gap-mobile: var(--carousel-control-gap-mobile);
    --dads-carousel-control-gap-desktop: var(--carousel-control-gap-desktop);
    --dads-carousel-control-padding-block: var(--carousel-control-padding-block);
    --dads-carousel-control-padding-bottom-expanded: var(--carousel-control-padding-bottom-expanded);

    --dads-carousel-step-gap: var(--carousel-step-gap);
    --dads-carousel-page-nav-gap: var(--carousel-page-nav-gap);
    --dads-carousel-hit-area: var(--carousel-hit-area);
    --dads-carousel-page-button-size: var(--carousel-page-button-size);
    --dads-carousel-next-padding: var(--carousel-next-padding);
    --dads-carousel-next-label-padding: var(--carousel-next-label-padding);
    --dads-carousel-next-label-font-size: var(--carousel-next-label-font-size);

    --dads-carousel-summary-padding-block: var(--carousel-summary-padding-block);
    --dads-carousel-summary-padding-inline: var(--carousel-summary-padding-inline);
    --dads-carousel-all-slides-margin-top: var(--carousel-all-slides-margin-top);
    --dads-carousel-all-slides-content-margin-top: var(--carousel-all-slides-content-margin-top);
    --dads-carousel-all-slides-row-gap: var(--carousel-all-slides-row-gap);
    --dads-carousel-all-slides-extra-gap: var(--carousel-all-slides-extra-gap);

    --dads-carousel-border-width: var(--carousel-border-width);
    --dads-carousel-image-outline-width: var(--carousel-image-outline-width);
    --dads-carousel-focus-outline-width: var(--carousel-focus-outline-width);
    --dads-carousel-focus-ring-width: var(--carousel-focus-ring-width);
    --dads-carousel-focus-outline-offset-inner: var(--carousel-focus-outline-offset-inner);
    --dads-carousel-focus-outline-offset-outer: var(--carousel-focus-outline-offset-outer);
    --dads-carousel-radius-sm: var(--carousel-radius-sm);
    --dads-carousel-radius-md: var(--carousel-radius-md);
    --dads-carousel-radius-lg: var(--carousel-radius-lg);
  }

  :host([type="key-visual"]:not([image-slider])) {
    --dads-carousel-max-width: var(--dads-carousel-max-width-key-visual);
    --dads-carousel-main-ratio: var(--dads-carousel-main-ratio-key-visual);
  }
`;

export const carouselSemanticTokens = css`${carouselSemanticTokensText}`;
export const carouselLocalTokens = css`${carouselLocalTokensText}`;

export const carouselTokens = css`
  ${carouselSemanticTokensText}
  ${carouselLocalTokensText}
`;
