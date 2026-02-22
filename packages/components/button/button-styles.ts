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
    gap: var(--dads-button-icon-gap, 8px); /* アイコンとラベルの間隔 */

    /* プロパティと変数のマッピング（一度だけ定義） */
    background-color: var(--dads-button-background); /* ボタンの背景色 */
    color: var(--dads-button-color); /* ボタンのテキスト色 */
    border: var(--dads-button-border-width, 2px) solid var(--dads-button-border-color);
    border-radius: var(--dads-button-border-radius, 0.5rem); /* 角丸のサイズ */

    padding: var(--dads-button-padding, var(--spacing-3, 12px) var(--spacing-6, 24px)); /* 内側の余白 */
    width: var(--dads-button-width, auto); /* ボタンの幅 */
    min-width: var(--dads-button-min-width, auto); /* 最小幅 */
    max-width: var(--dads-button-max-width, none); /* 最大幅 */
    min-height: var(--dads-button-min-height, var(--dads-button-min-height-default, 48px)); /* 最小高さ */
    aspect-ratio: var(--dads-button-aspect-ratio, auto); /* アスペクト比 */

    /* フォント設定 - グローバルトークン参照 */
    font-family: var(--font-family-sans);
    font-size: var(--dads-button-font-size, 1rem); /* フォントサイズ */
    font-weight: var(--dads-button-font-weight, 700); /* フォントウェイト */
    line-height: var(--dads-button-line-height, 1.25); /* 行の高さ */
    text-align: var(--dads-button-text-align, center); /* テキスト揃え */
    text-transform: var(--dads-button-text-transform, none); /* テキスト変換（大文字化等） */
    text-decoration: var(--dads-button-text-decoration, none); /* テキスト装飾 */
    white-space: var(--dads-button-white-space, nowrap); /* テキスト折り返し制御 */

    user-select: var(--dads-button-user-select, none); /* テキスト選択の可否 */
    -webkit-tap-highlight-color: var(--dads-button-tap-highlight-color, transparent); /* タップ時のハイライト色 */
    
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
    opacity: var(--dads-button-opacity, 1); /* 無効時の不透明度 */
  }

  /* アイコンスロット */
  [part="icon-start"],
  [part="icon-end"] {
    display: none;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--dads-button-icon-size, 1.25em); /* アイコンサイズ */
    color: var(--dads-button-icon-color, currentColor); /* アイコン色 */
  }

  :host([data-has-icon-start]) [part="icon-start"],
  :host([data-has-icon-end]) [part="icon-end"] {
    display: inline-flex;
  }

  /* ラベル */
  [part="label"] {
    flex: 1 1 auto;
  }

  :host([data-icon-only]) [part="label"] {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  
  /* ========== a要素固有のスタイル ========== */
  
  /* a要素のデフォルトスタイルをリセット */
  [part="base"]:where(a) {
    text-decoration: none;
    color: inherit;
    /* hrefなしのa要素やJavaScript処理用 */
    cursor: pointer;
  }

  /* ========== Hover / Active ========== */

  :host(:not([disabled])) [part="base"]:is(:hover, :active) {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  :host(:not([disabled])) [part="base"]:hover {
    --dads-button-background: var(--dads-button-background-hover);
    --dads-button-color: var(--dads-button-color-hover);
    --dads-button-border-color: var(--dads-button-border-color-hover);
  }

  :host(:not([disabled])) [part="base"]:active {
    --dads-button-background: var(--dads-button-background-active);
    --dads-button-color: var(--dads-button-color-active);
    --dads-button-border-color: var(--dads-button-border-color-active);
  }

  /* ========== Solid (Primary) バリアント ========== */
  
  /* Solid Disabled状態 */
  :host([variant="solid"][disabled]) button[part="base"],
  :host([variant="primary"][disabled]) button[part="base"] {
    --dads-button-background: var(--button-disabled-primary-bg);
    --dads-button-color: var(--button-disabled-primary-text);
    --dads-button-border-color: var(--button-disabled-primary-border);
  }
  
  /* ========== Outlined (Secondary) バリアント ========== */
  
  /* Outlined Disabled状態 */
  :host([variant="outlined"][disabled]) button[part="base"],
  :host([variant="secondary"][disabled]) button[part="base"] {
    --dads-button-background: var(--button-disabled-secondary-bg);
    --dads-button-color: var(--button-disabled-secondary-text);
    --dads-button-border-color: var(--button-disabled-secondary-border);
  }
  
  /* ========== Text（テキストのみ）バリアント ========== */
  
  /* Text基本状態 - 下線付き */
  :host([variant="text"]) [part="base"],
  :host([variant="tertiary"]) [part="base"] {
    --dads-button-border-width: 0;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }

  :host([variant="text"][data-icon-only]) [part="base"],
  :host([variant="tertiary"][data-icon-only]) [part="base"] {
    text-decoration: none;
  }

  :host([variant="text"][data-icon-only]) [part="label"],
  :host([variant="tertiary"][data-icon-only]) [part="label"] {
    border-bottom: 1px solid currentColor;
    padding-bottom: 0.2em;
  }
  
  /* hover/active で下線を太く */
  :host([variant="text"]:not([disabled])) [part="base"]:is(:hover, :active),
  :host([variant="tertiary"]:not([disabled])) [part="base"]:is(:hover, :active) {
    text-decoration-thickness: 2px;
  }

  :host([variant="text"]:not([disabled])[data-icon-only]) [part="base"]:is(:hover, :active) [part="label"],
  :host([variant="tertiary"]:not([disabled])[data-icon-only]) [part="base"]:is(:hover, :active) [part="label"] {
    border-bottom-width: 2px;
  }
  
  /* Text Disabled状態 */
  :host([variant="text"][disabled]) button[part="base"],
  :host([variant="tertiary"][disabled]) button[part="base"] {
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
