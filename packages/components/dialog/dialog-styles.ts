/**
 * Dialogコンポーネント用スタイル
 */

import { css } from '../../core/web-components.js';

export const dialogStyles = css`
  :host {
    display: block;
  }

  :host([data-preview-contained]) {
    position: relative;
    min-block-size: 20rem;
  }

  [part='base'] {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--dads-dialog-color);
    inline-size: 100dvw;
    max-inline-size: 100dvw;
    block-size: 100dvh;
    max-block-size: 100dvh;
  }

  :host([data-preview-contained]) [part='base'] {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    max-inline-size: 100%;
    block-size: 100%;
    max-block-size: 100%;
    background-color: var(--dads-dialog-backdrop-background);
  }

  [part='base'][open] {
    display: grid;
    place-items: center;
    padding: var(--dads-dialog-viewport-padding);
  }

  [part='base']::backdrop {
    background-color: var(--dads-dialog-backdrop-background);
  }

  [part='panel'] {
    display: flex;
    flex-direction: column;
    row-gap: var(--dads-dialog-gap);
    inline-size: min(var(--dads-dialog-width), calc(100dvw - var(--dads-dialog-viewport-padding) * 2));
    max-inline-size: 100%;
    max-block-size: var(--dads-dialog-max-height);
    overflow: auto;
    background-color: var(--dads-dialog-background);
    color: var(--dads-dialog-color);
    border: var(--dads-dialog-border-width) solid var(--dads-dialog-border-color);
    border-radius: var(--dads-dialog-border-radius);
    padding: var(--dads-dialog-padding-block) var(--dads-dialog-padding-inline);
  }

  :host([data-preview-contained]) [part='panel'] {
    inline-size: min(var(--dads-dialog-width), calc(100% - var(--dads-dialog-viewport-padding) * 2));
    max-block-size: calc(100% - var(--dads-dialog-viewport-padding) * 2);
  }

  [part='header'] {
    display: flex;
    align-items: start;
    justify-content: space-between;
    column-gap: var(--dads-dialog-header-gap);
  }

  [part='title'] {
    margin: 0;
    font-size: var(--dads-dialog-title-size);
    line-height: var(--dads-dialog-title-line-height);
    font-weight: var(--font-weight-700, 700);
  }

  #title-slot::slotted(h1),
  #title-slot::slotted(h2),
  #title-slot::slotted(h3),
  #title-slot::slotted(h4),
  #title-slot::slotted(h5),
  #title-slot::slotted(h6) {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  [part='content'] {
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170, 1.7);
  }

  [part='footer'] {
    display: none;
    align-items: center;
    justify-content: end;
    column-gap: var(--dads-dialog-footer-gap);
    flex-wrap: wrap;
  }

  :host([data-has-footer]) [part='footer'] {
    display: flex;
  }

  [part='close-button'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-inline-size: var(--dads-dialog-close-button-size);
    min-block-size: var(--dads-dialog-close-button-size);
    padding: var(--dads-dialog-close-button-padding);
    border: 1px solid var(--dads-dialog-close-button-border-color);
    border-radius: var(--dads-dialog-close-button-border-radius);
    background-color: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-100, 1);
    white-space: nowrap;
  }

  @media (any-hover: hover) {
    [part='close-button']:hover {
      background-color: var(--dads-dialog-close-button-hover-background);
    }
  }

  [part='close-button'][hidden] {
    display: none;
  }

  @media (forced-colors: active) {
    [part='panel'] {
      border-color: CanvasText;
    }

    [part='close-button'] {
      border-color: CanvasText;
    }
  }
`;
