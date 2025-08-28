/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * details/summary要素 + ::part()ベースの実装
 * @version 3.0.0
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
var _DadsAccordionDetails_allowMultiple, _DadsAccordionItemDetails_details;
import { WebComponent, html, css, BooleanAttr, PropertyAttr } from '../web-components.js';
import { generateCSSVariables, createIconSVG } from './design-tokens.js';
import { accordionItemStyles } from './dads-accordion-styles.js';
/**
 * アコーディオンコンテナコンポーネント
 */
export class DadsAccordionDetails extends WebComponent {
    constructor() {
        super(...arguments);
        _DadsAccordionDetails_allowMultiple.set(this, false);
    }
    connectedCallback() {
        super.connectedCallback();
        // デフォルト設定
        if (!this.hasAttribute('animation')) {
            this.setAttribute('animation', 'none');
        }
        // モーション設定の尊重
        if (this.hasAttribute('respect-motion-preference')) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (prefersReducedMotion.matches) {
                this.setAttribute('animation', 'none');
            }
        }
        // 単一展開モードの処理
        this.addEventListener('toggle', (e) => {
            if (!__classPrivateFieldGet(this, _DadsAccordionDetails_allowMultiple, "f") && e.target?.open) {
                const items = this.querySelectorAll('dads-accordion-item-details');
                for (const item of items) {
                    const details = item.shadowRoot?.querySelector('[part="details"]');
                    if (details && details !== e.target && details.open) {
                        details.open = false;
                    }
                }
            }
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'allow-multiple') {
            __classPrivateFieldSet(this, _DadsAccordionDetails_allowMultiple, newValue !== null, "f");
        }
    }
}
_DadsAccordionDetails_allowMultiple = new WeakMap();
DadsAccordionDetails.definition = {
    name: 'dads-accordion-details',
    template: html `
      <div part="container" role="group">
        <slot></slot>
      </div>
    `,
    styles: css `
      :host {
        display: block;
        width: 100%;
        ${generateCSSVariables()}
      }
    `,
    attributes: [
        BooleanAttr('allow-multiple'),
        PropertyAttr('animation'),
        BooleanAttr('respect-motion-preference')
    ]
};
/**
 * アコーディオンアイテムコンポーネント
 */
export class DadsAccordionItemDetails extends WebComponent {
    constructor() {
        super(...arguments);
        _DadsAccordionItemDetails_details.set(this, void 0);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsAccordionItemDetails_details, this.shadowRoot?.querySelector('[part="details"]'), "f");
        // 初期状態の設定
        if (this.hasAttribute('expanded')) {
            __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open = true;
        }
        // イベント設定
        __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f")?.addEventListener('toggle', () => {
            this.dispatchEvent(new Event('toggle', { bubbles: true }));
        });
        // 戻るボタン
        const returnBtn = this.shadowRoot?.querySelector('[part="return-button"]');
        returnBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const summary = this.shadowRoot?.querySelector('[part="summary"]');
            summary?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            summary?.focus();
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f"))
            return;
        if (name === 'expanded') {
            __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open = newValue !== null;
        }
        else if (name === 'disabled') {
            __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").toggleAttribute('disabled', newValue !== null);
        }
    }
    // Public API
    toggle() { __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f") && (__classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open = !__classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open); }
    expand() { __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f") && (__classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open = true); }
    collapse() { __classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f") && (__classPrivateFieldGet(this, _DadsAccordionItemDetails_details, "f").open = false); }
}
_DadsAccordionItemDetails_details = new WeakMap();
DadsAccordionItemDetails.definition = {
    name: 'dads-accordion-item-details',
    template: html `
      <details part="details">
        <summary part="summary">
          <span part="icon" aria-hidden="true">
            ${createIconSVG('arrowDown', 'icon-svg', 20)}
          </span>
          <span part="header">
            <slot name="header"></slot>
          </span>
        </summary>
        <div part="content">
          <div part="content-inner">
            <slot name="content"></slot>
            <button 
              part="return-button"
              type="button"
              aria-label="先頭に戻る"
            >
              ${createIconSVG('returnArrow', 'return-icon', 24)}
              <span part="return-text">先頭に戻る</span>
            </button>
          </div>
        </div>
      </details>
    `,
    styles: accordionItemStyles,
    attributes: [
        BooleanAttr('expanded'),
        BooleanAttr('disabled'),
        PropertyAttr('icon-position')
    ]
};
// コンポーネントの登録
DadsAccordionDetails.define();
DadsAccordionItemDetails.define();
