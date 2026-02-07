import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, renderWebComponent, waitForComponent, getShadowElement } from '../../test/utils/test-helpers';
import { WebComponent, html, DelegatingPropertyAttr } from './web-components';

class TestDelegateComponent extends WebComponent {
  static definition = {
    name: 'test-delegate-component',
    template: html`
      <button part="base" type="button">x</button>
    `,
    attributes: [DelegatingPropertyAttr('[part="base"]', 'command')],
  };
}

describe('DelegatingPropertyAttr', () => {
  afterEach(() => {
    cleanup();
  });

  it('hostの属性がshadow内ターゲットへ転送される', async () => {
    if (!customElements.get('test-delegate-component')) {
      TestDelegateComponent.define();
    }

    const el = renderWebComponent(
      `<test-delegate-component command="a"></test-delegate-component>`,
    );
    await waitForComponent('test-delegate-component');

    const base = getShadowElement(el, '[part="base"]');
    expect(base?.getAttribute('command')).toBe('a');
  });

  it('属性更新がshadow内ターゲットへ追従する', async () => {
    if (!customElements.get('test-delegate-component')) {
      TestDelegateComponent.define();
    }

    const el = renderWebComponent(
      `<test-delegate-component command="a"></test-delegate-component>`,
    );
    await waitForComponent('test-delegate-component');

    el.setAttribute('command', 'b');

    const base = getShadowElement(el, '[part="base"]');
    expect(base?.getAttribute('command')).toBe('b');

    el.removeAttribute('command');
    expect(base?.hasAttribute('command')).toBe(false);
  });
});

