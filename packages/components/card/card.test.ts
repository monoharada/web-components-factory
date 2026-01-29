/**
 * DadsCardコンポーネント テスト
 */

import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { defineCard } from './card-define.js';

// コンポーネントを一度だけ定義
beforeAll(() => {
  defineCard();
});

describe('DadsCard - 基本', () => {
  afterEach(() => cleanup());

  it('コンポーネントが存在する', async () => {
    const component = renderWebComponent(`
      <dads-card>
        <h2>タイトル</h2>
      </dads-card>
    `);

    await waitForComponent('dads-card');
    expect(component).toBeInTheDocument();
  });

  it('media/sub の空スロットは hidden になる', async () => {
    const component = renderWebComponent(`
      <dads-card>
        <h2>タイトル</h2>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const media = getShadowElement(component, '[part="media"]') as HTMLElement | null;
    const sub = getShadowElement(component, '[part="sub"]') as HTMLElement | null;

    expect(media?.hasAttribute('hidden')).toBe(true);
    expect(sub?.hasAttribute('hidden')).toBe(true);
  });

  it('media/sub に要素を入れると hidden が外れる', async () => {
    const component = renderWebComponent(`
      <dads-card>
        <img slot="media" alt="" src="about:blank" />
        <h2>タイトル</h2>
        <div slot="sub">サブ</div>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const media = getShadowElement(component, '[part="media"]') as HTMLElement | null;
    const sub = getShadowElement(component, '[part="sub"]') as HTMLElement | null;

    expect(media?.hasAttribute('hidden')).toBe(false);
    expect(sub?.hasAttribute('hidden')).toBe(false);
  });

  it('デフォルトスロットに複数の要素を配置できる', async () => {
    const component = renderWebComponent(`
      <dads-card>
        <h2>タイトル</h2>
        <p>本文テキスト</p>
        <span>追加要素</span>
      </dads-card>
    `) as HTMLElement;

    await waitForComponent('dads-card');
    const main = getShadowElement(component, '[part="main"]') as HTMLElement | null;
    expect(main).toBeTruthy();

    // デフォルトスロットに配置された要素を確認
    const h2 = component.querySelector('h2');
    const p = component.querySelector('p');
    const span = component.querySelector('span');

    expect(h2?.textContent).toBe('タイトル');
    expect(p?.textContent).toBe('本文テキスト');
    expect(span?.textContent).toBe('追加要素');
  });
});

describe('DadsCard - クリック委譲', () => {
  afterEach(() => cleanup());

  it('data-dads-card-delegate 付き primary へカード面クリックを委譲する', async () => {
    const component = renderWebComponent(`
      <dads-card>
        <h2>
          <a
            href="#primary"
            data-dads-card-primary
            data-dads-card-delegate
          >主リンク</a>
        </h2>
        <p>本文</p>
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
    const component = renderWebComponent(`
      <dads-card>
        <h2>
          <a
            href="#primary"
            data-dads-card-primary
            data-dads-card-delegate
          >主リンク</a>
        </h2>
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
    const component = renderWebComponent(`
      <dads-card>
        <h2>
          <a
            href="#primary"
            data-dads-card-primary
            data-dads-card-delegate
          >主リンク</a>
        </h2>
        <p id="t">本文</p>
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
