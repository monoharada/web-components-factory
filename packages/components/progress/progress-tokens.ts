/**
 * Progress tokens (semantic + local override API)
 */
import { css } from '../../core/web-components.js';

const progressSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --progress-track-color: var(--color-neutral-solid-gray-100, #e6e6e6);
    --progress-fill-color: var(--color-primary, #00118f);
    --progress-label-color: var(--color-neutral-solid-gray-800, #333333);
    --progress-value-color: var(--color-neutral-solid-gray-700, #4d4d4d);

    /* ========== Layout ========== */
    --progress-height-sm: calc(6 / 16 * 1rem);
    --progress-height-md: calc(10 / 16 * 1rem);
    --progress-height-lg: calc(14 / 16 * 1rem);
    --progress-radius: var(--border-radius-full, 9999px);

    --progress-circular-size-sm: calc(40 / 16 * 1rem);
    --progress-circular-size-md: calc(56 / 16 * 1rem);
    --progress-circular-size-lg: calc(72 / 16 * 1rem);
    --progress-circular-stroke-width-sm: calc(4 / 16 * 1rem);
    --progress-circular-stroke-width-md: calc(6 / 16 * 1rem);
    --progress-circular-stroke-width-lg: calc(8 / 16 * 1rem);

    --progress-segment-gap: calc(4 / 16 * 1rem);
    --progress-label-gap: calc(8 / 16 * 1rem);

    /* ========== Motion ========== */
    --progress-animation-duration: 1.2s;
  }
`;

const progressLocalTokensText = `
  :host {
    --dads-progress-track-color: var(--progress-track-color);
    --dads-progress-fill-color: var(--progress-fill-color);
    --dads-progress-height: var(--progress-height-md);
    --dads-progress-radius: var(--progress-radius);
    --dads-progress-size: var(--progress-circular-size-md);
    --dads-progress-stroke-width: var(--progress-circular-stroke-width-md);
    --dads-progress-segment-gap: var(--progress-segment-gap);
    --dads-progress-animation-duration: var(--progress-animation-duration);
    --dads-progress-label-color: var(--progress-label-color);
    --dads-progress-value-color: var(--progress-value-color);
  }

  :host([size="sm"]) {
    --dads-progress-height: var(--progress-height-sm);
    --dads-progress-size: var(--progress-circular-size-sm);
    --dads-progress-stroke-width: var(--progress-circular-stroke-width-sm);
  }

  :host([size="lg"]) {
    --dads-progress-height: var(--progress-height-lg);
    --dads-progress-size: var(--progress-circular-size-lg);
    --dads-progress-stroke-width: var(--progress-circular-stroke-width-lg);
  }
`;

export const progressSemanticTokens = css`${progressSemanticTokensText}`;
export const progressLocalTokens = css`${progressLocalTokensText}`;

export const progressTokens = css`
  ${progressSemanticTokensText}
  ${progressLocalTokensText}
`;
