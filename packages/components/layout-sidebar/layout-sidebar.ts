/**
 * @module layout-sidebar
 * レイアウトサイドバーコンポーネント
 * @version 1.0.0
 */

import { html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { layoutSidebarTokens } from './layout-sidebar-tokens.js';
import { layoutSidebarStyles } from './layout-sidebar-styles.js';

/**
 * レイアウトサイドバー
 *
 * @customElement
 * @tagname dads-layout-sidebar
 *
 * @slot default - サイドバー内コンテンツ
 *
 * @csspart base - サイドバー領域
 *
 * @cssprop --dads-layout-sidebar-background - 背景色
 * @cssprop --dads-layout-sidebar-border-color - 境界線色
 * @cssprop --dads-layout-sidebar-padding - 内側余白
 */
export class DadsLayoutSidebar extends TypographyWebComponent {
  static definition = {
    name: 'dads-layout-sidebar',
    template: html`
      <aside part="base">
        <slot></slot>
      </aside>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        layoutSidebarTokens,
        layoutSidebarStyles,
      ],
      'minimal',
    ),
  };
}
