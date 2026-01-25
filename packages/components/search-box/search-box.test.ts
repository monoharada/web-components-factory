/**
 * DadsSearchBoxコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderWebComponent, cleanupTestElement, getShadowContent, waitForCustomElement } from '../../../tests/setup';

describe('DadsSearchBox - 基本', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent('<dads-search-box></dads-search-box>');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent('<dads-search-box></dads-search-box>');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('検索語inputが含まれる', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent('<dads-search-box></dads-search-box>');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input).toBeInTheDocument();
    expect(input?.tagName.toLowerCase()).toBe('input');
    expect(input?.type).toBe('search');
  });
});

describe('DadsSearchBox - scope option複製', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('Light DOMの option が内部selectに反映される', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent(`
      <dads-search-box>
        <option value="">すべて</option>
        <option value="images">画像</option>
      </dads-search-box>
    `);
    await waitForCustomElement(element);

    const select = getShadowContent(element, '[part="scope-select"]') as HTMLSelectElement | null;
    expect(select?.options.length).toBe(2);
    expect(element.hasAttribute('data-has-scope')).toBe(true);

    const scope = getShadowContent(element, '[part="scope"]') as HTMLElement | null;
    expect(scope).toBeInTheDocument();
  });

  it('option が無い場合はscopeが非表示になる', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent('<dads-search-box></dads-search-box>');
    await waitForCustomElement(element);

    const scope = getShadowContent(element, '[part="scope"]') as HTMLElement | null;
    expect(scope).toBeInTheDocument();
    expect(element.hasAttribute('data-has-scope')).toBe(false);
  });
});

describe('DadsSearchBox - 属性転写', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('aria-labelledby が内部inputへ転写される', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    element = renderWebComponent('<dads-search-box aria-labelledby="site-search-heading"></dads-search-box>');
    await waitForCustomElement(element);

    const input = getShadowContent(element, '[part="input"]') as HTMLInputElement | null;
    expect(input?.getAttribute('aria-labelledby')).toBe('site-search-heading');
  });
});

describe('DadsSearchBox - dads-search', () => {
  let element: HTMLElement;
  let originalRequestSubmit: unknown;

  afterEach(() => {
    if (element) cleanupTestElement(element);

    if (originalRequestSubmit === undefined) {
      // @ts-expect-error - requestSubmitが存在しない環境向け
      delete HTMLFormElement.prototype.requestSubmit;
    } else {
      Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
        value: originalRequestSubmit,
        configurable: true,
        writable: true,
      });
    }
  });

  it('ボタン操作でdads-searchが発火し、preventDefaultでsubmit相当を抑止できる', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    const requestSubmitSpy = vi.fn();
    originalRequestSubmit = (HTMLFormElement.prototype as unknown as { requestSubmit?: unknown }).requestSubmit;
    Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
      value: requestSubmitSpy,
      configurable: true,
      writable: true,
    });

    element = renderWebComponent(`
      <form>
        <dads-search-box>
          <option value="">すべて</option>
          <option value="images">画像</option>
        </dads-search-box>
      </form>
    `).querySelector('dads-search-box') as HTMLElement;
    await waitForCustomElement(element);

    const handler = vi.fn((e: Event) => e.preventDefault());
    element.addEventListener('dads-search', handler);

    // 値を設定してdetailを確認
    (element as unknown as { value: string; scopeValue: string }).value = 'hello';
    (element as unknown as { scopeValue: string }).scopeValue = 'images';

    const button = getShadowContent(element, '[part="button"]') as HTMLElement | null;
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(requestSubmitSpy).toHaveBeenCalledTimes(0);
  });

  it('preventDefaultされなければrequestSubmitが呼ばれる', async () => {
    const { defineSearchBox } = await import('./search-box-define.js');
    defineSearchBox();

    const requestSubmitSpy = vi.fn();
    originalRequestSubmit = (HTMLFormElement.prototype as unknown as { requestSubmit?: unknown }).requestSubmit;
    Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
      value: requestSubmitSpy,
      configurable: true,
      writable: true,
    });

    element = renderWebComponent(`
      <form>
        <dads-search-box></dads-search-box>
      </form>
    `).querySelector('dads-search-box') as HTMLElement;
    await waitForCustomElement(element);

    const button = getShadowContent(element, '[part="button"]') as HTMLElement | null;
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(requestSubmitSpy).toHaveBeenCalledTimes(1);
  });
});
