import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineLayoutShell } from './layout-shell-define.js';

beforeAll(() => {
  defineLayoutShell();
});

function flushMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

describe('DadsLayoutShell', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-layout-shell>main</dads-layout-shell>');
    await waitForComponent('dads-layout-shell');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="header"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="body"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="sidebar"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="main"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="aside"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="footer"]')).toBeInTheDocument();
  });

  it('不正な pattern / mode / mobile-sidebar は正規化される', async () => {
    const el = renderWebComponent(
      '<dads-layout-shell pattern="unknown" mode="unknown" mobile-sidebar="unknown">main</dads-layout-shell>',
    );
    await waitForComponent('dads-layout-shell');

    expect(el.getAttribute('pattern')).toBe('app-shell');
    expect(el.getAttribute('mode')).toBe('auto');
    expect(el.getAttribute('mobile-sidebar')).toBe('bottom');
    expect(['desktop', 'tablet', 'mobile']).toContain(el.getAttribute('data-effective-mode'));
  });

  it('app-shell + desktop は sidebar を表示する', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="app-shell" mode="desktop">
        <div slot="header">header</div>
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="footer">footer</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-effective-pattern')).toBe('app-shell');
    expect(el.getAttribute('data-effective-mode')).toBe('desktop');
    expect(el.getAttribute('data-sidebar-state')).toBe('full');
    expect(sidebar?.hasAttribute('hidden')).toBe(false);
    expect(aside?.hasAttribute('hidden')).toBe(true);
  });

  it('app-shell + mobile (default: bottom) は sidebar を表示して1カラム（main -> sidebar）で積む', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="app-shell" mode="mobile">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');

    expect(el.getAttribute('data-sidebar-state')).toBe('full');
    expect(el.getAttribute('data-body-layout')).toBe('app-shell-mobile-stacked-bottom');
    expect(sidebar?.hasAttribute('hidden')).toBe(false);
  });

  it('app-shell + mobile + mobile-sidebar=top は sidebar を上に積む', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="app-shell" mode="mobile" mobile-sidebar="top">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');

    expect(el.getAttribute('data-sidebar-state')).toBe('full');
    expect(el.getAttribute('data-body-layout')).toBe('app-shell-mobile-stacked-top');
    expect(sidebar?.hasAttribute('hidden')).toBe(false);
  });

  it('app-shell + mobile + mobile-sidebar=hidden は sidebar を非表示にする', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="app-shell" mode="mobile" mobile-sidebar="hidden">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');

    expect(el.getAttribute('data-sidebar-state')).toBe('hidden');
    expect(el.getAttribute('data-body-layout')).toBe('single');
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
  });

  it('app-shell + mobile で sidebar slot が無い場合は single になる', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="app-shell" mode="mobile">
        <section>main</section>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');

    expect(el.getAttribute('data-sidebar-state')).toBe('hidden');
    expect(el.getAttribute('data-body-layout')).toBe('single');
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
  });

  it('master-detail は aside を表示する', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="master-detail" mode="desktop">
        <section>main</section>
        <div slot="aside">aside</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-body-layout')).toBe('master-detail');
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
    expect(aside?.hasAttribute('hidden')).toBe(false);
  });

  it('website は sidebar / aside を非表示にする', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="website" mode="desktop">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="aside">aside</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-body-layout')).toBe('single');
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
    expect(aside?.hasAttribute('hidden')).toBe(true);
  });

  it('left-header-pane は desktop でヘッダー左ペイン + main を有効化する', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="left-header-pane" mode="desktop">
        <div slot="header">header</div>
        <section>main</section>
        <div slot="footer">footer</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const header = getShadowElement<HTMLElement>(el, '[part="header"]');
    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');
    const footer = getShadowElement<HTMLElement>(el, '[part="footer"]');

    expect(el.getAttribute('data-effective-pattern')).toBe('left-header-pane');
    expect(el.getAttribute('data-body-layout')).toBe('left-header-pane');
    expect(header?.hasAttribute('hidden')).toBe(false);
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
    expect(aside?.hasAttribute('hidden')).toBe(true);
    expect(footer?.hasAttribute('hidden')).toBe(false);
  });

  it('three-pane は desktop で sidebar + main + aside を表示する', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="three-pane" mode="desktop">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="aside">aside</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-body-layout')).toBe('three-pane');
    expect(el.getAttribute('data-sidebar-state')).toBe('full');
    expect(sidebar?.hasAttribute('hidden')).toBe(false);
    expect(aside?.hasAttribute('hidden')).toBe(false);
  });

  it('three-pane は mobile で main -> aside -> sidebar の1カラム積みにする（既定: bottom）', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="three-pane" mode="mobile">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="aside">aside</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-body-layout')).toBe('three-pane-mobile-bottom');
    expect(el.getAttribute('data-sidebar-state')).toBe('full');
    expect(sidebar?.hasAttribute('hidden')).toBe(false);
    expect(aside?.hasAttribute('hidden')).toBe(false);
  });

  it('three-pane は mobile-sidebar=hidden で sidebar を非表示にして main + aside にする', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="three-pane" mode="mobile" mobile-sidebar="hidden">
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="aside">aside</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const sidebar = getShadowElement<HTMLElement>(el, '[part="sidebar"]');
    const aside = getShadowElement<HTMLElement>(el, '[part="aside"]');

    expect(el.getAttribute('data-body-layout')).toBe('master-detail-stacked');
    expect(el.getAttribute('data-sidebar-state')).toBe('hidden');
    expect(sidebar?.hasAttribute('hidden')).toBe(true);
    expect(aside?.hasAttribute('hidden')).toBe(false);
  });

  it('three-pane-shell は header / footer を維持しつつ body を3ペイン化する', async () => {
    const el = renderWebComponent(`
      <dads-layout-shell pattern="three-pane-shell" mode="desktop">
        <div slot="header">header</div>
        <div slot="sidebar">sidebar</div>
        <section>main</section>
        <div slot="aside">aside</div>
        <div slot="footer">footer</div>
      </dads-layout-shell>
    `);

    await waitForComponent('dads-layout-shell');

    const header = getShadowElement<HTMLElement>(el, '[part="header"]');
    const footer = getShadowElement<HTMLElement>(el, '[part="footer"]');

    expect(el.getAttribute('data-body-layout')).toBe('three-pane');
    expect(header?.hasAttribute('hidden')).toBe(false);
    expect(footer?.hasAttribute('hidden')).toBe(false);
  });

  it('mode=auto は matchMedia に応じて effective mode を切り替える', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === '(min-width: 48rem)',
      }),
    });

    const el = renderWebComponent('<dads-layout-shell mode="auto">main</dads-layout-shell>');
    await waitForComponent('dads-layout-shell');

    expect(el.getAttribute('data-effective-mode')).toBe('tablet');

    el.setAttribute('mode', 'desktop');
    await flushMicrotask();
    expect(el.getAttribute('data-effective-mode')).toBe('desktop');
  });
});
