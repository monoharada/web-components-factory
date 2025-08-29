/**
 * アコーディオンコンポーネント用デザイントークン
 */

/**
 * CSSカスタムプロパティを生成
 */
export function generateCSSVariables(): string {
  return `
    /* Colors */
    --icon-color: #1a1a1a;
    --border-color: #d1d5db;
    --hover-bg: #f3f4f6;
    --focus-color: #2563eb;
    --text-primary: #1a1a1a;
    --text-secondary: #4b5563;
    
    /* Spacing */
    --padding-block: 1rem;
    --padding-inline: 1.25rem;
    --content-padding: 1.25rem;
    --gap: 0.75rem;
    
    /* Typography */
    --font-size-base: 1rem;
    --font-weight-medium: 500;
    --line-height: 1.5;
    
    /* Transitions */
    --transition-duration: 200ms;
    --transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Borders */
    --border-width: 1px;
    --border-radius: 0.5rem;
    --focus-outline-width: 2px;
    --focus-outline-offset: 2px;
  `;
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