/**
 * DadsResourceList テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  getDefinitionStyles,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

function waitTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function toCssText(style: string | CSSStyleSheet): string {
  if (typeof style === 'string') return style;
  return Array.from(style.cssRules)
    .map((rule) => rule.cssText)
    .join('\n');
}

describe('DadsResourceList - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineResourceList } = await import('./resource-list-define.js');

    defineResourceList();
    defineResourceList();

    expect(customElements.get('dads-resource-list')).toBeTruthy();
  });

  it('デフォルト属性とshadow構造が初期化される', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = createTestElement('dads-resource-list');
    await waitForCustomElement(element);

    expect(element.getAttribute('data-style')).toBe('list');
    expect(element.getAttribute('data-interaction')).toBe('inline');
    expect(getShadowContent(element, '#base')).toBeTruthy();
    expect(getShadowContent(element, '#body')).toBeTruthy();
  });

  it('不正な enum 属性は既定値へ正規化される', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(
      '<dads-resource-list data-style="unknown" data-interaction="invalid"></dads-resource-list>'
    );
    await waitForCustomElement(element);
    await waitTick();

    expect(element.getAttribute('data-style')).toBe('list');
    expect(element.getAttribute('data-interaction')).toBe('inline');
  });

  it('whole interaction + href で body はリンク化される', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole" href="/documents">
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    expect(body?.tagName).toBe('A');
    expect((body as HTMLAnchorElement).getAttribute('href')).toBe('/documents');
    expect(element.hasAttribute('data-whole-link')).toBe(true);
    expect(element.hasAttribute('data-whole-control')).toBe(false);
  });

  it('危険な href は # へフォールバックされる', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole" href="javascript:alert(1)">
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);

    const body = getShadowContent(element, '#body') as HTMLAnchorElement | null;
    expect(body?.getAttribute('href')).toBe('#');
  });

  it('control がある場合は whole 指定でも body は div のまま', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole" href="/documents">
        <input slot="control" type="checkbox" />
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    expect(body?.tagName).toBe('DIV');
    expect(element.hasAttribute('data-whole-link')).toBe(false);
    expect(element.hasAttribute('data-whole-control')).toBe(true);
  });

  it('control の checked/disabled 状態をホスト属性へ反映する', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <input slot="control" type="checkbox" checked disabled />
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    expect(element.hasAttribute('data-selected')).toBe(true);
    expect(element.hasAttribute('data-disabled')).toBe(true);
  });

  it('radio グループ変更時に別行の selected 状態も同期される', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultRadio } = await import('../radio/radio-define.js');
    defineDefaultResourceList();
    defineDefaultRadio();

    element = renderWebComponent(`
      <div>
        <dads-resource-list data-interaction="whole">
          <dads-radio slot="control" name="resource-list-radio-group" checked aria-label="A"></dads-radio>
          <span slot="title">A</span>
        </dads-resource-list>
        <dads-resource-list data-interaction="whole">
          <dads-radio slot="control" name="resource-list-radio-group" aria-label="B"></dads-radio>
          <span slot="title">B</span>
        </dads-resource-list>
      </div>
    `);

    const lists = element.querySelectorAll('dads-resource-list');
    const first = lists[0] as HTMLElement | undefined;
    const second = lists[1] as HTMLElement | undefined;
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    if (!first || !second) return;

    await waitForCustomElement(first);
    await waitForCustomElement(second);
    await waitTick();

    expect(first.hasAttribute('data-selected')).toBe(true);
    expect(second.hasAttribute('data-selected')).toBe(false);

    const secondBody = getShadowContent(second, '#body') as HTMLElement | null;
    expect(secondBody).toBeInTheDocument();
    if (!secondBody) return;

    secondBody.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect(first.hasAttribute('data-selected')).toBe(false);
    expect(second.hasAttribute('data-selected')).toBe(true);
  });

  it('slot control の dads-checkbox は size 未指定時に md を補完する', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define.js');
    defineDefaultResourceList();
    defineDefaultCheckbox();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <dads-checkbox slot="control" aria-label="選択"></dads-checkbox>
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const control = element.querySelector('dads-checkbox');
    expect(control?.getAttribute('size')).toBe('md');
  });

  it('slot control の dads-radio は size 未指定時に md を補完する', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultRadio } = await import('../radio/radio-define.js');
    defineDefaultResourceList();
    defineDefaultRadio();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <dads-radio slot="control" name="plan" aria-label="選択"></dads-radio>
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const control = element.querySelector('dads-radio');
    expect(control?.getAttribute('size')).toBe('md');
  });

  it('slot control の size 指定は上書きしない', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define.js');
    defineDefaultResourceList();
    defineDefaultCheckbox();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <dads-checkbox slot="control" size="lg" aria-label="選択"></dads-checkbox>
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const control = element.querySelector('dads-checkbox');
    expect(control?.getAttribute('size')).toBe('lg');
  });

  it('action の disabled 状態をホスト属性へ反映する', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list>
        <span slot="title">タイトル</span>
        <button slot="action" type="button" disabled aria-disabled="true">menu</button>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    expect(element.hasAttribute('data-action-disabled')).toBe(true);
  });

  it('whole + control で body クリック時に control を切り替える', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <input slot="control" type="checkbox" />
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    const control = element.querySelector('input[slot="control"]') as HTMLInputElement | null;
    expect(body).toBeInTheDocument();
    expect(control).toBeInTheDocument();
    if (!body || !control) return;

    body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect(control.checked).toBe(true);
    expect(element.hasAttribute('data-selected')).toBe(true);
  });

  it('inline + control で control 領域クリック時に control を切り替える', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="inline">
        <input slot="control" type="checkbox" />
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const controlPart = getShadowContent(element, '#control') as HTMLElement | null;
    const control = element.querySelector('input[slot="control"]') as HTMLInputElement | null;
    expect(controlPart).toBeInTheDocument();
    expect(control).toBeInTheDocument();
    if (!controlPart || !control) return;

    controlPart.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect(control.checked).toBe(true);
    expect(element.hasAttribute('data-selected')).toBe(true);
  });

  it('inline + dads-checkbox でタイトルクリック時に checked/data-selected が立つ', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define.js');
    defineDefaultResourceList();
    defineDefaultCheckbox();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="inline">
        <dads-checkbox slot="control" aria-label="行を選択"></dads-checkbox>
        <span slot="title">デジ山 ひかり</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const title = element.querySelector('[slot="title"]') as HTMLElement | null;
    const control = element.querySelector('dads-checkbox') as HTMLElement | null;
    expect(title).toBeInTheDocument();
    expect(control).toBeInTheDocument();
    if (!title || !control) return;

    title.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect((control as unknown as { checked?: boolean }).checked).toBe(true);
    expect(element.hasAttribute('data-selected')).toBe(true);
  });

  it('inline + control でタイトル/サポート領域クリック時に control を切り替える', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="inline">
        <input slot="control" type="checkbox" />
        <span slot="title">デジ山 ひかり</span>
        <span slot="support">CEO</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const title = element.querySelector('[slot="title"]') as HTMLElement | null;
    const control = element.querySelector('input[slot="control"]') as HTMLInputElement | null;
    expect(title).toBeInTheDocument();
    expect(control).toBeInTheDocument();
    if (!title || !control) return;

    title.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect(control.checked).toBe(true);
    expect(element.hasAttribute('data-selected')).toBe(true);
  });

  it('inline + control でも body クリック単体では control を切り替えない', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="inline">
        <input slot="control" type="checkbox" />
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    const control = element.querySelector('input[slot="control"]') as HTMLInputElement | null;
    expect(body).toBeInTheDocument();
    expect(control).toBeInTheDocument();
    if (!body || !control) return;

    body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();

    expect(control.checked).toBe(false);
    expect(element.hasAttribute('data-selected')).toBe(false);
  });

  it('control の aria 属性未指定時は title/support を aria-labelledby で関連付ける', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define.js');
    defineDefaultResourceList();
    defineDefaultCheckbox();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <dads-checkbox slot="control"></dads-checkbox>
        <span slot="title" id="resource-list-title">デジ山 ひかり</span>
        <span slot="support" id="resource-list-support">CEO</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const control = element.querySelector('dads-checkbox');
    expect(control?.getAttribute('aria-labelledby')).toBe('resource-list-title resource-list-support');
  });

  it('control 側に aria-label がある場合は自動 aria-labelledby を上書きしない', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define.js');
    defineDefaultResourceList();
    defineDefaultCheckbox();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <dads-checkbox slot="control" aria-label="ユーザーを選択"></dads-checkbox>
        <span slot="title" id="resource-list-title">デジ山 ひかり</span>
        <span slot="support" id="resource-list-support">CEO</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const control = element.querySelector('dads-checkbox');
    expect(control?.getAttribute('aria-label')).toBe('ユーザーを選択');
    expect(control?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('whole 指定でも href/titleリンクがない場合は non-interactive のまま', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <span slot="title">タイトル</span>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    expect(body?.tagName).toBe('DIV');
    expect(element.hasAttribute('data-whole-link')).toBe(false);
    expect(element.hasAttribute('data-interactive-whole')).toBe(false);
  });

  it('whole + titleリンク（href未指定）で body クリックを titleリンクへ委譲する', async () => {
    const { defineDefaultResourceList } = await import('./resource-list-define.js');
    defineDefaultResourceList();

    element = renderWebComponent(`
      <dads-resource-list data-interaction="whole">
        <a slot="title" href="/documents" id="title-link">タイトル</a>
      </dads-resource-list>
    `);
    await waitForCustomElement(element);
    await waitTick();

    const body = getShadowContent(element, '#body') as HTMLElement | null;
    const titleLink = element.querySelector('#title-link') as HTMLAnchorElement | null;
    expect(body?.tagName).toBe('DIV');
    expect(titleLink).toBeInTheDocument();
    expect(element.hasAttribute('data-whole-link')).toBe(true);
    expect(element.hasAttribute('data-whole-control')).toBe(false);
    if (!body || !titleLink) return;

    let clicked = 0;
    titleLink.addEventListener('click', (event) => {
      event.preventDefault();
      clicked += 1;
    });

    body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await waitTick();
    expect(clicked).toBe(1);

    titleLink.focus();
    await waitTick();
    expect(element.hasAttribute('data-primary-focus')).toBe(true);
  });
});

describe('DadsResourceList - styles', () => {
  it('公開 CSS 変数と主要セレクタを保持する', async () => {
    const { DadsResourceList } = await import('./resource-list.js');
    const styles = getDefinitionStyles(DadsResourceList.definition);
    const styleText = styles.map(toCssText).join('\n');

    expect(styleText).toContain('--dads-resource-list-background');
    expect(styleText).toContain('--dads-resource-list-border-color');
    expect(styleText).toContain('--dads-resource-list-whole-focus-outline-width');
    expect(styleText).toContain('--dads-resource-list-control-hit-area');
    expect(styleText).toContain('--_dads-resource-list-body-background');
    expect(styleText).toContain('--_dads-resource-list-action-background');
    expect(styleText).toContain('--_dads-resource-list-whole-outline-width');
    expect(styleText).toContain('--_dads-resource-list-action-end-radius');
    expect(styleText).toContain(':host([data-style=\'frame\']) [part=\'base\']');
    expect(styleText).toContain(':host([data-selected])');
    expect(styleText).not.toContain(':host([data-has-control]:has(input[slot=\'control\']:checked))');
    expect(styleText).not.toContain(':host([data-has-control]:has([slot=\'control\'] input:checked))');
    expect(styleText).toContain(':host([data-interactive-whole]:not([data-primary-focus]):not([data-disabled])) [part=\'body\']:hover:not(:focus-visible)');
    expect(styleText).toContain(':host([data-has-action]) [part=\'action\']');
    expect(styleText).toContain(':host([data-disabled])');
    expect(styleText).toContain(':host([data-whole-link]) [part=\'title\']');
    expect(styleText).toContain(':host([data-whole-link][data-primary-focus]) [part=\'body\']');
    expect(styleText).toContain(':host([data-interactive-whole]) [part=\'body\']:focus-visible');
    expect(styleText).toContain(':host([data-has-control][data-interaction=\'inline\']:not([data-disabled])) [part=\'control\']');
    expect(styleText).toContain("[part='control'] slot");
    expect(styleText).toContain("[part='title'] slot::slotted(a:focus-visible)");
    expect(styleText).toContain(":host(:not([data-action-disabled])) [part='action']:hover");
    expect(styleText).toContain("[part='action'] slot::slotted(button:focus-visible)");
    expect(styleText).toContain("border-start-end-radius: var(--_dads-resource-list-action-end-radius);");
    expect(styleText).toContain("border-end-end-radius: var(--_dads-resource-list-action-end-radius);");
    expect(styleText).not.toContain("border-inline-start: 1px solid var(--_dads-resource-list-border-color);");
    expect(styleText).toContain("background: var(--_dads-resource-list-body-background);");
    expect(styleText).toContain("background: var(--_dads-resource-list-action-background);");
    expect(styleText).not.toContain("background: var(--_dads-resource-list-background);");
    expect(styleText).not.toContain("[part='body']:hover:not(:focus-visible) + [part='action']");
    expect(styleText).not.toContain("[part='body']::before");
    expect(styleText).not.toContain("[part='body']::after");
    expect(styleText).not.toContain("box-shadow: inset 0 0 0 var(--dads-resource-list-hover-outline-width)");
    expect(styleText).not.toContain("inline-size: fit-content;");
  });
});
