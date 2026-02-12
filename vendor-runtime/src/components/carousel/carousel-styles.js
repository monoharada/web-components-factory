/**
 * カルーセルコンポーネント用スタイル
 * DADS HTML carousel.css の構成を Web Components 向けに移植
 */
import { css } from '../../core/web-components.js';
export const carouselStyles = css `
  :host {
    display: block;
    container-type: inline-size;
    color: var(--dads-carousel-text-color);
    font-family: var(--dads-carousel-font-family);
    font-size: var(--dads-carousel-font-size);
    font-weight: var(--dads-carousel-font-weight-normal);
    line-height: 1.7;
    letter-spacing: var(--dads-carousel-letter-spacing);
  }

  :host([hidden]) {
    display: none;
  }

  [part~='inner'] {
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    max-width: var(--dads-carousel-max-width);
  }

  #heading-slot::slotted(*) {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: var(--dads-carousel-font-size-heading-default);
    line-height: 1.5;
    font-weight: var(--dads-carousel-font-weight-bold);
    letter-spacing: var(--dads-carousel-letter-spacing);
  }

  @media (min-width: 30rem) {
    #heading-slot::slotted(*) {
      font-size: var(--dads-carousel-font-size-heading-sm);
    }
  }

  @media (min-width: 64rem) {
    #heading-slot::slotted(*) {
      font-size: var(--dads-carousel-font-size-heading-lg);
      letter-spacing: 0.01em;
    }
  }

  :host([data-wide='true']) [part~='inner'] {
    padding-inline: var(--dads-carousel-side-padding);
  }

  [part~='number'] {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    inline-size: var(--dads-carousel-number-size);
    block-size: var(--dads-carousel-number-size);
    border: var(--dads-carousel-border-width) solid var(--dads-carousel-line-color);
    border-radius: 50%;
    background-color: var(--dads-carousel-surface-color);
    padding: 0 0 calc(2 / 16 * 1rem);
    color: var(--dads-carousel-text-color);
    font: inherit;
    font-size: var(--dads-carousel-number-font-size);
    font-weight: var(--dads-carousel-font-weight-bold);
    line-height: 1;
    letter-spacing: var(--dads-carousel-letter-spacing);
  }

  [part~='number'][aria-current='true'],
  [part~='number'][aria-selected='true'] {
    background-color: var(--dads-carousel-text-color);
    color: var(--dads-carousel-surface-color);
    box-shadow: 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-surface-color);
    outline: var(--dads-carousel-border-width) solid var(--dads-carousel-line-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-outer);
  }

  [part~='panel-set'] {
    display: grid;
    grid-template: 'main' auto / auto;
  }

  :host([data-wide='true']) [part~='panel-set'] {
    margin-inline: calc(-1 * var(--dads-carousel-side-padding));
    grid-template:
      'number main next .' auto /
      var(--dads-carousel-panel-grid-side) 3fr 1fr var(--dads-carousel-panel-grid-side);
  }

  [part~='panel-set']::before {
    grid-area: number;
    justify-self: center;
    display: none;
    border-inline-end: var(--dads-carousel-border-width) solid var(--dads-carousel-line-color);
    block-size: 100%;
    content: '';
  }

  [part~='panel-number'] {
    grid-area: number;
    justify-self: center;
    display: none;
  }

  [part~='main'] {
    grid-area: main;
    position: relative;
    min-inline-size: 0;
  }

  [part~='main-link'] {
    position: relative;
    display: block;
    inline-size: 100%;
  }

  @media (hover: hover) {
    [part~='main-link'][href]:hover:not(:focus-visible) {
      outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-link-hover-color);
      outline-offset: var(--dads-carousel-focus-outline-offset-inner);
    }

    [part~='main-link'][href]:hover:not(:focus-visible)::after {
      position: absolute;
      inset: var(--dads-carousel-focus-ring-width);
      box-shadow: inset 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-surface-color);
      pointer-events: none;
      border-radius: var(--dads-carousel-radius-md);
      content: '';
    }
  }

  [part~='main-link']:focus-visible {
    overflow: hidden;
    outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-focus-outline-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-inner);
    border-radius: var(--dads-carousel-radius-lg);
  }

  [part~='main-link']:focus-visible::after {
    position: absolute;
    inset: var(--dads-carousel-focus-ring-width);
    box-shadow: inset 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-focus-ring-color);
    border-radius: var(--dads-carousel-radius-md);
    pointer-events: none;
    content: '';
  }

  [part~='image-container'] {
    display: grid;
    place-content: center;
    block-size: 100%;
    border-radius: inherit;
    outline: var(--dads-carousel-image-outline-width) solid var(--dads-carousel-line-color);
    outline-offset: calc(-1 * var(--dads-carousel-image-outline-width));
    overflow: clip;
  }

  [part~='image-container'] > img,
  [part~='image-container'] > picture {
    display: block;
    inline-size: auto;
    max-inline-size: 100%;
    block-size: auto;
  }

  [part~='image-container'] > picture > img {
    display: block;
    inline-size: auto;
    max-inline-size: 100%;
    block-size: auto;
  }

  [part~='main-bg'] {
    position: relative;
    z-index: -1;
    grid-area: main;
    overflow: clip;
  }

  [part~='main-bg'] > div {
    position: absolute;
    inset: -50% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: blur(var(--dads-carousel-bg-blur-size));
    transform: translate3d(0, 0, 0);
  }

  [part~='main-bg'] > div > img,
  [part~='main-bg'] > div > picture {
    inline-size: auto;
    block-size: 200%;
  }

  [part~='main-bg'] > div > picture > img {
    inline-size: auto;
    block-size: 200%;
  }

  [part~='main-bg'] > div::after {
    position: absolute;
    inset: 0;
    background-color: var(--dads-carousel-bg-soft-light-color);
    mix-blend-mode: soft-light;
    content: '';
  }

  [part~='next-bg'] {
    position: relative;
    z-index: -1;
    display: none;
    grid-area: next;
    overflow: clip;
  }

  [part~='next-bg'] > div {
    position: absolute;
    inset: -50% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: blur(var(--dads-carousel-bg-blur-size));
    transform: translate3d(0, 0, 0);
  }

  [part~='next-bg'] > div > img,
  [part~='next-bg'] > div > picture {
    inline-size: auto;
    block-size: 200%;
  }

  [part~='next-bg'] > div > picture > img {
    inline-size: auto;
    block-size: 200%;
  }

  [part~='next-bg'] > div::after {
    position: absolute;
    inset: 0;
    background-color: var(--dads-carousel-bg-soft-light-color);
    mix-blend-mode: soft-light;
    content: '';
  }

  :host([data-wide='true']) [part~='next-bg'] {
    display: block;
  }

  [part~='next'] {
    grid-area: next;
    margin: 0;
    display: none;
    min-inline-size: 0;
    border: var(--dads-carousel-border-width) solid var(--dads-carousel-border-color);
    border-inline-start-width: 0;
    padding: var(--dads-carousel-next-padding);
  }

  :host([data-wide='true']) [part~='next'] {
    display: block;
  }

  [part~='next-preview-button'] {
    position: relative;
    border: var(--dads-carousel-border-width) solid var(--dads-carousel-border-color);
    background-color: var(--dads-carousel-surface-color);
    padding: 0;
    font: inherit;
    color: inherit;
    text-align: left;
    text-decoration: underline;
    text-decoration-thickness: calc(1 / 16 * 1rem);
    text-underline-offset: calc(3 / 16 * 1rem);
    cursor: pointer;
    touch-action: manipulation;
  }

  [part~='next-image-container'] {
    display: block;
    overflow: clip;
  }

  [part~='next-image-container'] > img,
  [part~='next-image-container'] > picture {
    display: block;
    inline-size: auto;
    max-inline-size: 100%;
    block-size: auto;
  }

  [part~='next-image-container'] > picture > img {
    display: block;
    inline-size: auto;
    max-inline-size: 100%;
    block-size: auto;
  }

  [part~='next-image-label'] {
    display: block;
    border-block-start: var(--dads-carousel-border-width) solid var(--dads-carousel-border-color);
    padding: var(--dads-carousel-next-label-padding);
    font-size: var(--dads-carousel-next-label-font-size);
    font-weight: var(--dads-carousel-font-weight-bold);
    line-height: 1.7;
    letter-spacing: var(--dads-carousel-letter-spacing);
    text-decoration-thickness: inherit;
  }

  @media (hover: hover) {
    [part~='next-preview-button']:hover {
      outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-link-hover-color);
      outline-offset: calc(-1 * var(--dads-carousel-border-width));
      text-decoration-thickness: calc(3 / 16 * 1rem);
    }

    [part~='next-preview-button']:hover:not(:focus-visible)::after {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-surface-color);
      pointer-events: none;
      content: '';
    }
  }

  [part~='next-preview-button']:focus-visible {
    outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-focus-outline-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-outer);
    border-radius: var(--dads-carousel-radius-sm);
    box-shadow: 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-focus-ring-color);
  }

  [part='controls'] {
    display: flex;
    align-items: center;
    column-gap: var(--dads-carousel-control-gap-mobile);
    padding-block: var(--dads-carousel-control-padding-block);
  }

  :host([data-wide='true']) [part='controls'] {
    column-gap: var(--dads-carousel-control-gap-desktop);
  }

  [part~='indicators'] {
    position: relative;
    margin: 0;
    display: none;
    justify-content: end;
    column-gap: var(--dads-carousel-step-gap);
    padding: 0;
    list-style-type: none;
  }

  :host([data-wide='true']) [part~='indicators'] {
    display: flex;
  }

  [part~='step-item'] {
    position: relative;
    flex-shrink: 0;
  }

  [part~='step-item']:not(:last-child)::before {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 100%;
    inline-size: var(--dads-carousel-step-gap);
    border-block-end: var(--dads-carousel-border-width) solid var(--dads-carousel-line-color);
    content: '';
  }

  [part~='indicator-button'] {
    position: relative;
    border: var(--dads-carousel-border-width) solid var(--dads-carousel-line-color);
    background-color: var(--dads-carousel-surface-color);
    font: inherit;
  }

  [part~='indicator-button']:not([aria-selected='true']) {
    text-decoration: underline;
    text-decoration-thickness: calc(1 / 16 * 1rem);
    text-underline-offset: calc(3 / 16 * 1rem);
    cursor: pointer;
  }

  [part~='indicator-button']::after {
    position: absolute;
    inset: calc(-7 / 16 * 1rem);
    content: '';
  }

  @media (hover: hover) {
    [part~='indicator-button']:not([aria-selected='true']):hover {
      text-decoration-thickness: calc(3 / 16 * 1rem);
    }
  }

  [part~='indicator-button']:focus-visible {
    outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-focus-outline-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-outer);
    box-shadow: 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-focus-ring-color);
  }

  [part~='page-nav'] {
    flex-shrink: 0;
    margin: 0;
    display: flex;
    justify-content: end;
    align-items: center;
    column-gap: var(--dads-carousel-page-nav-gap);
    padding: 0;
  }

  :host([data-wide='true']) [part~='page-nav'] {
    display: none;
  }

  [part~='page-nav-button'] {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    inline-size: var(--dads-carousel-page-button-size);
    block-size: var(--dads-carousel-page-button-size);
    border: var(--dads-carousel-border-width) solid var(--dads-carousel-link-color);
    border-radius: 50%;
    background-color: var(--dads-carousel-surface-color);
    color: var(--dads-carousel-link-color);
    padding: 0;
    cursor: pointer;
  }

  [part~='page-nav-button']::after {
    position: absolute;
    inset: -100%;
    margin: auto;
    inline-size: var(--dads-carousel-hit-area);
    block-size: var(--dads-carousel-hit-area);
    content: '';
  }

  [part~='page-nav-button']:focus-visible {
    outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-focus-outline-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-outer);
    box-shadow: 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-focus-ring-color);
  }

  [part~='all-slides'] {
    order: -1;
  }

  [part~='all-slides'][open] {
    flex: 1;
  }

  [part~='all-slides-button'] {
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: calc(8 / 16 * 1rem);
    border-radius: var(--dads-carousel-radius-lg);
    border: var(--dads-carousel-border-width) solid var(--color-neutral-solid-gray-600);
    background-color: var(--dads-carousel-surface-color);
    padding: var(--dads-carousel-summary-padding-block) var(--dads-carousel-summary-padding-inline);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: calc(3 / 16 * 1rem);
  }

  @media (hover: hover) {
    [part~='all-slides-button']:hover {
      text-decoration-thickness: calc(3 / 16 * 1rem);
    }
  }

  [part~='all-slides-button']:focus-visible {
    outline: var(--dads-carousel-focus-outline-width) solid var(--dads-carousel-focus-outline-color);
    outline-offset: var(--dads-carousel-focus-outline-offset-outer);
    border-radius: var(--dads-carousel-radius-sm);
    background-color: var(--dads-carousel-focus-ring-color);
    box-shadow: 0 0 0 var(--dads-carousel-focus-ring-width) var(--dads-carousel-focus-ring-color);
  }

  [part~='all-slides-icon'] {
    color: var(--dads-carousel-all-slides-icon-color);
  }

  [part~='all-slides-button']::-webkit-details-marker {
    display: none;
  }

  [part~='all-slides-content'] {
    margin-block-start: var(--dads-carousel-all-slides-content-margin-top);
    padding-inline-start: 0;
  }

  [part~='slides'] {
    display: grid;
    row-gap: var(--dads-carousel-all-slides-row-gap);
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  :host([data-expanded='true']) [part='controls'] {
    padding-block-end: var(--dads-carousel-control-padding-bottom-expanded);
  }

  :host([data-expanded='true']) [part~='page-nav'] {
    display: none;
  }

  :host([data-expanded='true']) [part~='indicators'] {
    display: none;
  }

  :host([data-expanded='true']) [part~='next-bg'] {
    display: none;
  }

  :host([data-expanded='true']) [part~='next'] {
    display: none;
  }

  :host([data-expanded='true'][data-wide='true']) [part~='panel-set']::before {
    display: block;
  }

  :host([data-expanded='true'][data-wide='true']) [part~='panel-number'] {
    display: flex;
  }

  [part~='all-slides-item'] {
    margin-block-start: var(--dads-carousel-all-slides-extra-gap);
  }

  [part~='visually-hidden'] {
    position: absolute;
    clip: rect(0 0 0 0);
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    padding: 0;
  }
`;
