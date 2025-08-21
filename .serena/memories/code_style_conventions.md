# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Yes
- **No any types**: Enforced
- **No Array.forEach**: Use for...of loops instead

## Naming Conventions
- **Classes**: PascalCase (e.g., `WebComponent`, `ViewTemplate`)
- **Interfaces**: PascalCase with descriptive suffixes (e.g., `AdoptableStylesStatic`, `AttrBehavior`)
- **Functions**: camelCase (e.g., `valueToSheet`, `invokeCallback`)
- **Constants**: camelCase or UPPER_CASE for frozen objects (e.g., `Keys`, `Orientation`)
- **Private fields**: Prefixed with # (e.g., `#view`, `#template`)
- **Type aliases**: PascalCase (e.g., `Dict`, `KeyName`)

## Code Organization
- Clear section separators with comment blocks
- Logical grouping of related functionality
- Helper functions defined before main classes
- Static methods and properties clearly marked

## Export Strategy
- Explicit exports for public API
- Helper utilities marked as internal when appropriate
- Type exports alongside implementation

## Error Handling
- Explicit error messages in Japanese (e.g., "親要素が存在しません。")
- Guard clauses for invalid states
- Type narrowing for safety

## Comments
- Japanese comments for section headers and important notes
- Minimal inline comments (code should be self-documenting)
- ESLint directives where necessary