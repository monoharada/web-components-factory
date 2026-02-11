/**
 * Progress styles
 */
import { css } from '../../core/web-components.js';

const visuallyHiddenPartStyles = `
  [part~="visually-hidden"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export const progressStyles = css`
  :host {
    display: block;
    min-width: 0;
    font-family: var(--font-family-sans);
    color: var(--dads-progress-label-color);
  }

  [part="root"] {
    display: grid;
    gap: var(--progress-label-gap);
  }

  [part="label"] {
    color: var(--dads-progress-label-color);
    font-size: var(--font-size-14, 0.875rem);
    line-height: 1.5;
  }

  [part="value-text"] {
    color: var(--dads-progress-value-color);
    font-size: var(--font-size-14, 0.875rem);
    line-height: 1.5;
  }

  [part="bar"] {
    display: grid;
    place-items: center;
  }

  [part="track"],
  [part="circular-svg"],
  [part="segments"] {
    display: none;
  }

  :host([shape="linear"]) [part="track"] {
    position: relative;
    display: block;
    width: 100%;
    min-width: 0;
    height: var(--dads-progress-height);
    border-radius: var(--dads-progress-radius);
    overflow: hidden;
    background-color: var(--dads-progress-track-color);
  }

  :host([shape="linear"]) [part="fill"] {
    display: block;
    width: var(--_dads-progress-ratio-percent, 0%);
    height: 100%;
    border-radius: inherit;
    background-color: var(--dads-progress-fill-color);
    transition: width var(--dads-progress-animation-duration) ease;
  }

  :host([shape="linear"][indeterminate]) [part="fill"] {
    width: 36%;
    animation: dads-progress-linear-indeterminate var(--dads-progress-animation-duration) ease-in-out infinite;
  }

  :host([shape="circular"]) [part="circular-svg"] {
    display: block;
    width: var(--dads-progress-size);
    height: var(--dads-progress-size);
    transform: rotate(-90deg);
  }

  [part="circular-track"],
  [part="circular-fill"] {
    fill: none;
    stroke-width: var(--dads-progress-stroke-width);
  }

  [part="circular-track"] {
    stroke: var(--dads-progress-track-color);
  }

  [part="circular-fill"] {
    stroke: var(--dads-progress-fill-color);
    stroke-linecap: round;
    transition: stroke-dashoffset var(--dads-progress-animation-duration) ease;
  }

  :host([shape="circular"][indeterminate]) [part="circular-svg"] {
    animation: dads-progress-spin calc(var(--dads-progress-animation-duration) * 1.5) linear infinite;
  }

  :host([shape="circular"][indeterminate]) [part="circular-fill"] {
    stroke-dasharray: calc(var(--_dads-progress-circumference, 282.743) * 0.35)
      calc(var(--_dads-progress-circumference, 282.743) * 0.65);
    animation: dads-progress-circular-indeterminate var(--dads-progress-animation-duration) ease-in-out infinite;
  }

  :host([shape="segmented"]) [part="segments"] {
    display: grid;
    width: 100%;
    min-width: 0;
    gap: var(--dads-progress-segment-gap);
  }

  [part="segment"] {
    position: relative;
    display: block;
    height: var(--dads-progress-height);
    border-radius: var(--dads-progress-radius);
    overflow: hidden;
    background-color: var(--dads-progress-track-color);
  }

  [part="segment-fill"] {
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--dads-progress-fill-color);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform var(--dads-progress-animation-duration) ease;
  }

  [part="segment"][data-filled="true"] [part="segment-fill"] {
    transform: scaleX(1);
  }

  :host([shape="segmented"][indeterminate]) [part="segment-fill"] {
    transform: scaleX(1);
    opacity: 0.45;
    animation: dads-progress-segment-indeterminate var(--dads-progress-animation-duration) ease-in-out infinite;
  }

  ${visuallyHiddenPartStyles}

  @keyframes dads-progress-linear-indeterminate {
    0% {
      transform: translateX(-130%);
    }
    100% {
      transform: translateX(310%);
    }
  }

  @keyframes dads-progress-spin {
    from {
      transform: rotate(-90deg);
    }
    to {
      transform: rotate(270deg);
    }
  }

  @keyframes dads-progress-circular-indeterminate {
    0% {
      stroke-dashoffset: calc(var(--_dads-progress-circumference, 282.743) * 0.95);
    }
    50% {
      stroke-dashoffset: calc(var(--_dads-progress-circumference, 282.743) * 0.35);
    }
    100% {
      stroke-dashoffset: calc(var(--_dads-progress-circumference, 282.743) * 0.95);
    }
  }

  @keyframes dads-progress-segment-indeterminate {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 0.85;
    }
  }

  @media (forced-colors: active) {
    [part="track"],
    [part="segment"] {
      background-color: Canvas;
      border: 1px solid CanvasText;
      forced-color-adjust: none;
    }

    [part="fill"],
    [part="segment-fill"] {
      background-color: Highlight;
      forced-color-adjust: none;
    }

    [part="circular-track"] {
      stroke: CanvasText;
      forced-color-adjust: none;
    }

    [part="circular-fill"] {
      stroke: Highlight;
      forced-color-adjust: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="fill"],
    [part="circular-fill"],
    [part="segment-fill"],
    [part="circular-svg"] {
      transition: none;
      animation: none;
    }
  }
`;
