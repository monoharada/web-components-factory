/**
 * DadsMenuListBox テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsMenuListBox - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('open/close と focus 移動ができる', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
        <dads-menu-list-item>Two</dads-menu-list-item>
        <dads-menu-list-item>Three</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const popup = getShadowContent(element, '#popup') as HTMLElement | null;
    const menu = getShadowContent(element, '#menu') as HTMLElement | null;
    if (!opener || !popup || !menu) throw new Error('shadow parts not found');

    expect(popup.hidden).toBe(true);
    expect(opener.getAttribute('aria-expanded')).toBe('false');

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(popup.hidden).toBe(false);
    expect(opener.getAttribute('aria-expanded')).toBe('true');

    const firstBase = getShadowContent(items[0], '#base') as HTMLElement | null;
    if (!firstBase) throw new Error('menu item base not found');
    expect(document.activeElement).toBe(firstBase);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    if (!secondBase) throw new Error('menu item base not found');
    expect(document.activeElement).toBe(secondBase);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(popup.hidden).toBe(true);
    expect(opener.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(opener);
  });

  it('menuitemselect を dispatch して閉じる', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
        <dads-menu-list-item>Two</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const popup = getShadowContent(element, '#popup') as HTMLElement | null;
    if (!opener || !popup) throw new Error('shadow parts not found');

    const received: Array<unknown> = [];
    element.addEventListener('menuitemselect', (e) => received.push(e));

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    if (!secondBase) throw new Error('menu item base not found');
    secondBase.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(received.length).toBe(1);

    const e = received[0] as CustomEvent;
    expect(e.detail?.selectedIndex).toBe(1);
    expect(e.detail?.selectedValue).toBe('Two');
    expect(e.detail?.selectedItem).toBe(items[1]);

    expect(popup.hidden).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  it('divider を含む場合でも focus/選択対象から除外される', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
        <hr />
        <dads-menu-list-item>Two</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const popup = getShadowContent(element, '#popup') as HTMLElement | null;
    const menu = getShadowContent(element, '#menu') as HTMLElement | null;
    if (!opener || !popup || !menu) throw new Error('shadow parts not found');

    const received: Array<unknown> = [];
    element.addEventListener('menuitemselect', (e) => received.push(e));

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const firstBase = getShadowContent(items[0], '#base') as HTMLElement | null;
    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    if (!firstBase || !secondBase) throw new Error('menu item base not found');
    expect(document.activeElement).toBe(firstBase);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(document.activeElement).toBe(secondBase);

    secondBase.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(received.length).toBe(1);
    const e = received[0] as CustomEvent;
    expect(e.detail?.selectedIndex).toBe(1);
    expect(e.detail?.selectedValue).toBe('Two');
    expect(e.detail?.selectedItem).toBe(items[1]);

    expect(popup.hidden).toBe(true);
    expect(document.activeElement).toBe(opener);
  });
});
