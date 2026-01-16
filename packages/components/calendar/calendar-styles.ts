/**
 * Calendarコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 calendar.css / select.css 相当をShadow DOM向けに移植
 */

import { css } from '../../core/web-components.js';

export const calendarStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
    color: var(--color-neutral-solid-gray-800);
    font-weight: 400;
    font-size: calc(16 / 16 * 1rem);
    line-height: 1;
    font-family: var(--font-family-sans);
    letter-spacing: 0.02em;
    /* Override hooks (consumer can set on <dads-calendar>) */
    --dads-calendar-control-size-default: calc(44 / 16 * 1rem);
    --_dads-calendar-control-size: var(
      --dads-calendar-control-size,
      var(--dads-calendar-control-size-default)
    );
  }

  /* 見出し（スクリーンリーダー通知用） */
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

  /* ========== Controls ========== */
  [part="controls"] {
    display: flex;
    align-items: center;
    column-gap: calc(8 / 16 * 1rem);
    padding: calc(16 / 16 * 1rem);
  }

  [part="navigation"] {
    display: flex;
    align-items: center;
  }

  /* ========== Select（select.css相当） ========== */
  [part="select-control"] {
    position: relative;
    display: block;
    width: fit-content;
  }

  [part="year-select"] {
    vertical-align: middle;
    box-sizing: border-box;
    border-radius: calc(8 / 16 * 1rem);
    border: 1px solid var(--color-neutral-solid-gray-600);
    background-color: var(--color-neutral-white);
    padding-right: calc(40 / 16 * 1rem);
    padding-left: calc(16 / 16 * 1rem);
    color: inherit;
    font: inherit;
    line-height: 1;
    letter-spacing: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  [part="year-select"][data-size="sm"] {
    height: var(--_dads-calendar-control-size);
  }

  [part="year-select"]:focus-visible {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  @media (hover: hover) {
    [part="year-select"]:hover {
      border-color: var(--color-neutral-black);
    }
  }

  [part="select-chevron"] {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: calc(16 / 16 * 1rem);
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    width: calc(16 / 16 * 1rem);
    height: calc(16 / 16 * 1rem);
  }

  [part="year-select"]:disabled + [part="select-chevron"] {
    color: var(--color-neutral-solid-gray-420);
  }

  @media (forced-colors: active) {
    [part="year-select"] {
      color: ButtonText;
      border-color: ButtonText;
    }

    [part="year-select"]:disabled,
    [part="year-select"]:disabled:hover {
      border-color: GrayText;
      color: GrayText;
    }

    [part="select-chevron"] {
      color: ButtonText;
    }

    [part="year-select"]:disabled + [part="select-chevron"] {
      color: GrayText;
    }
  }

  /* ========== Navigation buttons（dads-button secondary） ========== */
  [part~="nav-button"] {
    /* icon-only */
    --dads-button-padding: 0;
    --dads-button-min-height: var(--_dads-calendar-control-size);
    --dads-button-width: var(--_dads-calendar-control-size);
    --dads-button-min-width: var(--_dads-calendar-control-size);
    --dads-button-aspect-ratio: 1 / 1;
    --dads-button-icon-gap: 0;
  }

  [part~="nav-button"]::part(label),
  [part~="nav-button"]::part(icon-end) {
    display: none;
  }

  [part="current-month"] {
    margin: 0;
    align-self: center;
    width: calc(56 / 16 * 1rem);
    text-align: center;
  }

  /* ========== Table ========== */
  [part="table"] {
    margin-right: calc(12 / 16 * 1rem);
    margin-bottom: calc(8 / 16 * 1rem);
    margin-left: calc(12 / 16 * 1rem);
    width: auto;
    border-collapse: collapse;
  }

  [part="header-cell"] {
    width: calc(48 / 16 * 1rem);
    height: calc(48 / 16 * 1rem);
    padding: 0;
    color: var(--color-neutral-solid-gray-700);
    font-weight: 700;
    text-align: center;
    vertical-align: middle;
  }

  [part="data-cell"] {
    padding: 0;
    position: relative;
  }

  [part="date"] {
    margin: calc(4 / 16 * 1rem);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: calc(40 / 16 * 1rem);
    height: calc(40 / 16 * 1rem);
    border-radius: 50%;
    border: 0;
    background-color: transparent;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-underline-offset: calc(3 / 16 * 1rem);
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  /* range: 期間内のライン */
  :host([range]) [part="data-cell"][data-in-range]::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: calc(2 / 16 * 1rem);
    background-color: var(--color-primitive-blue-900, #0017c1);
    z-index: 0;
  }

  :host([range]) [part="data-cell"][data-in-range][data-range-start]::before {
    left: 50%;
  }

  :host([range]) [part="data-cell"][data-in-range][data-range-end]::before {
    right: 50%;
  }

  @media (hover: hover) {
    [part="date"]:hover {
      background-color: var(--color-neutral-solid-gray-50);
      text-decoration: underline;
    }
  }

  [part="date"]:focus-visible {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    background-color: var(--color-primitive-yellow-300);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  [part="date"][data-selected] {
    border: 1px solid transparent;
    background-color: var(--color-primitive-blue-900);
    color: var(--color-neutral-white);
  }

  [part="date"]:disabled {
    visibility: hidden;
  }

  /* ========== Footer ========== */
  [part="footer"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: calc(16 / 16 * 1rem);
    box-sizing: border-box;
    width: 100%;
    padding: calc(16 / 16 * 1rem);
  }

  /* Footer buttons: DADS calendar.css 相当のサイズ感に調整 */
  [part~="footer-button"] {
    --dads-button-min-height: var(--_dads-calendar-control-size);
  }

  /* ========== Range (Start/End) ========== */
  [part="range"] {
    box-sizing: border-box;
    width: 100%;
    padding: 0 calc(16 / 16 * 1rem) calc(16 / 16 * 1rem);
  }

  [part="support-text"] {
    margin: 0 0 calc(8 / 16 * 1rem);
    color: var(--color-neutral-solid-gray-700);
    font-size: calc(14 / 16 * 1rem);
    line-height: 1.5;
  }

  [part="range-item"] {
    margin: 0;
    display: flex;
    column-gap: calc(8 / 16 * 1rem);
    align-items: baseline;
  }

  [part="range-label"] {
    flex: 0 0 auto;
    font-weight: 700;
  }

  [part="range-value"] {
    flex: 1 1 auto;
  }

`;
