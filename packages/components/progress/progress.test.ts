/**
 * DadsProgress コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTestElement,
  createTestElement,
  getDefinitionStyles,
  getShadowContent,
  renderWebComponent,
  waitForCustomElement,
} from '../../../tests/setup';

function waitTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function toCssText(style: string | CSSStyleSheet): string {
  if (typeof style === 'string') return style;
  return Array.from(style.cssRules)
    .map((rule) => rule.cssText)
    .join('\n');
}

describe('DadsProgress - 基本', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('定義関数を重複実行しても問題なく登録される', async () => {
    const { defineProgress } = await import('./progress-define');

    defineProgress();
    defineProgress();

    expect(customElements.get('dads-progress')).toBeTruthy();
  });

  it('デフォルト属性が補完され、progressbar が設定される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = createTestElement('dads-progress');
    await waitForCustomElement(element);

    expect(element.getAttribute('shape')).toBe('linear');
    expect(element.getAttribute('size')).toBe('md');
    expect(element.getAttribute('min')).toBe('0');
    expect(element.getAttribute('max')).toBe('100');
    expect(element.getAttribute('value')).toBe('0');
    expect(element.getAttribute('status-live')).toBe('off');
    expect(element.getAttribute('segment-mode')).toBe('ratio');
    expect(element.getAttribute('segments')).toBe('10');
    expect(element.getAttribute('current-step')).toBe('0');
    expect(element.getAttribute('total-steps')).toBe('1');

    const bar = getShadowContent(element, '#bar');
    expect(bar?.getAttribute('role')).toBe('progressbar');
  });

  it('determinate では aria-valuemin/max/now が整合し、aria-valuetext は自動生成される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress min="20" max="220" value="120"></dads-progress>');
    await waitForCustomElement(element);

    const bar = getShadowContent(element, '#bar');
    expect(bar?.getAttribute('aria-valuemin')).toBe('20');
    expect(bar?.getAttribute('aria-valuemax')).toBe('220');
    expect(bar?.getAttribute('aria-valuenow')).toBe('120');
    expect(bar?.getAttribute('aria-valuetext')).toBe('50%');
  });

  it('indeterminate では aria-valuenow を外し、aria-valuetext を進行中にする', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress indeterminate></dads-progress>');
    await waitForCustomElement(element);

    const bar = getShadowContent(element, '#bar');
    expect(bar?.hasAttribute('aria-valuenow')).toBe(false);
    expect(bar?.getAttribute('aria-valuetext')).toBe('進行中');
  });

  it('value-text 属性を指定した場合は indeterminate 時の aria-valuetext を上書きする', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress indeterminate value-text="読み込み中"></dads-progress>');
    await waitForCustomElement(element);

    const bar = getShadowContent(element, '#bar');
    expect(bar?.getAttribute('aria-valuetext')).toBe('読み込み中');
  });

  it('aria-label / aria-labelledby が内部 progressbar へ転送される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    const wrapper = renderWebComponent(`
      <div>
        <span id="progress-label">進捗</span>
        <dads-progress aria-label="ロード進捗" aria-labelledby="progress-label"></dads-progress>
      </div>
    `);

    const component = wrapper.querySelector('dads-progress') as HTMLElement;
    await waitForCustomElement(component);

    const bar = getShadowContent(component, '#bar');
    expect(bar?.getAttribute('aria-label')).toBe('ロード進捗');
    expect(bar?.getAttribute('aria-labelledby')).toBe('progress-label');
  });

  it('status-live=off/polite/assertive を切り替えられる', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress status-live="off"></dads-progress>');
    await waitForCustomElement(element);

    const status = getShadowContent(element, '#status');
    expect(status?.hasAttribute('aria-live')).toBe(false);

    element.setAttribute('status-live', 'polite');
    await waitTick();
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');

    element.setAttribute('status-live', 'assertive');
    await waitTick();
    expect(status?.getAttribute('aria-live')).toBe('assertive');
  });

  it('status-live 有効時は整数%が変わるときだけ status が更新される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress status-live="polite" min="0" max="100" value="10"></dads-progress>');
    await waitForCustomElement(element);

    const status = getShadowContent(element, '#status');
    element.setAttribute('value', '10.4');
    await waitTick();
    expect(status?.textContent).toBe('10%');

    element.setAttribute('value', '11');
    await waitTick();
    expect(status?.textContent).toBe('11%');
  });

  it('value-text は slot 優先で可視表示される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent(`
      <dads-progress value-text="属性テキスト">
        <span slot="value-text">スロットテキスト</span>
      </dads-progress>
    `);
    await waitForCustomElement(element);

    const valueText = getShadowContent(element, '#value-text');
    const attrFallback = getShadowContent(element, '#value-text-attr');

    expect(valueText?.hasAttribute('hidden')).toBe(false);
    expect(attrFallback?.hasAttribute('hidden')).toBe(true);
  });
});

describe('DadsProgress - 描画', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('shape=linear で fill 幅が更新される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress shape="linear" min="0" max="200" value="50"></dads-progress>');
    await waitForCustomElement(element);

    const fill = getShadowContent(element, '#fill') as HTMLElement | null;
    expect(fill?.style.width).toBe('25.000%');
  });

  it('shape=circular で stroke-dashoffset が更新される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress shape="circular" min="0" max="100" value="75"></dads-progress>');
    await waitForCustomElement(element);

    const circle = getShadowContent(element, '#circular-fill') as SVGCircleElement | null;
    expect(circle?.style.strokeDashoffset).not.toBe('');
    expect(Number.parseFloat(circle?.style.strokeDashoffset ?? '')).toBeGreaterThan(0);
  });

  it('shape=segmented + segment-mode=ratio で分割数と塗り数が更新される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent(
      '<dads-progress shape="segmented" segment-mode="ratio" segments="8" min="0" max="100" value="50"></dads-progress>',
    );
    await waitForCustomElement(element);

    const segmentEls = element.shadowRoot?.querySelectorAll('[part="segment"]') ?? [];
    const filledEls = element.shadowRoot?.querySelectorAll('[part="segment"][data-filled="true"]') ?? [];

    expect(segmentEls.length).toBe(8);
    expect(filledEls.length).toBe(4);
  });

  it('shape=segmented + segment-mode=steps で current-step/total-steps が反映される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent(
      '<dads-progress shape="segmented" segment-mode="steps" current-step="3" total-steps="7"></dads-progress>',
    );
    await waitForCustomElement(element);

    const segmentEls = element.shadowRoot?.querySelectorAll('[part="segment"]') ?? [];
    const filledEls = element.shadowRoot?.querySelectorAll('[part="segment"][data-filled="true"]') ?? [];
    const bar = getShadowContent(element, '#bar');

    expect(segmentEls.length).toBe(7);
    expect(filledEls.length).toBe(3);
    expect(bar?.getAttribute('aria-valuemin')).toBe('0');
    expect(bar?.getAttribute('aria-valuemax')).toBe('7');
    expect(bar?.getAttribute('aria-valuenow')).toBe('3');
  });
});

describe('DadsProgress - 正規化', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element) cleanupTestElement(element);
    element = null;
  });

  it('max <= min の場合は max = min + 1 に補正される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent('<dads-progress min="10" max="10" value="99"></dads-progress>');
    await waitForCustomElement(element);
    await waitTick();

    expect(element.getAttribute('max')).toBe('11');
    expect(element.getAttribute('value')).toBe('11');
  });

  it('segments / total-steps / current-step が範囲内に補正される', async () => {
    const { defineDefaultProgress } = await import('./progress-define');
    defineDefaultProgress();

    element = renderWebComponent(
      '<dads-progress shape="segmented" segment-mode="steps" segments="999" total-steps="0" current-step="99"></dads-progress>',
    );
    await waitForCustomElement(element);
    await waitTick();

    expect(element.getAttribute('segments')).toBe('100');
    expect(element.getAttribute('total-steps')).toBe('1');
    expect(element.getAttribute('current-step')).toBe('1');
  });
});

describe('DadsProgress - styles', () => {
  it('主要CSS変数と forced-colors / reduced-motion ルールが定義されている', async () => {
    const { DadsProgress } = await import('./progress');

    const cssText = getDefinitionStyles(DadsProgress.definition)
      .map((style) => toCssText(style))
      .join('\n');

    expect(cssText).toContain('--dads-progress-track-color');
    expect(cssText).toContain('--dads-progress-fill-color');
    expect(cssText).toContain('--dads-progress-height');
    expect(cssText).toContain('--dads-progress-size');
    expect(cssText).toContain('--dads-progress-segment-gap');
    expect(cssText).toContain('@media (forced-colors: active)');
    expect(cssText).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
