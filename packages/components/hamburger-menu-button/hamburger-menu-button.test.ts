/**
 * DadsHamburgerMenuButton コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { defaultCommandStore } from '../../utils/command-store.js';
import { defineDrawer } from '../drawer/drawer-define.js';
import { defineHamburgerMenuButton } from './hamburger-menu-button-define.js';

defineHamburgerMenuButton();
defineDrawer();

function flushMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

describe('DadsHamburgerMenuButton - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルト属性（variant/type/lang）が設定される', async () => {
    const element = renderWebComponent('<dads-hamburger-menu-button></dads-hamburger-menu-button>');
    await waitForComponent('dads-hamburger-menu-button');

    expect(element.getAttribute('variant')).toBe('standard');
    expect(element.getAttribute('type')).toBe('menu');
    expect(element.getAttribute('lang')).toBe('ja');
  });

  it('variant/type/lang は許可値に正規化される', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button variant="x" type="x" lang="fr"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    expect(element.getAttribute('variant')).toBe('standard');
    expect(element.getAttribute('type')).toBe('menu');
    expect(element.getAttribute('lang')).toBe('ja');

    element.setAttribute('variant', 'icon');
    element.setAttribute('type', 'close');
    element.setAttribute('lang', 'en');
    await flushMicrotask();

    expect(element.getAttribute('variant')).toBe('icon');
    expect(element.getAttribute('type')).toBe('close');
    expect(element.getAttribute('lang')).toBe('en');
  });

  it('hidden 属性で非表示になる', async () => {
    const element = renderWebComponent('<dads-hamburger-menu-button></dads-hamburger-menu-button>');
    await waitForComponent('dads-hamburger-menu-button');

    expect(getComputedStyle(element).display).not.toBe('none');

    element.setAttribute('hidden', '');
    await flushMicrotask();

    expect(getComputedStyle(element).display).toBe('none');
  });
});

describe('DadsHamburgerMenuButton - アイコン/ラベル切替', () => {
  afterEach(() => {
    cleanup();
  });

  it('standard + menu(ja) で24pxメニューアイコンと日本語ラベルを表示する', async () => {
    const element = renderWebComponent('<dads-hamburger-menu-button></dads-hamburger-menu-button>');
    await waitForComponent('dads-hamburger-menu-button');

    const iconSvg = getShadowElement<SVGSVGElement>(element, '#icon-svg');
    const iconPath = getShadowElement<SVGPathElement>(element, '#icon-path');
    const label = getShadowElement(element, '#label');

    expect(iconSvg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(iconPath?.getAttribute('d')).toContain('M3 18V16H21V18H3');
    expect(label?.textContent).toBe('メニュー');
  });

  it('standard + close でクローズアイコンに切り替わる', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button type="close"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    const iconSvg = getShadowElement<SVGSVGElement>(element, '#icon-svg');
    const iconPath = getShadowElement<SVGPathElement>(element, '#icon-path');
    const label = getShadowElement(element, '#label');

    expect(iconSvg?.getAttribute('viewBox')).toBe('0 0 120 120');
    expect(iconPath?.getAttribute('d')).toContain('M32 95L25 88L53 60');
    expect(label?.textContent).toBe('閉じる');
  });

  it('icon + menu(en) で44x44の内包ラベルアイコンに切り替わる', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button variant="icon" lang="en"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    const iconSvg = getShadowElement<SVGSVGElement>(element, '#icon-svg');
    const iconPath = getShadowElement<SVGPathElement>(element, '#icon-path');
    const label = getShadowElement(element, '#label');

    expect(iconSvg?.getAttribute('viewBox')).toBe('0 0 44 44');
    expect(iconPath?.getAttribute('d')).toContain('M39 23v2H5v-2h34');
    expect(label?.textContent).toBe('MENU');
  });

  it('icon + close(en) で44x44のCLOSE内包アイコンに切り替わる', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button variant="icon" type="close" lang="en"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    const iconSvg = getShadowElement<SVGSVGElement>(element, '#icon-svg');
    const iconPath = getShadowElement<SVGPathElement>(element, '#icon-path');
    const label = getShadowElement(element, '#label');

    expect(iconSvg?.getAttribute('viewBox')).toBe('0 0 44 44');
    expect(iconPath?.getAttribute('d')).toContain('M37.3 39H33v-8h4.3v1h-3.1');
    expect(label?.textContent).toBe('CLOSE');
  });
});

describe('DadsHamburgerMenuButton - アクセシビリティ/属性委譲', () => {
  afterEach(() => {
    cleanup();
  });

  it('aria-label未指定時は type/lang からアクセシブル名を補完する', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button type="close" lang="en"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    const base = getShadowElement<HTMLButtonElement>(element, '#base');
    expect(base?.getAttribute('aria-label')).toBe('CLOSE');
  });

  it('aria-label指定時は明示値を優先する', async () => {
    const element = renderWebComponent(
      '<dads-hamburger-menu-button aria-label="Open global navigation"></dads-hamburger-menu-button>',
    );
    await waitForComponent('dads-hamburger-menu-button');

    const base = getShadowElement<HTMLButtonElement>(element, '#base');
    expect(base?.getAttribute('aria-label')).toBe('Open global navigation');
  });

  it('command/commandfor/aria-* が base に委譲される', async () => {
    const element = renderWebComponent(`
      <dads-hamburger-menu-button
        command="show-modal"
        commandfor="#drawer"
        aria-controls="drawer"
        aria-expanded="false"
        aria-label="メニュー"
      ></dads-hamburger-menu-button>
    `);
    await waitForComponent('dads-hamburger-menu-button');

    const base = getShadowElement<HTMLButtonElement>(element, '#base');
    expect(base?.getAttribute('command')).toBe('show-modal');
    expect(base?.getAttribute('commandfor')).toBe('#drawer');
    expect(base?.getAttribute('aria-controls')).toBe('drawer');
    expect(base?.getAttribute('aria-expanded')).toBe('false');
    expect(base?.getAttribute('aria-label')).toBe('メニュー');

    element.setAttribute('command', 'close');
    element.setAttribute('commandfor', '#drawer2');
    element.setAttribute('aria-controls', 'drawer2');
    element.setAttribute('aria-expanded', 'true');
    await flushMicrotask();

    expect(base?.getAttribute('command')).toBe('close');
    expect(base?.getAttribute('commandfor')).toBe('#drawer2');
    expect(base?.getAttribute('aria-controls')).toBe('drawer2');
    expect(base?.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('DadsHamburgerMenuButton - commandfor連携', () => {
  afterEach(() => {
    cleanup();
  });

  it('drawerを commandfor で開閉し、drawerの before/after イベントが発火する', async () => {
    document.body.innerHTML = `
      <div id="integration-root">
        <dads-hamburger-menu-button
          id="trigger"
          command="show-modal"
          commandfor="#drawer"
          aria-controls="drawer"
          aria-expanded="false"
        ></dads-hamburger-menu-button>
        <dads-drawer id="drawer">
          <span slot="title">メニュー</span>
          <button type="button">item</button>
        </dads-drawer>
      </div>
    `;

    await waitForComponent('dads-hamburger-menu-button');
    await waitForComponent('dads-drawer');

    const root = document.getElementById('integration-root');
    const trigger = document.getElementById('trigger');
    const drawer = document.getElementById('drawer');
    if (!root || !trigger || !drawer) throw new Error('integration elements not found');

    const eventNames: string[] = [];
    drawer.addEventListener('dads-drawer-before-open', () => eventNames.push('before-open'));
    drawer.addEventListener('dads-drawer-open', () => eventNames.push('open'));
    drawer.addEventListener('dads-drawer-before-close', () => eventNames.push('before-close'));
    drawer.addEventListener('dads-drawer-close', () => eventNames.push('close'));

    const unbind = defaultCommandStore.bind(root);

    const base = getShadowElement<HTMLButtonElement>(trigger, '#base');
    if (!base) throw new Error('trigger base not found');

    base.click();
    await flushMicrotask();
    expect(drawer.hasAttribute('open')).toBe(true);

    trigger.setAttribute('command', 'close');
    await flushMicrotask();
    base.click();
    await flushMicrotask();
    expect(drawer.hasAttribute('open')).toBe(false);

    unbind();

    expect(eventNames).toEqual(['before-open', 'open', 'before-close', 'close']);
  });
});

describe('DadsHamburgerMenuButton - a11yAnnotations', () => {
  it('calloutsが主要な要素を含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-hamburger-menu-button');
    const ids = annotations?.callouts?.map((c) => c.id) ?? [];

    expect(ids).toEqual(expect.arrayContaining(['base', 'icon', 'label']));
  });
});
