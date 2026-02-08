/**
 * DadsNotificationBanner コンポーネント テスト
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsNotificationBanner - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(component).toBeInTheDocument();
  });

  it('デフォルト属性が補完される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    expect(component.getAttribute('type')).toBe('info-1');
    expect(component.getAttribute('variant')).toBe('standard');
    expect(component.getAttribute('interaction')).toBe('none');
    expect(component.getAttribute('close-style')).toBe('default');
    expect(component.getAttribute('actions-layout')).toBe('horizontal');
    expect(component.getAttribute('dismiss-mode')).toBe('hide');
    expect(component.getAttribute('close-label')).toBe('閉じる');
    expect(component.getAttribute('restore-label')).toBe('再表示');
  });

  it('type="info1" / "info2" を正規化する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const info1 = renderWebComponent(`
      <dads-notification-banner type="info1">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(info1.getAttribute('type')).toBe('info-1');

    cleanup();

    const info2 = renderWebComponent(`
      <dads-notification-banner type="info2">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(info2.getAttribute('type')).toBe('info-2');
  });

  it('actions-layout の値を正規化する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const invalid = renderWebComponent(`
      <dads-notification-banner actions-layout="diagonal">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(invalid.getAttribute('actions-layout')).toBe('horizontal');

    cleanup();

    const horizontal = renderWebComponent(`
      <dads-notification-banner actions-layout="horizontal">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(horizontal.getAttribute('actions-layout')).toBe('horizontal');

    cleanup();

    const vertical = renderWebComponent(`
      <dads-notification-banner actions-layout="vertical">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(vertical.getAttribute('actions-layout')).toBe('vertical');
  });
});

describe('DadsNotificationBanner - close', () => {
  afterEach(() => {
    cleanup();
  });

  it('dismissible 未指定では閉じるボタンが hidden', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    expect(close?.hidden).toBe(true);
  });

  it('dismissible 指定で閉じるボタンが表示される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dismissible close-label="バナーを閉じる">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    expect(close?.hidden).toBe(false);
    expect(close?.getAttribute('aria-label')).toBe('バナーを閉じる');
  });

  it('閉じる押下で close イベントが発火し hidden になる', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner type="success" variant="color-chip" dismissible>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');
    expect(component.getAttribute('type')).toBe('success');
    expect(component.getAttribute('variant')).toBe('color-chip');

    const handler = vi.fn();
    component.addEventListener('dads-notification-banner-close', handler);

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const detail = handler.mock.calls[0]?.[0]?.detail;
    expect(detail?.type).toBe('success');
    expect(detail?.variant).toBe('color-chip');
    expect(detail?.dismissMode).toBe('hide');
    expect(component.hidden).toBe(true);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('close イベントが preventDefault されると hidden にならない', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dismissible>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    component.addEventListener('dads-notification-banner-close', (event) => {
      event.preventDefault();
    });

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('dense でも閉じる押下で hidden になる', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner type="info-1" dense dismissible close-style="compact">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hidden).toBe(true);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('dismiss-mode="hide" は hidden=false に戻すと再表示できる', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dismissible dismiss-mode="hide">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hidden).toBe(true);
    expect(component.hasAttribute('data-dismissed')).toBe(false);

    component.hidden = false;
    await Promise.resolve();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('dismiss-mode を collapse から hide に変えると data-dismissed が残らない', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dismissible dismiss-mode="collapse">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hasAttribute('data-dismissed')).toBe(true);
    expect(component.hidden).toBe(false);

    component.setAttribute('dismiss-mode', 'hide');
    await Promise.resolve();

    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('dismiss-mode="collapse" では閉じる押下で折りたたみになり hidden にならない', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dismissible dismiss-mode="collapse" restore-label="再表示する">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    const restore = getShadowElement<HTMLElement>(component, '#restore');
    const restoreButton = getShadowElement<HTMLButtonElement>(component, '#restore-button');

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(true);
    expect(restore?.hidden).toBe(false);
    expect(restoreButton?.textContent).toBe('再表示する');
  });

  it('dismiss-mode="collapse" で再表示ボタン押下時に restore イベントが発火し復帰する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner type="warning" variant="standard" dismissible dismiss-mode="collapse">
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    const restoreHandler = vi.fn();
    component.addEventListener('dads-notification-banner-restore', restoreHandler);

    const restoreButton = getShadowElement<HTMLButtonElement>(component, '#restore-button');
    restoreButton?.click();

    expect(restoreHandler).toHaveBeenCalledTimes(1);
    const detail = restoreHandler.mock.calls[0]?.[0]?.detail;
    expect(detail?.type).toBe('warning');
    expect(detail?.variant).toBe('standard');
    expect(detail?.dismissMode).toBe('collapse');
    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('dense + close-style="compact" + dismiss-mode="collapse" でも close/restore が動作する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner dense dismissible close-style="compact" dismiss-mode="collapse">
        <span slot="title">タイトル</span>
        <p>説明</p>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(true);

    const restore = getShadowElement<HTMLElement>(component, '#restore');
    expect(restore?.hidden).toBe(false);

    const restoreButton = getShadowElement<HTMLButtonElement>(component, '#restore-button');
    restoreButton?.click();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });

  it('data-mobile-demo + close-style="compact" + dismiss-mode="collapse" でも close/restore が動作する', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner data-mobile-demo dismissible close-style="compact" dismiss-mode="collapse">
        <span slot="title">タイトル</span>
        <p>説明</p>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const close = getShadowElement<HTMLButtonElement>(component, '#close');
    close?.click();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(true);

    const restoreButton = getShadowElement<HTMLButtonElement>(component, '#restore-button');
    restoreButton?.click();

    expect(component.hidden).toBe(false);
    expect(component.hasAttribute('data-dismissed')).toBe(false);
  });
});

describe('DadsNotificationBanner - slot visibility', () => {
  afterEach(() => {
    cleanup();
  });

  it('meta/description/actions が空の場合は該当領域が hidden', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const body = getShadowElement<HTMLElement>(component, '#body');
    const meta = getShadowElement<HTMLElement>(component, '#meta');
    const description = getShadowElement<HTMLElement>(component, '#description');
    const actions = getShadowElement<HTMLElement>(component, '#actions');

    expect(body?.hidden).toBe(true);
    expect(meta?.hidden).toBe(true);
    expect(description?.hidden).toBe(true);
    expect(actions?.hidden).toBe(true);
  });

  it('description または actions がある場合は表示される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
        <p>説明</p>
        <div slot="actions"><button type="button">アクション</button></div>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const body = getShadowElement<HTMLElement>(component, '#body');
    const description = getShadowElement<HTMLElement>(component, '#description');
    const actions = getShadowElement<HTMLElement>(component, '#actions');

    expect(body?.hidden).toBe(false);
    expect(description?.hidden).toBe(false);
    expect(actions?.hidden).toBe(false);
  });

  it('actions が2件以上ある場合は data-multiple-actions が付与される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
        <button slot="actions" type="button">A</button>
        <button slot="actions" type="button">B</button>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    expect(component.hasAttribute('data-multiple-actions')).toBe(true);
  });

  it('actions が1件の場合は data-multiple-actions が付与されない', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner>
        <span slot="title">タイトル</span>
        <button slot="actions" type="button">A</button>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    expect(component.hasAttribute('data-multiple-actions')).toBe(false);
  });
});

describe('DadsNotificationBanner - interaction', () => {
  afterEach(() => {
    cleanup();
  });

  it('interaction="whole" でバナークリックがタイトルリンクへ委譲される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner interaction="whole">
        <a slot="title" href="#detail" id="title-link">タイトル</a>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const link = component.querySelector('#title-link') as HTMLAnchorElement | null;
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    const clickSpy = vi.spyOn(link as HTMLAnchorElement, 'click');
    const base = getShadowElement<HTMLElement>(component, '#base');

    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(component.getAttribute('data-link-target')).toBe('whole');
    expect(base?.getAttribute('role')).toBe('link');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('interaction="title-and-actions" でタイトル領域クリックがリンクへ委譲される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner interaction="title-and-actions">
        <a slot="title" href="#detail" id="title-link">タイトル</a>
        <div slot="actions"><button type="button" id="action-button">操作</button></div>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const link = component.querySelector('#title-link') as HTMLAnchorElement | null;
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    const clickSpy = vi.spyOn(link as HTMLAnchorElement, 'click');
    const title = getShadowElement<HTMLElement>(component, '#title');

    title?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(component.getAttribute('data-link-target')).toBe('title');
    expect(title?.getAttribute('role')).toBe('link');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('actions-only ではリンク委譲しない', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner interaction="actions-only">
        <a slot="title" href="#detail" id="title-link">タイトル</a>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const link = component.querySelector('#title-link') as HTMLAnchorElement | null;
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    const clickSpy = vi.spyOn(link as HTMLAnchorElement, 'click');
    const base = getShadowElement<HTMLElement>(component, '#base');

    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(component.getAttribute('data-link-target')).toBeNull();
    expect(clickSpy).toHaveBeenCalledTimes(0);
  });

  it('whole モードで Enter キー押下時にリンク委譲される', async () => {
    const { defineDefaultNotificationBanner } = await import('./notification-banner-define');
    defineDefaultNotificationBanner();

    const component = renderWebComponent(`
      <dads-notification-banner interaction="whole">
        <a slot="title" href="#detail" id="title-link">タイトル</a>
      </dads-notification-banner>
    `);

    await waitForComponent('dads-notification-banner');

    const link = component.querySelector('#title-link') as HTMLAnchorElement | null;
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    const clickSpy = vi.spyOn(link as HTMLAnchorElement, 'click');
    const base = getShadowElement<HTMLElement>(component, '#base');

    base?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
