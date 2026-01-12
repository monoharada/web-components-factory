/**
 * DadsSwitchコンポーネント テスト
 * TDD（テスト駆動開発）アプローチ
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  createTestElement,
  cleanupTestElement,
  getShadowContent,
  waitForCustomElement,
} from '../../../tests/setup';

// ========== Phase 1: 基本レンダリング ==========
describe('DadsSwitch - 基本レンダリング', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('コンポーネントが存在する', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    expect(element).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    expect(element.shadowRoot).toBeTruthy();
  });

  it('checkbox要素が含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox?.tagName.toLowerCase()).toBe('input');
    expect((checkbox as HTMLInputElement)?.type).toBe('checkbox');
  });

  it('track要素が含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const track = getShadowContent(element, '[part="track"]');
    expect(track).toBeInTheDocument();
  });

  it('knob要素が含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const knob = getShadowContent(element, '[part="knob"]');
    expect(knob).toBeInTheDocument();
  });

  it('左ラベルスロットが含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const labelLeft = getShadowContent(element, '[part="label-left"]');
    expect(labelLeft).toBeInTheDocument();
  });

  it('右ラベルスロットが含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const labelRight = getShadowContent(element, '[part="label-right"]');
    expect(labelRight).toBeInTheDocument();
  });
});

// ========== Phase 2: 状態管理 ==========
describe('DadsSwitch - 状態管理', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('デフォルトはunchecked状態', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    expect(element.hasAttribute('checked')).toBe(false);
    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    expect(checkbox?.checked).toBe(false);
  });

  it('checked属性でchecked状態になる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('checked', '');
    await waitForCustomElement(element);

    expect(element.hasAttribute('checked')).toBe(true);
    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    expect(checkbox?.checked).toBe(true);
  });

  it('checkedプロパティで状態を取得・設定できる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const component = element as unknown as { checked: boolean };

    expect(component.checked).toBe(false);

    component.checked = true;
    expect(component.checked).toBe(true);
    expect(element.hasAttribute('checked')).toBe(true);

    component.checked = false;
    expect(component.checked).toBe(false);
    expect(element.hasAttribute('checked')).toBe(false);
  });
});

// ========== Phase 3: サイズバリエーション ==========
describe('DadsSwitch - サイズバリエーション', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('デフォルトでsize="md"が適用される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('md');
  });

  it('size="sm"が設定できる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('size', 'sm');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('sm');
  });

  it('size="lg"が設定できる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('size', 'lg');
    await waitForCustomElement(element);

    expect(element.getAttribute('size')).toBe('lg');
  });
});

// ========== Phase 4: インタラクション ==========
describe('DadsSwitch - インタラクション', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('クリックで状態がトグルする', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;

    // クリックでON
    checkbox.click();
    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(true);
    });

    // クリックでOFF
    checkbox.click();
    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(false);
    });
  });

  it('disabled時はクリックで状態が変わらない', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.click();

    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(false);
    });
  });

  it('Spaceキーで状態がトグルする', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    // Spaceキー押下
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    checkbox.dispatchEvent(spaceEvent);
    checkbox.click(); // キーボードイベントはclick()を発火させる

    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(true);
    });
  });

  it('Enterキーで状態がトグルする', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    // Enterキー押下
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    checkbox.dispatchEvent(enterEvent);

    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(true);
    });
  });

  it('ArrowRightキーでONになる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    // 初期状態: OFF
    expect(element.hasAttribute('checked')).toBe(false);

    // ArrowRightキー押下 → ON
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    checkbox.dispatchEvent(rightEvent);

    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(true);
    });
  });

  it('ArrowLeftキーでOFFになる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('checked', '');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    // 初期状態: ON
    expect(element.hasAttribute('checked')).toBe(true);

    // ArrowLeftキー押下 → OFF
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
    checkbox.dispatchEvent(leftEvent);

    await waitFor(() => {
      expect(element.hasAttribute('checked')).toBe(false);
    });
  });

  it('既にONの状態でArrowRightは変化なし', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('checked', '');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    let eventFired = false;
    element.addEventListener('dads-change', () => {
      eventFired = true;
    });

    // ArrowRightキー押下（既にONなので変化なし）
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    checkbox.dispatchEvent(rightEvent);

    // イベントが発火しないことを確認
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(eventFired).toBe(false);
    expect(element.hasAttribute('checked')).toBe(true);
  });

  it('既にOFFの状態でArrowLeftは変化なし', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.focus();

    let eventFired = false;
    element.addEventListener('dads-change', () => {
      eventFired = true;
    });

    // ArrowLeftキー押下（既にOFFなので変化なし）
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
    checkbox.dispatchEvent(leftEvent);

    // イベントが発火しないことを確認
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(eventFired).toBe(false);
    expect(element.hasAttribute('checked')).toBe(false);
  });
});

// ========== Phase 5: フォーム統合 ==========
describe('DadsSwitch - フォーム統合', () => {
  let element: HTMLElement;
  let form: HTMLFormElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
    if (form) {
      form.remove();
    }
  });

  it('valueプロパティで値を取得・設定できる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const component = element as unknown as { value: string };
    expect(component.value).toBe('on'); // デフォルト値

    component.value = 'custom-value';
    expect(component.value).toBe('custom-value');
  });

  it('disabled属性が内部checkboxに反映される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('disabled', '');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    expect(checkbox?.disabled).toBe(true);
  });

  it('name属性が内部checkboxに反映される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    element.setAttribute('name', 'toggle');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    expect(checkbox?.name).toBe('toggle');
  });
});

// ========== Phase 6: アクセシビリティ ==========
describe('DadsSwitch - アクセシビリティ', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('checkboxにrole="switch"が設定される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]');
    expect(checkbox?.getAttribute('role')).toBe('switch');
  });

  it('aria-checkedがchecked状態と同期する', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;

    // 初期状態: unchecked
    expect(checkbox?.getAttribute('aria-checked')).toBe('false');

    // クリックでON
    checkbox.click();
    await waitFor(() => {
      expect(checkbox?.getAttribute('aria-checked')).toBe('true');
    });

    // クリックでOFF
    checkbox.click();
    await waitFor(() => {
      expect(checkbox?.getAttribute('aria-checked')).toBe('false');
    });
  });

  it('フォーカスがcheckboxに委譲される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const component = element as unknown as { focus: () => void };
    component.focus();

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    expect(element.shadowRoot?.activeElement).toBe(checkbox);
  });
});

// ========== Phase 7: イベント ==========
describe('DadsSwitch - イベント', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('状態変更時にdads-changeイベントが発火する', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    const changeHandler = vi.fn();
    element.addEventListener('dads-change', changeHandler);

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.click();

    await waitFor(() => {
      expect(changeHandler).toHaveBeenCalled();
    });
  });

  it('dads-changeイベントにchecked状態が含まれる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = createTestElement('dads-switch');
    await waitForCustomElement(element);

    let eventDetail: { checked: boolean } | null = null;
    element.addEventListener('dads-change', (e) => {
      eventDetail = (e as CustomEvent).detail;
    });

    const checkbox = getShadowContent(element, '[part="checkbox"]') as HTMLInputElement;
    checkbox.click();

    await waitFor(() => {
      expect(eventDetail).not.toBeNull();
      expect(eventDetail?.checked).toBe(true);
    });
  });
});

// ========== Phase 8: ラベル ==========
describe('DadsSwitch - ラベル', () => {
  let element: HTMLElement;

  afterEach(() => {
    if (element) {
      cleanupTestElement(element);
    }
  });

  it('左ラベルスロットが表示される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = document.createElement('dads-switch');
    const leftLabel = document.createElement('span');
    leftLabel.slot = 'label-left';
    leftLabel.textContent = 'OFF';
    element.appendChild(leftLabel);
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const slottedContent = element.querySelector('[slot="label-left"]');
    expect(slottedContent?.textContent).toBe('OFF');
  });

  it('右ラベルスロットが表示される', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = document.createElement('dads-switch');
    const rightLabel = document.createElement('span');
    rightLabel.slot = 'label-right';
    rightLabel.textContent = 'ON';
    element.appendChild(rightLabel);
    document.body.appendChild(element);
    await waitForCustomElement(element);

    const slottedContent = element.querySelector('[slot="label-right"]');
    expect(slottedContent?.textContent).toBe('ON');
  });

  it('両方のラベルを表示できる', async () => {
    const { defineSwitch } = await import('./switch-define');
    defineSwitch();

    element = document.createElement('dads-switch');

    const leftLabel = document.createElement('span');
    leftLabel.slot = 'label-left';
    leftLabel.textContent = 'ラベル';
    element.appendChild(leftLabel);

    const rightLabel = document.createElement('span');
    rightLabel.slot = 'label-right';
    rightLabel.textContent = 'ラベル';
    element.appendChild(rightLabel);

    document.body.appendChild(element);
    await waitForCustomElement(element);

    const leftContent = element.querySelector('[slot="label-left"]');
    const rightContent = element.querySelector('[slot="label-right"]');

    expect(leftContent?.textContent).toBe('ラベル');
    expect(rightContent?.textContent).toBe('ラベル');
  });
});
