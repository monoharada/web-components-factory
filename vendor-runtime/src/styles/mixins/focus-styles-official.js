/**
 * フォーカススタイル Mixin - デジタル庁公式準拠版
 *
 * 公式実装（GitHub: digital-go-jp/design-system-example-components）に基づく
 * 重要: 公式ではborder-radiusはフォーカス時に変更されない
 *
 * トークン設計:
 * - セマンティック層: --focus-outline-color, --focus-yellow
 * - ローカル層（オーバーライド用）: --dads-focus-*
 */
import { css } from '../../core/web-components.js';
/**
 * デジタル庁公式のフォーカススタイル
 * すべてのフォーカス可能要素に一括適用
 *
 * オーバーライド可能なCSS変数:
 * - --dads-focus-outline-color: アウトライン色
 * - --dads-focus-outline-width: アウトライン幅
 * - --dads-focus-outline-offset: アウトラインオフセット
 * - --dads-focus-ring-color: リング（box-shadow）色
 * - --dads-focus-ring-width: リング幅
 * - --dads-focus-text-element-bg: テキスト要素の背景色
 */
export function applyDADSFocusStyles() {
    return css `
    /* ========== フォーカストークン定義 ========== */
    :host {
      /* セマンティックトークン（DADS公式準拠） */
      --focus-outline-color: var(--color-neutral-black, #000000);
      --focus-outline-width: .25rem;
      --focus-outline-offset: .125rem;
      --focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
      --focus-ring-width: .125rem;
      --focus-text-element-bg: var(--color-primitive-yellow-300, #ffd43d);

      /* ローカルトークン（オーバーライド用API） */
      --dads-focus-outline-color: var(--focus-outline-color);
      --dads-focus-outline-width: var(--focus-outline-width);
      --dads-focus-outline-offset: var(--focus-outline-offset);
      --dads-focus-ring-color: var(--focus-ring-color);
      --dads-focus-ring-width: var(--focus-ring-width);
      --dads-focus-text-element-bg: var(--focus-text-element-bg);

      /* 後方互換性のためのエイリアス */
      --focus-yellow: var(--dads-focus-ring-color);
    }

    /* ========== ボタン要素へのフォーカススタイル ========== */
    :host [part="base"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      /* border-radius は変更しない（公式準拠） */
      position: relative;
    }

    /* 塗りボタン（solid）: box-shadowのみ（背景色は変更しない） */
    :host([variant="solid"]) [part="base"]:focus-visible,
    :host([variant="primary"]) [part="base"]:focus-visible {
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* 枠線ボタン（outlined）: box-shadowのみ（背景色は変更しない） */
    :host([variant="outlined"]) [part="base"]:focus-visible,
    :host([variant="secondary"]) [part="base"]:focus-visible {
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* テキストボタン（text）: 背景を黄色に変更 */
    :host([variant="text"]) [part="base"]:focus-visible,
    :host([variant="tertiary"]) [part="base"]:focus-visible {
      background-color: var(--dads-focus-text-element-bg);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* ========== アコーディオンsummary要素へのフォーカススタイル ========== */
    :host [part="summary"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      /* border-radius は変更しない（公式準拠） */
      background-color: var(--dads-focus-text-element-bg);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* ========== フォーム入力要素へのフォーカススタイル ========== */
    :host [part="textarea"]:focus-visible,
    :host [part="input"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* ========== その他のフォーカス可能要素（汎用） ========== */
    :host button:not([part="base"]):focus-visible,
    :host a:focus-visible,
    :host [tabindex]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      /* border-radius は変更しない（公式準拠） */
      background-color: var(--dads-focus-text-element-bg);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }
  `;
}
/**
 * 完全にデジタル庁公式実装（背景色も上書き）
 * 注意: 塗りボタンの背景色が黄色になる
 *
 * @deprecated applyDADSFocusStyles() を推奨
 */
export function applyDADSFocusStylesStrict() {
    return css `
    /* すべてのフォーカス可能要素に一律適用 */
    :host *:focus-visible {
      outline: var(--dads-focus-outline-width, .25rem) solid var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
      outline-offset: var(--dads-focus-outline-offset, .125rem);
      /* border-radius は変更しない（公式準拠） */
      background-color: var(--dads-focus-text-element-bg, var(--color-primitive-yellow-300, #ffd43d));
      box-shadow: 0 0 0 var(--dads-focus-ring-width, .125rem) var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    }
  `;
}
