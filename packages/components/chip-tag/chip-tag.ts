/**
 * @module chip-tag
 * デジタル庁デザインシステム チップタグコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { chipTagTokens } from './chip-tag-tokens.js';
import { chipTagStyles } from './chip-tag-styles.js';
import type { DadsCommandDetail } from '../../utils/command-store.js';

/**
 * チップタグコンポーネント
 *
 * @customElement dads-chip-tag
 * @tagname dads-chip-tag
 *
 * @slot start-icon - 先頭アイコン（オプション）
 * @slot default - ラベルテキスト
 * @slot end-icon - 末尾アイコン（オプション / 削除アクション用）
 *
 * @csspart base - チップタグ本体
 * @csspart start-icon - 先頭アイコンスロット
 * @csspart label - ラベルテキストコンテナ
 * @csspart value - value属性の表示テキスト
 * @csspart action - 末尾アクションボタン
 * @csspart action-icon - 末尾アイコンコンテナ
 *
 * @attr {'remove' | 'none'} action - 末尾アクションの表示制御
 * @attr {string} remove-label - 末尾アクションのaria-label
 * @attr {string} value - 任意の値（イベントdetailに含まれる）
 * @attr {string} size - サイズ (sm | md | lg)
 *
 * @cssprop --dads-chip-tag-background - 背景色
 * @cssprop --dads-chip-tag-border-color - 枠線色
 * @cssprop --dads-chip-tag-border-width - 枠線の太さ
 * @cssprop --dads-chip-tag-border-shadow - 外周の補助線
 * @cssprop --dads-chip-tag-border-shadow-hover - hover時の外周補助線
 * @cssprop --dads-chip-tag-text-color - テキスト色
 * @cssprop --dads-chip-tag-text-color-hover - hover時のテキスト色
 * @cssprop --dads-chip-tag-text-color-active - active時のテキスト色
 * @cssprop --dads-chip-tag-border-radius - 角丸
 * @cssprop --dads-chip-tag-min-height - 最小高さ
 * @cssprop --dads-chip-tag-padding-block - 上下パディング
 * @cssprop --dads-chip-tag-padding-inline - 左右パディング
 * @cssprop --dads-chip-tag-label-padding-inline - ラベルの左右パディング
 * @cssprop --dads-chip-tag-label-padding-bottom - ラベルの下パディング
 * @cssprop --dads-chip-tag-label-text-decoration - ラベルの装飾線
 * @cssprop --dads-chip-tag-label-underline-thickness - ラベル下線の太さ
 * @cssprop --dads-chip-tag-label-underline-thickness-hover - hover/active時のラベル下線の太さ
 * @cssprop --dads-chip-tag-label-underline-offset - ラベル下線のオフセット
 * @cssprop --dads-chip-tag-icon-size - アイコンサイズ
 * @cssprop --dads-chip-tag-action-hit-area - アクションのヒット領域（見た目は維持したまま拡張）
 * @cssprop --dads-chip-tag-action-icon-size - アクション内アイコンサイズ
 *
 * @fires dads-chip-tag-remove - 末尾アクション押下時に発火（detail: { label, value, remove() })
 * @fires dads-chip-tag-click - action="none"時、チップ本体押下で発火（detail: { label, value })
 *
 * NOTE: Invoker API / commandfor は現時点では採用せず、CustomEvent で操作を公開します。
 *
 * @example
 * ```html
 * <dads-chip-tag>
 *   <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
 *     <path d="..."/>
 *   </svg>
 *   ラベル
 * </dads-chip-tag>
 * ```
 */
