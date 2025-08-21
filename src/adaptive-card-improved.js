/**
 * Adaptive Card Component - Improved Version
 * Enhanced with better CSS Parts and CSS Custom Properties implementation
 * Based on best practices from CSS Parts and CSS Variables articles
 */

import {
  WebComponent,
  html,
  css,
  PropertyAttr,
  BooleanAttr,
  AdoptableStyles,
  ViewTemplate
} from '../web-components.ts';

import {
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
  hasSlotContent
} from './adaptive-card.types';

/**
 * AdaptiveCard - Enhanced Adaptive Card Component
 * 
 * CSS Custom Properties Design System:
 * - Component-level tokens (--adaptive-card-*)
 * - State-based modifiers
 * - Semantic property names
 * - Proper fallback chains
 * 
 * CSS Parts Strategy:
 * - Granular part exposure for maximum flexibility
 * - Semantic part naming
 * - State-based part selectors
 */
export class AdaptiveCard extends WebComponent {
  resizeObserver = null;
  currentBreakpoint = CardBreakpoint.AUTO;
  slots = new Map();
  slotChangeHandlers = new Map();

  // Property definitions
  @PropertyAttr({ defaultValue: CardVariant.ELEVATED })
  variant = CardVariant.ELEVATED;

  @BooleanAttr({ defaultValue: false })
  responsive = false;

  @PropertyAttr({ defaultValue: CardBreakpoint.AUTO })
  breakpoint = CardBreakpoint.AUTO;

  @PropertyAttr({ defaultValue: CardDirection.VERTICAL })
  direction = CardDirection.VERTICAL;

  @PropertyAttr({ defaultValue: CardPadding.MEDIUM })
  padding = CardPadding.MEDIUM;

  @BooleanAttr({ defaultValue: false })
  interactive = false;

  @BooleanAttr({ defaultValue: false })
  disabled = false;

  @BooleanAttr({ defaultValue: false })
  selected = false;

  @PropertyAttr({ defaultValue: null })
  href = null;

  @PropertyAttr({ defaultValue: LinkTarget.SELF })
  'link-target' = LinkTarget.SELF;

  @PropertyAttr({ defaultValue: null })
  'link-text' = null;

  @PropertyAttr({ defaultValue: LinkPattern.STRETCHED })
  'link-pattern' = LinkPattern.STRETCHED;

  constructor() {
    super();
    this.setAttribute('data-sa-component', 'adaptive-card');
  }

  /**
   * Enhanced template with comprehensive CSS Parts
   */
  get template() {
    return html`
      <div
        class="card"
        part="base card"
        data-variant="${this.variant}"
        data-breakpoint="${this.currentBreakpoint}"
        data-direction="${this.direction}"
        data-padding="${this.padding}"
        data-interactive="${this.interactive}"
        data-disabled="${this.disabled}"
        data-selected="${this.selected}"
        role="${this.getRole()}"
        aria-label="${this.getAttribute('aria-label') || ''}"
        tabindex="${this.getTabIndex()}"
      >
        ${this.renderLink()}
        
        <!-- Enhanced part structure for better styling control -->
        <div class="card__media" part="media media-container" ?hidden="${!this.hasSlot('media')}">
          <div class="card__media-inner" part="media-inner">
            <slot name="media" @slotchange="${this.handleSlotChange}"></slot>
          </div>
        </div>
        
        <div class="card__header" part="header header-container" ?hidden="${!this.hasSlot('header')}">
          <div class="card__header-inner" part="header-inner">
            <slot name="header" @slotchange="${this.handleSlotChange}"></slot>
          </div>
        </div>
        
        <div class="card__body" part="body body-container">
          <div class="card__content" part="content content-container">
            <div class="card__content-inner" part="content-inner">
              <slot @slotchange="${this.handleSlotChange}"></slot>
            </div>
          </div>
          
          <div class="card__actions" part="actions actions-container" ?hidden="${!this.hasSlot('actions')}">
            <div class="card__actions-inner" part="actions-inner">
              <slot name="actions" @slotchange="${this.handleSlotChange}"></slot>
            </div>
          </div>
        </div>
        
        <div class="card__badge" part="badge badge-container" ?hidden="${!this.hasSlot('badge')}">
          <div class="card__badge-inner" part="badge-inner">
            <slot name="badge" @slotchange="${this.handleSlotChange}"></slot>
          </div>
        </div>
        
        <!-- Focus indicator for accessibility -->
        <div class="card__focus-indicator" part="focus-indicator" aria-hidden="true"></div>
      </div>
    `;
  }

