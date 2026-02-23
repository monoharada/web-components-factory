/**
 * LoadingIconコンポーネント用デザイントークン
 *
 * semantic → local 2層構造:
 * 1. semantic: グローバルトークンからの参照（フォールバック付き）
 * 2. local: コンポーネント固有の --dads-loading-icon-* 変数
 */
import { css } from '../../core/web-components.js';
const loadingIconSemanticTokensText = `
  :host {
    --loading-icon-color: var(--color-primitive-blue-1200, #000060);
    --loading-icon-label-color: var(--color-neutral-solid-gray-900, #1a1a1a);
    --loading-icon-underlay-bg: var(--color-neutral-white, white);
    --loading-icon-underlay-border: var(--color-neutral-solid-gray-500, #7f7f7f);
  }
`;
const loadingIconLocalTokensText = `
  :host {
    --dads-loading-icon-color: var(--loading-icon-color);
    --dads-loading-icon-label-color: var(--loading-icon-label-color);
    --dads-loading-icon-underlay-bg: var(--loading-icon-underlay-bg);
    --dads-loading-icon-underlay-border: var(--loading-icon-underlay-border);
  }
`;
export const loadingIconTokens = css `${loadingIconSemanticTokensText}${loadingIconLocalTokensText}`;
