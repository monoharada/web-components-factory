/**
 * Adaptive Card Component
 * TDDアプローチで開発された高品質なWeb Component
 */

import {
  WebComponent,
  html,
  css,
  PropertyAttr,
  BooleanAttr,
  AdoptableStyles,
  ViewTemplate
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
  isValidVariant,
  isValidBreakpoint,
  isValidDirection,
  isValidPadding,
  isValidLinkTarget,
  isValidLinkPattern,
  hasSlotContent
} from './adaptive-card.types';

/**
 * AdaptiveCard - アダプティブカードコンポーネント
 */
export class AdaptiveCard extends WebComponent {
  resizeObserver = null;
  currentBreakpoint = CardBreakpoint.AUTO;
  slots = new Map();
  slotChangeHandlers = new Map();

  // プロパティ定義
  @PropertyAttr({ defaultValue: CardVariant.ELEVATED })
  variant = CardVariant.ELEVATED;

  @BooleanAttr({ defaultValue: false })
  responsive = false;

  @PropertyAttr({ defaultValue: CardBreakpoint.AUTO })
  breakpoint = CardBreakpoint.AUTO;

  @PropertyAttr({ defaultValue: CardDirection.VERTICAL })
  direction = CardDirection.VERTICAL;

  @PropertyAttr({ defaultValue: CardPadding.MEDIUM })
  padding = CardPadding.MEDIUM;

  @BooleanAttr({ defaultValue: false })
  interactive = false;

  @BooleanAttr({ defaultValue: false })
  disabled = false;

  @BooleanAttr({ defaultValue: false })
  selected = false;

  @PropertyAttr({ defaultValue: null })
  href = null;

  @PropertyAttr({ defaultValue: LinkTarget.SELF })
  'link-target' = LinkTarget.SELF;

  @PropertyAttr({ defaultValue: null })
  'link-text' = null;

  @PropertyAttr({ defaultValue: LinkPattern.STRETCHED })
  'link-pattern' = LinkPattern.STRETCHED;

  constructor() {
    super();
    this.setAttribute('data-sa-component', 'adaptive-card');
  }

  /**
   * コンポーネントのテンプレート
   */
  get template() {
    return html`
      <div
        class="card"
        part="card"
        data-variant="${this.variant}"
        data-breakpoint="${this.currentBreakpoint}"
        data-direction="${this.direction}"
        data-padding="${this.padding}"
        data-interactive="${this.interactive}"
        data-disabled="${this.disabled}"
        data-selected="${this.selected}"
        role="${this.getRole()}"
        aria-label="${this.getAttribute('aria-label') || ''}"
        tabindex="${this.getTabIndex()}"
      >
        ${this.renderLink()}
        
        <div class="card-media" part="media" ?hidden="${!this.hasSlot('media')}">
          <slot name="media" @slotchange="${this.handleSlotChange}"></slot>
        </div>
        
        <div class="card-header" part="header" ?hidden="${!this.hasSlot('header')}">
          <slot name="header" @slotchange="${this.handleSlotChange}"></slot>
        </div>
        
        <div class="card-content" part="content">
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </div>
        
        <div class="card-actions" part="actions" ?hidden="${!this.hasSlot('actions')}">
          <slot name="actions" @slotchange="${this.handleSlotChange}"></slot>
        </div>
        
        <div class="card-badge" part="badge" ?hidden="${!this.hasSlot('badge')}">
          <slot name="badge" @slotchange="${this.handleSlotChange}"></slot>
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
        --card-padding-none: 0;
        --card-padding-small: 8px;
        --card-padding-medium: 16px;
        --card-padding-large: 24px;
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

      /* Padding */
      .card[data-padding="none"] {
        padding: var(--card-padding-none);
      }

      .card[data-padding="small"] {
        padding: var(--card-padding-small);
      }

      .card[data-padding="medium"] {
        padding: var(--card-padding-medium);
      }

      .card[data-padding="large"] {
        padding: var(--card-padding-large);
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

      .disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Direction */
      .card[data-direction="horizontal"] {
        flex-direction: row;
      }

      .card[data-direction="vertical"] {
        flex-direction: column;
      }

      /* Slots */
      .card-media {
        flex-shrink: 0;
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

      /* Responsive breakpoints */
      .card[data-breakpoint="mobile"] {
        --card-padding-medium: 12px;
        --card-gap: 12px;
      }

      .card[data-breakpoint="tablet"] {
        --card-padding-medium: 14px;
        --card-gap: 14px;
      }

      .card[data-breakpoint="desktop"] {
        --card-padding-medium: 16px;
        --card-gap: 16px;
      }

      .card[data-breakpoint="wide"] {
        --card-padding-medium: 20px;
        --card-gap: 20px;
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

      /* Focus visible polyfill */
      .card:focus:not(:focus-visible) {
        outline: none;
      }

      [hidden] {
        display: none !important;
      }
    `;
  }

