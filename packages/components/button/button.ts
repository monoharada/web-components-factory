/**
 * @module button
 * デジタル庁デザインシステム Buttonコンポーネント
 * @version 1.0.0
 */

import { 
  WebComponent, 
  html, 
  css,
  BooleanAttr, 
  PropertyAttr 
} from '../../core/web-components.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { buttonStyles } from './button-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';

/**
 * Buttonコンポーネント
 * 
 * @customElement dads-button
 * @tagname dads-button
 * 
 * @slot default - ボタンのテキストコンテンツ
 * @slot icon-start - 先頭アイコン（オプション）
 * @slot icon-end - 末尾アイコン（オプション）
 * 
 * @csspart base - ボタン要素本体
 * @csspart icon-start - 先頭アイコンコンテナ
 * @csspart label - ラベルテキストコンテナ
 * @csspart icon-end - 末尾アイコンコンテナ
 * 
 * @attr {string} variant - バリアント (solid | outlined | text)
 * @attr {string} size - サイズ (x-small | small | medium | large)
 * @attr {boolean} disabled - 無効化状態
 * @attr {string} type - ボタンタイプ (button | submit | reset)
 * @attr {boolean} full-width - 幅100%表示
 * @attr {string} aria-label - アクセシビリティラベル
 * 
 * @fires click - クリック時に発火（detail: {variant, size}）
 * 
 * @example
 * ```html
 * <dads-button variant="solid" size="medium">
 *   ボタンテキスト
 * </dads-button>
 * ```
 */
export class DadsButton extends WebComponent {
  #variant: string = 'solid';
  #size: string = 'medium';

