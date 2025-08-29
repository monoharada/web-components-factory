/**
 * デジタル庁デザインシステム（DADS） - デザイントークン
 * Digital Agency Design System
 * @digital-go-jp/design-tokens に準拠
 */

import { css } from '../../core/web-components.js';

/**
 * デジタル庁の公式デザイントークンをShadow DOM内で使用可能にする
 * CSSカスタムプロパティをホスト要素に適用
 */
export const digitalGovTokens = css`
  :host {
    /* ==========================================
     * Color Tokens - Primitive Colors
     * ========================================== */
    
    /* Blue */
    --color-primitive-blue-50: #e8f1fe;
    --color-primitive-blue-100: #d9e6ff;
    --color-primitive-blue-200: #c5d7fb;
    --color-primitive-blue-300: #9db7f9;
    --color-primitive-blue-400: #7096f8;
    --color-primitive-blue-500: #4979f5;
    --color-primitive-blue-600: #3460fb;
    --color-primitive-blue-700: #264af4;
    --color-primitive-blue-800: #0031d8;
    --color-primitive-blue-900: #0017c1;
    --color-primitive-blue-1000: #00118f;
    --color-primitive-blue-1100: #000071;
    --color-primitive-blue-1200: #000060;
    
    /* Neutral Colors */
    --color-neutral-white: #ffffff;
    --color-neutral-black: #000000;
    --color-neutral-solid-gray-50: #f2f2f2;
    --color-neutral-solid-gray-100: #e6e6e6;
    --color-neutral-solid-gray-200: #cccccc;
    --color-neutral-solid-gray-300: #b3b3b3;
    --color-neutral-solid-gray-400: #999999;
    --color-neutral-solid-gray-420: #949494;
    --color-neutral-solid-gray-500: #7f7f7f;
    --color-neutral-solid-gray-536: #767676;
    --color-neutral-solid-gray-600: #666666;
    --color-neutral-solid-gray-700: #4d4d4d;
    --color-neutral-solid-gray-800: #333333;
    --color-neutral-solid-gray-900: #1a1a1a;
    
    /* Semantic Colors */
    --color-semantic-success-1: #259d63;
    --color-semantic-success-2: #197a4b;
    --color-semantic-error-1: #ec0000;
    --color-semantic-error-2: #ce0000;
    --color-semantic-warning-yellow-1: #b78f00;
    --color-semantic-warning-yellow-2: #927200;
    --color-semantic-warning-orange-1: #fb5b01;
    --color-semantic-warning-orange-2: #c74700;
    
    /* ==========================================
     * Typography Tokens
     * ========================================== */
    
    /* Font Family */
    --font-family-sans: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'Noto Sans Mono', monospace;
    
    /* Font Weight */
    --font-weight-400: 400;
    --font-weight-700: 700;
    
    /* Font Size */
    --font-size-14: 0.875rem;
    --font-size-16: 1rem;
    --font-size-17: 1.0625rem;
    --font-size-18: 1.125rem;
    --font-size-20: 1.25rem;
    --font-size-22: 1.375rem;
    --font-size-24: 1.5rem;
    --font-size-26: 1.625rem;
    --font-size-28: 1.75rem;
    --font-size-32: 2rem;
    --font-size-36: 2.25rem;
    --font-size-45: 2.8125rem;
    --font-size-48: 3rem;
    --font-size-57: 3.5625rem;
    --font-size-64: 4rem;
    
    /* Line Height */
    --line-height-100: 1;
    --line-height-120: 1.2;
    --line-height-130: 1.3;
    --line-height-140: 1.4;
    --line-height-150: 1.5;
    --line-height-160: 1.6;
    --line-height-170: 1.7;
    --line-height-175: 1.75;
    
    /* ==========================================
     * Spacing & Layout Tokens
     * ========================================== */
    
    /* Border Radius */
    --border-radius-4: 0.25rem;
    --border-radius-6: 0.375rem;
    --border-radius-8: 0.5rem;
    --border-radius-12: 0.75rem;
    --border-radius-16: 1rem;
    --border-radius-24: 1.5rem;
    --border-radius-32: 2rem;
    --border-radius-full: 624.9375rem;
    
    /* ==========================================
     * Elevation Tokens (Shadow)
     * ========================================== */
    
    --elevation-1: 0 2px 8px 1px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.3);
    --elevation-2: 0 2px 12px 2px rgba(0,0,0,0.1), 0 1px 6px 0 rgba(0,0,0,0.3);
    --elevation-3: 0 4px 16px 3px rgba(0,0,0,0.1), 0 1px 6px 0 rgba(0,0,0,0.3);
    --elevation-4: 0 6px 20px 4px rgba(0,0,0,0.1), 0 2px 6px 0 rgba(0,0,0,0.3);
    --elevation-5: 0 8px 24px 5px rgba(0,0,0,0.1), 0 2px 10px 0 rgba(0,0,0,0.3);
    --elevation-6: 0 10px 30px 6px rgba(0,0,0,0.1), 0 3px 12px 0 rgba(0,0,0,0.3);
    --elevation-7: 0 12px 36px 7px rgba(0,0,0,0.1), 0 3px 14px 0 rgba(0,0,0,0.3);
    --elevation-8: 0 14px 40px 7px rgba(0,0,0,0.1), 0 3px 16px 0 rgba(0,0,0,0.3);
  }
`;

/**
 * コンポーネント固有のエイリアストークン
 * 公式トークンをコンポーネント用にマッピング
 */
export const componentTokens = css`
  :host {
    /* Primary Colors */
    --color-primary: var(--color-primitive-blue-1000);
    --color-primary-hover: var(--color-primitive-blue-900);
    --color-primary-active: var(--color-primitive-blue-1100);
    
    /* Text Colors */
    --color-text-primary: var(--color-neutral-solid-gray-900);
    --color-text-secondary: var(--color-neutral-solid-gray-600);
    --color-text-disabled: var(--color-neutral-solid-gray-400);
    
    /* Border Colors */
    --color-border: var(--color-neutral-solid-gray-420);
    --color-border-light: var(--color-neutral-solid-gray-200);
    --color-border-focus: var(--color-primitive-blue-600);
    
    /* Background Colors */
    --color-background: var(--color-neutral-white);
    --color-background-hover: var(--color-neutral-solid-gray-50);
    --color-background-active: var(--color-neutral-solid-gray-100);
    
    /* Status Colors */
    --color-success: var(--color-semantic-success-1);
    --color-error: var(--color-semantic-error-1);
    --color-warning: var(--color-semantic-warning-orange-1);
    
    /* Component Defaults */
    --component-font-family: var(--font-family-sans);
    --component-font-size: var(--font-size-16);
    --component-line-height: var(--line-height-150);
    --component-border-radius: var(--border-radius-8);
    --component-shadow: var(--elevation-2);
  }
`;

/**
 * デザイントークンを統合してエクスポート
 * DADS (Digital Agency Design System) トークンを適用
 */
export function applyDADSTokens() {
  // digitalGovTokensとcomponentTokensは既にCSSStyleSheetオブジェクトなので
  // そのまま返す（配列ではなく、単一の統合されたスタイルシートとして）
  return digitalGovTokens;
}

// componentTokensは既に132行目でexportしているため、ここでの再エクスポートは不要