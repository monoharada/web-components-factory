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
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

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

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'チップラベル（ステータスや分類の表示）',
    categories: {
      semantics: [
        '非インタラクティブなラベル表示コンポーネントです。',
        'テキストはデフォルトスロットに配置されます。',
      ],
      keyboard: [
        '操作対象ではないため、デフォルトではフォーカス可能ではありません。',
      ],
      zoom: [
        'デザイントークン（余白 / 文字サイズ など）で定義され、ズーム時もレイアウトを維持します。',
        'overflow-wrap:anywhere により長い文字列でも折り返します。',
      ],
      states: [
        'variant属性で視覚スタイルを切り替えます: text / outline / filled-outline / fill。',
        'color属性でカラープリセットを切り替えます。',
      ],
      labels: [
        'slot="icon" でアイコンを配置できます（任意）。',
        '装飾目的のアイコンは aria-hidden="true" を推奨します。',
        'テキストが無い場合は aria-label 等で代替テキストの提供を検討してください。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'base',
        title: 'チップラベル本体',
        label: 'チップラベル本体',
        description: '外枠・背景・タイポグラフィを担う要素です。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="base"]' },
      },
      {
        id: 'icon',
        title: 'アイコン',
        label: 'アイコンスロット（任意）',
        description: '任意のアイコンを配置します（装飾目的のSVGは aria-hidden="true" を推奨）。',
        category: 'labels',
        placement: 'top-left',
        target: { scope: 'light', selector: '[slot="icon"]' },
      },
      {
        id: 'label',
        title: 'ラベルテキスト',
        label: 'デフォルトスロット',
        description: 'チップラベルのテキストを配置します。',
        category: 'labels',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="label"]' },
      },
    ],
  };

  connectedCallback(): void {
    super.connectedCallback();
    setDefaultAttributes(this, { variant: 'text', color: 'gray' });
  }
}
