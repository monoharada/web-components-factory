import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineLayoutSidebar } from './layout-sidebar-define.js';

beforeAll(() => {
  defineLayoutSidebar();
});

describe('DadsLayoutSidebar', () => {
  afterEach(() => {
    cleanup();
  });

  it('基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-layout-sidebar>navigation</dads-layout-sidebar>');
    await waitForComponent('dads-layout-sidebar');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
  });

  it('default slot にコンテンツを表示する', async () => {
    const el = renderWebComponent('<dads-layout-sidebar><ul><li>項目</li></ul></dads-layout-sidebar>');
    await waitForComponent('dads-layout-sidebar');

    expect(el.textContent).toContain('項目');
  });
});
