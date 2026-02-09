/**
 * DadsLanguageSelector テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

function waitForMicrotask(): Promise<void> {
  return new Promise<void>((resolve) => queueMicrotask(() => resolve()));
}

type SelectedLanguage = {
  value: string;
  label: string;
  selectedIndex: number;
  selectedItem: HTMLElement;
};

type LanguageSelectorHost = HTMLElement & {
  getSelectedLanguage: () => SelectedLanguage | null;
};

async function waitForItems(host: HTMLElement): Promise<HTMLElement[]> {
  const children = Array.from(host.children);
  for (const child of children) {
    if (!(child instanceof HTMLElement)) continue;
    if (!child.localName.endsWith('-menu-list-item')) continue;
    await waitForCustomElement(child);
  }
  await waitForMicrotask();

  const items: HTMLElement[] = [];
  const nextChildren = Array.from(host.children);
  for (const child of nextChildren) {
    if (!(child instanceof HTMLElement)) continue;
    if (!child.localName.endsWith('-menu-list-item')) continue;
    items.push(child);
  }
  return items;
}

describe('DadsLanguageSelector - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('opener=text が既定値で label=Language と地球アイコンを補完する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    expect(element.getAttribute('opener')).toBe('text');
    expect(element.getAttribute('label')).toBe('Language');

    const autoIcon = element.querySelector(
      '[slot="icon"][data-language-selector-auto-opener-icon]',
    ) as SVGElement | null;
    expect(autoIcon).toBeInTheDocument();
    expect(autoIcon?.getAttribute('viewBox')).toBe('10 3 24 24');
  });

  it('opener=icon では label=LANG を補完する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector opener="icon">
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    expect(element.getAttribute('label')).toBe('LANG');
  });

  it('不正な opener 値は text に正規化される', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector opener="invalid">
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    expect(element.getAttribute('opener')).toBe('text');
    expect(element.getAttribute('label')).toBe('Language');
  });

  it('label スロットの明示内容がある場合は明示 label 属性を上書きしない', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector label="カスタムラベル">
        <span slot="label">言語切り替え</span>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    expect(element.getAttribute('label')).toBe('カスタムラベル');
  });

  it('icon スロットの明示内容がある場合は自動地球アイコンを追加しない', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <svg slot="icon" data-custom-icon width="24" height="24" viewBox="0 0 24 24"></svg>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    const autoIcon = element.querySelector('[slot="icon"][data-language-selector-auto-opener-icon]');
    const customIcon = element.querySelector('[slot="icon"][data-custom-icon]');
    expect(autoIcon).not.toBeInTheDocument();
    expect(customIcon).toBeInTheDocument();
  });

  it('current / aria-current は単一選択に正規化される（先頭優先）', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>日本語</dads-menu-list-item>
        <dads-menu-list-item value="en" aria-current="true">English</dads-menu-list-item>
        <dads-menu-list-item value="ko" current>한국어</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    expect(items[0].hasAttribute('current')).toBe(true);
    expect(items[0].getAttribute('aria-current')).toBe('true');

    expect(items[1].hasAttribute('current')).toBe(false);
    expect(items[1].hasAttribute('aria-current')).toBe(false);

    expect(items[2].hasAttribute('current')).toBe(false);
    expect(items[2].hasAttribute('aria-current')).toBe(false);
  });

  it('キーボード操作で開閉し、aria-expanded とフォーカスが同期する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
        <dads-menu-list-item value="ko">한국어</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    const menu = getShadowContent(element, '#menu') as HTMLElement | null;
    if (!opener || !menu) throw new Error('shadow parts not found');

    expect(opener.getAttribute('aria-haspopup')).toBe('menu');
    expect(opener.getAttribute('aria-expanded')).toBe('false');

    opener.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitForMicrotask();

    expect(opener.getAttribute('aria-expanded')).toBe('true');
    const firstBase = getShadowContent(items[0], '#base') as HTMLElement | null;
    if (!firstBase) throw new Error('first menu item base not found');
    expect(document.activeElement).toBe(firstBase);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await waitForMicrotask();

    const lastBase = getShadowContent(items[2], '#base') as HTMLElement | null;
    if (!lastBase) throw new Error('last menu item base not found');
    expect(document.activeElement).toBe(lastBase);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForMicrotask();

    expect(opener.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(opener);
  });

  it('getSelectedLanguage は current 初期状態を返す', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
        <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const host = element as LanguageSelectorHost;
    const selected = host.getSelectedLanguage();
    expect(selected).not.toBeNull();
    expect(selected?.value).toBe('en');
    expect(selected?.label).toBe('English');
    expect(selected?.selectedIndex).toBe(1);
    expect(selected?.selectedItem).toBe(items[1]);
  });

  it('外部から current を更新した場合も選択状態と getSelectedLanguage が追従する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const host = element as LanguageSelectorHost;
    expect(host.getSelectedLanguage()?.value).toBe('ja');

    items[0].removeAttribute('current');
    items[1].setAttribute('current', '');
    await waitForMicrotask();
    await waitForMicrotask();

    expect(items[0].hasAttribute('current')).toBe(false);
    expect(items[0].hasAttribute('aria-current')).toBe(false);
    expect(items[1].hasAttribute('current')).toBe(true);
    expect(items[1].getAttribute('aria-current')).toBe('true');
    expect(host.getSelectedLanguage()?.value).toBe('en');
    expect(host.getSelectedLanguage()?.selectedIndex).toBe(1);
  });

  it('getSelectedLanguage は value 未指定時にテキスト fallback を返す', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item current>Español</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    const host = element as LanguageSelectorHost;
    const selected = host.getSelectedLanguage();
    expect(selected).not.toBeNull();
    expect(selected?.value).toBe('Español');
    expect(selected?.label).toBe('Español');
  });

  it('getSelectedLanguage は選択状態が無い場合 null を返す', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    const host = element as LanguageSelectorHost;
    expect(host.getSelectedLanguage()).toBeNull();
  });

  it('選択時に dads-change を発火し、current を同期する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>日本語</dads-menu-list-item>
        <dads-menu-list-item data-value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const events: Array<CustomEvent> = [];
    element.addEventListener('dads-change', (event) => events.push(event as CustomEvent));

    const opener = getShadowContent(element, '#opener') as HTMLButtonElement | null;
    if (!opener) throw new Error('opener not found');
    opener.click();
    await waitForMicrotask();

    const secondBase = getShadowContent(items[1], '#base') as HTMLElement | null;
    if (!secondBase) throw new Error('menu item base not found');
    secondBase.click();
    await waitForMicrotask();

    expect(events.length).toBe(1);
    const detail = events[0].detail as {
      value: string;
      selectedValue: string;
      selectedIndex: number;
      selectedItem: HTMLElement;
    };
    expect(detail.value).toBe('en');
    expect(detail.selectedValue).toBe('en');
    expect(detail.selectedIndex).toBe(1);
    expect(detail.selectedItem).toBe(items[1]);

    expect(items[0].hasAttribute('current')).toBe(false);
    expect(items[1].hasAttribute('current')).toBe(true);
    expect(items[1].getAttribute('aria-current')).toBe('true');

    const host = element as LanguageSelectorHost;
    const selected = host.getSelectedLanguage();
    expect(selected).not.toBeNull();
    expect(selected?.value).toBe(detail.selectedValue);
    expect(selected?.selectedIndex).toBe(detail.selectedIndex);
    expect(selected?.selectedItem).toBe(detail.selectedItem);
  });

  it('menuitemselect の selectedIndex 未指定時は対象項目の index を補完する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const events: Array<CustomEvent> = [];
    element.addEventListener('dads-change', (event) => events.push(event as CustomEvent));

    element.dispatchEvent(
      new CustomEvent('menuitemselect', {
        bubbles: true,
        composed: true,
        detail: {
          selectedItem: items[1],
          selectedValue: 'en',
        },
      }),
    );
    await waitForMicrotask();

    expect(events.length).toBe(1);
    const detail = events[0].detail as { selectedIndex: number; selectedValue: string };
    expect(detail.selectedIndex).toBe(1);
    expect(detail.selectedValue).toBe('en');
  });

  it('チェックアイコンは current 項目のみに自動付与される', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const firstChecks = items[0].querySelectorAll('[slot="start-icon"][data-language-selector-auto-check-icon]');
    const secondChecks = items[1].querySelectorAll('[slot="start-icon"][data-language-selector-auto-check-icon]');
    expect(firstChecks.length).toBe(1);
    expect(secondChecks.length).toBe(0);
  });

  it('current 項目に明示 start-icon がある場合は自動チェックアイコンを付与しない', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector>
        <dads-menu-list-item value="ja" current>
          <svg slot="start-icon" data-custom-start width="24" height="24" viewBox="0 0 24 24"></svg>
          日本語
        </dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    const customStart = items[0].querySelector('[slot="start-icon"][data-custom-start]');
    const autoChecks = items[0].querySelectorAll('[slot="start-icon"][data-language-selector-auto-check-icon]');
    expect(customStart).toBeInTheDocument();
    expect(autoChecks.length).toBe(0);
  });

  it('size=sm では未指定 item の size を small に補完する', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector size="sm">
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
        <dads-menu-list-item value="en">English</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    expect(items[0].getAttribute('size')).toBe('small');
    expect(items[1].getAttribute('size')).toBe('small');
  });

  it('opener=icon は size に応じて opener の min-height が切り替わる', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector
        opener="icon"
        size="sm"
        style="
          --menu-list-box-opener-min-height-sm: 36px;
          --menu-list-box-opener-min-height-md: 44px;
        "
      >
        <dads-menu-list-item value="ja">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    await waitForItems(element);

    const opener = getShadowContent(element, '#opener') as HTMLElement | null;
    if (!opener) throw new Error('opener not found');

    const smMinHeight = getComputedStyle(opener).minHeight;
    expect(smMinHeight).toContain('36px');

    element.setAttribute('size', 'md');
    await waitForMicrotask();

    const mdMinHeight = getComputedStyle(opener).minHeight;
    expect(mdMinHeight).toContain('44px');
    expect(mdMinHeight).not.toBe(smMinHeight);
  });

  it('item の明示 size（small）は不必要に上書きしない', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector size="md">
        <dads-menu-list-item value="ja" size="small">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    expect(items[0].getAttribute('size')).toBe('small');
  });

  it('item の明示属性（variant/end-icon）を不必要に上書きしない', async () => {
    const { defineDefaultLanguageSelector } = await import('./language-selector-define.js');
    defineDefaultLanguageSelector();

    element = renderWebComponent(`
      <dads-language-selector size="sm">
        <dads-menu-list-item value="ja" variant="standard" end-icon="caret">日本語</dads-menu-list-item>
      </dads-language-selector>
    `);
    await waitForCustomElement(element);
    const items = await waitForItems(element);

    expect(items[0].getAttribute('variant')).toBe('standard');
    expect(items[0].getAttribute('end-icon')).toBe('caret');
  });

  it('defineLanguageSelector(prefix) で prefix 付きタグが定義される', async () => {
    const { defineLanguageSelector } = await import('./language-selector-define.js');
    defineLanguageSelector('my-ui');

    element = createTestElement('my-ui-language-selector');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });
});

describe('DadsLanguageSelector - styles', () => {
  it('opener=icon はアイコン+ラベルの縦積みレイアウトを定義する', async () => {
    const { languageSelectorStyles } = await import('./language-selector-styles.js');

    const cssText = Array.from(languageSelectorStyles.cssRules ?? [])
      .map((rule) => rule.cssText)
      .join('\n');

    expect(cssText).toContain(':host([opener="icon"]) [part="opener"]');
    expect(cssText).toContain('display: grid');
    expect(cssText).toContain('grid-template-columns: auto auto');
    expect(cssText).toContain('grid-template-rows: auto auto');
    expect(cssText).toContain(':host([opener="icon"]) [part="opener-label"]');
    expect(cssText).toContain('font-size: calc(11 / 16 * 1rem)');
  });

  it('opener=icon の opener-icon に中央揃えルールが定義される', async () => {
    const { languageSelectorStyles } = await import('./language-selector-styles.js');

    const cssText = Array.from(languageSelectorStyles.cssRules ?? [])
      .map((rule) => rule.cssText)
      .join('\n');

    expect(cssText).toContain(':host([opener="icon"]) [part="opener-icon"]');
    expect(cssText).toContain('align-items: center');
    expect(cssText).toContain('justify-content: center');
    expect(cssText).toContain('line-height: 0');
  });

  it('opener=icon の slotted svg 正規化ルールが定義される', async () => {
    const { languageSelectorStyles } = await import('./language-selector-styles.js');

    const cssText = Array.from(languageSelectorStyles.cssRules ?? [])
      .map((rule) => rule.cssText)
      .join('\n');

    expect(cssText).toMatch(
      /:host\(\[opener="icon"\]\)\s+\[part="opener-icon"\]\s*::slotted\(svg\)/,
    );
    expect(cssText).toContain('display: block');
    expect(cssText).toContain('width: 100%');
    expect(cssText).toContain('height: 100%');
  });
});
