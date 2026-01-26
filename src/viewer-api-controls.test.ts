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

function dispatchDadsInput(el: Element, value: string): void {
  (el as any).value = value;
  el.dispatchEvent(new CustomEvent('dads-input', { detail: { value }, bubbles: true }));
}

function dispatchDadsChange(el: Element, checked: boolean): void {
  el.dispatchEvent(new CustomEvent('dads-change', { detail: { checked }, bubbles: true }));
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

    dispatchDadsChange(ctrl, true);
    expect(target.hasAttribute('required')).toBe(true);

    dispatchDadsChange(ctrl, false);
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

    dispatchDadsInput(ctrl, '見出し');
    expect(target.getAttribute('label')).toBe('見出し');

    dispatchDadsInput(ctrl, '');
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

    dispatchDadsInput(ctrl, 'hello');
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

    dispatchDadsInput(ctrl, 'red');
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('red');

    dispatchDadsInput(ctrl, '');
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

    dispatchDadsChange(required, true);
    dispatchDadsInput(label, '見出し');
    dispatchDadsInput(css, 'red');

    expect(target.hasAttribute('required')).toBe(true);
    expect(target.getAttribute('label')).toBe('見出し');
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('red');

    reset.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(target.hasAttribute('required')).toBe(false);
    expect(target.getAttribute('label')).toBe('ラベル');
    expect(target.style.getPropertyValue('--dads-input-border-color')).toBe('');
  });

  it('supports per-control target override via [data-api-target-selector]', async () => {
    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <div id="target" data-api-target></div>
        <span id="secondary">old</span>
        <dads-input-text
          id="ctrl"
          data-api-prop="textContent"
          data-api-target-selector="#secondary"
          data-default="old"
        ></dads-input-text>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target')!;
    const secondary = document.getElementById('secondary')!;
    const ctrl = document.getElementById('ctrl') as any;

    bindApiControls(root);

    dispatchDadsInput(ctrl, 'new');
    expect(secondary.textContent).toBe('new');
    expect(target.textContent).not.toBe('new');
  });

  it('treats controls with checked:boolean as boolean even when checked is false (regression)', async () => {
    const { defineSwitch } = await import('../packages/components/switch/switch-define');
    defineSwitch();

    const { bindApiControls } = await loadModule();

    document.body.innerHTML = `
      <section id="root">
        <div id="target" data-api-target></div>
        <dads-switch id="ctrl" data-api-attr="required" data-default="false"></dads-switch>
        <button type="button" id="reset" data-api-reset>Reset</button>
      </section>
    `;

    const root = document.getElementById('root')!;
    const target = document.getElementById('target')!;
    const ctrl = document.getElementById('ctrl')!;
    const reset = document.getElementById('reset')!;

    bindApiControls(root);

    dispatchDadsChange(ctrl, true);
    expect(target.hasAttribute('required')).toBe(true);

    reset.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(target.hasAttribute('required')).toBe(false);
  });
});
