/**
 * フォーカススタイルmixin
 * デジタル庁デザインシステム準拠の黄色リング + 黒アウトライン
 */
import { css } from '../../core/web-components.js';

/**
 * デジタル庁デザインシステム準拠のフォーカススタイルを適用
 * @param selector - フォーカススタイルを適用するセレクタ（デフォルト: ':host'）
 * @param options - カスタマイズオプション
 */
export function applyFocusStyles(
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
      z-index: 1;
    }
    
    /* 黄色の塗りつぶし背景（内側） */
    ${selector}:focus-visible::before {
      content: '';
      position: absolute;
      inset: calc(-1 * ${ringWidth});
      background-color: ${ringColor};
      border-radius: ${borderRadius};
      z-index: -2;
    }
    
    /* 黒いアウトラインリング（外側） */
    ${selector}:focus-visible::after {
      content: '';
      position: absolute;
      inset: calc(-1 * ${outlineWidth});
      border: ${outlineWidth} solid ${outlineColor};
      border-radius: calc(${borderRadius} + ${outlineWidth});
      pointer-events: none;
      z-index: -1;
    }
  `;
}

/**
 * コンテンツを前面に表示するためのスタイル
 * フォーカススタイルの上にコンテンツを表示する場合に使用
 */
export function applyFocusContentFront(selector: string = ':host') {
  return css`
    ${selector}:focus-visible > * {
      position: relative;
      z-index: 1;
    }
  `;
}