export class DadsChipTag extends TypographyWebComponent {
  static definition = {
    name: 'dads-chip-tag',
    template: html`
      <span part="base">
        <slot name="start-icon" part="start-icon"></slot>
        <span part="label">
          <span part="value" data-value-text></span>
          <slot></slot>
        </span>
        <button part="action" type="button">
          <span part="action-icon">
            <slot name="end-icon">
              <svg width="24" height="24" viewBox="0 0 19 19" fill="currentcolor" aria-hidden="true">
                <path d="M5.89998 14.1538L9.49998 10.5538L13.1 14.1538L14.1538 13.1L10.5538 9.49998L14.1538 5.89998L13.1 4.84615L9.49998 8.44615L5.89998 4.84615L4.84615 5.89998L8.44615 9.49998L4.84615 13.1L5.89998 14.1538Z" />
              </svg>
            </slot>
          </span>
        </button>
      </span>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        chipTagTokens,
        chipTagStyles,
        applyDADSFocusStyles(),
      ],
      'minimal'
    ),
    attributes: [
      PropertyAttr('action'),
      PropertyAttr('remove-label'),
      PropertyAttr('value'),
      PropertyAttr('size'),
    ],
  };

  #base: HTMLElement | null = null;
  #action: HTMLButtonElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #valueText: HTMLElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, { action: 'remove', 'remove-label': '削除', size: 'md' });

    this.#base = this.shadowRoot?.querySelector('[part="base"]') ?? null;
    this.#action = this.shadowRoot?.querySelector('[part="action"]') ?? null;
    this.#labelSlot = this.shadowRoot?.querySelector('slot:not([name])') ?? null;
    this.#valueText = this.shadowRoot?.querySelector('[data-value-text]') ?? null;

    this.#syncActionState();
    this.#syncActionLabel();
    this.#syncValueLabel();

    this.addEventListener('dads-command', this.#handleDadsCommand as EventListener);
    this.#base?.addEventListener('click', this.#handleBaseClick);
    this.#base?.addEventListener('keydown', this.#handleBaseKeydown);
    this.#action?.addEventListener('click', this.#handleActionClick);
  }

  disconnectedCallback(): void {
    this.removeEventListener('dads-command', this.#handleDadsCommand as EventListener);
    this.#base?.removeEventListener('click', this.#handleBaseClick);
    this.#base?.removeEventListener('keydown', this.#handleBaseKeydown);
    this.#action?.removeEventListener('click', this.#handleActionClick);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'action') {
      this.#syncActionState();
    }

    if (name === 'remove-label') {
      this.#syncActionLabel();
    }

    if (name === 'value') {
      this.#syncValueLabel();
    }
  }

  #syncActionState(): void {
    const isActionNone = this.getAttribute('action') === 'none';

    if (this.#base) {
      if (isActionNone) {
        this.#base.setAttribute('role', 'button');
        this.#base.setAttribute('tabindex', '0');
      } else {
        this.#base.removeAttribute('role');
        this.#base.removeAttribute('tabindex');
      }
    }

    if (this.#action) {
      this.#action.tabIndex = isActionNone ? -1 : 0;
      this.#action.setAttribute('aria-hidden', isActionNone ? 'true' : 'false');
    }
  }

  #syncActionLabel(): void {
    if (!this.#action) return;
    const label = this.getAttribute('remove-label') || '削除';
    this.#action.setAttribute('aria-label', label);
  }

  #syncValueLabel(): void {
    const value = this.getAttribute('value') ?? '';
    const hasValue = value.trim().length > 0;
    this.toggleAttribute('data-has-value', hasValue);
    if (this.#valueText) {
      this.#valueText.textContent = hasValue ? value : '';
    }
  }

  #handleActionClick = (event: MouseEvent): void => {
    if (this.getAttribute('action') === 'none') return;
    event.stopPropagation();
    this.#requestRemove();
  };

  #handleDadsCommand = (event: CustomEvent<DadsCommandDetail>): void => {
    if (event.target !== this) return;

    const command = event.detail?.command ?? '';
    if (command === 'remove') {
      if (this.getAttribute('action') === 'none') return;
      event.preventDefault();
      this.#requestRemove();
      return;
    }

    if (command === 'click') {
      if (this.getAttribute('action') !== 'none') return;
      event.preventDefault();
      this.#handleBaseClick();
    }
  };

  #requestRemove(): void {
    const removeEvent = new CustomEvent('dads-chip-tag-remove', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        label: this.#getLabelText(),
        value: this.getAttribute('value'),
        remove: () => this.remove(),
      },
    });

    this.dispatchEvent(removeEvent);

    if (!removeEvent.defaultPrevented) {
      this.remove();
    }
  }

  #handleBaseClick = (): void => {
    if (this.getAttribute('action') !== 'none') return;

    this.dispatchEvent(
      new CustomEvent('dads-chip-tag-click', {
        bubbles: true,
        composed: true,
        detail: {
          label: this.#getLabelText(),
          value: this.getAttribute('value'),
        },
      })
    );
  };

  #handleBaseKeydown = (event: KeyboardEvent): void => {
    if (this.getAttribute('action') !== 'none') return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#handleBaseClick();
    }
  };

  #getLabelText(): string {
    const slot = this.#labelSlot;
    if (!slot) return '';
    const nodes = slot.assignedNodes({ flatten: true });
    return nodes.map((node) => node.textContent ?? '').join('').trim();
  }
}
