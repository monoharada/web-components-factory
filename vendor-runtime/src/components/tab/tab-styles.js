/**
 * Tab styles
 * DADS デザインシステム準拠のタブコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const tabStyles = css `
  :host {
    display: block;
    min-inline-size: 0;
    color: var(--dads-tab-color);
    font-family: var(--font-family-sans);
  }

  :host([hidden]) {
    display: none;
  }

  [part="base"] {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }

  [part="tablist"] {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    inline-size: 100%;
    margin: 0 0 -1px;
    padding: 0 1px 0 0;
  }

  #default-slot {
    z-index: 1;
    display: block;
    box-sizing: border-box;
    min-inline-size: 0;
    min-block-size: var(--_dads-tab-tablist-block-size, 0px);
    border: 1px solid var(--dads-tab-border-color);
    background: var(--tab-bg-panel);
    padding: var(--tab-panel-padding);
    color: var(--tab-panel-color);
    font-size: var(--tab-panel-font-size);
    font-weight: var(--tab-panel-font-weight);
    line-height: var(--tab-panel-line-height);
    letter-spacing: var(--tab-panel-letter-spacing);
  }

  [part~="tab"] {
    --_dads-tab-background: var(--dads-tab-background);
    --_dads-tab-indicator-color: var(--tab-indicator-idle);
    --_dads-tab-label-decoration: none;

    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin: 0 -1px 0 0;
    border: 1px solid var(--dads-tab-border-color);
    background: var(--_dads-tab-background);
    padding: 0;
    color: var(--dads-tab-color);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: var(--line-height-120, 1.2);
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
  }

  [part~="tab"]:focus {
    outline: none;
  }

  [part~="tab"]:focus-visible {
    z-index: 3;
  }

  /* DADSフォーカスリングは維持しつつ、タブ面は塗りつぶさない */
  :host button[part~="tab"][role="tab"]:focus-visible {
    background: var(--_dads-tab-background);
  }

  [part~="indicator"] {
    display: block;
    inline-size: 100%;
    block-size: var(--dads-tab-indicator-height);
    background: var(--_dads-tab-indicator-color);
    flex: 0 0 auto;
  }

  [part~="label"] {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--tab-padding-y) var(--tab-padding-x);
    color: inherit;
    font: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    text-align: center;
    text-decoration: var(--_dads-tab-label-decoration);
    text-decoration-thickness: var(--tab-underline-thickness);
    text-underline-offset: var(--tab-underline-offset);
  }

  [part~="tab"][aria-selected="true"] {
    --_dads-tab-indicator-color: var(--dads-tab-indicator-color);
    color: var(--dads-tab-color-selected);
    font-weight: var(--font-weight-700, 700);
    z-index: 2;
  }

  :host([orientation="top"]) [part~="tab"][aria-selected="true"] {
    border-top: 0;
    border-right: 1px solid var(--dads-tab-border-color);
    border-bottom: 0;
    border-left: 1px solid var(--dads-tab-border-color);
  }

  :host([orientation="top"]) [part~="tab"][aria-selected="true"]::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: -1px;
    inline-size: calc(100% + 2px);
    block-size: var(--dads-tab-indicator-height);
    background: var(--dads-tab-indicator-color);
    pointer-events: none;
  }

  :host([orientation="top"]) [part~="tab"][aria-selected="true"] [part~="indicator"] {
    background: transparent;
  }

  [part~="tab"][aria-disabled="true"] {
    color: var(--dads-tab-color-disabled);
    cursor: not-allowed;
  }

  @media (any-hover: hover) {
    [part~="tab"]:not([aria-selected="true"]):not([aria-disabled="true"]):hover {
      --_dads-tab-background: var(--dads-tab-background-hover);
      --_dads-tab-label-decoration: underline;
    }

    [part~="tab"]:not([aria-selected="true"]):not([aria-disabled="true"]):hover {
      --_dads-tab-indicator-color: var(--dads-tab-border-color);
    }
  }

  ::slotted([part~="tabpanel"]) {
    display: block;
    box-sizing: border-box;
    margin: 0;
    border: 0;
    padding: 0;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
  }

  ::slotted([part~="tabpanel"][hidden]) {
    display: none;
  }

  :host([orientation="bottom"]) [part="base"] {
    flex-direction: column-reverse;
  }

  :host([orientation="bottom"]) [part="tablist"] {
    margin: -1px 0 0;
  }

  :host([orientation="bottom"]) [part~="tab"] {
    flex-direction: column-reverse;
  }

  :host([orientation="bottom"]) [part~="tab"][aria-selected="true"] {
    border-top: 0;
    border-right: 1px solid var(--dads-tab-border-color);
    border-bottom: 0;
    border-left: 1px solid var(--dads-tab-border-color);
  }

  :host([orientation="bottom"]) [part~="tab"][aria-selected="true"]::after {
    content: '';
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: -1px;
    inline-size: calc(100% + 2px);
    block-size: var(--dads-tab-indicator-height);
    background: var(--dads-tab-indicator-color);
    pointer-events: none;
  }

  :host([orientation="bottom"]) [part~="tab"][aria-selected="true"] [part~="indicator"] {
    background: transparent;
  }

  :host([orientation="left"]) [part="base"] {
    flex-direction: row;
  }

  :host([orientation="left"]) [part="tablist"] {
    align-self: stretch;
    inline-size: var(--tab-vertical-list-width);
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0 -1px 0 0;
    padding: 0 0 1px;
  }

  :host([orientation="left"]) [part~="tab"] {
    inline-size: 100%;
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--tab-label-gap-vertical);
    margin: 0 0 -1px;
  }

  :host([orientation="left"]) [part~="label"] {
    flex: 1 1 auto;
    justify-content: flex-start;
    text-align: left;
  }

  :host([orientation="left"]) [part~="indicator"] {
    inline-size: var(--dads-tab-indicator-height);
    block-size: auto;
    align-self: stretch;
  }

  :host([orientation="left"]) [part~="tab"][aria-selected="true"] {
    border-top: 1px solid var(--dads-tab-border-color);
    border-right: 0;
    border-bottom: 1px solid var(--dads-tab-border-color);
    border-left: 0;
  }

  :host([orientation="left"]) #default-slot {
    flex: 1 1 auto;
    min-inline-size: 0;
  }

  :host([orientation="right"]) [part="base"] {
    flex-direction: row-reverse;
  }

  :host([orientation="right"]) [part="tablist"] {
    align-self: stretch;
    inline-size: var(--tab-vertical-list-width);
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0 0 0 -1px;
    padding: 0 0 1px;
  }

  :host([orientation="right"]) [part~="tab"] {
    inline-size: 100%;
    flex-direction: row-reverse;
    justify-content: flex-start;
    gap: var(--tab-label-gap-vertical);
    margin: 0 0 -1px;
  }

  :host([orientation="right"]) [part~="label"] {
    flex: 1 1 auto;
    justify-content: flex-start;
    text-align: left;
  }

  :host([orientation="right"]) [part~="indicator"] {
    inline-size: var(--dads-tab-indicator-height);
    block-size: auto;
    align-self: stretch;
  }

  :host([orientation="right"]) [part~="tab"][aria-selected="true"] {
    border-top: 1px solid var(--dads-tab-border-color);
    border-right: 0;
    border-bottom: 1px solid var(--dads-tab-border-color);
    border-left: 0;
  }

  :host([orientation="right"]) #default-slot {
    flex: 1 1 auto;
    min-inline-size: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    [part~="tab"] {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    [part~="tab"] {
      border-color: ButtonText;
      color: ButtonText;
    }

    [part~="tab"][aria-selected="true"] [part~="indicator"] {
      background: Highlight;
    }

    [part~="tab"][aria-disabled="true"] {
      color: GrayText;
    }

    #default-slot {
      border-color: ButtonText;
    }
  }
`;
