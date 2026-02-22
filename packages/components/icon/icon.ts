/**
 * @module icon
 * デジタル庁デザインシステム Iconコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { iconPaths, type IconName } from '../../utils/icons.js';
import { iconTokens } from './icon-tokens.js';
import { iconStyles } from './icon-styles.js';

/**
 * アイコンコンポーネント
 *
 * iconPaths に登録されたSVGアイコンを宣言的に表示する汎用コンポーネント。
 * 他コンポーネントのスロット（button の icon-start/icon-end、menu-list の start-icon 等）に配置可能。
 *
 * @customElement
 * @tagname dads-icon
 *
 * @csspart svg - SVG要素
 *
 * @attr {string} name - アイコン名（iconPathsのキー: dummy, checkmark, check, edit, delete, duplicate, download, add, subtract, search, print, update, menu, close, home, language, favorite, lock, dragIndicator, more, moreVert, mic, scanner, login, logout, settings, caret, arrowRight, arrowLeft, arrowDown, arrowUp, arrowDropUp, arrowDropDown, arrowUpward, arrowDownward, arrowForward, arrowBack, error, attention, warning, information, help, complete, checkCircle, cancel, notification, history, visibility, visibilityOff, externalLink, document, pdf, image, folder, person, location, checkbox, checkboxBlank, indeterminateCheckbox, radioChecked, radioUnchecked, circle）
 * @attr {string} size - サイズpx（デフォルト: '20'）
 * @attr {string} label - アクセシブルラベル（指定時はaria-hidden解除、role="img"、title要素追加）
 *
 * @cssprop --dads-icon-color - アイコン色（デフォルト: currentColor）
 *
 * @example
 * ```html
 * <dads-icon name="search" size="24"></dads-icon>
 * <dads-icon name="search" size="24" label="検索"></dads-icon>
 * <dads-button>
 *   <dads-icon slot="icon-start" name="search"></dads-icon>
 *   検索
 * </dads-button>
 * ```
 */
export class DadsIcon extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-icon',
    template: html`<svg part="svg" xmlns="http://www.w3.org/2000/svg"
      fill="currentColor" aria-hidden="true" focusable="false"></svg>`,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      iconTokens,
      iconStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('name'),
      PropertyAttr('size'),
      PropertyAttr('label'),
    ],
  };

  // Note: `name` shadows Element.prototype.name — intentional for HTML attribute API
  declare name: string | null;
  declare size: string | null;
  declare label: string | null;

  #svg: SVGSVGElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#svg = this.shadowRoot?.querySelector('svg') ?? null;
    this.#render();
  }

  nameChanged(): void { this.#render(); }
  sizeChanged(): void { this.#render(); }
  labelChanged(): void { this.#render(); }

  #render(): void {
    if (!this.#svg) return;

    const iconName = this.getAttribute('name');
    const pathData = iconName !== null && iconName in iconPaths
      ? iconPaths[iconName as IconName]
      : '';
    const sizeStr = this.getAttribute('size') ?? '20';
    const size = /^\d+$/.test(sizeStr) ? sizeStr : '20';

    this.#svg.setAttribute('width', size);
    this.#svg.setAttribute('height', size);
    this.#svg.setAttribute('viewBox', '0 0 24 24');

    let path = this.#svg.querySelector('path');
    if (!path) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.#svg.appendChild(path);
    }
    path.setAttribute('d', pathData);

    if (iconName !== null && iconName.length > 0 && !(iconName in iconPaths)) {
      console.warn(`[dads-icon] Unknown icon name: "${iconName}". Available: ${Object.keys(iconPaths).join(', ')}`);
    }

    this.#syncAccessibility();
  }

  #syncAccessibility(): void {
    if (!this.#svg) return;
    const labelText = this.label;

    if (labelText && labelText.length > 0) {
      this.#svg.removeAttribute('aria-hidden');
      this.#svg.setAttribute('role', 'img');
      this.removeAttribute('aria-hidden');

      let title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (!title) {
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title') as SVGTitleElement;
        this.#svg.prepend(title);
      }
      title.textContent = labelText;
      title.id = 'icon-title';
      this.#svg.setAttribute('aria-labelledby', 'icon-title');
    } else {
      this.#svg.setAttribute('aria-hidden', 'true');
      this.#svg.removeAttribute('role');
      this.#svg.removeAttribute('aria-labelledby');
      this.setAttribute('aria-hidden', 'true');

      const title = this.#svg.querySelector(':scope > title') as SVGTitleElement | null;
      if (title) title.remove();
    }
  }
}
