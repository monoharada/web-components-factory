/**
 * Buttonコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const buttonStyles = css`
  :host {
    display: inline-block;
    font-family: var(--font-family-base, 'Noto Sans JP', sans-serif);
    --dads-button-width: auto;
  }

  /* フルワイド対応 */
  :host([full-width]) {
    display: block;
    width: 100%;
    --dads-button-width: 100%;
  }

  /* ベースボタンスタイル */
  [part="base"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dads-button-icon-gap);
    width: var(--dads-button-width);
    min-height: var(--dads-button-min-height);
    padding: var(--dads-button-padding);
    border: var(--dads-button-border-width) solid var(--dads-button-border-color);
    border-radius: var(--dads-button-border-radius);
    background-color: var(--dads-button-background);
    color: var(--dads-button-color);
    font-size: var(--dads-button-font-size);
    font-weight: var(--dads-button-font-weight);
    line-height: var(--dads-button-line-height);
    text-align: var(--dads-button-text-align);
    text-decoration: var(--dads-button-text-decoration);
    text-transform: var(--dads-button-text-transform);
    white-space: var(--dads-button-white-space);
    cursor: var(--dads-button-cursor);
    user-select: var(--dads-button-user-select);
    -webkit-tap-highlight-color: var(--dads-button-tap-highlight-color);
    transition: var(--dads-button-transition);
    position: relative;
    overflow: hidden;
    font-family: inherit;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  /* ホバー状態 */
  [part="base"]:hover:not(:disabled) {
    background-color: var(--dads-button-background-hover);
    box-shadow: var(--dads-button-shadow-hover);
  }

  /* アクティブ状態 */
  [part="base"]:active:not(:disabled) {
    background-color: var(--dads-button-background-active);
    transform: var(--dads-button-transform-active);
    box-shadow: var(--dads-button-shadow-active);
  }

  /* フォーカス状態 - デジタル庁デザインシステム準拠 */
  [part="base"]:focus-visible {
    outline: var(--dads-button-focus-visible-outline);
    position: relative;
  }

  [part="base"]:focus-visible::before {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--dads-button-focus-ring-width));
    background-color: var(--dads-button-focus-ring-color);
    border-radius: calc(var(--dads-button-border-radius) + var(--dads-button-focus-ring-width));
    z-index: -1;
  }

  [part="base"]:focus-visible::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--dads-button-focus-outline-offset));
    border: var(--dads-button-focus-outline-width) solid var(--dads-button-focus-outline-color);
    border-radius: calc(var(--dads-button-border-radius) + var(--dads-button-focus-outline-offset));
    pointer-events: none;
  }

  /* 無効状態 */
  [part="base"]:disabled {
    cursor: var(--dads-button-cursor-disabled);
    opacity: var(--dads-button-opacity);
  }

  :host([disabled]) [part="base"] {
    cursor: var(--dads-button-cursor-disabled);
    opacity: var(--button-disabled-opacity);
    pointer-events: none;
  }

  /* アイコンスロット */
  [part="icon-start"],
  [part="icon-end"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--dads-button-icon-size);
    color: var(--dads-button-icon-color);
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

  /* Solid（塗りつぶし）バリアント - デフォルト */
  /* Note: バリアント固有のスタイルはbutton-tokens.tsで
     ローカル変数への代入として定義済み */
  :host([variant="solid"]) [part="base"] {
    /* button-tokens.tsで定義されたローカル変数を使用 */
  }

  /* Outlined（アウトライン）バリアント */
  /* Note: バリアント固有のスタイルはbutton-tokens.tsで
     ローカル変数への代入として定義済み */
  :host([variant="outlined"]) [part="base"] {
    /* button-tokens.tsで定義されたローカル変数を使用 */
  }

  /* Text（テキストのみ）バリアント - デジタル庁準拠で下線付き */
  :host([variant="text"]) [part="base"] {
    /* button-tokens.tsで定義されたローカル変数を使用 */
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  :host([variant="text"]) [part="base"]:hover:not(:disabled) {
    text-decoration: underline;
  }

  :host([variant="text"]) [part="base"]:active:not(:disabled) {
    text-decoration: underline;
  }

  /* ========== サイズ固有スタイル ========== */

  /* サイズ固有スタイル */
  /* Note: サイズ固有のスタイルはbutton-tokens.tsで
     ローカル変数への代入として定義済み */
  :host([size="x-small"]) [part="base"],
  :host([size="small"]) [part="base"],
  :host([size="medium"]) [part="base"],
  :host([size="large"]) [part="base"] {
    /* button-tokens.tsで定義されたローカル変数を使用 */
  }

  /* ========== レスポンシブ対応 ========== */
  
  @media (max-width: 640px) {
    :host {
      --dads-button-min-width: 64px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="base"] {
      transition: none;
    }
  }

  /* ========== 印刷対応 ========== */
  
  @media print {
    [part="base"] {
      background-color: transparent !important;
      color: black !important;
      border: 1px solid black !important;
    }
  }
`;