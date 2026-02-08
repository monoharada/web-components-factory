import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineMobileMock } from './mobile-mock-define.js';

beforeAll(() => {
  defineMobileMock();
});

describe('DadsMobileMock', () => {
  afterEach(() => {
    cleanup();
  });

  it('基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-mobile-mock></dads-mobile-mock>');

    await waitForComponent('dads-mobile-mock');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="frame"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="screen"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="safe-area"]')).toBeInTheDocument();
  });

  it('default slot に子要素を配置できる', async () => {
    const el = renderWebComponent(`
      <dads-mobile-mock>
        <div id="mobile-content">content</div>
      </dads-mobile-mock>
    `);

    await waitForComponent('dads-mobile-mock');

    expect(el.querySelector('#mobile-content')?.textContent).toBe('content');
  });
});
