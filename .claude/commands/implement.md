---
description: Execute TDD implementation based on plan
argument-hint: <task_id_or_description>
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, LS, TodoWrite, mcp__serena__*
---

# Implement: $ARGUMENTS

## Execution Process

### Phase 1: Load Implementation Plan
1. Locate plan in `docs/plans/` or `tmp/plan.md`
2. Parse task breakdown and current progress
3. Identify next task to implement

### Phase 2: Plan Development
1. Break down current task into subtasks
2. Use TodoWrite tool to track progress
3. Set up development environment

### Phase 3: Execute Implementation (TDD)
1. **Write Tests First**
   ```bash
   npm run tdd  # Start in watch mode
   ```
   - Create failing test for the feature
   - Ensure test captures requirements

2. **Minimal Implementation**
   - Write minimum code to pass test
   - Focus on functionality over optimization

3. **Refactor**
   - Improve code structure
   - Apply project patterns
   - Ensure type safety (no `any`)

4. **Verify**
   ```bash
   npm run claude:quick  # Type check + test
   ```

### Phase 4: Validate
1. Run full test suite
2. Check type safety
3. Verify accessibility requirements
4. Ensure ::part() usage for styling

### Phase 5: Clean Up
- Remove AI-generated comments
- Format code properly
- Update documentation if needed

### Phase 6: Commit Changes
```bash
git add .
git commit -m "feat(scope): implement [task description]"
```

### Phase 7: Update Progress
- Mark task complete in plan
- Update TodoWrite list
- Document any learnings

## Project-Specific Requirements

### Web Components Pattern
```typescript
class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`
      <div part="base">
        <!-- Use part attributes, not classes -->
      </div>
    `,
    styles: css`
      :host { display: block; }
      [part="base"] {
        /* Use CSS variables for theming */
        background: var(--component-bg);
      }
    `,
    attributes: ['value', BooleanAttr('disabled')]
  };
}
MyComponent.define();
```

### Quality Checklist
- [ ] No `any` types used
- [ ] No `Array.forEach` (use `for...of`)
- [ ] Private fields use `#` prefix
- [ ] Error messages in Japanese
- [ ] Tests written and passing
- [ ] Accessibility verified
- [ ] Documentation updated

## Common Commands During Implementation
```bash
# Development
npm run tdd              # TDD mode
npm run type-check       # Type checking

# Validation
npm run claude:check     # Quick validation
npm run claude:verify    # Full CI check

# Testing
npm run test            # Run all tests
npm run test:coverage   # Check coverage
```

## Error Handling
If implementation encounters issues:
1. Document the blocker
2. Research solution (use `/ask` if needed)
3. Update plan if approach changes
4. Continue or escalate as appropriate