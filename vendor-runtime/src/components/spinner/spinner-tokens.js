/**
 * Spinnerコンポーネント用デザイントークン
 *
 * semantic → local 2層構造:
 * 1. semantic: グローバルトークンからの参照（フォールバック付き）
 * 2. local: コンポーネント固有の --dads-spinner-* 変数
 */
import { css } from '../../core/web-components.js';
const spinnerSemanticTokensText = `
  :host {
    --spinner-track-color: var(--color-primitive-blue-100, #d9e6ff);
    --spinner-indicator-color: var(--color-primitive-blue-1200, #000060);
    --spinner-label-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --spinner-underlay-bg: var(--color-neutral-white, white);
    --spinner-underlay-border: var(--color-neutral-solid-gray-500, #7f7f7f);
    --spinner-rotate-duration: 2.4s;
    --spinner-dash-duration: 1.8s;
  }
`;
const spinnerLocalTokensText = `
  :host {
    --dads-spinner-track-color: var(--spinner-track-color);
    --dads-spinner-indicator-color: var(--spinner-indicator-color);
    --dads-spinner-label-color: var(--spinner-label-color);
    --dads-spinner-underlay-bg: var(--spinner-underlay-bg);
    --dads-spinner-underlay-border: var(--spinner-underlay-border);
    --dads-spinner-rotate-duration: var(--spinner-rotate-duration);
    --dads-spinner-dash-duration: var(--spinner-dash-duration);
  }
`;
export const spinnerTokens = css `${spinnerSemanticTokensText}${spinnerLocalTokensText}`;
