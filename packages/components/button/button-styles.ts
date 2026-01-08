/**
 * ボタンコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const buttonStyles = css`
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: inline-block;
    vertical-align: middle;
    width: var(--dads-button-width, auto);
    min-width: var(--dads-button-min-width, auto);
    max-width: var(--dads-button-max-width, none);
  }

  :host([full-width]) {
    display: block;
    width: 100%;
  }

  /* ========== ベース要素共通スタイル ========== */
  [part="base"] {
    /* すべてのバリアントで共通のプロパティ定義 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dads-button-icon-gap, 8px);
    
    /* プロパティと変数のマッピング（一度だけ定義） */
    background-color: var(--dads-button-background);
    color: var(--dads-button-color);
    border: var(--dads-button-border-width, 2px) solid var(--dads-button-border-color);
    border-radius: var(--dads-button-border-radius, 0.5rem);
    
    padding: var(--dads-button-padding, 12px 24px);
    min-height: var(--dads-button-min-height, 48px);
    
    /* フォント設定 - グローバルトークン参照 */
    font-family: var(--font-family-sans);
    font-size: var(--dads-button-font-size, 1rem);
    font-weight: var(--dads-button-font-weight, 700);
    line-height: var(--dads-button-line-height, 1.25);
    text-align: var(--dads-button-text-align, center);
    text-transform: var(--dads-button-text-transform, none);
    text-decoration: var(--dads-button-text-decoration, none);
    white-space: var(--dads-button-white-space, nowrap);
    
    user-select: var(--dads-button-user-select, none);
    -webkit-tap-highlight-color: var(--dads-button-tap-highlight-color, transparent);
    
    /* transition: var(--dads-button-transition); フォーカス時のアニメーション無効化 */
    position: relative;
    /* overflow: hidden を削除して擬似要素が見えるように */
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  /* フォーカススタイルはmixin (applyFocusStyles) で適用 */
  
  /* Disabled時のフォーカススタイル（button要素のみ） */
  :host([disabled]) button[part="base"]:focus,
  button[part="base"]:disabled:focus {
    outline: var(--focus-outline-width, 4px) solid var(--focus-outline-color, #000000);
    outline-offset: 0;
  }
  
  :host([disabled]) button[part="base"]:focus::after,
  button[part="base"]:disabled:focus::after {
    content: '';
    position: absolute;
    inset: calc(var(--focus-outline-width, 4px) * -1);
    border: var(--focus-ring-width, 4px) solid var(--focus-ring-color, #ffd43d);
    border-radius: inherit;
    pointer-events: none;
  }

  /* 無効状態（button要素のみ） */
  :host([disabled]) button[part="base"],
  button[part="base"]:disabled {
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
  
  /* ========== a要素固有のスタイル ========== */
  
  /* a要素のデフォルトスタイルをリセット */
  [part="base"]:where(a) {
    text-decoration: none;
    color: inherit;
    /* hrefなしのa要素やJavaScript処理用 */
    cursor: pointer;
  }

  /* ========== Solid (Primary) バリアント ========== */
  
  /* hover状態で変数を再代入 */
  :host([variant="solid"]:not([disabled])) [part="base"]:hover {
    --dads-button-background: var(--button-primary-bg-hover);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  
  /* active状態で変数を再代入 */
  :host([variant="solid"]:not([disabled])) [part="base"]:active {
    --dads-button-background: var(--button-primary-bg-active);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  
  /* Solid Disabled状態 */
  :host([variant="solid"][disabled]) button[part="base"] {
    --dads-button-background: var(--button-disabled-primary-bg);
    --dads-button-color: var(--button-disabled-primary-text);
    --dads-button-border-color: var(--button-disabled-primary-border);
  }
  
  /* ========== Outlined (Secondary) バリアント ========== */
  
  /* hover状態で変数を再代入 */
  :host([variant="outlined"]:not([disabled])) [part="base"]:hover {
    --dads-button-background: var(--button-secondary-bg-hover);
    --dads-button-color: var(--button-secondary-text-hover);
    --dads-button-border-color: var(--button-secondary-border-hover);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  
  /* active状態で変数を再代入 */
  :host([variant="outlined"]:not([disabled])) [part="base"]:active {
    --dads-button-background: var(--button-secondary-bg-active);
    --dads-button-color: var(--button-secondary-text-active);
    --dads-button-border-color: var(--button-secondary-border-active);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  
  /* Outlined Disabled状態 */
  :host([variant="outlined"][disabled]) button[part="base"] {
    --dads-button-background: var(--button-disabled-secondary-bg);
    --dads-button-color: var(--button-disabled-secondary-text);
    --dads-button-border-color: var(--button-disabled-secondary-border);
  }

  /* ========== Text（テキストのみ）バリアント ========== */
  
  /* Text基本状態 - 下線付き */
  :host([variant="text"]) [part="base"] {
    --dads-button-border-width: 0;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }
  
  /* hover状態で変数を再代入と下線を太く */
  :host([variant="text"]:not([disabled])) [part="base"]:hover {
    --dads-button-background: var(--button-tertiary-bg-hover);
    --dads-button-color: var(--button-tertiary-text-hover);
    text-decoration-thickness: 2px;
  }
  
  /* active状態で変数を再代入と下線を太く */
  :host([variant="text"]:not([disabled])) [part="base"]:active {
    --dads-button-background: var(--button-tertiary-bg-active);
    --dads-button-color: var(--button-tertiary-text-active);
    text-decoration-thickness: 2px;
  }
  
  /* Text Disabled状態 */
  :host([variant="text"][disabled]) button[part="base"] {
    --dads-button-background: var(--button-disabled-tertiary-bg);
    --dads-button-color: var(--button-disabled-tertiary-text);
    --dads-button-border-color: var(--button-disabled-tertiary-border);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }

  /* ========== デフォルト（variant未指定）のDisabled状態 ========== */
  :host([disabled]:not([variant])) button[part="base"] {
    --dads-button-background: var(--button-disabled-primary-bg);
    --dads-button-color: var(--button-disabled-primary-text);
    --dads-button-border-color: var(--button-disabled-primary-border);
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