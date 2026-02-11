import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineLayoutAside } from './layout-aside-define.js';

beforeAll(() => {
  defineLayoutAside();
});

describe('DadsLayoutAside', () => {
  afterEach(() => {
    cleanup();
  });

  it('基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-layout-aside>aside</dads-layout-aside>');
    await waitForComponent('dads-layout-aside');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
  });

  it('default slot にコンテンツを表示する', async () => {
    const el = renderWebComponent('<dads-layout-aside><p>補助情報</p></dads-layout-aside>');
    await waitForComponent('dads-layout-aside');

    expect(el.textContent).toContain('補助情報');
  });
});
