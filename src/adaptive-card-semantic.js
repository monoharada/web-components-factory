// AdaptiveCard Web Component - Semantically Enhanced Version
// Focus: Semantic HTML5, Accessibility (WCAG 2.2), Screen Reader Optimization

import { WebComponent, html, css, PropertyAttr, BooleanAttr } from '../web-components.ts';

// Template definition using html`` template literal
const cardTemplate = html`
  <article id="cardArticle" class="card-article" role="article">
    <header id="cardHeader" class="card-header">
      <slot name="title"></slot>
      <slot name="subtitle"></slot>
      <slot name="badge"></slot>
    </header>
    
    <div id="cardMedia" class="card-media">
      <slot name="media"></slot>
    </div>
    
    <section id="cardContent" class="card-content">
      <slot></slot>
      <slot name="content"></slot>
    </section>
    
    <aside id="cardDetails" class="card-details">
      <slot name="details"></slot>
      <slot name="metadata"></slot>
    </aside>
    
    <footer id="cardFooter" class="card-footer">
      <slot name="actions"></slot>
    </footer>
  </article>
`;

// Styles definition using css`` template literal
const cardStyles = css`
  /* Host element setup */
  :host {
    display: block;
    contain: content;
    max-width: var(--card-max-width, 400px);
    border: 1px solid var(--card-border-color, #d1d5db);
    border-radius: var(--card-border-radius, 8px);
    background: var(--card-background, #ffffff);
    font-family: var(--card-font-family, system-ui, -apple-system, sans-serif);
    box-shadow: var(--card-shadow, 0 1px 3px 0 rgb(0 0 0 / 0.1));
    overflow: hidden;
  }
  
  /* Special overflow handling for link cards to show focus ring */
  :host([href]) {
    overflow: visible;
    margin: 12px;
  }
  
  /* Focus ring on host element when stretched link is focused */
  :host([href]:focus-within) {
    outline: 4px solid #000000;
    outline-offset: 8px;
    box-shadow: 
      0 0 0 2px #ffffff,
      0 0 0 6px #000000,
      0 8px 24px rgba(0, 0, 0, 0.25);
  }
  
  /* Disable card-level focus when CTA buttons are present */
  :host([data-has-cta="true"]:focus-within) {
    outline: none;
    box-shadow: none;
  }

  /* Article structure */
  .card-article {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  /* Header section - semantic header element */
  .card-header {
    padding: var(--header-padding, 1rem);
    background: var(--header-background, transparent);
    border-bottom: var(--header-border, 1px solid #e5e7eb);
  }

  /* Media section for images/video */
  .card-media {
    position: relative;
    overflow: hidden;
  }

  /* Main content section */
  .card-content {
    flex: 1;
    padding: var(--content-padding, 1rem);
  }

  /* Details section for additional info */
  .card-details {
    padding: var(--details-padding, 0 1rem 1rem);
    border-top: var(--details-border, 1px solid #f3f4f6);
    background: var(--details-background, #fafafa);
  }

  /* Footer for actions */
  .card-footer {
    display: flex;
    gap: var(--actions-gap, 0.5rem);
    padding: var(--footer-padding, 0.75rem 1rem);
    background: var(--footer-background, #f9fafb);
    border-top: var(--footer-border, 1px solid #e5e7eb);
    justify-content: var(--actions-justify, flex-end);
    align-items: center;
  }

  /* Slotted content styling */
  ::slotted([slot="title"]) {
    margin: 0 0 0.5rem 0;
    font-size: var(--title-font-size, 1.25rem);
    font-weight: var(--title-font-weight, 600);
    line-height: var(--title-line-height, 1.2);
    color: var(--title-color, #111827);
  }

  ::slotted([slot="subtitle"]) {
    margin: 0 0 0.75rem 0;
    font-size: var(--subtitle-font-size, 0.875rem);
    color: var(--subtitle-color, #6b7280);
    font-weight: var(--subtitle-font-weight, 500);
  }

  ::slotted(p) {
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
    color: var(--text-color, #374151);
  }

  ::slotted(p:last-child) {
    margin-bottom: 0;
  }

  /* Media content */
  ::slotted([slot="media"]) {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  ::slotted(img[slot="media"]) {
    aspect-ratio: var(--media-aspect-ratio, 16 / 9);
  }

  /* Action buttons */
  ::slotted(button) {
    padding: var(--button-padding, 0.5rem 1rem);
    border: var(--button-border, 1px solid #d1d5db);
    border-radius: var(--button-border-radius, 0.375rem);
    background: var(--button-background, #ffffff);
    color: var(--button-color, #374151);
    font-size: var(--button-font-size, 0.875rem);
    font-weight: var(--button-font-weight, 500);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  ::slotted(button:hover) {
    background: var(--button-hover-background, #f9fafb);
    border-color: var(--button-hover-border, #9ca3af);
  }

  ::slotted(button:focus-visible) {
    outline: 2px solid var(--focus-color, #2563eb);
    outline-offset: 2px;
  }

  ::slotted(button[data-primary="true"]) {
    background: var(--primary-button-background, #2563eb);
    color: var(--primary-button-color, #ffffff);
    border-color: var(--primary-button-border, #2563eb);
  }

  ::slotted(button[data-primary="true"]:hover) {
    background: var(--primary-button-hover-background, #1d4ed8);
    border-color: var(--primary-button-hover-border, #1d4ed8);
  }

  /* Links */
  ::slotted(a) {
    color: var(--link-color, #2563eb);
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.2s ease;
  }

  ::slotted(a:hover) {
    text-decoration-color: currentColor;
  }

  ::slotted(a:focus-visible) {
    outline: 2px solid var(--focus-color, #2563eb);
    outline-offset: 2px;
  }

  /* Lists */
  ::slotted(ul), ::slotted(ol) {
    margin: 0 0 0.75rem 0;
    padding-left: 1.25rem;
  }

  ::slotted(li) {
    margin-bottom: 0.25rem;
  }

  /* Badge/tag styling */
  ::slotted([slot="badge"]) {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    background: var(--badge-background, #e5e7eb);
    color: var(--badge-color, #374151);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    :host {
      max-width: 100%;
    }
    
    .card-header,
    .card-content,
    .card-details,
    .card-footer {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    
    .card-footer {
      flex-direction: column;
      align-items: stretch;
    }
    
    ::slotted(button) {
      justify-content: center;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :host {
      border-width: 2px;
    }
    
    ::slotted(button) {
      border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    ::slotted(button) {
      transition: none;
    }
  }

  /* Screen reader only content */
  .sr-only {
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

  /* Stretched link pattern for accessible link cards */
  .card-link--stretched {
    position: absolute;
    inset: 0;
    z-index: 1;
    text-decoration: none;
    border-radius: inherit;
  }
  
  /* Remove outline from stretched link itself */
  .card-link--stretched:focus,
  .card-link--stretched:focus-visible {
    outline: none;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :host([href]:focus-within) {
      outline: 5px solid #000000;
      outline-offset: 8px;
      box-shadow: 
        0 0 0 2px #ffffff,
        0 0 0 7px #000000;
    }
    
    :host([data-has-cta="true"]:focus-within) {
      outline: none;
      box-shadow: none;
    }
  }
  
  /* Ensure the card is relatively positioned for stretched link */
  :host([href]) .card-article {
    position: relative;
    cursor: pointer;
    transition: all var(--duration-fast, 200ms) ease;
    border-radius: inherit;
  }
  
  :host([href]:hover) .card-article {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
  }
  
  /* Disable card hover when CTA buttons are present */
  :host([data-has-cta="true"]:hover) .card-article {
    transform: none;
    box-shadow: var(--card-shadow, 0 1px 3px 0 rgb(0 0 0 / 0.1));
  }
  
  /* Enhanced card focus state - Digital Agency style */
  :host([href]:focus-within) .card-article {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px -16px rgba(0, 0, 0, 0.35);
  }
  
  /* Dark mode adjustments for focus */
  @media (prefers-color-scheme: dark) {
    :host([href]:focus-within) {
      outline: 4px solid #ffffff;
      outline-offset: 8px;
      box-shadow: 
        0 0 0 2px #000000,
        0 0 0 6px #ffffff,
        0 8px 24px rgba(255, 255, 255, 0.15);
    }
    
    :host([data-has-cta="true"]:focus-within) {
      outline: none;
      box-shadow: none;
    }
  }
  
  /* Prevent focus ring on host when link is focused */
  :host([href]:focus) {
    outline: none;
  }
  
  /* Ensure interactive elements inside the card stay above the stretched link */
  ::slotted(button),
  ::slotted(a),
  ::slotted(input),
  ::slotted(select),
  ::slotted(textarea),
  ::slotted([tabindex]) {
    position: relative;
    z-index: 2;
  }

  /* Show/hide sections based on content */
  .card-header:not(.has-content),
  .card-media:not(.has-content),
  .card-details:not(.has-content),
  .card-footer:not(.has-content) {
    display: none;
  }
`;

