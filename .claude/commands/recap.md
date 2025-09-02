---
description: Extract learnings and update knowledge base from completed work
argument-hint: [task or session description]
allowed-tools: Read, Write, Bash, Grep, Glob, LS, mcp__serena__write_memory
---

# Recap: $ARGUMENTS

## Execution Process

### Phase 1: Gather Context
1. Identify work scope (git diff, commits)
2. Load implementation plan if exists
3. Review session history
4. Check PR/issue if applicable

### Phase 2: Analyze Changes
```bash
# Git analysis
git log --oneline -10
git diff --stat HEAD~X
git show --name-only HEAD
```

### Phase 3: Extract Learnings
Categories to document:
- Technical discoveries
- Pattern recognition
- Problem solutions
- Performance insights
- Tool usage improvements

### Phase 4: Generate Documentation

## Recap Report Structure

```markdown
# Task Recap: [Task Name]
**Date**: YYYY-MM-DD
**Duration**: [Estimated time spent]
**Status**: Completed

## Summary
Brief overview of what was accomplished

## Objectives vs Outcomes
| Objective | Outcome | Status |
|-----------|---------|--------|
| Goal 1 | Result 1 | ✅ |
| Goal 2 | Result 2 | ✅ |

## Implementation Details

### Changes Made
- File 1: [Description of changes]
- File 2: [Description of changes]

### Key Decisions
1. **Decision**: [What was decided]
   - **Rationale**: [Why]
   - **Alternatives Considered**: [Other options]

### Code Patterns Used
```typescript
// Pattern example
```

## Learnings & Insights

### Technical Learnings
- **Discovery**: [What was learned]
  - **Context**: [When/where it applies]
  - **Example**: [Code or usage example]

### Process Improvements
- [Improvement discovered]

### Tool Usage
- [New tool or command learned]

## Challenges & Solutions

### Challenge 1
- **Problem**: [Description]
- **Solution**: [How it was solved]
- **Future Prevention**: [How to avoid]

## Metrics & Performance

### Code Metrics
- Lines added: X
- Lines removed: Y
- Files modified: Z
- Test coverage: N%

### Quality Metrics
- Type safety: ✅
- Tests passing: X/Y
- Lint issues: 0

## Knowledge Base Updates

### New Patterns
→ Added to `docs/knowledge/patterns.md`
- [Pattern name and description]

### New Learnings
→ Added to `docs/knowledge/learnings.md`
- [Learning summary]

### Documentation Updates
- [Doc file]: [What was updated]

## Future Recommendations

### Immediate Actions
1. [Action item]

### Technical Debt
1. [Debt item identified]

### Process Improvements
1. [Suggested improvement]

## References
- Implementation Plan: [link]
- PR/Issue: [link]
- Related Docs: [links]
```

## Knowledge Management Integration

### Update Locations
1. **docs/knowledge/learnings.md**
   ```markdown
   ## [Date] [Topic]
   **Tags**: #tag1 #tag2
   ### Summary
   ### Details
   ### Example
   ```

2. **docs/knowledge/patterns.md**
   ```markdown
   ## [Pattern Name]
   **Tags**: #webcomponents #pattern
   **Use Case**: [When to use]
   ### Problem
   ### Solution
   ### Example
   ```

3. **Serena Memory**
   ```bash
   # Update project memory
   mcp__serena__write_memory
   ```

## Automated Actions

### Git Commit for Documentation
```bash
git add docs/knowledge/
git commit -m "docs: add learnings from [task]"
```

### Archive Completed Plans
```bash
mv docs/plans/feature-*.md docs/plans/archived/
```

## Project-Specific Recap Focus

### Web Components
- Component patterns discovered
- Accessibility improvements
- CSS variable usage patterns
- Shadow DOM insights

### TypeScript
- Type patterns identified
- Generic usage improvements
- Strict mode learnings

### Testing
- Test patterns developed
- Coverage improvements
- Edge cases discovered

## Common Recap Triggers

### After Feature Implementation
```
/recap new accordion component implementation
```

### After Bug Fix
```
/recap button hover state bug fix
```

### After Refactoring
```
/recap CSS variable pattern refactoring
```

### End of Session
```
/recap today's development session
```

## Integration with Workflow

### Standard Flow
1. `/design` → Plan created
2. `/implement` → Code written
3. `/review` → Quality checked
4. `/recap` → Knowledge captured ← You are here

### Knowledge Persistence
- Learnings → Long-term memory
- Patterns → Reusable templates
- Decisions → Architecture records