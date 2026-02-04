/**
 * @module fieldset
 * デジタル庁デザインシステム Fieldsetコンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import {
  setupSlotChangeListeners,
  updateLabelFallback,
  updateSupportFallback,
  updateRequirement,
} from '../../utils/form-component-helpers.js';
import { fieldsetStyles } from './fieldset-styles.js';

/**
 * Fieldsetコンポーネント
 *
 * フォーム要素をグループ化し、legend（凡例）とsupport-text（サポートテキスト）を提供します。
 * 子要素のdads-checkboxやdads-radioにaria-describedbyを自動設定します。
 *
 * @customElement dads-fieldset
 * @tagname dads-fieldset
 *
 * @csspart fieldset - fieldset要素
 * @csspart legend - legend要素
 * @csspart legend-fallback - legend属性のフォールバック表示
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart support-fallback - support-text属性のフォールバック表示
 * @csspart content - 子要素コンテナ
 *
 * @attr {string} legend - レジェンドテキスト（フォールバック用）
 * @attr {string} support-text - サポートテキスト（フォールバック用）
 * @attr {boolean} required - ※必須ラベルを表示
 * @attr {boolean} disabled - 無効状態（子要素に伝播）
 *
 * @slot legend - カスタムレジェンド
 * @slot support-text - カスタムサポートテキスト
 * @slot - デフォルト（子要素）
 */
export class DadsFieldset extends TypographyFormComponent {
  static override readonly formAssociated = true;

  static readonly version = '1.0.0';


  // 一意ID（aria-describedby用）
  #uniqueId = `dads-fieldset-${crypto.randomUUID().slice(0, 8)}`;
  #lastSupportTextId: string | null = null;

  // Slot references
  #legendSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #defaultSlot: HTMLSlotElement | null = null;

  // Element references
  #legendFallback: HTMLElement | null = null;
  #supportText: HTMLElement | null = null;
  #supportFallback: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;

  // MutationObserver for child changes
  #childObserver: MutationObserver | null = null;

  static definition = {
    name: 'dads-fieldset',
    template: html`
      <fieldset part="fieldset" id="fieldset">
        <legend part="legend" id="legend">
          <slot name="legend" id="legend-slot"></slot>
          <span part="legend-fallback" id="legend-fallback"></span>
          <span part="requirement" id="requirement"></span>
        </legend>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span part="support-fallback" id="support-fallback"></span>
        </div>

        <div part="content" id="content">
          <slot id="default-slot"></slot>
        </div>
      </fieldset>
    `,
    styles: withReset([applyDADSTokens(), fieldsetStyles], 'minimal'),
    attributes: [
      PropertyAttr('legend'),
      PropertyAttr('support-text'),
      BooleanAttr('required'),
      BooleanAttr('disabled'),
    ],
  };

  static get observedAttributes(): string[] {
    return ['legend', 'support-text', 'required', 'disabled'];
  }

