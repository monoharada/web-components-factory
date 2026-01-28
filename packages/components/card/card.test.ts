/**
 * DadsCardコンポーネント テスト
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsCard - 基本', () => {
  afterEach(() => cleanup());

  it('コンポーネントが存在する', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <h2 slot="title">タイトル</h2>
      </dads-card>
    `);

    await waitForComponent('dads-card');
    expect(component).toBeInTheDocument();
  });

  it('media/sub の空スロットは hidden になる', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <h2 slot="title">タイトル</h2>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const media = getShadowElement(component, '[part="media"]') as HTMLElement | null;
    const sub = getShadowElement(component, '[part="sub"]') as HTMLElement | null;

    expect(media?.hasAttribute('hidden')).toBe(true);
    expect(sub?.hasAttribute('hidden')).toBe(true);
  });

  it('media/sub に要素を入れると hidden が外れる', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <img slot="media" alt="" src="about:blank" />
        <h2 slot="title">タイトル</h2>
        <div slot="sub">サブ</div>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const media = getShadowElement(component, '[part="media"]') as HTMLElement | null;
    const sub = getShadowElement(component, '[part="sub"]') as HTMLElement | null;

    expect(media?.hasAttribute('hidden')).toBe(false);
    expect(sub?.hasAttribute('hidden')).toBe(false);
  });
});

describe('DadsCard - クリック委譲', () => {
  afterEach(() => cleanup());

  it('data-dads-card-delegate 付き primary へカード面クリックを委譲する', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <a
          slot="title"
          href="#primary"
          data-dads-card-primary
          data-dads-card-delegate
        >主リンク</a>
        <p slot="content">本文</p>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const primary = component.querySelector('[data-dads-card-primary]') as HTMLAnchorElement | null;
    expect(primary).toBeTruthy();

    const onPrimaryClick = vi.fn();
    primary?.addEventListener('click', onPrimaryClick);

    const base = getShadowElement(component, '[part="base"]') as HTMLElement | null;
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it('内部ボタンのクリックは委譲しない', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <a
          slot="title"
          href="#primary"
          data-dads-card-primary
          data-dads-card-delegate
        >主リンク</a>
        <button slot="sub">サブボタン</button>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const primary = component.querySelector('[data-dads-card-primary]') as HTMLAnchorElement | null;
    expect(primary).toBeTruthy();

    const onPrimaryClick = vi.fn();
    primary?.addEventListener('click', onPrimaryClick);

    const subButton = component.querySelector('button') as HTMLButtonElement | null;
    subButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onPrimaryClick).toHaveBeenCalledTimes(0);
  });

  it('選択状態（selection）がカード内にある場合は委譲しない', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <a
          slot="title"
          href="#primary"
          data-dads-card-primary
          data-dads-card-delegate
        >主リンク</a>
        <p slot="content" id="t">本文</p>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const primary = component.querySelector('[data-dads-card-primary]') as HTMLAnchorElement | null;
    expect(primary).toBeTruthy();

    const onPrimaryClick = vi.fn();
    primary?.addEventListener('click', onPrimaryClick);

    const fakeSelection = {
      isCollapsed: false,
      anchorNode: component.querySelector('#t')?.firstChild ?? null,
      focusNode: component.querySelector('#t')?.firstChild ?? null,
    } as unknown as Selection;

    const spy = vi.spyOn(document, 'getSelection').mockReturnValue(fakeSelection);

    const base = getShadowElement(component, '[part="base"]') as HTMLElement | null;
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onPrimaryClick).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });
});

describe('DadsCard - ホバー', () => {
  afterEach(() => cleanup());

  it('他の操作要素にホバーしたときはタイトルのhover表現を抑制する', async () => {
    const { defineCard } = await import('./card-define');
    defineCard();

    const component = renderWebComponent(`
      <dads-card>
        <a
          slot="title"
          href="#primary"
          data-dads-card-primary
        >主リンク</a>
        <button slot="sub">詳しくみる</button>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    expect(component.hasAttribute('data-title-clickable')).toBe(true);

    const subButton = component.querySelector('button') as HTMLButtonElement | null;
    expect(subButton).toBeTruthy();

    subButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, composed: true }));
    expect(component.hasAttribute('data-suppress-title-hover')).toBe(true);

    const primary = component.querySelector('[data-dads-card-primary]') as HTMLElement | null;
    expect(primary).toBeTruthy();

    primary?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, composed: true }));
    expect(component.hasAttribute('data-suppress-title-hover')).toBe(false);
  });
});
