/**
 * LoadingIconコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const loadingIconStyles = css`
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
    justify-content: center;
    box-sizing: border-box;
  }

  :host([underlay]) [part="underlay"] {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: var(--spacing-3);
    border: 1px solid var(--dads-loading-icon-underlay-border);
    background: var(--dads-loading-icon-underlay-bg);
    z-index: -1;
  }

  [part="icon"] {
    display: block;
    width: 48px;
    height: 48px;
    color: var(--dads-loading-icon-color);
  }

  :host([size="sm"]) [part="icon"] {
    width: 24px;
    height: 24px;
  }

  [part="label"] {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: 1.7;
    letter-spacing: 0.02em;
    color: var(--dads-loading-icon-label-color);
  }

  :host(:not([label])) [part="label"],
  :host([label=""]) [part="label"] {
    display: none;
  }

  @media (forced-colors: active) {
    [part="icon"] {
      color: CanvasText;
    }

    [part="underlay"] {
      border-color: CanvasText;
      background: Canvas;
    }
  }
`;
