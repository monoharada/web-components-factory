/**
 * フォーカススタイルmixin（box-shadow版）
 * デジタル庁デザインシステム準拠の黄色リング + 黒アウトライン
 * box-shadowを使用してz-indexの問題を回避
 */
import { css } from '../../core/web-components.js';

/**
 * box-shadowを使用したフォーカススタイル
 * @param selector - フォーカススタイルを適用するセレクタ
 * @param options - カスタマイズオプション
 */
export function applyFocusStylesBoxShadow(
  selector: string = ':host',
  options: {
    ringColor?: string;
    ringWidth?: string;
    outlineColor?: string;
    outlineWidth?: string;
    borderRadius?: string;
  } = {}
) {
  const {
    ringColor = 'var(--focus-ring-color, var(--color-primitive-yellow-300, #ffd43d))',
    ringWidth = 'var(--focus-ring-width, 4px)',
    outlineColor = 'var(--focus-outline-color, var(--color-neutral-black, #000000))',
    outlineWidth = 'var(--focus-outline-width, 4px)',
    borderRadius = 'var(--border-radius-8, 0.5rem)'
  } = options;

  return css`
    /* フォーカススタイル - デジタル庁デザインシステム準拠 */
    ${selector}:focus-visible {
      outline: none;
      position: relative;
      box-shadow: 
        0 0 0 ${ringWidth} ${ringColor},
        0 0 0 calc(${ringWidth} + ${outlineWidth}) ${outlineColor};
    }
  `;
}