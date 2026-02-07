/**
 * Menu List Box tokens (DADS準拠)
 */
import { css } from '../../core/web-components.js';
/**
 * セマンティックトークン
 */
const menuListBoxSemanticTokensText = `
  :host {
    /* Typography */
    --menu-list-box-font-family: var(--font-family-sans);
    --menu-list-box-font-size: var(--font-size-16, 1rem);
    --menu-list-box-letter-spacing: 0.02em;
    --menu-list-box-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --menu-list-box-line-height: var(--line-height-120, 1.2);

    /* Opener layout */
    --menu-list-box-min-width: auto;
    --menu-list-box-opener-border-radius: var(--border-radius-8, 0.5rem);
    --menu-list-box-opener-padding-y: var(--spacing-1, 0.25rem); /* 4px */
    --menu-list-box-opener-min-height-sm: var(--spacing-9, 2.25rem); /* 36px */
    --menu-list-box-opener-min-height-md: var(--spacing-11, 2.75rem); /* 44px */
    --menu-list-box-opener-padding-x-sm: var(--spacing-1, 0.25rem); /* 4px */
    --menu-list-box-opener-padding-x-md: var(--spacing-4, 1rem); /* 16px */
    --menu-list-box-opener-gap-sm: var(--spacing-1, 0.25rem); /* 4px */
    --menu-list-box-opener-gap-md: var(--spacing-2, 0.5rem); /* 8px */

    /* Opener colors */
    --menu-list-box-opener-hover-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --menu-list-box-opener-filled-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --menu-list-box-opener-filled-hover-bg: var(--color-neutral-solid-gray-100, #e6e6e6);
    --menu-list-box-opener-outlined-border: var(--color-neutral-solid-gray-420, #949494);
    --menu-list-box-opener-outlined-hover-border: var(--color-neutral-black, #000000);

    /* Decoration */
    --menu-list-box-opener-underline-offset: calc(3 / 16 * 1rem);

    /* Icons */
    --menu-list-box-opener-icon-size: calc(20 / 16 * 1rem);
    --menu-list-box-opener-arrow-size: calc(16 / 16 * 1rem);
    --menu-list-box-opener-arrow-margin-top: calc(4 / 16 * 1rem);
    --menu-list-box-opener-arrow-margin-left: 0;

    /* Popup */
    --menu-list-box-popup-min-width: auto;
    --menu-list-box-popup-min-width-scroll: auto;
    --menu-list-box-popup-border: var(--color-neutral-solid-gray-420, #949494);
    --menu-list-box-popup-border-scroll: var(--color-neutral-solid-gray-420, #949494);
    --menu-list-box-popup-background: var(--color-neutral-white, #ffffff);
    --menu-list-box-popup-border-radius: var(--border-radius-8, 0.5rem) 0 0 var(--border-radius-8, 0.5rem);
    --menu-list-box-popup-max-height: calc((16 + 44 * 6.5) / 16 * 1rem);
    --menu-list-box-popup-padding-y: var(--spacing-4, 1rem); /* 16px */
    --menu-list-box-popup-padding-x: 0;
    --menu-list-box-popup-scrollbar-padding-right: calc(17 / 16 * 1rem);
    --menu-list-box-popup-item-divider: none;
    --menu-list-box-popup-item-divider-scroll: none;
  }
`;
/**
 * ローカルトークン（コンポーネントAPI）
 */
