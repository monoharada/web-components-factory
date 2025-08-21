/**
 * Adaptive Card Component - Initial Implementation
 * TDD Green Phase: 最小限の実装でテストを通す
 */

import {
  WebComponent,
  html,
  css,
  PropertyAttr,
  BooleanAttr,
  NonReflectingPropertyAttr
} from '../web-components.js';

import {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  CardPadding,
  LinkTarget,
  LinkPattern,
  ErrorMessages,
  isValidVariant,
  isValidBreakpoint,
  isValidDirection,
  isValidPadding,
  isValidLinkTarget,
  isValidLinkPattern,
  TEST_CONSTANTS,
  type AdaptiveCardProperties,
  type LinkCardConfig,
  type AccessibilityConfig,
  type ResponsiveConfig
} from './adaptive-card.types.js';

/**
 * Adaptive Card Web Component
 * レスポンシブで高性能なカードコンポーネント
 */
export class AdaptiveCard extends WebComponent {
  static definition = {
    name: 'adaptive-card',
    template: html`
      <article 
        class="card"
        part="card"
        role="article"
        data-variant="elevated"
        data-breakpoint="auto"
        data-selected="false"
      >
        <slot name="badge" part="badge"></slot>
        
        <header class="card-header" part="header" hidden>
          <slot name="header"></slot>
        </header>
        
        <div class="card-media" part="media" hidden>
          <slot name="media"></slot>
        </div>
        
        <section class="card-content" part="content">
          <slot></slot>
        </section>
        
        <footer class="card-actions" part="actions" hidden>
          <slot name="actions"></slot>
        </footer>
      </article>
    `,
    styles: css`
      :host {
        --card-bg: var(--adaptive-card-bg, #ffffff);
        --card-color: var(--adaptive-card-color, #000000);
        --card-border: var(--adaptive-card-border, 1px solid #e0e0e0);
        --card-radius: var(--adaptive-card-radius, 12px);
        --card-shadow: var(--adaptive-card-shadow, none);
        --card-padding: var(--adaptive-card-padding, 16px);
        --card-gap: var(--adaptive-card-gap, 16px);
        
        display: block;
        contain: layout style;
        container-type: inline-size;
        container-name: card;
      }
      
      .card {
        display: flex;
        flex-direction: column;
        background: var(--card-bg);
        color: var(--card-color);
        border-radius: var(--card-radius);
        overflow: hidden;
        position: relative;
        transition: all 0.2s ease;
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Variant styles */
      .card[data-variant="elevated"] {
        --card-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: none;
        box-shadow: var(--card-shadow);
      }
      
      .card[data-variant="outlined"] {
        border: var(--card-border);
        --card-shadow: none;
      }
      
      .card[data-variant="filled"] {
        --card-bg: var(--adaptive-card-filled-bg, #f5f5f5);
        border: none;
      }
      
      /* Interactive states */
      :host([interactive]) .card {
        cursor: pointer;
      }
      
      :host([interactive]:hover) .card {
        --card-shadow: 0 4px 8px rgba(0,0,0,0.15);
        transform: translateY(-2px);
      }
      
      :host([interactive]:active) .card {
        transform: translateY(0);
      }
      
      :host([disabled]) .card {
        opacity: 0.5;
        pointer-events: none;
      }
      
      :host([selected]) .card {
        outline: 2px solid var(--adaptive-card-selected-color, #0066cc);
        outline-offset: 2px;
      }
      
      /* Focus styles */
      :host(:focus-visible) .card {
        outline: 2px solid var(--adaptive-card-focus-color, #0066cc);
        outline-offset: 2px;
      }
      
      /* Content sections */
      .card-header {
        padding: var(--card-padding);
        padding-bottom: 0;
      }
      
      .card-media {
        position: relative;
        overflow: hidden;
        line-height: 0;
      }
      
      .card-content {
        flex: 1;
        padding: var(--card-padding);
      }
      
      .card-actions {
        padding: var(--card-padding);
        padding-top: 0;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      
      /* Badge positioning */
      ::slotted([slot="badge"]) {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1;
      }
      
      /* Link card styles */
      .card-link--stretched {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        text-indent: -9999px;
      }
      
      .card-link--stretched::after {
        content: '';
        position: absolute;
        inset: 0;
      }
      
      .card button,
      .card a:not(.card-link--stretched),
      .card input,
      .card select,
      .card textarea {
        position: relative;
        z-index: 1;
      }
      
      /* Responsive breakpoints */
      @container card (max-width: 480px) {
        :host([responsive]) .card {
          --card-padding: 12px;
          --card-gap: 12px;
        }
      }
      
      @container card (min-width: 769px) {
        :host([responsive]) .card {
          --card-padding: 24px;
          --card-gap: 20px;
        }
      }
    `,
    attributes: [
      PropertyAttr('variant'),
      BooleanAttr('responsive'),
      PropertyAttr('breakpoint'),
      PropertyAttr('direction'),
      BooleanAttr('compact'),
      BooleanAttr('interactive'),
      BooleanAttr('disabled'),
      BooleanAttr('selected'),
      BooleanAttr('expandable'),
      BooleanAttr('expanded'),
      PropertyAttr('href'),
      PropertyAttr('linkText', 'link-text'),
      PropertyAttr('linkTarget', 'link-target'),
      PropertyAttr('linkPattern', 'link-pattern'),
      PropertyAttr('role'),
      PropertyAttr('ariaLabel', 'aria-label'),
      PropertyAttr('ariaDescribedby', 'aria-describedby'),
      PropertyAttr('ariaPressed', 'aria-pressed'),
      PropertyAttr('ariaExpanded', 'aria-expanded'),
      PropertyAttr('ariaCurrent', 'aria-current'),
      NonReflectingPropertyAttr('elevation'),
      PropertyAttr('padding')
    ]
  };
  