  /**
   * DOM接続時の処理
   */
  connectedCallback() {
    super.connectedCallback();
    
    try {
      this.setupEventListeners();
      this.setupAccessibility();
      
      if (this.responsive) {
        this.setupResizeObserver();
      }
    } catch (error) {
      console.error(ErrorMessages.ELEMENT_NOT_CONNECTED, error);
    }
  }

  /**
   * DOM切断時の処理
   */
  disconnectedCallback() {
    try {
      this.cleanupResizeObserver();
      this.removeEventListeners();
    } catch (error) {
      console.error(ErrorMessages.CLEANUP_ERROR, error);
    }
    
    super.disconnectedCallback();
  }

  /**
   * 属性変更時の処理
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    try {
      // バリデーション
      if (name === 'variant' && newValue && !isValidVariant(newValue)) {
        console.error(ErrorMessages.INVALID_VARIANT, newValue);
        return;
      }
      
      if (name === 'breakpoint' && newValue && !isValidBreakpoint(newValue)) {
        console.error(ErrorMessages.INVALID_BREAKPOINT, newValue);
        return;
      }
      
      if (name === 'direction' && newValue && !isValidDirection(newValue)) {
        console.error(ErrorMessages.INVALID_DIRECTION, newValue);
        return;
      }
      
      if (name === 'padding' && newValue && !isValidPadding(newValue)) {
        console.error(ErrorMessages.INVALID_PADDING, newValue);
        return;
      }
      
      // 特別な処理
      if (name === 'interactive') {
        this.updateInteractiveState();
      }
      
      if (name === 'responsive' && newValue !== null) {
        this.setupResizeObserver();
      } else if (name === 'responsive' && newValue === null) {
        this.cleanupResizeObserver();
      }
      
      if (name === 'href' || name === 'link-text' || name === 'link-target') {
        this.requestUpdate();
      }
    } catch (error) {
      console.error(ErrorMessages.EVENT_ERROR, error);
    }
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    if (this.interactive) {
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
    if (this.disabled) {
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
    if (this.disabled || !this.interactive) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  /**
   * スロット変更ハンドラ
   */
  handleSlotChange = (event) => {
    const slot = event.target;
    if (slot) {
      this.requestUpdate();
    }
  };

  /**
   * ResizeObserverの設定
   */
  setupResizeObserver() {
    try {
      if (!this.responsive || this.resizeObserver) return;
      
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
    
    if (elementWidth < TEST_CONSTANTS.MOBILE_BREAKPOINT) {
      this.currentBreakpoint = CardBreakpoint.MOBILE;
    } else if (elementWidth < TEST_CONSTANTS.TABLET_BREAKPOINT) {
      this.currentBreakpoint = CardBreakpoint.TABLET;
    } else if (elementWidth < 1024) {
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
    
    if (this.interactive) {
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('tabindex');
    }
  }

  /**
   * インタラクティブ状態の更新
   */
  updateInteractiveState() {
    if (this.interactive && !this.disabled) {
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
    if (this.interactive && !this.href) {
      return 'button';
    }
    return 'article';
  }

  /**
   * tabindexの取得
   */
  getTabIndex() {
    if (this.interactive && !this.disabled) {
      return '0';
    }
    return '-1';
  }

  /**
   * スロットの存在確認
   */
  hasSlot(name) {
    const slot = this.shadowRoot?.querySelector(`slot[name="${name}"]`);
    return slot ? hasSlotContent(slot) : false;
  }

  /**
   * リンクのレンダリング
   */
  renderLink() {
    if (!this.href) return '';
    
    const linkText = this['link-text'] || this.href;
    const target = this['link-target'];
    const rel = target === LinkTarget.BLANK ? 'noopener noreferrer' : '';
    
    return html`
      <a
        class="card-link--stretched"
        href="${this.href}"
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
    this.selected = !this.selected;
    
    const detail = {
      target: this,
      selected: this.selected,
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