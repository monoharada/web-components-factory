/**
 * Menu List Box styles (DADS準拠)
 */
import { css } from '../../core/web-components.js';

export const menuListBoxStyles = css`
  :host {
    position: relative;
    display: block;
    width: fit-content;
    min-width: var(--dads-menu-list-box-min-width);
    color: var(--dads-menu-list-box-color);
    font-weight: var(--font-weight-400, 400);
    font-size: var(--dads-menu-list-box-font-size);
    line-height: var(--dads-menu-list-box-line-height);
    font-family: var(--dads-menu-list-box-font-family);
    letter-spacing: var(--dads-menu-list-box-letter-spacing);

    --_dads-menu-list-box-popup-min-width: var(--dads-menu-list-box-popup-min-width);
    --_dads-menu-list-box-popup-border-radius: var(--dads-menu-list-box-popup-border-radius);
    --_dads-menu-list-box-popup-border-color: var(--dads-menu-list-box-popup-border-color);
    --_dads-menu-list-box-popup-item-divider: var(--dads-menu-list-box-popup-item-divider);
  }

  :host([data-has-popup-scrollbar]) {
    --_dads-menu-list-box-popup-min-width: var(--dads-menu-list-box-popup-min-width-scroll);
    --_dads-menu-list-box-popup-border-color: var(--dads-menu-list-box-popup-border-color-scroll);
    --_dads-menu-list-box-popup-item-divider: var(--dads-menu-list-box-popup-item-divider-scroll);
  }

  [part="opener"] {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    min-height: var(--dads-menu-list-box-opener-min-height);
    border-radius: var(--dads-menu-list-box-opener-border-radius);
    border: var(--dads-menu-list-box-opener-border-width) solid
      var(--dads-menu-list-box-opener-border-color);
    background-color: var(--dads-menu-list-box-opener-background);
    padding-top: var(--dads-menu-list-box-opener-padding-y);
    padding-bottom: var(--dads-menu-list-box-opener-padding-y);
    padding-right: var(--dads-menu-list-box-opener-padding-x);
    padding-left: var(--dads-menu-list-box-opener-padding-x);
    column-gap: var(--dads-menu-list-box-opener-gap);
    color: inherit;
    font: inherit;
    font-weight: var(--dads-menu-list-box-opener-font-weight);
    letter-spacing: inherit;
  }

  [part="opener-label"] {
    display: inline-flex;
    flex: 1 1 auto;
    min-width: 0;
    align-items: center;
  }

  @media (any-hover: hover) {
    [part="opener"]:hover {
      --dads-menu-list-box-opener-background: var(--dads-menu-list-box-opener-hover-background);
      --dads-menu-list-box-opener-border-color: var(--dads-menu-list-box-opener-hover-border-color);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: var(--dads-menu-list-box-opener-underline-offset);
    }
  }

  [part="opener"]:focus {
    outline: none;
  }

  [part="opener"]:focus-visible {
    outline: var(--dads-menu-list-box-opener-focus-outline-width) solid
      var(--dads-menu-list-box-opener-focus-outline-color);
    outline-offset: var(--dads-menu-list-box-opener-focus-outline-offset);
    background-color: var(--dads-menu-list-box-opener-focus-background);
    box-shadow: 0 0 0 var(--dads-menu-list-box-opener-focus-ring-width)
      var(--dads-menu-list-box-opener-focus-ring-color);
  }

  [part="opener-icon"] {
    display: none;
    flex-shrink: 0;
    width: var(--dads-menu-list-box-opener-icon-size);
    height: var(--dads-menu-list-box-opener-icon-size);
  }

  :host([data-has-opener-icon]) [part="opener-icon"] {
    display: inline-flex;
    align-items: center;
  }

  [part="opener-arrow"] {
    margin-top: var(--dads-menu-list-box-opener-arrow-margin-top);
    margin-left: var(--dads-menu-list-box-opener-arrow-margin-left);
    flex-shrink: 0;
    width: var(--dads-menu-list-box-opener-arrow-size);
    height: var(--dads-menu-list-box-opener-arrow-size);
  }

  [part="opener"][aria-expanded="true"] [part="opener-arrow"] {
    transform: rotate(180deg);
  }

  :host([opener-hidden]) [part="opener"] {
    display: none;
  }

  [part="popup"] {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: var(--dads-menu-list-box-popup-z-index);
    box-sizing: border-box;
    width: max-content;
    max-height: var(--dads-menu-list-box-popup-max-height);
    min-width: var(--_dads-menu-list-box-popup-min-width);
    overflow-y: auto;
    border-radius: var(--_dads-menu-list-box-popup-border-radius);
    border: 1px solid var(--_dads-menu-list-box-popup-border-color);
    background-color: var(--dads-menu-list-box-popup-background);
    padding: var(--dads-menu-list-box-popup-padding-y) var(--dads-menu-list-box-popup-padding-x);
    box-shadow: var(--dads-menu-list-box-popup-shadow);
  }

  /* hidden 属性は minimal reset の display 指定で上書きされるため、明示的に非表示にする */
  [part="popup"][hidden] {
    display: none;
  }

  [part="menu"] {
    display: block;
  }

  :host([data-reserve-item-start-icon-space]) ::slotted(dads-menu-list-item) {
    --dads-menu-list-item-start-icon-display-empty: inline-flex;
  }

  ::slotted(dads-menu-list-item) {
    border-bottom: var(--_dads-menu-list-box-popup-item-divider);
  }

  ::slotted(dads-menu-list-item:last-child) {
    border-bottom: none;
  }

  :host ::slotted([data-menu-list-box-divider]),
  :host ::slotted(hr) {
    display: block;
    box-sizing: border-box;
    height: 0;
    border: 0;
    border-top: 1px solid
      var(
        --dads-menu-list-box-divider-color,
        var(--color-neutral-opacity-gray-420, rgba(0, 0, 0, 0.42))
      );
    /*
     * margin-block は外部のリセット（例: * { margin: 0 }）で潰れることがあるため、
     * デフォルト値の適用は menu-list-box 側で inline-style にも反映する。
     */
    margin-block: var(--dads-menu-list-box-divider-margin-block, var(--spacing-4, 1rem));
    margin-inline: 0;

    position: relative;
    inset-inline-start: var(--dads-menu-list-box-divider-margin-inline, var(--spacing-4, 1rem));
    inline-size: calc(
      100% - var(--dads-menu-list-box-divider-margin-inline, var(--spacing-4, 1rem)) -
        var(--dads-menu-list-box-divider-margin-inline, var(--spacing-4, 1rem))
    );
  }

  /* Forced colors */
  @media (forced-colors: active) {
    [part="opener"] {
      border: 1px solid ButtonText;
      color: ButtonText;
      background-color: Canvas;
    }

    [part="opener"]:focus-visible {
      outline-color: ButtonText;
      box-shadow: 0 0 0 var(--dads-menu-list-box-opener-focus-ring-width) ButtonText;
    }

    [part="popup"] {
      border-color: ButtonText;
      background-color: Canvas;
      box-shadow: none;
    }
  }
`;