class AdaptiveCard extends WebComponent {
  static get observedAttributes() {
    return ['href', 'link-text', 'link-target', 'interactive'];
  }

  constructor() {
    super();
    this._stretchedLink = null;
  }


  connectedCallback() {
    super.connectedCallback();
    this.setupAccessibility();
    this.setupSlotObservers();
    this.setupKeyboardNavigation();
    this.setupStretchedLink();
  }

  // Attribute change callbacks
  hrefChanged(oldValue, newValue) {
    this.setupStretchedLink();
  }

  linkTextChanged(oldValue, newValue) {
    this.setupStretchedLink();
  }

  linkTargetChanged(oldValue, newValue) {
    this.setupStretchedLink();
  }

  setupAccessibility() {
    // Set up ARIA labeling
    this.setupAriaLabeling();
    
    // Add role if not specified (only for link cards)
    if (!this.hasAttribute('role') && this.hasAttribute('href')) {
      this.setAttribute('role', 'region');
    }

    // Don't add tabindex to basic cards - only interactive elements should be focusable
    // Removed automatic tabindex setting

    // Announce dynamic content changes
    this.setupLiveRegion();
  }

  setupAriaLabeling() {
    if (!this.getAttribute('aria-label') && !this.getAttribute('aria-labelledby')) {
      const titleSlot = this.shadowRoot.querySelector('slot[name="title"]');
      const titleElement = titleSlot?.assignedElements()?.[0];
      
      if (titleElement) {
        // Use title as label
        if (!titleElement.id) {
          titleElement.id = `card-title-${this.generateId()}`;
        }
        this.setAttribute('aria-labelledby', titleElement.id);
      } else {
        // Fallback to descriptive label
        this.setAttribute('aria-label', 'Interactive card');
      }
    }
  }

