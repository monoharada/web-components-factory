/**
 * DatePickerコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 date-picker.css 相当をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';
export const datePickerStyles = css `
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

  /* 視覚的に隠す（スクリーンリーダー向けテキスト用） */
  [part="visually-hidden"] {
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

  [part="controls"] {
    position: relative;
    display: flex;
    align-items: flex-end;
    column-gap: var(--spacing-4);
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
    border-radius: var(--spacing-2);
    border: 1px solid var(--color-neutral-solid-gray-600);
    background-color: var(--_background-color);
    padding: 2px 0 2px 2px; /* hairline spacing */
  }

  :host([size="sm"][data-type="consolidated"]) [part="inputs"] {
    height: var(--spacing-10);
  }

  :host([size="md"][data-type="consolidated"]) [part="inputs"] {
    height: var(--spacing-12);
  }

  :host([size="lg"][data-type="consolidated"]) [part="inputs"] {
    height: 3.5rem; /* 56px - spacing-14が存在しないため */
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
    margin-left: calc(var(--spacing-1) * -1);
  }

  :host([data-type="consolidated"]) :is([part~="month"], [part~="day"]):last-child {
    padding-right: var(--spacing-4);
  }

  :host([data-type="consolidated"]) [part="field-label"] {
    position: relative;
    z-index: 1;
    align-self: center;
    background-color: var(--_background-color);
    padding: var(--spacing-1);
    line-height: 1;
  }

  :host([data-type="consolidated"]) [part="field-input"] {
    margin-right: calc(var(--spacing-1) * -1);
    box-sizing: border-box;
    width: var(--spacing-16);
    border-radius: var(--spacing-2);
    border: 1px solid transparent;
    background-color: transparent;
    padding-right: var(--spacing-3);
    text-align: right;
  }

  :host([data-type="consolidated"]) [part="field-input"]:focus {
    outline: var(--spacing-1) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5);
    border: 1px solid var(--color-neutral-solid-gray-600);
    box-shadow: 0 0 0 var(--spacing-0-5) var(--color-primitive-yellow-300);
  }

  :host([data-type="consolidated"]) :is([part~="month"], [part~="day"]) [part="field-input"] {
    width: 2.75rem; /* 44px - spacing-11が存在しないため */
  }

  /* --- Separated（分割型） --- */
  :host([data-type="separated"]) [part="inputs"] {
    display: inline-flex;
    column-gap: var(--spacing-4);
    box-sizing: content-box;
    padding-top: var(--spacing-3);
  }

  :host([size="sm"][data-type="separated"]) [part="inputs"] {
    height: var(--spacing-10);
  }

  :host([size="md"][data-type="separated"]) [part="inputs"] {
    height: var(--spacing-12);
  }

  :host([size="lg"][data-type="separated"]) [part="inputs"] {
    height: 3.5rem; /* 56px - spacing-14が存在しないため */
  }

  :host([data-type="separated"]) [part~="field"] {
    position: relative;
  }

  :host([data-type="separated"]) [part="field-label"] {
    position: absolute;
    top: calc(var(--spacing-3) * -1);
    right: 0;
    left: 0;
    margin: 0 auto;
    box-sizing: border-box;
    width: var(--spacing-6);
    background-color: var(--color-neutral-white);
    padding: var(--spacing-1);
    line-height: 1;
  }

  :host([data-type="separated"]) [part="inputs"][data-disabled] [part="field-label"] {
    color: var(--color-neutral-solid-gray-420);
  }

  @media (forced-colors: active) {
    :host([data-type="separated"]) [part="inputs"][data-disabled] [part="field-label"] {
      color: GrayText;
    }
  }

  :host([data-type="separated"]) [part="field-input"] {
    box-sizing: border-box;
    width: 4.5rem; /* 72px - spacing-18が存在しないため */
    height: 100%;
    border-radius: var(--spacing-2);
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
    outline: var(--spacing-1) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5);
    box-shadow: 0 0 0 var(--spacing-0-5) var(--color-primitive-yellow-300);
  }

  :host([data-type="separated"]) [part="field-input"]:disabled {
    border-color: var(--color-neutral-solid-gray-600);
    background-color: var(--color-neutral-solid-gray-50);
    color: var(--color-neutral-solid-gray-420);
  }

  :host([data-type="separated"]) :is([part~="month"], [part~="day"]) [part="field-input"] {
    width: 3.5rem; /* 56px - spacing-14が存在しないため */
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
    column-gap: var(--spacing-1);
    border-radius: var(--spacing-1-5);
    border: 1px solid;
    background-color: var(--color-neutral-white);
    padding-right: var(--spacing-3);
    padding-left: var(--spacing-3);
    color: var(--color-primitive-blue-900);
  }

  :host([size="sm"]) [part="calendar-button"] {
    height: var(--spacing-10);
  }

  :host([size="md"]) [part="calendar-button"] {
    height: var(--spacing-12);
  }

  :host([size="lg"]) [part="calendar-button"] {
    height: 3.5rem; /* 56px - spacing-14が存在しないため */
  }

  @media (hover: hover) {
    [part="calendar-button"]:enabled:hover {
      border-width: 3px; /* hover時のボーダー幅 */
      padding-right: var(--spacing-2-5);
      padding-left: var(--spacing-2-5);
    }
  }

  [part="calendar-button"]:focus-visible {
    outline: var(--spacing-1) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5);
    border-radius: var(--spacing-1);
    box-shadow: 0 0 0 var(--spacing-0-5) var(--color-primitive-yellow-300);
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
    width: var(--spacing-6);
    height: var(--spacing-6);
  }

  [part="calendar-chevron"] {
    width: var(--spacing-4);
    height: var(--spacing-4);
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
    border-radius: var(--spacing-2);
    border: 1px solid var(--color-neutral-solid-gray-420);
    background-color: var(--color-neutral-white);
    box-shadow: var(--elevation-1);
  }

  [part="error-text"] {
    margin: var(--spacing-2) 0 0;
    color: var(--color-semantic-error-1);
    line-height: 1.7;
  }
`;
