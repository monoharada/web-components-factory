import { describe, expect, it } from 'vitest';
import { demos as dialogDemos } from './dialog.js';
import { demos as extraDemos } from './extra.js';
import { demos as showcaseDateDemos } from './showcase-date.js';
import { demos as showcaseFormDemos } from './showcase-form.js';

function expectDemoMapToRenderHtml(
  label: string,
  demoMap: Record<string, () => string>
): void {
  for (const [name, render] of Object.entries(demoMap)) {
    const html = render();
    expect(typeof html, `${label}.${name} should return string`).toBe('string');
    expect(html.trim().length, `${label}.${name} should not be empty`).toBeGreaterThan(0);
  }
}

describe('legacy demos smoke', () => {
  it('dialog demos render non-empty html', () => {
    expectDemoMapToRenderHtml('dialog', dialogDemos);
  });

  it('extra demos render non-empty html', () => {
    expectDemoMapToRenderHtml('extra', extraDemos);
  });

  it('showcase-date demos render non-empty html', () => {
    expectDemoMapToRenderHtml('showcase-date', showcaseDateDemos);
  });

  it('showcase-form demos render non-empty html', () => {
    expectDemoMapToRenderHtml('showcase-form', showcaseFormDemos);
  });
});
