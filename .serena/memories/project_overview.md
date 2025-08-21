# Web Components Factory - Project Overview

## Purpose
A TypeScript utility library for creating Web Components with a focus on strict typing and no use of 'any' types or Array.forEach.

## Tech Stack
- **Language**: TypeScript (strict mode)
- **Target**: Web Components API
- **Dependencies**: None (standalone library)
- **Build System**: Not configured (single file library)

## Key Features
1. **CSS-in-JS Support**: AdoptableStyles system with caching
2. **Template System**: ViewTemplate for HTML templating with ref system
3. **Attribute Management**: Multiple attribute types (PropertyAttr, BooleanAttr, TransferringPropertyAttr, NonReflectingPropertyAttr)
4. **Form Components**: FormComponent base class with form association
5. **Keyboard Navigation**: ElementSelection for keyboard navigation support

## Main Components
- `WebComponent`: Base class for all web components
- `FormComponent`: Extended base for form-associated components
- `WebComponentDefinition`: Component definition and registration
- `View` & `ViewTemplate`: Template and DOM management
- `AdoptableStyles`: Style sheet management with caching
- `ElementSelection`: Keyboard navigation utility

## File Structure
- Single file library: `web-components.ts`
- No package.json or build configuration
- Serena project configuration in `.serena/`