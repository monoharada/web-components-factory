# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript utility library for creating Web Components with strict typing and no use of `any` types or `Array.forEach`.

## Commands

### TypeScript Compilation
```bash
# Type check only (no emit)
tsc --noEmit web-components.ts --strict

# Compile to JavaScript
tsc web-components.ts --strict --target ES2020 --module ES2020
```

Note: No package.json or build system is configured. Consider setting up proper tooling as the project grows.

## Code Architecture

### Core Components

1. **WebComponent Base Class**
   - Base class for all web components
   - Handles shadow DOM, styles, and attribute management
   - Static `define()` method for registration

2. **FormComponent**
   - Extends WebComponent for form-associated custom elements
   - Implements form participation API

3. **Template System**
   - `ViewTemplate`: HTML template management with caching
   - `View`: DOM fragment wrapper with ref system for element access
   - `html` template literal function for creating templates

4. **Style Management**
   - `AdoptableStyles`: Manages CSSStyleSheet instances with caching
   - `css` template literal function for creating stylesheets

5. **Attribute System**
   - `PropertyAttr`: Reflected attributes
   - `BooleanAttr`: Boolean attributes
   - `TransferringPropertyAttr`: Transfers attributes to child elements
   - `NonReflectingPropertyAttr`: Non-reflected properties

## Code Style Requirements

- **Strict TypeScript**: No `any` types allowed
- **No Array.forEach**: Use `for...of` loops instead
- **Private fields**: Use `#` prefix for private class fields
- **Error messages**: Use Japanese for error messages
- **Naming conventions**:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Private fields: #camelCase

## Development Workflow

When modifying code:
1. Maintain strict TypeScript compliance
2. Follow existing patterns for component creation
3. Use the established attribute behavior system
4. Ensure proper encapsulation with private fields
5. Type check with: `tsc --noEmit web-components.ts --strict`

## Key Patterns

### Creating a Component
```typescript
class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`<div>Content</div>`,
    styles: css`:host { display: block; }`,
    attributes: ['value', BooleanAttr('disabled')]
  };
}
MyComponent.define();
```

### Form-Associated Component
```typescript
class MyInput extends FormComponent {
  static readonly formAssociated = true;
  // Implements form participation
}
```