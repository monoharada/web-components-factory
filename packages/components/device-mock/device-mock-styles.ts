/**
 * デバイスモック用スタイル
 */

import { css } from '../../core/web-components.js';

export const deviceMockStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
  }

  [part='base'] {
    position: relative;
    inline-size: min(100%, var(--dads-device-mock-frame-width));
    margin-inline: auto;
  }

  #canvas {
    position: relative;
    inline-size: 100%;
    aspect-ratio: var(--dads-device-mock-aspect-ratio);
  }

  :host([data-frame-clipped]) [part='base'] {
    block-size: var(--dads-device-mock-visible-height);
    overflow: hidden;
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
    stroke: var(--dads-device-mock-frame-stroke-color);
    stroke-width: var(--dads-device-mock-frame-stroke-width);
  }

  [part='screen'] {
    position: absolute;
    inset: var(--dads-device-mock-screen-inset);
    border-radius: var(--dads-device-mock-screen-radius);
    background: var(--dads-device-mock-screen-background);
    overflow: hidden;
  }

  [part='safe-area'] {
    position: absolute;
    inset: var(--dads-device-mock-safe-area-top) 0 0;
    background: var(--dads-device-mock-screen-background);
    overflow: hidden;
  }
`;