  // Private properties
  private resizeObserver: ResizeObserver | null = null;
  private cleanupTasks: (() => void)[] = [];
  private currentBreakpoint: string = TEST_CONSTANTS.DEFAULT_BREAKPOINT;
  private linkElement: HTMLAnchorElement | null = null;
  
  // Public properties with defaults
  variant: CardVariant = TEST_CONSTANTS.DEFAULT_VARIANT;
  responsive: boolean = true;
  breakpoint: CardBreakpoint = TEST_CONSTANTS.DEFAULT_BREAKPOINT;
  direction: CardDirection = TEST_CONSTANTS.DEFAULT_DIRECTION;
  compact: boolean = false;
  interactive: boolean = false;
  disabled: boolean = false;
  selected: boolean = false;
  expandable: boolean = false;
  expanded: boolean = false;
  elevation: number = TEST_CONSTANTS.DEFAULT_ELEVATION;
  padding: CardPadding = TEST_CONSTANTS.DEFAULT_PADDING;
  href?: string;
  linkText?: string;
  linkTarget?: LinkTarget;
  linkPattern?: LinkPattern;
  role: string = 'article';
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaPressed?: string;
  ariaExpanded?: string;
  ariaCurrent?: string;
  
  connectedCallback() {
    super.connectedCallback();
    this.setupComponent();
    this.setupResponsive();
    this.setupInteractivity();
    this.setupSlotManagement();
    this.applyAccessibility();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }
  
  // Property change handlers
  variantChanged(oldValue: string, newValue: string) {
    if (isValidVariant(newValue)) {
      this.variant = newValue as CardVariant;
      this.updateVariantStyles();
    } else {
      console.error(ErrorMessages.INVALID_VARIANT, newValue);
      this.variant = TEST_CONSTANTS.DEFAULT_VARIANT;
    }
  }
  
  breakpointChanged(oldValue: string, newValue: string) {
    if (isValidBreakpoint(newValue)) {
      this.breakpoint = newValue as CardBreakpoint;
    } else {
      console.error(ErrorMessages.INVALID_BREAKPOINT, newValue);
      this.breakpoint = TEST_CONSTANTS.DEFAULT_BREAKPOINT;
    }
  }
  
  directionChanged(oldValue: string, newValue: string) {
    if (isValidDirection(newValue)) {
      this.direction = newValue as CardDirection;
    } else {
      console.error(ErrorMessages.INVALID_DIRECTION, newValue);
      this.direction = TEST_CONSTANTS.DEFAULT_DIRECTION;
    }
  }
  
  paddingChanged(oldValue: string, newValue: string) {
    if (isValidPadding(newValue)) {
      this.padding = newValue as CardPadding;
    } else {
      console.error(ErrorMessages.INVALID_PADDING, newValue);
      this.padding = TEST_CONSTANTS.DEFAULT_PADDING;
    }
  }
  
  interactiveChanged(oldValue: string, newValue: string) {
    const isInteractive = this.hasAttribute('interactive');
    this.interactive = isInteractive;
    this.updateInteractivityState();
  }
  
  disabledChanged(oldValue: string, newValue: string) {
    const isDisabled = this.hasAttribute('disabled');
    this.disabled = isDisabled;
    this.updateDisabledState();
  }
  
  selectedChanged(oldValue: string, newValue: string) {
    const isSelected = this.hasAttribute('selected');
    this.selected = isSelected;
    this.updateSelectedState();
  }
  
  expandableChanged(oldValue: string, newValue: string) {
    const isExpandable = this.hasAttribute('expandable');
    this.expandable = isExpandable;
    this.updateExpandableState();
  }
  
