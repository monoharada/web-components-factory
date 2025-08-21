/**
 * Adaptive Card Component - Fixed Version
 * Properly using web-components.ts library
 */

import {
  WebComponent,
  html,
  css
} from '../web-components.ts';

import {
  CardVariant,
  CardBreakpoint,
  CardDirection,
  CardPadding,
  LinkTarget,
  LinkPattern,
  ErrorMessages,
  TEST_CONSTANTS,
  isValidVariant
} from './adaptive-card.types';

/**
 * AdaptiveCard - Fixed implementation
 */
export class AdaptiveCard extends WebComponent {
  constructor() {
    super();
    this.setAttribute('data-sa-component', 'adaptive-card');
    
    // Initialize properties with default values
    this._variant = CardVariant.ELEVATED;
    this._interactive = false;
    this._responsive = false;
    this._disabled = false;
    this._selected = false;
    this._href = null;
    this._linkText = null;
    this._linkTarget = LinkTarget.SELF;
    
    // Setup observers
    this.resizeObserver = null;
    this.currentBreakpoint = CardBreakpoint.AUTO;
  }

  // Property getters and setters
  get variant() {
    return this._variant;
  }

  set variant(value) {
    if (isValidVariant(value)) {
      this._variant = value;
      this.setAttribute('variant', value);
      this.requestUpdate();
    }
  }

  get interactive() {
    return this._interactive;
  }

  set interactive(value) {
    this._interactive = Boolean(value);
    if (value) {
      this.setAttribute('interactive', '');
    } else {
      this.removeAttribute('interactive');
    }
    this.updateInteractiveState();
    this.requestUpdate();
  }

  get responsive() {
    return this._responsive;
  }

  set responsive(value) {
    this._responsive = Boolean(value);
    if (value) {
      this.setAttribute('responsive', '');
      this.setupResizeObserver();
    } else {
      this.removeAttribute('responsive');
      this.cleanupResizeObserver();
    }
    this.requestUpdate();
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = Boolean(value);
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
    this.requestUpdate();
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = Boolean(value);
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
    this.requestUpdate();
  }

  get href() {
    return this._href;
  }

  set href(value) {
    this._href = value;
    if (value) {
      this.setAttribute('href', value);
    } else {
      this.removeAttribute('href');
    }
    this.requestUpdate();
  }

  get 'link-text'() {
    return this._linkText;
  }

  set 'link-text'(value) {
    this._linkText = value;
    if (value) {
      this.setAttribute('link-text', value);
    } else {
      this.removeAttribute('link-text');
    }
    this.requestUpdate();
  }

  /**
   * 監視する属性
   */
  static get observedAttributes() {
    return ['variant', 'interactive', 'responsive', 'disabled', 'selected', 'href', 'link-text', 'link-target'];
  }

  /**
   * 属性変更時の処理
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    switch (name) {
      case 'variant':
        if (newValue && isValidVariant(newValue)) {
          this._variant = newValue;
        }
        break;
      case 'interactive':
        this._interactive = newValue !== null;
        this.updateInteractiveState();
        break;
      case 'responsive':
        this._responsive = newValue !== null;
        if (this._responsive) {
          this.setupResizeObserver();
        } else {
          this.cleanupResizeObserver();
        }
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        break;
      case 'selected':
        this._selected = newValue !== null;
        break;
      case 'href':
        this._href = newValue;
        break;
      case 'link-text':
        this._linkText = newValue;
        break;
      case 'link-target':
        this._linkTarget = newValue || LinkTarget.SELF;
        break;
    }
    
    this.requestUpdate();
  }

  /**
   * コンポーネントのテンプレート
   */
  get template() {
    const linkContent = this.renderLink();
    
    return html`
      <div
        class="card"
        part="card"
        data-variant="${this._variant}"
        data-breakpoint="${this.currentBreakpoint}"
        data-direction="vertical"
        data-padding="medium"
        data-interactive="${this._interactive}"
        data-disabled="${this._disabled}"
        data-selected="${this._selected}"
        role="${this.getRole()}"
        aria-label="${this.getAttribute('aria-label') || ''}"
        tabindex="${this.getTabIndex()}"
      >
        ${linkContent}
        
        <div class="card-media" part="media">
          <slot name="media"></slot>
        </div>
        
        <div class="card-header" part="header">
          <slot name="header"></slot>
        </div>
        
        <div class="card-content" part="content">
          <slot></slot>
        </div>
        
        <div class="card-actions" part="actions">
          <slot name="actions"></slot>
        </div>
        
        <div class="card-badge" part="badge">
          <slot name="badge"></slot>
        </div>
      </div>
    `;
  }

