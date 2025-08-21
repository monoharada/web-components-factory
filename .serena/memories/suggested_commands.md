# Suggested Commands

## Development Commands
Since this is a single-file TypeScript library without a build system configured:

### TypeScript Compilation (if tsc is installed globally)
```bash
# Compile TypeScript to JavaScript
tsc web-components.ts --strict --target ES2020 --module ES2020

# Watch mode for development
tsc web-components.ts --strict --target ES2020 --module ES2020 --watch
```

### Code Quality (if tools are installed)
```bash
# TypeScript type checking
tsc --noEmit web-components.ts --strict

# ESLint (if configured)
npx eslint web-components.ts

# Prettier formatting (if configured)
npx prettier --write web-components.ts
```

## System Commands (Darwin/macOS)
```bash
# List files
ls -la

# Search for patterns in code
grep -n "pattern" web-components.ts

# Find files
find . -name "*.ts"

# Git operations
git status
git diff
git add .
git commit -m "message"
```

## Notes
- No package.json means no npm scripts are available
- No test framework is configured
- Consider setting up a proper build system if the project grows