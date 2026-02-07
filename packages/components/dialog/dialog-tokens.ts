/**
 * Dialogコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 */

import { css } from '../../core/web-components.js';

const dialogSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --dialog-background: var(--color-neutral-white, #ffffff);
    --dialog-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --dialog-border-color: var(--color-neutral-solid-gray-536, #767676);
    --dialog-border-width: 1px;
    --dialog-border-radius: var(--border-radius-12, 0.75rem);

    --dialog-width-s: calc(480 / 16 * 1rem);
    --dialog-width-m: calc(640 / 16 * 1rem);
    --dialog-width-l: calc(800 / 16 * 1rem);
    --dialog-width: var(--dialog-width-m);
    --dialog-max-height: calc(100dvh - var(--spacing-10, 2.5rem));
    --dialog-viewport-padding: var(--spacing-4, 1rem);
    --dialog-padding-inline: var(--spacing-6, 1.5rem);
    --dialog-padding-block: var(--spacing-6, 1.5rem);
    --dialog-gap: var(--spacing-5, 1.25rem);
    --dialog-header-gap: var(--spacing-4, 1rem);
    --dialog-footer-gap: var(--spacing-3, 0.75rem);

    --dialog-title-size: var(--font-size-24, 1.5rem);
    --dialog-title-line-height: var(--line-height-140, 1.4);

    --dialog-close-button-size: calc(44 / 16 * 1rem);
    --dialog-close-button-padding: var(--spacing-2, 0.5rem);
    --dialog-close-button-border-radius: var(--border-radius-8, 0.5rem);
    --dialog-close-button-border-color: var(--color-neutral-solid-gray-536, #767676);
    --dialog-close-button-hover-background: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* 要件: backdrop は gray-100 */
    --dialog-backdrop-background: var(--color-neutral-opacity-gray-100, rgba(0, 0, 0, 0.1));
  }
`;

const dialogLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-dialog-background: var(--dialog-background);
    --dads-dialog-color: var(--dialog-color);
    --dads-dialog-border-color: var(--dialog-border-color);
    --dads-dialog-border-width: var(--dialog-border-width);
    --dads-dialog-border-radius: var(--dialog-border-radius);

    --dads-dialog-width: var(--dialog-width);
    --dads-dialog-max-height: var(--dialog-max-height);
    --dads-dialog-viewport-padding: var(--dialog-viewport-padding);
    --dads-dialog-padding-inline: var(--dialog-padding-inline);
    --dads-dialog-padding-block: var(--dialog-padding-block);
    --dads-dialog-gap: var(--dialog-gap);
    --dads-dialog-header-gap: var(--dialog-header-gap);
    --dads-dialog-footer-gap: var(--dialog-footer-gap);

    --dads-dialog-title-size: var(--dialog-title-size);
    --dads-dialog-title-line-height: var(--dialog-title-line-height);

    --dads-dialog-close-button-size: var(--dialog-close-button-size);
    --dads-dialog-close-button-padding: var(--dialog-close-button-padding);
    --dads-dialog-close-button-border-radius: var(--dialog-close-button-border-radius);
    --dads-dialog-close-button-border-color: var(--dialog-close-button-border-color);
    --dads-dialog-close-button-hover-background: var(--dialog-close-button-hover-background);

    --dads-dialog-backdrop-background: var(--dialog-backdrop-background);
  }

  :host([size="s"]),
  :host([size="sm"]) {
    --dialog-width: var(--dialog-width-s);
  }

  :host([size="m"]),
  :host([size="md"]) {
    --dialog-width: var(--dialog-width-m);
  }

  :host([size="l"]),
  :host([size="lg"]) {
    --dialog-width: var(--dialog-width-l);
  }
`;

export const dialogSemanticTokens = css`${dialogSemanticTokensText}`;
export const dialogLocalTokens = css`${dialogLocalTokensText}`;

export const dialogTokens = css`
  ${dialogSemanticTokensText}
  ${dialogLocalTokensText}
`;
