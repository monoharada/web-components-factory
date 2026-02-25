/**
 * Tab tokens (semantic + local override API)
 * DADS デザインシステム準拠のタブコンポーネント用トークン
 */
import { css } from '../../core/web-components.js';

/**
 * セマンティックトークン（意味層）
 * - DADSのプリミティブ/セマンティックトークンを参照して定義する
 */
const tabSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --tab-bg-default: var(--color-neutral-white, #ffffff);
    --tab-bg-hover: var(--color-neutral-solid-gray-50, #f2f2f2);
    --tab-bg-panel: var(--color-neutral-white, #ffffff);
    --tab-border-default: var(--color-neutral-solid-gray-420, #949494);
    --tab-indicator-idle: var(--color-neutral-solid-gray-50, #f2f2f2);
    --tab-border-active: var(--color-primitive-blue-1000, #00118f);
    --tab-text-default: var(--color-neutral-solid-gray-900, #1a1a1a);
    --tab-text-selected: var(--color-neutral-solid-gray-900, #1a1a1a);
    --tab-text-disabled: var(--color-neutral-solid-gray-420, #949494);
    --tab-panel-color: var(--color-neutral-solid-gray-800, #333333);

    /* Focus */
    --tab-focus-outline-color: var(--color-neutral-black, #000000);
    --tab-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);

    /* ========== Layout ========== */
    --tab-indicator-thickness: calc(6 / 16 * 1rem);
    --tab-padding-y: var(--spacing-4, 1rem);
    --tab-padding-x: var(--spacing-2, 0.5rem);
    --tab-label-gap-horizontal: var(--spacing-1, 0.25rem);
    --tab-label-gap-vertical: calc(3 / 16 * 1rem);
    --tab-underline-offset: calc(3 / 16 * 1rem);
    --tab-underline-thickness: calc(1 / 16 * 1rem);
    --tab-panel-padding: var(--spacing-4, 1rem);
    --tab-panel-font-size: var(--font-size-16, 1rem);
    --tab-panel-font-weight: var(--font-weight-400, 400);
    --tab-panel-line-height: var(--line-height-170, 1.7);
    --tab-panel-letter-spacing: calc(2 / 100 * 1em);
    --tab-vertical-list-width: calc(102 / 16 * 1rem);
  }
`;

/**
 * ローカルトークン（コンポーネントAPI）
 * - 外部から上書きしてカスタマイズ可能
 */
const tabLocalTokensText = `
  :host {
    /* ========== Public override API ========== */
    --dads-tab-background: var(--tab-bg-default);
    --dads-tab-background-hover: var(--tab-bg-hover);
    --dads-tab-color: var(--tab-text-default);
    --dads-tab-color-selected: var(--tab-text-selected);
    --dads-tab-color-disabled: var(--tab-text-disabled);
    --dads-tab-border-color: var(--tab-border-default);
    --dads-tab-indicator-color: var(--tab-border-active);
    --dads-tab-indicator-height: var(--tab-indicator-thickness);
    --dads-tab-focus-outline-color: var(--tab-focus-outline-color);
    --dads-tab-focus-ring-color: var(--tab-focus-ring-color);
  }
`;

export const tabSemanticTokens = css`${tabSemanticTokensText}`;
export const tabLocalTokens = css`${tabLocalTokensText}`;

export const tabTokens = css`
  ${tabSemanticTokensText}
  ${tabLocalTokensText}
`;
