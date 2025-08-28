/**
 * デジタル庁デザインシステム アコーディオンアイテムコンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DadsAccordionItem_instances, _DadsAccordionItem_expanded, _DadsAccordionItem_disabled, _DadsAccordionItem_iconPosition, _DadsAccordionItem_animating, _DadsAccordionItem_contentHeight, _DadsAccordionItem_uniqueId, _DadsAccordionItem_initialize, _DadsAccordionItem_setupEventListeners, _DadsAccordionItem_updateHeaderText, _DadsAccordionItem_updateExpandedState, _DadsAccordionItem_updateDisabledState, _DadsAccordionItem_animateExpand, _DadsAccordionItem_animateCollapse, _DadsAccordionItem_getAnimationType, _DadsAccordionItem_scrollToTop, _DadsAccordionItem_dispatchEvent;
import { WebComponent, html, css, BooleanAttr, PropertyAttr } from '../web-components';
import { generateCSSVariables, createIconSVG, borders } from './design-tokens';
/**
 * dads-accordion-item コンポーネント
 * 個別のアコーディオンアイテム
 */
export class DadsAccordionItem extends WebComponent {
    constructor() {
        super();
        _DadsAccordionItem_instances.add(this);
        // プライベートフィールド
        _DadsAccordionItem_expanded.set(this, false);
        _DadsAccordionItem_disabled.set(this, false);
        _DadsAccordionItem_iconPosition.set(this, 'left');
        _DadsAccordionItem_animating.set(this, false);
        _DadsAccordionItem_contentHeight.set(this, 0);
        _DadsAccordionItem_uniqueId.set(this, `accordion-item-${Math.random().toString(36).slice(2)}`);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_initialize).call(this);
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_updateHeaderText).call(this);
    }
    disconnectedCallback() {
        // super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'expanded':
                __classPrivateFieldSet(this, _DadsAccordionItem_expanded, newValue !== null, "f");
                __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_updateExpandedState).call(this);
                break;
            case 'disabled':
                __classPrivateFieldSet(this, _DadsAccordionItem_disabled, newValue !== null, "f");
                __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_updateDisabledState).call(this);
                break;
            case 'icon-position':
                __classPrivateFieldSet(this, _DadsAccordionItem_iconPosition, newValue || 'left', "f");
                break;
        }
    }
    // Public API
    /**
     * 開閉をトグル
     */
    toggle() {
        if (__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f") || __classPrivateFieldGet(this, _DadsAccordionItem_animating, "f"))
            return;
        // before-toggleイベントの発火（キャンセル可能）
        const shouldContinue = __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-before-toggle', {
            expanded: !__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f"),
            cancelable: true
        });
        if (!shouldContinue)
            return;
        if (__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f")) {
            this.removeAttribute('expanded');
        }
        else {
            this.setAttribute('expanded', '');
        }
        // toggleイベントの発火
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-toggle', {
            expanded: __classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f"),
            item: this
        });
    }
    /**
     * 展開
     */
    expand() {
        if (!__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f") && !__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f")) {
            this.setAttribute('expanded', '');
        }
    }
    /**
     * 折りたたむ
     */
    collapse() {
        if (__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f") && !__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f")) {
            this.removeAttribute('expanded');
        }
    }
    /**
     * フォーカス
     */
    focus() {
        const button = this.shadowRoot?.querySelector('.accordion-button');
        button?.focus();
    }
}
_DadsAccordionItem_expanded = new WeakMap(), _DadsAccordionItem_disabled = new WeakMap(), _DadsAccordionItem_iconPosition = new WeakMap(), _DadsAccordionItem_animating = new WeakMap(), _DadsAccordionItem_contentHeight = new WeakMap(), _DadsAccordionItem_uniqueId = new WeakMap(), _DadsAccordionItem_instances = new WeakSet(), _DadsAccordionItem_initialize = function _DadsAccordionItem_initialize() {
    // ユニークIDの設定
    const button = this.shadowRoot?.querySelector('.accordion-button');
    const content = this.shadowRoot?.querySelector('.accordion-content');
    if (button && content) {
        const contentId = `${__classPrivateFieldGet(this, _DadsAccordionItem_uniqueId, "f")}-content`;
        button.setAttribute('aria-controls', contentId);
        content.setAttribute('id', contentId);
    }
    // 初期状態の設定
    __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_updateExpandedState).call(this);
    __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_updateDisabledState).call(this);
    // タブインデックスの設定
    this.setAttribute('tabindex', '-1');
}, _DadsAccordionItem_setupEventListeners = function _DadsAccordionItem_setupEventListeners() {
    const button = this.shadowRoot?.querySelector('.accordion-button');
    const returnButton = this.shadowRoot?.querySelector('.accordion-return');
    button?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f")) {
            this.toggle();
        }
    });
    returnButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_scrollToTop).call(this);
    });
    // Enterキーとスペースキーの処理
    button?.addEventListener('keydown', (e) => {
        if (__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f"))
            return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
        }
    });
}, _DadsAccordionItem_updateHeaderText = function _DadsAccordionItem_updateHeaderText() {
    const headerSlot = this.shadowRoot?.querySelector('slot[name="header"]');
    const headerTextSpan = this.shadowRoot?.querySelector('.header-text');
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
}, _DadsAccordionItem_updateExpandedState = function _DadsAccordionItem_updateExpandedState() {
    const button = this.shadowRoot?.querySelector('.accordion-button');
    const content = this.shadowRoot?.querySelector('.accordion-content');
    if (button) {
        button.setAttribute('aria-expanded', String(__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f")));
    }
    if (content) {
        content.setAttribute('aria-hidden', String(!__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f")));
    }
    // 展開アニメーションの処理
    if (__classPrivateFieldGet(this, _DadsAccordionItem_expanded, "f")) {
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_animateExpand).call(this);
    }
    else {
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_animateCollapse).call(this);
    }
}, _DadsAccordionItem_updateDisabledState = function _DadsAccordionItem_updateDisabledState() {
    const button = this.shadowRoot?.querySelector('.accordion-button');
    if (button) {
        button.disabled = __classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f");
        button.setAttribute('aria-disabled', String(__classPrivateFieldGet(this, _DadsAccordionItem_disabled, "f")));
    }
}, _DadsAccordionItem_animateExpand = function _DadsAccordionItem_animateExpand() {
    const content = this.shadowRoot?.querySelector('.accordion-content');
    if (!content)
        return;
    // アニメーション開始イベント
    __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-animation-start', {
        animationType: __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_getAnimationType).call(this)
    });
    __classPrivateFieldSet(this, _DadsAccordionItem_animating, true, "f");
    // アニメーション終了後の処理
    const onAnimationEnd = () => {
        __classPrivateFieldSet(this, _DadsAccordionItem_animating, false, "f");
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-animation-end', {
            animationType: __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_getAnimationType).call(this)
        });
        content.removeEventListener('transitionend', onAnimationEnd);
    };
    content.addEventListener('transitionend', onAnimationEnd);
}, _DadsAccordionItem_animateCollapse = function _DadsAccordionItem_animateCollapse() {
    const content = this.shadowRoot?.querySelector('.accordion-content');
    if (!content)
        return;
    // アニメーション開始イベント
    __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-animation-start', {
        animationType: __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_getAnimationType).call(this)
    });
    __classPrivateFieldSet(this, _DadsAccordionItem_animating, true, "f");
    // アニメーション終了後の処理
    const onAnimationEnd = () => {
        __classPrivateFieldSet(this, _DadsAccordionItem_animating, false, "f");
        __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_dispatchEvent).call(this, 'dads-accordion-item-animation-end', {
            animationType: __classPrivateFieldGet(this, _DadsAccordionItem_instances, "m", _DadsAccordionItem_getAnimationType).call(this)
        });
        content.removeEventListener('transitionend', onAnimationEnd);
    };
    content.addEventListener('transitionend', onAnimationEnd);
}, _DadsAccordionItem_getAnimationType = function _DadsAccordionItem_getAnimationType() {
    const accordion = this.closest('dads-accordion');
    return accordion?.getAttribute('animation') || 'none';
}, _DadsAccordionItem_scrollToTop = function _DadsAccordionItem_scrollToTop() {
    const button = this.shadowRoot?.querySelector('.accordion-button');
    button?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    button?.focus();
}, _DadsAccordionItem_dispatchEvent = function _DadsAccordionItem_dispatchEvent(type, detail) {
    const event = new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true,
        cancelable: type === 'dads-accordion-item-before-toggle'
    });
    return this.dispatchEvent(event);
};
DadsAccordionItem.definition = {
    name: 'dads-accordion-item',
    template: html `
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
    styles: css `
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
// コンポーネントの登録
DadsAccordionItem.define();