  connectedCallback(): void {
    super.connectedCallback();

    // 要素参照を取得
    this.#legendSlot = this.shadowRoot?.querySelector('#legend-slot') as HTMLSlotElement | null;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement | null;
    this.#defaultSlot = this.shadowRoot?.querySelector('#default-slot') as HTMLSlotElement | null;
    this.#legendFallback = this.shadowRoot?.querySelector('#legend-fallback') as HTMLElement | null;
    this.#supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement | null;
    this.#supportFallback = this.shadowRoot?.querySelector('#support-fallback') as HTMLElement | null;
    this.#requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement | null;

    // スロット変更監視
    setupSlotChangeListeners(
      {
        label: this.#legendSlot,
        support: this.#supportSlot,
      },
      {
        onLabelChange: () => this.#syncLegend(),
        onSupportChange: () => this.#handleSupportSlotChange(),
      }
    );

    // デフォルトスロット監視（子要素のaria設定用）
    this.#defaultSlot?.addEventListener('slotchange', () => this.#handleDefaultSlotChange());

    // MutationObserverで子要素の変更を監視（happy-domなど一部環境でslotchangeが発火しないため）
    this.#childObserver = new MutationObserver(() => {
      this.#setupChildAriaDescribedBy();
    });
    this.#childObserver.observe(this, { childList: true, subtree: false });

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#childObserver?.disconnect();
    this.#childObserver = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case 'legend':
        this.#syncLegend();
        break;
      case 'support-text':
        this.#handleSupportSlotChange();
        break;
      case 'required':
        this.#syncRequirement();
        this.#syncChildRequirements();
        break;
      case 'disabled':
        this.#propagateDisabled();
        break;
    }
  }

  // ============================================================
  // Internal sync
  // ============================================================

  #syncAll(): void {
    this.#syncLegend();
    this.#syncSupportText();
    this.#syncRequirement();
    this.#setupChildAriaDescribedBy();
    this.#propagateDisabled();
  }

  #syncLegend(): void {
    updateLabelFallback(
      this.#legendSlot,
      this.#legendFallback,
      this.getAttribute('legend')
    );
  }

  #syncSupportText(): void {
    updateSupportFallback(
      this.#supportSlot,
      this.#supportText,
      this.#supportFallback,
      this.getAttribute('support-text')
    );
  }

  #handleSupportSlotChange(): void {
    this.#syncSupportText();
    this.#setupChildAriaDescribedBy();
  }

  #handleDefaultSlotChange(): void {
    this.#setupChildAriaDescribedBy();
    this.#syncChildRequirements();
  }

  #syncRequirement(): void {
    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
  }

  /**
   * 核心ロジック: Light DOM側要素へのaria-describedby自動設定
   */
  #setupChildAriaDescribedBy(): void {
    const previousId = this.#lastSupportTextId;

    // Light DOM側のsupport-text要素にIDを付与（既存IDがあれば保持）
    const assignedSupport = this.#supportSlot?.assignedElements()[0] as HTMLElement | undefined;
    let nextId: string | null = null;
    if (assignedSupport) {
      const existingId = assignedSupport.id.trim();
      if (existingId) {
        nextId = existingId;
      } else {
        nextId = `${this.#uniqueId}-support`;
        assignedSupport.id = nextId;
      }
    }

    // スロット要素が無く、かつ過去に設定したIDも無い場合は何もしない
    if (!previousId && !nextId) return;

    // 2. 子form要素にaria-describedbyを設定
    const formChildren = this.querySelectorAll(
      'dads-checkbox, dads-radio, dads-input-text, dads-textarea, dads-date-picker, input, select, textarea'
    );

    for (const child of formChildren) {
      const existing = child.getAttribute('aria-describedby') || '';
      const ids = new Set(existing.split(' ').filter(Boolean));

      if (previousId) ids.delete(previousId);
      if (nextId) ids.add(nextId);

      const describedBy = [...ids].join(' ');
      if (describedBy) child.setAttribute('aria-describedby', describedBy);
      else child.removeAttribute('aria-describedby');
    }

    this.#lastSupportTextId = nextId;
  }

  /**
   * disabled属性を子要素に伝播
   */
  #propagateDisabled(): void {
    const isDisabled = this.hasAttribute('disabled');
    const formChildren = this.querySelectorAll(
      'dads-checkbox, dads-radio, dads-input-text, dads-textarea, dads-date-picker'
    );

    for (const child of formChildren) {
      child.toggleAttribute('disabled', isDisabled);
    }
  }

  /**
   * 子要素に※必須表示の再同期を通知
   * checkboxなどは親fieldsetのrequired状態に応じて自身の※必須表示を変更する
   */
  #syncChildRequirements(): void {
    const formChildren = this.querySelectorAll('dads-checkbox, dads-radio');

    for (const child of formChildren) {
      // 子要素のsyncRequirement()メソッドを呼び出す（存在する場合）
      const anyChild = child as unknown as { syncRequirement?: () => void };
      if (typeof anyChild.syncRequirement === 'function') {
        anyChild.syncRequirement();
      }
    }
  }
}
