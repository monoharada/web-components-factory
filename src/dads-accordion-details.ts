/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * details/summary要素 + ::part()ベースの実装
 * @version 3.0.0
 */

import { 
  WebComponent, 
  html, 
  css, 
  BooleanAttr, 
  PropertyAttr 
} from '../web-components';
import { 
  generateCSSVariables,
  createIconSVG
} from './design-tokens';
import { accordionItemStyles } from './dads-accordion-styles';

/**
 * アコーディオンコンテナコンポーネント
 */
export class DadsAccordionDetails extends WebComponent {
  #allowMultiple = false;

  static definition = {
    name: 'dads-accordion-details',
    template: html`
      <div part="container" role="group">
        <slot></slot>
      </div>
    `,
    styles: css`
      :host {
        display: block;
        width: 100%;
        ${generateCSSVariables()}
      }
    `,
    attributes: [
      BooleanAttr('allow-multiple'),
      PropertyAttr('animation'),
      BooleanAttr('respect-motion-preference')
    ]
  };

  connectedCallback() {
    super.connectedCallback();
    
    // デフォルト設定
    if (!this.hasAttribute('animation')) {
      this.setAttribute('animation', 'none');
    }
    
    // モーション設定の尊重
    if (this.hasAttribute('respect-motion-preference')) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        this.setAttribute('animation', 'none');
      }
    }
    
    // 単一展開モードの処理
    this.addEventListener('toggle', (e: Event) => {
      if (!this.#allowMultiple && (e.target as HTMLDetailsElement)?.open) {
        const items = this.querySelectorAll('dads-accordion-item-details');
        for (const item of items) {
          const details = item.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement;
          if (details && details !== e.target && details.open) {
            details.open = false;
          }
        }
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'allow-multiple') {
      this.#allowMultiple = newValue !== null;
    }
  }
}

/**
 * アコーディオンアイテムコンポーネント
 */
export class DadsAccordionItemDetails extends WebComponent {
  #details?: HTMLDetailsElement;

  static definition = {
    name: 'dads-accordion-item-details',
    template: html`
      <details part="details">
        <summary part="summary">
          <span part="icon" aria-hidden="true">
            ${createIconSVG('arrowDown', 'icon-svg', 20)}
          </span>
          <span part="header">
            <slot name="header"></slot>
          </span>
        </summary>
        <div part="content">
          <div part="content-inner">
            <slot name="content"></slot>
            <button 
              part="return-button"
              type="button"
              aria-label="先頭に戻る"
            >
              ${createIconSVG('returnArrow', 'return-icon', 24)}
              <span part="return-text">先頭に戻る</span>
            </button>
          </div>
        </div>
      </details>
    `,
    styles: accordionItemStyles,
    attributes: [
      BooleanAttr('expanded'),
      BooleanAttr('disabled'),
      PropertyAttr('icon-position')
    ]
  };

  connectedCallback() {
    super.connectedCallback();
    
    this.#details = this.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement;
    
    // 初期状態の設定
    if (this.hasAttribute('expanded')) {
      this.#details.open = true;
    }
    
    // イベント設定
    this.#details?.addEventListener('toggle', () => {
      this.dispatchEvent(new Event('toggle', { bubbles: true }));
    });
    
    // 戻るボタン
    const returnBtn = this.shadowRoot?.querySelector('[part="return-button"]');
    returnBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const summary = this.shadowRoot?.querySelector('[part="summary"]') as HTMLElement;
      summary?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      summary?.focus();
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (!this.#details) return;
    
    if (name === 'expanded') {
      this.#details.open = newValue !== null;
    } else if (name === 'disabled') {
      this.#details.toggleAttribute('disabled', newValue !== null);
    }
  }
  
  // Public API
  toggle() { this.#details && (this.#details.open = !this.#details.open); }
  expand() { this.#details && (this.#details.open = true); }
  collapse() { this.#details && (this.#details.open = false); }
}

// コンポーネントの登録
DadsAccordionDetails.define();
DadsAccordionItemDetails.define();