/**
 * 検索ボックスコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 search-box.css 相当をShadow DOM向けに移植
 */

import { css } from '../../core/web-components.js';

export const searchBoxStyles = css`
  :host {
    display: block;
    color: var(--dads-search-box-color);
    font-weight: 400;
    font-size: var(--dads-search-box-font-size);
    line-height: 1;
    font-family: var(--font-family-sans);
    letter-spacing: var(--dads-search-box-letter-spacing);

    /* element-scoped state vars */
    --_dads-search-box-input-border-color: var(--dads-search-box-border-color);
    --_dads-search-box-scope-border-color: var(--dads-search-box-border-color);
  }

  [part="base"] {
    display: flex;
    gap: var(--dads-search-box-gap);
  }

  [part="fields"] {
    position: relative;
    z-index: 0;
    display: flex;
    flex-grow: 1;
  }

  /* ========== Scope select（任意） ========== */
  :host(:not([data-has-scope])) [part="scope"] {
    display: none;
  }

  [part="scope"] {
    position: relative;
    display: flex;
    flex-shrink: 0;
  }

  [part="scope-label"] {
    position: absolute;
    top: calc(50% - 1.25rem);
    left: calc(17 / 16 * 1rem);
    color: var(--dads-search-box-scope-label-color);
    pointer-events: none;
    z-index: 2;
  }

  [part="scope-select"] {
    appearance: none;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    width: var(--dads-search-box-scope-width);
    min-height: var(--dads-search-box-control-min-height);
    border-radius: var(--dads-search-box-border-radius) 0 0 var(--dads-search-box-border-radius);
    border: var(--dads-search-box-border-width) solid var(--_dads-search-box-scope-border-color);
    background-color: var(--dads-search-box-scope-bg);
    padding: var(--dads-search-box-scope-padding);
    color: inherit;
    font: inherit;
    font-size: calc(17 / 16 * 1rem);
    line-height: 1;
    letter-spacing: var(--dads-search-box-letter-spacing);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @supports (appearance: base-select) {
    [part="scope-select"] {
      appearance: base-select;
    }

    [part="scope-select"]::picker-icon {
      display: none;
    }

    [part="scope-select"]::picker(select) {
      appearance: base-select;
      border: 1px solid var(--color-neutral-solid-gray-420);
      box-shadow: var(--elevation-1);
      padding: calc(16 / 16 * 1rem) 0;
    }
  }

  [part="scope-icon"] {
    position: absolute;
    top: 0;
    right: calc(16 / 16 * 1rem);
    bottom: 0;
    z-index: 1;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    align-items: center;
    width: var(--dads-search-box-scope-icon-size);
    height: var(--dads-search-box-scope-icon-size);
    color: var(--dads-search-box-scope-icon-color);
    pointer-events: none;
  }

  [part="scope-select"]:focus {
    outline: none;
  }

  [part="scope-select"]:focus-visible {
    position: relative;
    z-index: 1;
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: var(--dads-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
  }

  @media (hover: hover) {
    [part="scope-select"]:hover {
      --_dads-search-box-scope-border-color: var(--dads-search-box-border-color-hover);
    }
  }

  [part="scope-select"] option {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: calc(44 / 16 * 1rem);
    padding: calc(10 / 16 * 1rem) calc(16 / 16 * 1rem);
    color: var(--color-neutral-solid-gray-900);
  }

  [part="scope-select"] option::checkmark {
    display: none;
  }

  @media (hover: hover) {
    [part="scope-select"] option:hover {
      background-color: var(--color-neutral-solid-gray-50);
      text-decoration: underline;
      text-decoration-thickness: calc(1 / 16 * 1rem);
      text-underline-offset: calc(3 / 16 * 1rem);
    }
  }

  [part="scope-select"] option:checked {
    font-weight: 700;
    background-color: var(--color-primitive-blue-100);
    color: var(--color-primitive-blue-1000);
  }

  @media (hover: hover) {
    [part="scope-select"] option:checked:hover {
      background-color: var(--color-primitive-blue-50);
      color: var(--color-primitive-blue-900);
    }
  }

  [part="scope-select"] option:focus-visible {
    border-radius: 0;
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: calc(var(--dads-focus-outline-width) * -1);
    box-shadow: none;
  }

  [part="scope-select"] option:not(:checked):focus-visible {
    background-color: var(--dads-focus-text-element-bg);
  }

  [part="scope-select"] option:checked:focus-visible {
    box-shadow: inset 0 0 0 calc(6 / 16 * 1rem) var(--dads-focus-text-element-bg);
  }

  /* ========== Query input ========== */
  [part="query"] {
    flex-grow: 1;
    position: relative;
    display: flex;
  }

  [part="search-icon"] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(16 / 16 * 1rem);
    z-index: 1;
    margin: auto 0;
    width: var(--dads-search-box-search-icon-size);
    height: var(--dads-search-box-search-icon-size);
    color: var(--dads-search-box-search-icon-color);
    pointer-events: none;
  }

  /* スクリーンリーダー向けラベル */
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

  @media (forced-colors: active) {
    [part="search-icon"],
    [part="scope-icon"] {
      color: CanvasText;
    }
  }

  [part="input"] {
    flex-grow: 1;
    box-sizing: border-box;
    min-width: var(--dads-search-box-input-min-width);
    min-height: var(--dads-search-box-control-min-height);
    border: var(--dads-search-box-border-width) solid var(--_dads-search-box-input-border-color);
    border-radius: var(--dads-search-box-border-radius);
    background-color: var(--dads-search-box-input-bg);
    padding: var(--dads-search-box-input-padding);
    color: inherit;
    font: inherit;
  }

  :host([data-has-scope]) [part="input"] {
    margin-left: calc(-1 / 16 * 1rem);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (hover: hover) {
    [part="input"]:hover {
      --_dads-search-box-input-border-color: var(--dads-search-box-border-color-hover);
    }
  }

  [part="input"]::-webkit-search-cancel-button {
    display: none;
  }

  /* フォーカス状態 - applyDADSFocusStyles()ミックスインで共通スタイル適用 */
  [part="input"]:focus {
    outline: none;
  }

  /* ========== Button ========== */
  [part="button"] {
    --dads-button-background: var(--dads-search-box-button-bg);
    --dads-button-color: var(--dads-search-box-button-color);
    --dads-button-border-color: var(--dads-search-box-button-border-color);
  }

  @media (hover: hover) {
    [part="button"]:hover {
      --dads-button-background: var(--dads-search-box-button-bg-hover);
    }
  }
`;
