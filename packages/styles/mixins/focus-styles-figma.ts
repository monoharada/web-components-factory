/**
 * フォーカススタイルmixin（Figmaデザイン準拠版）
 * デジタル庁デザインシステムv2.7.0準拠の黄色背景 + 黒アウトライン
 * Figma node-id: 8392:32355
 */
import { css } from '../../core/web-components.js';

/**
 * Figmaデザイン準拠のフォーカススタイル
 * 黄色の背景（padding: 2px）の中にコンテンツを配置
 * 黒いボーダー（4px）を外側に配置
 * 
 * @param selector - フォーカススタイルを適用するセレクタ
 * @param options - カスタマイズオプション
 */
export function applyFocusStylesFigma(
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
    /* ボタンの塗り色を維持しながら、黄色リング + 黒アウトラインを表示 */
    ${selector}:focus-visible {
      outline: none;
      position: relative;
      /* 黄色の内側リング（2px）と黒い外側ボーダー（4px）*/
      box-shadow: 
        0 0 0 2px ${ringColor},
        0 0 0 6px ${outlineColor};
      /* ボタンの元の背景色とボーダーは維持される */
      /* 6px = 2px (黄色リング) + 4px (黒ボーダー) */
    }
  `;
}