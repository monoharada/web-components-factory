import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { AdaptiveCardElement } from './types/adaptive-card';

// Import and register the component for testing
// import '../src/adaptive-card.js';  // Will be imported in individual tests

// Enhanced ResizeObserver Mock with realistic behavior
class ResizeObserverMock {
  private callback: ResizeObserverCallback;
  private observedElements = new Set<Element>();
  private timeouts = new Set<NodeJS.Timeout>();
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  
  observe(element: Element, options?: ResizeObserverOptions): void {
    this.observedElements.add(element);
    
    // Trigger initial observation
    const timeout = setTimeout(() => {
      if (this.observedElements.has(element)) {
        const entries: ResizeObserverEntry[] = [{
          target: element,
          contentRect: element.getBoundingClientRect(),
          borderBoxSize: [{ 
            blockSize: element.clientHeight, 
            inlineSize: element.clientWidth 
          }],
          contentBoxSize: [{ 
            blockSize: element.clientHeight, 
            inlineSize: element.clientWidth 
          }],
          devicePixelContentBoxSize: [{ 
            blockSize: element.clientHeight * window.devicePixelRatio, 
            inlineSize: element.clientWidth * window.devicePixelRatio 
          }]
        }];
        this.callback(entries, this);
      }
    }, 0);
    
    this.timeouts.add(timeout);
  }
  
  unobserve(element: Element): void {
    this.observedElements.delete(element);
  }
  
  disconnect(): void {
    this.observedElements.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Enhanced IntersectionObserver Mock
class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;
  private observedElements = new Set<Element>();
  private options: IntersectionObserverInit;
  
  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.options = options;
  }
  
  observe(element: Element): void {
    this.observedElements.add(element);
    
    // Simulate intersection
    setTimeout(() => {
      if (this.observedElements.has(element)) {
        const entries: IntersectionObserverEntry[] = [{
          target: element,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          rootBounds: null,
          time: performance.now()
        }];
        this.callback(entries, this);
      }
    }, 0);
  }
  
  unobserve(element: Element): void {
    this.observedElements.delete(element);
  }
  
