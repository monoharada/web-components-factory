/**
 * @module blockquote
 * デジタル庁デザインシステム 引用ブロックコンポーネント
 * @version 1.1.0
 */

import {
  html,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { blockquoteTokens } from './blockquote-tokens.js';
import { blockquoteStyles } from './blockquote-styles.js';
import { withReset } from '../../styles/reset-css.js';

/**
 * 引用ブロックコンポーネント
 *
 * ## 自動スロット割り当て
 * slot属性を指定しない要素は、明示的slot指定の有無に応じて振り分けられる：
 *
 * ### 明示的slot指定がない場合（要素数ベース）
 * - 1要素: lead
 * - 2要素: 最初→lead, 最後→body
 * - 3要素以上: 最初→lead, 中間→body, 最後→close
 *
 * ### 明示的slot指定がある場合
 * - lead/close両方指定: 残り全て→body
 * - leadのみ指定: 最後→close, 残り→body
 * - closeのみ指定: 最初→lead, 残り→body
 *
 * @customElement dads-blockquote
 * @tagname dads-blockquote
 *
 * @slot lead - 冒頭コンテンツ（最初の段落など）
 * @slot default - 本文コンテンツ（中間の段落群）
 * @slot close - 締め括りコンテンツ（最後の段落、出典など）
 *
 * @csspart blockquote - 引用ブロック要素（セマンティック・グリッドレイアウト・視覚スタイル）
 * @csspart lead - 冒頭スロット
 * @csspart body - 本文スロット
 * @csspart close - 締め括りスロット
 *
 * @attr {string} cite - 引用元URL
 *
 * @example
 * ```html
 * <!-- 自動スロット割り当て（3要素以上） -->
 * <dads-blockquote>
 *   <p>冒頭の段落（自動的にleadへ）</p>
 *   <p>本文の段落（自動的にbodyへ）</p>
 *   <p>締め括りの段落（自動的にcloseへ）</p>
 * </dads-blockquote>
 *
 * <!-- 明示的slot指定との混在（残りは全てbodyへ） -->
 * <dads-blockquote cite="https://example.com">
 *   <p slot="lead">冒頭の段落です。</p>
 *   <p>本文の段落1です。（bodyへ）</p>
 *   <p>本文の段落2です。（bodyへ）</p>
 *   <p slot="close">締め括りの段落です。</p>
 * </dads-blockquote>
 * ```
 */
export class DadsBlockquote extends TypographyWebComponent {
  static definition = {
    name: 'dads-blockquote',
    template: html`
      <blockquote part="blockquote">
        <slot name="lead" id="lead-slot" part="lead"></slot>
        <slot id="body-slot" part="body"></slot>
        <slot name="close" id="close-slot" part="close"></slot>
      </blockquote>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      blockquoteTokens,
      blockquoteStyles,
    ], 'full'),
    attributes: [
      PropertyAttr('cite'),
    ],
    shadowOptions: { mode: 'open' as const, slotAssignment: 'manual' as const },
  };


  // cite属性を監視対象として明示的に定義（ベースクラスでは自動処理されないため必須）
  static get observedAttributes(): string[] {
    return ['cite'];
  }

  #observer: MutationObserver | null = null;

  get #blockquote(): HTMLQuoteElement | null {
    return this.shadowRoot?.querySelector('[part="blockquote"]') as HTMLQuoteElement | null;
  }

  #getSlot(id: 'lead-slot' | 'body-slot' | 'close-slot'): HTMLSlotElement | null {
    return this.shadowRoot?.getElementById(id) as HTMLSlotElement | null;
  }

  get #leadSlot(): HTMLSlotElement | null { return this.#getSlot('lead-slot'); }
  get #bodySlot(): HTMLSlotElement | null { return this.#getSlot('body-slot'); }
  get #closeSlot(): HTMLSlotElement | null { return this.#getSlot('close-slot'); }

  #updateSlotVisibility(slot: HTMLSlotElement): void {
    slot.toggleAttribute('hidden', slot.assignedNodes().length === 0);
  }

  /**
   * 子要素を収集・分類する
   */
  #collectChildren(): {
    explicitLead: Element[];
    explicitClose: Element[];
    unslotted: Element[];
  } {
    const explicitLead: Element[] = [];
    const explicitClose: Element[] = [];
    const unslotted: Element[] = [];

    for (const child of this.children) {
      const slotAttr = child.getAttribute('slot');
      if (slotAttr === 'lead') {
        explicitLead.push(child);
      } else if (slotAttr === 'close') {
        explicitClose.push(child);
      } else if (!slotAttr) {
        unslotted.push(child);
      }
      // slot属性が他の値の場合は無視
    }

    return { explicitLead, explicitClose, unslotted };
  }

  /**
   * スロット振り分け結果の型
   */
  #distributeUnslotted(
    unslotted: Element[],
    hasExplicitLead: boolean,
    hasExplicitClose: boolean
  ): { lead: Element[]; body: Element[]; close: Element[] } {
    if (unslotted.length === 0) {
      return { lead: [], body: [], close: [] };
    }

    if (hasExplicitLead && hasExplicitClose) {
      // lead/close両方が明示指定 → 全てbodyへ
      return { lead: [], body: unslotted, close: [] };
    }

    if (hasExplicitLead) {
      return this.#distributeWithExplicitLead(unslotted);
    }

    if (hasExplicitClose) {
      return this.#distributeWithExplicitClose(unslotted);
    }

    return this.#distributeByCount(unslotted);
  }

  /**
   * leadのみ明示指定時の振り分け
   * → 最後をclose、残りをbodyへ
   */
  #distributeWithExplicitLead(unslotted: Element[]): { lead: Element[]; body: Element[]; close: Element[] } {
    if (unslotted.length >= 2) {
      return {
        lead: [],
        body: unslotted.slice(0, -1),
        close: [unslotted[unslotted.length - 1]],
      };
    }
    return { lead: [], body: unslotted, close: [] };
  }

  /**
   * closeのみ明示指定時の振り分け
   * → 最初をlead、残りをbodyへ
   */
  #distributeWithExplicitClose(unslotted: Element[]): { lead: Element[]; body: Element[]; close: Element[] } {
    return {
      lead: [unslotted[0]],
      body: unslotted.slice(1),
      close: [],
    };
  }

  /**
   * 要素数に基づく自動振り分け
   * - 1要素: lead
   * - 2要素: 最初→lead, 最後→body
   * - 3要素以上: 最初→lead, 中間→body, 最後→close
   */
  #distributeByCount(unslotted: Element[]): { lead: Element[]; body: Element[]; close: Element[] } {
    const count = unslotted.length;

    if (count === 1) {
      return { lead: [unslotted[0]], body: [], close: [] };
    }

    if (count === 2) {
      return { lead: [unslotted[0]], body: [unslotted[1]], close: [] };
    }

    // 3要素以上
    return {
      lead: [unslotted[0]],
      body: unslotted.slice(1, -1),
      close: [unslotted[unslotted.length - 1]],
    };
  }

  /**
   * 子要素を自動的にスロットに振り分ける
   * - 明示的にslot属性を指定した要素は尊重
   * - slot属性なしの要素は位置に基づいて自動振り分け
   */
  #assignSlots(): void {
    const leadSlot = this.#leadSlot;
    const bodySlot = this.#bodySlot;
    const closeSlot = this.#closeSlot;

    if (!leadSlot || !bodySlot || !closeSlot) return;

    const { explicitLead, explicitClose, unslotted } = this.#collectChildren();
    const auto = this.#distributeUnslotted(
      unslotted,
      explicitLead.length > 0,
      explicitClose.length > 0
    );

    // スロットに割り当て
    leadSlot.assign(...explicitLead, ...auto.lead);
    bodySlot.assign(...auto.body);
    closeSlot.assign(...explicitClose, ...auto.close);

    // 可視性更新
    this.#updateSlotVisibility(leadSlot);
    this.#updateSlotVisibility(bodySlot);
    this.#updateSlotVisibility(closeSlot);
  }

  connectedCallback() {
    super.connectedCallback();

    // cite属性の初期同期
    const cite = this.getAttribute('cite');
    if (cite && this.#blockquote) {
      this.#blockquote.setAttribute('cite', cite);
    }

    // 子要素の変更を監視
    this.#observer = new MutationObserver(() => this.#assignSlots());
    this.#observer.observe(this, { childList: true });

    // 初期スロット割り当て
    this.#assignSlots();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    const blockquote = this.#blockquote;
    if (name === 'cite' && blockquote) {
      if (newValue) {
        blockquote.setAttribute('cite', newValue);
      } else {
        blockquote.removeAttribute('cite');
      }
    }
  }
}
