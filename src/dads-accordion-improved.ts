/**
 * デジタル庁デザインシステム アコーディオンコンポーネント（改善版）
 * details/summary要素 + ::part() ベースの実装
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

/**
 * 親コンテナコンポーネント
 */
export class DadsAccordion extends WebComponent {
  #allowMultiple = false;

  static definition = {
    name: 'dads-accordion',
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
    
    // デフォルト値の設定
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
        const items = this.querySelectorAll('dads-accordion-item');
        items.forEach(item => {
          const details = item.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement;
          if (details && details !== e.target && details.open) {
            details.open = false;
          }
        });
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
 * 個別アイテムコンポーネント（簡潔版）
 */
export class DadsAccordionItem extends WebComponent {
  #details?: HTMLDetailsElement;

  static definition = {
    name: 'dads-accordion-item',
    template: html`
      <details part="details">
        <summary part="summary">
          <span part="icon">
            ${createIconSVG('arrowDown', 'icon-svg', 20)}
          </span>
          <span part="header">
            <slot name="header"></slot>
          </span>
        </summary>
        <div part="content">
          <slot name="content"></slot>
          <button part="return-button" type="button" aria-label="先頭に戻る">
            ${createIconSVG('returnArrow', 'return-icon', 24)}
            <span part="return-text">先頭に戻る</span>
          </button>
        </div>
      </details>
    `,
    styles: css`
      :host {
        display: block;
        border-bottom: 1px solid var(--color-border, #949494);
      }
      
      /* details/summary のリセット */
      [part="details"] { width: 100%; }
      [part="summary"] { 
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px 8px 0;
        user-select: none;
      }
      [part="summary"]::-webkit-details-marker { display: none; }
      
      /* フォーカススタイル（最小限） */
      [part="summary"]:focus {
        outline: 2px solid var(--color-focus, #ffd43d);
        outline-offset: 2px;
      }
      
      /* アイコンとコンテンツの基本レイアウト */
      [part="icon"] {
        display: inline-flex;
        width: 32px;
        height: 32px;
        padding: 6px;
        flex-shrink: 0;
      }
      
      [part="icon"] svg {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease;
      }
      
      details[open] [part="icon"] svg {
        transform: rotate(180deg);
      }
      
      [part="header"] { flex: 1; }
      
      [part="content"] {
        padding: 0 52px 24px;
      }
      
      [part="return-button"] {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        font: inherit;
      }
      
      details:not([open]) [part="return-button"] {
        display: none;
      }
      
      /* アニメーション（シンプル版） */
      :host-context([animation="smooth"]) [part="content"] {
        animation: fadeIn 300ms ease-out;
      }
      
      :host-context([animation="none"]) * {
        animation: none !important;
        transition: none !important;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* 無効化状態 */
      :host([disabled]) [part="summary"] {
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
      }
    `,
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
    
    // 先頭に戻るボタン
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
DadsAccordion.define();
DadsAccordionItem.define();