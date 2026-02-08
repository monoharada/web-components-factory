/**
 * モバイルモック用スタイル
 */

import { css } from '../../core/web-components.js';

export const mobileMockStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
  }

  [part='base'] {
    position: relative;
    inline-size: min(100%, var(--dads-mobile-mock-frame-width));
    aspect-ratio: var(--dads-mobile-mock-aspect-ratio);
    margin-inline: auto;
  }

  [part='frame'] {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    pointer-events: none;
    z-index: 5;
  }

  [part='frame-shape'] {
    fill: none;
    stroke: var(--dads-mobile-mock-frame-stroke-color);
    stroke-width: var(--dads-mobile-mock-frame-stroke-width);
  }

  [part='screen'] {
    position: absolute;
    inset: var(--dads-mobile-mock-screen-inset);
    border-radius: var(--dads-mobile-mock-screen-radius);
    background: var(--dads-mobile-mock-screen-background);
    overflow: hidden;
  }

  [part='safe-area'] {
    position: absolute;
    inset: var(--dads-mobile-mock-safe-area-top) 0 0;
    background: var(--dads-mobile-mock-screen-background);
  }
`;
