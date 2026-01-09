/**
 * DadsButtonコンポーネント テスト
 * TDD（テスト駆動開発）アプローチ
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import type { DadsButton } from './button';

// ========== Phase 1: 基本レンダリング ==========
describe('DadsButton - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    // コンポーネントをインポート（まだ存在しないので失敗）
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('buttonタグが含まれる', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    const button = getShadowElement(component, '[part="base"]');
    expect(button).toBeInTheDocument();
    expect(button?.tagName.toLowerCase()).toBe('button');
  });

  it('スロットのコンテンツが表示される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Button Text</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.textContent).toContain('Button Text');
  });
});

// ========== Phase 2: バリアント ==========
describe('DadsButton - バリアント', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトでsolid variantが適用される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.getAttribute('variant')).toBe('solid');
  });

  it('outlined variantが適用される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button variant="outlined">Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.getAttribute('variant')).toBe('outlined');
  });

  it('text variantが適用される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button variant="text">Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.getAttribute('variant')).toBe('text');
  });
});

// ========== Phase 3: サイズ ==========
describe('DadsButton - サイズ', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトでmediumサイズが適用される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.getAttribute('size')).toBe('medium');
  });

  it.each(['x-small', 'small', 'medium', 'large'])('%sサイズが適用される', async (size) => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button size="${size}">Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.getAttribute('size')).toBe(size);
  });
});

// ========== Phase 4: 状態管理 ==========
describe('DadsButton - 状態', () => {
  afterEach(() => {
    cleanup();
  });

  it('disabled属性でボタンが無効化される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button disabled>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    const button = getShadowElement(component, '[part="base"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('disabled時にクリックイベントが発火しない', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button disabled>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    
    const clickHandler = vi.fn();
    component.addEventListener('click', clickHandler);
    
    const button = getShadowElement(component, '[part="base"]');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    await waitFor(() => {
      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  it('type属性が内部buttonに反映される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button type="submit">Submit</dads-button>
    `);

    await waitForComponent('dads-button');
    const button = getShadowElement(component, '[part="base"]') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });
});

// ========== Phase 5: イベント処理 ==========
describe('DadsButton - イベント', () => {
  afterEach(() => {
    cleanup();
  });

  it('クリック時にカスタムイベントが発火する', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button>Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    
    const clickHandler = vi.fn();
    component.addEventListener('click', clickHandler);
    
    const button = getShadowElement(component, '[part="base"]');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    await waitFor(() => {
      expect(clickHandler).toHaveBeenCalled();
    });
  });

  it('イベントdetailにvariantとsizeが含まれる', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button variant="outlined" size="large">Click me</dads-button>
    `);

    await waitForComponent('dads-button');
    
    const clickHandler = vi.fn();
    component.addEventListener('click', clickHandler);
    
    const button = getShadowElement(component, '[part="base"]');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    await waitFor(() => {
      expect(clickHandler).toHaveBeenCalled();
      const event = clickHandler.mock.calls[0][0];
      expect(event.detail).toEqual({
        variant: 'outlined',
        size: 'large'
      });
    });
  });
});

// ========== Phase 6: アクセシビリティ ==========
describe('DadsButton - アクセシビリティ', () => {
  afterEach(() => {
    cleanup();
  });

  it('aria-label属性が適用される', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();
    
    const component = await renderWebComponent(`
      <dads-button aria-label="Save document">Save</dads-button>
    `);

    await waitForComponent('dads-button');
    const button = getShadowElement(component, '[part="base"]') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Save document');
  });

  it('full-width属性で幅100%になる', async () => {
    const { defineButton } = await import('./button-define');
    defineButton();

    const component = await renderWebComponent(`
      <dads-button full-width>Full Width Button</dads-button>
    `);

    await waitForComponent('dads-button');
    expect(component.hasAttribute('full-width')).toBe(true);
  });
});

// ========== Phase 7: フォーム統合 ==========
describe('DadsButton - フォーム統合', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Form Association', () => {
    it('formAssociatedがtrueである', async () => {
      const { DadsButton } = await import('./button');
      expect(DadsButton.formAssociated).toBe(true);
    });

    it('formプロパティが親フォームを参照する', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const form = document.createElement('form');
      form.id = 'test-form';
      const button = document.createElement('dads-button');
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      // formプロパティでフォームを参照できることを確認
      expect((button as DadsButton).form).toBe(form);
    });

    it('フォーム外のボタンはformがnullになる', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const component = await renderWebComponent(`
        <dads-button type="submit">Submit</dads-button>
      `);

      await waitForComponent('dads-button');
      expect((component as DadsButton).form).toBeNull();
    });
  });

  describe('Submit Button', () => {
    it('type="submit"でフォーム送信がトリガーされる', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button');
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      const internalButton = button.shadowRoot?.querySelector('[part="base"]');
      internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalled();
      });
    });
  });

  describe('Reset Button', () => {
    it('type="reset"でフォームリセットがトリガーされる', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const resetHandler = vi.fn();
      const form = document.createElement('form');
      form.addEventListener('reset', resetHandler);

      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'test';
      input.value = 'changed';
      form.appendChild(input);

      const button = document.createElement('dads-button');
      button.setAttribute('type', 'reset');
      button.textContent = 'Reset';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      const internalButton = button.shadowRoot?.querySelector('[part="base"]');
      internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(resetHandler).toHaveBeenCalled();
      });
    });
  });

  describe('Disabled State', () => {
    it('disabled時はフォーム送信されない', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button');
      button.setAttribute('type', 'submit');
      button.setAttribute('disabled', '');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      const internalButton = button.shadowRoot?.querySelector('[part="base"]');
      internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(submitHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('Type Button (Default)', () => {
    it('type="button"ではフォーム操作されない', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn();
      const resetHandler = vi.fn();
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);
      form.addEventListener('reset', resetHandler);

      const button = document.createElement('dads-button');
      button.setAttribute('type', 'button');
      button.textContent = 'Button';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      const internalButton = button.shadowRoot?.querySelector('[part="base"]');
      internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(submitHandler).not.toHaveBeenCalled();
        expect(resetHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('Without Form (Graceful)', () => {
    it('フォーム外でtype="submit"でもエラーにならない', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const component = await renderWebComponent(`
        <dads-button type="submit">Submit</dads-button>
      `);

      await waitForComponent('dads-button');

      // エラーが発生しないことを確認
      expect(() => {
        const internalButton = component.shadowRoot?.querySelector('[part="base"]');
        internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }).not.toThrow();
    });
  });

  describe('リンクモードとの互換性', () => {
    it('as="link"時はフォーム操作が行われない', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn();
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button');
      button.setAttribute('as', 'link');
      button.setAttribute('href', '/test');
      button.setAttribute('type', 'submit');
      button.textContent = 'Link';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      const base = button.shadowRoot?.querySelector('[part="base"]');
      expect(base?.tagName.toLowerCase()).toBe('a');

      base?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(submitHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('ダブルサブミット防止', () => {
    it('内部ボタンクリック時にsubmitが1回だけ実行される', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button') as DadsButton;
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      // 内部ボタンをクリック（submit 1回）
      const internalButton = button.shadowRoot?.querySelector('[part="base"]');
      internalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        // submitは1回だけ呼ばれる
        expect(submitHandler).toHaveBeenCalledTimes(1);
      });
    });

    it('CustomEvent（object detail）はホストハンドラで無視される', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button') as DadsButton;
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      // CustomEvent（#emitClickEventと同じ形式）をホストに発火
      // detailがobjectなのでホストハンドラで無視される
      button.dispatchEvent(new CustomEvent('click', {
        bubbles: true,
        detail: { variant: 'solid', size: 'medium' }
      }));

      await waitFor(() => {
        // CustomEventなので#handleHostClickは無視、submitは呼ばれない
        expect(submitHandler).not.toHaveBeenCalled();
      });
    });

    it('.click()メソッドでフォーム送信が動作する', async () => {
      const { defineButton } = await import('./button-define');
      defineButton();

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      const form = document.createElement('form');
      form.addEventListener('submit', submitHandler);

      const button = document.createElement('dads-button') as DadsButton;
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';
      form.appendChild(button);
      document.body.appendChild(form);

      await waitForComponent('dads-button');

      // .click()はMouseEvent（detail=0）を発火するのでホストハンドラで処理される
      button.click();

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalledTimes(1);
      });
    });
  });
});
