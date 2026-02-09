/**
 * DadsGlobalMenu / DadsGlobalMenuItem テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

async function waitTick(): Promise<void> {
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
}

describe('DadsGlobalMenu - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('リンク項目とサブメニュー項目で trigger が切り替わる', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="/one">One</dads-global-menu-item>
        <dads-global-menu-item>
          Two
          <dads-menu-list-box label="submenu">
            <dads-menu-list-item>Submenu 1</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-global-menu-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await waitTick();

    const linkTrigger = getShadowContent(items[0], '#trigger');
    const buttonTrigger = getShadowContent(items[1], '#trigger');

    expect(linkTrigger).toBeInstanceOf(HTMLAnchorElement);
    expect(buttonTrigger).toBeInstanceOf(HTMLButtonElement);

    const submenu = items[1].querySelector('dads-menu-list-box') as HTMLElement | null;
    expect(submenu).toBeTruthy();
    expect(submenu?.hasAttribute('opener-hidden')).toBe(true);
  });

  it('クリックで開いたサブメニューは単一オープン制御される', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item>
          Menu 1
          <dads-menu-list-box label="submenu 1">
            <dads-menu-list-item>One</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
        <dads-global-menu-item>
          Menu 2
          <dads-menu-list-box label="submenu 2">
            <dads-menu-list-item>Two</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-global-menu-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await waitTick();

    const trigger1 = getShadowContent(items[0], '#trigger') as HTMLButtonElement | null;
    const trigger2 = getShadowContent(items[1], '#trigger') as HTMLButtonElement | null;
    if (!trigger1 || !trigger2) throw new Error('trigger not found');

    trigger1.click();
    await waitTick();

    expect(items[0].hasAttribute('expanded')).toBe(true);
    expect(items[1].hasAttribute('expanded')).toBe(false);

    trigger2.click();
    await waitTick();

    expect(items[0].hasAttribute('expanded')).toBe(false);
    expect(items[1].hasAttribute('expanded')).toBe(true);
  });

  it('aria-label / aria-labelledby が nav に転送される', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu aria-label="主要メニュー" aria-labelledby="main-nav-title">
        <dads-global-menu-item href="/one">One</dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);
    await waitTick();

    const nav = getShadowContent(element, '#nav') as HTMLElement | null;
    if (!nav) throw new Error('nav not found');

    expect(nav.getAttribute('aria-label')).toBe('主要メニュー');
    expect(nav.getAttribute('aria-labelledby')).toBe('main-nav-title');
  });

  it('ArrowLeft/ArrowRight/Home/End でトップレベル移動できる', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item>One</dads-global-menu-item>
        <dads-global-menu-item>Two</dads-global-menu-item>
        <dads-global-menu-item>Three</dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-global-menu-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await waitTick();

    const trigger1 = getShadowContent(items[0], '#trigger') as HTMLElement | null;
    const trigger2 = getShadowContent(items[1], '#trigger') as HTMLElement | null;
    const trigger3 = getShadowContent(items[2], '#trigger') as HTMLElement | null;
    if (!trigger1 || !trigger2 || !trigger3) throw new Error('trigger not found');

    trigger1.focus();

    trigger1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await waitTick();
    expect(document.activeElement).toBe(trigger2);

    trigger2.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, composed: true }));
    await waitTick();
    expect(document.activeElement).toBe(trigger3);

    trigger3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, composed: true }));
    await waitTick();
    expect(document.activeElement).toBe(trigger1);
  });

  it('ArrowDown でサブメニュー先頭に移動し、Escape で閉じて trigger に戻る', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item>
          Menu
          <dads-menu-list-box label="submenu">
            <dads-menu-list-item>One</dads-menu-list-item>
            <dads-menu-list-item>Two</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    const submenu = element.querySelector('dads-menu-list-box') as HTMLElement | null;
    if (!item || !submenu) throw new Error('item/submenu not found');

    await waitForCustomElement(item);
    await waitForCustomElement(submenu);
    await waitTick();

    const trigger = getShadowContent(item, '#trigger') as HTMLElement | null;
    if (!trigger) throw new Error('trigger not found');

    const menuItems = Array.from(submenu.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const menuItem of menuItems) await waitForCustomElement(menuItem);
    await waitTick();

    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitTick();

    expect(item.hasAttribute('expanded')).toBe(true);
    expect(submenu.hasAttribute('open')).toBe(true);

    const firstBase = getShadowContent(menuItems[0], '#base') as HTMLElement | null;
    if (!firstBase) throw new Error('first menu item base not found');
    expect(document.activeElement).toBe(firstBase);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitTick();
    await waitTick();

    expect(item.hasAttribute('expanded')).toBe(false);
    expect(submenu.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('サブメニュー内の Home/End はトップレベル移動に伝播しない', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="/top">Top</dads-global-menu-item>
        <dads-global-menu-item>
          Menu
          <dads-menu-list-box label="submenu">
            <dads-menu-list-item>One</dads-menu-list-item>
            <dads-menu-list-item>Two</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-global-menu-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await waitTick();

    const firstTrigger = getShadowContent(items[0], '#trigger') as HTMLElement | null;
    const submenu = items[1].querySelector('dads-menu-list-box') as HTMLElement | null;
    if (!firstTrigger || !submenu) throw new Error('first trigger or submenu not found');

    await waitForCustomElement(submenu);
    items[1].setAttribute('expanded', '');
    await waitTick();
    await waitTick();

    const menuItems = Array.from(submenu.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const menuItem of menuItems) await waitForCustomElement(menuItem);
    const menu = getShadowContent(submenu, '#menu') as HTMLElement | null;
    const firstBase = getShadowContent(menuItems[0], '#base') as HTMLElement | null;
    const secondBase = getShadowContent(menuItems[1], '#base') as HTMLElement | null;
    if (!menu || !firstBase || !secondBase) throw new Error('submenu menu/base not found');

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, composed: true, cancelable: true }));
    await waitTick();
    expect(document.activeElement).toBe(secondBase);
    expect(items[1].hasAttribute('expanded')).toBe(true);
    expect(submenu.hasAttribute('open')).toBe(true);
    expect(document.activeElement).not.toBe(firstTrigger);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, composed: true, cancelable: true }));
    await waitTick();
    expect(document.activeElement).toBe(firstBase);
    expect(items[1].hasAttribute('expanded')).toBe(true);
    expect(submenu.hasAttribute('open')).toBe(true);
  });

  it('menuitemselect でサブメニューが閉じる', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item>
          Menu
          <dads-menu-list-box label="submenu">
            <dads-menu-list-item>One</dads-menu-list-item>
            <dads-menu-list-item>Two</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    const submenu = element.querySelector('dads-menu-list-box') as HTMLElement | null;
    if (!item || !submenu) throw new Error('item/submenu not found');

    await waitForCustomElement(item);
    await waitForCustomElement(submenu);

    const trigger = getShadowContent(item, '#trigger') as HTMLElement | null;
    if (!trigger) throw new Error('trigger not found');

    trigger.click();
    await waitTick();

    const menuItems = Array.from(submenu.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const menuItem of menuItems) await waitForCustomElement(menuItem);

    const secondBase = getShadowContent(menuItems[1], '#base') as HTMLElement | null;
    if (!secondBase) throw new Error('second menu item base not found');
    secondBase.click();

    await waitTick();
    await waitTick();

    expect(item.hasAttribute('expanded')).toBe(false);
    expect(submenu.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('href の安全性チェックで不正URLは # にフォールバックする', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="javascript:alert(1)">Unsafe</dads-global-menu-item>
        <dads-global-menu-item href="?q=1">Query</dads-global-menu-item>
        <dads-global-menu-item href="./guide">Relative</dads-global-menu-item>
        <dads-global-menu-item href="../guide">Parent</dads-global-menu-item>
        <dads-global-menu-item href="https://example.com">External</dads-global-menu-item>
        <dads-global-menu-item href="mailto:test@example.com">Mail</dads-global-menu-item>
        <dads-global-menu-item href="tel:+81000000000">Tel</dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);
    const items = Array.from(element.querySelectorAll('dads-global-menu-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await waitTick();

    const hrefs = items.map((item) => (getShadowContent(item, '#trigger') as HTMLAnchorElement | null)?.getAttribute('href'));

    expect(hrefs[0]).toBe('#');
    expect(hrefs[1]).toBe('#');
    expect(hrefs[2]).toBe('./guide');
    expect(hrefs[3]).toBe('../guide');
    expect(hrefs[4]).toBe('https://example.com');
    expect(hrefs[5]).toBe('mailto:test@example.com');
    expect(hrefs[6]).toBe('tel:+81000000000');
  });

  it('リンク属性（target/rel/download）が trigger に同期される', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="/download" target="_blank" rel="noopener" download>
          Download
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);
    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    if (!item) throw new Error('item not found');
    await waitForCustomElement(item);
    await waitTick();

    const trigger = getShadowContent(item, '#trigger') as HTMLAnchorElement | null;
    if (!trigger) throw new Error('trigger not found');

    expect(trigger.getAttribute('target')).toBe('_blank');
    expect(trigger.getAttribute('rel')).toBe('noopener');
    expect(trigger.hasAttribute('download')).toBe(true);

    item.removeAttribute('target');
    item.removeAttribute('rel');
    item.removeAttribute('download');
    await waitTick();

    expect(trigger.hasAttribute('target')).toBe(false);
    expect(trigger.hasAttribute('rel')).toBe(false);
    expect(trigger.hasAttribute('download')).toBe(false);
  });

  it('href の動的更新が trigger に同期される', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="/one">One</dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);
    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    if (!item) throw new Error('item not found');
    await waitForCustomElement(item);
    await waitTick();

    const trigger = getShadowContent(item, '#trigger') as HTMLAnchorElement | null;
    if (!trigger) throw new Error('trigger not found');

    expect(trigger.getAttribute('href')).toBe('/one');

    item.setAttribute('href', '/two');
    await waitTick();
    expect(trigger.getAttribute('href')).toBe('/two');

    item.setAttribute('href', 'javascript:alert(1)');
    await waitTick();
    expect(trigger.getAttribute('href')).toBe('#');
  });

  it('start-icon と submenu の動的変更に追従する', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item href="/docs">Docs</dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);
    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    if (!item) throw new Error('item not found');
    await waitForCustomElement(item);
    await waitTick();

    expect(item.hasAttribute('data-has-start-icon')).toBe(false);
    const icon = document.createElement('span');
    icon.setAttribute('slot', 'start-icon');
    icon.textContent = '★';
    item.append(icon);
    await waitTick();
    await waitTick();
    expect(item.hasAttribute('data-has-start-icon')).toBe(true);

    const submenu = document.createElement('dads-menu-list-box');
    submenu.setAttribute('label', 'Docs submenu');
    submenu.innerHTML = '<dads-menu-list-item>Guide</dads-menu-list-item>';
    item.append(submenu);
    await waitForCustomElement(submenu);
    await waitTick();
    await waitTick();

    expect(submenu.getAttribute('slot')).toBe('submenu');
    expect(submenu.hasAttribute('opener-hidden')).toBe(true);
    expect(getShadowContent(item, '#trigger')).toBeInstanceOf(HTMLButtonElement);

    item.setAttribute('expanded', '');
    await waitTick();
    expect(submenu.hasAttribute('open')).toBe(true);

    submenu.remove();
    await waitTick();
    await waitTick();

    expect(item.hasAttribute('expanded')).toBe(false);
    expect(getShadowContent(item, '#trigger')).toBeInstanceOf(HTMLAnchorElement);
  });

  it('Enter/Space/ArrowUp/Escape でサブメニューを操作できる', async () => {
    const { defineDefaultGlobalMenu } = await import('./global-menu-define');
    defineDefaultGlobalMenu();

    element = renderWebComponent(`
      <dads-global-menu>
        <dads-global-menu-item>
          Menu
          <dads-menu-list-box label="submenu">
            <dads-menu-list-item>One</dads-menu-list-item>
            <dads-menu-list-item>Two</dads-menu-list-item>
          </dads-menu-list-box>
        </dads-global-menu-item>
      </dads-global-menu>
    `);

    await waitForCustomElement(element);

    const item = element.querySelector('dads-global-menu-item') as HTMLElement | null;
    const submenu = element.querySelector('dads-menu-list-box') as HTMLElement | null;
    if (!item || !submenu) throw new Error('item/submenu not found');

    await waitForCustomElement(item);
    await waitForCustomElement(submenu);
    await waitTick();

    const trigger = getShadowContent(item, '#trigger') as HTMLElement | null;
    if (!trigger) throw new Error('trigger not found');

    const menuItems = Array.from(submenu.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const menuItem of menuItems) await waitForCustomElement(menuItem);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitTick();
    expect(item.hasAttribute('expanded')).toBe(true);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await waitTick();
    expect(item.hasAttribute('expanded')).toBe(false);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await waitTick();
    expect(item.hasAttribute('expanded')).toBe(true);

    const lastBase = getShadowContent(menuItems[1], '#base') as HTMLElement | null;
    if (!lastBase) throw new Error('last menu item base not found');
    expect(document.activeElement).toBe(lastBase);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitTick();
    expect(item.hasAttribute('expanded')).toBe(false);
    expect(submenu.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});

describe('DadsGlobalMenu - a11yAnnotations', () => {
  it('global-menu / global-menu-item の callouts が定義されている', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const menu = getCemA11yAnnotations('dads-global-menu');
    const item = getCemA11yAnnotations('dads-global-menu-item');

    const menuIds = menu?.callouts?.map((c) => c.id) ?? [];
    const itemIds = item?.callouts?.map((c) => c.id) ?? [];

    expect(menuIds).toEqual(expect.arrayContaining(['nav', 'list', 'submenu-trigger']));
    expect(itemIds).toEqual(expect.arrayContaining(['trigger', 'label', 'chevron']));
  });
});
