---
description: Perform comprehensive multi-perspective code review
argument-hint: [scope or file paths]
allowed-tools: Read, Write, Bash, Grep, Glob, LS, Task, WebSearch, mcp__serena__*
---

# Code Review: $ARGUMENTS

Review scope: ${ARGUMENTS:-"recent changes"}

## Review Perspectives

### 1. Product Manager Perspective
- Requirements alignment
- User experience impact
- Feature completeness
- Business value delivery

### 2. Frontend Developer Perspective
- Component architecture
- State management
- Performance optimization
- Browser compatibility
- Responsive design

### 3. UI Engineer Perspective
- Web standards compliance
- Semantic HTML usage
- CSS best practices
- Design system adherence
- Accessibility (WCAG 2.2 AA)

### 4. Quality Engineer Perspective
- Test coverage
- Edge cases handling
- Error scenarios
- Integration points
- Regression risks

### 5. Refactoring Expert Perspective
- Code duplication (DRY)
- SOLID principles
- Design patterns
- Maintainability
- Technical debt

## Project-Specific Review Criteria

### Web Components
```markdown
## Web Components Review
- [ ] Uses WebComponent or FormComponent base class
- [ ] ::part() attributes for styling (no classes)
- [ ] Shadow DOM properly utilized
- [ ] Attributes properly defined and typed
- [ ] Custom elements registered with define()
```

### TypeScript
```markdown
## TypeScript Review
- [ ] No `any` types
- [ ] Proper type definitions
- [ ] No implicit any
- [ ] Private fields use `#` prefix
- [ ] Strict mode compliance
```

### CSS Patterns
```markdown
## CSS Review
- [ ] CSS variables for theming
- [ ] No duplicate property definitions
- [ ] Variable reassignment for state changes
- [ ] Design tokens utilized
- [ ] Responsive considerations
```

### Accessibility
```markdown
## Accessibility Review
- [ ] ARIA attributes proper usage
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
```

## Review Process

### Phase 1: Collect Changes
```bash
git diff --cached  # Staged changes
git diff HEAD~1    # Last commit
```

### Phase 2: Automated Checks
```bash
npm run claude:review  # Run automated checks
```

### Phase 3: Manual Review
Apply each perspective systematically

### Phase 4: Generate Report
Create report in `tmp/review-YYYYMMDD-HHMMSS.md`

## Review Report Template
```markdown
# Code Review Report
**Date**: YYYY-MM-DD HH:MM:SS
**Scope**: [Description]
**Reviewer**: Claude Code

## Summary
- **Overall Quality**: [Excellent/Good/Needs Work]
- **Critical Issues**: X
- **Suggestions**: Y

## Findings by Category

### 🔴 Critical (Must Fix)
1. [Issue description]
   - File: path/to/file.ts:line
   - Recommendation: [fix]

### 🟡 Important (Should Fix)
1. [Issue description]

### 🟢 Suggestions (Nice to Have)
1. [Improvement idea]

## Positive Observations
- [Good practice observed]
- [Well-implemented feature]

## Metrics
- Test Coverage: X%
- Type Safety: ✅/❌
- Accessibility: WCAG 2.2 AA ✅/❌
- Performance Impact: [Assessment]

## Recommendations
1. Immediate actions
2. Future improvements
3. Technical debt items

## Checklist
- [ ] All tests passing
- [ ] Type checking clean
- [ ] Lint rules satisfied
- [ ] Documentation updated
- [ ] Accessibility verified
```

## Common Issues to Check

### Code Smells
- Long methods (>30 lines)
- Deep nesting (>3 levels)
- Magic numbers/strings
- Commented-out code
- TODO comments

### Performance
- Unnecessary re-renders
- Missing memoization
- Large bundle imports
- Synchronous operations in async context

### Security
- Input validation
- XSS prevention
- No hardcoded secrets
- Proper error handling

## Review Commands
```bash
# Quick review
npm run claude:check

# Full review
npm run claude:review

# With specific focus
/review accessibility
/review performance
/review typescript
```