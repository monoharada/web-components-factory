/**
 * DadsMobileMenu コンポーネント テスト
 */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { defineMenuList } from '../menu-list/menu-list-define.js';
import { defineDefaultMobileMenu } from './mobile-menu-define.js';

beforeAll(() => {
  defineDefaultMobileMenu();
  defineMenuList();
});

function waitTick(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

describe('DadsMobileMenu - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('nav 構造と公開 part/slot を描画し、aria属性を nav に転送する', async () => {
    const element = renderWebComponent(`
      <dads-mobile-menu aria-label="グローバルメニュー" aria-labelledby="menu-heading">
        <dads-menu-list>
          <dads-menu-list-item>項目</dads-menu-list-item>
        </dads-menu-list>
      </dads-mobile-menu>
    `);

    await waitForComponent('dads-mobile-menu');
    await waitForComponent('dads-menu-list');
    await waitTick();

    const base = getShadowElement(element, '#base');
    const back = getShadowElement(element, '#back');
    const content = getShadowElement(element, '#content');
    const backSlot = getShadowElement(element, '#back-slot');
    const contentSlot = getShadowElement(element, '#content-slot');

    expect(base?.tagName).toBe('NAV');
    expect(base?.getAttribute('aria-label')).toBe('グローバルメニュー');
    expect(base?.getAttribute('aria-labelledby')).toBe('menu-heading');
    expect(base?.getAttribute('part')).toBe('base');

    expect(back?.getAttribute('part')).toBe('back');
    expect(content?.getAttribute('part')).toBe('content');
    expect(backSlot?.getAttribute('name')).toBe('back');
    expect(contentSlot).toBeInTheDocument();
  });

  it('slot="back" の有無で back 領域の表示を切り替える', async () => {
    const element = renderWebComponent(`
      <dads-mobile-menu>
        <dads-menu-list>
          <dads-menu-list-item>項目</dads-menu-list-item>
        </dads-menu-list>
      </dads-mobile-menu>
    `);

    await waitForComponent('dads-mobile-menu');
    await waitForComponent('dads-menu-list');
    await waitTick();

    const back = getShadowElement(element, '#back');
    expect(back?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-has-back')).toBe(false);

    const backLink = document.createElement('a');
    backLink.setAttribute('slot', 'back');
    backLink.setAttribute('href', '#');
    backLink.textContent = '戻る';
    element.appendChild(backLink);

    await waitTick();
    await waitTick();

    expect(back?.hasAttribute('hidden')).toBe(false);
    expect(element.hasAttribute('data-has-back')).toBe(true);

    backLink.remove();
    await waitTick();
    await waitTick();

    expect(back?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-has-back')).toBe(false);
  });
});

describe('DadsMobileMenu - セクション開閉', () => {
  afterEach(() => {
    cleanup();
  });

  it('aria-controls/aria-expanded を持つ項目のクリックで hidden/expanded を同期し、イベントを発火する', async () => {
    const element = renderWebComponent(`
      <dads-mobile-menu>
        <dads-menu-list>
          <dads-menu-list-item id="section-trigger" aria-controls="section-panel" aria-expanded="false" end-icon="caret">
            セクションタイトル
          </dads-menu-list-item>
          <dads-menu-list id="section-panel">
            <dads-menu-list-item>子メニュー</dads-menu-list-item>
          </dads-menu-list>
        </dads-menu-list>
      </dads-mobile-menu>
    `);

    await waitForComponent('dads-mobile-menu');
    await waitForComponent('dads-menu-list-item');
    await waitTick();

    const trigger = element.querySelector('#section-trigger') as HTMLElement | null;
    const panel = element.querySelector('#section-panel') as HTMLElement | null;
    if (!trigger || !panel) throw new Error('toggle elements not found');

    // 初期同期: aria-expanded=false なので panel は hidden 化される
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(getComputedStyle(panel).display).toBe('none');

    const listener = vi.fn();
    element.addEventListener('dads-mobile-menu-toggle', listener);

    const triggerBase = getShadowElement(trigger, '#base') as HTMLElement | null;
    if (!triggerBase) throw new Error('trigger base not found');

    triggerBase.click();
    await waitTick();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.hasAttribute('expanded')).toBe(true);
    expect(panel.hasAttribute('hidden')).toBe(false);
    expect(getComputedStyle(panel).display).not.toBe('none');
    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0]?.[0] as CustomEvent | undefined;
    expect(event?.detail?.controlId).toBe('section-panel');
    expect(event?.detail?.expanded).toBe(true);

    triggerBase.click();
    await waitTick();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('expanded')).toBe(false);
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(getComputedStyle(panel).display).toBe('none');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('非トグル項目のクリックでは状態を変更しない', async () => {
    const element = renderWebComponent(`
      <dads-mobile-menu>
        <dads-menu-list>
          <dads-menu-list-item id="plain-item">通常項目</dads-menu-list-item>
          <dads-menu-list id="plain-panel" hidden>
            <dads-menu-list-item>子メニュー</dads-menu-list-item>
          </dads-menu-list>
        </dads-menu-list>
      </dads-mobile-menu>
    `);

    await waitForComponent('dads-mobile-menu');
    await waitForComponent('dads-menu-list-item');
    await waitTick();

    const trigger = element.querySelector('#plain-item') as HTMLElement | null;
    const panel = element.querySelector('#plain-panel') as HTMLElement | null;
    if (!trigger || !panel) throw new Error('plain elements not found');

    const listener = vi.fn();
    element.addEventListener('dads-mobile-menu-toggle', listener);

    const triggerBase = getShadowElement(trigger, '#base') as HTMLElement | null;
    if (!triggerBase) throw new Error('plain base not found');

    triggerBase.click();
    await waitTick();

    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });
});