  /**
   * コンポーネントのスタイル
   */
  get styles() {
    return css`
      :host {
        display: block;
        contain: layout style;
        --card-bg: var(--sa-card-bg, #ffffff);
        --card-fg: var(--sa-card-fg, #000000);
        --card-border: var(--sa-card-border, #e0e0e0);
        --card-shadow: var(--sa-card-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        --card-radius: var(--sa-card-radius, 8px);
        --card-padding: var(--sa-card-padding, 16px);
        --card-gap: var(--sa-card-gap, 16px);
        --card-transition: var(--sa-card-transition, all 0.2s ease);
      }

      :host([hidden]) {
        display: none !important;
      }

      .card {
        position: relative;
        background: var(--card-bg);
        color: var(--card-fg);
        border-radius: var(--card-radius);
        transition: var(--card-transition);
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: var(--card-padding);
        box-sizing: border-box;
      }

      /* Variant: Elevated */
      .card[data-variant="elevated"] {
        box-shadow: var(--card-shadow);
        border: none;
      }

      .card[data-variant="elevated"]:hover:not([data-disabled="true"]) {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      /* Variant: Outlined */
      .card[data-variant="outlined"] {
        border: 1px solid var(--card-border);
        box-shadow: none;
      }

      /* Variant: Filled */
      .card[data-variant="filled"] {
        background: var(--card-bg);
        box-shadow: none;
        border: none;
      }

      /* Interactive states */
      .card[data-interactive="true"] {
        cursor: pointer;
      }

      .card[data-interactive="true"]:focus-visible {
        outline: 2px solid var(--sa-focus-color, #0066cc);
        outline-offset: 2px;
      }

      .card[data-disabled="true"] {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }

      .card[data-selected="true"] {
        outline: 2px solid var(--sa-selected-color, #0066cc);
        outline-offset: -2px;
      }

      /* Slots */
      .card-media:not(:has(*)) {
        display: none;
      }

      .card-header:not(:has(*)) {
        display: none;
      }

      .card-actions:not(:has(*)) {
        display: none;
      }

      .card-badge:not(:has(*)) {
        display: none;
      }

      .card-header {
        margin-bottom: var(--card-gap);
      }

      .card-content {
        flex: 1;
      }

      .card-actions {
        margin-top: var(--card-gap);
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .card-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1;
      }

      /* Stretched link */
      .card-link--stretched {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        text-decoration: none;
        color: inherit;
      }

      .card-link--stretched::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .card[data-variant="elevated"] {
          border: 1px solid currentColor;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .card {
          transition: none;
        }
      }
    `;
  }

  /**
   * DOM接続時の処理
   */
  connectedCallback() {
    super.connectedCallback();
    this.setupEventListeners();
    this.setupAccessibility();
    
    if (this._responsive) {
      this.setupResizeObserver();
    }
  }

