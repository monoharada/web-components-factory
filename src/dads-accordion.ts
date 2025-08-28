/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
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
  AnimationType, 
  DadsAccordionEventMap,
  AccordionState,
  ItemState 
} from '../types/accordion';
import { 
  generateCSSVariables,
  mediaQueries,
  animation
} from './design-tokens';

/**
 * dads-accordion コンポーネント
 * アクセシビリティファーストで設計されたアコーディオンコンテナ
 */
export class DadsAccordion extends WebComponent {
  // プライベートフィールド
  #items = new Map<string, ItemState>();
  #allowMultiple = false;
  #animationType: AnimationType = 'none'; // アクセシビリティファースト
  #keyboardNavEnabled = true;
  #focusedIndex = -1;
  #respectMotionPreference = true;
  #highContrastQuery?: MediaQueryList;
  #motionQuery?: MediaQueryList;

  static definition = {
    name: 'dads-accordion',
    template: html`
      <div class="accordion-container" role="region">
        <slot></slot>
      </div>
    `,
    styles: css`
      :host {
        display: block;
        width: 100%;
        
        /* デザイントークンから生成されたCSS変数 */
        ${generateCSSVariables()}
        
        /* 追加のカスタム変数 */
        --focus-ring-width: 2px;
        --focus-ring-offset: 2px;
        
        font-family: var(--font-family);
        color: var(--color-text);
      }
      
      .accordion-container {
        position: relative;
      }
      
      /* 高コントラストモード対応 */
      ${mediaQueries.prefersHighContrast} {
        :host {
          --focus-ring-width: 4px;
          --focus-ring-offset: 2px;
        }
      }
      
      /* モバイル対応 */
      ${mediaQueries.mobile} {
        :host {
          --font-size: var(--font-size-mobile);
          --line-height: var(--line-height-mobile);
        }
      }
      
      @media (min-width: 769px) {
        :host {
          --font-size: var(--font-size-desktop);
          --line-height: var(--line-height-desktop);
        }
      }
      
      /* RTL対応 */
      :host([dir="rtl"]) {
        direction: rtl;
      }
      
      /* アニメーション無効化（デフォルト） */
      :host([animation="none"]) * {
        transition: none !important;
        animation: none !important;
      }
      
      /* スムーズアニメーション */
      :host([animation="smooth"]) ::slotted(dads-accordion-item) {
        transition: height ${animation.duration.normal} ${animation.easing.easeInOut}, 
                    opacity ${animation.duration.normal} ${animation.easing.easeInOut};
      }
      
      /* バウンスアニメーション */
      :host([animation="bounce"]) ::slotted(dads-accordion-item) {
        transition: height ${animation.duration.slow} ${animation.easing.spring};
      }
    `,
    attributes: [
      BooleanAttr('allow-multiple'),
      PropertyAttr('animation'),
      BooleanAttr('respect-motion-preference'),
      BooleanAttr('keyboard-nav')
    ]
  };

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#initialize();
    this.#setupEventListeners();
    this.#setupAccessibility();
    this.#setupMediaQueries();
  }

  disconnectedCallback() {
    this.#cleanup();
    // super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    switch (name) {
      case 'allow-multiple':
        this.#allowMultiple = newValue !== null;
        break;
      case 'animation':
        this.#animationType = (newValue as AnimationType) || 'none';
        break;
      case 'respect-motion-preference':
        this.#respectMotionPreference = newValue !== null;
        this.#applyMotionPreference();
        break;
      case 'keyboard-nav':
        this.#keyboardNavEnabled = newValue !== null;
        break;
    }
  }

  /**
   * 初期化処理
   */
  #initialize() {
    // アニメーション属性のデフォルト設定
    if (!this.hasAttribute('animation')) {
      this.setAttribute('animation', 'none');
    }
    
    // respect-motion-preferenceのデフォルト設定
    if (!this.hasAttribute('respect-motion-preference')) {
      this.setAttribute('respect-motion-preference', '');
    }
    
    // WAI-ARIA属性の設定
    this.setAttribute('role', 'region');
    
    // 初期化イベントの発火
    this.#dispatchEvent('dads-accordion-initialized', {
      itemCount: this.#getItems().length
    });
  }

  /**
   * イベントリスナーの設定
   */
  #setupEventListeners() {
    // 子要素のトグルイベントを監視
    this.addEventListener('dads-accordion-item-toggle', (e: Event) => {
      const event = e as CustomEvent;
      this.#handleItemToggle(event);
    });
    
    // キーボードナビゲーション
    if (this.#keyboardNavEnabled) {
      this.addEventListener('keydown', (e) => this.#handleKeydown(e));
    }
  }

  /**
   * アクセシビリティ機能の設定
   */
  #setupAccessibility() {
    // ARIAラベル設定
    const label = this.getAttribute('aria-label');
    if (!label) {
      this.setAttribute('aria-label', 'アコーディオングループ');
    }
    
    // フォーカス管理
    const items = this.#getItems();
    items.forEach((item, index) => {
      item.setAttribute('aria-setsize', String(items.length));
      item.setAttribute('aria-posinset', String(index + 1));
    });
  }

  /**
   * メディアクエリの設定
   */
  #setupMediaQueries() {
    // 高コントラストモード
    this.#highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.#highContrastQuery.addEventListener('change', (e) => {
      this.#applyHighContrastMode(e.matches);
    });
    this.#applyHighContrastMode(this.#highContrastQuery.matches);
    
    // モーション設定
    if (this.#respectMotionPreference) {
      this.#motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.#motionQuery.addEventListener('change', (e) => {
        this.#applyMotionPreference(e.matches);
      });
      this.#applyMotionPreference(this.#motionQuery.matches);
    }
  }

  /**
   * 高コントラストモードの適用
   */
  #applyHighContrastMode(isHighContrast: boolean) {
    if (isHighContrast) {
      this.style.setProperty('--focus-ring-width', '4px');
      this.style.setProperty('--focus-ring-offset', '2px');
      this.style.setProperty('--border-width', '2px');
    } else {
      this.style.removeProperty('--focus-ring-width');
      this.style.removeProperty('--focus-ring-offset');
      this.style.removeProperty('--border-width');
    }
  }

  /**
   * モーション設定の適用
   */
  #applyMotionPreference(reducedMotion = false) {
    if (reducedMotion || !this.#respectMotionPreference) {
      return;
    }
    
    const prefersReduced = this.#motionQuery?.matches;
    if (prefersReduced) {
      this.setAttribute('animation', 'none');
    }
  }

  /**
   * アイテムのトグル処理
   */
  #handleItemToggle(event: CustomEvent) {
    const item = event.target as HTMLElement;
    const expanded = event.detail.expanded;
    
    if (!this.#allowMultiple && expanded) {
      // 単一展開モード: 他のアイテムを閉じる
      const items = this.#getItems();
      items.forEach(otherItem => {
        if (otherItem !== item && otherItem.hasAttribute('expanded')) {
          otherItem.removeAttribute('expanded');
        }
      });
    }
    
    // 変更イベントの発火
    const expandedItems = this.#getExpandedItems();
    const collapsedItems = this.#getItems().filter(i => !expandedItems.includes(i));
    
    this.#dispatchEvent('dads-accordion-change', {
      expanded: expandedItems as unknown as DadsAccordionItem[],
      collapsed: collapsedItems as unknown as DadsAccordionItem[]
    });
  }

  /**
   * キーボード操作の処理
   */
  #handleKeydown(event: KeyboardEvent) {
    const items = this.#getItems();
    if (items.length === 0) return;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.#focusPreviousItem();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.#focusNextItem();
        break;
      case 'Home':
        event.preventDefault();
        this.#focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        this.#focusLastItem();
        break;
    }
  }

  /**
   * 前のアイテムにフォーカス
   */
  #focusPreviousItem() {
    const items = this.#getItems();
    if (this.#focusedIndex > 0) {
      this.#focusedIndex--;
    } else {
      this.#focusedIndex = items.length - 1;
    }
    items[this.#focusedIndex]?.focus();
  }

  /**
   * 次のアイテムにフォーカス
   */
  #focusNextItem() {
    const items = this.#getItems();
    if (this.#focusedIndex < items.length - 1) {
      this.#focusedIndex++;
    } else {
      this.#focusedIndex = 0;
    }
    items[this.#focusedIndex]?.focus();
  }

  /**
   * 最初のアイテムにフォーカス
   */
  #focusFirstItem() {
    const items = this.#getItems();
    this.#focusedIndex = 0;
    items[0]?.focus();
  }

  /**
   * 最後のアイテムにフォーカス
   */
  #focusLastItem() {
    const items = this.#getItems();
    this.#focusedIndex = items.length - 1;
    items[this.#focusedIndex]?.focus();
  }

  /**
   * アイテムの取得
   */
  #getItems(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return [];
    
    const assignedElements = (slot as HTMLSlotElement).assignedElements();
    return assignedElements.filter(el => 
      el.tagName.toLowerCase() === 'dads-accordion-item'
    ) as HTMLElement[];
  }

  /**
   * 展開されているアイテムの取得
   */
  #getExpandedItems(): HTMLElement[] {
    return this.#getItems().filter(item => item.hasAttribute('expanded'));
  }

  /**
   * カスタムイベントの発火
   */
  #dispatchEvent<K extends keyof DadsAccordionEventMap>(
    type: K,
    detail: DadsAccordionEventMap[K]['detail']
  ) {
    this.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  /**
   * クリーンアップ処理
   */
  #cleanup() {
    // イベントリスナーの削除
    this.#highContrastQuery?.removeEventListener('change', () => {});
    this.#motionQuery?.removeEventListener('change', () => {});
  }

  // Public API
  
  /**
   * すべてのアイテムを展開
   */
  expandAll() {
    if (!this.#allowMultiple) {
      console.warn('allow-multiple属性が設定されていないため、すべてを展開できません');
      return;
    }
    
    const items = this.#getItems();
    items.forEach(item => {
      if (!item.hasAttribute('expanded')) {
        item.setAttribute('expanded', '');
      }
    });
  }

  /**
   * すべてのアイテムを折りたたむ
   */
  collapseAll() {
    const items = this.#getItems();
    items.forEach(item => {
      if (item.hasAttribute('expanded')) {
        item.removeAttribute('expanded');
      }
    });
  }

  /**
   * 展開されているアイテムを取得
   */
  getExpandedItems(): HTMLElement[] {
    return this.#getExpandedItems();
  }
}

// コンポーネントの登録
DadsAccordion.define();