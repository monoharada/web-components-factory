/**
 * Step Navigation styles
 * DADS HTML版 step-navigation.css をShadow DOM向けに移植
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
export const stepNavigationStyles = css `
  :host {
    display: block;
    /* flex/grid内でも横スクロールで収まるように（min-width:autoによるはみ出し対策） */
    min-width: 0;
    color: var(--dads-step-navigation-color, var(--color-neutral-solid-gray-800, #333333));
    font-weight: 400;
    font-size: calc(16 / 16 * 1rem);
    line-height: 1.7;
    font-family: var(--font-family-sans);
    letter-spacing: 0.02em;
    overflow-wrap: anywhere;

    /* Size presets (inherited by items) */
    --_number-size: calc(44 / 16 * 1rem);
    --_number-margin: calc(4 / 16 * 1rem);
    --_outline-width: calc(2 / 16 * 1rem);
    --_title-margin: calc(24 / 16 * 1rem);
    --_description-margin: calc(8 / 16 * 1rem);
  }

  :host([size="small"]) {
    --_number-size: calc(32 / 16 * 1rem);
    --_number-margin: calc(3 / 16 * 1rem);
    --_outline-width: calc(1 / 16 * 1rem);
    --_title-margin: calc(16 / 16 * 1rem);
    --_description-margin: calc(4 / 16 * 1rem);
  }

  /* Orientation: Horizontal */
  :host([orientation="horizontal"]) {
    overflow-x: auto;
    padding-top: calc(6 / 16 * 1rem);
    padding-bottom: calc(6 / 16 * 1rem);
  }

  [part="list"] {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
  }

  :host([orientation="vertical"]) [part="list"] {
    flex-direction: column;
  }

  /* Status slot (screen-reader only) */
  ${visuallyHiddenPartStyles}

  /* NOTE: status slot visibility is controlled by JS (slot assignment),
     because :has(slot:empty) is not reliable in Safari/WebKit. */
`;
export const stepNavigationItemStyles = css `
  :host {
    display: block;
    box-sizing: border-box;
  }

  /* Default orientation/size fallbacks (when used standalone) */
  :host {
    --_sn-number-size: var(--_number-size, calc(44 / 16 * 1rem));
    --_sn-number-margin: var(--_number-margin, calc(4 / 16 * 1rem));
    --_sn-outline-width: var(--_outline-width, calc(2 / 16 * 1rem));
    --_sn-title-margin: var(--_title-margin, calc(24 / 16 * 1rem));
    --_sn-description-margin: var(--_description-margin, calc(8 / 16 * 1rem));
  }

  /* Step wrapper (pseudo elements draw the connector lines) */
  [part="step"] {
    position: relative;
    z-index: 0;
    box-sizing: border-box;
  }

  [part="step"]::before,
  [part="step"]::after {
    position: absolute;
    z-index: -1;
    content: '';
    border: 0 solid var(--dads-step-navigation-connector-color, currentColor);
  }

  :host([data-first]) [part="step"]::before {
    display: none;
  }

  :host([data-last]) [part="step"]::after {
    display: none;
  }

  /* Header */
  [part="header"] {
    display: block;
    border: 0;
    background: none;
    padding: 0;
    color: inherit;
    font: inherit;
    text-wrap: pretty;
  }

  [part="header"]:any-link,
  :host([interaction="button"]) [part="header"] {
    text-decoration: underline;
    text-decoration-thickness: calc(1 / 16 * 1rem);
    text-underline-offset: calc(3 / 16 * 1rem);
  }

  @media (hover: hover) {
    [part="header"]:any-link:hover,
    :host([interaction="button"]) [part="header"]:hover {
      text-decoration-thickness: calc(3 / 16 * 1rem);
      cursor: pointer;
    }
  }

  [part="header"]:focus-visible {
    border-radius: 0;
    outline: 0;
    box-shadow: none;
  }

  /* Number */
  [part="number"] {
    position: relative;
    z-index: 1;
    display: grid;
    place-content: center;
    margin: var(--_sn-number-margin);
    box-sizing: border-box;
    width: fit-content;
    height: var(--_sn-number-size);
    min-width: var(--_sn-number-size);
    border: 2px solid;
    border-radius: 50%;
    background-color: var(--dads-step-navigation-number-bg, var(--color-neutral-white, #ffffff));
    padding: 0 calc(2 / 16 * 1rem);
    font-weight: 700;
    font-size: calc(20 / 16 * 1rem);
    line-height: 1;
    letter-spacing: 0.02em;
    text-decoration: inherit;
    text-decoration-thickness: inherit;
  }

  :host([data-size="small"]) [part="number"] {
    margin: calc(3 / 16 * 1rem);
    border-width: 1px;
    font-size: calc(16 / 16 * 1rem);
  }

  :host([state="reached"]) [part="number"] {
    background-color: var(--dads-step-navigation-reached-number-bg, var(--color-neutral-solid-gray-800, #333333));
    color: var(--dads-step-navigation-reached-number-color, var(--color-neutral-white, #ffffff));
    border-color: var(--dads-step-navigation-reached-number-bg, var(--color-neutral-solid-gray-800, #333333));
  }

  :host([state="completed"]) [part="number"] {
    background-color: var(--dads-step-navigation-completed-number-bg, var(--color-neutral-solid-gray-50, #f2f2f2));
  }

  :host([state="error"]) [part="number"] {
    color: var(--dads-step-navigation-error-color, var(--color-semantic-error-1, #ec0000));
  }

  :host([state="skipped"]) [part="number"] {
    border-width: 1px;
    border-style: dashed;
  }

  :host([aria-current]) [part="number"] {
    outline: var(--_sn-outline-width) solid var(--dads-step-navigation-color, var(--color-neutral-solid-gray-800, #333333));
    outline-offset: calc(2 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-neutral-white, #ffffff);
  }

  @media (forced-colors: active) {
    :host([state="reached"]) [part="number"] {
      background-color: CanvasText;
      color: Canvas;
      forced-color-adjust: none;
    }
  }

  [part="header"]:focus-visible [part="number"] {
    outline: calc(4 / 16 * 1rem) solid var(--dads-step-navigation-focus-outline-color, var(--color-neutral-black, #000000));
    outline-offset: calc(2 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--dads-step-navigation-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
  }

  /* State icon */
  [part="state-icon"] {
    position: absolute;
    /* 状態アイコンが上方向にはみ出ないように（overflow-x の縦クリップ対策） */
    top: calc(-1 * var(--_sn-number-margin));
    left: calc(50% + calc(6 / 16 * 1rem));
    border-radius: 50%;
    background-color: var(--dads-step-navigation-state-badge-bg, var(--color-neutral-white, #ffffff));
  }

  :host([data-size="small"]) [part="state-icon"] {
    left: calc(50% + calc(4 / 16 * 1rem));
  }

  [part="state-icon"] > svg {
    display: block;
    max-width: none;
  }

  :host([data-size="small"]) [part="state-icon"] > svg {
    width: calc(20 / 16 * 1rem);
    height: calc(20 / 16 * 1rem);
  }

  /* State label (editing / error) */
  [part="state-label"] {
    position: absolute;
    inset: calc(100% + calc(8 / 16 * 1rem)) -100% 0;
    margin: 0 auto;
    width: 4em;
    height: 1.2em;
    background-color: var(--dads-step-navigation-state-badge-bg, var(--color-neutral-white, #ffffff));
    font-weight: 400;
    font-size: calc(14 / 16 * 1rem);
    line-height: 1.2;
    letter-spacing: 0;
    text-align: center;
  }

  /* Title / Description */
  [part="title"] {
    display: block;
    font-weight: 700;
    font-size: calc(18 / 16 * 1rem);
    line-height: 1.6;
    letter-spacing: 0.02em;
    text-decoration-thickness: inherit;
  }

  :host([data-size="small"]) [part="title"] {
    font-size: calc(16 / 16 * 1rem);
    line-height: 1.7;
  }

  [part="description"] {
    margin: var(--_sn-description-margin) 0 0;
  }

  /* NOTE: description slot visibility is controlled by JS (slot assignment),
     because :has(slot:empty) is not reliable in Safari/WebKit. */

  /* Screen-reader only */
  ${visuallyHiddenPartStyles}

  /* State visibility */
  [data-state-icon],
  [data-state-label],
  [data-state-sr] {
    display: none;
  }

  :host([state="completed"]) [data-state-icon="completed"],
  :host([state="editing"]) [data-state-icon="editing"],
  :host([state="error"]) [data-state-icon="error"] {
    display: block;
  }

  :host([state="editing"]) [data-state-label="editing"],
  :host([state="error"]) [data-state-label="error"] {
    display: block;
  }

  :host([state="completed"]) [data-state-sr="completed"],
  :host([state="skipped"]) [data-state-sr="skipped"] {
    display: inline;
  }

  @media (forced-colors: active) {
    :host([state="completed"]) [data-state-icon="completed"] circle {
      fill: CanvasText;
    }

    :host([state="completed"]) [data-state-icon="completed"] path {
      fill: Canvas;
    }

    :host([state="editing"]) [data-state-icon="editing"] path,
    :host([state="error"]) [data-state-icon="error"] path {
      fill: CanvasText;
    }
  }

  /* Orientations */
  /* Layout + connectors are applied via [data-orientation] (set by container) */

  /* Horizontal: default */
  :host {
    width: var(--dads-step-navigation-step-width, calc(320 / 16 * 1rem));
    min-width: var(--dads-step-navigation-step-min-width, calc(160 / 16 * 1rem));
  }

  [part="step"] {
    padding: 0 calc(16 / 16 * 1rem);
  }

  /* Horizontal (default) */
  :host(:not([data-orientation="vertical"])) [part="step"]::before {
    top: calc(var(--_sn-number-size) / 2 + var(--_sn-number-margin));
    right: 50%;
    width: 50%;
    height: 0;
    border-bottom-width: 1px;
  }

  :host(:not([data-orientation="vertical"])) [part="step"]::after {
    top: calc(var(--_sn-number-size) / 2 + var(--_sn-number-margin));
    left: 50%;
    width: 50%;
    height: 0;
    border-bottom-width: 1px;
  }

  [part="header"] {
    width: 100%;
    text-align: center;
  }

  [part="number"] {
    margin-right: auto;
    margin-left: auto;
  }

  [part="title"] {
    margin-top: var(--_sn-title-margin);
  }

  [part="description"] {
    text-align: center;
  }

  /* Vertical */
  :host([data-orientation="vertical"]) {
    width: auto;
    min-width: 0;
    flex: 1;
  }

  :host([data-orientation="vertical"]) [part="step"] {
    padding: 0 0 calc(24 / 16 * 1rem);
  }

  :host([data-orientation="vertical"][data-last]) [part="step"] {
    padding-bottom: 0;
  }

  :host([data-orientation="vertical"]) [part="step"]::before {
    left: calc(var(--_sn-number-size) / 2 + var(--_sn-number-margin));
    top: 0;
    width: 0;
    height: calc(32 / 16 * 1rem);
    border-right-width: 1px;
  }

  :host([data-orientation="vertical"]) [part="step"]::after {
    left: calc(var(--_sn-number-size) / 2 + var(--_sn-number-margin));
    bottom: 0;
    width: 0;
    height: calc(100% - calc(32 / 16 * 1rem));
    border-right-width: 1px;
  }

  :host([data-orientation="vertical"]) [part="header"] {
    position: relative;
    display: flex;
    align-items: baseline;
    column-gap: calc(16 / 16 * 1rem);
    text-align: left;
  }

  :host([data-orientation="vertical"]) [part="number"] {
    margin-right: var(--_sn-number-margin);
    margin-left: var(--_sn-number-margin);
    flex-shrink: 0;
  }

  :host([data-orientation="vertical"]) [part="title"] {
    margin-top: 0;
    padding: calc(var(--_sn-number-size) / 2 + var(--_sn-number-margin) - 0.875rem) 0;
  }

  :host([data-orientation="vertical"]) [part="description"] {
    text-align: left;
    margin-top: calc(
      var(--_sn-description-margin) -
        (var(--_sn-number-size) / 2 + var(--_sn-number-margin) - 0.875rem)
    );
    padding-left: calc(
      var(--_sn-number-size) + var(--_sn-number-margin) + var(--_sn-number-margin) +
        calc(16 / 16 * 1rem)
    );
  }

  /* Icon colors */
  [data-state-icon="completed"] circle {
    fill: var(--dads-step-navigation-completed-icon-circle, var(--color-neutral-solid-gray-600, #666666));
  }

  [data-state-icon="completed"] path {
    fill: var(--dads-step-navigation-completed-icon-check, var(--color-neutral-white, #ffffff));
  }

  [data-state-icon="editing"] path {
    fill: var(--dads-step-navigation-editing-icon-color, var(--color-neutral-solid-gray-800, #333333));
  }

  [data-state-icon="error"] path {
    fill: var(--dads-step-navigation-error-icon-color, var(--color-semantic-error-1, #ec0000));
  }
`;
