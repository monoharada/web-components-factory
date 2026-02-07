/**
 * DadsDialog コンポーネント テスト
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  getDefinitionStyles,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { DadsDialog } from './dialog.js';
import { defineDialog } from './dialog-define.js';

defineDialog();

type DialogLikeElement = HTMLElement & {
  show: () => void;
  close: () => void;
};

type DialogBaseLike = HTMLElement & {
  open?: boolean;
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

describe('DadsDialog - 基本', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントがレンダリングされ、dialog属性が適用される', async () => {
    const element = renderWebComponent(`
      <dads-dialog>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');

    const base = getShadowElement(element, '#base');
    const panel = getShadowElement(element, '#panel');

    expect(base).toBeInTheDocument();
    expect(panel).toBeInTheDocument();
    expect(base?.getAttribute('role')).toBe('dialog');
    expect(base?.getAttribute('aria-modal')).toBe('true');
  });

  it('aria-label指定時はaria-labelledbyを使わず明示ラベルを優先する', async () => {
    const element = renderWebComponent(`
      <dads-dialog open aria-label="申請確認ダイアログ">
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    expect(base?.getAttribute('aria-label')).toBe('申請確認ダイアログ');
    expect(base?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('title/aria-label未指定時はaria-labelにフォールバックする', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const base = getShadowElement(element, '#base') as HTMLElement | null;
    expect(base?.getAttribute('aria-label')).toBe('ダイアログ');
    expect(base?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('close-button属性がある時だけ閉じるボタンを表示する', async () => {
    const element = renderWebComponent(`
      <dads-dialog close-button close-label="閉じる">
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');

    const closeButton = getShadowElement(element, '#close-button') as HTMLButtonElement | null;
    const closeButtonLabel = getShadowElement(element, '#close-button-label');
    expect(closeButton).toBeTruthy();
    expect(closeButton?.hidden).toBe(false);
    expect(closeButtonLabel?.textContent).toContain('閉じる');

    element.removeAttribute('close-button');
    await flushMicrotask();
    expect(closeButton?.hidden).toBe(true);
  });

  it('sizeはデフォルトでm、sm/md/lgはs/m/lへ正規化される', async () => {
    const element = renderWebComponent(`<dads-dialog></dads-dialog>`);
    await waitForComponent('dads-dialog');

    expect(element.getAttribute('size')).toBe('m');

    element.setAttribute('size', 'sm');
    await flushMicrotask();
    expect(element.getAttribute('size')).toBe('s');

    element.setAttribute('size', 'md');
    await flushMicrotask();
    expect(element.getAttribute('size')).toBe('m');

    element.setAttribute('size', 'lg');
    await flushMicrotask();
    expect(element.getAttribute('size')).toBe('l');
  });

  it('data-preview-contained時は showModal ではなく show で開く', async () => {
    const element = renderWebComponent(`
      <dads-dialog data-preview-contained>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `) as DialogLikeElement;

    await waitForComponent('dads-dialog');

    const base = getShadowElement(element, '#base') as (HTMLDialogElement & {
      show: () => void;
      showModal: () => void;
    }) | null;
    if (!base) throw new Error('base dialog not found');

    const showSpy = vi.spyOn(base, 'show').mockImplementation(() => {
      base.setAttribute('open', '');
    });
    const showModalSpy = vi.spyOn(base, 'showModal').mockImplementation(() => {
      base.setAttribute('open', '');
    });

    element.show();
    await flushMicrotask();

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(showModalSpy).not.toHaveBeenCalled();

    showSpy.mockRestore();
    showModalSpy.mockRestore();
  });

  it('data-preview-contained時は document focusin でフォーカスを奪わない', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const element = renderWebComponent(`
      <dads-dialog open data-preview-contained>
        <span slot="title">タイトル</span>
        <button id="inside">inside</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    outside.focus();
    document.dispatchEvent(new FocusEvent('focusin', { bubbles: true, composed: true }));
    await flushMicrotask();

    expect(document.activeElement).toBe(outside);
  });

  it('data-dialog-initial-focus を付与した tabindex=-1 要素に初期フォーカスできる', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title" id="heading-focus" tabindex="-1" data-dialog-initial-focus>見出し</span>
        <button id="next-action">次へ</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const heading = element.querySelector('#heading-focus') as HTMLElement | null;
    if (!heading) throw new Error('heading focus target not found');

    expect(document.activeElement).toBe(heading);
  });

  it('initial-focus=\"title\" 時はタイトル領域に初期フォーカスする', async () => {
    const element = renderWebComponent(`
      <dads-dialog open initial-focus="title">
        <span slot="title">見出しタイトル</span>
        <button id="next-action">次へ</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const shadowTitle = getShadowElement(element, '#title') as HTMLElement | null;
    if (!shadowTitle) throw new Error('shadow title not found');

    expect(element.shadowRoot?.activeElement).toBe(shadowTitle);
  });
});

describe('DadsDialog - 開閉イベント', () => {
  afterEach(() => {
    cleanup();
  });

  it('show/closeで before/after イベントが発火する', async () => {
    const element = renderWebComponent(`
      <dads-dialog close-button>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `) as DialogLikeElement;

    await waitForComponent('dads-dialog');

    const beforeOpen = vi.fn();
    const open = vi.fn();
    const beforeClose = vi.fn();
    const close = vi.fn();

    element.addEventListener('dads-dialog-before-open', beforeOpen);
    element.addEventListener('dads-dialog-open', open);
    element.addEventListener('dads-dialog-before-close', beforeClose);
    element.addEventListener('dads-dialog-close', close);

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

  it('dads-dialog-before-open が preventDefault されると開かない', async () => {
    const element = renderWebComponent(`
      <dads-dialog>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `) as DialogLikeElement;

    await waitForComponent('dads-dialog');

    element.addEventListener(
      'dads-dialog-before-open',
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );

    element.show();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
  });

  it('dads-dialog-before-close が preventDefault されると閉じない', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `) as DialogLikeElement;

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const close = vi.fn();
    element.addEventListener('dads-dialog-close', close);
    element.addEventListener(
      'dads-dialog-before-close',
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );

    element.close();
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
    expect(close).not.toHaveBeenCalled();
  });
});

describe('DadsDialog - commandfor / command-store 連携', () => {
  afterEach(() => {
    cleanup();
  });

  it('dads-command(command=\"show-modal\"|\"close\") で開閉できる', async () => {
    const element = renderWebComponent(`
      <dads-dialog id="test-dialog">
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');

    const invoker = document.createElement('button');
    document.body.appendChild(invoker);

    element.dispatchEvent(
      new CustomEvent('dads-command', {
        bubbles: true,
        composed: true,
        detail: {
          command: 'show-modal',
          invoker,
          target: element,
          value: null,
          originalEvent: null,
        },
      }),
    );

    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    element.dispatchEvent(
      new CustomEvent('dads-command', {
        bubbles: true,
        composed: true,
        detail: {
          command: 'close',
          invoker,
          target: element,
          value: null,
          originalEvent: null,
        },
      }),
    );

    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(false);
  });
});

describe('DadsDialog - APG キーボード操作', () => {
  afterEach(() => {
    cleanup();
  });

  it('Escで閉じて、起動元へフォーカスを戻す', async () => {
    const invoker = document.createElement('button');
    invoker.id = 'invoker';
    invoker.textContent = 'open';
    document.body.appendChild(invoker);
    invoker.focus();

    const element = renderWebComponent(`
      <dads-dialog>
        <span slot="title">タイトル</span>
        <button id="first" data-dialog-initial-focus>first</button>
        <button id="second">second</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');

    element.dispatchEvent(
      new CustomEvent('dads-command', {
        bubbles: true,
        composed: true,
        detail: {
          command: 'show-modal',
          invoker,
          target: element,
          value: null,
          originalEvent: null,
        },
      }),
    );

    await flushMicrotask();
    expect(element.hasAttribute('open')).toBe(true);

    dispatchDocumentKeydown('Escape');
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(invoker);
  });

  it('light dismiss を行わない（backdropクリックで閉じない）', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');

    const base = getShadowElement(element, '#base') as DialogBaseLike | null;
    expect(base).toBeTruthy();
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushMicrotask();

    expect(element.hasAttribute('open')).toBe(true);
  });

  it('Tab/Shift+Tabでフォーカスをループする', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title">タイトル</span>
        <button id="first" data-dialog-initial-focus>first</button>
        <button id="second">second</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const first = element.querySelector('#first') as HTMLButtonElement | null;
    const second = element.querySelector('#second') as HTMLButtonElement | null;
    if (!first || !second) throw new Error('focus targets not found');

    second.focus();
    dispatchDocumentKeydown('Tab', { cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(first);

    first.focus();
    dispatchDocumentKeydown('Tab', { shiftKey: true, cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(second);
  });

  it('フォーカス可能要素がない時のTabはパネルへフォーカスする', async () => {
    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title">タイトル</span>
        本文
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const panel = getShadowElement(element, '#panel') as HTMLElement | null;
    if (!panel) throw new Error('panel not found');

    dispatchDocumentKeydown('Tab', { cancelable: true, composed: true });
    await flushMicrotask();

    expect(element.shadowRoot?.activeElement).toBe(panel);
  });

  it('フォーカスが外部にある時のTab/Shift+Tabで先頭・末尾へ戻す', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const element = renderWebComponent(`
      <dads-dialog open>
        <span slot="title">タイトル</span>
        <button id="first">first</button>
        <button id="second">second</button>
      </dads-dialog>
    `);

    await waitForComponent('dads-dialog');
    await flushMicrotask();

    const first = element.querySelector('#first') as HTMLButtonElement | null;
    const second = element.querySelector('#second') as HTMLButtonElement | null;
    if (!first || !second) throw new Error('focus targets not found');

    outside.focus();
    dispatchDocumentKeydown('Tab', { cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(first);

    outside.focus();
    dispatchDocumentKeydown('Tab', { shiftKey: true, cancelable: true, composed: true });
    await flushMicrotask();
    expect(document.activeElement).toBe(second);
  });
});

describe('DadsDialog - トークン', () => {
  it('backdrop色が gray-100 から --dads-* へ再代入される', () => {
    const styles = getDefinitionStyles(DadsDialog.definition);
    const cssText = styles
      .map((sheet) => {
        if (typeof sheet === 'string') return sheet;
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      })
      .join('\n');

    expect(cssText).toContain('--dialog-backdrop-background: var(--color-neutral-opacity-gray-100');
    expect(cssText).toContain('--dads-dialog-backdrop-background: var(--dialog-backdrop-background)');
    expect(cssText).toContain("[part='base']::backdrop");
  });

  it('sizeトークン（s/m/l）で幅を切り替えられる', () => {
    const styles = getDefinitionStyles(DadsDialog.definition);
    const cssText = styles
      .map((sheet) => {
        if (typeof sheet === 'string') return sheet;
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      })
      .join('\n');

    expect(cssText).toContain('--dialog-width-s: calc(480 / 16 * 1rem)');
    expect(cssText).toContain('--dialog-width-m: calc(640 / 16 * 1rem)');
    expect(cssText).toContain('--dialog-width-l: calc(800 / 16 * 1rem)');
    expect(cssText).toContain(':host([size="s"])');
    expect(cssText).toContain(':host([size="m"])');
    expect(cssText).toContain(':host([size="l"])');
  });
});

describe('DadsDialog - a11yAnnotations', () => {
  it('calloutsが主要な要素を含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-dialog');
    const ids = annotations?.callouts?.map((c) => c.id) ?? [];

    expect(ids).toEqual(
      expect.arrayContaining(['base', 'panel', 'title', 'content', 'close-button', 'footer']),
    );
  });
});
