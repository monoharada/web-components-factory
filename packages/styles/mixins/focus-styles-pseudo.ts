/**
 * フォーカススタイルmixin（擬似要素版）
 * デジタル庁デザインシステムv2.7.0準拠
 * 擬似要素を使用して黄色背景と黒枠を実装
 */
import { css } from '../../core/web-components.js';

/**
 * 擬似要素を使用したフォーカススタイル
 * テキストボタンの下線を考慮した実装
 * 
 * @param selector - フォーカススタイルを適用するセレクタ
 * @param options - カスタマイズオプション
 */
export function applyFocusStylesPseudo(
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
    ${selector} {
      position: relative;
      isolation: isolate; /* 新しいスタッキングコンテキストを作成 */
    }

    ${selector}:focus-visible {
      outline: none;
      position: relative;
    }
    
    /* 黄色の背景（padding 2px相当） */
    ${selector}:focus-visible::before {
      content: '';
      position: absolute;
      inset: -2px;
      background-color: ${ringColor};
      border-radius: calc(${borderRadius} + 2px);
      z-index: -2; /* ボタンの背景より後ろに配置 */
      pointer-events: none;
    }
    
    /* 黒いアウトライン（4px幅） */
    ${selector}:focus-visible::after {
      content: '';
      position: absolute;
      inset: -6px; /* -2px (黄色) - 4px (黒枠) = -6px */
      border: 4px solid ${outlineColor};
      border-radius: calc(${borderRadius} + 6px);
      z-index: -3; /* 黄色の背景より後ろに配置 */
      pointer-events: none;
    }
  `;
}