/**
 * Radioコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * Primitive（applyDADSTokens/applySpacingTokens） → Semantic → Local の3層構造
 */
import { css } from '../../core/web-components.js';

/**
 * Radioセマンティックトークン
 * 意味的な役割に基づいた命名
 */
const radioSemanticTokensText = `
  :host {
    /* ========== レイアウト / サイズ ========== */
    --radio-gap-sm: var(--spacing-1);
    --radio-gap-md: var(--spacing-2);
    --radio-gap-lg: var(--spacing-3);

    --radio-target-size-sm: var(--spacing-6);
    --radio-target-size-md: var(--spacing-8);

    /* A11y: タップ領域は最低44pxを担保（spacing-factor等で縮小しても下回らない） */
    --radio-target-size-lg: max(var(--spacing-11), calc(var(--spacing-scale-11) * 1px));

    --radio-outer-size-sm: var(--spacing-5);
    --radio-outer-size-md: calc(var(--spacing-6) + var(--spacing-0-5));
    --radio-outer-size-lg: var(--spacing-9);

    --radio-inner-size-sm: var(--spacing-2-5);
    --radio-inner-size-md: var(--spacing-3);
    --radio-inner-size-lg: var(--spacing-4);

    --radio-border-width-sm: var(--spacing-0-5);
    --radio-border-width-md: var(--spacing-0-5);
    --radio-border-width-lg: calc(var(--spacing-0-5) + (var(--spacing-0-5) / 2));

    --radio-label-padding-top-sm: calc(var(--spacing-0-5) / 2);
    --radio-label-padding-top-md: var(--spacing-1);
    --radio-label-padding-top-lg: var(--spacing-2-5);

    --radio-label-font-size-sm: var(--font-size-16);
    --radio-label-font-size-md: var(--font-size-16);
    --radio-label-font-size-lg: var(--font-size-17);

    --radio-base-padding-block: var(--spacing-2);
    --radio-error-text-margin-block-start: var(--spacing-1);
    --radio-requirement-margin: var(--spacing-1);

    /* ========== カラー / タイポグラフィ ========== */
    --radio-hover-bg: var(--color-neutral-solid-gray-420);

    --radio-input-base-color: var(--color-neutral-white);
    --radio-input-accent-color: var(--color-primitive-blue-900);
    --radio-input-accent-hover-color: var(--color-primitive-blue-1100);
    --radio-input-border-color: var(--color-neutral-solid-gray-600);
    --radio-input-border-hover-color: var(--color-neutral-black);

    --radio-input-error-accent-color: var(--color-semantic-error-1);
    --radio-input-error-accent-hover-color: var(--color-primitive-red-1000);
    --radio-input-error-border-color: var(--color-semantic-error-1);
    --radio-input-error-border-hover-color: var(--color-primitive-red-1000);

    --radio-input-disabled-base-color: var(--color-neutral-solid-gray-50);
    --radio-input-disabled-accent-color: var(--color-neutral-solid-gray-300);
    --radio-input-disabled-accent-hover-color: var(--color-neutral-solid-gray-300);
    --radio-input-disabled-border-color: var(--color-neutral-solid-gray-300);
    --radio-input-disabled-border-hover-color: var(--color-neutral-solid-gray-300);

    --radio-label-color: var(--color-neutral-solid-gray-800);
    --radio-requirement-color: var(--color-semantic-error-1);
    --radio-error-text-color: var(--color-semantic-error-1);

    --radio-font-family: var(--font-family-sans);
    --radio-font-weight: var(--font-weight-400);
    --radio-label-line-height: var(--line-height-130);
    --radio-error-text-font-size: var(--font-size-14);
    --radio-error-text-line-height: var(--line-height-150);

    /* フォーカス（DADS準拠: 黄色リング + 黒アウトライン） */
    --radio-focus-outline-color: var(--color-neutral-black);
    --radio-focus-outline-width: var(--spacing-1);
    --radio-focus-outline-offset: var(--spacing-0-5);
    --radio-focus-ring-color: var(--color-primitive-yellow-300);
    --radio-focus-ring-width: var(--spacing-0-5);
  }
`;

/**
 * Radioローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数（外部から上書き可能）
 */
