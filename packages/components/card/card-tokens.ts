/**
 * カードコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * カードセマンティックトークン（意味的な値）
 */
const cardSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* Container */
    --card-bg: var(--color-neutral-white, #ffffff);
    --card-border-color: var(--color-neutral-solid-gray-420, #949494);
    --card-border-width: 1px;
    --card-border-radius: var(--border-radius-16, 1rem);

    /* Divider (between areas) */
    --card-divider-color: var(--color-neutral-solid-gray-420, #949494);
    --card-divider-width: 1px;

    /* Layout */
    --card-media-width: calc(352 / 16 * 1rem);
    --card-media-aspect-ratio: auto;

    /* Spacing */
    --card-padding-block: var(--spacing-4, 1rem);
    --card-padding-inline: var(--spacing-6, 1.5rem);
    --card-gap: var(--spacing-4, 1rem);

    /* Typography */
    --card-text-color: var(--color-neutral-solid-gray-800, #333333);
    --card-title-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --card-title-font-size: var(--font-size-20, 1.25rem);
    --card-title-font-weight: var(--font-weight-700, 700);
    --card-title-line-height: 1.5;
  }
`;

/**
 * カードローカルコンポーネントトークン（外部公開API）
 */
const cardLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* Container */
    --dads-card-background: var(--card-bg);
    --dads-card-border-color: var(--card-border-color);
    --dads-card-border-width: var(--card-border-width);
    --dads-card-border-radius: var(--card-border-radius);

    /* Divider */
    --dads-card-divider-color: var(--card-divider-color);
    --dads-card-divider-width: var(--card-divider-width);

    /* Layout */
    --dads-card-media-width: var(--card-media-width);
    --dads-card-media-aspect-ratio: var(--card-media-aspect-ratio);

    /* Spacing */
    --dads-card-padding-block: var(--card-padding-block);
    --dads-card-padding-inline: var(--card-padding-inline);
    --dads-card-gap: var(--card-gap);

    /* Typography */
    --dads-card-color: var(--card-text-color);
    --dads-card-title-color: var(--card-title-color);
    --dads-card-title-font-size: var(--card-title-font-size);
    --dads-card-title-font-weight: var(--card-title-font-weight);
    --dads-card-title-line-height: var(--card-title-line-height);

    /* Title underline (DADS: when clickable) */
    --dads-card-title-underline-offset: calc(3 / 16 * 1rem);
    --dads-card-title-underline-thickness: calc(1 / 16 * 1rem);
    --dads-card-title-underline-thickness-hover: calc(3 / 16 * 1rem);

    /* Focus (uses shared focus tokens; values provided by applyDADSFocusStyles) */
    --dads-card-focus-outline-color: var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    --dads-card-focus-outline-width: var(--dads-focus-outline-width, .25rem);
    --dads-card-focus-outline-offset: var(--dads-focus-outline-offset, .125rem);
    --dads-card-focus-ring-color: var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    --dads-card-focus-ring-width: var(--dads-focus-ring-width, .125rem);
  }
`;

export const cardTokens = css`
  ${cardSemanticTokensText}
  ${cardLocalTokensText}
`;

