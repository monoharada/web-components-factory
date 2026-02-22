/**
 * DadsAvatar コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  waitForCustomElement,
} from '../../../tests/setup';

function waitTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('DadsAvatar - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineAvatar } = await import('./avatar-define');
    defineAvatar();
    defineAvatar();
    expect(customElements.get('dads-avatar')).toBeTruthy();
  });

  it('initials指定でcircle + text描画', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    const circle = svg?.querySelector('circle');
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute('r')).toBe('24');
    const text = svg?.querySelector('text');
    expect(text).toBeTruthy();
    expect(text?.textContent).toBe('太');
  });

  it('initials未指定 → 空テキスト', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    await waitForCustomElement(element);

    const text = element.shadowRoot?.querySelector('svg text');
    expect(text?.textContent).toBe('');
  });

  it('initials変更 → 再描画', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const text = element.shadowRoot?.querySelector('svg text');
    expect(text?.textContent).toBe('太');

    element.setAttribute('initials', '花');
    await waitTick();
    expect(text?.textContent).toBe('花');
  });

  it('3文字以上のinitials → 2文字に切り詰め', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', 'ABC');
    await waitForCustomElement(element);

    const text = element.shadowRoot?.querySelector('svg text');
    expect(text?.textContent).toBe('AB');
  });
});

describe('DadsAvatar - 写真モード', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('src指定 → imgが表示されSVGは非表示', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('src', 'https://example.com/photo.jpg');
    await waitForCustomElement(element);

    const img = element.shadowRoot?.querySelector('img');
    const svg = element.shadowRoot?.querySelector('svg');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('photo.jpg');
    expect(img?.style.display).not.toBe('none');
    expect(svg?.style.display).toBe('none');
  });

  it('src指定時にsizeがwidth/heightに反映される', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('src', 'https://example.com/photo.jpg');
    element.setAttribute('size', '48');
    await waitForCustomElement(element);

    const img = element.shadowRoot?.querySelector('img');
    expect(img?.width).toBe(48);
    expect(img?.height).toBe(48);
  });

  it('src指定 + label → imgのaltにラベル設定', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('src', 'https://example.com/photo.jpg');
    element.setAttribute('label', '太郎');
    await waitForCustomElement(element);

    const img = element.shadowRoot?.querySelector('img');
    expect(img?.alt).toBe('太郎');
    expect(element.getAttribute('aria-hidden')).toBeNull();
  });

  it('src指定 + label未指定 → alt空 + aria-hidden', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('src', 'https://example.com/photo.jpg');
    await waitForCustomElement(element);

    const img = element.shadowRoot?.querySelector('img');
    expect(img?.alt).toBe('');
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('src削除 → イニシャルモードに復帰', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('src', 'https://example.com/photo.jpg');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    element.removeAttribute('src');
    await waitTick();

    const svg = element.shadowRoot?.querySelector('svg');
    const img = element.shadowRoot?.querySelector('img');
    expect(svg?.style.display).not.toBe('none');
    expect(img?.style.display).toBe('none');
    expect(svg?.querySelector('text')?.textContent).toBe('太');
  });
});

describe('DadsAvatar - カラー', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルト色はCSS変数フォールバック', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const circle = element.shadowRoot?.querySelector('svg circle');
    expect(circle?.getAttribute('fill')).toBe('var(--dads-avatar-background, #949494)');
  });

  it('color属性にトークン名 → var()でfill設定', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('color', '--color-primitive-blue-600');
    await waitForCustomElement(element);

    const circle = element.shadowRoot?.querySelector('svg circle');
    expect(circle?.getAttribute('fill')).toBe('var(--color-primitive-blue-600)');
  });
});

describe('DadsAvatar - サイズ', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルトsize → 32', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('size属性でSVGのwidth/heightが変更される', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('size', '48');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('height')).toBe('48');
  });

  it('非数値size → デフォルト32にフォールバック', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('size', 'banana');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('viewBoxは常に0 0 48 48', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('size', '64');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 48 48');
  });
});

describe('DadsAvatar - アクセシビリティ', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('デフォルトでaria-hidden="true"がSVGとhostに設定', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('label指定 → role="img", title要素, aria-labelledby', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('label', '太郎');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(svg?.getAttribute('aria-labelledby')).toBe('avatar-title');
    expect(element.getAttribute('aria-hidden')).toBeNull();

    const title = svg?.querySelector(':scope > title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe('太郎');
  });

  it('label削除 → 装飾モードに復帰', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    element.setAttribute('label', '太郎');
    await waitForCustomElement(element);

    element.removeAttribute('label');
    await waitTick();

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
    expect(svg?.querySelector(':scope > title')).toBeNull();
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('SVGにfocusable="false"が設定されている', async () => {
    const { defineDefaultAvatar } = await import('./avatar-define');
    defineDefaultAvatar();

    element = createTestElement('dads-avatar');
    element.setAttribute('initials', '太');
    await waitForCustomElement(element);

    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });
});
