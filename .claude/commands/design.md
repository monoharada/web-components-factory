---
description: Create comprehensive implementation plan with research
argument-hint: <feature_or_task_description>
allowed-tools: Read, Write, Grep, Glob, LS, WebSearch, WebFetch, TodoWrite, mcp__serena__*
---

# Design Implementation Plan for: $ARGUMENTS

## Phase 1: Codebase Analysis
Search for similar patterns and conventions in the current codebase:
- Look for existing components in `@*.ts` files
- Check test patterns in `tests/` directory
- Review design patterns in `docs/knowledge/patterns.md`
- Identify CSS variable usage patterns

## Phase 2: External Research
Research best practices and examples:
- Search for "$ARGUMENTS implementation examples"
- Find relevant Web Components patterns
- Check accessibility requirements for "$ARGUMENTS"
- Look for performance considerations

## Phase 3: Create Implementation Plan

Generate a detailed plan in `docs/plans/feature-$(date +%Y%m%d)-$1.md` with:

### Required Sections:
1. **Overview**
   - Description of $ARGUMENTS
   - Estimated effort
   - Success criteria

2. **Research Findings**
   - Internal code references
   - External documentation URLs
   - Best practices discovered

3. **Architecture Design**
   - Component structure
   - Data flow
   - State management approach

4. **Task Breakdown**
   - Tasks of 30min-2h each
   - Clear dependencies
   - Testable outcomes

5. **Test Strategy**
   - Unit test approach
   - Integration test scenarios
   - E2E test requirements
   - Accessibility testing

6. **Risk Assessment**
   - Technical risks
   - Mitigation strategies
   - Fallback options

## Project-Specific Considerations for Web Components:
- Use WebComponent or FormComponent base class
- Implement with ::part() for styling (no classes)
- Ensure TypeScript strict mode compliance (no `any`)
- Plan for WCAG 2.2 AA accessibility
- Consider CSS variable patterns from design tokens
- Use Shadow DOM appropriately

## Output Requirements:
1. Save plan to `docs/plans/feature-YYYYMMDD-{name}.md`
2. Update TodoWrite with task breakdown
3. Create initial test files if needed
4. Document any new patterns discovered