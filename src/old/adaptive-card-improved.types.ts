/**
 * Adaptive Card Component Type Definitions - Improved Version
 * Enhanced type safety with better organization and documentation
 */

// ============================================
// Core Type Definitions
// ============================================

/**
 * Card visual variants
 */
export const CardVariant = {
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  FILLED: 'filled',
  FLAT: 'flat',
  RAISED: 'raised'
} as const;
export type CardVariant = typeof CardVariant[keyof typeof CardVariant];

/**
 * Responsive breakpoints
 */
export const CardBreakpoint = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  WIDE: 'wide',
  AUTO: 'auto'
} as const;
export type CardBreakpoint = typeof CardBreakpoint[keyof typeof CardBreakpoint];

/**
 * Layout directions
 */
export const CardDirection = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  REVERSE_VERTICAL: 'reverse-vertical',
  REVERSE_HORIZONTAL: 'reverse-horizontal'
} as const;
export type CardDirection = typeof CardDirection[keyof typeof CardDirection];

/**
 * Padding size scales
 */
export const CardPadding = {
  NONE: 'none',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large'
} as const;
export type CardPadding = typeof CardPadding[keyof typeof CardPadding];

/**
 * Link target options
 */
export const LinkTarget = {
  BLANK: '_blank',
  SELF: '_self',
  PARENT: '_parent',
  TOP: '_top'
} as const;
export type LinkTarget = typeof LinkTarget[keyof typeof LinkTarget];

/**
 * Link behavior patterns
 */
export const LinkPattern = {
  STRETCHED: 'stretched',
  PRIMARY_ACTION: 'primary-action',
  SECONDARY_ACTION: 'secondary-action'
} as const;
export type LinkPattern = typeof LinkPattern[keyof typeof LinkPattern];

// ============================================
// CSS Custom Properties Interface
// ============================================

/**
 * CSS Custom Properties available for theming
 * These map to the CSS variables defined in the component
 */
export interface AdaptiveCardCSSProperties {
  // Display & Layout
  '--adaptive-card-display'?: string;
  '--adaptive-card-width'?: string;
  '--adaptive-card-min-width'?: string;
  '--adaptive-card-max-width'?: string;
  '--adaptive-card-height'?: string;
  '--adaptive-card-min-height'?: string;
  '--adaptive-card-max-height'?: string;
  
  // Spacing
  '--adaptive-card-padding-block'?: string;
  '--adaptive-card-padding-inline'?: string;
  '--adaptive-card-gap'?: string;
  
  // Padding variations
  '--adaptive-card-padding-none'?: string;
  '--adaptive-card-padding-small'?: string;
  '--adaptive-card-padding-medium'?: string;
  '--adaptive-card-padding-large'?: string;
  
  // Colors
  '--adaptive-card-bg'?: string;
  '--adaptive-card-bg-hover'?: string;
  '--adaptive-card-bg-active'?: string;
  '--adaptive-card-bg-selected'?: string;
  '--adaptive-card-bg-disabled'?: string;
  '--adaptive-card-color'?: string;
  '--adaptive-card-color-secondary'?: string;
  '--adaptive-card-color-disabled'?: string;
  
  // Borders
  '--adaptive-card-border-width'?: string;
  '--adaptive-card-border-style'?: string;
  '--adaptive-card-border-color'?: string;
  '--adaptive-card-border'?: string;
  
  // Border radius
  '--adaptive-card-radius'?: string;
  '--adaptive-card-radius-sm'?: string;
  '--adaptive-card-radius-lg'?: string;
  
  // Shadows
  '--adaptive-card-shadow'?: string;
  '--adaptive-card-shadow-hover'?: string;
  '--adaptive-card-shadow-sm'?: string;
  '--adaptive-card-shadow-md'?: string;
  '--adaptive-card-shadow-lg'?: string;
  '--adaptive-card-shadow-xl'?: string;
  
  // Transitions
  '--adaptive-card-transition-property'?: string;
  '--adaptive-card-transition-duration'?: string;
  '--adaptive-card-transition-easing'?: string;
  '--adaptive-card-transition'?: string;
  
  // Focus styles
  '--adaptive-card-focus-color'?: string;
  '--adaptive-card-focus-width'?: string;
  '--adaptive-card-focus-offset'?: string;
  '--adaptive-card-focus-style'?: string;
  
  // Section-specific properties
  '--adaptive-card-media-height'?: string;
  '--adaptive-card-media-aspect-ratio'?: string;
  '--adaptive-card-media-object-fit'?: string;
  '--adaptive-card-header-gap'?: string;
  '--adaptive-card-content-gap'?: string;
  '--adaptive-card-actions-gap'?: string;
  '--adaptive-card-actions-justify'?: string;
}

// ============================================
// CSS Parts Interface
// ============================================

/**
 * Available CSS parts for external styling
 */
export interface AdaptiveCardParts {
  'base': HTMLElement;           // Root card element
  'card': HTMLElement;           // Alias for base
  'media': HTMLElement;          // Media container
  'media-container': HTMLElement; // Alias for media
  'media-inner': HTMLElement;    // Inner media wrapper
  'header': HTMLElement;         // Header container
  'header-container': HTMLElement; // Alias for header
  'header-inner': HTMLElement;   // Inner header wrapper
  'body': HTMLElement;           // Body wrapper
  'body-container': HTMLElement; // Alias for body
  'content': HTMLElement;        // Content area
  'content-container': HTMLElement; // Alias for content
  'content-inner': HTMLElement;  // Inner content wrapper
  'actions': HTMLElement;        // Actions container
  'actions-container': HTMLElement; // Alias for actions
  'actions-inner': HTMLElement;  // Inner actions wrapper
  'badge': HTMLElement;          // Badge container
  'badge-container': HTMLElement; // Alias for badge
  'badge-inner': HTMLElement;    // Inner badge wrapper
  'focus-indicator': HTMLElement; // Focus indicator element
}

