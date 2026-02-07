/**
 * @module heading
 * デジタル庁デザインシステム 見出しコンポーネント
 * @version 1.0.0
 */

import {
  html,
  PropertyAttr,
  BooleanAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { headingTokens } from './heading-tokens.js';
import { headingStyles } from './heading-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { hasSlotContent } from '../../utils/dom.js';

const VALID_LEVELS = ['1', '2', '3', '4', '5', '6'];
const VALID_SIZES = ['64', '57', '45', '36', '32', '28', '24', '20', '18', '16'];
const VALID_RULES = ['8', '6', '4', '2'];
const VALID_MARGINS = ['none', 'top'];

const normalizeLevel = (value: string | null): string => {
  if (!value) return '2';
  const trimmed = value.trim().toLowerCase();
  const numeric = trimmed.startsWith('h') ? trimmed.slice(1) : trimmed;
  return VALID_LEVELS.includes(numeric) ? numeric : '2';
};

const normalizeSize = (value: string | null): string => {
  if (!value) return '36';
  return VALID_SIZES.includes(value) ? value : '36';
};

const normalizeRule = (value: string | null): string | null => {
  if (value === null) return null;
  if (value === '') return '6';
  return VALID_RULES.includes(value) ? value : '6';
};

const normalizeMargin = (value: string | null): string => {
  if (!value) return 'none';
  return VALID_MARGINS.includes(value) ? value : 'none';
};

/**
 * 見出しコンポーネント
 *
 * @customElement
 * @tagname dads-heading
 *
 * @slot default - 見出しテキスト
 * @slot shoulder - ショルダーテキスト
 * @slot icon - 先頭アイコン
 *
 * 挙動メモ:
 * - `slot="shoulder"` と `slot="icon"` は同時に指定できます（shoulderは上、iconは見出し行の先頭）。
 * - slot が無い場合は該当パーツは表示されません（内部で `data-has-*` を付与して制御）。
 * - `chip` / `rule` は装飾（意匠）です。情報の唯一の手掛かりにしないでください。
 *
 * @csspart group - 見出しグループ
 * @csspart chip - 左チップ（装飾）※ 注釈用アンカーも兼ねる
 * @csspart shoulder - ショルダーテキスト
 * @csspart heading - 見出し本体
 * @csspart icon - アイコンラッパー
 *
 * @attr {string} level - 見出しレベル（1-6 or h1-h6）
 * @attr {string} size - 見出しサイズ（64|57|45|36|32|28|24|20|18|16）
 * @attr {string} margin - 上マージン（none|top）
 * @attr {string} rule - 下線の太さ（8|6|4|2）
 * @attr {boolean} chip - 左チップ（装飾）表示
 *
 * @cssprop --dads-heading-color - 文字色
 * @cssprop --dads-heading-font-size - 見出しフォントサイズ
 * @cssprop --dads-heading-line-height - 行高
 * @cssprop --dads-heading-letter-spacing - 文字間隔
 * @cssprop --dads-heading-shoulder-font-size - ショルダーのフォントサイズ
 * @cssprop --dads-heading-icon-size - アイコンサイズ
 * @cssprop --dads-heading-icon-gap - アイコンと本文の間隔
 * @cssprop --dads-heading-icon-vertical-align - アイコンのベースライン補正（vertical-align）
 * @cssprop --dads-heading-margin-block-start-base - 上マージンのベース値
 * @cssprop --dads-heading-margin-scale - 上マージンの倍率（例: compact連動）
 * @cssprop --dads-heading-margin-block-start - 上マージン
 * @cssprop --dads-heading-chip-color - チップ色
 * @cssprop --dads-heading-chip-width - チップの幅
 * @cssprop --dads-heading-chip-padding-inline - チップのインライン余白
 * @cssprop --dads-heading-chip-top - チップの上位置
 * @cssprop --dads-heading-chip-bottom - チップの下位置
 * @cssprop --dads-heading-rule-color - ルール色
 *
 * @example
 * ```html
 * <dads-heading level="2" size="36">見出し</dads-heading>
 * <dads-heading level="3" size="28" margin="top">小見出し</dads-heading>
 * <dads-heading level="2" size="36" chip rule="6">見出し</dads-heading>
 * <dads-heading level="2" size="36">
 *   <span slot="shoulder">ショルダー</span>
 *   見出し
 * </dads-heading>
 * <dads-heading level="2" size="36">
 *   <span slot="icon" aria-hidden="true">★</span>
 *   見出し
 * </dads-heading>
 *
 * <!-- shoulder + icon は同時に使えます -->
 * <dads-heading level="2" size="36">
 *   <span slot="shoulder">カテゴリ</span>
 *   <svg slot="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="..."></path></svg>
 *   見出し
 * </dads-heading>
 * ```
 */
export class DadsHeading extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-heading',
    template: html`
      <div part="group">
        <span part="chip" aria-hidden="true"></span>
        <span part="shoulder" id="shoulder">
          <slot name="shoulder"></slot>
        </span>
        <span part="heading" id="heading">
          <span part="icon" id="icon">
            <slot name="icon"></slot>
          </span>
          <slot></slot>
        </span>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      headingTokens,
      headingStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('level'),
      PropertyAttr('size'),
      PropertyAttr('margin'),
      PropertyAttr('rule'),
      BooleanAttr('chip'),
    ],
  };

  declare level: string | null;
  declare size: string | null;
  declare margin: string | null;
  declare rule: string | null;
  declare chip: boolean;

  #shoulderSlot: HTMLSlotElement | null = null;
  #iconSlot: HTMLSlotElement | null = null;
  #slotObserver: MutationObserver | null = null;
  #onSlotChange = () => {
    const hasSlotShoulder =
      hasSlotContent(this.#shoulderSlot) || !!this.querySelector('[slot="shoulder"]');
    const hasSlotIcon =
      hasSlotContent(this.#iconSlot) || !!this.querySelector('[slot="icon"]');

    const hasChip = this.hasAttribute('chip');
    const hasShoulder = hasSlotShoulder;
    const hasIcon = hasSlotIcon;

    this.toggleAttribute('data-has-chip', hasChip);
    this.toggleAttribute('data-has-shoulder', hasShoulder);
    this.toggleAttribute('data-has-icon', hasIcon);
  };

  connectedCallback() {
    super.connectedCallback();

    setDefaultAttributes(this, {
      level: '2',
      size: '36',
      margin: 'none',
    });

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'heading');
    }

    this.#syncLevel();
    this.#syncSize();
    this.#syncRule();
    this.#syncMargin();
    this.#setupSlots();
  }

  disconnectedCallback() {
    this.#cleanupSlots();
    super.disconnectedCallback();
  }

  levelChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeLevel(newValue);
    if (newValue !== normalized) {
      this.setAttribute('level', normalized);
      return;
    }
    this.setAttribute('aria-level', normalized);
  }

  sizeChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeSize(newValue);
    if (newValue !== normalized) {
      this.setAttribute('size', normalized);
    }
  }

  chipChanged(_oldValue: string | null, _newValue: string | null): void {
    this.#onSlotChange();
  }

  ruleChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeRule(newValue);
    if (normalized === null) return;
    if (newValue !== normalized) {
      this.setAttribute('rule', normalized);
    }
  }

  marginChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeMargin(newValue);
    if (newValue !== normalized) {
      this.setAttribute('margin', normalized);
    }
  }

  #syncLevel(): void {
    const normalized = normalizeLevel(this.getAttribute('level'));
    if (this.getAttribute('level') !== normalized) {
      this.setAttribute('level', normalized);
    }
    this.setAttribute('aria-level', normalized);
  }

  #syncSize(): void {
    const normalized = normalizeSize(this.getAttribute('size'));
    if (this.getAttribute('size') !== normalized) {
      this.setAttribute('size', normalized);
    }
  }

  #syncRule(): void {
    const normalized = normalizeRule(this.getAttribute('rule'));
    if (normalized === null) return;
    if (this.getAttribute('rule') !== normalized) {
      this.setAttribute('rule', normalized);
    }
  }

  #syncMargin(): void {
    const normalized = normalizeMargin(this.getAttribute('margin'));
    if (this.getAttribute('margin') !== normalized) {
      this.setAttribute('margin', normalized);
    }
  }

  #setupSlots(): void {
    this.#shoulderSlot = this.shadowRoot?.querySelector('slot[name="shoulder"]') ?? null;
    this.#iconSlot = this.shadowRoot?.querySelector('slot[name="icon"]') ?? null;

    this.#shoulderSlot?.addEventListener('slotchange', this.#onSlotChange);
    this.#iconSlot?.addEventListener('slotchange', this.#onSlotChange);

    // slotchange が発火しない環境向けに Light DOM を監視
    this.#slotObserver = new MutationObserver(() => this.#onSlotChange());
    this.#slotObserver.observe(this, {
      attributes: true,
      attributeFilter: ['slot'],
      characterData: true,
      childList: true,
      subtree: true,
    });
    this.#onSlotChange();
  }

  #cleanupSlots(): void {
    this.#shoulderSlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#iconSlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#slotObserver?.disconnect();
    this.#slotObserver = null;
  }
}
