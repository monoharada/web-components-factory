/**
 * DadsDisclosureコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { renderWebComponent, getShadowElement, cleanup, waitForComponent } from '../../../test/utils/test-helpers';
import { defineDisclosure } from './disclosure-define';

defineDisclosure();

describe('DadsDisclosure - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが正しくレンダリングされる', async () => {
    const el = renderWebComponent(`
      <dads-disclosure>
        <span slot="summary">見出し</span>
        <div slot="content">本文</div>
      </dads-disclosure>
    `);

    await waitForComponent('dads-disclosure');

    expect(el).toBeInTheDocument();
    expect(el.shadowRoot).toBeTruthy();

    const details = getShadowElement(el, '[part="details"]');
    const summary = getShadowElement(el, '[part="summary"]');
    const content = getShadowElement(el, '[part="content"]');

    expect(details).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('open属性が details.open に反映される', async () => {
    const el = renderWebComponent(`
      <dads-disclosure open>
        <span slot="summary">見出し</span>
        <div slot="content">本文</div>
      </dads-disclosure>
    `);

    await waitForComponent('dads-disclosure');

    const details = getShadowElement(el, '[part="details"]') as HTMLDetailsElement | null;
    expect(details?.open).toBe(true);

    el.removeAttribute('open');
    await waitFor(() => {
      expect(details?.open).toBe(false);
    });
  });
});

describe('DadsDisclosure - toggle同期', () => {
  afterEach(() => {
    cleanup();
  });

  it('details toggle で host[open] と toggleイベントが同期される', async () => {
    const el = renderWebComponent(`
      <dads-disclosure>
        <span slot="summary">見出し</span>
        <div slot="content">本文</div>
      </dads-disclosure>
    `);

    await waitForComponent('dads-disclosure');

    const onToggle = vi.fn();
    el.addEventListener('toggle', onToggle);

    const details = getShadowElement(el, '[part="details"]') as HTMLDetailsElement | null;
    expect(details).toBeTruthy();

    details!.open = true;
    details!.dispatchEvent(new Event('toggle'));

    await waitFor(() => {
      expect(el.hasAttribute('open')).toBe(true);
      expect(onToggle).toHaveBeenCalled();
    });
  });
});

describe('DadsDisclosure - back-link（任意）', () => {
  afterEach(() => {
    cleanup();
  });

  it('slot="back-link" 未指定の場合は data-has-back-link が付かない', async () => {
    const el = renderWebComponent(`
      <dads-disclosure open>
        <span slot="summary">見出し</span>
        <div slot="content">本文</div>
      </dads-disclosure>
    `);

    await waitForComponent('dads-disclosure');
    expect(el.hasAttribute('data-has-back-link')).toBe(false);
  });

  it('slot="back-link" 指定で表示フラグが立ち、クリックでsummaryへスクロール+フォーカスする', async () => {
    const el = renderWebComponent(`
      <dads-disclosure open>
        <span slot="summary">見出し</span>
        <div slot="content">本文</div>
        <span slot="back-link">先頭に戻る</span>
      </dads-disclosure>
    `);

    await waitForComponent('dads-disclosure');

    await waitFor(() => {
      expect(el.hasAttribute('data-has-back-link')).toBe(true);
    });

    const summary = getShadowElement(el, '[part="summary"]') as HTMLElement | null;
    const link = getShadowElement(el, '[part="back-link"]') as HTMLAnchorElement | null;

    expect(summary).toBeTruthy();
    expect(link).toBeTruthy();

    const focusSpy = vi.spyOn(summary!, 'focus');
    const scrollSpy = vi.spyOn(summary!, 'scrollIntoView');

    link!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(focusSpy).toHaveBeenCalled();
    });
  });
});

