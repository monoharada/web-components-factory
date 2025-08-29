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
    gap: 8px;
    padding: var(--accordion-padding-block) var(--accordion-padding-inline) var(--accordion-padding-block) 0;
    font-size: var(--accordion-font-size, var(--font-size-16));
    line-height: var(--accordion-line-height, var(--line-height-150));
    color: var(--accordion-text-primary, var(--color-neutral-solid-gray-900));
    user-select: none;
    position: relative;
  }
  [part="summary"]::-webkit-details-marker { display: none; }
  
  /* フォーカススタイル - デジタル庁デザインシステム準拠 */
  /* キーボード操作時のみフォーカススタイルを表示 */
  [part="summary"]:focus-visible {
    outline: none;
    position: relative;
  }
  
  /* 黄色の塗りつぶし背景（内側） */
  [part="summary"]:focus-visible::before {
    content: '';
    position: absolute;
    inset: -4px;
    background-color: var(--color-primitive-yellow-300, #ffd43d);
    border-radius: var(--accordion-border-radius, var(--border-radius-8));
    z-index: 0;
  }
  
  /* 黒いアウトラインリング（外側） */
  [part="summary"]:focus-visible::after {
    content: '';
    position: absolute;
    inset: -6px;
    border: 4px solid var(--color-neutral-black, #000000);
    border-radius: calc(var(--accordion-border-radius, var(--border-radius-8)) + 2px);
    pointer-events: none;
    z-index: 0;
  }
  
  /* コンテンツを前面に */
  [part="summary"]:focus-visible > * {
    position: relative;
    z-index: 1;
  }
  
  /* アイコン */
  [part="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 6px;
    flex-shrink: 0;
    background-color: var(--color-neutral-white, #ffffff);
    border: 1px solid var(--color-primitive-blue-1000, #00118f);
    border-radius: 9999px;
    transition: border-width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* アイコンホバー効果 - Figmaデザイン準拠 */
  [part="summary"]:hover [part="icon"] { 
    border-width: 3px;
    /* パディング調整で内側の要素サイズ維持 */
    padding: 4px;
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
    padding: 8px 0;
  }
  
  /* コンテンツ */
  [part="content"] { overflow: hidden; }
  [part="content-inner"] {
    padding: var(--accordion-content-padding) 0 var(--accordion-content-padding) 52px;
    font-size: var(--font-size-16);
    line-height: var(--line-height-170);
    color: var(--accordion-text-primary, var(--color-neutral-solid-gray-900));
  }
  
  /* 戻るボタン */
  [part="return-button"] {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: var(--border-radius-6);
    background: none;
    color: var(--color-primitive-blue-1000, #00118f);
    font-size: var(--font-size-16);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
    transition: 
      color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 戻るボタンホバー効果 - シンプル版 */
  [part="return-button"]:hover { 
    color: var(--color-primitive-blue-800, #0031d8);
    background-color: var(--color-primitive-blue-50, #e8f1fe);
    border-color: var(--color-primitive-blue-200, #c5d7fb);
    text-decoration-thickness: 2px;
  }
  
  /* 戻るボタンアクティブ状態 */
  [part="return-button"]:active {
    background-color: var(--color-primitive-blue-100, #d9e6ff);
  }
  
  /* 戻るボタンフォーカス */
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
  }
  :host([icon-position="right"]) [part="content-inner"] {
    padding-left: 16px;
    padding-right: 52px;
  }
  
  /* モバイル */
  @media (max-width: 768px) {
    [part="summary"] { padding: 4px 8px 8px 0; font-size: var(--font-size-16); }
    [part="icon"] { width: 24px; height: 24px; padding: 2px; }
    [part="content-inner"] { padding: 16px 8px 16px 32px; }
    :host([icon-position="right"]) [part="content-inner"] {
      padding-left: 8px; padding-right: 32px;
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
      padding: 4px;
    }
    
    [part="return-button"] {
      border: 1px solid ButtonText;
      color: ButtonText;
    }
    
    [part="return-button"]:hover {
      border-color: Highlight;
      color: HighlightText;
      background: Highlight;
    }
  }
  
  /* RTL */
  :host-context([dir="rtl"]) [part="summary"] {
    text-align: right;
    flex-direction: row-reverse;
  }
  :host-context([dir="rtl"]) [part="content-inner"] {
    padding-left: 16px;
    padding-right: 52px;
  }
`;