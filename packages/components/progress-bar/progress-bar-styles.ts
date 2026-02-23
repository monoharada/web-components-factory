/**
 * Progress Barコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const progressBarStyles = css`
  :host {
    display: inline-flex;
    contain: layout paint style;
  }

  [part="base"] {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-4);
    position: relative;
    z-index: 0;
    width: 100%;
  }

  :host([composition="inlined"]) [part="base"] {
    flex-direction: row;
    gap: var(--spacing-2);
  }

  :host([composition="inlined"]) [part="label"] {
    min-width: 0;
    white-space: nowrap;
  }

  [part="underlay"] {
    display: none;
  }

  :host([underlay]) [part="base"] {
    min-width: 128px;
    min-height: 128px;
    padding: var(--spacing-4);
    justify-content: center;
    box-sizing: border-box;
  }

  :host([underlay]) [part="underlay"] {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid var(--dads-progress-bar-underlay-border);
    background: var(--dads-progress-bar-underlay-bg);
    z-index: -1;
  }

  [part="track"] {
    width: 100%;
    height: 4px;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    background: var(--dads-progress-bar-track-color);
    border-bottom: 1px solid var(--dads-progress-bar-track-color);
  }

  [part="indicator"] {
    position: absolute;
    inset: 0;
    background: var(--dads-progress-bar-indicator-color);
    transform: scaleX(var(--progress, 0));
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  :host(:not([data-determinate])) [part="indicator"] {
    animation: linear-indeterminate 2s ease-in-out infinite;
  }

  [part="label"] {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: 1.7;
    letter-spacing: 0.02em;
    color: var(--dads-progress-bar-label-color);
  }

  :host(:not([label])) [part="label"] {
    display: none;
  }

  @keyframes linear-indeterminate {
    0% {
      transform: translateX(-100%) scaleX(0.4);
    }
    50% {
      transform: translateX(0%) scaleX(0.6);
    }
    100% {
      transform: translateX(100%) scaleX(0.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="indicator"] {
      transition: none;
    }

    :host(:not([data-determinate])) [part="indicator"] {
      animation: none;
      transform: translateX(0) scaleX(0.6);
    }
  }

  @media (forced-colors: active) {
    [part="track"] {
      background: CanvasText;
    }

    [part="indicator"] {
      background: Highlight;
    }

    [part="underlay"] {
      border-color: CanvasText;
    }
  }
`;