  disconnect(): void {
    this.observedElements.clear();
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// CSSStyleSheet Mock (for constructable stylesheets)
if (!('CSSStyleSheet' in globalThis)) {
  class MockCSSStyleSheet {
    cssRules: CSSRule[] = [];
    
    replaceSync(css: string): void {
      // Mock implementation
    }
    
    replace(css: string): Promise<CSSStyleSheet> {
      return Promise.resolve(this);
    }
    
    insertRule(rule: string, index?: number): number {
      return 0;
    }
    
    deleteRule(index: number): void {
      // Mock implementation
    }
  }
  
  (globalThis as any).CSSStyleSheet = MockCSSStyleSheet;
}

// ElementInternals Mock (for form-associated custom elements)
if (!('ElementInternals' in globalThis)) {
  class MockElementInternals {
    form: HTMLFormElement | null = null;
    validity: ValidityState = {
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: true,
      valueMissing: false,
    };
    validationMessage = '';
    willValidate = true;
    
    checkValidity(): boolean {
      return true;
    }
    
    reportValidity(): boolean {
      return true;
    }
    
    setFormValue(value: File | string | FormData | null): void {
      // Mock implementation
    }
    
    setValidity(flags: Partial<ValidityState>, message?: string): void {
      Object.assign(this.validity, flags);
      if (message) this.validationMessage = message;
    }
  }
  
  // Mock attachInternals method
  HTMLElement.prototype.attachInternals = function() {
    return new MockElementInternals() as ElementInternals;
  };
}

// Enhanced test utilities with proper TypeScript types
export const createTestElement = <T extends HTMLElement>(tagName: string): T => {
  const element = document.createElement(tagName) as T;
  document.body.appendChild(element);
  return element;
};

export const cleanupTestElement = (element: HTMLElement): void => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// Enhanced async wait for custom element with timeout and proper error handling
export const waitForCustomElement = async (
  element: HTMLElement, 
  timeout: number = 1000
): Promise<void> => {
  const startTime = Date.now();
  const tagName = element.tagName.toLowerCase();
  
  // Wait for custom element to be defined
  if (customElements.get(tagName)) {
    // Element is already defined, wait for initialization
    while (!element.shadowRoot && Date.now() - startTime < timeout) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  } else {
    // Wait for element to be defined
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Custom element ${tagName} not defined within ${timeout}ms`)), timeout);
    });
    
    try {
      await Promise.race([
        customElements.whenDefined(tagName),
        timeoutPromise
      ]);
      
      // Wait for shadow root
      while (!element.shadowRoot && Date.now() - startTime < timeout) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    } catch (error) {
      throw error;
    }
  }
  
  if (!element.shadowRoot && tagName.includes('-')) {
    throw new Error(`Custom element ${tagName} did not initialize shadow DOM within ${timeout}ms`);
  }
  
  // Allow for async initialization
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Shadow DOM test utilities with type safety
export const getShadowContent = <T extends Element = Element>(
  element: HTMLElement, 
  selector: string
): T | null => {
  return element.shadowRoot?.querySelector<T>(selector) || null;
};

export const getAllShadowContent = <T extends Element = Element>(
  element: HTMLElement, 
  selector: string
): NodeListOf<T> => {
  return element.shadowRoot?.querySelectorAll<T>(selector) || document.querySelectorAll<T>('_no_match_');
};

// Accessibility test utilities
export const expectAriaAttribute = (element: HTMLElement, attribute: string, value: string): void => {
  expect(element.getAttribute(attribute)).toBe(value);
};

export const expectFocusable = (element: HTMLElement): void => {
  const tabindex = element.getAttribute('tabindex');
  const isInteractive = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
  expect(isInteractive || tabindex === '0' || tabindex === '-1').toBe(true);
};

// Performance test utilities
export const measureRenderTime = async (callback: () => void | Promise<void>): Promise<number> => {
  const start = performance.now();
  await callback();
  const end = performance.now();
  return end - start;
};

// Responsive test utilities
export const mockViewportSize = (width: number, height: number): void => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Error handling test utilities
export const expectJapaneseErrorMessage = (error: Error, expectedKeyword: string): void => {
  expect(error.message).toMatch(new RegExp(expectedKeyword, 'i'));
};

// Memory leak prevention
let errorHandler: ((event: ErrorEvent) => void) | null = null;
let unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;
let consoleErrorSpy: any = null;
let consoleWarnSpy: any = null;

beforeEach(() => {
  // Console mocks
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  
  // Error handlers
  errorHandler = (event) => {
    console.error('Test error:', event.error);
  };
  unhandledRejectionHandler = (event) => {
    console.error('Test promise rejection:', event.reason);
  };
  
  globalThis.addEventListener('error', errorHandler);
  globalThis.addEventListener('unhandledrejection', unhandledRejectionHandler);
});

afterEach(() => {
  // Restore console
  consoleErrorSpy?.mockRestore();
  consoleWarnSpy?.mockRestore();
  
  // Clean up event listeners
  if (errorHandler) {
    globalThis.removeEventListener('error', errorHandler);
    errorHandler = null;
  }
  if (unhandledRejectionHandler) {
    globalThis.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    unhandledRejectionHandler = null;
  }
  
  // Clean up DOM
  document.body.innerHTML = '';
  
  // Clean up any remaining custom elements
  document.querySelectorAll('adaptive-card').forEach(el => el.remove());
  
  // Clear all mocks
  vi.clearAllMocks();
});

// Test fixtures
export interface CardOptions {
  variant?: CardVariant;
  interactive?: boolean;
  disabled?: boolean;
  selected?: boolean;
  responsive?: boolean;
  header?: string;
  content?: string;
  actions?: string[];
  media?: { src: string; alt: string };
  badge?: string;
  href?: string;
  linkText?: string;
  linkTarget?: '_blank' | '_self';
}

export const createCardWithContent = (options: Partial<CardOptions> = {}): AdaptiveCardElement => {
  const card = document.createElement('adaptive-card') as AdaptiveCardElement;
  
  // Set attributes
  if (options.variant) card.setAttribute('variant', options.variant);
  if (options.interactive) card.setAttribute('interactive', 'true');
  if (options.disabled) card.setAttribute('disabled', 'true');
  if (options.selected) card.setAttribute('selected', 'true');
  if (options.responsive) card.setAttribute('responsive', 'true');
  if (options.href) card.setAttribute('href', options.href);
  if (options.linkText) card.setAttribute('link-text', options.linkText);
  if (options.linkTarget) card.setAttribute('link-target', options.linkTarget);
  
  // Set content
  const content: string[] = [];
  
  if (options.header) {
    content.push(`<h2 slot="header">${options.header}</h2>`);
  }
  
  if (options.media) {
    content.push(`<img slot="media" src="${options.media.src}" alt="${options.media.alt}" />`);
  }
  
  if (options.badge) {
    content.push(`<span slot="badge">${options.badge}</span>`);
  }
  
  if (options.content) {
    content.push(`<p>${options.content}</p>`);
  }
  
  if (options.actions && options.actions.length > 0) {
    options.actions.forEach(action => {
      content.push(`<button slot="actions">${action}</button>`);
    });
  }
  
  if (content.length > 0) {
    card.innerHTML = content.join('\n');
  }
  
  return card;
};