  static override definition = {
    name: 'dads-button',
    template: html`
      <button 
        part="base"
        type="button"
      >
        <span part="icon-start">
          <slot name="icon-start"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="icon-end">
          <slot name="icon-end"></slot>
        </span>
      </button>
    `,
    styles: withReset([
      applyDADSTokens(),
      css`
        :host {
          /* ボタン用セマンティックトークン */
          --button-primary-bg: var(--color-primitive-blue-1000, #0017c1);
          --button-primary-bg-hover: var(--color-primitive-blue-1000, #00118f);
          --button-primary-bg-active: var(--color-primitive-blue-1200, #000060);
          --button-primary-text: var(--color-primitive-white, #ffffff);
          --button-primary-border: var(--color-primitive-blue-1000, #0017c1);
          
          --button-secondary-bg: var(--color-primitive-white, #ffffff);
          --button-secondary-bg-hover: var(--color-primitive-blue-200, #c5d7fb);
          --button-secondary-bg-active: var(--color-primitive-blue-300, #9db7f9);
          --button-secondary-text: var(--color-primitive-blue-1000, #0017c1);
          --button-secondary-text-active: var(--color-primitive-blue-1200, #000060);
          --button-secondary-border: var(--color-primitive-blue-1000, #0017c1);
          --button-secondary-border-hover: var(--color-primitive-blue-1000, #00118f);
          --button-secondary-border-active: var(--color-primitive-blue-1200, #000060);
          
          --button-tertiary-bg: transparent;
          --button-tertiary-bg-hover: var(--color-primitive-blue-50, #e8f1fe);
          --button-tertiary-bg-active: var(--color-primitive-blue-100, #d9e6ff);
          --button-tertiary-text: var(--color-primitive-blue-1000, #0017c1);
          --button-tertiary-text-hover: var(--color-primitive-blue-1000, #00118f);
          --button-tertiary-text-active: var(--color-primitive-blue-1200, #000060);
          --button-tertiary-border: transparent;
          
          /* ローカルコンポーネントトークン（デフォルトはprimary） */
          --dads-button-background: var(--button-primary-bg);
          --dads-button-background-hover: var(--button-primary-bg-hover);
          --dads-button-background-active: var(--button-primary-bg-active);
          --dads-button-color: var(--button-primary-text);
          --dads-button-border-color: var(--button-primary-border);
          --dads-button-border-width: 2px;
          --dads-button-border-radius: var(--border-radius-8, 0.5rem);
          
          /* サイズトークン */
          --dads-button-padding: 12px 24px;
          --dads-button-font-size: var(--font-size-16, 1rem);
          --dads-button-font-weight: var(--font-weight-700, 700);
          --dads-button-line-height: 1.25;
          --dads-button-min-height: 48px;
          
          /* その他のトークン */
          --dads-button-icon-size: 1.25em;
          --dads-button-icon-gap: 8px;
          --dads-button-transition: all 200ms ease;
          --dads-button-cursor: pointer;
          --dads-button-width: auto;
          
          /* フォーカススタイル用セマンティックトークン */
          --focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
          --focus-ring-width: 4px;
          --focus-outline-color: var(--color-neutral-black, #000000);
          --focus-outline-width: 4px;
        }
        
        /* バリアント別のトークン上書き */
        :host([variant="solid"]),
        :host([variant="primary"]) {
          --dads-button-background: var(--button-primary-bg);
          --dads-button-background-hover: var(--button-primary-bg-hover);
          --dads-button-background-active: var(--button-primary-bg-active);
          --dads-button-color: var(--button-primary-text);
          --dads-button-border-color: var(--button-primary-border);
        }
        
        :host([variant="outlined"]),
        :host([variant="secondary"]) {
          --dads-button-background: var(--button-secondary-bg);
          --dads-button-background-hover: var(--button-secondary-bg-hover);
          --dads-button-background-active: var(--button-secondary-bg-active);
          --dads-button-color: var(--button-secondary-text);
          --dads-button-border-color: var(--button-secondary-border);
          --dads-button-border-width: 1px;
        }
        
        :host([variant="text"]),
        :host([variant="tertiary"]) {
          --dads-button-background: var(--button-tertiary-bg);
          --dads-button-background-hover: var(--button-tertiary-bg-hover);
          --dads-button-background-active: var(--button-tertiary-bg-active);
          --dads-button-color: var(--button-tertiary-text);
          --dads-button-border-color: var(--button-tertiary-border);
          --dads-button-border-width: 0;
        }
        
        /* サイズ別のトークン上書き */
        :host([size="x-small"]) {
          --dads-button-padding: 8px 12px;
          --dads-button-font-size: 0.75rem;
          --dads-button-min-height: 44px;
        }
        
        :host([size="small"]) {
          --dads-button-padding: 8px 16px;
          --dads-button-font-size: var(--font-size-14, 0.875rem);
          --dads-button-min-height: 44px;
        }
        
        :host([size="large"]) {
          --dads-button-padding: 16px 32px;
          --dads-button-font-size: var(--font-size-18, 1.125rem);
          --dads-button-min-height: 56px;
        }
        
        /* 無効状態 */
        :host([disabled]) {
          --dads-button-background: var(--color-neutral-solid-gray-300, #b3b3b3);
          --dads-button-color: var(--color-neutral-solid-gray-600, #666666);
          --dads-button-border-color: var(--color-neutral-solid-gray-300, #b3b3b3);
          --dads-button-cursor: not-allowed;
          opacity: 0.5;
        }
        
        /* フルワイド */
        :host([full-width]) {
          --dads-button-width: 100%;
        }
      `,
      buttonStyles,
      applyDADSFocusStyles()
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
      PropertyAttr('type'),
      BooleanAttr('full-width'),
      PropertyAttr('aria-label')
    ]
  };

  connectedCallback() {
    super.connectedCallback();
    
    // デフォルト値の設定
    if (!this.hasAttribute('variant')) {
      this.setAttribute('variant', 'solid');
    }
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'medium');
    }
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'button');
    }
    
    // 値を保存
    this.#variant = this.getAttribute('variant') || 'solid';
    this.#size = this.getAttribute('size') || 'medium';
    
    // 初期属性の反映
    const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
    if (button) {
      button.type = (this.getAttribute('type') || 'button') as 'button' | 'submit' | 'reset';
      button.disabled = this.hasAttribute('disabled');
      const ariaLabel = this.getAttribute('aria-label');
      if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
      }
    }
    
    // イベントリスナーの設定
    button?.addEventListener('click', this.#handleClick.bind(this));
  }

  // disconnectedCallbackは基底クラスに存在しないため削除
  // イベントリスナーのクリーンアップは必要に応じて別の方法で実装

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (name === 'variant') {
      this.#variant = newValue || 'solid';
    } else if (name === 'size') {
      this.#size = newValue || 'medium';
    } else if (name === 'type') {
      const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
      if (button) {
        button.type = (newValue || 'button') as 'button' | 'submit' | 'reset';
      }
    } else if (name === 'disabled') {
      const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
      if (button) {
        button.disabled = this.hasAttribute('disabled');
      }
    } else if (name === 'aria-label') {
      const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
      if (button && newValue) {
        button.setAttribute('aria-label', newValue);
      }
    }
  }

  #handleClick = (event: MouseEvent) => {
    // disabled時はイベントを止める
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // カスタムイベントを発火
    const customEvent = new CustomEvent('click', {
      detail: { 
        variant: this.#variant, 
        size: this.#size 
      },
      bubbles: true,
      composed: true
    });
    
    this.dispatchEvent(customEvent);
  };
}