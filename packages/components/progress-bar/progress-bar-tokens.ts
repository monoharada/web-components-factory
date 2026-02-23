/**
 * Progress Barコンポーネント用デザイントークン
 *
 * semantic → local 2層構造:
 * 1. semantic: グローバルトークンからの参照（フォールバック付き）
 * 2. local: コンポーネント固有の --dads-progress-bar-* 変数
 */
import { css } from '../../core/web-components.js';

const progressBarSemanticTokensText = `
  :host {
    --progress-bar-track-color: var(--color-primitive-blue-100, #d9e6ff);
    --progress-bar-indicator-color: var(--color-primitive-blue-1200, #000060);
    --progress-bar-label-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --progress-bar-underlay-bg: var(--color-neutral-white, white);
    --progress-bar-underlay-border: var(--color-neutral-solid-gray-500, #7f7f7f);
  }
`;

const progressBarLocalTokensText = `
  :host {
    --dads-progress-bar-track-color: var(--progress-bar-track-color);
    --dads-progress-bar-indicator-color: var(--progress-bar-indicator-color);
    --dads-progress-bar-label-color: var(--progress-bar-label-color);
    --dads-progress-bar-underlay-bg: var(--progress-bar-underlay-bg);
    --dads-progress-bar-underlay-border: var(--progress-bar-underlay-border);
  }
`;

export const progressBarTokens = css`${progressBarSemanticTokensText}${progressBarLocalTokensText}`;
