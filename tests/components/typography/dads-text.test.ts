/**
 * Tests for dads-text component
 */
import { describe, it, expect, beforeEach } from 'vitest';
import '../../../packages/components/typography/dads-text';
import type { DadsText } from '../../../packages/components/typography/dads-text';

describe('DadsText', () => {
  let element: DadsText;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = document.createElement('dads-text') as DadsText;
    document.body.appendChild(element);
  });

  it('コンポーネントが正しく作成される', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('dads-text');
  });

  it('デフォルトのvariantがstandardである', () => {
    expect(element.variant).toBe('standard');
    expect(element.getAttribute('variant')).toBe('standard');
  });

  it('variantを変更できる', () => {
    element.variant = 'display';
    expect(element.variant).toBe('display');
    expect(element.getAttribute('variant')).toBe('display');

    element.variant = 'dense';
    expect(element.variant).toBe('dense');
    expect(element.getAttribute('variant')).toBe('dense');
  });

  it('無効なvariantは無視される', () => {
    element.variant = 'invalid';
    expect(element.variant).toBe('standard');
  });

  it('sizeを設定できる', () => {
    element.size = '16';
    expect(element.size).toBe('16');
    expect(element.getAttribute('size')).toBe('16');

    element.size = '20';
    expect(element.size).toBe('20');

    element.size = '32';
    expect(element.size).toBe('32');
  });

  it('weightを設定できる', () => {
    element.weight = 'normal';
    expect(element.weight).toBe('normal');
    expect(element.getAttribute('weight')).toBe('normal');

    element.weight = 'bold';
    expect(element.weight).toBe('bold');
    expect(element.getAttribute('weight')).toBe('bold');
  });

  it('displayを設定できる', () => {
    expect(element.display).toBe('inline');
    
    element.display = 'block';
    expect(element.display).toBe('block');
    expect(element.getAttribute('display')).toBe('block');
  });

  it('slotでテキストを表示できる', () => {
    element.textContent = 'テストテキスト';
    const shadowRoot = element.shadowRoot;
    expect(shadowRoot).toBeDefined();
    
    const slot = shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('属性からの初期化が正しく動作する', () => {
    const newElement = document.createElement('dads-text') as DadsText;
    newElement.setAttribute('variant', 'display');
    newElement.setAttribute('size', '32');
    newElement.setAttribute('weight', 'bold');
    newElement.setAttribute('display', 'block');
    
    document.body.appendChild(newElement);
    
    expect(newElement.variant).toBe('display');
    expect(newElement.size).toBe('32');
    expect(newElement.weight).toBe('bold');
    expect(newElement.display).toBe('block');
  });
});