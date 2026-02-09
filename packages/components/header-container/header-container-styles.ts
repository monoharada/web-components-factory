/**
 * ヘッダーコンテナ用スタイル
 */

import { css } from '../../core/web-components.js';

export const headerContainerStyles = css`
  :host {
    display: block;
    color: var(--dads-header-container-color);
    font-family: var(--font-family-sans);
  }

  [part='base'] {
    display: grid;
    grid-template-rows: auto auto;
    background-color: var(--dads-header-container-background);
    color: inherit;
    border-block-end: var(--dads-header-container-border-width) solid
      var(--dads-header-container-border-color);
  }

  [part='primary-row'] {
    display: grid;
    grid-template-columns: minmax(0, max-content) minmax(0, 1fr) max-content;
    align-items: center;
    column-gap: var(--dads-header-container-primary-gap);
    min-block-size: var(--dads-header-container-primary-min-block-size);
    padding-inline: var(--dads-header-container-inline-padding);
    padding-block: var(--dads-header-container-primary-padding-block);
  }

  [part='logo'],
  [part='utility'],
  [part='global-menu'],
  [part='hamburger-menu'] {
    min-inline-size: 0;
  }

  [part='logo'] {
    grid-column: 1;
    justify-self: start;
  }

  [part='utility'] {
    grid-column: 2;
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2, 0.5rem);
  }

  [part='hamburger-menu'] {
    grid-column: 3;
    justify-self: end;
    display: inline-flex;
    align-items: center;
  }

  [part='global-menu'] {
    display: flex;
    align-items: center;
    min-block-size: var(--dads-header-container-global-menu-min-block-size);
    padding-inline: var(--dads-header-container-inline-padding);
    padding-block: var(--dads-header-container-global-menu-padding-block);
    border-block-start: var(--dads-header-container-border-width) solid
      var(--dads-header-container-border-color);
  }

  :host([data-effective-mode='wide-full']) [part='utility'] {
    grid-column: 3;
  }

  :host([data-effective-mode='wide-slim']) [part='base'] {
    display: flex;
    align-items: center;
    gap: var(--dads-header-container-wide-slim-gap);
    min-block-size: var(--dads-header-container-primary-min-block-size);
    padding-inline: var(--dads-header-container-inline-padding);
  }

  :host([data-effective-mode='wide-slim']) [part='primary-row'] {
    display: contents;
  }

  :host([data-effective-mode='wide-slim']) [part='logo'] {
    order: 1;
  }

  :host([data-effective-mode='wide-slim']) [part='global-menu'] {
    order: 2;
    flex: 1 1 auto;
    min-block-size: auto;
    padding: 0;
    border-block-start: 0;
  }

  :host([data-effective-mode='wide-slim']) [part='utility'] {
    order: 3;
    grid-column: auto;
    margin-inline-start: auto;
  }

  :host([data-effective-mode='wide-slim']) [part='hamburger-menu'] {
    order: 4;
    grid-column: auto;
  }

  [part='utility'][hidden],
  [part='global-menu'][hidden],
  [part='hamburger-menu'][hidden] {
    display: none;
  }

  #logo-slot::slotted(*) {
    display: block;
  }

  #utility-slot::slotted(*) {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2, 0.5rem);
  }

  #global-menu-slot::slotted(*) {
    display: block;
  }

  #hamburger-menu-slot::slotted(*) {
    display: inline-flex;
    align-items: center;
  }
`;
