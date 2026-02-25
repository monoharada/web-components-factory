import { describe, expect, it } from 'vitest';
import { demos } from './tab.js';

describe('tab demo', () => {
  it('CSS vars コントロールは data-api-css-var 属性を使う', () => {
    const html = demos.tab();

    expect(html).toContain('data-api-css-var="--dads-tab-background"');
    expect(html).toContain('data-api-css-var="--dads-tab-indicator-color"');
    expect(html).toContain('data-api-css-var="--dads-tab-focus-ring-color"');
    expect(html).not.toContain('data-api-css="');

    const cssVarControls = html.match(/data-api-css-var="/g) ?? [];
    expect(cssVarControls.length).toBe(10);
  });
});
