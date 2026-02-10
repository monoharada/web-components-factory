/**
 * @module divider
 * デジタル庁デザインシステム Dividerコンポーネント
 * @version 1.0.0
 */

import {
  html,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { dividerTokens } from './divider-tokens.js';
import { dividerStyles } from './divider-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerColor = 'solid-gray-420' | 'solid-gray-536' | 'black';
type DividerStyle = 'solid' | 'dashed';
type DividerWidth = '1' | '2' | '3' | '4';

const VALID_ORIENTATIONS: readonly DividerOrientation[] = ['horizontal', 'vertical'] as const;
const VALID_COLORS: readonly DividerColor[] = ['solid-gray-420', 'solid-gray-536', 'black'] as const;
const VALID_STYLES: readonly DividerStyle[] = ['solid', 'dashed'] as const;
const VALID_WIDTHS: readonly DividerWidth[] = ['1', '2', '3', '4'] as const;

const DEFAULT_ORIENTATION: DividerOrientation = 'horizontal';
const DEFAULT_COLOR: DividerColor = 'solid-gray-420';
const DEFAULT_STYLE: DividerStyle = 'solid';
const DEFAULT_WIDTH: DividerWidth = '1';

function normalizeEnum<T extends string>(value: string | null, valid: readonly T[], fallback: T): T {
  if (!value) return fallback;
  const trimmed = value.trim().toLowerCase();
  return (valid as readonly string[]).includes(trimmed) ? (trimmed as T) : fallback;
}

function normalizeOrientation(value: string | null): DividerOrientation {
  return normalizeEnum(value, VALID_ORIENTATIONS, DEFAULT_ORIENTATION);
}

function normalizeColor(value: string | null): DividerColor {
  return normalizeEnum(value, VALID_COLORS, DEFAULT_COLOR);
}

function normalizeStyle(value: string | null): DividerStyle {
  return normalizeEnum(value, VALID_STYLES, DEFAULT_STYLE);
}

function normalizeWidth(value: string | null): DividerWidth {
  return normalizeEnum(value, VALID_WIDTHS, DEFAULT_WIDTH);
}

/**
 * ディバイダーコンポーネント
 *
 * @customElement
 * @tagname dads-divider
 *
 * @csspart line - 区切り線
 *
 * @attr {'horizontal' | 'vertical'} orientation - 区切り方向
 * @attr {'solid-gray-420' | 'solid-gray-536' | 'black'} data-color - 区切り線の色（DADS互換）
 * @attr {'solid' | 'dashed'} data-style - 区切り線の線種（DADS互換）
 * @attr {'1' | '2' | '3' | '4'} data-width - 区切り線の太さ（DADS互換）
 *
 * @cssprop --dads-divider-color - 区切り線の色
 * @cssprop --dads-divider-style - 区切り線の線種
 * @cssprop --dads-divider-width - 区切り線の太さ
 * @cssprop --dads-divider-margin - 区切り余白（shorthand）。例: `8px 0`
 * @cssprop --dads-divider-margin-vertical - 垂直方向時の区切り余白（shorthand）。未指定時は block/inline から自動生成
 * @cssprop --dads-divider-margin-block - 上下余白
 * @cssprop --dads-divider-margin-inline - 左右余白
 * @cssprop --dads-divider-margin-block-start - 上側余白
 * @cssprop --dads-divider-margin-block-end - 下側余白
 * @cssprop --dads-divider-margin-inline-start - 左側余白
 * @cssprop --dads-divider-margin-inline-end - 右側余白
 * @cssprop --dads-divider-vertical-length - 垂直方向時の線長
 *
 * @example
 * ```html
 * <dads-divider></dads-divider>
 * <dads-divider data-color="black" data-style="dashed" data-width="2"></dads-divider>
 * <dads-divider orientation="vertical"></dads-divider>
 * ```
 */
export class DadsDivider extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-divider',
    template: html`
      <hr part="line" id="line" aria-hidden="true">
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      dividerTokens,
      dividerStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('orientation'),
      PropertyAttr('dataColor', 'data-color'),
      PropertyAttr('dataStyle', 'data-style'),
      PropertyAttr('dataWidth', 'data-width'),
    ],
  };

  declare orientation: string | null;
  declare dataColor: string | null;
  declare dataStyle: string | null;
  declare dataWidth: string | null;

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, {
      orientation: DEFAULT_ORIENTATION,
      'data-color': DEFAULT_COLOR,
      'data-style': DEFAULT_STYLE,
      'data-width': DEFAULT_WIDTH,
    });

    this.#syncAccessibility();
  }

  orientationChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeOrientation(newValue);
    if (newValue !== normalized) {
      this.setAttribute('orientation', normalized);
      return;
    }
    this.#syncAccessibility();
  }

  dataColorChanged(_oldValue: string | null, newValue: string | null): void {
    this.#syncEnumAttribute('data-color', newValue, normalizeColor);
  }

  dataStyleChanged(_oldValue: string | null, newValue: string | null): void {
    this.#syncEnumAttribute('data-style', newValue, normalizeStyle);
  }

  dataWidthChanged(_oldValue: string | null, newValue: string | null): void {
    this.#syncEnumAttribute('data-width', newValue, normalizeWidth);
  }

  #syncEnumAttribute(
    name: 'data-color' | 'data-style' | 'data-width',
    value: string | null,
    normalizer: (v: string | null) => string,
  ): void {
    const normalized = normalizer(value);
    if (value !== normalized) this.setAttribute(name, normalized);
  }

  #syncAccessibility(): void {
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-orientation', orientation);
  }
}
