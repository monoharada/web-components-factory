import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Import and register the component for testing
// import '../src/adaptive-card.js';  // Will be created during testing

// ResizeObserverのMock
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// IntersectionObserverのMock
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// CSSStyleSheetのMock (for constructable stylesheets)
if (!('CSSStyleSheet' in globalThis)) {
  class MockCSSStyleSheet {
    cssRules: never[] = [];

    replaceSync(css: string): void {
      // Mock implementation
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
// happy-domの実装を上書きして、Form Associated Custom Elementsを正しくサポート
class MockElementInternals {
  #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  get form(): HTMLFormElement | null {
    // 親要素を辿ってフォームを検索
    return this.#element.closest('form');
  }

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
    return this.validity.valid;
  }

  reportValidity(): boolean {
    return this.validity.valid;
  }

  setFormValue(value: File | string | FormData | null): void {
    // Mock implementation
  }

  setValidity(flags: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void {
    // Update validity state
    if (flags && Object.keys(flags).length > 0) {
      for (const [key, value] of Object.entries(flags)) {
        if (key in this.validity) {
          (this.validity as Record<string, boolean>)[key] = Boolean(value);
        }
      }
      this.validity.valid = !Object.entries(flags).some(([k, v]) => k !== 'valid' && v);
    } else {
      // Clear all errors
      for (const key in this.validity) {
        (this.validity as Record<string, boolean>)[key] = key === 'valid';
      }
    }
    this.validationMessage = message ?? '';
  }
}

// attachInternalsを常にMockで上書き（happy-domの実装よりこちらを優先）
HTMLElement.prototype.attachInternals = function() {
  return new MockElementInternals(this);
};

// Custom Element Registry Mock
if (!('customElements' in globalThis)) {
  class MockCustomElementRegistry {
    private elements = new Map<string, CustomElementConstructor>();

    define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void {
      this.elements.set(name, constructor);
    }

    get(name: string): CustomElementConstructor | undefined {
      return this.elements.get(name);
    }

    whenDefined(name: string): Promise<CustomElementConstructor> {
      return Promise.resolve(this.elements.get(name)!);
    }

    upgrade(root: Node): void {
      // Mock implementation
    }
  }

  (globalThis as any).customElements = new MockCustomElementRegistry();
}

// グローバルテストユーティリティ
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

export const waitForCustomElement = async (element: HTMLElement): Promise<void> => {
  if ('connectedCallback' in element && typeof element.connectedCallback === 'function') {
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }
};

// Shadow DOMテストユーティリティ
export const getShadowContent = (element: HTMLElement, selector: string): Element | null => {
  return element.shadowRoot?.querySelector(selector) || null;
};

export const getAllShadowContent = (element: HTMLElement, selector: string): NodeListOf<Element> => {
  return element.shadowRoot?.querySelectorAll(selector) || document.querySelectorAll('_no_match_');
};

// アクセシビリティテストユーティリティ
export const expectAriaAttribute = (element: HTMLElement, attribute: string, value: string): void => {
  expect(element.getAttribute(attribute)).toBe(value);
};

export const expectFocusable = (element: HTMLElement): void => {
  const tabindex = element.getAttribute('tabindex');
  const isInteractive = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
  expect(isInteractive || tabindex === '0' || tabindex === '-1').toBe(true);
};

// パフォーマンステストユーティリティ
export const measureRenderTime = async (callback: () => void | Promise<void>): Promise<number> => {
  const start = performance.now();
  await callback();
  const end = performance.now();
  return end - start;
};

// レスポンシブテストユーティリティ
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

// エラーハンドリングテストユーティリティ
export const expectJapaneseErrorMessage = (error: Error, expectedKeyword: string): void => {
  expect(error.message).toMatch(new RegExp(expectedKeyword, 'i'));
};

// コンソールモック
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

// グローバルエラーハンドラー
globalThis.addEventListener('error', (event) => {
  console.error('テスト中に未処理エラーが発生しました:', event.error);
});

globalThis.addEventListener('unhandledrejection', (event) => {
  console.error('テスト中に未処理Promise拒否が発生しました:', event.reason);
});