  expandedChanged(oldValue: string, newValue: string) {
    const isExpanded = this.hasAttribute('expanded');
    this.expanded = isExpanded;
    this.updateExpandedState();
  }
  
  hrefChanged(oldValue: string, newValue: string) {
    this.href = newValue;
    this.updateLinkCard();
  }
  
  linkTextChanged(oldValue: string, newValue: string) {
    this.linkText = newValue;
    this.updateLinkCard();
  }
  
  linkTargetChanged(oldValue: string, newValue: string) {
    if (isValidLinkTarget(newValue)) {
      this.linkTarget = newValue as LinkTarget;
      this.updateLinkCard();
    }
  }
  
  linkPatternChanged(oldValue: string, newValue: string) {
    if (isValidLinkPattern(newValue)) {
      this.linkPattern = newValue as LinkPattern;
      this.updateLinkCard();
    }
  }
  
  roleChanged(oldValue: string, newValue: string) {
    this.role = newValue || 'article';
    this.updateRole();
  }
  
  // Private methods
  private setupComponent() {
    // Set default role
    if (!this.getAttribute('role')) {
      this.setAttribute('role', 'article');
    }
    
    // Set component identifier
    this.setAttribute('data-sa-component', '');
  }
  
  private setupResponsive() {
    if (!this.responsive) return;
    
    try {
      if (!('ResizeObserver' in window)) {
        console.warn(ErrorMessages.RESIZE_OBSERVER_UNSUPPORTED);
        this.fallbackToMediaQuery();
        return;
      }
      
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.updateBreakpoint(entry.contentRect.width);
        }
      });
      
      this.resizeObserver.observe(this);
    } catch (error) {
      console.error('レスポンシブ設定エラー:', error);
      this.fallbackToMediaQuery();
    }
  }
  
  private fallbackToMediaQuery() {
    const handleResize = () => {
      this.updateBreakpoint(this.offsetWidth);
    };
    
    window.addEventListener('resize', handleResize);
    this.cleanupTasks.push(() => window.removeEventListener('resize', handleResize));
    
    // Initial check
    handleResize();
  }
  
  private updateBreakpoint(width?: number) {
    const currentWidth = width ?? this.offsetWidth;
    let newBreakpoint: string;
    
    if (this.breakpoint !== 'auto') {
      newBreakpoint = this.breakpoint;
    } else {
      if (currentWidth <= TEST_CONSTANTS.MOBILE_BREAKPOINT) {
        newBreakpoint = CardBreakpoint.MOBILE;
      } else if (currentWidth <= TEST_CONSTANTS.TABLET_BREAKPOINT) {
        newBreakpoint = CardBreakpoint.TABLET;
      } else {
        newBreakpoint = CardBreakpoint.DESKTOP;
      }
    }
    
    if (newBreakpoint !== this.currentBreakpoint) {
      const previousBreakpoint = this.currentBreakpoint;
      this.currentBreakpoint = newBreakpoint;
      this.setAttribute('data-breakpoint', newBreakpoint);
      
      // Update card element attribute
      const cardElement = this.shadowRoot?.querySelector('.card');
      if (cardElement) {
        cardElement.setAttribute('data-breakpoint', newBreakpoint);
      }
      
      this.emitEvent('breakpoint-change', {
        breakpoint: newBreakpoint as CardBreakpoint,
        previousBreakpoint: previousBreakpoint as CardBreakpoint,
        width: currentWidth
      });
    }
  }
  
  private setupInteractivity() {
    if (!this.interactive) return;
    
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeydown);
  }
  
  private updateInteractivityState() {
    if (this.interactive) {
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keydown', this.handleKeydown);
    } else {
      this.removeAttribute('tabindex');
      this.setAttribute('role', 'article');
      this.removeEventListener('click', this.handleClick);
      this.removeEventListener('keydown', this.handleKeydown);
    }
  }
  
  private updateDisabledState() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('aria-disabled');
      if (this.interactive) {
        this.setAttribute('tabindex', '0');
      }
    }
  }
  
  private updateSelectedState() {
    if (this.interactive) {
      this.setAttribute('aria-pressed', String(this.selected));
    }
  }
  
  private updateExpandableState() {
    if (this.expandable) {
      this.setAttribute('aria-expanded', String(this.expanded));
    }
  }
  
  private updateExpandedState() {
    if (this.expandable) {
      this.setAttribute('aria-expanded', String(this.expanded));
    }
  }
  
  private updateLinkCard() {
    if (!this.href || !this.linkText) {
      this.removeLinkCard();
      return;
    }
    
    const config: LinkCardConfig = {
      href: this.href,
      linkText: this.linkText,
      target: this.linkTarget,
      pattern: this.linkPattern || LinkPattern.STRETCHED
    };
    
    this.createLinkCard(config);
  }
  
  private createLinkCard(config: LinkCardConfig) {
    this.removeLinkCard();
    
    if (config.pattern === LinkPattern.STRETCHED) {
      this.linkElement = this.createStretchedLink(config);
    } else {
      this.linkElement = this.createPrimaryActionLink(config);
    }
    
    if (this.linkElement && this.shadowRoot) {
      const cardElement = this.shadowRoot.querySelector('.card');
      if (cardElement) {
        cardElement.appendChild(this.linkElement);
      }
    }
  }
  
  private createStretchedLink(config: LinkCardConfig): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = config.href;
    link.className = 'card-link--stretched';
    link.setAttribute('aria-label', config.linkText);
    
    if (config.target === LinkTarget.BLANK) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${config.linkText} (新しいタブで開く)`);
    }
    
    // Create hidden text for screen readers
    const hiddenText = document.createElement('span');
    hiddenText.className = 'visually-hidden';
    hiddenText.textContent = config.linkText;
    link.appendChild(hiddenText);
    
    return link;
  }
  
  private createPrimaryActionLink(config: LinkCardConfig): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = config.href;
    link.className = 'card-link--primary';
    link.textContent = config.linkText;
    
    if (config.target === LinkTarget.BLANK) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    
    return link;
  }
  
  private removeLinkCard() {
    if (this.linkElement) {
      this.linkElement.remove();
      this.linkElement = null;
    }
  }
  
  private setupSlotManagement() {
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (slots) {
      for (const slot of slots) {
        slot.addEventListener('slotchange', this.handleSlotChange);
      }
    }
    
    // Initial check
    this.checkSlots();
  }
  
  private handleSlotChange = () => {
    this.checkSlots();
  };
  
  private checkSlots() {
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (!slots) return;
    
    for (const slot of slots) {
      const hasContent = slot.assignedElements().length > 0;
      const container = slot.parentElement;
      
      if (container && container.classList.contains('card-header', 'card-media', 'card-actions')) {
        container.toggleAttribute('hidden', !hasContent);
      }
    }
  }
  
  private applyAccessibility() {
    // Set appropriate ARIA attributes based on current state
    this.updateRole();
    
    if (this.ariaLabel) {
      this.setAttribute('aria-label', this.ariaLabel);
    }
    
    if (this.ariaDescribedby) {
      this.setAttribute('aria-describedby', this.ariaDescribedby);
    }
  }
  
  private updateRole() {
    if (this.href && !this.interactive) {
      // Link cards remain as articles
      this.setAttribute('role', 'article');
    } else if (this.interactive) {
      this.setAttribute('role', 'button');
    } else {
      this.setAttribute('role', this.role || 'article');
    }
  }
  
  private updateVariantStyles() {
    const cardElement = this.shadowRoot?.querySelector('.card');
    if (cardElement) {
      cardElement.setAttribute('data-variant', this.variant);
    }
  }
  
  private handleClick = (event: MouseEvent) => {
    if (this.disabled) return;
    
    this.emitEvent('card-click', {
      target: event.target as HTMLElement,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey
    });
    
    if (this.hasAttribute('selected')) {
      this.toggle();
    }
  };
  
  private handleKeydown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };
  
  private cleanup() {
    // Disconnect ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Remove event listeners
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeydown);
    
    // Clean up slot listeners
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (slots) {
      for (const slot of slots) {
        slot.removeEventListener('slotchange', this.handleSlotChange);
      }
    }
    
    // Execute cleanup tasks
    this.cleanupTasks.forEach(task => task());
    this.cleanupTasks = [];
    
    // Remove link element
    this.removeLinkCard();
  }
  
  // Public methods
  select() {
    this.selected = true;
    this.setAttribute('selected', '');
    this.emitEvent('card-select', {
      selected: true,
      value: this.getAttribute('value') || undefined
    });
  }
  
  deselect() {
    this.selected = false;
    this.removeAttribute('selected');
    this.emitEvent('card-select', {
      selected: false,
      value: this.getAttribute('value') || undefined
    });
  }
  
  toggle() {
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }
  
  focusContent() {
    const contentSlot = this.shadowRoot?.querySelector('slot:not([name])');
    const firstFocusable = contentSlot?.assignedElements()
      .find(el => el instanceof HTMLElement && el.tabIndex >= 0) as HTMLElement;
    
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      this.focus();
    }
  }
  
  focusAction(index: number) {
    const actionsSlot = this.shadowRoot?.querySelector('slot[name="actions"]');
    const actions = actionsSlot?.assignedElements()
      .filter(el => el instanceof HTMLElement && el.tabIndex >= 0) as HTMLElement[];
    
    if (actions && actions[index]) {
      actions[index].focus();
    }
  }
  
  announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    this.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
}

// Register the component
AdaptiveCard.define();

// Export for use in tests and other modules
export default AdaptiveCard;
