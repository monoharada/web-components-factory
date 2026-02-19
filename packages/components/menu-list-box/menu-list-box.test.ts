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

  it('Shadow DOM 配下でも ArrowDown で末尾まで移動できる', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    const hostTag = 'test-menu-list-box-shadow-host';
    if (!customElements.get(hostTag)) {
      class TestMenuListBoxShadowHost extends HTMLElement {
        connectedCallback() {
          if (this.shadowRoot) return;
          const root = this.attachShadow({ mode: 'open' });
          root.innerHTML = `
            <dads-menu-list-box label="メニュー">
              <dads-menu-list-item>One</dads-menu-list-item>
              <dads-menu-list-item>Two</dads-menu-list-item>
              <dads-menu-list-item>Three</dads-menu-list-item>
            </dads-menu-list-box>
          `;
        }
      }
      customElements.define(hostTag, TestMenuListBoxShadowHost);
    }

    element = document.createElement(hostTag);
    document.body.append(element);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const listBox = element.shadowRoot?.querySelector('dads-menu-list-box') as HTMLElement | null;
    if (!listBox) throw new Error('menu list box not found');
    await waitForCustomElement(listBox);

    const items = Array.from(listBox.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(listBox, '#opener') as HTMLButtonElement | null;
    const menu = getShadowContent(listBox, '#menu') as HTMLElement | null;
    if (!opener || !menu) throw new Error('shadow parts not found');

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    const thirdBase = getShadowContent(items[2], '#base') as HTMLElement | null;
    if (!secondBase || !thirdBase) throw new Error('menu item base not found');

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(secondBase.getAttribute('tabindex')).toBe('0');

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(secondBase.getAttribute('tabindex')).toBe('-1');
    expect(thirdBase.getAttribute('tabindex')).toBe('0');
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
    expect(e.composed).toBe(true);
    expect(e.detail?.selectedIndex).toBe(1);
    expect(e.detail?.selectedValue).toBe('Two');
    expect(e.detail?.selectedItem).toBe(items[1]);

    expect(popup.hidden).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  it('menu item の明示指定属性（variant/size/end-icon）を上書きしない', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item variant="standard" end-icon="arrow-right">One</dads-menu-list-item>
        <dads-menu-list-item size="small" end-icon="caret">Two</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(items[0].getAttribute('variant')).toBe('standard');
    expect(items[0].getAttribute('end-icon')).toBe('arrow-right');

    expect(items[1].getAttribute('size')).toBe('small');
    expect(items[1].getAttribute('end-icon')).toBe('caret');
  });

  it('divider を含む場合でも focus/選択対象から除外される', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
        <dads-divider></dads-divider>
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

  it('legacy divider (hr) を含む場合でも focus/選択対象から除外される', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
        <hr>
        <dads-menu-list-item>Two</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const items = Array.from(element.querySelectorAll('dads-menu-list-item')) as HTMLElement[];
    for (const item of items) await waitForCustomElement(item);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const menu = getShadowContent(element, '#menu') as HTMLElement | null;
    const legacyDivider = element.querySelector('hr') as HTMLHRElement | null;
    if (!opener || !menu || !legacyDivider) throw new Error('required elements not found');

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const firstBase = getShadowContent(items[0], '#base') as HTMLElement | null;
    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    if (!firstBase || !secondBase) throw new Error('menu item base not found');
    expect(document.activeElement).toBe(firstBase);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(document.activeElement).toBe(secondBase);

    expect(legacyDivider.style.getPropertyValue('margin-block')).toContain(
      '--dads-menu-list-box-divider-margin-block',
    );
  });

  it('Home/End キーで先頭・末尾に移動する', async () => {
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
    const menu = getShadowContent(element, '#menu') as HTMLElement | null;
    if (!opener || !menu) throw new Error('shadow parts not found');

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const firstBase = getShadowContent(items[0], '#base') as HTMLElement | null;
    const lastBase = getShadowContent(items[2], '#base') as HTMLElement | null;
    if (!firstBase || !lastBase) throw new Error('menu item base not found');

    // End key moves to last item
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(document.activeElement).toBe(lastBase);

    // Home key moves to first item
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(document.activeElement).toBe(firstBase);
  });

  it('ArrowUp で open すると末尾にフォーカスする', async () => {
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
    if (!opener || !popup) throw new Error('shadow parts not found');

    expect(popup.hidden).toBe(true);

    opener.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(popup.hidden).toBe(false);

    const lastBase = getShadowContent(items[2], '#base') as HTMLElement | null;
    if (!lastBase) throw new Error('menu item base not found');
    expect(document.activeElement).toBe(lastBase);
  });

  it('label 属性が opener に表示される', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="テストラベル">
        <dads-menu-list-item>Item</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);

    const labelFallback = getShadowContent(element, '#label-fallback') as HTMLElement | null;
    if (!labelFallback) throw new Error('label fallback not found');
    expect(labelFallback.textContent).toBe('テストラベル');
  });

  it('icon スロットがない場合 data-has-opener-icon は付与されない', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <dads-menu-list-item>Item</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(element.hasAttribute('data-has-opener-icon')).toBe(false);
  });

  it('opener-hidden の場合 opener クリックでは開閉しない', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box opener-hidden label="メニュー">
        <dads-menu-list-item>One</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const popup = getShadowContent(element, '#popup') as HTMLElement | null;
    if (!opener || !popup) throw new Error('shadow parts not found');

    expect(popup.hidden).toBe(true);

    opener.click();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(popup.hidden).toBe(true);
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('setFocusReturnTarget で Escape 後のフォーカス復帰先を指定できる', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <div>
        <button id="return-target" type="button">return target</button>
        <dads-menu-list-box opener-hidden label="メニュー">
          <dads-menu-list-item>One</dads-menu-list-item>
          <dads-menu-list-item>Two</dads-menu-list-item>
        </dads-menu-list-box>
      </div>
    `);
    await waitForCustomElement(element);

    const box = element.querySelector('dads-menu-list-box') as HTMLElement | null;
    const returnTarget = element.querySelector('#return-target') as HTMLButtonElement | null;
    if (!box || !returnTarget) throw new Error('target elements not found');

    await waitForCustomElement(box);

    const maybe = box as unknown as { setFocusReturnTarget?: (target: HTMLElement | null) => void };
    maybe.setFocusReturnTarget?.(returnTarget);
    box.setAttribute('open', '');

    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(box.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(returnTarget);
  });
});

describe('DadsMenuListBox - styles', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('data-has-opener-icon 時の opener-icon は中央揃えされる', async () => {
    const { defineDefaultMenuListBox } = await import('./menu-list-box-define');
    defineDefaultMenuListBox();

    element = renderWebComponent(`
      <dads-menu-list-box label="メニュー">
        <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"></svg>
        <dads-menu-list-item>Item</dads-menu-list-item>
      </dads-menu-list-box>
    `);
    await waitForCustomElement(element);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(element.hasAttribute('data-has-opener-icon')).toBe(true);

    const openerIcon = getShadowContent(element, '[part="opener-icon"]') as HTMLElement | null;
    if (!openerIcon) throw new Error('opener icon not found');

    const styles = getComputedStyle(openerIcon);
    expect(styles.display).toBe('inline-flex');
    expect(styles.alignItems).toBe('center');
  });
});
