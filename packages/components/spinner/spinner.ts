/**
 * @module spinner
 * デジタル庁デザインシステム Spinnerコンポーネント
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
import { spinnerTokens } from './spinner-tokens.js';
import { spinnerStyles } from './spinner-styles.js';

/**
 * Spinnerコンポーネント
 *
 * 円形の回転アニメーションで非同期処理中を表示する。
 * indeterminate専用（進捗率の表示には dads-progress-bar を使用）。
 *
 * @customElement
 * @tagname dads-spinner
 *
 * @csspart base - ルートコンテナ（role="progressbar"）
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart svg - SVGコンテナ
 * @csspart track - トラック円（背景）
 * @csspart indicator - インジケーター円（アニメーション）
 * @csspart label - ラベルテキスト
 *
 * @attr {'sm' | 'lg'} size - サイズ（sm: 24px, lg: 48px）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名
 *
 * @cssprop --dads-spinner-track-color - トラック色
 * @cssprop --dads-spinner-indicator-color - インジケーター色
 * @cssprop --dads-spinner-label-color - ラベルテキスト色
 * @cssprop --dads-spinner-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-spinner-underlay-border - アンダーレイ枠線色
 *
 * @example
 * ```html
 * <dads-spinner label="読み込み中"></dads-spinner>
 * <dads-spinner size="sm" composition="inlined" label="処理中..."></dads-spinner>
 * <dads-spinner underlay label="データ取得中"></dads-spinner>
 * ```
 */
export class DadsSpinner extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-spinner',
    template: html`
      <div part="base" role="progressbar">
        <div part="underlay" aria-hidden="true"></div>
        <svg part="svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle part="track" cx="24" cy="24" r="20"
                  fill="none" stroke-width="4" />
          <circle part="indicator" cx="24" cy="24" r="20"
                  fill="none" stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="125.66" />
        </svg>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      spinnerTokens,
      spinnerStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('size'),
      PropertyAttr('composition'),
      BooleanAttr('underlay'),
      PropertyAttr('label'),
    ],
  };

  declare size: string | null;
  declare composition: string | null;
  declare underlay: boolean;
  declare label: string | null;

  #base: HTMLElement | null = null;
  #labelEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#base = this.shadowRoot?.querySelector('[part="base"]') ?? null;
    this.#labelEl = this.shadowRoot?.querySelector('[part="label"]') ?? null;
    this.#setDefaultAttributes();
    this.#syncLabel();
  }

  labelChanged(): void {
    this.#syncLabel();
  }

  #setDefaultAttributes(): void {
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'lg');
    }
    if (!this.hasAttribute('composition')) {
      this.setAttribute('composition', 'stacked');
    }
  }

  #syncLabel(): void {
    if (!this.#base || !this.#labelEl) return;

    const labelText = this.getAttribute('label');

    if (labelText && labelText.length > 0) {
      this.#base.setAttribute('aria-label', labelText);
      this.#labelEl.textContent = labelText;
    } else {
      this.#base.removeAttribute('aria-label');
      this.#labelEl.textContent = '';
    }
  }
}