  /**
   * Enhanced styles with comprehensive CSS Custom Properties system
   */
  get styles() {
    return css`
      /* ============================================
         CSS Custom Properties Design System
         ============================================ */
      
      :host {
        /* Display & Layout Properties */
        --adaptive-card-display: block;
        --adaptive-card-width: 100%;
        --adaptive-card-min-width: 0;
        --adaptive-card-max-width: none;
        --adaptive-card-height: auto;
        --adaptive-card-min-height: 0;
        --adaptive-card-max-height: none;
        
        /* Spacing Design Tokens */
        --adaptive-card-padding-block: var(--design-token-spacing-md, 1rem);
        --adaptive-card-padding-inline: var(--design-token-spacing-md, 1rem);
        --adaptive-card-gap: var(--design-token-spacing-md, 1rem);
        
        /* Padding Size Variations */
        --adaptive-card-padding-none: 0;
        --adaptive-card-padding-small: var(--design-token-spacing-sm, 0.5rem);
        --adaptive-card-padding-medium: var(--design-token-spacing-md, 1rem);
        --adaptive-card-padding-large: var(--design-token-spacing-lg, 1.5rem);
        
        /* Color Design Tokens */
        --adaptive-card-bg: var(--design-token-surface-primary, #ffffff);
        --adaptive-card-bg-hover: var(--design-token-surface-primary-hover, #f5f5f5);
        --adaptive-card-bg-active: var(--design-token-surface-primary-active, #eeeeee);
        --adaptive-card-bg-selected: var(--design-token-surface-selected, #e3f2fd);
        --adaptive-card-bg-disabled: var(--design-token-surface-disabled, #fafafa);
        
        --adaptive-card-color: var(--design-token-text-primary, #000000);
        --adaptive-card-color-secondary: var(--design-token-text-secondary, #666666);
        --adaptive-card-color-disabled: var(--design-token-text-disabled, #999999);
        
        /* Border Properties */
        --adaptive-card-border-width: 1px;
        --adaptive-card-border-style: solid;
        --adaptive-card-border-color: var(--design-token-border-default, #e0e0e0);
        --adaptive-card-border: var(--adaptive-card-border-width) var(--adaptive-card-border-style) var(--adaptive-card-border-color);
        
        /* Border Radius */
        --adaptive-card-radius: var(--design-token-radius-md, 0.5rem);
        --adaptive-card-radius-sm: var(--design-token-radius-sm, 0.25rem);
        --adaptive-card-radius-lg: var(--design-token-radius-lg, 0.75rem);
        
        /* Shadow System */
        --adaptive-card-shadow-none: none;
        --adaptive-card-shadow-sm: var(--design-token-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
        --adaptive-card-shadow-md: var(--design-token-shadow-md, 0 2px 4px rgba(0, 0, 0, 0.1));
        --adaptive-card-shadow-lg: var(--design-token-shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.15));
        --adaptive-card-shadow-xl: var(--design-token-shadow-xl, 0 8px 16px rgba(0, 0, 0, 0.2));
        
        /* Current shadow (variant-dependent) */
        --adaptive-card-shadow: var(--adaptive-card-shadow-md);
        --adaptive-card-shadow-hover: var(--adaptive-card-shadow-lg);
        
        /* Transition Properties */
        --adaptive-card-transition-property: all;
        --adaptive-card-transition-duration: var(--design-token-duration-normal, 200ms);
        --adaptive-card-transition-easing: var(--design-token-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
        --adaptive-card-transition: var(--adaptive-card-transition-property) var(--adaptive-card-transition-duration) var(--adaptive-card-transition-easing);
        
        /* Focus Styles */
        --adaptive-card-focus-color: var(--design-token-focus-color, #0066cc);
        --adaptive-card-focus-width: 2px;
        --adaptive-card-focus-offset: 2px;
        --adaptive-card-focus-style: solid;
        
        /* Media Section */
        --adaptive-card-media-height: auto;
        --adaptive-card-media-aspect-ratio: auto;
        --adaptive-card-media-object-fit: cover;
        --adaptive-card-media-radius: var(--adaptive-card-radius) var(--adaptive-card-radius) 0 0;
        
        /* Header Section */
        --adaptive-card-header-padding-block: var(--adaptive-card-padding-block);
        --adaptive-card-header-padding-inline: var(--adaptive-card-padding-inline);
        --adaptive-card-header-gap: var(--design-token-spacing-xs, 0.25rem);
        --adaptive-card-header-border-bottom: none;
        
        /* Content Section */
        --adaptive-card-content-padding-block: var(--adaptive-card-padding-block);
        --adaptive-card-content-padding-inline: var(--adaptive-card-padding-inline);
        --adaptive-card-content-gap: var(--design-token-spacing-sm, 0.5rem);
        
        /* Actions Section */
        --adaptive-card-actions-padding-block: var(--adaptive-card-padding-block);
        --adaptive-card-actions-padding-inline: var(--adaptive-card-padding-inline);
        --adaptive-card-actions-gap: var(--design-token-spacing-sm, 0.5rem);
        --adaptive-card-actions-justify: flex-start;
        --adaptive-card-actions-border-top: none;
        
        /* Badge Section */
        --adaptive-card-badge-inset-block-start: var(--design-token-spacing-sm, 0.5rem);
        --adaptive-card-badge-inset-inline-end: var(--design-token-spacing-sm, 0.5rem);
        
        /* Z-index layers */
        --adaptive-card-z-badge: 10;
        --adaptive-card-z-focus: 20;
        --adaptive-card-z-link: 1;
        
        /* Component Setup */
        display: var(--adaptive-card-display);
        width: var(--adaptive-card-width);
        min-width: var(--adaptive-card-min-width);
        max-width: var(--adaptive-card-max-width);
        height: var(--adaptive-card-height);
        min-height: var(--adaptive-card-min-height);
        max-height: var(--adaptive-card-max-height);
        
        /* Performance optimizations */
        contain: layout style;
        will-change: auto;
      }
      
      /* Hidden state */
      :host([hidden]) {
        display: none !important;
      }
      
      /* ============================================
         Base Card Styles
         ============================================ */
      
      .card {
        position: relative;
        width: 100%;
        height: 100%;
        
        /* Apply design tokens */
        background: var(--adaptive-card-bg);
        color: var(--adaptive-card-color);
        border-radius: var(--adaptive-card-radius);
        transition: var(--adaptive-card-transition);
        
        /* Layout */
        display: flex;
        flex-direction: column;
        overflow: hidden;
        
        /* Isolation for stacking context */
        isolation: isolate;
      }
      
      /* ============================================
         Variant Styles
         ============================================ */
      
      /* Elevated variant */
      .card[data-variant="elevated"] {
        --adaptive-card-shadow: var(--adaptive-card-shadow-md);
        box-shadow: var(--adaptive-card-shadow);
        border: none;
      }
      
      .card[data-variant="elevated"]:where(:hover, :focus-within):not([data-disabled="true"]) {
        --adaptive-card-shadow: var(--adaptive-card-shadow-hover);
        box-shadow: var(--adaptive-card-shadow);
      }
      
      /* Outlined variant */
      .card[data-variant="outlined"] {
        --adaptive-card-shadow: var(--adaptive-card-shadow-none);
        border: var(--adaptive-card-border);
        box-shadow: var(--adaptive-card-shadow);
      }
      
      /* Filled variant */
      .card[data-variant="filled"] {
        --adaptive-card-shadow: var(--adaptive-card-shadow-none);
        background: var(--adaptive-card-bg);
        box-shadow: var(--adaptive-card-shadow);
        border: none;
      }
      
      /* ============================================
         Padding Modifiers
         ============================================ */
      
      .card[data-padding="none"] {
        --adaptive-card-padding-block: 0;
        --adaptive-card-padding-inline: 0;
      }
      
      .card[data-padding="small"] {
        --adaptive-card-padding-block: var(--adaptive-card-padding-small);
        --adaptive-card-padding-inline: var(--adaptive-card-padding-small);
      }
      
      .card[data-padding="medium"] {
        --adaptive-card-padding-block: var(--adaptive-card-padding-medium);
        --adaptive-card-padding-inline: var(--adaptive-card-padding-medium);
      }
      
      .card[data-padding="large"] {
        --adaptive-card-padding-block: var(--adaptive-card-padding-large);
        --adaptive-card-padding-inline: var(--adaptive-card-padding-large);
      }
      
      /* ============================================
         Direction Modifiers
         ============================================ */
      
      .card[data-direction="horizontal"] {
        flex-direction: row;
      }
      
      .card[data-direction="horizontal"] .card__media {
        --adaptive-card-media-radius: var(--adaptive-card-radius) 0 0 var(--adaptive-card-radius);
        flex-shrink: 0;
        width: 40%;
      }
      
      .card[data-direction="vertical"] {
        flex-direction: column;
      }
      
      /* ============================================
         Interactive States
         ============================================ */
      
      .card[data-interactive="true"] {
        cursor: pointer;
        user-select: none;
      }
      
      .card[data-interactive="true"]:hover:not([data-disabled="true"]) {
        background: var(--adaptive-card-bg-hover);
      }
      
      .card[data-interactive="true"]:active:not([data-disabled="true"]) {
        background: var(--adaptive-card-bg-active);
        transform: scale(0.98);
      }
      
      /* Focus styles */
      .card:focus-visible {
        outline: none;
      }
      
      .card:focus-visible .card__focus-indicator {
        position: absolute;
        inset: calc(var(--adaptive-card-focus-offset) * -1);
        border: var(--adaptive-card-focus-width) var(--adaptive-card-focus-style) var(--adaptive-card-focus-color);
        border-radius: calc(var(--adaptive-card-radius) + var(--adaptive-card-focus-offset));
        pointer-events: none;
        z-index: var(--adaptive-card-z-focus);
      }
      
      /* Disabled state */
      .card[data-disabled="true"] {
        background: var(--adaptive-card-bg-disabled);
        color: var(--adaptive-card-color-disabled);
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
      }
      
      /* Selected state */
      .card[data-selected="true"] {
        background: var(--adaptive-card-bg-selected);
        box-shadow: inset 0 0 0 2px var(--adaptive-card-focus-color);
      }
      
      /* ============================================
         Card Sections
         ============================================ */
      
      /* Media section */
      .card__media {
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        height: var(--adaptive-card-media-height);
        aspect-ratio: var(--adaptive-card-media-aspect-ratio);
      }
      
      .card__media-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .card__media ::slotted(img),
      .card__media ::slotted(video) {
        width: 100%;
        height: 100%;
        object-fit: var(--adaptive-card-media-object-fit);
      }
      
      /* Header section */
      .card__header {
        padding-block: var(--adaptive-card-header-padding-block);
        padding-inline: var(--adaptive-card-header-padding-inline);
        border-bottom: var(--adaptive-card-header-border-bottom);
      }
      
      .card__header-inner {
        display: flex;
        flex-direction: column;
        gap: var(--adaptive-card-header-gap);
      }
      
      /* Body wrapper */
      .card__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      
      /* Content section */
      .card__content {
        flex: 1;
        padding-block: var(--adaptive-card-content-padding-block);
        padding-inline: var(--adaptive-card-content-padding-inline);
        min-height: 0;
        overflow: auto;
      }
      
      .card__content-inner {
        display: flex;
        flex-direction: column;
        gap: var(--adaptive-card-content-gap);
      }
      
      /* Actions section */
      .card__actions {
        padding-block: var(--adaptive-card-actions-padding-block);
        padding-inline: var(--adaptive-card-actions-padding-inline);
        border-top: var(--adaptive-card-actions-border-top);
      }
      
      .card__actions-inner {
        display: flex;
        flex-wrap: wrap;
        gap: var(--adaptive-card-actions-gap);
        justify-content: var(--adaptive-card-actions-justify);
      }
      
      /* Badge section */
      .card__badge {
        position: absolute;
        inset-block-start: var(--adaptive-card-badge-inset-block-start);
        inset-inline-end: var(--adaptive-card-badge-inset-inline-end);
        z-index: var(--adaptive-card-z-badge);
      }
      
      /* ============================================
         Link Styles
         ============================================ */
      
      .card-link--stretched {
        position: absolute;
        inset: 0;
        z-index: var(--adaptive-card-z-link);
        text-decoration: none;
        color: inherit;
      }
      
      .card-link--stretched::after {
        content: '';
        position: absolute;
        inset: 0;
      }
      
      /* ============================================
         Utility Classes
         ============================================ */
      
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      [hidden] {
        display: none !important;
      }
      
      /* ============================================
         Responsive Breakpoints
         ============================================ */
      
      .card[data-breakpoint="mobile"] {
        --adaptive-card-padding-block: var(--adaptive-card-padding-small);
        --adaptive-card-padding-inline: var(--adaptive-card-padding-small);
        --adaptive-card-gap: var(--design-token-spacing-xs, 0.25rem);
      }
      
      .card[data-breakpoint="tablet"] {
        --adaptive-card-padding-block: calc(var(--adaptive-card-padding-medium) * 0.875);
        --adaptive-card-padding-inline: calc(var(--adaptive-card-padding-medium) * 0.875);
        --adaptive-card-gap: calc(var(--design-token-spacing-md, 1rem) * 0.875);
      }
      
      .card[data-breakpoint="desktop"] {
        /* Default values */
      }
      
      .card[data-breakpoint="wide"] {
        --adaptive-card-padding-block: calc(var(--adaptive-card-padding-medium) * 1.25);
        --adaptive-card-padding-inline: calc(var(--adaptive-card-padding-medium) * 1.25);
        --adaptive-card-gap: calc(var(--design-token-spacing-md, 1rem) * 1.25);
      }
      
      /* ============================================
         Accessibility & Motion Preferences
         ============================================ */
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .card {
          --adaptive-card-border-width: 2px;
        }
        
        .card[data-variant="elevated"] {
          border: var(--adaptive-card-border);
        }
        
        .card:focus-visible .card__focus-indicator {
          --adaptive-card-focus-width: 3px;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .card {
          --adaptive-card-transition-duration: 0.01ms;
        }
        
        .card[data-interactive="true"]:active {
          transform: none;
        }
      }
      
      /* Dark mode support (when using design tokens) */
      @media (prefers-color-scheme: dark) {
        :host {
          --adaptive-card-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
          --adaptive-card-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.3);
          --adaptive-card-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.4);
          --adaptive-card-shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.5);
        }
      }
      
      /* ============================================
         Print Styles
         ============================================ */
      
      @media print {
        .card {
          --adaptive-card-shadow: none !important;
          border: var(--adaptive-card-border) !important;
        }
      }
    `;
  }

