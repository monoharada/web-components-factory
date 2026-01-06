# Code Review: packages/core/autoloader.ts

**Reviewed Date**: 2026-01-06
**Reviewer**: Claude Code (the-reviewer agent)
**File**: `/Users/reiharada/conductor/workspaces/web-components-factory/luxembourg/packages/core/autoloader.ts`

## Overall Assessment

**Status**: Good quality code with some opportunities for improvement

**Strengths**:
- Well-structured with clear separation of concerns
- Proper use of private fields (#)
- Good TypeScript typing
- Efficient DOM scanning with TreeWalker
- Shadow DOM support

## Detailed Findings

### 1. Critical Issues
**None found** - No blocking issues

### 2. Warnings (Should Fix)

#### 2.1 Race Condition in #loadComponent (Lines 157-194)
**Issue**: `this.#loaded.add(tagName)` is called before the import completes
```typescript
// Current (Line 168):
this.#loaded.add(tagName);  // Added BEFORE loading
const loadPromise = import(tagName)
  .then(...)
  .catch(...);
```

**Problem**: If loading fails, the tag remains in #loaded but was never actually loaded

**Recommendation**:
```typescript
async #loadComponent(tagName: string): Promise<unknown> {
  if (customElements.get(tagName)) return;
  if (this.#loaded.has(tagName)) return;

  const existing = this.#loading.get(tagName);
  if (existing) return existing;

  this.#pending.delete(tagName);
  this.#log(`Loading via Import Maps: ${tagName}`);

  const loadPromise = import(tagName)
    .then((module) => {
      this.#loading.delete(tagName);
      this.#loaded.add(tagName);  // Move here - only after success
      this.#log(`Loaded: ${tagName}`);
      this.#onLoad(tagName);

      customElements.whenDefined(tagName).then(() => {
        this.#observeShadowRoots(tagName);
      });

      return module;
    })
    .catch((error) => {
      this.#loading.delete(tagName);
      this.#loaded.delete(tagName);  // Also remove from loaded on error
      this.#log(`Failed to load: ${tagName}`, error);
      throw error;
    });

  this.#loading.set(tagName, loadPromise);
  return loadPromise;
}
```

#### 2.2 Potential Memory Leak in IntersectionObserver (Lines 143-148)
**Issue**: Elements are observed but may not be unobserved if component load fails
```typescript
if (this.#lazyLoad && this.#intersectionObserver) {
  if (!this.#pending.has(tagName)) {
    this.#pending.add(tagName);
    this.#intersectionObserver.observe(el);  // No cleanup on error
  }
}
```

**Problem**: If #loadComponent throws, the element remains observed indefinitely

**Recommendation**: Add cleanup in the catch block of #loadComponent:
```typescript
.catch((error) => {
  this.#loading.delete(tagName);
  this.#loaded.delete(tagName);
  this.#pending.delete(tagName);  // Clean up pending
  // Unobserve all elements with this tagName
  document.querySelectorAll(tagName).forEach(el => {
    this.#intersectionObserver?.unobserve(el);
  });
  this.#log(`Failed to load: ${tagName}`, error);
  throw error;
});
```

### 3. Suggestions (Consider Improving)

#### 3.1 Duplicate Custom Element Check (Lines 113-116 & 124-128)
**Issue**: Custom element detection logic is duplicated
```typescript
// Lines 113-116 (TreeWalker filter):
const tagName = node.tagName.toLowerCase();
return tagName.includes('-') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

// Lines 124-128 (Root element check):
const rootTag = root.tagName.toLowerCase();
if (rootTag.includes('-')) {
  this.#processElement(root);
}
```

**Recommendation**: Extract to a helper method
```typescript
#isCustomElement(el: Element): boolean {
  return el.tagName.toLowerCase().includes('-');
}

#scan(root: Node): void {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node: Node): number => {
        return node instanceof Element && this.#isCustomElement(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    }
  );

  if (root instanceof Element && this.#isCustomElement(root)) {
    this.#processElement(root);
  }

  while (walker.nextNode()) {
    this.#processElement(walker.currentNode as Element);
  }
}
```

#### 3.2 Error Handling Could Be More Specific
**Issue**: Generic error logging without structured error information
```typescript
.catch((error) => {
  this.#log(`Failed to load: ${tagName}`, error);
  throw error;
});
```

**Recommendation**: Add structured error with more context
```typescript
.catch((error) => {
  const loadError = new Error(
    `Web Componentsのロード失敗: ${tagName}`,
    { cause: error }
  );
  this.#log(`Failed to load: ${tagName}`, {
    tagName,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  throw loadError;
});
```

#### 3.3 Type Safety in #observeShadowRoots (Lines 199-212)
**Issue**: querySelectorAll might return elements that are not instances of the expected component
```typescript
const elements = document.querySelectorAll(tagName);
for (const el of elements) {
  if (el.shadowRoot && !this.#observedShadowRoots.has(el.shadowRoot)) {
    // Direct access to shadowRoot might be null even if checked
  }
}
```

**Recommendation**: Add type guard and null safety
```typescript
#observeShadowRoots(tagName: string): void {
  const elements = document.querySelectorAll(tagName);
  for (const el of elements) {
    const shadowRoot = el.shadowRoot;
    if (shadowRoot && !this.#observedShadowRoots.has(shadowRoot)) {
      this.#observedShadowRoots.add(shadowRoot);
      this.#scan(shadowRoot);
      this.#mutationObserver.observe(shadowRoot, {
        childList: true,
        subtree: true
      });
      this.#log(`[ShadowRoot] Observing ${tagName}`);
    }
  }
}
```

#### 3.4 Return Type Consistency
**Issue**: #loadComponent returns `Promise<unknown>` but module type could be more specific
```typescript
async #loadComponent(tagName: string): Promise<unknown> {
  // ...
}
```

**Recommendation**: Consider using a more specific type or documenting why unknown is used
```typescript
// Option 1: More specific type
interface WebComponentModule {
  default?: CustomElementConstructor;
  [key: string]: unknown;
}
async #loadComponent(tagName: string): Promise<WebComponentModule | void> {
  // ...
}

// Option 2: Add JSDoc explaining unknown
/**
 * コンポーネントをロード（Import Maps経由）
 * @returns ロードされたモジュール（型は動的なため unknown）
 */
async #loadComponent(tagName: string): Promise<unknown> {
  // ...
}
```

#### 3.5 Magic Numbers in Configuration
**Issue**: Default values are hardcoded
```typescript
this.#lazyLoad = options.lazyLoad ?? true;
// Line 62:
{ rootMargin: options.rootMargin ?? '100px', threshold: 0 }
```

**Recommendation**: Extract to constants for better maintainability
```typescript
// At the top of the file:
const DEFAULT_OPTIONS = {
  debug: false,
  lazyLoad: true,
  rootMargin: '100px',
  threshold: 0
} as const;

// In constructor:
this.#lazyLoad = options.lazyLoad ?? DEFAULT_OPTIONS.lazyLoad;

// In IntersectionObserver:
{
  rootMargin: options.rootMargin ?? DEFAULT_OPTIONS.rootMargin,
  threshold: DEFAULT_OPTIONS.threshold
}
```

#### 3.6 Potential Performance Issue with querySelectorAll
**Issue**: Line 200 queries entire document every time a component is defined
```typescript
#observeShadowRoots(tagName: string): void {
  const elements = document.querySelectorAll(tagName);  // Full DOM query
  // ...
}
```

**Recommendation**: Only query elements that need observation
- Keep track of which elements triggered the load
- Or use MutationObserver records to target specific elements

However, this might be acceptable since it only runs once per component definition.

### 4. Code Style & Best Practices

#### 4.1 Consistency: Follows TypeScript Best Practices ✅
- Proper use of private fields (#)
- No `any` types
- No `Array.forEach` (uses `for...of`)
- Good naming conventions

#### 4.2 Good: Proper Resource Cleanup ✅
```typescript
stop(): void {
  this.#mutationObserver.disconnect();
  this.#intersectionObserver?.disconnect();
}
```

#### 4.3 Good: Deduplication Strategy ✅
Using Sets and Maps to prevent duplicate loading:
- `#loaded`: Tracks successfully loaded components
- `#loading`: Prevents concurrent loading
- `#pending`: Tracks components waiting for visibility
- `#observedShadowRoots`: Prevents duplicate Shadow DOM observation

### 5. Testing Considerations

**Recommendations for test coverage**:
1. Test race condition handling (multiple calls to load same component)
2. Test error recovery (failed import, then retry)
3. Test IntersectionObserver cleanup on errors
4. Test Shadow DOM discovery in nested components
5. Test memory leak prevention (WeakSet usage)

## Priority Recommendations

### High Priority
1. Fix race condition in #loadComponent (2.1)
2. Add IntersectionObserver cleanup on errors (2.2)

### Medium Priority
3. Extract custom element detection logic (3.1)
4. Improve error handling with structured errors (3.2)

### Low Priority
5. Extract magic numbers to constants (3.5)
6. Consider more specific return type for #loadComponent (3.4)

## Summary

The code is well-written with good architectural decisions. The main concerns are:
- **Race condition** when marking components as loaded before import completes
- **Potential memory leak** with IntersectionObserver not cleaning up on errors
- Minor code duplication that could be refactored

Overall quality: **7.5/10** - Production-ready with recommended fixes for edge cases.
