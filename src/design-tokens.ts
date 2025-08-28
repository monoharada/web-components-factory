/**
 * デジタル庁デザインシステム デザイントークン定義
 * Figmaデザインから抽出した値を一元管理
 */

// ============================================================================
// カラートークン
// ============================================================================
export const colors = {
  // プリミティブトークン
  primitive: {
    blue: {
      900: '#0017c1',
      1000: '#00118f',
    },
    yellow: {
      300: '#ffd43d',
    },
    black: '#000000',
    white: '#ffffff',
  },
  // セマンティックトークン
  neutral: {
    solid: {
      gray: {
        50: '#f2f2f2',
        420: '#949494',
        800: '#333333',
      },
    },
    opacity: {
      gray: {
        900: '#000000e5',
      },
    },
  },
} as const;

// ============================================================================
// タイポグラフィートークン
// ============================================================================
export const typography = {
  fontFamily: {
    sans: 'Noto Sans JP, sans-serif',
  },
  fontSize: {
    16: '16px',
    18: '18px',
  },
  fontWeight: {
    400: 400,
  },
  lineHeight: {
    desktop: 1.6,
    mobile: 1.7,
  },
  letterSpacing: {
    normal: '0.02em',
    wide: '0.036em',
  },
} as const;

// ============================================================================
// 境界半径トークン
// ============================================================================
export const borderRadius = {
  sm: '4px',
  md: '8px',
  full: '9999px',
} as const;

// ============================================================================
// スペーシングトークン
// ============================================================================
export const spacing = {
  0: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '52px',
} as const;

// ============================================================================
// ボーダートークン
// ============================================================================
export const borders = {
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
    heavy: '4px',
  },
} as const;

// ============================================================================
// アイコントークン
// ============================================================================
export const icons = {
  arrowDown: {
    viewBox: '0 0 24 24',
    path: 'M6 9L12 15L18 9',
    strokeWidth: 2,
  },
  arrowUp: {
    viewBox: '0 0 24 24',
    path: 'M6 15L12 9L18 15',
    strokeWidth: 2,
  },
  returnArrow: {
    viewBox: '0 0 24 24',
    path: 'M14 8L10 12L14 16',
    strokeWidth: 2,
    transform: 'rotate(-90 12 12)',
  },
} as const;

// ============================================================================
// アニメーショントークン
// ============================================================================
export const animation = {
  duration: {
    none: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '400ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// ブレークポイント
// ============================================================================
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px',
} as const;

// ============================================================================
// CSS変数生成ヘルパー
// ============================================================================
export function generateCSSVariables(): string {
  return `
    /* カラートークン */
    --color-primary: ${colors.primitive.blue[1000]};
    --color-primary-dark: ${colors.primitive.blue[900]};
    --color-white: ${colors.primitive.white};
    --color-black: ${colors.primitive.black};
    --color-text: ${colors.neutral.solid.gray[800]};
    --color-border: ${colors.neutral.solid.gray[420]};
    --color-bg-hover: ${colors.neutral.solid.gray[50]};
    --color-focus: ${colors.primitive.yellow[300]};
    --color-focus-ring: ${colors.primitive.black};
    
    /* タイポグラフィー */
    --font-family: ${typography.fontFamily.sans};
    --font-size-desktop: ${typography.fontSize[18]};
    --font-size-mobile: ${typography.fontSize[16]};
    --line-height-desktop: ${typography.lineHeight.desktop};
    --line-height-mobile: ${typography.lineHeight.mobile};
    --font-weight-normal: ${typography.fontWeight[400]};
    --letter-spacing: ${typography.letterSpacing.normal};
    
    /* 境界半径 */
    --border-radius-sm: ${borderRadius.sm};
    --border-radius-md: ${borderRadius.md};
    --border-radius-full: ${borderRadius.full};
    
    /* スペーシング */
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing['2xl']};
    
    /* ボーダー */
    --border-width-thin: ${borders.width.thin};
    --border-width-medium: ${borders.width.medium};
    --border-width-thick: ${borders.width.thick};
    --border-width-heavy: ${borders.width.heavy};
    
    /* アニメーション */
    --duration-fast: ${animation.duration.fast};
    --duration-normal: ${animation.duration.normal};
    --duration-slow: ${animation.duration.slow};
    --easing-default: ${animation.easing.easeInOut};
    --easing-spring: ${animation.easing.spring};
  `;
}

// ============================================================================
// アイコンSVG生成ヘルパー
// ============================================================================
export function createIconSVG(
  iconName: keyof typeof icons,
  className?: string,
  size = 24
): string {
  const icon = icons[iconName];
  return `
    <svg 
      class="${className || ''}" 
      width="${size}" 
      height="${size}" 
      viewBox="${icon.viewBox}" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="${icon.path}"
        stroke="currentColor" 
        stroke-width="${icon.strokeWidth}"
        stroke-linecap="round"
        stroke-linejoin="round"
        ${(icon as any).transform ? `transform="${(icon as any).transform}"` : ''}
      />
    </svg>
  `;
}

// ============================================================================
// メディアクエリヘルパー
// ============================================================================
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
  prefersHighContrast: '@media (prefers-contrast: high)',
  prefersDarkMode: '@media (prefers-color-scheme: dark)',
} as const;