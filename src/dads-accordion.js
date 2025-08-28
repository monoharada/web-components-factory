/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
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
var _DadsAccordion_instances, _DadsAccordion_items, _DadsAccordion_allowMultiple, _DadsAccordion_animationType, _DadsAccordion_keyboardNavEnabled, _DadsAccordion_focusedIndex, _DadsAccordion_respectMotionPreference, _DadsAccordion_highContrastQuery, _DadsAccordion_motionQuery, _DadsAccordion_initialize, _DadsAccordion_setupEventListeners, _DadsAccordion_setupAccessibility, _DadsAccordion_setupMediaQueries, _DadsAccordion_applyHighContrastMode, _DadsAccordion_applyMotionPreference, _DadsAccordion_handleItemToggle, _DadsAccordion_handleKeydown, _DadsAccordion_focusPreviousItem, _DadsAccordion_focusNextItem, _DadsAccordion_focusFirstItem, _DadsAccordion_focusLastItem, _DadsAccordion_getItems, _DadsAccordion_getExpandedItems, _DadsAccordion_dispatchEvent, _DadsAccordion_cleanup;
import { WebComponent, html, css, BooleanAttr, PropertyAttr } from '../web-components';
import { generateCSSVariables, mediaQueries, animation } from './design-tokens';
/**
 * dads-accordion コンポーネント
 * アクセシビリティファーストで設計されたアコーディオンコンテナ
 */
