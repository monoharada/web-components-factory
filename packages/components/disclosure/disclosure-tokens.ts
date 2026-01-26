/**
 * ディスクロージャーコンポーネント用デザイントークン
 * デジタル庁デザインシステム（DADS）HTML版 disclosure.css 相当を token 化
 */

import { css } from '../../core/web-components.js';

const disclosureSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    --disclosure-gap: var(--spacing-2, 0.5rem); /* 8px */
    --disclosure-icon-size: calc(24 / 16 * 1rem);
    --disclosure-icon-color: var(--color-primitive-blue-1000);

    --disclosure-focus-border-radius: calc(4 / 16 * 1rem); /* 4px */
    --disclosure-summary-underline-offset: calc(3 / 16 * 1rem);

    --disclosure-content-padding-inline-start: var(--spacing-8, 2rem); /* 32px */
    --disclosure-content-margin-block: var(--spacing-4, 1rem); /* 16px */

    /* back-link（任意） */
    --disclosure-back-link-gap: var(--spacing-1-5, calc(6 / 16 * 1rem)); /* 6px */
    --disclosure-back-link-color: var(--color-primitive-blue-1000);
    --disclosure-back-link-color-hover: var(--color-primitive-blue-900);
    --disclosure-back-link-color-active: var(--color-primitive-orange-800);
    --disclosure-back-link-underline-thickness: calc(1 / 16 * 1rem);
    --disclosure-back-link-underline-thickness-hover: calc(3 / 16 * 1rem);
    --disclosure-back-link-underline-offset: calc(3 / 16 * 1rem);
  }
`;

const disclosureLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用API） ========== */

    --dads-disclosure-gap: var(--disclosure-gap);
    --dads-disclosure-icon-size: var(--disclosure-icon-size);
    --dads-disclosure-icon-color: var(--disclosure-icon-color);

    --dads-disclosure-focus-border-radius: var(--disclosure-focus-border-radius);
    --dads-disclosure-summary-underline-offset: var(--disclosure-summary-underline-offset);

    --dads-disclosure-content-padding-inline-start: var(--disclosure-content-padding-inline-start);
    --dads-disclosure-content-margin-block: var(--disclosure-content-margin-block);

    --dads-disclosure-back-link-gap: var(--disclosure-back-link-gap);
    --dads-disclosure-back-link-color: var(--disclosure-back-link-color);
    --dads-disclosure-back-link-color-hover: var(--disclosure-back-link-color-hover);
    --dads-disclosure-back-link-color-active: var(--disclosure-back-link-color-active);
    --dads-disclosure-back-link-underline-thickness: var(--disclosure-back-link-underline-thickness);
    --dads-disclosure-back-link-underline-thickness-hover: var(
      --disclosure-back-link-underline-thickness-hover
    );
    --dads-disclosure-back-link-underline-offset: var(--disclosure-back-link-underline-offset);
  }
`;

export const disclosureSemanticTokens = css`${disclosureSemanticTokensText}`;
export const disclosureLocalTokens = css`${disclosureLocalTokensText}`;

export const disclosureTokens = css`
  ${disclosureSemanticTokensText}
  ${disclosureLocalTokensText}
`;

