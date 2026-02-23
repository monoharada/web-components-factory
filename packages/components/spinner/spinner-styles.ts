/**
 * Spinnerコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const spinnerStyles = css`
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
    border: 1px solid var(--dads-spinner-underlay-border);
    background: var(--dads-spinner-underlay-bg);
    z-index: -1;
  }

  [part="svg"] {
    display: block;
    width: 48px;
    height: 48px;
    animation: spinner-rotate 2s linear infinite;
  }

  :host([size="sm"]) [part="svg"] {
    width: 24px;
    height: 24px;
  }

  [part="track"] {
    stroke: var(--dads-spinner-track-color);
  }

  [part="indicator"] {
    stroke: var(--dads-spinner-indicator-color);
    stroke-dasharray: 125.66;
    stroke-dashoffset: 113;
    animation: spinner-dash 1.4s ease-in-out infinite;
  }

  [part="label"] {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: 1.7;
    letter-spacing: 0.02em;
    color: var(--dads-spinner-label-color);
  }

  :host(:not([label])) [part="label"] {
    display: none;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinner-dash {
    0%, 25% {
      stroke-dashoffset: 113;
      transform: rotate(0deg);
    }
    50%, 75% {
      stroke-dashoffset: 30;
      transform: rotate(45deg);
    }
    100% {
      stroke-dashoffset: 113;
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="svg"] {
      animation: none;
    }

    [part="indicator"] {
      animation: none;
      stroke-dashoffset: 60;
    }
  }

  @media (forced-colors: active) {
    [part="track"] {
      stroke: CanvasText;
    }

    [part="indicator"] {
      stroke: Highlight;
    }

    [part="underlay"] {
      border-color: CanvasText;
    }
  }
`;
