/**
 * @module layout-aside
 * レイアウト補助領域コンポーネント
 * @version 1.0.0
 */

import { html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { layoutAsideTokens } from './layout-aside-tokens.js';
import { layoutAsideStyles } from './layout-aside-styles.js';

/**
 * レイアウト補助領域
 *
 * @customElement
 * @tagname dads-layout-aside
 *
 * @slot default - 補助領域内コンテンツ
 *
 * @csspart base - 補助領域
 *
 * @cssprop --dads-layout-aside-background - 背景色
 * @cssprop --dads-layout-aside-border-color - 境界線色
 * @cssprop --dads-layout-aside-padding - 内側余白
 */
export class DadsLayoutAside extends TypographyWebComponent {
  static definition = {
    name: 'dads-layout-aside',
    template: html`
      <aside part="base">
        <slot></slot>
      </aside>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        layoutAsideTokens,
        layoutAsideStyles,
      ],
      'minimal',
    ),
  };
}
