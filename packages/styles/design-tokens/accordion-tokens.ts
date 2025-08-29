/**
 * アコーディオンコンポーネント用デザイントークン
 * デジタル庁デザインシステムに準拠
 */

import { css } from '../../core/web-components.js';

/**
 * アコーディオン専用のデザイントークン
 * 公式トークンをコンポーネント用にマッピング
 */
export const accordionTokens = css`
  :host {
    /* アコーディオン専用カラー */
    --accordion-icon-color: var(--color-neutral-solid-gray-900);
    --accordion-border-color: var(--color-neutral-solid-gray-420);
    --accordion-hover-bg: var(--color-neutral-solid-gray-50);
    --accordion-focus-color: var(--color-primitive-blue-600);
    --accordion-text-primary: var(--color-neutral-solid-gray-900);
    --accordion-text-secondary: var(--color-neutral-solid-gray-600);
    
    /* スペーシング - Figmaデザイン準拠 */
    --accordion-padding-block: 1rem; /* 16px */
    --accordion-padding-inline: 1.25rem; /* 20px */
    --accordion-content-padding: 1rem; /* 16px */
    --accordion-gap: 0.75rem; /* 12px */
    
    /* タイポグラフィ */
    --accordion-font-size: var(--font-size-16);
    --accordion-font-weight: var(--font-weight-400);
    --accordion-line-height: var(--line-height-150);
    
    /* トランジション */
    --accordion-transition-duration: 200ms;
    --accordion-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* ボーダー */
    --accordion-border-width: 1px;
    --accordion-border-radius: var(--border-radius-8);
    --accordion-focus-outline-width: 2px;
    --accordion-focus-outline-offset: 2px;
  }
`;

/**
 * CSSカスタムプロパティを生成（後方互換性のため維持）
 */
export function generateCSSVariables(): string {
  return accordionTokens.toString();
}

/**
 * SVGアイコンを生成
 */
export function createIconSVG(type: 'arrowDown' | 'returnArrow', partName: string, size: number = 24): string {
  const icons = {
    arrowDown: `
      <svg part="${partName}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    returnArrow: `
      <svg part="${partName}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14L12 9L17 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  };
  
  return icons[type] || '';
}