/**
 * DadsFieldset コンポーネント テスト
 * TDD: RED → GREEN → REFACTOR
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

describe('DadsFieldset - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('内部にfieldset要素を持つ', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    await waitForCustomElement(element);

    const fieldset = getShadowContent(element, 'fieldset');
    expect(fieldset).toBeInTheDocument();
  });

  it('内部にlegend要素を持つ', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    await waitForCustomElement(element);

    const legend = getShadowContent(element, 'legend');
    expect(legend).toBeInTheDocument();
  });
});

describe('DadsFieldset - 属性反映', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('legend属性がフォールバックとして表示される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.setAttribute('legend', 'テストレジェンド');
    await waitForCustomElement(element);

    const fallback = getShadowContent(element, '[part="legend-fallback"]');
    expect(fallback?.textContent).toBe('テストレジェンド');
  });

  it('support-text属性がフォールバックとして表示される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.setAttribute('support-text', 'サポートテキスト');
    await waitForCustomElement(element);

    const fallback = getShadowContent(element, '[part="support-fallback"]');
    expect(fallback?.textContent).toBe('サポートテキスト');
  });

  it('required属性で※必須が表示される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.setAttribute('required', '');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('※必須');
  });

  it('required属性がない場合は※必須が空', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    await waitForCustomElement(element);

    const requirement = getShadowContent(element, '[part="requirement"]');
    expect(requirement?.textContent).toBe('');
  });
});

describe('DadsFieldset - スロット', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('legendスロットが機能する', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.innerHTML = '<span slot="legend">カスタムレジェンド</span>';
    await waitForCustomElement(element);

    const slot = getShadowContent(element, 'slot[name="legend"]') as HTMLSlotElement | null;
    const assigned = slot?.assignedElements();
    expect(assigned?.length).toBe(1);
    expect(assigned?.[0].textContent).toBe('カスタムレジェンド');
  });

  it('support-textスロットが機能する', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.innerHTML = '<p slot="support-text">カスタムサポートテキスト</p>';
    await waitForCustomElement(element);

    const slot = getShadowContent(element, 'slot[name="support-text"]') as HTMLSlotElement | null;
    const assigned = slot?.assignedElements();
    expect(assigned?.length).toBe(1);
    expect(assigned?.[0].textContent).toBe('カスタムサポートテキスト');
  });

  it('デフォルトスロットで子要素を受け取る', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.innerHTML = '<div class="child">子要素</div>';
    await waitForCustomElement(element);

    const slot = getShadowContent(element, 'slot:not([name])') as HTMLSlotElement | null;
    const assigned = slot?.assignedElements();
    expect(assigned?.length).toBe(1);
    expect(assigned?.[0].classList.contains('child')).toBe(true);
  });
});

describe('DadsFieldset - aria-describedby自動設定', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('support-textスロットにIDが自動付与される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    defineDefaultFieldset();

    element = createTestElement('dads-fieldset');
    element.innerHTML = '<p slot="support-text">サポートテキスト</p>';
    await waitForCustomElement(element);
    // slotchange発火を待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    const supportText = element.querySelector('[slot="support-text"]');
    expect(supportText?.id).toMatch(/^dads-fieldset-.+-support$/);
  });

  it('support-textスロットの既存IDは上書きしない', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.innerHTML = `
      <p slot="support-text" id="my-support-id">サポートテキスト</p>
      <dads-checkbox label="オプション1"></dads-checkbox>
    `;
    await waitForCustomElement(element);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    const supportText = element.querySelector('[slot="support-text"]');

    expect(supportText?.id).toBe('my-support-id');
    expect(checkbox?.getAttribute('aria-describedby')).toContain('my-support-id');
  });

  it('子のdads-checkboxにaria-describedbyが自動設定される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.innerHTML = `
      <p slot="support-text">サポートテキスト</p>
      <dads-checkbox label="オプション1"></dads-checkbox>
    `;
    await waitForCustomElement(element);
    // slotchange発火を待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    const supportText = element.querySelector('[slot="support-text"]');

    expect(checkbox?.getAttribute('aria-describedby')).toContain(supportText?.id);
  });

  it('support-text削除で子要素のaria-describedbyから自動付与IDが除去される', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.innerHTML = `
      <p slot="support-text">サポートテキスト</p>
      <dads-checkbox label="オプション1" aria-describedby="existing-id"></dads-checkbox>
    `;
    await waitForCustomElement(element);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    const supportText = element.querySelector('[slot="support-text"]') as HTMLElement | null;
    const supportId = supportText?.id || '';

    expect(supportId).toBeTruthy();
    expect(checkbox?.getAttribute('aria-describedby')).toContain('existing-id');
    expect(checkbox?.getAttribute('aria-describedby')).toContain(supportId);

    supportText?.remove();
    await new Promise((resolve) => setTimeout(resolve, 10));

    const updated = checkbox?.getAttribute('aria-describedby') ?? '';
    expect(updated).toContain('existing-id');
    expect(updated).not.toContain(supportId);
  });

  it('既存のaria-describedbyを上書きしない（拡張する）', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.innerHTML = `
      <p slot="support-text">サポートテキスト</p>
      <dads-checkbox label="オプション1" aria-describedby="existing-id"></dads-checkbox>
    `;
    await waitForCustomElement(element);
    // slotchange発火を待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    const ariaDescribedBy = checkbox?.getAttribute('aria-describedby') || '';

    expect(ariaDescribedBy).toContain('existing-id');
    expect(ariaDescribedBy.split(' ').length).toBeGreaterThan(1);
  });
});

describe('DadsFieldset - disabled伝播', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) cleanupTestElement(element);
  });

  it('disabled属性が子のdads-checkboxに伝播する', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.innerHTML = '<dads-checkbox label="オプション1"></dads-checkbox>';
    await waitForCustomElement(element);

    element.setAttribute('disabled', '');
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    expect(checkbox?.hasAttribute('disabled')).toBe(true);
  });

  it('disabled解除が子のdads-checkboxに伝播する', async () => {
    const { defineDefaultFieldset } = await import('./fieldset-define');
    const { defineDefaultCheckbox } = await import('../checkbox/checkbox-define');
    defineDefaultFieldset();
    defineDefaultCheckbox();

    element = createTestElement('dads-fieldset');
    element.setAttribute('disabled', '');
    element.innerHTML = '<dads-checkbox label="オプション1"></dads-checkbox>';
    await waitForCustomElement(element);

    element.removeAttribute('disabled');
    await new Promise((resolve) => setTimeout(resolve, 10));

    const checkbox = element.querySelector('dads-checkbox');
    expect(checkbox?.hasAttribute('disabled')).toBe(false);
  });
});

describe('DadsFieldset - a11yAnnotations', () => {
  it('静的プロパティa11yAnnotationsが定義されている', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-fieldset');
    expect(annotations).toBeDefined();
    expect(annotations?.version).toBe(1);
  });

  it('calloutsが定義されている', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-fieldset');
    expect(annotations?.callouts).toBeDefined();
    expect(annotations?.callouts?.length ?? 0).toBeGreaterThan(0);
  });
});
