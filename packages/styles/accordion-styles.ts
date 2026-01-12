/**
 * アコーディオンコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../core/web-components.js';

export const accordionItemStyles = css`
  :host {
    display: block;
    width: 100%;
    border-bottom: var(--accordion-border-width) solid var(--accordion-border-color, var(--color-neutral-solid-gray-420));
  }
  
  * { box-sizing: border-box; }
  
  /* details/summary リセット */
  [part="details"] { width: 100%; }
  [part="summary"] {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4) var(--spacing-5) var(--spacing-4) var(--spacing-4);
    font-family: var(--font-family-sans);
    font-size: var(--accordion-font-size, var(--font-size-16));
    line-height: var(--accordion-line-height, var(--line-height-150));
    color: var(--accordion-text-primary, var(--color-neutral-solid-gray-900));
    user-select: none;
    position: relative;
    transition: background-color 0.2s ease;
  }
  [part="summary"]::-webkit-details-marker { display: none; }
  
  /* ホバー効果 */
  [part="summary"]:hover {
    background-color: var(--accordion-hover-bg, var(--color-neutral-solid-gray-50, #f2f2f2));
  }
  
  /* アクティブ状態 */
  [part="summary"]:active {
    background-color: var(--color-neutral-solid-gray-100, #e6e6e6);
  }
  
  /* アイコン */
  [part="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: var(--spacing-1-5);
    flex-shrink: 0;
    background-color: var(--color-neutral-white, #ffffff);
    border: 1px solid var(--color-primitive-blue-1000, #00118f);
    border-radius: 9999px;
    transition: border-width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* アイコンホバー効果 */
  [part="summary"]:hover [part="icon"] {
    border-width: 3px;
    padding: var(--spacing-1);
  }
  
  [part="icon"] svg {
    width: 100%;
    height: 100%;
    color: var(--color-primitive-blue-1000, #00118f);
    transition: transform 0.3s ease;
  }
  details[open] [part="icon"] svg { transform: rotate(180deg); }
  
  [part="header"] { 
    flex: 1;
    padding: var(--spacing-2) 0;
  }
  
  /* コンテンツ */
  [part="content"] { overflow: hidden; }
  [part="content-inner"] {
    padding: var(--spacing-4) var(--spacing-5) var(--spacing-6) var(--spacing-15);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16);
    line-height: var(--line-height-170);
    color: var(--accordion-text-primary, var(--color-neutral-solid-gray-900));
  }
  
  /* 戻るリンク */
  [part="return-button"] {
    --return-link-underline-thickness: 1px;
    --return-link-underline-thickness-hover: 3px;

    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-top: var(--spacing-4);
    padding: var(--spacing-2) 0;
    border: none;
    background: none;
    color: var(--color-primitive-blue-1000, #00118f);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: var(--return-link-underline-thickness);
    transition:
      color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      text-decoration-thickness 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  [part="return-button"]:hover {
    color: var(--color-primitive-blue-800, #0031d8);
    text-decoration-thickness: var(--return-link-underline-thickness-hover);
  }

  [part="return-button"]:focus-visible {
    outline: 2px solid var(--color-primitive-blue-600, #3460fb);
    outline-offset: 2px;
  }
  
  details:not([open]) [part="return-button"] { display: none; }
  
  /* アニメーション */
  :host-context([animation="smooth"]) [part="content"] {
    animation: fadeIn 300ms ease-out;
  }
  :host-context([animation="none"]) * {
    animation: none !important;
    transition: none !important;
  }
  
  /* モーション設定の尊重（WCAG AAA対応） */
  @media (prefers-reduced-motion: reduce) {
    [part="summary"],
    [part="icon"],
    [part="return-button"] {
      transition: none !important;
      animation: none !important;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 状態 */
  :host([disabled]) [part="summary"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
  
  :host([icon-position="right"]) [part="summary"] {
    flex-direction: row-reverse;
    padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) var(--spacing-5);
  }
  :host([icon-position="right"]) [part="content-inner"] {
    padding: var(--spacing-4) var(--spacing-15) var(--spacing-6) var(--spacing-5);
  }
  
  /* モバイル */
  @media (max-width: 768px) {
    [part="summary"] {
      padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-3);
      gap: var(--spacing-2);
      font-size: var(--font-size-16);
    }
    [part="icon"] {
      width: 24px;
      height: 24px;
      padding: var(--spacing-1);
    }
    [part="content-inner"] {
      padding: var(--spacing-3) var(--spacing-4) var(--spacing-5) var(--spacing-11);
    }
    :host([icon-position="right"]) [part="content-inner"] {
      padding-left: var(--spacing-3);
      padding-right: var(--spacing-11);
    }
  }
  
  /* 高コントラスト */
  @media (prefers-contrast: high) {
    [part="icon"] {
      border: 2px solid ButtonText;
      background: ButtonFace;
    }
    
    [part="summary"]:hover [part="icon"] {
      border-width: 3px;
      padding: var(--spacing-1);
    }
    
    [part="return-button"] {
      color: LinkText;
    }

    [part="return-button"]:hover {
      color: LinkText;
      text-decoration-thickness: var(--return-link-underline-thickness-hover);
    }
  }
  
  /* RTL */
  :host-context([dir="rtl"]) [part="summary"] {
    padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) var(--spacing-5);
    text-align: right;
    flex-direction: row-reverse;
  }
  :host-context([dir="rtl"]) [part="content-inner"] {
    padding: var(--spacing-4) var(--spacing-15) var(--spacing-6) var(--spacing-5);
  }
`;
