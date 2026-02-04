/**
 * @module chip-label
 * デジタル庁デザインシステム チップラベルコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { chipLabelStyles } from './chip-label-styles.js';

/**
 * チップラベルコンポーネント
 *
 * @customElement dads-chip-label
 * @tagname dads-chip-label
 *
 * @slot icon - アイコン（オプション）
 * @slot default - ラベルテキスト
 *
 * @csspart base - チップラベル本体
 * @csspart icon - アイコンスロット
 * @csspart label - ラベルテキストコンテナ
 *
 * @attr {string} variant - バリアント (text | outline | filled-outline | fill)
 * @attr {string} color - カラー (gray | blue | light-blue | cyan | green | lime | yellow | orange | red | magenta | purple)
 *
 * @example
 * ```html
 * <dads-chip-label variant="filled-outline" color="purple">
 *   <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
 *     <path d="..."/>
 *   </svg>
 *   ラベル
 * </dads-chip-label>
 * ```
 */
export class DadsChipLabel extends TypographyWebComponent {
  static definition = {
    name: 'dads-chip-label',
    template: html`
      <span part="base">
        <slot name="icon" part="icon"></slot>
        <span part="label">
          <slot></slot>
        </span>
      </span>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        chipLabelStyles,
      ],
      'minimal'
    ),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('color'),
    ],
  };


  connectedCallback(): void {
    super.connectedCallback();
    setDefaultAttributes(this, { variant: 'text', color: 'gray' });
  }
}
