/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * details/summary要素 + ::part()ベースの実装
 * @version 3.0.0
 */

import { 
  html, 
  css, 
  BooleanAttr, 
  PropertyAttr 
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { 
  accordionTokens,
  createIconSVG
} from '../../styles/design-tokens/accordion-tokens.js';
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
  #allowMultiple = false;


  static definition = {
    name: 'dads-accordion-details',
    template: html`
      <div part="container" role="group">
        <slot></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      accordionTokens,
      css`
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

  connectedCallback() {
    super.connectedCallback();

    this.#allowMultiple = this.hasAttribute('allow-multiple');
    
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
    this.addEventListener('toggle', (e: Event) => {
      if (this.#allowMultiple) return;

      const target = e.target as HTMLElement | null;
      const openedDetails =
        target?.tagName === 'DETAILS'
          ? (target as HTMLDetailsElement)
          : (target?.tagName === 'DADS-ACCORDION-ITEM-DETAILS'
              ? ((target as DadsAccordionItemDetails).shadowRoot?.querySelector(
                  '[part="details"]',
                ) as HTMLDetailsElement | null)
              : null);

      if (!openedDetails?.open) return;

      const items = this.querySelectorAll('dads-accordion-item-details');
      for (const item of items) {
        const details = item.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement | null;
        if (details && details !== openedDetails && details.open) {
          details.open = false;
        }
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'allow-multiple') {
      this.#allowMultiple = newValue !== null;
    }
  }
}

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
  #details?: HTMLDetailsElement;


  static definition = {
    name: 'dads-accordion-item-details',
    template: html`
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

  connectedCallback() {
    super.connectedCallback();
    
    this.#details = this.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement;
    
    // 初期状態の設定
    if (this.hasAttribute('expanded')) {
      this.#details.open = true;
    }
    
    // イベント設定
    this.#details?.addEventListener('toggle', () => {
      this.dispatchEvent(new Event('toggle', { bubbles: true }));
    });
    
    // 戻るリンク
    const returnLink = this.shadowRoot?.querySelector('[part="return-button"]');
    const returnText = this.shadowRoot?.querySelector('[part="return-text"]');

    // 見出しテキストを取得してリンクテキストに反映
    this.#updateReturnLinkText(returnText);

    // headerスロットの変更を監視
    const headerSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header"]');
    headerSlot?.addEventListener('slotchange', () => {
      this.#updateReturnLinkText(returnText);
    });

    returnLink?.addEventListener('click', (e) => {
      e.preventDefault();  // リンクのデフォルト動作を防止
      e.stopPropagation();
      const summary = this.shadowRoot?.querySelector('[part="summary"]') as HTMLElement;
      summary?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      summary?.focus();
    });
  }

  #updateReturnLinkText(returnText: Element | null | undefined): void {
    if (!returnText) return;

    const headerSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header"]');
    const assignedNodes = headerSlot?.assignedNodes({ flatten: true }) ?? [];

    let headerText = '';
    for (const node of assignedNodes) {
      headerText += node.textContent ?? '';
    }
    headerText = headerText.trim();

    if (headerText) {
      returnText.textContent = `「${headerText}」の先頭に戻る`;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (!this.#details) return;
    
    if (name === 'expanded') {
      this.#details.open = newValue !== null;
    } else if (name === 'disabled') {
      this.#details.toggleAttribute('disabled', newValue !== null);
    }
  }
  
  // Public API
  toggle() { this.#details && (this.#details.open = !this.#details.open); }
  expand() { this.#details && (this.#details.open = true); }
  collapse() { this.#details && (this.#details.open = false); }
}

// コンポーネントの登録は定義ファイルで行う
