/**
 * dads-text コンポーネント
 * デジタル庁タイポグラフィシステムの基本テキストコンポーネント
 * Shape Up Week 1: 最小限の実装
 */
import { html, css, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { typographyTokens, type TypographyVariant, type TypographySize, type TypographyWeight } from '../../styles/design-tokens/typography-tokens.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';

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
      PropertyAttr('variant'),
      PropertyAttr('size'),
      PropertyAttr('weight'),
      PropertyAttr('display')
    ]
  };

  declare variant: TypographyVariant;
  declare size: TypographySize | null;
  declare weight: TypographyWeight | null;
  declare display: 'inline' | 'block';

  connectedCallback() {
    super.connectedCallback();

    setDefaultAttributes(this, { variant: 'standard', display: 'inline' });
  }

  variantChanged(_oldValue: string | null, newValue: string | null): void {
    const validVariants: TypographyVariant[] = ['standard', 'display', 'dense'];

    if (newValue === null || !validVariants.includes(newValue as TypographyVariant)) {
      if (this.getAttribute('variant') !== 'standard') {
        this.setAttribute('variant', 'standard');
      }
    }
  }

  sizeChanged(_oldValue: string | null, newValue: string | null): void {
    const validSizes: TypographySize[] = ['16', '20', '32'];

    if (newValue === null) return;
    if (!validSizes.includes(newValue as TypographySize)) {
      this.removeAttribute('size');
    }
  }

  weightChanged(_oldValue: string | null, newValue: string | null): void {
    const validWeights: TypographyWeight[] = ['normal', 'bold'];

    if (newValue === null) return;
    if (!validWeights.includes(newValue as TypographyWeight)) {
      this.removeAttribute('weight');
    }
  }

  displayChanged(_oldValue: string | null, newValue: string | null): void {
    if (newValue === null || (newValue !== 'inline' && newValue !== 'block')) {
      if (this.getAttribute('display') !== 'inline') {
        this.setAttribute('display', 'inline');
      }
    }
  }
}

DadsText.define();