  /**
   * DOM connection lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    
    try {
      this.setupEventListeners();
      this.setupAccessibility();
      
      if (this.responsive) {
        this.setupResizeObserver();
      }
    } catch (error) {
      console.error(ErrorMessages.ELEMENT_NOT_CONNECTED, error);
    }
  }

  /**
   * DOM disconnection lifecycle
   */
  disconnectedCallback() {
    try {
      this.cleanupResizeObserver();
      this.removeEventListeners();
    } catch (error) {
      console.error(ErrorMessages.CLEANUP_ERROR, error);
    }
    
    super.disconnectedCallback();
  }

  /**
   * Attribute change handling
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    try {
      // Validation
      if (name === 'variant' && newValue && !isValidVariant(newValue)) {
        console.error(ErrorMessages.INVALID_VARIANT, newValue);
        return;
      }
      
      if (name === 'breakpoint' && newValue && !isValidBreakpoint(newValue)) {
        console.error(ErrorMessages.INVALID_BREAKPOINT, newValue);
        return;
      }
      
      if (name === 'direction' && newValue && !isValidDirection(newValue)) {
        console.error(ErrorMessages.INVALID_DIRECTION, newValue);
        return;
      }
      
      if (name === 'padding' && newValue && !isValidPadding(newValue)) {
        console.error(ErrorMessages.INVALID_PADDING, newValue);
        return;
      }
      
      // Special handling
      if (name === 'interactive') {
        this.updateInteractiveState();
      }
      
      if (name === 'responsive' && newValue !== null) {
        this.setupResizeObserver();
      } else if (name === 'responsive' && newValue === null) {
        this.cleanupResizeObserver();
      }
      
      if (name === 'href' || name === 'link-text' || name === 'link-target') {
        this.requestUpdate();
      }
    } catch (error) {
      console.error(ErrorMessages.EVENT_ERROR, error);
    }
  }

  /**
   * Event listener setup
   */
  setupEventListeners() {
    if (this.interactive) {
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * Event listener cleanup
   */
  removeEventListeners() {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Click event handler
   */
  handleClick = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    const detail = {
      target: this,
      originalEvent: event,
      timestamp: Date.now()
    };
    
    this.dispatchEvent(new CustomEvent('card-click', {
      detail,
      bubbles: true,
      composed: true
    }));
  };

  /**
   * Keyboard event handler
   */
  handleKeyDown = (event) => {
    if (this.disabled || !this.interactive) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  /**
   * Slot change handler
   */
  handleSlotChange = (event) => {
    const slot = event.target;
    if (slot) {
      this.requestUpdate();
    }
  };

  /**
   * ResizeObserver setup
   */
  setupResizeObserver() {
    try {
      if (!this.responsive || this.resizeObserver) return;
      
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.updateBreakpoint(entry.contentRect.width);
        }
      });
      
      this.resizeObserver.observe(this);
    } catch (error) {
      console.error(ErrorMessages.RESIZE_OBSERVER_UNSUPPORTED, error);
    }
  }

