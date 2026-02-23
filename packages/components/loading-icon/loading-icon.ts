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
          <path d="M24 24C34.5 24 35.5 6 35.5 4.78V4M24 24C13.5 24 12.5 6 12.5 4.78V4M24 24C31 24 35.5 35.79 35.5 42.26V44M24 24C17 24 12.5 35.79 12.5 42.26V44M9 4H39M9 44H39" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M17 15C17 17.5 19.241 22 24 22C28.759 22 31 17 31 15H17Z" fill="currentColor"/>
          <path d="M15 42C16.895 42 31.579 42 33 42C33 40.001 32 37.5 32 37.5L24 34L16 37.5C16 37.5 15 40.001 15 42Z" fill="currentColor"/>
          <circle cx="24" cy="28" r="1" fill="currentColor"/>
          <circle cx="24" cy="31" r="1" fill="currentColor"/>
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
