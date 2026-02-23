/**
 * @module progress-bar
 * デジタル庁デザインシステム Progress Barコンポーネント
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
import { progressBarTokens } from './progress-bar-tokens.js';
import { progressBarStyles } from './progress-bar-styles.js';

/**
 * Progress Barコンポーネント
 *
 * 水平バーで進捗状況を表示する。
 * value属性の有無でdeterminate/indeterminateモードを自動切替する。
 *
 * @customElement
 * @tagname dads-progress-bar
 *
 * @csspart base - ルートコンテナ（role="progressbar"）
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart track - トラックバー（背景）
 * @csspart indicator - インジケーターバー（進捗表示）
 * @csspart label - ラベルテキスト
 *
 * @attr {string} value - 進捗値（0〜max、未設定=indeterminate）
 * @attr {string} max - 最大値（デフォルト: 1、0以下は1にクランプ）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名
 *
 * @cssprop --dads-progress-bar-track-color - トラック色
 * @cssprop --dads-progress-bar-indicator-color - インジケーター色
 * @cssprop --dads-progress-bar-label-color - ラベルテキスト色
 * @cssprop --dads-progress-bar-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-progress-bar-underlay-border - アンダーレイ枠線色
 *
 * @example
 * ```html
 * <dads-progress-bar value="0.5" label="50%"></dads-progress-bar>
 * <dads-progress-bar value="3" max="10" label="30%"></dads-progress-bar>
 * <dads-progress-bar label="読み込み中"></dads-progress-bar>
 * <dads-progress-bar underlay value="0.7" label="70%"></dads-progress-bar>
 * ```
 */
export class DadsProgressBar extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-progress-bar',
    template: html`
      <div part="base" role="progressbar">
        <div part="underlay" aria-hidden="true"></div>
        <div part="track">
          <div part="indicator"></div>
        </div>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      progressBarTokens,
      progressBarStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('value'),
      PropertyAttr('max'),
      PropertyAttr('composition'),
      BooleanAttr('underlay'),
      PropertyAttr('label'),
    ],
  };

  declare value: string | null;
  declare max: string | null;
  declare composition: string | null;
  declare underlay: boolean;
  declare label: string | null;

  #base: HTMLElement | null = null;
  #indicator: HTMLElement | null = null;
  #labelEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#base = this.shadowRoot?.querySelector('[part="base"]') ?? null;
    this.#indicator = this.shadowRoot?.querySelector('[part="indicator"]') ?? null;
    this.#labelEl = this.shadowRoot?.querySelector('[part="label"]') ?? null;
    this.#setDefaultAttributes();
    this.#syncProgress();
    this.#syncLabel();
  }

  valueChanged(): void {
    this.#syncProgress();
  }

  maxChanged(): void {
    this.#syncProgress();
  }

  labelChanged(): void {
    this.#syncLabel();
  }

  #setDefaultAttributes(): void {
    if (!this.hasAttribute('composition')) {
      this.setAttribute('composition', 'stacked');
    }
  }

  #syncProgress(): void {
    if (!this.#base || !this.#indicator) return;

    const rawValue = this.getAttribute('value');
    const parsedValue = rawValue !== null ? Number(rawValue) : Number.NaN;
    const isDeterminate = rawValue !== null && !Number.isNaN(parsedValue);

    if (isDeterminate) {
      const rawMax = this.getAttribute('max');
      const parsedMax = rawMax !== null ? Number(rawMax) : 1;
      const effectiveMax = parsedMax > 0 ? parsedMax : 1;
      const clamped = Math.min(Math.max(0, parsedValue), effectiveMax);
      const normalized = clamped / effectiveMax;
      const ariaValue = Math.round(normalized * 100);

      this.#indicator.style.setProperty('--progress', String(normalized));
      this.#base.setAttribute('aria-valuenow', String(ariaValue));
      this.#base.setAttribute('aria-valuemin', '0');
      this.#base.setAttribute('aria-valuemax', '100');
      this.setAttribute('data-determinate', '');
    } else {
      this.#indicator.style.removeProperty('--progress');
      this.#base.removeAttribute('aria-valuenow');
      this.#base.removeAttribute('aria-valuemin');
      this.#base.removeAttribute('aria-valuemax');
      this.removeAttribute('data-determinate');
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
