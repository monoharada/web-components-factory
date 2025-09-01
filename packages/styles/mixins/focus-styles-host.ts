/**
 * フォーカススタイルmixin（ホスト要素版）
 * デジタル庁デザインシステムv2.7.0準拠
 * ホスト要素にフォーカススタイルを適用
 */
import { css } from '../../core/web-components.js';

/**
 * ホスト要素にフォーカススタイルを適用
 * Shadow DOM内のボタンがフォーカスされた時にホスト要素にスタイルを適用
 * 
 * @param options - カスタマイズオプション
 */
export function applyFocusStylesHost(
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
    /* ホスト要素の準備 */
    :host {
      position: relative;
      display: inline-block;
    }

    /* ボタン要素のフォーカス時 */
    [part="base"]:focus-visible {
      outline: none;
      position: relative;
    }

    /* ホスト要素の擬似要素でフォーカススタイルを実装 */
    :host(:focus-within)::before {
      content: '';
      position: absolute;
      inset: -2px;
      background-color: ${ringColor};
      border-radius: calc(${borderRadius} + 2px);
      z-index: -1;
      pointer-events: none;
    }

    :host(:focus-within)::after {
      content: '';
      position: absolute;
      inset: -6px;
      border: 4px solid ${outlineColor};
      border-radius: calc(${borderRadius} + 6px);
      z-index: -2;
      pointer-events: none;
    }
  `;
}