const radioLocalTokensText = `
  :host {
    /* ========== レイアウト / サイズ ========== */
    --dads-radio-gap: var(--radio-gap-sm);
    --dads-radio-target-size: var(--radio-target-size-sm);
    --dads-radio-outer-size: var(--radio-outer-size-sm);
    --dads-radio-inner-size: var(--radio-inner-size-sm);
    --dads-radio-border-width: var(--radio-border-width-sm);
    --dads-radio-label-padding-top: var(--radio-label-padding-top-sm);
    --dads-radio-label-font-size: var(--radio-label-font-size-sm);

    --dads-radio-base-padding-block: var(--radio-base-padding-block);
    --dads-radio-error-text-margin-block-start: var(--radio-error-text-margin-block-start);
    --dads-radio-requirement-margin: var(--radio-requirement-margin);

    /* ========== カラー / タイポグラフィ ========== */
    --dads-radio-hover-bg: transparent;
    --dads-radio-hover-bg-hover: var(--radio-hover-bg);

    --dads-radio-input-base-color: var(--radio-input-base-color);
    --dads-radio-input-accent-color: var(--radio-input-accent-color);
    --dads-radio-input-accent-hover-color: var(--radio-input-accent-hover-color);
    --dads-radio-input-border-color: var(--radio-input-border-color);
    --dads-radio-input-border-hover-color: var(--radio-input-border-hover-color);

    --dads-radio-input-error-accent-color: var(--radio-input-error-accent-color);
    --dads-radio-input-error-accent-hover-color: var(--radio-input-error-accent-hover-color);
    --dads-radio-input-error-border-color: var(--radio-input-error-border-color);
    --dads-radio-input-error-border-hover-color: var(--radio-input-error-border-hover-color);

    --dads-radio-input-disabled-base-color: var(--radio-input-disabled-base-color);
    --dads-radio-input-disabled-accent-color: var(--radio-input-disabled-accent-color);
    --dads-radio-input-disabled-accent-hover-color: var(--radio-input-disabled-accent-hover-color);
    --dads-radio-input-disabled-border-color: var(--radio-input-disabled-border-color);
    --dads-radio-input-disabled-border-hover-color: var(--radio-input-disabled-border-hover-color);

    --dads-radio-label-color: var(--radio-label-color);
    --dads-radio-requirement-color: var(--radio-requirement-color);
    --dads-radio-error-text-color: var(--radio-error-text-color);

    --dads-radio-font-family: var(--radio-font-family);
    --dads-radio-font-weight: var(--radio-font-weight);
    --dads-radio-label-line-height: var(--radio-label-line-height);
    --dads-radio-error-text-font-size: var(--radio-error-text-font-size);
    --dads-radio-error-text-line-height: var(--radio-error-text-line-height);

    --dads-radio-focus-outline-color: var(--radio-focus-outline-color);
    --dads-radio-focus-outline-width: var(--radio-focus-outline-width);
    --dads-radio-focus-outline-offset: var(--radio-focus-outline-offset);
    --dads-radio-focus-ring-color: var(--radio-focus-ring-color);
    --dads-radio-focus-ring-width: var(--radio-focus-ring-width);
  }

  :host([size="md"]) {
    --dads-radio-gap: var(--radio-gap-md);
    --dads-radio-target-size: var(--radio-target-size-md);
    --dads-radio-outer-size: var(--radio-outer-size-md);
    --dads-radio-inner-size: var(--radio-inner-size-md);
    --dads-radio-border-width: var(--radio-border-width-md);
    --dads-radio-label-padding-top: var(--radio-label-padding-top-md);
    --dads-radio-label-font-size: var(--radio-label-font-size-md);
  }

  :host([size="lg"]) {
    --dads-radio-gap: var(--radio-gap-lg);
    --dads-radio-target-size: var(--radio-target-size-lg);
    --dads-radio-outer-size: var(--radio-outer-size-lg);
    --dads-radio-inner-size: var(--radio-inner-size-lg);
    --dads-radio-border-width: var(--radio-border-width-lg);
    --dads-radio-label-padding-top: var(--radio-label-padding-top-lg);
    --dads-radio-label-font-size: var(--radio-label-font-size-lg);
  }
`;

/**
 * 個別エクスポート（後方互換性のため）
 */
export const radioSemanticTokens = css`${radioSemanticTokensText}`;
export const radioLocalTokens = css`${radioLocalTokensText}`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const radioTokens = css`
  ${radioSemanticTokensText}
  ${radioLocalTokensText}
`;
