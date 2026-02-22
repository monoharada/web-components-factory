/**
 * @module avatar
 * デジタル庁デザインシステム Avatarコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { avatarTokens } from './avatar-tokens.js';
import { avatarStyles } from './avatar-styles.js';

const DEFAULT_SIZE = '32';
const DEFAULT_FILL = 'var(--dads-avatar-background, #949494)';

/**
 * アバターコンポーネント
 *
 * テキストイニシャルまたは写真を円形で表示するアバター。
 * コンボボックスなどの人名選択UIでアイコンとして使用可能。
 *
 * @customElement
 * @tagname dads-avatar
 *
 * @csspart svg - SVG要素（イニシャルモード）
 * @csspart img - img要素（写真モード）
 *
 * @attr {string} src - 写真URL（指定時は写真モード）
 * @attr {string} initials - 表示文字（1〜2文字、写真未指定時のフォールバック）
 * @attr {string} color - 背景色（CSSカスタムプロパティ名, 例: --color-primitive-blue-600）
 * @attr {string} size - サイズpx（デフォルト: '32'）
 * @attr {string} label - アクセシブルラベル（指定時はaria-hidden解除）
 *
 * @cssprop --dads-avatar-background - 背景色（デフォルト: #949494）
 * @cssprop --dads-avatar-text-color - テキスト色（デフォルト: white）
 *
 * @example
 * ```html
 * <dads-avatar src="/photos/taro.jpg" size="32" label="太郎"></dads-avatar>
 * <dads-avatar initials="太" color="--color-primitive-blue-600" size="32"></dads-avatar>
 * ```
 */
export class DadsAvatar extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-avatar',
    template: html`<svg part="svg" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="24" />
      <text x="24" y="31" text-anchor="middle" font-size="20"
        font-weight="bold" font-family="sans-serif"
        fill="var(--dads-avatar-text-color, white)"></text>
    </svg><img part="img" alt="" />`,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      avatarTokens,
      avatarStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('src'),
      PropertyAttr('initials'),
      PropertyAttr('color'),
      PropertyAttr('size'),
      PropertyAttr('label'),
    ],
  };

  declare src: string | null;
  declare initials: string | null;
  // Note: `color` shadows Element.prototype.color (obsolete) — intentional for HTML attribute API
  declare color: string | null;
  declare size: string | null;
  declare label: string | null;

  #svg: SVGSVGElement | null = null;
  #img: HTMLImageElement | null = null;
  #circle: SVGCircleElement | null = null;
  #text: SVGTextElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#svg = this.shadowRoot?.querySelector('svg') ?? null;
    this.#img = this.shadowRoot?.querySelector('img') ?? null;
    this.#circle = this.#svg?.querySelector('circle') ?? null;
    this.#text = this.#svg?.querySelector('text') ?? null;
    this.#render();
  }

  srcChanged(): void { this.#render(); }
  initialsChanged(): void { this.#render(); }
  colorChanged(): void { this.#render(); }
  sizeChanged(): void { this.#render(); }
  labelChanged(): void { this.#render(); }

  #render(): void {
    if (!this.#svg || !this.#img || !this.#circle || !this.#text) return;

    const src = (this.getAttribute('src') ?? '').trim();
    const sizeStr = this.getAttribute('size') ?? DEFAULT_SIZE;
    const size = /^\d+$/.test(sizeStr) ? sizeStr : DEFAULT_SIZE;
    const isPhoto = src.length > 0;

    // モード切替
    this.#svg.style.display = isPhoto ? 'none' : '';
    this.#img.style.display = isPhoto ? '' : 'none';

    if (isPhoto) {
      this.#img.src = src;
      this.#img.width = Number(size);
      this.#img.height = Number(size);
    } else {
      this.#svg.setAttribute('width', size);
      this.#svg.setAttribute('height', size);

      const colorValue = this.getAttribute('color') ?? '';
      this.#circle.setAttribute('fill', colorValue.length > 0
        ? (colorValue.startsWith('--') ? `var(${colorValue})` : colorValue)
        : DEFAULT_FILL);

      this.#text.textContent = (this.getAttribute('initials') ?? '').slice(0, 2);
    }

    // アクセシビリティ
    const labelText = this.label;
    const hasLabel = labelText != null && labelText.length > 0;

    if (hasLabel) {
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
    }

    if (isPhoto) {
      this.#img.alt = hasLabel ? labelText : '';
    } else {
      this.#syncSvgAccessibility(hasLabel, labelText ?? '');
    }
  }

  #syncSvgAccessibility(hasLabel: boolean, labelText: string): void {
    if (!this.#svg) return;

    if (hasLabel) {
      this.#svg.removeAttribute('aria-hidden');
      this.#svg.setAttribute('role', 'img');

      let title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (!title) {
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title') as SVGTitleElement;
        this.#svg.prepend(title);
      }
      title.textContent = labelText;
      title.id = 'avatar-title';
      this.#svg.setAttribute('aria-labelledby', 'avatar-title');
    } else {
      this.#svg.setAttribute('aria-hidden', 'true');
      this.#svg.removeAttribute('role');
      this.#svg.removeAttribute('aria-labelledby');

      const title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (title) title.remove();
    }
  }
}
