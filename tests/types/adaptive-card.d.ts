/**
 * AdaptiveCard Custom Element Type Definitions
 * Proper TypeScript types for testing
 */

import {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  CardPadding,
  LinkTarget,
  LinkPattern,
  type CardClickEventDetail,
  type CardSelectEventDetail,
  type BreakpointChangeEventDetail
} from '../../src/adaptive-card.types';

/**
 * AdaptiveCard Custom Element Interface
 */
export interface AdaptiveCardElement extends HTMLElement {
  // Properties
  variant: CardVariant;
  responsive: boolean;
  breakpoint: CardBreakpoint;
  direction: CardDirection;
  padding: CardPadding;
  interactive: boolean;
  disabled: boolean;
  selected: boolean;
  href: string | null;
  'link-target': LinkTarget;
  'link-text': string | null;
  'link-pattern': LinkPattern;
  
  // Methods
  updateBreakpoint(width?: number): void;
  toggleSelection(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
  
  // Shadow DOM
  shadowRoot: ShadowRoot | null;
}

/**
 * Type guard for AdaptiveCardElement
 */
export function isAdaptiveCardElement(element: Element): element is AdaptiveCardElement {
  return element.tagName.toLowerCase() === 'adaptive-card';
}

/**
 * Helper to create typed AdaptiveCard element
 */
export function createAdaptiveCard(): AdaptiveCardElement {
  return document.createElement('adaptive-card') as AdaptiveCardElement;
}

/**
 * Custom Event Maps
 */
export interface AdaptiveCardEventMap {
  'card-click': CustomEvent<CardClickEventDetail>;
  'card-select': CustomEvent<CardSelectEventDetail>;
  'breakpoint-change': CustomEvent<BreakpointChangeEventDetail>;
}

/**
 * Global HTML Element augmentation
 */
declare global {
  interface HTMLElementTagNameMap {
    'adaptive-card': AdaptiveCardElement;
  }
  
  interface HTMLElementEventMap extends AdaptiveCardEventMap {}
}