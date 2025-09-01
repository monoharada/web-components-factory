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

  static definition = {
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
      buttonTokens,
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
    
    // デフォルト属性の設定
    const defaults = { variant: 'solid', size: 'medium', type: 'button' };
    for (const [attr, value] of Object.entries(defaults)) {
      if (!this.hasAttribute(attr)) this.setAttribute(attr, value);
    }
    
    // ボタン要素の初期化
    this.#initButton();
  }

  #initButton() {
    const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
    if (!button) return;
    
    // 属性の反映
    button.type = (this.getAttribute('type') || 'button') as 'button' | 'submit' | 'reset';
    
    // Disabled状態でもフォーカス可能にするため、disabled属性は設定しない
    // 代わりにaria-disabledを使用
    if (this.hasAttribute('disabled')) {
      button.setAttribute('aria-disabled', 'true');
      button.removeAttribute('disabled');
    } else {
      button.removeAttribute('aria-disabled');
    }
    
    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
    
    // イベントリスナー
    button.addEventListener('click', this.#handleClick);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    const button = this.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
    if (!button) return;
    
    switch (name) {
      case 'type':
        button.type = (newValue || 'button') as 'button' | 'submit' | 'reset';
        break;
      case 'disabled':
        // Disabled状態でもフォーカス可能にするため、disabled属性は設定しない
        if (this.hasAttribute('disabled')) {
          button.setAttribute('aria-disabled', 'true');
          button.removeAttribute('disabled');
        } else {
          button.removeAttribute('aria-disabled');
        }
        break;
      case 'aria-label':
        if (newValue) button.setAttribute('aria-label', newValue);
        else button.removeAttribute('aria-label');
        break;
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
    this.dispatchEvent(new CustomEvent('click', {
      detail: { 
        variant: this.getAttribute('variant') || 'solid', 
        size: this.getAttribute('size') || 'medium'
      },
      bubbles: true,
      composed: true
    }));
  };
}