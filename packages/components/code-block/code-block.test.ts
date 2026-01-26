import { describe, it, expect, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { cleanup, renderWebComponent, getShadowElement, waitForComponent } from '../../../test/utils/test-helpers';

describe('DadsCodeBlock', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineCodeBlock } = await import('./code-block-define.js');
    defineCodeBlock();

    const component = renderWebComponent(`
      <dads-code-block>
        <template><div>hello</div></template>
      </dads-code-block>
    `);

    await waitForComponent('dads-code-block');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('templateのHTMLをコードとして表示する', async () => {
    const { defineCodeBlock } = await import('./code-block-define.js');
    defineCodeBlock();

    const component = renderWebComponent(`
      <dads-code-block>
        <template>
          <dads-button variant="solid">ボタン</dads-button>
        </template>
      </dads-code-block>
    `);

    await waitForComponent('dads-code-block');
    const code = getShadowElement(component, '[part="code"]');
    expect(code?.textContent).toContain('<dads-button');
    expect(code?.textContent).toContain('variant="solid"');
  });

  it('setCode()で表示内容を更新できる', async () => {
    const { defineCodeBlock } = await import('./code-block-define.js');
    defineCodeBlock();

    const component = renderWebComponent(`
      <dads-code-block>
        <template><span>before</span></template>
      </dads-code-block>
    `);

    await waitForComponent('dads-code-block');

    const anyComponent = component as unknown as { setCode?: (code: string) => void };
    expect(typeof anyComponent.setCode).toBe('function');
    anyComponent.setCode?.('<div>after</div>');

    const code = getShadowElement(component, '[part="code"]');
    expect(code?.textContent).toBe('<div>after</div>');
  });

  it('Copyボタンでクリップボードへ書き込む', async () => {
    const { defineCodeBlock } = await import('./code-block-define.js');
    defineCodeBlock();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    const component = renderWebComponent(`
      <dads-code-block>
        <template><span>copied</span></template>
      </dads-code-block>
    `);

    await waitForComponent('dads-code-block');

    const copyButton = getShadowElement<HTMLButtonElement>(component, '[part="copy-button"]');
    expect(copyButton).toBeTruthy();

    copyButton?.click();

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith('<span>copied</span>');
    });
  });
});
