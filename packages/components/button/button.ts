/**
 * @module button
 * デジタル庁デザインシステム Buttonコンポーネント
 * @version 1.0.0
 */

import { 
  WebComponentDefinition,
  html, 
  css,
  BooleanAttr, 
  PropertyAttr 
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
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
export class DadsButton extends TypographyWebComponent {

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
      applyDADSFocusStyles(),
      css`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Mono&display=swap');`
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
      PropertyAttr('type'),
      BooleanAttr('full-width'),
      PropertyAttr('aria-label'),
      PropertyAttr('as'),
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('download')
    ]
  };

  connectedCallback() {
    super.connectedCallback();
    
    // デフォルト属性の設定
    const defaults = { variant: 'solid', size: 'medium' };
    for (const [attr, value] of Object.entries(defaults)) {
      if (!this.hasAttribute(attr)) this.setAttribute(attr, value);
    }
    
    // リンクの場合のみテンプレートを再レンダリング
    if (this.#isLink()) {
      this.#renderTemplate();
    }
    
    // ボタン要素の初期化
    this.#initButton();
  }
  
  #isLink(): boolean {
    const as = this.getAttribute('as');
    // 明示的な指定があればそれに従う
    if (as === 'link' || as === 'a') return true;
    if (as === 'button') return false;
    // hrefがあればリンクと判定
    return this.hasAttribute('href');
  }
  
  #renderTemplate() {
    if (!this.shadowRoot) return;
    
    const isLink = this.#isLink();
    const template = isLink ? this.#createLinkTemplate() : this.#createButtonTemplate();
    
    // Shadow DOMの内容を更新
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  #createButtonTemplate(): HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = `
      <button 
        part="base"
        type="${this.getAttribute('type') || 'button'}"
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
    `;
    return template;
  }
  
  #createLinkTemplate(): HTMLTemplateElement {
    const template = document.createElement('template');
    const href = this.getAttribute('href') || '#';
    const target = this.getAttribute('target') || '_self';
    const rel = this.getAttribute('rel') || '';
    const download = this.hasAttribute('download');
    
    template.innerHTML = `
      <a 
        part="base"
        href="${href}"
        ${target ? `target="${target}"` : ''}
        ${rel ? `rel="${rel}"` : ''}
        ${download ? 'download' : ''}
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
      </a>
    `;
    return template;
  }

  #initButton() {
    const base = this.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
    if (!base) return;
    
    const isLink = this.#isLink();
    
    if (!isLink) {
      // button要素の場合
      const button = base as HTMLButtonElement;
      button.type = (this.getAttribute('type') || 'button') as 'button' | 'submit' | 'reset';
      button.disabled = this.hasAttribute('disabled');
    }
    // a要素の場合はdisabled処理不要
    
    // 共通属性
    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel) base.setAttribute('aria-label', ariaLabel);
    
    // イベントリスナー
    base.addEventListener('click', this.#handleClick);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    // as属性やhref属性が変更された場合は再レンダリングが必要
    if (name === 'as' || name === 'href') {
      this.#renderTemplate();
      this.#initButton();
      return;
    }
    
    const base = this.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
    if (!base) return;
    
    const isLink = this.#isLink();
    
    switch (name) {
      case 'type':
        if (!isLink && base instanceof HTMLButtonElement) {
          base.type = (newValue || 'button') as 'button' | 'submit' | 'reset';
        }
        break;
      case 'disabled':
        // button要素のみdisabled処理（a要素は無視）
        if (!isLink && base instanceof HTMLButtonElement) {
          base.disabled = this.hasAttribute('disabled');
        }
        break;
      case 'target':
      case 'rel':
        if (isLink && base instanceof HTMLAnchorElement) {
          if (newValue) base.setAttribute(name, newValue);
          else base.removeAttribute(name);
        }
        break;
      case 'download':
        if (isLink && base instanceof HTMLAnchorElement) {
          if (this.hasAttribute('download')) base.setAttribute('download', '');
          else base.removeAttribute('download');
        }
        break;
      case 'aria-label':
        if (newValue) base.setAttribute('aria-label', newValue);
        else base.removeAttribute('aria-label');
        break;
    }
  }

  #handleClick = (event: MouseEvent) => {
    // button要素でdisabled時はイベントを止める（a要素は通常通り動作）
    if (!this.#isLink() && this.hasAttribute('disabled')) {
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