// ============================================
// Component Properties Interface
// ============================================

export interface AdaptiveCardProperties {
  // Visual properties
  variant: CardVariant;
  padding: CardPadding;
  
  // Responsive properties
  responsive: boolean;
  breakpoint: CardBreakpoint;
  
  // Layout properties
  direction: CardDirection;
  
  // Interactive properties
  interactive: boolean;
  disabled: boolean;
  selected: boolean;
  
  // Link properties
  href?: string;
  linkText?: string;
  linkTarget?: LinkTarget;
  linkPattern?: LinkPattern;
  
  // Accessibility properties
  role?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaPressed?: string;
  ariaExpanded?: string;
  ariaCurrent?: string;
}

// ============================================
// Event Interfaces
// ============================================

export interface CardClickEventDetail {
  target: HTMLElement;
  originalEvent: MouseEvent;
  timestamp: number;
}

export interface CardSelectEventDetail {
  target: HTMLElement;
  selected: boolean;
  timestamp: number;
}

export interface BreakpointChangeEventDetail {
  breakpoint: CardBreakpoint;
  previousBreakpoint?: CardBreakpoint;
  width: number;
  timestamp: number;
}

export interface AdaptiveCardEvents {
  'card-click': CustomEvent<CardClickEventDetail>;
  'card-select': CustomEvent<CardSelectEventDetail>;
  'breakpoint-change': CustomEvent<BreakpointChangeEventDetail>;
}

// ============================================
// Slot Configuration
// ============================================

export interface AdaptiveCardSlots {
  'default': HTMLElement;   // Main content area
  'header': HTMLElement;    // Card header content
  'media': HTMLElement;     // Media content (images/video)
  'actions': HTMLElement;   // Action buttons/links
  'badge': HTMLElement;     // Status badge overlay
}

// ============================================
// Error Messages
// ============================================

export const ErrorMessages = {
  INVALID_VARIANT: 'Invalid card variant specified',
  INVALID_BREAKPOINT: 'Invalid breakpoint specified',
  INVALID_DIRECTION: 'Invalid direction specified',
  INVALID_PADDING: 'Invalid padding specified',
  RESIZE_OBSERVER_UNSUPPORTED: 'ResizeObserver is not supported',
  ELEMENT_NOT_CONNECTED: 'Element is not connected to DOM',
  SHADOW_DOM_NOT_SUPPORTED: 'Shadow DOM is not supported',
  INVALID_SLOT_CONTENT: 'Invalid slot content',
  ACCESSIBILITY_VIOLATION: 'Accessibility requirements violated',
  EVENT_ERROR: 'Error processing event',
  CLEANUP_ERROR: 'Error during cleanup'
} as const;

// ============================================
// Validation Functions
// ============================================

export const isValidVariant = (value: string): value is CardVariant => {
  return Object.values(CardVariant).includes(value as CardVariant);
};

export const isValidBreakpoint = (value: string): value is CardBreakpoint => {
  return Object.values(CardBreakpoint).includes(value as CardBreakpoint);
};

export const isValidDirection = (value: string): value is CardDirection => {
  return Object.values(CardDirection).includes(value as CardDirection);
};

export const isValidPadding = (value: string): value is CardPadding => {
  return Object.values(CardPadding).includes(value as CardPadding);
};

export const isValidLinkTarget = (value: string): value is LinkTarget => {
  return Object.values(LinkTarget).includes(value as LinkTarget);
};

export const isValidLinkPattern = (value: string): value is LinkPattern => {
  return Object.values(LinkPattern).includes(value as LinkPattern);
};

// ============================================
// Type Guards
// ============================================

export const isHTMLElement = (element: unknown): element is HTMLElement => {
  return element instanceof HTMLElement;
};

export const hasSlotContent = (slot: HTMLSlotElement): boolean => {
  return slot.assignedElements().length > 0;
};

// ============================================
// Constants for Testing & Defaults
// ============================================

export const TEST_CONSTANTS = {
  // Default values
  DEFAULT_VARIANT: CardVariant.ELEVATED,
  DEFAULT_BREAKPOINT: CardBreakpoint.AUTO,
  DEFAULT_DIRECTION: CardDirection.VERTICAL,
  DEFAULT_PADDING: CardPadding.MEDIUM,
  
  // Breakpoint thresholds
  MOBILE_BREAKPOINT: 480,
  TABLET_BREAKPOINT: 768,
  DESKTOP_BREAKPOINT: 1024,
  WIDE_BREAKPOINT: 1440,
  
  // Animation
  ANIMATION_DURATION: 200,
  
  // Focus
  FOCUS_OUTLINE_WIDTH: 2,
  FOCUS_OUTLINE_OFFSET: 2,
  
  // Z-index layers
  Z_INDEX_LINK: 1,
  Z_INDEX_BADGE: 10,
  Z_INDEX_FOCUS: 20
} as const;

// ============================================
// Design Token Mapping
// ============================================

/**
 * Maps component properties to design system tokens
 * This helps with consistent theming across the application
 */
export interface DesignTokenMapping {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    standard: string;
    decelerate: string;
    accelerate: string;
  };
}