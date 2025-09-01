/**
 * フォーカススタイル Mixin - デジタル庁公式準拠版
 * 公式のHTMLスニペットに基づく実装
 * ボタンの背景色を保持しつつ、黄色のフォーカス表示を実現
 */
import { css } from '../../core/web-components.js';

/**
 * デジタル庁公式のフォーカススタイル
 * すべてのフォーカス可能要素に一括適用
 */
export function applyDADSFocusStyles() {
  return css`
    /* フォーカススタイルのトークン定義 */
    :host {
      --focus-outline-color: var(--color-neutral-black, #000000);
      --focus-yellow: var(--color-primitive-yellow-300, #ffd43d);
    }

    /* ボタン要素へのフォーカススタイル */
    :host [part="base"]:focus-visible {
      outline: .25rem solid var(--focus-outline-color);
      outline-offset: .125rem;
      border-radius: .25rem;
      position: relative;
    }

    /* 塗りボタン（solid）: box-shadowのみ（背景色は変更しない） */
    :host([variant="solid"]) [part="base"]:focus-visible,
    :host([variant="primary"]) [part="base"]:focus-visible {
      box-shadow: 0 0 0 .125rem var(--focus-yellow);
    }

    /* 枠線ボタン（outlined）: 背景を黄色に変更 */
    :host([variant="outlined"]) [part="base"]:focus-visible,
    :host([variant="secondary"]) [part="base"]:focus-visible {
      background-color: var(--focus-yellow);
      box-shadow: 0 0 0 .125rem var(--focus-yellow);
    }

    /* テキストボタン（text）: 背景を黄色に変更 */
    :host([variant="text"]) [part="base"]:focus-visible,
    :host([variant="tertiary"]) [part="base"]:focus-visible {
      background-color: var(--focus-yellow);
      box-shadow: 0 0 0 .125rem var(--focus-yellow);
    }

    /* アコーディオンのsummary要素へのフォーカススタイル */
    :host [part="summary"]:focus-visible {
      outline: .25rem solid var(--focus-outline-color);
      outline-offset: .125rem;
      border-radius: .25rem;
      background-color: var(--focus-yellow);
      box-shadow: 0 0 0 .125rem var(--focus-yellow);
    }

    /* その他のフォーカス可能要素（汎用） */
    :host button:not([part="base"]):focus-visible,
    :host a:focus-visible,
    :host [tabindex]:focus-visible {
      outline: .25rem solid var(--focus-outline-color);
      outline-offset: .125rem;
      border-radius: .25rem;
      background-color: var(--focus-yellow);
      box-shadow: 0 0 0 .125rem var(--focus-yellow);
    }
  `;
}

/**
 * 完全にデジタル庁公式実装（背景色も上書き）
 * 注意: 塗りボタンの背景色が黄色になる
 */
export function applyDADSFocusStylesStrict() {
  return css`
    /* すべてのフォーカス可能要素に一律適用 */
    :host *:focus-visible {
      outline: .25rem solid var(--color-neutral-black, #000000);
      outline-offset: .125rem;
      border-radius: .25rem;
      background-color: var(--color-primitive-yellow-300, #ffd43d);
      box-shadow: 0 0 0 .125rem var(--color-primitive-yellow-300, #ffd43d);
    }
  `;
}