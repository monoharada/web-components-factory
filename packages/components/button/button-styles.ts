/**
 * Buttonコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const buttonStyles = css`
  :host {
    display: inline-block;
    font-family: var(--font-family-base, 'Noto Sans JP', sans-serif);
  }

  :host([full-width]) {
    display: block;
    width: 100%;
  }

  /* ベースボタンスタイル */
  [part="base"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dads-button-icon-gap, 8px);
    width: var(--dads-button-width, auto);
    min-height: var(--dads-button-min-height, 48px);
    padding: var(--dads-button-padding, 12px 24px);
    border: var(--dads-button-border-width, 2px) solid var(--dads-button-border-color, #0017c1);
    border-radius: var(--dads-button-border-radius, 0.5rem);
    background-color: var(--dads-button-background);
    color: var(--dads-button-color);
    font-size: var(--dads-button-font-size, 1rem);
    font-weight: var(--dads-button-font-weight, 700);
    line-height: var(--dads-button-line-height, 1.25);
    text-align: var(--dads-button-text-align, center);
    text-decoration: var(--dads-button-text-decoration, none);
    text-transform: var(--dads-button-text-transform, none);
    white-space: var(--dads-button-white-space, nowrap);
    cursor: var(--dads-button-cursor, pointer);
    user-select: var(--dads-button-user-select, none);
    -webkit-tap-highlight-color: var(--dads-button-tap-highlight-color, transparent);
    /* transition: var(--dads-button-transition); フォーカス時のアニメーション無効化 */
    position: relative;
    /* overflow: hidden を削除して擬似要素が見えるように */
    font-family: inherit;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  /* ホバー状態 */
  [part="base"]:not([aria-disabled="true"]):hover {
    background-color: var(--dads-button-background-hover);
    box-shadow: var(--dads-button-shadow-hover, none);
  }

  /* 塗りボタンとアウトラインボタンのみHover時に下線 */
  :host([variant="solid"]) [part="base"]:not([aria-disabled="true"]):hover,
  :host([variant="outlined"]) [part="base"]:not([aria-disabled="true"]):hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* アクティブ状態 */
  [part="base"]:not([aria-disabled="true"]):active {
    background-color: var(--dads-button-background-active);
    transform: var(--dads-button-transform-active, none);
    box-shadow: var(--dads-button-shadow-active, none);
  }

  /* 塗りボタンとアウトラインボタンのみActive時に下線 */
  :host([variant="solid"]) [part="base"]:not([aria-disabled="true"]):active,
  :host([variant="outlined"]) [part="base"]:not([aria-disabled="true"]):active {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* アウトラインボタンのHover/Active時の特別処理 */
  :host([variant="outlined"]) [part="base"]:not([aria-disabled="true"]):hover {
    color: var(--button-secondary-text-hover, #00118f);
    border-color: var(--button-secondary-border-hover, #00118f);
  }

  :host([variant="outlined"]) [part="base"]:not([aria-disabled="true"]):active {
    color: var(--button-secondary-text-active, #000060);
    border-color: var(--button-secondary-border-active, #000060);
  }

  /* テキストボタンのHover/Active時の特別処理 */
  :host([variant="text"]) [part="base"]:not([aria-disabled="true"]):hover {
    color: var(--button-tertiary-text-hover, #00118f);
  }

  :host([variant="text"]) [part="base"]:not([aria-disabled="true"]):active {
    color: var(--button-tertiary-text-active, #000060);
  }

  /* フォーカススタイルはmixin (applyFocusStyles) で適用 */
  
  /* Disabled時のフォーカススタイル */
  :host([disabled]) [part="base"]:focus,
  [part="base"][aria-disabled="true"]:focus {
    outline: var(--focus-outline-width, 4px) solid var(--focus-outline-color, #000000);
    outline-offset: 0;
  }
  
  :host([disabled]) [part="base"]:focus::after,
  [part="base"][aria-disabled="true"]:focus::after {
    content: '';
    position: absolute;
    inset: calc(var(--focus-outline-width, 4px) * -1);
    border: var(--focus-ring-width, 4px) solid var(--focus-ring-color, #ffd43d);
    border-radius: inherit;
    pointer-events: none;
  }

  /* 無効状態 */
  :host([disabled]) [part="base"],
  [part="base"][aria-disabled="true"] {
    cursor: var(--dads-button-cursor-disabled, not-allowed);
    opacity: var(--dads-button-opacity, 1);
  }

  /* アイコンスロット */
  [part="icon-start"],
  [part="icon-end"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--dads-button-icon-size, 1.25em);
    color: var(--dads-button-icon-color, currentColor);
  }

  /* 空のアイコンスロットは非表示 */
  [part="icon-start"]:empty,
  [part="icon-end"]:empty {
    display: none;
  }

  /* ラベル */
  [part="label"] {
    flex: 1 1 auto;
  }

  /* ========== バリアント固有スタイル ========== */
  
  /* デフォルト（variant未指定）のDisabled状態 */
  :host([disabled]:not([variant])) [part="base"] {
    background-color: #b3b3b3;
    color: #f2f2f2;
    border-color: #b3b3b3;
  }
  
  /* Solid (Primary) バリアントのデフォルト値 */
  :host([variant="solid"]:not([disabled])) [part="base"] {
    background-color: var(--dads-button-background, #0017c1);
    color: var(--dads-button-color, #ffffff);
    border-color: var(--dads-button-border-color, #0017c1);
  }
  
  :host([variant="solid"]:not([disabled])) [part="base"]:hover {
    background-color: var(--dads-button-background-hover, #00118f);
  }
  
  :host([variant="solid"]:not([disabled])) [part="base"]:active {
    background-color: var(--dads-button-background-active, #000060);
  }
  
  /* Solid Disabled状態 */
  :host([variant="solid"][disabled]) [part="base"] {
    background-color: #b3b3b3;
    color: #f2f2f2;
    border-color: #b3b3b3;
  }
  
  /* Outlined (Secondary) バリアントのデフォルト値 */
  :host([variant="outlined"]:not([disabled])) [part="base"] {
    background-color: var(--dads-button-background, #ffffff);
    color: var(--dads-button-color, #0017c1);
    border-color: var(--dads-button-border-color, #0017c1);
    border-width: var(--dads-button-border-width, 1px);
  }
  
  :host([variant="outlined"]:not([disabled])) [part="base"]:hover {
    background-color: var(--dads-button-background-hover, #c5d7fb);
  }
  
  :host([variant="outlined"]:not([disabled])) [part="base"]:active {
    background-color: var(--dads-button-background-active, #9db7f9);
  }
  
  /* Outlined Disabled状態 */
  :host([variant="outlined"][disabled]) [part="base"] {
    background-color: #ffffff;
    color: #b3b3b3;
    border-color: #b3b3b3;
    border-width: 1px;
  }

  /* Text（テキストのみ）バリアント - デジタル庁準拠で下線付き */
  :host([variant="text"]:not([disabled])) [part="base"] {
    background-color: var(--dads-button-background, transparent);
    color: var(--dads-button-color, #0017c1);
    border-color: var(--dads-button-border-color, transparent);
    border-width: 0;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }
  
  :host([variant="text"]:not([disabled])) [part="base"]:hover {
    background-color: var(--dads-button-background-hover, #e8f1fe);
  }
  
  :host([variant="text"]:not([disabled])) [part="base"]:active {
    background-color: var(--dads-button-background-active, #d9e6ff);
  }
  
  /* Text Disabled状態 */
  :host([variant="text"][disabled]) [part="base"] {
    background-color: transparent;
    color: #b3b3b3;
    border-width: 0;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }

  /* テキストボタンのHover時は下線が太くなる */
  :host([variant="text"]) [part="base"]:not([aria-disabled="true"]):hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 2px;
  }

  :host([variant="text"]) [part="base"]:not([aria-disabled="true"]):active {
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 2px;
  }

  /* 印刷対応 */
  @media print {
    [part="base"] {
      background-color: transparent !important;
      color: black !important;
      border: 1px solid black !important;
    }
  }
`;