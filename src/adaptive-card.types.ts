/**
 * Adaptive Card Component Type Definitions
 * 型安全性を確保するための定数とタイプ定義
 */

// Card Variants
export const CardVariant = {
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  FILLED: 'filled',
} as const;
export type CardVariant = (typeof CardVariant)[keyof typeof CardVariant];

// Responsive Breakpoints
export const CardBreakpoint = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  WIDE: 'wide',
  AUTO: 'auto',
} as const;
export type CardBreakpoint = (typeof CardBreakpoint)[keyof typeof CardBreakpoint];

// Layout Direction
export const CardDirection = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;
export type CardDirection = (typeof CardDirection)[keyof typeof CardDirection];

// Padding Sizes
export const CardPadding = {
  NONE: 'none',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;
export type CardPadding = (typeof CardPadding)[keyof typeof CardPadding];

// Link Targets
export const LinkTarget = {
  BLANK: '_blank',
  SELF: '_self',
  PARENT: '_parent',
  TOP: '_top',
} as const;
export type LinkTarget = (typeof LinkTarget)[keyof typeof LinkTarget];

// Link Patterns
export const LinkPattern = {
  STRETCHED: 'stretched',
  PRIMARY_ACTION: 'primary-action',
} as const;
export type LinkPattern = (typeof LinkPattern)[keyof typeof LinkPattern];

// Error Messages (Japanese)
export const ErrorMessages = {
  INVALID_VARIANT: 'カードバリアントが無効です',
  INVALID_BREAKPOINT: 'ブレークポイントが無効です',
  INVALID_DIRECTION: '方向設定が無効です',
  INVALID_PADDING: 'パディング設定が無効です',
  RESIZE_OBSERVER_UNSUPPORTED: 'ResizeObserverがサポートされていません',
  ELEMENT_NOT_CONNECTED: '要素がDOMに接続されていません',
  SHADOW_DOM_NOT_SUPPORTED: 'Shadow DOMがサポートされていません',
  INVALID_SLOT_CONTENT: 'スロットコンテンツが無効です',
  ACCESSIBILITY_VIOLATION: 'アクセシビリティ要件に違反しています',
} as const;

// Component Properties Interface
export interface AdaptiveCardProperties {
  // Visual variant
  variant: CardVariant;

  // Responsive behavior
  responsive: boolean;
  breakpoint: CardBreakpoint;

  // Layout properties
  direction: CardDirection;
  compact: boolean;

  // Interactive states
  interactive: boolean;
  disabled: boolean;
  selected: boolean;
  expandable?: boolean;
  expanded?: boolean;

  // Link card properties
  href?: string;
  linkText?: string;
  linkTarget?: LinkTarget;
  linkPattern?: LinkPattern;

  // Accessibility
  role: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaPressed?: string;
  ariaExpanded?: string;
  ariaCurrent?: string;

  // Visual properties
  elevation: number; // 0-5 for elevated variant
  padding: CardPadding;
}

// Event Details
export interface CardClickEventDetail {
  target: HTMLElement;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

export interface CardSelectEventDetail {
  selected: boolean;
  value?: string;
}

export interface CardActionEventDetail {
  action: string;
  target: HTMLElement;
  data?: Record<string, unknown>;
}

export interface BreakpointChangeEventDetail {
  breakpoint: CardBreakpoint;
  previousBreakpoint?: CardBreakpoint;
  width: number;
}

// Component Methods Interface
export interface AdaptiveCardMethods {
  // Responsive control
  updateBreakpoint(): void;

  // State management
  select(): void;
  deselect(): void;
  toggle(): void;

  // Focus management
  focusContent(): void;
  focusAction(index: number): void;

  // Accessibility helpers
  announceToScreenReader(message: string): void;
}

// Component Events Interface
export interface AdaptiveCardEvents {
  'card-click': CustomEvent<CardClickEventDetail>;
  'card-select': CustomEvent<CardSelectEventDetail>;
  'card-action': CustomEvent<CardActionEventDetail>;
  'breakpoint-change': CustomEvent<BreakpointChangeEventDetail>;
}

// Slot Configuration
export interface AdaptiveCardSlots {
  header: HTMLElement; // Card header with title/subtitle
  media: HTMLElement; // Media content (images/video)
  default: HTMLElement; // Main content area
  actions: HTMLElement; // Action buttons/links
  badge: HTMLElement; // Status badge overlay
}

// Accessibility Configuration
export interface AccessibilityConfig {
  label?: string;
  describedBy?: string;
  isLinkCard?: boolean;
  interactive?: boolean;
  dynamic?: boolean;
  role?: string;
}

// Link Card Configuration
export interface LinkCardConfig {
  href: string;
  linkText: string;
  target?: LinkTarget;
  pattern?: LinkPattern;
}

// Responsive Configuration
export interface ResponsiveConfig {
  enabled: boolean;
  breakpoint: CardBreakpoint;
  direction: CardDirection;
  adaptive: boolean;
}

// Validation Functions
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

// Type Guards
export const isHTMLElement = (element: unknown): element is HTMLElement => {
  return element instanceof HTMLElement;
};

export const hasSlotContent = (slot: HTMLSlotElement): boolean => {
  return slot.assignedElements().length > 0;
};

// Constants for testing
export const TEST_CONSTANTS = {
  DEFAULT_VARIANT: CardVariant.ELEVATED,
  DEFAULT_BREAKPOINT: CardBreakpoint.AUTO,
  DEFAULT_DIRECTION: CardDirection.VERTICAL,
  DEFAULT_PADDING: CardPadding.MEDIUM,
  DEFAULT_ELEVATION: 1,
  MIN_ELEVATION: 0,
  MAX_ELEVATION: 5,
  MOBILE_BREAKPOINT: 480,
  TABLET_BREAKPOINT: 768,
  ANIMATION_DURATION: 200,
  FOCUS_OUTLINE_WIDTH: 2,
} as const;

