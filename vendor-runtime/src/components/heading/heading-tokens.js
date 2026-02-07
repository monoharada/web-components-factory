/**
 * 見出しコンポーネント用トークン定義
 *
 * 方針:
 * - px→rem の `calc(64 / 16 * 1rem)` は使わず、グローバルトークンを代入する
 * - size差分は `:host([size='xx']) { --heading-*: ... }` の変数再代入で表現する
 * - icon / chip は DADS の HTML 実装（相対単位: em / lh）をベースにして、トークン増殖を防ぐ
 */
import { css } from '../../core/web-components.js';
const headingSemanticTokensText = `
  :host {
    --heading-color: var(--color-neutral-solid-gray-800);
    --heading-font-family: var(--font-family-sans);
    --heading-font-weight: var(--font-weight-700);

    --heading-chip-color: var(--color-primitive-blue-900);
    --heading-rule-color: var(--color-primitive-blue-900);

    /* Typography (default: size=36) */
    --heading-font-size: var(--font-size-36);
    --heading-line-height: var(--line-height-140);
    --heading-letter-spacing: 0.01em;

    --heading-shoulder-font-size: var(--font-size-20);
    --heading-shoulder-line-height: var(--line-height-150);
    --heading-shoulder-letter-spacing: 0.02em;

    /* Icon (DADS HTML: 1.25em, vertical-align:-0.25em, gap: calc(0.4em - 0.25em)) */
    --heading-icon-size: 1.25em;
    --heading-icon-gap: calc(0.4em - 0.25em);
    /*
     * Visual tweak: align icon optically with JP glyphs.
     * Note: negative values move the inline box down; less-negative = higher.
     */
    --heading-icon-vertical-align: -0.19em;

    /*
     * Chip
     * - Figma では小数pxが出る（例: 15.75px）ため、px literal は使わず spacing に丸める
     * - サイズ差分は host[size] の再代入で表現する
     */
    --heading-chip-width: var(--spacing-3); /* 12px (size=36相当) */
    --heading-chip-padding-inline: var(--spacing-8); /* 32px (size=36相当) */
    --heading-chip-top: 0.2em;
    --heading-chip-bottom: 0.1em;
    --heading-chip-top-lh: calc(0.5lh - 0.45em);
    --heading-chip-bottom-lh: calc(0.5lh - 0.55em);

    /* Rule */
    --heading-rule-width: var(--spacing-1-5);
    --heading-rule-padding: var(--spacing-6);

    /* margin="top" */
    --heading-margin-block-start-base: var(--dads-heading-margin-block-start-base, 2lh);
    --heading-margin-scale: var(--dads-heading-margin-scale, var(--dads-typeset-density-factor, 1));
    --heading-margin-block-start: calc(var(--heading-margin-block-start-base) * var(--heading-margin-scale));
  }

  :host([size='64']) {
    --heading-font-size: var(--font-size-64);
    --heading-line-height: var(--line-height-140);
    --heading-letter-spacing: 0;
    --heading-shoulder-font-size: var(--font-size-28);
    --heading-shoulder-line-height: var(--line-height-150);
    --heading-shoulder-letter-spacing: 0.01em;
    --heading-chip-width: var(--spacing-6); /* 24px (Figma 22.5px の近似) */
    --heading-chip-padding-inline: var(--spacing-14); /* 56px (Figma 54.5px の近似) */
  }

  :host([size='57']) {
    --heading-font-size: var(--font-size-57);
    --heading-line-height: var(--line-height-140);
    --heading-letter-spacing: 0;
    --heading-shoulder-font-size: var(--font-size-24);
    --heading-shoulder-line-height: var(--line-height-150);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-5); /* 20px */
    --heading-chip-padding-inline: var(--spacing-12); /* 48px */
  }

  :host([size='45']) {
    --heading-font-size: var(--font-size-45);
    --heading-line-height: var(--line-height-140);
    --heading-letter-spacing: 0;
    --heading-shoulder-font-size: var(--font-size-22);
    --heading-shoulder-line-height: var(--line-height-150);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-4); /* 16px (Figma 15.75px の近似) */
    --heading-chip-padding-inline: var(--spacing-10); /* 40px (Figma 39.75px の近似) */
  }

  :host([size='32']) {
    --heading-font-size: var(--font-size-32);
    --heading-line-height: var(--line-height-150);
    --heading-letter-spacing: 0.01em;
    --heading-shoulder-font-size: var(--font-size-18);
    --heading-shoulder-line-height: var(--line-height-160);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-3); /* 12px */
    --heading-chip-padding-inline: var(--spacing-7); /* 28px */
  }

  :host([size='28']) {
    --heading-font-size: var(--font-size-28);
    --heading-line-height: var(--line-height-150);
    --heading-letter-spacing: 0.01em;
    --heading-shoulder-font-size: var(--font-size-16);
    --heading-shoulder-line-height: var(--line-height-170);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-2-5); /* 10px (Figma 10.5px の近似) */
    --heading-chip-padding-inline: var(--spacing-6); /* 24px (Figma 24.5px の近似) */
  }

  :host([size='24']) {
    --heading-font-size: var(--font-size-24);
    --heading-line-height: var(--line-height-150);
    --heading-letter-spacing: 0.02em;
    --heading-shoulder-font-size: var(--font-size-16);
    --heading-shoulder-line-height: var(--line-height-170);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-2); /* 8px */
    --heading-chip-padding-inline: var(--spacing-5); /* 20px (Figma 21px の近似) */
  }

  :host([size='20']) {
    --heading-font-size: var(--font-size-20);
    --heading-line-height: var(--line-height-150);
    --heading-letter-spacing: 0.02em;
    --heading-shoulder-font-size: var(--font-size-16);
    --heading-shoulder-line-height: var(--line-height-170);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-2); /* 8px (Figma 7.5px の近似) */
    --heading-chip-padding-inline: var(--spacing-4); /* 16px (Figma 17.5px の近似) */
  }

  :host([size='18']) {
    --heading-font-size: var(--font-size-18);
    --heading-line-height: var(--line-height-160);
    --heading-letter-spacing: 0.02em;
    --heading-shoulder-font-size: var(--font-size-16);
    --heading-shoulder-line-height: var(--line-height-170);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-2); /* 8px (Figma 7.25px の近似) */
    --heading-chip-padding-inline: var(--spacing-4); /* 16px (Figma 15.25px の近似) */
  }

  :host([size='16']) {
    --heading-font-size: var(--font-size-16);
    --heading-line-height: var(--line-height-170);
    --heading-letter-spacing: 0.02em;
    --heading-shoulder-font-size: var(--font-size-16);
    --heading-shoulder-line-height: var(--line-height-170);
    --heading-shoulder-letter-spacing: 0.02em;
    --heading-chip-width: var(--spacing-1-5); /* 6px (Figma 6.75px の近似) */
    --heading-chip-padding-inline: var(--spacing-3-5); /* 14px (Figma 14.75px の近似) */
  }
`;
const headingLocalTokensText = `
  :host {
    --dads-heading-color: var(--heading-color);
    --dads-heading-font-family: var(--heading-font-family);
    --dads-heading-font-weight: var(--heading-font-weight);

    --dads-heading-font-size: var(--heading-font-size);
    --dads-heading-line-height: var(--heading-line-height);
    --dads-heading-letter-spacing: var(--heading-letter-spacing);

    --dads-heading-shoulder-font-size: var(--heading-shoulder-font-size);
    --dads-heading-shoulder-line-height: var(--heading-shoulder-line-height);
    --dads-heading-shoulder-letter-spacing: var(--heading-shoulder-letter-spacing);

    --dads-heading-icon-size: var(--heading-icon-size);
    --dads-heading-icon-gap: var(--heading-icon-gap);
    --dads-heading-icon-vertical-align: var(--heading-icon-vertical-align);

    --dads-heading-chip-color: var(--heading-chip-color);
    --dads-heading-chip-width: var(--heading-chip-width);
    --dads-heading-chip-padding-inline: var(--heading-chip-padding-inline);
    --dads-heading-chip-top: var(--heading-chip-top);
    --dads-heading-chip-bottom: var(--heading-chip-bottom);

    --dads-heading-rule-color: var(--heading-rule-color);
    --dads-heading-rule-width: var(--heading-rule-width);
    --dads-heading-rule-padding: var(--heading-rule-padding);

    --dads-heading-margin-block-start: var(--heading-margin-block-start);
  }

  /* Prefer lh-aware insets when supported (matches DADS HTML). */
  @supports (top: 1lh) {
    :host {
      --dads-heading-chip-top: var(--heading-chip-top-lh);
      --dads-heading-chip-bottom: var(--heading-chip-bottom-lh);
    }
  }

  :host([rule='8']) {
    --dads-heading-rule-width: var(--spacing-2);
    --dads-heading-rule-padding: var(--spacing-8);
  }

  :host([rule='6']) {
    --dads-heading-rule-width: var(--spacing-1-5);
    --dads-heading-rule-padding: var(--spacing-6);
  }

  :host([rule='4']) {
    --dads-heading-rule-width: var(--spacing-1);
    --dads-heading-rule-padding: var(--spacing-4);
  }

  :host([rule='2']) {
    --dads-heading-rule-width: var(--spacing-0-5);
    --dads-heading-rule-padding: var(--spacing-2);
  }
`;
export const headingTokens = css `
  ${headingSemanticTokensText}
  ${headingLocalTokensText}
`;
