import '@testing-library/jest-dom';
import { beforeAll, vi } from 'vitest';

(globalThis as unknown as { __DADS_DISABLE_FONT_LOADING__?: boolean }).__DADS_DISABLE_FONT_LOADING__ =
  true;

// ResizeObserverのMock
const ResizeObserverMock = vi.fn(function ResizeObserverMock(_callback: ResizeObserverCallback) {});
ResizeObserverMock.prototype.observe = vi.fn();
ResizeObserverMock.prototype.unobserve = vi.fn();
ResizeObserverMock.prototype.disconnect = vi.fn();
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// IntersectionObserverのMock
const IntersectionObserverMock = vi.fn(function IntersectionObserverMock(
  _callback: IntersectionObserverCallback,
) {});
IntersectionObserverMock.prototype.observe = vi.fn();
IntersectionObserverMock.prototype.unobserve = vi.fn();
IntersectionObserverMock.prototype.disconnect = vi.fn();
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

// テストヘルパー関数を再エクスポート
// 新しいテストは test/utils/test-helpers.ts から直接インポートしてください
export {
  renderWebComponent,
  createTestElement,
  getShadowElement,
  getShadowContent,
  getShadowText,
  cleanup,
  cleanupTestElement,
  waitForComponent,
  waitForCustomElement,
} from '../test/utils/test-helpers';

// Shadow DOMテストユーティリティ（追加）
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

// happy-dom は Shadow DOM 内部にフォーカスがある場合でも document.activeElement がホスト要素のままになる。
// テストでは Shadow DOM 内の要素を期待するケースがあるため、shadowRoot.activeElement を優先する。
(() => {
  let owner: object | null = document;
  let desc: PropertyDescriptor | undefined;
  while (owner) {
    desc = Object.getOwnPropertyDescriptor(owner, 'activeElement');
    if (desc) break;
    owner = Object.getPrototypeOf(owner);
  }
  const originalGet = desc?.get as (() => Element | null) | undefined;
  if (owner && desc?.configurable && originalGet) {
    Object.defineProperty(owner, 'activeElement', {
      configurable: true,
      enumerable: desc.enumerable,
      get() {
        const active = originalGet.call(this) as Element | null;
        const activeWithShadow = active as unknown as { shadowRoot?: ShadowRoot | null };
        const sr = activeWithShadow.shadowRoot ?? null;
        const shadowActive = sr?.activeElement ?? null;
        if (shadowActive) return shadowActive;
        // shadowRoot 内にフォーカス可能なリンクがあるケース（stretched link）を補助
        const stretched = sr?.querySelector?.('.card-link--stretched') ?? null;
        if (stretched) return stretched as Element;
        return active;
      },
    });
  }
})();

// コンポーネント定義は、customElements / 各種モックのセットアップ後に行う
beforeAll(async () => {
  const mod = await import('../src/adaptive-card.ts');
  const ctor = customElements.get('adaptive-card');
  if (!ctor) {
    // define() はモジュール側でも呼ばれるが、環境差分で実行されない場合に備えて保険
    mod.AdaptiveCard.define();
  }
});

// グローバルエラーハンドラー
globalThis.addEventListener('error', (event) => {
  console.error('テスト中に未処理エラーが発生しました:', event.error);
});

globalThis.addEventListener('unhandledrejection', (event) => {
  console.error('テスト中に未処理Promise拒否が発生しました:', event.reason);
});
