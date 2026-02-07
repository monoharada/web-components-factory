/**
 * ディスクロージャーコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 disclosure.css 相当をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';
export const disclosureStyles = css `
  :host {
    display: block;
  }

  :host(:not([data-has-back-link])) [part='back-link'] {
    display: none;
  }

  [part='summary'] {
    display: flex;
    align-items: start;
    justify-content: start;
    gap: var(--dads-disclosure-gap);
    width: fit-content;
    cursor: default;
    list-style-type: none;
  }

  @media (hover: hover) {
    [part='summary']:hover {
      text-decoration: underline;
      text-underline-offset: var(--dads-disclosure-summary-underline-offset);
    }
  }

  [part='summary']:focus-visible {
    border-radius: var(--dads-disclosure-focus-border-radius);
  }

  [part='summary']::marker {
    content: '';
  }

  [part='summary']::-webkit-details-marker {
    display: none;
  }

  [part='icon'] {
    flex-shrink: 0;
    margin-top: calc((1lh - var(--dads-disclosure-icon-size)) / 2);
    width: var(--dads-disclosure-icon-size);
    height: var(--dads-disclosure-icon-size);
    color: var(--dads-disclosure-icon-color);
  }

  @media (forced-colors: active) {
    [part='icon'] {
      color: inherit;
    }
  }

  [part='details'][open] [part='icon'] {
    rotate: 180deg;
  }

  @media (hover: hover) {
    [part='summary']:hover [part='icon-circle'] {
      fill: Canvas;
    }

    [part='summary']:hover [part='icon-triangle'] {
      fill: currentcolor;
    }
  }

  [part='content'] {
    padding-inline-start: var(--dads-disclosure-content-padding-inline-start);
    margin: var(--dads-disclosure-content-margin-block) 0;
  }

  [part='back-link']:any-link {
    display: flex;
    align-items: start;
    gap: var(--dads-disclosure-back-link-gap);
    width: fit-content;
    color: var(--dads-disclosure-back-link-color);
    text-decoration: underline;
    text-decoration-thickness: var(--dads-disclosure-back-link-underline-thickness);
    text-underline-offset: var(--dads-disclosure-back-link-underline-offset);
    text-spacing-trim: trim-start;
  }

  @media (hover: hover) {
    [part='back-link']:any-link:hover {
      color: var(--dads-disclosure-back-link-color-hover);
      text-decoration-thickness: var(--dads-disclosure-back-link-underline-thickness-hover);
    }
  }

  [part='back-link']:any-link:active {
    color: var(--dads-disclosure-back-link-color-active);
    text-decoration-thickness: var(--dads-disclosure-back-link-underline-thickness);
  }

  [part='back-link']:focus-visible {
    border-radius: var(--dads-disclosure-focus-border-radius);
  }

  [part='back-link-icon'] {
    margin-top: calc((1lh - var(--dads-disclosure-icon-size)) / 2);
    flex-shrink: 0;
    width: var(--dads-disclosure-icon-size);
    height: var(--dads-disclosure-icon-size);
  }
`;
