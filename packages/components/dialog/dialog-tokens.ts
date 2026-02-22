/**
 * Dialogコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 */

import { css } from '../../core/web-components.js';

const dialogSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --dialog-background: var(--color-neutral-white, #ffffff);
    --dialog-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --dialog-border-color: var(--color-neutral-solid-gray-536, #767676);
    --dialog-border-width: 1px;
    --dialog-border-radius: var(--border-radius-12, 0.75rem);

    --dialog-width-s: calc(480 / 16 * 1rem);
    --dialog-width-m: calc(640 / 16 * 1rem);
    --dialog-width-l: calc(800 / 16 * 1rem);
    --dialog-width: var(--dialog-width-m);
    --dialog-max-height: calc(100dvh - var(--spacing-10, 2.5rem));
    --dialog-viewport-padding: var(--spacing-4, 1rem);
    --dialog-padding-inline: var(--spacing-6, 1.5rem);
    --dialog-padding-block: var(--spacing-6, 1.5rem);
    --dialog-gap: var(--spacing-5, 1.25rem);
    --dialog-header-gap: var(--spacing-4, 1rem);
    --dialog-footer-gap: var(--spacing-3, 0.75rem);

    --dialog-title-size: var(--font-size-24, 1.5rem);
    --dialog-title-line-height: var(--line-height-140, 1.4);

    --dialog-close-button-size: calc(44 / 16 * 1rem);
    --dialog-close-button-padding: var(--spacing-2, 0.5rem);
    --dialog-close-button-border-radius: var(--border-radius-8, 0.5rem);
    --dialog-close-button-border-color: var(--color-neutral-solid-gray-536, #767676);
    --dialog-close-button-hover-background: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* 要件: backdrop は gray-100 */
    --dialog-backdrop-background: var(--color-neutral-opacity-gray-100, rgba(0, 0, 0, 0.1));
  }
`;

const dialogLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-dialog-background: var(--dialog-background); /* ダイアログの背景色 */
    --dads-dialog-color: var(--dialog-color); /* ダイアログのテキスト色 */
    --dads-dialog-border-color: var(--dialog-border-color); /* 枠線色 */
    --dads-dialog-border-width: var(--dialog-border-width); /* 枠線の太さ */
    --dads-dialog-border-radius: var(--dialog-border-radius); /* 角丸のサイズ */

    --dads-dialog-width: var(--dialog-width); /* ダイアログの幅 */
    --dads-dialog-max-height: var(--dialog-max-height); /* ダイアログの最大高さ */
    --dads-dialog-viewport-padding: var(--dialog-viewport-padding); /* ビューポート端からの余白 */
    --dads-dialog-padding-inline: var(--dialog-padding-inline); /* 左右の内側余白 */
    --dads-dialog-padding-block: var(--dialog-padding-block); /* 上下の内側余白 */
    --dads-dialog-gap: var(--dialog-gap); /* セクション間の間隔 */
    --dads-dialog-header-gap: var(--dialog-header-gap); /* ヘッダー内の間隔 */
    --dads-dialog-footer-gap: var(--dialog-footer-gap); /* フッター内のボタン間隔 */

    --dads-dialog-title-size: var(--dialog-title-size); /* タイトルのフォントサイズ */
    --dads-dialog-title-line-height: var(--dialog-title-line-height); /* タイトルの行の高さ */

    --dads-dialog-close-button-size: var(--dialog-close-button-size); /* 閉じるボタンのサイズ */
    --dads-dialog-close-button-padding: var(--dialog-close-button-padding); /* 閉じるボタンの内側余白 */
    --dads-dialog-close-button-border-radius: var(--dialog-close-button-border-radius); /* 閉じるボタンの角丸 */
    --dads-dialog-close-button-border-color: var(--dialog-close-button-border-color); /* 閉じるボタンの枠線色 */
    --dads-dialog-close-button-hover-background: var(--dialog-close-button-hover-background); /* 閉じるボタンのホバー時背景色 */

    --dads-dialog-backdrop-background: var(--dialog-backdrop-background); /* 背景オーバーレイの色 */
  }

  :host([size="s"]),
  :host([size="sm"]) {
    --dialog-width: var(--dialog-width-s);
  }

  :host([size="m"]),
  :host([size="md"]) {
    --dialog-width: var(--dialog-width-m);
  }

  :host([size="l"]),
  :host([size="lg"]) {
    --dialog-width: var(--dialog-width-l);
  }
`;

export const dialogSemanticTokens = css`${dialogSemanticTokensText}`;
export const dialogLocalTokens = css`${dialogLocalTokensText}`;

export const dialogTokens = css`
  ${dialogSemanticTokensText}
  ${dialogLocalTokensText}
`;
