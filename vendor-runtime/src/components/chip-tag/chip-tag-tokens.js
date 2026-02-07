/**
 * チップタグコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 */
import { css } from '../../core/web-components.js';
const chipTagSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --chip-tag-bg: var(--color-primitive-blue-50, #e8f1fe);
    --chip-tag-border-color: var(--color-primitive-blue-900, #0017c1);
    --chip-tag-text-color: var(--color-primitive-blue-900, #0017c1);
    --chip-tag-text-color-hover: var(--color-primitive-blue-1000, #00118f);
    --chip-tag-text-color-active: var(--color-primitive-blue-1200, #000060);

    /* ========== Typography ========== */
    --chip-tag-font-family: var(--font-family-sans);
    --chip-tag-font-size: var(--font-size-16, 1rem);
    --chip-tag-font-weight: var(--font-weight-400, 400);
    --chip-tag-line-height: 1;
    --chip-tag-letter-spacing: 0.02em;

    /* ========== Layout ========== */
    --chip-tag-min-height: var(--spacing-8, 2rem);
    --chip-tag-padding-block: var(--spacing-1, 0.25rem);
    --chip-tag-padding-inline: var(--spacing-2, 0.5rem);
    --chip-tag-label-padding-inline: var(--spacing-2, 0.5rem);
    --chip-tag-label-padding-bottom: var(--spacing-0-5, 0.125rem);
    --chip-tag-label-text-decoration: none;
    --chip-tag-label-underline-thickness: calc(1 / 16 * 1rem);
    --chip-tag-label-underline-thickness-hover: calc(2 / 16 * 1rem);
    --chip-tag-label-underline-offset: calc(3 / 16 * 1rem);

    --chip-tag-icon-size: var(--spacing-6, 1.5rem);
    --chip-tag-border-radius: var(--border-radius-full, 624.9375rem);
    --chip-tag-border-width: 1px;
    --chip-tag-border-shadow: none;
    --chip-tag-border-shadow-hover: 0 0 0 1px var(--chip-tag-border-color);

    /* ========== Action ========== */
    --chip-tag-action-size: var(--spacing-6, 1.5rem);
    --chip-tag-action-border-width: 1px;
    --chip-tag-action-border-color: var(--chip-tag-border-color);
    --chip-tag-action-background: transparent;
    --chip-tag-action-icon-color: var(--chip-tag-text-color);
    --chip-tag-action-hit-area: calc(var(--spacing-10, 2.5rem) + var(--spacing-1, 0.25rem));
    --chip-tag-action-icon-size: var(--spacing-6, 1.5rem);
    --chip-tag-action-background-hover: var(--color-primitive-blue-1000, #00118f);
    --chip-tag-action-icon-color-hover: var(--color-neutral-white, #fff);
    --chip-tag-action-background-active: var(--color-primitive-blue-1200, #000060);
    --chip-tag-action-icon-color-active: var(--color-neutral-white, #fff);
  }

  :host([size="sm"]) {
    --chip-tag-min-height: calc(var(--spacing-6, 1.5rem) + var(--spacing-1, 0.25rem));
    --chip-tag-padding-block: var(--spacing-0-5, 0.125rem);
    --chip-tag-padding-inline: var(--spacing-1-5, 0.375rem);
    --chip-tag-label-padding-inline: var(--spacing-1-5, 0.375rem);
    --chip-tag-font-size: var(--font-size-14, 0.875rem);
    --chip-tag-icon-size: var(--spacing-5, 1.25rem);
    --chip-tag-label-padding-bottom: calc(var(--spacing-0-5, 0.125rem) / 2);
  }

  :host([size="lg"]) {
    --chip-tag-min-height: calc(var(--spacing-8, 2rem) + var(--spacing-1, 0.25rem));
    --chip-tag-padding-inline: var(--spacing-2-5, 0.625rem);
    --chip-tag-label-padding-inline: var(--spacing-2-5, 0.625rem);
    --chip-tag-font-size: var(--font-size-18, 1.125rem);
  }
`;
const chipTagLocalTokensText = `
  :host {
    /* ========== Layout ========== */
    --dads-chip-tag-min-height: var(--chip-tag-min-height);
    --dads-chip-tag-padding-block: var(--chip-tag-padding-block);
    --dads-chip-tag-padding-inline: var(--chip-tag-padding-inline);
    --dads-chip-tag-label-padding-inline: var(--chip-tag-label-padding-inline);
    --dads-chip-tag-label-padding-bottom: var(--chip-tag-label-padding-bottom);
    --dads-chip-tag-label-text-decoration: var(--chip-tag-label-text-decoration);
    --dads-chip-tag-label-underline-thickness: var(--chip-tag-label-underline-thickness);
    --dads-chip-tag-label-underline-thickness-hover: var(
      --chip-tag-label-underline-thickness-hover
    );
    --dads-chip-tag-label-underline-offset: var(--chip-tag-label-underline-offset);
    --dads-chip-tag-icon-size: var(--chip-tag-icon-size);
    --dads-chip-tag-border-radius: var(--chip-tag-border-radius);
    --dads-chip-tag-border-width: var(--chip-tag-border-width);
    --dads-chip-tag-border-shadow: var(--chip-tag-border-shadow);
    --dads-chip-tag-border-shadow-hover: var(--chip-tag-border-shadow-hover);

    /* ========== Color ========== */
    --dads-chip-tag-background: var(--chip-tag-bg);
    --dads-chip-tag-border-color: var(--chip-tag-border-color);
    --dads-chip-tag-text-color: var(--chip-tag-text-color);
    --dads-chip-tag-text-color-hover: var(--chip-tag-text-color-hover);
    --dads-chip-tag-text-color-active: var(--chip-tag-text-color-active);

    /* ========== Typography ========== */
    --dads-chip-tag-font-family: var(--chip-tag-font-family);
    --dads-chip-tag-font-size: var(--chip-tag-font-size);
    --dads-chip-tag-font-weight: var(--chip-tag-font-weight);
    --dads-chip-tag-line-height: var(--chip-tag-line-height);
    --dads-chip-tag-letter-spacing: var(--chip-tag-letter-spacing);

    /* ========== Focus (action button) ========== */
    --dads-chip-tag-focus-text-element-bg: transparent;

    /* ========== Action ========== */
    --dads-chip-tag-action-size: var(--chip-tag-action-size);
    --dads-chip-tag-action-border-width: var(--chip-tag-action-border-width);
    --dads-chip-tag-action-border-color: var(--chip-tag-action-border-color);
    --dads-chip-tag-action-background: var(--chip-tag-action-background);
    --dads-chip-tag-action-icon-color: var(--chip-tag-action-icon-color);
    --dads-chip-tag-action-hit-area: var(--chip-tag-action-hit-area);
    --dads-chip-tag-action-icon-size: var(--chip-tag-action-icon-size);
    --dads-chip-tag-action-background-hover: var(--chip-tag-action-background-hover);
    --dads-chip-tag-action-icon-color-hover: var(--chip-tag-action-icon-color-hover);
    --dads-chip-tag-action-background-active: var(--chip-tag-action-background-active);
    --dads-chip-tag-action-icon-color-active: var(--chip-tag-action-icon-color-active);
  }
`;
export const chipTagTokens = css `
  ${chipTagSemanticTokensText}
  ${chipTagLocalTokensText}
`;
