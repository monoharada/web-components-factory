/**
 * ページナビゲーションコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * セマンティックトークン（意味的な値）
 */
const pageNavigationSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --page-navigation-color: var(--color-primitive-blue-900, #0017c1);
    --page-navigation-color-hover: var(--color-primitive-blue-1000, #00118f);
    --page-navigation-hover-bg: var(--color-primitive-blue-50, #e8f1fe);
    --page-navigation-active-bg: var(--color-primitive-blue-200, #c5d7fb);

    /* ========== Typography ========== */
    --page-navigation-font-family: var(--font-family-sans);
    --page-navigation-font-size: var(--font-size-16, 1rem);
    --page-navigation-font-weight: var(--font-weight-700, 700);
    --page-navigation-line-height: 1;
    --page-navigation-letter-spacing: 0;

    --page-navigation-status-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --page-navigation-status-font-weight: var(--font-weight-400, 400);

    /* ========== Layout ========== */
    --page-navigation-gap: var(--spacing-4, 1rem);
    --page-navigation-control-gap: var(--spacing-2, 0.5rem);

    /* ========== Sizes (Figma Building Blocks) ========== */
    --page-navigation-text-height: calc(40 / 16 * 1rem);
    --page-navigation-outlined-height: calc(56 / 16 * 1rem);

    --page-navigation-arrow-size-l: calc(44 / 16 * 1rem);
    --page-navigation-arrow-size-m: calc(44 / 16 * 1rem);
    --page-navigation-arrow-size-s: calc(34 / 16 * 1rem);
    --page-navigation-arrow-size-xs: calc(24 / 16 * 1rem);

    --page-navigation-padding-x-text: var(--spacing-3, calc(12 / 16 * 1rem));
    --page-navigation-padding-x-outlined: var(--spacing-6, calc(24 / 16 * 1rem));

    --page-navigation-border-width-outlined: 2px;
    --page-navigation-border-width-arrow: 2px;

    --page-navigation-border-radius-default: var(--border-radius-8, 0.5rem);
    --page-navigation-border-radius-full: var(--border-radius-full, 624.9375rem);

    /* ========== Icon sizes ========== */
    --page-navigation-icon-size-text: calc(24 / 16 * 1rem);
    --page-navigation-icon-size-outlined: calc(24 / 16 * 1rem);
    --page-navigation-icon-size-arrow-l: calc(24 / 16 * 1rem);
    --page-navigation-icon-size-arrow-m: calc(24 / 16 * 1rem);
    --page-navigation-icon-size-arrow-s: calc(20 / 16 * 1rem);
    --page-navigation-icon-size-arrow-xs: calc(16 / 16 * 1rem);
  }
`;

/**
 * ローカルコンポーネントトークン（カスタマイズ用API）
 */
const pageNavigationLocalTokensText = `
  :host {
    /* ========== Layout ========== */
    --dads-page-navigation-width: fit-content;
    --dads-page-navigation-gap: var(--page-navigation-gap);
    --dads-page-navigation-justify-content: flex-start;

    /* ========== Control base ========== */
    --dads-page-navigation-control-gap: var(--page-navigation-control-gap);
    --dads-page-navigation-control-color: var(--page-navigation-color);
    --dads-page-navigation-control-color-hover: var(--page-navigation-color-hover);
    --dads-page-navigation-control-background: transparent;
    --dads-page-navigation-control-background-hover: var(--page-navigation-hover-bg);
    --dads-page-navigation-control-background-active: var(--page-navigation-active-bg);

    --dads-page-navigation-control-border-width: 0px;
    --dads-page-navigation-control-border-color: transparent;
    --dads-page-navigation-control-border-color-hover: var(--page-navigation-color-hover);
    --dads-page-navigation-control-border-radius: var(--page-navigation-border-radius-default);

    --dads-page-navigation-control-padding-x: var(--page-navigation-padding-x-text);
    --dads-page-navigation-control-padding-y: 0px;
    --dads-page-navigation-control-min-height: var(--page-navigation-text-height);
    --dads-page-navigation-control-min-width: auto;
    --dads-page-navigation-control-size: auto;

    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-text);

    /* ========== Typography ========== */
    --dads-page-navigation-font-family: var(--page-navigation-font-family);
    --dads-page-navigation-font-size: var(--page-navigation-font-size);
    --dads-page-navigation-font-weight: var(--page-navigation-font-weight);
    --dads-page-navigation-line-height: var(--page-navigation-line-height);
    --dads-page-navigation-letter-spacing: var(--page-navigation-letter-spacing);

    /* ========== Status ========== */
    --dads-page-navigation-status-color: var(--page-navigation-status-color);
    --dads-page-navigation-status-font-size: var(--page-navigation-font-size);
    --dads-page-navigation-status-font-weight: var(--page-navigation-status-font-weight);
    --dads-page-navigation-status-line-height: var(--page-navigation-line-height);
    --dads-page-navigation-status-letter-spacing: var(--page-navigation-letter-spacing);
  }

  :host([type="outlined"]) {
    --dads-page-navigation-control-border-width: var(--page-navigation-border-width-outlined);
    --dads-page-navigation-control-border-color: var(--page-navigation-color);
    --dads-page-navigation-control-border-radius: var(--page-navigation-border-radius-default);
    --dads-page-navigation-control-min-height: var(--page-navigation-outlined-height);
    --dads-page-navigation-control-padding-x: var(--page-navigation-padding-x-outlined);
    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-outlined);
  }

  :host([type="arrow"]) {
    --dads-page-navigation-control-border-width: var(--page-navigation-border-width-arrow);
    --dads-page-navigation-control-border-color: var(--page-navigation-color);
    --dads-page-navigation-control-border-radius: var(--page-navigation-border-radius-full);
    --dads-page-navigation-control-padding-x: 0px;
    --dads-page-navigation-control-padding-y: 0px;
    --dads-page-navigation-control-min-width: var(--page-navigation-arrow-size-m);
    --dads-page-navigation-control-min-height: var(--page-navigation-arrow-size-m);
    --dads-page-navigation-control-size: var(--page-navigation-arrow-size-m);
    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-arrow-m);
  }

  :host([type="arrow"][size="l"]) {
    --dads-page-navigation-control-min-width: var(--page-navigation-arrow-size-l);
    --dads-page-navigation-control-min-height: var(--page-navigation-arrow-size-l);
    --dads-page-navigation-control-size: var(--page-navigation-arrow-size-l);
    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-arrow-l);
  }

  :host([type="arrow"][size="s"]) {
    --dads-page-navigation-control-min-width: var(--page-navigation-arrow-size-s);
    --dads-page-navigation-control-min-height: var(--page-navigation-arrow-size-s);
    --dads-page-navigation-control-size: var(--page-navigation-arrow-size-s);
    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-arrow-s);
  }

  :host([type="arrow"][size="xs"]) {
    --dads-page-navigation-control-min-width: var(--page-navigation-arrow-size-xs);
    --dads-page-navigation-control-min-height: var(--page-navigation-arrow-size-xs);
    --dads-page-navigation-control-size: var(--page-navigation-arrow-size-xs);
    --dads-page-navigation-icon-size: var(--page-navigation-icon-size-arrow-xs);
  }
`;

/**
 * 個別エクスポート（必要時の参照用）
 */
export const pageNavigationSemanticTokens = css`${pageNavigationSemanticTokensText}`;
export const pageNavigationLocalTokens = css`${pageNavigationLocalTokensText}`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const pageNavigationTokens = css`
  ${pageNavigationSemanticTokensText}
  ${pageNavigationLocalTokensText}
`;
