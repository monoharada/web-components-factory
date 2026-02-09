import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineHeaderContainer } from './header-container-define.js';

beforeAll(() => {
  defineHeaderContainer();
});

function flushMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

function renderAllSlots(mode: string): HTMLElement {
  return renderWebComponent(`
    <dads-header-container mode="${mode}" aria-label="テストヘッダー">
      <a slot="logo" href="#">デジタル庁</a>
      <div slot="utility"><a href="#">ログイン</a></div>
      <nav slot="global-menu"><a href="#">ホーム</a></nav>
      <button slot="hamburger-menu" type="button">メニュー</button>
    </dads-header-container>
  `);
}

describe('DadsHeaderContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('定義と基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-header-container><span slot="logo">Logo</span></dads-header-container>');
    await waitForComponent('dads-header-container');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="primary-row"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="logo"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="utility"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="global-menu"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="hamburger-menu"]')).toBeInTheDocument();
  });

  it('mode が不正値の場合は auto に正規化される', async () => {
    const el = renderWebComponent('<dads-header-container mode="unknown"></dads-header-container>');
    await waitForComponent('dads-header-container');

    expect(el.getAttribute('mode')).toBe('auto');
    expect(['wide-full', 'medium', 'compact']).toContain(el.getAttribute('data-effective-mode'));
  });

  it('aria-label を base に反映する', async () => {
    const el = renderWebComponent(
      '<dads-header-container aria-label="行政ヘッダー"><span slot="logo">Logo</span></dads-header-container>',
    );
    await waitForComponent('dads-header-container');

    const base = getShadowElement<HTMLElement>(el, '[part="base"]');
    expect(base?.getAttribute('aria-label')).toBe('行政ヘッダー');

    el.removeAttribute('aria-label');
    await flushMicrotask();

    expect(base?.hasAttribute('aria-label')).toBe(false);
  });

  it('slot の有無を data-has-* 属性に反映する', async () => {
    const el = renderWebComponent(`
      <dads-header-container mode="compact">
        <span slot="logo">Logo</span>
        <button slot="hamburger-menu" type="button">Menu</button>
      </dads-header-container>
    `);
    await waitForComponent('dads-header-container');

    expect(el.hasAttribute('data-has-utility')).toBe(false);
    expect(el.hasAttribute('data-has-global-menu')).toBe(false);
    expect(el.hasAttribute('data-has-hamburger-menu')).toBe(true);

    const utility = getShadowElement<HTMLElement>(el, '[part="utility"]');
    const globalMenu = getShadowElement<HTMLElement>(el, '[part="global-menu"]');
    const hamburgerMenu = getShadowElement<HTMLElement>(el, '[part="hamburger-menu"]');

    expect(utility?.hasAttribute('hidden')).toBe(true);
    expect(globalMenu?.hasAttribute('hidden')).toBe(true);
    expect(hamburgerMenu?.hasAttribute('hidden')).toBe(false);
  });

  it('wide-full では logo + utility + global-menu を表示し、hamburger は非表示', async () => {
    const el = renderAllSlots('wide-full');
    await waitForComponent('dads-header-container');

    const utility = getShadowElement<HTMLElement>(el, '[part="utility"]');
    const globalMenu = getShadowElement<HTMLElement>(el, '[part="global-menu"]');
    const hamburgerMenu = getShadowElement<HTMLElement>(el, '[part="hamburger-menu"]');

    expect(utility?.hasAttribute('hidden')).toBe(false);
    expect(globalMenu?.hasAttribute('hidden')).toBe(false);
    expect(hamburgerMenu?.hasAttribute('hidden')).toBe(true);
  });

  it('wide-slim では logo + global-menu + utility を表示し、hamburger は非表示', async () => {
    const el = renderAllSlots('wide-slim');
    await waitForComponent('dads-header-container');

    const utility = getShadowElement<HTMLElement>(el, '[part="utility"]');
    const globalMenu = getShadowElement<HTMLElement>(el, '[part="global-menu"]');
    const hamburgerMenu = getShadowElement<HTMLElement>(el, '[part="hamburger-menu"]');

    expect(utility?.hasAttribute('hidden')).toBe(false);
    expect(globalMenu?.hasAttribute('hidden')).toBe(false);
    expect(hamburgerMenu?.hasAttribute('hidden')).toBe(true);
  });

  it('medium では logo + hamburger を表示し、global-menu は非表示（utility は存在時のみ表示）', async () => {
    const el = renderAllSlots('medium');
    await waitForComponent('dads-header-container');

    const utility = getShadowElement<HTMLElement>(el, '[part="utility"]');
    const globalMenu = getShadowElement<HTMLElement>(el, '[part="global-menu"]');
    const hamburgerMenu = getShadowElement<HTMLElement>(el, '[part="hamburger-menu"]');

    expect(utility?.hasAttribute('hidden')).toBe(false);
    expect(globalMenu?.hasAttribute('hidden')).toBe(true);
    expect(hamburgerMenu?.hasAttribute('hidden')).toBe(false);
  });

  it('compact では logo + hamburger を表示し、global-menu は非表示（utility は存在時のみ表示）', async () => {
    const el = renderAllSlots('compact');
    await waitForComponent('dads-header-container');

    const utility = getShadowElement<HTMLElement>(el, '[part="utility"]');
    const globalMenu = getShadowElement<HTMLElement>(el, '[part="global-menu"]');
    const hamburgerMenu = getShadowElement<HTMLElement>(el, '[part="hamburger-menu"]');

    expect(utility?.hasAttribute('hidden')).toBe(false);
    expect(globalMenu?.hasAttribute('hidden')).toBe(true);
    expect(hamburgerMenu?.hasAttribute('hidden')).toBe(false);
  });
});

describe('DadsHeaderContainer - a11yAnnotations', () => {
  it('callouts が主要なパーツを含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-header-container');
    const ids = annotations?.callouts?.map((c) => c.id) ?? [];

    expect(ids).toEqual(
      expect.arrayContaining(['base', 'primary-row', 'logo', 'utility', 'global-menu', 'hamburger-menu']),
    );
  });
});
