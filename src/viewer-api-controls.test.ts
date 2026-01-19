import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
});

async function loadModule() {
  try {
    const modulePath = './viewer-api-controls.js';
    return await import(/* @vite-ignore */ modulePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    expect.fail(`Failed to import viewer-api-controls module: ${message}`);
  }
}

describe('viewer api controls binder', () => {
  it('binds boolean attribute controls (dads-switch → data-api-attr)', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <dads-input-text id="target" data-api-target></dads-input-text>
        <dads-switch id="ctrl" data-api-attr="required" data-default="false"></dads-switch>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target')!;
    const ctrl = document.getElementById('ctrl')!;

    bindApiControls(root);

    ctrl.dispatchEvent(
      new CustomEvent('dads-change', { detail: { checked: true }, bubbles: true }),
    );
    expect(target.hasAttribute('required')).toBe(true);

    ctrl.dispatchEvent(
      new CustomEvent('dads-change', { detail: { checked: false }, bubbles: true }),
    );
    expect(target.hasAttribute('required')).toBe(false);
  });

  it('binds string attribute controls (dads-input-text → data-api-attr)', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <dads-input-text id="target" data-api-target></dads-input-text>
        <dads-input-text id="ctrl" data-api-attr="label" data-default="ラベル"></dads-input-text>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target')!;
    const ctrl = document.getElementById('ctrl') as any;

    bindApiControls(root);

    ctrl.value = '見出し';
    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: '見出し' }, bubbles: true }));
    expect(target.getAttribute('label')).toBe('見出し');

    ctrl.value = '';
    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: '' }, bubbles: true }));
    expect(target.hasAttribute('label')).toBe(false);
  });

  it('binds property controls (dads-input-text → data-api-prop)', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <dads-input-text id="target" data-api-target></dads-input-text>
        <dads-input-text id="ctrl" data-api-prop="value" data-default=""></dads-input-text>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target') as any;
    const ctrl = document.getElementById('ctrl') as any;

    bindApiControls(root);

    ctrl.value = 'hello';
    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: 'hello' }, bubbles: true }));
    expect(target.value).toBe('hello');
  });

  it('binds CSS var controls (dads-input-text → data-api-css-var)', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <dads-input-text id="target" data-api-target></dads-input-text>
        <dads-input-text
          id="ctrl"
          data-api-css-var="--dads-input-border-color"
          data-default=""
        ></dads-input-text>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target') as HTMLElement;
    const ctrl = document.getElementById('ctrl') as any;

    bindApiControls(root);

    ctrl.value = 'red';
    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: 'red' }, bubbles: true }));
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('red');

    ctrl.value = '';
    ctrl.dispatchEvent(new CustomEvent('dads-input', { detail: { value: '' }, bubbles: true }));
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('');
  });

  it('supports reset via [data-api-reset]', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <dads-input-text id="target" data-api-target></dads-input-text>
        <dads-switch id="ctrl-required" data-api-attr="required" data-default="false"></dads-switch>
        <dads-input-text id="ctrl-label" data-api-attr="label" data-default="ラベル"></dads-input-text>
        <dads-input-text id="ctrl-css" data-api-css-var="--dads-input-border-color" data-default=""></dads-input-text>
        <button type="button" id="reset" data-api-reset>Reset</button>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target') as HTMLElement;
    const required = document.getElementById('ctrl-required')!;
    const label = document.getElementById('ctrl-label') as any;
    const css = document.getElementById('ctrl-css') as any;
    const reset = document.getElementById('reset')!;

    bindApiControls(root);

    required.dispatchEvent(
      new CustomEvent('dads-change', { detail: { checked: true }, bubbles: true }),
    );
    label.value = '見出し';
    label.dispatchEvent(new CustomEvent('dads-input', { detail: { value: '見出し' }, bubbles: true }));
    css.value = 'red';
    css.dispatchEvent(new CustomEvent('dads-input', { detail: { value: 'red' }, bubbles: true }));

    expect(target.hasAttribute('required')).toBe(true);
    expect(target.getAttribute('label')).toBe('見出し');
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('red');

    reset.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(target.hasAttribute('required')).toBe(false);
    expect(target.getAttribute('label')).toBe('ラベル');
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('');
  });
});
