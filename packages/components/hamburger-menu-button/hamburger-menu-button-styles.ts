/**
 * ハンバーガーメニューボタン用スタイル
 */

import { css } from '../../core/web-components.js';

export const hamburgerMenuButtonStyles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none;
  }

  [part='base'] {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dads-hamburger-menu-button-gap);
    min-block-size: var(--dads-hamburger-menu-button-min-height);
    padding: var(--dads-hamburger-menu-button-padding-block)
      var(--dads-hamburger-menu-button-padding-inline);
    border: 0;
    border-radius: var(--dads-hamburger-menu-button-radius);
    background-color: var(--dads-hamburger-menu-button-background);
    color: var(--dads-hamburger-menu-button-color);
    cursor: pointer;
    touch-action: manipulation;
    text-decoration: none;
    font-size: var(--dads-hamburger-menu-button-label-size);
    line-height: var(--dads-hamburger-menu-button-label-line-height);
    font-weight: var(--font-weight-400, 400);
  }

  [part='icon'] {
    display: inline-flex;
    flex: 0 0 auto;
    inline-size: var(--dads-hamburger-menu-button-icon-size);
    block-size: var(--dads-hamburger-menu-button-icon-size);
  }

  [part='icon'] > svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  [part='label'] {
    display: inline-block;
    text-decoration: inherit;
    white-space: nowrap;
  }

  :host([variant='standard']) [part='base']:active {
    background-color: var(--dads-hamburger-menu-button-background-active);
  }

  :host([variant='standard']) [part='base']:focus-visible {
    background-color: var(--dads-focus-text-element-bg);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    text-decoration: underline;
    text-underline-offset: var(--dads-hamburger-menu-button-underline-offset);
  }

  @media (any-hover: hover) {
    :host([variant='standard']) [part='base']:hover {
      background-color: var(--dads-hamburger-menu-button-background-hover);
      text-decoration: underline;
      text-underline-offset: var(--dads-hamburger-menu-button-underline-offset);
    }
  }

  :host([variant='icon']) [part='base'] {
    inline-size: var(--dads-hamburger-menu-button-icon-only-size);
    block-size: var(--dads-hamburger-menu-button-icon-only-size);
    min-inline-size: var(--dads-hamburger-menu-button-icon-only-size);
    min-block-size: var(--dads-hamburger-menu-button-icon-only-size);
    padding: 0;
    border-radius: var(--dads-hamburger-menu-button-icon-only-radius);
  }

  :host([variant='icon']) [part='icon'] {
    inline-size: var(--dads-hamburger-menu-button-icon-only-size);
    block-size: var(--dads-hamburger-menu-button-icon-only-size);
  }

  :host([variant='icon']) [part='label'] {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
  }

  :host([variant='icon']) [part='base']:active {
    background-color: var(--dads-hamburger-menu-button-background-active);
  }

  @media (any-hover: hover) {
    :host([variant='icon']) [part='base']:hover {
      background-color: var(--dads-hamburger-menu-button-background-hover);
      outline: var(--dads-hamburger-menu-button-icon-only-hover-outline-width) solid
        var(--dads-hamburger-menu-button-icon-only-hover-outline-color);
      outline-offset: -1px;
      text-decoration: none;
    }
  }
`;
