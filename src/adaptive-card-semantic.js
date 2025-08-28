// AdaptiveCard Web Component - Semantically Enhanced Version
// Focus: Semantic HTML5, Accessibility (WCAG 2.2), Screen Reader Optimization

import { WebComponent, html, css, PropertyAttr, BooleanAttr } from '../web-components.ts';

// Constants for reusable values
const CONSTANTS = {
  PROTOCOLS: ['http:', 'https:', 'mailto:', 'tel:'],
  INTERACTIVE_SELECTORS: 'button, a, input[type="button"], input[type="submit"], [role="button"]',
  ANNOUNCEMENT_TIMEOUT: 1000,
  ID_PREFIX: {
    TITLE: 'card-title-',
    LIVE: 'card-live-'
  },
  ARIA: {
    FALLBACK_LABEL: 'Interactive card',
    LIVE_POLITE: 'polite',
    ROLE_REGION: 'region'
  },
  CSS_CLASSES: {
    SR_ONLY: 'sr-only',
    STRETCHED_LINK: 'card-link--stretched',
    HAS_CONTENT: 'has-content'
  },
  DATA_ATTRS: {
    HAS_CTA: 'data-has-cta'
  }
};

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

// CSS sections organized by concern
const baseStyles = css`
  /* =========================
     Host Element Base Styles
     ========================= */
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

  /* =========================
     Card Structure
     ========================= */
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

  /* =========================
     Slotted Content Styles
     ========================= */
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

  /* =========================
     Responsive Design
     ========================= */
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

  /* =========================
     Accessibility Features
     ========================= */
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

  /* =========================
     Stretched Link Pattern
     ========================= */
  .card-link--stretched {
    position: absolute;
    inset: 0;
    z-index: 1;
    text-decoration: none;
    border-radius: inherit;
    /* テキストを視覚的に隠す（スクリーンリーダーには読み上げられる） */
    font-size: 0;
    overflow: hidden;
    text-indent: -9999px;
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

  /* =========================
     Content Visibility Rules
     ========================= */
  .card-header:not(.has-content),
  .card-media:not(.has-content),
  .card-details:not(.has-content),
  .card-footer:not(.has-content) {
    display: none;
  }
`;

