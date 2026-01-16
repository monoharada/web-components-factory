/**
 * DatePickerコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 date-picker.css 相当をShadow DOM向けに移植
 */

import { css } from '../../core/web-components.js';

export const datePickerStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    color: var(--color-neutral-solid-gray-800);
    font-weight: 400;
    font-size: calc(16 / 16 * 1rem);
    line-height: 1.7;
    font-family: var(--font-family-sans);
    letter-spacing: 0.02em;
  }

  [part="controls"] {
    position: relative;
    display: flex;
    align-items: end;
    column-gap: calc(16 / 16 * 1rem);
  }

  /* ============================================================
   * Inputs (consolidated / separated)
   * ============================================================ */

  /* 共通: input */
  [part="field-input"] {
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    color: inherit;
  }

  /* --- Consolidated（統合型） --- */
  :host([data-type="consolidated"]) [part="inputs"] {
    --_background-color: var(--color-neutral-white);
    display: inline-flex;
    box-sizing: border-box;
    border-radius: calc(8 / 16 * 1rem);
    border: 1px solid var(--color-neutral-solid-gray-600);
    background-color: var(--_background-color);
    padding: calc(2 / 16 * 1rem) 0 calc(2 / 16 * 1rem) calc(2 / 16 * 1rem);
  }

  :host([size="sm"][data-type="consolidated"]) [part="inputs"] {
    height: calc(40 / 16 * 1rem);
  }

  :host([size="md"][data-type="consolidated"]) [part="inputs"] {
    height: calc(48 / 16 * 1rem);
  }

  :host([size="lg"][data-type="consolidated"]) [part="inputs"] {
    height: calc(56 / 16 * 1rem);
  }

  :host([data-type="consolidated"]) [part="inputs"]:focus-within {
    border-color: var(--color-neutral-black);
  }

  @media (hover: hover) {
    :host([data-type="consolidated"]) [part="inputs"]:hover {
      border-color: var(--color-neutral-solid-gray-900);
    }
  }

  :host([data-type="consolidated"]) [part="inputs"][data-error] {
    border-color: var(--color-semantic-error-1);
  }

  :host([data-type="consolidated"]) [part="inputs"][data-error]:focus-within {
    border-color: var(--color-primitive-red-1000);
  }

  :host([data-type="consolidated"]) [part="inputs"][data-disabled] {
    --_background-color: var(--color-neutral-solid-gray-50);
    border-color: var(--color-neutral-solid-gray-300);
    color: var(--color-neutral-solid-gray-420);
  }

  :host([data-type="consolidated"]) [part="inputs"][data-readonly] {
    border-style: dashed;
    border-color: var(--color-neutral-solid-gray-600);
  }

  @media (forced-colors: active) {
    :host([data-type="consolidated"]) [part="inputs"]:focus-within {
      border-color: Highlight;
    }

    @media (hover: hover) {
      :host([data-type="consolidated"]) [part="inputs"]:hover {
        border-color: Highlight;
      }
    }

    :host([data-type="consolidated"]) [part="inputs"][data-disabled] {
      --_background-color: ButtonFace;
      border-color: GrayText;
      color: GrayText;
    }

    :host([data-type="consolidated"]) [part="inputs"][data-readonly] {
      border-color: currentcolor;
    }
  }

  :host([data-type="consolidated"]) [part~="field"] {
    position: relative;
    z-index: 0;
    display: inline-flex;
    flex-direction: row-reverse;
  }

  :host([data-type="consolidated"]) :is([part~="month"], [part~="day"]):not(:first-child) {
    margin-left: calc(-4 / 16 * 1rem);
  }

  :host([data-type="consolidated"]) :is([part~="month"], [part~="day"]):last-child {
    padding-right: calc(16 / 16 * 1rem);
  }

  :host([data-type="consolidated"]) [part="field-label"] {
    position: relative;
    z-index: 1;
    align-self: center;
    background-color: var(--_background-color);
    padding: calc(4 / 16 * 1rem);
    line-height: 1;
  }

  :host([data-type="consolidated"]) [part="field-input"] {
    margin-right: calc(-4 / 16 * 1rem);
    box-sizing: border-box;
    width: calc(64 / 16 * 1rem);
    border-radius: calc(8 / 16 * 1rem);
    border: 1px solid transparent;
    background-color: transparent;
    padding-right: calc(12 / 16 * 1rem);
    text-align: right;
  }

  :host([data-type="consolidated"]) [part="field-input"]:focus {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    border: 1px solid var(--color-neutral-solid-gray-600);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  :host([data-type="consolidated"]) :is([part~="month"], [part~="day"]) [part="field-input"] {
    width: calc(44 / 16 * 1rem);
  }

  /* --- Separated（分割型） --- */
  :host([data-type="separated"]) [part="inputs"] {
    display: inline-flex;
    column-gap: calc(16 / 16 * 1rem);
    box-sizing: content-box;
    padding-top: calc(12 / 16 * 1rem);
  }

  :host([size="sm"][data-type="separated"]) [part="inputs"] {
    height: calc(40 / 16 * 1rem);
  }

  :host([size="md"][data-type="separated"]) [part="inputs"] {
    height: calc(48 / 16 * 1rem);
  }

  :host([size="lg"][data-type="separated"]) [part="inputs"] {
    height: calc(56 / 16 * 1rem);
  }

  :host([data-type="separated"]) [part~="field"] {
    position: relative;
  }

  :host([data-type="separated"]) [part="field-label"] {
    position: absolute;
    top: calc(-12 / 16 * 1rem);
    right: 0;
    left: 0;
    margin: 0 auto;
    box-sizing: border-box;
    width: calc(24 / 16 * 1rem);
    background-color: var(--color-neutral-white);
    padding: calc(4 / 16 * 1rem);
    line-height: 1;
  }

  :host([data-type="separated"]) [part="field-label"]:has(+ :disabled) {
    color: var(--color-neutral-solid-gray-420);
  }

  @media (forced-colors: active) {
    :host([data-type="separated"]) [part="field-label"]:has(+ :disabled) {
      color: GrayText;
    }
  }

  :host([data-type="separated"]) [part="field-input"] {
    box-sizing: border-box;
    width: calc(72 / 16 * 1rem);
    height: 100%;
    border-radius: calc(8 / 16 * 1rem);
    border: 1px solid var(--color-neutral-solid-gray-600);
    background-color: var(--color-neutral-white);
    text-align: center;
  }

  :host([data-type="separated"]) [part="field-input"]:read-only:not(:disabled) {
    border-style: dashed;
  }

  :host([data-type="separated"]) [part="field-input"][aria-invalid="true"] {
    border-color: var(--color-semantic-error-1);
  }

  @media (hover: hover) {
    :host([data-type="separated"]) [part="field-input"]:not(:read-only):hover {
      border-color: var(--color-neutral-solid-gray-900);
    }

    :host([data-type="separated"]) [part="field-input"][aria-invalid="true"]:hover {
      border-color: var(--color-primitive-red-1000);
    }
  }

  :host([data-type="separated"]) [part="field-input"]:focus-visible {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  :host([data-type="separated"]) [part="field-input"]:disabled {
    border-color: var(--color-neutral-solid-gray-600);
    background-color: var(--color-neutral-solid-gray-50);
    color: var(--color-neutral-solid-gray-420);
  }

  :host([data-type="separated"]) :is([part~="month"], [part~="day"]) [part="field-input"] {
    width: calc(56 / 16 * 1rem);
  }

  @media (forced-colors: active) {
    :host([data-type="separated"]) [part="field-input"]:disabled {
      border-color: GrayText;
      color: GrayText;
    }
  }

  /* ============================================================
   * Calendar button / popover
   * ============================================================ */

  [part="calendar-button"] {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: calc(4 / 16 * 1rem);
    border-radius: calc(6 / 16 * 1rem);
    border: 1px solid;
    background-color: var(--color-neutral-white);
    padding-right: calc(12 / 16 * 1rem);
    padding-left: calc(12 / 16 * 1rem);
    color: var(--color-primitive-blue-900);
  }

  :host([size="sm"]) [part="calendar-button"] {
    height: calc(40 / 16 * 1rem);
  }

  :host([size="md"]) [part="calendar-button"] {
    height: calc(48 / 16 * 1rem);
  }

  :host([size="lg"]) [part="calendar-button"] {
    height: calc(56 / 16 * 1rem);
  }

  @media (hover: hover) {
    [part="calendar-button"]:enabled:hover {
      border-width: calc(3 / 16 * 1rem);
      padding-right: calc(10 / 16 * 1rem);
      padding-left: calc(10 / 16 * 1rem);
    }
  }

  [part="calendar-button"]:focus-visible {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    border-radius: calc(4 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  [part="calendar-button"]:disabled {
    cursor: default;
    background-color: var(--color-neutral-white);
    color: var(--color-neutral-solid-gray-300);
    text-decoration: none;
  }

  @media (forced-colors: active) {
    [part="calendar-button"]:disabled {
      border-color: GrayText;
      color: GrayText;
    }
  }

  [part="calendar-icon"] {
    width: calc(24 / 16 * 1rem);
    height: calc(24 / 16 * 1rem);
  }

  [part="calendar-chevron"] {
    width: calc(16 / 16 * 1rem);
    height: calc(16 / 16 * 1rem);
  }

  [part="calendar-button"][aria-expanded="true"] [part="calendar-chevron"] {
    rotate: 180deg;
  }

  [part="backdrop"] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  [part="calendar-popover"] {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    border-radius: calc(8 / 16 * 1rem);
    border: 1px solid var(--color-neutral-solid-gray-420);
    background-color: var(--color-neutral-white);
    box-shadow: var(--elevation-1);
  }

  [part="error-text"] {
    margin: calc(8 / 16 * 1rem) 0 0;
    color: var(--color-semantic-error-1);
    line-height: 1.7;
  }
`;

