# Adaptive Card Component Design Document

## Overview

The Adaptive Card Component is a versatile, responsive container element built using the `@web-components.ts` library. It provides a flexible card interface that adapts to different screen sizes and contexts while maintaining accessibility and performance standards. The component follows Material Design 3 principles with support for multiple visual variants and interactive states.

### Problem Statement

Modern web applications require consistent card components that can display various types of content (text, media, actions) while adapting to different viewport sizes and interaction patterns. Current solutions often lack proper accessibility, customization options, or responsive behavior.

### Solution Summary  

A custom web component (`<adaptive-card>`) that leverages the web-components.ts library's architecture to provide:
- Responsive layout with automatic breakpoint adaptation
- Multiple visual variants (elevated, outlined, filled)
- Flexible content slots for composition
- Full accessibility support
- CSS custom properties for theming
- TypeScript type safety with no 'any' types

## Background

Cards are fundamental UI patterns used across web applications for organizing and presenting content. They serve as containers for related information and actions, providing visual hierarchy and interactive surfaces. The adaptive card component extends this concept by automatically adjusting its layout, spacing, and visual properties based on the viewport and context.

## Goals & Non-Goals

### Goals

1. **Responsive Adaptation**: Automatically adjust layout based on viewport breakpoints
2. **Visual Variants**: Support elevated, outlined, and filled card styles
3. **Content Flexibility**: Provide slots for header, media, content, and actions
4. **Accessibility**: Full ARIA support and keyboard navigation
5. **Performance**: Efficient rendering with Shadow DOM and CSS containment
6. **Customization**: Theming via CSS custom properties
7. **Type Safety**: Strict TypeScript with no 'any' types
8. **Error Handling**: Japanese error messages as per convention

### Non-Goals

1. **Data Binding**: Not a data-driven component (composition-based)
2. **Animation Library**: Basic transitions only, not a full animation system
3. **Form Integration**: Not a form component (though can contain forms)
4. **Drag & Drop**: Not implementing drag functionality
5. **Virtual Scrolling**: Not handling large lists internally

## Design

### System Architecture

```
┌─────────────────────────────────────────┐
│         adaptive-card Component         │
├─────────────────────────────────────────┤
│  Shadow DOM                             │
│  ┌─────────────────────────────────┐   │
│  │  Header Slot (optional)         │   │
│  ├─────────────────────────────────┤   │
│  │  Media Slot (optional)          │   │
│  ├─────────────────────────────────┤   │
│  │  Content Slot (default)         │   │
│  ├─────────────────────────────────┤   │
│  │  Actions Slot (optional)        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### API Specifications

#### Properties/Attributes

```typescript
// Type-safe constants using const assertions
export const CardVariant = {
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  FILLED: 'filled'
} as const;
export type CardVariant = typeof CardVariant[keyof typeof CardVariant];

export const CardBreakpoint = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  AUTO: 'auto'
} as const;
export type CardBreakpoint = typeof CardBreakpoint[keyof typeof CardBreakpoint];

export const CardDirection = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
} as const;
export type CardDirection = typeof CardDirection[keyof typeof CardDirection];

