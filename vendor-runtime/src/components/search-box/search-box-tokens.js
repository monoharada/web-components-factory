/**
 * 検索ボックスコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 */
import { css } from '../../core/web-components.js';
const searchBoxSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    --search-box-gap: var(--spacing-4, 1rem);

    --search-box-color: var(--color-neutral-solid-gray-900);
    --search-box-font-size: var(--font-size-16, 1rem);
    --search-box-letter-spacing: 0.02em;

    --search-box-border-color: var(--color-neutral-solid-gray-600);
    --search-box-border-color-hover: var(--color-neutral-black);
    --search-box-border-radius: var(--border-radius-8, 0.5rem);

    /* WCAG 2.2: Target Size (Minimum) 相当 */
    --search-box-control-min-height: calc(44 / 16 * 1rem);

    --search-box-scope-width: calc(160 / 16 * 1rem);
    --search-box-scope-bg: var(--color-neutral-solid-gray-50);
    --search-box-scope-label-color: var(--color-neutral-solid-gray-700);
    --search-box-scope-icon-color: var(--color-neutral-solid-gray-600);

    --search-box-input-bg: var(--color-neutral-white);
    --search-box-search-icon-color: var(--color-neutral-solid-gray-600);

    /* 枠線幅 */
    --search-box-border-width: 1px;

    /* input幅 */
    --search-box-input-min-width: 8rem;

    /* アイコンサイズ */
    --search-box-search-icon-size: calc(24 / 16 * 1rem);
    --search-box-scope-icon-size: calc(16 / 16 * 1rem);

    /* scopeパディング */
    --search-box-scope-padding-top: calc(20 / 16 * 1rem);
    --search-box-scope-padding-right: calc(40 / 16 * 1rem);
    --search-box-scope-padding-bottom: 0;
    --search-box-scope-padding-left: calc(16 / 16 * 1rem);

    /* ボタン */
    --search-box-button-bg: var(--color-primitive-blue-900);
    --search-box-button-color: var(--color-neutral-white);
    --search-box-button-bg-hover: var(--color-primitive-blue-1000);
    --search-box-button-border-color: transparent;
  }
`;
const searchBoxLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    --dads-search-box-gap: var(--search-box-gap);

    --dads-search-box-color: var(--search-box-color);
    --dads-search-box-font-size: var(--search-box-font-size);
    --dads-search-box-letter-spacing: var(--search-box-letter-spacing);

    --dads-search-box-border-color: var(--search-box-border-color);
    --dads-search-box-border-color-hover: var(--search-box-border-color-hover);
    --dads-search-box-border-radius: var(--search-box-border-radius);

    --dads-search-box-control-min-height: var(--search-box-control-min-height);

    --dads-search-box-scope-width: var(--search-box-scope-width);
    --dads-search-box-scope-bg: var(--search-box-scope-bg);
    --dads-search-box-scope-label-color: var(--search-box-scope-label-color);
    --dads-search-box-scope-icon-color: var(--search-box-scope-icon-color);

    --dads-search-box-input-bg: var(--search-box-input-bg);
    --dads-search-box-search-icon-color: var(--search-box-search-icon-color);

    /* padding は参照HTML値をデフォルトとして持つ（上書き可能） */
    --dads-search-box-input-padding: calc(12 / 16 * 1rem) calc(16 / 16 * 1rem) calc(12 / 16 * 1rem) calc(48 / 16 * 1rem);

    /* 枠線幅 */
    --dads-search-box-border-width: var(--search-box-border-width);

    /* input幅 */
    --dads-search-box-input-min-width: var(--search-box-input-min-width);

    /* アイコンサイズ */
    --dads-search-box-search-icon-size: var(--search-box-search-icon-size);
    --dads-search-box-scope-icon-size: var(--search-box-scope-icon-size);

    /* scopeパディング */
    --dads-search-box-scope-padding: var(--search-box-scope-padding-top) var(--search-box-scope-padding-right) var(--search-box-scope-padding-bottom) var(--search-box-scope-padding-left);

    /* ボタン */
    --dads-search-box-button-bg: var(--search-box-button-bg);
    --dads-search-box-button-color: var(--search-box-button-color);
    --dads-search-box-button-bg-hover: var(--search-box-button-bg-hover);
    --dads-search-box-button-border-color: var(--search-box-button-border-color);
  }
`;
export const searchBoxSemanticTokens = css `${searchBoxSemanticTokensText}`;
export const searchBoxLocalTokens = css `${searchBoxLocalTokensText}`;
export const searchBoxTokens = css `
  ${searchBoxSemanticTokensText}
  ${searchBoxLocalTokensText}
`;
