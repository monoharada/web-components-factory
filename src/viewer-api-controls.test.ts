import { describe, it, expect } from 'vitest';
import { bindApiControls } from './viewer-api-controls.js';

function createRoot(innerHtml: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = innerHtml;
  return root;
}

function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  expect(el).toBeTruthy();
  if (!el) throw new Error(`Expected element: ${selector}`);
  return el;
}

function stubCodeBlockSetCode(el: HTMLElement): void {
  (el as unknown as { setCode?: (code: string) => void }).setCode = (code: string) => {
    el.textContent = code;
  };
}

function setupCodeBlock(root: ParentNode): HTMLElement {
  const codeBlock = queryRequired<HTMLElement>(root, 'dads-code-block');
  stubCodeBlockSetCode(codeBlock);
  return codeBlock;
}

describe('bindApiControls() usage (HTML) formatting', () => {
  it('formats template HTML (incl. svg/path) and updates attributes', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <dads-menu-list-box data-api-target variant="outlined" size="sm" label="メニュー">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M0 0" /></svg>
            <dads-menu-list-item data-value="1">メニュー項目1</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
          </dads-menu-list-box>

          <select aria-label="variant" data-api-attr="variant" data-default="outlined">
            <option value="outlined" selected>outlined</option>
            <option value="filled">filled</option>
          </select>

          <dads-code-block data-api-code>
            <template>
              <dads-menu-list-box variant="outlined" size="sm" label="メニュー">
                <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M0 0" /></svg>
                <dads-menu-list-item data-value="1">メニュー項目1</dads-menu-list-item>
                <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
              </dads-menu-list-box>
            </template>
          </dads-code-block>
        </div>
      </div>
    `);
    const codeBlock = setupCodeBlock(root);

    bindApiControls(root);

    const expectedOutlined = [
      '<dads-menu-list-box variant="outlined" size="sm" label="メニュー">',
      '  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">',
      '    <path d="M0 0"></path>',
      '  </svg>',
      '  <dads-menu-list-item data-value="1">メニュー項目1</dads-menu-list-item>',
      '  <dads-menu-list-item>メニュー項目2</dads-menu-list-item>',
      '</dads-menu-list-box>',
    ].join('\n');

    expect(codeBlock.textContent).toBe(expectedOutlined);
    expect(codeBlock.textContent).not.toContain('data-api-target');

    const select = queryRequired<HTMLSelectElement>(root, 'select');
    select.value = 'filled';
    select.dispatchEvent(new Event('change'));

    const expectedFilled = expectedOutlined.replace('variant="outlined"', 'variant="filled"');
    expect(codeBlock.textContent).toBe(expectedFilled);
  });

  it('reflects prop controls (boolean + textContent) into HTML usage', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <dads-button data-api-target variant="solid">ボタンテキスト</dads-button>

          <input type="checkbox" aria-label="disabled" data-api-prop="disabled" data-default="false" />
          <dads-input-text aria-label="textContent" data-api-prop="textContent" data-default="ボタンテキスト"></dads-input-text>

          <dads-code-block data-api-code>
            <template>
              <dads-button variant="solid">ボタンテキスト</dads-button>
            </template>
          </dads-code-block>
        </div>
      </div>
    `);
    const codeBlock = setupCodeBlock(root);

    bindApiControls(root);

    expect(codeBlock.textContent).toBe('<dads-button variant="solid">ボタンテキスト</dads-button>');
    expect(codeBlock.textContent).not.toContain('data-api-target');

    const disabled = queryRequired<HTMLInputElement>(root, 'input[type="checkbox"]');
    disabled.checked = true;
    disabled.dispatchEvent(new Event('change'));

    expect(codeBlock.textContent).toBe('<dads-button variant="solid" disabled>ボタンテキスト</dads-button>');

    const text = queryRequired<HTMLElement>(root, 'dads-input-text');
    text.dispatchEvent(new CustomEvent('dads-input', { detail: { value: '変更' } }));

    expect(codeBlock.textContent).toBe('<dads-button variant="solid" disabled>変更</dads-button>');
  });

  it('supports native input[type="text"] controls', () => {
	    const root = createRoot(`
	      <div class="wc-api-panel">
	        <div class="wc-api-panel__body">
	          <dads-button data-api-target variant="solid">ボタン</dads-button>

          <input type="text" aria-label="aria-label" data-api-attr="aria-label" data-default="" value="" />

          <dads-code-block data-api-code>
            <template>
              <dads-button variant="solid">ボタン</dads-button>
            </template>
          </dads-code-block>
	        </div>
	      </div>
	    `);
	    const codeBlock = setupCodeBlock(root);

	    bindApiControls(root);

    const input = queryRequired<HTMLInputElement>(root, 'input[type="text"]');
	    input.value = 'ラベル';
	    input.dispatchEvent(new Event('input'));

	    expect(codeBlock.textContent).toBe('<dads-button variant="solid" aria-label="ラベル">ボタン</dads-button>');
	  });
});

