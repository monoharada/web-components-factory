/**
 * モバイルモック用デザイントークン
 */

import { css } from '../../core/web-components.js';

const mobileMockSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    --mobile-mock-frame-width: calc(402 / 16 * 1rem);
    --mobile-mock-aspect-ratio: 402 / 856;
    --mobile-mock-screen-inset: calc(6 / 16 * 1rem);
    --mobile-mock-screen-radius: calc(24 / 16 * 1rem);
    --mobile-mock-safe-area-top: calc(44 / 16 * 1rem);
    --mobile-mock-screen-background: #f5f5f5;

    --mobile-mock-frame-stroke-width: 6;
    --mobile-mock-frame-stroke-color: #000;
    --mobile-mock-frame-corner-radius: 27;
  }
`;

const mobileMockLocalTokensText = `
  :host {
    /* ========== ローカルトークン（公開API） ========== */
    --dads-mobile-mock-frame-width: var(--mobile-mock-frame-width);
    --dads-mobile-mock-aspect-ratio: var(--mobile-mock-aspect-ratio);
    --dads-mobile-mock-screen-inset: var(--mobile-mock-screen-inset);
    --dads-mobile-mock-screen-radius: var(--mobile-mock-screen-radius);
    --dads-mobile-mock-safe-area-top: var(--mobile-mock-safe-area-top);
    --dads-mobile-mock-screen-background: var(--mobile-mock-screen-background);

    --dads-mobile-mock-frame-stroke-width: var(--mobile-mock-frame-stroke-width);
    --dads-mobile-mock-frame-stroke-color: var(--mobile-mock-frame-stroke-color);
    --dads-mobile-mock-frame-corner-radius: var(--mobile-mock-frame-corner-radius);
  }
`;

export const mobileMockSemanticTokens = css`${mobileMockSemanticTokensText}`;
export const mobileMockLocalTokens = css`${mobileMockLocalTokensText}`;

export const mobileMockTokens = css`
  ${mobileMockSemanticTokensText}
  ${mobileMockLocalTokensText}
`;
