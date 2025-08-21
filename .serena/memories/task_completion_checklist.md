# Task Completion Checklist

When completing a task in this project:

## 1. Code Quality Checks
- Ensure no `any` types are used
- Verify no `Array.forEach` is used (use for...of instead)
- Check that all new code follows strict TypeScript conventions
- Maintain consistent naming conventions (PascalCase for classes, camelCase for functions)

## 2. Type Checking
If TypeScript compiler is available:
```bash
tsc --noEmit web-components.ts --strict
```

## 3. Code Style
- Ensure proper section separators with comment blocks
- Private fields should use # prefix
- Japanese error messages where appropriate
- Maintain consistent export patterns

## 4. Documentation
- Update inline comments if logic is complex
- Ensure exported APIs are clear and self-documenting

## 5. Manual Testing
Since no test framework is configured:
- Test new components in a browser environment
- Verify shadow DOM behavior if applicable
- Check form association for FormComponent derivatives
- Test keyboard navigation if ElementSelection is used

## 6. Git Operations
- Review changes: `git diff`
- Stage changes: `git add web-components.ts`
- Commit with descriptive message

## Note
Consider setting up proper tooling (package.json, test framework, linter) as the project grows.