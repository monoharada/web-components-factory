/**
 * @module button
 * デジタル庁デザインシステム Buttonコンポーネント
 * @version 1.0.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
  DelegatingPropertyAttr
} from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { buttonTokens } from '../../styles/design-tokens/button-tokens.js';
import { buttonStyles } from './button-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';

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
 * @attr {string} command - command-store / commandfor 用（任意、動作は外部に委ねる）
 * @attr {string} commandfor - command-store / commandfor 用（任意、動作は外部に委ねる）
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
export class DadsButton extends TypographyFormComponent {
  static override readonly formAssociated = true;

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
      applySpacingTokens(),
      buttonTokens,
      buttonStyles,
      applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
      PropertyAttr('type'),
      BooleanAttr('full-width'),
      PropertyAttr('aria-label'),
      DelegatingPropertyAttr('[part="base"]', 'command'),
      DelegatingPropertyAttr('[part="base"]', 'commandfor'),
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
    setDefaultAttributes(this, { variant: 'solid', size: 'medium' });

    // リンクの場合のみテンプレートを再レンダリング
    if (this.#isLink()) {
      this.#renderTemplate();
    }

    // ボタン要素の初期化
    this.#initButton();
    this.transferDelegatedAttributes();

    // ホスト要素へのクリックリスナー追加
    // Shadow DOM内のbutton要素に加えて、ホスト要素自体のクリックも処理
    // これにより遅延ロード時のクリックも確実に処理される
    this.addEventListener('click', this.#handleHostClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleHostClick);
  }

  /**
   * ホスト要素のクリックハンドラ
   * Shadow DOM内のbutton要素のクリックがない場合（遅延ロード中）のフォールバック
   */
  #handleHostClick = (event: MouseEvent) => {
    // #emitClickEventのCustomEventはobject detail({ variant, size })
    // ネイティブMouseEventはnumber detail（クリック回数、.click()は0）
    // これにより.click()は許可しつつ、#handleClickとの二重実行を防ぐ
    if (typeof event.detail !== 'number') return;

    // リンクモードはスキップ（aタグのデフォルト動作に任せる）
    if (this.#isLink()) return;

    // disabled時は何もしない
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Shadow DOM内のボタンがクリックされた場合は、内部ハンドラに任せる
    // （二重実行を防ぐ）
    const composedPath = event.composedPath();
    const innerButton = this.shadowRoot?.querySelector('[part="base"]');
    if (innerButton && composedPath.includes(innerButton)) {
      // 内部ボタンがクリックされた → #handleClick で処理される
      return;
    }

    // 内部ボタン以外（ホスト要素の境界部分など）がクリックされた場合
    // または遅延ロード中で内部ボタンがない場合
    this.#handleFormAction();
  };
  
  #isLink(): boolean {
    const as = this.getAttribute('as');
    // 明示的な指定があればそれに従う
    if (as === 'link' || as === 'a') return true;
    if (as === 'button') return false;
    // hrefがあればリンクと判定
    return this.hasAttribute('href');
  }
  
  #renderTemplate(): void {
    if (!this.shadowRoot) return;

    const template = this.#createTemplate(this.#isLink());
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  #createTemplate(isLink: boolean): HTMLTemplateElement {
    const template = document.createElement('template');
    const innerContent = `
      <span part="icon-start"><slot name="icon-start"></slot></span>
      <span part="label"><slot></slot></span>
      <span part="icon-end"><slot name="icon-end"></slot></span>
    `;

    if (isLink) {
      const href = this.getAttribute('href') || '#';
      const target = this.getAttribute('target');
      const rel = this.getAttribute('rel');
      const download = this.hasAttribute('download');
      template.innerHTML = `
        <a part="base" href="${href}"${target ? ` target="${target}"` : ''}${rel ? ` rel="${rel}"` : ''}${download ? ' download' : ''}>
          ${innerContent}
        </a>
      `;
    } else {
      template.innerHTML = `
        <button part="base" type="${this.getAttribute('type') || 'button'}">
          ${innerContent}
        </button>
      `;
    }
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
      this.transferDelegatedAttributes();
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
    // リンクモードは既存処理のみ
    if (this.#isLink()) {
      this.#emitClickEvent();
      return;
    }

    // button要素でdisabled時はイベントを止める
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // フォーム操作を実行
    this.#handleFormAction();

    // カスタムイベントを発火
    this.#emitClickEvent();
  };

  /**
   * フォーム操作を実行
   * type属性に応じてフォーム送信またはリセットをトリガー
   *
   * @remarks
   * デフォルトは'button'であり、ネイティブHTML `<button>`のデフォルト('submit')とは
   * 異なります。これは意図しないフォーム送信を防ぐための設計上の決定です。
   */
  #handleFormAction() {
    const form = this._internals.form;
    if (!form) return;

    const buttonType = this.getAttribute('type') || 'button';
    switch (buttonType) {
      case 'submit':
        // カスタムバリデーションはsubmitイベントハンドラで処理されるため、
        // reportValidity()は呼ばない（ネイティブバリデーションとの干渉を防ぐ）
        // フォームにnovalidate属性がある場合や、カスタムWeb Componentsを使用する場合に対応
        form.requestSubmit();
        break;
      case 'reset':
        form.reset();
        break;
      // 'button'タイプは何もしない
    }
  }

  /**
   * カスタムclickイベントを発火
   */
  #emitClickEvent() {
    this.dispatchEvent(new CustomEvent('click', {
      detail: {
        variant: this.getAttribute('variant') || 'solid',
        size: this.getAttribute('size') || 'medium'
      },
      bubbles: true,
      composed: true
    }));
  }
}
