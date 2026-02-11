/**
 * Drawerコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const drawerStyles = css `
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
    color: var(--dads-drawer-color);
    inline-size: 100dvw;
    max-inline-size: 100dvw;
    block-size: 100dvh;
    max-block-size: 100dvh;
    z-index: var(--dads-drawer-z-index);
  }

  :host([data-preview-contained]) [part='base'] {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    max-inline-size: 100%;
    block-size: 100%;
    max-block-size: 100%;
    background-color: var(--dads-drawer-backdrop-background);
  }

  [part='base'][open] {
    display: flex;
    justify-content: start;
    align-items: stretch;
  }

  :host([placement='right']) [part='base'][open] {
    justify-content: end;
  }

  [part='base']::backdrop {
    background-color: var(--dads-drawer-backdrop-background);
  }

  /*
   * a11y-annotate 用アンカー。
   * ::backdrop は直接ターゲットできないため、同等領域を示す透明要素を置く。
   */
  [part='backdrop-anchor'] {
    position: absolute;
    top: 50%;
    inline-size: clamp(2.5rem, 12vw, 6rem);
    block-size: clamp(2.5rem, 12vh, 6rem);
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0;
  }

  :host([placement='left']) [part='backdrop-anchor'] {
    left: calc(min(var(--dads-drawer-width), var(--dads-drawer-max-width)) + var(--spacing-4, 1rem));
  }

  :host([placement='right']) [part='backdrop-anchor'] {
    right: calc(min(var(--dads-drawer-width), var(--dads-drawer-max-width)) + var(--spacing-4, 1rem));
  }

  [part='panel'] {
    display: flex;
    flex-direction: column;
    inline-size: min(var(--dads-drawer-width), var(--dads-drawer-max-width));
    max-inline-size: 100dvw;
    block-size: 100dvh;
    max-block-size: 100dvh;
    overflow: hidden;
    background-color: var(--dads-drawer-background);
    color: var(--dads-drawer-color);
    box-shadow: var(--dads-drawer-shadow);
    border-inline-end: var(--dads-drawer-border-width) solid var(--dads-drawer-border-color);
  }

  :host([placement='right']) [part='panel'] {
    border-inline-end: 0;
    border-inline-start: var(--dads-drawer-border-width) solid var(--dads-drawer-border-color);
  }

  :host([data-preview-contained]) [part='panel'] {
    block-size: 100%;
    max-block-size: 100%;
  }

  [part='header'] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: var(--spacing-2, 0.5rem);
    min-block-size: var(--dads-drawer-header-min-height);
    padding-inline: var(--dads-drawer-header-padding-inline);
    border-block-end: var(--dads-drawer-border-width) solid var(--dads-drawer-border-color);
  }

  [part='title'] {
    margin: 0;
    font-size: var(--dads-drawer-title-size);
    line-height: var(--dads-drawer-title-line-height);
    font-weight: var(--font-weight-700, 700);
    min-inline-size: 0;
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
    flex: 1 1 auto;
    overflow: auto;
    padding: var(--dads-drawer-content-padding-block) var(--dads-drawer-content-padding-inline);
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170, 1.7);
  }

  [part='close-button'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dads-drawer-close-button-gap);
    padding-inline: var(--dads-drawer-close-button-padding-inline);
    min-inline-size: var(--dads-drawer-close-button-size);
    min-block-size: var(--dads-drawer-close-button-size);
    border: 1px solid var(--dads-drawer-close-button-border-color);
    border-radius: var(--dads-drawer-close-button-radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-100, 1);
    white-space: nowrap;
  }

  [part='close-button-icon'] {
    display: inline-flex;
    flex: 0 0 auto;
    inline-size: var(--dads-drawer-close-button-icon-size);
    block-size: var(--dads-drawer-close-button-icon-size);
  }

  [part='close-button-icon'] > svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  @media (any-hover: hover) {
    [part='close-button']:hover {
      background-color: var(--dads-drawer-close-button-hover-background);
      text-decoration: underline;
      text-underline-offset: calc(3 / 16 * 1rem);
    }
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
