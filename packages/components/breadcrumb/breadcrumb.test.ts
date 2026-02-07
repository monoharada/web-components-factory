/**
 * Breadcrumb コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

async function nextFrame(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function getAdoptedStyleSheetText(component: Element): string {
  const sheets = (component as HTMLElement).shadowRoot?.adoptedStyleSheets ?? [];
  return sheets
    .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
    .join('\n');
}

describe('DadsBreadcrumb', () => {
  afterEach(() => cleanup());

  it('コンポーネントが定義される', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#">ホーム</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');

    expect(component).toBeInTheDocument();
    expect(component.shadowRoot).toBeTruthy();
  });

  it('defineBreadcrumb(prefix) のタグでも item 同期が機能する', async () => {
    const { defineBreadcrumb } = await import('./breadcrumb-define');
    defineBreadcrumb('my-ui');

    const component = renderWebComponent(`
      <my-ui-breadcrumb separator="slash">
        <my-ui-breadcrumb-item href="#home">ホーム</my-ui-breadcrumb-item>
        <my-ui-breadcrumb-item href="#section">セクション</my-ui-breadcrumb-item>
        <my-ui-breadcrumb-item>現在ページ</my-ui-breadcrumb-item>
      </my-ui-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('my-ui-breadcrumb');
    await waitForComponent('my-ui-breadcrumb-item');
    await nextFrame();

    const items = component.querySelectorAll('my-ui-breadcrumb-item');
    expect(items.length).toBe(3);
    expect(items[0].getAttribute('data-separator-style')).toBe('slash');
    expect(items[0].getAttribute('aria-setsize')).toBe('3');
    expect(items[2].hasAttribute('current')).toBe(true);
    expect(items[2].getAttribute('aria-current')).toBe('page');
  });

  it('listはp要素で role="list" を持つ', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#">ホーム</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');

    const list = getShadowElement(component, '#list');
    expect(list?.tagName.toLowerCase()).toBe('p');
    expect(list?.getAttribute('role')).toBe('list');
  });

  it('listはflexレイアウトでギャップトークンを使用する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    const sheetText = getAdoptedStyleSheetText(component);

    expect(sheetText).toContain("[part='list'] {");
    expect(sheetText).toContain('display: flex;');
    expect(sheetText).toContain('column-gap: var(--dads-breadcrumb-list-unit-gap);');
  });

  it('separator属性を各itemへ同期する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb separator="pipe">
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const items = component.querySelectorAll('dads-breadcrumb-item');
    expect(items[0].getAttribute('data-separator-style')).toBe('pipe');
    expect(items[1].getAttribute('data-separator-style')).toBe('pipe');
  });

  it('明示currentがなければ末尾を現在ページにする', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item href="#section">セクション</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const items = component.querySelectorAll('dads-breadcrumb-item');
    expect(items[0].hasAttribute('current')).toBe(false);
    expect(items[1].hasAttribute('current')).toBe(false);
    expect(items[2].hasAttribute('current')).toBe(true);
    expect(items[2].getAttribute('aria-current')).toBe('page');
  });

  it('明示currentがあればそれを優先する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item current>セクション</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const items = component.querySelectorAll('dads-breadcrumb-item');
    expect(items[1].hasAttribute('current')).toBe(true);
    expect(items[2].hasAttribute('current')).toBe(false);
  });

  it('複数current明示時は先頭のみ現在ページに正規化する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item current>ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item current>セクション</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const items = component.querySelectorAll('dads-breadcrumb-item');
    expect(items[0].hasAttribute('current')).toBe(true);
    expect(items[1].hasAttribute('current')).toBe(false);
    expect(items[1].hasAttribute('aria-current')).toBe(false);
  });

  it('ラベルはデフォルトでaria-labelledbyに紐づく', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#">ホーム</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    await nextFrame();

    const nav = getShadowElement(component, '#nav');
    const label = getShadowElement(component, '[part="label"]');
    expect(label).toBeTruthy();
    expect((label as HTMLElement).id.length).toBeGreaterThan(0);
    expect(nav?.getAttribute('aria-labelledby')).toBe(label?.id);
  });

  it('structured-data="off" では構造化データミラーを生成しない', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb>
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    await nextFrame();

    expect(component.querySelector('[data-breadcrumb-structured-data]')).toBeNull();
  });

  it('structured-data="microdata" でLight DOMにMicrodataを生成する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb structured-data="microdata" base-url="https://example.com/base/">
        <dads-breadcrumb-item href="/">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item href="section">セクション</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const mirror = component.querySelector('[data-breadcrumb-structured-data]');
    expect(mirror).toBeTruthy();

    const root = mirror?.querySelector('[itemtype="https://schema.org/BreadcrumbList"]');
    expect(root).toBeTruthy();

    const links = mirror?.querySelectorAll('[itemprop="item"]');
    expect(links?.length).toBe(2);
    expect((links?.[0] as HTMLAnchorElement).href).toBe('https://example.com/');
    expect((links?.[1] as HTMLAnchorElement).href).toBe('https://example.com/base/section');
  });

  it('base-urlが不正な場合は相対hrefをitemに含めない', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb structured-data="microdata" base-url=":::invalid:::">
        <dads-breadcrumb-item href="relative">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `);

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const mirror = component.querySelector('[data-breadcrumb-structured-data]');
    const links = mirror?.querySelectorAll('[itemprop="item"]');
    expect(links?.length).toBe(0);
  });

  it('structured-dataをoffに戻すとミラーを削除する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb structured-data="microdata">
        <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    expect(component.querySelector('[data-breadcrumb-structured-data]')).toBeTruthy();

    component.setAttribute('structured-data', 'off');
    await nextFrame();

    expect(component.querySelector('[data-breadcrumb-structured-data]')).toBeNull();
  });

  it('microdata有効時に子要素テキスト/属性変更を再同期しミラーを重複生成しない', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const component = renderWebComponent(`
      <dads-breadcrumb structured-data="microdata" base-url="https://example.com/base/">
        <dads-breadcrumb-item href="/">ホーム</dads-breadcrumb-item>
        <dads-breadcrumb-item href="current">現在ページ</dads-breadcrumb-item>
      </dads-breadcrumb>
    `) as HTMLElement;

    await waitForComponent('dads-breadcrumb');
    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const firstItem = component.querySelector('dads-breadcrumb-item');
    const initialMirror = component.querySelector('[data-breadcrumb-structured-data]');
    expect(firstItem).toBeTruthy();
    expect(initialMirror).toBeTruthy();

    firstItem!.textContent = 'トップ';
    firstItem!.setAttribute('href', '/top');
    await nextFrame();
    await nextFrame();

    const mirrors = component.querySelectorAll('[data-breadcrumb-structured-data]');
    expect(mirrors.length).toBe(1);
    expect(mirrors[0]).toBe(initialMirror);

    const names = Array.from(mirrors[0].querySelectorAll('[itemprop="name"]'))
      .map(el => el.textContent?.trim())
      .filter(Boolean);
    expect(names).toContain('トップ');

    const links = mirrors[0].querySelectorAll('[itemprop="item"]');
    expect(links.length).toBe(2);
    expect((links[0] as HTMLAnchorElement).href).toBe('https://example.com/top');
  });
});

describe('DadsBreadcrumbItem', () => {
  afterEach(() => cleanup());

  it('itemはrole="listitem"を持つ', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    expect(item.getAttribute('role')).toBe('listitem');
  });

  it('シェブロンのpathがFigma準拠である', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    const path = getShadowElement<SVGPathElement>(item, "[part='separator-icon'] path");
    expect(path?.getAttribute('d')).toBe('M4.5 10.5L4 10L8 6L4 2L4.5 1.5L9.05 6L4.5 10.5Z');
  });

  it('ホームアイコンのpathがFigma準拠である', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item home href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    const path = getShadowElement<SVGPathElement>(item, '#home-icon path');
    expect(path?.getAttribute('d')).toBe(
      'M3 13.666V6.166L7.99998 2.4032L12.99997 6.166V13.666H9.26922V9.20443H6.73075V13.666H3Z'
    );
  });

  it('セパレータは疑似スペースを使わずギャップトークンで制御する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');
    const sheetText = getAdoptedStyleSheetText(item);

    expect(sheetText).toContain("[part='separator'] {");
    expect(sheetText).toContain('margin-inline-start: var(--dads-breadcrumb-separator-gap-start);');
    expect(sheetText).not.toContain("[part='separator']::before");
    expect(sheetText).not.toContain("[part='separator']::after");
  });

  it('デフォルトはシェブロン区切りを表示する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    const icon = getShadowElement(item, '#separator-icon');
    const text = getShadowElement(item, '#separator-text');
    expect(icon?.hasAttribute('hidden')).toBe(false);
    expect(text?.hasAttribute('hidden')).toBe(true);
  });

  it('data-separator-style="slash" でスラッシュ区切りを表示する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home" data-separator-style="slash">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const icon = getShadowElement(item, '#separator-icon');
    const text = getShadowElement(item, '#separator-text');
    expect(icon?.hasAttribute('hidden')).toBe(true);
    expect(text?.hasAttribute('hidden')).toBe(false);
    expect(text?.textContent).toBe('/');
  });

  it('data-separator-style="pipe" でパイプ区切りを表示する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home" data-separator-style="pipe">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const icon = getShadowElement(item, '#separator-icon');
    const text = getShadowElement(item, '#separator-text');
    expect(icon?.hasAttribute('hidden')).toBe(true);
    expect(text?.hasAttribute('hidden')).toBe(false);
    expect(text?.textContent).toBe('|');
  });

  it('href指定かつ非currentならリンク表示', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    const link = getShadowElement<HTMLAnchorElement>(item, '#link');
    const current = getShadowElement(item, '#current');

    expect(link?.hasAttribute('hidden')).toBe(false);
    expect(link?.getAttribute('href')).toBe('#home');
    expect(current?.hasAttribute('hidden')).toBe(true);
  });

  it('current時はリンク非表示、テキスト表示、セパレータ非表示', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item href="#home" current>ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');
    await nextFrame();

    const link = getShadowElement(item, '#link');
    const current = getShadowElement(item, '#current');
    const separator = getShadowElement(item, '#separator');

    expect(link?.hasAttribute('hidden')).toBe(true);
    expect(current?.hasAttribute('hidden')).toBe(false);
    expect(current?.textContent?.trim()).toBe('ホーム');
    expect(separator?.hasAttribute('hidden')).toBe(true);
  });

  it('home属性でホームアイコンを表示する', async () => {
    const { defineDefaultBreadcrumb } = await import('./breadcrumb-define');
    defineDefaultBreadcrumb();

    const item = renderWebComponent(`
      <dads-breadcrumb-item home href="#home">ホーム</dads-breadcrumb-item>
    `);

    await waitForComponent('dads-breadcrumb-item');

    const icon = getShadowElement(item, '#home-icon');
    expect(icon?.hasAttribute('hidden')).toBe(false);
  });
});
