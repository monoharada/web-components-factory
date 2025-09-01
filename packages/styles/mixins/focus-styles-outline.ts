/**
 * フォーカススタイルmixin（outline版）
 * デジタル庁デザインシステムv2.7.0準拠
 * outlineとbox-shadowを組み合わせて実装
 */
import { css } from '../../core/web-components.js';

/**
 * outlineとbox-shadowを組み合わせたフォーカススタイル
 * 
 * @param selector - フォーカススタイルを適用するセレクタ
 * @param options - カスタマイズオプション
 */
export function applyFocusStylesOutline(
  selector: string = ':host',
  options: {
    ringColor?: string;
    outlineColor?: string;
    borderRadius?: string;
  } = {}
) {
  const {
    ringColor = 'var(--focus-ring-color, var(--color-primitive-yellow-300, #ffd43d))',
    outlineColor = 'var(--focus-outline-color, var(--color-neutral-black, #000000))',
    borderRadius = 'var(--border-radius-8, 0.5rem)'
  } = options;

  return css`
    /* フォーカススタイル - デジタル庁デザインシステムv2.7.0準拠 */
    ${selector}:focus-visible {
      position: relative;
      /* 黒い外枠をoutlineで実装 */
      outline: 4px solid ${outlineColor};
      outline-offset: 2px;
      /* 黄色の内側リングをbox-shadowで実装（insetで内側に） */
      box-shadow: 
        0 0 0 2px ${ringColor};
    }
  `;
}