export const CardPadding = {
  NONE: 'none',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const;
export type CardPadding = typeof CardPadding[keyof typeof CardPadding];

export const LinkTarget = {
  BLANK: '_blank',
  SELF: '_self',
  PARENT: '_parent',
  TOP: '_top'
} as const;
export type LinkTarget = typeof LinkTarget[keyof typeof LinkTarget];

export const LinkPattern = {
  STRETCHED: 'stretched',
  PRIMARY_ACTION: 'primary-action'
} as const;
export type LinkPattern = typeof LinkPattern[keyof typeof LinkPattern];

interface AdaptiveCardProperties {
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
  
  // Link card properties (accessible pattern)
  href?: string;  // If provided, implements stretched link pattern
  linkText?: string;  // Concise text for screen reader announcement
  linkTarget?: LinkTarget;
  linkPattern?: LinkPattern;
  
  // Accessibility
  role: string;
  ariaLabel: string;
  ariaDescribedby: string;
  ariaPressed?: string;
  ariaExpanded?: string;
  ariaCurrent?: string;
  
  // Visual properties
  elevation: number; // 0-5 for elevated variant
  padding: CardPadding;
}
```

#### Methods

```typescript
interface AdaptiveCardMethods {
  // Responsive control
  updateBreakpoint(): void;
  
  // State management
  select(): void;
  deselect(): void;
  toggle(): void;
  
  // Focus management
  focusContent(): void;
  focusAction(index: number): void;
}
```

#### Events

```typescript
interface AdaptiveCardEvents {
  'card-click': CustomEvent<{ target: HTMLElement }>;
  'card-select': CustomEvent<{ selected: boolean }>;
  'card-action': CustomEvent<{ action: string; target: HTMLElement }>;
  'breakpoint-change': CustomEvent<{ breakpoint: string }>;
}
```

#### Slots

```typescript
interface AdaptiveCardSlots {
  'header': HTMLElement;    // Card header with title/subtitle
  'media': HTMLElement;     // Media content (images/video)
  'default': HTMLElement;   // Main content area
  'actions': HTMLElement;   // Action buttons/links
  'badge': HTMLElement;     // Status badge overlay
}
```

### Template Structure

```typescript
const template = html`
  <article 
    class="card"
    part="card"
    role="${this.role}"
    aria-label="${this.ariaLabel}"
    aria-describedby="${this.ariaDescribedby}"
    data-variant="${this.variant}"
    data-breakpoint="${this.breakpoint}"
    data-selected="${this.selected}"
  >
    <slot name="badge" part="badge"></slot>
    
    <header class="card-header" part="header" ?hidden="${!this.hasHeader}">
      <slot name="header"></slot>
    </header>
    
    <div class="card-media" part="media" ?hidden="${!this.hasMedia}">
      <slot name="media"></slot>
    </div>
    
    <section class="card-content" part="content">
      <slot></slot>
    </section>
    
    <footer class="card-actions" part="actions" ?hidden="${!this.hasActions}">
      <slot name="actions"></slot>
    </footer>
  </article>
`;
```

### Styling Approach

```typescript
const styles = css`
  :host {
    --card-bg: var(--adaptive-card-bg, #ffffff);
    --card-color: var(--adaptive-card-color, #000000);
    --card-border: var(--adaptive-card-border, 1px solid #e0e0e0);
    --card-radius: var(--adaptive-card-radius, 12px);
    --card-shadow: var(--adaptive-card-shadow, none);
    --card-padding: var(--adaptive-card-padding, 16px);
    --card-gap: var(--adaptive-card-gap, 16px);
    
    display: block;
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
  }
  
  /* Variant styles */
  .card[data-variant="elevated"] {
    --card-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: none;
  }
  
  .card[data-variant="outlined"] {
    border: var(--card-border);
    --card-shadow: none;
  }
  
  .card[data-variant="filled"] {
    --card-bg: var(--adaptive-card-filled-bg, #f5f5f5);
    border: none;
  }
  
  /* Responsive breakpoints */
  @container card (max-width: 480px) {
    :host([responsive]) .card {
      --card-padding: 12px;
      --card-gap: 12px;
    }
  }
  
  @container card (min-width: 481px) and (max-width: 768px) {
    :host([responsive]) .card[data-direction="horizontal"] {
      flex-direction: row;
    }
  }
  
  @container card (min-width: 769px) {
    :host([responsive]) .card {
      --card-padding: 24px;
      --card-gap: 20px;
    }
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
  
  /* Focus styles */
  :host(:focus-visible) .card {
    outline: 2px solid var(--adaptive-card-focus-color, #0066cc);
    outline-offset: 2px;
  }
`;
```

### Responsive Behavior Specifications

#### Breakpoint Detection

```typescript
class ResponsiveManager {
  private resizeObserver: ResizeObserver;
  private currentBreakpoint: string = 'auto';
  
  constructor(private host: HTMLElement) {
    this.resizeObserver = new ResizeObserver(this.handleResize);
  }
  
  private handleResize = (entries: ResizeObserverEntry[]) => {
    const width = entries[0].contentRect.width;
    const newBreakpoint = this.calculateBreakpoint(width);
    
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.host.dispatchEvent(new CustomEvent('breakpoint-change', {
        detail: { breakpoint: newBreakpoint }
      }));
    }
  };
  
  private calculateBreakpoint(width: number): string {
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    return 'desktop';
  }
}
```

#### Layout Adaptation

- **Mobile (≤480px)**:
  - Vertical card layout
  - Reduced padding (12px)
  - Stacked actions
  - Full-width media

- **Tablet (481-768px)**:
  - Optional horizontal layout
  - Medium padding (16px)
  - Side-by-side actions
  - Responsive media sizing

- **Desktop (>768px)**:
  - Flexible layout options
  - Large padding (24px)
  - Inline actions
  - Grid-aware sizing

### Accessibility Considerations

#### Link Card Accessibility Solution

When implementing cards that function as links, we face a common accessibility challenge: wrapping entire cards in anchor tags creates overly verbose screen reader announcements. Our solution uses the "stretched link" pattern and alternative interaction models:

```typescript
interface LinkCardConfig {
  href: string;
  linkText: string;  // Concise link text for screen readers
  target?: '_blank' | '_self';
}

