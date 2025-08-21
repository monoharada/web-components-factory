/**
 * Adaptive Card Component Library
 * TDDアプローチで開発された高品質なWeb Components
 */

// Core component
export { AdaptiveCard as default, AdaptiveCard } from './adaptive-card.js';

// Types and constants
export {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  CardPadding,
  LinkTarget,
  LinkPattern,
  ErrorMessages,
  TEST_CONSTANTS,
  isValidVariant,
  isValidBreakpoint,
  isValidDirection,
  isValidPadding,
  isValidLinkTarget,
  isValidLinkPattern,
  isHTMLElement,
  hasSlotContent,
  type AdaptiveCardProperties,
  type CardClickEventDetail,
  type CardSelectEventDetail,
  type CardActionEventDetail,
  type BreakpointChangeEventDetail,
  type AdaptiveCardMethods,
  type AdaptiveCardEvents,
  type AdaptiveCardSlots,
  type AccessibilityConfig,
  type LinkCardConfig,
  type ResponsiveConfig
} from './adaptive-card.types.js';

// Re-export web-components.ts utilities for convenience
export {
  WebComponent,
  html,
  css,
  PropertyAttr,
  BooleanAttr,
  NonReflectingPropertyAttr,
  AdoptableStyles
} from '../web-components.js';
