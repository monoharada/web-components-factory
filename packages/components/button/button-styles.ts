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
  [part="base"]:hover:not(:disabled) {
    background-color: var(--dads-button-background-hover);
    box-shadow: var(--dads-button-shadow-hover);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* アクティブ状態 */
  [part="base"]:active:not(:disabled) {
    background-color: var(--dads-button-background-active);
    transform: var(--dads-button-transform-active);
    box-shadow: var(--dads-button-shadow-active);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* アウトラインボタンのActive時の特別処理 */
  :host([variant="outlined"]) [part="base"]:hover:not(:disabled) {
    border-color: var(--button-secondary-border-hover);
  }

  :host([variant="outlined"]) [part="base"]:active:not(:disabled) {
    color: var(--button-secondary-text-active);
    border-color: var(--button-secondary-border-active);
  }

  /* テキストボタンのHover/Active時の特別処理 */
  :host([variant="text"]) [part="base"]:hover:not(:disabled) {
    color: var(--button-tertiary-text-hover);
  }

  :host([variant="text"]) [part="base"]:active:not(:disabled) {
    color: var(--button-tertiary-text-active);
  }

  /* フォーカススタイルはmixin (applyFocusStyles) で適用 */

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

  /* Text（テキストのみ）バリアント - デジタル庁準拠で下線付き */
  :host([variant="text"]) [part="base"] {
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
  /* Note: サイズ固有のスタイルはbutton-tokens.tsでローカル変数への代入として定義済み */

  /* ========== レスポンシブ対応 ========== */
  
  @media (max-width: 640px) {
    :host {
      --dads-button-min-width: 64px;
    }
  }

  /* @media (prefers-reduced-motion: reduce) セクションは削除（transitionを完全に無効化） */

  /* ========== 印刷対応 ========== */
  
  @media print {
    [part="base"] {
      background-color: transparent !important;
      color: black !important;
      border: 1px solid black !important;
    }
  }
`;