const menuListBoxLocalTokensText = `
  :host {
    --dads-menu-list-box-font-family: var(--menu-list-box-font-family);
    --dads-menu-list-box-font-size: var(--menu-list-box-font-size);
    --dads-menu-list-box-letter-spacing: var(--menu-list-box-letter-spacing);
    --dads-menu-list-box-color: var(--menu-list-box-color);
    --dads-menu-list-box-line-height: var(--menu-list-box-line-height);

    /* Opener */
    --dads-menu-list-box-min-width: var(--menu-list-box-min-width);
    --dads-menu-list-box-opener-border-radius: var(--menu-list-box-opener-border-radius);
    --dads-menu-list-box-opener-padding-y: var(--menu-list-box-opener-padding-y);
    --dads-menu-list-box-opener-min-height: var(--menu-list-box-opener-min-height-sm);
    --dads-menu-list-box-opener-padding-x: var(--menu-list-box-opener-padding-x-sm);
    --dads-menu-list-box-opener-gap: var(--menu-list-box-opener-gap-sm);

    --dads-menu-list-box-opener-background: transparent;
    --dads-menu-list-box-opener-border-width: 0;
    --dads-menu-list-box-opener-border-color: transparent;
    --dads-menu-list-box-opener-font-weight: var(--font-weight-400, 400);

    --dads-menu-list-box-opener-hover-background: var(--menu-list-box-opener-hover-bg);
    --dads-menu-list-box-opener-hover-border-color: var(--dads-menu-list-box-opener-border-color);
    --dads-menu-list-box-opener-underline-offset: var(--menu-list-box-opener-underline-offset);

    --dads-menu-list-box-opener-icon-size: var(--menu-list-box-opener-icon-size);
    --dads-menu-list-box-opener-arrow-size: var(--menu-list-box-opener-arrow-size);
    --dads-menu-list-box-opener-arrow-margin-top: var(--menu-list-box-opener-arrow-margin-top);
    --dads-menu-list-box-opener-arrow-margin-left: var(--menu-list-box-opener-arrow-margin-left);

    /* Focus */
    --dads-menu-list-box-opener-focus-outline-color: var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    --dads-menu-list-box-opener-focus-outline-width: var(--dads-focus-outline-width, 0.25rem);
    --dads-menu-list-box-opener-focus-outline-offset: var(--dads-focus-outline-offset, 0.125rem);
    --dads-menu-list-box-opener-focus-ring-color: var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    --dads-menu-list-box-opener-focus-ring-width: var(--dads-focus-ring-width, 0.125rem);
    --dads-menu-list-box-opener-focus-background: var(--dads-focus-text-element-bg, var(--color-primitive-yellow-300, #ffd43d));

    /* Popup */
    --dads-menu-list-box-popup-min-width: var(--menu-list-box-popup-min-width);
    --dads-menu-list-box-popup-min-width-scroll: var(--menu-list-box-popup-min-width-scroll);
    --dads-menu-list-box-popup-border-color: var(--menu-list-box-popup-border);
    --dads-menu-list-box-popup-border-color-scroll: var(--menu-list-box-popup-border-scroll);
    --dads-menu-list-box-popup-background: var(--menu-list-box-popup-background);
    --dads-menu-list-box-popup-border-radius: var(--menu-list-box-popup-border-radius);
    --dads-menu-list-box-popup-max-height: var(--menu-list-box-popup-max-height);
    --dads-menu-list-box-popup-padding-y: var(--menu-list-box-popup-padding-y);
    --dads-menu-list-box-popup-padding-x: var(--menu-list-box-popup-padding-x);
    --dads-menu-list-box-popup-scrollbar-padding-right: var(--menu-list-box-popup-scrollbar-padding-right);
    --dads-menu-list-box-popup-item-divider: var(--menu-list-box-popup-item-divider);
    --dads-menu-list-box-popup-item-divider-scroll: var(--menu-list-box-popup-item-divider-scroll);
    --dads-menu-list-box-popup-shadow: var(--elevation-1);
    /* Dropdown menus need to appear above most page content but below modals */
    --dads-menu-list-box-popup-z-index: 1000;
  }

  :host([size="md"]) {
    --dads-menu-list-box-opener-min-height: var(--menu-list-box-opener-min-height-md);
    --dads-menu-list-box-opener-padding-x: var(--menu-list-box-opener-padding-x-md);
    --dads-menu-list-box-opener-gap: var(--menu-list-box-opener-gap-md);
  }

  :host([variant="outlined"]) {
    --dads-menu-list-box-opener-border-width: 1px;
    --dads-menu-list-box-opener-border-color: var(--menu-list-box-opener-outlined-border);
    --dads-menu-list-box-opener-hover-border-color: var(--menu-list-box-opener-outlined-hover-border);
  }

  :host([variant="filled"]) {
    --dads-menu-list-box-opener-background: var(--menu-list-box-opener-filled-bg);
    --dads-menu-list-box-opener-hover-background: var(--menu-list-box-opener-filled-hover-bg);
    --dads-menu-list-box-opener-focus-background: var(--menu-list-box-opener-filled-bg);
  }

  :host([bold]) {
    --dads-menu-list-box-opener-font-weight: var(--font-weight-700, 700);
  }
`;
export const menuListBoxSemanticTokens = css `${menuListBoxSemanticTokensText}`;
export const menuListBoxLocalTokens = css `${menuListBoxLocalTokensText}`;
export const menuListBoxTokens = css `
  ${menuListBoxSemanticTokensText}
  ${menuListBoxLocalTokensText}
`;
