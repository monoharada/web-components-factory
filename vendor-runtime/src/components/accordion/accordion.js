/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * details/summary要素 + ::part()ベースの実装
 * @version 3.0.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsAccordionDetails_allowMultiple, _DadsAccordionItemDetails_instances, _DadsAccordionItemDetails_details, _DadsAccordionItemDetails_updateReturnLinkText;
import { html, css, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { accordionTokens, createIconSVG } from '../../styles/design-tokens/accordion-tokens.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { accordionItemStyles } from '../../styles/accordion-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
/**
 * アコーディオンコンテナコンポーネント
 *
 * @customElement dads-accordion-details
 * @tagname dads-accordion-details
 *
 * @slot default - アコーディオンアイテム（dads-accordion-item-details）
 *
 * @csspart container - アイテムを内包するコンテナ
 *
 * @attr {boolean} allow-multiple - 複数アイテムの同時展開を許可
 * @attr {string} animation - アニメーション方針（例: none）
 * @attr {boolean} respect-motion-preference - prefers-reduced-motion に追従
 */
export class DadsAccordionDetails extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsAccordionDetails_allowMultiple.set(this, false);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsAccordionDetails_allowMultiple, this.hasAttribute('allow-multiple'), "f");
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
            if (__classPrivateFieldGet(this, _DadsAccordionDetails_allowMultiple, "f"))
                return;
            const target = e.target;
            const openedDetails = target?.tagName === 'DETAILS'
                ? target
                : (target?.tagName === 'DADS-ACCORDION-ITEM-DETAILS'
                    ? target.shadowRoot?.querySelector('[part="details"]')
                    : null);
            if (!openedDetails?.open)
                return;
            const items = this.querySelectorAll('dads-accordion-item-details');
            for (const item of items) {
                const details = item.shadowRoot?.querySelector('[part="details"]');
                if (details && details !== openedDetails && details.open) {
                    details.open = false;
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        accordionTokens,
        css `
        :host {
          display: block;
          width: 100%;
        }
      `
    ], 'minimal'),
    attributes: [
        BooleanAttr('allow-multiple'),
        PropertyAttr('animation'),
        BooleanAttr('respect-motion-preference')
    ]
};
/**
 * アコーディオンアイテムコンポーネント
 *
 * @customElement dads-accordion-item-details
 * @tagname dads-accordion-item-details
 *
 * @slot header - 見出し
 * @slot content - 本文
 *
 * @csspart details - <details> 要素
 * @csspart summary - <summary> 要素
 * @csspart icon - 開閉状態アイコン
 * @csspart header - 見出しラッパー
 * @csspart content - 本文領域
 * @csspart content-inner - 本文内側
 * @csspart return-button - 先頭に戻るリンク
 * @csspart return-icon - 戻るアイコン
 * @csspart return-text - 戻るテキスト
 *
 * @attr {boolean} expanded - 初期展開状態
 * @attr {boolean} disabled - 無効状態
 * @attr {string} icon-position - アイコン位置
 *
 * @fires toggle - 展開/折りたたみ時に発火（bubbles）
 */
export class DadsAccordionItemDetails extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsAccordionItemDetails_instances.add(this);
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
        // 戻るリンク
        const returnLink = this.shadowRoot?.querySelector('[part="return-button"]');
        const returnText = this.shadowRoot?.querySelector('[part="return-text"]');
        // 見出しテキストを取得してリンクテキストに反映
        __classPrivateFieldGet(this, _DadsAccordionItemDetails_instances, "m", _DadsAccordionItemDetails_updateReturnLinkText).call(this, returnText);
        // headerスロットの変更を監視
        const headerSlot = this.shadowRoot?.querySelector('slot[name="header"]');
        headerSlot?.addEventListener('slotchange', () => {
            __classPrivateFieldGet(this, _DadsAccordionItemDetails_instances, "m", _DadsAccordionItemDetails_updateReturnLinkText).call(this, returnText);
        });
        returnLink?.addEventListener('click', (e) => {
            e.preventDefault(); // リンクのデフォルト動作を防止
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
_DadsAccordionItemDetails_details = new WeakMap(), _DadsAccordionItemDetails_instances = new WeakSet(), _DadsAccordionItemDetails_updateReturnLinkText = function _DadsAccordionItemDetails_updateReturnLinkText(returnText) {
    if (!returnText)
        return;
    const headerSlot = this.shadowRoot?.querySelector('slot[name="header"]');
    const assignedNodes = headerSlot?.assignedNodes({ flatten: true }) ?? [];
    let headerText = '';
    for (const node of assignedNodes) {
        headerText += node.textContent ?? '';
    }
    headerText = headerText.trim();
    if (headerText) {
        returnText.textContent = `「${headerText}」の先頭に戻る`;
    }
};
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
            <a
              part="return-button"
              href="#"
            >
              ${createIconSVG('returnArrow', 'return-icon', 24)}
              <span part="return-text">先頭に戻る</span>
            </a>
          </div>
        </div>
      </details>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        accordionTokens,
        accordionItemStyles,
        applyDADSFocusStyles(),
    ], 'full'),
    attributes: [
        BooleanAttr('expanded'),
        BooleanAttr('disabled'),
        PropertyAttr('icon-position')
    ]
};
// コンポーネントの登録は定義ファイルで行う
