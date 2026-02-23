/**
 * @module loading-icon
 * デジタル庁デザインシステム LoadingIconコンポーネント
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
import { loadingIconTokens } from './loading-icon-tokens.js';
import { loadingIconStyles } from './loading-icon-styles.js';

/**
 * LoadingIconコンポーネント
 *
 * 砂時計形状の静的アイコンで非同期処理中を表示する。
 * アニメーションなし。dads-iconのlabel/ARIAパターンを踏襲。
 *
 * @customElement
 * @tagname dads-loading-icon
 *
 * @csspart base - ルートコンテナ
 * @csspart underlay - カード背景（underlay属性時に表示）
 * @csspart icon - SVGアイコン要素
 * @csspart label - ラベルテキスト
 *
 * @attr {'sm' | 'lg'} size - サイズ（sm: 24px, lg: 48px）
 * @attr {'stacked' | 'inlined'} composition - レイアウト方向
 * @attr {boolean} underlay - カード背景表示
 * @attr {string} label - 表示ラベル兼アクセシブル名（指定時はaria-hidden解除、role="img"、title要素追加）
 *
 * @cssprop --dads-loading-icon-color - アイコン色
 * @cssprop --dads-loading-icon-label-color - ラベルテキスト色
 * @cssprop --dads-loading-icon-underlay-bg - アンダーレイ背景色
 * @cssprop --dads-loading-icon-underlay-border - アンダーレイ枠線色
 *
 * @example
 * ```html
 * <dads-loading-icon label="読み込み中"></dads-loading-icon>
 * <dads-loading-icon size="sm" composition="inlined" label="処理中..."></dads-loading-icon>
 * <dads-loading-icon underlay label="データ取得中"></dads-loading-icon>
 * ```
 */
export class DadsLoadingIcon extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-loading-icon',
    template: html`
      <div part="base">
        <div part="underlay" aria-hidden="true"></div>
        <svg part="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M14 4v4.01c0 2.12.84 4.16 2.34 5.66L22 19.33c1.1 1.1 1.1 2.9 0 4l-5.66 5.66A7.986 7.986 0 0014 34.65V40h20v-5.35c0-2.12-.84-4.16-2.34-5.66L26 23.33c-1.1-1.1-1.1-2.9 0-4l5.66-5.66A7.986 7.986 0 0034 8.01V4H14zm16 30.65V38H18v-3.35c0-1.59.63-3.12 1.76-4.24L24 26.17l4.24 4.24A5.993 5.993 0 0130 34.65zM30 8.01a5.993 5.993 0 01-1.76 4.24L24 16.49l-4.24-4.24A5.993 5.993 0 0118 8.01V6h12v2.01z" fill="currentColor"/>
        </svg>
        <span part="label"></span>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      loadingIconTokens,
      loadingIconStyles,
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

  #svg: SVGSVGElement | null = null;
  #labelEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#svg = this.shadowRoot?.querySelector('[part="icon"]') ?? null;
    this.#labelEl = this.shadowRoot?.querySelector('[part="label"]') ?? null;
    this.#setDefaultAttributes();
    this.#syncAccessibility();
  }

  labelChanged(): void {
    this.#syncAccessibility();
  }

  #setDefaultAttributes(): void {
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'lg');
    }
    if (!this.hasAttribute('composition')) {
      this.setAttribute('composition', 'stacked');
    }
  }

  #syncAccessibility(): void {
    if (!this.#svg || !this.#labelEl) return;

    const labelText = this.getAttribute('label');

    if (labelText && labelText.length > 0) {
      // label set: remove aria-hidden, add role="img" + aria-labelledby + <title>
      this.#svg.removeAttribute('aria-hidden');
      this.#svg.setAttribute('role', 'img');
      this.#svg.setAttribute('aria-labelledby', 'icon-title');

      let title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (!title) {
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title') as SVGTitleElement;
        this.#svg.prepend(title);
      }
      title.id = 'icon-title';
      title.textContent = labelText;

      this.#labelEl.textContent = labelText;
    } else {
      // label unset: add aria-hidden="true", remove role/aria-labelledby/<title>
      this.#svg.setAttribute('aria-hidden', 'true');
      this.#svg.removeAttribute('role');
      this.#svg.removeAttribute('aria-labelledby');

      const title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (title) title.remove();

      this.#labelEl.textContent = '';
    }
  }
}