describe('bindApiControls() per-control target override', () => {
  it('updates the element resolved by data-api-target-selector', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <div id="target" data-api-target></div>
          <span id="secondary">old</span>

          <dads-input-text
            id="ctrl"
            data-api-prop="textContent"
            data-api-target-selector="#secondary"
            data-default="old"
          ></dads-input-text>
        </div>
      </div>
    `);
    const target = queryRequired<HTMLElement>(root, '#target');
    const secondary = queryRequired<HTMLElement>(root, '#secondary');
    const ctrl = queryRequired<HTMLElement>(root, '#ctrl');

    bindApiControls(root);

    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: 'new' } }));
    expect(secondary.textContent).toBe('new');
    expect(target.textContent).not.toBe('new');
  });
});

describe('bindApiControls() code block auto-collapse', () => {
  it('wraps long code blocks (>= 5 lines) in dads-disclosure (default closed)', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <dads-button data-api-target variant="solid">
            <span>ボタン</span>
          </dads-button>

          <select aria-label="variant" data-api-attr="variant" data-default="solid">
            <option value="solid" selected>solid</option>
            <option value="outlined">outlined</option>
          </select>

          <dads-code-block data-api-code>
            <template>
              <dads-button variant="solid">
                <span>ボタン</span>
                <span>追加</span>
                <span>さらに</span>
              </dads-button>
            </template>
          </dads-code-block>
        </div>
      </div>
    `);
    const codeBlock = setupCodeBlock(root);

    bindApiControls(root);

    const disclosure = queryRequired<HTMLElement>(root, 'dads-disclosure[data-api-code-disclosure]');
    expect(disclosure.hasAttribute('open')).toBe(false);

    const summary = disclosure.querySelector<HTMLElement>('[slot="summary"]');
    expect(summary?.textContent).toBe('コードを表示');

    expect(codeBlock.closest('dads-disclosure[data-api-code-disclosure]')).toBe(disclosure);
    expect(codeBlock.getAttribute('slot')).toBe('content');

    // keep open state on subsequent updates
    disclosure.setAttribute('open', '');
    const select = queryRequired<HTMLSelectElement>(root, 'select');
    select.value = 'outlined';
    select.dispatchEvent(new Event('change'));

    const disclosureAfter = root.querySelector<HTMLElement>('dads-disclosure[data-api-code-disclosure]');
    expect(disclosureAfter).toBe(disclosure);
    expect(disclosureAfter?.hasAttribute('open')).toBe(true);
  });

  it('does not wrap when the formatted snippet is 4 lines', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <dads-button data-api-target variant="solid">
            <span>ボタン</span>
          </dads-button>

          <dads-code-block data-api-code>
            <template>
              <dads-button variant="solid">
                <span>ボタン</span>
              </dads-button>
            </template>
          </dads-code-block>
        </div>
      </div>
    `);
    const codeBlock = setupCodeBlock(root);

    bindApiControls(root);

    expect(root.querySelector('dads-disclosure[data-api-code-disclosure]')).toBeNull();
    expect(codeBlock.getAttribute('slot')).toBeNull();
  });

  it('supports opt-out via data-api-code-collapse="off"', () => {
    const root = createRoot(`
      <div class="wc-api-panel">
        <div class="wc-api-panel__body">
          <dads-button data-api-target variant="solid">
            <span>ボタン</span>
          </dads-button>

          <dads-code-block data-api-code data-api-code-collapse="off">
            <template>
              <dads-button variant="solid">
                <span>ボタン</span>
                <span>追加</span>
                <span>さらに</span>
              </dads-button>
            </template>
          </dads-code-block>
        </div>
      </div>
    `);
    const codeBlock = setupCodeBlock(root);

    bindApiControls(root);

    expect(root.querySelector('dads-disclosure[data-api-code-disclosure]')).toBeNull();
    expect(codeBlock.getAttribute('slot')).toBeNull();
  });
});
