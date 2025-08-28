/**
 * デジタル庁デザインシステム アコーディオンアイテムコンポーネント
 * @version 1.0.0
 */

import { 
  WebComponent, 
  html, 
  css, 
  BooleanAttr, 
  PropertyAttr 
} from '../web-components';
import type { 
  IconPosition,
  DadsAccordionItemEventMap 
} from '../types/accordion';
import { 
  generateCSSVariables, 
  createIconSVG,
  mediaQueries,
  spacing,
  borders
} from './design-tokens';

/**
 * dads-accordion-item コンポーネント
 * 個別のアコーディオンアイテム
 */
export class DadsAccordionItem extends WebComponent {
  // プライベートフィールド
  #expanded = false;
  #disabled = false;
  #iconPosition: IconPosition = 'left';
  #animating = false;
  #contentHeight = 0;
  #uniqueId = `accordion-item-${Math.random().toString(36).slice(2)}`;

  static definition = {
    name: 'dads-accordion-item',
    template: html`
      <div class="accordion-item" role="group">
        <button 
          class="accordion-button"
          type="button"
          aria-expanded="false"
          aria-controls="content"
        >
          <span class="accordion-icon" aria-hidden="true">
            ${createIconSVG('arrowDown', 'accordion-icon-svg', 20)}
          </span>
          <span class="accordion-header">
            <slot name="header"></slot>
          </span>
        </button>
        <div 
          id="content"
          class="accordion-content"
          aria-hidden="true"
        >
          <div class="accordion-content-inner">
            <slot name="content"></slot>
            <button 
              class="accordion-return"
              type="button"
              aria-label="このセクションの先頭に戻る"
            >
              ${createIconSVG('returnArrow', 'return-icon', 24)}
              <span class="return-text">「<span class="header-text"></span>」の先頭に戻る</span>
            </button>
          </div>
        </div>
      </div>
    `,
    styles: css`
      :host {
        display: block;
        width: 100%;
        position: relative;
        border-bottom: ${borders.width.thin} solid var(--color-border);
        
        /* デザイントークンから生成されたCSS変数 */
        ${generateCSSVariables()}
      }
      
      * {
        box-sizing: border-box;
      }
      
      .accordion-item {
        width: 100%;
      }
      
      /* ボタンスタイル */
      .accordion-button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px 8px 0;
        border: none;
        background: transparent;
        font-family: inherit;
        font-size: var(--font-size, 18px);
        line-height: var(--line-height, 1.6);
        color: var(--color-text, #333333);
        cursor: pointer;
        text-align: left;
        position: relative;
        transition: background-color 0.2s ease;
      }
      
      /* ホバー状態 */
      .accordion-button:hover {
        background-color: var(--color-bg-hover, #f2f2f2);
      }
      
      /* フォーカス状態 */
      .accordion-button:focus {
        outline: none;
        position: relative;
      }
      
      .accordion-button:focus::before {
        content: '';
        position: absolute;
        inset: -4px;
        background-color: var(--color-focus, #ffd43d);
        border-radius: var(--border-radius-md, 8px);
        z-index: -1;
      }
      
      .accordion-button:focus::after {
        content: '';
        position: absolute;
        inset: -8px;
        border: 4px solid var(--color-focus-ring, #000000);
        border-radius: calc(var(--border-radius-md, 8px) + 4px);
        pointer-events: none;
      }
      
      /* アイコンコンテナ */
      .accordion-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        padding: 6px;
        background-color: var(--color-white, #ffffff);
        border: 1px solid var(--color-primary, #00118f);
        border-radius: var(--border-radius-full, 9999px);
        transition: transform 0.3s ease, border-width 0.15s ease;
      }
      
      /* ホバー時のアイコン */
      .accordion-button:hover .accordion-icon {
        border-width: 3px;
      }
      
      /* アイコンSVG */
      .accordion-icon-svg {
        width: 20px;
        height: 20px;
        color: var(--color-primary, #00118f);
        transition: transform 0.3s ease;
      }
      
      /* ヘッダー */
      .accordion-header {
        flex: 1;
        padding: 8px 0;
      }
      
      /* 展開時のアイコン回転 */
      :host([expanded]) .accordion-icon-svg {
        transform: rotate(180deg);
      }
      
      /* コンテンツエリア */
      .accordion-content {
        overflow: hidden;
        transition: height 0.3s ease, opacity 0.3s ease;
        height: 0;
        opacity: 0;
      }
      
      :host([expanded]) .accordion-content {
        height: auto;
        opacity: 1;
      }
      
      /* アニメーションなし */
      :host-context([animation="none"]) .accordion-content {
        transition: none;
      }
      
      :host-context([animation="none"]) .accordion-icon-svg {
        transition: none;
      }
      
      .accordion-content-inner {
        padding: 24px 0 24px 52px;
        font-size: 16px;
        line-height: 1.7;
        color: var(--color-text, #333333);
      }
      
      /* 先頭に戻るボタン */
      .accordion-return {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        padding: 0;
        border: none;
        background: none;
        color: var(--color-primary, #00118f);
        font-size: 16px;
        line-height: 1.7;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 20%;
      }
      
      .accordion-return:hover {
        opacity: 0.8;
      }
      
      .return-icon {
        width: 24px;
        height: 24px;
        color: var(--color-primary, #00118f);
      }
      
      /* 非表示状態 */
      :host([expanded="false"]) .accordion-return {
        display: none;
      }
      
      /* 無効化状態 */
      :host([disabled]) .accordion-button {
        cursor: not-allowed;
        opacity: 0.5;
      }
      
      :host([disabled]) .accordion-button:hover {
        background-color: transparent;
      }
      
      /* アイコン位置（右） */
      :host([icon-position="right"]) .accordion-button {
        flex-direction: row-reverse;
      }
      
      :host([icon-position="right"]) .accordion-content-inner {
        padding-left: 16px;
        padding-right: 52px;
      }
      
      /* モバイル対応 */
      @media (max-width: 768px) {
        .accordion-button {
          padding: 4px 8px 8px 0;
          font-size: 16px;
          line-height: 1.7;
        }
        
        .accordion-icon {
          width: 24px;
          height: 24px;
          padding: 2px;
        }
        
        .accordion-icon-svg {
          width: 16px;
          height: 16px;
        }
        
        .accordion-content-inner {
          padding: 16px 8px 16px 32px;
        }
        
        .accordion-button:focus::before {
          border-radius: var(--border-radius-sm, 4px);
        }
        
        .accordion-button:focus::after {
          border-radius: calc(var(--border-radius-sm, 4px) + 4px);
        }
        
        :host([icon-position="right"]) .accordion-content-inner {
          padding-left: 8px;
          padding-right: 32px;
        }
      }
      
      /* 高コントラストモード */
      @media (prefers-contrast: high) {
        .accordion-button {
          border: 2px solid ButtonText;
          color: ButtonText;
          background: ButtonFace;
        }
        
        .accordion-button:hover {
          border-color: Highlight;
          color: HighlightText;
          background: Highlight;
        }
        
        .accordion-icon {
          border-width: 2px;
        }
      }
      
      /* RTL対応 */
      :host-context([dir="rtl"]) .accordion-button {
        text-align: right;
        flex-direction: row-reverse;
      }
      
      :host-context([dir="rtl"]) .accordion-content-inner {
        padding-left: 16px;
        padding-right: 52px;
      }
      
      :host-context([dir="rtl"])[icon-position="right"] .accordion-button {
        flex-direction: row;
      }
      
      :host-context([dir="rtl"])[icon-position="right"] .accordion-content-inner {
        padding-left: 52px;
        padding-right: 16px;
      }
    `,
    attributes: [
      BooleanAttr('expanded'),
      BooleanAttr('disabled'),
      PropertyAttr('icon-position')
    ]
  };

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#initialize();
    this.#setupEventListeners();
    this.#updateHeaderText();
  }

  disconnectedCallback() {
    // super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    switch (name) {
      case 'expanded':
        this.#expanded = newValue !== null;
        this.#updateExpandedState();
        break;
      case 'disabled':
        this.#disabled = newValue !== null;
        this.#updateDisabledState();
        break;
      case 'icon-position':
        this.#iconPosition = (newValue as IconPosition) || 'left';
        break;
    }
  }

  /**
   * 初期化処理
   */
  #initialize() {
    // ユニークIDの設定
    const button = this.shadowRoot?.querySelector('.accordion-button') as HTMLButtonElement;
    const content = this.shadowRoot?.querySelector('.accordion-content') as HTMLDivElement;
    
    if (button && content) {
      const contentId = `${this.#uniqueId}-content`;
      button.setAttribute('aria-controls', contentId);
      content.setAttribute('id', contentId);
    }
    
    // 初期状態の設定
    this.#updateExpandedState();
    this.#updateDisabledState();
    
    // タブインデックスの設定
    this.setAttribute('tabindex', '-1');
  }

  /**
   * イベントリスナーの設定
   */
  #setupEventListeners() {
    const button = this.shadowRoot?.querySelector('.accordion-button');
    const returnButton = this.shadowRoot?.querySelector('.accordion-return');
    
    button?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this.#disabled) {
        this.toggle();
      }
    });
    
    returnButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.#scrollToTop();
    });
    
    // Enterキーとスペースキーの処理
    button?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.#disabled) return;
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * ヘッダーテキストの更新
   */
  #updateHeaderText() {
    const headerSlot = this.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
    const headerTextSpan = this.shadowRoot?.querySelector('.header-text') as HTMLSpanElement;
    
    if (headerSlot && headerTextSpan) {
      const updateText = () => {
        const assignedNodes = headerSlot.assignedNodes();
        const text = assignedNodes
          .map(node => node.textContent)
          .join('')
          .trim();
        headerTextSpan.textContent = text;
      };
      
      headerSlot.addEventListener('slotchange', updateText);
      updateText();
    }
  }

  /**
   * 展開状態の更新
   */
  #updateExpandedState() {
    const button = this.shadowRoot?.querySelector('.accordion-button') as HTMLButtonElement;
    const content = this.shadowRoot?.querySelector('.accordion-content') as HTMLDivElement;
    
    if (button) {
      button.setAttribute('aria-expanded', String(this.#expanded));
    }
    
    if (content) {
      content.setAttribute('aria-hidden', String(!this.#expanded));
    }
    
    // 展開アニメーションの処理
    if (this.#expanded) {
      this.#animateExpand();
    } else {
      this.#animateCollapse();
    }
  }

  /**
   * 無効化状態の更新
   */
  #updateDisabledState() {
    const button = this.shadowRoot?.querySelector('.accordion-button') as HTMLButtonElement;
    
    if (button) {
      button.disabled = this.#disabled;
      button.setAttribute('aria-disabled', String(this.#disabled));
    }
  }

  /**
   * 展開アニメーション
   */
  #animateExpand() {
    const content = this.shadowRoot?.querySelector('.accordion-content') as HTMLDivElement;
    if (!content) return;
    
    // アニメーション開始イベント
    this.#dispatchEvent('dads-accordion-item-animation-start', {
      animationType: this.#getAnimationType()
    });
    
    this.#animating = true;
    
    // アニメーション終了後の処理
    const onAnimationEnd = () => {
      this.#animating = false;
      this.#dispatchEvent('dads-accordion-item-animation-end', {
        animationType: this.#getAnimationType()
      });
      content.removeEventListener('transitionend', onAnimationEnd);
    };
    
    content.addEventListener('transitionend', onAnimationEnd);
  }

  /**
   * 折りたたみアニメーション
   */
  #animateCollapse() {
    const content = this.shadowRoot?.querySelector('.accordion-content') as HTMLDivElement;
    if (!content) return;
    
    // アニメーション開始イベント
    this.#dispatchEvent('dads-accordion-item-animation-start', {
      animationType: this.#getAnimationType()
    });
    
    this.#animating = true;
    
    // アニメーション終了後の処理
    const onAnimationEnd = () => {
      this.#animating = false;
      this.#dispatchEvent('dads-accordion-item-animation-end', {
        animationType: this.#getAnimationType()
      });
      content.removeEventListener('transitionend', onAnimationEnd);
    };
    
    content.addEventListener('transitionend', onAnimationEnd);
  }

  /**
   * アニメーションタイプの取得
   */
  #getAnimationType(): string {
    const accordion = this.closest('dads-accordion');
    return accordion?.getAttribute('animation') || 'none';
  }

  /**
   * 先頭にスクロール
   */
  #scrollToTop() {
    const button = this.shadowRoot?.querySelector('.accordion-button') as HTMLButtonElement;
    button?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    button?.focus();
  }

  /**
   * カスタムイベントの発火
   */
  #dispatchEvent<K extends keyof DadsAccordionItemEventMap>(
    type: K,
    detail: DadsAccordionItemEventMap[K]['detail']
  ) {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: type === 'dads-accordion-item-before-toggle'
    });
    
    return this.dispatchEvent(event);
  }

  // Public API

  /**
   * 開閉をトグル
   */
  toggle() {
    if (this.#disabled || this.#animating) return;
    
    // before-toggleイベントの発火（キャンセル可能）
    const shouldContinue = this.#dispatchEvent('dads-accordion-item-before-toggle', {
      expanded: !this.#expanded,
      cancelable: true
    });
    
    if (!shouldContinue) return;
    
    if (this.#expanded) {
      this.removeAttribute('expanded');
    } else {
      this.setAttribute('expanded', '');
    }
    
    // toggleイベントの発火
    this.#dispatchEvent('dads-accordion-item-toggle', {
      expanded: this.#expanded,
      item: this as any
    });
  }

  /**
   * 展開
   */
  expand() {
    if (!this.#expanded && !this.#disabled) {
      this.setAttribute('expanded', '');
    }
  }

  /**
   * 折りたたむ
   */
  collapse() {
    if (this.#expanded && !this.#disabled) {
      this.removeAttribute('expanded');
    }
  }

  /**
   * フォーカス
   */
  focus() {
    const button = this.shadowRoot?.querySelector('.accordion-button') as HTMLButtonElement;
    button?.focus();
  }
}

// コンポーネントの登録
DadsAccordionItem.define();