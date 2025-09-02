/**
 * dads-text コンポーネント
 * デジタル庁タイポグラフィシステムの基本テキストコンポーネント
 * Shape Up Week 1: 最小限の実装
 */
import { html, css } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { typographyTokens, type TypographyVariant, type TypographySize, type TypographyWeight } from '../../styles/design-tokens/typography-tokens.js';

export class DadsText extends TypographyWebComponent {
  static definition = {
    name: 'dads-text',
    template: html`
      <span part="text">
        <slot></slot>
      </span>
    `,
    styles: [
      typographyTokens,
      css`
        :host {
          display: inline;
          font-family: var(--dads-text-font-family);
          font-size: var(--dads-text-font-size);
          font-weight: var(--dads-text-font-weight);
          line-height: var(--dads-text-line-height);
          color: var(--dads-text-color);
          letter-spacing: var(--dads-text-letter-spacing);
          text-align: var(--dads-text-text-align);
        }
        
        :host([display="block"]) {
          display: block;
        }
        
        [part="text"] {
          display: contents;
        }
      `
    ],
    attributes: [
      'variant',
      'size', 
      'weight',
      'display'
    ]
  };

  #variant: TypographyVariant = 'standard';
  #size: TypographySize | null = null;
  #weight: TypographyWeight | null = null;
  #display: 'inline' | 'block' = 'inline';

  get variant(): TypographyVariant {
    return this.#variant;
  }

  set variant(value: TypographyVariant | string) {
    const validVariants: TypographyVariant[] = ['standard', 'display', 'dense'];
    if (value && validVariants.includes(value as TypographyVariant)) {
      this.#variant = value as TypographyVariant;
      this.setAttribute('variant', value);
    } else {
      // 無効な値の場合はデフォルトに戻す
      this.#variant = 'standard';
      this.setAttribute('variant', 'standard');
    }
  }

  get size(): TypographySize | null {
    return this.#size;
  }

  set size(value: TypographySize | string | null) {
    const validSizes: TypographySize[] = ['16', '20', '32'];
    if (value === null) {
      this.#size = null;
      this.removeAttribute('size');
    } else if (validSizes.includes(value as TypographySize)) {
      this.#size = value as TypographySize;
      this.setAttribute('size', value);
    }
  }

  get weight(): TypographyWeight | null {
    return this.#weight;
  }

  set weight(value: TypographyWeight | string | null) {
    const validWeights: TypographyWeight[] = ['normal', 'bold'];
    if (value === null) {
      this.#weight = null;
      this.removeAttribute('weight');
    } else if (validWeights.includes(value as TypographyWeight)) {
      this.#weight = value as TypographyWeight;
      this.setAttribute('weight', value);
    }
  }

  get display(): 'inline' | 'block' {
    return this.#display;
  }

  set display(value: 'inline' | 'block' | string) {
    if (value === 'block' || value === 'inline') {
      this.#display = value;
      this.setAttribute('display', value);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    
    const variantAttr = this.getAttribute('variant');
    if (variantAttr) {
      this.variant = variantAttr;
    } else {
      this.setAttribute('variant', 'standard');
    }
    
    const sizeAttr = this.getAttribute('size');
    if (sizeAttr) {
      this.size = sizeAttr;
    }
    
    const weightAttr = this.getAttribute('weight');
    if (weightAttr) {
      this.weight = weightAttr;
    }
    
    const displayAttr = this.getAttribute('display');
    if (displayAttr) {
      this.display = displayAttr;
    } else {
      this.setAttribute('display', 'inline');
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    switch (name) {
      case 'variant':
        if (newValue) this.variant = newValue;
        break;
      case 'size':
        this.size = newValue;
        break;
      case 'weight':
        this.weight = newValue;
        break;
      case 'display':
        if (newValue) this.display = newValue;
        break;
    }
  }
}

DadsText.define();