  /**
   * DOM切断時の処理
   */
  disconnectedCallback() {
    this.cleanupResizeObserver();
    this.removeEventListeners();
    super.disconnectedCallback();
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    if (this._interactive) {
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * イベントリスナーの削除
   */
  removeEventListeners() {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * クリックイベントハンドラ
   */
  handleClick = (event) => {
    if (this._disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    const detail = {
      target: this,
      originalEvent: event,
      timestamp: Date.now()
    };
    
    this.dispatchEvent(new CustomEvent('card-click', {
      detail,
      bubbles: true,
      composed: true
    }));
  };

  /**
   * キーボードイベントハンドラ
   */
  handleKeyDown = (event) => {
    if (this._disabled || !this._interactive) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  /**
   * ResizeObserverの設定
   */
  setupResizeObserver() {
    if (!this._responsive || this.resizeObserver) return;
    
    try {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.updateBreakpoint(entry.contentRect.width);
        }
      });
      
      this.resizeObserver.observe(this);
    } catch (error) {
      console.error(ErrorMessages.RESIZE_OBSERVER_UNSUPPORTED, error);
    }
  }

  /**
   * ResizeObserverのクリーンアップ
   */
  cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * ブレークポイントの更新
   */
  updateBreakpoint(width) {
    const elementWidth = width || this.offsetWidth;
    const previousBreakpoint = this.currentBreakpoint;
    
    if (elementWidth < TEST_CONSTANTS.BREAKPOINT_MOBILE) {
      this.currentBreakpoint = CardBreakpoint.MOBILE;
    } else if (elementWidth < TEST_CONSTANTS.BREAKPOINT_TABLET) {
      this.currentBreakpoint = CardBreakpoint.TABLET;
    } else if (elementWidth < TEST_CONSTANTS.BREAKPOINT_DESKTOP) {
      this.currentBreakpoint = CardBreakpoint.DESKTOP;
    } else {
      this.currentBreakpoint = CardBreakpoint.WIDE;
    }
    
    if (previousBreakpoint !== this.currentBreakpoint) {
      this.setAttribute('data-breakpoint', this.currentBreakpoint);
      
      const detail = {
        breakpoint: this.currentBreakpoint,
        previousBreakpoint,
        width: elementWidth,
        timestamp: Date.now()
      };
      
      this.dispatchEvent(new CustomEvent('breakpoint-change', {
        detail,
        bubbles: true,
        composed: true
      }));
      
      this.requestUpdate();
    }
  }

  /**
   * アクセシビリティの設定
   */
  setupAccessibility() {
    const role = this.getRole();
    this.setAttribute('role', role);
    
    if (this._interactive) {
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('tabindex');
    }
  }

  /**
   * インタラクティブ状態の更新
   */
  updateInteractiveState() {
    if (this._interactive && !this._disabled) {
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
      this.setupEventListeners();
    } else {
      this.removeAttribute('tabindex');
      this.setAttribute('role', 'article');
      this.removeEventListeners();
    }
  }

  /**
   * ロールの取得
   */
  getRole() {
    if (this._interactive && !this._href) {
      return 'button';
    }
    return 'article';
  }

  /**
   * tabindexの取得
   */
  getTabIndex() {
    if (this._interactive && !this._disabled) {
      return '0';
    }
    return '-1';
  }

  /**
   * リンクのレンダリング
   */
  renderLink() {
    if (!this._href) return '';
    
    const linkText = this._linkText || this._href;
    const target = this._linkTarget;
    const rel = target === LinkTarget.BLANK ? 'noopener noreferrer' : '';
    
    return html`
      <a
        class="card-link--stretched"
        href="${this._href}"
        target="${target}"
        rel="${rel}"
        aria-label="${linkText}"
        tabindex="-1"
      >
        <span class="visually-hidden">${linkText}</span>
      </a>
    `;
  }

  /**
   * 選択状態のトグル
   */
  toggleSelection() {
    this.selected = !this._selected;
    
    const detail = {
      target: this,
      selected: this._selected,
      timestamp: Date.now()
    };
    
    this.dispatchEvent(new CustomEvent('card-select', {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

// コンポーネントの登録
if (!customElements.get('adaptive-card')) {
  customElements.define('adaptive-card', AdaptiveCard);
}