// Combine all styles
const cardStyles = baseStyles;

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
    this.setupAriaLabeling();
    this.setupRoleAttribute();
    this.setupLiveRegion();
  }

  setupRoleAttribute() {
    // Early return if role already exists or no href
    if (this.hasAttribute('role') || !this.hasAttribute('href')) {
      return;
    }
    this.setAttribute('role', CONSTANTS.ARIA.ROLE_REGION);
  }

  setupAriaLabeling() {
    // Early return if already labeled
    if (this.getAttribute('aria-label') || this.getAttribute('aria-labelledby')) {
      return;
    }

    const titleElement = this.getTitleElement();
    if (titleElement) {
      this.labelWithTitle(titleElement);
    } else {
      this.setAttribute('aria-label', CONSTANTS.ARIA.FALLBACK_LABEL);
    }
  }

  getTitleElement() {
    const titleSlot = this.shadowRoot.querySelector('slot[name="title"]');
    return titleSlot?.assignedElements()?.[0];
  }

  labelWithTitle(titleElement) {
    if (!titleElement.id) {
      titleElement.id = `${CONSTANTS.ID_PREFIX.TITLE}${this.generateId()}`;
    }
    this.setAttribute('aria-labelledby', titleElement.id);
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
    const hasContent = this.slotHasContent(slot);
    const section = this.findParentSection(slot);
    
    if (section) {
      section.classList.toggle(CONSTANTS.CSS_CLASSES.HAS_CONTENT, hasContent);
    }
  }

  slotHasContent(slot) {
    return slot.assignedElements().length > 0 || 
           slot.assignedNodes().some(node => this.isNonEmptyTextNode(node));
  }

  isNonEmptyTextNode(node) {
    return node.nodeType === Node.TEXT_NODE && 
           node.textContent.trim() !== '';
  }

  findParentSection(slot) {
    return slot.closest('.card-header, .card-media, .card-details, .card-footer');
  }

  setupKeyboardNavigation() {
    if (!this.href) return;
    
    this.addEventListener('keydown', this.handleCardKeydown.bind(this));
  }

  handleCardKeydown(event) {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    const isThisCardFocused = (this.shadowRoot.activeElement || document.activeElement) === this;
    
    if (isActivationKey && isThisCardFocused && this.href) {
      event.preventDefault();
      this.click();
    }
  }

  setupLiveRegion() {
    const liveRegion = this.createLiveRegionElement();
    this.shadowRoot.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  createLiveRegionElement() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', CONSTANTS.ARIA.LIVE_POLITE);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = CONSTANTS.CSS_CLASSES.SR_ONLY;
    liveRegion.id = `${CONSTANTS.ID_PREFIX.LIVE}${this.generateId()}`;
    return liveRegion;
  }

  announceChange(message) {
    if (!this.liveRegion) {
      return;
    }
    
    this.liveRegion.textContent = message;
    this.clearAnnouncementAfterDelay();
  }

  clearAnnouncementAfterDelay() {
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, CONSTANTS.ANNOUNCEMENT_TIMEOUT);
  }


  setupStretchedLink() {
    this.removeExistingStretchedLink();

    const href = this.href;
    if (!href || !this.validateURL(href)) {
      return;
    }

    if (this.hasInteractiveButtons()) {
      this.markAsHavingCTA();
      return;
    }

    this.createAndConfigureStretchedLink();
  }

  removeExistingStretchedLink() {
    if (this._stretchedLink) {
      this._stretchedLink.remove();
      this._stretchedLink = null;
    }
  }

  markAsHavingCTA() {
    this.setAttribute(CONSTANTS.DATA_ATTRS.HAS_CTA, 'true');
  }

  createAndConfigureStretchedLink() {
    this._stretchedLink = this.createStretchedLinkElement();
    this.configureStretchedLinkTarget();
    this.configureStretchedLinkAccessibility();
    this.attachStretchedLink();
    this.updateCardForStretchedLink();
  }

  createStretchedLinkElement() {
    const link = document.createElement('a');
    link.href = this.href;
    link.className = CONSTANTS.CSS_CLASSES.STRETCHED_LINK;
    return link;
  }

  configureStretchedLinkTarget() {
    if (!this.linkTarget) {
      return;
    }
    
    this._stretchedLink.target = this.linkTarget;
    if (this.linkTarget === '_blank') {
      this._stretchedLink.rel = 'noopener noreferrer';
    }
  }

  configureStretchedLinkAccessibility() {
    const linkText = this.linkText || this.getDefaultLinkText();
    if (!linkText) {
      return;
    }

    // リンクテキストを直接設定（aria-labelは不要）
    this._stretchedLink.textContent = linkText;
  }

  getDefaultLinkText() {
    const titleElement = this.getTitleElement();
    return titleElement?.textContent?.trim();
  }

  attachStretchedLink() {
    const article = this.refs?.cardArticle || this.shadowRoot?.querySelector('.card-article');
    if (article) {
      article.appendChild(this._stretchedLink);
    }
  }

  updateCardForStretchedLink() {
    this.setAttribute('role', CONSTANTS.ARIA.ROLE_REGION);
    this.setAttribute(CONSTANTS.DATA_ATTRS.HAS_CTA, 'false');
    
    this.emitEvent('card-link-setup', {
      href: this.href,
      linkText: this.linkText,
      linkTarget: this.linkTarget,
      hasButtons: false
    });
  }

  hasInteractiveButtons() {
    const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
    if (!actionsSlot) {
      return false;
    }
    
    const assignedElements = actionsSlot.assignedElements();
    return assignedElements.some(el => this.isInteractiveElement(el));
  }

  isInteractiveElement(element) {
    return element.matches(CONSTANTS.INTERACTIVE_SELECTORS) ||
           element.querySelector(CONSTANTS.INTERACTIVE_SELECTORS) !== null;
  }

  validateURL(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return CONSTANTS.PROTOCOLS.includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  updateContent(changes) {
    const announcements = Object.entries(changes)
      .filter(([slot, content]) => this.updateSlotContent(slot, content))
      .map(([slot]) => `${slot} updated`);
    
    if (announcements.length > 0) {
      this.announceChange?.(announcements.join(', '));
    }
  }

  updateSlotContent(slot, content) {
    const slotElement = this.querySelector(`[slot="${slot}"]`);
    if (slotElement) {
      slotElement.textContent = content;
      return true;
    }
    return false;
  }

  focusFirstInteractive() {
    const interactiveElement = this.querySelector(CONSTANTS.INTERACTIVE_SELECTORS + ', input, select, textarea, [tabindex]');
    interactiveElement?.focus();
    return !!interactiveElement;
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