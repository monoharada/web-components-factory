/**
 * Calendarコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 calendar.css / select.css 相当をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';
export const calendarStyles = css `
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
    column-gap: var(--spacing-2);
    padding: var(--spacing-4);
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
    border-radius: var(--spacing-2);
    border: 1px solid var(--color-neutral-solid-gray-600);
    background-color: var(--color-neutral-white);
    padding-right: var(--spacing-10);
    padding-left: var(--spacing-4);
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
    outline: var(--spacing-1) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5);
    box-shadow: 0 0 0 var(--spacing-0-5) var(--color-primitive-yellow-300);
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
    right: var(--spacing-4);
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    width: var(--spacing-4);
    height: var(--spacing-4);
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
    width: 3.5rem; /* 56px - 固定幅のため数値指定 */
    text-align: center;
  }

  /* ========== Table ========== */
  [part="table"] {
    margin-right: var(--spacing-3);
    margin-bottom: var(--spacing-2);
    margin-left: var(--spacing-3);
    width: auto;
    border-collapse: collapse;
  }

  [part="header-cell"] {
    width: var(--spacing-12);
    height: var(--spacing-12);
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
    margin: var(--spacing-1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--spacing-10);
    height: var(--spacing-10);
    border-radius: 50%;
    border: 0;
    background-color: transparent;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-underline-offset: var(--spacing-0-5);
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
    height: 2px; /* hairline - ボーダー幅なのでpx指定 */
    background-color: var(--color-primitive-blue-900, #0017c1);
    z-index: 0;
  }

  :host([range]) [part="data-cell"][data-in-range][data-range-start]::before {
    left: 50%;
  }

  :host([range]) [part="data-cell"][data-in-range][data-range-end]::before {
    right: 50%;
  }

  :host([range]) [part="data-cell"][data-in-range]:not([data-range-start]):not([data-range-end]) [part="date"] {
    border: 1px solid var(--color-primitive-blue-900);
    background-color: var(--color-primitive-blue-50);
    color: inherit;
  }

  @media (hover: hover) {
    [part="date"]:not(:disabled):hover {
      background-color: var(--color-neutral-solid-gray-50);
      text-decoration: underline;
    }
  }

  [part="date"]:not(:disabled):not([data-selected]):active {
    background-color: transparent;
    color: inherit;
    text-decoration: underline;
  }

  [part="date"][data-selected]:is(:hover, :active) {
    background-color: var(--color-primitive-blue-900);
    color: var(--color-neutral-white);
    text-decoration: underline;
  }

  [part="date"]:focus-visible {
    outline: var(--spacing-1) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5);
    background-color: var(--color-primitive-yellow-300);
    box-shadow: 0 0 0 var(--spacing-0-5) var(--color-primitive-yellow-300);
  }

  [part="date"][data-selected] {
    border: 1px solid transparent;
    background-color: var(--color-primitive-blue-900);
    color: var(--color-neutral-white);
  }

  [part="data-cell"][data-outside-month] [part="date"] {
    visibility: hidden;
  }

  [part="date"]:disabled {
    cursor: default;
    color: var(--color-neutral-solid-gray-420);
  }

  @media (forced-colors: active) {
    [part="date"]:disabled {
      color: GrayText;
    }
  }

  /* ========== Footer ========== */
  [part="footer"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: var(--spacing-4);
    box-sizing: border-box;
    width: 100%;
    padding: var(--spacing-4);
  }

  /* Footer buttons: DADS calendar.css 相当のサイズ感に調整 */
  [part~="footer-button"] {
    --dads-button-min-height: var(--_dads-calendar-control-size);
  }

  /* ========== Range (Start/End) ========== */
  [part="range"] {
    box-sizing: border-box;
    width: 100%;
    padding: 0 var(--spacing-4) var(--spacing-4);
  }

  [part="support-text"] {
    margin: 0 0 var(--spacing-2);
    color: var(--color-neutral-solid-gray-700);
    font-size: 0.875rem; /* 14px - フォントサイズは固定 */
    line-height: 1.5;
  }

  [part="range-item"] {
    margin: 0;
    display: flex;
    column-gap: var(--spacing-2);
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
