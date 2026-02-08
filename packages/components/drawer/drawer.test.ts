/**
 * DadsDrawer コンポーネント テスト
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  getDefinitionStyles,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { DadsDrawer, type DadsDrawerEventDetail } from './drawer.js';
import { defineDrawer } from './drawer-define.js';

defineDrawer();

type DrawerLikeElement = HTMLElement & {
  show: () => void;
  close: () => void;
};

function flushMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

function dispatchDocumentKeydown(
  key: string,
  options: Readonly<{ shiftKey?: boolean; cancelable?: boolean; composed?: boolean }> = {},
): void {
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      shiftKey: options.shiftKey ?? false,
      cancelable: options.cancelable ?? false,
      composed: options.composed ?? false,
    }),
  );
}

function dispatchDrawerCommand(
  element: HTMLElement,
  command: string,
  invoker: HTMLElement | null,
  originalEvent: Event | null = null,
): void {
  element.dispatchEvent(
    new CustomEvent('dads-command', {
      bubbles: true,
      composed: true,
      detail: {
        command,
        invoker,
        target: element,
        value: null,
        originalEvent,
      },
    }),
  );
}

describe('DadsDrawer - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントがレンダリングされ、dialog属性が適用される', async () => {
    const element = renderWebComponent(`
      <dads-drawer>
        <span slot="title">タイトル</span>
        本文
      </dads-drawer>
    `);

    await waitForComponent('dads-drawer');

    const base = getShadowElement(element, '#base');
    const panel = getShadowElement(element, '#panel');

    expect(base).toBeInTheDocument();
    expect(panel).toBeInTheDocument();
    expect(base?.getAttribute('role')).toBe('dialog');
    expect(base?.getAttribute('aria-modal')).toBe('true');
  });

  it('placement は left/right のみ受理し、デフォルトは left', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    expect(element.getAttribute('placement')).toBe('left');

    element.setAttribute('placement', 'right');
    await flushMicrotask();
    expect(element.getAttribute('placement')).toBe('right');

    element.setAttribute('placement', 'invalid');
    await flushMicrotask();
    expect(element.getAttribute('placement')).toBe('left');
  });

  it('close-label が閉じるボタンに反映される', async () => {
    const element = renderWebComponent('<dads-drawer close-label="メニューを閉じる"></dads-drawer>');
    await waitForComponent('dads-drawer');

    const closeButtonLabel = getShadowElement(element, '#close-button-label');
    expect(closeButtonLabel?.textContent).toContain('メニューを閉じる');

    element.setAttribute('close-label', '閉じる');
    await flushMicrotask();
    expect(closeButtonLabel?.textContent).toContain('閉じる');
  });

  it('閉じるボタンにFigma準拠のバツ印アイコンを描画する', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    const icon = getShadowElement(element, '#close-button-icon');
    const iconSvg = getShadowElement(element, '#close-button-icon-svg');
    const iconPath = getShadowElement(element, '#close-button-icon-path');

    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(iconSvg?.getAttribute('viewBox')).toBe('0 0 14 14');
    expect(iconSvg?.getAttribute('focusable')).toBe('false');
    expect(iconPath?.getAttribute('d')).toBe(
      'M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z',
    );
  });

  it('aria-label指定時はaria-labelledbyを使わず明示ラベルを優先する', async () => {
    const element = renderWebComponent(`
      <dads-drawer open aria-label="グローバルメニュー">
        <span slot="title">タイトル</span>
        本文
      </dads-drawer>
    `);

    await waitForComponent('dads-drawer');
    await flushMicrotask();

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    expect(base?.getAttribute('aria-label')).toBe('グローバルメニュー');
    expect(base?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('aria-label未指定かつtitleあり時はaria-labelledbyを設定する', async () => {
    const element = renderWebComponent(`
      <dads-drawer open>
        <span slot="title">タイトル</span>
        本文
      </dads-drawer>
    `);

    await waitForComponent('dads-drawer');
    await flushMicrotask();

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    expect(base?.getAttribute('aria-labelledby')).toBe('title');
    expect(base?.hasAttribute('aria-label')).toBe(false);
  });
});

describe('DadsDrawer - 開閉イベント', () => {
  afterEach(() => {
    cleanup();
  });

  it('show/closeで before/after イベントが発火する', async () => {
    const element = renderWebComponent(`
      <dads-drawer>
        <span slot="title">タイトル</span>
        本文
      </dads-drawer>
    `) as DrawerLikeElement;

    await waitForComponent('dads-drawer');

    const beforeOpen = vi.fn();
    const open = vi.fn();
    const beforeClose = vi.fn();
    const close = vi.fn();

    element.addEventListener('dads-drawer-before-open', beforeOpen);
    element.addEventListener('dads-drawer-open', open);
    element.addEventListener('dads-drawer-before-close', beforeClose);
    element.addEventListener('dads-drawer-close', close);

    element.show();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
    expect(beforeOpen).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledTimes(1);

    element.close();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('dads-drawer-before-open が preventDefault されると開かない', async () => {
    const element = renderWebComponent(`
      <dads-drawer>
        <span slot="title">タイトル</span>
      </dads-drawer>
    `) as DrawerLikeElement;

    await waitForComponent('dads-drawer');

    element.addEventListener(
      'dads-drawer-before-open',
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );

    element.show();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
  });

  it('dads-drawer-before-close が preventDefault されると閉じない', async () => {
    const element = renderWebComponent('<dads-drawer open></dads-drawer>') as DrawerLikeElement;

    await waitForComponent('dads-drawer');
    await flushMicrotask();

    element.addEventListener(
      'dads-drawer-before-close',
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );

    element.close();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
  });

  it('command語彙（show-modal/open/close/request-close）で開閉できる', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    const invoker = document.createElement('button');
    document.body.appendChild(invoker);

    dispatchDrawerCommand(element, 'show-modal', invoker);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    dispatchDrawerCommand(element, 'close', invoker);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(false);

    dispatchDrawerCommand(element, 'open', invoker);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    dispatchDrawerCommand(element, 'request-close', invoker);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('open属性の付け外しで開閉できる', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    element.setAttribute('open', '');
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    element.removeAttribute('open');
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('commandイベントの command プロパティでも開閉できる', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    const openEvent = new Event('command', { bubbles: true, composed: true });
    Object.defineProperty(openEvent, 'command', { value: 'show-modal' });
    element.dispatchEvent(openEvent);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    const closeEvent = new Event('command', { bubbles: true, composed: true });
    Object.defineProperty(closeEvent, 'command', { value: 'close' });
    element.dispatchEvent(closeEvent);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('イベントdetailに invoker / returnFocusTo / reason が入る', async () => {
    const element = renderWebComponent('<dads-drawer></dads-drawer>');
    await waitForComponent('dads-drawer');

    const invoker = document.createElement('button');
    document.body.appendChild(invoker);

    const details: DadsDrawerEventDetail[] = [];
    element.addEventListener('dads-drawer-open', (event) => {
      details.push((event as CustomEvent<DadsDrawerEventDetail>).detail);
    });
    element.addEventListener('dads-drawer-close', (event) => {
      details.push((event as CustomEvent<DadsDrawerEventDetail>).detail);
    });

    dispatchDrawerCommand(element, 'show-modal', invoker);
    await flushMicrotask();
    dispatchDrawerCommand(element, 'close', invoker);
    await flushMicrotask();

    expect(details).toHaveLength(2);
    expect(details[0]).toMatchObject({
      reason: 'command',
      invoker,
      returnFocusTo: invoker,
    });
    expect(details[1]).toMatchObject({
      reason: 'command',
      invoker,
      returnFocusTo: invoker,
    });
  });
});

describe('DadsDrawer - キーボード / light-dismiss', () => {
  afterEach(() => {
    cleanup();
  });

  it('Escで閉じて、起動元へフォーカスを戻す（reason: escape）', async () => {
    const invoker = document.createElement('button');
    invoker.textContent = 'open';
    document.body.appendChild(invoker);
    invoker.focus();

    const element = renderWebComponent(`
      <dads-drawer>
        <span slot="title">タイトル</span>
        <button id="first" data-drawer-initial-focus>first</button>
        <button id="second">second</button>
      </dads-drawer>
    `);

    await waitForComponent('dads-drawer');

    const closeDetails: DadsDrawerEventDetail[] = [];
    element.addEventListener('dads-drawer-close', (event) => {
      closeDetails.push((event as CustomEvent<DadsDrawerEventDetail>).detail);
    });

    dispatchDrawerCommand(element, 'show-modal', invoker);
    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    dispatchDocumentKeydown('Escape');
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(invoker);
    expect(closeDetails.at(-1)?.reason).toBe('escape');
  });

  it('light-dismiss未指定では backdrop クリックで閉じない', async () => {
    const element = renderWebComponent('<dads-drawer open></dads-drawer>');
    await waitForComponent('dads-drawer');

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
  });

  it('light-dismiss指定時は backdrop クリックで閉じる（reason: light-dismiss）', async () => {
    const element = renderWebComponent('<dads-drawer open light-dismiss></dads-drawer>');
    await waitForComponent('dads-drawer');

    const closeDetails: DadsDrawerEventDetail[] = [];
    element.addEventListener('dads-drawer-close', (event) => {
      closeDetails.push((event as CustomEvent<DadsDrawerEventDetail>).detail);
    });

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(closeDetails.at(-1)?.reason).toBe('light-dismiss');
  });

  it('close-button 操作で reason: close-button が発火する', async () => {
    const element = renderWebComponent('<dads-drawer open></dads-drawer>');
    await waitForComponent('dads-drawer');

    const closeDetails: DadsDrawerEventDetail[] = [];
    element.addEventListener('dads-drawer-close', (event) => {
      closeDetails.push((event as CustomEvent<DadsDrawerEventDetail>).detail);
    });

    const closeButton = getShadowElement(element, '#close-button') as HTMLButtonElement | null;
    closeButton?.click();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(closeDetails.at(-1)?.reason).toBe('close-button');
  });

  it('Tab/Shift+Tabでフォーカスをループする', async () => {
    const element = renderWebComponent(`
      <dads-drawer open>
        <button id="first">first</button>
        <button id="second">second</button>
      </dads-drawer>
    `);

    await waitForComponent('dads-drawer');
    await flushMicrotask();

    const first = element.querySelector('#first') as HTMLButtonElement | null;
    const second = element.querySelector('#second') as HTMLButtonElement | null;
    const closeButton = getShadowElement(element, '#close-button') as HTMLButtonElement | null;
    if (!first || !second || !closeButton) throw new Error('focus targets not found');

    second.focus();
    dispatchDocumentKeydown('Tab', { cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(closeButton);

    closeButton.focus();
    dispatchDocumentKeydown('Tab', { shiftKey: true, cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(second);
  });
});

describe('DadsDrawer - トークン', () => {
  it('幅とbackdrop色トークンを持つ', () => {
    const styles = getDefinitionStyles(DadsDrawer.definition);
    const cssText = styles
      .map((sheet) => {
        if (typeof sheet === 'string') return sheet;
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      })
      .join('\n');

    expect(cssText).toContain('--drawer-width: calc(288 / 16 * 1rem)');
    expect(cssText).toContain('--dads-drawer-width: var(--drawer-width)');
    expect(cssText).toContain('--drawer-backdrop-background: var(--color-neutral-opacity-gray-100');
    expect(cssText).toContain('--dads-drawer-backdrop-background: var(--drawer-backdrop-background)');
  });
});

describe('DadsDrawer - a11yAnnotations', () => {
  it('calloutsが主要な要素を含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-drawer');
    const ids = annotations?.callouts?.map((c) => c.id) ?? [];

    expect(ids).toEqual(
      expect.arrayContaining(['base', 'backdrop', 'panel', 'header', 'title', 'close-button', 'content']),
    );
  });
});
