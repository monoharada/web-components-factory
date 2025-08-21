# Adaptive Card Component - CSS Parts & Custom Properties Improvements

## Overview

This document outlines the improvements made to the AdaptiveCard web component based on CSS Parts and CSS Custom Properties best practices from:
- [CSS Parts are saving you](https://michaelwarren.dev/blog/css-parts-are-saving-you/)
- [CSS Variables in Web Components](https://michaelwarren.dev/blog/css-variables-in-wc/)

## Key Improvements

### 1. CSS Custom Properties Design System

#### Comprehensive Property Set
The improved component exposes a complete set of CSS custom properties for every visual aspect:

```css
:host {
  /* Display & Layout */
  --adaptive-card-display: block;
  --adaptive-card-width: 100%;
  --adaptive-card-height: auto;
  
  /* Spacing Design Tokens */
  --adaptive-card-padding-block: var(--design-token-spacing-md, 1rem);
  --adaptive-card-padding-inline: var(--design-token-spacing-md, 1rem);
  --adaptive-card-gap: var(--design-token-spacing-md, 1rem);
  
  /* Color Design Tokens */
  --adaptive-card-bg: var(--design-token-surface-primary, #ffffff);
  --adaptive-card-bg-hover: var(--design-token-surface-primary-hover, #f5f5f5);
  --adaptive-card-bg-active: var(--design-token-surface-primary-active, #eeeeee);
  
  /* And many more... */
}
```

#### Benefits:
- **Predictable API**: Consistent `--adaptive-card-*` prefix for all properties
- **Design token integration**: Falls back to global design tokens
- **State-based modifiers**: Separate properties for different states
- **Section-specific control**: Granular properties for each card section

### 2. Enhanced CSS Parts Strategy

#### Multi-level Part Exposure
Each section now exposes multiple parts for maximum flexibility:

```html
<div class="card__media" part="media media-container">
  <div class="card__media-inner" part="media-inner">
    <slot name="media"></slot>
  </div>
</div>
```

#### Benefits:
- **Layout flexibility**: Target container or inner wrapper separately
- **Semantic aliases**: Multiple part names for clarity
- **Complex layouts**: Enable grid/flex modifications from outside
- **Progressive enhancement**: Add styling layers without breaking existing styles

### 3. Improved Shadow DOM Encapsulation

#### Performance Optimizations
```css
:host {
  contain: layout style;
  will-change: auto;
}
```

#### Accessibility Enhancements
```css
/* Focus indicator as separate element */
.card__focus-indicator {
  position: absolute;
  inset: calc(var(--adaptive-card-focus-offset) * -1);
  border: var(--adaptive-card-focus-width) var(--adaptive-card-focus-style) var(--adaptive-card-focus-color);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card {
    --adaptive-card-border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .card {
    --adaptive-card-transition-duration: 0.01ms;
  }
}
```

### 4. Design System Integration

#### Token Cascade Pattern
```css
/* Component property → Design token → Fallback */
--adaptive-card-radius: var(--design-token-radius-md, 0.5rem);
```

This three-tier system allows:
1. **Component-level override**: Direct property setting
2. **Design system integration**: Global token usage
3. **Safe fallback**: Default value if no token exists

### 5. TypeScript Improvements

#### Enhanced Type Definitions
```typescript
// CSS Custom Properties Interface
export interface AdaptiveCardCSSProperties {
  '--adaptive-card-display'?: string;
  '--adaptive-card-width'?: string;
  // ... all custom properties typed
}

// CSS Parts Interface
export interface AdaptiveCardParts {
  'base': HTMLElement;
  'media': HTMLElement;
  'media-inner': HTMLElement;
  // ... all parts typed
}
```

## Usage Examples

### Basic Theming
```css
adaptive-card {
  --adaptive-card-bg: #f0f4f8;
  --adaptive-card-radius: 1rem;
  --adaptive-card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Advanced Parts Styling
```css
adaptive-card::part(base) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

adaptive-card::part(header) {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}
```

### State-based Theming
```css
adaptive-card[data-selected="true"] {
  --adaptive-card-bg: var(--design-token-surface-selected);
}

adaptive-card[data-selected="true"]::part(base) {
  border-left: 4px solid var(--adaptive-card-focus-color);
}
```

### Complex Layouts with Parts
```css
adaptive-card::part(base) {
  display: grid;
  grid-template-areas:
    "media header"
    "media content"
    "media actions";
  grid-template-columns: 200px 1fr;
}

adaptive-card::part(media-container) {
  grid-area: media;
}
```

## Best Practices Applied

### 1. CSS Custom Properties
- ✅ **Semantic naming**: Clear, consistent property names
- ✅ **Scoped prefixing**: All properties prefixed with `--adaptive-card-`
- ✅ **Fallback chains**: Properties fall back to design tokens
- ✅ **State modifiers**: Separate properties for different states
- ✅ **Documentation**: All properties documented in TypeScript

### 2. CSS Parts
- ✅ **Granular exposure**: Multiple parts per section
- ✅ **Semantic naming**: Clear, descriptive part names
- ✅ **Aliases**: Multiple names for the same part
- ✅ **Layout flexibility**: Parts enable complex layouts
- ✅ **State selectors**: Parts work with attribute selectors

### 3. Performance
- ✅ **CSS containment**: Proper use of `contain` property
- ✅ **Efficient selectors**: Using `:where()` for specificity
- ✅ **Layer isolation**: Z-index management via custom properties
- ✅ **Motion preferences**: Respects user preferences

### 4. Accessibility
- ✅ **Focus management**: Separate focus indicator element
- ✅ **High contrast**: Enhanced borders in high contrast mode
- ✅ **Reduced motion**: Simplified animations when requested
- ✅ **ARIA attributes**: Proper roles and labels

### 5. Design System Integration
- ✅ **Token support**: Falls back to global design tokens
- ✅ **Theme flexibility**: Easy theme creation without modification
- ✅ **Dark mode**: Automatic adaptation with CSS
- ✅ **Responsive design**: Breakpoint-based property adjustments

## Migration Guide

### From Original to Improved Version

1. **Update imports**:
```javascript
// Old
import './adaptive-card.js';

// New
import './adaptive-card-improved.js';
```

2. **Update CSS variable names**:
```css
/* Old */
:host {
  --card-bg: #ffffff;
  --card-radius: 8px;
}

/* New */
:host {
  --adaptive-card-bg: #ffffff;
  --adaptive-card-radius: 8px;
}
```

3. **Update part selectors**:
```css
/* Old */
::part(card) { }
::part(media) { }

/* New - more options */
::part(base) { }
::part(media-container) { }
::part(media-inner) { }
```

## Testing Recommendations

### Visual Regression Testing
- Test all variants with different custom properties
- Verify part styling doesn't break encapsulation
- Check state transitions and animations

### Accessibility Testing
- Verify focus indicators in all states
- Test with high contrast mode
- Check reduced motion preferences
- Validate ARIA attributes

### Performance Testing
- Measure render performance with many cards
- Check memory usage with dynamic property changes
- Verify ResizeObserver efficiency

## Future Enhancements

### Potential Improvements
1. **CSS Layers**: Use `@layer` for better cascade control
2. **Container Queries**: Replace media queries where appropriate
3. **Logical Properties**: Full migration to logical properties
4. **Animation API**: Web Animations API for complex transitions
5. **Form Participation**: Extend FormComponent for form integration

### Considerations
- **Browser Support**: Some features require modern browsers
- **Bundle Size**: Balance features with component size
- **API Stability**: Maintain backward compatibility
- **Documentation**: Keep docs synchronized with implementation

## Conclusion

The improved AdaptiveCard component demonstrates best practices for CSS Parts and Custom Properties in Web Components. The enhancements provide:

1. **Better Developer Experience**: Predictable, well-documented API
2. **Design System Ready**: Seamless integration with token systems
3. **Maximum Flexibility**: Extensive customization without modification
4. **Performance Optimized**: Efficient rendering and updates
5. **Accessibility First**: Comprehensive a11y support

These improvements make the component more maintainable, flexible, and suitable for production use in design systems.