/**
 * AdaptiveCard CSS Styles Manager
 * Separates CSS concerns from the main component for better maintainability
 */

export class CardStyles {
  /**
   * Get the complete CSS styles for the AdaptiveCard component
   * @returns {string} The complete CSS stylesheet
   */
  static getStyles() {
    return `
      ${this.getHostStyles()}
      ${this.getLayoutStyles()}
      ${this.getSlottedContentStyles()}
      ${this.getFocusAndInteractionStyles()}
      ${this.getResponsiveStyles()}
      ${this.getAccessibilityStyles()}
      ${this.getStretchedLinkStyles()}
    `;
  }

  /**
   * Host element and basic card styling
   */
  static getHostStyles() {
    return `
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
    `;
  }

  /**
   * Layout structure styles for card sections
   */
  static getLayoutStyles() {
    return `
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

      /* Show/hide sections based on content */
      .card-header:not(.has-content),
      .card-media:not(.has-content),
      .card-details:not(.has-content),
      .card-footer:not(.has-content) {
        display: none;
      }
    `;
  }

  /**
   * Styles for slotted content elements
   */
  static getSlottedContentStyles() {
    return `
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
    `;
  }

  /**
   * Focus states and interactive element styles
   */
  static getFocusAndInteractionStyles() {
    return `
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

      ::slotted(button:focus-visible) {
        outline: 2px solid var(--focus-color, #2563eb);
        outline-offset: 2px;
      }

      ::slotted(a:focus-visible) {
        outline: 2px solid var(--focus-color, #2563eb);
        outline-offset: 2px;
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
    `;
  }

  /**
   * Responsive design styles
   */
  static getResponsiveStyles() {
    return `
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

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        ::slotted(button) {
          transition: none;
        }
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
    `;
  }

  /**
   * Accessibility-related styles
   */
  static getAccessibilityStyles() {
    return `
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
    `;
  }

  /**
   * Stretched link pattern styles
   */
  static getStretchedLinkStyles() {
    return `
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
    `;
  }

  /**
   * Get the HTML template structure
   * @returns {string} The HTML template
   */
  static getTemplate() {
    return `
      <article class="card-article" role="article">
        <header class="card-header">
          <slot name="title"></slot>
          <slot name="subtitle"></slot>
          <slot name="badge"></slot>
        </header>
        
        <div class="card-media">
          <slot name="media"></slot>
        </div>
        
        <section class="card-content">
          <slot></slot>
          <slot name="content"></slot>
        </section>
        
        <aside class="card-details">
          <slot name="details"></slot>
          <slot name="metadata"></slot>
        </aside>
        
        <footer class="card-footer">
          <slot name="actions"></slot>
        </footer>
      </article>
    `;
  }
}