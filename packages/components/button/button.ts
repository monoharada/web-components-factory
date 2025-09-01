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
import { buttonTokens } from '../../styles/design-tokens/button-tokens.js';
import { buttonStyles } from './button-styles.js';
import { withReset } from '../../styles/reset-css.js';

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
      applyDADSTokens(),  // デザイントークン（プリミティブカラー等）
      buttonTokens,       // ボタン用トークン（セマンティック＋ローカル）
      buttonStyles        // ボタンスタイル定義
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