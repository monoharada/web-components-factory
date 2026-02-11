/**
 * @module mobile-mock
 * スマートフォン画面モックコンポーネント
 * @version 1.0.0
 */
import { WebComponent, html } from '../../core/web-components.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { mobileMockTokens } from './mobile-mock-tokens.js';
import { mobileMockStyles } from './mobile-mock-styles.js';
/**
 * スマートフォン画面モック
 *
 * 402x856 の端末フレームと safe-area コンテナを提供します。
 *
 * @customElement dads-mobile-mock
 * @tagname dads-mobile-mock
 *
 * @slot default - safe-area 内に配置するコンテンツ
 *
 * @csspart base - 外側ラッパー
 * @csspart frame - 端末フレーム SVG
 * @csspart frame-shape - 端末枠線の矩形
 * @csspart screen - 画面領域
 * @csspart safe-area - safe-area コンテンツ領域
 *
 * @cssprop --dads-mobile-mock-frame-width - フレーム幅（既定: 402px）
 * @cssprop --dads-mobile-mock-aspect-ratio - フレーム比率（既定: 402/856）
 * @cssprop --dads-mobile-mock-screen-inset - 画面領域の内側余白（既定: 6px）
 * @cssprop --dads-mobile-mock-screen-radius - 画面領域の角丸（既定: 24px）
 * @cssprop --dads-mobile-mock-safe-area-top - 上部safe-area（既定: 44px）
 * @cssprop --dads-mobile-mock-screen-background - 画面背景色
 */
export class DadsMobileMock extends WebComponent {
}
DadsMobileMock.definition = {
    name: 'dads-mobile-mock',
    template: html `
      <div part="base">
        <svg part="frame" viewBox="0 0 402 856" aria-hidden="true" focusable="false">
          <rect part="frame-shape" x="3" y="3" width="396" height="850" rx="27"></rect>
        </svg>
        <div part="screen">
          <div part="safe-area">
            <slot></slot>
          </div>
        </div>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        mobileMockTokens,
        mobileMockStyles,
    ], 'minimal'),
};
