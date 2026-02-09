/**
 * デバイスモック用デザイントークン
 */

import { css } from '../../core/web-components.js';

const deviceMockSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --device-mock-frame-width-desktop: calc(1454 / 16 * 1rem);
    --device-mock-aspect-ratio-desktop: 1454 / 1038;
    --device-mock-screen-inset-desktop: calc(7 / 16 * 1rem);
    --device-mock-screen-radius-desktop: calc(8 / 16 * 1rem);
    --device-mock-safe-area-top-desktop: 0;
    --device-mock-frame-stroke-width-desktop: 7;

    --device-mock-frame-width-tablet: calc(782 / 16 * 1rem);
    --device-mock-aspect-ratio-tablet: 782 / 1038;
    --device-mock-screen-inset-tablet: calc(7 / 16 * 1rem);
    --device-mock-screen-radius-tablet: calc(16 / 16 * 1rem);
    --device-mock-safe-area-top-tablet: 0;
    --device-mock-frame-stroke-width-tablet: 7;

    --device-mock-frame-width-mobile: calc(405 / 16 * 1rem);
    --device-mock-aspect-ratio-mobile: 405 / 864;
    --device-mock-screen-inset-mobile: calc(6 / 16 * 1rem);
    --device-mock-screen-radius-mobile: calc(24 / 16 * 1rem);
    --device-mock-safe-area-top-mobile: calc(44 / 16 * 1rem);
    --device-mock-frame-stroke-width-mobile: 6;

    --device-mock-frame-width-current: var(--device-mock-frame-width-mobile);
    --device-mock-aspect-ratio-current: var(--device-mock-aspect-ratio-mobile);
    --device-mock-screen-inset-current: var(--device-mock-screen-inset-mobile);
    --device-mock-screen-radius-current: var(--device-mock-screen-radius-mobile);
    --device-mock-safe-area-top-current: var(--device-mock-safe-area-top-mobile);
    --device-mock-frame-stroke-width-current: var(--device-mock-frame-stroke-width-mobile);

    --device-mock-screen-background: #f5f5f5;
    --device-mock-frame-stroke-color: #000;
  }

  :host([device='desktop']) {
    --device-mock-frame-width-current: var(--device-mock-frame-width-desktop);
    --device-mock-aspect-ratio-current: var(--device-mock-aspect-ratio-desktop);
    --device-mock-screen-inset-current: var(--device-mock-screen-inset-desktop);
    --device-mock-screen-radius-current: var(--device-mock-screen-radius-desktop);
    --device-mock-safe-area-top-current: var(--device-mock-safe-area-top-desktop);
    --device-mock-frame-stroke-width-current: var(--device-mock-frame-stroke-width-desktop);
  }

  :host([device='tablet']) {
    --device-mock-frame-width-current: var(--device-mock-frame-width-tablet);
    --device-mock-aspect-ratio-current: var(--device-mock-aspect-ratio-tablet);
    --device-mock-screen-inset-current: var(--device-mock-screen-inset-tablet);
    --device-mock-screen-radius-current: var(--device-mock-screen-radius-tablet);
    --device-mock-safe-area-top-current: var(--device-mock-safe-area-top-tablet);
    --device-mock-frame-stroke-width-current: var(--device-mock-frame-stroke-width-tablet);
  }

  :host([device='mobile']) {
    --device-mock-frame-width-current: var(--device-mock-frame-width-mobile);
    --device-mock-aspect-ratio-current: var(--device-mock-aspect-ratio-mobile);
    --device-mock-screen-inset-current: var(--device-mock-screen-inset-mobile);
    --device-mock-screen-radius-current: var(--device-mock-screen-radius-mobile);
    --device-mock-safe-area-top-current: var(--device-mock-safe-area-top-mobile);
    --device-mock-frame-stroke-width-current: var(--device-mock-frame-stroke-width-mobile);
  }
`;

const deviceMockLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-device-mock-frame-width: var(--device-mock-frame-width-current);
    --dads-device-mock-aspect-ratio: var(--device-mock-aspect-ratio-current);
    --dads-device-mock-screen-inset: var(--device-mock-screen-inset-current);
    --dads-device-mock-screen-radius: var(--device-mock-screen-radius-current);
    --dads-device-mock-safe-area-top: var(--device-mock-safe-area-top-current);
    --dads-device-mock-screen-background: var(--device-mock-screen-background);
    --dads-device-mock-frame-stroke-width: var(--device-mock-frame-stroke-width-current);
    --dads-device-mock-frame-stroke-color: var(--device-mock-frame-stroke-color);
    --dads-device-mock-visible-height: 100%;
  }
`;

export const deviceMockSemanticTokens = css`${deviceMockSemanticTokensText}`;
export const deviceMockLocalTokens = css`${deviceMockLocalTokensText}`;

export const deviceMockTokens = css`
  ${deviceMockSemanticTokensText}
  ${deviceMockLocalTokensText}
`;
