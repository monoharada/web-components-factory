/**
 * フォーカススタイル Mixin - ユニバーサル直接適用版
 * デジタル庁デザインシステムの公式実装に基づく
 * Shadow DOM内のすべてのフォーカス可能要素に適用
 */
import { css } from '../../core/web-components.js';

interface FocusStyleOptions {
  // 特定のセレクタに限定する場合
  selector?: string;
  // border-radiusをカスタマイズする場合
  borderRadius?: string;
}

/**
 * デジタル庁準拠のフォーカススタイルを適用
 * @param options - オプション設定
 * @returns CSSスタイルシート
 */
export function applyUniversalFocusStyles(options: FocusStyleOptions = {}) {
  const {
    selector = '*',
    borderRadius = '.25rem'
  } = options;

  return css`
    /* フォーカススタイル用のセマンティックトークン */
    :host {
      --focus-outline-color: var(--color-neutral-black, #000000);
      --focus-outline-width: .25rem;
      --focus-outline-offset: .125rem;
      --focus-bg-color: var(--color-primitive-yellow-300, #ffd43d);
      --focus-shadow-width: .125rem;
      --focus-border-radius: ${borderRadius};
    }

    /* すべてのフォーカス可能要素に適用 */
    :host ${selector}:focus-visible {
      outline: var(--focus-outline-width) solid var(--focus-outline-color) !important;
      outline-offset: var(--focus-outline-offset) !important;
      border-radius: var(--focus-border-radius) !important;
      /* 背景色は設定しない（元の背景を保持） */
      box-shadow: 
        0 0 0 var(--focus-shadow-width) var(--focus-bg-color),
        inset 0 0 0 4px var(--focus-bg-color) !important;
    }

    /* テキストボタンなど背景が透明な場合のみ背景色を適用 */
    :host ${selector}:is([variant="text"], [variant="tertiary"]):focus-visible {
      background-color: var(--focus-bg-color) !important;
      box-shadow: 0 0 0 var(--focus-shadow-width) var(--focus-bg-color) !important;
    }
  `;
}

/**
 * デジタル庁の公式実装そのまま（背景色も変更）
 * 注意: ボタンの元の背景色が失われる
 */
export function applyOfficialFocusStyles(options: FocusStyleOptions = {}) {
  const {
    selector = '*',
    borderRadius = '.25rem'
  } = options;

  return css`
    :host ${selector}:focus-visible {
      outline: .25rem solid var(--color-neutral-black, #000000);
      outline-offset: .125rem;
      border-radius: ${borderRadius};
      background-color: var(--color-primitive-yellow-300, #ffd43d);
      box-shadow: 0 0 0 .125rem var(--color-primitive-yellow-300, #ffd43d);
    }
  `;
}