  setupSlotObservers() {
    // Observe slot changes to show/hide sections
    const slots = this.shadowRoot.querySelectorAll('slot');
    
    slots.forEach(slot => {
      slot.addEventListener('slotchange', () => {
        this.updateSectionVisibility(slot);
        
            // Re-check stretched link setup if actions slot changes
        if (slot.name === 'actions' && this.href) {
          this.setupStretchedLink();
        }
      });
      
      // Initial check
      this.updateSectionVisibility(slot);
    });
  }

  updateSectionVisibility(slot) {
    const hasContent = slot.assignedElements().length > 0 || 
                      slot.assignedNodes().some(node => 
                        node.nodeType === Node.TEXT_NODE && 
                        node.textContent.trim() !== ''
                      );
    
    const section = slot.closest('.card-header, .card-media, .card-details, .card-footer');
    if (section) {
      section.classList.toggle('has-content', hasContent);
    }
  }

  setupKeyboardNavigation() {
    // Only set up keyboard navigation for link cards
    if (!this.href) {
      return;
    }
    
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const activeElement = this.shadowRoot.activeElement || document.activeElement;
        
        // Only handle if this card is focused and is a link card
        if (activeElement === this && this.href) {
          event.preventDefault();
          this.click();
        }
      }
    });
  }

  setupLiveRegion() {
    // Create a live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = `card-live-${this.generateId()}`;
    this.shadowRoot.appendChild(liveRegion);
    
    this.liveRegion = liveRegion;
  }

  announceChange(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 1000);
    }
  }


  setupStretchedLink() {
    // Remove existing stretched link if present
    if (this._stretchedLink) {
      this._stretchedLink.remove();
      this._stretchedLink = null;
    }

    const href = this.href;
    const linkText = this.linkText;
    const linkTarget = this.linkTarget;

    if (href && this.validateURL(href)) {
      // Check if card has interactive buttons/CTAs
      const hasInteractiveButtons = this.hasInteractiveButtons();
      
      if (hasInteractiveButtons) {
        // If buttons exist, don't create stretched link - let buttons handle focus
        this.setAttribute('data-has-cta', 'true');
        return;
      }

      // Create stretched link element only if no buttons
      this._stretchedLink = document.createElement('a');
      this._stretchedLink.href = href;
      this._stretchedLink.className = 'card-link--stretched';
      
      // Set link target if specified
      if (linkTarget) {
        this._stretchedLink.target = linkTarget;
        if (linkTarget === '_blank') {
          this._stretchedLink.rel = 'noopener noreferrer';
        }
      }

      // Set accessible link text
      if (linkText) {
        this._stretchedLink.setAttribute('aria-label', linkText);
        // Add screen reader only text
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = linkText;
        this._stretchedLink.appendChild(srText);
      } else {
        // Fallback: try to get title from card
        const titleElement = this.shadowRoot.querySelector('slot[name="title"]')?.assignedElements()?.[0];
        if (titleElement) {
          this._stretchedLink.setAttribute('aria-label', titleElement.textContent.trim());
        }
      }

      // Add to shadow DOM
      const article = this.refs?.cardArticle || this.shadowRoot?.querySelector('.card-article');
      if (article) {
        article.appendChild(this._stretchedLink);
      }

      // Update card accessibility
      this.setAttribute('role', 'region');
      this.setAttribute('data-has-cta', 'false');
      
      // Emit link card setup event
      this.emitEvent('card-link-setup', {
        href, linkText, linkTarget, hasButtons: false
      });
    }
  }

  hasInteractiveButtons() {
    // Check if card has interactive buttons in actions slot
    const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
    if (!actionsSlot) return false;
    
    const assignedElements = actionsSlot.assignedElements();
    return assignedElements.some(el => 
      el.matches('button, a, input[type="button"], input[type="submit"], [role="button"]') ||
      el.querySelector('button, a, input[type="button"], input[type="submit"], [role="button"]')
    );
  }

  validateURL(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  // Custom method to update card content dynamically
  updateContent(changes) {
    let announcements = [];
    
    Object.entries(changes).forEach(([slot, content]) => {
      const slotElement = this.querySelector(`[slot="${slot}"]`);
      if (slotElement) {
        slotElement.textContent = content;
        announcements.push(`${slot} updated`);
      }
    });
    
    if (announcements.length > 0) {
      if (this.announceChange) {
        this.announceChange(announcements.join(', '));
      }
    }
  }

  // Focus management method
  focusFirstInteractive() {
    const interactiveElement = this.querySelector('button, a, input, select, textarea, [tabindex]');
    if (interactiveElement) {
      interactiveElement.focus();
      return true;
    }
    return false;
  }
}

// Static definition property for WebComponent
AdaptiveCard.definition = {
  name: 'adaptive-card',
  template: cardTemplate,
  styles: cardStyles,
  attributes: [
    PropertyAttr('href'),
    PropertyAttr('linkText', 'link-text'),
    PropertyAttr('linkTarget', 'link-target'),
    BooleanAttr('interactive'),
  ]
};

// Define and register the component
AdaptiveCard.define();

// Export for module usage
export { AdaptiveCard };