  /**
   * ResizeObserver cleanup
   */
  cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * Breakpoint update logic
   */
  updateBreakpoint(width) {
    const elementWidth = width || this.offsetWidth;
    const previousBreakpoint = this.currentBreakpoint;
    
    if (elementWidth < TEST_CONSTANTS.MOBILE_BREAKPOINT) {
      this.currentBreakpoint = CardBreakpoint.MOBILE;
    } else if (elementWidth < TEST_CONSTANTS.TABLET_BREAKPOINT) {
      this.currentBreakpoint = CardBreakpoint.TABLET;
    } else if (elementWidth < 1024) {
      this.currentBreakpoint = CardBreakpoint.DESKTOP;
    } else {
      this.currentBreakpoint = CardBreakpoint.WIDE;
    }
    
    if (previousBreakpoint !== this.currentBreakpoint) {
      this.setAttribute('data-breakpoint', this.currentBreakpoint);
      
      const detail = {
        breakpoint: this.currentBreakpoint,
        previousBreakpoint,
        width: elementWidth,
        timestamp: Date.now()
      };
      
      this.dispatchEvent(new CustomEvent('breakpoint-change', {
        detail,
        bubbles: true,
        composed: true
      }));
      
      this.requestUpdate();
    }
  }

  /**
   * Accessibility setup
   */
  setupAccessibility() {
    const role = this.getRole();
    this.setAttribute('role', role);
    
    if (this.interactive) {
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('tabindex');
    }
  }