class LinkCardAccessibility {
  // Pattern 1: Stretched Link (Recommended)
  static implementStretchedLink(card: AdaptiveCard, config: LinkCardConfig) {
    const link = document.createElement('a');
    link.href = config.href;
    link.className = 'card-link--stretched';
    link.setAttribute('aria-label', config.linkText);
    
    // Visual indication without overwhelming screen readers (XSS safe)
    const span = document.createElement('span');
    span.className = 'visually-hidden';
    span.textContent = config.linkText;  // Safe from XSS
    link.appendChild(span);
    
    // CSS will stretch this link over the entire card
    link.setAttribute('data-stretch', 'true');
    
    // Handle new tab properly
    if (config.target === '_blank') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${config.linkText} (新しいタブで開く)`);
    }
    
    return link;
  }
  
  // Pattern 2: Primary Action Link
  static implementPrimaryAction(card: AdaptiveCard, config: LinkCardConfig) {
    // Create a semantic link with clear purpose
    const actionLink = document.createElement('a');
    actionLink.href = config.href;
    actionLink.className = 'card-link--primary';
    actionLink.textContent = config.linkText;
    
    // Make card clickable but not a link itself
    card.setAttribute('role', 'article');
    card.style.cursor = 'pointer';
    
    // Delegate card click to primary link
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      // Don't trigger if clicking on other interactive elements
      if (!target.closest('a, button, input, select, textarea')) {
        actionLink.click();
      }
    });
    
    return actionLink;
  }
}
```

#### CSS for Accessible Link Cards

```css
/* Stretched link pattern */
.card {
  position: relative;
  isolation: isolate;  /* Create stacking context */
}

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

/* Ensure other interactive elements remain clickable */
.card button,
.card a:not(.card-link--stretched),
.card input,
.card select,
.card textarea {
  position: relative;
  z-index: 1;
}

/* Primary action link pattern */
.card-link--primary {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  color: var(--adaptive-card-link-color, #0066cc);
  font-weight: 500;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

.card-link--primary::after {
  content: '→';
  transition: transform 0.2s ease;
}

.card:hover .card-link--primary::after {
  transform: translateX(4px);
}

/* Visually hidden but accessible */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus styles for keyboard navigation */
.card:has(.card-link--stretched:focus-visible),
.card:has(.card-link--primary:focus-visible) {
  outline: 2px solid var(--adaptive-card-focus-color, #0066cc);
  outline-offset: 2px;
}
```

#### ARIA Implementation

```typescript
class AccessibilityManager {
  static applyAttributes(host: HTMLElement, config: AccessibilityConfig) {
    // Determine appropriate role based on card type
    let role = 'article';  // Default semantic role
    
    if (config.isLinkCard) {
      // Link cards remain articles, link handles interaction
      role = 'article';
      host.removeAttribute('tabindex');  // Link is focusable, not card
    } else if (config.interactive) {
      role = 'button';
      host.setAttribute('tabindex', '0');
      host.addEventListener('keydown', this.handleKeydown);
    }
    
    host.setAttribute('role', role);
    
    // Add descriptive labels when needed
    if (config.label && !config.isLinkCard) {
      host.setAttribute('aria-label', config.label);
    }
    
    // Link cards get description from content
    if (config.isLinkCard) {
      host.setAttribute('aria-describedby', 'card-content');
    }
    
    // Live regions for dynamic content
    if (config.dynamic) {
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'true');
    }
  }
  
  private static handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
```

#### Focus Management

- Logical focus order through slots
- Visible focus indicators
- Keyboard navigation support
- Screen reader announcements

#### Color Contrast

- Minimum WCAG AA compliance
- High contrast mode support
- Custom property overrides for theming

## Implementation Approach

### Phase 1: Core Component Structure

```typescript
import { 
  WebComponent, 
  html, 
  css, 
  PropertyAttr, 
  BooleanAttr,
  NonReflectingPropertyAttr 
} from './web-components.js';

export class AdaptiveCard extends WebComponent {
  static definition = {
    name: 'adaptive-card',
    attributes: [
      PropertyAttr('variant', 'variant'),
      BooleanAttr('responsive'),
      PropertyAttr('breakpoint'),
      PropertyAttr('direction'),
      BooleanAttr('compact'),
      BooleanAttr('interactive'),
      BooleanAttr('disabled'),
      BooleanAttr('selected'),
      BooleanAttr('expandable'),
      BooleanAttr('expanded'),
      PropertyAttr('role'),
      PropertyAttr('ariaLabel', 'aria-label'),
      PropertyAttr('ariaDescribedby', 'aria-describedby'),
      PropertyAttr('ariaPressed', 'aria-pressed'),
      PropertyAttr('ariaExpanded', 'aria-expanded'),
      PropertyAttr('ariaCurrent', 'aria-current'),
      NonReflectingPropertyAttr('elevation'),
      PropertyAttr('padding'),
      PropertyAttr('href'),
      PropertyAttr('linkText', 'link-text'),
      PropertyAttr('linkTarget', 'link-target'),
      PropertyAttr('linkPattern', 'link-pattern')
    ]
  };
  
  // Private properties
  private resizeObserver: ResizeObserver | null = null;
  private cleanupTasks: (() => void)[] = [];
  private handleClick = this.onCardClick.bind(this);
  private handleKeydown = this.onCardKeydown.bind(this);
  private handleSlotChange = this.onSlotChange.bind(this);
  
  // Property defaults with type-safe values
  variant: CardVariant = CardVariant.ELEVATED;
  responsive: boolean = true;
  breakpoint: CardBreakpoint = CardBreakpoint.AUTO;
  direction: CardDirection = CardDirection.VERTICAL;
  compact: boolean = false;
  interactive: boolean = false;
  disabled: boolean = false;
  selected: boolean = false;
  expandable: boolean = false;
  expanded: boolean = false;
  elevation: number = 1;
  padding: CardPadding = CardPadding.MEDIUM;
  
  // Lifecycle
  connectedCallback() {
    super.connectedCallback();
    this.setupResponsive();
    this.setupInteractivity();
    this.applyAccessibility();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up to prevent memory leaks
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    
    // Remove event listeners
    if (this.interactive) {
      this.removeEventListener('click', this.handleClick);
      this.removeEventListener('keydown', this.handleKeydown);
    }
    
    // Clean up slot change listener
    this.shadowRoot?.removeEventListener('slotchange', this.handleSlotChange);
  }
}
```

### Phase 2: Responsive System with Error Handling

```typescript
private setupResponsive() {
  if (!this.responsive) return;
  
  try {
    // Check for ResizeObserver support
    if (!('ResizeObserver' in window)) {
      console.warn('[AdaptiveCard] ResizeObserverがサポートされていません');
      this.fallbackToMediaQuery();
      return;
    }
    
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries || []) {
        try {
          this.updateBreakpoint(entry.contentRect.width);
        } catch (error) {
          this.logError(error as Error, 'ブレークポイント更新');
        }
      }
    });
    
    this.resizeObserver.observe(this);
  } catch (error) {
    this.logError(error as Error, 'レスポンシブ設定');
    this.fallbackToMediaQuery();
  }
}

private fallbackToMediaQuery() {
  // Fallback to window resize event
  const handleResize = () => {
    const width = this.offsetWidth;
    this.updateBreakpoint(width);
  };
  
  window.addEventListener('resize', handleResize);
  // Store for cleanup
  this.cleanupTasks.push(() => window.removeEventListener('resize', handleResize));
}

private updateBreakpoint(width: number) {
  let newBreakpoint: string;
  
  if (this.breakpoint !== 'auto') {
    newBreakpoint = this.breakpoint;
  } else {
    if (width <= 480) newBreakpoint = 'mobile';
    else if (width <= 768) newBreakpoint = 'tablet';
    else newBreakpoint = 'desktop';
  }
  
  if (newBreakpoint !== this.currentBreakpoint) {
    this.currentBreakpoint = newBreakpoint;
    this.setAttribute('data-breakpoint', newBreakpoint);
    this.emitEvent('breakpoint-change', { breakpoint: newBreakpoint });
  }
}
```

### Phase 3: Interactivity

```typescript
private setupInteractivity() {
  if (!this.interactive) return;
  
  this.addEventListener('click', this.handleClick);
  this.addEventListener('keydown', this.handleKeydown);
  
  // Set appropriate ARIA attributes
  this.setAttribute('tabindex', '0');
  this.setAttribute('role', this.role || 'button');
}

private handleClick = (event: MouseEvent) => {
  if (this.disabled) return;
  
  this.emitEvent('card-click', { 
    target: event.target as HTMLElement 
  });
  
  if (this.hasAttribute('selectable')) {
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
```

### Phase 4: Slot Management

```typescript
private checkSlots() {
  const slots = this.shadowRoot?.querySelectorAll('slot');
  
  if (!slots) return;
  
  for (const slot of slots) {
    const hasContent = slot.assignedElements().length > 0;
    const container = slot.parentElement;
    
    if (container) {
      container.toggleAttribute('hidden', !hasContent);
    }
  }
}

connectedCallback() {
  super.connectedCallback();
  
  // Monitor slot changes
  this.shadowRoot?.addEventListener('slotchange', () => {
    this.checkSlots();
  });
  
  this.checkSlots();
}
```

## Alternatives Considered

### Alternative 1: Native HTML Extension

**Approach**: Extend native `<article>` element
**Pros**: Semantic HTML, progressive enhancement
**Cons**: Limited browser support, complex polyfills
**Decision**: Rejected due to compatibility concerns

### Alternative 2: Framework-Specific Component

**Approach**: Build for specific framework (React/Vue/Angular)
**Pros**: Framework integration, ecosystem tools
**Cons**: Limited reusability, framework lock-in
**Decision**: Rejected for broader compatibility

### Alternative 3: CSS-Only Solution

**Approach**: Pure CSS with utility classes
**Pros**: No JavaScript, lightweight
**Cons**: Limited interactivity, no encapsulation
**Decision**: Rejected due to functionality requirements

### Alternative 4: Third-Party Library Extension

**Approach**: Extend Material Web Components or similar
**Pros**: Battle-tested, comprehensive
**Cons**: Large bundle, opinionated styling
**Decision**: Rejected for custom requirements

## Testing Strategy

### Unit Tests

```typescript
describe('AdaptiveCard', () => {
  it('should initialize with default properties', () => {
    const card = new AdaptiveCard();
    expect(card.variant).toBe('elevated');
    expect(card.responsive).toBe(true);
  });
  
  it('should handle breakpoint changes', () => {
    const card = new AdaptiveCard();
    const spy = jest.fn();
    card.addEventListener('breakpoint-change', spy);
    card.updateBreakpoint();
    expect(spy).toHaveBeenCalled();
  });
  
  it('should manage slot visibility', () => {
    const card = new AdaptiveCard();
    card.connectedCallback();
    const header = card.shadowRoot?.querySelector('.card-header');
    expect(header?.hasAttribute('hidden')).toBe(true);
  });
});
```

### Integration Tests

- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Responsive behavior across viewports
- Slot content projection
- Event propagation
- Style encapsulation

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA attribute validation
- Color contrast verification

### Performance Tests

- Initial render time
- Resize observer performance
- Memory usage with multiple instances
- CSS containment effectiveness
- Event handler efficiency

## Rollout Plan

### Phase 1: Alpha Release (Week 1-2)
- Core component implementation
- Basic variant support
- Initial documentation

### Phase 2: Beta Release (Week 3-4)
- Responsive system
- Interactivity features
- Accessibility implementation

### Phase 3: Release Candidate (Week 5-6)
- Performance optimization
- Browser testing
- Documentation completion

### Phase 4: Production Release (Week 7)
- Final testing
- Migration guide
- Example gallery

### Rollback Procedures

1. Version tagging for each release
2. Feature flags for progressive enhancement
3. Fallback rendering for unsupported browsers
4. Migration scripts for breaking changes

## Future Work

### Planned Enhancements

1. **Animation System**: Spring-based animations for transitions
2. **Theming Engine**: Comprehensive theme generation
3. **Layout Templates**: Pre-defined card layouts
4. **Data Binding**: Optional reactive data support
5. **Gesture Support**: Swipe and drag interactions
6. **Virtual Scrolling**: Large list optimization
7. **A11y Enhancements**: Voice control, haptic feedback
8. **Print Styles**: Optimized print layouts

### Potential Integrations

1. **Form Library**: Integration with form validation
2. **Router Support**: Deep linking for selected cards
3. **State Management**: Redux/MobX connectors
4. **Analytics**: Built-in interaction tracking
5. **Testing Utils**: Component testing helpers

### Long-term Vision

The adaptive card component will serve as the foundation for a comprehensive design system built on web-components.ts, providing:

- Consistent user experience across applications
- Reduced development time through reusability
- Improved accessibility standards
- Performance optimization through shared resources
- Easy migration path for legacy applications

## Example Usage Patterns

### Basic Card

```html
<adaptive-card variant="elevated">
  <h2 slot="header">Card Title</h2>
  <p>Card content goes here</p>
  <button slot="actions">Action</button>
</adaptive-card>
```

### Media Card

```html
<adaptive-card variant="outlined" responsive>
  <img slot="media" src="image.jpg" alt="Description">
  <h3 slot="header">Media Card</h3>
  <p>Content with media</p>
  <div slot="actions">
    <button>Share</button>
    <button>Learn More</button>
  </div>
</adaptive-card>
```

### Interactive Card

```html
<adaptive-card 
  variant="filled" 
  interactive 
  selectable
  @card-select="${handleSelect}"
>
  <span slot="badge">NEW</span>
  <h4 slot="header">Selectable Item</h4>
  <p>Click to select this card</p>
</adaptive-card>
```

### Responsive Grid

```html
<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }
</style>

<div class="card-grid">
  <adaptive-card responsive breakpoint="auto">...</adaptive-card>
  <adaptive-card responsive breakpoint="auto">...</adaptive-card>
  <adaptive-card responsive breakpoint="auto">...</adaptive-card>
</div>
```

### Themed Card

```html
<style>
  adaptive-card.custom-theme {
    --adaptive-card-bg: #1a1a1a;
    --adaptive-card-color: #ffffff;
    --adaptive-card-radius: 16px;
    --adaptive-card-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
</style>

<adaptive-card class="custom-theme" variant="elevated">
  <h2 slot="header">Themed Card</h2>
  <p>Custom styled card</p>
</adaptive-card>
```

### Accessible Link Card

```html
<!-- Pattern 1: Stretched Link (Recommended) -->
<adaptive-card 
  variant="outlined"
  href="/product/123"
  link-text="View Product Details"
  link-pattern="stretched"
>
  <img slot="media" src="product.jpg" alt="Product image">
  <h3 slot="header">Premium Headphones</h3>
  <p>High-quality wireless headphones with noise cancellation</p>
  <span slot="badge">$199</span>
  <!-- Additional interactive elements remain clickable -->
  <div slot="actions">
    <button @click="${addToCart}">Add to Cart</button>
    <button @click="${addToWishlist}">♥</button>
  </div>
</adaptive-card>

<!-- Pattern 2: Primary Action Link -->
<adaptive-card 
  variant="filled"
  href="/article/456"
  link-text="Read full article"
  link-pattern="primary-action"
>
  <h3 slot="header">Understanding Web Accessibility</h3>
  <p>Learn how to make your web applications accessible to all users...</p>
  <!-- The primary action link will be automatically added -->
</adaptive-card>

<!-- Pattern 3: Multiple Cards in a List -->
<ul role="list" class="card-list">
  <li>
    <adaptive-card
      href="/item/1"
      link-text="Item 1 details"
      link-pattern="stretched"
    >
      <h4 slot="header">Item 1</h4>
      <p>Description of item 1</p>
    </adaptive-card>
  </li>
  <li>
    <adaptive-card
      href="/item/2"
      link-text="Item 2 details"
      link-pattern="stretched"
    >
      <h4 slot="header">Item 2</h4>
      <p>Description of item 2</p>
    </adaptive-card>
  </li>
</ul>
```

### Card Collection Support

When using multiple cards in a grid or list, add proper ARIA attributes for better accessibility:

```html
<!-- Card Grid with proper accessibility -->
<div role="group" aria-label="Product cards" class="card-grid">
  <adaptive-card 
    responsive 
    breakpoint="auto"
    aria-label="Product 1"
  >...</adaptive-card>
  <adaptive-card 
    responsive 
    breakpoint="auto"
    aria-label="Product 2"
  >...</adaptive-card>
</div>
```

### Performance Monitoring

```typescript
class PerformanceMonitor {
  private marks = new Map<string, number>();
  
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) return 0;
    const duration = performance.now() - start;
    if (duration > 16) { // Longer than one frame
      console.warn(`[Performance] ${name}に${duration.toFixed(2)}msかかりました`);
    }
    return duration;
  }
}

// Usage in AdaptiveCard component
class AdaptiveCard extends WebComponent {
  private perfMonitor = new PerformanceMonitor();
  
  connectedCallback() {
    this.perfMonitor.mark('connected-start');
    super.connectedCallback();
    // ... initialization code
    this.perfMonitor.measure('接続完了', 'connected-start');
  }
}
```

### Security Manager

```typescript
class SecurityManager {
  static sanitizeHTML(html: string): string {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }
  
  static validateURL(url: string): boolean {
    try {
      const parsed = new URL(url, window.location.href);
      return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}
```

## Appendix

### TypeScript Interfaces

```typescript
// Complete type definitions
export interface AdaptiveCardElement extends WebComponent {
  variant: 'elevated' | 'outlined' | 'filled';
  responsive: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'auto';
  direction: 'vertical' | 'horizontal';
  compact: boolean;
  interactive: boolean;
  disabled: boolean;
  selected: boolean;
  role: string;
  ariaLabel: string;
  ariaDescribedby: string;
  elevation: number;
  padding: 'none' | 'small' | 'medium' | 'large';
  
  updateBreakpoint(): void;
  select(): void;
  deselect(): void;
  toggle(): void;
  focusContent(): void;
  focusAction(index: number): void;
}

export interface AdaptiveCardEventMap {
  'card-click': CustomEvent<{ target: HTMLElement }>;
  'card-select': CustomEvent<{ selected: boolean }>;
  'card-action': CustomEvent<{ action: string; target: HTMLElement }>;
  'breakpoint-change': CustomEvent<{ breakpoint: string }>;
}
```

### CSS Custom Properties Reference

```css
/* Theme Variables */
--adaptive-card-bg: Background color
--adaptive-card-color: Text color
--adaptive-card-border: Border style
--adaptive-card-radius: Border radius
--adaptive-card-shadow: Box shadow
--adaptive-card-padding: Content padding
--adaptive-card-gap: Content gap

/* State Variables */
--adaptive-card-hover-shadow: Hover shadow
--adaptive-card-active-transform: Active transform
--adaptive-card-selected-color: Selection outline
--adaptive-card-focus-color: Focus outline
--adaptive-card-disabled-opacity: Disabled opacity

/* Responsive Variables */
--adaptive-card-mobile-padding: Mobile padding
--adaptive-card-tablet-padding: Tablet padding
--adaptive-card-desktop-padding: Desktop padding
```

### Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Components | ✅ 67+ | ✅ 63+ | ✅ 10.1+ | ✅ 79+ |
| Shadow DOM | ✅ 53+ | ✅ 63+ | ✅ 10+ | ✅ 79+ |
| CSS Container Queries | ✅ 105+ | ✅ 110+ | ✅ 16+ | ✅ 105+ |
| ResizeObserver | ✅ 64+ | ✅ 69+ | ✅ 13.1+ | ✅ 79+ |
| Custom Properties | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| Adopted Stylesheets | ✅ 73+ | ✅ 101+ | ✅ 16.4+ | ✅ 79+ |

---

## Document Metadata

- **Version**: 1.0.0
- **Author**: System Architect
- **Date**: 2025-08-21
- **Status**: Proposed
- **Reviewers**: TBD
- **Approval**: Pending