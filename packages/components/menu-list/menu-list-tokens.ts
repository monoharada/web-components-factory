/**
 * Menu List / Menu List Item tokens (DADS準拠)
 */
import { css } from '../../core/web-components.js';

/**
 * セマンティックトークン
 */
const menuListSemanticTokensText = `
  :host {
    /* Typography */
    --menu-list-font-family: var(--font-family-sans);
    --menu-list-font-size: var(--font-size-16, 1rem);
    --menu-list-letter-spacing: 0;

    /* Colors */
    --menu-list-color: var(--color-neutral-solid-gray-800, #333333);
    --menu-list-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* Current */
    --menu-list-current-bg: var(--color-primitive-blue-100, #d9e6ff);
    --menu-list-current-color: var(--color-primitive-blue-1000, #00118f);
    --menu-list-current-parent-bg: var(--color-primitive-blue-50, #e7efff);
    --menu-list-current-hover-bg: var(--color-primitive-blue-50, #e7efff);
    --menu-list-current-hover-color: var(--color-primitive-blue-900, #001073);

    /* Layout */
    --menu-list-gap: var(--spacing-2, 0.5rem);
    --menu-list-padding-x: var(--spacing-4, 1rem);
    --menu-list-padding-y-regular: var(--spacing-2-5, 0.625rem); /* 10px */
    --menu-list-padding-y-small: var(--spacing-1-5, 0.375rem); /* 6px */
    --menu-list-min-height-regular: var(--spacing-11, 2.75rem); /* 44px */
    --menu-list-min-height-small: var(--spacing-9, 2.25rem); /* 36px */
    --menu-list-line-height-regular: var(--line-height-130, 1.3);
    --menu-list-line-height-small: var(--line-height-120, 1.2);

    /* Shape */
    --menu-list-border-radius-regular: var(--border-radius-8, 0.5rem);
    --menu-list-border-radius-small: var(--border-radius-4, 0.25rem);

    /* Decoration */
    --menu-list-text-decoration-thickness: calc(1 / 16 * 1rem);
    --menu-list-underline-offset: calc(3 / 16 * 1rem);

    /* End icon layout */
    --menu-list-end-icon-margin-top: calc(2 / 16 * 1rem);
    --menu-list-end-icon-margin-right: calc(-4 / 16 * 1rem);

    /* Start icon layout */
    --menu-list-start-icon-size: calc(20 / 16 * 1rem);
    --menu-list-start-icon-display-empty: none;
  }
`;

/**
 * ローカルトークン（コンポーネントAPI）
 */
const menuListLocalTokensText = `
  :host {
    /* List */
    --dads-menu-list-font-family: var(--menu-list-font-family);
    --dads-menu-list-font-size: var(--menu-list-font-size);
    --dads-menu-list-letter-spacing: var(--menu-list-letter-spacing);
    --dads-menu-list-color: var(--menu-list-color);

    /* Indentation (DADS互換: --menu-list-indentation) */
    --dads-menu-list-indentation: var(--menu-list-indentation, 0);

    /* Item */
    --dads-menu-list-item-gap: var(--menu-list-gap);
    --dads-menu-list-item-padding-x: var(--menu-list-padding-x);
    --dads-menu-list-item-padding-y: var(--menu-list-padding-y-regular);
    --dads-menu-list-item-min-height: var(--menu-list-min-height-regular);
    --dads-menu-list-item-line-height: var(--menu-list-line-height-regular);
    --dads-menu-list-item-border-radius: var(--menu-list-border-radius-regular);

    --dads-menu-list-item-background: transparent;
    --dads-menu-list-item-color: var(--dads-menu-list-color);
    --dads-menu-list-item-font-weight: var(--font-weight-400, 400);

    /* States */
    --dads-menu-list-item-hover-background: var(--menu-list-hover-bg);
    --dads-menu-list-item-current-background: var(--menu-list-current-bg);
    --dads-menu-list-item-current-color: var(--menu-list-current-color);
    --dads-menu-list-item-current-parent-background: var(--menu-list-current-parent-bg);
    --dads-menu-list-item-current-hover-background: var(--menu-list-current-hover-bg);
    --dads-menu-list-item-current-hover-color: var(--menu-list-current-hover-color);

    /* Decorations */
    --dads-menu-list-item-text-decoration-thickness: var(--menu-list-text-decoration-thickness);
    --dads-menu-list-item-underline-offset: var(--menu-list-underline-offset);

    /* Focus */
    --dads-menu-list-item-focus-outline-color: var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    --dads-menu-list-item-focus-ring-color: var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    --dads-menu-list-item-focus-outline-width: var(--dads-focus-outline-width, 0.25rem);
    --dads-menu-list-item-focus-ring-width: var(--dads-focus-ring-width, 0.125rem);
    --dads-menu-list-item-focus-outline-offset-standard: var(--dads-focus-outline-offset, 0.125rem);
    --dads-menu-list-item-focus-outline-offset-box: calc(var(--dads-focus-outline-width, 0.25rem) * -1);
    --dads-menu-list-item-focus-box-inset-width: calc(6 / 16 * 1rem);

    /* End icon layout */
    --dads-menu-list-item-end-icon-margin-top: var(--menu-list-end-icon-margin-top);
    --dads-menu-list-item-end-icon-margin-right: var(--menu-list-end-icon-margin-right);

    /* Start icon layout */
    --dads-menu-list-item-start-icon-size: var(--menu-list-start-icon-size);
    --dads-menu-list-item-start-icon-display-empty: var(--menu-list-start-icon-display-empty);
  }

  :host([size="small"]) {
    --dads-menu-list-item-padding-y: var(--menu-list-padding-y-small);
    --dads-menu-list-item-min-height: var(--menu-list-min-height-small);
    --dads-menu-list-item-line-height: var(--menu-list-line-height-small);
    --dads-menu-list-item-border-radius: var(--menu-list-border-radius-small);
  }
`;

export const menuListSemanticTokens = css`${menuListSemanticTokensText}`;
export const menuListLocalTokens = css`${menuListLocalTokensText}`;

export const menuListTokens = css`
  ${menuListSemanticTokensText}
  ${menuListLocalTokensText}
`;
