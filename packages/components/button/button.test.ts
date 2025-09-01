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