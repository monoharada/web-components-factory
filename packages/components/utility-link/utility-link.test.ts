/**
 * DadsUtilityLink コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
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

describe('DadsUtilityLink - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineUtilityLink } = await import('./utility-link-define');

    defineUtilityLink();
    defineUtilityLink();

    expect(customElements.get('dads-utility-link')).toBeTruthy();
  });

  it('Shadow DOM と part 構造が生成される', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = createTestElement('dads-utility-link');
    element.textContent = 'リンクテキスト';
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
    expect(getShadowContent(element, '#base')).toBeInstanceOf(HTMLAnchorElement);
    expect(getShadowContent(element, '#lead-icon-slot')).toBeInstanceOf(HTMLSlotElement);
    expect(getShadowContent(element, '#label')).toBeTruthy();
    expect(getShadowContent(element, '#tail-icon')).toBeTruthy();
    expect(getShadowContent(element, '#tail-icon-slot')).toBeInstanceOf(HTMLSlotElement);
  });

  it('href の安全性チェックで不正URLは # にフォールバックする', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent(
      '<dads-utility-link href="javascript:alert(1)">Unsafe</dads-utility-link>',
    );
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base') as HTMLAnchorElement | null;
    expect(base?.getAttribute('href')).toBe('#');
  });

  it('有効な URL はそのまま反映される', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    const validUrls = [
      'https://example.com',
      'http://example.com',
      '/path/to/page',
      'docs/page',
      'page.html',
      '?q=1',
      '?q=1#section',
      './relative',
      '../parent',
      '#anchor',
      'mailto:hello@example.com',
      'tel:+81-90-0000-0000',
    ];

    for (const url of validUrls) {
      const testEl = renderWebComponent(`<dads-utility-link href="${url}">Link</dads-utility-link>`);
      await waitForCustomElement(testEl);

      const base = getShadowContent(testEl, '#base') as HTMLAnchorElement | null;
      expect(base?.getAttribute('href')).toBe(url);

      cleanupTestElement(testEl);
    }
  });

  it('不正スキームの URL は # にフォールバックする', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    const invalidUrls = ['javascript:alert(1)', 'data:text/html;base64,PHNjcmlwdA==', 'ftp://example.com'];

    for (const url of invalidUrls) {
      const testEl = renderWebComponent(`<dads-utility-link href="${url}">Link</dads-utility-link>`);
      await waitForCustomElement(testEl);

      const base = getShadowContent(testEl, '#base') as HTMLAnchorElement | null;
      expect(base?.getAttribute('href')).toBe('#');

      cleanupTestElement(testEl);
    }
  });

  it('tail icon は target="_blank" または download で表示され、download を優先する', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#">Link</dads-utility-link>');
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    const tailIconSvg = getShadowContent(element, '#tail-icon-svg') as SVGElement | null;
    const base = getShadowContent(element, '#base') as HTMLAnchorElement | null;
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-tail-icon-kind')).toBe(false);

    element.setAttribute('target', '_blank');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('new-window');
    expect(tailIconSvg?.getAttribute('aria-label')).toBe('新規タブで開きます');

    element.setAttribute('target', '_self');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-tail-icon-kind')).toBe(false);

    element.setAttribute('download', '');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('download');
    expect(tailIconSvg?.getAttribute('aria-label')).toBe('ダウンロードします');
    expect(base?.hasAttribute('target')).toBe(false);

    element.setAttribute('target', '_blank');
    await waitTick();
    expect(element.getAttribute('data-tail-icon-kind')).toBe('download');

    element.removeAttribute('download');
    await waitTick();
    expect(element.getAttribute('data-tail-icon-kind')).toBe('new-window');
    expect(base?.getAttribute('target')).toBe('_blank');

    element.removeAttribute('target');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-tail-icon-kind')).toBe(false);
  });

  it('lead-icon slot に実コンテンツがある時だけ表示される', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#">Link</dads-utility-link>');
    await waitForCustomElement(element);

    expect(element.hasAttribute('data-has-lead-icon')).toBe(false);

    const icon = document.createElement('span');
    icon.setAttribute('slot', 'lead-icon');
    icon.textContent = '★';
    element.appendChild(icon);
    await waitTick();

    expect(element.hasAttribute('data-has-lead-icon')).toBe(true);

    icon.setAttribute('hidden', '');
    await waitTick();
    expect(element.hasAttribute('data-has-lead-icon')).toBe(false);

    icon.removeAttribute('hidden');
    await waitTick();
    expect(element.hasAttribute('data-has-lead-icon')).toBe(true);

    icon.remove();
    await waitTick();

    expect(element.hasAttribute('data-has-lead-icon')).toBe(false);
  });

  it('tail-icon slot に実コンテンツがある時だけ表示される', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#">Link</dads-utility-link>');
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);

    const icon = document.createElement('span');
    icon.setAttribute('slot', 'tail-icon');
    icon.textContent = '↗';
    element.appendChild(icon);
    await waitTick();

    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(element.hasAttribute('data-show-tail-icon')).toBe(true);
    expect(element.hasAttribute('data-tail-icon-kind')).toBe(false);

    icon.setAttribute('hidden', '');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-show-tail-icon')).toBe(false);

    icon.removeAttribute('hidden');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);

    icon.remove();
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-show-tail-icon')).toBe(false);
  });

  it('lead-icon / tail-icon を同時利用できる', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#">Link</dads-utility-link>');
    await waitForCustomElement(element);

    const leadIcon = document.createElement('span');
    leadIcon.setAttribute('slot', 'lead-icon');
    leadIcon.textContent = '★';
    element.appendChild(leadIcon);

    const tailIconNode = document.createElement('span');
    tailIconNode.setAttribute('slot', 'tail-icon');
    tailIconNode.textContent = '↗';
    element.appendChild(tailIconNode);
    await waitTick();

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    expect(element.hasAttribute('data-has-lead-icon')).toBe(true);
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
  });

  it('tail-icon slot 指定時は表示を優先しつつ data-tail-icon-kind は後方互換で維持する', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#" target="_blank">Link</dads-utility-link>');
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    const tailSlot = getShadowContent(element, '#tail-icon-slot') as HTMLSlotElement | null;
    const tailIconSvg = getShadowContent(element, '#tail-icon-svg') as SVGElement | null;

    const customTail = document.createElement('span');
    customTail.setAttribute('slot', 'tail-icon');
    customTail.textContent = '→';
    element.appendChild(customTail);
    await waitTick();

    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(tailSlot?.hasAttribute('hidden')).toBe(false);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('new-window');
    expect(tailSlot?.assignedNodes({ flatten: true }).includes(customTail)).toBe(true);
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(true);

    element.setAttribute('download', '');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('download');
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(true);
  });

  it('tail-icon が hidden でも target="_blank" なら自動末尾アイコンを表示する', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent('<dads-utility-link href="#" target="_blank">Link</dads-utility-link>');
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    const tailSlot = getShadowContent(element, '#tail-icon-slot') as HTMLSlotElement | null;
    const tailIconSvg = getShadowContent(element, '#tail-icon-svg') as SVGElement | null;
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(tailSlot?.hasAttribute('hidden')).toBe(true);
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(false);
    expect(tailIconSvg?.getAttribute('aria-label')).toBe('新規タブで開きます');

    const customTail = document.createElement('span');
    customTail.setAttribute('slot', 'tail-icon');
    customTail.textContent = '→';
    element.appendChild(customTail);
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(tailSlot?.hasAttribute('hidden')).toBe(false);
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(true);

    customTail.setAttribute('hidden', '');
    await waitTick();
    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(tailSlot?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-show-tail-icon')).toBe(true);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('new-window');
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(false);
    expect(tailIconSvg?.getAttribute('aria-label')).toBe('新規タブで開きます');
  });

  it('tail-icon の slot fallback は slotted として扱わない', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = createTestElement('dads-utility-link');
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    const tailSlot = getShadowContent(element, '#tail-icon-slot') as HTMLSlotElement | null;
    expect(tailSlot).toBeTruthy();
    if (!tailSlot) return;

    const fallbackNodes = Array.from(tailSlot.childNodes);
    (tailSlot as unknown as { assignedNodes: () => Node[] }).assignedNodes = () => fallbackNodes;

    tailSlot.dispatchEvent(new Event('slotchange'));
    await waitTick();

    expect(tailIcon?.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('data-show-tail-icon')).toBe(false);
  });

  it('ネストされた slot="tail-icon" 要素は custom tail-icon として扱わない', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent(
      '<dads-utility-link href="#" target="_blank"><span><svg slot="tail-icon" aria-hidden="true"></svg></span>Link</dads-utility-link>',
    );
    await waitForCustomElement(element);

    const tailIcon = getShadowContent(element, '#tail-icon') as HTMLElement | null;
    const tailSlot = getShadowContent(element, '#tail-icon-slot') as HTMLSlotElement | null;
    const tailIconSvg = getShadowContent(element, '#tail-icon-svg') as SVGElement | null;

    expect(tailIcon?.hasAttribute('hidden')).toBe(false);
    expect(tailSlot?.hasAttribute('hidden')).toBe(true);
    expect(tailIconSvg?.hasAttribute('hidden')).toBe(false);
    expect(element.getAttribute('data-tail-icon-kind')).toBe('new-window');
    expect(element.hasAttribute('data-show-tail-icon')).toBe(true);
  });

  it('target/rel/download 属性がリンクへ同期される', async () => {
    const { defineDefaultUtilityLink } = await import('./utility-link-define');
    defineDefaultUtilityLink();

    element = renderWebComponent(
      '<dads-utility-link href="/download" target="_blank" rel="noopener" download>Download</dads-utility-link>',
    );
    await waitForCustomElement(element);

    const base = getShadowContent(element, '#base') as HTMLAnchorElement | null;
    expect(base?.hasAttribute('target')).toBe(false);
    expect(base?.getAttribute('rel')).toBe('noopener');
    expect(base?.hasAttribute('download')).toBe(true);

    element.removeAttribute('target');
    element.removeAttribute('rel');
    element.removeAttribute('download');
    await waitTick();

    expect(base?.hasAttribute('target')).toBe(false);
    expect(base?.hasAttribute('rel')).toBe(false);
    expect(base?.hasAttribute('download')).toBe(false);
  });

  it('定義 styles に focus 用トークンが含まれる', async () => {
    const { DadsUtilityLink } = await import('./utility-link');

    const cssText = getDefinitionStyles(DadsUtilityLink.definition)
      .map((style) => toCssText(style))
      .join('\n');

    expect(cssText).toContain('--dads-utility-link-focus-outline-color');
    expect(cssText).toContain('--dads-utility-link-focus-ring-color');
    expect(cssText).toContain('--dads-utility-link-focus-background');
  });
});
