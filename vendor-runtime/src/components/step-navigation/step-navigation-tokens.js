/**
 * Step Navigation tokens (semantic + local override API)
 * DADS HTML版 step-navigation.css をベースに Web Components 向けに整理
 */
import { css } from '../../core/web-components.js';
/**
 * セマンティックトークン（意味層）
 * - DADSのプリミティブ/セマンティックトークンを参照して定義する
 */
const stepNavigationSemanticTokensText = `
  :host {
    /* ========== Color ========== */
    --step-navigation-color: var(--color-neutral-solid-gray-800, #333333);
    --step-navigation-number-bg: var(--color-neutral-white, #ffffff);
    --step-navigation-completed-number-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --step-navigation-reached-number-bg: var(--color-neutral-solid-gray-800, #333333);
    --step-navigation-reached-number-color: var(--color-neutral-white, #ffffff);
    --step-navigation-error-color: var(--color-semantic-error-1, var(--color-primitive-red-800, #ec0000));

    --step-navigation-connector-color: currentColor;

    /* State icon colors */
    --step-navigation-completed-icon-circle: var(--color-neutral-solid-gray-600, #666666);
    --step-navigation-completed-icon-check: var(--color-neutral-white, #ffffff);
    --step-navigation-editing-icon-color: var(--color-neutral-solid-gray-800, #333333);
    --step-navigation-error-icon-color: var(--color-semantic-error-1, var(--color-primitive-red-800, #ec0000));
    --step-navigation-state-badge-bg: var(--color-neutral-white, #ffffff);

    /* Focus (DADS公式の見た目: black outline + yellow ring) */
    --step-navigation-focus-outline-color: var(--color-neutral-black, #000000);
    --step-navigation-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);

    /* ========== Layout ========== */
    --step-navigation-step-width: calc(320 / 16 * 1rem);
    --step-navigation-step-min-width: calc(160 / 16 * 1rem);
  }
`;
/**
 * ローカルトークン（コンポーネントAPI）
 * - 外部から上書きしてカスタマイズ可能
 *
 * NOTE:
 * - このローカルトークンは主に `dads-step-navigation` に適用し、
 *   子要素（item）へ継承させて利用する想定。
 */
const stepNavigationLocalTokensText = `
  :host {
    /* ========== Public override API ========== */
    --dads-step-navigation-color: var(--step-navigation-color);

    --dads-step-navigation-number-bg: var(--step-navigation-number-bg);
    --dads-step-navigation-completed-number-bg: var(--step-navigation-completed-number-bg);
    --dads-step-navigation-reached-number-bg: var(--step-navigation-reached-number-bg);
    --dads-step-navigation-reached-number-color: var(--step-navigation-reached-number-color);
    --dads-step-navigation-error-color: var(--step-navigation-error-color);

    --dads-step-navigation-connector-color: var(--step-navigation-connector-color);

    --dads-step-navigation-completed-icon-circle: var(--step-navigation-completed-icon-circle);
    --dads-step-navigation-completed-icon-check: var(--step-navigation-completed-icon-check);
    --dads-step-navigation-editing-icon-color: var(--step-navigation-editing-icon-color);
    --dads-step-navigation-error-icon-color: var(--step-navigation-error-icon-color);
    --dads-step-navigation-state-badge-bg: var(--step-navigation-state-badge-bg);

    --dads-step-navigation-focus-outline-color: var(--step-navigation-focus-outline-color);
    --dads-step-navigation-focus-ring-color: var(--step-navigation-focus-ring-color);

    --dads-step-navigation-step-width: var(--step-navigation-step-width);
    --dads-step-navigation-step-min-width: var(--step-navigation-step-min-width);
  }
`;
export const stepNavigationSemanticTokens = css `${stepNavigationSemanticTokensText}`;
export const stepNavigationLocalTokens = css `${stepNavigationLocalTokensText}`;
export const stepNavigationTokens = css `
  ${stepNavigationSemanticTokensText}
  ${stepNavigationLocalTokensText}
`;
