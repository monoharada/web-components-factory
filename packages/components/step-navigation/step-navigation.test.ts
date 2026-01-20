/**
 * Step Navigation コンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

describe('DadsStepNavigation', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation>
        <dads-step-navigation-item>
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');
    expect(component).toBeInTheDocument();
    expect(component.shadowRoot).toBeTruthy();
  });

  it('デフォルトで orientation=horizontal / size=normal が設定される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation>
        <dads-step-navigation-item>
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');
    expect(component.getAttribute('orientation')).toBe('horizontal');
    expect(component.getAttribute('size')).toBe('normal');
  });

  it('子要素に step / first/last / data-orientation / data-size を付与する', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation orientation="vertical" size="small">
        <dads-step-navigation-item>
          <span slot="title">タイトル1</span>
        </dads-step-navigation-item>
        <dads-step-navigation-item>
          <span slot="title">タイトル2</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `) as HTMLElement;

    await waitForComponent('dads-step-navigation');
    await waitForComponent('dads-step-navigation-item');

    const items = component.querySelectorAll('dads-step-navigation-item');
    expect(items.length).toBe(2);

    expect(items[0].getAttribute('step')).toBe('1');
    expect(items[1].getAttribute('step')).toBe('2');
    expect(items[0].hasAttribute('data-first')).toBe(true);
    expect(items[0].hasAttribute('data-last')).toBe(false);
    expect(items[1].hasAttribute('data-first')).toBe(false);
    expect(items[1].hasAttribute('data-last')).toBe(true);

    for (const item of items) {
      expect(item.getAttribute('data-orientation')).toBe('vertical');
      expect(item.getAttribute('data-size')).toBe('small');
      expect(item.getAttribute('role')).toBe('listitem');
      expect(item.getAttribute('aria-setsize')).toBe('2');
    }
  });

  it('aria-label が Shadow 内の nav に反映される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation aria-label="ステップ">
        <dads-step-navigation-item href="#x">
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');

    const nav = getShadowElement(component, '#nav');
    expect(nav?.getAttribute('aria-label')).toBe('ステップ');
  });

  it('aria-labelledby が Shadow 内の nav に反映される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const wrapper = renderWebComponent(`
      <div>
        <span id="stepnav-label">ステップ</span>
        <dads-step-navigation aria-labelledby="stepnav-label">
          <dads-step-navigation-item href="#x">
            <span slot="title">タイトル</span>
          </dads-step-navigation-item>
        </dads-step-navigation>
      </div>
    `);

    const component = wrapper.querySelector('dads-step-navigation') as HTMLElement | null;
    expect(component).toBeTruthy();

    await waitForComponent('dads-step-navigation');

    const nav = getShadowElement(component as HTMLElement, '#nav');
    expect(nav?.getAttribute('aria-labelledby')).toBe('stepnav-label');
  });

  it('status-live="polite" の場合、status に aria-live/aria-atomic が設定される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation status-live="polite">
        <span slot="status">全3ステップ中、1ステップ目まで到達済み</span>
        <dads-step-navigation-item href="#x">
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');

    const status = getShadowElement(component, '#status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(status?.hasAttribute('hidden')).toBe(false);
  });

  it('status スロットが空の場合、status が hidden になる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation status-live="polite">
        <dads-step-navigation-item href="#x">
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');

    const status = getShadowElement(component, '#status');
    expect(status?.hasAttribute('hidden')).toBe(true);
  });

  it('非インタラクティブの場合、nav の role が group になる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation>
        <dads-step-navigation-item>
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `);

    await waitForComponent('dads-step-navigation');

    const nav = getShadowElement(component, '#nav');
    expect(nav?.getAttribute('role')).toBe('group');
  });

  it('href の付与に追従して nav の role が切り替わる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const component = renderWebComponent(`
      <dads-step-navigation>
        <dads-step-navigation-item>
          <span slot="title">タイトル</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    `) as HTMLElement;

    await waitForComponent('dads-step-navigation');

    const nav = getShadowElement(component, '#nav');
    expect(nav?.getAttribute('role')).toBe('group');

    const item = component.querySelector('dads-step-navigation-item') as HTMLElement | null;
    expect(item).toBeTruthy();
    item?.setAttribute('href', '#x');

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    expect(nav?.getAttribute('role')).toBe(null);
  });
});

describe('DadsStepNavigationItem', () => {
  afterEach(() => {
    cleanup();
  });

  it('step 属性が番号表示に反映される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item step="3">
        <span slot="title">タイトル</span>
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');
    const numberValue = getShadowElement(item, '#number-value');
    expect(numberValue?.textContent).toBe('3');
  });

  it('href/target/rel が内部 header(<a>) に反映される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item href="#x" target="_blank" rel="noopener">
        <span slot="title">タイトル</span>
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');
    const header = getShadowElement(item, '#header') as HTMLAnchorElement | null;
    expect(header?.getAttribute('href')).toBe('#x');
    expect(header?.getAttribute('target')).toBe('_blank');
    expect(header?.getAttribute('rel')).toBe('noopener');
  });

  it('slot="title" がなくても default slot がタイトルとして扱われる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item>
        タイトル
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const titleSlot = getShadowElement(item, 'slot[name="title"]') as HTMLSlotElement | null;
    expect(titleSlot).toBeTruthy();

    const fallbackSlot = titleSlot?.querySelector('slot') as HTMLSlotElement | null;
    expect(fallbackSlot).toBeTruthy();

    const assigned = (fallbackSlot?.assignedNodes({ flatten: true }) ?? []).map((n) =>
      n.textContent?.trim(),
    );
    expect(assigned.join('')).toContain('タイトル');
  });

  it('interaction="button" の場合、クリック/Enter/Space で dads-step-activate が発火する', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item interaction="button" step="2">
        タイトル
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const header = getShadowElement(item, '#header') as HTMLElement | null;
    expect(header?.getAttribute('role')).toBe('button');
    expect(header?.getAttribute('tabindex')).toBe('0');

    const received: any[] = [];
    item.addEventListener('dads-step-activate', (e) => received.push((e as CustomEvent).detail));

    header?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    header?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    header?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(received.length).toBe(3);
    expect(received[0]).toMatchObject({ step: '2', trigger: 'click' });
    expect(received[1]).toMatchObject({ step: '2', trigger: 'keyboard' });
    expect(received[2]).toMatchObject({ step: '2', trigger: 'keyboard' });
  });

  it('href 指定時は link 優先となり、interaction="button" でもボタン相当の挙動にならない', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item href="#x" interaction="button">
        タイトル
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const header = getShadowElement(item, '#header') as HTMLAnchorElement | null;
    expect(header?.getAttribute('href')).toBe('#x');
    expect(header?.getAttribute('role')).toBe(null);
    expect(header?.hasAttribute('tabindex')).toBe(false);

    let fired = false;
    item.addEventListener('dads-step-activate', () => {
      fired = true;
    });
    header?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(fired).toBe(false);
  });

  it('label-* 属性でラベル文言を差し替えできる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item
        label-step="STEP"
        label-completed="DONE"
        label-editing="EDIT"
        label-error="ERR"
        label-skipped="SKIPPED"
      >
        タイトル
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const stepLabel = getShadowElement(item, '[part~="step-label"]') as HTMLElement | null;
    const completedSr = getShadowElement(item, '[data-state-sr="completed"]') as HTMLElement | null;
    const skippedSr = getShadowElement(item, '[data-state-sr="skipped"]') as HTMLElement | null;
    const editingLabel = getShadowElement(item, '[data-state-label="editing"]') as HTMLElement | null;
    const errorLabel = getShadowElement(item, '[data-state-label="error"]') as HTMLElement | null;

    expect(stepLabel?.textContent).toBe('STEP');
    expect(completedSr?.textContent).toBe('DONE');
    expect(skippedSr?.textContent).toBe('SKIPPED');
    expect(editingLabel?.textContent).toBe('EDIT');
    expect(errorLabel?.textContent).toBe('ERR');
  });

  it('slot="description" が空の場合、description が hidden になる', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item step="1">
        <span slot="title">タイトル</span>
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const description = getShadowElement(item, '#description');
    expect(description?.hasAttribute('hidden')).toBe(true);
  });

  it('slot="description" がある場合、description が表示される', async () => {
    const { defineDefaultStepNavigation } = await import('./step-navigation-define');
    defineDefaultStepNavigation();

    const item = renderWebComponent(`
      <dads-step-navigation-item step="1">
        <span slot="title">タイトル</span>
        <span slot="description">説明</span>
      </dads-step-navigation-item>
    `);

    await waitForComponent('dads-step-navigation-item');

    const description = getShadowElement(item, '#description');
    expect(description?.hasAttribute('hidden')).toBe(false);
  });
});
