/**
 * DadsPageNavigation コンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  getShadowText,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsPageNavigation - 基本', () => {
  afterEach(() => cleanup());

  it('コンポーネントが存在する', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`<dads-page-navigation></dads-page-navigation>`);
    await waitForComponent('dads-page-navigation');

    expect(component).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`<dads-page-navigation></dads-page-navigation>`);
    await waitForComponent('dads-page-navigation');

    expect(component.shadowRoot).toBeTruthy();
  });

  it('デフォルト属性が設定される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`<dads-page-navigation></dads-page-navigation>`);
    await waitForComponent('dads-page-navigation');

    expect(component.getAttribute('type')).toBe('text');
    expect(component.getAttribute('size')).toBe('m');
    expect(component.getAttribute('status-separator')).toBe('/');
  });

  it('nav にデフォルトの aria-label が付与される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`<dads-page-navigation></dads-page-navigation>`);
    await waitForComponent('dads-page-navigation');

    const nav = getShadowElement(component, '[part="nav"]');
    expect(nav?.getAttribute('aria-label')).toBe('ページナビゲーション');
  });
});

describe('DadsPageNavigation - コントロール表示（リンクモード）', () => {
  afterEach(() => cleanup());

  it('href 未指定のリンクは非表示になる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`<dads-page-navigation></dads-page-navigation>`);
    await waitForComponent('dads-page-navigation');

    const prevLink = getShadowElement(component, '#prev-link');
    const nextLink = getShadowElement(component, '#next-link');
    expect(prevLink?.hasAttribute('hidden')).toBe(true);
    expect(nextLink?.hasAttribute('hidden')).toBe(true);
  });

  it('prev-href/next-href 指定でリンクが表示される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation prev-href="#prev" next-href="#next"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const prev = getShadowElement<HTMLAnchorElement>(component, '#prev-link');
    const next = getShadowElement<HTMLAnchorElement>(component, '#next-link');
    expect(prev?.hasAttribute('hidden')).toBe(false);
    expect(next?.hasAttribute('hidden')).toBe(false);
    expect(prev?.getAttribute('href')).toBe('#prev');
    expect(next?.getAttribute('href')).toBe('#next');
  });

  it('ラベルが属性で上書きできる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation
        prev-href="#"
        next-href="#"
        prev-label="前の3件"
        next-label="次の3件"
      ></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    expect(getShadowText(component, '#prev-link-label')).toBe('前の3件');
    expect(getShadowText(component, '#next-link-label')).toBe('次の3件');
  });
});

describe('DadsPageNavigation - ボタンモード (as="button")', () => {
  afterEach(() => cleanup());

  it('as="button" でボタン要素が表示される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation as="button"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const prevButton = getShadowElement(component, '#prev-button');
    const nextButton = getShadowElement(component, '#next-button');
    const prevLink = getShadowElement(component, '#prev-link');
    const nextLink = getShadowElement(component, '#next-link');

    // ボタンが表示される
    expect(prevButton?.hasAttribute('hidden')).toBe(false);
    expect(nextButton?.hasAttribute('hidden')).toBe(false);
    // リンクは非表示
    expect(prevLink?.hasAttribute('hidden')).toBe(true);
    expect(nextLink?.hasAttribute('hidden')).toBe(true);
  });

  it('disabled-prev/disabled-next でボタンが非表示になる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation as="button" disabled-prev disabled-next></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const prevButton = getShadowElement<HTMLButtonElement>(component, '#prev-button');
    const nextButton = getShadowElement<HTMLButtonElement>(component, '#next-button');

    expect(prevButton?.hasAttribute('hidden')).toBe(true);
    expect(nextButton?.hasAttribute('hidden')).toBe(true);
  });

  it('ボタンクリックで prev イベントが発火する', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation as="button"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    let eventFired = false;
    component.addEventListener('prev', () => {
      eventFired = true;
    });

    const prevButton = getShadowElement<HTMLButtonElement>(component, '#prev-button');
    prevButton?.click();

    expect(eventFired).toBe(true);
  });

  it('ボタンクリックで next イベントが発火する', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation as="button"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    let eventFired = false;
    component.addEventListener('next', () => {
      eventFired = true;
    });

    const nextButton = getShadowElement<HTMLButtonElement>(component, '#next-button');
    nextButton?.click();

    expect(eventFired).toBe(true);
  });

  it('ボタンモードでもラベルが属性で上書きできる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation
        as="button"
        prev-label="前の3件"
        next-label="次の3件"
      ></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    expect(getShadowText(component, '#prev-button-label')).toBe('前の3件');
    expect(getShadowText(component, '#next-button-label')).toBe('次の3件');
  });

  it('ボタンモードで prev/next 両方あれば balanced レイアウトになる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation as="button" current="1" total="24"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const nav = getShadowElement(component, '[part="nav"]');
    expect(nav?.getAttribute('data-layout')).toBe('balanced');
  });
});

describe('DadsPageNavigation - ステータス', () => {
  afterEach(() => cleanup());

  it('current/total でステータスが表示される（デフォルト区切り）', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation current="1" total="24"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const status = getShadowElement(component, '[part~="status"]');
    expect(status?.hasAttribute('hidden')).toBe(false);
    expect(status?.textContent?.trim()).toBe('1/24');
  });

  it('status-separator で区切りを変更できる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation current="9999" total="9999" status-separator=" / "></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const status = getShadowElement(component, '[part~="status"]');
    expect(status?.textContent?.trim()).toBe('9,999 / 9,999');
  });

  it('status 属性で任意のステータス文字列を表示できる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation status="ページ 1/24（全120件）"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const status = getShadowElement(component, '[part~="status"]');
    expect(status?.textContent?.trim()).toBe('ページ 1/24（全120件）');
  });

  it('status slot は status 属性より優先される', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation status="ignored">
        <span slot="status">カスタム</span>
      </dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const status = getShadowElement(component, '[part~="status"]');
    expect(status?.hasAttribute('hidden')).toBe(false);
    expect(getShadowText(component, '#status-fallback')).toBe('');
    expect(component.querySelector('[slot="status"]')?.textContent?.trim()).toBe('カスタム');
  });

  it('hide-status 指定でステータスを非表示にできる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation current="1" total="24" hide-status></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const status = getShadowElement(component, '[part~="status"]');
    expect(status?.hasAttribute('hidden')).toBe(true);
  });
});

describe('DadsPageNavigation - レイアウト（リンクモード）', () => {
  afterEach(() => cleanup());

  it('prev/next リンクが両方ある場合は balanced レイアウトになる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation prev-href="#" next-href="#" current="1" total="24"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const nav = getShadowElement(component, '[part="nav"]');
    expect(nav?.getAttribute('data-layout')).toBe('balanced');
  });

  it('リンクが片側のみの場合は start レイアウトになる', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation next-href="#" current="1" total="24"></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const nav = getShadowElement(component, '[part="nav"]');
    expect(nav?.getAttribute('data-layout')).toBe('start');
  });

  it('fill 属性でコントロールがコンテナ幅を埋める', async () => {
    const { definePageNavigation } = await import('./page-navigation-define');
    definePageNavigation();

    const component = renderWebComponent(`
      <dads-page-navigation prev-href="#" next-href="#" fill></dads-page-navigation>
    `);
    await waitForComponent('dads-page-navigation');

    const nav = getShadowElement(component, '[part="nav"]');
    expect(nav?.hasAttribute('data-fill')).toBe(true);
  });
});