  /**
   * Interactive state update
   */
  updateInteractiveState() {
    if (this.interactive && !this.disabled) {
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
      this.setupEventListeners();
    } else {
      this.removeAttribute('tabindex');
      this.setAttribute('role', 'article');
      this.removeEventListeners();
    }
  }

  /**
   * Get appropriate ARIA role
   */
  getRole() {
    if (this.interactive && !this.href) {
      return 'button';
    }
    return 'article';
  }

  /**
   * Get appropriate tabindex
   */
  getTabIndex() {
    if (this.interactive && !this.disabled) {
      return '0';
    }
    return '-1';
  }

  /**
   * Check if slot has content
   */
  hasSlot(name) {
    const slot = this.shadowRoot?.querySelector(`slot[name="${name}"]`);
    return slot ? hasSlotContent(slot) : false;
  }

  /**
   * Render link element
   */
  renderLink() {
    if (!this.href) return '';
    
    const linkText = this['link-text'] || this.href;
    const target = this['link-target'];
    const rel = target === LinkTarget.BLANK ? 'noopener noreferrer' : '';
    
    return html`
      <a
        class="card-link--stretched"
        href="${this.href}"
        target="${target}"
        rel="${rel}"
        aria-label="${linkText}"
        tabindex="-1"
      >
        <span class="visually-hidden">${linkText}</span>
      </a>
    `;
  }

  /**
   * Toggle selection state
   */
  toggleSelection() {
    this.selected = !this.selected;
    
    const detail = {
      target: this,
      selected: this.selected,
      timestamp: Date.now()
    };
    
    this.dispatchEvent(new CustomEvent('card-select', {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

// Register component
if (!customElements.get('adaptive-card')) {
  customElements.define('adaptive-card', AdaptiveCard);
}