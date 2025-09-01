/**
 * フォーカススタイル Mixin - シンプル版
 * :focus-visible のみを使用し、疑似要素でフォーカスリングを実装
 * ボタンの背景色には影響を与えない
 */
import { css } from '../../core/web-components.js';

interface FocusStyleOptions {
  borderRadius?: string;
  selector?: string;
}

/**
 * フォーカススタイルを適用するMixin
 * @param options - オプション設定
 * @returns CSSスタイルシート
 */
export function applyFocusStyles(options: FocusStyleOptions = {}) {
  const {
    borderRadius = 'var(--border-radius-8, 0.5rem)',
    selector = '[part="base"]'
  } = options;

  return css`
    /* フォーカススタイル用のセマンティックトークン（デフォルト値） */
    :host {
      --focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
      --focus-ring-width: 4px;
      --focus-outline-color: var(--color-neutral-black, #000000);
      --focus-outline-width: 2px;
    }

    /* 疑似要素でフォーカスリングを実装 */
    ${selector} {
      position: relative;
    }

    ${selector}::after {
      content: '';
      position: absolute;
      top: calc(-1 * var(--focus-ring-width));
      left: calc(-1 * var(--focus-ring-width));
      right: calc(-1 * var(--focus-ring-width));
      bottom: calc(-1 * var(--focus-ring-width));
      border-radius: ${borderRadius};
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    /* キーボードフォーカス時のみ表示 */
    ${selector}:focus-visible::after {
      opacity: 1;
      /* 黒いアウトライン（外側） */
      box-shadow: 
        0 0 0 var(--focus-outline-width) var(--focus-outline-color),
        0 0 0 calc(var(--focus-outline-width) + var(--focus-ring-width)) var(--focus-ring-color);
    }

    /* ネイティブのアウトラインは非表示 */
    ${selector}:focus-visible {
      outline: none;
    }
  `;
}

/**
 * アコーディオン用のフォーカススタイル
 * summary要素に適用
 */
export function applyAccordionFocusStyles(selector: string = '[part="summary"]', options: FocusStyleOptions = {}) {
  return applyFocusStyles({
    ...options,
    selector
  });
}

/**
 * ボタン用のフォーカススタイル  
 * button要素に適用
 */
export function applyButtonFocusStyles(selector: string = '[part="base"]', options: FocusStyleOptions = {}) {
  return applyFocusStyles({
    ...options,
    selector
  });
}