export class DadsAccordion extends WebComponent {
    constructor() {
        super();
        _DadsAccordion_instances.add(this);
        // プライベートフィールド
        _DadsAccordion_items.set(this, new Map());
        _DadsAccordion_allowMultiple.set(this, false);
        _DadsAccordion_animationType.set(this, 'none'); // アクセシビリティファースト
        _DadsAccordion_keyboardNavEnabled.set(this, true);
        _DadsAccordion_focusedIndex.set(this, -1);
        _DadsAccordion_respectMotionPreference.set(this, true);
        _DadsAccordion_highContrastQuery.set(this, void 0);
        _DadsAccordion_motionQuery.set(this, void 0);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_initialize).call(this);
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_setupAccessibility).call(this);
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_setupMediaQueries).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_cleanup).call(this);
        // super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'allow-multiple':
                __classPrivateFieldSet(this, _DadsAccordion_allowMultiple, newValue !== null, "f");
                break;
            case 'animation':
                __classPrivateFieldSet(this, _DadsAccordion_animationType, newValue || 'none', "f");
                break;
            case 'respect-motion-preference':
                __classPrivateFieldSet(this, _DadsAccordion_respectMotionPreference, newValue !== null, "f");
                __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_applyMotionPreference).call(this);
                break;
            case 'keyboard-nav':
                __classPrivateFieldSet(this, _DadsAccordion_keyboardNavEnabled, newValue !== null, "f");
                break;
        }
    }
    // Public API
    /**
     * すべてのアイテムを展開
     */
    expandAll() {
        if (!__classPrivateFieldGet(this, _DadsAccordion_allowMultiple, "f")) {
            console.warn('allow-multiple属性が設定されていないため、すべてを展開できません');
            return;
        }
        const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
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
        const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
        items.forEach(item => {
            if (item.hasAttribute('expanded')) {
                item.removeAttribute('expanded');
            }
        });
    }
    /**
     * 展開されているアイテムを取得
     */
    getExpandedItems() {
        return __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getExpandedItems).call(this);
    }
}
_DadsAccordion_items = new WeakMap(), _DadsAccordion_allowMultiple = new WeakMap(), _DadsAccordion_animationType = new WeakMap(), _DadsAccordion_keyboardNavEnabled = new WeakMap(), _DadsAccordion_focusedIndex = new WeakMap(), _DadsAccordion_respectMotionPreference = new WeakMap(), _DadsAccordion_highContrastQuery = new WeakMap(), _DadsAccordion_motionQuery = new WeakMap(), _DadsAccordion_instances = new WeakSet(), _DadsAccordion_initialize = function _DadsAccordion_initialize() {
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
    __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_dispatchEvent).call(this, 'dads-accordion-initialized', {
        itemCount: __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this).length
    });
}, _DadsAccordion_setupEventListeners = function _DadsAccordion_setupEventListeners() {
    // 子要素のトグルイベントを監視
    this.addEventListener('dads-accordion-item-toggle', (e) => {
        const event = e;
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_handleItemToggle).call(this, event);
    });
    // キーボードナビゲーション
    if (__classPrivateFieldGet(this, _DadsAccordion_keyboardNavEnabled, "f")) {
        this.addEventListener('keydown', (e) => __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_handleKeydown).call(this, e));
    }
}, _DadsAccordion_setupAccessibility = function _DadsAccordion_setupAccessibility() {
    // ARIAラベル設定
    const label = this.getAttribute('aria-label');
    if (!label) {
        this.setAttribute('aria-label', 'アコーディオングループ');
    }
    // フォーカス管理
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    items.forEach((item, index) => {
        item.setAttribute('aria-setsize', String(items.length));
        item.setAttribute('aria-posinset', String(index + 1));
    });
}, _DadsAccordion_setupMediaQueries = function _DadsAccordion_setupMediaQueries() {
    // 高コントラストモード
    __classPrivateFieldSet(this, _DadsAccordion_highContrastQuery, window.matchMedia('(prefers-contrast: high)'), "f");
    __classPrivateFieldGet(this, _DadsAccordion_highContrastQuery, "f").addEventListener('change', (e) => {
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_applyHighContrastMode).call(this, e.matches);
    });
    __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_applyHighContrastMode).call(this, __classPrivateFieldGet(this, _DadsAccordion_highContrastQuery, "f").matches);
    // モーション設定
    if (__classPrivateFieldGet(this, _DadsAccordion_respectMotionPreference, "f")) {
        __classPrivateFieldSet(this, _DadsAccordion_motionQuery, window.matchMedia('(prefers-reduced-motion: reduce)'), "f");
        __classPrivateFieldGet(this, _DadsAccordion_motionQuery, "f").addEventListener('change', (e) => {
            __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_applyMotionPreference).call(this, e.matches);
        });
        __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_applyMotionPreference).call(this, __classPrivateFieldGet(this, _DadsAccordion_motionQuery, "f").matches);
    }
}, _DadsAccordion_applyHighContrastMode = function _DadsAccordion_applyHighContrastMode(isHighContrast) {
    if (isHighContrast) {
        this.style.setProperty('--focus-ring-width', '4px');
        this.style.setProperty('--focus-ring-offset', '2px');
        this.style.setProperty('--border-width', '2px');
    }
    else {
        this.style.removeProperty('--focus-ring-width');
        this.style.removeProperty('--focus-ring-offset');
        this.style.removeProperty('--border-width');
    }
}, _DadsAccordion_applyMotionPreference = function _DadsAccordion_applyMotionPreference(reducedMotion = false) {
    if (reducedMotion || !__classPrivateFieldGet(this, _DadsAccordion_respectMotionPreference, "f")) {
        return;
    }
    const prefersReduced = __classPrivateFieldGet(this, _DadsAccordion_motionQuery, "f")?.matches;
    if (prefersReduced) {
        this.setAttribute('animation', 'none');
    }
}, _DadsAccordion_handleItemToggle = function _DadsAccordion_handleItemToggle(event) {
    const item = event.target;
    const expanded = event.detail.expanded;
    if (!__classPrivateFieldGet(this, _DadsAccordion_allowMultiple, "f") && expanded) {
        // 単一展開モード: 他のアイテムを閉じる
        const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
        items.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('expanded')) {
                otherItem.removeAttribute('expanded');
            }
        });
    }
    // 変更イベントの発火
    const expandedItems = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getExpandedItems).call(this);
    const collapsedItems = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this).filter(i => !expandedItems.includes(i));
    __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_dispatchEvent).call(this, 'dads-accordion-change', {
        expanded: expandedItems,
        collapsed: collapsedItems
    });
}, _DadsAccordion_handleKeydown = function _DadsAccordion_handleKeydown(event) {
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    if (items.length === 0)
        return;
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_focusPreviousItem).call(this);
            break;
        case 'ArrowDown':
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_focusNextItem).call(this);
            break;
        case 'Home':
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_focusFirstItem).call(this);
            break;
        case 'End':
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_focusLastItem).call(this);
            break;
    }
}, _DadsAccordion_focusPreviousItem = function _DadsAccordion_focusPreviousItem() {
    var _a;
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    if (__classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f") > 0) {
        __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, (_a = __classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f"), _a--, _a), "f");
    }
    else {
        __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, items.length - 1, "f");
    }
    items[__classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f")]?.focus();
}, _DadsAccordion_focusNextItem = function _DadsAccordion_focusNextItem() {
    var _a;
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    if (__classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f") < items.length - 1) {
        __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, (_a = __classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f"), _a++, _a), "f");
    }
    else {
        __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, 0, "f");
    }
    items[__classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f")]?.focus();
}, _DadsAccordion_focusFirstItem = function _DadsAccordion_focusFirstItem() {
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, 0, "f");
    items[0]?.focus();
}, _DadsAccordion_focusLastItem = function _DadsAccordion_focusLastItem() {
    const items = __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this);
    __classPrivateFieldSet(this, _DadsAccordion_focusedIndex, items.length - 1, "f");
    items[__classPrivateFieldGet(this, _DadsAccordion_focusedIndex, "f")]?.focus();
}, _DadsAccordion_getItems = function _DadsAccordion_getItems() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot)
        return [];
    const assignedElements = slot.assignedElements();
    return assignedElements.filter(el => el.tagName.toLowerCase() === 'dads-accordion-item');
}, _DadsAccordion_getExpandedItems = function _DadsAccordion_getExpandedItems() {
    return __classPrivateFieldGet(this, _DadsAccordion_instances, "m", _DadsAccordion_getItems).call(this).filter(item => item.hasAttribute('expanded'));
}, _DadsAccordion_dispatchEvent = function _DadsAccordion_dispatchEvent(type, detail) {
    this.dispatchEvent(new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true
    }));
}, _DadsAccordion_cleanup = function _DadsAccordion_cleanup() {
    // イベントリスナーの削除
    __classPrivateFieldGet(this, _DadsAccordion_highContrastQuery, "f")?.removeEventListener('change', () => { });
    __classPrivateFieldGet(this, _DadsAccordion_motionQuery, "f")?.removeEventListener('change', () => { });
};
DadsAccordion.definition = {
    name: 'dads-accordion',
    template: html `
      <div class="accordion-container" role="region">
        <slot></slot>
      </div>
    `,
    styles: css `
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
// コンポーネントの登録
DadsAccordion.define();
