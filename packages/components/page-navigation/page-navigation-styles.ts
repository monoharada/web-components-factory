/**
 * ページナビゲーションコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）準拠
 */
import { css } from '../../core/web-components.js';

export const pageNavigationStyles = css`
  :host {
    display: block;
  }

  /* ========== Nav container ========== */
  [part="nav"] {
    display: flex;
    align-items: center;
    justify-content: var(--dads-page-navigation-justify-content);
    gap: var(--dads-page-navigation-gap);
    width: var(--dads-page-navigation-width);
    font-family: var(--dads-page-navigation-font-family);
    font-size: var(--dads-page-navigation-font-size);
    letter-spacing: var(--dads-page-navigation-letter-spacing);
  }

  /* Width is already set above; data-fill overrides to 100% */
  [part="nav"][data-fill] {
    width: 100%;
  }

  [part="nav"][data-fill] [part~="control"]:not([hidden]) {
    flex: 1;
  }

  /* Fill layout: prev は左寄せ、next は右寄せ */
  [part="nav"][data-fill] [part~="prev"]:not([hidden]) {
    justify-content: flex-start;
  }

  [part="nav"][data-fill] [part~="next"]:not([hidden]) {
    justify-content: flex-end;
  }

  /* ========== Control (prev/next) ========== */
  [part~="control"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--dads-page-navigation-control-gap);

    min-width: var(--dads-page-navigation-control-min-width);
    min-height: var(--dads-page-navigation-control-min-height);
    padding-block: var(--dads-page-navigation-control-padding-y);
    padding-inline: var(--dads-page-navigation-control-padding-x);

    color: var(--dads-page-navigation-control-color);
    background-color: var(--dads-page-navigation-control-background);
    border: var(--dads-page-navigation-control-border-width) solid
      var(--dads-page-navigation-control-border-color);
    border-radius: var(--dads-page-navigation-control-border-radius);

    font: inherit;
    font-weight: var(--dads-page-navigation-font-weight);
    line-height: var(--dads-page-navigation-line-height);
    text-decoration: none;

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  [part~="control"][hidden] {
    display: none;
  }

  /* Text type: underline */
  :host(:not([type])),
  :host([type="text"]) {
    --dads-page-navigation-control-text-decoration: underline;
  }

  :host(:not([type])) [part~="control"],
  :host([type="text"]) [part~="control"] {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* Arrow type: fixed square */
  :host([type="arrow"]) [part~="control"] {
    inline-size: var(--dads-page-navigation-control-size);
    block-size: var(--dads-page-navigation-control-size);
  }

  /* ========== Icon ========== */
  [part~="icon"] {
    inline-size: var(--dads-page-navigation-icon-size);
    block-size: var(--dads-page-navigation-icon-size);
    flex-shrink: 0;
    color: currentColor;
  }

  /* ========== Label ========== */
  [part~="label"] {
    display: inline-block;
    white-space: nowrap;
  }

  :host([type="arrow"]) [part~="label"] {
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

  /* ========== Status ========== */
  [part~="status"] {
    color: var(--dads-page-navigation-status-color);
    font-size: var(--dads-page-navigation-status-font-size);
    font-weight: var(--dads-page-navigation-status-font-weight);
    line-height: var(--dads-page-navigation-status-line-height);
    letter-spacing: var(--dads-page-navigation-status-letter-spacing);
    white-space: nowrap;
  }

  [part~="status"][hidden] {
    display: none;
  }

  /* ========== Hover / Active ========== */
  @media (any-hover: hover) {
    [part~="control"]:hover {
      --dads-page-navigation-control-background: var(--dads-page-navigation-control-background-hover);
      --dads-page-navigation-control-color: var(--dads-page-navigation-control-color-hover);
      --dads-page-navigation-control-border-color: var(--dads-page-navigation-control-border-color-hover);
    }
  }

  [part~="control"]:active {
    --dads-page-navigation-control-background: var(--dads-page-navigation-control-background-active);
  }

  /* ========== Disabled state (button mode) ========== */
  [part~="control"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ========== Forced Colors ========== */
  @media (forced-colors: active) {
    [part~="control"] {
      border-color: ButtonText;
      color: LinkText;
    }

    [part~="control"]:disabled {
      opacity: 1;
      color: GrayText;
      border-color: GrayText;
    }
  }
`;
