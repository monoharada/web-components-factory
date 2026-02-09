/**
 * ヘッダーコンテナ用デザイントークン
 */

import { css } from '../../core/web-components.js';

const headerContainerSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --header-container-color: var(--color-neutral-solid-gray-800, #333333);
    --header-container-background: var(--color-neutral-white, #ffffff);
    --header-container-border-color: var(--color-neutral-opacity-gray-200, rgba(0, 0, 0, 0.2));
    --header-container-border-width: 1px;

    --header-container-inline-padding-compact: calc(16 / 16 * 1rem);
    --header-container-inline-padding-medium: calc(24 / 16 * 1rem);
    --header-container-inline-padding-wide: calc(40 / 16 * 1rem);

    --header-container-compact-min-block-size: calc(80 / 16 * 1rem);
    --header-container-medium-min-block-size: calc(96 / 16 * 1rem);
    --header-container-wide-slim-min-block-size: calc(96 / 16 * 1rem);
    --header-container-wide-full-primary-min-block-size: calc(96 / 16 * 1rem);
    --header-container-wide-full-global-min-block-size: calc(64 / 16 * 1rem);

    --header-container-primary-gap-compact: calc(8 / 16 * 1rem);
    --header-container-primary-gap-medium: calc(12 / 16 * 1rem);
    --header-container-primary-gap-wide: calc(16 / 16 * 1rem);

    --header-container-primary-padding-block-compact: calc(8 / 16 * 1rem);
    --header-container-primary-padding-block-medium: calc(12 / 16 * 1rem);
    --header-container-primary-padding-block-wide: calc(16 / 16 * 1rem);

    --header-container-global-menu-padding-block: calc(8 / 16 * 1rem);
    --header-container-wide-slim-gap: calc(24 / 16 * 1rem);

    --header-container-inline-padding-current: var(--header-container-inline-padding-wide);
    --header-container-primary-min-block-size-current: var(--header-container-wide-full-primary-min-block-size);
    --header-container-global-menu-min-block-size-current: var(--header-container-wide-full-global-min-block-size);
    --header-container-primary-gap-current: var(--header-container-primary-gap-wide);
    --header-container-primary-padding-block-current: var(--header-container-primary-padding-block-wide);
  }

  :host([data-effective-mode='wide-full']) {
    --header-container-inline-padding-current: var(--header-container-inline-padding-wide);
    --header-container-primary-min-block-size-current: var(--header-container-wide-full-primary-min-block-size);
    --header-container-global-menu-min-block-size-current: var(--header-container-wide-full-global-min-block-size);
    --header-container-primary-gap-current: var(--header-container-primary-gap-wide);
    --header-container-primary-padding-block-current: var(--header-container-primary-padding-block-wide);
  }

  :host([data-effective-mode='wide-slim']) {
    --header-container-inline-padding-current: var(--header-container-inline-padding-wide);
    --header-container-primary-min-block-size-current: var(--header-container-wide-slim-min-block-size);
    --header-container-global-menu-min-block-size-current: auto;
    --header-container-primary-gap-current: var(--header-container-primary-gap-wide);
    --header-container-primary-padding-block-current: 0;
  }

  :host([data-effective-mode='medium']) {
    --header-container-inline-padding-current: var(--header-container-inline-padding-medium);
    --header-container-primary-min-block-size-current: var(--header-container-medium-min-block-size);
    --header-container-global-menu-min-block-size-current: auto;
    --header-container-primary-gap-current: var(--header-container-primary-gap-medium);
    --header-container-primary-padding-block-current: var(--header-container-primary-padding-block-medium);
  }

  :host([data-effective-mode='compact']) {
    --header-container-inline-padding-current: var(--header-container-inline-padding-compact);
    --header-container-primary-min-block-size-current: var(--header-container-compact-min-block-size);
    --header-container-global-menu-min-block-size-current: auto;
    --header-container-primary-gap-current: var(--header-container-primary-gap-compact);
    --header-container-primary-padding-block-current: var(--header-container-primary-padding-block-compact);
  }
`;

const headerContainerLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-header-container-color: var(--header-container-color);
    --dads-header-container-background: var(--header-container-background);
    --dads-header-container-border-color: var(--header-container-border-color);
    --dads-header-container-border-width: var(--header-container-border-width);

    --dads-header-container-inline-padding: var(--header-container-inline-padding-current);
    --dads-header-container-primary-min-block-size: var(--header-container-primary-min-block-size-current);
    --dads-header-container-global-menu-min-block-size: var(--header-container-global-menu-min-block-size-current);
    --dads-header-container-primary-gap: var(--header-container-primary-gap-current);
    --dads-header-container-primary-padding-block: var(--header-container-primary-padding-block-current);
    --dads-header-container-global-menu-padding-block: var(--header-container-global-menu-padding-block);
    --dads-header-container-wide-slim-gap: var(--header-container-wide-slim-gap);
  }
`;

export const headerContainerSemanticTokens = css`${headerContainerSemanticTokensText}`;
export const headerContainerLocalTokens = css`${headerContainerLocalTokensText}`;

export const headerContainerTokens = css`
  ${headerContainerSemanticTokensText}
  ${headerContainerLocalTokensText}
`;
